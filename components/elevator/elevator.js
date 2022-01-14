import React from 'react';
import ElevatorFloor from "./elevator-floor"
import ElevatorShaft from "./elevator-shaft"
import ElevatorCar from "./elevator-car"
import ElevatorActionQueue from './elevator-action-queue';
import Card from '../bootstrap-card';

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
      direction: undefined,
      delayShort: 500,
      delayLong: 2000,
      queue: [],
      workingOnPromise: false
    };

    this.actionQueue = ElevatorActionQueue()
  }

  updateDirection() {
    const min = Math.min(...Object.keys(this.state.floors));
    const max = Math.max(...Object.keys(this.state.floors));

    if (this.state.queue.length > 0) {
      let highestRequestedFloor = Math.max(...this.state.queue);
      let lowestRequestedFloor = Math.min(...this.state.queue);
      // elevator at the top floor, must do down
      if (this.state.currentFloor === max) this.setState({direction: Directions.DOWN});
      // elevator at the bottom floor, must go up
      else if (this.state.currentFloor === min) this.setState({direction: Directions.UP})
      else {
        if (this.state.currentFloor <= lowestRequestedFloor) this.setState({direction: Directions.UP});
        else if (this.state.currentFloor >= highestRequestedFloor) this.setState({direction: Directions.DOWN});
        else {
          // elevator should continue in its current direction until it has a need to change direction
          if (this.state.direction == Directions.DOWN && this.state.currentFloor > lowestRequestedFloor) this.setState({direction: Directions.DOWN});
          else if(this.direction == Directions.UP && this.state.currentFloor < highestRequestedFloor) this.setState({direction: Directions.UP});
        }
      }
    } else {
      this.setState({direction: undefined});
    }
  }

  createFloorsArray(totalFloors) {
    const array = [];
    for (let index = 0; index < totalFloors; index++) {
      array.push({number: index})
    }
    return array
  }

  /**
   * pauses execution in order to simulate a real-world event that takes some time
   * @param {int} ms
   * @returns
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Add floor to elevator's qeueu for a stop.
   * @param {int} floorNr
   */
  async requestElevator(floorNr) {
    const newRequestQueue = [...this.state.queue, floorNr];
    this.setState({queue: newRequestQueue}, () => {
      this.updateDirection();
      if ( this.state.direction === undefined) {
        const nextFloorNr = this.getNextFloor();
        this.goToFloor(nextFloorNr);
      }
    })
  }

  /**
   * Execute elevator movement.
   * @param {int} destFloor
   * @returns
   */
  async goToFloor(destFloor) {
    let provStop = false

    if (destFloor === this.state.currentFloor) {
      return;
    } else {
      if (this.state.elevatorCarOpen) {
        return;
      } else {
        await this.delay(this.state.delayShort);
        while (this.state.currentFloor !== destFloor) {
          // Move up.
          if (this.state.currentFloor < destFloor) {
            await this.delay(this.state.delayShort);
            this.setState({currentFloor: this.state.currentFloor + 1})
          }
          // Move down.
          else if (this.state.currentFloor > destFloor) {
            await this.delay(this.state.delayShort);
            this.setState({currentFloor: this.state.currentFloor - 1})
          }
          // Make a provisional stop
          if (this.state.queue.indexOf(this.state.currentFloor) != -1) {
            provStop = true
            await this.delay(this.state.delayShort);
            this.arrivedAtFloor(this.state.currentFloor);
            break
          }
        }
        // Some time to decelerate.
        if (!provStop) {
          await this.delay(this.state.delayShort);
          this.arrivedAtFloor(destFloor);
        }
      }
    }
  }

  /**
   * Get best floor to travel next considering the queue.
   * @returns {int} Floor Number
   */
  getNextFloor() {
    let nextFloor;

    if (this.state.queue.length === 0) {
      return this.state.currentFloor
    } else {
      nextFloor = this.getNextClosestFloor()
    }

    if (this.state.direction === Directions.DOWN) {
      for (let f = this.state.currentFloor + 1; f > nextFloor + 1; f) {
        return nextFloor; // this.state.floors[f].number;
      }
    }
    if (this.state.direction === Directions.UP) {
      for (let f = this.state.currentFloor + 1; f < nextFloor + 1; f){
        return nextFloor; // this.state.floors[f].number;
      }
    }


    return nextFloor; // this.state.floors[nextFloor].number
  }

  /**
   * Considering elevator direction get closest floor in the queue.
   * @returns {int} Floor number
   */
  getNextClosestFloor() {
    // elevators prefer to continue in the same direction if there is a reason to
    let nextFloor = this.state.queue[0];
    if (this.state.direction === Directions.DOWN) {
      for (let f of this.state.queue) {
        if (f <= this.state.currentFloor && f > nextFloor) nextFloor = f - 1;
      }
    } else if(this.state.direction === Directions.UP){
      for (let f of this.state.queue) {
        if(f >= this.state.currentFloor && f < nextFloor) nextFloor = f + 1;
      }
    }

    return nextFloor;
  }

  /**
   * Opens the doors wait at the floor, closes the doors.
   * @param {int} floorNr
   */
  async arrivedAtFloor(floorNr) {
    await this.actionQueue(async () => {
      await this.openDoors();

      // remove floor from queue
      const updatedQueue = this.state.queue.splice(this.state.queue.indexOf(floorNr), 1);
      this.setState(updatedQueue, () => this.updateDirection());
    })

    await this.actionQueue(async () => {
      await this.closeDoors();

      // get next task
      const nextFloorNr = this.getNextFloor();
      this.goToFloor(nextFloorNr);
    })
  }

  /**
   * Simulates doors opening.
   * Using semaphores, forbids other elevator events until complete
   */
  async openDoors(){
    await this.delay(this.state.delayLong); //opening and closing doors takes 1s
    this.setState({elevatorCarOpen: true});
  }

  /**
   * Simulates doors opening.
   * Using semaphores, forbids other elevator events until complete
   */
  async closeDoors(){
    await this.delay(this.state.delayLong); //opening and closing doors takes 1s
    this.setState({elevatorCarOpen: false});
  }

  handleFloorUp(floorNr) {
    this.requestElevator(floorNr)
  }

  handleFloorDown(floorNr) {
    this.requestElevator(floorNr)
  }

  handleFloorButton(floorNr) {
    this.requestElevator(floorNr)
  }

  render() {
    const { floors, currentFloor, floorHeight, floorSpacing, elevatorCarOpen, direction, queue } = this.state
    const reversedFloors = [...floors].reverse()
    return (<>
    <div className='row'>
      <div className='col-8'>
        <div className="elevator">
          {reversedFloors.map((floor, index) => (
            <ElevatorFloor
              floor={floor}
              currentFloor={currentFloor}
              totalFloors={floors.length}
              key={index}
              onClickUp={() => this.handleFloorUp(floor.number)}
              onClickDown={() => this.handleFloorDown(floor.number)}
            />
          ))}
          <ElevatorShaft floors={floors.length} currentFloor={currentFloor}>
            <ElevatorCar
              floors={reversedFloors}
              currentFloor={currentFloor}
              open={elevatorCarOpen}
              style={{bottom: (currentFloor * floorHeight) + floorSpacing / 2}}
              onClickFloorButton={(floorNr) => this.handleFloorButton(floorNr)}
            />
          </ElevatorShaft>
        </div>
      </div>
      <div className='col-4 d-flex flex-column justify-content-center align-items-center'>
        <Card title="Current Floor" className="mb-3 text-center">
          <p className='card-text'>{currentFloor}</p>
        </Card>
        <Card title="Elevator Direction" className="mb-3 text-center">
          <p className='card-text'>{direction ? direction : 'idle'}</p>
        </Card>
        <Card title="Elevator Qeueu" className="mb-3 text-center">
          <p className='card-text'>{queue.length ? queue.join(' | ') : 'empty'}</p>
        </Card>
      </div>
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
