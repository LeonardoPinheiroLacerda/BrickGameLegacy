class BrickGameBody {

    constructor(tetris) {
        /**@type{Tetris} */
        this.tetris = tetris;
    }

    setVariables(width, height) {
        const root = document.querySelector(":root");

        root.style.setProperty("--color", "rgb(0, 68, 187)");
        root.style.setProperty("--color-shadow", "rgb(1, 28, 74)")

        root.style.setProperty("--button-color", 'rgb(247, 222, 57)');
        root.style.setProperty("--button-color-reflexion", "rgb(250, 241, 185)")

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
        controlContainer.append(upButton);

        const downButton = document.createElement("button");
        downButton.classList.add("btn");
        downButton.classList.add("direction-btn");
        downButton.classList.add("down-btn");
        controlContainer.append(downButton);

        const rightButton = document.createElement("button");
        rightButton.classList.add("btn");
        rightButton.classList.add("direction-btn");
        rightButton.classList.add("right-btn");
        controlContainer.append(rightButton);

        const LeftButton = document.createElement("button");
        LeftButton.classList.add("btn");
        LeftButton.classList.add("direction-btn");
        LeftButton.classList.add("left-btn");
        controlContainer.append(LeftButton);

        const confirmButton = document.createElement("button");
        confirmButton.classList.add("lg-btn");
        controlContainer.append(confirmButton);

        const onOffButton = document.createElement("button");
        onOffButton.classList.add("sm-btn");
        onOffButton.classList.add("on-off-btn");
        controlContainer.append(onOffButton);

        const startButton = document.createElement("button");
        startButton.classList.add("sm-btn");
        startButton.classList.add("start-btn");
        controlContainer.append(startButton);

        const soundButton = document.createElement("button");
        soundButton.classList.add("sm-btn");
        soundButton.classList.add("sound-btn");
        controlContainer.append(soundButton);

        const resetButton = document.createElement("button");
        resetButton.classList.add("sm-btn");
        resetButton.classList.add("reset-btn");
        controlContainer.append(resetButton);

    }
}