const Apify = require('apify');
const { feedEmbedURL, handleFeed } = require('./src/routes');

const { utils: { log } } = Apify;

Apify.main(async () => {
    const input = await Apify.getInput();
    input.pageNames = input.pageNames || [];
    if (input.pageName) {
        // compatibblity
        input.pageNames.push(input.pageName);
    }
    input.proxy = input.proxy || { useApifyProxy: true };

    const requestList = await Apify.openRequestList('start-urls', input.pageNames.flatMap(feedEmbedURL));
    const requestQueue = await Apify.openRequestQueue();
    const proxyConfiguration = await Apify.createProxyConfiguration();

    const crawler = new Apify.CheerioCrawler({
        requestList,
        requestQueue,
        proxyConfiguration,
        maxConcurrency: 10,
        maxRequestRetries: 10,
        handlePageTimeoutSecs: 20,
        additionalMimeTypes: ['application/x-javascript'],
        handlePageFunction: async (context) => {
            const { body } = context;
            const embed = JSON.parse(body.toString().substring(9));
            // eslint-disable-next-line no-underscore-dangle
            const html = embed?.payload?.content?.markup?.__html;
            if (!html) {
                if (embed?.payload?.redirect) {
                    return;
                }
                throw new Error('BLOCKED');
            }
            return handleFeed(context, { embed, html, ...input });
        },
    });

    await crawler.run();
    log.info('Crawl finished.');
});
