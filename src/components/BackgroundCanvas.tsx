'use client'
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Bodies,
  Body,
  Composite,
  Engine,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
  Vector,
  World,
} from 'matter-js'
import { useEffect, useRef } from 'react'

const BackgroundCanvas = () => {
  const scene = useRef()
  const engine = useRef(Engine.create({ enableSleeping: true }))

  const onButtonClick = () => {
    const cc = Bodies.circle(3, 500, Math.random() * 50, {
      friction: 0.3,
      frictionAir: 0.0001,
      restitution: 0.8,
    })
    Composite.add(engine.current.world, cc)
    console.log('clicked')
  }

  const switchToOuterSpaceMode = () => {
    engine.current.gravity = { x: 0, y: 0, scale: 0.0001 }
  }

  useEffect(() => {
    // mount
    const cw = window.innerWidth
    const ch = window.innerHeight
    const THICCNESS = 60

    const render = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: 'transparent',
      },
    })

    const handleResize = () => {
      render.canvas.width = window.innerWidth
      render.canvas.height = window.innerHeight

      Body.setPosition(ground, Vector.create(cw / 2, ch + THICCNESS / 2))

      // reposition right wall
      Body.setPosition(rightWall, Vector.create(cw + THICCNESS / 2, ch / 2))
    }

    const mouse = Mouse.create(render.canvas)
    const mouseConstraint = MouseConstraint.create(engine.current, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
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

    const boxA = Bodies.rectangle(100, 200, 80, 80)
    const boxB = Bodies.rectangle(150, 50, 80, 80)
    const ground = Bodies.rectangle(cw / 2, ch + THICCNESS / 2, cw, THICCNESS, {
      isStatic: true,
    })

    Mouse.setElement(mouse, mouse.element)

    // TODO: clean me
    window.addEventListener('resize', () => handleResize())

    Composite.add(engine.current.world, [
      boxA,
      boxB,
      ground,
      leftWall,
      rightWall,
      circle,
    ])
    Composite.add(engine.current.world, mouseConstraint)

    Render.run(render)

    // create runner
    const runner = Runner.create()

    // run the engine
    Runner.run(runner, engine.current)

    return () => {
      Render.stop(render)
      World.clear(engine.current.world, false) // TODO: what the heck is keepStatic?
      Engine.clear(engine.current)
      render.canvas.remove()
      render.textures = {}
    }
  }, [])

  return (
    <>
      <button className='z-10' type='button' onClick={() => onButtonClick()}>
        Adding good stuffs
      </button>
      <button
        className='z-10'
        type='button'
        onClick={() => switchToOuterSpaceMode()}
      >
        Space Mode
      </button>
      <div ref={scene} className='fixed top-0 left-0 z-0 h-full w-full' />
    </>
  )
}

export default BackgroundCanvas
