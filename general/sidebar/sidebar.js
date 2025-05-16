/* Local env check */
const ROOT = (() => {
    const isLocal = !!document.querySelector('meta[name="local-env"]');
    // If current environment is local env, Root is `/`
    // Else if deploy environment, Root is `/monologue/`
    return isLocal ? '/' : '/monologue/';
})();

/* Loading pages.json -> Next process */
let pages = [];
(async () => {
    try {
        const res = await fetch(ROOT + "pages.json");
        if (!res.ok) throw new Error("Response was not ok");

        const data = await res.json();
        pages = data;

        // Methods that use json
        try {
            recent(pages);
        } catch (error) {
            console.error("Error: ", error);
        }

    } catch (error) {
        console.error("Error fetching JSON: ", error);
    }
})();

function recent(pages) {
    /* Sort pages by date */
    const sortedPages = pages.slice().sort((a, b) => {
        // Return a create-date if update-date is null
        const getDate = page => {
            return new Date(page['update-date'] || page['create-date'] || "0000-00-00");
        };
        // Compare dates
        return getDate(b) - getDate(a);
    });

    /* Grouping pages by same date */
    const groupedPages = {};
    for (const page of sortedPages) {
        // create-date if update-date is null
        const rawDate = page['update-date'] || page['create-date'] || "~~~~-~~-~~";
        // Replace all '-' to '/'
        const formatDate = rawDate.replace(/-/g, '/');
        // Push the same dates in the same array
        if (!groupedPages[formatDate]) groupedPages[formatDate] = [];
        groupedPages[formatDate].push(page);
    }

    /* Create recent list */
    const recent = document.getElementById('sidebar-recent');
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

    recent.appendChild(recentList);
}