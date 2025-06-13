(() => {

    const input = document.querySelector('#input');

    input.addEventListener('change', update);
    input.addEventListener('keypress', update);

    document.querySelector('#copy').addEventListener('click', () => {
        navigator.clipboard.writeText(input.value);
    });

    document.querySelector('#clear').addEventListener('click', () => {
        input.value = "";
    });
    
})();

function update() {
    const arr = Array.from(input.value);
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === "<") {
            arr[i] = "&lt;";
        } else if(arr[i] === ">") {
            arr[i] = "&gt;";
        }
    }
    input.value = arr.join('');
}