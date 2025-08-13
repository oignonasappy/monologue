/**
 * <input type="checkbox">要素の入った二次元配列を返します。
 * @returns {Array<Array<HTMLInputElement>>} matrix
 */
function getMatrix() {
    return [...document.getElementById('art').children].map(row => [...row.children]);
}

/**
 * <input type="checkbox">要素の入った二次元配列をboolean配列に変換して返します。
 * @param {Array<Array<HTMLInputElement>>} matrix
 * @returns {Array<Array<boolean>>} bitMap
 */
function toBit(matrix) {
    return matrix.map(row => row.map(elem => elem.checked))
}

/**
 * boolean配列をデバッグ表示します。
 * @param {Array<Array<boolean>>} bitMap 
 */
function logBit(bitMap) {
    console.log(bitMap.map(row => row.map(elem => elem ? '䷀' : '䷁').join('')).join('\n'));
    
}

logBit(toBit(getMatrix()));
