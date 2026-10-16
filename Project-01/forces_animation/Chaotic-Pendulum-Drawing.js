// Adapted from "The Nature of Code" by Daniel Shiffman
// Bouncing object with PNG sequence animation using vectors
// https://natureofcode.com/vectors/#the-point-of-vectors

/*
First thing -> Draw a pendulum. make it a circle with a line attached to it.
I want to be able to move the pendulum around with the mouse.
and then if i press space bar it will drop the pendulum and start the physic simulation.
Second thing -> I want number of the arm to be parameterizable.-> maybe up to 4
Third thing -> If i press t it will trace the end of the pendulum and it will draw a line.
I want to be able to change the color of the line that is drawn my the pendulum
*/


/* list of variables.
1. Number of arms
2. Length of each arm
3. startingAngle of each arm(in degrees)
4. starting position of the pendulum. I want to be able to move it around with the mouse.
4. graviatational force. default value is 9.81 m/s^2 but i want to able to change it.
*/


/* equation for pendulum motion
f=ma
f= -mg sin(theta)
a= -g sin(theta)
theta is the angle of the pendulum.
g is the gravitational force.
m is the mass of the pendulum.
a is the acceleration of the pendulum.
f is the force of the pendulum.
*/

let position;
let prevPosition;
let velocity;
let acceleration;

let frames = [];
let currentIndex = 0;

let fps = 12;
let frameInterval = 1000 / fps;
let lastChange = 0;

//list of variables of the pendulum.
let g= 9.81;
let numOfArms = 2;
let lengthOfEachArm = 100;
let startingAngleOfEachArm = 0; //in degrees

let paused = false;

//lets start with a simple pendulum.

let StartingPositionOfThePendulum;
let EndingPositionOfThePendulum;


function setup() {
  createCanvas(800, 800);

  StartingPositionOfThePendulum = createVector( width/2, height/5);
  EndingPositionOfThePendulum = createVector(width/2, height/5+lengthOfEachArm);
}



function draw() {
  background(255);
// first draw the pendulum.
line(StartingPositionOfThePendulum.x,StartingPositionOfThePendulum.y, EndingPositionOfThePendulum.x, EndingPositionOfThePendulum.y);
//line is drawn at the center of the canvas and little bit down.
console.log("EndingPositionOfThePendulum: ", EndingPositionOfThePendulum);
circle(EndingPositionOfThePendulum.x, EndingPositionOfThePendulum.y, 5);
//draw circle.

if (!paused) {
  updatePhysics();
}

}


function mousePressed() {
  /*
if i press the mouse button over the pendulum head,
then move i want to drag the pendulum head to new position.
  */ 
//  if (mouseX > EndingPositionOfThePendulum.x - 5 && mouseX < EndingPositionOfThePendulum.x + 5 && mouseY > EndingPositionOfThePendulum.y - 5 && mouseY < EndingPositionOfThePendulum.y + 5) {
  
//  let aimPosition = createVector(mouseX, mouseY);
//  let direction = p5.Vector.sub(aimPosition, StartingPositionOfThePendulum);
//  direction.normalize();
//  direction.mult(lengthOfEachArm);
//  let newposition = p5.Vector.add(StartingPositionOfThePendulum, direction);
//  EndingPositionOfThePendulum = newposition;
//  }

}

function mouseDragged() {
  let aimPosition = createVector(mouseX, mouseY);
  

    let direction = p5.Vector.sub(aimPosition, StartingPositionOfThePendulum);
    console.log("aimposition: ", aimPosition, " - StartingPositionOfThePendulum: ", StartingPositionOfThePendulum, " = direction: ",  direction);

    direction.normalize();
    console.log("normalized direction: ", direction);
    direction.setMag(lengthOfEachArm);

    let newposition = p5.Vector.add(StartingPositionOfThePendulum, direction);
    console.log("newposition: ", newposition);
    EndingPositionOfThePendulum = newposition;
    console.log("EndingPositionOfThePendulum: ", EndingPositionOfThePendulum);
   
  }


function mouseReleased() {
  // if (mouseButton === LEFT) {
  //   EndingPositionOfThePendulum = createVector(mouseX, mouseY);
  // }
}

function updatePhysics() {
  //update the gravity.
  //update all the forces acting on the pendulum.
}

function keyPressed() {
  if (key === ' ') {
    paused = !paused;
    if (paused) {
      console.log("Paused");
    } else {
      console.log("Unpaused");
    }
  }
}