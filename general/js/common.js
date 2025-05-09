/* Basic structure */
fetch("../html/header.html")
    .then(res => res.text())
    .then(html => {
        document.body.insertAdjacentHTML('afterbegin', html);
    });

fetch("../html/footer.html")
    .then(res => res.text())
    .then(html => {
        document.body.insertAdjacentHTML('beforeend', html);
    });

fetch("../sidebar/sidebar.html")
    .then(res => res.text())
    .then(html => {
        document.getElementById('container').insertAdjacentHTML('beforeend', html);
    });

/* footnote */