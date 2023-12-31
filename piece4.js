class Piece4 extends Piece {
    constructor(gridX) {

        //Quantidade de estados possiveis
        //Id
        super(1, 4);

        const middleCell = Math.floor(gridX / 2);

        this.rotateStatus = getRandomInt(0, 2);
        const startCenterCell = { x: middleCell, y: 1 };

        this.parts = this.getParts(startCenterCell, this.rotateStatus);
    }

    getParts(centerCell, rotateStatus) {
        const { x, y } = centerCell;

        switch (rotateStatus) {
            case 0:
                return [
                    { x: x + 1, y: y - 1 },
                    { x, y: y - 1 },
                    { x, y },
                    { x: x - 1, y }
                ]
            case 1:
                return [
                    { x, y: y - 1 },
                    { x, y },
                    { x: x + 1, y },
                    { x: x + 1, y: y + 1 }
                ]

        }
    }

    getPreviewParts() {
        switch (this.rotateStatus) {
            case 0:
                return [
                    [0, 1, 1, 0],
                    [1, 1, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ]
            case 1:
                return [
                    [0, 1, 0, 0],
                    [0, 1, 1, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 0]
                ]

        }
    }

    findCenterCell(grid, actualPieceId) {

        const { firstX, firstY } = super.findCenterCell(grid, actualPieceId);

        switch (this.rotateStatus) {
            case 0:
                return { x: firstX, y: firstY };
            case 1:
                return { x: firstX, y: firstY - 1 };
        }

    }

}
