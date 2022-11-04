import Character from "./Character.js";
import Action from "./Action.js";
import state from "./state.js";
import HitBox from "./HitBox.js";

export default class Enemy extends Character{
    constructor(ctx) {
        const image = new Image();
        image.src = "/images/sprites/enemies/guardian.png";

        const dimensions = {
            x: 400,
            y: state.GROUND_Y - 50,
            hitbox: new HitBox(400, state.GROUND_Y - 50,110, 52, 55, 65, 
                x => x - 12),
            spriteWidth: 161,
            spriteHeight: 59,
            sizeMultiplier: 2,
            callbackFlipCalcX: (x) => - x - 100
        }

        const actions = [
            new Action("walk", 8, 12, 9),
            new Action("attack1", 12, 12, 0, false, "", false, null, { path: "./sounds/dark-guardian/light-attack.mp3", frame: 1 }),
            new Action("attack2", 12, 12, 1, false, "", false, null, { path: "./sounds/dark-guardian/medium-attack.mp3", frame: 1 }),
            new Action("back-from-special", 3, 16, 4),
            new Action("special", 14, 16, 5, false, "", false, null, { path: "./sounds/dark-guardian/special.mp3", frame: 1 }),
            new Action("hit", 2, 2, 3),
            new Action("death", 11, 15, 2, false, "", true),
        ];

        super(ctx, image, actions, dimensions, null, "vertical");

        this.state.facingRight = false;

        this.activeActionCallback = null;
        this.activeActionName = null;
        this.walk();
    }
    
    hit(){
        this.state.attacking = false;
        this.state.life--;
        
        if (this.state.life < 0){
            this.die();
        } else {
            this.#triggerEnemyAction("hit", 5);   
        }
    }
    
    die(){
        this.#triggerEnemyAction("death");
        this.state.dead = true;
    }
    
    walk(){
        this.state.attacking = false;
        this.state.hitbox = this.state.backupHitbox;

        this.#triggerEnemyAction("walk", 15, () => {
            const distance = this.x - (state.PLAYER.INSTANCE.x - 110);
            
            if (distance > 0 && distance < 70 || distance < 0 && distance > -15){
                this.#launchAttackSequence();
            } else if (distance > 50) {
                this.x--;
                this.state.facingRight = false;
            } else {
                this.x++;
                this.state.facingRight = true;
            }
        });
    }
    
    attack1(){
        this.state.attacking = true;
        state.ENEMY_LAST_ATTACK = "attack1";
        
        this.#triggerEnemyAction("attack1", 100, () => {
            const { dx, dy, height } = this.state.backupHitbox;
            this.state.attackHitbox = new HitBox(this.x, this.y, dx - 40, dy, 190, height,
                x => x - 70, !this.state.facingRight);
            
            if (this.state.frame === 5){
                if(HitBox.detectCollision(this.state.attackHitbox, state.PLAYER.INSTANCE.state.hitbox)){
                    state.PLAYER.INSTANCE.hit();
                }
            }
            
            if (this.state.frame > 5){
                this.state.hitbox = new HitBox(this.x, this.y, dx + 40, dy, 45, height,
                    x => x - 90, !this.state.facingRight);
            }
        });
    }

    attack2(){
        this.state.attacking = true;
        state.ENEMY_LAST_ATTACK = "attack2";

        this.#triggerEnemyAction("attack2", 100, () => {
            const { dx, dy, height } = this.state.backupHitbox;
            this.state.attackHitbox = new HitBox(this.x, this.y, dx - 40, dy - 30, 150, height + 30,
                x => x - 30, !this.state.facingRight);

            if (this.state.frame === 5){
                if(HitBox.detectCollision(this.state.attackHitbox, state.PLAYER.INSTANCE.state.hitbox)){
                    state.PLAYER.INSTANCE.hit();
                }
            }
            if (this.state.frame < 4){
                this.state.hitbox = new HitBox(this.x, this.y, dx + 40, dy, 45, height,
                    x => x - 90, !this.state.facingRight);
            } else {
                this.state.hitbox = this.state.backupHitbox;
            }
        });
    }

    special(){
        this.state.attacking = true;
        state.ENEMY_LAST_ATTACK = "special";

        this.#triggerEnemyAction("special", 100, () => {
            const { dx, dy, height } = this.state.backupHitbox;
            this.state.attackHitbox = new HitBox(this.x, this.y, dx - 110, dy, 310, height,
                x => x - 50, !this.state.facingRight);

            if (this.state.frame === 5){
                if(HitBox.detectCollision(this.state.attackHitbox, state.PLAYER.INSTANCE.state.hitbox)){
                    state.PLAYER.INSTANCE.hit();
                }
            }

            this.state.hitbox = new HitBox(this.x, this.y, dx + 12, dy, 45, height,
                x => x - 30, !this.state.facingRight);
        }, this.backFromSpecial.bind(this));
    }
    
    backFromSpecial(){
        this.state.attacking = false;
        
        this.#triggerEnemyAction("back-from-special", 200, () => {
        });
    }
    
    update() {
        super.update();
        Action.updatePlayerState(this.activeActionName, this, this.activeActionCallback);
    }
    
    #triggerEnemyAction(actionName, durationInFrames, enemyActionCallback, endingAnimationCallback){
        if (this.activeActionName !== actionName){
            this.state.lastActionCalledAt = state.GAME_FRAME;
        }

        this.activeActionName = actionName;
        
        this.activeActionCallback = () => {
            enemyActionCallback?.();
            if (durationInFrames){
                if (this.state.lastActionCalledAt &&
                    state.GAME_FRAME - this.state.lastActionCalledAt > durationInFrames &&
                    this.state.frame >= this.state.activeAction.frameCount - 1
                ){
                    endingAnimationCallback?.();
                    if (!this.state.dead){
                        this.walk();   
                    }
                }   
            }
        }
    }
    #launchAttackSequence(){
        switch (state.ENEMY_LAST_ATTACK){
            case "attack1":
                this.attack2();
                break;
            case "attack2":
                this.special();
                break;
            default:
                this.attack1();
        }
    }
}