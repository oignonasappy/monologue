fetch('https://oignonasappy.github.io/pianojs/v1.0.0/piano.js')
    .then(responce => {
        return responce.text();
    })
    .then(text => {
        document.getElementById('piano-js-src').textContent = text;

        setTimeout(() => {
            const prismCore = document.createElement('script');
            prismCore.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/components/prism-core.min.js';
            prismCore.defer = true;
            document.head.appendChild(prismCore);
            const prismAutoloader = document.createElement('script');
            prismAutoloader.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/plugins/autoloader/prism-autoloader.min.js';
            prismAutoloader.defer = true;
            document.head.appendChild(prismAutoloader);
            const prismWhitespace = document.createElement('script');
            prismWhitespace.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/plugins/normalize-whitespace/prism-normalize-whitespace.min.js';
            prismWhitespace.defer = true;
            document.head.appendChild(prismWhitespace);
            const prismLineNumber = document.createElement('script');
            prismLineNumber.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/plugins/line-numbers/prism-line-numbers.min.js';
            prismLineNumber.defer = true;
            document.head.appendChild(prismLineNumber);
        }, 100);
    })
    .catch(e => {
        document.getElementById('piano-js-src').textContent = "/* うまくよみこめんかった */";
    });