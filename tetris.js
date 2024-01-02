class Tetris {

    constructor(width = 480, containerSelector = '#brick-game') {

        //Grid
        this.gridX = 11;
        this.gridY = 18;
        this.grid = [];

        //Dimensions
        this.width = width;

        this.hudWidth = this.width * 0.4;

        this.gameDisplayWidth = this.width - this.hudWidth;
        this.gameDisplayMargin = this.width * 0.04;

        this.cellMargin = this.width * 0.005;
        this.cellSize = this.gameDisplayWidth / this.gridX - this.cellMargin - (this.cellMargin / this.gridX);

        this.height = this.cellSize * this.gridY + (this.cellMargin * (this.gridY + 1)) + (this.gameDisplayMargin * 2);

        //Pieces
        this.actualPieceId = 1;

        this.nextPiece = this.getNextPiece();

        this.actualPiece;

        //Speed
        this.maxMoveInterval = 20;

        this.moveInterval = this.maxMoveInterval;
        this.frameCount = this.maxMoveInterval;


        //Score and level
        this.score = 0;

        this.level = 1;
        this.maxLevel = 10;

        this.lines = 0;
        this.linesToLevelUp = 3;


        //Canvas
        this.canvas = document.createElement("canvas");
        this.body = document.querySelector(containerSelector);

        this.body.append(this.canvas);

        /** @type{CanvasRenderingContext2D} */
        this.context = this.canvas.getContext('2d');

        //Correção de escala para telas com dpi maior
        this.canvas.style.width = `${this.width}px`
        this.canvas.style.height = `${this.height}px`

        this.scale = Math.ceil(window.devicePixelRatio);

        this.canvas.width = Math.floor(this.width * this.scale);
        this.canvas.height = Math.floor(this.height * this.scale);


        //Carregando recursos e inicializando tela desligada
        this.inactiveCell = new Image();
        this.inactiveCell.src = "./assets/images/inactiveCell.svg";

        this.activeCell = new Image();
        this.activeCell.src = "./assets/images/activeCell.svg";

        this.inactiveCell.onload = () => {

            this.turnOff();
            this.mapKeys();

            const font = new FontFace(
                "retro-gaming",
                "url(./assets/fonts/digital-7.monoitalic.ttf)"
            );
            font.load().then(() => {
                document.fonts.add(font);
            });

        }

        //States
        this.isOn = false;
        this.isStart = false;
        this.isGameOver = false;

        //Corpo do console e configurando botoes
        const body = new BrickGameBody(
            this,
            {
                onOnOff: () => {
                    if (this.isOn) {
                        this.turnOff();
                    } else {
                        this.turnOn();
                    }
                },
                onStart: () => {
                    if (!this.isOn) return;
                    if (this.isStart) {
                        this.pause();
                    } else {
                        this.start();
                    }
                },
                onReset: () => {
                    if (!this.isOn) return;
                    this.reset();
                },
                onAction: () => {
                    if (!this.isStart) return;
                    this.pressSpace();
                },
                onUp: () => {
                    if (!this.isStart) return;
                    this.pressUp();
                },
                onDown: () => {
                    if (!this.isStart) return;
                    this.pressDown();
                },
                onRight: () => {
                    if (!this.isStart) return;
                    this.pressRight();
                },
                onLeft: () => {
                    if (!this.isStart) return;
                    this.pressLeft();
                },
            }

        );
        body.create();

    }

    spawn() {
        this.actualPieceId += 1;
        this.actualPiece = this.nextPiece;

        this.nextPiece = this.getNextPiece();

        if (!this.actualPiece) return;

        this.isGameOver = this.actualPiece.parts
            .map(xy => this.grid[xy.y][xy.x])
            .some(cell => cell !== 0);

        if (!this.isGameOver) {
            new Audio('./assets/sounds/spawn.wav')
                .play();
            this.actualPiece.parts.forEach(({ x, y }) => this.grid[y][x] = this.actualPieceId);
        } else {
            new Audio('./assets/sounds/gameover.wav')
                .play();

            this.gameOver();
        }

    }

    getNextPiece() {
        let actualId = this.actualPiece?.id;
        let nextId = null;

        do {
            switch (getRandomInt(1, 10)) {
                case 1:
                    return new Piece1(this.gridX);
                case 2:
                    return new Piece2(this.gridX);
                case 3:
                    return new Piece3(this.gridX);
                case 4:
                    return new Piece4(this.gridX);
                case 5:
                    return new Piece5(this.gridX);
                case 6:
                    return new Piece6(this.gridX);
                case 7:
                    return new Piece7(this.gridX);
            }
            nextId = this.piece?.id;


        } while (actualId === nextId && nextId !== null);
    }

    checkScore() {
        const linesCompleted = [];

        for (let y = this.grid.length - 1; y >= 0; y--) {
            const row = this.grid[y];

            if (row.every(cell => cell !== 0)) {
                linesCompleted.push(y);
            }
        }

        if (linesCompleted.length > 0) {
            new Audio('./assets/sounds/score.wav')
                .play()

            this.lines += linesCompleted.length;

            if (linesCompleted.length === 1) {
                this.score += 10 * this.level;
            } else if (linesCompleted.length === 2) {
                this.score += 25 * this.level;
            } else if (linesCompleted.length === 3) {
                this.score += 40 * this.level;
            } else if (linesCompleted.length === 4) {
                this.score += 60 * this.level;
            }

            //Remove linhas completas
            linesCompleted.forEach(y => {
                this.grid.splice(y, 1);
            })

            //Repõe com linhas vazias
            while (this.grid.length < this.gridY) {
                const newRow = [];
                for (let i = 0; i < this.gridX; i++) {
                    newRow.push(0);
                }

                this.grid = [newRow, ...this.grid];
            }

            if (this.level < this.maxLevel) {
                this.level = Math.trunc(this.lines / this.linesToLevelUp) + 1;

                if (this.level > this.maxLevel) {
                    this.level = this.maxLevel;
                }
            }
        }
    }

    //Canvas drawing
    scaleCanvas() {
        this.context.reset();
        this.context.scale(this.scale, this.scale);
    }

    drawData() {
        this.context.font = this.width * 0.06 + "px retro-gaming"
        this.context.fillStyle = "rgb(19, 26, 18)";

        this.context.fillText("Score", this.width * 0.7, this.height * 0.1);
        this.context.fillText(this.score, this.width * 0.7, this.height * 0.15);

        const hiScore = !localStorage.getItem("hiscore")
            ? 0
            : parseInt(localStorage.getItem("hiscore"));

        this.context.fillText("Hi-Score", this.width * 0.7, this.height * 0.23);
        this.context.fillText(hiScore, this.width * 0.7, this.height * 0.28);

        if (this.nextPiece) {
            const preview = this.nextPiece.getPreviewParts();

            for (let y = 0; y < preview.length; y++) {
                for (let x = 0; x < preview.length; x++) {

                    const isActive = preview[y][x] !== 0;

                    const posX = this.width * 0.7 + (x * this.cellSize) + (x * this.cellMargin)
                    const posY = (this.height * 0.5 - ((2 * this.cellSize) + (2 * this.cellMargin))) + (y * this.cellSize) + (y * this.cellMargin)

                    this.drawCell(isActive, posX, posY);
                }
            }
        }

        this.context.fillText("Level", this.width * 0.7, this.height * 0.88);
        this.context.fillText(`${this.level} - ${this.maxLevel}`, this.width * 0.7, this.height * 0.93);
    }

    drawFrame() {
        this.context.rect(0, 0, this.width, this.height);
        this.context.fillStyle = '#adbeac';
        this.context.fill();

        this.context.lineWidth = this.width * 0.02;
        this.context.strokeStyle = "rgb(19, 26, 18)";
        this.context.stroke();

        this.context.lineWidth = this.width * 0.005;
        this.context.rect(this.gameDisplayMargin, this.gameDisplayMargin, this.gameDisplayWidth, this.height - this.gameDisplayMargin * 2);
        this.context.stroke();


        for (let y = 0; y < this.gridY; y++) {
            for (let x = 0; x < this.gridX; x++) {

                const isActive = this.grid[y][x] !== 0;

                const posX = this.gameDisplayMargin + this.cellMargin + (x * this.cellSize) + (x * this.cellMargin);
                const posY = this.gameDisplayMargin + this.cellMargin + (y * this.cellSize) + (y * this.cellMargin);

                this.drawCell(isActive, posX, posY);
            }
        }
    }

    drawCell(isActive, posX, posY) {
        const cell = isActive
            ? this.activeCell
            : this.inactiveCell

        this.context.drawImage(cell, posX, posY, this.cellSize, this.cellSize);
    }

    drawWelcome() {

        this.context.fillStyle = "rgb(19, 26, 18)";
        this.context.font = this.width * 0.13 + "px retro-gaming";
        this.context.fillText("Tetris", this.width * 0.15, this.height * 0.2);

        this.context.font = this.width * 0.06 + "px retro-gaming";
        this.context.fillText("Press start.", this.width * 0.18, this.height * 0.4)

        this.drawHowToPlay();

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

        this.context.font = this.width * 0.06 + "px retro-gaming";
        this.context.fillText("How to play?", this.width * 0.1, this.height * 0.62)

        this.context.font = this.width * 0.05 + "px retro-gaming";
        this.context.fillText("W/Space: rotate", this.width * 0.09, this.height * 0.7);
        this.context.fillText("A: move left", this.width * 0.09, this.height * 0.76);
        this.context.fillText("S: move down faster", this.width * 0.09, this.height * 0.82);
        this.context.fillText("D: move right", this.width * 0.09, this.height * 0.88);

    }


    //States
    resetGrid() {
        this.grid = (() => {
            const grid = [];
            for (let y = 0; y < this.gridY; y++) {
                grid.push([]);
                for (let x = 0; x < this.gridX; x++) {
                    grid[y][x] = 0;
                }
            }
            return grid;
        })()
    }

    gameOver() {

        clearInterval(this.interval);

        this.nextPiece = null;

        this.scaleCanvas();
        this.resetGrid();
        this.drawFrame();
        this.drawData();

        const actualHighScore = parseInt(localStorage.getItem("hiscore"));

        if (actualHighScore < this.score) {
            localStorage.setItem("hiscore", this.score);
        }

        this.lines = 0;
        this.score = 0;
        this.level = 1;

        this.drawGameOver();
    }

    //Actions
    turnOn() {
        this.isOn = true;

        this.scaleCanvas();

        this.resetGrid();
        this.score = 0;
        this.lines = 0;
        this.level = 1;

        this.drawFrame();
        this.drawWelcome();
    }

    turnOff() {
        this.isOn = false;
        this.pause();

        this.scaleCanvas();

        this.resetGrid();
        this.score = 0;
        this.lines = 0;
        this.level = 1;

        this.drawFrame();
    }

    reset() {
        this.lines = 0;
        this.score = 0;
        this.level = 1;

        this.resetGrid();

        this.start();
    }

    start() {
        this.isStart = true;

        new Audio('./assets/sounds/start.wav')
            .play();

        clearInterval(this.interval);
        this.interval = setInterval(() => {

            this.scaleCanvas();

            this.drawFrame();
            this.drawData();

            if (this.moveInterval === 1 && this.frameCount % 2 === 0) {
                new Audio('./assets/sounds/move.wav')
                    .play();
            } else {
                this.moveInterval = this.maxMoveInterval - this.level;
            }

            this.frameCount += 1;
            if (this.frameCount % this.moveInterval === 0) {

                if (this.actualPiece == null || !this.actualPiece.move(0, 1, this.grid, this.actualPieceId)) {
                    this.checkScore();
                    this.spawn();
                }

            }

        }, 1000 / 30);
    }

    pause() {
        this.isStart = false;

        clearInterval(this.interval);
    }

    sound() {

    }

    pressUp() {
        this.actualPiece.rotate(this.grid, this.actualPieceId);
    }

    pressDown() {
        this.moveInterval = 1;
    }

    pressLeft() {
        this.actualPiece.move(-1, 0, this.grid, this.actualPieceId);
    }

    pressRight() {
        this.actualPiece.move(1, 0, this.grid, this.actualPieceId);
    }

    pressSpace() {
        this.actualPiece.rotate(this.grid, this.actualPieceId);
    }

    //Keys
    mapKeys() {
        document.body.addEventListener('keyup', ({ key }) => {
            switch (key) {
                case 'd':
                case 'D':
                    this.pressRight();
                    break;
                case 'a':
                case 'A':
                    this.pressLeft();
                    break;
                case 'w':
                case 'W':
                    this.pressUp();
                    break;
                case ' ':
                    this.pressSpace();
                    break;
            }
        })

        document.body.addEventListener("keydown", ({ key }) => {
            switch (key) {
                case 's':
                case 'S':
                    this.pressDown();
                    break;
            }
        })
    }


}