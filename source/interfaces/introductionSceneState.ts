export default interface IIntroductionSceneState {
    currentStep : number
    steps : number[]
    stepsData : any
    renderSteps(id : number) : void
}