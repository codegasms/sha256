/**
 * [codegasms-sha256]{@link https://github.com/codegasms/sha256.git}
 * 
 * @author VoiD [void@codegasms.com]
 * @copyright codegams, 2024
 * @license MIT
 */

// Using strict mode to enforce stricter syntax rules and better error handling
'use strict';

(function (helpers) {
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
    helpers.toUTF8String = function (str) {
        // function toUTF8String(str) {
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
    helpers.fromUTF8String = function (str) {
        // function fromUTF8String(str) {
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
}(window.helpers = window.helpers || {}));
