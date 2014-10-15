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

    function translateUP() {
        this.y = y + TRANSLATE_DEFAULT_STEP;
    }

    function translateLeft() {
        this.x = x - TRANSLATE_DEFAULT_STEP;
    }

    function translateDown() {
        this.y = y - TRANSLATE_DEFAULT_STEP;
    }

    function translateRight() {
        this.x = x + TRANSLATE_DEFAULT_STEP;
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

    function draw() {
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");

        //this.A = transformCoordinateSystem(this.A);
        //this.B = transformCoordinateSystem(this.B);

        var AxP = this.A.x * CONSTANT_POSITION_D / (this.A.z);
        var AyP = this.A.y * CONSTANT_POSITION_D / (this.A.z);

        var BxP = this.B.x * CONSTANT_POSITION_D / (this.B.z);
        var ByP = this.B.y * CONSTANT_POSITION_D / (this.B.z);

        var Cx = new Date();

        var Ax = AxP + 300;
        var Ay = -AyP + 200;

        var Bx = BxP + 300;
        var By = -ByP + 200;

        ctx.moveTo(Ax, Ay);
        ctx.lineTo(Bx, By);
        ctx.stroke();
        var cx = new Date();
    }
}

function transformCoordinateSystem(point) {
    point.x = point.x + 300;
    point.y = -point.y + 200;
    //z bez zmian
    return point;
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

var vectors1 = [];
vectors1[0] = new Vector3D(points1[0], points1[1]);
vectors1[1] = new Vector3D(points1[1], points1[2]);
vectors1[2] = new Vector3D(points1[2], points1[3]);
vectors1[3] = new Vector3D(points1[3], points1[0]);

vectors1[4] = new Vector3D(points1[4], points1[5]);
vectors1[5] = new Vector3D(points1[5], points1[6]);
vectors1[6] = new Vector3D(points1[6], points1[7]);
vectors1[7] = new Vector3D(points1[7], points1[4]);

vectors1[8] = new Vector3D(points1[0], points1[4]);
vectors1[9] = new Vector3D(points1[1], points1[5]);
vectors1[10] = new Vector3D(points1[2], points1[6]);
vectors1[11] = new Vector3D(points1[3], points1[7]);

for (var i = 0; i < vectors1.length; i++) {
    var tmpVe = vectors1[i];
    tmpVe.draw();
}

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

var vectors2 = [];
vectors2[0] = new Vector3D(points2[0], points2[1]);
vectors2[1] = new Vector3D(points2[1], points2[2]);
vectors2[2] = new Vector3D(points2[2], points2[3]);
vectors2[3] = new Vector3D(points2[3], points2[0]);

vectors2[4] = new Vector3D(points2[4], points2[5]);
vectors2[5] = new Vector3D(points2[5], points2[6]);
vectors2[6] = new Vector3D(points2[6], points2[7]);
vectors2[7] = new Vector3D(points2[7], points2[4]);

vectors2[8] = new Vector3D(points2[0], points2[4]);
vectors2[9] = new Vector3D(points2[1], points2[5]);
vectors2[10] = new Vector3D(points2[2], points2[6]);
vectors2[11] = new Vector3D(points2[3], points2[7]);

for (var i = 0; i < vectors2.length; i++) {
    var tmpVe = vectors2[i];
    tmpVe.draw();
}

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

var vectors3 = [];
vectors3[0] = new Vector3D(points3[0], points3[1]);
vectors3[1] = new Vector3D(points3[1], points3[2]);
vectors3[2] = new Vector3D(points3[2], points3[3]);
vectors3[3] = new Vector3D(points3[3], points3[0]);

vectors3[4] = new Vector3D(points3[4], points3[5]);
vectors3[5] = new Vector3D(points3[5], points3[6]);
vectors3[6] = new Vector3D(points3[6], points3[7]);
vectors3[7] = new Vector3D(points3[7], points3[4]);

vectors3[8] = new Vector3D(points3[0], points3[4]);
vectors3[9] = new Vector3D(points3[1], points3[5]);
vectors3[10] = new Vector3D(points3[2], points3[6]);
vectors3[11] = new Vector3D(points3[3], points3[7]);

for (var i = 0; i < vectors3.length; i++) {
    var tmpVe = vectors3[i];
    tmpVe.draw();
}