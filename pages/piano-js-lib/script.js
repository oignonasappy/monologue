fetch('https://oignonasappy.github.io/monologue/pages/piano-js-lib/piano.js')
    .then(responce => responce.text())
    .then(text => {
        document.getElementById('piano-js-src').textContent = text;
    })
    .catch(e => {
        document.getElementById('piano-js-src').textContent = "/* うまくよみこめんかった */";
    });