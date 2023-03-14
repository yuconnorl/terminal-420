'use client'
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Bodies,
  Body,
  Composite,
  Constraint,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
  Vector,
  World,
} from 'matter-js'
import { useEffect, useRef } from 'react'

import {
  matterBodiesConfig,
  RATIO_CONSTANT,
  WALL_THICKNESS,
} from '@/configs/matter'

import { OuterSpace, TrashBin } from './Icon'

const BackgroundCanvas = () => {
  const scene = useRef()
  const engine = useRef<Engine>(Engine.create())
  const isSpaceMode = useRef<boolean>(false)

  function onPartyStart() {
    const cc = Bodies.circle(3, 500, Math.random() * 50, {
      friction: 0.3,
      frictionAir: 0.0001,
      restitution: 0.8,
    })
    Composite.add(engine.current.world, cc)
  }

  function onRemoveClick() {
    if (!engine.current) return
    const ground = engine.current.world.bodies.find(
      (body) => body.label === 'ground',
    )
    if (!ground) return
    Composite.remove(engine.current.world, ground)
  }

  function toggleOuterSpaceMode() {
    if (!isSpaceMode.current) {
      engine.current.gravity = { x: 0, y: 0, scale: 0.0001 }
      isSpaceMode.current = !isSpaceMode.current
      return
    }

    engine.current.gravity = { x: 0, y: 1, scale: 0.0001 }
    isSpaceMode.current = !isSpaceMode.current
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
    const leftWall = Bodies.rectangle(
      0 - WALL_THICKNESS / 2,
      scene.current.clientHeight / 2,
      WALL_THICKNESS,
      scene.current.clientHeight * 5,
      {
        isStatic: true,
        label: 'leftWall',
      },
    )

    const rightWall = Bodies.rectangle(
      scene.current.clientWidth + WALL_THICKNESS / 2,
      scene.current.clientHeight / 2,
      WALL_THICKNESS,
      scene.current.clientHeight * 5,
      {
        isStatic: true,
        label: 'rightWall',
      },
    )

    const ground = Bodies.rectangle(
      scene.current.clientWidth / 2,
      scene.current.clientHeight + WALL_THICKNESS / 2,
      45312,
      WALL_THICKNESS,
      {
        isStatic: true,
        label: 'ground',
      },
    )

    // Events.on(engine.current, 'collisionEnd', (event) => {
    //   const pairs = event.pairs

    //   for (let i = 0, j = pairs.length; i != j; ++i) {
    //     const pair = pairs[i]

    //     if (pair.bodyA === ground) {
    //       pair.bodyB.render.strokeStyle = colorB
    //     } else if (pair.bodyB === ground) {
    //       pair.bodyA.render.strokeStyle = colorB
    //     }
    //   }
    // })

    Composite.add(engine.current.world, [ground, leftWall, rightWall])

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
      Body.setPosition(
        rightWall,
        Vector.create(
          scene.current.clientWidth + WALL_THICKNESS / 2,
          scene.current.clientHeight / 2,
        ),
      )
    }

    // TODO: clean me
    window.addEventListener('resize', handleResize)

    Render.run(render)

    // create runner
    const runner = Runner.create()

    // TODO: arrange these bodies
    const createWordBody = (word = '', index = 0, ratio = 1) => {
      const body = Bodies.rectangle(
        300 + index + Math.random() * 100,
        40 * index + index * Math.random() * 100,
        matterBodiesConfig[word].width * ratio,
        matterBodiesConfig[word].height * ratio,
        {
          friction: 0.3,
          frictionAir: 0.001,
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
    const resizeRatio =
      scene.current.clientWidth > 1200
        ? (scene.current.clientWidth / 2560) * RATIO_CONSTANT
        : (scene.current.clientWidth / 1380) * RATIO_CONSTANT

    words.forEach((word, index) => {
      const wordBody = createWordBody(word, index, resizeRatio)

      Composite.add(engine.current.world, wordBody)
    })

    const frontendBody = createWordBody('frontend', 0, resizeRatio)
    const developerBody = createWordBody('developer', 0, resizeRatio)
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
    <>
      <div ref={scene} className='absolute top-0 left-0 z-0 h-full w-full' />
      <div className='absolute right-4 top-4 flex flex-col gap-4'>
        <button className='' type='button' onClick={onRemoveClick}>
          <TrashBin />
        </button>
        <button className='' type='button' onClick={toggleOuterSpaceMode}>
          <OuterSpace />
        </button>
      </div>
    </>
  )
}

export default BackgroundCanvas
