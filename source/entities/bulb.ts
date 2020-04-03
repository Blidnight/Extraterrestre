import Entity from './entity'

export default class Bulb extends Entity {
    constructor(text : string, scene : Phaser.Scene) {
        super()
        this.view = new Phaser.GameObjects.Text(scene, 0, 0, text,{ wordWrap: { width: 250, useAdvancedWrap: true }})
        scene.add.existing(this.view)
    }

    update() : void{
        if (this.view === undefined) return
        this.view.x = this.position.x
        this.view.y = this.position.y
    }
}