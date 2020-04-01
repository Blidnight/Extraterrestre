import { GameObjects } from 'phaser'

export namespace StaticValue {
    export enum EntityType {
        HUMAN,
        SPACE_SHIP,
        ALIEN
    }
    
    export enum EntityState {
        IDLE,
        MOVING
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
    view : Phaser.GameObjects.Sprite | Phaser.GameObjects.Container,
    updated : boolean
    setState(state : StaticValue.EntityState) : void
    setDirection(direction : StaticValue.EntityDirection) : void
    setPosition(position : Phaser.Math.Vector2) : void
    update() : void
}