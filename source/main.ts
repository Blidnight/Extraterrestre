import { Game, Scene, Math } from 'phaser'

import { Human } from './entities/human'
import { EntityDirection } from './interfaces/entity'

const svgToDataurl = require('svg-to-dataurl')

let human: any = null
let a: Human, b: Human
let entity: any = 1
let headColor: any = `#feeedf
#f0dcd0
#e2bc9d
#eaaf98
#c7aa95
#b0896d
#c5a198
#a47562
#b47351
#a2704b
#936d52
#765842
#62493e
#534438
#7f432e
#6e3026
#532f18
#452208`.split('\n')
console.log(headColor)


export default class Main extends Scene {
    constructor() {
        super("main")
    }

    preload(): void {
        this.load.image('HUMAN_DOS', "humain-de-dos.svg")
        this.load.svg('HUMAN', "humain.svg", { scale: 2, })
    }

    getPlayerEntitiesBase64(head: string, callback: Function): void {
        if (human === null) {
            let xhr = new XMLHttpRequest()
            xhr.open('get', "humain.svg")
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    human = <HTMLElement>document.createElement('div')
                    human.innerHTML = xhr.responseText
                    human.querySelector('.st2').style.fill = head
                    callback(human)
                }
            }
            xhr.send(null)
        } else {
            console.log("Existed Source")
            human.querySelector('.st2').style.fill = head
            callback(human)
        }
    }

    addPlayerEntityTexture(svg: HTMLElement, callback: Function) {
        let canvas = document.createElement('canvas')
        let context = canvas.getContext('2d')
        let image = new Image()
        image.src = svgToDataurl(svg.innerHTML)
        image.width = canvas.width = 100
        image.height = canvas.height = 200
        image.onload = () => {
            context.drawImage(image, 0, 0)
            entity += 1
            let current = `entity${entity}`
            this.textures.addBase64(`entity${entity}`, canvas.toDataURL('image/png')).on('addtexture', (e: any) => {
                if (e === current) callback(current)
            })
        }
    }

    addPlayerEntity(headColor: string, callback: Function): void {
        this.getPlayerEntitiesBase64(headColor, (human: HTMLElement) => {
            this.addPlayerEntityTexture(human, (textureId: string) => {

                callback(textureId)

            })

        })
    }

    create(): void {
        a = new Human(this, headColor[Math.Between(0, headColor.length - 1)])
        b = new Human(this, headColor[Math.Between(0, headColor.length - 1)])
        a.setDirection(EntityDirection.RIGHT)
        a.setPosition(new Phaser.Math.Vector2(200, 100))
        b.setPosition(new Phaser.Math.Vector2(300, 100))
    }

    update(): void {
        a.update()
        b.update()

    }
}

const config: any = {
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [Main]
}

const game: Game = new Game(config)