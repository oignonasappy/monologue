const input = document.querySelector('#input');
const toggle037E = document.querySelector('#toggle-037E');
const toggleFF1B = document.querySelector('#toggle-FF1B');
const toggle204F = document.querySelector('#toggle-204F');

(() => {

    document.querySelector('#replace').addEventListener('click', update);

    document.querySelector('#copy').addEventListener('click', () => {
        navigator.clipboard.writeText(input.value);
    });

    document.querySelector('#clear').addEventListener('click', () => {
        input.value = "";
    });
    
})();

function update() {
    const SEMICOLONS = [';', ';', '；', '⁏'];
    
    const replaceSemicolons = [];
    
    if (toggle037E.checked) {
        replaceSemicolons.push(';');
    }
    if (toggleFF1B.checked) {
        replaceSemicolons.push('；');
    }
    if (toggle204F.checked) {
        replaceSemicolons.push('⁏');
    }
    if (replaceSemicolons.length === 0) {
        replaceSemicolons.push(';');
    }

    const arr = Array.from(input.value);

    for (let i = 0; i < arr.length; i++) {
        if (SEMICOLONS.includes(arr[i])) {
            arr[i] = replaceSemicolons[Math.floor(Math.random() * replaceSemicolons.length)];
        }
    }
    input.value = arr.join('');
}