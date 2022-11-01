import Background from "./Background.js"
import state from "./state.js";
import Player from "./Player.js";

let fpsInterval, startTime, now, then, elapsed;

window.addEventListener("load", ()=>{
    const canvas = document.getElementById("main-canvas");
    /** @type { CanvasRenderingContext2D } */
    const ctx = canvas.getContext("2d");
    const background = new Background();
    const player = new Player();

    function startAnimating(fps) {
        fpsInterval = 1000 / fps;
        then = window.performance.now();
        startTime = then;
        animate();
    }
    
    function animate(){
        requestAnimationFrame(animate);

        now = Date.now();
        elapsed = now - then;
        
        if (elapsed > fpsInterval){
            state.GAME_FRAME++;
            clear(ctx);
            background.draw(ctx);
            player.draw(ctx);
            player.update();
        }
    }
    
    startAnimating(5);
    
});

function clear(ctx){
    ctx.clearRect(0, 0, state.CANVAS_WIDTH, state.CANVAS_HEIGHT);
}