class Piece6 extends Piece {
    constructor(gridX) {

        //Quantidade de estados possiveis
        //Id
        super(1, 6);

        const middleCell = Math.floor(gridX / 2);

        this.rotateStatus = 1;
        const startCenterCell = { x: middleCell, y: this.rotateStatus === 0 ? 2 : 0 };

        this.parts = this.getParts(startCenterCell, this.rotateStatus);
    }

    getParts(centerCell, rotateStatus) {
        const { x, y } = centerCell;

        switch (rotateStatus) {
            case 0:
                return [
                    { x, y: y - 1 },
                    { x, y },
                    { x, y: y + 1 },
                    { x, y: y + 2 },

                ]
            case 1:
                return [
                    { x: x - 1, y },
                    { x, y },
                    { x: x + 1, y },
                    { x: x + 2, y },
                ]


        }
    }

    getPreviewParts() {
        switch (this.rotateStatus) {
            case 0:
                return [
                    [0, 0, 1, 0],
                    [0, 0, 1, 0],
                    [0, 0, 1, 0],
                    [0, 0, 1, 0]
                ]
            case 1:
                return [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ]
        }
    }

    findCenterCell(grid, actualPieceId) {

        const { firstX, firstY } = super.findCenterCell(grid, actualPieceId);

        switch (this.rotateStatus) {
            case 0:
                return { x: firstX, y: firstY - 2 };
            case 1:
                return { x: firstX + 1, y: firstY };
        }

    }

}
