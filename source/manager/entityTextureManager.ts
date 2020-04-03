import IEntityTextureManager from '../interfaces/entityTextureManager'

const svgToDataurl = require('svg-to-dataurl')

let human: any = null
let humanFromBehind: any = null
let spaceship: any = null


export default class EntityTexturemanager implements IEntityTextureManager {
    scene : Phaser.Scene

    entity : number = 0

    constructor(scene : Phaser.Scene) {
        this.scene = scene
    }
    
    loadSVGByXHR(url: string, callback: Function) : void {
        let xhr = new XMLHttpRequest()

        xhr.open('get', url)
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let svgContainer = <HTMLElement>document.createElement('div')
                svgContainer.innerHTML = xhr.responseText
                callback(svgContainer)
            }
        }
        xhr.send(null)
    }

    getPlayerEntitiesBase64(head: string, callback: Function): void {
        if (human === null) {

            this.loadSVGByXHR("human.svg", (humanSVG: HTMLElement) => {
                if (human !== null) {
                    callback([human, humanFromBehind])
                    return
                }
                human = humanSVG
                human.querySelector('.st2').style.fill = head
                this.loadSVGByXHR("human_from_behind.svg", (humanFromBehindSVG: HTMLElement) => {
                    humanFromBehind = humanFromBehindSVG
                    humanFromBehind.querySelector('.st2').style.fill = head
                    callback([human, humanFromBehind])
                })
            })

            console.log("NHS")



        } else {
            // If source allready loaded
            human.querySelector('.st2').style.fill = head
            humanFromBehind.querySelector('.st2').style.fill = head
            callback([human, humanFromBehind])
        }
    }

    getSpaceShipEntitiesBase64(band: string, callback: Function): void {
        if (spaceship === null) {
            let xhr = new XMLHttpRequest()
            xhr.open('get', "vaisseau.svg")
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    spaceship = <HTMLElement>document.createElement('div')
                    spaceship.innerHTML = xhr.responseText
                    let bands = Array.from(spaceship.querySelectorAll('.st2'))
                    bands.forEach((bandE: any) => {
                        bandE.style.fill = band
                    })
                    callback(spaceship)
                    let a = <HTMLElement>bands[0]
                    let b = <HTMLElement>bands[1]
                    a.style.fill = "#000"
                    callback(spaceship)
                    a.style.fill = band
                    b.style.fill = "#000"
                    callback(spaceship)
                }
            }
            xhr.send(null)
        } else {
            let bands = Array.from(spaceship.querySelectorAll('.st2'))
            bands.forEach((bandE: any) => {
                bandE.style.fill = band
            })
            callback(spaceship)

        }
    }

    addSVGEntityTexture(svg: HTMLElement, dimension: any, callback: Function) : void {
        let canvas = document.createElement('canvas')
        let context = canvas.getContext('2d')
        let image = new Image()

        document.body.appendChild(svg)

        image.src = svgToDataurl(svg.innerHTML)
        image.width = canvas.width = dimension.width
        image.height = canvas.height = dimension.height

        image.onload = () => {
            context.drawImage(image, 0, 0)
            this.entity += 1
            let current = `entity${this.entity}`
            this.scene.textures.addBase64(`entity${this.entity}`, canvas.toDataURL('image/png')).on('addtexture', (e: any) => {
                if (e === current) callback(current)
            })
        }
    }

    addPlayerEntity(headColor: string, callback: Function): void {
        let frames: any = []
        this.getPlayerEntitiesBase64(headColor, (humanTextures: HTMLElement[]) => {
            humanTextures.forEach((texture: any) => {
                this.addSVGEntityTexture(texture, { width: 100, height: 100 }, (textureId: string) => {
                    frames.push(textureId)
                    if (frames.length === 2) callback(frames)
                })
            })

        })
    }

    addSpaceShipEntity(band: string, callback: Function): void {
        let frames: any = []
        this.getSpaceShipEntitiesBase64(band, (spaceship: HTMLElement) => {

            this.addSVGEntityTexture(spaceship, { width: 200, height: 100 }, (textureId: string) => {
                frames.push(textureId)
                if (frames.length === 3) callback(frames)
            })
        })
    }
}