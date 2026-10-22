
//list of variables of the pendulum.
let g = 1000;
let numOfArms = 2;
let lengthOfArm1 = 100;
let lengthOfArm2 = 100;
let massOfBob1 = 1;
let massOfBob2 = 1;

let theta1 = 0;
let theta2 = 0;
let omega1 = 0;
let omega2 = 0;

let Pivot;

//pause the simulation.
let paused = true;

let E0 = 0;

let tracePath = false;
let traceLayer;
let prevTip = null;

//control variable

let lengthslider1;
let lengthslider2;
let massslider1;
let massslider2;

let gravityslider;

let lengthslider1label;
let lengthslider2label;
let massslider1label;
let massslider2label;

let gravitysliderlabel;
//
let resebutton;
let cleartracingbutton;

let redSlider;
let greenSlider;
let blueSlider;

let strokeweightslider;

let pendulumshown = true;

function setup() {
  createCanvas(1000, 700);
  traceLayer = createGraphics(width, height);
  Pivot = createVector( width/2, height/4);

  lengthslider1 = createSlider(1, 500, 100);
  lengthslider1.style("accent-color", "rgb(255, 230, 0)");
  
  lengthslider2 = createSlider(1, 500, 100);
  lengthslider2.style("accent-color", "rgb(255, 230, 0)");
  
  massslider1 = createSlider(1, 30, 1);
  massslider1.style("accent-color", "rgb(214, 130, 130)");
  
  massslider2 = createSlider(1, 30, 1);
  massslider2.style("accent-color", "rgb(214, 130, 130)");
  
  gravityslider = createSlider(10, 10000, 1000);
  gravityslider.style("accent-color", "rgb(56, 104, 104)");
  
  resebutton = createButton("Reset");
  cleartracingbutton = createButton("Clear Tracing");

  redSlider = createSlider(0, 255, 0);
  redSlider.style("accent-color", "rgb(255, 0, 0)");

  greenSlider = createSlider(0, 255, 0);
  greenSlider.style("accent-color", "rgb(0, 255, 0)");

  blueSlider = createSlider(0, 255, 0);
  blueSlider.style("accent-color", "rgb(0, 0, 255)");

  strokeweightslider = createSlider(1, 1000, 1);
  strokeweightslider.style("accent-color", "rgb(107, 28, 114)");

  

  lengthslider1label = createP();
  lengthslider2label = createP();
  massslider1label = createP();
  massslider2label = createP();
  gravitysliderlabel = createP();

  redSliderlabel = createP();
  greenSliderlabel = createP();
  blueSliderlabel = createP();

  strokeweightsliderlabel = createP();

  placeRow(lengthslider1label, lengthslider1, 10, 20);
  placeRow(lengthslider2label, lengthslider2, 10, 50);
  placeRow(massslider1label, massslider1, 10, 80);
  placeRow(massslider2label, massslider2, 10, 110);
  placeRow(gravitysliderlabel, gravityslider, 10, 140);
  placeRow(redSliderlabel, redSlider, 380, 20);
  placeRow(greenSliderlabel, greenSlider, 380, 50);
  placeRow(blueSliderlabel, blueSlider, 380, 80);
  placeRow(strokeweightsliderlabel, strokeweightslider, 380, 110);


  resebutton.position(10, height + 180);
  cleartracingbutton.position(120, height + 180);
  resebutton.mousePressed(reset);
  cleartracingbutton.mousePressed(clearTracing);

  updateControls();
}

function armPositions() {
  let bob1 = createVector(
    Pivot.x + lengthOfArm1 * Math.sin(theta1),
    Pivot.y + lengthOfArm1 * Math.cos(theta1)
  );
  let bob2 = createVector(
    bob1.x + lengthOfArm2 * Math.sin(theta2),
    bob1.y + lengthOfArm2 * Math.cos(theta2)
  );
  return { bob1, bob2 };
}


function draw() {
  background(255);
  image(traceLayer, 0, 0);
  updateControls();

  if (!paused) {
    updatePhysics();

  }

  let arms = armPositions();

  //draw the pendulum if it is shown
  if(pendulumshown){
  stroke(0);
  strokeWeight(1);
  line(Pivot.x, Pivot.y, arms.bob1.x, arms.bob1.y);
  line(arms.bob1.x, arms.bob1.y, arms.bob2.x, arms.bob2.y);
  fill(255);
  circle(Pivot.x, Pivot.y, 8);
  circle(arms.bob1.x, arms.bob1.y, 12);
  circle(arms.bob2.x, arms.bob2.y, 12);
  }

  fill(0);
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  text("press spacebar to play/pause", 16, 16);
  text("press T to trace the path", 16, 36);
  text("press R to show/hide the pendulum", 16, 56);
  text("drag the mouse to move the pendulum", 16, 76);

  if (tracePath && !paused && prevTip) {
    traceLayer.stroke(redSlider.value() , greenSlider.value(), blueSlider.value());
    traceLayer.strokeWeight(strokeweightslider.value());
    traceLayer.line(prevTip.x, prevTip.y, arms.bob2.x, arms.bob2.y);
  }
  prevTip = { x: arms.bob2.x, y: arms.bob2.y };
}


function accelerations(t1, w1, t2, w2) {
  let m1 = massOfBob1;
  let m2 = massOfBob2;
  let l1 = lengthOfArm1;
  let l2 = lengthOfArm2;
  let delta = t1 - t2;

  let a11 = (m1 + m2) * l1;
  let a12 = m2 * l2 * Math.cos(delta);
  let a21 = m2 * l1 * Math.cos(delta);
  let a22 = m2 * l2;

  let b1 = -m2 * l2 * Math.sin(delta) * w2 * w2 - (m1 + m2) * g * Math.sin(t1);
  let b2 =  m2 * l1 * Math.sin(delta) * w1 * w1 - m2 * g * Math.sin(t2);

  let det = a11 * a22 - a12 * a21;
  let alpha1 = (b1 * a22 - a12 * b2) / det;
  let alpha2 = (a11 * b2 - b1 * a21) / det;
  return { alpha1, alpha2 };
}

function derivatives(t1, w1, t2, w2) {
  let a = accelerations(t1, w1, t2, w2);
  return {
    omega1: w1,
    omega2: w2,
    alpha1: a.alpha1,
    alpha2: a.alpha2
  };
}

function rk4(dt) {
  let k1 = derivatives(theta1, omega1, theta2, omega2);

  let k2 = derivatives(
    theta1 + k1.omega1 * dt / 2,
    omega1 + k1.alpha1 * dt / 2,
    theta2 + k1.omega2 * dt / 2,
    omega2 + k1.alpha2 * dt / 2
  );

  let k3 = derivatives(
    theta1 + k2.omega1 * dt / 2,
    omega1 + k2.alpha1 * dt / 2,
    theta2 + k2.omega2 * dt / 2,
    omega2 + k2.alpha2 * dt / 2
  );

  let k4 = derivatives(
    theta1 + k3.omega1 * dt,
    omega1 + k3.alpha1 * dt,
    theta2 + k3.omega2 * dt,
    omega2 + k3.alpha2 * dt
  );

  theta1 += (dt / 6) * (k1.omega1 + 2 * k2.omega1 + 2 * k3.omega1 + k4.omega1);
  omega1 += (dt / 6) * (k1.alpha1 + 2 * k2.alpha1 + 2 * k3.alpha1 + k4.alpha1);
  theta2 += (dt / 6) * (k1.omega2 + 2 * k2.omega2 + 2 * k3.omega2 + k4.omega2);
  omega2 += (dt / 6) * (k1.alpha2 + 2 * k2.alpha2 + 2 * k3.alpha2 + k4.alpha2);
}

function kineticEnergy() {
  let m1 = massOfBob1;
  let m2 = massOfBob2;
  let l1 = lengthOfArm1;
  let l2 = lengthOfArm2;
  let delta = theta1 - theta2;
  return 0.5 * (m1 + m2) * l1 * l1 * omega1 * omega1
       + 0.5 * m2 * l2 * l2 * omega2 * omega2
       + m2 * l1 * l2 * omega1 * omega2 * Math.cos(delta);
}

function potentialEnergy() {
  let m1 = massOfBob1;
  let m2 = massOfBob2;
  return -(m1 + m2) * g * lengthOfArm1 * Math.cos(theta1)
         - m2 * g * lengthOfArm2 * Math.cos(theta2);
}

function potentialEnergy() {
  let m1 = massOfBob1;
  let m2 = massOfBob2;
  return -(m1 + m2) * g * lengthOfArm1 * Math.cos(theta1)
         - m2 * g * lengthOfArm2 * Math.cos(theta2);
}

function correctEnergy() {
  let T = kineticEnergy();
  let targetT = E0 - potentialEnergy();
  if (T > 1e-8 && targetT > 0) {
    let scale = Math.sqrt(targetT / T);
    omega1 *= scale;
    omega2 *= scale;
  }
}

function updatePhysics() {
  let dt = deltaTime / 1000;
  if (dt > 0.032) dt = 0.032;
  rk4(dt);
  correctEnergy();
}

function reset() {
  theta1 = 0;
  theta2 = 0;
  omega1 = 0;
  omega2 = 0;
  E0 = 0;
  g = 1000;
  numOfArms = 2;
  lengthOfArm1 = 100;
  lengthOfArm2 = 100;
  massOfBob1 = 1;
  massOfBob2 = 1;

  gravityslider.value(g);
  lengthslider1.value(lengthOfArm1);
  lengthslider2.value(lengthOfArm2);
  massslider1.value(massOfBob1);
  massslider2.value(massOfBob2);

  paused = true;
  prevTip = null;

  
}

function clearTracing() {
  traceLayer.clear();
  prevTip = null;
} 

// function mousePressed() {
//   /*
// if i press the mouse button over the pendulum head,
// then move i want to drag the pendulum head to new position.
//   */ 
// //  if (mouseX > Bob.x - 5 && mouseX < Bob.x + 5 && mouseY > Bob.y - 5 && mouseY < Bob.y + 5) {
  
// //  let aimPosition = createVector(mouseX, mouseY);
// //  let direction = p5.Vector.sub(aimPosition, Pivot);
// //  direction.normalize();
// //  direction.mult(lengthOfEachArm);
// //  let newposition = p5.Vector.add(Pivot, direction);
// //  Bob = newposition;
// //  }

// }

function updateControls() {
  g = gravityslider.value();
  lengthOfArm1 = lengthslider1.value();
  lengthOfArm2 = lengthslider2.value();
  massOfBob1 = massslider1.value();
  massOfBob2 = massslider2.value();
  redSlider.value(redSlider.value());
  greenSlider.value(greenSlider.value());
  blueSlider.value(blueSlider.value());
  strokeweightslider.value(strokeweightslider.value());

  lengthslider1label.html("Length of Arm 1: " + lengthOfArm1);
  lengthslider2label.html("Length of Arm 2: " + lengthOfArm2);
  massslider1label.html("Mass of Bob 1: " + massOfBob1);
  massslider2label.html("Mass of Bob 2: " + massOfBob2);
  gravitysliderlabel.html("Gravity: " + g);

  redSliderlabel.html("Red: " + redSlider.value());
  greenSliderlabel.html("Green: " + greenSlider.value());
  blueSliderlabel.html("Blue: " + blueSlider.value());
  strokeweightsliderlabel.html("Stroke Weight: " + strokeweightslider.value());
}


function mouseDragged() {
 
    if (!paused) return;

    let arms = armPositions();
    let d1 = dist(mouseX, mouseY, arms.bob1.x, arms.bob1.y);
    let d2 = dist(mouseX, mouseY, arms.bob2.x, arms.bob2.y);
  
    if (d1 < d2) {
      theta1 = Math.atan2(mouseX - Pivot.x, mouseY - Pivot.y);
    } else {
      theta2 = Math.atan2(mouseX - arms.bob1.x, mouseY - arms.bob1.y);
    }
  
    omega1 = 0;
    omega2 = 0;
  }
   


function mouseReleased() {
  // if (mouseButton === LEFT) {
  //   Bob = createVector(mouseX, mouseY);
  // }
}


function keyPressed() {
  if (key === " ") {
    paused = !paused;
    console.log("Paused: ", paused);
    if (!paused) {
      E0 = kineticEnergy() + potentialEnergy();
      console.log("Unpaused");
    }
  }
  if (key === "t" || key === "T") {
    tracePath = !tracePath;
    console.log("Trace Path: ", tracePath);
  }
  if (key === "r" || key === "R") {
    pendulumshown = !pendulumshown;
    console.log("Pendulum Shown: ", pendulumshown);
  }
}

function placeRow(label, slider, x, y) {
  label.style("margin", "0");
  label.style("color", "#111");
  label.style("background-color", "white");
  label.style("white-space", "nowrap");
  label.style("width", "170px");
  label.position(x, height + y);
  slider.style("width", "140px");
  slider.position(x + 180, height + y);
}
