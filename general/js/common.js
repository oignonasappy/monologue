/* Basic structure */
fetch("/general/html/header.html")
    .then(res => res.text())
    .then(html => {
        document.body.insertAdjacentHTML('afterbegin', html);
    });

fetch("/general/html/footer.html")
    .then(res => res.text())
    .then(html => {
        document.body.insertAdjacentHTML('beforeend', html);
    });

fetch("/general/sidebar/sidebar.html")
    .then(res => res.text())
    .then(html => {
        document.getElementById('container').insertAdjacentHTML('beforeend', html);
    });

/* footnote */