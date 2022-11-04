import Action from "./Action.js";
import HitBox from "./HitBox.js";
import state from "./state.js";

export default class Character {
    /** @param ctx { CanvasRenderingContext2D }
     * @param image { HTMLImageElement }
     * @param actions { Array.<Action> }
     * @param dimensions { { spriteWidth: Number, hitbox: HitBox, spriteHeight: Number, sizeMultiplier: Number }}
     * @param inputHandler { InputHandler }
     * @param spriteOrientation { "horizontal" | "vertical" }
     * @param life { Number }
     */
    constructor(ctx, image, actions, dimensions, 
                inputHandler = null, spriteOrientation = "horizontal", life = 6) {
        
        this.spriteOrientation = spriteOrientation;
        this.image = image;        
        const { x, y, hitbox, spriteWidth, spriteHeight, sizeMultiplier, callbackFlipCalcX } = dimensions;
        
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
        this.sizeMultiplier = sizeMultiplier;
        this.callbackFlipCalcX = callbackFlipCalcX;
        
        this.width = this.spriteWidth * this.sizeMultiplier;
        this.height = this.spriteHeight * this.sizeMultiplier;
        
        this.x = x;
        this.y = y;
        
        this.actions = actions;
        
        this.state = {
            /** @type { Action } */
           activeAction: new Action(actions[0], actions[0].frameCount, 
                actions[0].speedModifier, actions[0].spriteIndex), 
           lastActionCalledAt: null,
           activeActionSpriteIndex: 0,
           frame: 0,
           inputHandler: inputHandler,
           facingRight: true,
           moving: false, 
           attacking: false,
           blocking: false,
           lastStartedWalking: 0,
           dead: false,
            /** @type { HitBox } */
           hitbox: hitbox,
            /** @type { HitBox } */
           attackHitbox: null,
           /** @type { HitBox } */
           backupHitbox: hitbox,
           life: life,
        }        
    }
    
    /** @param ctx { CanvasRenderingContext2D } */
    draw(ctx){
        ctx.save();

        let flip = !this.state.facingRight;
        if (flip){
            ctx.translate(this.spriteWidth, 0)
            ctx.scale(-1, 1);
        }
        
        let sx, sy;
        
        if (this.spriteOrientation === "horizontal"){
            sx = this.state.frame * this.spriteWidth;
            sy = this.spriteHeight * (this.state.activeAction.spriteIndex - 1);   
        } else {
            sx = this.spriteWidth * (this.state.activeAction.spriteIndex);
            sy = this.state.frame * this.spriteHeight;
        }
        
        const dx = flip ? this.callbackFlipCalcX(this.x) : this.x;
        
        ctx.drawImage(this.image, sx, sy, this.spriteWidth, this.spriteHeight, dx, this.y, this.width, this.height); 
        ctx.restore();
        
        ///////// FOR TESTING PURPOSES !!!!! (visual hitboxes) ///////////////////////////
        // ctx.save();
        // ctx.strokeStyle = "red";
        // ctx.strokeRect(this.state.hitbox.x, this.state.hitbox.y, this.state.hitbox.width, this.state.hitbox.height);
        //
        // if (this.state.attackHitbox){
        //     ctx.strokeStyle = "cyan";
        //     ctx.strokeRect(this.state.attackHitbox.x, this.state.attackHitbox.y, this.state.attackHitbox.width, this.state.attackHitbox.height);   
        // }
        //
        // ctx.restore();
        ////////////////////////////////////////// ///////////

        if (state.PLAYER.INSTANCE.state.life >= 0){
            for (let i = 0; i < state.PLAYER.INSTANCE.state.life; i++) {
                const barNumber = i + 1;
                
                ctx.fillStyle = "#c62828";
                ctx.fillRect(10 * barNumber, 10, 20, 20);
            }
        }

        if (state.ENEMIES[0]?.state.life >= 0){
            for (let i = 0; i < state.ENEMIES[0]?.state.life; i++) {
                const barNumber = i + 1;

                ctx.fillStyle = "#c62828";
                ctx.fillRect((ctx.canvas.width - 80) + 10 * barNumber, 10, 20, 20);
            }
        }
    }
    
    update(){
        this.state.hitbox.update(this.x, this.y, !this.state.facingRight);
        if (this.state.attackHitbox){
            this.state.attackHitbox?.update(this.x, this.y, !this.state.facingRight);
        }
    }

    idle(){
        this.state.attacking = false;
        this.state.blocking = false;
        this.state.moving = false;
        this.state.lastStartedWalking = null;
        
        this.state.hitbox = this.state.backupHitbox;

        Action.updatePlayerState("idle", this);
    }
}