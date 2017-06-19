export default props => {
  return (
    <div className='list-item'
      onClick={() => props.loadEmptyMap(props.imageName)}>
      <img src={`${props.imageName}${props.fileExt}`} height='30px' />
      <div className='item-desc'>
        <strong>{props.imageName.substring(0,props.imageName.length-13)}</strong> <br/>
        Area: {props.mapWidthKM}km x {props.mapHeightKM}km
      </div>
      <style jsx>{`
        .list-item {
          width: 100%;
          height: 30px;
          margin-bottom: 5px;
          background-color: skyblue;
          cursor: pointer;
        }

        .list-item:hover {
          background-color: palegreen;
        }

        .item-desc {
          display: inline-block;
          margin-left: 5px;
          line-height: 15px;
          font-size: 15px;
        }
      `}</style>
    </div>
  )
}
