import ISceneState from '../interfaces/sceneState'
import Main from 'main'

export default class SceneState implements ISceneState {
    scene : Main

    constructor(scene : Main) {
        this.scene = scene
    }

    update() : void {

    }
}