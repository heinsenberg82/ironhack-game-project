import state from "./state.js";

export default class Action{
    constructor(name, frameCount, speedModifier, spriteIndex, blocking = false, key = "", indefinitely = false) {
        this.name = name;
        this.frameCount = frameCount;
        this.speedModifier = speedModifier;
        this.spriteIndex = spriteIndex;
        this.blocking = blocking;
        this.key = key;
        this.indefinitely = indefinitely;
    }

    /**
     * @param actionName { String }
     * @param player { Character }
     * @param callback { callback }
     */
    static updatePlayerState(actionName, player, callback){
        /** @type { Action } */
        const action = player.actions.find(action => action.name === actionName);
        
        if(action.spriteIndex !== player.state.activeAction.spriteIndex){
            player.state = {
                ...player.state,
                activeAction: action,
                frame: 0,
            }

            player.state.attackHitbox = null;
        }

        if (state.GAME_FRAME % action.speedModifier === 0){
            const lastSpriteFrame = action.frameCount - 1;

            if (action.indefinitely && player.state.frame >= lastSpriteFrame){
                player.state.frame = lastSpriteFrame;
            } else if (player.state.frame >= lastSpriteFrame){
                player.state.frame = 0;
            } else {
                player.state.frame++;
            }

            callback?.();
        }

        if (action.blocking && !action.indefinitely){
            this.#removeKeyFromInputHandler(player);
        }

        return action;
    }

    /**
     * @param player { Character }
     */
    static #removeKeyFromInputHandler(player) {
        if (player.state.inputHandler){
            if (player.state.frame >= player.state.activeAction.frameCount - 1) {
                player.state.inputHandler.removeKey(player.state.activeAction.key);
            }   
        }
    }
}