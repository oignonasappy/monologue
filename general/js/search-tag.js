"use strict";
import { pages, pagesReady, ROOT, sortedPagesByCreate } from './common.js';
import { getSearchText, showList } from './search.js';

(() => {
    const title = document.querySelector('#title');

    const search = getSearchText();
    if (search === "") {
        title.textContent = "全タグ";
        return allTag();
    }
    title.textContent = "タグ : " + search;
    return searchTag(search);
})();

async function allTag() {
    const linkArray = [];

    await pagesReady;

    const tags = [];
    pages.forEach((page) => {

        if (page.tag.length !== 0) {

            page.tag.forEach(tagScala => {

                if (!tags.includes(tagScala)) {

                    tags.push(tagScala);

                }
            });
        }
    });

    tags.forEach((tag) => {
        const link = {};
        link.title = tag;
        link.url = ROOT + 'general/page-search/tag.html?search=' + tag;
        linkArray.push(link);
    });

    showList(linkArray);
}

async function searchTag(search) {
    const linkArray = [];

    await pagesReady;

    sortedPagesByCreate.forEach((page) => {
        if (page.tag.includes(search)) {
            const link = {};
            link.title = page.title;
            link.url = ROOT + page.url;

            if (page.category != null) {
                link.suppHTML = `カテゴリ : <a href="${ROOT}general/page-search/category.html?search=${page.category}">${page.category}</a>`;
            }

            linkArray.push(link);
        }
    });

    showList(linkArray);
}