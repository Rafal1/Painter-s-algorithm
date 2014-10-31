/**
 * Created by Rafał Zawadzki on 2014-10-13.
 */

var TRANSLATE_DEFAULT_STEP = 12;
var ZOOM_COEFFICIENT = 50;
var TRANSLATE_ADJUSTMENT = 5; //higher -> less movement on z axis
var ZOOM_CHANGE = 20;
var ROTATE_X = 10;
var ROTATE_Y = 10;
var ROTATE_Z = 15;
var CANVAS_WIDTH = 600;
var CANVAS_HEIGHT = 400;

function Wall3D(A, B, C, D) {
    this.VA = A;
    this.VB = B;
    this.VC = C;
    this.VD = D;
    this.color = "#000000";

    this.draw = draw;

    function draw(ctx) {
        if(A.z<0 && B.z<0 && C.z<0 && D.z<0){
            return;
        }
        var tmpPA, tmpPB, tmpPC, tmpPD;
        tmpPA = projection(this.VA);
        tmpPB = projection(this.VB);
        tmpPC = projection(this.VC);
        tmpPD = projection(this.VD);

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
        this.y = this.y * Math.cos(rot * Math.PI / 180) - this.z * Math.sin(rot * Math.PI / 180);
        this.z = tmpY * Math.sin(rot * Math.PI / 180) + this.z * Math.cos(rot * Math.PI / 180);
    }

    function rotateY(dir) {
        var rot = ROTATE_Y;
        if (dir != 1)
            rot = -rot;
        var tmpX = this.x;
        this.x = this.x * Math.cos(rot * Math.PI / 180) + this.z * Math.sin(rot * Math.PI / 180);
        this.z = -tmpX * Math.sin(rot * Math.PI / 180) + this.z * Math.cos(rot * Math.PI / 180);
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

function notVisible(vis, notvis) {
    var p = new Point3D();
    p.z = 0.01;
    p.x = 0;
    p.y = 0;
    var depth = Math.abs(vis.z) + Math.abs(notvis.z);
    var ratio = (vis.z + 1.0) / (depth);
    p.x = (vis.x + notvis.x) * ratio;
    p.y = (vis.y + notvis.y) * ratio;
    return p;
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
//    for (var i = 0; i < vectors.length; i++) {
//        var tmpVe = vectors[i];
//        tmpVe.draw(ctx);
//    }
    for (var i = 0; i < walls.length; i++) {
        walls[i].draw(ctx);
    }
}

function controlSystem(event) {
    switch (event.keyCode) {
        case 87: //w
            tanslatePicture(allPoints, "up");
            drawScene(allWalls); // ;/ when defined? in global pool only :(
            break;
        case 83: //s
            tanslatePicture(allPoints, "down");
            drawScene(allWalls);
            break;
        case 65: //a
            tanslatePicture(allPoints, "left");
            drawScene(allWalls);
            break;
        case 68: //d
            tanslatePicture(allPoints, "right");
            drawScene(allWalls);
            break;
        case 81: //q
            tanslatePicture(allPoints, "forward");
            drawScene(allWalls);
            break;
        case 69: //e
            tanslatePicture(allPoints, "back");
            drawScene(allWalls);
            break;
        case 80: //p
            ZOOM_COEFFICIENT = ZOOM_COEFFICIENT + ZOOM_CHANGE
            drawScene(allWalls);
            break;
        case 79: //o
            ZOOM_COEFFICIENT = ZOOM_COEFFICIENT - ZOOM_CHANGE
            drawScene(allWalls);
            break;
        case 85: //u
            rotatePicture(allPoints, "XB");
            drawScene(allWalls);
            break;
        case 89: //y
            rotatePicture(allPoints, "XF");
            drawScene(allWalls);
            break;
        case 78: //n
            rotatePicture(allPoints, "ZF");
            drawScene(allWalls);
            break;
        case 77: //m
            rotatePicture(allPoints, "ZB");
            drawScene(allWalls);
            break;
        case 72: //h
            rotatePicture(allPoints, "YF");
            drawScene(allWalls);
            break;
        case 74: //j
            rotatePicture(allPoints, "YB");
            drawScene(allWalls);
            break;
        default:
            break;
    }
}

function Wall3DParam(ID, SC, X, Y) {
    this.ID = ID;
    this.SC = SC;
    this.XSC = X;
    this.YSC = Y;
}

function scOfWall(wall) {
//    wall.A
}

function remakeWalls(walls) {
    var remaked = [];
    for (var i = 0; walls.length; i++) {
        var sc = walls[i];
        remaked[i] = new Wall3DParam();
        walls[i]
    }

    return remaked;
}

function sortWalls(walls) {
    var sortedWalls = [];
    sortedWalls = walls;
    return sortedWalls;

}

var points1 = [];
//-40 + 30
points1[0] = new Point3D(-20, -20, 20);
points1[1] = new Point3D(-60, -20, 20);
points1[2] = new Point3D(-60, 10, 20);
points1[3] = new Point3D(-20, 10, 20);

points1[4] = new Point3D(-20, -20, 50);
points1[5] = new Point3D(-60, -20, 50);
points1[6] = new Point3D(-60, 10, 50);
points1[7] = new Point3D(-20, 10, 50);

var points2 = [];
//-30 + 70
points2[0] = new Point3D(-20, -20, 55);
points2[1] = new Point3D(-60, -20, 55);
points2[2] = new Point3D(-60, 50, 55);
points2[3] = new Point3D(-20, 50, 55);

points2[4] = new Point3D(-20, -20, 85);
points2[5] = new Point3D(-50, -20, 85);
points2[6] = new Point3D(-50, 50, 85);
points2[7] = new Point3D(-20, 50, 85);

var points3 = [];
//40 + 45
points3[0] = new Point3D(20, -20, 25);
points3[1] = new Point3D(60, -20, 25);
points3[2] = new Point3D(60, 5, 25);
points3[3] = new Point3D(20, 5, 25);

points3[4] = new Point3D(20, -20, 70);
points3[5] = new Point3D(60, -20, 70);
points3[6] = new Point3D(60, 5, 70);
points3[7] = new Point3D(20, 5, 70);

var solid1 = makeSolidVectorsFromPoints(points1, "#FF0000"); //red
var solid2 = makeSolidVectorsFromPoints(points2, "#000000"); //black
var solid3 = makeSolidVectorsFromPoints(points3, "#00CC00"); //green
//var allVectors = solid1.vectors.concat(solid2.vectors).concat(solid3.vectors);
var allPoints = points1.concat(points2).concat(points3);
var allWalls = solid1.walls.concat(solid2.walls).concat(solid3.walls);
allWalls = sortWalls(allWalls);

drawScene(allWalls);