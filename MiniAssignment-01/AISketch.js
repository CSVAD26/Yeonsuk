function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
}

function draw() {
  background(230, 240, 255);

  // --- Head ---
  fill(255, 224, 189); // Warm skin tone
  stroke(40);
  strokeWeight(3);
  circle(200, 200, 220);

  // --- Ears ---
  circle(85, 200, 35);
  circle(315, 200, 35);

  // --- Eyes (Sclera) ---
  fill(255);
  ellipse(155, 175, 45, 55);
  ellipse(245, 175, 45, 55);

  // --- Pupils (track cursor with constrained offset) ---
  let leftPupilX = 155 + constrain((mouseX - 155) * 0.08, -10, 10);
  let leftPupilY = 175 + constrain((mouseY - 175) * 0.08, -12, 12);
  let rightPupilX = 245 + constrain((mouseX - 245) * 0.08, -10, 10);
  let rightPupilY = 175 + constrain((mouseY - 175) * 0.08, -12, 12);

  fill(40);
  noStroke();
  circle(leftPupilX, leftPupilY, 18);
  circle(rightPupilX, rightPupilY, 18);

  // Pupil catchlights (glint)
  fill(255);
  circle(leftPupilX - 3, leftPupilY - 4, 5);
  circle(rightPupilX - 3, rightPupilY - 4, 5);

  // --- Eyebrows ---
  stroke(70, 45, 25);
  strokeWeight(4);
  noFill();
  arc(155, 140, 40, 20, 200, 340);
  arc(245, 140, 40, 20, 200, 340);

  // --- Nose ---
  stroke(180, 120, 90);
  strokeWeight(3);
  arc(200, 205, 18, 16, 20, 160);

  // --- Rosy Cheeks ---
  noStroke();
  fill(255, 100, 100, 70); // Semi-transparent pink
  ellipse(135, 220, 35, 20);
  ellipse(265, 220, 35, 20);

  // --- Mouth ---
  stroke(180, 40, 60);
  strokeWeight(3);
  fill(200, 60, 70);
  arc(200, 240, 60, 45, 0, 180, CHORD);
}