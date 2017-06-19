import MapList from './MapList'
import SaveList from './SaveList'

export default class MapSettings extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      creating: false,
      newSettings: false,
      saveMenu: false,
      saveConfirm: false,
      saveNameChoice: false,
      saves: null
    }
  }

  componentDidMount() {
    this.refreshSaves()
  }

  dontSave = () => {
    this.setState({
      saveConfirm: false,
      saveNameChoice: false
    })
    this.props.unloadMap()
  }

  saveRequest = () => {
    const unload = this.state.saveConfirm
    if (this.props.saveName === null) this.setState({
      saveNameChoice: true
    })
    else this.props.saveAllChanges(unload)
    if (unload) this.setState({
      saveConfirm: false
    })
  }

  sendNewSave = () => {
    const unload = this.state.saveConfirm
    const saveName = document.getElementById('save-name-input').value
    if (!/^[A-Za-z]\w{2,25}$/.test(saveName)) alert('wrong name!')
    else {
      this.props.saveAllChanges(unload, saveName)
      this.setState({
        saveConfirm: false,
        saveNameChoice: false
      })
      this.refreshSaves()
    }
  }

  refreshSaves = () => {
    const http = new XMLHttpRequest()
    http.onreadystatechange = () => {
      if (http.readyState === 4 && http.status === 200) {
        this.setState({
          saves: JSON.parse(http.responseText)
        })
      }
    }
    http.open('GET', 'saves', true)
    http.send()
  }

  goBack = () => {
    const newState = this.state.saveNameChoice ? {
      saveNameChoice: false,
      saveConfirm: false
    } :
    this.state.saveConfirm ? {
      saveConfirm: false
    } :
    this.state.saveMenu ? {
      saveMenu: false
    } :
    this.state.newSettings ? {
      newSettings: false
    } :
    {
      creating: false
    }
    this.setState(newState)
  }

  closeMenu = () => {
    this.props.setAppState({
      menuOpen: false
    })
  }

  mainMenu = () => {
    if (Object.keys(this.props.mapPointsData).length === 0 || this.props.saveName !== null && JSON.stringify(this.props.saveData) === JSON.stringify(this.state.saves[this.props.saveName])) {
      this.props.unloadMap()
    }
    else {
      this.setState({
        saveConfirm: true
      })
    }
  }

  openSaveMenu = () => {
    this.refreshSaves()
    this.setState({
      saveMenu: true
    })
  }

  loadSavedMap = saveName => {
    const saveData = this.state.saves[saveName]
    this.props.loadEmptyMap(saveData.imageName)
    this.props.setAppState({
      editMode: saveData.editMode,
      mapPointsData: saveData.mapPointsData,
      saveName: saveName,
      saveData: saveData
    })
  }

  newMap = () => {
    this.setState({
      creating: true
    })
  }

  newMapImage = () => {
    this.setState({
      newSettings: true
    })
  }

  submitSettings = () => {
    const imageId = document.getElementById('name-input').value
    const mapImageFile = document.getElementById('image-input').files[0]
    const mapWidth = document.getElementById('width-input').value
    const invalid = []
    if (!/^[A-Za-z]\w{2,25}$/.test(imageId)) invalid.push('name-input')
    if (!(mapImageFile && /image\/.+/.test(mapImageFile.type))) invalid.push('image-input')
    if (mapWidth < 1) invalid.push('width-input')
    if (invalid.length === 0) {
      const reader = new FileReader()
      reader.readAsDataURL(mapImageFile)
      reader.onload = () => {
        const img = new Image()
        img.src = reader.result
        img.onload = () => {
          const mapHeight = mapWidth/img.width * img.height
          const form = new FormData()
          form.append('imageId', imageId)
          form.append('mapFile', mapImageFile)
          form.append('mapWidthKM', mapWidth)
          form.append('mapHeightKM', mapHeight)
          const http = new XMLHttpRequest()
          http.onreadystatechange = () => {
            if (http.readyState === 4 && http.status === 200) {
              this.props.refreshMapImages(http.responseText)
            }
          }
          http.open('POST', 'upload-map-image', true)
          http.send(form)
        }
      }
    }
    else {
      for (let elem in invalid) {
        alert(`${invalid[elem]} error!`)
      }
    }
  }

  toggleEditMode = () => {
    const current = this.props.editMode
    this.closeMenu()
    this.props.setAppState({
      editMode: !current,
      editing: current ? null : this.props.editing
    })
  }

  render() {
    return (
      <div className='popup-background'>
        <div className='settings-menu'>
          {this.props.mapLoaded ?
            <div className='close-button'
              onClick={this.closeMenu}>X</div> : null}
          {this.state.saveNameChoice ?
            <div>
              <div className='menu-title'>
                Save Name
              </div>

              <div>
                Choose name for your save:
              </div>

              <input id='save-name-input' type='text' />

              <div className='button'
                onClick={this.sendNewSave}>
                Save
              </div>

              <div className='button'
                onClick={this.goBack}>
                Cancel
              </div>
            </div> :
          this.state.saveConfirm ?
            <div>
              <div className='back-button'
                onClick={this.goBack}>{'<-'} back</div>

                <div className='menu-title'>
                  Unsaved Changes
                </div>

                <div>
                  You've got unsaved changes! Do you want to save them?
                </div>

                <div className='button'
                  onClick={this.dontSave}>
                  No
                </div>

                <div className='button'
                  onClick={this.saveRequest}>
                  Yes
                </div>
            </div> :
          this.state.saveMenu ?
            <div>
              <div className='back-button'
                onClick={this.goBack}>{'<-'} back</div>

              <div className='menu-title'>
                Saved Maps
              </div>
              <SaveList
                mapImages={this.props.mapImages}
                saves={this.state.saves}
                loadSavedMap={this.loadSavedMap}
              />
            </div> :
          this.props.mapLoaded ?
            <div>
              <div className='menu-title'>
                Menu
              </div>

              <div className='menu-button'
                onClick={this.toggleEditMode}>

                Switch to {this.props.editMode ? 'Read' : 'Edit'} mode
              </div>

              <div className='menu-button'
                onClick={this.openSaveMenu}>

                Load saved map
              </div>

              <div className='menu-button'
                onClick={this.saveRequest}>

                Save
              </div>

              <div className='menu-button'
                onClick={this.mainMenu}>

                Back to Main Menu
              </div>
            </div> :
          this.state.newSettings ?
            <div>
              <div className='back-button'
                onClick={this.goBack}>{'<-'} back</div>

              <div className='menu-title'>
                Load new map image
              </div>
              Map name: <input id='name-input' type='text' /><br/>
              Map image: <input id='image-input' type='file' /><br/>
              Map area width in km: <input id='width-input' defaultValue='1.00000' type='number' step={0.00001} /><br/>
              <div className='button'
                onClick={this.submitSettings}>
                Load
              </div>
            </div> :
          this.state.creating ?
            <div>
              <div className='back-button'
                onClick={this.goBack}>{'<-'} back</div>

              <div className='menu-title'>
                Choose map:
              </div>
              <MapList
                mapImages={this.props.mapImages}
                loadEmptyMap={this.props.loadEmptyMap}
              />
              Or:
              <div className='menu-button'
                onClick={this.newMapImage}>

                Load new map image
              </div>
            </div> :
            <div>
              <div className='menu-title'>
                Main Menu
              </div>

              <div className='menu-button'
                onClick={this.newMap}>

                Create new map
              </div>

              <div className='menu-button'
                onClick={this.openSaveMenu}>

                Load saved map
              </div>

              {/* <div className='menu-button'
                onClick={this.aboutMe}>

                About author
              </div> */}
            </div>}
        </div>
        <style jsx>{`
          .popup-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 2;
          }

          .settings-menu {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            margin: auto;
            padding: 10px;
            width: 350px;
            height: 500px;
            background-color: #D64;
          }

          .menu-title {
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            margin: 10px;
          }

          .close-button {
            position: absolute;
            top: 0;
            right: 0;
            text-align: center;
            width: 15px;
            height: 15px;
            line-height: 15px;
            font-size: 10px;
            font-family: sans-serif;
            background-color: pink;
            cursor: pointer;
          }

          .close-button:hover {
            background-color: skyblue;
          }

          .back-button {
            position: absolute;
            top: 0;
            right: 0;
            text-align: center;
            width: 50px;
            height: 20px;
            line-height: 20px;
            font-size: 13px;
            font-family: sans-serif;
            background-color: pink;
            cursor: pointer;
          }

          .back-button:hover {
            background-color: skyblue;
          }

          .menu-button {
            width: 100%;
            height: 40px;
            background-color: skyblue;
            margin-bottom: 5px;
            line-height: 40px;
            text-align: center;
            cursor: pointer;
          }

          .menu-button:hover {
            background-color: palegreen;
          }

          .button {
            text-align: center;
            width: 80px;
            height: 30px;
            line-height: 30px;
            background-color: skyblue;
            cursor: pointer;
          }

          .button:hover {
            background-color: palegreen;
          }
        `}</style>
      </div>
    )
  }
}
