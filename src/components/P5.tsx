'use client'
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Bodies,
  Composite,
  Composites,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Runner,
  World,
} from 'matter-js'
import { useRef } from 'react'
import Sketch from 'react-p5'

const BackgroundCanvas = () => {
  // const engine = useRef(Engine.create({ enableSleeping: true }))
  const bodies = useRef()

  const setup = (p5, parentRef) => {
    const cw = window.innerWidth
    const ch = window.innerHeight
    const THICCNESS = 60
    const p5Canvas = p5.createCanvas(600, 600).parent(parentRef)
    p5.pixelDensity(1)
    const engine = Engine.create()
    engine.gravity = { x: 0, y: 0, scale: 0.0001 }

    // mouse
    const mouse = Mouse.create(p5Canvas.elt)
    const density = p5.displayDensity()
    console.log(density)

    mouse.pixelRatio = p5.pixelDensity()
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0,
        render: {
          visible: true,
        },
      },
    })
    // mouseConstraint.mouse.pixelRatio = p5.pixelDensity()

    Events.on(mouseConstraint, 'mousedown', (e) => {
      console.log(e)

      console.log('mouse Click')
    })
    const ground = Bodies.rectangle(cw / 2, ch + THICCNESS / 2, cw, THICCNESS, {
      isStatic: true,
    })
    const leftWall = Bodies.rectangle(
      0 - THICCNESS / 2,
      ch / 2,
      THICCNESS,
      ch * 5,
      {
        isStatic: true,
      },
    )

    const rightWall = Bodies.rectangle(
      cw + THICCNESS / 2,
      ch / 2,
      THICCNESS,
      ch * 5,
      {
        isStatic: true,
      },
    )

    const circle = Bodies.circle(3, 10, 30, {
      friction: 0.3,
      frictionAir: 0.0001,
      restitution: 0.8,
    })

    const boxA = Bodies.rectangle(0, 0, 80, 80, {
      label: 'test',
    })

    Composite.add(engine.world, [boxA, ground, leftWall, rightWall, circle])
    Composite.add(engine.world, mouseConstraint)
    Mouse.setElement(mouse, mouse.element)

    // World.add(engine.world, mouseConstraint)

    const makeCircle = (x, y) => {
      const params = {
        restitution: 0.7,
        friction: 0.2,
      }
      //  return Bodies.circle(x, y, 32, params);
      return Bodies.rectangle(x, y, 90, 60, params)
    }

    const stack = Composites.stack(2, 5, 2, 5, 10, 10, makeCircle)
    bodies.current = stack.bodies

    // add all of the bodies to the world
    Composite.add(engine.world, stack)

    // create runner
    const runner = Runner.create()

    // run the engine
    Runner.run(runner, engine)
  }

  const draw = (p5) => {
    p5.background(0)
    p5.fill(255, 204, 0)
    p5.ellipse(p5.width / 2, 10, 50)

    for (let i = 0; i < bodies.current.length; i++) {
      const circleL = bodies.current[i]
      const pos = circleL.position
      const r = circleL.circleRadius
      const angle = circleL.angle

      const fontSize = 38

      p5.textSize(fontSize)

      const txt1 = 'YU-CHUN LIU'
      const wordWith = p5.textWidth(txt1)

      p5.push()
      p5.translate(pos.x, pos.y)
      p5.rotate(angle)

      // set rectangle in background, change fill to solid color to see it
      p5.rectMode()
      p5.fill(255, 204, 0)
      p5.rect(0, 0, wordWith, fontSize)

      // set text
      p5.fill(255)
      p5.textAlign()
      p5.text(txt1, 0, fontSize / 2)
      p5.pop()
    }
  }
  return (
    <div className='fixed top-0 left-0 h-full w-full'>
      <Sketch setup={setup} draw={draw} />
    </div>
  )
}

export default BackgroundCanvas
