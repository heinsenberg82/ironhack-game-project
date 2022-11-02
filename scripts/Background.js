import state from "./state.js";

export default class Background {
    constructor() {
        state.BACKGROUND.X = 0;
        state.BACKGROUND.Y = 0;
        this.spriteWidth = 314;
        this.spriteHeight = 100;
        state.BACKGROUND.WIDTH = this.spriteWidth * 6;
        state.BACKGROUND.HEIGHT = this.spriteHeight * 6;
        state.BACKGROUND.VISIBLE_WIDTH = state.BACKGROUND.WIDTH * 0.3
        this.layers = [];
        this.speed = 0.5;
        
        this.layer1 = new Image();
        this.layer1.src = "/images/background/1-Background.png";
        this.layer1.speed = this.speed;

        this.layer2 = new Image();
        this.layer2.src = "/images/background/2-super far.png";
        this.layer2.speed = this.speed * 0.3;

        this.layer3 = new Image();
        this.layer3.src = "/images/background/3-far.png";
        this.layer3.speed = this.speed * 0.5;

        this.layer4 = new Image();
        this.layer4.src = "/images/background/4-far light.png";
        this.layer4.speed = this.speed * 0.7;

        this.layer5 = new Image();
        this.layer5.src = "/images/background/5-close.png";
        this.layer5.speed = this.speed * 0.8;

        this.layer6 = new Image();
        this.layer6.src = "/images/background/6-close light.png";
        this.layer6.speed = this.speed * 0.9;

        this.layer7 = new Image();
        this.layer7.src = "/images/background/7-tileset.png";
        this.layer7.speed = this.speed;
        
        this.layers.push(this.layer1, this.layer2, this.layer3, this.layer4, this.layer5, this.layer6, this.layer7);
    }

    /** @param ctx { CanvasRenderingContext2D } */
    draw(ctx){
        this.layers.forEach(layer => {
            ctx.drawImage(layer, 0, 0, this.spriteWidth, this.spriteHeight,
                state.BACKGROUND.X * layer.speed, state.BACKGROUND.Y, state.BACKGROUND.WIDTH, state.BACKGROUND.HEIGHT);
        });
    }
    
    configMove(){
        
        if (state.PLAYER.MOVING && state.PLAYER.X < 200 && !state.PLAYER.FACING_RIGHT){
            if (state.BACKGROUND.X <= 0){
                state.BACKGROUND.X+=2;
            }
        }
        
        if (state.PLAYER.MOVING && state.PLAYER.X > 450 && state.PLAYER.FACING_RIGHT){
            if (Math.abs(state.BACKGROUND.X) < state.BACKGROUND.WIDTH * 0.3){
                state.BACKGROUND.X-=2;
            }
        }
    }
}