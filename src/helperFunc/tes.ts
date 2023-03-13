Array.prototype.sample = function(){
  return this[Math.floor(Math.random()*this.length)];
}

// This code is based on the example of the Processing legend Daniel Schiffman
// https://github.com/CodingTrain/p5-matter/blob/master/02_bouncing_balls/sketch.js

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;
const Composites = Matter.Composites;

const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;

let engine;
let world;
let bodies;
let canvas;
let mouseConstraint;

  // Make elements
  function makeCircle(x, y) {
    const params = {
      restitution: 0.7,
      friction: 0.2
    }
  //  return Bodies.circle(x, y, 32, params);
    return Bodies.rectangle(x, y, 90, 60, params);
  }


function setup() {
  canvas = createCanvas(500, 500);

  // Mouse positions don't align
  // But it does work if I force pixel density of 1
  // pixelDensity(1);
  // Can I instead tell mouse to divide its xy by 2?

  // create an engine
  engine = Engine.create();
  world = engine.world;
  
  // initiate mouse
  const mouse = Mouse.create(canvas.elt);
  const mouseParams = {
    mouse: mouse,
    constraint: {
      stiffness: 0.1,
    }
  }
  
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  World.add(world, mouseConstraint);

  // Set walls 
  const params = {
    isStatic: true
  }
  
  const ground = Bodies.rectangle(width / 2, height, width, 1, params);
  const wall1 = Bodies.rectangle(0, height / 2, 1, height, params);
  const wall2 = Bodies.rectangle(width, height / 2, 1, height, params);
  const top = Bodies.rectangle(width / 2, 0, width, 1, params);
  
  World.add(world, ground);
  World.add(world, wall1);
  World.add(world, wall2);
  World.add(world, top);


  // x, y, columns, rows, column gap, row gap
  //var stack = Composites.stack(20, 50, 15, 10, 20, 20, makeCircle);
  const stack = Composites.stack(20, height /2, 5, 8, 10, 10, makeCircle);
  bodies = stack.bodies;

  // add all of the bodies to the world
  World.add(world, stack);

  // run the engine
  Engine.run(engine);
}

function draw() {
  
  background("#242424");
  strokeWeight(0);
  
  // set cursor
  fill("#0EFF00");
  circle(mouseX, mouseY, 40);
  
  for (let i = 0; i < bodies.length; i++) {
    
    const circleL = bodies[i];
    const pos = circleL.position;
    const r = circleL.circleRadius;
    const angle = circleL.angle;
    
    const fontSize = 38;
    
    textSize(fontSize);

    const txt1 = "Betty"
    const wordWith = textWidth(txt1);
        
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    
    // set rectangle in background, change fill to solid color to see it
    rectMode(CENTER);
    fill(255, 0, 0, 0);
    rect(0, 0, wordWith, fontSize);     

    // set text
    fill(255);
    textAlign(CENTER);
    text(txt1, 0, fontSize / 2);
    
    pop();
  }


}