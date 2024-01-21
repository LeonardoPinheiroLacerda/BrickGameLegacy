class Tetris extends Game {

    constructor({ width, maxHeight, selector }, shouldResize = true, isOn = false) {

        super(
            { width, maxHeight, selector },
            "tetrisHiScore",
            shouldResize,
            isOn
        );

        this.events = {
            onOnOff: () => {
                if (this.isOn) {
                    this.turnOff();
                    this.leave();
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
            onSound: () => {
                if (!this.isOn) return;
                this.sound();
            },
            onAction: () => {
                if (!this.isStart) return;
                this.pressAction();
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

        //Pieces
        this.actualPieceId = 1;
        this.nextPiece = this.getNextPiece();
        this.actualPiece;

        this.lines = 0;
        this.linesToLevelUp = 3;

        this.isPressingDown = false;

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
            this.playSound('./assets/sounds/spawn.wav');
            this.actualPiece.parts.forEach(({ x, y }) => this.grid[y][x] = this.actualPieceId);
        } else {
            this.gameOver();
        }

    }

    getNextPiece() {
        let actualId = this.actualPiece?.id;
        let nextId = null;

        let piece;
        do {

            const randomNumber = getRandomInt(1, 9);

            switch (randomNumber) {
                case 1:
                    piece = new Piece1(this.gridX);
                    break;
                case 2:
                    piece = new Piece2(this.gridX);
                    break;
                case 3:
                    piece = new Piece3(this.gridX);
                    break;
                case 4:
                    piece = new Piece4(this.gridX);
                    break;
                case 5:
                    piece = new Piece5(this.gridX);
                    break;
                case 6:
                    piece = new Piece6(this.gridX);
                    break;
                case 7:
                    piece = new Piece7(this.gridX);
                    break;
            }
            nextId = piece?.id;

        } while (actualId === nextId || nextId == undefined);

        return piece;
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
            this.playSound('./assets/sounds/score.wav');

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

    drawData() {

        super.drawData();

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
        super.drawGameOver();
    }

    drawHowToPlay() {

        this.context.font = this.width * 0.06 + "px retro-gaming";
        this.context.fillText("How to play?", this.width * 0.1, this.height * 0.62)

        this.context.font = this.width * 0.05 + "px retro-gaming";
        this.context.fillText("W/Action: rotate", this.width * 0.09, this.height * 0.7);
        this.context.fillText("A: move left", this.width * 0.09, this.height * 0.76);
        this.context.fillText("S: move down faster", this.width * 0.09, this.height * 0.82);
        this.context.fillText("D: move right", this.width * 0.09, this.height * 0.88);

    }


    //States
    gameOver() {
        this.lines = 0;
        this.nextPiece = null;

        super.gameOver();
    }

    //Actions
    turnOn() {
        this.lines = 0;

        super.turnOn();
    }

    turnOff() {
        this.actualPieceId = 1;
        this.nextPiece = this.getNextPiece();
        this.actualPiece = null;

        this.lines = 0;

        super.turnOff();
    }

    reset() {
        this.actualPieceId = 1;
        this.nextPiece = this.getNextPiece();
        this.actualPiece = null;

        this.lines = 0;

        super.reset();
    }

    start() {
        this.playSound('./assets/sounds/start.wav');

        this.nextPiece = this.getNextPiece();

        super.start(

            //Next
            () => {
                if (this.actualPiece == null || !this.actualPiece?.move(0, 1, this.grid, this.actualPieceId)) {
                    this.checkScore();
                    this.spawn();
                }
            },

            //BeforeNext
            () => {
                if (this.isPressingDown) {

                    if (this.frameCount % 2 === 0)
                        this.playSound('./assets/sounds/move.wav');

                    this.frameActionInterval = 1;
                    this.isPressingDown = false;
                } else {
                    this.frameActionInterval = this.initialFrameActionInterval - this.level;
                }
            }
        );
    }

    pause() {
        if (this.isGameOver) {
            this.start();
        } else {
            super.pause();
        }
    }

    sound() {
        super.sound();
    }

    pressUp() {
        this.playSound('./assets/sounds/turn.wav');
        this.actualPiece?.rotate(this.grid, this.actualPieceId);
    }

    pressDown() {
        this.isPressingDown = true
    }

    pressLeft() {
        this.playSound('./assets/sounds/move.wav');
        this.actualPiece?.move(-1, 0, this.grid, this.actualPieceId);
    }

    pressRight() {
        this.playSound('./assets/sounds/move.wav');
        this.actualPiece?.move(1, 0, this.grid, this.actualPieceId);
    }

    pressAction() {
        this.playSound('./assets/sounds/turn.wav')
            ;
        this.actualPiece?.rotate(this.grid, this.actualPieceId);
    }

    //Keys
    mapKeys() {
        document.body.addEventListener('keyup', this.keysUp = ({ key }) => {

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
                case 'j':
                case 'J':
                    this.pressAction();
                    break;
            }
        })

        document.body.addEventListener("keydown", this.keysDown = ({ key }) => {
            switch (key) {
                case 's':
                case 'S':
                    this.pressDown();
                    break;
            }
        })
    }

    unbound() {
        super.unbound();
        document.body.removeEventListener("keyup", this.keysUp);
        document.body.removeEventListener("keydown", this.keysDown);
        // this.drawFrame();
    }

}