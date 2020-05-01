// @ts-nocheck

import * as Phaser from 'phaser/dist/phaser.min.js'

const headColor: Array<string> = `#feeedf
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

const shirtColor: Array<string> = `#f44336
#e91e63
#9c27b0
#673ab7
#3f51b5
#607d8b`.split(`\n`)


const spaceShipColor: Array<string> = `#43eafa
#ff83f0
#ffeb3b
#ff450b
#3050ff`.split('\n')

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

const config = {
    width: 800,
    height: 600
}

export default class GameOver extends Phaser.Scene {
    score  :number = 0
   
    constructor() {
        super("gameOver")
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

    }

    init (data : any) : void {
        console.log(data)
        this.score = data.score
    }
    create() : void {
        this.createBackground()
        let rejouerBouton = this.add.image(config.width / 2, config.height / 2, "bt-rejouer")
       
        let spaceship = this.add.sprite(config.width / 2, config.height / 2, `spaceship-${spaceShipColor[1]}-0`)
        spaceship.play(`${spaceShipColor[0]}-moving`)
        rejouerBouton.x += spaceship.width / 2
        rejouerBouton.y -= (spaceship.height / 2 + 70)
        rejouerBouton.setInteractive({useHandCursor : true})
        rejouerBouton.on('pointerdown', () => {
            this.scene.start('play')
        })
        this.add.text(config.width / 2, config.height / 2 + spaceship.height, " Score : " + this.score).setOrigin(0.5)

        
    }

}