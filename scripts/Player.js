import state from "./state.js";
import InputHandler from "./InputHandler.js";
import Action from "./Action.js";

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
               new Action("staticIdle", 1, 3, 1),
               new Action("idle", 9, 10, 2),
               new Action("walk", 8, 3, 3),
               new Action("run", 8, 3, 4),
               new Action("slash1", 7, 10, 8, "a"),
               new Action("slash2", 5, 3, 9, "s"),
           ],
           activeActionSpriteIndex: 0,
           frame: 0,
           animating: false,
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
        
        ctx.drawImage(this.image, sx, this.spriteHeight * (this.playerState.activeActionSpriteIndex - 1), 
            this.spriteWidth, this.spriteHeight, (flip ? - this.x - 10 : this.x ), this.y, this.width, this.height);
        
        ctx.restore();
    }
    
    update(){
        const pressedKey = this.playerState.inputHandler?.keys[this.playerState.inputHandler.keys.length - 1]?.name;

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
                case "a":
                    this.slash1();
                    break;
            }
        } else{
            this.idle();
        }
    }

    updatePlayerState(actionName, callback){
        const action = this.playerState.actions.find(action => action.name === actionName);

        if(action.spriteIndex !== this.playerState.activeActionSpriteIndex){
            this.playerState = {
                ...this.playerState,
                activeActionSpriteIndex: action.spriteIndex,
                frame: 0,
            }
        }

        if (state.GAME_FRAME % action.speedModifier === 0){
            if (this.playerState.frame > action.frameCount - 2){
                this.playerState.frame = 0
            } else {
                this.playerState.frame++;
            }

            callback?.();
        }
        
        return action;
    }
    
    idle(){
        this.updatePlayerState("idle");
    }
    
    walk(direction){
        this.updatePlayerState("walk", () => {
            direction === "right"
                ? this.x += 2
                : this.x -= 2 ;
        });
    }
    
    slash1(){
        this.playerState.animating = true;
        const action = this.updatePlayerState("slash1");
        this.playerState.animating = !action.endAnimation(this);
    }
}