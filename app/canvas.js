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
var ZOOM_MAX = 600;

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

function makeSolidVectorsFromPoints(points, color) {
    var walls = [];
    walls[0] = new Wall3D(points[0], points[1], points[2], points[3]);
    walls[0].color = color;
    walls[1] = new Wall3D(points[4], points[5], points[6], points[7]);
    walls[1].color = color;
    walls[2] = new Wall3D(points[0], points[3], points[7], points[4]);
    walls[2].color = color;
    walls[3] = new Wall3D(points[0], points[1], points[5], points[4]);
    walls[3].color = color;
    walls[4] = new Wall3D(points[1], points[5], points[6], points[2]);
    walls[4].color = color;
    walls[5] = new Wall3D(points[3], points[2], points[6], points[7]);
    walls[5].color = color;
    return {
        walls: walls
    }
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
            if(ZOOM_COEFFICIENT>600){
                ZOOM_COEFFICIENT = ZOOM_MAX;
            }
            allWalls = sortWalls(allWalls);
            drawScene(allWalls);
            break;
        case 79: //o
            ZOOM_COEFFICIENT = ZOOM_COEFFICIENT - ZOOM_CHANGE;
            if(ZOOM_COEFFICIENT<0){
                ZOOM_COEFFICIENT = 1;
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
//-40 + 30 (30)
points1[0] = new Point3D(-20, -20, 50);
points1[1] = new Point3D(-60, -20, 50);
points1[2] = new Point3D(-60, 10, 50);
points1[3] = new Point3D(-20, 10, 50);

points1[4] = new Point3D(-20, -20, 80);
points1[5] = new Point3D(-60, -20, 80);
points1[6] = new Point3D(-60, 10, 80);
points1[7] = new Point3D(-20, 10, 80);

var points2 = [];
//-30 + 70 (40)
points2[0] = new Point3D(-20, -20, 95);
points2[1] = new Point3D(-60, -20, 95);
points2[2] = new Point3D(-60, 50, 95);
points2[3] = new Point3D(-20, 50, 95);

points2[4] = new Point3D(-20, -20, 125);
points2[5] = new Point3D(-50, -20, 125);
points2[6] = new Point3D(-50, 50, 125);
points2[7] = new Point3D(-20, 50, 125);

var points3 = [];
//40 + 45
points3[0] = new Point3D(20, -20, 55);
points3[1] = new Point3D(60, -20, 55);
points3[2] = new Point3D(60, 5, 55);
points3[3] = new Point3D(20, 5, 55);

points3[4] = new Point3D(20, -20, 100);
points3[5] = new Point3D(60, -20, 100);
points3[6] = new Point3D(60, 5, 100);
points3[7] = new Point3D(20, 5, 100);

var solid1 = makeSolidVectorsFromPoints(points1, "#FF0000"); //red
var solid2 = makeSolidVectorsFromPoints(points2, "#000000"); //black
var solid3 = makeSolidVectorsFromPoints(points3, "#00CC00"); //green
var allPoints = points1.concat(points2).concat(points3);
var allWalls = solid1.walls.concat(solid2.walls).concat(solid3.walls);
allWalls = sortWalls(allWalls);

drawScene(allWalls);