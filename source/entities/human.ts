import Entity from './entity'

import Main from '../main'

import { StaticValue } from '../interfaces/entity'

import IHuman from '../interfaces/human'

export default class Human extends Entity implements IHuman {

    state : StaticValue.EntityState.HUMAN_FROM_FRONT

    textures : string[]

    view: Phaser.GameObjects.Image

    constructor(scene: Main, texture: string, position? : any) {
        super()
        scene.entityTextureManager.addPlayerEntity(texture, (textures : any) => {
            this.textures = textures
            
            this.view = new Phaser.GameObjects.Image(scene, 0, 0, textures[0]).setDepth(2)
            this.viewReady = true
            scene.add.existing(this.view)
        })
    }

    showHumanFromBehind() : void {
        this.view.setTexture(this.textures[1])
        this.view.setAngle(0)
    }

    showHumanFromFront() : void {
        this.view.setTexture(this.textures[0])
        this.view.setAngle(0)
    }

    showHumanBeingKidnapped() : void {
        this.view.setTexture(this.textures[0])
        this.view.setAngle(30)
    }

    update(): void {
        if (this.view !== undefined) {
            this.view.x = this.position.x
            this.view.y = this.position.y
            this.view.setFlipX(this.direction === StaticValue.EntityDirection.LEFT ? true : false)

            if (this.state === StaticValue.EntityState.HUMAN_FROM_FRONT) this.showHumanFromFront()
            else if (this.state === StaticValue.EntityState.HUMAN_FROM_BEHIND) this.showHumanFromBehind()
            else if (this.state === StaticValue.EntityState.HUMAN_BEING_KIDNAPPED) this.showHumanBeingKidnapped()


        }
    }
}