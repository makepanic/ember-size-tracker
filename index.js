import 'flexboxgrid2/flexboxgrid2.min.css';

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

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const addCanvas = (fileName) => {
    const div = document.createElement('div');
    div.className = 'canvas__wrapper col-xl-6 col-sm-12 col-xs-12';
    const title = document.createElement('h2');
    title.innerText = fileName;
    div.appendChild(title);
    const canvas = document.createElement('canvas');
    div.appendChild(canvas);
    wrapper.appendChild(div);
    return canvas.getContext("2d");
}

async function boot(file) {
    const ctx = addCanvas(file);

    const data = sizes
        .map(size => ({
            time: size.time,
            date: new Date(size.time),
            version: size.version,
            ...size.files.find(f => f.name === file)
        }))
        .sort((a, b) => semver.compare(a.version, b.version));

    const labels = data.map(d => d.version);

    new Chart(ctx, {
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
                        return data[Math.max(0, index - 1)].version;
                    },
                    label: function (tooltipItem, data) {
                        const dataset = data.datasets[tooltipItem.datasetIndex];
                        const datum = dataset.data[tooltipItem.index];
                        return `${dataset.label}: ${formatBytes(datum.y)}`;
                    }
                }
            },
            plugins: {
                crosshair: {
                    sync: {
                        enabled: true,            // enable trace line syncing with other charts
                        group: 1,                 // chart group
                        suppressTooltips: false   // suppress tooltips when showing a synced tracer
                    },
                }
            }
        }
    });
}

files.forEach(boot);