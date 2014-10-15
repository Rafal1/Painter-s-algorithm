/**
 * Created by Rafał Zawadzki on 2014-10-13.
 */
var TRANSLATE_DEFAULT_STEP = 10;
var CONSTANT_POSITION_D = 10;

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

    function projection() {
        //TODO 0.5 aby ładnie wyświetlało i niedosonałości obliczeń
        //A.x = A.x * CONSTNT_POSITION_D / (A.z + CONSTNT_POSITION_D);
        //A.y = A.y * CONSTNT_POSITION_D / (A.z + CONSTNT_POSITION_D);

        //B.x = B.x * CONSTNT_POSITION_D / (B.z + CONSTNT_POSITION_D);
        //B.y = B.y * CONSTNT_POSITION_D / (B.z + CONSTNT_POSITION_D);

        this.A.x = A.x * CONSTANT_POSITION_D / (A.z);
        this.A.y = A.y * CONSTANT_POSITION_D / (A.z);

        this.B.x = B.x * CONSTANT_POSITION_D / (B.z);
        this.B.y = B.y * CONSTANT_POSITION_D / (B.z);
    }

    function draw() {
        // projection();
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");

//        this.A.x = this.A.x * CONSTANT_POSITION_D / (this.A.z);
//        this.A.y = this.A.x * CONSTANT_POSITION_D / (this.A.z);
//        this.B.x = this.A.x * CONSTANT_POSITION_D / (this.A.z);
//        this.B.y = this.A.x * CONSTANT_POSITION_D / (this.A.z);

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

//rectangles 80 / 100
//var points = [];
//points[0] = new Point3D(50, 150, 0);
//points[1] = new Point3D(50 + 80, 150, 0);
//points[2] = new Point3D(50 + 80, 150 + 100, 0);
//points[3] = new Point3D(50, 150 + 100, 0);
//
//points[4] = new Point3D(50, 150, 5 + 30);
//points[5] = new Point3D(50 + 80, 150, 5 + 30);
//points[6] = new Point3D(50 + 80, 150 + 100, 5 + 30);
//points[7] = new Point3D(50, 150 + 100, 5 + 30);
//
//var vectors = [];
//vectors[0] = new Vector3D(points[0], points[1]);
//vectors[1] = new Vector3D(points[1], points[2]);
//vectors[2] = new Vector3D(points[2], points[3]);
//vectors[3] = new Vector3D(points[3], points[0]);
//
//vectors[4] = new Vector3D(points[4], points[5]);
//vectors[5] = new Vector3D(points[5], points[6]);
//vectors[6] = new Vector3D(points[6], points[7]);
//vectors[7] = new Vector3D(points[7], points[4]);

//vectors[8] = new Vector3D(points[0], points[4]);
//vectors[9] = new Vector3D(points[1], points[5]);
//vectors[10] = new Vector3D(points[2], points[6]);
//vectors[11] = new Vector3D(points[3], points[7]);

//for (var i = 0; i < vectors.length; i++) {
//    var tmpVe = vectors[i];
//    tmpVe.draw();
//}

var points1 = [];
points1[0] = new Point3D(-20, 20, 10);
points1[1] = new Point3D(-40, 20, 10);
points1[2] = new Point3D(-40, 40, 10);
points1[3] = new Point3D(-20, 40, 10);

points1[4] = new Point3D(-20, 20, 30);
points1[5] = new Point3D(-40, 20, 30);
points1[6] = new Point3D(-40, 40, 30);
points1[7] = new Point3D(-20, 40, 30);

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