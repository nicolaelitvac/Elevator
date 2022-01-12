import React from 'react';
import ElevatorFloor from "./elevator-floor"
import ElevatorShaft from "./elevator-shaft"
import ElevatorCar from "./elevator-car"

export default class Elevator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      floors: this.createFloorsArray(this.props.floors),
      floorHeight: 150,
      currentFloor: 0,
      floorSpacing: 15,
      elevatorCarOpen: false,
    };
  }

  createFloorsArray(totalFloors) {
    const array = [];
    for (let index = 0; index < totalFloors; index++) {
      array.push({number: index})
    }
    return array.reverse()
  }

  moveUp(){
    if (this.state.currentFloor < this.state.floors.length - 1) {
      this.setState({currentFloor: this.state.currentFloor + 1})
    }
  }
  moveDown() {
    if (this.state.currentFloor > 0) {
      this.setState({currentFloor: this.state.currentFloor - 1})
    }
  }
  handleFloorUp(floorNr) {
    console.log(`Up from ${floorNr}`);
    this.moveUp();
  }

  handleFloorDown(floorNr) {
    console.log(`Down from ${floorNr}`);
    this.moveDown();
  }

  render() {
    const { floors, currentFloor, floorHeight, floorSpacing, elevatorCarOpen } = this.state
    return (<>
    <div className='elevatorScreen'>{currentFloor}</div>
      <div className="elevator">
        {floors.map((floor, index) => (
          <ElevatorFloor floor={floor} totalFloors={floors.length} key={index} onClickUp={() => this.handleFloorUp(floor.number)} onClickDown={() => this.handleFloorDown(floor.number)} />
        ))}
        <ElevatorShaft floors={floors.length} currentFloor={currentFloor}>
          <ElevatorCar currentFloor={currentFloor} open={elevatorCarOpen} style={{bottom: (currentFloor * floorHeight) + floorSpacing / 2}} />
        </ElevatorShaft>
      </div>
      <style jsx global>{`
        :root {
          --elevator-floors: ${floors.length};
          --elevator-floor-height: ${floorHeight}px;
          --elevator-floor-spacing: ${floorSpacing}px;
        }
      `}</style>
    </>);
  }
}
