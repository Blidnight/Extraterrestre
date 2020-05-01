// @ts-nocheck

import * as Phaser from 'phaser/dist/phaser.min.js'

import EntityTextureManager from './manager/textureManager'

import IntroductionScene from './introduction'

import GameOver from './gameover'

import Play from './play'

import { shirtColor, spaceShipColor, headColor } from './data/color'

import "./css/index.css"

class StreetLampEntity extends Phaser.GameObjects.Container {
    body: Phaser.GameObjects.Image
    light: Phaser.GameObjects.Image
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y)

        this.body = new Phaser.GameObjects.Image(this.scene, 0, 0, "street_lamp_body").setOrigin(0.5, 0)
        this.light = new Phaser.GameObjects.Image(this.scene, 0, 0, "street_lamp_light").setOrigin(0.5, 0)

        this.add([this.body, this.light])
        this.makeLightEffect(true)
        scene.add.existing(this)
    }

    makeLightEffect(ignore?: boolean): void {
        setTimeout(() => { this.makeLightEffect(false) }, Phaser.Math.Between(10, 25) * 1000)
        if (ignore) return
        this.light.setVisible(false)
        setTimeout(() => {
            this.light.setVisible(true)
            setTimeout(() => {
                this.light.setVisible(false)
                setTimeout(() => {
                    this.light.setVisible(true)
                }, 60)
            }, 60)
        }, 60);
    }
}

export default class Main extends Phaser.Scene {

    textureManager: EntityTextureManager = new EntityTextureManager(this)

    soundButton : any

    constructor() {
        super("main")
    }


    preload(): void {
        this.load.image("street_lamp_body", "street_lamp_body.png")
        this.load.image("street_lamp_light", "street_lamp_light.png")
        this.load.image("starry_night", "starry_night.png")
        this.load.image("building", "building.png")
        this.load.image("ground", "ground.png")
        this.load.image("choc", "choc.png")
        this.load.image("buisson1", "buisson1.png")
        this.load.image("buisson2", "buisson2.png")
        this.load.image("arbre1", "arbre1.png")
        this.load.image("arbre2", "arbre2.png")
        this.load.image("rocher", "rocher.png")
        this.load.image("nuage1", "nuage1.png")
        this.load.image("nuage2", "nuage2.png")
        this.load.image("arme", "arme.svg")
        this.load.image("joueur", "joueur.svg")
        this.load.image("bulle-warning", "bulle-attention.png")
        this.load.image("vaisseau-fond", "vaisseau-fond.png")
        this.load.image("titre", "titre.png")
        this.load.image("background", "background.png")
        this.load.image("bt-jouer", "bt-jouer.png")
        this.load.image("bt-rejouer", "bt-rejouer.png")
        this.load.audio('gun_special_shoot', ['gunshoot.mp3'])
        this.load.audio('gun_normal_shoot', ['gunnormalshoot.mp3'])
        this.load.audio('gun_reload', ["reload.mp3"])
        this.load.audio('degats', ['degats.wav'])
        this.load.atlas('flares', 'flares.png', 'flares.json');
        this.load.image("arrow", "arrow.png")
        this.load.spritesheet("smoke", "smoke.png", {frameWidth : 58 / 3, frameHeight : 98})
        this.load.image("son", "son.png")
    }

    createBackground(): void {
        
        this.add.image(0, 0, "starry_night").setOrigin(0).setDepth(0)
        this.add.image(0, config.height - 280, "building").setOrigin(0).setDepth(0)
        this.add.image(0, 482, "buisson1")
        this.add.image(800 - 170, 445, "arbre2")
        this.add.image(435, 490, "rocher")
        this.add.image(290, 495, "buisson2")
        this.add.image(150, 460, "arbre1")
        this.add.image(800 - 100, 482, "buisson1")
        this.add.image(0, config.height - 95, "ground").setOrigin(0).setDepth(0)

        this.soundButton = this.add.image(config.width - 30, config.height - 30, "son").setDisplaySize(40, 40)

        this.soundButton.setDepth(192992929)

        this.soundButton.setInteractive({useHandCursor : true})

        this.soundButton.on('pointerdown', () => {
            this.sound.mute = !this.sound.mute
        })

    }
    
    createMenue() : void {
        let scene = this

        function startScene() : void {
            scene.scene.start("introduction")
        }
        this.createBackground()
        new StreetLampEntity(this, 0, 340)
        new StreetLampEntity(this, 250, 340)
        new StreetLampEntity(this, 500, 340)
        new StreetLampEntity(this, 800, 340)
        let logo = this.add.image(config.width / 2, config.height / 2, "titre")
        logo.y = logo.y - logo.height - 20

        this.add.image(config.width / 2 + 20, 520, `player-${headColor[5]}-${shirtColor[0]}-1`)
        this.add.image(config.width / 2 - 20, 520, `player-${headColor[3]}-${shirtColor[3]}-1`)

        let play =this.add.image(config.width / 2 - 70, config.height / 2 + 120, "bt-jouer")

        
      
        play.setInteractive({useHandCursor : true})
        play.on('pointerover', () => {
            play.alpha = 0.6
        })

        play.on('pointerout', () => {
            play.alpha = 1
        })

        play.on('pointerdown', startScene)
        
        
        
        this.tweens.add({
            targets : logo,
            y : logo.y + 10,
            yoyo : true,
            duration : 1000,
            repeat : -1
        }) 

        this.tweens.add({
            targets : play,
            alpha : 0.8,
            yoyo : true,
            duration : 700,
            repeat : -1
        }) 

 
    }

    create(): void {
        this.input.setPollAlways();
        this.scale.startFullscreen()
        document.body.style.height = "auto"
        document.querySelector("html").style.height = "auto"
        document.querySelector('.playButton').onclick = () => {
            document.body.style.height = "100%"
            document.querySelector("html").style.height = "100%"
            document.querySelector('canvas').style.display = "block"
            if (!this.scale.isFullscreen) this.scale.startFullscreen()
        }

        let loadingText = this.add.text(config.width / 2, config.height / 2, "Image Generated : 0").setOrigin(0.5)
        let generatedImages = 0
        this.textureManager.loadRessources((loaded: boolean) => {
            let loadedF = 0
            headColor.forEach((headColor: string, key: number) => {
                shirtColor.forEach((shirtColor: string) => {
                    this.textureManager.addPlayerEntity([headColor, shirtColor], (textures: any) => {

                        loadedF += 1

                        //onsole.log(textures)

                        generatedImages += 1

                        loadingText.text = "Image Generated : " + generatedImages

                        if (loadedF === (headColor.length * shirtColor.length) + spaceShipColor.length) {
                            this.createMenue()
                        }
                    })
                })
            })

            spaceShipColor.forEach((color: any) => {
                this.textureManager.addSpaceShipEntity(color, (textures: any) => {
                    this.anims.create({
                        key: `spaceship-${color}-moving`,
                        frames: [
                            { key: textures[1], frame: null },
                            { key: textures[2], frame: null }
                        ],
                        duration: 500,
                        repeat: -1
                    })
                    this.anims.create({
                        key: `spaceship-${color}-idle`,
                        frames: [
                            { key: textures[0], frame: null }
                        ]
                    })

                    loadedF += 1

                   


                })
            })
        })






    }

    update(time : number, delta : number): void {
        console.log(this.input.x, this.input.y, this.world)
        this.input.updatePoll(time, delta)
        if(this.soundButton === undefined) return
        if (this.sound.mute) this.soundButton.alpha = 0.2
        else this.soundButton.alpha = 1

    }
}

const config: any = {
    width: 800,
    height: 600,
    scene: [Main, IntroductionScene, Play, GameOver],
    scale: {
        mode: Phaser.Scale.ENVELOPE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 630
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity : {
                y : 1000
            }
        }
    }
}

const game: Phaser.Game = new Phaser.Game(config)
const image_preview = <HTMLElement>document.querySelector('.image_preview')
const captures = Array.from(document.querySelector('.galerie').children)

image_preview.onclick = (e) => {
   
    image_preview.style.display = "none"
}

image_preview.querySelector('img').onclick = (e) => {
    e.stopPropagation()
}

captures.forEach((capture : any) => {
    capture.onclick = (e : any) => {
        let id = e.target.id
        image_preview.querySelector('img').src = `${id}.png`
        image_preview.style.display = "flex"
    }
})

setInterval(() => {
    let canvas = Array.from(document.querySelectorAll('canvas'))
})
