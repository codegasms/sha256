# SHA-256 Algorithm

## Usage

```javascript
    const hashString = require('@codegasms/sha256');

    const message = 'Hello World';
    
    const hashedMessageHex = hashString(message, 'hex');
    const hashedMessageBinary = hashString(message, 'binary');
    const hashedMessageBase64 = hashString(message, 'base64');
```

## Unicode Codepoint To UTF-8 Conversion

```Unicode``` is represented as ```U+XXXX```, where ```XXXX``` is a hexadecimal number. ```UTF-8``` is a direct mapping of the unicode characters i.e. Encoding format of Unicode characters in one-byte units, hence the suffix ```-8```, more specifically it is a conversion of a codepoint into a set of one to four bytes.

1. **Range 1 : 0xxxxxxx**

    Out of the available 8-bits, 1-bit is reserved to show that this is of Type-1 UTF-8 i.e. one-byte encoding. The rest of the bits i.e. 7-bits can be used to map $2^7 = 128$ numbers.

    _e.g._ ```U+0047``` (Unicode of A i.e ASCII "A") is mapped as [0 1 0 0 0 0 0 1]

    > This contains the mappings of ASCII characters (0-127)

2. **Range 2 : 110xxxxx 10xxxxxx**

    Out of the available 16-bits, first 3-bits of the first byte are reserved to show that this is of Type-2 UTF-8 i.e. two-byte encoding. This is shown by using two 1s and a 0. The first 2-bits of the second byte are also reserved to denote the same thing. To avoid ambiguity in memory access, both the bytes have some reserved bits to denote the type of UTF-8 range. The rest of the bits i.e. 5-bits from the first byte and the 6-bits from the second byte can be used to map $2^{(5+6)} = 2^{11} = 2048$ numbers.

    _e.g._ ```U+00B9``` (Unicode of $^1$ i.e. Superscript "1") is mapped as [1 1 0 0 0 0 1 0] [1 0 1 1 1 0 0 1]

    > This contains the mappings of unicode characters (128-2047)

3. **Range 3 : 1110xxxx 10xxxxxx 10xxxxxx**

    Out of the available 24-bits, first 4-bits of the first byte are reserved to show that this is of Type-3 UTF-8 i.e. three-byte encoding. This is shown by using three 1s and a 0. The first 2-bits of the second byte and third byte are also reserved to denote the same thing. To avoid ambiguity in memory access, all the bytes have some reserved bits to denote the type of UTF-8 range. The rest of the bits i.e. 5-bits from the first byte and the 6-bits from the second byte & third byte can be used to map $2^{(4+6+6)} = 2^{16} = 65536$ numbers.

    _e.g._ ```U+2070``` (Unicode of $^0$ i.e. Superscript "0") is mapped as [1 1 1 0 0 0 1 0] [1 0 0 0 0 0 0 1] [1 0 1 1 0 0 0 0]

    > This contains the mappings of unicode characters (2048-65535)

4. **Range 4 : 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx**

    Out of the available 32-bits, first 5-bits of the first byte are reserved to show that this is of Type-4 UTF-8 i.e. four-byte encoding. This is shown by using four 1s and a 0. The first 2-bits of the second byte, third byte and fourth byte are also reserved to denote the same thing. To avoid ambiguity in memory access, all the bytes have some reserved bits to denote the type of UTF-8 range. The rest of the bits i.e. 5-bits from the first byte and the 6-bits from the second byte, third byte & fourth byte can be used to map $2^{(3+6+6+6)} = 2^{21} = 2097152$ numbers.

    > This contains the mappings of unicode characters (65536-2097151),  but we have not yet reached the upper-bound yet. Range 4 is (65536-1114111) as of today. _(Discalimer : This data is prone to changes on a regular basis, check the Unicode website for more information)_

```javascript
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
        throw new Error('Invalid Unicode Codepoint received : Out Of UTF-8 Range');
    }
}
```

## String To UTF-8 & UTF-8 To String

Using this logic one can simply build 2 conversion functions i.e.

1. **UTF-8 To String**

```javascript
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
```

2. **String To UTF-8**

```javascript
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
```

## Explaining The SHA-256

### Preprocessing

Preprocessing needs to be done before implementing the SHA-256 algorithm. The preprocessing consists of 3 steps :

1. Padding The Message (To ensure that the message length is a ```multiple of 512-bits```)
2. Parsing The Message into Message blocks (Entire message is broken down into ```n blocks``` of size 512-bits each, and SHA-256 runs ```n iterations``` to compute the ```Hashed Value```)
3. Setting The Initial Hash Value (Defined as ```"The 32-bit fractional part of square root of first 8 prime numbers"```)

#### Padding the Message

> The Message :
>
> 512-bits message = UTF-8 Encoding + 1 {Mark the start of padding hereafter} + padding {0000...000} + length(UTF-8 Encoding) {64-bits reserved}

To create the padded message, we need to add 2 paddings :

1. Zero padding after '1' and before start of length

    ```javascript
        let zeroPadding = '0'.repeat(512 - (message.length + 1 + 64) % 512);
    ```

2. Zero padding to make length = 64-bit

    ```javascript
        let lengthPadding = '0'.repeat(64 - message.length.toString(2).length);
    ```

#### Parsing the Message

For SHA-256, the padded message is parsed into N 512-bit blocks, M(1) ...  M(N). Since the ```512-bits``` of the input block may be expressed as ```sixteen 32-bit words```, the first 32-bits of message block i are denoted M(0)i , the next 32 bits are M(1)i , and so on up to M(15)i.

> Clever way is to use RegEx to parse the message
>
> 1. Divide into blocks of 512-bits first
>
```javascript
    let blocks = [];

    for (let i = 0; i < message.length; i += 512) {
        blocks.push(message.slice(i, i + 512));
    }
```
>
> 2. Divide each blocks into sizteen 32-bits words
>
```javascript
    return blocks.map((x) => {
        let chunks = [];

        let j = 0;
        for (let i = 0; i < x.length; i += 32) {
            chunks.push(x.slice(i, i + 32));
        }
    });
```

#### Setting up the Initial Hash Values

These Hash Values were obtained by taking the ```first 32-bits``` of the ```fractional parts``` of the ```square roots``` of the ```first 8 prime numbers```.

```javascript
const H = [
    0x6a09e667,
    0xbb67ae85,
    0x3c6ef372,
    0xa54ff53a,
    0x510e527f,
    0x9b05688c,
    0x1f83d9ab,
    0x5be0cd19
];
```

### Hash Computation

#### Operations In SHA-256

There are some predefined operations in SHA-256 algorithm which are :

1. Ch(x, y, z) - Choose : y if x is set else z

    ```javascript
    function Choose(x, y, z) {
        return (x & y) ^ (~x & z);
    };
    ```

2. Maj(a, b, c) - Majority : max(frequency(1) in (a,b,c), frequency(0) in (a,b,c))

    ```javascript
    function Majority(x, y, z) {
        return (x & y) ^ (x & z) ^ (y & z);
    };
    ```

3. Σ0(x) - Sigma0 : Rotates the number to the right by 2, 13, and 22 bits and then XORs the result

    ```javascript

    function Sigma0(x) {
        return rightRotate(x, 2, 32) ^ rightRotate(x, 13, 32) ^ rightRotate(x, 22, 32);
    };
    ```

4. Σ1(x) - Sigma1 : Rotates the number to the right by 6, 11, and 25 bits and then XORs the result

    ```javascript

    function Sigma1(x) {
        return rightRotate(x, 6, 32) ^ rightRotate(x, 11, 32) ^ rightRotate(x, 25, 32);
    };
    ```

5. σ0(x) - sigma0 : Rotates the number to the right by 7, 18, and shifts to the right by 3 bits and then XORs the result

    ```javascript

    function sigma0(x) {
        return rightRotate(x, 7, 32) ^ rightRotate(x, 18, 32) ^ (x >>> 3);
    }
    ```

6. σ1(x) - sigma1 : Rotates the number to the right by 17, 19, and shifts to the right by 10 bits and then XORs the result

    ```javascript6. σ1(x) - sigma1 : Rotates the number to the right by 17, 19, and shifts to the right by 10 bits and then XORs the result

    function sigma1(x) {
        return rightRotate(x, 17, 32) ^ rightRotate(x, 19, 32) ^ (x >>> 10);
    }
    ```

> Each Message Block, M(1) ... M(N), is processed in order, following the steps:
>
> 1. Prepare Message Schedule
> 2. Initialize Working Variables
> 3. Find State of Variables at each Iteration and,
> 4. Compute New $i^{th}$ Hash Values
>
> After ```N iterations```, concatenate ```H0 ... H7``` i.e. ```H0 || H1 || H2 || H3 || H4 || H5 || H6 || H7``` to obtain the ```SHA-256 Hash```.

#### Prepare the Message Schedule

Perform the following operation:

$messageSchedule[i] =
\begin{cases}
    parsedMessage[i] & \text{if } 0 \leq i \leq 15 \\
    \sigma_1(messageSchedule[i - 2]) + messageSchedule[i - 7] + \sigma_0(messageSchedule[i - 15]) + messageSchedule[i - 16] & \text{if } 16 \leq i \leq 63
\end{cases}$

```javascript
let messageSchedule = [];

for (let t = 0; t < 64; t++) {
    if (t <= 15) {
        messageSchedule[t] = parsedMesssage[i][t];
    } else {
        messageSchedule[t] = (sigma1(messageSchedule[t - 2]) + messageSchedule[t - 7] + sigma0(messageSchedule[t - 15]) + messageSchedule[t - 16]) % Math.pow(2, 32);
    }
}
```

#### Initialize Working Variables

Initialize 8 working variables ```a, b, c, d, e, f, g and h``` with $(i - 1)th$ hash value.

```shell
a = H0(i)
b = H1(i)
c = H2(i)
d = H3(i)
e = H4(i)
f = H5(i)
g = H6(i)
h = H7(i)
```

#### Find the State of Variables

Iterate in the ```Message Schedules``` and perform the following operations:

```shell
T1 = h + Σ1(a) + Ch(e, f, g) + K[i] + mwssageSchedule[i]
T2 = Σ0(a) + Maj(a, b, c)
h = g
g = f
f = e
e = d + T1
d = c
c = b
b = a
a = T1 + T2
```

```javascript
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
```

#### Compute New $i^{th}$ Hash Values

Compute the $i^{th}$ immediate hash value by performing the following operations:

```shell
H0(i) = a + H0(i - 1)
H1(i) = b + H1(i - 1)
H2(i) = c + H2(i - 1)
H3(i) = d + H3(i - 1)
H4(i) = e + H4(i - 1)
H5(i) = f + H5(i - 1)
H6(i) = g + H6(i - 1)
H7(i) = h + H7(i - 1)
```

#### Final Result

After completing ```N iterations```, the resulting ```256-bits Message Digest``` of the message is :

$H0(N) | H1(N) | H2(N) | H3(N) | H4(N) | H5(N) | H6(N) | H7(N)$
