/**
 * Created by Rafał Zawadzki on 2014-10-13.
 */
var TRANSLATE_DEFAULT_STEP = 12;
var CONSTANT_POSITION_D = 50;
var TRANSLATE_ADJUSTMENT = 20; //higher -> less movement on z axis
var ZOOM_CHANGE = 20;
var ROTATE_X = 10;
var ROTATE_Y = 10;
var ROTATE_Z = 15;


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

    this.draw = draw;
    this.projection = projection;

    function projection() {
        var newCoordAfter = [];
        newCoordAfter[0] = this.A.x * CONSTANT_POSITION_D / (this.A.z);
        newCoordAfter[1] = this.A.y * CONSTANT_POSITION_D / (this.A.z);
        newCoordAfter[2] = this.B.x * CONSTANT_POSITION_D / (this.B.z);
        newCoordAfter[3] = this.B.y * CONSTANT_POSITION_D / (this.B.z);
        return newCoordAfter;
    }

    function draw(ctx) {
        if (this.A.z <= 0 && this.B.z <= 0) {
            return;
        }

        var tmpAX, tmpAY, tmpBX, tmpBY, tmpA, tmpB;
        if (this.A.z < 0) {
            tmpA = notVisible(this.B, this.A);
            tmpAX = tmpA.x * CONSTANT_POSITION_D / (tmpA.z);
            tmpAY = tmpA.y * CONSTANT_POSITION_D / (tmpA.z); //todo imrove projection
            PointATransformSystem = transformCoordinateSystem(tmpAX, tmpAY);
            ctx.moveTo(PointATransformSystem.transformedX, PointATransformSystem.transformedY);
            var afterProjection = this.projection();
            var PointBTransformSystem = transformCoordinateSystem(afterProjection[2], afterProjection[3]);
            ctx.lineTo(PointBTransformSystem.transformedX, PointBTransformSystem.transformedY);
            ctx.stroke();
        } else if (this.B.z < 0) {
            tmpB = notVisible(this.A, this.B);
            tmpBX = tmpB.x * CONSTANT_POSITION_D / (tmpB.z);
            tmpBY = tmpB.y * CONSTANT_POSITION_D / (tmpB.z);
            var afterProjection = this.projection();
            var PointATransformSystem = transformCoordinateSystem(afterProjection[0], afterProjection[1]);
            ctx.moveTo(PointATransformSystem.transformedX, PointATransformSystem.transformedY);
            var PointBTransformSystem = transformCoordinateSystem(tmpBX, tmpBY);
            ctx.lineTo(tmpBX, tmpBY);
            ctx.stroke();
        } else {
            var afterProjection = this.projection();
            var PointATransformSystem = transformCoordinateSystem(afterProjection[0], afterProjection[1]);
            var PointBTransformSystem = transformCoordinateSystem(afterProjection[2], afterProjection[3]);
            ctx.moveTo(PointATransformSystem.transformedX, PointATransformSystem.transformedY);
            ctx.lineTo(PointBTransformSystem.transformedX, PointBTransformSystem.transformedY);
            ctx.stroke();
        }
    }
}

function notVisible(vis, notvis) {
    var p = new Point3D();
    p.z = 1;
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

function makeSolidVectorsFromPoints(points) {
    var vectors = [];
    vectors[0] = new Vector3D(points[0], points[1]);
    vectors[1] = new Vector3D(points[1], points[2]);
    vectors[2] = new Vector3D(points[2], points[3]);
    vectors[3] = new Vector3D(points[3], points[0]);

    vectors[4] = new Vector3D(points[4], points[5]);
    vectors[5] = new Vector3D(points[5], points[6]);
    vectors[6] = new Vector3D(points[6], points[7]);
    vectors[7] = new Vector3D(points[7], points[4]);

    vectors[8] = new Vector3D(points[0], points[4]);
    vectors[9] = new Vector3D(points[1], points[5]);
    vectors[10] = new Vector3D(points[2], points[6]);
    vectors[11] = new Vector3D(points[3], points[7]);

    return vectors;
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
//            alert("Z = " + points[16].z);
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

function drawScene(vectors) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.beginPath();
    for (var i = 0; i < vectors.length; i++) {
        var tmpVe = vectors[i];
        tmpVe.draw(ctx);
    }
}

function controlSystem(event) {
    switch (event.keyCode) {
        case 87: //w
            tanslatePicture(allPoints, "up");
            drawScene(allVectors); // ;/ when defined? in global pool only :(
            break;
        case 83: //s
            tanslatePicture(allPoints, "down");
            drawScene(allVectors);
            break;
        case 65: //a
            tanslatePicture(allPoints, "left");
            drawScene(allVectors);
            break;
        case 68: //d
            tanslatePicture(allPoints, "right");
            drawScene(allVectors);
            break;
        case 81: //q
            tanslatePicture(allPoints, "forward");
            drawScene(allVectors);
            break;
        case 69: //e
            tanslatePicture(allPoints, "back");
            drawScene(allVectors);
            break;
        case 80: //p
            CONSTANT_POSITION_D = CONSTANT_POSITION_D + ZOOM_CHANGE
            drawScene(allVectors);
            break;
        case 79: //o
            CONSTANT_POSITION_D = CONSTANT_POSITION_D - ZOOM_CHANGE
            drawScene(allVectors);
            break;
        case 85: //u
            rotatePicture(allPoints, "XB");
            drawScene(allVectors);
            break;
        case 89: //y
            rotatePicture(allPoints, "XF");
            drawScene(allVectors);
            break;
        case 78: //n
            rotatePicture(allPoints, "ZF");
            drawScene(allVectors);
            break;
        case 77: //m
            rotatePicture(allPoints, "ZB");
            drawScene(allVectors);
            break;
        case 72: //h
            rotatePicture(allPoints, "YF");
            drawScene(allVectors);
            break;
        case 74: //j
            rotatePicture(allPoints, "YB");
            drawScene(allVectors);
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
//40 + 25
points3[0] = new Point3D(20, -20, 20);
points3[1] = new Point3D(60, -20, 20);
points3[2] = new Point3D(60, 5, 20);
points3[3] = new Point3D(20, 5, 20);

points3[4] = new Point3D(20, -20, 70);
points3[5] = new Point3D(60, -20, 70);
points3[6] = new Point3D(60, 5, 70);
points3[7] = new Point3D(20, 5, 70);

var vectors1 = makeSolidVectorsFromPoints(points1);
var vectors2 = makeSolidVectorsFromPoints(points2);
var vectors3 = makeSolidVectorsFromPoints(points3);
var allVectors = vectors1.concat(vectors2).concat(vectors3); //i checked length = 36, it's ok
var allPoints = points1.concat(points2).concat(points3);

drawScene(allVectors);

//todo rotate calculations
//todo divide a big script to many smaller