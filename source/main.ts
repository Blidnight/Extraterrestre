import { ITile, ICartesianPoint, IIsometricPoint } from './interfaces'

import { Tile, CartesianPoint, IsometricPoint, Scene } from './entities'


const scene : Scene = new Scene()

const TILE_COLOR : string = "#0000ff"

scene.canvas.width = window.innerWidth
scene.canvas.height = window.innerHeight

const TILEMODELS = new Tile(0, 0, 0, TILE_COLOR)

document.body.appendChild(TILEMODELS.canvas)

for(let y = 0; y < 30; y += 1){
    for (let x = 0; x < 50; x += 1){
        scene.addTile(new Tile(x * 32, y * 32, 0, TILE_COLOR, TILEMODELS.canvas))
    }
}
