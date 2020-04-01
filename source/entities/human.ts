import Entity from './entity'

import Main from '../main'

import { StaticValue } from '../interfaces/entity'

export default class Human extends Entity {
    
    view : Phaser.GameObjects.Sprite 

    constructor(scene : Main, texture : string) {
        super()
        scene.addPlayerEntity(texture, (texture: string) => {
           this.view = new Phaser.GameObjects.Sprite(scene, 0, 0, texture)
           scene.add.existing(this.view)
           this.viewReady = true
        })
    }

    update() : void {
        if (this.viewReady && !this.updated) {
            this.view.x = this.position.x
            this.view.y = this.position.y
            this.view.setFlipX(this.direction === StaticValue.EntityDirection.LEFT ? true : false)
            this.updated = true
        }
    }
}