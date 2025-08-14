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
function matrixToBit(matrix) {
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
 * bitMapから#artのHTML要素を埋めます。
 * 縦幅・横幅はページに指定された幅に準拠します。
 * @param {Array<Array<boolean>>} bitMap
 */
function fillArtByBit(bitMap) {
    const art = document.getElementById('art');

    const height = parseInt(document.getElementById('height-number').textContent);
    const width = parseInt(document.getElementById('width-number').textContent);

    art.innerHTML = "";

    for (let i = 0; i < height; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        for (let j = 0; j < width; j++) {
            const checkBox = document.createElement('input');
            checkBox.type = "checkbox";
            checkBox.checked = bitMap[i] != undefined && bitMap[i][j]
                ? true
                : false;
            row.appendChild(checkBox);
        }
        art.appendChild(row);
    }
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
                    ? document.getElementsByName('any-fill')[0].value
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
     * 2x1
     * 上下ブロック
     * @param {Array<Array<boolean>>} bitMap
     * @return {string} pixelArt
     */
    "hor-block": (bitMap) => {
        const HOR_BLOCK_VALUES = [
            getBlankChar(), "\u2580", "\u2584", "\u2588",
        ];
        const HOR_BLOCK_MAP = [
            1,
            2
        ];

        const charMatrix = [];
        for (let i1 = 0; i1 < bitMap.length / 2; i1++) {
            charMatrix.push([]);
            for (let j1 = 0; j1 < bitMap[i1].length; j1++) {
                let sum = 0;
                for (let i2 = 0; i2 < 2; i2++) {
                    sum += bitMap[i1 * 2 + i2] != undefined && bitMap[i1 * 2 + i2][j1]
                        ? HOR_BLOCK_MAP[i2]
                        : 0;
                }

                charMatrix[i1].push(HOR_BLOCK_VALUES[sum]);
            }
        }

        return charMatrix.map(row => row.join('')).join('\n');
    },

    /**
     * 1x2
     * 左右ブロック
     * @param {Array<Array<boolean>>} bitMap
     * @return {string} pixelArt
     */
    "ver-block": (bitMap) => {
        const VER_BLOCK_VALUES = [
            getBlankChar(), "\u258c", "\u2590", "\u2588",
        ];
        const VER_BLOCK_MAP = [
            1, 2
        ];

        const charMatrix = [];
        for (let i1 = 0; i1 < bitMap.length; i1++) {
            charMatrix.push([]);
            for (let j1 = 0; j1 < bitMap[i1].length / 2; j1++) {
                let sum = 0;
                for (let j2 = 0; j2 < 2; j2++) {
                    sum += bitMap[i1] != undefined && bitMap[i1][j1 * 2 + j2]
                        ? VER_BLOCK_MAP[j2]
                        : 0;
                }

                charMatrix[i1].push(VER_BLOCK_VALUES[sum]);
            }
        }

        return charMatrix.map(row => row.join('')).join('\n');
    },

    /**
     * 2x2
     * 4分割ブロック
     * @param {Array<Array<boolean>>} bitMap
     * @return {string} pixelArt
     */
    "four-block": (bitMap) => {
        const FOUR_BLOCK_VALUES = [
            getBlankChar(), "\u2598", "\u259d", "\u2580",
            "\u2596", "\u258c", "\u259e", "\u259b",
            "\u2597", "\u259a", "\u2590", "\u259c",
            "\u2584", "\u2599", "\u259f", "\u2588"
        ];
        const FOUR_BLOCK_MAP = [
            [1, 2],
            [4, 8],
        ];

        const charMatrix = [];
        for (let i1 = 0; i1 < bitMap.length / 2; i1++) {
            charMatrix.push([]);
            for (let j1 = 0; j1 < bitMap[i1].length / 2; j1++) {
                let sum = 0;
                for (let i2 = 0; i2 < 2; i2++) {
                    for (let j2 = 0; j2 < 2; j2++) {
                        sum += bitMap[i1 * 2 + i2] != undefined && bitMap[i1 * 2 + i2][j1 * 2 + j2]
                            ? FOUR_BLOCK_MAP[i2][j2]
                            : 0;
                    }
                }

                charMatrix[i1].push(FOUR_BLOCK_VALUES[sum]);
            }
        }

        return charMatrix.map(row => row.join('')).join('\n');
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
    /**
     * 4x2
     * 漢点字
     * @param {Array<Array<boolean>>} bitMap
     * @return {string} pixelArt
     */
    "c-braille": (bitMap) => {
        const BRAILLE_OFFSET = 0x2800;
        const C_BRAILLE_MAP = [
            [1, 8],
            [2, 16],
            [4, 32],
            [64, 128]
        ];

        const charMatrix = [];
        for (let i1 = 0; i1 < bitMap.length / 4; i1++) {
            charMatrix.push([]);
            for (let j1 = 0; j1 < bitMap[i1].length / 2; j1++) {
                let sum = 0;
                for (let i2 = 0; i2 < 4; i2++) {
                    for (let j2 = 0; j2 < 2; j2++) {
                        sum += bitMap[i1 * 4 + i2] != undefined && bitMap[i1 * 4 + i2][j1 * 2 + j2]
                            ? C_BRAILLE_MAP[i2][j2]
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

/**
 * メインの手続き
 */
(() => {
    // 縦幅減少
    document.getElementById('height-decrement')
        .addEventListener('click', () => {
            const heightNumberElement = document.getElementById('height-number');
            const heightNumber = parseInt(heightNumberElement.textContent);
            if (heightNumber > 1) {
                heightNumberElement.textContent = heightNumber - 1;
                fillArtByBit(matrixToBit(getMatrix()));
            }
        })

    // 縦幅増加
    document.getElementById('height-increment')
        .addEventListener('click', () => {
            const heightNumberElement = document.getElementById('height-number');
            const heightNumber = parseInt(heightNumberElement.textContent);
            heightNumberElement.textContent = heightNumber + 1;
            fillArtByBit(matrixToBit(getMatrix()));
        })

    // 横幅減少
    document.getElementById('width-decrement')
        .addEventListener('click', () => {
            const widthNumberElement = document.getElementById('width-number');
            const widthNumber = parseInt(widthNumberElement.textContent);
            if (widthNumber > 1) {
                widthNumberElement.textContent = widthNumber - 1;
                fillArtByBit(matrixToBit(getMatrix()));
            }
        })

    // 横幅増加
    document.getElementById('width-increment')
        .addEventListener('click', () => {
            const widthNumberElement = document.getElementById('width-number');
            const widthNumber = parseInt(widthNumberElement.textContent);
            widthNumberElement.textContent = widthNumber + 1;
            fillArtByBit(matrixToBit(getMatrix()));
        })

    // 左スライド
    document.getElementById('slide-left')
        .addEventListener('click', () => {
            fillArtByBit(
                matrixToBit(getMatrix())
                    .map(row => row.slice(1))
            );
        });

    // 下スライド
    document.getElementById('slide-down')
        .addEventListener('click', () => {
            fillArtByBit(
                [[]].concat(matrixToBit(getMatrix()))
            );
        });

    // 上スライド
    document.getElementById('slide-up')
        .addEventListener('click', () => {
            fillArtByBit(
                matrixToBit(getMatrix())
                    .slice(1)
            );
        });

    // 右スライド
    document.getElementById('slide-right')
        .addEventListener('click', () => {
            fillArtByBit(
                matrixToBit(getMatrix())
                    .map(row => [false].concat(row))
            );
        });

    // 全消去
    document.getElementById('clear')
        .addEventListener('click', () => {
            fillArtByBit([[]]);
        });

    // インポートボタン、インポートファイル選択
    document.getElementById('import')
        .addEventListener('click', () => {
            // TODO:
        });

    // インポートファイル選択後、インポート処理
    document.getElementById('file-import')
        .addEventListener('change', () => {
            // TODO:
        });


    // エクスポート
    document.getElementById('export')
        .addEventListener('click', () => {
            const json = {
                "height": parseInt(document.getElementById('height-number').textContent),
                "width": parseInt(document.getElementById('width-number').textContent),
                "fill": [...document.getElementsByName('fill')].filter(radio => radio.checked)[0].value,
                "any-fill": [...document.getElementsByName('any-fill')][0].value,
                "blank": [...document.getElementsByName('blank')].filter(radio => radio.checked)[0].value,
                "any-blank": [...document.getElementsByName('any-blank')][0].value,
                "art": matrixToBit(getMatrix())
            };
            const jsonString = JSON.stringify(json/*, undefined, 4*/);
            const blob = new Blob(
                [jsonString],
                { type: "application/json" }
            );
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "unicode-pixelart.json";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        })

    // 生成
    document.getElementById('generate')
        .addEventListener('click', () => {
            document.getElementById('output')
                .value = typeof fillPattern[getFillType()] === "function"
                    ? fillPattern[getFillType()](matrixToBit(getMatrix()))
                    : "申し訳ないエラー";
        });

    // コピー
    document.getElementById('copy')
        .addEventListener('click', () => {
            navigator.clipboard.writeText(
                document.getElementById('output').value
            );
        });
})();
