"use strict";
import { pages, pagesReady, ROOT, sortedPagesByCreate } from './common.js';
import { getSearchText, showList } from './search.js';

(() => {
    const title = document.querySelector('#title');

    const search = getSearchText();
    if (search === "") {
        title.textContent = "全カテゴリ";
        return allCategory();
    }
    title.textContent = "カテゴリ : " + search;
    return searchCategory(search);
})();

async function allCategory() {
    const linkArray = [];

    await pagesReady;

    const categorys = [];
    pages.forEach((page) => {
        if (page.category != null && !categorys.includes(page.category)) {
            categorys.push(page.category);
        }
    });

    categorys.forEach((category) => {
        const link = {};
        link.title = category;
        link.url = ROOT + 'general/page-search/category.html?search=' + category;
        linkArray.push(link);
    });

    showList(linkArray);
}

async function searchCategory(search) {
    const linkArray = [];

    await pagesReady;

    sortedPagesByCreate.forEach((page) => {
        if (page.category === search) {
            const link = {};
            link.title = page.title;
            link.url = ROOT + page.url;

            if (page.tag.length !== 0) {
                link.suppHTML = "タグ : ";
                for (let i = 0; i < page.tag.length; i++) {
                    link.suppHTML += `<a href="${ROOT}general/page-search/tag.html?search=${page.tag[i]}">${page.tag[i]}</a>`;
                    if (i < page.tag.length - 1) link.suppHTML += ", ";
                };
            }

            linkArray.push(link);
        }
    });

    showList(linkArray);

}