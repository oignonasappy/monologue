const input = document.querySelector('#input');
const depth = document.querySelector('#depth');

(() => {

    document.querySelector('#process').addEventListener('click', update);

    document.querySelector('#copy').addEventListener('click', () => {
        navigator.clipboard.writeText(input.value);
    });

    document.querySelector('#clear').addEventListener('click', () => {
        input.value = "";
    });

})();

function update() {
    /**
     * @type {string}
     */
    const text = input.value;
    /**
     * @type {string[]}
     */
    const textArray = text.split('\n');

    let currentDepth = 0;
    const targetDepth = parseInt(depth.value);

    for (let i = 0; i < textArray.length; i++) {
        if (textArray[i].startsWith(" ")) {
            currentDepth = textArray[i].length - textArray[i].trimStart().length;
            break;
        }
    }

    let returnString = "";
    for (let i = 0; i < textArray.length; i++) {
        returnString += ' '
            .repeat(
                Math.floor(
                    (textArray[i].length - textArray[i].trimStart().length)
                    / currentDepth
                ) * targetDepth
            ) + textArray[i].trimStart()
            + '\n';
    }

    input.value = returnString.replace(/\n$/, '');
}
