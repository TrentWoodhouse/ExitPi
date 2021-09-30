const { $Font } = require('bdfparser');
const getline = require('readlineiter');

//Let raspberry pi set this later
let COLS = 64;
let ROWS = 32;

class TextController {
	constructor(io, socket) {
		this.io = io;
		this.socket = socket;
        this.font = null;

        this.socket.on('preview_text', data => {
            this.generateFrames(data)
            .then(frames => {
                socket.emit('set_preview', {
                    rows: ROWS,
                    cols: COLS,
                    fps: data.speed < 50 ? data.speed : Math.floor(data.speed / 2),
                    frames,
                })
            })
        });
    
        this.socket.on('post_text', data => {
            io.emit('set_animation', null)        
        })
	}

    async generateFrames(data) {
        let frames = [];

        //Sets font and validates text (removes unknown characters)
        this.font = this.font || await $Font(getline('./assets/font.bdf'));
        let missingCharacters = this.font.lacksglyphs(data.text);
        for(let c of missingCharacters || []) {
            data.text = data.text.replace(c, '');
        }

        //Set cursor position off to right of screen to begin drawing text
        let cursor = {
            x: COLS,
            y: Math.floor((ROWS - this.font.glyph(' ').draw(1).height()) / 2),
        }

        //Get total length of text
        let textLength = data.text.split('').reduce((acc, cur) => acc + this.font.glyph(cur).draw(1).width() - 1, 0) + 1;

        //Move text from offscreen righ tto offscreen left
        for(let i = 0; i < textLength + COLS; data.speed < 50 ? i++ : i+=2) {
            cursor.x = COLS - i;
            let frame = {};
            if(frames.length > 0) {
                let lastFrame = frames.slice(-1)[0];
                for(let key of Object.keys(lastFrame)) {
                    if(lastFrame[key] !== '#000') {
                        frame[key] = '#000';
                    }
                }
            }

            //Loop through all letters
            for(let j = 0; j < data.text.length; j++) {
                let bitmap = this.font.glyph(data.text[j]).draw(1);
                if(cursor.x > -(COLS / 4) || cursor.x < COLS * 1.25) {

                    //Draw letter
                    for(let x = 0; x < bitmap.width(); x++) {
                        for(let y = 0; y < bitmap.height(); y++) {
                            if(bitmap.bindata[y][x] === '1'){
                                let drawX = cursor.x + x;
                                let drawY = cursor.y + y;
                                if(drawY >= 0 && drawY < ROWS
                                    && drawX >= 0 && drawX < COLS) {
                                    frame[drawY * 64 + drawX] = data.color.hex || data.color;
                                }
                            }
                        }
                    }
                }
                cursor.x += bitmap.width() - 1;       
            }
            frames.push(frame);
        }
        
        //Extra animation frames on the end for dramatic effect
        for(let i = 0; i < 10; i++) {
            frames.push({});
        }

        return frames;
    }
}

module.exports = { TextController };
