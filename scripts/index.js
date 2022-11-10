import Background from "./Background.js"
import state from "./state.js";
import Hero from "./Hero.js";
import Enemy from "./Enemy.js";
import EndGameHandler from "./EndGameHandler.js";

let fpsInterval, startTime, now, then, elapsed;
let backgroundAudioPlayed = false;

window.addEventListener("load", ()=>{    
    init()
    loadBackgroundMusic();
});

function clearCanvas(ctx){
    ctx.clearRect(0, 0, state.CANVAS.WIDTH, state.CANVAS.HEIGHT);
}

function randomizeEnemy(intervalFunction, minDelay, maxDelay) {
    let timeout;

    const runInterval = () => {
        const timeoutFunction = () => {
            intervalFunction();
            runInterval();
        };

        const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

        timeout = setTimeout(timeoutFunction, delay);
    };

    runInterval();
    
    return {
        clear() {
            clearTimeout(timeout)
        },
    };
}

function loadBackgroundMusic(){
    window.addEventListener("keydown", () => {
        const audio = new Audio("sounds/background/1.mp3");
        audio.loop = true;
        audio.volume = 0.3;
        console.log(audio.paused)
        if (!backgroundAudioPlayed){
            backgroundAudioPlayed = true;
            audio.play();   
        }
    })
}

function init(){
    const canvas = document.getElementById("main-canvas");
    /** @type { CanvasRenderingContext2D } */
    const ctx = canvas.getContext("2d");
    const background = new Background();
    state.PLAYER.INSTANCE = new Hero(ctx);
    const enemy = new Enemy(ctx);
    state.ENEMIES.push(enemy);
    const endGameHandler = new EndGameHandler(ctx);

    const rdn = randomizeEnemy(() => {
        if (!state.ENEMIES.find(enemy => !enemy.state.dead)){
            rdn.clear();
        } else {
            const attacksCallbacks = [
                enemy.attack1.bind(enemy),
                enemy.attack2.bind(enemy),
                enemy.special.bind(enemy),
            ];

            attacksCallbacks[Math.floor(Math.random() * (attacksCallbacks.length))]?.();
        }
    }, 2000, 5000);

    function startAnimating(fps) {
        fpsInterval = 1000 / fps;
        then = window.performance.now();
        startTime = then;
        animate();
    }

    function animate(timestamp){
        requestAnimationFrame(animate);
        
        elapsed = timestamp - then;

        if (elapsed > fpsInterval){
            state.TIMESTAMP = timestamp;
            clearCanvas(ctx);
            background.draw(ctx);

            state.PLAYER.INSTANCE.draw(ctx);
            enemy.draw(ctx)
            state.PLAYER.INSTANCE.update(ctx);
            enemy.update();

            background.configMove();

            endGameHandler.update(init);
        }
    }

    startAnimating(25);
}