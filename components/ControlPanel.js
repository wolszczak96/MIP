import React from 'react'

export default class ControlPanel extends React.Component {
  constructor(props) {
    super(props)
  }

  showMenu = () => {
    this.props.setAppState({
      menuOpen: true
    })
  }

  editPoint = () => {
    this.props.setAppState({
      editing: this.props.expanded
    })
  }

  saveChanges = () => {
    this.props.setAppState({
      editing: null
    })
  }

  closeInfo = () => {
    this.props.setAppState({
      editing: null,
      expanded: null
    })
  }

  changeDesc = event => {
    this.props.changeData({
      detailDesc: event.target.value
    })
  }

  render() {
    const expanded = this.props.expanded !== null
    const editing = this.props.editing !== null

    return (
      <div className='control-panel'
        style={{width:this.props.width}}>
        <div className='menu-button'
          onClick={this.showMenu}>menu</div>
        {this.props.editMode ? (
          <div className='button'
            onClick={this.props.newMapPoint}
            style={{cursor:this.props.cursor ? this.props.cursor : 'pointer'}}>

            New Point
          </div>) : null}

        <br/>

        <div style={!expanded ? {display:'none'} : null}>
          <div className='close-button'
            onClick={this.closeInfo}>X</div>

          <div className='description'
            style={!expanded ? {display: 'none'} : null}>

            <h4>{expanded ? this.props.pointData.pointName : null}</h4>

            {editing ? (
              <textarea value={this.props.pointData.detailDesc}
                onChange={this.changeDesc} />) :
            expanded ? this.props.pointData.detailDesc : null}
          </div>

          {this.props.editMode ? (
            <div>
              <div className='button'
                onClick={editing ? this.saveChanges : this.editPoint}
                style={{cursor:'pointer', float:'right'}}>

                {editing ? 'Save' : 'Edit'}
              </div>
              {editing ?
                <div className='button'
                  onClick={this.props.deletePoint}
                  style={{cursor:'pointer', float:'right'}}>

                  Delete point
                </div> : null }
            </div>) : null}
        </div>
        <style jsx>{`
          .control-panel {
            float: right;
            clear: none;
            background-color: lightgrey;
            padding: 20px;
            min-height: 500px;
          }

          .menu-button {
            position: absolute;
            top: 0;
            right: 0;
            text-align: center;
            width: 40px;
            height: 15px;
            line-height: 15px;
            font-size: 15px;
            font-family: sans-serif;
            background-color: pink;
            cursor: pointer;
          }

          .menu-button:hover {
            background-color: skyblue;
          }

          .button {
            text-align: center;
            width: 80px;
            height: 30px;
            line-height: 30px;
            background-color: skyblue;
          }

          .close-button {
            text-align: center;
            width: 15px;
            height: 15px;
            line-height: 15px;
            font-size: 10px;
            font-family: sans-serif;
            background-color: pink;
            float: right;
            cursor: pointer;
          }

          .description {
            width: 100%;
            background-color: white;
            padding: 10px;
            margin-bottom: 5px;
          }

          h4 {
            margin: 5px;
          }
        `}</style>
      </div>
    )
  }
}
