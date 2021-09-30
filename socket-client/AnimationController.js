const { LedMatrix } = require('easybotics-rpi-rgb-led-matrix');
const { config } = require('./config');

class AnimationController {
    constructor() {
        this.matrix = new LedMatrix(...config);
        this.interval = null;
        this.frameIndex = 0;
    }

    animate(data) {
        clearInterval(this.interval);
        if (!data) {
            this.matrix.clear();
        }
        else if (data.frames.length === 1) {
            this.renderFrame(data.frames[0]);
        }
        else {
            this.frameIndex = 0;
            this.interval = setInterval(() => {
                if (this.frameIndex === 0) this.matrix.clear();
                this.renderFrame(data.frames[this.frameIndex]);
                this.frameIndex = (this.frameIndex + 1) % data.frames.length;
            }, 1000 / data.fps);
        }
    }

    renderFrame(frame) {
        for (const [i, color] of Object.entries(frame)) {
            let rgb = this.hexToRgb(color);
            this.matrix.setPixel(i % this.cols, Math.floor(i / this.cols), ...rgb);
        }
        this.matrix.update();
    }

    hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
}

module.exports = { AnimationController };
