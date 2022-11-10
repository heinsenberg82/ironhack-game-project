import Character from "./Character.js";
import state from "./state.js";
import Action from "./Action.js";
import InputHandler from "./InputHandler.js";
import HitBox from "./HitBox.js";

export default class Hero extends Character{
    /**
     * 
     * @param ctx { CanvasRenderingContext2D }
     */
    constructor(ctx) {
        const image = new Image();
        image.src = "/ironhack-game-project/images/sprites/hero.png";

        const dimensions = {
            x: 200,
            y: state.GROUND_Y,
            hitbox: new HitBox(200, state.GROUND_Y, 32, 20, 45, 50,
                x => x + 5),
            spriteWidth: 90,
            spriteHeight: 37,
            sizeMultiplier: 2,
            callbackFlipCalcX: (x) => - x - 20
        }
        
        const actions = [
            // new Action("staticIdle", 1, 3, 1),
            new Action("idle", 9, 10, 2),
            new Action("walk", 8, 3, 3),
            new Action("run", 8, 3, 4),
            new Action("runFast", 8, 3, 5),
            new Action("slash2", 5, 10, 9, true,"a", false,  null, { path: "/ironhack-game-project/sounds/hero/light-attack.mp3", frame: 0 }),
            new Action("slash1", 7, 10, 8, true,"s", false, null, { path: "/ironhack-game-project/sounds/hero/medium-attack.mp3", frame: 0 }),
            new Action("slam", 5, 15, 10, true,"d", false, null, { path: "/ironhack-game-project/sounds/hero/strong-attack.mp3", frame: 0 }),
            new Action("spin", 6, 16, 11, true,"f", false, null, { path: "/ironhack-game-project/sounds/hero/spin-attack.mp3", frame: 0 }),
            new Action("block", 6, 16, 12, true," "),
            new Action("dash", 6, 10, 13, true,"z"),
            new Action("hit", 3, 5, 26, true,"i", false, 50),
            new Action("death", 6, 12, 27, true,null, true),
        ];
        
        const inputHandler = new InputHandler(ctx);
        
        super(ctx, image, actions, dimensions, inputHandler);
        
        this.state.facingRight = true;
        this.sprintInterval = 80;
        this.runInterval = 180;
    }
    
    update(ctx) {
        super.update();
        
        if (this.state.activeAction.durationInFrames || this.state.activeAction.indefinitely){
            Action.updatePlayerState(this.state.activeAction.name, this);
        } else{
            const pressedKey = this.state.inputHandler?.keys[this.state.inputHandler.keys.length - 1]?.name;

            if (!this.state.dead){
                if (pressedKey){
                    const framesPassedStartedWalk = state.TIMESTAMP - this.state.lastStartedWalking;

                    switch (pressedKey) {
                        case "ArrowRight":
                            this.state.attacking = false;
                            this.state.blocking = false;
                            this.state.moving = true;
                            this.state.facingRight = true;
                            this.state.lastStartedWalking ??= state.TIMESTAMP;

                            if(framesPassedStartedWalk < this.sprintInterval){
                                Action.updatePlayerState("walk", this, () => {

                                    if (this.x < state.BACKGROUND.VISIBLE_WIDTH){
                                        this.x += 2;
                                        this.state.hitbox.x += 2;
                                    }
                                });
                            } else if (framesPassedStartedWalk < this.runInterval ) {
                                Action.updatePlayerState("run", this, () => {
                                    if (this.x < state.BACKGROUND.VISIBLE_WIDTH){
                                        this.x += 3;
                                        this.state.hitbox.x +=3;
                                    }
                                });
                            } else {
                                Action.updatePlayerState("runFast", this, () => {
                                    if (this.x < state.BACKGROUND.VISIBLE_WIDTH){
                                        this.x += 5;
                                        this.state.hitbox.x +=5;
                                    }
                                });
                            }

                            break;
                        case "ArrowLeft":
                            this.state.attacking = false;
                            this.state.blocking = false;
                            this.state.moving = true;
                            this.state.facingRight = false;
                            this.state.lastStartedWalking ??= state.TIMESTAMP;

                            if(framesPassedStartedWalk < this.sprintInterval){
                                Action.updatePlayerState("walk", this, () => {
                                    if (this.x > state.BACKGROUND.X){
                                        this.x -= 2;
                                        this.state.hitbox.x -=2;
                                    }
                                });
                            } else if (framesPassedStartedWalk < this.runInterval ){
                                Action.updatePlayerState("run", this, () => {
                                    if (this.x > state.BACKGROUND.X){
                                        this.x -= 3;
                                        this.state.hitbox.x -=3;
                                    }
                                });
                            } else {
                                Action.updatePlayerState("runFast", this, () => {
                                    if (this.x > state.BACKGROUND.X){
                                        this.x -= 5;
                                        this.state.hitbox.x -=5;
                                    }
                                });
                            }

                            break;
                        case "s":
                            this.state.lastStartedWalking = null;
                            this.state.attacking = true;
                            this.state.blocking = false;

                            Action.updatePlayerState("slash1", this, () => {
                                const { dx, dy, height } = this.state.hitbox;
                                this.state.attackHitbox = new HitBox(this.x, this.y, dx, dy, 140, height,
                                    x => x - 90, !this.state.facingRight);

                                this.launchAttach(2);
                            });
                            break;
                        case "a":
                            this.state.lastStartedWalking = null;
                            this.state.attacking = true;
                            this.state.blocking = false;

                            Action.updatePlayerState("slash2", this, () => {
                                const { dx, dy, height } = this.state.hitbox;
                                this.state.attackHitbox = new HitBox(this.x, this.y, dx, dy, 150, height,
                                    x => x - 100, !this.state.facingRight);

                                this.launchAttach(2);
                            });
                            break;
                        case "d":
                            this.state.lastStartedWalking = null;
                            this.state.attacking = true;
                            this.state.blocking = false;

                            Action.updatePlayerState("slam", this, () => {
                                const { dx, dy } = this.state.hitbox;
                                this.state.attackHitbox = new HitBox(this.x, this.y, dx, dy - 20, 150, 70,
                                    x => x - 110, !this.state.facingRight);

                                this.launchAttach(2);
                            });
                            break;
                        case "f":
                            this.state.lastStartedWalking = null;
                            this.state.attacking = true;
                            this.state.blocking = false;

                            Action.updatePlayerState("spin", this, () => {
                                const { dx, dy, height } = this.state.hitbox;
                                this.state.attackHitbox = new HitBox(this.x, this.y, dx - 40, dy, 180, height,
                                    x => x - 60, !this.state.facingRight);

                                this.launchAttach(1);
                            });
                            break;
                        case " ":
                            this.state.lastStartedWalking = null;
                            this.state.attacking = false;
                            this.state.blocking = true;

                            Action.updatePlayerState("block", this);
                            break;
                        case "z":
                            this.state.attacking = false;
                            this.state.blocking = false;
                            this.state.lastStartedWalking = null;

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
                            this.state.attacking = false;
                            this.state.blocking = false;
                            this.state.lastStartedWalking = null;

                            Action.updatePlayerState("hit", this);
                            break;

                        case "p":
                            this.state.inputHandler.removeKey("p")
                            state.ENEMIES.forEach(enemy => enemy.special())
                            break;

                        default:
                            this.state.moving = false;
                    }
                } else if(!this.state.activeAction.durationInFrames) {
                    this.idle();
                }
            }   
        }
        
        if (this.x < 0){
            this.x = 0;
        }
        
        state.PLAYER.X = this.x;
        state.PLAYER.FACING_RIGHT = this.state.facingRight;
        state.PLAYER.MOVING = this.state.moving;
    }

    hit(){        
        this.state.lastStartedWalking = null;
        if (!this.state.blocking){
            switch (state.ENEMIES[0].state.activeAction.name) {
                case "special":
                    this.state.life-= 3;
                    break;
                default:
                    this.state.life--;
            }

            if (this.state.life < 0){
                this.die();
            } else {
                Action.updatePlayerState("hit", this);
            }   
        } else {
            console.log("blocked")
        }
    }
    
    die(){
        Action.updatePlayerState("death", this);
        this.state.dead = true;
    }
    
    launchAttach(attackFrame){
        if (this.state.frame === attackFrame){
            state.ENEMIES.forEach(enemy => {
                if (!enemy.state.attacking){
                    if(HitBox.detectCollision(this.state.attackHitbox, enemy.state.hitbox)){
                        enemy.hit();
                    }   
                }
            });
        }
    }
}