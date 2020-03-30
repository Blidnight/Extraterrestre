import { ITile, ICartesianPoint, IIsometricPoint, IScene } from '../interfaces'


class CartesianPoint implements ICartesianPoint {
    public x: number
    public y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
}

class IsometricPoint implements IIsometricPoint {

    public x: number
    public y: number
    public z: number

    public constructor(x: number, y: number, z: number) {
        this.x = x
        this.y = y
        this.z = z
    }

    public getPosition(): IsometricPoint {
        return this
    }

    public setPosition(x: number, y: number, z: number): IsometricPoint {
        if (x !== undefined) this.x = x
        if (y !== undefined) this.y = y
        if (z !== undefined) this.z = z
        return this
    }

    public static from(point: CartesianPoint): IsometricPoint {
        let x: number = point.x - point.y
        let y: number = (point.y + point.x) / 2

        return new IsometricPoint(x, y, 0)
    }

}

class Scene implements IScene {

    public canvas: HTMLCanvasElement
    public context: CanvasRenderingContext2D

    private draging: boolean = false
    private dragingPosition: CartesianPoint = new CartesianPoint(0, 0)
    private dragingOffset: CartesianPoint = new CartesianPoint(0, 0)
    private entities: any = [[]]

    public constructor(parentElement: string = null) {
        this.canvas = <HTMLCanvasElement>document.createElement('canvas')
        this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d')
        try {
            document.querySelector(parentElement).appendChild(this.canvas)
        } catch  {
            document.body.appendChild(this.canvas)
        }
        this.registerEvents()
    }

    public addTile(tile: Tile): void {
        this.entities[0].push(tile)
        this.render()
    }

    private render(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.context.save()
        this.context.translate(this.dragingPosition.x, this.dragingPosition.y)
        this.entities[0].forEach((entity: Tile) => {
            if (entity.canvas === null) this.context.drawImage(entity.models, entity.position.x - 32, entity.position.y)
            else this.context.drawImage(entity.canvas, entity.position.x - 32, entity.position.y)
        })
        this.context.restore()
    }

    private registerEvents(): void {
        this.registerDragEvent()
    }

    private registerDragEvent() {
        this.canvas.addEventListener('mousedown', (e: any) => {
            this.draging = true
            this.dragingOffset = new CartesianPoint(e.clientX - this.dragingPosition.x, e.clientY - this.dragingPosition.y)
        })

        this.canvas.addEventListener('mousemove', (e: any) => {
            if (this.draging) {
                this.dragingPosition.x = e.clientX - this.dragingOffset.x
                this.dragingPosition.y = e.clientY - this.dragingOffset.y
                this.render()
            }
        })

        this.canvas.addEventListener('mouseup', (e: any) => {
            this.draging = false
        })
    }

}

class Tile implements ITile {

    public canvas: HTMLCanvasElement
    public context: CanvasRenderingContext2D
    public position: IsometricPoint
    public width: number
    public height: number
    public fillStyle: string
    public models: any

    public constructor(x: number, y: number, z: number, fillStyle: string, canvas: HTMLCanvasElement = null) {
        this.canvas = canvas === null ? <HTMLCanvasElement>document.createElement('canvas') : null
        this.context = canvas === null ? <CanvasRenderingContext2D>this.canvas.getContext('2d') : null
        this.width = 64
        this.height = 32

        if (canvas !== null) {
            this.models = new Image()
            this.models.src = canvas.toDataURL("image/png")
        } else {
            this.canvas.width = this.width
            this.canvas.height = this.height
        }

        this.position = IsometricPoint.from(new CartesianPoint(x, y))
        this.fillStyle = fillStyle

        if (canvas === null) {
            this.render()
        }
    }

    public render(): void {
        let point: number[] = [0, 0, 32, 0, 32, 32, 0, 32]
        this.initDrawing()
        this.draw(point)
        this.closeDrawing()
    }

    private draw(point: number[]): void {
        for (let i = 0; i < point.length; i += 2) {
            let isometricPoint: IsometricPoint = IsometricPoint.from(new CartesianPoint(point[i], point[i + 1]))
            i === 0 ? this.context.moveTo(isometricPoint.x, isometricPoint.y) : this.context.lineTo(isometricPoint.x, isometricPoint.y)
        }
    }

    private initDrawing(): void {
        this.context.save()
        this.context.translate(32, 0)
        this.context.fillStyle = "#0000ff"
        this.context.beginPath()
    }

    private closeDrawing(): void {
        this.context.closePath()
        this.context.fill()
        this.context.restore()
    }
    
}

export { Tile, CartesianPoint, IsometricPoint, Scene }

