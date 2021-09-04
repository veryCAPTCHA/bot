const { Canvas } = require('canvas')
const { shuffle } = require("lodash")

module.exports.createImg = async function createImg(i) {
    const canvas = new Canvas(400, 250);
    const ctx = canvas.getContext("2d");

    // Set background color
    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.fillRect(0, 0, 400, 250);
    ctx.save();

    // Set style for lines
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 4;

    // Draw lines
    ctx.beginPath();

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
                    ctx.moveTo(coords[i][j], 0);
                    ctx.lineTo(coords[i + 1][j], 400);
                }
                else {
                    ctx.moveTo(0, coords[i][j]);
                    ctx.lineTo(400, coords[i + 1][j]);
                }
            }
        }
    }

    ctx.stroke();

    // Set style for text
    ctx.font = "80px Sans";
    ctx.fillStyle = "#000";

    // Set position for text
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.translate(-50, 220);
    ctx.translate(Math.round(Math.random() * 100 - 50) + 250, -1 * Math.round(Math.random() * (250 / 4) - 250 / 8) - 250 / 2);
    ctx.rotate(Math.random() - 0.5);

    // Set text value and print it to canvas
    ctx.beginPath();
    ctx.fillText(i, 0, 0);

    // Draw foreground noise
    ctx.restore();

    for (let i = 0; i < 1000; i++) {

        ctx.beginPath();

        let color = "#";
        while (color.length < 7) {
            color += Math.round(Math.random() * 16).toString(16);
        }

        color += "a0";
        ctx.fillStyle = color;
        ctx.arc(Math.round(Math.random() * 400), Math.round(Math.random() * 250), Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
    }

    return {
        image: canvas.toBuffer(),
        text: i
    };
}
