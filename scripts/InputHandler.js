import state from "./state.js";

export default class InputHandler {
    
    /** @param ctx { CanvasRenderingContext2D } */
    constructor(ctx) {
        this.ctx = ctx;
        this.keys = [];
        this.authorizedKeys = [
            { name: "ArrowDown", persistent: false },
            { name: "ArrowUp", persistent: false },
            { name: "ArrowLeft", persistent: false },
            { name: "ArrowRight", persistent: false },
            { name: "a", persistent: true, interval: 50 },
            { name: "s", persistent: true, interval: 100 },
            { name: "d", persistent: true, interval: 100 },
            { name: "f", persistent: true, interval: 300 },
            { name: " ", persistent: true, interval: 200 },
            { name: "z", persistent: true, interval: 200},
            
            
            // TESTS //
            { name: "i", persistent: true },
            { name: "o", persistent: true },
            { name: "p", persistent: true },
        ];
        this.markedForDeletionKeyNames = [];
        
        window.addEventListener("keydown", e => {
            const key = this.authorizedKeys.find(key => key.name === e.key);
            
            if (key && this.keys.indexOf(key) === -1){
                
                if (key.interval){
                    if (key.pressedAtFrame && state.GAME_FRAME - key.pressedAtFrame < key.interval) {
                        return;
                    }

                    key.pressedAtFrame = state.GAME_FRAME;
                }
                
                if (key.persistent && !this.keys[this.keys.length - 1]?.persistent){
                    this.keys.push(key)
                } else {
                    this.keys.unshift(key)
                }
            }
        });

        window.addEventListener("keyup", e => {
            const key = this.keys.find(key => key.name === e.key);
            
            if (key && !key.persistent){
                this.keys.splice(this.keys.indexOf(key), 1);
            }
        });
    }

    removeMarkedForDeletion(){{
        this.keys = this.keys.filter(key => 
            !this.markedForDeletionKeyNames.some(keyName => key.name === keyName));

        this.markedForDeletionKeyNames = [];
    }};
    
    markForDeletion(keyName){
        this.markedForDeletionKeyNames.push(keyName);
    }
}