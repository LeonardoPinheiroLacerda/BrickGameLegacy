class Snake extends Game {
    constructor({ width, maxHeight, selector }, shouldResize = true, isOn = false) {

        super(
            { width, maxHeight, selector },
            "snakeHiScore",
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

        //Speed
        this.initialFrameActionInterval = 5;
        this.frameActionInterval = this.initialFrameActionInterval;


        this.BLANK_CONSTANT = 0;
        this.BODY_CONSTANT = 1;
        this.FOOD_CONSTANT = 2;
        this.WALL_CONSTANT = 3;

        this.direction = {
            x: 1,
            y: 0
        }

        this.head = {
            x: parseInt(this.gridX / 2),
            y: parseInt(this.gridY / 2)
        }

        this.foodAmountPlaced = 1;
        this.actualFoodPlaced = 0;

        this.tailSize = 2;
        this.tail = [];

    }

    drawWelcome() {

        this.context.fillStyle = "rgb(19, 26, 18)";
        this.context.font = this.width * 0.13 + "px retro-gaming";
        this.context.fillText("Snake", this.width * 0.19, this.height * 0.2);

        this.context.font = this.width * 0.06 + "px retro-gaming";
        this.context.fillText("Press start.", this.width * 0.18, this.height * 0.4)

        this.drawHowToPlay();
    }

    drawGameOver() {
        super.drawGameOver();
    }

    resetGrid() {
        super.resetGrid();
    }

    renderLevel() {
        for (let i = 0; i < this.gridX; i++) {
            this.grid[0][i] = 1;
            this.grid[this.gridY - 1][i] = 1;
        }

        for (let i = 0; i < this.gridY; i++) {
            this.grid[i][0] = 1;
            this.grid[i][this.gridX - 1] = 1;
        }
    }

    drawHowToPlay() {

        this.context.font = this.width * 0.05 + "px retro-gaming";
        this.context.fillText("How to play?", this.width * 0.1, this.height * 0.62)

        this.context.font = this.width * 0.05 + "px retro-gaming";
        this.context.fillText("W: move up", this.width * 0.09, this.height * 0.7);
        this.context.fillText("A: move left", this.width * 0.09, this.height * 0.76);
        this.context.fillText("S: move down", this.width * 0.09, this.height * 0.82);
        this.context.fillText("D: move right", this.width * 0.09, this.height * 0.88);

    }

    updateTail() {
        this.tail.forEach(({ x, y }) => this.grid[y][x] = 0);

        this.tail.push({ ...this.head })

        if (this.tail.length > this.tailSize) {
            this.tail.shift()
        }

        this.tail.forEach(({ x, y }) => this.grid[y][x] = this.BODY_CONSTANT);
    }

    move() {

        this.grid[this.head.y][this.head.x] = 0;

        if (
            this.grid[this.head.y + this.direction.y] !== undefined &&
            this.grid[this.head.y + this.direction.y][this.head.x + this.direction.x] === this.BLANK_CONSTANT ||
            this.grid[this.head.y + this.direction.y][this.head.x + this.direction.x] === this.FOOD_CONSTANT
        ) {

            if (this.grid[this.head.y + this.direction.y][this.head.x + this.direction.x] === this.FOOD_CONSTANT) {
                this.tailSize += 1;
                this.score += 10;
                this.actualFoodPlaced -= 1;

                this.level = Math.ceil(this.score / 149);

                if (this.level > this.maxLevel) {
                    this.level = this.maxLevel;
                }
            }

            this.updateTail();

            this.head.x += this.direction.x;
            this.head.y += this.direction.y;

            this.grid[this.head.y][this.head.x] = this.BODY_CONSTANT;
        }

        else {
            this.isGameOver = true;
            this.isStart = false;
            this.gameOver();
        }

    }

    spanwnFood() {
        if (this.actualFoodPlaced < this.foodAmountPlaced) {

            const y = getRandomInt(0, this.gridY);
            const x = getRandomInt(0, this.gridX);

            if (this.grid[y][x] === this.BLANK_CONSTANT) {
                this.grid[y][x] = this.FOOD_CONSTANT;
                this.actualFoodPlaced += 1;
            } else {
                this.spanwnFood();
            }

        }
    }

    reset() {
        this.direction = {
            x: 1,
            y: 0
        }

        this.head = {
            x: parseInt(this.gridX / 2),
            y: parseInt(this.gridY / 2)
        }

        this.tailSize = 2;
        this.tail = [];

        super.reset();
    }

    //States
    gameOver() {
        this.direction = {
            x: 1,
            y: 0
        }

        this.head = {
            x: parseInt(this.gridX / 2),
            y: parseInt(this.gridY / 2)
        }

        this.tailSize = 2;
        this.tail = [];

        super.gameOver();
    }

    start() {

        if (this.isGameOver) {
            this.isGameOver = false;
        }

        this.grid[this.head.y][this.head.x] = this.BODY_CONSTANT;
        this.renderLevel();

        super.start(

            //Next
            () => {

                this.spanwnFood();
                this.move();


            },

            //BeforeNext
            () => {
                if (this.frameCount % 2 === 0) {
                    this.grid[this.head.y][this.head.x] = 0;
                }
            }
        );
    }

    pressUp() {
        if (this.isStart && this.direction.y === 0)
            this.direction = { x: 0, y: -1 }
    }

    pressDown() {
        if (this.isStart && this.direction.y === 0)
            this.direction = { x: 0, y: 1 }
    }

    pressLeft() {
        if (this.isStart && this.direction.x === 0)
            this.direction = { x: -1, y: 0 }
    }

    pressRight() {
        if (this.isStart && this.direction.x === 0)
            this.direction = { x: 1, y: 0 }
    }

    // //Keys
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
                case 's':
                case 'S':
                    this.pressDown();
                    break;
            }
        })
    }

    unbound() {
        super.unbound();
        document.body.removeEventListener('keyup', this.keysUp);
    }
}