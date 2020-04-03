import { GameObjects } from 'phaser'

export namespace StaticValue {

    export enum SceneState {
        INTRODUCTION_STORY,
        TUTORIAL,
        PLAY
    }

    export enum EntityType {
        HUMAN,
        SPACE_SHIP,
        ALIEN
    }
    
    export enum EntityState {
        IDLE,
        MOVING,
        ATTACK,
        HUMAN_FROM_FRONT,
        HUMAN_FROM_BEHIND,
        HUMAN_BEING_KIDNAPPED
    }
    
    export enum EntityDirection {
        LEFT,
        RIGHT
    }
}


export interface IEntity {
    position : Phaser.Math.Vector2,
    type : StaticValue.EntityType,
    state : StaticValue.EntityState,
    direction : StaticValue.EntityDirection,
    view : Phaser.GameObjects.Sprite | Phaser.GameObjects.Container | Phaser.GameObjects.Image,
    updated : boolean
    setState(state : StaticValue.EntityState) : void
    setDirection(direction : StaticValue.EntityDirection) : void
    setPosition(position : Phaser.Math.Vector2) : void
    update() : void
}