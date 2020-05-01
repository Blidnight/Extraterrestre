// @ts-nocheck

import * as Phaser from 'phaser/dist/phaser.min.js'

import { shirtColor, spaceShipColor, headColor } from './data/color'

class EntityState {
    update(): void {

    }
}

class Bullet extends Phaser.GameObjects.Rectangle {
    body: Phaser.Physics.Arcade.Body
    particles: any
    elem: any
    private BulletVector: Array<number>
    constructor(scene: Phaser.Scene, x: number, y: number, angle: number, color: string = "yellow") {
        super(scene, x, y, 30, 10, 0xFFF)
        let play = scene as IntroductionScene
        this.angle = angle
        angle = Phaser.Math.DegToRad(angle)
        this.BulletVector = [Math.cos(angle), Math.sin(angle)]
        play.bullets.add(this)
        play.entities.add(this)
        this.elem = this.scene.add.particles("flares")
        this.particles = this.elem.createEmitter({
            frame: color,
            x: 0,
            y: 0,
            lifespan: 100,
            speed: { min: 0, max: 1200 },
            angle: Phaser.Math.RadToDeg(angle),
            gravityY: 300,
            scale: { start: color === "yellow" ? 0.2 : 0.7, end: 0 },
            quantity: 2,
            blendMode: 'ADD'
        })
        this.setVisible(false)
        scene.add.existing(this)


    }

    update(): void {
        this.body.setVelocityX(-this.BulletVector[0] * 1400)
        this.body.setVelocityY(-this.BulletVector[1] * 1400)
        if (this.x < -90) this.destroy()
        else if (this.x > 1000) this.destroy()
        this.elem.x = this.x
        this.elem.y = this.y


    }
}

class HumanWarriorEntity extends Phaser.Physics.Arcade.Image {
    body: Phaser.Physics.Arcade.Body
    controls: any
    weapon: Phaser.Physics.Arcade.Image
    data: any
    reload: boolean = false
    reloadShape: any
    onAnimationReload: boolean = false
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "joueur")
        let play = scene as IntroductionScene
        this.setDepth(1000)
        let playerSettings = this.scene.add.text(20, config.height - 38, '', { fontFamily: 'Orbitron', color: "#000", fontSize: 15 }).setAlpha(0.6)
        this.reloadShape = this.scene.add.rectangle(this.x, this.y, 100, 10, 0xFFf)
        this.reloadShape.setVisible(false)
        this.setDataEnabled()
        this.data.set("munitions", 20)
        this.data.set("chargeur", 50)
        this.data.set("kills", 0)
        this.data.set("captures", 0)


        playerSettings.setText(
            'Munitions : ' + this.data.get('munitions') +
            '      Chargeurs : ' + this.data.get('chargeur') +
            '      Enemies Vaincus : ' + this.data.get("kills") +
            '      Captures : ' + this.data.get("captures") + ' / 10'
        )
        this.on('changedata', (a: any, value: number) => {
            playerSettings.setText(
                'Munitions : ' + this.data.get('munitions') +
                '      Chargeurs : ' + this.data.get('chargeur') +
                '      Enemies Vaincus : ' + this.data.get("kills") +
                '      Captures : ' + this.data.get("captures") + ' / 10'
            )
        })
        this.weapon = new Phaser.Physics.Arcade.Image(scene, x, y, "arme")
        this.weapon.setScale(0.2)
        this.weapon.setOrigin(0.7, 0.5)
        play.playerGroup.add(this)

        let reloadKey: any = this.scene.input.keyboard.addKeys("R")
        reloadKey.R.onDown = () => {
            this.reload = true
            let reloadSound = this.scene.sound.add("gun_reload", { volume: 0.5 })
            reloadSound.play()

        }

        this.scene.input.on('pointerup', () => {


            if (this.data.get('munitions') <= 0 && !this.reload) {
                this.reload = true
                let reloadSound = this.scene.sound.add("gun_reload", { volume: 0.5 })
                reloadSound.play()

                return
            } else if (this.reload) {
                return
            }

            if (this.data.values.munitions === 20) {
                let shootPower = this.scene.sound.add("gun_special_shoot", { volume: 0.2 })
                shootPower.play()
                new Bullet(this.scene, this.weapon.x, this.weapon.y, this.weapon.angle, "blue")

            } else {
                let shootPower = this.scene.sound.add("gun_normal_shoot", { volume: 0.4 })
                shootPower.play()
                new Bullet(this.scene, this.weapon.x, this.weapon.y, this.weapon.angle)

            }

            this.data.values.munitions -= 1
            this.scene.cameras.main.shake(200, 0.002)

        })

        play.entities.add(this)


        this.setScale(0.5)

        scene.add.existing(this)
        scene.add.existing(this.weapon)

        this.setCollideWorldBounds(true)
        this.registerEvents()
    }

    registerEvents(): void {
        this.controls = this.scene.input.keyboard.addKeys("up, down, left, right, A, D, S, W, Z, Q")
    }

    update(time: number, delta: number): void {
        this.reloadShape.x = this.x + this.width / 4
        this.reloadShape.y = this.y - 55

        if (this.reload) {
            if (!this.onAnimationReload) {
                this.reloadShape.setVisible(true)
                this.reloadShape.width = 0
                this.onAnimationReload = true
                this.scene.tweens.add({
                    targets: this.reloadShape,
                    width: 50,
                    duration: 1000,
                    onComplete: () => {
                        this.onAnimationReload = false
                        this.reload = false
                        if (this.data.values.chargeur > 0) {
                            this.data.values.munitions = 20
                            this.data.values.chargeur -= 1
                        }

                        this.reloadShape.setVisible(false)
                    }
                })
            }
        }

        if (this.controls.left.isDown || this.controls.Q.isDown || this.controls.A.isDown) {
            this.body.setVelocityX(-200)
        }
        else if (this.controls.right.isDown || this.controls.D.isDown) {
            this.body.setVelocityX(200)
        } else this.body.setVelocityX(0)

        if ((this.controls.up.isDown || this.controls.W.isDown || this.controls.Z.isDown) && this.body.touching.down) {
            this.body.setVelocityY(-600)
        }

        if (this.body.velocity.y < 0) {
            this.body.velocity.y += delta
        }

        let angle = Math.round(Phaser.Math.RadToDeg(Phaser.Math.Angle.BetweenPoints(new Phaser.Geom.Point(this.scene.input.x, this.scene.input.y), { x: this.weapon.x, y: this.weapon.y })))


        if (angle > 90 || angle < -90) {
            this.setFlipX(false)
            this.weapon.setFlipY(true)
            this.weapon.angle = angle
        } else {
            this.weapon.angle = angle
            this.setFlipX(true)

            this.weapon.setFlipY(false)
        }



        this.weapon.x = this.x + (this.flipX ? -20 : 20)
        this.weapon.y = this.y + 15




    }
}

class Breath extends EntityState {
    scene: Phaser.Scene
    parent: Human
    loop: boolean = false

    constructor(parent: Human, scene: Phaser.Scene) {
        super()
        this.parent = parent
        this.scene = scene
    }

    breath(makeLoop: boolean = false): void {
        this.loop = true
        this.scene.tweens.add({
            targets: this.parent,
            scaleY: makeLoop ? 0.95 : 1,
            duration: 300,
            onComplete: () => {
                if (makeLoop) this.loop = false
                else this.breath(true)
            }
        })
    }

    update(): void {
        this.parent.scaleX = 1
        if (!this.loop) {
            this.breath()
        }
    }
}

class Walk extends EntityState {
    scene: Phaser.Scene
    parent: Human
    loop: boolean = false

    constructor(parent: Human, scene: Phaser.Scene) {
        super()
        this.parent = parent
        this.scene = scene
    }

    walk(makeLoop: boolean = false): void {
        this.loop = true
        this.scene.tweens.add({
            targets: this.parent,
            scaleX: makeLoop ? 0.95 : 1,
            duration: 300,
            onComplete: () => {
                if (makeLoop) this.loop = false
                else this.walk(true)
            }
        })
    }

    update(): void {
        this.parent.scaleY = 1
        if (!this.loop) {
            this.walk()
        }
    }
}

class ChatBubble extends Phaser.GameObjects.Container {
    transition: number = 0
    parent: Human
    text: string
    callback: Function
    scene: IntroductionScene

    constructor(scene: IntroductionScene, parent: Human, x: number, y: number, text: string, callback: Function) {
        super(scene, x, y)
        this.parent = parent
        this.callback = callback
        this.text = text
        this.setAlpha(0)
        this.createTransitionAnimation()
        scene.add.existing(this)
    }

    bubbleAnim(text: string, cursor: number, message: Phaser.GameObjects.Text, background: Phaser.GameObjects.Rectangle) {
        if (text[cursor] === undefined) {
            this.callback(true)
            return;
        }
        message.text += text[cursor]
        cursor += 1
        background.y = - message.height
        message.y = -message.height

        background.height = message.height

        setTimeout(() => { this.bubbleAnim(text, cursor, message, background) }, 30)
    }

    createTransitionAnimation(): void {
        let background = this.scene.add.rectangle(0, 40, 200, 200, 0xFFFFFF).setOrigin(0)
        let message = this.scene.add.text(20, 40, "", { align: "center", fontSize: 13, fontFamily: "Open Sans", wordWrap: { width: 150 }, color: "#000" })

        background.setVisible(false)

        message.setBackgroundColor("#ffffff").setPadding(10, 10, 10, 10)

        background.height = message.height
        background.y -= message.height
        message.y -= message.height

        this.add(background)
        this.add(message)

        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            duration: 200
        })

        this.scene.tweens.add({
            targets: [background, message],
            y: 0,
            alpha: 1,
            transition: 40,
            duration: 200,
            onComplete: () => {
                console.log(this.text, this.parent)
                this.bubbleAnim(this.text, 0, message, background)
            }
        })
    }
}

interface IAnimationState {
    animationState: EntityState,
    setAnimationState(state: EntityState): void
}


class Human extends Phaser.GameObjects.Sprite implements IAnimationState {

    animationState: EntityState
    controls: any
    body: Phaser.Physics.Arcade.Body
    headColorId: number
    shirtColorId: number
    control: boolean = false
    bubble: ChatBubble
    target: Phaser.Math.Vector2
    scene: IntroductionScene
    moving: boolean = false
    movingCallback: Function

    constructor(scene: IntroductionScene, x: number, y: number, head: number, shirt: number) {
        super(scene, x, y, `player-${headColor[head]}-${shirtColor[shirt]}-0`)
        this.headColorId = head
        this.shirtColorId = shirt
        this.target = new Phaser.Math.Vector2(x, y)
        this.animationState = new Breath(this, this.scene)
        this.setOrigin(0.5, 1)
        this.registerEvents()
        scene.add.existing(this)
        scene.humans.add(this)
    }

    showFromFront(): void {
        this.setTexture(`player-${headColor[this.headColorId]}-${shirtColor[this.shirtColorId]}-0`)
    }

    showFromBehind(): void {
        this.setTexture(`player-${headColor[this.headColorId]}-${shirtColor[this.shirtColorId]}-1`)
    }

    speak(text: string, callback: Function): void {
        if (this.bubble !== undefined) this.bubble.destroy()
        let bulb = new ChatBubble(this.scene, this, this.flipX ? this.x + this.width : this.x - 250, this.y - this.height + 40, text, callback)
        this.bubble = bulb
    }

    registerEvents(): void {
        this.controls = this.scene.input.keyboard.addKeys("W,A,S,D,Z,Q")
    }

    setAnimationState(state: EntityState): void {
        this.animationState = state
        this.setScale(1)
    }

    updateControl(): void {
        if (!this.control) return
        if (this.controls.D.isDown) {
            this.body.setVelocityX(200)

            this.setFlipX(false)
        } else if (this.controls.A.isDown || this.controls.Q.isDown) {
            this.body.setVelocityX(-200)

            this.setFlipX(true)
        } else {
            //this.body.setVelocityX(0)
        }
    }

    moveTo(target: Phaser.Math.Vector2, callback: Function) {
        if (this.moving) return
        this.target = target
        this.moving = true
        this.movingCallback = callback
        this.scene.physics.moveToObject(this, this.target)
    }

    update(): void {
        this.animationState.update()
        this.updateControl()
        this.target.y = this.y
        if (this.moving) {
            if (this.body.speed > 0) {
                let distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y)
                if (distance < 4) {
                    this.body.reset(this.target.x, this.target.y)
                    this.moving = false
                    this.movingCallback(true)
                }
            }
        }



        if (this.bubble !== undefined) {
            this.bubble.x = this.flipX ? this.x + this.width : this.x - 250
            this.bubble.y = this.y - this.height - this.bubble.transition
        }

    }
}

class SpaceshipEntity extends Phaser.Physics.Arcade.Sprite {
    color: string
    spaceLight: Phaser.GameObjects.Rectangle
    life: number = 100
    stopped: boolean = false
    scene: IntroductionScene
    allowChock: boolean = false
    body: Phaser.Physics.Arcade.Body
    smoke: any
    callback: Function
    deadCallback: Function


    constructor(scene: Phaser.Scene, x: number, y: number, color: string, callback: any = null, deadCallback: any = null) {

        super(scene, 1000, Phaser.Math.Between(3, 6) * 35, `spaceship-${color}-0`)


        this.color = color
        this.playMovingAnimation()
        this.setDepth(2)
        this.callback = callback ? callback : null
        this.deadCallback = deadCallback
        scene.add.existing(this)
        this.scene.tweens.add({
            targets: this,
            x: x,
            duration: 4000,
            onComplete: () => {

                setTimeout(() => {
                    this.allowChock = true; this.attack();
                    if (this.callback) this.callback(true)
                }, 1500)
            }
        })

        this.scene.physics.add.existing(this, true)

        this.setInteractive()
        this.scene.entities.add(this)
        this.scene.physics.add.collider(this.scene.bullets, this, (a: any, b: any) => {
            b.elem.destroy()
            let particles = this.scene.add.particles("flares")

            let emiter = particles.createEmitter({
                x: 500,
                y: 200,
                blendMode: "ADD",
                speed: { min: 0, max: 1000 },
                frequency: 3,
                lifespan: { min: 0, max: 100 },
                alpha: { start: 1, end: 0 },
                scale: { start: 0.2, end: 0 },


            })
            emiter.explode(200, b.x, b.y)
            b.destroy()
            if (!this.allowChock) return
            this.life -= 20
            this.scene.cameras.main.shake(200, 0.02)
            let chock = this.scene.add.image(Phaser.Math.Between(-1, 1) * Phaser.Math.Between(5, 15) * 5 + this.x, Phaser.Math.Between(-1, 1) * Phaser.Math.Between(5, 8) * 5 + this.y, "choc")
            chock.setDepth(10)
            let degatsSound = this.scene.sound.add("degats", { volume: 0.5 })
            degatsSound.play()
            setTimeout(() => {
                if (chock === undefined) return
                chock.destroy()
            }, 500)
            if (this.life < 0) {
                //this.scene.heroes.data.set("kills", this.scene.heroes.data.values.kills + 1)
                this.stopAttack()
            }
        })

    }

    update(): void {

        this.body.x = this.x - this.width / 2
        this.body.y = this.y - this.height / 2
        this.body.velocity.y = 0

        if (this.smoke !== undefined) {
            this.smoke.x = this.x
            this.smoke.setDepth(3000)
            this.smoke.y = this.y
        }
    }

    playMovingAnimation(): void {
        this.anims.play(`spaceship-${this.color}-moving`, true)
    }

    playIdleAnimation(): void {
        this.anims.play(`spaceship-${this.color}-idle`, true)
    }

    attack(): void {
        this.playIdleAnimation()
        this.spaceLight = this.scene.add.rectangle(this.x, this.y, 50, 800, parseInt(this.color.replace('#', '0x')))
        this.spaceLight.setAlpha(0.4)
        this.spaceLight.setDepth(1)
        this.spaceLight.setOrigin(0.5, 0)

        let play = this.scene as IntroductionScene

        play.spaceLightGroup.add(this.spaceLight)
        let spaceLightBody = this.spaceLight.body as Phaser.Physics.Arcade.Body
        spaceLightBody.allowGravity = false
        setTimeout(() => {
            if (this.stopped) return
            this.playMovingAnimation()
            if (this.callback === null) this.stopAttack()
        }, this.scene.shipDuration * 1000)
    }

    stopAttack(): void {
        this.allowChock = false
        this.stopped = true
        this.smoke = this.scene.add.sprite(0, 0, "smoke")

        this.smoke.play("smoke-anim")

        let particles = this.scene.add.particles("flares")

        let emiter = particles.createEmitter({
            x: 500,
            y: 200,
            blendMode: "ADD",
            speed: { min: 0, max: 1200 },
            frequency: 1,
            lifespan: { min: 0, max: 1000 },
            alpha: { start: 1, end: 0 },
            scale: { start: 1, end: 0 },


        })

        emiter.explode(100, this.x, this.y)

        
        this.spaceLight.destroy()
        this.scene.humanB.body.enable = true
        this.deadCallback(true)
        this.destroy()
        return

        this.scene.tweens.add({
            targets: this,
            x: -1000,
            duration: 5000,
            onComplete: () => {
                this.destroy()
            }
        })
        this.spaceLight.destroy()
    }
}

export default class IntroductionScene extends Phaser.Scene {
    entities: Phaser.GameObjects.Group
    bullets: Phaser.Physics.Arcade.Group
    heroe: Human
    humanB: Human
    humans: Phaser.Physics.Arcade.Group
    platform: Phaser.Physics.Arcade.StaticGroup
    playerGroup: Phaser.Physics.Arcade.Group
    spaceLightGroup: Phaser.Physics.Arcade.Group
    spaceShipConst: Array<number> = [5, 15]
    humanConst: Array<number> = [5, 15]
    rappedSpeed: number = 100
    shipDuration: number = 10
    soundButton: any
    constructor() {
        super("introduction")
    }

    createBackground(): void {
        this.add.image(0, 0, "starry_night").setOrigin(0).setDepth(0)
        this.add.image(0, config.height - 280, "building").setOrigin(0).setDepth(0)
        this.add.image(0, 482, "buisson1")
        this.add.image(800 - 170, 445, "arbre2")
        this.add.image(435, 490, "rocher")
        this.add.image(290, 495, "buisson2")
        this.add.image(150, 460, "arbre1")
        this.add.image(800 - 100, 482, "buisson1")
        this.add.image(0, config.height - 95, "ground").setOrigin(0).setDepth(0)

        this.soundButton = this.add.image(config.width - 30, config.height - 30, "son").setDisplaySize(40, 40)

        this.soundButton.setDepth(192992929)

        this.soundButton.setInteractive({useHandCursor : true})

        this.soundButton.on('pointerdown', () => {
            this.sound.mute = !this.sound.mute
        })

    }
    steps: any = [
        {
            humanB: { fromBehind: true },
            heroe: { fromBehind: true }
        }, {

        },
        {
            humanB: { text: "Hello comment ça va" },
        },
        {
            heroe: { text: "Il fait beau ce soir c'était une bonne idée de sortir" }

        },
        {
            heroe: { text: "Ouais, on a bien fait de sortir ce soir !", fromFront: true }
        }
    ]
    currentStep: number = 0
    create(): void {
        console.log("INTRODU")
        this.input.setPollAlways();
        this.humans = this.physics.add.group()
        this.platform = this.physics.add.staticGroup()
        this.entities = this.add.group()

        this.playerGroup = this.physics.add.group()
        this.spaceLightGroup = this.physics.add.group()
        this.bullets = this.physics.add.group()

        this.spaceShipConst = [5, 15]
        this.humanConst = [5, 15]
        this.rappedSpeed = 100
        this.shipDuration = 10

        this.entities.runChildUpdate = true

        this.platform.add(this.add.rectangle(0, config.height - 50, config.width, 50).setOrigin(0).setVisible(false))

        this.createBackground()

        this.heroe = new Human(this, 300, 600 - 50, 5, 1)
        this.humanB = new Human(this, 300 - this.heroe.width, 600 - 50, 2, 4)


        this.entities.add(this.heroe)
        this.entities.add(this.humanB)

        this.physics.add.collider(this.humans, this.platform)

        this.startIntroduction()
    }

    startIntroduction(): void {
        this.heroe.showFromBehind()
        this.humanB.showFromBehind()
        this.heroe.setFlipX(true)
        setTimeout(() => {
            this.humanB.speak("Il fait beau ce soir, c'était une bonne idée de sortir.", (success: boolean) => {
                if (!success) return
                setTimeout(() => {
                    this.heroe.speak("Oui ! Oh et regarde cette belle étoile qui brille et...", (success: boolean) => {

                        setTimeout(() => {
                            let vaisseauBig = this.add.image(1200, -500, "vaisseau-fond")
                            let vaisseauLittle1 = this.add.image(1100, -500, "vaisseau-fond").setScale(0.5)
                            let vaisseauLittle2 = this.add.image(1100, -300, "vaisseau-fond").setScale(0.5)
                            this.tweens.add({
                                targets: vaisseauBig,
                                x: 600,
                                y: 200,
                                duration: 2000,
                            })

                            this.tweens.add({
                                targets: vaisseauLittle2,
                                x: 600,
                                y: 100,
                                duration: 2000,
                            })

                            this.tweens.add({
                                targets: vaisseauLittle1,
                                x: 700,
                                y: 250,
                                duration: 4000,
                                onComplete: () => {
                                    let warning = this.add.image(this.heroe.x - 50, this.heroe.y - 130, "bulle-warning")
                                    this.heroe.bubble.destroy()
                                    this.humanB.bubble.destroy()
                                    setTimeout(() => {
                                        warning.destroy()

                                        this.humanB.showFromFront()
                                        this.humanB.setFlipX(false)
                                        this.heroe.showFromFront()
                                        this.heroe.setFlipX(false)

                                        new SpaceshipEntity(this, 200, 20, spaceShipColor[0], (success: boolean) => {
                                            this.humanB.body.reset(200, this.humanB.y)
                                            this.humanB.body.enable = false

                                            this.heroe.setFlipX(true)
                                            this.tweens.add({
                                                targets: this.humanB,
                                                y: 400,
                                                duration: 2000,
                                                onComplete: () => {
                                                    this.heroe.speak("Aidez nous !!!", (success: boolean) => {
                                                        setTimeout(() => {
                                                            let heroe = new HumanWarriorEntity(this, 100, 600 - 120)
                                                            heroe.alpha = 0
                                                            this.tweens.add({
                                                                targets: heroe,
                                                                alpha: 1,
                                                                duration: 300,
                                                                onComplete : () => {
                                                                    this.heroe.speak("Click gauche de la souris, touche R pour recharger, et WASD / Fleche directionnele pour se deplacer", (success : boolean) => {
                                                                        
                                                                    })
                                                                }
                                                            })
                                                            this.physics.add.collider(heroe, this.platform)
                                                        }, 2000)
                                                    })
                                                }
                                            })
                                        }, (success: true) => {
                                            setTimeout(() => {
                                                this.heroe.speak("Merci de nous avoir sauvé. Mais un autre vaisseau arrive !", (succes: true) => {
                                                    setTimeout(() => {
                                                        this.scene.start("play")
                                                    }, 2000)
                                                })
                                            }, 1200)
                                        })
                                        this.humanB.moveTo(new Phaser.Math.Vector2(120, 20), (success: boolean) => {
                                            this.heroe.setFlipX(true)

                                        })
                                    }, 1000)

                                }
                            })


                        }, 2000)
                    })
                }, 4000)
            })
        }, 1500)
    }

    update(): void {
        if (this.sound.mute) this.soundButton.alpha = 0.2
        else this.soundButton.alpha = 1
    }
}

const config: any = {
    width: 800,
    height: 600,
}