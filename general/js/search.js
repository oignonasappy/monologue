"use strict";

export function getSearchText() {
    // ?search=*
    if (window.location.search.substring(0, 8) !== "?search=") {
        return "";
    }

    return decodeURIComponent(window.location.search.substring(8));
}

export function showList(linkArray) {
    const linkList = document.querySelector('#link-list');

    linkArray.forEach(link => {
        if (link.title != "") {
            const li = document.createElement('li');

            const anchor = document.createElement('a');
            anchor.href = link.url;
            anchor.textContent = link.title;
            li.appendChild(anchor);

            if (link.suppHTML != undefined) {
                const br = document.createElement('br');

                const supp = document.createElement('span');
                supp.innerHTML = link.suppHTML;
                supp.className = 'supp-text';

                li.appendChild(br);
                li.appendChild(supp);
            }

            linkList.appendChild(li);
        }
    });
}