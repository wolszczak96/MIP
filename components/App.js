import React from 'react'
import path from 'path'
import Map from './Map'
import ControlPanel from './ControlPanel'
import SettingsMenu from './SettingsMenu'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      imageName: null,
      mapImages: {},
      mapLoaded: false,
      menuOpen: true,
      editMode: true,
      mapWidthKM: null,
      mapHeightKM: null,
      minScale: 20,
      maxScale: 1000,
      scale: 0,
      left: 0,
      top: 0,
      waiting: false,
      expanded: null,
      editing: null,
      mapPointsData: {},
      savedData: {},
      saveName: null
    }
  }

  componentDidMount() {
    this.refreshMapImages()
  }

  componentDidUpdate() {
    if (this.state.mapLoaded) {
      window.addEventListener('resize', this.setComponentsSize)
    }
  }

  refreshMapImages = mapToLoad => {
    const http = new XMLHttpRequest()
    http.onreadystatechange = () => {
      if (http.readyState === 4 && http.status === 200) {
        this.setState({
          mapImages: JSON.parse(http.responseText)
        })
        if (mapToLoad) this.loadEmptyMap(mapToLoad)
      }
    }
    http.open('GET', 'map-images-data', true)
    http.send()
  }

  loadEmptyMap = mapName => {
    const imageData = this.state.mapImages[mapName]
    this.setState({
      imageName: mapName,
      imageExt: imageData.fileExt,
      mapWidthKM: imageData.mapWidthKM,
      mapHeightKM: imageData.mapHeightKM,
      mapLoaded: true,
      menuOpen: false
    })
  }

  setComponentsSize = () => {
    const currentScale = this.state.scale
    const currentLeft = this.state.left
    const currentTop = this.state.top
    const mapWidthKM = this.state.mapWidthKM
    const mapHeightKM = this.state.mapHeightKM
    const mapComponentWidth = window.innerWidth-300
    const mapComponentHeight = window.innerHeight
    const minScale = mapComponentWidth/mapComponentHeight > mapWidthKM/mapHeightKM ? mapComponentWidth/mapWidthKM : mapComponentHeight/mapHeightKM
    const scale = currentScale > minScale ? currentScale : minScale
    const maxLeft = (mapWidthKM*scale-mapComponentWidth)*-1
    const maxTop = (mapHeightKM*scale-mapComponentHeight)*-1
    const left = currentLeft > 0 ? 0 : currentLeft < maxLeft ? maxLeft : currentLeft
    const top = currentTop > 0 ? 0 : currentTop < maxTop ? maxTop : currentTop
    this.setState({
      minScale: minScale,
      scale: scale,
      left: left,
      top: top,
      mapComponentWidth: mapComponentWidth,
      mapComponentHeight: mapComponentHeight
    })
  }

  setOwnState = state => {
    this.setState(state)
  }

  newMapPoint = () => {
    if (this.state.editing !== null) this.saveChanges()
    this.setState({
      waiting: true,
      expanded: null
    })
  }

  placePoint = event => {
    if (event.clientX < this.state.mapComponentWidth && event.clientY < window.innerHeight) {
      const pointsData = this.state.mapPointsData
      const id = Date.now()
      const xPos = (event.clientX - this.state.left) / this.state.scale
      const yPos = (event.clientY - this.state.top) / this.state.scale
      pointsData[`${id}`] = {
        xPosition: xPos,
        yPosition: yPos,
        pointName: 'Name',
        description: 'Description',
        detailDesc: 'Description in detail'
      }
      this.setState({
        mapPointsData: pointsData,
        editing: id,
        expanded: id
      })
    }
    this.setState({
      waiting: false
    })
  }

  expand = id => {
    this.setState({
      expanded: id
    })
  }

  edit = id => {
    this.setState({
      editing: id
    })
  }

  changeData = data => {
    const id = this.state.editing
    const pointsData = this.state.mapPointsData
    for (let key in data) {
      pointsData[id][key] = data[key]
    }
    this.setState({
      mapPointsData: pointsData
    })
  }

  deletePoint = () => {
    const id = this.state.editing
    const pointsData = this.state.mapPointsData
    delete pointsData[id]
    this.setState({
      mapPointsData: pointsData,
      expanded: null,
      editing: null
    })
  }

  saveChanges = () => {
    this.setState({
      editing: null,
    })
  }

  hide = () => {
    this.setState({
      expanded: null
    })
  }

  saveAllChanges = (unload, newSaveName) => {
    const overwrite = this.state.saveName !== null
    const saveName = this.state.saveName === null ? newSaveName : this.state.saveName
    const pointsData = this.state.mapPointsData
    const newSaveData = {
      overwrite: overwrite,
      saveName: saveName,
      imageName: this.state.imageName,
      editMode: this.state.editMode,
      mapPointsData: pointsData
    }
    const http = new XMLHttpRequest()
    http.onreadystatechange = () => {
      if (http.readyState === 4 && http.status === 200) {
        if (unload) this.unloadMap()
        else {
          this.setState({
            saveData: {
              imageName: this.state.imageName,
              editMode: this.state.editMode,
              mapPointsData: pointsData
            },
            saveName: http.responseText
          })
        }
        alert('Saved!')
      }
    }
    http.open('POST', 'save-map', true)
    const form = new FormData()
    form.append('saveData', JSON.stringify(newSaveData))
    http.send(form)
  }

  unloadMap = () => {
    this.setState({
      imageName: null,
      imageExt: null,
      mapLoaded: false,
      menuOpen: true,
      editMode: true,
      mapWidthKM: null,
      mapHeightKM: null,
      minScale: 20,
      maxScale: 1000,
      scale: 0,
      left: 0,
      top: 0,
      waiting: false,
      expanded: null,
      editing: null,
      mapPointsData: {},
      savedData: {},
      saveName: null
    })
  }

  render() {
    const cursor = this.state.waiting ? 'url(/static/dotred.png) 5 5, default' : null
    const onClick = this.state.waiting ? this.placePoint : null
    return (
      <div className='container'
        style={{cursor: cursor}}
        onClick={onClick}>
        {this.state.mapLoaded ?
          <Map
            width={this.state.mapComponentWidth}
            height={this.state.mapComponentHeight}
            editMode={this.state.editMode}
            imageName={this.state.imageName}
            imageExt={this.state.imageExt}
            setComponentsSize={this.setComponentsSize}
            mapWidthKM={this.state.mapWidthKM}
            mapHeightKM={this.state.mapHeightKM}
            minScale={this.state.minScale}
            maxScale={this.state.maxScale}
            scale={this.state.scale}
            left={this.state.left}
            top={this.state.top}
            expanded={this.state.expanded}
            editing={this.state.editing}
            expand={this.expand}
            hide={this.hide}
            edit={this.edit}
            saveChanges={this.saveChanges}
            setAppState={this.setOwnState}
            mapPointsData={this.state.mapPointsData}
            changeData={this.changeData}
          /> : null}
        {this.state.mapLoaded ?
          <ControlPanel
            settingsMode={this.state.settingsMode}
            editMode={this.state.editMode}
            width={300}
            newMapPoint={this.newMapPoint}
            cursor={cursor}
            expanded={this.state.expanded}
            editing={this.state.editing}
            setAppState={this.setOwnState}
            pointData={this.state.mapPointsData[this.state.expanded]}
            changeData={this.changeData}
            deletePoint={this.deletePoint}
          /> : null}
        {this.state.menuOpen ?
          <SettingsMenu
            editMode={this.state.editMode}
            mapLoaded={this.state.mapLoaded}
            setAppState={this.setOwnState}
            refreshMapImages={this.refreshMapImages}
            loadEmptyMap={this.loadEmptyMap}
            unloadMap={this.unloadMap}
            saveAllChanges={this.saveAllChanges}
            mapImages={this.state.mapImages}
            mapPointsData={this.state.mapPointsData}
            saveData={this.state.saveData}
            saveName={this.state.saveName}
            editing={this.state.editing}
          /> : null}
        <style jsx global>{`
          body {
            margin: 0;
          }

          div {
            box-sizing: border-box;
            user-select: none;
            -moz-user-select: none;
            -webkit-user-select: none;
            -o-user-select: none;
          }

          .container {
            height: 100vh;
            overflow: auto;
          }

          .logo {
            float: left;
            clear: none;
            height: 100%;
            text-align: center;
            line-height: 100vh;
          }

          .svg-map-container > svg {
            width: 100%;
          }
        `}</style>
      </div>
    )
  }
}
