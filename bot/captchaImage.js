const { Canvas, registerFont } = require('canvas')
const { shuffle } = require("lodash")
registerFont('./data/font.ttf', { family: 'CustomFont' })

module.exports.createImg = async function createImg(i) {
    const canvas = new Canvas(400, 250);
    const cv = canvas.getContext("2d");

    // Set background color
    cv.globalAlpha = 1;
    cv.fillStyle = "white";
    cv.beginPath();
    cv.fillRect(0, 0, 400, 250);
    cv.save();

    // Set style for lines
    cv.strokeStyle = "#000";
    cv.lineWidth = 4;

    // Draw lines
    cv.beginPath();

    const coords = [];

    for (let i = 0; i < 4; i++) {
        if (!coords[i])
            coords[i] = [];
        for (let j = 0; j < 5; j++)
            coords[i][j] = Math.round(Math.random() * 80) + j * 80;
        if (!(i % 2))
            coords[i] = shuffle(coords[i]);
    }

    for (let i = 0; i < coords.length; i++) {
        if (!(i % 2)) {
            for (let j = 0; j < coords[i].length; j++) {
                if (!i) {
                    cv.moveTo(coords[i][j], 0);
                    cv.lineTo(coords[i + 1][j], 400);
                }
                else {
                    cv.moveTo(0, coords[i][j]);
                    cv.lineTo(400, coords[i + 1][j]);
                }
            }
        }
    }

    cv.stroke();

    // Set style for text
    cv.font = "80px CustomFont";
    cv.fillStyle = "#000";

    // Set position for text
    cv.textAlign = "center";
    cv.textBaseline = "top";
    cv.translate(-50, 220);
    cv.translate(Math.round(Math.random() * 100 - 50) + 250, -1 * Math.round(Math.random() * (250 / 4) - 250 / 8) - 250 / 2);
    cv.rotate(Math.random() - 0.5);

    // Set text value and print it to canvas
    cv.beginPath();
    cv.fillText(i, 0, 0);

    // Draw foreground noise
    cv.restore();

    for (let i = 0; i < 1000; i++) {

        cv.beginPath();

        let color = "#";
        while (color.length < 7) {
            color += Math.round(Math.random() * 16).toString(16);
        }

        color += "a0";
        cv.fillStyle = color;
        cv.arc(Math.round(Math.random() * 400), Math.round(Math.random() * 250), Math.random() * 2, 0, Math.PI * 2);
        cv.fill();
    }

    return {
        image: canvas.toBuffer(),
        text: i
    };
}
