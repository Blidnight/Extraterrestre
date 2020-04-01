import Entity from './entity'

import Main from '../main'

const LightingInterval = [3000, 1000, 800, 200]

class StreetLamp extends Entity {
    lampBody : Phaser.GameObjects.Image
    lampLight : Phaser.GameObjects.Image
    lightOn : boolean = true
    count : number = 0
    limit : number = 3000

    constructor(scene : Main, texture : string) {
        super()
        this.view = new Phaser.GameObjects.Container(scene, 0, 0)
        this.lampBody = new Phaser.GameObjects.Image(scene, 0, 0, 'street_lamp_body')
        this.lampLight = new Phaser.GameObjects.Image(scene, 0, 0, "street_lamp_light")
        this.view.add(this.lampBody)
        this.view.add(this.lampLight)
        this.initLamp()

        scene.add.existing(this.view)
    }

    initLamp() : void {
        this.lampLight.setOrigin(0.5, 0)
        this.lampLight.x = 9
    }

    toggleLight() : void {
        if (this.lightOn) {
            this.lightOn = false
            this.lampLight.setVisible(false)
        } else {
            this.lightOn = true
            this.lampLight.setVisible(true)
        }
    }

    resetInterval() : void {
        this.count = 0
        this.limit = LightingInterval[Phaser.Math.Between(0, LightingInterval.length - 1)]
    }

    update() : void {
        if (!this.updated) {
            this.view.x = this.position.x
            this.view.y = this.position.y
            this.updated = true
        }
        if (this.count < this.limit) {
            this.count += 20
            console.log(this.count)
        } else {
            this.toggleLight()
            this.resetInterval()
        }
    }

}

export default StreetLamp