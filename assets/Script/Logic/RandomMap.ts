import seedrandom = require("seedrandom");

enum MapElementType {
    N,
    V,
    H,
    L,
    R,
    U,
    D,
}

enum Direction {
    L,
    R,
    U,
    D,
}

class Point {
    x: number;
    y: number;

    static readonly Zero: Point = new Point(0, 0);
    static readonly One: Point = new Point(1, 1);
    static readonly Up: Point = new Point(0, 1);
    static readonly Down: Point = new Point(0, -1);
    static readonly Left: Point = new Point(-1, 0);
    static readonly Right: Point = new Point(1, 0);

    static clone(p: Point): Point {
        let t = new Point(0, 0);
        t.x = p.x;
        t.y = p.y;
        return t;
    }

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    copy(p: Point): void {
        this.x = p.x;
        this.y = p.y;
    }

    equal(p: Point): boolean {
        return this.x == p.x && this.y == p.y;
    }
}

export default class RandomMap {
    private readonly vMax = 5;
    private readonly hMax = 3;

    private width: number;
    private height: number;
    private map: any
    private start: Point;
    private rng: seedrandom.prng;
    constructor(width: number, height: number) {
        this.rng = seedrandom("hello");
        this.width = width;
        this.height = height;
        this.start = new Point(Math.floor(this.width / 2), this.height - 1);
        this.map = [];
    }

    generate(): void {
        for (let i = 0; i < this.height; ++i) {
            let row = [];
            for (let j = 0; j < this.width; ++j) {
                row.push(0);
            }
            this.map.push(row);
        }

        let currentPoint = Point.Zero;
        currentPoint.copy(this.start);
        for (let i = 0; i < 10; ++i) {
            this.map[currentPoint.y--][currentPoint.x] = MapElementType.V;
        }

        console.log("-----------------------------")
        console.log(this.toString());
        console.log("-----------------------------")

        let lastPoint = Point.clone(currentPoint);
        lastPoint.y++;
        let dir = Direction.U;
        while (true) {
            let result = this.randomPartMap(lastPoint, dir, this.map);
            if (!result || result.p.equal(lastPoint)) {
                break;
            }

            dir = result.direction;
            lastPoint.copy(result.p);
        }
    }

    private randomPartMap(point: Point, dir: Direction, m: any[]): { p: Point, direction: Direction } {
        let preEl = m[point.y][point.x];
        let result = this.randomDirection(preEl, dir);
        if (!result) {
            console.assert(false);
            return;
        }

        // console.assert(result.el != undefined && result.dir != undefined);

        let newPoint = Point.clone(point);
        if (dir == Direction.L) {
            newPoint.x -= 1;
        } else if (dir == Direction.R) {
            newPoint.x += 1;
        } else if (dir == Direction.U) {
            newPoint.y -= 1;
        } else if (dir == Direction.D) {
            newPoint.y += 1;
        }

        if (!this.inMap(newPoint)) {
            return null;
        }

        m[newPoint.y][newPoint.x] = result.el;

        let vh = MapElementType.V;
        if (result.direction == Direction.L || result.direction == Direction.R) {
            vh = MapElementType.H;
        }

        let max = 3;
        if (vh == MapElementType.V) {
            max = 5;
        }

        let count = this.randVHCount(max);

        let tempPoint = Point.clone(newPoint);
        for (let i = 1; i <= count; ++i) {
            if (vh == MapElementType.V) {
                tempPoint.y = tempPoint.y - 1 * (result.direction == Direction.U ? 1 : -1);
            } else if (vh = MapElementType.H) {
                tempPoint.x = tempPoint.x - 1 * (result.direction == Direction.L ? 1 : -1);
            }

            if (!this.inMap(tempPoint)) {
                break;
            }

            newPoint.copy(tempPoint);
            m[newPoint.y][newPoint.x] = vh;
        }

        return { p: newPoint, direction: result.direction };
    }

    private randomDirection(preDir: MapElementType, dir: Direction): any {
        switch (preDir) {
            case MapElementType.V:
                console.assert(dir == Direction.U || dir == Direction.D);
                return this.randomHorizonDirection(dir);
            case MapElementType.H:
                return this.randomVerticalDirecion(dir);
            case MapElementType.U:
            case MapElementType.D:
            case MapElementType.L:
            case MapElementType.R:
            default:
                console.error("unsupported!");
                return null;
        }
    }

    private randomHorizonDirection(dir: Direction): { el: any, direction: any } {
        let rightWard = this.rng.int32() % 2 == 0;
        let el: MapElementType = MapElementType.N;
        if (dir == Direction.U) {
            el = rightWard ? MapElementType.L : MapElementType.D;
        } else if (dir == Direction.D) {
            el = rightWard ? MapElementType.R : MapElementType.U;
        }

        return { el: el, direction: rightWard ? Direction.R : Direction.L };
    }

    private randomVerticalDirecion(dir: Direction): { el: any, direction: any } {
        let downWard = this.rng.int32() % 2 == 0;
        let el: MapElementType = MapElementType.N;
        if (dir == Direction.L) {
            el = downWard ? MapElementType.L : MapElementType.R;
        } else if (dir == Direction.R) {
            el = downWard ? MapElementType.D : MapElementType.U;
        }

        return { el: el, direction: downWard ? Direction.D : Direction.U };
    }

    private randVHCount(max: number): number {
        return this.rng.int32() % max + 1;
    }

    private inMap(point: Point): boolean {
        if (point.x < 0 || point.x >= this.width ||
            point.y < 0 || point.y >= this.height) {
            // reach the bound of map
            return false;
        }

        return true;
    }

    toString(): string {
        let str = "";
        for (let i = 0; i < this.height; ++i) {
            let row = "";
            for (let j = 0; j < this.width; ++j) {
                row += this.getMapElement(this.map[i][j]);
            }
            str += row + "\n";
        }

        return str;
    }

    private getMapElement(t: MapElementType): string {
        switch (t) {
            case MapElementType.D:
                return "D";
            case MapElementType.U:
                return "U";
            case MapElementType.R:
                return "R";
            case MapElementType.L:
                return "L";
            case MapElementType.H:
                return "H";
            case MapElementType.V:
                return "V";
            case MapElementType.N:
            default:
                return t.toString();

        }
    }
}