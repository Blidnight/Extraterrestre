import Entity from './entity'

import Main from '../main'

const LightingInterval = [15000, 20000, 25000]

class StreetLamp extends Entity {
    lampBody : Phaser.GameObjects.Image
    lampLight : Phaser.GameObjects.Image
    lightOn : boolean = true
    count : number = 0
    limit : number = 3000

    constructor(scene : Main) {
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
        this.lampBody.setOrigin(0)
        this.lampLight.setOrigin(0.5, 0)
        this.lampLight.x = 9
    }

    toggleLight() : void {
        this.lightOn = !this.lightOn
        this.lampLight.setVisible(this.lightOn)
        setTimeout(() => {
            this.lampLight.setVisible(true) 
            this.lightOn = true
        }, 200)
    }

    resetInterval() : void {
        let probability : number = Math.random() * 100
        

        this.limit =  LightingInterval[Phaser.Math.Between(0, LightingInterval.length - 1)]
        this.count = 0
    }

    update() : void {
        if (!this.updated) {
            this.view.x = this.position.x
            this.view.y = this.position.y
            this.updated = true
        }
        if (this.count < this.limit) {
            this.count += 50
        } else {
            this.toggleLight()
            this.resetInterval()
        }
    }

}

export default StreetLamp