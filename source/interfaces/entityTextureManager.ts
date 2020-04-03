export default interface IEntityTextureManager {
    scene : Phaser.Scene,
    loadSVGByXHR(url: string, callback: Function) : void,
    getPlayerEntitiesBase64(head: string, callback: Function): void,
    getSpaceShipEntitiesBase64(band: string, callback: Function): void,
    addSVGEntityTexture(svg: HTMLElement, dimension: any, callback: Function) : void,
    addPlayerEntity(headColor: string, callback: Function): void,
    addSpaceShipEntity(band: string, callback: Function): void
}