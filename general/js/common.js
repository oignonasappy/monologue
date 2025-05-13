/* Local env check */
const ROOT = (() => {
    const isLocal = !!document.querySelector('meta[name="local-env"]');
    // If current environment is local env, Root is `/`
    // Else if deploy environment, Root is `/monologue/`
    return isLocal ? '/' : '/monologue/'
})();

/* Basic structure */
(() => {
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
})();

/* Load pages.json -> Next process */
let pages = [];
(async () => {
    try {
        const res = await fetch(ROOT + "pages.json");
        if (!res.ok) throw new Error("Response was not ok");

        const data = await res.json();
        pages = data;

        // Methods that use json
        try {
            pageInfo(pages);
        } catch (error) {
            console.error("Error creating page info: ", error);
        }

    } catch (error) {
        console.error("Error fetching JSON: ", error);
    }
})();

const currentPath = window.location.pathname;
/**
 * Create page info
 * @param {Array} pages 
 */
function pageInfo(pages) {
    let pageIndex = -1;
    for (let i = 0; i < pages.length; i++) {
        if (ROOT + pages[i]['url'] == currentPath ||
            ROOT + pages[i]['url'] + 'index.html' == currentPath
        ) {
            pageIndex = i;
            break;
        }
    }
    if (pageIndex === -1) {
        console.log("Page not found in pages.json");
        console.log("window.location.pathname: " + currentPath);
        return;
    } else {

        const info = document.createElement('section');
        info.setAttribute('class', 'page-info');

        const category = document.createElement('div');
        category.setAttribute('class', 'info-category');
        category.innerHTML = `カテゴリ：<a href="${ROOT}general/page-search/category.html?category=${pages[pageIndex]['category']}">${pages[pageIndex]['category']}</a>`;

        const tags = document.createElement('div');
        tags.setAttribute('class', 'info-tags');
        let tagsText = "タグ：";
        for (let i = 0; i < pages[pageIndex]['tag'].length; i++) {
            tagsText += `<a href="${ROOT}general/page-search/tag.html?tag=${pages[pageIndex]['tag'][i]}">`;
            tagsText += pages[pageIndex]['tag'][i];
            tagsText += `</a>`;
            if (i + 1 < pages[pageIndex]['tag'].length) {
                tagsText += ", ";
            }
        }
        tags.innerHTML = tagsText;

        const date = document.createElement('div');
        date.setAttribute('class', 'info-date');
        let dateText = "作成日：";
        const createDateTextArray = pages[pageIndex]['create-date'].split('-');
        dateText += createDateTextArray[0] + "年 ";
        dateText += createDateTextArray[1] + "月 ";
        dateText += createDateTextArray[2] + "日 ";
        if (pages[pageIndex]['update-date'] !== null) {
            dateText += "更新日：";
            const updateDateTextArray = pages[pageIndex]['update-date'].split('-');
            dateText += updateDateTextArray[0] + "年 ";
            dateText += updateDateTextArray[1] + "月 ";
            dateText += updateDateTextArray[2]/*.replace(/^0+/, '')*/ + "日";
        }
        date.textContent = dateText;

        if (pages[pageIndex]['category'] !== null) {
            info.appendChild(category);
        }
        if (pages[pageIndex]['tag'] != 0) {
            info.appendChild(tags);
        }
        info.appendChild(date);
        document.querySelector('main').insertAdjacentElement('afterbegin', info);
    }
}

/* footnote */