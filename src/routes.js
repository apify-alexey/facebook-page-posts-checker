const Apify = require('apify');
// eslint-disable-next-line import/no-extraneous-dependencies
const cheerio = require('cheerio');

// const { utils: { log } } = Apify;

exports.feedEmbedURL = (pageName) => {
    if (!pageName) {
        return [];
    }
    return [
        {
            // eslint-disable-next-line max-len
            url: `https://www.facebook.com/platform/plugin/tab/renderer/?key=timeline&config_json=%7B%22app_id%22%3A%22776730922422337%22%2C%22href%22%3A%22https%3A%2F%2Fwww.facebook.com%2F${pageName}%22%2C%22width%22%3A500%2C%22height%22%3A600%2C%22has_cta%22%3Atrue%2C%22has_small_header%22%3Atrue%2C%22has_adapt_container_width%22%3Atrue%2C%22has_cover%22%3Atrue%2C%22has_posts%22%3Afalse%2C%22tabs%22%3A%22timeline%22%2C%22can_personalize%22%3Afalse%2C%22is_xfbml%22%3Afalse%2C%22referer_uri%22%3A%22%22%7D&fb_dtsg_ag&__user=0&__a=1&__dyn=7wKxa13wt8K2WmhwRwqo98nwgU6C7UW3q320-E7W0TUhwem0nCq1ewcG0KE33wooa81Vrzo5-0me0sy0SU2swdq0Ho2ewnE3fw6iw4vwbS1Lw&__csr=&__req=1&__hs=19138.BP%3Aplugin_default_pkg.2.0.0.0.&dpr=1&__ccg=EXCELLENT&__rev=1005586346&__s=%3A%3Auw9toh&__hsi=7101833089631301405&__comet_req=0&__sp=1`,
            userData: {
                pageName,
                counter: 0,
            },
        },
    ];
};

const normalizeUrl = (href) => {
    if (!href) {
        return undefined;
    }
    const url = new URL(href, 'https://www.facebook.com');
    if (url.href.startsWith('https://www.facebook.com/help')) {
        return undefined;
    }
    if (url.href.startsWith('https://external-')) {
        return decodeURI(url.searchParams.get('url'));
    }
    if (url.href.startsWith('https://l.facebook.com')) {
        return decodeURI(url.searchParams.get('u'));
    }
    return url.href;
};

exports.handleFeed = async ({ request, crawler }, { embed, html, scrollsAmount }) => {
    const { userData } = request;
    const { counter = 0 } = userData;
    const $ = cheerio.load(html);
    const posts = Array.from($('.userContentWrapper')).map((x) => {
        const stats = Array.from($('table td', x)).map((td) => {
            return parseInt($(td).text(), 10);
        });
        const abbrTime = $('.timestamp', x);
        const time = abbrTime?.attr('data-tooltip-content');
        const timestamp = abbrTime?.attr('data-utime');
        const url = normalizeUrl(abbrTime?.closest('a')?.attr('href'));
        abbrTime?.closest('.clearfix')?.remove();
        let post;
        const postObj = $('.mtm', x);
        if (postObj?.length) {
            const href = $('a', postObj)?.attr('href');
            const imgPost = $('img', postObj);
            post = {
                link: href ? normalizeUrl(href) : undefined,
                thumb: imgPost?.length ? normalizeUrl(imgPost?.attr('src')) : undefined,
                alt: imgPost?.attr('alt') || undefined,
            };
            postObj.remove();
        }
        const images = Array.from($('img', x)).map((imgItem) => {
            const img = $(imgItem);
            return {
                thumb: img.attr('src'),
                alt: img.attr('alt') || undefined,
            };
        });
        $('img', x).remove();
        const text = $('[data-visualcompletion="ignore-dynamic"]', x).text().trim();
        return {
            url,
            time,
            timestamp,
            likes: stats?.[0],
            comments: stats?.[1],
            shares: stats?.[2],
            text: text.endsWith('See more') ? text.substring(0, text.length - 8) : text,
            ...post,
            images: images?.length ? images : undefined,
        };
    });
    await Apify.pushData(posts);

    const cursor = embed?.jsmods?.require?.find((x) => x?.[1] === 'setCursor')?.[3]?.[0];
    if (cursor && scrollsAmount && counter < scrollsAmount) {
        const url = new URL(request.url);
        url.searchParams.set('cursor', cursor);
        await crawler.requestQueue.addRequest({
            url: url.toString(),
            userData: { ...userData, counter: counter + 1 },
        });
    }
};
