import MapListItem from './MapListItem'

export default props => {
  const listOfElems = []

  for (let key in props.mapImages) {
    const imageData = props.mapImages[key]
    listOfElems.push(
      <MapListItem
        key={`list-item-${key}`}
        imageName={key}
        fileExt={imageData.fileExt}
        mapWidthKM={(Math.round(imageData.mapWidthKM*1000)/1000).toFixed(3)}
        mapHeightKM={(Math.round(imageData.mapHeightKM*1000)/1000).toFixed(3)}
        loadEmptyMap={props.loadEmptyMap}
      />
    )
  }

  return (
    <div>
      {listOfElems}
    </div>
  )
}
