let points = [];
let velocities = [];
let delaunay, voronoi;
let showVoronoi = false;
let showDelaunay = true;
let addNewPoints = false;
let removeNewPoints = false;
let selectedStartPoint = false;
let selectedEndPoint = false;
let point1 = null;
let point2 = null;
let shortestPath = [];

const NUM_POINTS = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Initialize random points and velocities
  for (let i = 0; i < NUM_POINTS; i++) {
    points.push([random(width), random(height)]);
    velocities.push([random(-2, 2), random(-2, 2)]);
  }

  updateTriangulation();
}

function draw() {
  background(0);
 

  movePoints(); 
  updateTriangulation();
  updatePath();
  
  // Draw Delaunay
  if (showDelaunay) {
    stroke(255, 150);
    strokeWeight(1);
    noFill();
    for (let tri of delaunay.trianglePolygons()) {
      beginShape();
      for (let [x, y] of tri) vertex(x, y);
      endShape(CLOSE);
    }
  }

  // Draw Voronoi
  if (showVoronoi) {
    stroke(0, 255, 0, 180);
    noFill();
    for (let cell of voronoi.cellPolygons()) {
      beginShape();
      for (let [x, y] of cell) vertex(x, y);
      endShape(CLOSE);
    }
  }

  // Draw points
  noStroke();
  fill(255, 100, 100);
  for (let [x, y] of points) {
    circle(x, y, 10);
  }

  // Draw shortest path
  if(shortestPath.length > 1){
    stroke(255, 200, 100);
    strokeWeight(4);
    noFill(); 
    beginShape();
    for (let p of shortestPath) vertex(p[0], p[1]);
    endShape();
  }

  drawInstructions();
}

function movePoints() {
  for (let i = 0; i < points.length; i++) {
    points[i][0] += velocities[i][0];
    points[i][1] += velocities[i][1];

    // bounce off edges
    if (points[i][0] <= 0 || points[i][0] >= width) velocities[i][0] *= -1;
    if (points[i][1] <= 0 || points[i][1] >= height) velocities[i][1] *= -1;
  }
}

function drawNewPoints() {
  if (addNewPoints) {
   
  points.push([mouseX, mouseY]);
    velocities.push([random(-2, 2), random(-2, 2)]);
    updateTriangulation();
    updatePath();
   // console.log("drawnewpoint called");
    addNewPoints = false;
   // console.log("addNewPoints set to false");
  }
}

function removePoints() {
  if (removeNewPoints) {
    points.pop();
    velocities.pop();
    updateTriangulation();
    //  console.log("removePoints called");
    removeNewPoints = false;
   // console.log("removeNewPoints set to false");
  }
}

function mousePressed() {
if(mouseIsPressed){
  if(!selectedStartPoint){//there is no point selcted,
      //then select the closest point
      point1 = findClosestPoint(mouseX, mouseY);
      selectedStartPoint = true;
     // console.log("first closestPoint selected");
      //send the closest information of a point to the connectPoints function
    }
  else if(selectedStartPoint && !selectedEndPoint){//there is a point selected,
      let closestPoint = findClosestPoint(mouseX, mouseY);
      point2 = closestPoint;
      selectedEndPoint = true;
     // console.log("second closestPoint selected");
      connectPoints(point1, point2);
     // console.log("connectPoints called");
    }
  else if(selectedEndPoint && selectedStartPoint){// if there are two points selected already reset
    selectedStartPoint = false;
    selectedEndPoint = false;
    point1 = null;
    point2 = null;
    shortestPath = [];
   // console.log("reset point selection");
    }
}
}

//   else if(mouseIsPressed && !selectedStartPoint && !selectedEndPoint){
// if there is a point selected, select another point closest to the mouse position
// if there is two point selected draw call connectpoints function with (first point, second point) as arguments
// if the mouse is  clicked once more reset the point selection

function connectPoints(startPoint, endPoint) {
  //  draw a line between the two points. using Dijkstra's algorithm to find the shortest path between the two points.
  let source = points.indexOf(startPoint);//convert the point to an index
  let target = points.indexOf(endPoint);
 
  let result = Dijkstra(source);

  let path = [];
  for(let currentPoint   = target; currentPoint !== undefined; currentPoint = result.prev[currentPoint]){
    path.push(points[currentPoint]);
  }
  path.reverse();

  shortestPath = path;
 // console.log("shortestPath: ", shortestPath);
}


function Dijkstra(source)
{
  let distanceCost = [];
  let prev = [];
  let Q = [];
  for(let v= 0; v < points.length; v++){
    distanceCost[v] = Infinity;
    prev[v] = undefined;
    Q.push(v);
  }
  distanceCost[source] = 0;
  while(Q.length > 0){
    let u = Q[0];
    for(let i =1; i < Q.length; i++){
      if(distanceCost[Q[i]] < distanceCost[u]){
        u = Q[i];
      }
    }
    Q.splice(Q.indexOf(u), 1);
    for(let v of delaunay.neighbors(u)){
      let alt = distanceCost[u] + dist(points[u][0], points[u][1], points[v][0], points[v][1]);
      if(alt < distanceCost [v]){
        distanceCost[v] = alt;
        prev[v] = u;
      } 
    }
  } return{distanceCost: distanceCost, prev: prev};


}
 //pseudocode for Dijkstra's algorithm from wikipedia
  // for each vertex v in Graph.Vertices:
  //           dist[v] ← INFINITY
  //           prev[v] ← UNDEFINED
  //           add v to Q
  //       dist[source] ← 0

  //       while Q is not empty:
  //           u ← vertex in Q with minimum dist[u]
  //           Q.remove(u)
  //           for each edge (u, v) in Graph:
  //               alt ← dist[u] + Graph.Distance(u,v)
  //               if alt < dist[v]:
  //                   dist[v] ← alt
  //                   prev[v] ← u
  //       return dist[], prev[]



function keyPressed() {
  if (key === 'V' || key === 'v') showVoronoi = !showVoronoi;
    //console.log("showVoronoi: ", showVoronoi);
  if (key === 'D' || key === 'd') showDelaunay = !showDelaunay;
   // console.log("showDelaunay: ", showDelaunay);
  if (key === 'P' || key === 'p') {
    addNewPoints = !addNewPoints;
    console.log("Add new points:key pressed");
    drawNewPoints();
    }
  if(key === 'R' || key === 'r'){
    removeNewPoints = !removeNewPoints;
    console.log("Remove new points:key pressed");
    removePoints();

    }
}

function findClosestPoint(x, y) {
  let closestPoint = null;
  let closestDistance = Infinity;
  for (let point of points) {
    let distance = dist(x, y, point[0], point[1]);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestPoint = point;
    }
  }
  return closestPoint;
}

function updateTriangulation() {
  if (points.length < 3) return;
  delaunay = d3.Delaunay.from(points);
  voronoi = delaunay.voronoi([0, 0, width, height]);
}
function updatePath() {
  connectPoints(point1, point2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawInstructions() {
  noStroke();
  fill(255);
  textSize(14);
  text('Click two points for the shortest path. Click again to clear.', 10, height - 28);
  text('V: Toggle Voronoi | D: Toggle Delaunay | P: add point | R: remove point', 10, height - 10);
}
