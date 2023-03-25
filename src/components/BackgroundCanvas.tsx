'use client'
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
} from 'matter-js'
import { useEffect, useRef, useState } from 'react'

import {
  BODIES_DIMENSION,
  RATIO_CONSTANT,
  removeSensorOptions,
  WALL_THICKNESS,
} from '@/configs/matter'

import Tooltip from './Tooltip'

const BackgroundCanvas = () => {
  const scene = useRef<HTMLDivElement>(null)
  const engine = useRef<Engine>(Engine.create())
  const [isSpaceMode, setIsSpaceMode] = useState<boolean>(false)

  function onPartyStart(number: number) {
    for (let i = 0; i < number; i++) {
      const circle = Bodies.circle(
        scene.current ? scene.current.clientWidth / 2 : window.innerWidth / 2,
        10,
        10 + Math.random() * 25,
        {
          friction: 0.3,
          frictionAir: 0.0001,
          restitution: 0.8,
        },
      )
      Composite.add(engine.current.world, circle)
    }
  }

  function onRemoveClick() {
    engine.current.gravity = { x: 0, y: 1, scale: 0.001 }
    setIsSpaceMode(false)
    if (!engine.current) return
    const ground = Composite.allComposites(
      engine.current.world,
    )[0]?.bodies.find((body) => body.label === 'ground')

    if (!ground) return

    Body.setPosition(
      ground,
      Vector.create(
        scene.current ? scene.current.clientWidth / 2 : window.innerWidth / 2,
        scene.current
          ? scene.current.clientHeight + WALL_THICKNESS * 4000
          : window.innerHeight + WALL_THICKNESS * 4000,
      ),
    )
  }

  function toggleOuterSpaceMode() {
    if (!isSpaceMode) {
      engine.current.gravity = { x: 0, y: 0, scale: 0.001 }
      setIsSpaceMode((state) => !state)
      return
    }

    engine.current.gravity = { x: 0, y: 1, scale: 0.001 }
    setIsSpaceMode((state) => !state)
  }

  useEffect(() => {
    const render = Render.create({
      element: scene.current as HTMLElement,
      engine: engine.current,
      options: {
        width: scene.current ? scene.current.clientWidth : window.innerWidth,
        height: scene.current ? scene.current.clientHeight : window.innerHeight,
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

    // create composites
    const wallComposite = Composite.create({
      label: 'wall',
    })

    // create left, right wall and ground surfaces
    const leftWall = Bodies.rectangle(
      0 - WALL_THICKNESS / 2,
      scene.current ? scene.current.clientWidth / 2 : window.innerWidth / 2,
      WALL_THICKNESS,
      scene.current ? scene.current.clientHeight * 5 : window.innerHeight * 5,
      {
        isStatic: true,
        label: 'leftWall',
        render: {
          strokeStyle: 'transparent',
          fillStyle: 'transparent',
          lineWidth: 0,
        },
      },
    )

    const rightWall = Bodies.rectangle(
      scene.current
        ? scene.current.clientWidth + WALL_THICKNESS / 2
        : window.innerWidth + WALL_THICKNESS / 2,
      scene.current ? scene.current.clientHeight / 2 : window.innerHeight / 2,
      WALL_THICKNESS,
      scene.current ? scene.current.clientHeight * 5 : window.innerHeight * 5,
      {
        isStatic: true,
        label: 'rightWall',
        render: {
          strokeStyle: 'transparent',
          fillStyle: 'transparent',
          lineWidth: 0,
        },
      },
    )

    const ground = Bodies.rectangle(
      scene.current ? scene.current.clientWidth / 2 : window.innerWidth / 2,
      scene.current
        ? scene.current.clientHeight + WALL_THICKNESS / 2
        : window.innerHeight + WALL_THICKNESS / 2,
      20882,
      WALL_THICKNESS,
      {
        isStatic: true,
        label: 'ground',
        render: {
          strokeStyle: 'transparent',
          fillStyle: 'transparent',
          lineWidth: 0,
        },
      },
    )

    const removeSensor = Bodies.rectangle(
      scene.current ? scene.current.clientWidth / 2 : window.innerWidth / 2,
      scene.current
        ? scene.current.clientHeight + WALL_THICKNESS * 5
        : window.innerHeight + WALL_THICKNESS * 5,
      10000,
      WALL_THICKNESS * 3,
      removeSensorOptions,
    )

    const removeSensorRight = Bodies.rectangle(
      scene.current
        ? scene.current.clientWidth + WALL_THICKNESS * 3
        : window.innerWidth + WALL_THICKNESS * 3,
      scene.current ? scene.current.clientHeight / 2 : window.innerHeight / 2,
      WALL_THICKNESS * 3,
      scene.current ? scene.current.clientHeight * 7 : window.innerHeight * 7,
      removeSensorOptions,
    )

    // remove any elements collide with removeSensor
    Events.on(engine.current, 'collisionStart', (event) => {
      const pairs = event.pairs

      for (let i = 0, j = pairs.length; i != j; ++i) {
        const pair = pairs[i]

        if (
          (pair && pair.bodyA === removeSensor) ||
          (pair && pair.bodyA === removeSensorRight)
        ) {
          Composite.remove(engine.current.world, pair.bodyB)
        }

        if (
          (pair && pair.bodyB === removeSensor) ||
          (pair && pair.bodyA === removeSensorRight)
        ) {
          Composite.remove(engine.current.world, pair.bodyA)
        }
      }
    })

    // make ground return after all elements removed
    Events.on(engine.current.world, 'afterRemove', () => {
      if (engine.current.world.bodies.length) return
      Body.setPosition(
        ground,
        Vector.create(
          scene.current ? scene.current.clientWidth / 2 : window.innerWidth / 2,
          scene.current
            ? scene.current.clientHeight + WALL_THICKNESS / 2
            : window.innerHeight + WALL_THICKNESS / 2,
        ),
      )
    })

    Composite.add(wallComposite, [
      ground,
      leftWall,
      rightWall,
      removeSensor,
      removeSensorRight,
    ])
    Composite.add(engine.current.world, wallComposite)

    function handleResize() {
      render.canvas.width = scene.current
        ? scene.current.clientWidth
        : window.innerWidth
      render.canvas.height = scene.current
        ? scene.current.clientHeight
        : window.innerHeight
      Body.setPosition(
        ground,
        Vector.create(
          scene.current ? scene.current.clientWidth / 2 : window.innerWidth / 2,
          scene.current
            ? scene.current.clientHeight + WALL_THICKNESS / 2
            : window.innerHeight + WALL_THICKNESS / 2,
        ),
      )
      Body.setPosition(
        rightWall,
        Vector.create(
          scene.current
            ? scene.current.clientWidth + WALL_THICKNESS / 2
            : window.innerWidth + WALL_THICKNESS / 2,
          scene.current
            ? scene.current.clientHeight / 2
            : window.innerHeight / 2,
        ),
      )
    }

    // TODO: clean me
    window.addEventListener('resize', handleResize)

    Render.run(render)

    // create runner
    const runner = Runner.create()

    const createWordBody = (
      word: keyof typeof BODIES_DIMENSION,
      index: number,
      ratio: number,
    ) => {
      const body = Bodies.rectangle(
        scene.current
          ? 100 + (index * scene.current.clientWidth) / 6
          : 100 + (index * window.innerWidth) / 6,
        scene.current ? -scene.current.clientHeight : -window.innerHeight,
        BODIES_DIMENSION[word].width * ratio,
        BODIES_DIMENSION[word].height * ratio,
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

    const words: Array<keyof typeof BODIES_DIMENSION> = [
      'hello',
      'im',
      'yu',
      'from',
      'taiwan',
      'hand',
    ]
    const resizeRatio = !scene.current
      ? 0.5 * RATIO_CONSTANT
      : scene.current.clientWidth > 1200
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
      window.removeEventListener('resize', handleResize)
      Render.stop(render)
      Composite.clear(engine.current.world, true)
      Engine.clear(engine.current)
      render.canvas.remove()
      render.textures = {}
    }
  }, [])

  return (
    <>
      <div ref={scene} className='absolute top-0 left-0 z-0 h-full w-full' />
      <div className='absolute right-0 top-2 flex flex-col gap-3 md:right-4 md:top-4 md:gap-4'>
        <Tooltip
          title='Remove'
          icon='TrashBin'
          onClick={onRemoveClick}
          isSpaceMode
        />
        <Tooltip
          title='Space Mode'
          icon='OuterSpace'
          onClick={toggleOuterSpaceMode}
          isSpaceMode={isSpaceMode}
        />
        <Tooltip
          title='Party Time'
          icon='PartyRocket'
          onClick={() => onPartyStart(50)}
          isSpaceMode
        />
      </div>
    </>
  )
}

export default BackgroundCanvas
