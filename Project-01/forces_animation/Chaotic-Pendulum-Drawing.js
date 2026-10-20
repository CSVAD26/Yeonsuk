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


let fps = 12;
let frameInterval = 1000 / fps;
let lastChange = 0;

//list of variables of the pendulum.
let g= 10;
let numOfArms = 2;
let lengthOfEachArm = 100;
let massOfThePendulum = 1;

let velocity; //velocity of the bob.
let acceleration; //acceleration of the bob.
let gravity; //gravity of the bob.
let tension; //tension force of the string.

let angle;
let angleVelocity;
let angleAcceleration;

let paused = false;

//lets start with a simple pendulum.

let Pivot;
let Bob;


function setup() {
  createCanvas(800, 800);

  Pivot = createVector( width/2, height/5);
  Bob = createVector(width/2, height/5+lengthOfEachArm);
  velocity = createVector(0, 0);
  acceleration = createVector(0, 0);
  gravity = createVector(0, g);
  tension = createVector(0, 0);
}



function draw() {
  background(255);
// first draw the pendulum.
line(Pivot.x,Pivot.y, Bob.x, Bob.y);
//line is drawn at the center of the canvas and little bit down.
circle(Bob.x, Bob.y, 5);
//draw circle.



// //find the direction of the string.
// let stringDirection = p5.Vector.sub(Bob, Pivot);
// stringDirection.normalize();

// //find the magnitude of the gravity.
// let pullingForce = gravity.dot(stringDirection);

// let angleOfThePendulum = atan2(stringDirection.y, stringDirection.x);
// tension = p5.Vector.mult(stringDirection, -pullingForce); //tension force is in the opposite direction of the pulling force.

// //vector that is pulling the bob towards the center
// //let smallg=p5.Vector.mult(stringDirection, pullingForce);
// //let restoringforce = p5.Vector.sub(gravity, smallg);
// acceleration = -g * sin(angleOfThePendulum);


// velocity.add(acceleration);
// //velocity.add(restoringforce);
// Bob.add(velocity);



// //lock the length
// let offset = p5.Vector.sub(Bob, Pivot);
// offset.setMag(lengthOfEachArm);
// Bob.set(p5.Vector.add(Pivot, offset));



angleAcceleration = -g * sin(angle);




if (!paused) {
  updatePhysics();
}

}


function mousePressed() {
  /*
if i press the mouse button over the pendulum head,
then move i want to drag the pendulum head to new position.
  */ 
//  if (mouseX > Bob.x - 5 && mouseX < Bob.x + 5 && mouseY > Bob.y - 5 && mouseY < Bob.y + 5) {
  
//  let aimPosition = createVector(mouseX, mouseY);
//  let direction = p5.Vector.sub(aimPosition, Pivot);
//  direction.normalize();
//  direction.mult(lengthOfEachArm);
//  let newposition = p5.Vector.add(Pivot, direction);
//  Bob = newposition;
//  }

}

function mouseDragged() {
  let aimPosition = createVector(mouseX, mouseY);
  

    let direction = p5.Vector.sub(aimPosition, Pivot);
    console.log("aimposition: ", aimPosition, " - Pivot: ", Pivot, " = direction: ",  direction);

    direction.normalize();
    console.log("normalized direction: ", direction);
    direction.setMag(lengthOfEachArm);

    let newposition = p5.Vector.add(Pivot, direction);
    console.log("newposition: ", newposition);
    Bob = newposition;
    console.log("Bob: ", Bob);
   
  }


function mouseReleased() {
  // if (mouseButton === LEFT) {
  //   Bob = createVector(mouseX, mouseY);
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