

const appInsights = require('applicationinsights');
const Vue = require('vue');
const server = require('express')();

const template = require('fs').readFileSync('./index.template.html', 'utf-8');

const renderer = require('vue-server-renderer').createRenderer({
    template,
});

const context = {
    title: 'vue ssr',
    metas: `
        <meta name="keyword" content="vue,ssr">
        <meta name="description" content="vue srr demo">
    `,
};

const applicationInsightsConnectionString = "InstrumentationKey=123";
appInsights.setup(applicationInsightsConnectionString)
    .setSendLiveMetrics(true)
    .start();

server.get('*', (req, res) => {
    const app = new Vue({
        data: {
            url: req.url
        },
        template: `<div>The visited URL is: {{ url }}</div>`,
    });

    renderer
        .renderToString(app, context, (err, html) => {
            if (err) {
                res.status(500).end('Internal Server Error')
                return;
            }
            res.end(html);
        });
})

server.listen(8080);