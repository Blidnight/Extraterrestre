import { StaticValue } from './entity'

import EntityTexturemanager from "../manager/entityTextureManager";

import SceneState from '../states/sceneState'
import IntroductionSceneState from '../states/introductionSceneState';
import { Scene } from 'phaser';

export default interface IMainScene {
    entityTextureManager : EntityTexturemanager
    sceneState : SceneState
}