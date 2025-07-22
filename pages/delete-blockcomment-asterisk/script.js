const input = document.querySelector('#input');
const toggle = document.querySelector('#toggle');

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
    input.value = toggle.checked
        ? input.value.replaceAll(/^\s*\*\s*/gm, '')
        : input.value.replaceAll(/^\s*\*/gm, '');
}