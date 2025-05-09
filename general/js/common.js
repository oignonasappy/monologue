/* Local env check */
const isLocal = !!document.querySelector('meta[name="local-env"]');
// If current environment is local env, Root is `/`
// Else if deploy environment, Root is `/monologue/`
const ROOT = isLocal ? '/' : '/monologue/';

/* Basic structure */
fetch(ROOT + "general/html/header.html")
    .then(res => res.text())
    .then(html => {
        document.body.insertAdjacentHTML('afterbegin', html);
    });

fetch(ROOT + "general/html/footer.html")
    .then(res => res.text())
    .then(html => {
        document.body.insertAdjacentHTML('beforeend', html);
    });

fetch(ROOT + "general/sidebar/sidebar.html")
    .then(res => res.text())
    .then(html => {
        document.getElementById('container').insertAdjacentHTML('beforeend', html);
    });

/* footnote */