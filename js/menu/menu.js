class Menu extends Game {

    constructor({ width, maxHeight, selector }) {

        super(
            { width, maxHeight, selector },
            "",
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
        );

        this.games = [
            {
                title: 'Tetris',
                x: 0.19
            },
            {
                title: 'Snake',
                x: 0.22
            },
            {
                title: 'Runner',
                x: 0.2
            },
            {
                title: 'Teste',
                x: 0.22
            },
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
        this.actualGame = this.actualGame === 0
            ? this.games.length - 1
            : this.actualGame - 1;

        this.drawFrame();
        this.drawWelcome();
    }

    pressRight() {
        this.actualGame = this.actualGame === this.games.length - 1
            ? 0
            : this.actualGame + 1;

        this.drawFrame();
        this.drawWelcome();
    }

    start() {

        console.log(this.games[this.actualGame]);

    }

    turnOff() {
        this.actualGame = 0;
        super.turnOff();
    }

    //Keys
    mapKeyUp(e) {
        switch (e.key) {
            case 'd':
            case 'D':
                this.pressRight();
                break;
            case 'a':
            case 'A':
                this.pressLeft();
                break;
        }
    }

    mapKeyPress(e) {

    }

    mapKeyDown(e) {

    }
}