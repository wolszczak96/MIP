const express = require('express')
const next = require('next')
const glob = require('glob')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.resolve('map-images')
    cb(null, dest)
  },
  filename: (req, file, cb) => {
    req.body.dateNow = Date.now()
    cb(null, `${req.body.imageId}${req.body.dateNow}${path.extname(file.originalname).toLowerCase()}`)
  }
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!/image\/.+/.test(file.mimetype)) {
      return cb(new Error('Only image files are allowed!'))
    }
    cb(null, true)
  }
})

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
.then(() => {
  const server = express()

  server.use(express.static('map-images'))

  server.get('/map-images-data', (req, res) => {
    glob('map-images-data/*.json', (er, files) => {
      const imagesData = {}
      for (let i=0; i<files.length; i++) {
        fs.readFile(files[i], (err, data) => {
          const key = files[i].substring(16, files[i].length-5)
          imagesData[key] = JSON.parse(data)
          if (i === files.length-1) {
            res.status(200).send(JSON.stringify(imagesData))
          }
        })
      }
    })
  })

  server.get('/saves', (req, res) => {
    glob('saves/*.json', (er, files) => {
      if(files.length === 0) {
        res.status(200).send(JSON.stringify({}))
      }
      else {
        const savesData = {}
        for (let i=0; i<files.length; i++) {
          fs.readFile(files[i], (err, data) => {
            const key = files[i].substring(6, files[i].length-5)
            savesData[key] = JSON.parse(data)
            if (i === files.length-1) {
              res.status(200).send(JSON.stringify(savesData))
            }
          })
        }
      }
    })
  })

  server.post('/upload-map-image', upload.single('mapFile'), (req, res) => {
    const newImageData = {
      fileExt: `${path.extname(req.file.originalname).toLowerCase()}`,
      mapWidthKM: req.body.mapWidthKM,
      mapHeightKM: req.body.mapHeightKM
    }
    fs.writeFile(`map-images-data/${req.body.imageId}${req.body.dateNow}.json`, JSON.stringify(newImageData), 'utf8', err => {
      if (err) res.status(500)
      else res.status(200).send(`${req.body.imageId}${req.body.dateNow}`)
    })
  })

  server.post('/save-map', upload.single(), (req, res) => {
    const data = JSON.parse(req.body.saveData)
    const saveName = data.overwrite ? data.saveName : `${data.saveName}${Date.now()}`
    const saveData = {
      imageName: data.imageName,
      editMode: data.editMode,
      mapPointsData: data.mapPointsData
    }
    if (data.overwrite) {
      fs.unlink(`saves/${saveName}.json`, err => {
        if (err) res.status(500)
        else fs.writeFile(`saves/${saveName}.json`, JSON.stringify(saveData), 'utf8', err => {
          if (err) res.status(500)
          else res.status(200).send(saveName)
        })
      })
    }
    else fs.writeFile(`saves/${saveName}.json`, JSON.stringify(saveData), 'utf8', err => {
      if (err) res.status(500)
      else res.status(200).send(saveName)
    })
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
