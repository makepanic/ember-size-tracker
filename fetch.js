'use strict';

const packageName = 'ember-source';
const filePaths = [
    'package/dist/ember.min.js',
    'package/dist/ember.prod.js',
];

const cp = require('child_process');
const got = require('got');
const _ = require('lodash');
const tar = require('tar-stream');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const gunzip = require('gunzip-maybe');
const gzipSize = require('gzip-size');

const metaDir = path.join(__dirname, 'meta');
const versions = JSON.parse(cp.execSync(`yarn info ${packageName} versions --json`, {encoding: 'utf8'})).data;
const times = JSON.parse(cp.execSync(`yarn info ${packageName} time --json`, {encoding: 'utf8'})).data;

versions.forEach(v => assert(times.hasOwnProperty(v), `has time for ${v}`));

async function extractDistMeta(version) {
    var extract = tar.extract();
    let meta = {
        time: times[version],
        version,
        files: [],
    };
    let remainingPaths = [...filePaths];

    return new Promise((resolve) => {
        extract.on('entry', function ({size, name}, stream, next) {
            if (!remainingPaths.length) {
                resolve(meta);
                stream.destroy();
                extract.destroy();
            }

            if (remainingPaths.includes(name)) {
                const fileMeta ={
                    size: {
                        raw: size,
                        gzip: -1
                    }
                };
                stream
                    .pipe(gzipSize.stream())
                    .on('gzip-size', gzip => {
                        fileMeta.name = name;
                        fileMeta.size.gzip = gzip;
                        meta.files.push(fileMeta);
                        // remove found name from file
                        remainingPaths = remainingPaths.filter(p => p !== name);
                    });
            }

            stream.on('end', function () {
                next() // ready for next entry
            });

            stream.resume() // just auto drain the stream
        });

        extract.on('finish', function () {
            if (remainingPaths.length) {
                console.warn(`couldnt find files in ${version}`, remainingPaths);
            }
            resolve(remainingPaths.length ? undefined : meta);
        });

        got
            .stream(`https://registry.npmjs.org/${packageName}/-/${packageName}-${version}.tgz`)
            .pipe(gunzip())
            .pipe(extract);
    });
}

async function run() {
    const metas = [];
    const versionsChunks = _.chunk(versions, 5);
    const destFile = path.join(metaDir, `${packageName}.json`);

    for (let versions of versionsChunks) {
        console.log('loading sizes for', versions);
        metas.push(await Promise.all(versions.map(extractDistMeta)));
    }

    const result = metas
        .reduce((all, arr) => all.concat(arr), [])
        .filter(Boolean);

    fs.writeFileSync(destFile, JSON.stringify(result), {encoding: 'utf8'});
}

run().catch(e => console.error(e));