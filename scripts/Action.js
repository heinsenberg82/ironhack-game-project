import state from "./state.js";

export default class Action{
    static areKeysMarkedForDeletion = false;
    
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
     * @param player { Player }
     * @param callback { callback }
     */
    static updatePlayerState(actionName, player, callback){
        /** @type { Action } */
        const action = player.playerState.actions.find(action => action.name === actionName);
        
        if(action.spriteIndex !== player.playerState.activeAction.spriteIndex){
            player.playerState = {
                ...player.playerState,
                activeAction: action,
                frame: 0,
            }
        }

        if (state.GAME_FRAME % action.speedModifier === 0){
            const lastSpriteFrame = action.frameCount - 1;

            if (action.indefinitely && player.playerState.frame >= lastSpriteFrame){
                player.playerState.frame = lastSpriteFrame;
            } else if (player.playerState.frame >= lastSpriteFrame){
                player.playerState.frame = 0;
            } else {
                player.playerState.frame++;
            }

            callback?.();
        }

        if (action.blocking && !action.indefinitely){
            this.#endAnimation(player);
        }

        return action;
    }

    /**
     * @param player { Player }
     */
    static #endAnimation(player) {
        if (player.playerState.frame >= player.playerState.activeAction.frameCount - 1) {

            this.removeMarkedForDeletion(player.playerState.inputHandler);
            this.addKeysForDeletion(player.playerState.activeAction.key, player.playerState.inputHandler)
        }
    }
    
    static addKeysForDeletion(keyName, inputHandler){
        inputHandler.markForDeletion(keyName);
        
        this.areKeysMarkedForDeletion = true;
    }

    static removeMarkedForDeletion(inputHandler){
        if (this.areKeysMarkedForDeletion){
            inputHandler.removeMarkedForDeletion();
        }        
        
        this.areKeysMarkedForDeletion = false;
    }
}