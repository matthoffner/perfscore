# perfscore

A page speed performance score based on total and unused css and js.

Uses puppeteer to get Chrome Dev Tools CSS and JS coverage tool to calculate totals.

## philosophy

Pages come in all shapes and sizes and its users perceived performance may change on their conditions, like being primarily desktop or mobile. Because of this, a more pragmatic performance metric is the amount of unused CSS and JS sent to a user.

The function returns a few proposed data points:

```js
const metrics = {
    coverageIndex, // (percentUnused * totalUnused)
    unusedKb,
    percentUnused,
    totalKb,
    totalUnused
}
```

## comparison to lighthouse/build budgets

Lighthouse is the standard and covers so many more areas, but in terms of what we should focus on it can be constantly changing. Also, running Lighthouse in CI can create a lot of challenges - for instance cloud benchmarks can be inconsistent with local runs. Perfscore is more tailored towards what we can control and monitor.

Build budgets are helpful, but they are only looking at the code before its run. This tool for instance includes third party scripts as a part of its coverage calculation.