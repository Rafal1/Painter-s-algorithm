/**
 * Created by Rafał Zawadzki on 2014-10-13.
 */

var TRANSLATE_DEFAULT_STEP = 12;
var ZOOM_COEFFICIENT = 250;
var TRANSLATE_ADJUSTMENT = 5; //higher -> less movement on z axis
var ZOOM_CHANGE = 20;
var ROTATE_X = 6;
var ROTATE_Y = 6;
var ROTATE_Z = 7;
var CANVAS_WIDTH = 600;
var CANVAS_HEIGHT = 400;
var ZOOM_MAX = 1000;
var ZOOM_MIN = 1;

function Wall3D(A, B, C, D) {
    this.PA = A;
    this.PB = B;
    this.PC = C;
    this.PD = D;
    this.color = "#000000";

    this.draw = draw;

    function draw(ctx) {
        if (A.z < 0 && B.z < 0 && C.z < 0 && D.z < 0) {
            return;
        }
        var tmpPA, tmpPB, tmpPC, tmpPD;
        tmpPA = projection(this.PA);
        tmpPB = projection(this.PB);
        tmpPC = projection(this.PC);
        tmpPD = projection(this.PD);
        if (tmpPA == undefined || tmpPB == undefined || tmpPC == undefined || tmpPD == undefined) {
            return;
        }
        ctx.beginPath();
        ctx.fillStyle = this.color;
//        ctx.strokeStyle = "#FFFF00";
        ctx.moveTo(tmpPA.displayX, tmpPA.displayY);
        ctx.lineTo(tmpPB.displayX, tmpPB.displayY);
        ctx.lineTo(tmpPC.displayX, tmpPC.displayY);
        ctx.lineTo(tmpPD.displayX, tmpPD.displayY);
        ctx.closePath();
        ctx.fill();
//        ctx.stroke();
    }

}

function projection(v) {
    var tmpAX, tmpAY;
    tmpAX = v.x * ZOOM_COEFFICIENT / (v.z);
    tmpAY = v.y * ZOOM_COEFFICIENT / (v.z);

    if (v.z <= 0) {
        var tmpZ = 0.01;
        tmpAX = v.x * ZOOM_COEFFICIENT / (tmpZ);
        tmpAY = v.y * ZOOM_COEFFICIENT / (tmpZ);
        return undefined;
    }
    var PointATransformSystem = transformCoordinateSystem(tmpAX, tmpAY);
    return {
        displayX: PointATransformSystem.transformedX,
        displayY: PointATransformSystem.transformedY
    }
}

function Point3D(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.translateUP = translateUP;
    this.translateDown = translateDown;
    this.translateLeft = translateLeft;
    this.translateRight = translateRight;
    this.translateForward = translateForward;
    this.translateBack = translateBack;

    this.rotateX = rotateX;
    this.rotateY = rotateY;
    this.rotateZ = rotateZ;

    function translateUP() {
        this.y = this.y - TRANSLATE_DEFAULT_STEP;
    }

    function translateLeft() {
        this.x = this.x + TRANSLATE_DEFAULT_STEP;
    }

    function translateDown() {
        this.y = this.y + TRANSLATE_DEFAULT_STEP;
    }

    function translateRight() {
        this.x = this.x - TRANSLATE_DEFAULT_STEP;
    }

    function translateForward() {
        this.z = this.z - (TRANSLATE_DEFAULT_STEP / TRANSLATE_ADJUSTMENT);
    }

    function translateBack() {
        this.z = this.z + (TRANSLATE_DEFAULT_STEP / TRANSLATE_ADJUSTMENT);
    }

    function rotateX(dir) {
        var rot = ROTATE_X;
        if (dir != 1)
            rot = -rot;
        var tmpY = this.y;
        this.y = this.y * Math.cos((rot * Math.PI) / 180) - this.z * Math.sin((rot * Math.PI) / 180);
        this.z = tmpY * Math.sin((rot * Math.PI) / 180) + this.z * Math.cos((rot * Math.PI) / 180);
    }

    function rotateY(dir) {
        var rot = ROTATE_Y;
        if (dir != 1)
            rot = -rot;
        var tmpX = this.x;
        this.x = this.x * Math.cos((rot * Math.PI) / 180) + this.z * Math.sin((rot * Math.PI) / 180);
        this.z = -tmpX * Math.sin((rot * Math.PI) / 180) + this.z * Math.cos((rot * Math.PI) / 180);
    }

    function rotateZ(dir) {
        var rot = ROTATE_Z;
        if (dir != 1)
            rot = -rot;
        var tmpX = this.x;
        this.x = this.x * Math.cos(rot * Math.PI / 180) - this.y * Math.sin(rot * Math.PI / 180);
        this.y = tmpX * Math.sin(rot * Math.PI / 180) + this.y * Math.cos(rot * Math.PI / 180);
    }
}

function transformCoordinateSystem(Bx, By) {
    Bx = Bx + CANVAS_WIDTH / 2;
    By = -By + CANVAS_HEIGHT / 2;
    return {
        transformedX: Bx,
        transformedY: By
    }
}

function makeItColor(walls){
    walls[0].color = "#00FFFF";
    walls[1].color = "#FF8C00";
    walls[2].color = "#FFD700";
    walls[3].color = "#00FF00";
    walls[4].color = "#BA55D3";
    walls[5].color = "#000080";
    walls[6].color = "#4169E1";
    walls[7].color = "#F5DEB3";
    walls[8].color = "#8B4513";
    return walls;
}

function makeSolidVectorsFromPoints(width, height, depth, points, color) {
    var SolidWalls = [];
    var walls = [];
    var allWallPoints = [];
    var tmpObj;
    tmpObj = divideWallZ(width, height, points[4], points[5], points[7], points[6], color);
    walls[0] = tmpObj.walls;
    allWallPoints = allWallPoints.concat(tmpObj.pointsOfWall);
    walls[0]= makeItColor(walls[0]);

    tmpObj = divideWallX(depth, height, points[0], points[4], points[3], points[7], color);
    walls[1] = tmpObj.walls;
    allWallPoints = allWallPoints.concat(tmpObj.pointsOfWall);

    tmpObj = divideWallX(depth, height, points[1], points[5], points[2], points[6], color);
    walls[2] = tmpObj.walls;
    allWallPoints = allWallPoints.concat(tmpObj.pointsOfWall);

    tmpObj = divideWallY(depth, width, points[0], points[4], points[1], points[5], color);
    walls[3] = tmpObj.walls;
    allWallPoints = allWallPoints.concat(tmpObj.pointsOfWall);

    tmpObj = divideWallY(depth, width, points[3], points[7], points[2], points[6], color);
    walls[4] = tmpObj.walls;
    allWallPoints = allWallPoints.concat(tmpObj.pointsOfWall);

    tmpObj = divideWallZ(width, height, points[0], points[1], points[3], points[2], color);
    walls[5] = tmpObj.walls;
    allWallPoints = allWallPoints.concat(tmpObj.pointsOfWall);

    for (var i = 0; i < walls.length; i++) {
        SolidWalls = SolidWalls.concat(walls[i]);
    }

    return {
        walls: SolidWalls,
        solidPoints: allWallPoints
    }
}

function divideWallZ(width, height, p0, p3, p12, p15, color) {
    // 0--1--2--3
    // |  |  |  |
    // 3--4--5--6
    // |  |  |  |
    // 8--9--10-11
    // 12-13-14-15

    var uniZ = p0.z; //all point of wall are belongs to the dame surface do have the same z
    var devWalls = [];
    var p1 = new Point3D(p0.x + width / 3, p0.y, uniZ);
    var p2 = new Point3D(p0.x + 2 * width / 3, p0.y, uniZ);
    var p4 = new Point3D(p0.x, p0.y + height / 3, uniZ);
    var p5 = new Point3D(p0.x + width / 3, p0.y + height / 3, uniZ);
    var p6 = new Point3D(p0.x + 2 * width / 3, p0.y + height / 3, uniZ);
    var p7 = new Point3D(p0.x + width, p0.y + height / 3, uniZ);
    var p8 = new Point3D(p0.x, p0.y + 2 * height / 3, uniZ);
    var p9 = new Point3D(p0.x + width / 3, p0.y + 2 * height / 3, uniZ);
    var p10 = new Point3D(p0.x + 2 * width / 3, p0.y + 2 * height / 3, uniZ);
    var p11 = new Point3D(p0.x + width, p0.y + 2 * height / 3, uniZ);
    var p13 = new Point3D(p0.x + width / 3, p0.y + height, uniZ);
    var p14 = new Point3D(p0.x + 2 * width / 3, p0.y + height, uniZ);

    devWalls[0] = new Wall3D(p0, p1, p5, p4);
    devWalls[0].color = color;
    devWalls[1] = new Wall3D(p1, p2, p6, p5);
    devWalls[1].color = color;
    devWalls[2] = new Wall3D(p2, p3, p7, p6);
    devWalls[2].color = color;

    devWalls[3] = new Wall3D(p4, p5, p9, p8);
    devWalls[3].color = color;
    devWalls[4] = new Wall3D(p5, p6, p10, p9);
    devWalls[4].color = color;
    devWalls[5] = new Wall3D(p6, p7, p11, p10);
    devWalls[5].color = color;

    devWalls[6] = new Wall3D(p8, p9, p13, p12);
    devWalls[6].color = color;
    devWalls[7] = new Wall3D(p9, p10, p14, p13);
    devWalls[7].color = color;
    devWalls[8] = new Wall3D(p10, p11, p15, p14);
    devWalls[8].color = color;

    var pointsOfWall = [p1, p2, p4, p5, p6, p7, p8, p9, p10, p11, p13, p14];
    return {
        walls: devWalls,
        pointsOfWall: pointsOfWall
    };
}

function divideWallX(width, height, p0, p3, p12, p15, color) {
    // 0--1--2--3
    // |  |  |  |
    // 3--4--5--6
    // |  |  |  |
    // 8--9--10-11
    // 12-13-14-15

    var uniX = p0.x; //all point of wall are belongs to the dame surface do have the same z
    var devWalls = [];
    var p1 = new Point3D(uniX, p0.y, p0.z + width / 3);
    var p2 = new Point3D(uniX, p0.y, p0.z + 2 * width / 3);
    var p4 = new Point3D(uniX, p0.y + height / 3, p0.z);
    var p5 = new Point3D(uniX, p0.y + height / 3, p0.z + width / 3);
    var p6 = new Point3D(uniX, p0.y + height / 3, p0.z + 2 * width / 3);
    var p7 = new Point3D(uniX, p0.y + height / 3, p0.z + width);
    var p8 = new Point3D(uniX, p0.y + 2 * height / 3, p0.z);
    var p9 = new Point3D(uniX, p0.y + 2 * height / 3, p0.z + width / 3);
    var p10 = new Point3D(uniX, p0.y + 2 * height / 3, p0.z + 2 * width / 3);
    var p11 = new Point3D(uniX, p0.y + 2 * height / 3, p0.z + width);
    var p13 = new Point3D(uniX, p0.y + height, p0.z + width / 3);
    var p14 = new Point3D(uniX, p0.y + height, p0.z + 2 * width / 3);

    devWalls[0] = new Wall3D(p0, p1, p5, p4);
    devWalls[0].color = color;
    devWalls[1] = new Wall3D(p1, p2, p6, p5);
    devWalls[1].color = color;
    devWalls[2] = new Wall3D(p2, p3, p7, p6);
    devWalls[2].color = color;

    devWalls[3] = new Wall3D(p4, p5, p9, p8);
    devWalls[3].color = color;
    devWalls[4] = new Wall3D(p5, p6, p10, p9);
    devWalls[4].color = color;
    devWalls[5] = new Wall3D(p6, p7, p11, p10);
    devWalls[5].color = color;

    devWalls[6] = new Wall3D(p8, p9, p13, p12);
    devWalls[6].color = color;
    devWalls[7] = new Wall3D(p9, p10, p14, p13);
    devWalls[7].color = color;
    devWalls[8] = new Wall3D(p10, p11, p15, p14);
    devWalls[8].color = color;

    var pointsOfWall = [p1, p2, p4, p5, p6, p7, p8, p9, p10, p11, p13, p14];
    return {
        walls: devWalls,
        pointsOfWall: pointsOfWall
    };
}

function divideWallY(width, height, p0, p3, p12, p15, color) {
    // 0--1--2--3
    // |  |  |  |
    // 3--4--5--6
    // |  |  |  |
    // 8--9--10-11
    // 12-13-14-15

    var uniY = p0.y; //all point of wall are belongs to the dame surface do have the same z
    var devWalls = [];
    var p1 = new Point3D(p0.x, uniY, p0.z + width / 3);
    var p2 = new Point3D(p0.x, uniY, p0.z + 2 * width / 3);
    var p4 = new Point3D(p0.x + height / 3, uniY, p0.z);
    var p5 = new Point3D(p0.x + height / 3, uniY, p0.z + width / 3);
    var p6 = new Point3D(p0.x + height / 3, uniY, p0.z + 2 * width / 3);
    var p7 = new Point3D(p0.x + height / 3, uniY, p0.z + width);
    var p8 = new Point3D(p0.x + 2 * height / 3, uniY, p0.z);
    var p9 = new Point3D(p0.x + 2 * height / 3, uniY, p0.z + width / 3);
    var p10 = new Point3D(p0.x + 2 * height / 3, uniY, p0.z + 2 * width / 3);
    var p11 = new Point3D(p0.x + 2 * height / 3, uniY, p0.z + width);
    var p13 = new Point3D(p0.x + height, uniY, p0.z + width / 3);
    var p14 = new Point3D(p0.x + height, uniY, p0.z + 2 * width / 3);

    devWalls[0] = new Wall3D(p0, p1, p5, p4);
    devWalls[0].color = color;
    devWalls[1] = new Wall3D(p1, p2, p6, p5);
    devWalls[1].color = color;
    devWalls[2] = new Wall3D(p2, p3, p7, p6);
    devWalls[2].color = color;

    devWalls[3] = new Wall3D(p4, p5, p9, p8);
    devWalls[3].color = color;
    devWalls[4] = new Wall3D(p5, p6, p10, p9);
    devWalls[4].color = color;
    devWalls[5] = new Wall3D(p6, p7, p11, p10);
    devWalls[5].color = color;

    devWalls[6] = new Wall3D(p8, p9, p13, p12);
    devWalls[6].color = color;
    devWalls[7] = new Wall3D(p9, p10, p14, p13);
    devWalls[7].color = color;
    devWalls[8] = new Wall3D(p10, p11, p15, p14);
    devWalls[8].color = color;

    var pointsOfWall = [p1, p2, p4, p5, p6, p7, p8, p9, p10, p11, p13, p14];
    return {
        walls: devWalls,
        pointsOfWall: pointsOfWall
    };
}

function tanslatePicture(points, direction) {
    switch (direction) {
        case "up":
            for (var i = 0; i < points.length; i++) {
                points[i].translateUP();
            }
            break;
        case "right":
            for (var i = 0; i < points.length; i++) {
                points[i].translateRight();
            }
            break;
        case "down":
            for (var i = 0; i < points.length; i++) {
                points[i].translateDown();
            }
            break;
        case "left":
            for (var i = 0; i < points.length; i++) {
                points[i].translateLeft();
            }
            break;
        case "forward":
            for (var i = 0; i < points.length; i++) {
                points[i].translateForward();
            }
            break;
        case "back":
            for (var i = 0; i < points.length; i++) {
                points[i].translateBack();
            }
            break;
        default:
            break;
    }
}

function rotatePicture(points, direction) {
    switch (direction) {
        case "XF":
            for (var i = 0; i < points.length; i++) {
                points[i].rotateX(1);
            }
            break;
        case "XB":
            for (var i = 0; i < points.length; i++) {
                points[i].rotateX(-1);
            }
            break;
        case "ZF":
            for (var i = 0; i < points.length; i++) {
                points[i].rotateZ(1);
            }
            break;
        case "ZB":
            for (var i = 0; i < points.length; i++) {
                points[i].rotateZ(-1);
            }
            break;
        case "YF":
            for (var i = 0; i < points.length; i++) {
                points[i].rotateY(1);
            }
            break;
        case "YB":
            for (var i = 0; i < points.length; i++) {
                points[i].rotateY(-1);
            }
            break;
        default:
            break;
    }
}

function drawScene(walls) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.beginPath();
    for (var i = 0; i < walls.length; i++) {
        walls[i].draw(ctx);
    }
}

function controlSystem(event) {
    switch (event.keyCode) {
        case 87: //w
            tanslatePicture(allPoints, "up");
            allWalls = sortWalls(allWalls);
            drawScene(allWalls); // ;/ when defined? in global pool only :(
            break;
        case 83: //s
            tanslatePicture(allPoints, "down");
            allWalls = sortWalls(allWalls);
            drawScene(allWalls);
            break;
        case 65: //a
            tanslatePicture(allPoints, "left");
            allWalls = sortWalls(allWalls);
            drawScene(allWalls);
            break;
        case 68: //d
            tanslatePicture(allPoints, "right");
            allWalls = sortWalls(allWalls);
            drawScene(allWalls);
            break;
        case 81: //q
            tanslatePicture(allPoints, "forward");
            allWalls = sortWalls(allWalls);
            drawScene(allWalls);
            break;
        case 69: //e
            tanslatePicture(allPoints, "back");
            allWalls = sortWalls(allWalls);
            drawScene(allWalls);
            break;
        case 80: //p
            ZOOM_COEFFICIENT = ZOOM_COEFFICIENT + ZOOM_CHANGE;
            if (ZOOM_COEFFICIENT > ZOOM_MAX) {
                ZOOM_COEFFICIENT = ZOOM_MAX;
            }
            allWalls = sortWalls(allWalls);
            drawScene(allWalls);
            break;
        case 79: //o
            ZOOM_COEFFICIENT = ZOOM_COEFFICIENT - ZOOM_CHANGE;
            if (ZOOM_COEFFICIENT < ZOOM_MIN) {
                ZOOM_COEFFICIENT = ZOOM_MIN;
            }
            allWalls = sortWalls(allWalls);
            drawScene(allWalls);
            break;
        case 75: //k
            rotatePicture(allPoints, "XB");
            allWalls = sortWalls(allWalls);
            drawScene(allWalls);
            break;
        case 73: //i
            rotatePicture(allPoints, "XF");
            allWalls = sortWalls(allWalls);
            drawScene(allWalls);
            break;
        case 78: //n
            rotatePicture(allPoints, "ZF");
            allWalls = sortWalls(allWalls);
            drawScene(allWalls);
            break;
        case 77: //m
            rotatePicture(allPoints, "ZB");
            allWalls = sortWalls(allWalls);
            drawScene(allWalls);
            break;
        case 74: //j
            rotatePicture(allPoints, "YF");
            allWalls = sortWalls(allWalls);
            drawScene(allWalls);
            break;
        case 76: //l
            rotatePicture(allPoints, "YB");
            allWalls = sortWalls(allWalls);
            drawScene(allWalls);
            break;
        default:
            break;
    }
}

function fixSortingWalls(walls) {
    var sortedWalls = walls;
    sortedWalls = sortedWalls.sort(function (a, b) {
        var avg1 = ((b.PA.z + b.PB.z + b.PC.z + b.PD.z) / 4.0);
        var avg2 = ((a.PA.z + a.PB.z + a.PC.z + a.PD.z) / 4.0);
        var z1 = [b.PA.z, b.PB.z, b.PC.z, b.PD.z];
        var z2 = [a.PA.z, a.PB.z, a.PC.z, a.PD.z];
        var maxz1 = Number.MAX_VALUE;
        var maxz2 = Number.MAX_VALUE;

        var minz1 = Number.MIN_VALUE;
        var minz2 = Number.MIN_VALUE;
        var d;
        for (d in z1) {
            if (d > maxz1)
                maxz1 = d;
            if (d < minz1)
                minz1 = d;
        }
        for (d in z2) {
            if (d > maxz2)
                maxz2 = d;
            if (d < minz2)
                minz2 = d;
        }

        if (maxz1 < minz2)
            return 1;
        else if (maxz2 < minz1)
            return -1;
        else
            return (avg1 - avg2);
    });
    return sortedWalls;
}

function sortWalls(walls) {
    var sortedWalls;
    sortedWalls = walls;
    sortedWalls = fixSortingWalls(sortedWalls);
    return sortedWalls;
}

var points1 = [];
//-40, 30, 30
points1[0] = new Point3D(-20, -20, 50);
points1[1] = new Point3D(-60, -20, 50);
points1[2] = new Point3D(-60, 10, 50);
points1[3] = new Point3D(-20, 10, 50);

points1[4] = new Point3D(-20, -20, 80);
points1[5] = new Point3D(-60, -20, 80);
points1[6] = new Point3D(-60, 10, 80);
points1[7] = new Point3D(-20, 10, 80);

var points2 = [];
//-40, 70, 20
points2[0] = new Point3D(-20, -20, 95);
points2[1] = new Point3D(-60, -20, 95);
points2[2] = new Point3D(-60, 50, 95);
points2[3] = new Point3D(-20, 50, 95);

points2[4] = new Point3D(-20, -20, 115);
points2[5] = new Point3D(-60, -20, 115);
points2[6] = new Point3D(-60, 50, 115);
points2[7] = new Point3D(-20, 50, 115);

var points3 = [];
//40, 25, 45
points3[0] = new Point3D(20, -20, 55);
points3[1] = new Point3D(60, -20, 55);
points3[2] = new Point3D(60, 5, 55);
points3[3] = new Point3D(20, 5, 55);

points3[4] = new Point3D(20, -20, 100);
points3[5] = new Point3D(60, -20, 100);
points3[6] = new Point3D(60, 5, 100);
points3[7] = new Point3D(20, 5, 100);

var solid2 = makeSolidVectorsFromPoints(-40, 70, 20, points2, "#000000"); //black
var solid1 = makeSolidVectorsFromPoints(-40, 30, 30, points1, "#FF0000"); //red
var solid3 = makeSolidVectorsFromPoints(40, 25, 45, points3, "#00CC00"); //green
var allPoints = solid1.solidPoints.concat(solid2.solidPoints).concat(solid3.solidPoints);
allPoints = allPoints.concat(points1).concat(points2).concat(points3);
var allWalls = solid1.walls.concat(solid2.walls).concat(solid3.walls);
allWalls = sortWalls(allWalls);

drawScene(allWalls);