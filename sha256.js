/**
 * [codegasms-sha256]{@link https://github.com/codegasms/sha256.git}
 * 
 * @author VoiD [void@codegasms.com]
 * @copyright codegams, 2024
 * @license MIT
 */

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

