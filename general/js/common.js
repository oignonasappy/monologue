/* Local env check */
const ROOT = (() => {
    const isLocal = !!document.querySelector('meta[name="local-env"]');
    // If current environment is local env, Root is `/`
    // Else if deploy environment, Root is `/monologue/`
    return isLocal ? '/' : '/monologue/';
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

            // Call sidebar.js
            const sidebarScript = document.createElement('script');
            sidebarScript.type = 'module';
            sidebarScript.src = ROOT + 'general/sidebar/sidebar.js';
            document.body.appendChild(sidebarScript);
        });
})();

/* Load pages.json -> Next process */
(async () => {
    let pages = [];
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

        // category
        const category = document.createElement('div');
        category.setAttribute('class', 'info-category');
        category.innerHTML = `カテゴリ：<a href="${ROOT}general/page-search/category.html?category=${pages[pageIndex]['category']}">${pages[pageIndex]['category']}</a>`;

        // tag
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

        // date
        const date = document.createElement('div');
        date.setAttribute('class', 'info-date');

        // update date
        const updateDate = document.createElement('span');
        updateDate.setAttribute('class', 'no-wrap');
        let updateText = "";
        if (pages[pageIndex]['update-date'] !== null) {
            updateText += "更新日：";
            const updateDateTextArray = pages[pageIndex]['update-date'].split('-');
            updateText += updateDateTextArray[0] + "年 ";
            updateText += updateDateTextArray[1] + "月 ";
            updateText += updateDateTextArray[2]/*.replace(/^0+/, '')*/ + "日 ";
        }
        updateDate.textContent = updateText;

        // create date
        const createDate = document.createElement('span');
        createDate.setAttribute('class', 'no-wrap');
        let createText = "作成日：";
        const createDateTextArray = pages[pageIndex]['create-date'].split('-');
        createText += createDateTextArray[0] + "年 ";
        createText += createDateTextArray[1] + "月 ";
        createText += createDateTextArray[2] + "日";
        createDate.textContent = createText;

        // add pageinfo to main adterbegin
        if (pages[pageIndex]['category'] !== null) {
            info.appendChild(category);
        }
        if (pages[pageIndex]['tag'] != 0) {
            info.appendChild(tags);
        }
        date.appendChild(updateDate);
        // add single space
        date.appendChild(document.createTextNode(" "));
        date.appendChild(createDate);
        info.appendChild(date);
        document.querySelector('main').insertAdjacentElement('afterbegin', info);
    }
}

/* Tooltip for mobile */
(() => {
    document.querySelectorAll(':where(abbr[title], dfn[title])').forEach(elem => {
        elem.addEventListener('click', () => {
            elem.classList.toggle('show-tooltip');
        });
    });
})();

/* Footnote */
(() => {
    if (document.querySelectorAll('sup[class="footnote"]').length === 0) {
        return;
    }

    const footnotesTitle = document.createElement('h3');
    footnotesTitle.className = "footnotes-title"
    footnotesTitle.textContent = "このページの脚注";

    const footnotes = document.createElement('ul');
    footnotes.className = "footnotes";

    let noteNumber = 1;
    document.querySelectorAll('sup[class="footnote"]').forEach((referent) => {
        const note = referent.textContent;
        // referent
        referent.textContent = "";

        const anchorToFootnote = document.createElement('a');
        anchorToFootnote.className = "anchor-to-footnote";
        anchorToFootnote.textContent = "[" + noteNumber + "]";
        anchorToFootnote.id = "referent-" + noteNumber;
        anchorToFootnote.href = "./#footnote-" + noteNumber;
        anchorToFootnote.title = note;
        referent.appendChild(anchorToFootnote);

        // footnote
        const footnote = document.createElement('li');
        footnote.className = "footnote";

        const anchorToReferent = document.createElement('a');
        anchorToReferent.className = "anchor-to-referent"
        anchorToReferent.textContent = "[" + noteNumber + "]";
        anchorToReferent.id = "footnote-" + noteNumber;
        anchorToReferent.href = "#referent-" + noteNumber;
        anchorToReferent.title = "参照箇所へ";

        const footnoteText = document.createElement('span');
        footnoteText.className = "footnote-text";
        footnoteText.textContent = note;

        footnote.appendChild(anchorToReferent);
        footnote.appendChild(footnoteText);

        footnotes.appendChild(footnote);

        noteNumber++;
    });

    document.querySelector('main').appendChild(footnotesTitle);
    document.querySelector('main').appendChild(footnotes);
})();

/* TOC */
(() => {
    if (document.querySelectorAll('main h1, main h2, main h3, main h4, main h5, main h6').length === 0 ||
        !!document.querySelector('meta[name="no-toc"]')) {
        return;
    }

    const TOCBox = document.createElement('section');
    TOCBox.className = "toc-box";
    const TOCTitle = document.createElement('div');
    TOCTitle.className = "toc-title";
    TOCTitle.textContent = "目次";
    const TOCList = document.createElement('ul');
    TOCList.className = "toc-list";

    let hIndex = 0;
    document.querySelectorAll('main h1, main h2, main h3, main h4, main h5, main h6').forEach((elem) => {
        // set anchor to all heading
        const anchor = document.createElement('span');
        anchor.id = "h-index-" + hIndex;
        elem.insertAdjacentElement('beforebegin', anchor);

        // TOC contents
        const content = document.createElement('li');

        switch (elem.tagName) {
            case "H1":
                content.className = "toc-content-h1";
                break;
            case "H2":
                content.className = "toc-content-h2";
                break;
            case "H3":
                content.className = "toc-content-h3";
                break;
            case "H4":
                content.className = "toc-content-h4";
                break;
            case "H5":
                content.className = "toc-content-h5";
                break;
            case "H6":
                content.className = "toc-content-h6";
                break;
        }

        const toHeadingAnchor = document.createElement('a');
        toHeadingAnchor.href = "./#h-index-" + hIndex;
        toHeadingAnchor.textContent = elem.textContent;
        toHeadingAnchor.title = elem.textContent;

        content.appendChild(toHeadingAnchor);
        TOCList.appendChild(content);

        hIndex++;
    });

    TOCBox.appendChild(TOCTitle);
    TOCBox.appendChild(TOCList);
    if (document.querySelectorAll('main h1').length !== 0) {
        document.querySelectorAll('main h1')[0].insertAdjacentElement('afterend', TOCBox);
    } else {
        document.querySelector('main').insertAdjacentElement('afterbegin', TOCBox);
    }
})();