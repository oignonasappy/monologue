"use strict";
import { pagesReady, ROOT, sortedPagesByCreate } from './common.js';
import { showList } from './search.js';

(async () => {
    const linkArray = [];

    await pagesReady;
    
    sortedPagesByCreate.forEach(page => {
        
        const link = {};
        link.title = page.title;
        link.url = ROOT + page.url;

        if (page.category != null) {
            link.suppHTML = `カテゴリ : <a href="${ROOT}general/page-search/category.html?search=${page.category}">${page.category}</a>`;
        }

        if (page.tag.length !== 0) {
            if (link.suppHTML != undefined) {
                link.suppHTML += "<br>";
            } else {
                link.suppHTML = "";
            } 
            link.suppHTML += "タグ : ";
            for (let i = 0; i < page.tag.length; i++) {
                link.suppHTML += `<a href="${ROOT}general/page-search/tag.html?search=${page.tag[i]}">${page.tag[i]}</a>`;
                if (i < page.tag.length - 1) link.suppHTML += ", ";
            };
        }

        linkArray.push(link);
    });

    showList(linkArray);
})();