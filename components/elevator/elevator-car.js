export default function ElevatorCar({open, style, floors, onClickFloorButton}) {
  return <div className={`elevator__car ${open ? 'elevator__car--open' : ''}`} style={style}>
    <div className="elevator__car__actions">
      {floors.map(floor => (
        <button key={floor.number} type="button" className="elevator__car__btns btn-primary" onClick={() => onClickFloorButton(floor.number)}>{floor.number}</button>
      ))}
    </div>
  </div>
}
