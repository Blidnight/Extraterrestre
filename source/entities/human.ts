import { Entity, EntityState, EntityType, EntityDirection} from '../interfaces/entity'

import { GameObjects, Scene } from 'phaser'

import Main from '../main'


export class Human implements Entity {
    position : Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0)
    type : EntityType = EntityType.HUMAN
    state : EntityState = EntityState.IDLE
    direction : EntityDirection = EntityDirection.LEFT
    view : GameObjects.Sprite 
    viewReady : boolean = false

    constructor(scene : Main, texture : string) {
        scene.addPlayerEntity(texture, (texture: string) => {
           this.view = new GameObjects.Sprite(scene, 0, 0, texture)
           scene.add.existing(this.view)
           this.viewReady = true
        })
    }

    setState(state : EntityState) : void {
        this.state = state
    }

    setDirection(direction : EntityDirection) : void {
        this.direction = direction
    }

    setPosition(position : Phaser.Math.Vector2) : void {
        this.position = position
    }

    update() : void {
        if (this.viewReady) {
            this.view.x = this.position.x
            this.view.y = this.position.y
            this.view.setFlipX(this.direction === EntityDirection.LEFT ? true : false)
        }
    }



}