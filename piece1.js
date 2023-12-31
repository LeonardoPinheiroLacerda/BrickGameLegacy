class Piece1 extends Piece {
    constructor(gridX) {

        //Quantidade de estados possiveis
        //Id
        super(3, 1);

        const middleCell = Math.floor(gridX / 2);

        this.rotateStatus = getRandomInt(0, 4);

        const startCenterCell = { x: middleCell, y: this.rotateStatus === 1 ? 0 : 1 };

        this.parts = this.getParts(startCenterCell, this.rotateStatus);
    }

    getParts(centerCell, rotateStatus) {
        const { x, y } = centerCell;

        switch (rotateStatus) {
            case 0:
                return [
                    { x: x - 1, y: y - 1 },
                    { x: x - 1, y },
                    { x: x - 1, y: y + 1 },
                    { x, y: y + 1 }
                ]
            case 1:
                return [
                    { x: x + 1, y },
                    { x: x - 1, y: y + 1 },
                    { x: x, y: y + 1 },
                    { x: x + 1, y: y + 1 }
                ]
            case 2:
                return [
                    { x: x + 1, y: y - 1 },
                    { x: x + 1, y },
                    { x: x + 1, y: y + 1 },
                    { x, y: y - 1 }
                ]
            case 3:
                return [
                    { x: x - 1, y },
                    { x: x - 1, y: y - 1 },
                    { x: x, y: y - 1 },
                    { x: x + 1, y: y - 1 }
                ]
        }
    }

    getPreviewParts() {
        switch (this.rotateStatus) {
            case 0:
                return [
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 1, 0],
                    [0, 0, 0, 0]
                ]
            case 1:
                return [
                    [0, 0, 1, 0],
                    [1, 1, 1, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ]
            case 2:
                return [
                    [0, 1, 1, 0],
                    [0, 0, 1, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 0]
                ]
            case 3:
                return [
                    [1, 1, 1, 0],
                    [1, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ]
        }
    }

    findCenterCell(grid, actualPieceId) {

        const { firstX, firstY } = super.findCenterCell(grid, actualPieceId);

        switch (this.rotateStatus) {
            case 0:
                return { x: firstX + 1, y: firstY - 1 };
            case 1:
                return { x: firstX, y: firstY - 1 };
            case 2:
                return { x: firstX, y: firstY };
            case 3:
                return { x: firstX + 1, y: firstY - 1 };
        }

    }

}
