export default {
    decode(dataBuffer) {
        if(!(dataBuffer instanceof ArrayBuffer)) throw 'Data is not of type ArrayBuffer';
        if(dataBuffer.byteLength < 5) throw 'Invalid ArrayBuffer length';

        let view = new Uint8Array(dataBuffer);
        let lengthView = new Uint16Array(dataBuffer.slice(0, 4));
        let byteLength = dataBuffer.byteLength;

        let width = lengthView[0];
        let height = lengthView[1];
        let fps = view[4];
        let frames = [];

        let byte = 5;
        while(byte < byteLength) {
            if(byte + 4 > byteLength) throw 'Invalid byte data';
            let frame = {};
            let numPixels = new Uint32Array(dataBuffer.slice(byte, byte + 4))[0];
            byte += 4;
            
            for(let pixel = 0; pixel < numPixels && byte < byteLength; pixel++, byte += 7) {
                if(byte + 7 > byteLength) throw 'Invalid byte data';
                let position = new Uint32Array(dataBuffer.slice(byte, byte + 4))[0];
                frame[position] = rgbToHex(view[byte + 4], view[byte + 5], view[byte + 6]);
            }
        }
        
        return {
            width,
            height,
            fps,
            frames
        }
    }
}

const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
}).join('');