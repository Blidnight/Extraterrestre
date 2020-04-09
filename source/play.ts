const headColor: Array<string> = `#feeedf
#f0dcd0
#e2bc9d
#eaaf98
#c7aa95
#b0896d
#c5a198
#a47562
#b47351
#a2704b
#936d52
#765842
#62493e
#534438
#7f432e
#6e3026
#532f18
#452208`.split('\n')

const shirtColor: Array<string> = `#f44336
#e91e63
#9c27b0
#673ab7
#3f51b5
#607d8b`.split(`\n`)


const spaceShipColor: Array<string> = `#43eafa
#ff83f0
#ffeb3b
#ff450b
#3050ff`.split('\n')

const config = {
    width: 800,
    height: 600
}

let bulletParticles: any = null

class Entity {
    constructor() {

    }
}

class StreetLampEntity extends Phaser.GameObjects.Container {
    body: Phaser.GameObjects.Image
    light: Phaser.GameObjects.Image
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y)

        this.body = new Phaser.GameObjects.Image(this.scene, 0, 0, "street_lamp_body").setOrigin(0.5, 0)
        this.light = new Phaser.GameObjects.Image(this.scene, 0, 0, "street_lamp_light").setOrigin(0.5, 0)

        this.add([this.body, this.light])
        this.makeLightEffect(true)
        scene.add.existing(this)
    }

    makeLightEffect(ignore?: boolean): void {
        setTimeout(() => { this.makeLightEffect(false) }, Phaser.Math.Between(10, 25) * 1000)
        if (ignore) return
        this.light.setVisible(false)
        setTimeout(() => {
            this.light.setVisible(true)
            setTimeout(() => {
                this.light.setVisible(false)
                setTimeout(() => {
                    this.light.setVisible(true)
                }, 60)
            }, 60)
        }, 60);
    }
}

class Bullet extends Phaser.GameObjects.Rectangle {
    body: Phaser.Physics.Arcade.Body
    particles: any
    elem: any
    private BulletVector: Array<number>
    constructor(scene: Phaser.Scene, x: number, y: number, angle: number, color: string = "yellow") {
        super(scene, x, y, 30, 10, 0xFFF)
        let play = scene as Play
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
        let play = scene as Play
        this.setDepth(1000)
        let playerSettings = this.scene.add.text(20, config.height - 38, '', { fontFamily: 'Orbitron', color: "#000", fontSize: 18 }).setAlpha(0.6)
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

        this.scene.input.on('pointerup', () => {


            if (this.data.get('munitions') <= 0 && !this.reload) {
                this.reload = true
                let reloadSound = this.scene.sound.add("gun_reload")
                reloadSound.play()

                return
            } else if (this.reload) {
                return
            }

            if (this.data.values.munitions === 20) {
                let shootPower = this.scene.sound.add("gun_special_shoot")
                shootPower.play()
                new Bullet(this.scene, this.weapon.x, this.weapon.y, this.weapon.angle, "blue")

            } else {
                let shootPower = this.scene.sound.add("gun_normal_shoot")
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

        let angle = Phaser.Math.RadToDeg(Phaser.Math.Angle.BetweenPoints(new Phaser.Geom.Point(this.scene.input.x, this.scene.input.y), { x: this.weapon.x, y: this.weapon.y }))


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

class HumanEntity extends Phaser.Physics.Arcade.Image {
    headColor: string
    shirtColor: string
    speed: number
    body: Phaser.Physics.Arcade.Body
    bubble: Phaser.GameObjects.Container
    control: boolean
    constructor(scene: Phaser.Scene, x: number, y: number, headColor: string, shirtColor: string, control?: boolean) {
        super(scene, x, y, `player-${headColor}-${shirtColor}-0`)
        this.headColor = headColor
        this.shirtColor = shirtColor
        this.speed = Phaser.Math.Between(50, 80)
        scene.add.existing(this)

        let play = scene as Play
        play.playerGroup.add(this)

        this.body.setCollideWorldBounds(true)
        this.bubble = this.scene.add.container(this.x, this.y)
        this.body.setSize(24, 48)
        this.body.collideWorldBounds = true

        this.control = true
        this.body.setVelocityX(this.speed)
        this.body.setBounceX(1)
        this.setInteractive()
        this.on('pointerdown', () => {
            if (this.body.velocity.y === 0) {
                this.body.setVelocityX(this.flipX ? this.speed : -this.speed)
            }
        })


    }

    showFromBehind(): void {
        this.setTexture(`player-${this.headColor}-${this.shirtColor}-1`)
    }

    showFromFace(): void {
        this.setTexture(`player-${this.headColor}-${this.shirtColor}-0`)
    }

    talk(message: string): void {




    }

    createBubble(): void {

    }

    destroyOldBubble(): void {

    }

    update(): void {
        this.bubble.x = this.x
        this.bubble.y = this.y
        if (this.body.velocity.x < 0) {
            this.setFlipX(true)
        } else if (this.body.velocity.x > 0) {
            this.setFlipX(false)
        } else {
            if (this.body.touching.down && this.body.velocity.y === 0) {
                this.angle = 0
                this.body.setVelocityX(this.flipX ? -this.speed : this.speed)
            }
        }


    }
}

class SpaceshipEntity extends Phaser.Physics.Arcade.Sprite {
    color: string
    spaceLight: Phaser.GameObjects.Rectangle
    life: number = 100
    stopped: boolean = false
    scene: Play
    allowChock: boolean = false
    body: Phaser.Physics.Arcade.Body
    smoke: any


    constructor(scene: Phaser.Scene, x: number, y: number, color: string) {

        super(scene, Math.random() > 0.5 ? -1000 : 1000, Phaser.Math.Between(3, 6) * 35, `spaceship-${color}-0`)


        this.color = color
        this.playMovingAnimation()
        this.setDepth(2)
        scene.add.existing(this)
        this.scene.tweens.add({
            targets: this,
            x: x,
            duration: 4000,
            onComplete: () => {

                setTimeout(() => { this.allowChock = true; this.attack() }, 1500)
            }
        })

        this.scene.physics.add.existing(this, true)

        this.setInteractive()
        this.scene.entities.add(this)
        this.scene.physics.add.collider(this.scene.bullets, this, (a: any, b: any) => {
            b.elem.destroy()
            b.destroy()
            if (!this.allowChock) return
            this.life -= 20
            this.scene.cameras.main.shake(200, 0.02)
            let chock = this.scene.add.image(Phaser.Math.Between(-1, 1) * Phaser.Math.Between(5, 15) * 5 + this.x, Phaser.Math.Between(-1, 1) * Phaser.Math.Between(5, 8) * 5 + this.y, "choc")
            chock.setDepth(10)
            let degatsSound = this.scene.sound.add("degats")
            degatsSound.play()
            setTimeout(() => {
                if (chock === undefined) return
                chock.destroy()
            }, 500)
            if (this.life < 0) {
                this.scene.heroes.data.set("kills", this.scene.heroes.data.values.kills + 1)
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

        let play = this.scene as Play

        play.spaceLightGroup.add(this.spaceLight)
        let spaceLightBody = this.spaceLight.body as Phaser.Physics.Arcade.Body
        spaceLightBody.allowGravity = false
        setTimeout(() => {
            if (this.stopped) return
            this.playMovingAnimation()
            this.stopAttack()
        }, this.scene.shipDuration * 1000)
    }

    stopAttack(): void {
        this.allowChock = false
        this.stopped = true
        this.smoke = this.scene.add.sprite(0, 0, "smoke")

        this.smoke.play("smoke-anim")

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

export default class Play extends Phaser.Scene {

    entities: Phaser.GameObjects.Group
    bullets: Phaser.Physics.Arcade.Group
    ground: any
    playerGroup: Phaser.Physics.Arcade.Group
    spaceLightGroup: Phaser.Physics.Arcade.Group
    spaceShipConst: Array<number> = [5, 15]
    humanConst: Array<number> = [5, 15]
    rappedSpeed: number = 100
    shipDuration: number = 10
    heroes: HumanWarriorEntity
    active : boolean

    constructor() {
        super("play")
        this.active = true
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

    }

    init(): void {
        this.active = true
    }

    generateHuman(): void {
        if (!this.active) return
        let shirtId = Math.floor(Math.random() * shirtColor.length)
        let headId = Math.floor(Math.random() * headColor.length)

        this.entities.add(new HumanEntity(this, Math.random() > 0.5 ? 0 : config.width - 60, 500, headColor[headId], shirtColor[shirtId]))

        setTimeout(() => {
            if (this === undefined) return
            this.generateHuman()
        }, Phaser.Math.Between(this.humanConst[0], this.humanConst[1]) * 1000)
        this.humanConst[0] > 2 ? this.humanConst[0] -= 1 : null
        this.humanConst[1] > 6 ? this.humanConst[1] -= 2 : null
    }

    generateSpaceShip(): void {
 if (!this.active) return
        let SpaceShipId = Math.floor(Math.random() * spaceShipColor.length)
        new SpaceshipEntity(this, Phaser.Math.Between(1, 7) * 100, 200, spaceShipColor[SpaceShipId])
        setTimeout(() => {
            if (this === undefined) return
            this.generateSpaceShip()
        }, Phaser.Math.Between(this.spaceShipConst[0], this.spaceShipConst[1]) * 1000)
        this.spaceShipConst[0] > 1 ? this.spaceShipConst[0] -= 1 : null
        this.spaceShipConst[1] > 5 ? this.spaceShipConst[1] -= 2 : null

        this.rappedSpeed += 5

        this.shipDuration < 25 ? this.shipDuration += 2 : null


    }

    generateCloud(): void {
        let cloud = this.add.image(Phaser.Math.Between(1, 6) * 75, Phaser.Math.Between(1, 5) * 30, Math.random() > 0.5 ? "nuage1" : "nuage2")
        cloud.alpha = 0
        console.log(cloud)
        this.tweens.add({
            targets: cloud,
            alpha: 1,
            x: cloud.x + 40,
            duration: 2000,
            onComplete: () => {

                this.tweens.add({
                    targets: cloud,
                    x: cloud.x + 200,
                    duration: 8000,
                    onComplete: () => {
                        this.tweens.add({
                            targets: cloud,
                            x: cloud.x + 150,
                            alpha: 0,
                            duration: 5000,
                            onComplete: () => {
                                cloud.destroy()
                            }
                        })
                    }
                })
            }
        })

        setTimeout(() => {
            if (this === undefined) return
            this.generateCloud()
        }, Phaser.Math.Between(5, 8) * 1000)
    }

    generateIntroduction(): void {
        let a = new HumanEntity(this, 120, 120, headColor[0], shirtColor[2], false)
        let b = new HumanEntity(this, 200, 120, headColor[0], shirtColor[3], false)
        this.entities.add(a)
        this.entities.add(b)
        a.showFromBehind()
        b.showFromBehind()

        a.talk("Hello")

    }

    create() {
        this.physics.world.setBounds(0, 0, config.width, config.height, true, true, true, true)
        this.ground = this.add.rectangle(0, config.height - 40, config.width, 100, 0xFF).setOrigin(0)
        this.playerGroup = this.physics.add.group()
        this.spaceLightGroup = this.physics.add.group()
        this.bullets = this.physics.add.group()

        this.spaceShipConst =[5, 15]
        this.humanConst =[5, 15]
        this.rappedSpeed  = 100
        this.shipDuration  = 10

        bulletParticles = this.add.particles("flares")
        this.createBackground()
        new StreetLampEntity(this, 0, 340)
        new StreetLampEntity(this, 250, 340)
        new StreetLampEntity(this, 500, 340)
        new StreetLampEntity(this, 800, 340)
        this.anims.create({
            key: "smoke-anim",
            frames: this.anims.generateFrameNumbers("smoke", { start: 1, end: 3 }),
            duration: 800,
            repeat: -1
        })


        this.entities = new Phaser.GameObjects.Group(this)
        this.entities.runChildUpdate = true
        this.generateHuman()

        this.heroes = new HumanWarriorEntity(this, 80, 200)




        this.generateSpaceShip()

        this.generateCloud()



        this.physics.add.existing(this.ground, true)
        this.physics.add.collider(this.playerGroup, this.ground, (a: any, b: any) => {

            if (b.body.velocityX === 0) {

            }
        })
        this.physics.add.overlap(this.playerGroup, this.spaceLightGroup, (a: any, b: any) => {


            if (a.y > b.y) {
                if (a.constructor.name !== "HumanEntity") {
                    console.log(a.constructor.name)
                    if (a.constructor.name === "HumanWarriorEntity") {
                        this.active = false
                        this.scene.start("gameOver", { score: this.heroes.data.values.kills })
                    }
                    return
                }
                a.body.setVelocityX(0)

                a.setAngle(-30)
                a.x = b.x
                a.body.setVelocityY(-this.rappedSpeed)
            } else {
                this.heroes.data.set("captures", this.heroes.data.values.captures + 1)
                a.destroy()
                if (this.heroes.data.values.captures >= 10) {
                    this.active = false
                    this.scene.start("gameOver", { score: this.heroes.data.values.kills })
                }
            }
        })

    }

    update(time: number, delta: number): void {
        this.entities.preUpdate(time, delta)
    }
}