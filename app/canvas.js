/**
 * Created by Rafał Zawadzki on 2014-10-13.
 */
var TRANSLATE_DEFAULT_STEP = 10;
var CONSTANT_POSITION_D = 5;

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
        this.z = this.z - (TRANSLATE_DEFAULT_STEP / 50); //TODO establish constant instead hardcode 50 :)
    }

    function translateBack() {
        this.z = this.z + (TRANSLATE_DEFAULT_STEP / 50);
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
        var afterProjection = this.projection();

        var PointATransformSystem = transformCoordinateSystem(afterProjection[0], afterProjection[1]);
        var PointBTransformSystem = transformCoordinateSystem(afterProjection[2], afterProjection[3]);

        ctx.moveTo(PointATransformSystem.transformedX, PointATransformSystem.transformedY);
        ctx.lineTo(PointBTransformSystem.transformedX, PointBTransformSystem.transformedY);
        ctx.stroke();
    }
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

var points1 = [];
//-40 + 30
points1[0] = new Point3D(-20, -20, 1.3);
points1[1] = new Point3D(-60, -20, 1.3);
points1[2] = new Point3D(-60, 10, 1.3);
points1[3] = new Point3D(-20, 10, 1.3);

points1[4] = new Point3D(-20, -20, 2);
points1[5] = new Point3D(-60, -20, 2);
points1[6] = new Point3D(-60, 10, 2);
points1[7] = new Point3D(-20, 10, 2);

var points2 = [];
//-30 + 70
points2[0] = new Point3D(-20, -20, 2.2);
points2[1] = new Point3D(-60, -20, 2.2);
points2[2] = new Point3D(-60, 50, 2.2);
points2[3] = new Point3D(-20, 50, 2.2);

points2[4] = new Point3D(-20, -20, 2.8);
points2[5] = new Point3D(-50, -20, 2.8);
points2[6] = new Point3D(-50, 50, 2.8);
points2[7] = new Point3D(-20, 50, 2.8);

var points3 = [];
//40 + 25
points3[0] = new Point3D(20, -20, 1.4);
points3[1] = new Point3D(60, -20, 1.4);
points3[2] = new Point3D(60, 5, 1.4);
points3[3] = new Point3D(20, 5, 1.4);

points3[4] = new Point3D(20, -20, 2.5);
points3[5] = new Point3D(60, -20, 2.5);
points3[6] = new Point3D(60, 5, 2.5);
points3[7] = new Point3D(20, 5, 2.5);

var vectors1 = makeSolidVectorsFromPoints(points1);
var vectors2 = makeSolidVectorsFromPoints(points2);
var vectors3 = makeSolidVectorsFromPoints(points3);
var allVectors = vectors1.concat(vectors2).concat(vectors3); //i checked length = 36, it's ok
var allPoints = points1.concat(points2).concat(points3);

drawScene(allVectors);
//tanslatePicture(allPoints, "up");
//tanslatePicture(allPoints, "up");
//tanslatePicture(allPoints, "up");
//
//tanslatePicture(allPoints, "right");
//tanslatePicture(allPoints, "right");
//tanslatePicture(allPoints, "right");

//tanslatePicture(allPoints, "forward");
//tanslatePicture(allPoints, "forward");
//tanslatePicture(allPoints, "forward");
//tanslatePicture(allPoints, "forward");
//tanslatePicture(allPoints, "forward");

//tanslatePicture(allPoints, "back");
//tanslatePicture(allPoints, "back");
//tanslatePicture(allPoints, "back");
//tanslatePicture(allPoints, "back");
//tanslatePicture(allPoints, "back");

drawScene(allVectors);

//todo control system for translation
//todo zoom option + control system
//todo rotate calculations
//todo divide a big script to many smaller