'use client'
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Bodies,
  Body,
  Common,
  Composite,
  Composites,
  Constraint,
  Engine,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
  Svg,
  Vector,
  Vertices,
  World,
} from 'matter-js'
import { useEffect, useRef } from 'react'

import { matterBodiesConfig } from '@/configs/matter'

const BackgroundCanvas = () => {
  const scene = useRef()
  // const engine = useRef(Engine.create({ enableSleeping: true }))
  const engine = useRef(Engine.create())
  // engine.current.gravity = { x: 0, y: 0.9, scale: 0.0001 }
  const WALL_THICKNESS = 60

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
    const render = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width: scene.current.clientWidth,
        height: scene.current.clientHeight,
        wireframes: false,
        background: 'transparent',
      },
    })

    // mouse movement
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

    Mouse.setElement(mouse, mouse.element)
    Composite.add(engine.current.world, mouseConstraint)

    // create left, right wall and ground surfaces
    const surfaceOption = {
      isStatic: true,
    }

    const leftWall = Bodies.rectangle(
      0 - WALL_THICKNESS / 2,
      scene.current.clientHeight / 2,
      WALL_THICKNESS,
      scene.current.clientHeight * 5,
      surfaceOption,
    )

    const rightWall = Bodies.rectangle(
      scene.current.clientWidth + WALL_THICKNESS / 2,
      scene.current.clientHeight / 2,
      WALL_THICKNESS,
      scene.current.clientHeight * 5,
      surfaceOption,
    )

    const ground = Bodies.rectangle(
      scene.current.clientWidth / 2,
      scene.current.clientHeight + WALL_THICKNESS / 2,
      45312,
      WALL_THICKNESS,
      surfaceOption,
    )

    Composite.add(engine.current.world, [ground, leftWall, rightWall])

    // const circle = Bodies.circle(3, 10, 30, {
    //   friction: 0.3,
    //   frictionAir: 0.0001,
    //   restitution: 0.8,
    // })
    // Composite.add(engine.current.world, circle)

    const SCALE = 0.25

    const scaleBodies = () => {
      const allBodies = Composite.allBodies(engine.current.world)

      allBodies.forEach((body) => {
        if (body.isStatic) return
        const { min, max } = body.bounds
        const bodyWidth = max.x - min.x
        const scaleFactor = (scene.current.clientWidth * SCALE) / bodyWidth

        Body.scale(body, scaleFactor, scaleFactor)
      })
    }

    const handleResize = () => {
      render.canvas.width = scene.current.clientWidth
      render.canvas.height = scene.current.clientHeight
      Body.setPosition(
        ground,
        Vector.create(
          scene.current.clientWidth / 2,
          scene.current.clientHeight + WALL_THICKNESS / 2,
        ),
      )
      // reposition right wall
      Body.setPosition(
        rightWall,
        Vector.create(
          scene.current.clientWidth + WALL_THICKNESS / 2,
          scene.current.clientHeight / 2,
        ),
      )

      scaleBodies()
    }

    // TODO: clean me
    window.addEventListener('resize', handleResize)

    Render.run(render)

    // create runner
    const runner = Runner.create()

    const createWordBody = (word = '', index = 0, ratio = 1) => {
      const body = Bodies.rectangle(
        300 + index + Math.random() * 100,
        40 * index + index * Math.random() * 100,
        matterBodiesConfig[word].width * ratio,
        matterBodiesConfig[word].height * ratio,
        {
          friction: 0.3,
          frictionAir: 0.0001,
          restitution: 0.8,
          label: word,
          render: {
            sprite: {
              texture: `images/${word}.png`,
              xScale: ratio,
              yScale: ratio,
            },
          },
        },
      )
      return body
    }

    const words = ['hello', 'im', 'yu', 'from', 'taiwan', 'hand']
    const RATIO_CONSTANT = 1.33
    const ratio =
      scene.current.clientWidth > 1200
        ? (scene.current.clientWidth / 2560) * RATIO_CONSTANT
        : (scene.current.clientWidth / 1380) * RATIO_CONSTANT

    words.forEach((word, index) => {
      const wordBody = createWordBody(word, index, ratio)

      Composite.add(engine.current.world, wordBody)
    })

    const frontendBody = createWordBody('frontend', 0, ratio)
    const developerBody = createWordBody('developer', 0, ratio)

    const frontConstraint = Constraint.create({
      bodyA: developerBody,
      bodyB: frontendBody,
      damping: 0.1,
      stiffness: 0.01,
      label: 'frontendConstraint',
      length: 150,
      render: {
        visible: true,
        lineWidth: 2,
        strokeStyle: '#F5F8F1',
        type: 'spring',
        anchors: true,
      },
    })

    Composite.add(engine.current.world, [
      developerBody,
      frontendBody,
      frontConstraint,
    ])

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
    <div className='fixed top-0 left-0 h-full w-full'>
      <div ref={scene} className='fixed top-0 left-0 z-0 h-full w-full' />
      <button
        className='z-100 rounded-2xl border border-slate-200 p-4'
        type='button'
        onClick={() => onButtonClick()}
      >
        Adding good stuffs
      </button>
      <button
        className='z-100 rounded-2xl border border-slate-200 p-4'
        type='button'
        onClick={() => switchToOuterSpaceMode()}
      >
        Space Mode
      </button>
    </div>
  )
}

export default BackgroundCanvas
