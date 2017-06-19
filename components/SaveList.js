import SaveListItem from './SaveListItem'

export default props => {
  const listOfElems = []

  for (let key in props.saves) {
    const saveData = props.saves[key]
    const imageName = saveData.imageName
    listOfElems.push(
      <SaveListItem
        key={`list-item-${key}`}
        saveName={key}
        numOfPoints={Object.keys(saveData.mapPointsData).length}
        imageName={imageName}
        imageExt={props.mapImages[imageName].fileExt}
        loadSavedMap={props.loadSavedMap}
      />
    )
  }

  return (
    <div>
      {listOfElems}
    </div>
  )
}
