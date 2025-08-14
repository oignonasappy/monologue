/**
 * <input type="checkbox">要素の入った二次元配列を返します。
 * @returns {Array<Array<HTMLInputElement>>} matrix
 */
function getMatrix() {
    return [...document.getElementById('art').children]
        .map(row =>
            [...row.children]
                .filter(elem => elem.nodeName === "INPUT")
        );
}

/**
 * <input type="checkbox">要素の入った二次元配列をboolean配列に変換して返します。
 * @param {Array<Array<HTMLInputElement>>} matrix
 * @returns {Array<Array<boolean>>} bitMap
 */
function toBit(matrix) {
    return matrix
        .map(row =>
            row.map(elem => elem.checked)
        )
}

/**
 * boolean配列をデバッグ表示します。
 * @param {Array<Array<boolean>>} bitMap 
 */
function logBit(bitMap) {
    console.log(bitMap.map(row => row.map(elem => elem ? '䷀' : '䷁').join('')).join('\n'));
}

/**
 * [塗りつぶし文字種]のラジオボタンから選択された`value`(文字種)を返します。
 * @returns {string} 塗りつぶす文字の種類を表す文字列
 */
function getFillType() {
    return [...document.getElementsByName('fill')].filter(radio => radio.checked)[0].value;
}

/**
 * [空白文字種]のラジオボタンから選択された空白文字を返します。
 * @returns {string} 空白文字として使用する文字
 */
function getBlankChar() {
    const checkedValue = [...document.getElementsByName('blank')].filter(radio => radio.checked)[0].value;
    return checkedValue === "any"
        ? document.getElementsByName('any-blank')[0].value
        : checkedValue;
}

/**
 * bitMapをpixelArt文字列に変換する関数群を定義します
 */
const fillPattern = {
    /**
     * 1x1
     * 自由
     * @param {Array<Array<boolean>>} bitMap
     * @return {string} pixelArt
     */
    "any": (bitMap) => {
        return bitMap.map(row =>
            row.map(pixel =>
                pixel
                    ? document.getElementsByName('any-blank')[0].value
                    : getBlankChar()
            ).join('')
        ).join('\n');
    },

    /**
     * 1x1
     * ブロック
     * @param {Array<Array<boolean>>} bitMap
     * @return {string} pixelArt
     */
    "block": (bitMap) => {
        return bitMap.map(row =>
            row.map(pixel =>
                pixel
                    ? '\u2588'
                    : getBlankChar()
            ).join('')
        ).join('\n');
    },

    /**
     * 3x2
     * 点字
     * @param {Array<Array<boolean>>} bitMap
     * @return {string} pixelArt
     */
    "braille": (bitMap) => {
        const BRAILLE_OFFSET = 0x2800;
        const BRAILLE_MAP = [
            [1, 8],
            [2, 16],
            [4, 32]
        ];

        const charMatrix = [];
        for (let i1 = 0; i1 < bitMap.length / 3; i1++) {
            charMatrix.push([]);
            for (let j1 = 0; j1 < bitMap[i1].length / 2; j1++) {
                let sum = 0;
                for (let i2 = 0; i2 < 3; i2++) {
                    for (let j2 = 0; j2 < 2; j2++) {
                        sum += bitMap[i1 * 3 + i2] != undefined && bitMap[i1 * 3 + i2][j1 * 2 + j2]
                            ? BRAILLE_MAP[i2][j2]
                            : 0;
                    }
                }

                if (sum != 0) {
                    charMatrix[i1].push(String.fromCodePoint(BRAILLE_OFFSET + sum));
                } else {
                    charMatrix[i1].push(getBlankChar());
                }
            }
        }

        return charMatrix.map(row => row.join('')).join('\n');
    },
};

document.getElementById('generate')
    .addEventListener('click', () => {
        document.getElementById('output')
            .value = typeof fillPattern[getFillType()] === "function"
                ? fillPattern[getFillType()](toBit(getMatrix()))
                : "申し訳ないエラー";
    });

document.getElementById('copy')
    .addEventListener('click', () => {
        navigator.clipboard.writeText(
            document.getElementById('output').value
        );
    });

logBit(toBit(getMatrix()));