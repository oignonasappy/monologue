fetch('https://oignonasappy.github.io/pianojs/v1.0.2/piano.js')
    .then(responce => {
        return responce.text();
    })
    .then(text => {
        document.getElementById('piano-js-src').textContent = text;

        const prismCore = document.createElement('script');
        prismCore.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/components/prism-core.min.js';
        prismCore.defer = true;
        const prismAutoloader = document.createElement('script');
        prismAutoloader.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/plugins/autoloader/prism-autoloader.min.js';
        prismAutoloader.defer = true;
        const prismWhitespace = document.createElement('script');
        prismWhitespace.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/plugins/normalize-whitespace/prism-normalize-whitespace.min.js';
        prismWhitespace.defer = true;
        const prismLineNumber = document.createElement('script');
        prismLineNumber.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/plugins/line-numbers/prism-line-numbers.min.js';
        prismLineNumber.defer = true;

        setTimeout(() => {
            document.head.appendChild(prismCore);
            document.head.appendChild(prismAutoloader);
            document.head.appendChild(prismWhitespace);
            document.head.appendChild(prismLineNumber);
        }, 1000);
    })
    .catch(e => {
        document.getElementById('piano-js-src').textContent = "/* うまくよみこめんかった */";
    });
