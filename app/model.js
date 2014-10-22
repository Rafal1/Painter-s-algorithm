/**
 * Created by Rafał Zawadzki on 2014-10-22.
 */

var TRANSLATE_DEFAULT_STEP = 12;
var ZOOM_COEFFICIENT = 50;
var TRANSLATE_ADJUSTMENT = 5; //higher -> less movement on z axis
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
        ctx.stroke();
    }
}