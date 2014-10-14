/**
 * Created by acer on 2014-10-13.
 */
var TRANSLATE_DEFAULT_STEP = 10;
var CONSTNT_POSITION_D = 100;

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
        A.x = A.x * CONSTNT_POSITION_D / (A.z + CONSTNT_POSITION_D);
        A.y = A.y * CONSTNT_POSITION_D / (A.z + CONSTNT_POSITION_D);

        B.x = B.x * CONSTNT_POSITION_D / (B.z + CONSTNT_POSITION_D);
        B.y = B.y * CONSTNT_POSITION_D / (B.z + CONSTNT_POSITION_D);
    }

    function draw() {
        projection();
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.stroke();
    }
}

//rectangles 80 / 100
var points = [];
points[0] = new Point3D(50, 150, 0);
points[1] = new Point3D(50 + 80, 150, 0);
points[2] = new Point3D(50 + 80, 150 + 100, 0);
points[3] = new Point3D(50, 150 + 100, 0);

points[4] = new Point3D(50, 150, 5 + 30);
points[5] = new Point3D(50 + 80, 150, 5 + 30);
points[6] = new Point3D(50 + 80, 150 + 100, 5 + 30);
points[7] = new Point3D(50, 150 + 100, 5 + 30);

var vectors = [];
vectors[0] = new Vector3D(points[0], points[1]);
vectors[1] = new Vector3D(points[1], points[2]);
vectors[2] = new Vector3D(points[2], points[3]);
vectors[3] = new Vector3D(points[3], points[0]);

vectors[4] = new Vector3D(points[4], points[5]);
vectors[5] = new Vector3D(points[5], points[6]);
vectors[6] = new Vector3D(points[6], points[7]);
vectors[7] = new Vector3D(points[7], points[0]);

//vectors[8] = new Vector3D(points[0], points[4]);
//vectors[9] = new Vector3D(points[1], points[5]);
//vectors[10] = new Vector3D(points[2], points[6]);
//vectors[11] = new Vector3D(points[3], points[7]);

for (var i = 0; i < vectors.length; i++) {
    var tmpVe = vectors[i];
    tmpVe.draw();
}