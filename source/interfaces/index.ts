import { Tile, CartesianPoint, IsometricPoint } from '../entities'

export interface ITile {
    canvas : HTMLCanvasElement,
    context : CanvasRenderingContext2D,
    position : IsometricPoint,
    fillStyle : string,
    models : any,
    width : number,
    height : number,
    render() : void
}

export interface ICartesianPoint {
    x : number,
    y : number
}

export interface IIsometricPoint {
    x : number,
    y : number,
    z : number,
    setPosition(x : number, y : number, z : number) : IsometricPoint,
    getPosition() : IsometricPoint
}

export interface IScene {
    canvas : HTMLCanvasElement,
    context : CanvasRenderingContext2D,
    addTile(tile : Tile) : void
}
