class Piece {

    constructor(rotateStatusCount, id) {
        this.rotateStatusCount = rotateStatusCount;
        this.id = id;
    }

    findCenterCell(grid, actualPieceId) {

        let firstX;
        let firstY;

        for (let y = 0; y < grid.length; y++) {
            const row = grid[y];
            for (let x = 0; x < row.length; x++) {
                const cell = row[x];

                if (cell == actualPieceId) {
                    firstX = x;
                    firstY = y;
                    break;
                }

            }
        }

        return { firstX, firstY };

    }

    rotate(grid, actualPieceId) {
        const tmpRotateStatus = this.rotateStatus == this.rotateStatusCount ? 0 : this.rotateStatus + 1;

        const centerCell = this.findCenterCell(grid, actualPieceId, tmpRotateStatus);

        if (centerCell.y === 0) return false;

        const tmpParts = this.getParts(centerCell, tmpRotateStatus);

        let canRotate = true;

        for (let i = 0; i < tmpParts.length; i++) {
            const { x, y } = tmpParts[i];

            if (y === grid.length) {
                canRotate = false;
                return;
            }

            if (grid[y]) {
                if (grid[y][x] !== 0 && grid[y][x] !== actualPieceId) {
                    canRotate = false;
                    break;
                }
            }
        }

        if (canRotate) {
            this.parts = tmpParts;
            this.rotateStatus = tmpRotateStatus;
        }

        return canRotate;

    }

}