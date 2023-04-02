'use client'
import clsx from 'clsx'
import {
  Bodies,
  Body,
  Common,
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
import { useCallback, useEffect, useRef, useState } from 'react'

import {
  BODIES_DIMENSION,
  COLOR_ARRAY,
  RATIO_CONSTANT,
  removeSensorOptions,
  WALL_THICKNESS,
} from '@/configs/matter'
import { getAngle } from '@/helper/angle'

import Tooltip from './Tooltip'

const BackgroundCanvas = () => {
  const scene = useRef<HTMLDivElement>(null)
  const engine = useRef<Engine>(Engine.create())
  const [isSpaceMode, setIsSpaceMode] = useState<boolean>(false)

  function onPartyStart(number: number) {
    const resizeRatioP =
      window.innerWidth < 500
        ? (window.innerWidth / 1380) * RATIO_CONSTANT
        : window.innerWidth < 1380
        ? window.innerWidth / 1680
        : (window.innerWidth / 2560) * RATIO_CONSTANT

    for (let i = 0; i < number; i++) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const color: string = Common.choose(COLOR_ARRAY)
      const random = Math.random() * 1.33
      const weedBody = Bodies.rectangle(
        scene.current
          ? scene.current.clientWidth / 2 + i * 5
          : window.innerWidth / 2,
        -i * 5,
        (300 * resizeRatioP - 20) * random,
        (300 * resizeRatioP - 20) * random,
        {
          friction: 0.3,
          frictionAir: 0.001,
          restitution: 0.8,
          label: 'weed',
          render: {
            sprite: {
              texture: `images/weedpng.png`,
              xScale: resizeRatioP * random,
              yScale: resizeRatioP * random,
            },
          },
        },
      )
      const circle = Bodies.circle(
        scene.current ? scene.current.clientWidth / 2 : window.innerWidth / 2,
        10,
        10 + Math.random() * 25,
        {
          friction: 0.3,
          frictionAir: 0.0001,
          restitution: 0.8,
          render: {
            fillStyle: color,
            strokeStyle: color,
            lineWidth: 1,
          },
        },
      )
      if (random < 0.6 && random > 0.4) {
        Composite.add(engine.current.world, weedBody)
      }
      Composite.add(engine.current.world, circle)
    }
  }

  function onRemoveClick() {
    // turn space mode off
    engine.current.gravity = { x: 0, y: 1, scale: 0.001 }
    setIsSpaceMode(false)
    document.removeEventListener('mousemove', onMousemove)

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

  const onMousemove = useCallback((e: MouseEvent) => {
    const html = document.getElementById('root')
    const mouseX = e.clientX
    const mouseY = e.clientY
    const centerX = scene.current
      ? scene.current.clientWidth / 2
      : window.innerWidth
    const centerY = scene.current
      ? scene.current.clientHeight / 2
      : window.innerHeight

    const angleDeg = getAngle(mouseX, mouseY, centerX, centerY)
    if (!html) return
    html.style.filter = `hue-rotate(${angleDeg}deg)`
  }, [])

  function toggleOuterSpaceMode() {
    if (!isSpaceMode) {
      engine.current.gravity = { x: 0, y: 0, scale: 0.001 }
      setIsSpaceMode(true)
      document.addEventListener('mousemove', onMousemove)
      return
    }

    engine.current.gravity = { x: 0, y: 1, scale: 0.001 }
    setIsSpaceMode(false)
    document.removeEventListener('mousemove', onMousemove)
  }

  useEffect(() => {
    const resizeRatio =
      window.innerWidth < 500
        ? (window.innerWidth / 1380) * RATIO_CONSTANT
        : window.innerWidth < 875
        ? (window.innerWidth / 1680) * RATIO_CONSTANT
        : window.innerWidth < 1380
        ? window.innerWidth / 1680
        : (window.innerWidth / 2560) * RATIO_CONSTANT

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

    // After removing all elements, return the ground
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

      Body.setPosition(
        removeSensor,
        Vector.create(
          scene.current ? scene.current.clientWidth / 2 : window.innerWidth / 2,
          scene.current
            ? scene.current.clientHeight + WALL_THICKNESS * 5
            : window.innerHeight + WALL_THICKNESS * 5,
        ),
      )

      Body.setPosition(
        removeSensorRight,
        Vector.create(
          scene.current
            ? scene.current.clientWidth + WALL_THICKNESS * 3
            : window.innerWidth + WALL_THICKNESS * 3,
          scene.current
            ? scene.current.clientHeight / 2
            : window.innerHeight / 2,
        ),
      )
    }

    // TODO: clean me
    window.addEventListener('resize', handleResize)

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
        BODIES_DIMENSION[word].width * resizeRatio,
        BODIES_DIMENSION[word].height * resizeRatio,
        {
          friction: 0.3,
          frictionAir: 0.001,
          restitution: 0.8,
          label: word,
          render: {
            sprite: {
              texture: `images/${word}.png`,
              xScale: resizeRatio,
              yScale: resizeRatio,
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

    Render.run(render)

    // create runner
    const runner = Runner.create()
    // run the engine
    Runner.run(runner, engine.current)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', onMousemove)

      Render.stop(render)
      Composite.clear(engine.current.world, true)
      Engine.clear(engine.current)
      render.canvas.remove()
      render.textures = {}
    }
  }, [onMousemove])

  return (
    <>
      <div
        ref={scene}
        className={clsx(
          'absolute top-0 left-0 z-0 h-full w-full bg-galaxy',
          isSpaceMode
            ? 'bg-cover bg-center bg-no-repeat'
            : 'bg-[length:0px_0px]',
        )}
      />
      <div className='absolute right-2 top-2 flex flex-col gap-3 md:right-4 md:top-4 md:gap-4'>
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
          onClick={() => onPartyStart(20)}
          isSpaceMode
        />
      </div>
    </>
  )
}

export default BackgroundCanvas
