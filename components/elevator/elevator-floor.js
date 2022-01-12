export default function ElevatorFloor(props) {
  return (<div className="elevator__floor">
    <div className="btn-group elevator__floor__btns" role="group" aria-label="Floor buttons">
      {props.floor.number < props.totalFloors - 1 ? (<button className="btn btn-outline-primary" type="button" onClick={props.onClickUp}>Up</button>) : null }
      {props.floor.number != 0 ? (<button className="btn btn-outline-primary" type="button" onClick={props.onClickDown}>Down</button>) : null }
    </div>
    {}
  </div>)
}
