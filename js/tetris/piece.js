class Piece {

    constructor(rotateStatusCount, id, color = 'default') {
        this.rotateStatusCount = rotateStatusCount;
        this.id = id;
        this.parts = [];
        this.color = color;
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
                if (grid[y][x].value !== 0 && grid[y][x].value !== pieceId) {
                    canRotate = false;
                    break;
                }
            }
        }

        if (canRotate) {

            this.parts.forEach(({ y, x }) => {
                grid[y][x].value = 0
                grid[y][x].color = this.color;

            })

            tmpParts.forEach(({ y, x }) => {
                grid[y][x].value = pieceId
                grid[y][x].color = this.color;
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
                canMove = grid[y + my][x + mx].value === pieceId || grid[y + my][x + mx].value === 0;
            } else {
                canMove = false;
            }

            if (!canMove) break;
        }

        if (canMove) {
            this.parts.forEach(({ x, y }) => {
                grid[y][x].value = 0;
                grid[y][x].color = this.color;
            })

            this.parts = this.parts.map((actualPart) => {
                return { x: actualPart.x + mx, y: actualPart.y + my }
            })

            this.parts.forEach(({ x, y }) => {
                grid[y][x].value = pieceId;
                grid[y][x].color = this.color;
            });
        }

        return canMove;
    }


}