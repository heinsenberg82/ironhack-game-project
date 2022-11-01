import state from "./state.js";
import InputHandler from "./InputHandler.js";

export default class Player{
    constructor() {
        this.image = new Image();
        this.image.src = "/images/sprites/hero.png";
        
        this.spriteWidth = 90;
        this.spriteHeight = 37;
        
        this.sizeMultiplier = 2;
        
        this.width = this.spriteWidth * this.sizeMultiplier;
        this.height = this.spriteHeight * this.sizeMultiplier;
        
        this.x = 200;
        this.y = state.GROUND_Y;
        
        this.playerState = {
           actions: [
               { name: "staticIdle", frames: 1, spriteIndex: 0  },
               { name: "idle", frames: 9, spriteIndex: 1  },
               { name: "walk", frames: 8, spriteIndex: 2  },
               { name: "run", frames: 8, spriteIndex: 3  },
           ],
           activeAction: 0,
           frame: 0,
           inputHandler: new InputHandler(),
           facingRight: true
        }        
    }
    
    /** @param ctx { CanvasRenderingContext2D } */
    draw(ctx){
        ctx.save();
        
        let flip = !this.playerState.facingRight;
        if (flip){
            ctx.translate(this.spriteWidth, 0)
        }
        ctx.scale(flip ? -1 : 1, 1);
        const sx = this.playerState.frame * this.spriteWidth;
        
        ctx.drawImage(this.image, sx, this.spriteHeight * this.playerState.activeAction, 
            this.spriteWidth, this.spriteHeight, (flip ? - this.x - 10 : this.x ), this.y, this.width, this.height);
        
        ctx.restore();
    }
    
    update(){
        const pressedKey = this.playerState.inputHandler?.keys[this.playerState.inputHandler.keys.length - 1];
        if (pressedKey){
            switch (pressedKey) {
                case "ArrowRight":
                    this.playerState.facingRight = true;
                    this.walk("right");
                    break;
                case "ArrowLeft":
                    this.playerState.facingRight = false;
                    this.walk("left");
                    break;
            }   
        } else{
            this.iddle();
        }
    }
    
    iddle(){
        this.updatePlayerState("idle");
    }
    
    walk(direction){
        this.updatePlayerState("walk", () => {
            direction === "right"
                ? this.x += 2
                : this.x -= 2 ;
        });
    }
    
    roll(){
        
    }
    
    updatePlayerState(actionName, callback){
        const action = this.playerState.actions.find(action => action.name === actionName);
        
        if(action.spriteIndex !== this.playerState.activeAction){
            this.playerState = {
                ...this.playerState,
                activeAction: action.spriteIndex,
                frame: 0,
            }   
        }

        if (state.GAME_FRAME % 3 === 0){
            if (this.playerState.frame > action.frames - 2){
                this.playerState.frame = 0
            } else {
                this.playerState.frame++;
            }

            callback?.();
        }
    }
}