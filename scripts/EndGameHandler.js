import state from "./state.js";

export default class EndGameHandler {
    /**
     * 
     * @param ctx { CanvasRenderingContext2D }
     */
    constructor(ctx) {
        this.ctx = ctx;
    }
    
    update(restartCallback){
        if (!state.ENEMIES.some(enemy => !enemy.state.dead)){
            this.#drawEndInstructions("YOU WON!");
            this.#addPlayAgainEvent(restartCallback);
        } else if(state.PLAYER.INSTANCE.state.dead){
            this.#drawEndInstructions("GAME OVER");
            this.#addPlayAgainEvent(restartCallback);
        }        
    }
    
    #drawEndInstructions(text){
        this.ctx.font = '72px Syne Mono';
        this.ctx.fillStyle = "#9e9e9e"
        this.ctx.fillText(text,
            this.ctx.canvas.width / 2 - 160,
            this.ctx.canvas.height / 2);

        this.ctx.font = '36px Syne Mono';
        const pressEnter = "Press ENTER to play again"
        this.ctx.fillText(pressEnter,
            this.ctx.canvas.width / 2 - 250,
            this.ctx.canvas.height / 2 + 40);
    }
    
    #addPlayAgainEvent(restartCallback){
        window.addEventListener("keypress", e => {
            if (e.key === "Enter"){
                // restartCallback?.();
                window.location.reload();
            }
        });

        this.ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}