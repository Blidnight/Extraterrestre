import { IEntity, StaticValue } from "../interfaces/entity"

export default abstract class Entity implements IEntity {

    position: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0)
    type: StaticValue.EntityType = StaticValue.EntityType.HUMAN
    state: StaticValue.EntityState = StaticValue.EntityState.IDLE
    direction: StaticValue.EntityDirection = StaticValue.EntityDirection.LEFT
    view: any
    viewReady: boolean = false
    updated: boolean = true

    setState(state: StaticValue.EntityState): void {
        this.state = state
        this.updated = false
    }

    setDirection(direction: StaticValue.EntityDirection): void {
        this.direction = direction
        this.updated = false
    }

    setPosition(position: Phaser.Math.Vector2): void {
        this.position = position
        this.updated = false
    }

    update(): void {
        
    }
}