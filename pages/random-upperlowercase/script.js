(() => {

    const input = document.querySelector('#input');

    input.addEventListener('change', update);
    input.addEventListener('keypress', update);

    document.querySelector('#copy').addEventListener('click', () => {
        navigator.clipboard.writeText(input.value);
    });
    
})();

function update() {
    const arr = Array.from(input.value);
    for (let i = 0; i < arr.length; i++) {
        if (Math.random() < 0.5) {
            arr[i] = arr[i].toLowerCase();
        } else {
            arr[i] = arr[i].toUpperCase();
        }
    }
    input.value = arr.join('');
}