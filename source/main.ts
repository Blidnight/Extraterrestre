import { Game, Scene, Math } from 'phaser'
import { StaticValue } from './interfaces/entity'
import IntroductionSceneState from './states/introductionSceneState'
import IMainScene from './interfaces/mainScene'
import StreetLamp from './entities/streetlamp3'
import Human from './entities/human'
import Entity from './entities/entity'
import Spaceship from './entities/spaceship'
import "./css/index.css"
import EntityTexturemanager from './manager/entityTextureManager'

let a: Human, b: Human, c: StreetLamp
let entities: Array<Entity> = []


export default class Main extends Scene implements IMainScene {
    entityTextureManager : EntityTexturemanager
    sceneState : IntroductionSceneState

    constructor() {
        super("main")
    }

    preload(): void {
        this.load.image("street_lamp_body", "street_lamp_body.png")
        this.load.image("street_lamp_light", "street_lamp_light.png")
        this.load.image("starry_night", "starry_night.png")
        this.load.image("building", "building.png")
        this.load.image("ground", "ground.png")
    }

    create(): void {
        this.add.image(0, 0, "starry_night").setOrigin(0).setDepth(0)
        this.add.image(0, config.height - 280, "building").setOrigin(0).setDepth(0)
        this.add.image(0, config.height - 95, "ground").setOrigin(0).setDepth(0)

        this.entityTextureManager = new EntityTexturemanager(this)
        this.entityTextureManager.addPlayerEntity("red", (textures : any) => {
            this.entityTextureManager.addSpaceShipEntity("blue", (textures : any) => {
                this.sceneState = new IntroductionSceneState(this)
                this.sceneState.renderSteps(0)
            })
        })
        
    }

    update(): void {
        entities.forEach((entity: Entity) => {
            entity.update()
        })

        if (this.sceneState !== undefined) this.sceneState.update()

    }
}

const config: any = {
    width: 800,
    height: 600,
    scene: [Main]
}

const game: Game = new Game(config)