import React from 'react'
import path from 'path'
//import MapImage from '../svgs/bangladesh.svg'
import Scale from './Scale'
import MapPoint from './MapPoint'

export default class Map extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      moving: false,
      movingX: 0,
      movingY: 0,
      startingX: 0,
      startingY: 0
    }
  }

  componentDidMount() {
    this.props.setComponentsSize()
  }

  startMoving = event => {
    this.setState({
      moving: true,
      movingX: event.clientX,
      movingY: event.clientY,
      startingX: this.props.left,
      startingY: this.props.top
    })
  }

  moveMap = event => {
    if(!this.state.moving) return
    event.preventDefault()
    const maxLeft = (this.props.mapWidthKM*this.props.scale-this.props.width)*-1
    const maxTop = (this.props.mapHeightKM*this.props.scale-this.props.height)*-1
    const left = this.state.startingX + event.clientX - this.state.movingX
    const top = this.state.startingY + event.clientY - this.state.movingY
    const newLeft = left > 0 ? 0 : left < maxLeft ? maxLeft : left
    const newTop = top > 0 ? 0 : top < maxTop ? maxTop : top
    this.props.setAppState({
      left: newLeft,
      top: newTop
    })
  }

  endMoving = event => {
    if(!this.state.moving) return
    event.preventDefault()
    this.setState({
      moving: false
    })
  }

  resizeMap = event => {
    event.preventDefault()
    const posX = event.clientX
    const posY = event.clientY
    const minScale = this.props.minScale
    const maxScale = this.props.maxScale
    const scale = this.props.scale*Math.exp(event.deltaY*-0.003)
    const newScale = scale < minScale ? minScale : scale > maxScale ? maxScale : scale
    const maxLeft = this.props.mapWidthKM*newScale-this.props.width
    const maxTop = this.props.mapHeightKM*newScale-this.props.height
    const left = (posX - this.props.left) * newScale/this.props.scale - posX
    const top = (posY - this.props.top) * newScale/this.props.scale - posY
    const newLeft = left < 0 ? 0 : left > maxLeft ? -maxLeft : -left
    const newTop = top < 0 ? 0 : top > maxTop ? -maxTop : -top
    this.props.setComponentsSize()
    this.props.setAppState({
      scale: newScale,
      left: newLeft,
      top: newTop
    })
  }

  render() {
    const pointsData = this.props.mapPointsData
    const pointsArray = []
    for (let key in pointsData) {
      pointsArray.push(
        <MapPoint
          key={key}
          id={key}
          scale={this.props.scale}
          pointData={pointsData[key]}
          expanded={this.props.expanded}
          editing={this.props.editing}
          expand={this.props.expand}
          hide={this.props.hide}
          edit={this.props.edit}
          saveChanges={this.props.saveChanges}
          changeData={this.props.changeData}
        />
      )
    }
    return (
      <div className='map-container'
        style={{width:`${this.props.width}px`}}
        onWheel={this.resizeMap}
        onMouseDown={this.startMoving}
        onMouseMove={this.moveMap}
        onMouseUp={this.endMoving}
        onMouseLeave={this.endMoving} >
          <div className='map-component' style={{width:`${this.props.mapWidthKM*this.props.scale}px`, left:`${this.props.left}px`, top:`${this.props.top}px`}}>
            <img className='map-image' src={`${this.props.imageName}${this.props.imageExt}`} />
            {pointsArray}
          </div>
        }

        <Scale
          scale={this.props.scale}
        />

        <style jsx>{`
          .map-container {
            overflow: hidden;
            float: left;
            clear: none;
            position: relative;
            height: 100%;
          }

          .map-component {
            position: absolute;
            line-height: 0;
            pointer-events: none;
            user-select: none;
            -moz-user-select: none;
            -webkit-user-select: none;
            -o-user-select: none;
          }

          .map-image {
            width: 100%;
          }

          .map-points {
            position: relative;
          }
        `}</style>
      </div>
    )
  }
}
