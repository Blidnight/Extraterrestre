import { GameObjects } from 'phaser'

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



export interface Entity {
    position : Phaser.Math.Vector2,
    type : EntityType,
    state : EntityState,
    direction : EntityDirection,
    view : GameObjects.Sprite
    setState(state : EntityState) : void
    setDirection(direction : EntityDirection) : void
    setPosition(position : Phaser.Math.Vector2) : void
    update() : void
}