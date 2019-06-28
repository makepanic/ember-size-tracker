# ember-size-tracker

This project is heavily inspired by https://github.com/ilkkao/ember-size-tracker

It loads all npm release tarfiles and crawls through them using [tar-stream](https://www.npmjs.com/package/tar-stream).

* `fetch.js` builds the package metadata in `./meta`
* `index.js` is the chartjs bootstrapping based on the generated metadata

## building / running

```bash
yarn start

yarn build
```

