// @ts-nocheck

import * as Phaser from 'phaser/dist/phaser.min.js'

class Bob extends Phaser.GameObjects.Blitter {

}

class Main extends Phaser.Scene {
    constructor()  {
        super("main")
    }

    preload() : void {
        this.load.atlas('flares', 'flares.png', 'flares.json');
        this.load.image("rocher", "rocher.png")
    }

    player : Phaser.GameObjects.Rectangle
    platforms : Phaser.Physics.Arcade.StaticGroup
    create() {
        let vieVaisseau = 5

        // On crée un groupe pour nos vaisseau

        let vaisseaux = this.physics.add.staticGroup()

        // On cree un vaisseau puis on l'ajoute au groupe

        let vaisseau1 = this.add.rectangle(400, 100, 100, 100, 0xFF0000)

        // On l'ajoute au groupe
        vaisseaux.add(vaisseau1)
        // Ici on va ajouter un event, a chaque fois on clique sur la scene bah ca va tierer un projectile

        this.input.on('pointerdown', (pointer : any) => {
            let bullet = this.add.rectangle(20, pointer.y, 20, 20, 0xFF)
            this.physics.add.existing(bullet)
            let bBody = bullet.body as Phaser.Physics.Arcade.Body
            bBody.allowGravity = false
            bBody.setVelocityX(300)

            // On ajoute un collider entre le bullet et le groupe des vaisseau

            this.physics.add.collider(vaisseaux, bullet, (a : any, b : any) => {
                a.destroy()
                if (vieVaisseau > 0) {
                    vieVaisseau -= 1
                } else {
                    b.destroy()
                }

            })
        })
    



        //emiter.explode(200, 500,200)

    

       // setTimeout(() => {emiter.explode(2000, 500, 200)}, 2000)

        

    }
}

const config : any = {
    width : 800,
    height : 600,
    scene : [Main],
    physics : {
        default : 'arcade',
        arcade : {
            debug : true,
            gravity : {
                y : 300
            }
        }
    }
}

const game : Phaser.Game = new Phaser.Game(config)