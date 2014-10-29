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

function Wall3D(A, B, C, D) {
    this.VA = A;
    this.VB = B;
    this.VC = C;
    this.VD = D;
    this.color = "#000000";

    this.draw = draw;

    function draw(ctx) {
        var tmpVA, tmpVB, tmpVC;
        tmpVA = projection(this.VA);
        tmpVB = projection(this.VB);
        tmpVC = projection(this.VC);

        var vectorEnding;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.moveTo(tmpVA.displayAX, tmpVA.displayAY);
        ctx.lineTo(tmpVA.displayBX, tmpVA.displayBY);

        if (tmpVA.displayBX == tmpVB.displayBX && tmpVA.displayBY == tmpVB.displayBY) {
            vectorEnding = "A";
            ctx.lineTo(tmpVB.displayAX, tmpVB.displayAY);
        } else {
            vectorEnding = "B";
            ctx.lineTo(tmpVB.displayBX, tmpVB.displayBY);
        }

        if (vectorEnding == "A" && tmpVB.displayAX == tmpVC.displayBX && tmpVB.displayAY == tmpVC.displayBY) {
            ctx.lineTo(tmpVC.displayAX, tmpVC.displayAY);
        } else if (vectorEnding == "B" && tmpVB.displayBX == tmpVC.displayBX && tmpVB.displayBY == tmpVC.displayBY) {
            ctx.lineTo(tmpVC.displayAX, tmpVC.displayAY);
        } else {
            ctx.lineTo(tmpVC.displayBX, tmpVC.displayBY);
        }

        ctx.lineTo(tmpVA.displayAX, tmpVA.displayAY);
        ctx.closePath();
        ctx.fill();

        var d = new Date();
    }
}

function projection(v) {
    if (v.A.z <= 0 && v.B.z <= 0) { //not true
        return {
            displayAX: undefined,
            displayAY: undefined,
            displayBX: undefined,
            displayBY: undefined
        }
    }
    var tmpAX, tmpAY, tmpBX, tmpBY, tmpA, tmpB;
    tmpAX = v.A.x * ZOOM_COEFFICIENT / (v.A.z);
    tmpAY = v.A.y * ZOOM_COEFFICIENT / (v.A.z);
    tmpBX = v.B.x * ZOOM_COEFFICIENT / (v.B.z);
    tmpBY = v.B.y * ZOOM_COEFFICIENT / (v.B.z);

    if (v.A.z <= 0) {
        tmpA = notVisible(v.B, v.A);
        tmpAX = tmpA.x * ZOOM_COEFFICIENT / (tmpA.z);
        tmpAY = tmpA.y * ZOOM_COEFFICIENT / (tmpA.z);
    }

    if (v.B.z <= 0) {
        tmpB = notVisible(v.A, v.B);
        tmpBX = tmpB.x * ZOOM_COEFFICIENT / (tmpB.z);
        tmpBY = tmpB.y * ZOOM_COEFFICIENT / (tmpB.z);
    }

    var PointATransformSystem = transformCoordinateSystem(tmpAX, tmpAY);
    var PointBTransformSystem = transformCoordinateSystem(tmpBX, tmpBY);

    return {
        displayAX: PointATransformSystem.transformedX,
        displayAY: PointATransformSystem.transformedY,
        displayBX: PointBTransformSystem.transformedX,
        displayBY: PointBTransformSystem.transformedY
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

function Vector3D(A, B) {
    this.A = A;
    this.B = B;
    this.color = "#000000";

    this.draw = draw;

    function draw(ctx) {
        if (this.A.z <= 0 && this.B.z <= 0) {
            return;
        }

        var tmpAX, tmpAY, tmpBX, tmpBY, tmpA, tmpB;

        tmpAX = this.A.x * ZOOM_COEFFICIENT / (this.A.z);
        tmpAY = this.A.y * ZOOM_COEFFICIENT / (this.A.z);
        tmpBX = this.B.x * ZOOM_COEFFICIENT / (this.B.z);
        tmpBY = this.B.y * ZOOM_COEFFICIENT / (this.B.z);

        if (this.A.z <= 0) {
            tmpA = notVisible(this.B, this.A);
            tmpAX = tmpA.x * ZOOM_COEFFICIENT / (tmpA.z);
            tmpAY = tmpA.y * ZOOM_COEFFICIENT / (tmpA.z);
        }

        if (this.B.z <= 0) {
            tmpB = notVisible(this.A, this.B);
            tmpBX = tmpB.x * ZOOM_COEFFICIENT / (tmpB.z);
            tmpBY = tmpB.y * ZOOM_COEFFICIENT / (tmpB.z);
        }

        var PointATransformSystem = transformCoordinateSystem(tmpAX, tmpAY);
        var PointBTransformSystem = transformCoordinateSystem(tmpBX, tmpBY);

        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.moveTo(PointATransformSystem.transformedX, PointATransformSystem.transformedY);
        ctx.lineTo(PointBTransformSystem.transformedX, PointBTransformSystem.transformedY);
        ctx.closePath();
        ctx.stroke();
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
    Bx = Bx + 300;
    By = -By + 200;
    return {
        transformedX: Bx,
        transformedY: By
    }
}

function makeSolidVectorsFromPoints(points, color) {
    var vectors = [];
    vectors[0] = new Vector3D(points[0], points[1]);
    vectors[0].color = color;
    vectors[1] = new Vector3D(points[1], points[2]);
    vectors[1].color = color;
    vectors[2] = new Vector3D(points[2], points[3]);
    vectors[2].color = color;
    vectors[3] = new Vector3D(points[3], points[0]);
    vectors[3].color = color;

    vectors[4] = new Vector3D(points[4], points[5]);
    vectors[4].color = color;
    vectors[5] = new Vector3D(points[5], points[6]);
    vectors[5].color = color;
    vectors[6] = new Vector3D(points[6], points[7]);
    vectors[6].color = color;
    vectors[7] = new Vector3D(points[7], points[4]);
    vectors[7].color = color;

    vectors[8] = new Vector3D(points[0], points[4]);
    vectors[8].color = color;
    vectors[9] = new Vector3D(points[1], points[5]);
    vectors[9].color = color;
    vectors[10] = new Vector3D(points[2], points[6]);
    vectors[10].color = color;
    vectors[11] = new Vector3D(points[3], points[7]);
    vectors[11].color = color;

    var walls = [];
    //vector sequence is imortatnt (unfortunately ;()
    walls[0] = new Wall3D(vectors[0], vectors[1], vectors[2], vectors[3]);
    walls[0].color = color;
    walls[1] = new Wall3D(vectors[4], vectors[5], vectors[6], vectors[7]);
    walls[1].color = color;
    walls[2] = new Wall3D(vectors[8], vectors[7], vectors[11], vectors[3]);
    walls[2].color = color;
    walls[3] = new Wall3D(vectors[0], vectors[9], vectors[4], vectors[8]);
    walls[3].color = color;
    walls[4] = new Wall3D(vectors[1], vectors[10], vectors[5], vectors[9]);
    walls[4].color = color;
    walls[5] = new Wall3D(vectors[2], vectors[11], vectors[6], vectors[10]);
    walls[5].color = color;

    return {
        walls: walls,
        vectors: vectors
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

function drawScene(vectors, walls) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.beginPath();
    for (var i = 0; i < vectors.length; i++) {
        var tmpVe = vectors[i];
        tmpVe.draw(ctx);
    }
    for (var i = 0; i < walls.length; i++) {
        walls[i].draw(ctx);
    }
}

function controlSystem(event) {
    switch (event.keyCode) {
        case 87: //w
            tanslatePicture(allPoints, "up");
            drawScene(allVectors, allWalls); // ;/ when defined? in global pool only :(
            break;
        case 83: //s
            tanslatePicture(allPoints, "down");
            drawScene(allVectors, allWalls);
            break;
        case 65: //a
            tanslatePicture(allPoints, "left");
            drawScene(allVectors, allWalls);
            break;
        case 68: //d
            tanslatePicture(allPoints, "right");
            drawScene(allVectors, allWalls);
            break;
        case 81: //q
            tanslatePicture(allPoints, "forward");
            drawScene(allVectors, allWalls);
            break;
        case 69: //e
            tanslatePicture(allPoints, "back");
            drawScene(allVectors, allWalls);
            break;
        case 80: //p
            ZOOM_COEFFICIENT = ZOOM_COEFFICIENT + ZOOM_CHANGE
            drawScene(allVectors, allWalls);
            break;
        case 79: //o
            ZOOM_COEFFICIENT = ZOOM_COEFFICIENT - ZOOM_CHANGE
            drawScene(allVectors, allWalls);
            break;
        case 85: //u
            rotatePicture(allPoints, "XB");
            drawScene(allVectors, allWalls);
            break;
        case 89: //y
            rotatePicture(allPoints, "XF");
            drawScene(allVectors, allWalls);
            break;
        case 78: //n
            rotatePicture(allPoints, "ZF");
            drawScene(allVectors, allWalls);
            break;
        case 77: //m
            rotatePicture(allPoints, "ZB");
            drawScene(allVectors, allWalls);
            break;
        case 72: //h
            rotatePicture(allPoints, "YF");
            drawScene(allVectors, allWalls);
            break;
        case 74: //j
            rotatePicture(allPoints, "YB");
            drawScene(allVectors, allWalls);
            break;
        default:
            break;
    }
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
var allVectors = solid1.vectors.concat(solid2.vectors).concat(solid3.vectors);
var allPoints = points1.concat(points2).concat(points3);
var allWalls = solid1.walls.concat(solid2.walls).concat(solid3.walls);

drawScene(allVectors, allWalls);