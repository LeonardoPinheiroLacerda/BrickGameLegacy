class Piece {

    constructor(rotateStatusCount, id) {
        this.rotateStatusCount = rotateStatusCount;
        this.id = id;
        this.parts = [];
    }

    findCenterCell() {
        const firstPart = this.parts[0];

        const firstX = firstPart.x;
        const firstY = firstPart.y;

        return { firstX, firstY };
    }

    rotate(grid, pieceId) {
        const tmpRotateStatus = this.rotateStatus == this.rotateStatusCount ? 0 : this.rotateStatus + 1;

        const centerCell = this.findCenterCell();

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
                if (grid[y][x] !== 0 && grid[y][x] !== pieceId) {
                    canRotate = false;
                    break;
                }
            }
        }

        if (canRotate) {

            this.parts.forEach(({ y, x }) => {
                grid[y][x] = 0
            })

            tmpParts.forEach(({ y, x }) => {
                grid[y][x] = pieceId
            })

            this.parts = tmpParts;
            this.rotateStatus = tmpRotateStatus;
        }

        return canRotate;

    }

    move(mx, my, grid, pieceId) {

        let canMove = false;

        for (let i = 0; i < this.parts.length; i++) {
            const { x, y } = this.parts[i];

            if (grid[y + my]) {
                canMove = grid[y + my][x + mx] === pieceId || grid[y + my][x + mx] === 0;
            } else {
                canMove = false;
            }

            if (!canMove) break;
        }

        if (canMove) {
            this.parts.forEach(({ x, y }) => {
                grid[y][x] = 0;
            })

            this.parts = this.parts.map((actualPart) => {
                return { x: actualPart.x + mx, y: actualPart.y + my }
            })

            this.parts.forEach(({ x, y }) => {
                grid[y][x] = pieceId;
            });
        }

        return canMove;
    }


}