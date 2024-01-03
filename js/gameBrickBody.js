class gameBrickBody {

    constructor(tetris, {
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
        /**@type{Tetris} */
        this.tetris = tetris;

        this.onUp = onUp;
        this.onDown = onDown;
        this.onLeft = onLeft;
        this.onRight = onRight;
        this.onAction = onAction;
        this.onOnOff = onOnOff;
        this.onStart = onStart;
        this.onSound = onSound;
        this.onReset = onReset;
    }

    setVariables(width, height) {
        const root = document.querySelector(":root");

        root.style.setProperty("--color", "rgb(0, 68, 187)");
        root.style.setProperty("--color-shadow", "rgb(1, 28, 74)");
        root.style.setProperty("--color-shadow-reflexion", "rgb(3, 94, 255)");

        root.style.setProperty("--button-color", 'rgb(247, 222, 57)');
        root.style.setProperty("--button-color-reflexion", "rgb(250, 241, 185)");

        root.style.setProperty("--dispersion", '3px')

        root.style.setProperty("--width", parseInt(this.tetris.width) + "px");
        root.style.setProperty("--height", parseInt(this.tetris.height) + "px");
    }

    //Buttons
    buttonContainer(controlContainer, containerClass, labelText, btnClass, onClick) {
        const container = document.createElement("div");
        container.classList.add(containerClass);
        controlContainer.append(container);

        const label = document.createElement("label");
        label.innerHTML = labelText;
        container.append(label);

        const button = document.createElement("button");
        button.classList.add(btnClass);

        button.addEventListener("click", () => {
            // navigator.vibrate(200);
            onClick();
        });

        let holdTimer;
        let delayTimer;

        button.addEventListener("touchstart", () => {
            // navigator.vibrate(200);

            delayTimer = setTimeout(() => {
                holdTimer = setInterval(() => {
                    onClick();
                }, 50);
            }, 250);

        }, {
            passive: true
        });

        button.addEventListener("touchend", () => {
            clearTimeout(delayTimer);
            clearInterval(holdTimer);
        });

        container.append(button);
    }

    create() {

        this.setVariables();

        //Append css link
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './css/gameBrickBody.css';

        link.onload = () => {

            //Add class to container
            this.tetris.body.classList.add("brick-game-body");

            //Add frame
            const frame = document.createElement('div');
            frame.classList.add('frame');
            this.tetris.body.append(frame);

            //Add title
            const title = document.createElement('h1');
            title.classList.add("title");
            this.tetris.body.append(title);
            title.innerText = "Game Brick"


            //Add Controls
            const controlContainer = document.createElement("div");
            controlContainer.classList.add("controls-container");
            this.tetris.body.append(controlContainer);

            this.buttonContainer(controlContainer, "up-btn-container", "W", "btn", this.onUp);
            this.buttonContainer(controlContainer, "down-btn-container", "S", "btn", this.onDown);
            this.buttonContainer(controlContainer, "right-btn-container", "D", "btn", this.onRight);
            this.buttonContainer(controlContainer, "left-btn-container", "A", "btn", this.onLeft);

            this.buttonContainer(controlContainer, 'action-btn-container', 'J', "lg-btn", this.onAction)

            this.buttonContainer(controlContainer, 'on-off-btn-container', "ON OFF", "sm-btn", this.onOnOff);
            this.buttonContainer(controlContainer, 'start-pause-btn-container', "START PAUSE", "sm-btn", this.onStart);
            this.buttonContainer(controlContainer, 'sound-btn-container', "SOUND", "sm-btn", this.onSound);
            this.buttonContainer(controlContainer, 'reset-btn-container', "RESET", "sm-btn", this.onReset);
        }

        document.head.append(link);



    }
}