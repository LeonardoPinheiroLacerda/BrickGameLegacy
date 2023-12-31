class Piece5 extends Piece {
    constructor(gridX) {

        //Quantidade de estados possiveis
        //Id
        super(0, 5);

        const middleCell = Math.floor(gridX / 2);

        this.rotateStatus = 0;
        const startCenterCell = { x: middleCell, y: 0 };

        this.parts = this.getParts(startCenterCell, this.rotateStatus);
    }

    getParts(centerCell, rotateStatus) {
        const { x, y } = centerCell;

        switch (rotateStatus) {
            case 0:
                return [
                    { x: x - 1, y },
                    { x, y },
                    { x: x - 1, y: y + 1 },
                    { x, y: y + 1 },

                ]


        }
    }

    getPreviewParts() {
        switch (this.rotateStatus) {
            case 0:
                return [
                    [0, 0, 0, 0],
                    [0, 1, 1, 0],
                    [0, 1, 1, 0],
                    [0, 0, 0, 0]
                ]
        }
    }

    findCenterCell(grid, actualPieceId) {

        const { firstX, firstY } = super.findCenterCell(grid, actualPieceId);

        switch (this.rotateStatus) {
            case 0:
                return { x: firstX + 1, y: firstY - 1 };
        }

    }

}
