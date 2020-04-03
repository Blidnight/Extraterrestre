import { StaticValue } from './entity'

export default interface IHuman {
    state : StaticValue.EntityState.HUMAN_FROM_FRONT | StaticValue.EntityState.HUMAN_FROM_BEHIND | StaticValue.EntityState.HUMAN_BEING_KIDNAPPED,
    showHumanFromBehind() : void,
    showHumanFromFront() : void,
    showHumanBeingKidnapped() : void
}