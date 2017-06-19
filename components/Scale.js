export default props => {
  let scale = 10000000

  while (scale * props.scale / 1000 > 150) {
    let checker = scale
    while(checker > 1){
      if(checker % 10 === 5) break
      else checker/=10
    }
    const mod = checker > 1 ? 0.4 : 0.5
    scale*=mod
  }

  const number = scale >= 1000 ? scale/1000 : scale
  const unit = scale >= 1000 ? 'km' : 'm'
  const scaleSize = scale * props.scale / 1000

  return (
    <div className='scale-container'>
      <svg width={`${scaleSize+3}px`} height='6px'>
        <path d={`M 2 0 l 0 4.5 m 0 -0.5 l ${scaleSize-1} 0`} stroke='white' strokeWidth='1'/>
        <path d={`M 1 0 l 0 5.5 m 0 -0.5 l ${scaleSize} 0 m 0 -5 l 0 5.5`} stroke='black' strokeWidth='1'/>
      </svg>
      <div>{`${number}${unit}`}</div>

      <style jsx>{`
        .scale-container {
          text-align: center;
          position: absolute;
          left: 20px;
          bottom: 15px;
        }
      `}</style>
    </div>
  )
}
