export default function ElevatorFloor(props) {
  return (<div className="elevator__floor justify-content-between">
    <div className="btn-group elevator__floor__btns" role="group" aria-label="Floor buttons">
      {props.floor.number < props.totalFloors - 1 ? (<button className="btn btn-outline-primary" type="button" onClick={() => props.onClickUp(props.floor.number)}>Up</button>) : null }
      {props.floor.number != 0 ? (<button className="btn btn-outline-primary" type="button" onClick={() => props.onClickDown(props.floor.number)}>Down</button>) : null }
    </div>
    <span className={`elevator__floor__number ${props.currentFloor === props.floor.number ? 'elevator__floor__number--current' : ''}`}>{props.floor.number}</span>
  </div>)
}
