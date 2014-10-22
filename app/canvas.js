/**
 * Created by Rafał Zawadzki on 2014-10-13.
 */

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
            ZOOM_COEFFICIENT = ZOOM_COEFFICIENT + ZOOM_CHANGE
            drawScene(allVectors);
            break;
        case 79: //o
            ZOOM_COEFFICIENT = ZOOM_COEFFICIENT - ZOOM_CHANGE
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
//40 + 45
points3[0] = new Point3D(20, -20, 25);
points3[1] = new Point3D(60, -20, 25);
points3[2] = new Point3D(60, 5, 25);
points3[3] = new Point3D(20, 5, 25);

points3[4] = new Point3D(20, -20, 70);
points3[5] = new Point3D(60, -20, 70);
points3[6] = new Point3D(60, 5, 70);
points3[7] = new Point3D(20, 5, 70);

var solid1 = makeSolidVectorsFromPoints(points1, "#FF0000 ");
var solid2 = makeSolidVectorsFromPoints(points2, "#000000");
var solid3 = makeSolidVectorsFromPoints(points3, "#00CC00");
var allVectors = solid1.concat(solid2).concat(solid3);
var allPoints = points1.concat(points2).concat(points3);

drawScene(allVectors);