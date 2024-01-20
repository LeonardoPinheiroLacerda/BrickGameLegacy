class GameBrickBody {

    constructor(game) {
        /**@type{Game} */
        this.game = game;
    }

    WIDTH_MULTIPLIER = 1.3;
    HEIGHT_MULTIPLIER = 2.135;

    update(game) {
        this.game = game;
    }

    setVariables() {
        const root = document.querySelector(":root");

        root.style.setProperty("--color", "rgb(0, 68, 187)");
        root.style.setProperty("--color-shadow", "rgb(1, 28, 74)");
        root.style.setProperty("--color-shadow-reflexion", "rgb(3, 94, 255)");

        root.style.setProperty("--button-color", 'rgb(247, 222, 57)');
        root.style.setProperty("--button-color-reflexion", "rgb(250, 241, 185)");

        root.style.setProperty("--width-multiplier", this.WIDTH_MULTIPLIER);
        root.style.setProperty("--height-multiplier", this.HEIGHT_MULTIPLIER);

        root.style.setProperty("--dispersion", '3px')

        root.style.setProperty("--width", parseInt(this.game.width) + "px");
        root.style.setProperty("--height", parseInt(this.game.height) + "px");
    }

    //Buttons
    buttonContainer(controlContainer, containerClass, labelText, btnClass, btnId) {
        const container = document.createElement("div");
        container.classList.add(containerClass);
        controlContainer.append(container);

        const label = document.createElement("label");
        label.innerHTML = labelText;
        container.append(label);

        const button = document.createElement("button");
        button.id = btnId;
        button.classList.add(btnClass);

        container.append(button);
    }

    create(callback) {

        this.setVariables();

        //Append css link
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './css/gameBrickBody.css';

        link.onload = () => {

            //Add class to container
            this.game.body.classList.add("brick-game-body");

            //Add frame
            const frame = document.createElement('div');
            frame.classList.add('frame');
            this.game.body.append(frame);

            //Add title
            const title = document.createElement('h1');
            title.classList.add("title");
            this.game.body.append(title);
            title.innerText = "Game Brick"


            //Add Controls
            const controlContainer = document.createElement("div");
            controlContainer.classList.add("controls-container");

            this.game.body.append(controlContainer);

            this.buttonContainer(controlContainer, "up-btn-container", "W", "btn", "up-btn");
            this.buttonContainer(controlContainer, "down-btn-container", "S", "btn", "down-btn");
            this.buttonContainer(controlContainer, "right-btn-container", "D", "btn", "right-btn");
            this.buttonContainer(controlContainer, "left-btn-container", "A", "btn", "left-btn");

            this.buttonContainer(controlContainer, 'action-btn-container', 'J', "lg-btn", "action-btn");

            this.buttonContainer(controlContainer, 'on-off-btn-container', "ON OFF", "sm-btn", "on-off-btn");
            this.buttonContainer(controlContainer, 'start-pause-btn-container', "START PAUSE", "sm-btn", "start-pause-btn");
            this.buttonContainer(controlContainer, 'sound-btn-container', "SOUND", "sm-btn", "sound-btn");
            this.buttonContainer(controlContainer, 'reset-btn-container', "RESET", "sm-btn", "reset-btn");

            callback();
        }

        document.head.append(link);

    }

    bound({
        onUp = () => { navigator.vibrate(150); console.log("UP PRESSED") },
        onDown = () => { navigator.vibrate(150); console.log("DOWN PRESSED") },
        onLeft = () => { navigator.vibrate(150); console.log("LEFT PRESSED") },
        onRight = () => { navigator.vibrate(150); console.log("RIGHT PRESSED") },
        onAction = () => { navigator.vibrate(150); console.log("ACTION PRESSED") },
        onOnOff = () => { console.log("ON_OFF PRESSED") },
        onStart = () => { console.log("START PRESSED") },
        onSound = () => { console.log("SOUND PRESSED") },
        onReset = () => { console.log("RESET PRESSED") }
    } = {}) {

        this.onUp = onUp;
        this.onDown = onDown;
        this.onLeft = onLeft;
        this.onRight = onRight;
        this.onAction = onAction;
        this.onOnOff = onOnOff;
        this.onStart = onStart;
        this.onSound = onSound;
        this.onReset = onReset;

        this.holdTimerOnUp;
        this.delayTimerOnUp;
        this.touchStartOnUp = () => {
            this.delayTimerOnUp = setTimeout(() => {
                this.holdTimerOnUp = setInterval(() => {
                    this.onUp();
                }, 50);
            }, 250);
        }
        this.touchEndOnUp = () => {
            clearTimeout(this.delayTimerOnUp);
            clearInterval(this.holdTimerOnUp);
        }


        this.holdTimerOnDown;
        this.delayTimerOnDown;
        this.touchStartOnDown = () => {
            this.delayTimerOnDown = setTimeout(() => {
                this.holdTimerOnDown = setInterval(() => {
                    this.onDown();
                }, 50);
            }, 250);
        }
        this.touchEndOnDown = () => {
            clearTimeout(this.delayTimerOnDown);
            clearInterval(this.holdTimerOnDown);
        }


        this.holdTimerOnRight;
        this.delayTimerOnRight;
        this.touchStartOnRight = () => {
            this.delayTimerOnRight = setTimeout(() => {
                this.holdTimerOnRight = setInterval(() => {
                    this.onRight();
                }, 50);
            }, 250);
        }
        this.touchEndOnRight = () => {
            clearTimeout(this.delayTimerOnRight);
            clearInterval(this.holdTimerOnRight);
        }


        this.holdTimerOnLeft;
        this.delayTimerOnLeft;
        this.touchStartOnLeft = () => {
            this.delayTimerOnLeft = setTimeout(() => {
                this.holdTimerOnLeft = setInterval(() => {
                    this.onLeft();
                }, 50);
            }, 250);
        }
        this.touchEndOnLeft = () => {
            clearTimeout(this.delayTimerOnLeft);
            clearInterval(this.holdTimerOnLeft);
        }

        this.holdTimerOnAction;
        this.delayTimerOnAction;
        this.touchStartOnAction = () => {
            this.delayTimerOnAction = setTimeout(() => {
                this.holdTimerOnAction = setInterval(() => {
                    this.onAction();
                }, 50);
            }, 250);
        }
        this.touchEndOnAction = () => {
            clearTimeout(this.delayTimerOnAction);
            clearInterval(this.holdTimerOnAction);
        }

        const upBtn = document.querySelector("#up-Btn");
        const downBtn = document.querySelector("#down-Btn");
        const rightBtn = document.querySelector("#right-Btn");
        const leftBtn = document.querySelector("#left-Btn");

        const actionBtn = document.querySelector("#action-btn");

        const onOffBtn = document.querySelector("#on-off-btn");
        const startPauseBtn = document.querySelector("#start-pause-btn");
        const soundBtn = document.querySelector("#sound-btn");
        const resetBtn = document.querySelector("#reset-btn");


        upBtn.addEventListener("click", this.onUp);
        downBtn.addEventListener("click", this.onDown);
        rightBtn.addEventListener("click", this.onRight);
        leftBtn.addEventListener("click", this.onLeft);

        actionBtn.addEventListener("click", this.onAction);

        onOffBtn.addEventListener("click", this.onOnOff);
        startPauseBtn.addEventListener("click", this.onStart);
        soundBtn.addEventListener("click", this.onSound);
        resetBtn.addEventListener("click", this.onReset);

        upBtn.addEventListener("touchstart", this.touchStartOnUp);
        upBtn.addEventListener("touchend", this.touchEndOnUp);

        downBtn.addEventListener("touchstart", this.touchStartOnDown);
        downBtn.addEventListener("touchend", this.touchEndOnDown);

        rightBtn.addEventListener("touchstart", this.touchStartOnRight);
        rightBtn.addEventListener("touchend", this.touchEndOnRight);

        leftBtn.addEventListener("touchstart", this.touchStartOnLeft);
        leftBtn.addEventListener("touchend", this.touchEndOnLeft);

        actionBtn.addEventListener("touchstart", this.touchStartOnAction);
        actionBtn.addEventListener("touchend", this.touchEndOnAction);

    }

    unbound() {

        const upBtn = document.querySelector("#up-Btn");
        const downBtn = document.querySelector("#down-Btn");
        const rightBtn = document.querySelector("#right-Btn");
        const leftBtn = document.querySelector("#left-Btn");

        const actionBtn = document.querySelector("#action-btn");

        const onOffBtn = document.querySelector("#on-off-btn");
        const startPauseBtn = document.querySelector("#start-pause-btn");
        const soundBtn = document.querySelector("#sound-btn");
        const resetBtn = document.querySelector("#reset-btn");


        upBtn.removeEventListener("click", this.onUp);
        downBtn.removeEventListener("click", this.onDown);
        rightBtn.removeEventListener("click", this.onRight);
        leftBtn.removeEventListener("click", this.onLeft);

        actionBtn.removeEventListener("click", this.onAction);

        onOffBtn.removeEventListener("click", this.onOnOff);
        startPauseBtn.removeEventListener("click", this.onStart);
        soundBtn.removeEventListener("click", this.onSound);
        resetBtn.removeEventListener("click", this.onReset);

        upBtn.removeEventListener("touchstart", this.touchStartOnUp);
        upBtn.removeEventListener("touchend", this.touchEndOnUp);

        downBtn.removeEventListener("touchstart", this.touchStartOnDown);
        downBtn.removeEventListener("touchend", this.touchEndOnDown);

        rightBtn.removeEventListener("touchstart", this.touchStartOnRight);
        rightBtn.removeEventListener("touchend", this.touchEndOnRight);

        leftBtn.removeEventListener("touchstart", this.touchStartOnLeft);
        leftBtn.removeEventListener("touchend", this.touchEndOnLeft);

        actionBtn.removeEventListener("touchstart", this.touchStartOnAction);
        actionBtn.removeEventListener("touchend", this.touchEndOnAction);

    }

}