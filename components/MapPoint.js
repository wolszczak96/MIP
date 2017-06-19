import React from 'react'

export default class MapPoint extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      active: false
    }
  }

  activate = () => {
    this.setState({
      active: true
    })
  }

  deactivate = () => {
    this.setState({
      active: false
    })
  }

  toggleExpand = () => {
    parseInt(this.props.expanded) === parseInt(this.props.id) ? this.props.hide() : this.props.expand(this.props.id)
    if (this.props.editing !== null) this.props.saveChanges()
  }

  changeName = event => {
    this.props.changeData({
      pointName: event.target.value
    })
  }

  changeDesc = event => {
    event.target.focus
    this.props.changeData({
      description: event.target.value
    })
  }

  render() {
    const expanded = parseInt(this.props.expanded) === parseInt(this.props.id)
    const editing = parseInt(this.props.editing) === parseInt(this.props.id)

    return (
      <div className='point-component'
        style={{
          left:`${this.props.pointData.xPosition*this.props.scale-5}px`,
          top:`${this.props.pointData.yPosition*this.props.scale-5}px`,
          zIndex: this.state.active || expanded ? 1 : 0
        }}
        onMouseDown={event => event.stopPropagation()}>

        <div className='map-point'
          onClick={this.toggleExpand}
          onMouseEnter={this.activate}
          onMouseLeave={this.deactivate}
        />

        {editing ?
          <input type='text'
            className='point-name'
            value={this.props.pointData.pointName}
            onChange={this.changeName} /> :
        expanded || this.state.active ? <div className='point-name'>{this.props.pointData.pointName}</div> : null}

        {editing ?
          <textarea className='point-description'
            value={this.props.pointData.description}
            onChange={this.changeDesc} /> :
        expanded ? <div className='point-description'>{this.props.pointData.description}</div> : null}

        <style jsx>{`
          .point-component {
            position: absolute;
            pointer-events: all;
          }

          .map-point {
            width: 10px;
            height: 10px;
            border-radius: 100%;
            background-color: red;
            cursor: pointer;
          }

          .point-name {
            position: absolute;
            top: -20px;
            font-weight: bold;
            line-height: normal;
            white-space: nowrap;
          }

          .point-description {
            position: absolute;
            left: 15px;
            top: 0;
            width: 150px;
            line-height: normal;
            overflow: auto;
            background-color: white;
          }
        `}</style>
      </div>
    )
  }
}
