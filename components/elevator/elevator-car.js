export default function ElevatorCar({open, style}) {
  return <div className={`elevator__car ${open ? 'elevator__car--open' : ''}`} style={style}></div>
}
