/**
 * <input type="checkbox">要素の入った二次元配列を返します。
 * @returns {Array<Array<HTMLInputElement>>} matrix
 */
function getMatrix() {
    return [...document.getElementById('art').children] // 全ての.rowをArrayに展開
        .map(row =>
            [...row.children] // 全てのcheckboxをArrayに展開
                .filter(elem => elem.nodeName === "INPUT") // <input>要素のみを取得
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
            row.map(elem => elem.checked) // checked属性を読み、booleanに変換
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

    // HTMLとして表示している数値を取得する
    const height = parseInt(document.getElementById('height-number').textContent);
    const width = parseInt(document.getElementById('width-number').textContent);

    // 中身を空にする
    art.innerHTML = "";

    for (let i = 0; i < height; i++) {
        // .rowを生成
        const row = document.createElement('div');
        row.classList.add('row');

        for (let j = 0; j < width; j++) {
            // checkboxを生成
            const checkBox = document.createElement('input');
            checkBox.type = "checkbox";
            // bitMapからchecked属性を設定
            checkBox.checked = bitMap[i] != undefined && bitMap[i][j]
                ? true
                : false;
            row.appendChild(checkBox);
        }

        art.appendChild(row);
    }
    // サイズを表示
    updateSizeText();
}

/**
 * "n x n" 形式でサイズをHTMLに表示します。
 */
function updateSizeText() {
    // HTMLに表示されている値を実の値とする
    document.getElementById('size').textContent =
        document.getElementById('height-number').textContent
        + "x"
        + document.getElementById('width-number').textContent;
}

/**
 * [塗りつぶし文字種]のラジオボタンから選択された`value`(文字種)を返します。
 * @returns {string} 塗りつぶす文字の種類を表す文字列
 */
function getFillType() {
    // checked属性のあるラジオボタンのvalueを取得 
    return [...document.getElementsByName('fill')].filter(radio => radio.checked)[0].value;
}

/**
 * [空白文字種]のラジオボタンから選択された空白文字を返します。
 * @returns {string} 空白文字として使用する文字
 */
function getBlankChar() {
    // checked属性のあるラジオボタンのvalueを取得
    const checkedValue = [...document.getElementsByName('blank')].filter(radio => radio.checked)[0].value;
    return checkedValue === "any" // valueがanyの場合は、テキストを取得する
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
        // bitMapのtrueを入力されたテキストに、
        // falseを選択した空白文字に
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
        // bitMapのtrueをブロックに、
        // falseを選択した空白文字に
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
        /**
         * ビットフラグに対応する文字
         */
        const HOR_BLOCK_VALUES = [
            getBlankChar(), "\u2580", "\u2584", "\u2588",
        ];
        /**
         * 1文字中の位置に対するビットフラグ
         */
        const HOR_BLOCK_MAP = [
            1,
            2
        ];

        const charMatrix = [];
        for (let i1 = 0; i1 < bitMap.length / 2; i1++) { // 1文字分の領域だけ行を進める
            charMatrix.push([]); // 1行分の配列を初期化
            for (let j1 = 0; j1 < bitMap[i1].length; j1++) { // 1文字分の領域だけ列を進める(1列)
                let sum = 0; // ビットフラグを合計する
                for (let i2 = 0; i2 < 2; i2++) { // 1文字中の行を進める。列数は1なので進めない
                    // bitMapがtrueであればビットフラグを立てる
                    // 範囲外もしくはfalseであれば何もしない
                    sum += bitMap[i1 * 2 + i2] != undefined && bitMap[i1 * 2 + i2][j1]
                        ? HOR_BLOCK_MAP[i2]
                        : 0;
                }

                // ビットフラグが立っている形状が、そのUnicode文字の形となる
                charMatrix[i1].push(HOR_BLOCK_VALUES[sum]);
            }
        }

        // 列、行を結合する
        return charMatrix.map(row => row.join('')).join('\n');
    },

    /**
     * 1x2
     * 左右ブロック
     * @param {Array<Array<boolean>>} bitMap
     * @return {string} pixelArt
     */
    "ver-block": (bitMap) => {
        /**
         * ビットフラグに対応する文字
         */
        const VER_BLOCK_VALUES = [
            getBlankChar(), "\u258c", "\u2590", "\u2588",
        ];
        /**
         * 1文字中の位置に対するビットフラグ
         */
        const VER_BLOCK_MAP = [
            1, 2
        ];

        const charMatrix = [];
        for (let i1 = 0; i1 < bitMap.length; i1++) { // 1文字分の領域だけ行を進める(1行)
            charMatrix.push([]); // 1行分の配列を初期化
            for (let j1 = 0; j1 < bitMap[i1].length / 2; j1++) { // 1文字分の領域だけ列を進める
                let sum = 0; // ビットフラグを合計する
                for (let j2 = 0; j2 < 2; j2++) { // 1文字中の列を進める。行数は1なので進めない
                    // bitMapがtrueであればビットフラグを立てる
                    // 範囲外もしくはfalseであれば何もしない
                    sum += bitMap[i1] != undefined && bitMap[i1][j1 * 2 + j2]
                        ? VER_BLOCK_MAP[j2]
                        : 0;
                }

                // ビットフラグが立っている形状が、そのUnicode文字の形となる
                charMatrix[i1].push(VER_BLOCK_VALUES[sum]);
            }
        }

        // 列、行を結合する
        return charMatrix.map(row => row.join('')).join('\n');
    },

    /**
     * 2x2
     * 4分割ブロック
     * @param {Array<Array<boolean>>} bitMap
     * @return {string} pixelArt
     */
    "four-block": (bitMap) => {
        /**
         * ビットフラグに対応する文字
         */
        const FOUR_BLOCK_VALUES = [
            getBlankChar(), "\u2598", "\u259d", "\u2580",
            "\u2596", "\u258c", "\u259e", "\u259b",
            "\u2597", "\u259a", "\u2590", "\u259c",
            "\u2584", "\u2599", "\u259f", "\u2588"
        ];
        /**
         * 1文字中の位置に対するビットフラグ
         */
        const FOUR_BLOCK_MAP = [
            [1, 2],
            [4, 8],
        ];

        const charMatrix = [];
        for (let i1 = 0; i1 < bitMap.length / 2; i1++) { // 1文字分の領域だけ行を進める
            charMatrix.push([]); // 1行分の配列を初期化
            for (let j1 = 0; j1 < bitMap[i1].length / 2; j1++) { // 1文字分の領域だけ列を進める
                let sum = 0; // ビットフラグを合計する
                for (let i2 = 0; i2 < 2; i2++) { // 1文字中の行を進める
                    for (let j2 = 0; j2 < 2; j2++) { // 1文字中の列を進める
                        // bitMapがtrueであればビットフラグを立てる
                        // 範囲外もしくはfalseであれば何もしない
                        sum += bitMap[i1 * 2 + i2] != undefined && bitMap[i1 * 2 + i2][j1 * 2 + j2]
                            ? FOUR_BLOCK_MAP[i2][j2]
                            : 0;
                    }
                }

                // ビットフラグが立っている形状が、そのUnicode文字の形となる
                charMatrix[i1].push(FOUR_BLOCK_VALUES[sum]);
            }
        }

        // 列、行を結合する
        return charMatrix.map(row => row.join('')).join('\n');
    },

    /**
     * 3x2
     * 点字
     * @param {Array<Array<boolean>>} bitMap
     * @return {string} pixelArt
     */
    "braille": (bitMap) => {
        /**
         * 点字文字のUnicodeコードポイントの開始位置
         * 点字文字は2進数の規則的な配置になっているため、ビット対応表は不要である
         */
        const BRAILLE_OFFSET = 0x2800;
        /**
         * 1文字中の位置に対するビットフラグ
         */
        const BRAILLE_MAP = [
            [1, 8],
            [2, 16],
            [4, 32]
        ];

        const charMatrix = [];
        for (let i1 = 0; i1 < bitMap.length / 3; i1++) { // 1文字分の領域だけ行を進める
            charMatrix.push([]); // 1行分の配列を初期化
            for (let j1 = 0; j1 < bitMap[i1].length / 2; j1++) { // 1文字分の領域だけ列を進める
                let sum = 0; // ビットフラグを合計する
                for (let i2 = 0; i2 < 3; i2++) { // 1文字中の行を進める
                    for (let j2 = 0; j2 < 2; j2++) { // 1文字中の列を進める
                        // bitMapがtrueであればビットフラグを立てる
                        // 範囲外もしくはfalseであれば何もしない
                        sum += bitMap[i1 * 3 + i2] != undefined && bitMap[i1 * 3 + i2][j1 * 2 + j2]
                            ? BRAILLE_MAP[i2][j2]
                            : 0;
                    }
                }

                // すべてのビットフラグが空である⇒空白である
                if (sum != 0) {
                    // ビットフラグが立っている形状が、そのUnicode文字の形となる
                    charMatrix[i1].push(String.fromCodePoint(BRAILLE_OFFSET + sum));
                } else {
                    // 空白文字を挿入
                    charMatrix[i1].push(getBlankChar());
                }
            }
        }

        // 列、行を結合する
        return charMatrix.map(row => row.join('')).join('\n');
    },
    /**
     * 4x2
     * 漢点字
     * @param {Array<Array<boolean>>} bitMap
     * @return {string} pixelArt
     */
    "c-braille": (bitMap) => {
        /**
         * 点字文字のUnicodeコードポイントの開始位置
         * 点字文字は2進数の規則的な配置になっているため、ビット対応表は不要である
         */
        const BRAILLE_OFFSET = 0x2800;
        /**
         * 1文字中の位置に対するビットフラグ
         */
        const C_BRAILLE_MAP = [
            [1, 8],
            [2, 16],
            [4, 32],
            [64, 128]
        ];

        const charMatrix = [];
        for (let i1 = 0; i1 < bitMap.length / 4; i1++) { // 1文字分の領域だけ行を進める
            charMatrix.push([]); // 1行分の配列を初期化
            for (let j1 = 0; j1 < bitMap[i1].length / 2; j1++) { // 1文字分の領域だけ列を進める
                let sum = 0; // ビットフラグを合計する
                for (let i2 = 0; i2 < 4; i2++) { // 1文字中の行を進める
                    for (let j2 = 0; j2 < 2; j2++) { // 1文字中の列を進める
                        // bitMapがtrueであればビットフラグを立てる
                        // 範囲外もしくはfalseであれば何もしない
                        sum += bitMap[i1 * 4 + i2] != undefined && bitMap[i1 * 4 + i2][j1 * 2 + j2]
                            ? C_BRAILLE_MAP[i2][j2]
                            : 0;
                    }
                }

                // すべてのビットフラグが空である⇒空白である
                if (sum != 0) {
                    // ビットフラグが立っている形状が、そのUnicode文字の形となる
                    charMatrix[i1].push(String.fromCodePoint(BRAILLE_OFFSET + sum));
                } else {
                    // 空白文字を挿入
                    charMatrix[i1].push(getBlankChar());
                }
            }
        }

        // 列、行を結合する
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
            if (heightNumber > 1) { // 0以下にはならない
                heightNumberElement.textContent = heightNumber - 1; // 行数を減らす
                fillArtByBit(matrixToBit(getMatrix()));
            }
        })

    // 縦幅増加
    document.getElementById('height-increment')
        .addEventListener('click', () => {
            const heightNumberElement = document.getElementById('height-number');
            const heightNumber = parseInt(heightNumberElement.textContent);
            heightNumberElement.textContent = heightNumber + 1; // 行数を増やす
            fillArtByBit(matrixToBit(getMatrix()));
        })

    // 横幅減少
    document.getElementById('width-decrement')
        .addEventListener('click', () => {
            const widthNumberElement = document.getElementById('width-number');
            const widthNumber = parseInt(widthNumberElement.textContent);
            if (widthNumber > 1) { // 0以下にはならない
                widthNumberElement.textContent = widthNumber - 1; // 列数を減らす
                fillArtByBit(matrixToBit(getMatrix()));
            }
        })

    // 横幅増加
    document.getElementById('width-increment')
        .addEventListener('click', () => {
            const widthNumberElement = document.getElementById('width-number');
            const widthNumber = parseInt(widthNumberElement.textContent);
            widthNumberElement.textContent = widthNumber + 1; // 列数を増やす
            fillArtByBit(matrixToBit(getMatrix()));
        })

    // 左スライド
    document.getElementById('slide-left')
        .addEventListener('click', () => {
            fillArtByBit(
                matrixToBit(getMatrix())
                    .map(row => row.slice(1)) // 最左列を削除
            );
        });

    // 下スライド
    document.getElementById('slide-down')
        .addEventListener('click', () => {
            fillArtByBit(
                [[]].concat(matrixToBit(getMatrix())) // 空行を最上行に挿入
            );
        });

    // 上スライド
    document.getElementById('slide-up')
        .addEventListener('click', () => {
            fillArtByBit(
                matrixToBit(getMatrix())
                    .slice(1) // 最上行を削除
            );
        });

    // 右スライド
    document.getElementById('slide-right')
        .addEventListener('click', () => {
            fillArtByBit(
                matrixToBit(getMatrix())
                    .map(row => [false].concat(row)) // 空行を最左列に挿入
            );
        });

    // 縦に縮める
    document.getElementById('ver-shrink')
        .addEventListener('click', () => {
            const heightNumberElement = document.getElementById('height-number');
            heightNumberElement.textContent = Math.ceil(// 行数を半分にし切り上げ
                parseInt(heightNumberElement.textContent) / 2
            );
            fillArtByBit(
                matrixToBit(getMatrix()).filter((_, idx) => idx % 2 === 0) // 奇数行を削除
            );
        });

    // 縦に伸ばす
    document.getElementById('ver-stretch')
        .addEventListener('click', () => {
            const heightNumberElement = document.getElementById('height-number');
            if (parseInt(heightNumberElement.textContent) * 2 > 256) return; // 連打すると大変なので
            heightNumberElement.textContent = parseInt(heightNumberElement.textContent) * 2; // 行数を倍にする
            fillArtByBit(
                matrixToBit(getMatrix()).flatMap(row => [row, row]) // 行をその位置で複製する
            );
        });

    // 横に縮める
    document.getElementById('hor-shrink')
        .addEventListener('click', () => {
            const widthNumberElement = document.getElementById('width-number');
            widthNumberElement.textContent = Math.ceil(// 列数を半分にし切り上げ
                parseInt(widthNumberElement.textContent) / 2
            );
            fillArtByBit(
                matrixToBit(getMatrix()).map(row => row.filter((_, idx) => idx % 2 === 0)) // 奇数列を削除
            );
        });

    // 横に伸ばす
    document.getElementById('hor-stretch')
        .addEventListener('click', () => {
            const widthNumberElement = document.getElementById('width-number');
            if (parseInt(widthNumberElement.textContent) * 2 > 256) return; // 連打すると大変なので
            widthNumberElement.textContent = parseInt(widthNumberElement.textContent) * 2; // 列数を倍にする
            fillArtByBit(
                matrixToBit(getMatrix()).map(row => row.flatMap(col => [col, col])) // 列をその位置で複製する
            );
        });

    // 全消去
    document.getElementById('clear')
        .addEventListener('click', () => {
            fillArtByBit([[]]); // 空二次元配列
        });

    // インポートボタン、インポートファイル選択
    document.getElementById('import')
        .addEventListener('click', () => {
            document.getElementById('file-import').click(); // 機械的に<a>をクリック
        });

    // インポートファイル選択後、インポート処理
    document.getElementById('file-import')
        .addEventListener('change', (fileEvent) => {
            /**
             * @type {File} 選択されたファイル
             */
            const file = fileEvent.target.files[0];

            if (!file) return; // ファイルが存在するか

            const reader = new FileReader();
            reader.onload = (readerEvent) => { // ファイル解読処理
                try {
                    // jsonとして取得
                    const jsonString = readerEvent.target.result;
                    const json = JSON.parse(jsonString);
                    console.log("IMPORTED JSON:", json);

                    if (json.art == undefined) throw new Error('"art" property does not exist'); // 必須項目

                    if (json.height != undefined && typeof json.height === "number") {
                        document.getElementById('height-number').textContent = json.height;
                    }
                    if (json.width != undefined && typeof json.width === "number") {
                        document.getElementById('width-number').textContent = json.width;
                    }
                    if (json.fill != undefined) {
                        [...document.getElementsByName('fill')]
                            .filter(radio => radio.value === json.fill)[0].checked = true;
                    }
                    if (json["any-fill"] != undefined) {
                        document.getElementsByName('any-fill')[0].value = json["any-fill"];
                    }
                    if (json.blank != undefined) {
                        [...document.getElementsByName('blank')]
                            .filter(radio => radio.value === json.blank)[0].checked = true;
                    }
                    if (json["any-blank"] != undefined) {
                        document.getElementsByName('any-blank')[0].value = json["any-blank"];
                    }

                    // 結果を描写
                    fillArtByBit(json.art);
                } catch (error) {
                    window.alert("ファイルインポートに失敗しました\n" + error);
                }
            };
            // ファイル解読開始
            reader.readAsText(file);
        });

    // エクスポート
    document.getElementById('export')
        .addEventListener('click', () => {
            // 出力するJSONのデータを用意
            const json = {
                "height": parseInt(document.getElementById('height-number').textContent),
                "width": parseInt(document.getElementById('width-number').textContent),
                "fill": [...document.getElementsByName('fill')].filter(radio => radio.checked)[0].value,
                "any-fill": document.getElementsByName('any-fill')[0].value,
                "blank": [...document.getElementsByName('blank')].filter(radio => radio.checked)[0].value,
                "any-blank": document.getElementsByName('any-blank')[0].value,
                "art": matrixToBit(getMatrix())
            };
            const jsonString = JSON.stringify(json/*, undefined, 4*/); // オブジェクトを文字列に変換
            const blob = new Blob( // バイナリオブジェクトを生成
                [jsonString],
                { type: "application/json" }
            );
            // <a>にJSONをセット
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "unicode-pixelart.json";
            document.body.appendChild(a);
            // ダウンロードさせる
            a.click();
            // データを削除する
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        })

    // 生成
    document.getElementById('generate')
        .addEventListener('click', () => {
            // 行末の空白文字を削除するか
            if (document.getElementById('trim').checked) {
                document.getElementById('output')
                    .value = typeof fillPattern[getFillType()] === "function" // パターン生成関数が存在するか
                        ? fillPattern[getFillType()](matrixToBit(getMatrix())) // ラジオボタンで指定されたパターン生成関数にbitMapを渡す
                            .replaceAll(new RegExp(`${RegExp.escape(getBlankChar())}*$`, 'gm'), '') // 行末の指定された空白文字を除去
                        : "申し訳ないエラー"; // 関数が存在しなかった場合
            } else {
                document.getElementById('output')
                    .value = typeof fillPattern[getFillType()] === "function"
                        ? fillPattern[getFillType()](matrixToBit(getMatrix()))
                        : "申し訳ないエラー";
            }
        });

    // コピー
    document.getElementById('copy')
        .addEventListener('click', () => {
            // クリップボードに書き込み
            navigator.clipboard.writeText(
                document.getElementById('output').value
            );
        });
})();
