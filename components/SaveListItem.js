export default props => {
  return (
    <div className='list-item'
      onClick={() => props.loadSavedMap(props.saveName)}>
      <img src={`${props.imageName}${props.imageExt}`} height='30px' />
      <div className='item-desc'>
        <strong>{props.saveName.substring(0,props.saveName.length-13)}</strong> <br/>
        Number of points: {props.numOfPoints}
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
