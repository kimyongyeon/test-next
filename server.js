const express = require('express');
const next = require('next');
const url = require('url');
const lruCache = require('lru-cache');
const fs = require('fs');

const prerenderList = [
    {name: 'page1', path: '/path1'},
    {name: 'page2-hello', path: '/path2?text=hello'},
    {name: 'page2-world', path: '/path2?text=world'},
];

const ssrCache = new lruCache({
    max: 100,
    maxAge: 1000 * 60
});

const port = 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next( { dev });
const handle = app.getRequestHandler();

const prerenderCache = {};
if (!dev) {
    for (const info of prerenderList) {
        const { name, path } = info;
        const html = fs.readFileSync(`./out/${name}.html`, `utf-8`);
        prerenderCache[path] = html;
    }
}

app.prepare().then(() => {
    const server = express();
    server.use(express.static('out'));
    // server.get('/page/:id', (req, res) => {
    //     res.redirect(`/page${req.params.id}`);
    // });
    server.get(/^\/page[1-9]/, (req, res) => {
        return renderAndCache(req, res);
    });
    server.get('*', (req, res) => {
        return handle(req, res);
    });
    server.listen(port, err => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});

async function renderAndCache(req, res) {
    const parseUrl = url.parse(req.url, true);
    const cacheKey = parseUrl.path;
    if (ssrCache.has(cacheKey)) {
        console.log('캐시 사용');
        res.send(ssrCache.get(cacheKey));
        return;
    }
    if (prerenderCache.hasOwnProperty(cacheKey)) {
        console.log('미리 랜더링한 HTML 사용');
        res.send(prerenderCache[cacheKey]);
        return;
    }
    try {
        const { query, pathname } = parseUrl;
        const html = await app.renderToHTML(req, res, pathname, query);
        if (res.statusCode === 200) {
            ssrCache.set(cacheKey, html);
        }
        res.send(html);
    } catch (err) {
        app.renderError(err, req, res, pathname, query);
    }
}