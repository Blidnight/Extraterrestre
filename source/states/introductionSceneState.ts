import { StaticValue } from '../interfaces/entity'
import SceneState from './sceneState'
import IIntroductionSceneState from "../interfaces/introductionSceneState";
import Main from '../main'
import Human from '../entities/human';
import Bulb from '../entities/bulb'
import Spaceship from '../entities/spaceship';

const headColor: any = `#feeedf
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


export default class IntroductionSceneState extends SceneState {
    stepsDuration : number = null
    actualStep : number = 0
    currentStep: number = 0
    steps: number[] = [0, 1, 2, 3, 4, 5, 6]
    entities: any
    stepsData: any = [
        {
            spaceShip : {render : false, x : 1000, y : 200},
            playerA: { x: 330, y: 500, duration: 0, fromBehind: true, direction : StaticValue.EntityDirection.RIGHT },
            playerB: { x: 400, y: 500, duration: 0, fromBehind: true, direction : StaticValue.EntityDirection.RIGHT },
            bulbA : {render : false},
            bulbB : {render : false}
        },
        {
            bulbA : {x : 150, y : 400, text : "Il fait beau ce soir, c'était une bonne idée de sortir !"},
            bulbB : {render : false}
        },
        {
            bulbA : {x : 150, y : 300},
            bulbB : {x : 450, y : 400, text : "Oui ! Oh et regarde cette belle étoile qui brille et.."}
        },
        {
            bulbA : {x : 300, y : 400, text : " !!!!!!!!!!!! "},
            bulbB : {render : false}
        }, {
            bulbA : {render : false},
            bulbB : {render : false},
            playerA: { x: 330, y: 500, duration: 0, fromBehind: false, direction : StaticValue.EntityDirection.RIGHT },
            playerB: { x: 400, y: 500, duration: 0, fromBehind: false, direction : StaticValue.EntityDirection.RIGHT }
        },
        {
            bulbA : {render : false},
            bulbB : {render : false},
            spaceShip : {state : StaticValue.EntityState.MOVING , x : 200, y : 200, interpolation : true, duration : 3000},
            playerA : {x : 230, y : 500, duration : 2000, fromBehind : false, direction : StaticValue.EntityDirection.RIGHT, interpolation : true}
        },
        {
            spaceShip : {state : StaticValue.EntityState.ATTACK, x : 200, y : 200},
            playerA : {x : 230, y : 500, duration : 2500, fromBehind : false, direction : StaticValue.EntityDirection.RIGHT, state : StaticValue.EntityState.HUMAN_BEING_KIDNAPPED}
        },
        {
            playerA : {
                x : 230, y : 400, duration : 1200, interpolation : true
            },
            playerB: { x: 400, y: 500, duration: 0, fromBehind: true, direction : StaticValue.EntityDirection.LEFT, state : StaticValue.EntityState.HUMAN_FROM_FRONT },
        }
    ]

    constructor(scene: Main) {
        super(scene)
        this.entities = {
            playerA: new Human(this.scene, "red"),
            playerB: new Human(this.scene, "green"),
            bulbA: new Bulb("Hello", this.scene),
            bulbB : new Bulb("Hello", this.scene),
            spaceShip : new Spaceship(this.scene, "blue")
        }

    }

    renderSteps(id: number): void {
        let currentStateData = this.stepsData[id]
        if (currentStateData !== undefined) {
            for (let entity in currentStateData) {
                let targetData = currentStateData[entity]
                let target = this.entities[entity]

                if (target.view === undefined) return

                if (targetData.render === false) {
                    target.view.setVisible(false)
                } else {
                    target.view.setVisible(true)
                }

                if (targetData.fromBehind !== undefined) {
                    targetData.fromBehind ? target.setState(StaticValue.EntityState.HUMAN_FROM_BEHIND) : target.setState(StaticValue.EntityState.HUMAN_FROM_FRONT)
                }

                if (targetData.state !== undefined) {
                    if (!target.onInterpolation) target.setState(targetData.state)
                }

                if (targetData.direction !== undefined) target.setDirection(targetData.direction)
                if (targetData.interpolation !== undefined && target.onInterpolation === false) {
                    console.log(target)
                    this.scene.tweens.add({
                        targets: target.position,
                        x: targetData.x,
                        y: targetData.y,
                        duration: targetData.duration,
                        onComplete : () => {
                            
                           setTimeout(() => {
                               
                               target.onInterpolation = false
                               console.log("COMPLETE", target.onInterpolation)
                            }, 2000)
                        }
                    })
                    target.onInterpolation = true
                    
                } else {
                    if (targetData.text !== undefined) target.view.text = targetData.text
                    if (!target.onInterpolation) target.setPosition(new Phaser.Math.Vector2(targetData.x, targetData.y))
                }

            }
        }
        
    }

    update(): void {
        for (let entity in this.entities) {
            this.entities[entity].update()
        }
        if (this.stepsDuration < 5000) {
            this.stepsDuration += 30

        } else {
            this.stepsDuration = 0
            this.currentStep += 1
           
        }
        if (this.stepsData[this.currentStep] !== undefined) this.renderSteps(this.currentStep)
    }
}