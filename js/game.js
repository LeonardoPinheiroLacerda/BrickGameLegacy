class Game {

    /**
     * Para implementar um novo game é necessário implementar:
     * - drawWelcome
     * - drawGameOver
     * - drawHowToPlay
     * - pressUp
     * - mapKeys
     * - pressDown
     * - pressLeft
     * - pressRight
     * - pressAction
     */
    constructor({ width, maxHeight, selector }, hiScoreKey, shouldResize = true, isOn = false) {

        this.events;

        this.shouldResize = shouldResize;

        this.initData = { width, maxHeight, selector };

        this.hiScoreKey = hiScoreKey;

        //Grid
        this.gridX = 11;
        this.gridY = 18;
        this.grid = [];

        //Canvas
        if (document.querySelector(selector + " > canvas")) {
            this.canvas = document.querySelector(selector + " > canvas");
        } else {
            this.canvas = document.createElement("canvas");
        }

        /** @type{CanvasRenderingContext2D} */
        this.context = this.canvas.getContext('2d');

        //Dimensions
        this.bodyBuilder = new GameBrickBody(this);

        this.width = width / this.bodyBuilder.WIDTH_MULTIPLIER
        this.maxHeight = maxHeight;

        this.calcDimensions();

        //Speed
        this.initialFrameActionInterval = 20;

        this.frameActionInterval = this.initialFrameActionInterval;
        this.frameCount = 0;

        //Correção de escala para telas com dpi maior
        this.scaleDisplay();

        //States
        this.isOn = isOn;
        this.isStart = false;
        this.isGameOver = false;
        this.isMuted = false;

        //Score and level
        this.score = 0;

        this.level = 1;
        this.maxLevel = 10;

        //Carregando recursos e inicializando tela desligada
        this.body = document.querySelector(selector);

        this.inactiveCell = new Image();
        this.inactiveCell.src = "./assets/images/inactiveCell.svg";

        this.activeCell = new Image();
        this.activeCell.src = "./assets/images/activeCell.svg";

        this.activeCellRed = new Image();
        this.activeCellRed.src = "./assets/images/activeCellRed.svg";

        this.activeCellBlue = new Image();
        this.activeCellBlue.src = "./assets/images/activeCellBlue.svg";

        this.activeCellCyan = new Image();
        this.activeCellCyan.src = "./assets/images/activeCellCyan.svg";

        this.activeCellGreen = new Image();
        this.activeCellGreen.src = "./assets/images/activeCellGreen.svg";

        this.activeCellPink = new Image();
        this.activeCellPink.src = "./assets/images/activeCellPink.svg";

        this.activeCellGray = new Image();
        this.activeCellGray.src = "./assets/images/activeCellGray.svg";

        this.activeCellYellow = new Image();
        this.activeCellYellow.src = "./assets/images/activeCellYellow.svg";

        this.inactiveCell.onload = () => {
            if (this.isOn) this.turnOn();
            else this.turnOff();
        }


    }
    calcDimensions() {
        if (!this.shouldResize) {
            this.width = this.canvas.width;
            this.height = this.canvas.height;
        };

        this.hudWidth = this.width * 0.4;

        this.gameDisplayWidth = this.width - this.hudWidth;
        this.gameDisplayMargin = this.width * 0.04;

        this.cellMargin = this.width * 0.0005;
        this.cellSize = this.gameDisplayWidth / this.gridX - this.cellMargin - (this.cellMargin / this.gridX);

        this.height = this.cellSize * this.gridY + (this.cellMargin * (this.gridY + 1)) + (this.gameDisplayMargin * 2);
    }
    scaleDisplay() {
        if (!this.shouldResize) return;

        this.canvas.style.width = `${this.width}px`
        this.canvas.style.height = `${this.height}px`

        this.scale = Math.ceil(window.devicePixelRatio);

        this.canvas.width = Math.floor(this.width * this.scale);
        this.canvas.height = Math.floor(this.height * this.scale);
    }

    construct(callback) {
        //Corrigindo proporções
        this.bodyBuilder.update(this);

        const font = new FontFace(
            "retro-gaming",
            "url(./assets/fonts/digital-7.monoitalic.ttf)"
        );
        font.load().then(() => {
            document.fonts.add(font);

            const canvasWidth = parseFloat(this.canvas.style.width.replace("px", ""));
            const canvasHeight = parseFloat(this.canvas.style.height.replace("px", ""));

            const bodyWidth = canvasWidth * this.bodyBuilder.WIDTH_MULTIPLIER;
            const bodyHeight = canvasHeight * this.bodyBuilder.HEIGHT_MULTIPLIER;

            const parentNode = this.body.parentNode;

            if (bodyWidth > parentNode.clientWidth) {
                this.width = parentNode.clientWidth * 0.7;
            }

            else if (this.maxHeight < bodyHeight) {
                this.width = ((this.maxHeight * bodyWidth) / bodyHeight) / this.bodyBuilder.WIDTH_MULTIPLIER;
            }

            this.calcDimensions();
            this.scaleDisplay();

            this.bodyBuilder.create(() => this.bound());
            this.body.append(this.canvas);
            this.drawFrame();

            callback(this);
        });
    }

    unbound() {
        this.bodyBuilder.unbound();
        this.turnOff();
    }

    bound() {
        this.bodyBuilder.bound(this.events);
        this.mapKeys();
    }

    gameOver() {
        clearInterval(this.interval);

        this.resetGrid();
        this.drawFrame();
        this.drawData();

        const actualHighScore = parseInt(localStorage.getItem(this.hiScoreKey));

        if (actualHighScore < this.score || !actualHighScore) {
            localStorage.setItem(this.hiScoreKey, this.score);
        }

        this.score = 0;
        this.level = 1;

        this.drawGameOver();
        navigator.vibrate(1500);
        this.playSound('./assets/sounds/gameover.wav');
    }

    //Canvas drawing
    scaleCanvas() {
        this.context.reset();
        this.context.scale(this.scale, this.scale);
    }

    drawCell(isActive, posX, posY, color) {

        let activeCell;

        switch (color) {
            case 'blue':
                activeCell = this.activeCellBlue;
                break;
            case 'cyan':
                activeCell = this.activeCellCyan;
                break;
            case 'green':
                activeCell = this.activeCellGreen;
                break;
            case 'pink':
                activeCell = this.activeCellPink;
                break;
            case 'red':
                activeCell = this.activeCellRed;
                break;
            case 'gray':
                activeCell = this.activeCellGray;
                break;
            case 'yellow':
                activeCell = this.activeCellYellow;
                break;
            default:
                activeCell = this.activeCell;
                break;
        }

        const cell = isActive
            ? activeCell
            : this.inactiveCell

        this.context.drawImage(cell, posX, posY, this.cellSize, this.cellSize);
    }

    drawData() {
        this.context.font = this.width * 0.06 + "px retro-gaming"
        this.context.fillStyle = "rgb(19, 26, 18)";

        this.context.fillText("Score", this.width * 0.7, this.height * 0.1);
        this.context.fillText(this.score, this.width * 0.7, this.height * 0.15);

        const hiScore = !localStorage.getItem(this.hiScoreKey)
            ? 0
            : parseInt(localStorage.getItem(this.hiScoreKey));

        this.context.fillText("Hi-Score", this.width * 0.7, this.height * 0.23);
        this.context.fillText(hiScore, this.width * 0.7, this.height * 0.28);

        this.context.fillText("Level", this.width * 0.7, this.height * 0.74);
        this.context.fillText(`${this.level} - ${this.maxLevel}`, this.width * 0.7, this.height * 0.79);


        if (this.isStart)
            this.context.fillStyle = "rgb(166, 183, 165)";
        this.context.fillText("Paused", this.width * 0.734, this.height * 0.87);


        if (!this.isMuted)
            this.context.fillStyle = "rgb(166, 183, 165)";
        else
            this.context.fillStyle = "rgb(19, 26, 18)";
        this.context.fillText("Muted", this.width * 0.7425, this.height * 0.93);
    }

    drawFrame() {
        this.scaleCanvas();

        this.context.rect(0, 0, this.width, this.height);
        this.context.fillStyle = '#adbeac';
        this.context.fill();

        this.context.lineWidth = this.width * 0.02;
        this.context.strokeStyle = "rgb(19, 26, 18)";
        this.context.stroke();

        this.context.lineWidth = this.width * 0.005;
        this.context.rect(this.gameDisplayMargin, this.gameDisplayMargin, this.gameDisplayWidth, this.height - this.gameDisplayMargin * 2);
        this.context.stroke();

        const rowPromises = [];

        const promise = (y) => {
            return new Promise(
                () => {
                    for (let x = 0; x < this.gridX; x++) {

                        const isActive = this.grid[y][x].value !== 0;
                        const color = this.grid[y][x].color;

                        const posX = this.gameDisplayMargin + this.cellMargin + (x * this.cellSize) + (x * this.cellMargin);
                        const posY = this.gameDisplayMargin + this.cellMargin + (y * this.cellSize) + (y * this.cellMargin);

                        this.drawCell(isActive, posX, posY, color);
                    }
                }
            );
        }

        for (let y = 0; y < this.gridY; y++) {
            rowPromises.push(promise(y));
        }

        Promise.all(rowPromises);
    }

    drawWelcome() {
    }

    drawGameOver() {
        this.context.fillStyle = "rgb(19, 26, 18)";
        this.context.font = this.width * 0.11 + "px retro-gaming";
        this.context.fillText("Game Over!", this.width * 0.085, this.height * 0.2);

        this.context.font = this.width * 0.06 + "px retro-gaming";
        this.context.fillText("Press start", this.width * 0.19, this.height * 0.35)
        this.context.fillText("or restart.", this.width * 0.2, this.height * 0.42)

        this.drawHowToPlay();
    }

    drawHowToPlay() {
    }


    resetGrid() {
        this.grid = (() => {
            const grid = [];
            for (let y = 0; y < this.gridY; y++) {
                grid.push([]);
                for (let x = 0; x < this.gridX; x++) {
                    grid[y][x] = { value: 0 };
                }
            }
            return grid;
        })()
    }

    //Actions
    turnOn() {
        this.isOn = true;

        this.resetGrid();

        this.score = 0;
        this.level = 1;

        this.drawFrame();
        this.drawWelcome();
    }

    turnOff() {
        this.isOn = false;
        this.isStart = false;
        clearInterval(this.interval);

        this.score = 0;
        this.level = 1;

        this.resetGrid();

        this.drawFrame();
    }

    reset() {
        this.score = 0;
        this.level = 1;

        this.isGameOver = false;

        this.resetGrid();

        this.start();
    }

    start(next = () => { console.log('next') }, beforeNext = () => { }) {

        if (this.isGameOver) {
            this.isGameOver = false;
        }

        this.isStart = true;

        clearInterval(this.interval);
        this.interval = setInterval(() => {

            this.drawFrame();
            this.drawData();

            beforeNext();

            this.frameCount += 1;
            if (this.frameCount % this.frameActionInterval === 0) {
                next();
            }

        }, 1000 / 30);
    }

    pause() {
        this.isStart = false;
        clearInterval(this.interval);
        this.drawData();
    }

    sound() {
        this.isMuted = !this.isMuted;
        this.drawData();
    }

    playSound(sound) {
        if (!this.isMuted) {
            const audio = new Audio(sound);
            audio.volume = 0.025;
            audio.play();
        }
    }

    leave() {
        this.unbound();
        const menu = new Menu(this.initData, false, this.isOn);
        menu.bound();
    }

    //Commands
    pressUp() {
    }

    pressDown() {
    }

    pressLeft() {
    }

    pressRight() {
    }

    pressAction() {
    }

    mapKeys() {

    }

}