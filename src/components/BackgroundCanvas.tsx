'use client'
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Bodies,
  Composite,
  Engine,
  Mouse,
  Render,
  Runner,
  World,
} from 'matter-js'
import { useEffect, useRef } from 'react'

const BackgroundCanvas = () => {
  const scene = useRef()
  const engine = useRef(Engine.create())

  useEffect(() => {
    // mount
    const cw = 1000
    const ch = 1000

    const render = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: '#fff',
      },
    })

    const mouse = Mouse.create(render.canvas)

    const boxA = Bodies.rectangle(100, 200, 80, 80)
    const boxB = Bodies.rectangle(150, 50, 80, 80)
    const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true })

    Mouse.setElement(mouse, mouse.element)

    Composite.add(engine.current.world, [boxA, boxB, ground])

    Render.run(render)

    // create runner
    const runner = Runner.create()

    // run the engine
    Runner.run(runner, engine.current)

    return () => {
      Render.stop(render)
      World.clear(engine.current.world)
      Engine.clear(engine.current)
      render.canvas.remove()
      render.canvas = null
      render.context = null
      render.textures = {}
    }
  }, [])

  return <div ref={scene} style={{ width: '100%', height: '100%' }} />
}

export default BackgroundCanvas
