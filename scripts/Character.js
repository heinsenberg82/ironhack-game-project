import Action from "./Action.js";

export default class Character {
    /** @param ctx { CanvasRenderingContext2D }
     * @param image { HTMLImageElement }
     * @param actions { Array.<Action> }
     * @param dimensions { { spriteWidth: Number, hitbox: HitBox, spriteHeight: Number, sizeMultiplier: Number }}
     * @param inputHandler { InputHandler }
     * @param spriteOrientation { "horizontal" | "vertical" }
     */
    constructor(ctx, image, actions, dimensions, inputHandler = null, spriteOrientation = "horizontal") {
        
        this.spriteOrientation = spriteOrientation;
        this.image = image;        
        const { x, y, hitbox, spriteWidth, spriteHeight, sizeMultiplier } = dimensions;
        
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
        this.sizeMultiplier = sizeMultiplier;
        
        this.width = this.spriteWidth * this.sizeMultiplier;
        this.height = this.spriteHeight * this.sizeMultiplier;
        
        this.x = x;
        this.y = y;
        
        this.actions = actions;
        
        this.state = {
            /** @type { Action } */
           activeAction: new Action("idle", 9, 10, 2),
           activeActionSpriteIndex: 0,
           frame: 0,
           inputHandler: inputHandler,
           facingRight: null,
           moving: false,
           dead: false,
           hitbox: hitbox.init(this.x, this.y),
           attackHitbox: null,
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
        
        const dx = flip ? - this.x - 10 : this.x;
        
        ctx.drawImage(this.image, sx, sy, this.spriteWidth, this.spriteHeight, dx, this.y, this.width, this.height); 
        ctx.restore();
        
        ///////// FOR TESTING PURPOSES !!!!! (visual hitboxes) ///////////////////////////
        ctx.save();
        ctx.strokeStyle = "red";
        if (flip && !this.state.activeAction.blocking){
            ctx.translate(this.state.hitbox.width, 0)
            ctx.scale(-1, 1);
        }

        ctx.strokeRect((flip && !this.state.activeAction.blocking ? 
            this.state.hitbox.callbackFlipCalcX?.()
            : this.state.hitbox.x), 
            this.state.hitbox.y, this.state.hitbox.width, this.state.hitbox.height);

        if (this.state.attackHitbox){
            ctx.strokeStyle = "cyan";
            ctx.strokeRect((flip && !this.state.activeAction.blocking ?
                    this.state.attackHitbox.callbackFlipCalcX?.()
                    : this.state.attackHitbox.x),
                this.state.attackHitbox.y, this.state.attackHitbox.width, this.state.attackHitbox.height);
        }

        ctx.restore();
        ////////////////////////////////////////// ///////////
    }
    
    update(){
        this.state.hitbox = this.state.hitbox.init(this.x, this.y);
    }
}