import Entity from './entity'

import Main from '../main'

import { StaticValue } from '../interfaces/entity'

export default class Spaceship extends Entity {
    static count: number = 0

    view: Phaser.GameObjects.Container

    spaceship: Phaser.GameObjects.Sprite

    light: Phaser.GameObjects.Rectangle

    id: number

    constructor(scene: Main, color: string) {
        super()
        this.id = Spaceship.count
        Spaceship.count += 1
        scene.entityTextureManager.addSpaceShipEntity(color, (frames: any) => {
            this.view = new Phaser.GameObjects.Container(scene, 0, 0)
            this.spaceship = new Phaser.GameObjects.Sprite(scene, 0, 0, frames[0]).setOrigin(0.5, 0)
            this.light = new Phaser.GameObjects.Rectangle(scene, 0, 20, 50, 1800, 0xFF0000)
            this.light.setAlpha(0.4)
            this.light.setOrigin(0.5, 0)
            this.viewReady = true

            scene.anims.create({
                key: `SpaceShip-Moving-${this.id}`,
                frames: [
                    { key: frames[1], frame: null },
                    { key: frames[2], frame: null },
                ],
                frameRate: 2,
                repeat: -1
            })

            scene.anims.create({
                key: `SpaceShip-Idle-${this.id}`,
                frames: [
                    { key: frames[0], frame: null }
                ],
                repeat: 1
            })
            
            scene.add.existing(this.view)
            scene.add.existing(this.spaceship)

            this.view.add(this.light)
            this.view.add(this.spaceship)

            this.setState(StaticValue.EntityState.IDLE)

        })
    }

    setState(state: StaticValue.EntityState): void {
        this.state = state
        this.updated = false
    }

    playMovingAnimation(): void {
        this.spaceship.play(`SpaceShip-Moving-${this.id}`, true)
        this.light.setVisible(false)
    }

    playIdleAnimation(): void {
        this.spaceship.play(`SpaceShip-Idle-${this.id}`, true)
        this.light.setVisible(false)
    }

    playSpaceAttackAnimation(): void {
        this.spaceship.play(`SpaceShip-Idle-${this.id}`, true)
        this.light.setVisible(true)
    }

    update(): void {
        if (this.view !== undefined) {
            this.view.x = this.position.x
            this.view.y = this.position.y
            this.spaceship.setFlipX(this.direction === StaticValue.EntityDirection.LEFT ? true : false)
            if (this.state === StaticValue.EntityState.IDLE) this.playIdleAnimation()
            else if (this.state === StaticValue.EntityState.MOVING) this.playMovingAnimation()
            else if (this.state === StaticValue.EntityState.ATTACK) this.playSpaceAttackAnimation()
            this.updated = true
        }
    }
}