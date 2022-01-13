import React from 'react';
import ElevatorFloor from "./elevator-floor"
import ElevatorShaft from "./elevator-shaft"
import ElevatorCar from "./elevator-car"

const Directions = {
  DOWN: 'down',
  UP: 'up'
}

export default class Elevator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      floors: this.createFloorsArray(this.props.floors),
      floorHeight: 150,
      currentFloor: 0,
      floorSpacing: 15,
      elevatorCarOpen: false,
      isMoving: false,
      delay: 4000,
      queue: [],
      pendingPromise: false,
      workingOnPromise: false
    };
  }

  enqueue(promise, floorTarget) {
    return new Promise((resolve, reject) => {
      const newQueue = [...this.state.queue, {
        promise,
        resolve,
        reject,
        floorTarget: floorTarget || 0
      }]
      .sort((a, b) => a.floorTarget - b.floorTarget)

      this.setState({queue: newQueue});
      // Re-run
      this.dequeue();
    });
  }

  dequeue() {
    if (this.state.workingOnPromise) {
      return false;
    }
    const item = this.state.queue.shift();
    if (!item) {
      return false;
    }
    try {
      this.setState({workingOnPromise: true});
      item.promise()
        .then((value) => {
          this.setState({workingOnPromise: false});
          item.resolve(value);
          this.dequeue();
        })
        .catch(err => {
          this.setState({workingOnPromise: false});
          item.reject(err);
          this.dequeue();
        })
    } catch (err) {
      this.setState({workingOnPromise: false});
      item.reject(err);
      this.dequeue();
    }

    return true;
  }

  createFloorsArray(totalFloors) {
    const array = [];
    for (let index = 0; index < totalFloors; index++) {
      array.push({number: index})
    }
    return array.reverse()
  }

  async moveUp(fromFloorNr){
    const dir = Directions.UP
    const msDelay = this.state.workingOnPromise ? this.state.delay : 1000;
    const nextFloor = await new Promise(r => setTimeout(() => r(fromFloorNr), msDelay));

    console.log(nextFloor, dir);
    this.setState({ currentFloor: nextFloor });
  }

  async moveDown(fromFloorNr) {
    const dir = Directions.DOWN
    const msDelay = this.state.workingOnPromise ? this.state.delay : 1000;
    const nextFloor = await new Promise(r => setTimeout(() => r(fromFloorNr), msDelay));

    console.log(nextFloor, dir);
    this.setState({ currentFloor: nextFloor });
  }

  async moveToFloor(floorNr) {
    const dir = this.state.currentFloor < floorNr ? Directions.UP : Directions.DOWN
    const msDelay = this.state.workingOnPromise ? this.state.delay : 500;
    const nextFloor = await new Promise(r => setTimeout(() => r(floorNr), msDelay));
    console.log(nextFloor, dir);
    this.setState({ currentFloor: nextFloor });
  }

  handleFloorUp(floorNr) {
    this.enqueue(() => this.moveUp(floorNr, this.state.delay), floorNr);
  }

  handleFloorDown(floorNr) {
    this.enqueue(() => this.moveDown(floorNr, this.state.delay), floorNr);
  }

  handleFloorButton(floorNr) {
    this.enqueue(() => this.moveToFloor(floorNr, this.state.delay), floorNr);
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
          <ElevatorCar
            floors={floors}
            currentFloor={currentFloor}
            open={elevatorCarOpen}
            style={{bottom: (currentFloor * floorHeight) + floorSpacing / 2}}
            onClickFloorButton={(floorNr) => this.handleFloorButton(floorNr)}
          />
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
