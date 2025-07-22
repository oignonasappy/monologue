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
    const arr = new Array();
    return toggle.checked
        ? input.value.replaceAll(/^\s*\*\s*/, '')
        : input.value.replaceAll(/^\s*\*/, '');
}