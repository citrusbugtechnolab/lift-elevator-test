const floors = 10;
const numberOfElevators = 5;
let queue = [];
const floorsContainer = document.getElementById("floors");
const elevatorsContainer = document.getElementById("elevators");

// Generate floors and call buttons
for (let i = 0; i < floors; i++) {
  const floor = document.createElement("div");
  floor.className = "floor";
  floor.dataset.floor = i;

  const floorValue = document.createElement("span");
  floorValue.textContent = `Floor ${i}`;

  const callbutton = document.createElement("button");
  callbutton.className = "call-btn";
  callbutton.textContent = "Call";
  callbutton.onclick = () => ElevatorCall(i, callbutton);

  floor.appendChild(floorValue);
  floor.appendChild(callbutton);
  floorsContainer.appendChild(floor);
}

// Generate elevators
const elevators = [];
for (let i = 0; i < numberOfElevators; i++) {
  const elevatorDiv = document.createElement("div");
  const elevetorOnFlorr = document.createElement("p");
  elevetorOnFlorr.className = "elevator" + i;
  elevetorOnFlorr.innerText = i + 1;
  elevatorDiv.className = "elevator";
  elevatorDiv.dataset.currentFloor = 0;
  elevatorDiv.append(elevetorOnFlorr);
  elevatorsContainer.appendChild(elevatorDiv);
  elevators.push(elevatorDiv);
}

function ElevatorCall(floor, button) {
  if (button.classList.contains("waiting")) return;
  button.classList.add("waiting");
  button.textContent = "Waiting";
  queue.push({
    floor,
    button,
  });
  removeElevatorFromQueue();
}

function removeElevatorFromQueue() {
  if (queue.length === 0) return;

  const { floor, button } = queue.shift();
  const nearfindedElevator = findNearestElevator(floor);

  if (nearfindedElevator) {
    moveElevator(nearfindedElevator, floor, button);
  } else {
    queue.unshift({
      floor,
      button,
    });
    setTimeout(removeElevatorFromQueue, 1000);
  }
}

function findNearestElevator(floorToRreach) {
  let closest = null;
  let minDistance = Infinity;

  elevators.forEach((elevator) => {
    if (!elevator.classList.contains("moving")) {
      const currentFloor = parseInt(elevator.dataset.currentFloor);
      const distance = Math.abs(currentFloor - floorToRreach);

      if (distance < minDistance) {
        minDistance = distance;
        closest = elevator;
      }
    }
  });

  return closest;
}

function moveElevator(elevator, floorToBeReach, button) {
  elevator.classList.add("moving");
  const currentFloor = parseInt(elevator.dataset.currentFloor);
  const distance = Math.abs(currentFloor - floorToBeReach);
  const travelTime = distance * 2;
  let counter = 1;
  setTimeout(() => {
    elevator.dataset.currentFloor = floorToBeReach;
    elevator.style.transform = `translateY(${-(floorToBeReach * 60)}px)`;
    elevator.classList.add("red");

    setTimeout(() => {
      elevator.classList.remove("red");
      elevator.classList.add("green");

      //      playDingSound();
      setTimeout(() => {
        elevator.classList.remove("green");
        elevator.classList.remove("moving");
        button.classList.remove("waiting");
        button.textContent = "Arrived";
        setTimeout(() => {
          button.textContent = "Call";
          removeElevatorFromQueue();
        }, 500);
      }, 500);
    }, travelTime * 100);
  }, 10);
}

function playDingSound() {
  // const audio = new Audio('https://www.soundjay.com/button/beep-07.wav');
  //audio.play();
}
