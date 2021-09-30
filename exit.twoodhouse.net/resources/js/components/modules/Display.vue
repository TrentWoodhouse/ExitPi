<template>
    <div class="w-100">
        <canvas id="display"></canvas>
    </div>
</template>

<script>
export default {
    name: 'Display',
    data() {
        return {
            canvas: null,
            dWidth: 0,
            dHeight: 0,
            interval: null,
            frameIndex: 0,
            renderedFrame: {},
        }
    },
    computed: {
        animation() {
            return this.$store.state.animation;
        },
        preview() {
            return this.$store.state.preview;
        },
        rows() {
            return this.$store.state.rows;
        },
        cols() {
            return this.$store.state.cols;
        },
        loaded() {
            return !!this.canvas;
        },
        pLength() {
            return this.dWidth / this.cols;
        },
        ctx() {
            return this.canvas.getContext('2d');
        }
    },
    watch: {
        animation(newVal) {
            if(!this.preview) {
                this.animate(newVal);
            }
        },
        preview(newVal) {
            if(newVal) {
                this.animate(newVal);
            }
            else {
                this.animate(this.animation);
            }
        },
        cols() {
            this.resizeCanvas();
        },
        rows() {
            this.resizeCanvas();
        }
    },
    mounted() {
        window.addEventListener('resize', this.resizeCanvas, false);
        this.canvas = document.getElementById('display');
        this.resizeCanvas();
    },
    destroyed() {
        window.removeEventListener('resize', this.resizeCanvas);
        clearInterval(this.interval);
    },
    methods: {
        //Animation
        animate(data) {
            this.frameIndex = 0;
            this.renderedFrame = {};
            clearInterval(this.interval);

            if(this.validateAnimation(data)) {
                if(data.frames.length === 1) {
                    this.renderedFrame = data.frames[0];
                    this.renderFrame(this.renderedFrame);
                }
                else {
                    this.interval = setInterval(() => {
                        if(this.frameIndex === 0) this.renderedFrame = {};
                        this.renderedFrame = Object.assign({}, this.renderedFrame, data.frames[this.frameIndex]);
                        this.renderFrame(this.renderedFrame);
                        this.frameIndex = (this.frameIndex + 1) % data.frames.length;
                    }, 1000 / data.fps);
                }
            }
            else if(!data) {
                this.clear();
                this.drawBoard();
            }           
            else {
                console.log('Something went wrong...', data);
            }
        },
        renderFrame(frame) {
            this.clear();
            this.drawBoard(frame);

            for(const [i, color] of Object.entries(frame)) {
                this.drawLed(i % this.cols, Math.floor(i / this.cols), color);
            }
        },

        //Shape drawing
        clear() {
            this.ctx.clearRect(0, 0, this.dWidth, this.dHeight);
        },
        drawBoard(frame) {
            this.drawRoundedRect(0, 0, this.dWidth, this.dHeight, this.pLength / 2, '#111117');
            for(let px = 0; px < this.cols; px++) {
                for(let py = 0; py < this.rows; py++) {
                    this.drawLed(px, py, frame[py * this.cols + px] || '#000');
                }
            }
        },
        drawLed(px, py, color) {
            this.drawCircle(this.getLedCoord(px), this.getLedCoord(py), this.pLength * .3, color);
        },
        drawRect(dx, dy, dw, dh, color) {
            this.ctx.fillStyle = color;
            this.ctx.fillRect(dx, dy, dw, dh);
        },
        drawRoundedRect(dx, dy, dw, dh, dr, color) {
            this.drawRect(dx, dy + dr, dw, dh - 2 * dr, color);
            this.drawRect(dx + dr, dy, dw - 2 * dr, dh, dr, color);
            this.drawCircle(dx + dr, dy + dr, dr, color);
            this.drawCircle(dx + dw - dr, dy + dr, dr, color);
            this.drawCircle(dx + dr, dy + dh - dr, dr, color);
            this.drawCircle(dx + dw - dr, dy + dh - dr, dr, color);
        },
        drawCircle(dx, dy, dr, color) {
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(dx, dy, dr, 0, 2 * Math.PI);
            this.ctx.fill();
        },
        getLedCoord(index) {
            return index * this.pLength + this.pLength / 2;
        },
        
        //Utilities
        resizeCanvas() {
            let width = this.canvas.parentElement.clientWidth;
            this.canvas.width = width;
            this.canvas.height = width * this.rows / this.cols;
            this.dWidth = width;
            this.dHeight = width * this.rows / this.cols;
            this.renderFrame(this.renderedFrame);
        },
        validateAnimation(data) {
            return data 
                && data.fps > 0 
                && data.frames.length > 0
                && data.rows === this.rows
                && data.cols === this.cols
        },
    },
}
</script>