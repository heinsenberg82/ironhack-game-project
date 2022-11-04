import state from "./state.js";

export default class Action{
    constructor(name, frameCount, speedModifier, spriteIndex, blocking = false, key = "",
                indefinitely = false, durationInFrames = null, soundFileInfo = "") {
        this.name = name;
        this.frameCount = frameCount;
        this.speedModifier = speedModifier;
        this.spriteIndex = spriteIndex;
        this.blocking = blocking;
        this.key = key;
        this.indefinitely = indefinitely;
        this.durationInFrames = durationInFrames;
        this.soundFileInfo = soundFileInfo;
        
        if (soundFileInfo){
            this.sound = new Audio(soundFileInfo.path);
        }
    }

    /**
     * @param actionName { String }
     * @param character { Character }
     * @param callback { callback }
     */
    static updatePlayerState(actionName, character, callback){
        /** @type { Action } */        
        const newAction = character.actions.find(action => action.name === actionName);

        if (character.state.activeAction.name !== newAction.name){
            character.state.lastActionCalledAt = state.GAME_FRAME;
        }

        if(newAction.spriteIndex !== character.state.activeAction.spriteIndex){
            character.state = {
                ...character.state,
                activeAction: newAction,
                frame: 0,
            }

            character.state.attackHitbox = null;
        }
        
        if (state.GAME_FRAME % newAction.speedModifier === 0){
            if (character.state.frame === character.state.activeAction.soundFileInfo.frame){
                character.state.activeAction.sound?.play();
            }
            
            const lastSpriteFrame = newAction.frameCount - 1;
            
            if (character.state.frame >= lastSpriteFrame){
                if (newAction.indefinitely){
                    character.state.frame = lastSpriteFrame
                } else if (newAction.durationInFrames) {
                    if (state.GAME_FRAME - character.state.lastActionCalledAt > newAction.durationInFrames) {
                        character.idle();
                    } else {
                        character.state.frame = 0;
                    }
                } else {
                    character.state.frame = 0;
                }
            } else {
                character.state.frame++;
            }
            
            callback?.();
        }

        if (newAction.blocking && character.state.activeAction.key){
            this.#removeKeyFromInputHandler(character);
        }

        return newAction;
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