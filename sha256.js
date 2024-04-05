/**
 * [codegasms-sha256]{@link https://github.com/codegasms/sha256.git}
 * 
 * @author VoiD [void@codegasms.com]
 * @copyright codegams, 2024
 * @license MIT
 */

// TODO : Convert the binray string into Uint32Array

// Using strict mode to enforce stricter syntax rules and better error handling
'use strict';

/**
 * Converts Binary Unicode Codepoint into Binary UTF-8 string
 * Unicode is represented as U+XXXX where XXXX is the hexadecimal codepoint
 * Convert the codepoint to respective ary-byte depending on the lenght of the codepoint
 * @param {number} codepoint - Unicode Codepoint as a number
 * @returns {string} - UTF-8 string for the given unicode codepoint
 */
function unicodeToUtf8Binary(codepoint) {
    const str = codepoint.toString(2);      // Converts to base-2 binary string
    const length = str.length;              // Length of the binary string

    // Range 1 : 0xxxxxxx
    if (length <= 7) {
        return `0${'0'.repeat(7 - length)}${str}`;
    }

    // Range 2 : 110xxxxx 10xxxxxx
    else if (length <= 11) {
        return `110${'0'.repeat(11 - length)}${str.slice(0, -6)} 10${str.slice(-6)}`;
    }

    // Range 3 : 1110xxxx 10xxxxxx 10xxxxxx
    else if (length <= 16) {
        return `1110${'0'.repeat(16 - length)}${str.slice(0, -12)} 10${str.slice(-12, -6)} 10${str.slice(-6)}`;
    }

    // Range 4 : 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
    else if (length <= 21) {
        return `11110${'0'.repeat(21 - length)}${str.slice(0, -18)} 10${str.slice(-18, -12)} 10${str.slice(-12, -6)} 10${str.slice(-6)}`;
    }

    // Out Of Range
    else {
        throw new Error('Unicode Codepoint out of range');
    }
}

/**
 * Converts any human-readable string to UTF-8 string
 * @param {string} str - Human-readbale string to be converted to UTF-8 
 * @returns {string} - UTF-8 string for the given unicode string
 */
function toUTF8String(str) {
    let utf8StringArray = [];

    for (let symbol of str) {
        const codepoint = symbol.codePointAt(0);
        utf8StringArray.push(unicodeToUtf8Binary(codepoint));
    };

    return utf8StringArray.join(' ');
};

/**
 * Converts UTF-8 string to human-readable string
 * @param {string} str - UTF-8 string to be converted to human-readable string 
 * @returns {string} - Human-readable string for the given UTF-8 string
 */
function fromUTF8String(str) {
    let utf8StringArray = str.split(' ');
    let output = [];

    let i = 0;
    while (i < utf8StringArray.length) {
        // Range 1 : 0xxxxxxx
        if (utf8StringArray[i].startsWith('0')) {
            let unit = utf8StringArray.slice(i, i + 1).join('');
            let codepoint = parseInt(unit.slice(1), 2);
            output.push(String.fromCodePoint(codepoint));
            i += 1;
        }

        // Range 2 : 110xxxxx 10xxxxxx
        else if (utf8StringArray[i].startsWith('110')) {
            let unit = utf8StringArray.slice(i, i + 2).join('');
            let codepoint = parseInt(unit.slice(3, 8) + unit.slice(11), 2);
            output.push(String.fromCodePoint(codepoint));
            i += 2;
        }

        // Range 3 : 1110xxxx 10xxxxxx 10xxxxxx
        else if (utf8StringArray[i].startsWith('1110')) {
            let unit = utf8StringArray.slice(i, i + 3).join('');
            let codepoint = parseInt(unit.slice(4, 8) + unit.slice(11, 17) + unit.slice(20), 2);
            output.push(String.fromCodePoint(codepoint));
            i += 3;
        }

        // Range 4 : 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
        else if (utf8StringArray[i].startsWith('11110')) {
            let unit = utf8StringArray.slice(i, i + 4).join('');
            let codepoint = parseInt(unit.slice(5, 8) + unit.slice(11, 17) + unit.slice(20, 26) + unit.slice(29), 2);
            output.push(String.fromCodePoint(codepoint));
            i += 4;
        }

        else {
            throw new Error('Invalid UTF-8 string');
        }
    }

    return output.join('');
};

const H0 = [
    0x6a09e667,
    0xbb67ae85,
    0x3c6ef372,
    0xa54ff53a,
    0x510e527f,
    0x9b05688c,
    0x1f83d9ab,
    0x5be0cd19
];

const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

/**
 * Rotates the number to the right by the given number of bits
 * @param {number} num - Number to be rotated
 * @param {number} shift - Number of bits to rotate 
 * @param {string} bits - Bit notation width (Length of the output in bits) : Defaults to the length of the number in bits  
 * @returns {number} - Rotated number
 */
function rightRotate(num, shift, bits) {
    if (!bits) {
        var bits = num.toString(2).length;
    }
    shift = shift % bits;

    // >>> means 0 fill shift right i.e. Logical right shift
    // Math.pow(2, bits) is used to convert the result to x-bit integer, where x = bits
    return (((num >>> shift) | (num << bits - shift)) >>> 0) % Math.pow(2, bits);
}

/**
 * Rotates the number to the left by the given number of bits
 * @param {number} num - Number to be rotated
 * @param {number} shift - Number of bits to rotate 
 * @returns {number} - Rotated number
 */
function leftRotate(num, shift) {
    var bits = num.toString(2).length;
    shift = shift % bits;

    // >>> means 0 fill shift right i.e. Logical right shift
    // Math.pow(2, bits) is used to convert the result to x-bit integer, where x = bits
    return (((num << shift) | (num >>> bits - shift)) >>> 0) % Math.pow(2, bits);
}

/**
 * SHA-256 Functions
 * @function Ch - Choose : y if x is set else z
 * @function Maj - Majority : max(frequency(1) in (a,b,c), frequency(0) in (a,b,c))
 * @function Sigma0 - Σ0 : Rotates the number to the right by 2, 13, and 22 bits and then XORs the result
 * @function Sigma1 - Σ1 : Rotates the number to the right by 6, 11, and 25 bits and then XORs the result
 * @function sigma0 - σ0 : Rotates the number to the right by 7, 18, and shifts to the right by 3 bits and then XORs the result
 * @function sigma1 - σ1 : Rotates the number to the right by 17, 19, and shifts to the right by 10 bits and then XORs the result
 */

function Choose(x, y, z) {
    return (x & y) ^ (~x & z);
};

function Majority(x, y, z) {
    return (x & y) ^ (x & z) ^ (y & z);
};

function Sigma0(x) {
    return rightRotate(x, 2, 32) ^ rightRotate(x, 13, 32) ^ rightRotate(x, 22, 32);
};

function Sigma1(x) {
    return rightRotate(x, 6, 32) ^ rightRotate(x, 11, 32) ^ rightRotate(x, 25, 32);
};

function sigma0(x) {
    return rightRotate(x, 7, 32) ^ rightRotate(x, 18, 32) ^ (x >>> 3);
}

function sigma1(x) {
    return rightRotate(x, 17, 32) ^ rightRotate(x, 19, 32) ^ (x >>> 10);
}

/**
 * Pads the message to make it a 512-bit block
 * @param {string} message - The message (Binary string)
 * @returns {string} - Padded message
 */
function padding(message) {
    message = message.split(' ').join('');

    if (message.length > Math.pow(2, 64)) {
        throw new Error('Message is too long');
    }

    let zeroPadding = '0'.repeat(512 - (message.length + 1 + 64) % 512);
    let lengthPadding = '0'.repeat(64 - message.length.toString(2).length);

    return `${message}1${zeroPadding}${lengthPadding}${message.length.toString(2)}`;
};

/**
 * Parse the message into N blocks of 512-bits each
 * Further parses each blocks into arrays of sixteen 32-bits words
 * @param {string} message - The message (Binary string)
 * @returns {string} - Parsed message
 */
function parse(message) {
    let blocks = [];

    for (let i = 0; i < message.length; i += 512) {
        blocks.push(message.slice(i, i + 512));
    }

    return blocks.map((x) => {
        let chunks = [];

        let j = 0;
        for (let i = 0; i < x.length; i += 32) {
            chunks.push(x.slice(i, i + 32));
        }

        return chunks.map((x) => {
            return parseInt(x, 2)
            // return x;
        });
    });
};

/**
 * SHA-256 Hashing
 * @param {string} message - Message to be hashed (In Binary)
 * @returns {string} - Hashed Message
 */
function hashSHA256(message) {
    // Preprocessing
    let parsedMesssage = parse(padding(message));

    // Hash Initialization
    let H = [H0];

    // Computing Hash
    let length = parsedMesssage.length;

    for (let i = 0, N = parsedMesssage.length; i < N; i++) {
        // Message Schedule
        let messageSchedule = [];

        for (let t = 0; t < 64; t++) {
            if (t <= 15) {
                messageSchedule[t] = parsedMesssage[i][t];
            } else {
                messageSchedule[t] = (sigma1(messageSchedule[t - 2]) + messageSchedule[t - 7] + sigma0(messageSchedule[t - 15]) + messageSchedule[t - 16]) % Math.pow(2, 32);
            }
        }

        // Working Variables
        let a = H[i][0];
        let b = H[i][1];
        let c = H[i][2];
        let d = H[i][3];
        let e = H[i][4];
        let f = H[i][5];
        let g = H[i][6];
        let h = H[i][7];
        let T1;
        let T2;

        // Find State of Variables
        for (let t = 0; t < 64; t++) {
            T1 = (h + Sigma1(e) + Choose(e, f, g) + K[t] + messageSchedule[t]) % Math.pow(2, 32);
            T2 = (Sigma0(a) + Majority(a, b, c)) % Math.pow(2, 32);
            h = g;
            g = f;
            f = e;
            e = (d + T1) % Math.pow(2, 32);
            d = c;
            c = b;
            b = a;
            a = (T1 + T2) % Math.pow(2, 32);
        }

        // Compute ith Intermediate Hash
        H[i + 1] = [];
        H[i + 1][0] = (a + H[i][0]) % Math.pow(2, 32);
        H[i + 1][1] = (b + H[i][1]) % Math.pow(2, 32);
        H[i + 1][2] = (c + H[i][2]) % Math.pow(2, 32);
        H[i + 1][3] = (d + H[i][3]) % Math.pow(2, 32);
        H[i + 1][4] = (e + H[i][4]) % Math.pow(2, 32);
        H[i + 1][5] = (f + H[i][5]) % Math.pow(2, 32);
        H[i + 1][6] = (g + H[i][6]) % Math.pow(2, 32);
        H[i + 1][7] = (h + H[i][7]) % Math.pow(2, 32);
    }

    let digestWords = H[parsedMesssage.length];
    let digestTemp = digestWords.map((x) => {
        let hex = (x >>> 0).toString(16);
        return `${'0'.repeat(8 - hex.length)}${hex}`;
    });

    return digestTemp.join('');
}

/**
 * Converts a String into SHA-256 Hash
 * @param {string} message - Message to be Hashed (In Human-Readable Strings)
 * @returns {string} - SHA-256 Hashed Message
 */
function hashString(message) {
    return hashSHA256(toUTF8String(message));
}

export default hashString;