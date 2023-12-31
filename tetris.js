class Tetris {

    constructor(width = 480, containerSelector = '#brick-game', createConsoleBody = false) {

        this.width = width;

        this.hudWidth = this.width * 0.4;

        this.gameDisplayWidth = this.width - this.hudWidth;
        this.gameDisplayMargin = this.width * 0.04;

        this.gridX = 11;
        this.gridY = 18;
        this.grid = [];

        this.cellMargin = this.width * 0.005;
        this.cellSize = this.gameDisplayWidth / this.gridX - this.cellMargin - (this.cellMargin / this.gridX);

        this.height = this.cellSize * this.gridY + (this.cellMargin * (this.gridY + 1)) + (this.gameDisplayMargin * 2);

        this.actualPieceId = 1;

        this.nextPiece = null;
        this.actualPiece;

        this.maxMoveInterval = 20;

        this.moveInterval = this.maxMoveInterval;
        this.frameCount = this.maxMoveInterval;

        this.score = 0;

        this.level = 1;
        this.maxLevel = 10;

        this.lines = 0;
        this.linesToLevelUp = 3;

        this.canvas = document.createElement('canvas');
        this.body = document.querySelector(containerSelector);

        this.body.append(this.canvas);

        /** @type{CanvasRenderingContext2D} */
        this.context = this.canvas.getContext('2d');

        if (createConsoleBody) {
            new BrickGameBody(this)
                .create();
        }



    }


    move(mx, my) {

        const parts = [];

        for (let y = this.gridY - 1; y >= 0; y--) {
            for (let x = 0; x < this.gridX; x++) {
                if (this.grid[y][x] == this.actualPieceId) {
                    parts.push({ y, x });
                }
            }
        }

        let canMove = false;

        for (let i = 0; i < parts.length; i++) {
            const { x, y } = parts[i];

            if (this.grid[y + my]) {
                canMove = this.grid[y + my][x + mx] === this.actualPieceId || this.grid[y + my][x + mx] === 0;
            } else {
                canMove = false;
            }

            if (!canMove) break;
        }


        if (canMove) {
            parts.forEach(({ x, y }) => {
                this.grid[y][x] = 0;
            })

            parts.forEach(({ x, y }) => {
                this.grid[y + my][x + mx] = this.actualPieceId;
            });

            if (mx !== 0) {
                new Audio('./assets/sounds/move.wav')
                    .play();
            }
        }

        return canMove;
    }


    spawnPiece() {

        this.actualPieceId += 1;

        this.actualPiece = this.nextPiece;

        this.getNextPiece();

        if (!this.actualPiece) return;

        const parts = this.actualPiece.parts

        const isGameOver = parts
            .map(xy => this.grid[xy.y][xy.x])
            .some(cell => cell !== 0);

        if (!isGameOver) {
            new Audio('./assets/sounds/spawn.wav')
                .play();
            parts.forEach(({ x, y }) => this.grid[y][x] = this.actualPieceId);
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
                    this.nextPiece = new Piece1(this.gridX);
                    break;
                case 2:
                    this.nextPiece = new Piece2(this.gridX);
                    break;
                case 3:
                    this.nextPiece = new Piece3(this.gridX);
                    break;
                case 4:
                    this.nextPiece = new Piece4(this.gridX);
                    break;
                case 5:
                    this.nextPiece = new Piece5(this.gridX);
                    break;
                case 6:
                    this.nextPiece = new Piece6(this.gridX);
                    break;
                case 7:
                    this.nextPiece = new Piece7(this.gridX);
                    break;
            }

            nextId = this.nextPiece?.id;

        } while (actualId === nextId && nextId !== null);
    }

    turn() {
        if (this.actualPiece.rotate(this.grid, this.actualPieceId)) {

            for (let y = 0; y < this.grid.length; y++) {
                for (let x = 0; x < this.grid[y].length; x++) {
                    if (this.grid[y][x] === this.actualPieceId) {
                        this.grid[y][x] = 0;
                    }
                }
            }

            try {
                const parts = this.actualPiece.parts;
                parts.forEach(({ x, y }) => this.grid[y][x] = this.actualPieceId);

                new Audio('./assets/sounds/turn.wav')
                    .play();
            } catch { }
        }

    }

    mapKeys() {
        document.body.addEventListener('keyup', ({ key }) => {
            switch (key) {
                case 'a':
                case 'A':
                    this.move(-1, 0);
                    break;
                case 'd':
                case 'D':
                    this.move(1, 0);
                    break;
                case 'w':
                case 'W':
                    this.turn();
                    break;
            }
        })

        document.body.addEventListener("keydown", ({ key }) => {
            switch (key) {
                case 's':
                case 'S':
                    this.moveInterval = 1;
                    break;
            }
        })
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
                this.grid = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ...this.grid];
            }

            if (this.level < this.maxLevel) {
                this.level = Math.trunc(this.lines / this.linesToLevelUp) + 1;

                if (this.level > this.maxLevel) {
                    this.level = this.maxLevel;
                }
            }

        }

    }

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
        this.context.reset();

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

    drawClickAnywhere() {
        this.context.fillStyle = "rgb(19, 26, 18)";
        this.context.font = this.width * 0.06 + "px retro-gaming";
        this.context.fillText("Click anywhere to", this.width * 0.1, this.height * 0.275);
        this.context.fillText("start or restart.", this.width * 0.112, this.height * 0.35)
    }

    drawWelcome() {

        this.context.fillStyle = "rgb(19, 26, 18)";
        this.context.font = this.width * 0.13 + "px retro-gaming";
        this.context.fillText("Tetris", this.width * 0.15, this.height * 0.2);

        this.drawClickAnywhere();

        this.drawHowToPlay();

    }

    gameOver() {
        this.stop();

        this.nextPiece = null;

        this.resetGrid();
        this.drawFrame();
        this.drawData();

        localStorage.setItem("hiscore", this.score);

        this.drawGameOver();
    }

    drawGameOver() {
        this.context.fillStyle = "rgb(19, 26, 18)";
        this.context.font = this.width * 0.11 + "px retro-gaming";
        this.context.fillText("Game Over!", this.width * 0.085, this.height * 0.2);

        this.drawClickAnywhere()

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

    init() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.mapKeys();

        this.resetGrid();
        this.score = 0;
        this.lines = 0;
        this.level = 1;

        this.inactiveCell = new Image();
        this.inactiveCell.src = "./assets/images/inactiveCell.svg";

        this.activeCell = new Image();
        this.activeCell.src = "./assets/images/activeCell.svg";

        this.inactiveCell.onload = () => {
            this.drawFrame();

            const font = new FontFace(
                "retro-gaming",
                "url(./assets/fonts/digital-7.monoitalic.ttf)"
            );
            font.load().then(() => {
                document.fonts.add(font);

                this.drawWelcome();

                this.canvas.addEventListener('click', () => this.run());

            });

        }

    }

    run() {
        this.stop();

        this.lines = 0;
        this.score = 0;
        this.level = 1;

        this.resetGrid();

        new Audio('./assets/sounds/start.wav')
            .play();

        this.interval = setInterval(() => {

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

                if (!this.move(0, 1)) {
                    this.checkScore();
                    this.spawnPiece();
                }

            }

        }, 1000 / 30);

    }

    stop() {
        clearInterval(this.interval);
    }

}