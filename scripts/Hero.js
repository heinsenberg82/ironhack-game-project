import Character from "./Character.js";
import state from "./state.js";
import Action from "./Action.js";
import InputHandler from "./InputHandler.js";
import HitBox from "./HitBox.js";

export default class Hero extends Character{
    constructor(ctx) {
        const image = new Image();
        image.src = "/images/sprites/hero.png";
        
        const dimensions = {
            x: 200,
            y: state.GROUND_Y,
            hitbox: new HitBox(32, 20, 45, 50, 
                () => - this.x - 23),
            spriteWidth: 90,
            spriteHeight: 37,
            sizeMultiplier: 2,
        }
        
        const actions = [
            new Action("staticIdle", 1, 3, 1),
            new Action("idle", 9, 10, 2),
            new Action("walk", 8, 3, 3),
            new Action("run", 8, 3, 4),
            new Action("runFast", 8, 3, 5),
            new Action("slash2", 5, 10, 9, true,"a"),
            new Action("slash1", 7, 10, 8, true,"s"),
            new Action("slam", 5, 15, 10, true,"d"),
            new Action("spin", 6, 16, 11, true,"f"),
            new Action("block", 6, 16, 12, true," "),
            new Action("dash", 6, 10, 13, true,"z"),
            new Action("hit", 2, 20, 26, true,"i"),
            new Action("death", 6, 15, 27, true,"o", true),
        ];
        
        const inputHandler = new InputHandler(ctx);
        
        super(ctx, image, actions, dimensions, inputHandler);
        
        this.state.facingRight = true;
        this.state.lastStartednWalking = 0;
        this.sprintInterval = 80;
        this.runInterval = 180;
    }
    
    update(ctx) {
        super.update();
        
        const pressedKey = this.state.inputHandler?.keys[this.state.inputHandler.keys.length - 1]?.name;

        if (!this.state.dead){
            if (pressedKey){
                const framesPassed = state.GAME_FRAME - this.state.lastStartednWalking;
                
                switch (pressedKey) {
                    case "ArrowRight":
                        this.state.moving = true;
                        this.state.facingRight = true;
                        this.state.lastStartednWalking ??= state.GAME_FRAME;
                        
                        if(framesPassed < this.sprintInterval){
                            Action.updatePlayerState("walk", this, () => {

                                if (this.x < state.BACKGROUND.VISIBLE_WIDTH){
                                    this.x += 2;
                                    this.state.hitbox.x += 2;
                                }
                            });
                        } else if (framesPassed < this.runInterval ) {
                            Action.updatePlayerState("run", this, () => {
                                if (this.x < state.BACKGROUND.VISIBLE_WIDTH){
                                    this.x += 3;
                                    this.state.hitbox.x +=3;
                                }
                            });
                        } else {
                            Action.updatePlayerState("runFast", this, () => {
                                if (this.x < state.BACKGROUND.VISIBLE_WIDTH){
                                    this.x += 4;
                                    this.state.hitbox.x +=4;
                                }
                            });
                        }

                        break;
                    case "ArrowLeft":
                        this.state.moving = true;
                        this.state.facingRight = false;
                        this.state.lastStartednWalking ??= state.GAME_FRAME;
                        
                        if(framesPassed < this.sprintInterval){
                            Action.updatePlayerState("walk", this, () => {
                                if (this.x > state.BACKGROUND.X){
                                    this.x -= 2;
                                    this.state.hitbox.x -=2;
                                }
                            });
                        } else if (framesPassed < this.runInterval ){
                            Action.updatePlayerState("run", this, () => {
                                if (this.x > state.BACKGROUND.X){
                                    this.x -= 3;
                                    this.state.hitbox.x -=3;
                                }
                            });
                        } else {
                            Action.updatePlayerState("runFast", this, () => {
                                if (this.x > state.BACKGROUND.X){
                                    this.x -= 4;
                                    this.state.hitbox.x -=4;
                                }
                            });
                        }

                        break;
                    case "s":
                        this.state.lastStartednWalking = null;
                        
                        Action.updatePlayerState("slash1", this);
                        break;
                    case "a":
                        this.state.lastStartednWalking = null;
                        
                        Action.updatePlayerState("slash2", this);
                        
                        this.state.attackHitbox = { ...this.state.hitbox }
                        if (this.state.facingRight) {
                            this.state.attackHitbox.x += this.state.frame ^ 5 * 20
                        } else {
                            this.state.attackHitbox.x -= this.state.frame ^ 5 * 22
                        }
                        break;
                    case "d":
                        this.state.lastStartednWalking = null;
                        
                        Action.updatePlayerState("slam", this);
                        break;
                    case "f":
                        this.state.lastStartednWalking = null;
                        
                        Action.updatePlayerState("spin", this);
                        break;
                    case " ":
                        this.state.lastStartednWalking = null;
                        
                        Action.updatePlayerState("block", this);
                        break;
                    case "z":
                        this.state.lastStartednWalking = null;
                        
                        Action.updatePlayerState("dash", this);

                        if (this.state.facingRight && this.x < state.BACKGROUND.VISIBLE_WIDTH){
                            this.x += 5;
                            this.state.hitbox.x += 5;
                        }

                        if (!this.state.facingRight && this.x > state.BACKGROUND.X){
                            this.x -= 5;
                            this.state.hitbox.x -= 5;
                        }


                        break;
                    case "i":
                        this.state.lastStartednWalking = null;
                        
                        Action.updatePlayerState("hit", this);
                        break;

                    case "o":
                        Action.updatePlayerState("death", this);
                        if (this.state.frame >= this.state.activeAction.frameCount - 1){
                            this.state.dead = true;
                        }
                        break;

                    default:
                        this.state.moving = false;
                }
            } else {
                this.state.moving = false;
                this.state.lastStartednWalking = null;
                
                Action.updatePlayerState("idle", this);
            }
        }
        
        if (this.x < 0){
            this.x = 0;
        }
        
        state.PLAYER.X = this.x;
        state.PLAYER.FACING_RIGHT = this.state.facingRight;
        state.PLAYER.MOVING = this.state.moving;
    }
}