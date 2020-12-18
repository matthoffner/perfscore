const puppeteer = require('puppeteer');

const init = async function (url) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await Promise.all([page.coverage.startJSCoverage(), page.coverage.startCSSCoverage()]);
    await page.goto(url, {
        waitUntil: 'networkidle0'
    });
    const [jsCoverage, cssCoverage] = await Promise.all([
        page.coverage.stopJSCoverage(),
        page.coverage.stopCSSCoverage()
    ]);
    let totalBytes = 0;
    let usedBytes = 0;
    const coverageTotals = [...jsCoverage, ...cssCoverage];
    for (const entry of coverageTotals) {
        totalBytes += entry.text.length;
        for (const range of entry.ranges) usedBytes += range.end - range.start - 1;
    }
    const percentUnused = parseInt((usedBytes / totalBytes) * 100, 10);
    const totalUnused = totalBytes - usedBytes;
    const metrics = {
        coverageIndex: `${parseInt((percentUnused * totalUnused) / 1000, 10)}`, // rethink
        unusedKb: `${usedBytes / 1000}`,
        percentUnused,
        totalKb: `${totalBytes / 1000}`,
        totalUnused
    }
    browser.close();
    return {
        metrics
    };
}

exports.perfscore = async (req, res) => {
    if (req.query.apiKey === process.env.SECRET) {
        const url = req.query.url;
        const metrics = url && await init(url).then(result => {
            console.log(result.metrics);
            return result.metrics;
        });
        res.send(JSON.stringify(metrics));
    } else {
        response.status(400).send("key is not valid");
    }
}