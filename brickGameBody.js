class BrickGameBody {

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

    create() {

        this.setVariables();

        //Append css link
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'brickGameBody.css';
        document.head.append(link);

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

        //Buttons
        const upButton = document.createElement("button");
        upButton.classList.add("btn");
        upButton.classList.add("direction-btn");
        upButton.classList.add("up-btn");
        upButton.addEventListener("click", this.onUp);
        controlContainer.append(upButton);

        const downButton = document.createElement("button");
        downButton.classList.add("btn");
        downButton.classList.add("direction-btn");
        downButton.classList.add("down-btn");
        downButton.addEventListener("click", this.onDown);
        controlContainer.append(downButton);

        const rightButton = document.createElement("button");
        rightButton.classList.add("btn");
        rightButton.classList.add("direction-btn");
        rightButton.classList.add("left-btn");
        rightButton.addEventListener("click", this.onRight);
        controlContainer.append(rightButton);

        const LeftButton = document.createElement("button");
        LeftButton.classList.add("btn");
        LeftButton.classList.add("direction-btn");
        LeftButton.classList.add("right-btn");
        LeftButton.addEventListener("click", this.onLeft);
        controlContainer.append(LeftButton);

        const actionButton = document.createElement("button");
        actionButton.classList.add("lg-btn");
        actionButton.addEventListener("click", this.onAction);
        controlContainer.append(actionButton);

        const onOffButton = document.createElement("button");
        onOffButton.classList.add("sm-btn");
        onOffButton.classList.add("on-off-btn");
        onOffButton.addEventListener("click", this.onOnOff);
        controlContainer.append(onOffButton);

        const startButton = document.createElement("button");
        startButton.classList.add("sm-btn");
        startButton.classList.add("start-btn");
        startButton.addEventListener("click", this.onStart);
        controlContainer.append(startButton);

        const soundButton = document.createElement("button");
        soundButton.classList.add("sm-btn");
        soundButton.classList.add("sound-btn");
        soundButton.addEventListener("click", this.onSound);
        controlContainer.append(soundButton);

        const resetButton = document.createElement("button");
        resetButton.classList.add("sm-btn");
        resetButton.classList.add("reset-btn");
        resetButton.addEventListener("click", this.onReset);
        controlContainer.append(resetButton);

    }
}