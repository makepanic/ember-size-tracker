import 'flexboxgrid2/flexboxgrid2.min.css';

const ChartBoxPlot = require('chartjs-chart-box-and-violin-plot');
const ChartAnnotation = require('chartjs-plugin-annotation');
const ChartCrosshair = require('chartjs-plugin-crosshair');

const semver = require('semver');
const sizes = require('./meta/ember-source.json');
const wrapper = document.querySelector('#charts-wrapper');

// todo: this will fail if we have uneven amount of files
const files = sizes[0].files.map(f => f.name);

const chartColors = {
    "red": "rgb(255, 99, 132)",
    "orange": "rgb(255, 159, 64)",
    "yellow": "rgb(255, 205, 86)",
    "green": "rgb(75, 192, 192)",
    "blue": "rgb(54, 162, 235)",
    "purple": "rgb(153, 102, 255)",
    "grey": "rgb(201, 203, 207)"
};

const bgColors = {
    red: 'rgba(255, 0, 0, .1)',
    green: 'rgba(0, 255, 0, .1)',
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const negative = bytes < 0;
    bytes = Math.abs(bytes);

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return (negative ? '-' : '') + (bytes / Math.pow(k, i)).toFixed(dm) + ' ' + sizes[i];
}

const addCanvas = () => {
    const div = document.createElement('div');
    div.className = 'canvas__wrapper';
    const canvas = document.createElement('canvas');
    div.appendChild(canvas);
    return {ctx: canvas.getContext("2d"), wrapper: div};
};

const sliceEnd = (array, length = 5) => {
    return array.slice(Math.max(array.length - length));
};

function table(sizes) {
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'table__wrapper';
    const table = document.createElement('table');
    tableWrapper.appendChild(table);

    const thead = document.createElement('thead');
    table.appendChild(thead);
    const tr = document.createElement('tr');
    thead.appendChild(tr);

    function th(tr, text) {
        const td = document.createElement('th');
        td.innerText = text;
        tr.appendChild(td);
    }

    th(tr, 'change');
    th(tr, 'version');
    th(tr, 'size (raw / gzip)');
    th(tr, 'gzip delta');

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    function td(tr, text, className) {
        const td = document.createElement('td');
        td.innerText = text;
        if (className) {
            td.className = className;
        }
        tr.appendChild(td);
    }

    sizes.forEach((size, idx) => {
        const prevSize = sizes[idx - 1];
        const tr = document.createElement('tr');
        tbody.appendChild(tr);

        let delta = '';
        if (prevSize) {
            const diff = size.size.gzip - prevSize.size.gzip;
            const didIncrease = diff > 0;

            const percentage = Math.abs(diff) / size.size.gzip * 100;
            delta = `${didIncrease ? '+' : ''}${formatBytes(diff)} (${percentage.toFixed(2)}%)`;
            td(tr, didIncrease ? '⬀' : (diff === 0 ? '⇨' : '⬂'), `tc ${didIncrease ? 'bg-red' : (diff === 0 ? 'bg-grey' : 'bg-green')}`);
        } else {
            td(tr, '');
        }

        td(tr, size.version);
        td(tr, `${formatBytes(size.size.raw)} / ${formatBytes(size.size.gzip)}`);

        td(tr, delta);
    });

    return tableWrapper;
}

function buildBoxPlotChart(data, wrapper) {
    const { ctx, wrapper: div } = addCanvas();
    div.className += ' chart--box-plot';
    wrapper.appendChild(div);
    const bags = {};
    // group data by major.minor
    data.forEach(d => {
        const v = semver.parse(d.version);
        const majorMinor = `${v.major}.${v.minor}`;
        bags[majorMinor] = bags[majorMinor] || [];
        bags[majorMinor].push(d.size.gzip);
    });

    const labels = Object.keys(bags);
    const gzip = Object.values(bags);

    new Chart(ctx, {
        plugins: [ChartBoxPlot],
        responsiveAnimationDuration: 0,
        type: 'boxplot',
        data: {
            labels,
            datasets: [
                {
                    label: 'gzipped',
                    data: gzip,
                    backgroundColor: 'rgba(0,0,255,0.5)',
                    borderColor: 'blue',
                    borderWidth: 1,
                    padding: 10,
                    itemRadius: 0,
                    outlierColor: '#999999',
                }]
        },
        options: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'all major.minor releases size (gzip)'
            },
            plugins: {
                crosshair: false,
            },
            animation: {
                duration: 0
            },
            scales: {
                yAxes: [{
                    ticks: {
                        callback: value => formatBytes(value)
                    }
                }],
            },
        }
    });
}

function buildLineChart(data, wrapper) {
    const { ctx, wrapper: div } = addCanvas();
    div.className += ' chart--line';
    wrapper.appendChild(div);
    let maxSize = 0;
    const annotations = [];
    const labels = data.map(d => d.version);
    data.forEach((d, idx) => {
        maxSize = Math.max(d.size.raw, maxSize);

        const previousDatum = data[idx - 1];
        if (previousDatum) {
            annotations.push({
                x0: labels.indexOf(previousDatum.version),
                x1: labels.indexOf(d.version),
                color: previousDatum.size.gzip < d.size.gzip ?
                    bgColors.red :
                    bgColors.green,
            })
        }
    });

    new Chart(ctx, {
        // plugins: [ChartAnnotation],
        responsiveAnimationDuration: 0,
        type: 'line',
        data: {
            labels,
            datasets: [{
                backgroundColor: chartColors.red,
                borderColor: chartColors.red,
                fill: false,
                label: 'raw',
                data: data.map(d => ({
                    x: labels.indexOf(d.version),
                    y: d.size.raw,
                    version: d.version
                })),
                // data: data.map(d => d.size.raw),
                borderWidth: 1,
                lineTension: 0,
            }, {
                backgroundColor: chartColors.blue,
                borderColor: chartColors.blue,
                fill: false,
                label: 'gzipped',
                data: data.map(d => ({
                    x: labels.indexOf(d.version),
                    y: d.size.gzip,
                    version: d.version
                })),
                borderWidth: 1,
                lineTension: 0,
            }]
        },
        options: {
            title: {
                display: true,
                text: 'File size each release'
            },
            animation: {
                duration: 0
            },
            scales: {
                yAxes: [{
                    ticks: {
                        callback: value => formatBytes(value)
                    }
                }],
                xAxes: [{
                    type: 'linear',
                    ticks: {
                        callback: value => labels[value]
                    }
                }],
            },
            tooltips: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    title: function ([{index}]) {
                        return data[index].version;
                    },
                    label: function (tooltipItem, data) {
                        const dataset = data.datasets[tooltipItem.datasetIndex];
                        const datum = dataset.data[tooltipItem.index];
                        return `${dataset.label}: ${formatBytes(datum.y)}`;
                    }
                }
            },
            annotation: {
                annotations:
                    annotations.map(annotation => {
                        return {
                            drawTime: 'beforeDatasetsDraw',
                            type: 'box',

                            xScaleID: 'x-axis-0',
                            yScaleID: 'y-axis-0',

                            xMin: annotation.x0,

                            // Right edge of the box
                            xMax: annotation.x1,

                            // Top edge of the box in units along the y axis
                            yMax: maxSize,

                            // Bottom edge of the box
                            yMin: 0,

                            backgroundColor: annotation.color,//'rgba(255, 0, 0, .2)',
                        }
                    })
            },
            plugins: {
                crosshair: {
                    sync: {
                        enabled: true,            // enable trace line syncing with other charts
                        group: 1,                 // chart group
                        suppressTooltips: false   // suppress tooltips when showing a synced tracer
                    },
                },
            }
        }
    });
}

async function boot(file) {
    const fileWrapper = document.createElement('div');
    fileWrapper.className = 'col-xl-6 col-sm-12 col-xs-12';
    wrapper.appendChild(fileWrapper);

    const data = sizes
        .map(size => ({
            time: size.time,
            date: new Date(size.time),
            version: size.version,
            ...size.files.find(f => f.name === file)
        }))
        .sort((a, b) => semver.compare(a.version, b.version));

    buildLineChart(data, fileWrapper);
    buildBoxPlotChart(data, fileWrapper);

    fileWrapper.appendChild(table(sliceEnd(data, 20)));
}

files.forEach(boot);