// @ts-nocheck

import * as Phaser from 'phaser/dist/phaser.min.js'

const svgToDataurl = require('svg-to-dataurl')

let human: any = null
let humanFromBehind: any = null
let spaceship: any = null


export default class EntityTextureManager {
    scene: Phaser.Scene

    entity: number = 0

    humanReady: boolean = false

    constructor(scene: Phaser.Scene) {
        this.scene = scene
    }

    loadRessources (callback : Function) : void {
        this.loadSVGByXHR("human.svg", (humanSVG: HTMLElement) => {
            if (human !== null) {
                return
            }
            human = humanSVG
            this.loadSVGByXHR("human_from_behind.svg", (humanFromBehindSVG: HTMLElement) => {
                humanFromBehind = humanFromBehindSVG
                this.loadSVGByXHR("vaisseau.svg", (vaisseauSVG : HTMLElement) => {
                    spaceship = vaisseauSVG
                    callback(true)
                })
            })
        })
    }


    loadSVGByXHR(url: string, callback: Function): void {
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

    getPlayerEntitiesBase64(colors : Array<string>, callback: Function): void {
        if (human === null) return
        // If source allready loaded
        human.querySelector('.st2').style.fill = colors[0]
        human.querySelector('.st0').style.fill = colors[1]
        humanFromBehind.querySelector('.st2').style.fill =colors[0]
        humanFromBehind.querySelector('.st0').style.fill = colors[1]

        callback([human, humanFromBehind])

    }

    getSpaceShipEntitiesBase64(band: string, callback: Function): void {
        if (spaceship === null) return

        let bands : Array<HTMLElement> = Array.from(spaceship.querySelectorAll('.st2'))
        bands.forEach((bandE: any) => {
            bandE.style.fill = band
        })
        callback(spaceship, 0)
        bands[0].style.fill = "#000"
        callback(spaceship, 1)
        bands[0].style.fill = band
        bands[1].style.fill = "#000"
        callback(spaceship, 2)


    }

    addSVGEntityTexture(name: string, svg: HTMLElement, dimension: any, callback: Function): void {
        let canvas = document.createElement('canvas')
        let context = canvas.getContext('2d')
        let image = new Image()


        image.src = svgToDataurl(svg.innerHTML)
        image.width = canvas.width = dimension.width
        image.height = canvas.height = dimension.height



        image.onload = () => {
            context.drawImage(image, 0, 0)
            this.entity += 1
            let current = name
            this.scene.textures.addBase64(name, canvas.toDataURL('image/png')).on('addtexture', (e: any) => {
                if (e === current) callback(current)
            })
        }
    }

    addPlayerEntity(colors : Array<string>, callback: Function): void {
        let frames: any = []
        this.getPlayerEntitiesBase64(colors, (humanTextures: HTMLElement[]) => {
            humanTextures.forEach((texture: any, key: number) => {
                this.addSVGEntityTexture(`player-${colors[0]}-${colors[1]}-${key}`, texture, { width: 36, height: 75 }, (textureId: string) => {
                    frames.push(textureId)
                    
                    if (frames.length === 2) callback(frames)
                })
            })

        })
    }

    addSpaceShipEntity(band: string, callback: Function): void {
        let frames: any = []
        this.getSpaceShipEntitiesBase64(band, (spaceship: HTMLElement, key : any) => {

            this.addSVGEntityTexture(`spaceship-${band}-${key}`, spaceship, { width: 200, height: 100 }, (textureId: string) => {
                frames.push(textureId)
                console.log(textureId)
                if (frames.length === 3) callback(frames)
            })
        })
    }
}