import state from "./state.js";
import InputHandler from "./InputHandler.js";
import Action from "./Action.js";

export default class Player{
    /** @param ctx { CanvasRenderingContext2D } */
    constructor(ctx) {
        this.image = new Image();
        this.image.src = "/images/sprites/hero.png";
        
        this.spriteWidth = 90;
        this.spriteHeight = 37;
        
        this.sizeMultiplier = 2;
        
        this.width = this.spriteWidth * this.sizeMultiplier;
        this.height = this.spriteHeight * this.sizeMultiplier;
        
        state.PLAYER.X = 200;
        this.y = state.GROUND_Y;
        
        this.playerState = {
           actions: [
               new Action("staticIdle", 1, 3, 1),
               new Action("idle", 9, 10, 2),
               new Action("walk", 8, 3, 3),
               new Action("run", 8, 3, 4),
               new Action("slash2", 5, 10, 9, true,"a"),
               new Action("slash1", 7, 10, 8, true,"s"),
               new Action("slam", 5, 15, 10, true,"d"),
               new Action("spin", 6, 16, 11, true,"f"),
               new Action("block", 6, 16, 12, true," "),
               new Action("dash", 6, 10, 13, true,"z"),
               new Action("hit", 2, 20, 26, true,"i"),
               new Action("death", 6, 15, 27, true,"o", true),
           ],
            /** @type { Action } */
           activeAction: new Action("idle", 9, 10, 2),
           activeActionSpriteIndex: 0,
           frame: 0,
           inputHandler: new InputHandler(ctx),
           dead: false,
        }        
    }
    
    /** @param ctx { CanvasRenderingContext2D } */
    draw(ctx){
        ctx.save();
        
        let flip = !state.PLAYER.FACING_RIGHT;
        if (flip){
            ctx.translate(this.spriteWidth, 0)
        }
        ctx.scale(flip ? -1 : 1, 1);
        const sx = this.playerState.frame * this.spriteWidth;
        
        ctx.drawImage(this.image, sx, this.spriteHeight * (this.playerState.activeAction.spriteIndex - 1), 
            this.spriteWidth, this.spriteHeight, (flip ? - state.PLAYER.X- 10 : state.PLAYER.X ), this.y, this.width, this.height);
        
        ctx.restore();
    }
    
    update(){
        const pressedKey = this.playerState.inputHandler?.keys[this.playerState.inputHandler.keys.length - 1]?.name;
        
        if (!this.playerState.dead){
            if (pressedKey){
                switch (pressedKey) {
                    case "ArrowRight":
                        state.PLAYER.MOVING = true;
                        state.PLAYER.FACING_RIGHT = true;
                        
                        Action.updatePlayerState("walk", this, () => {
                            if (state.PLAYER.X < state.BACKGROUND.VISIBLE_WIDTH){
                                state.PLAYER.X += 2;
                            }
                        });
                        
                        break;
                    case "ArrowLeft":
                        state.PLAYER.MOVING = true;
                        state.PLAYER.FACING_RIGHT = false;
                        
                        Action.updatePlayerState("walk", this, () => {
                            if (state.PLAYER.X > state.BACKGROUND.X){
                                state.PLAYER.X -= 2;
                            }
                        });
                        
                        break;
                    case "s":
                        Action.updatePlayerState("slash1", this);
                        break;
                    case "a":
                        Action.updatePlayerState("slash2", this);
                        break;
                    case "d":
                        Action.updatePlayerState("slam", this);
                        break;
                    case "f":
                        Action.updatePlayerState("spin", this);
                        break;
                    case " ":
                        Action.updatePlayerState("block", this);
                        break;
                    case "z":
                        Action.updatePlayerState("dash", this);

                        if (state.PLAYER.FACING_RIGHT && state.PLAYER.X < state.BACKGROUND.VISIBLE_WIDTH){
                            state.PLAYER.X += 5;
                        }

                        if (!state.PLAYER.FACING_RIGHT && state.PLAYER.X > state.BACKGROUND.X){
                            state.PLAYER.X -= 5;
                        }
                        
                        
                        break;
                    case "i":
                        Action.updatePlayerState("hit", this);
                        break;

                    case "o":
                        Action.updatePlayerState("death", this);
                        if (this.playerState.frame >= this.playerState.activeAction.frameCount - 1){
                            this.playerState.dead = true;
                        }
                        break;
                        
                    default:
                        state.PLAYER.MOVING = false;
                }
            } else {
                state.PLAYER.MOVING = false;
                Action.updatePlayerState("idle", this);
            }
        }
    }
}