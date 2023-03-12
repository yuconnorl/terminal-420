

 // function createSvg() {
    //   const select = (root, selector) =>
    //     Array.prototype.slice.call(root.querySelectorAll(selector))
    //   const loadSvg = (url) => {
    //     return fetch(url)
    //       .then(function (response) {
    //         return response.text()
    //       })
    //       .then(function (raw) {
    //         return new window.DOMParser().parseFromString(raw, 'image/svg+xml')
    //       })
    //   }

      //   const svgPaths = [
      //     'images/yu.svg',
      //     'images/chun.svg',
      //     'images/liu.svg',
      //     'images/frontend.svg',
      //     'images/developer.svg',
      //     'images/from.svg',
      //     'images/taiwan.svg',
      //   ]

    //   const svgPaths = ['images/developer.svg']

    //   svgPaths.forEach((path, index) => {
    //     loadSvg(path).then(function (root) {
    //       const color = Common.choose(['#ececd1'])

    //       const vertexSets = select(root, 'path').map(function (path) {
    //         return Svg.pathToVertices(path, 15)
    //       })

    //       Composite.add(
    //         engine.current.world,
    //         Bodies.fromVertices(
    //           400,
    //           80,
    //           vertexSets,
    //           {
    //             render: {
    //               fillStyle: color,
    //               strokeStyle: color,
    //               lineWidth: 1,
    //             },
    //           },
    //           true,
    //         ),
    //       )
    //     })
    //   })
    // }

    const test = () => {
      // const paths = document.querySelectorAll('#matter-path')
      // console.log(Ch)
      // const vertexSetsA = Svg.pathToVertices(Ch, 6)
      // const svgBody = Bodies.fromVertices(200, 300, vertexSetsA, {
      //   friction: 0.3,
      //   frictionAir: 0.0001,
      //   restitution: 0.8,
      //   render: {
      //     fillStyle: '#fff',
      //     strokeStyle: '#fff',
      //     lineWidth: 1,
      //   },
      // })
      // Composite.add(engine.current.world, svgBody)
    }

    createSvg()