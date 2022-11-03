import Character from "./Character.js";
import Action from "./Action.js";
import state from "./state.js";
import HitBox from "./HitBox.js";

export default class Enemy extends Character{
    constructor(ctx) {
        const image = new Image();
        image.src = "/images/sprites/enemies/guardian.png";

        const dimensions = {
            x: 300,
            y: state.GROUND_Y - 50,
            hitbox: new HitBox(90, 52, 100, 65, 
                () => - this.x - 10 ),
            spriteWidth: 160,
            spriteHeight: 59,
            sizeMultiplier: 2,
        }

        const actions = [
            new Action("idle", 11, 15, 1),
            new Action("walk", 8, 3, 10),
        ];

        super(ctx, image, actions, dimensions, null, "vertical");

        this.state.facingRight = true;
    }
    
    update() {
        super.update();
        Action.updatePlayerState("idle", this);
    }
}