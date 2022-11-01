export default class Action{
    constructor(name, frameCount, speedModifier, spriteIndex, key = "") {
        this.name = name;
        this.frameCount = frameCount;
        this.speedModifier = speedModifier;
        this.spriteIndex = spriteIndex;
        this.key = key;
    }

    /**
     * @param player { Player }
     */
    endAnimation(player){
        let ended = false;
        
        if (player.playerState.frame >= this.frameCount - 1){
            player.playerState.inputHandler.removePersistentKey(this.key);
            ended = true;
        }
        return ended;
    }
}