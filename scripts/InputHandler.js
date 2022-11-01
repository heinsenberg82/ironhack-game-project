import state from "./state.js";

export default class InputHandler {
    constructor() {
        this.keys = [];
        this.authorizedKeys = [
            { name: "ArrowDown", persistent: false },
            { name: "ArrowUp", persistent: false },
            { name: "ArrowLeft", persistent: false },
            { name: "ArrowRight", persistent: false },
            { name: "a", persistent: true },
            { name: "s", persistent: true },
            { name: " ", persistent: true }
        ];
        
        window.addEventListener("keydown", e => {
            const key = this.authorizedKeys.find(key => key.name === e.key);
            
            if (key && this.keys.indexOf(key) === -1){
                this.keys.unshift(key);
            }
        });

        window.addEventListener("keyup", e => {
            const key = this.keys.find(key => key.name === e.key);
            
            if (key && !key.persistent){
                this.keys.splice(this.keys.indexOf(key), 1);
            }
        });
    }

    removePersistentKey(keyName){{
        const usedKey = this.keys.find(key => key.name === keyName);
        this.keys.splice(this.keys.indexOf(usedKey), 1);
    }}
}