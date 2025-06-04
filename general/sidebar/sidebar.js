"use strict";
import { ROOT, pages, pagesReady, sortedPagesByUpdate } from '../js/common.js';

(async () => {
    await pagesReady;

    try {
        generateRecent();
    } catch (error) {
        console.error("Error: ", error);
    }

    try {
        generateCategorys();
    } catch (error) {
        console.error("Error: ", error);
    }

    try {
        generateTags();
    } catch (error) {
        console.error("Error: ", error);
    }
})();

function generateRecent() {
    /* Grouping pages by same date */
    const groupedPages = {};
    for (const page of sortedPagesByUpdate) {
        // create-date if update-date is null
        const rawDate = page['update-date'] || page['create-date'] || "~~~~-~~-~~";
        // Replace all '-' to '/'
        const formatDate = rawDate.replace(/-/g, '/');
        // Push the same dates in the same array
        if (!groupedPages[formatDate]) groupedPages[formatDate] = [];
        groupedPages[formatDate].push(page);
    }

    /* Create recent list */
    const sidebarRecent = document.getElementById('sidebar-recent');
    const recentList = document.createElement('ul');
    recentList.setAttribute('class', 'sidebar-datelist');
    // Adding content until total is 10
    let total = 0;
    for (const [date, contents] of Object.entries(groupedPages)) {
        const contentByDayLi = document.createElement('li');
        const dateText = document.createElement('span');
        dateText.setAttribute('class', 'sidebar-datetext');
        dateText.textContent = date;
        contentByDayLi.appendChild(dateText);

        const contentByDayUl = document.createElement('ul');
        for (const content of contents) {
            const article = document.createElement('li');
            const link = document.createElement('a');
            link.setAttribute('href', ROOT + content['url']);
            link.textContent = content.title;
            article.appendChild(link);
            contentByDayUl.appendChild(article);
            total++;
        }

        contentByDayLi.appendChild(contentByDayUl);
        recentList.appendChild(contentByDayLi);

        if (total >= 10) break;
    }

    sidebarRecent.appendChild(recentList);
}

function generateCategorys() {
    const sidebarCategorys = document.querySelector('#sidebar-categorys');

    const categorys = [];
    pages.forEach((page) => {
        if (page.category != null && !categorys.includes(page.category)) {
            categorys.push(page.category);
        }
    });

    const categoryList = document.createElement('ul');

    categorys.forEach((category) => {
        const li = document.createElement('li');

        const a = document.createElement('a');
        a.textContent = category;
        a.href = ROOT + 'general/page-search/category.html?' + category;

        li.appendChild(a);
        categoryList.appendChild(li);
    });

    sidebarCategorys.appendChild(categoryList);
}

function generateTags() {
    const sidebarTags = document.querySelector('#sidebar-tags');

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

    const tagList = document.createElement('ul');

    tags.forEach((tag) => {
        const li = document.createElement('li');

        const a = document.createElement('a');
        a.textContent = tag;
        a.href = ROOT + 'general/page-search/tag.html?' + tag;

        li.appendChild(a);
        tagList.appendChild(li);
    });

    sidebarTags.appendChild(tagList);
}