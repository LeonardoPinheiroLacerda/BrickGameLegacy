class Menu extends Game {

    constructor({ width, maxHeight, selector }, shouldResize = true, isOn = false) {

        super(
            { width, maxHeight, selector },
            "",
            shouldResize,
            isOn
        );

        this.events = {
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
            onAction: () => {
                this.pressAction();
            },
            onUp: () => {
                this.pressUp();
            },
            onDown: () => {
                this.pressDown();
            },
            onRight: () => {
                this.pressRight();
            },
            onLeft: () => {
                this.pressLeft();
            },
        }

        this.games = [
            {
                title: 'Tetris',
                x: 0.19
            },
            {
                title: 'Snake',
                x: 0.22
            }
        ]

        this.actualGame = 0;
    }

    drawWelcome() {

        this.context.fillStyle = "rgb(19, 26, 18)";
        this.context.font = this.width * 0.09 + "px retro-gaming";
        this.context.fillText("Chose a game", this.width * 0.085, this.height * 0.2);

        this.context.font = this.width * 0.1 + "px retro-gaming";
        this.context.fillText("<", this.width * 0.05, this.height * 0.5);
        this.context.fillText(">", this.width * 0.585, this.height * 0.5);

        const actualGame = this.games[this.actualGame];

        this.context.fillText(actualGame.title, this.width * actualGame.x, this.height * 0.5);

        this.drawHowToPlay();
    }

    drawHowToPlay() {

        this.context.font = this.width * 0.05 + "px retro-gaming";
        this.context.fillText("Start: select game", this.width * 0.09, this.height * 0.8);
        this.context.fillText("A: next", this.width * 0.09, this.height * 0.86);
        this.context.fillText("D: previous", this.width * 0.09, this.height * 0.92);

    }


    pressLeft() {
        if (!this.isOn) return;
        this.actualGame = this.actualGame === 0
            ? this.games.length - 1
            : this.actualGame - 1;

        this.drawFrame();
        this.drawWelcome();
    }

    pressRight() {
        if (!this.isOn) return;
        this.actualGame = this.actualGame === this.games.length - 1
            ? 0
            : this.actualGame + 1;

        this.drawFrame();
        this.drawWelcome();
    }

    pressAction() {
        if (!this.isOn) return;
        this.start();
    }

    start() {

        switch (this.games[this.actualGame].title) {
            case 'Tetris':
                this.unbound();
                const tetris = new Tetris(this.initData, false, true);
                tetris.bound();
                break;
            case 'Snake':
                this.unbound();
                const snake = new Snake(this.initData, false, true);
                snake.bound();
                break;
        }

    }

    turnOff() {
        this.actualGame = 0;
        super.turnOff();
    }

    //Keys
    mapKeys() {
        document.body.addEventListener("keyup", this.keysUp = ({ key }) => {
            switch (key) {
                case 'd':
                case 'D':
                    this.pressRight();
                    break;
                case 'a':
                case 'A':
                    this.pressLeft();
                    break;
                case 'j':
                case 'J':
                    this.pressAction();
                    break;
            }
        })
    }

    unbound() {
        super.unbound();
        document.body.removeEventListener("keyup", this.keysUp);
        // this.drawFrame();
    }

}