// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"node_modules/flexboxgrid2/flexboxgrid2.min.css":[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"node_modules/semver/semver.js":[function(require,module,exports) {
var process = require("process");
exports = module.exports = SemVer;
var debug;
/* istanbul ignore next */

if (typeof process === 'object' && process.env && undefined && /\bsemver\b/i.test(undefined)) {
  debug = function () {
    var args = Array.prototype.slice.call(arguments, 0);
    args.unshift('SEMVER');
    console.log.apply(console, args);
  };
} else {
  debug = function () {};
} // Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.


exports.SEMVER_SPEC_VERSION = '2.0.0';
var MAX_LENGTH = 256;
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
/* istanbul ignore next */
9007199254740991; // Max safe segment length for coercion.

var MAX_SAFE_COMPONENT_LENGTH = 16; // The actual regexps go on exports.re

var re = exports.re = [];
var src = exports.src = [];
var R = 0; // The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.
// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

var NUMERICIDENTIFIER = R++;
src[NUMERICIDENTIFIER] = '0|[1-9]\\d*';
var NUMERICIDENTIFIERLOOSE = R++;
src[NUMERICIDENTIFIERLOOSE] = '[0-9]+'; // ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

var NONNUMERICIDENTIFIER = R++;
src[NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*'; // ## Main Version
// Three dot-separated numeric identifiers.

var MAINVERSION = R++;
src[MAINVERSION] = '(' + src[NUMERICIDENTIFIER] + ')\\.' + '(' + src[NUMERICIDENTIFIER] + ')\\.' + '(' + src[NUMERICIDENTIFIER] + ')';
var MAINVERSIONLOOSE = R++;
src[MAINVERSIONLOOSE] = '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' + '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' + '(' + src[NUMERICIDENTIFIERLOOSE] + ')'; // ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

var PRERELEASEIDENTIFIER = R++;
src[PRERELEASEIDENTIFIER] = '(?:' + src[NUMERICIDENTIFIER] + '|' + src[NONNUMERICIDENTIFIER] + ')';
var PRERELEASEIDENTIFIERLOOSE = R++;
src[PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[NUMERICIDENTIFIERLOOSE] + '|' + src[NONNUMERICIDENTIFIER] + ')'; // ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

var PRERELEASE = R++;
src[PRERELEASE] = '(?:-(' + src[PRERELEASEIDENTIFIER] + '(?:\\.' + src[PRERELEASEIDENTIFIER] + ')*))';
var PRERELEASELOOSE = R++;
src[PRERELEASELOOSE] = '(?:-?(' + src[PRERELEASEIDENTIFIERLOOSE] + '(?:\\.' + src[PRERELEASEIDENTIFIERLOOSE] + ')*))'; // ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

var BUILDIDENTIFIER = R++;
src[BUILDIDENTIFIER] = '[0-9A-Za-z-]+'; // ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

var BUILD = R++;
src[BUILD] = '(?:\\+(' + src[BUILDIDENTIFIER] + '(?:\\.' + src[BUILDIDENTIFIER] + ')*))'; // ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.
// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

var FULL = R++;
var FULLPLAIN = 'v?' + src[MAINVERSION] + src[PRERELEASE] + '?' + src[BUILD] + '?';
src[FULL] = '^' + FULLPLAIN + '$'; // like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.

var LOOSEPLAIN = '[v=\\s]*' + src[MAINVERSIONLOOSE] + src[PRERELEASELOOSE] + '?' + src[BUILD] + '?';
var LOOSE = R++;
src[LOOSE] = '^' + LOOSEPLAIN + '$';
var GTLT = R++;
src[GTLT] = '((?:<|>)?=?)'; // Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.

var XRANGEIDENTIFIERLOOSE = R++;
src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + '|x|X|\\*';
var XRANGEIDENTIFIER = R++;
src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + '|x|X|\\*';
var XRANGEPLAIN = R++;
src[XRANGEPLAIN] = '[v=\\s]*(' + src[XRANGEIDENTIFIER] + ')' + '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' + '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' + '(?:' + src[PRERELEASE] + ')?' + src[BUILD] + '?' + ')?)?';
var XRANGEPLAINLOOSE = R++;
src[XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[XRANGEIDENTIFIERLOOSE] + ')' + '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' + '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' + '(?:' + src[PRERELEASELOOSE] + ')?' + src[BUILD] + '?' + ')?)?';
var XRANGE = R++;
src[XRANGE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAIN] + '$';
var XRANGELOOSE = R++;
src[XRANGELOOSE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAINLOOSE] + '$'; // Coercion.
// Extract anything that could conceivably be a part of a valid semver

var COERCE = R++;
src[COERCE] = '(?:^|[^\\d])' + '(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '})' + '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' + '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' + '(?:$|[^\\d])'; // Tilde ranges.
// Meaning is "reasonably at or greater than"

var LONETILDE = R++;
src[LONETILDE] = '(?:~>?)';
var TILDETRIM = R++;
src[TILDETRIM] = '(\\s*)' + src[LONETILDE] + '\\s+';
re[TILDETRIM] = new RegExp(src[TILDETRIM], 'g');
var tildeTrimReplace = '$1~';
var TILDE = R++;
src[TILDE] = '^' + src[LONETILDE] + src[XRANGEPLAIN] + '$';
var TILDELOOSE = R++;
src[TILDELOOSE] = '^' + src[LONETILDE] + src[XRANGEPLAINLOOSE] + '$'; // Caret ranges.
// Meaning is "at least and backwards compatible with"

var LONECARET = R++;
src[LONECARET] = '(?:\\^)';
var CARETTRIM = R++;
src[CARETTRIM] = '(\\s*)' + src[LONECARET] + '\\s+';
re[CARETTRIM] = new RegExp(src[CARETTRIM], 'g');
var caretTrimReplace = '$1^';
var CARET = R++;
src[CARET] = '^' + src[LONECARET] + src[XRANGEPLAIN] + '$';
var CARETLOOSE = R++;
src[CARETLOOSE] = '^' + src[LONECARET] + src[XRANGEPLAINLOOSE] + '$'; // A simple gt/lt/eq thing, or just "" to indicate "any version"

var COMPARATORLOOSE = R++;
src[COMPARATORLOOSE] = '^' + src[GTLT] + '\\s*(' + LOOSEPLAIN + ')$|^$';
var COMPARATOR = R++;
src[COMPARATOR] = '^' + src[GTLT] + '\\s*(' + FULLPLAIN + ')$|^$'; // An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`

var COMPARATORTRIM = R++;
src[COMPARATORTRIM] = '(\\s*)' + src[GTLT] + '\\s*(' + LOOSEPLAIN + '|' + src[XRANGEPLAIN] + ')'; // this one has to use the /g flag

re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], 'g');
var comparatorTrimReplace = '$1$2$3'; // Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.

var HYPHENRANGE = R++;
src[HYPHENRANGE] = '^\\s*(' + src[XRANGEPLAIN] + ')' + '\\s+-\\s+' + '(' + src[XRANGEPLAIN] + ')' + '\\s*$';
var HYPHENRANGELOOSE = R++;
src[HYPHENRANGELOOSE] = '^\\s*(' + src[XRANGEPLAINLOOSE] + ')' + '\\s+-\\s+' + '(' + src[XRANGEPLAINLOOSE] + ')' + '\\s*$'; // Star ranges basically just allow anything at all.

var STAR = R++;
src[STAR] = '(<|>)?=?\\s*\\*'; // Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.

for (var i = 0; i < R; i++) {
  debug(i, src[i]);

  if (!re[i]) {
    re[i] = new RegExp(src[i]);
  }
}

exports.parse = parse;

function parse(version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    };
  }

  if (version instanceof SemVer) {
    return version;
  }

  if (typeof version !== 'string') {
    return null;
  }

  if (version.length > MAX_LENGTH) {
    return null;
  }

  var r = options.loose ? re[LOOSE] : re[FULL];

  if (!r.test(version)) {
    return null;
  }

  try {
    return new SemVer(version, options);
  } catch (er) {
    return null;
  }
}

exports.valid = valid;

function valid(version, options) {
  var v = parse(version, options);
  return v ? v.version : null;
}

exports.clean = clean;

function clean(version, options) {
  var s = parse(version.trim().replace(/^[=v]+/, ''), options);
  return s ? s.version : null;
}

exports.SemVer = SemVer;

function SemVer(version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    };
  }

  if (version instanceof SemVer) {
    if (version.loose === options.loose) {
      return version;
    } else {
      version = version.version;
    }
  } else if (typeof version !== 'string') {
    throw new TypeError('Invalid Version: ' + version);
  }

  if (version.length > MAX_LENGTH) {
    throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters');
  }

  if (!(this instanceof SemVer)) {
    return new SemVer(version, options);
  }

  debug('SemVer', version, options);
  this.options = options;
  this.loose = !!options.loose;
  var m = version.trim().match(options.loose ? re[LOOSE] : re[FULL]);

  if (!m) {
    throw new TypeError('Invalid Version: ' + version);
  }

  this.raw = version; // these are actually numbers

  this.major = +m[1];
  this.minor = +m[2];
  this.patch = +m[3];

  if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
    throw new TypeError('Invalid major version');
  }

  if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
    throw new TypeError('Invalid minor version');
  }

  if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
    throw new TypeError('Invalid patch version');
  } // numberify any prerelease numeric ids


  if (!m[4]) {
    this.prerelease = [];
  } else {
    this.prerelease = m[4].split('.').map(function (id) {
      if (/^[0-9]+$/.test(id)) {
        var num = +id;

        if (num >= 0 && num < MAX_SAFE_INTEGER) {
          return num;
        }
      }

      return id;
    });
  }

  this.build = m[5] ? m[5].split('.') : [];
  this.format();
}

SemVer.prototype.format = function () {
  this.version = this.major + '.' + this.minor + '.' + this.patch;

  if (this.prerelease.length) {
    this.version += '-' + this.prerelease.join('.');
  }

  return this.version;
};

SemVer.prototype.toString = function () {
  return this.version;
};

SemVer.prototype.compare = function (other) {
  debug('SemVer.compare', this.version, this.options, other);

  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options);
  }

  return this.compareMain(other) || this.comparePre(other);
};

SemVer.prototype.compareMain = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options);
  }

  return compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch);
};

SemVer.prototype.comparePre = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options);
  } // NOT having a prerelease is > having one


  if (this.prerelease.length && !other.prerelease.length) {
    return -1;
  } else if (!this.prerelease.length && other.prerelease.length) {
    return 1;
  } else if (!this.prerelease.length && !other.prerelease.length) {
    return 0;
  }

  var i = 0;

  do {
    var a = this.prerelease[i];
    var b = other.prerelease[i];
    debug('prerelease compare', i, a, b);

    if (a === undefined && b === undefined) {
      return 0;
    } else if (b === undefined) {
      return 1;
    } else if (a === undefined) {
      return -1;
    } else if (a === b) {
      continue;
    } else {
      return compareIdentifiers(a, b);
    }
  } while (++i);
};

SemVer.prototype.compareBuild = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options);
  }

  var i = 0;

  do {
    var a = this.build[i];
    var b = other.build[i];
    debug('prerelease compare', i, a, b);

    if (a === undefined && b === undefined) {
      return 0;
    } else if (b === undefined) {
      return 1;
    } else if (a === undefined) {
      return -1;
    } else if (a === b) {
      continue;
    } else {
      return compareIdentifiers(a, b);
    }
  } while (++i);
}; // preminor will bump the version up to the next minor release, and immediately
// down to pre-release. premajor and prepatch work the same way.


SemVer.prototype.inc = function (release, identifier) {
  switch (release) {
    case 'premajor':
      this.prerelease.length = 0;
      this.patch = 0;
      this.minor = 0;
      this.major++;
      this.inc('pre', identifier);
      break;

    case 'preminor':
      this.prerelease.length = 0;
      this.patch = 0;
      this.minor++;
      this.inc('pre', identifier);
      break;

    case 'prepatch':
      // If this is already a prerelease, it will bump to the next version
      // drop any prereleases that might already exist, since they are not
      // relevant at this point.
      this.prerelease.length = 0;
      this.inc('patch', identifier);
      this.inc('pre', identifier);
      break;
    // If the input is a non-prerelease version, this acts the same as
    // prepatch.

    case 'prerelease':
      if (this.prerelease.length === 0) {
        this.inc('patch', identifier);
      }

      this.inc('pre', identifier);
      break;

    case 'major':
      // If this is a pre-major version, bump up to the same major version.
      // Otherwise increment major.
      // 1.0.0-5 bumps to 1.0.0
      // 1.1.0 bumps to 2.0.0
      if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
        this.major++;
      }

      this.minor = 0;
      this.patch = 0;
      this.prerelease = [];
      break;

    case 'minor':
      // If this is a pre-minor version, bump up to the same minor version.
      // Otherwise increment minor.
      // 1.2.0-5 bumps to 1.2.0
      // 1.2.1 bumps to 1.3.0
      if (this.patch !== 0 || this.prerelease.length === 0) {
        this.minor++;
      }

      this.patch = 0;
      this.prerelease = [];
      break;

    case 'patch':
      // If this is not a pre-release version, it will increment the patch.
      // If it is a pre-release it will bump up to the same patch version.
      // 1.2.0-5 patches to 1.2.0
      // 1.2.0 patches to 1.2.1
      if (this.prerelease.length === 0) {
        this.patch++;
      }

      this.prerelease = [];
      break;
    // This probably shouldn't be used publicly.
    // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.

    case 'pre':
      if (this.prerelease.length === 0) {
        this.prerelease = [0];
      } else {
        var i = this.prerelease.length;

        while (--i >= 0) {
          if (typeof this.prerelease[i] === 'number') {
            this.prerelease[i]++;
            i = -2;
          }
        }

        if (i === -1) {
          // didn't increment anything
          this.prerelease.push(0);
        }
      }

      if (identifier) {
        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
        if (this.prerelease[0] === identifier) {
          if (isNaN(this.prerelease[1])) {
            this.prerelease = [identifier, 0];
          }
        } else {
          this.prerelease = [identifier, 0];
        }
      }

      break;

    default:
      throw new Error('invalid increment argument: ' + release);
  }

  this.format();
  this.raw = this.version;
  return this;
};

exports.inc = inc;

function inc(version, release, loose, identifier) {
  if (typeof loose === 'string') {
    identifier = loose;
    loose = undefined;
  }

  try {
    return new SemVer(version, loose).inc(release, identifier).version;
  } catch (er) {
    return null;
  }
}

exports.diff = diff;

function diff(version1, version2) {
  if (eq(version1, version2)) {
    return null;
  } else {
    var v1 = parse(version1);
    var v2 = parse(version2);
    var prefix = '';

    if (v1.prerelease.length || v2.prerelease.length) {
      prefix = 'pre';
      var defaultResult = 'prerelease';
    }

    for (var key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return prefix + key;
        }
      }
    }

    return defaultResult; // may be undefined
  }
}

exports.compareIdentifiers = compareIdentifiers;
var numeric = /^[0-9]+$/;

function compareIdentifiers(a, b) {
  var anum = numeric.test(a);
  var bnum = numeric.test(b);

  if (anum && bnum) {
    a = +a;
    b = +b;
  }

  return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
}

exports.rcompareIdentifiers = rcompareIdentifiers;

function rcompareIdentifiers(a, b) {
  return compareIdentifiers(b, a);
}

exports.major = major;

function major(a, loose) {
  return new SemVer(a, loose).major;
}

exports.minor = minor;

function minor(a, loose) {
  return new SemVer(a, loose).minor;
}

exports.patch = patch;

function patch(a, loose) {
  return new SemVer(a, loose).patch;
}

exports.compare = compare;

function compare(a, b, loose) {
  return new SemVer(a, loose).compare(new SemVer(b, loose));
}

exports.compareLoose = compareLoose;

function compareLoose(a, b) {
  return compare(a, b, true);
}

exports.compareBuild = compareBuild;

function compareBuild(a, b, loose) {
  var versionA = new SemVer(a, loose);
  var versionB = new SemVer(b, loose);
  return versionA.compare(versionB) || versionA.compareBuild(versionB);
}

exports.rcompare = rcompare;

function rcompare(a, b, loose) {
  return compare(b, a, loose);
}

exports.sort = sort;

function sort(list, loose) {
  return list.sort(function (a, b) {
    return exports.compareBuild(a, b, loose);
  });
}

exports.rsort = rsort;

function rsort(list, loose) {
  return list.sort(function (a, b) {
    return exports.compareBuild(b, a, loose);
  });
}

exports.gt = gt;

function gt(a, b, loose) {
  return compare(a, b, loose) > 0;
}

exports.lt = lt;

function lt(a, b, loose) {
  return compare(a, b, loose) < 0;
}

exports.eq = eq;

function eq(a, b, loose) {
  return compare(a, b, loose) === 0;
}

exports.neq = neq;

function neq(a, b, loose) {
  return compare(a, b, loose) !== 0;
}

exports.gte = gte;

function gte(a, b, loose) {
  return compare(a, b, loose) >= 0;
}

exports.lte = lte;

function lte(a, b, loose) {
  return compare(a, b, loose) <= 0;
}

exports.cmp = cmp;

function cmp(a, op, b, loose) {
  switch (op) {
    case '===':
      if (typeof a === 'object') a = a.version;
      if (typeof b === 'object') b = b.version;
      return a === b;

    case '!==':
      if (typeof a === 'object') a = a.version;
      if (typeof b === 'object') b = b.version;
      return a !== b;

    case '':
    case '=':
    case '==':
      return eq(a, b, loose);

    case '!=':
      return neq(a, b, loose);

    case '>':
      return gt(a, b, loose);

    case '>=':
      return gte(a, b, loose);

    case '<':
      return lt(a, b, loose);

    case '<=':
      return lte(a, b, loose);

    default:
      throw new TypeError('Invalid operator: ' + op);
  }
}

exports.Comparator = Comparator;

function Comparator(comp, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    };
  }

  if (comp instanceof Comparator) {
    if (comp.loose === !!options.loose) {
      return comp;
    } else {
      comp = comp.value;
    }
  }

  if (!(this instanceof Comparator)) {
    return new Comparator(comp, options);
  }

  debug('comparator', comp, options);
  this.options = options;
  this.loose = !!options.loose;
  this.parse(comp);

  if (this.semver === ANY) {
    this.value = '';
  } else {
    this.value = this.operator + this.semver.version;
  }

  debug('comp', this);
}

var ANY = {};

Comparator.prototype.parse = function (comp) {
  var r = this.options.loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
  var m = comp.match(r);

  if (!m) {
    throw new TypeError('Invalid comparator: ' + comp);
  }

  this.operator = m[1] !== undefined ? m[1] : '';

  if (this.operator === '=') {
    this.operator = '';
  } // if it literally is just '>' or '' then allow anything.


  if (!m[2]) {
    this.semver = ANY;
  } else {
    this.semver = new SemVer(m[2], this.options.loose);
  }
};

Comparator.prototype.toString = function () {
  return this.value;
};

Comparator.prototype.test = function (version) {
  debug('Comparator.test', version, this.options.loose);

  if (this.semver === ANY || version === ANY) {
    return true;
  }

  if (typeof version === 'string') {
    try {
      version = new SemVer(version, this.options);
    } catch (er) {
      return false;
    }
  }

  return cmp(version, this.operator, this.semver, this.options);
};

Comparator.prototype.intersects = function (comp, options) {
  if (!(comp instanceof Comparator)) {
    throw new TypeError('a Comparator is required');
  }

  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    };
  }

  var rangeTmp;

  if (this.operator === '') {
    if (this.value === '') {
      return true;
    }

    rangeTmp = new Range(comp.value, options);
    return satisfies(this.value, rangeTmp, options);
  } else if (comp.operator === '') {
    if (comp.value === '') {
      return true;
    }

    rangeTmp = new Range(this.value, options);
    return satisfies(comp.semver, rangeTmp, options);
  }

  var sameDirectionIncreasing = (this.operator === '>=' || this.operator === '>') && (comp.operator === '>=' || comp.operator === '>');
  var sameDirectionDecreasing = (this.operator === '<=' || this.operator === '<') && (comp.operator === '<=' || comp.operator === '<');
  var sameSemVer = this.semver.version === comp.semver.version;
  var differentDirectionsInclusive = (this.operator === '>=' || this.operator === '<=') && (comp.operator === '>=' || comp.operator === '<=');
  var oppositeDirectionsLessThan = cmp(this.semver, '<', comp.semver, options) && (this.operator === '>=' || this.operator === '>') && (comp.operator === '<=' || comp.operator === '<');
  var oppositeDirectionsGreaterThan = cmp(this.semver, '>', comp.semver, options) && (this.operator === '<=' || this.operator === '<') && (comp.operator === '>=' || comp.operator === '>');
  return sameDirectionIncreasing || sameDirectionDecreasing || sameSemVer && differentDirectionsInclusive || oppositeDirectionsLessThan || oppositeDirectionsGreaterThan;
};

exports.Range = Range;

function Range(range, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    };
  }

  if (range instanceof Range) {
    if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
      return range;
    } else {
      return new Range(range.raw, options);
    }
  }

  if (range instanceof Comparator) {
    return new Range(range.value, options);
  }

  if (!(this instanceof Range)) {
    return new Range(range, options);
  }

  this.options = options;
  this.loose = !!options.loose;
  this.includePrerelease = !!options.includePrerelease; // First, split based on boolean or ||

  this.raw = range;
  this.set = range.split(/\s*\|\|\s*/).map(function (range) {
    return this.parseRange(range.trim());
  }, this).filter(function (c) {
    // throw out any that are not relevant for whatever reason
    return c.length;
  });

  if (!this.set.length) {
    throw new TypeError('Invalid SemVer Range: ' + range);
  }

  this.format();
}

Range.prototype.format = function () {
  this.range = this.set.map(function (comps) {
    return comps.join(' ').trim();
  }).join('||').trim();
  return this.range;
};

Range.prototype.toString = function () {
  return this.range;
};

Range.prototype.parseRange = function (range) {
  var loose = this.options.loose;
  range = range.trim(); // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`

  var hr = loose ? re[HYPHENRANGELOOSE] : re[HYPHENRANGE];
  range = range.replace(hr, hyphenReplace);
  debug('hyphen replace', range); // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`

  range = range.replace(re[COMPARATORTRIM], comparatorTrimReplace);
  debug('comparator trim', range, re[COMPARATORTRIM]); // `~ 1.2.3` => `~1.2.3`

  range = range.replace(re[TILDETRIM], tildeTrimReplace); // `^ 1.2.3` => `^1.2.3`

  range = range.replace(re[CARETTRIM], caretTrimReplace); // normalize spaces

  range = range.split(/\s+/).join(' '); // At this point, the range is completely trimmed and
  // ready to be split into comparators.

  var compRe = loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
  var set = range.split(' ').map(function (comp) {
    return parseComparator(comp, this.options);
  }, this).join(' ').split(/\s+/);

  if (this.options.loose) {
    // in loose mode, throw out any that are not valid comparators
    set = set.filter(function (comp) {
      return !!comp.match(compRe);
    });
  }

  set = set.map(function (comp) {
    return new Comparator(comp, this.options);
  }, this);
  return set;
};

Range.prototype.intersects = function (range, options) {
  if (!(range instanceof Range)) {
    throw new TypeError('a Range is required');
  }

  return this.set.some(function (thisComparators) {
    return isSatisfiable(thisComparators, options) && range.set.some(function (rangeComparators) {
      return isSatisfiable(rangeComparators, options) && thisComparators.every(function (thisComparator) {
        return rangeComparators.every(function (rangeComparator) {
          return thisComparator.intersects(rangeComparator, options);
        });
      });
    });
  });
}; // take a set of comparators and determine whether there
// exists a version which can satisfy it


function isSatisfiable(comparators, options) {
  var result = true;
  var remainingComparators = comparators.slice();
  var testComparator = remainingComparators.pop();

  while (result && remainingComparators.length) {
    result = remainingComparators.every(function (otherComparator) {
      return testComparator.intersects(otherComparator, options);
    });
    testComparator = remainingComparators.pop();
  }

  return result;
} // Mostly just for testing and legacy API reasons


exports.toComparators = toComparators;

function toComparators(range, options) {
  return new Range(range, options).set.map(function (comp) {
    return comp.map(function (c) {
      return c.value;
    }).join(' ').trim().split(' ');
  });
} // comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.


function parseComparator(comp, options) {
  debug('comp', comp, options);
  comp = replaceCarets(comp, options);
  debug('caret', comp);
  comp = replaceTildes(comp, options);
  debug('tildes', comp);
  comp = replaceXRanges(comp, options);
  debug('xrange', comp);
  comp = replaceStars(comp, options);
  debug('stars', comp);
  return comp;
}

function isX(id) {
  return !id || id.toLowerCase() === 'x' || id === '*';
} // ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0


function replaceTildes(comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceTilde(comp, options);
  }).join(' ');
}

function replaceTilde(comp, options) {
  var r = options.loose ? re[TILDELOOSE] : re[TILDE];
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('tilde', comp, _, M, m, p, pr);
    var ret;

    if (isX(M)) {
      ret = '';
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
    } else if (pr) {
      debug('replaceTilde pr', pr);
      ret = '>=' + M + '.' + m + '.' + p + '-' + pr + ' <' + M + '.' + (+m + 1) + '.0';
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0
      ret = '>=' + M + '.' + m + '.' + p + ' <' + M + '.' + (+m + 1) + '.0';
    }

    debug('tilde return', ret);
    return ret;
  });
} // ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0


function replaceCarets(comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceCaret(comp, options);
  }).join(' ');
}

function replaceCaret(comp, options) {
  debug('caret', comp, options);
  var r = options.loose ? re[CARETLOOSE] : re[CARET];
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('caret', comp, _, M, m, p, pr);
    var ret;

    if (isX(M)) {
      ret = '';
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
    } else if (isX(p)) {
      if (M === '0') {
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
      } else {
        ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0';
      }
    } else if (pr) {
      debug('replaceCaret pr', pr);

      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr + ' <' + M + '.' + m + '.' + (+p + 1);
        } else {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr + ' <' + M + '.' + (+m + 1) + '.0';
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p + '-' + pr + ' <' + (+M + 1) + '.0.0';
      }
    } else {
      debug('no pr');

      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p + ' <' + M + '.' + m + '.' + (+p + 1);
        } else {
          ret = '>=' + M + '.' + m + '.' + p + ' <' + M + '.' + (+m + 1) + '.0';
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p + ' <' + (+M + 1) + '.0.0';
      }
    }

    debug('caret return', ret);
    return ret;
  });
}

function replaceXRanges(comp, options) {
  debug('replaceXRanges', comp, options);
  return comp.split(/\s+/).map(function (comp) {
    return replaceXRange(comp, options);
  }).join(' ');
}

function replaceXRange(comp, options) {
  comp = comp.trim();
  var r = options.loose ? re[XRANGELOOSE] : re[XRANGE];
  return comp.replace(r, function (ret, gtlt, M, m, p, pr) {
    debug('xRange', comp, ret, gtlt, M, m, p, pr);
    var xM = isX(M);
    var xm = xM || isX(m);
    var xp = xm || isX(p);
    var anyX = xp;

    if (gtlt === '=' && anyX) {
      gtlt = '';
    }

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0';
      } else {
        // nothing is forbidden
        ret = '*';
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0;
      }

      p = 0;

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        // >1.2.3 => >= 1.2.4
        gtlt = '>=';

        if (xm) {
          M = +M + 1;
          m = 0;
          p = 0;
        } else {
          m = +m + 1;
          p = 0;
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<';

        if (xm) {
          M = +M + 1;
        } else {
          m = +m + 1;
        }
      }

      ret = gtlt + M + '.' + m + '.' + p;
    } else if (xm) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
    } else if (xp) {
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
    }

    debug('xRange return', ret);
    return ret;
  });
} // Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.


function replaceStars(comp, options) {
  debug('replaceStars', comp, options); // Looseness is ignored here.  star is always as loose as it gets!

  return comp.trim().replace(re[STAR], '');
} // This function is passed to string.replace(re[HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0


function hyphenReplace($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr, tb) {
  if (isX(fM)) {
    from = '';
  } else if (isX(fm)) {
    from = '>=' + fM + '.0.0';
  } else if (isX(fp)) {
    from = '>=' + fM + '.' + fm + '.0';
  } else {
    from = '>=' + from;
  }

  if (isX(tM)) {
    to = '';
  } else if (isX(tm)) {
    to = '<' + (+tM + 1) + '.0.0';
  } else if (isX(tp)) {
    to = '<' + tM + '.' + (+tm + 1) + '.0';
  } else if (tpr) {
    to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr;
  } else {
    to = '<=' + to;
  }

  return (from + ' ' + to).trim();
} // if ANY of the sets match ALL of its comparators, then pass


Range.prototype.test = function (version) {
  if (!version) {
    return false;
  }

  if (typeof version === 'string') {
    try {
      version = new SemVer(version, this.options);
    } catch (er) {
      return false;
    }
  }

  for (var i = 0; i < this.set.length; i++) {
    if (testSet(this.set[i], version, this.options)) {
      return true;
    }
  }

  return false;
};

function testSet(set, version, options) {
  for (var i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false;
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (i = 0; i < set.length; i++) {
      debug(set[i].semver);

      if (set[i].semver === ANY) {
        continue;
      }

      if (set[i].semver.prerelease.length > 0) {
        var allowed = set[i].semver;

        if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
          return true;
        }
      }
    } // Version has a -pre, but it's not one of the ones we like.


    return false;
  }

  return true;
}

exports.satisfies = satisfies;

function satisfies(version, range, options) {
  try {
    range = new Range(range, options);
  } catch (er) {
    return false;
  }

  return range.test(version);
}

exports.maxSatisfying = maxSatisfying;

function maxSatisfying(versions, range, options) {
  var max = null;
  var maxSV = null;

  try {
    var rangeObj = new Range(range, options);
  } catch (er) {
    return null;
  }

  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v;
        maxSV = new SemVer(max, options);
      }
    }
  });
  return max;
}

exports.minSatisfying = minSatisfying;

function minSatisfying(versions, range, options) {
  var min = null;
  var minSV = null;

  try {
    var rangeObj = new Range(range, options);
  } catch (er) {
    return null;
  }

  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v;
        minSV = new SemVer(min, options);
      }
    }
  });
  return min;
}

exports.minVersion = minVersion;

function minVersion(range, loose) {
  range = new Range(range, loose);
  var minver = new SemVer('0.0.0');

  if (range.test(minver)) {
    return minver;
  }

  minver = new SemVer('0.0.0-0');

  if (range.test(minver)) {
    return minver;
  }

  minver = null;

  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i];
    comparators.forEach(function (comparator) {
      // Clone to avoid manipulating the comparator's semver object.
      var compver = new SemVer(comparator.semver.version);

      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++;
          } else {
            compver.prerelease.push(0);
          }

          compver.raw = compver.format();

        /* fallthrough */

        case '':
        case '>=':
          if (!minver || gt(minver, compver)) {
            minver = compver;
          }

          break;

        case '<':
        case '<=':
          /* Ignore maximum versions */
          break;

        /* istanbul ignore next */

        default:
          throw new Error('Unexpected operation: ' + comparator.operator);
      }
    });
  }

  if (minver && range.test(minver)) {
    return minver;
  }

  return null;
}

exports.validRange = validRange;

function validRange(range, options) {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, options).range || '*';
  } catch (er) {
    return null;
  }
} // Determine if version is less than all the versions possible in the range


exports.ltr = ltr;

function ltr(version, range, options) {
  return outside(version, range, '<', options);
} // Determine if version is greater than all the versions possible in the range.


exports.gtr = gtr;

function gtr(version, range, options) {
  return outside(version, range, '>', options);
}

exports.outside = outside;

function outside(version, range, hilo, options) {
  version = new SemVer(version, options);
  range = new Range(range, options);
  var gtfn, ltefn, ltfn, comp, ecomp;

  switch (hilo) {
    case '>':
      gtfn = gt;
      ltefn = lte;
      ltfn = lt;
      comp = '>';
      ecomp = '>=';
      break;

    case '<':
      gtfn = lt;
      ltefn = gte;
      ltfn = gt;
      comp = '<';
      ecomp = '<=';
      break;

    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  } // If it satisifes the range it is not outside


  if (satisfies(version, range, options)) {
    return false;
  } // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.


  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i];
    var high = null;
    var low = null;
    comparators.forEach(function (comparator) {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0');
      }

      high = high || comparator;
      low = low || comparator;

      if (gtfn(comparator.semver, high.semver, options)) {
        high = comparator;
      } else if (ltfn(comparator.semver, low.semver, options)) {
        low = comparator;
      }
    }); // If the edge version comparator has a operator then our version
    // isn't outside it

    if (high.operator === comp || high.operator === ecomp) {
      return false;
    } // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range


    if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
      return false;
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false;
    }
  }

  return true;
}

exports.prerelease = prerelease;

function prerelease(version, options) {
  var parsed = parse(version, options);
  return parsed && parsed.prerelease.length ? parsed.prerelease : null;
}

exports.intersects = intersects;

function intersects(r1, r2, options) {
  r1 = new Range(r1, options);
  r2 = new Range(r2, options);
  return r1.intersects(r2);
}

exports.coerce = coerce;

function coerce(version, options) {
  if (version instanceof SemVer) {
    return version;
  }

  if (typeof version !== 'string') {
    return null;
  }

  var match = version.match(re[COERCE]);

  if (match == null) {
    return null;
  }

  return parse(match[1] + '.' + (match[2] || '0') + '.' + (match[3] || '0'), options);
}
},{"process":"node_modules/process/browser.js"}],"meta/ember-source.json":[function(require,module,exports) {
module.exports = [{
  "time": "2016-11-30T00:13:44.141Z",
  "version": "2.11.0-beta.1",
  "files": [{
    "size": {
      "raw": 2609247,
      "gzip": 584886
    },
    "name": "package/dist/ember.prod.js"
  }, {
    "size": {
      "raw": 530268,
      "gzip": 130393
    },
    "name": "package/dist/ember.min.js"
  }]
}, {
  "time": "2017-01-21T00:03:23.654Z",
  "version": "2.11.0-beta.5",
  "files": [{
    "size": {
      "raw": 530704,
      "gzip": 130538
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1852192,
      "gzip": 378514
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-01-21T15:52:39.955Z",
  "version": "2.11.0-beta.6",
  "files": [{
    "size": {
      "raw": 530704,
      "gzip": 130538
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1852192,
      "gzip": 378514
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-01-21T16:19:06.855Z",
  "version": "2.11.0-beta.7",
  "files": [{
    "size": {
      "raw": 530704,
      "gzip": 130538
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1852192,
      "gzip": 378515
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-01-21T16:42:10.293Z",
  "version": "2.11.0-beta.8",
  "files": [{
    "size": {
      "raw": 530704,
      "gzip": 130538
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1852192,
      "gzip": 378515
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-01-24T02:22:01.079Z",
  "version": "2.11.0",
  "files": [{
    "size": {
      "raw": 530697,
      "gzip": 130531
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1852178,
      "gzip": 378501
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-02-16T15:31:00.058Z",
  "version": "2.11.1",
  "files": [{
    "size": {
      "raw": 530735,
      "gzip": 130548
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1852253,
      "gzip": 378554
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-01-24T03:51:13.196Z",
  "version": "2.12.0-beta.1",
  "files": [{
    "size": {
      "raw": 535075,
      "gzip": 131682
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1869923,
      "gzip": 381455
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-02-16T15:38:42.680Z",
  "version": "2.12.0-beta.2",
  "files": [{
    "size": {
      "raw": 534664,
      "gzip": 131539
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1869684,
      "gzip": 381357
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-04-27T22:26:59.629Z",
  "version": "2.14.0-beta.1",
  "files": [{
    "size": {
      "raw": 487432,
      "gzip": 124216
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1589197,
      "gzip": 327535
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-05-10T18:58:38.568Z",
  "version": "2.14.0-beta.2",
  "files": [{
    "size": {
      "raw": 488083,
      "gzip": 124348
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1590909,
      "gzip": 327805
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-05-31T16:05:23.067Z",
  "version": "2.14.0-beta.3",
  "files": [{
    "size": {
      "raw": 482860,
      "gzip": 122663
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1581299,
      "gzip": 324923
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-07-05T14:15:18.130Z",
  "version": "2.14.0",
  "files": [{
    "size": {
      "raw": 482868,
      "gzip": 122661
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1582998,
      "gzip": 325536
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-07-14T15:12:10.822Z",
  "version": "2.14.1",
  "files": [{
    "size": {
      "raw": 482768,
      "gzip": 122630
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1582526,
      "gzip": 325395
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-07-05T18:23:59.469Z",
  "version": "2.15.0-beta.1",
  "files": [{
    "size": {
      "raw": 489520,
      "gzip": 122880
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1601285,
      "gzip": 326524
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-07-21T08:29:18.974Z",
  "version": "2.15.0-beta.2",
  "files": [{
    "size": {
      "raw": 488286,
      "gzip": 122513
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1600052,
      "gzip": 326400
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-08-08T13:44:48.130Z",
  "version": "2.15.0-beta.3",
  "files": [{
    "size": {
      "raw": 488733,
      "gzip": 122629
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1601051,
      "gzip": 326559
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-08-31T14:19:42.665Z",
  "version": "2.15.0",
  "files": [{
    "size": {
      "raw": 488726,
      "gzip": 122620
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1601043,
      "gzip": 326552
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-10-03T01:18:57.704Z",
  "version": "2.15.1",
  "files": [{
    "size": {
      "raw": 488858,
      "gzip": 122611
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1601417,
      "gzip": 326557
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-10-04T20:28:17.533Z",
  "version": "2.15.2",
  "files": [{
    "size": {
      "raw": 488880,
      "gzip": 122633
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1601847,
      "gzip": 326662
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-10-10T01:14:01.492Z",
  "version": "2.15.3",
  "files": [{
    "size": {
      "raw": 488882,
      "gzip": 122637
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1601873,
      "gzip": 326678
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-08-31T14:43:42.256Z",
  "version": "2.16.0-beta.1",
  "files": [{
    "size": {
      "raw": 487077,
      "gzip": 122200
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1599058,
      "gzip": 325983
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-10-03T00:37:59.126Z",
  "version": "2.16.0-beta.2",
  "files": [{
    "size": {
      "raw": 487404,
      "gzip": 122249
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1606081,
      "gzip": 327412
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-10-10T00:59:10.249Z",
  "version": "2.16.0",
  "files": [{
    "size": {
      "raw": 487357,
      "gzip": 122240
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1606339,
      "gzip": 327440
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-10-29T13:59:08.894Z",
  "version": "2.16.1",
  "files": [{
    "size": {
      "raw": 487445,
      "gzip": 122267
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1607990,
      "gzip": 327828
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-11-01T21:18:13.786Z",
  "version": "2.16.2",
  "files": [{
    "size": {
      "raw": 488215,
      "gzip": 122317
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1608014,
      "gzip": 327688
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-02-14T03:34:57.612Z",
  "version": "2.16.3",
  "files": [{
    "size": {
      "raw": 488264,
      "gzip": 122330
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1608108,
      "gzip": 327708
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-02-14T23:31:25.211Z",
  "version": "2.16.4",
  "files": [{
    "size": {
      "raw": 488277,
      "gzip": 122332
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1608149,
      "gzip": 327724
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-10-10T01:35:09.417Z",
  "version": "2.17.0-beta.1",
  "files": [{
    "size": {
      "raw": 487955,
      "gzip": 121862
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1602559,
      "gzip": 326262
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-10-17T21:58:34.429Z",
  "version": "2.17.0-beta.2",
  "files": [{
    "size": {
      "raw": 488030,
      "gzip": 121880
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1602581,
      "gzip": 326233
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-10-23T19:36:47.973Z",
  "version": "2.17.0-beta.3",
  "files": [{
    "size": {
      "raw": 488026,
      "gzip": 121863
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1602545,
      "gzip": 326214
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-10-31T00:52:27.492Z",
  "version": "2.17.0-beta.4",
  "files": [{
    "size": {
      "raw": 488055,
      "gzip": 121875
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1604200,
      "gzip": 326622
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-11-08T03:39:58.939Z",
  "version": "2.17.0-beta.5",
  "files": [{
    "size": {
      "raw": 488059,
      "gzip": 121876
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1604274,
      "gzip": 326618
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-11-14T02:45:28.781Z",
  "version": "2.17.0-beta.6",
  "files": [{
    "size": {
      "raw": 488236,
      "gzip": 121929
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1604852,
      "gzip": 326750
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-11-29T14:45:34.203Z",
  "version": "2.17.0",
  "files": [{
    "size": {
      "raw": 488069,
      "gzip": 121875
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1605817,
      "gzip": 326801
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-02-14T03:58:55.098Z",
  "version": "2.17.1",
  "files": [{
    "size": {
      "raw": 488118,
      "gzip": 121886
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1605911,
      "gzip": 326822
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-02-14T23:22:57.830Z",
  "version": "2.17.2",
  "files": [{
    "size": {
      "raw": 488131,
      "gzip": 121890
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1605952,
      "gzip": 326841
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-11-29T15:14:19.988Z",
  "version": "2.18.0-beta.1",
  "files": [{
    "size": {
      "raw": 486584,
      "gzip": 121227
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1617212,
      "gzip": 327290
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-12-04T21:13:18.778Z",
  "version": "2.18.0-beta.2",
  "files": [{
    "size": {
      "raw": 486665,
      "gzip": 121265
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1617814,
      "gzip": 327383
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-12-12T21:47:16.878Z",
  "version": "2.18.0-beta.3",
  "files": [{
    "size": {
      "raw": 486665,
      "gzip": 121265
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1618498,
      "gzip": 327403
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-12-20T01:50:29.350Z",
  "version": "2.18.0-beta.4",
  "files": [{
    "size": {
      "raw": 486666,
      "gzip": 121263
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1619189,
      "gzip": 327537
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2017-12-27T22:13:02.013Z",
  "version": "2.18.0-beta.5",
  "files": [{
    "size": {
      "raw": 486614,
      "gzip": 121247
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1618883,
      "gzip": 327556
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-01-01T16:17:13.933Z",
  "version": "2.18.0",
  "files": [{
    "size": {
      "raw": 486590,
      "gzip": 121231
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1618804,
      "gzip": 327534
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-02-14T04:12:12.002Z",
  "version": "2.18.1",
  "files": [{
    "size": {
      "raw": 486857,
      "gzip": 121324
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1620131,
      "gzip": 327613
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-02-14T22:40:49.423Z",
  "version": "2.18.2",
  "files": [{
    "size": {
      "raw": 486870,
      "gzip": 121329
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1620195,
      "gzip": 327625
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-01-02T02:20:41.693Z",
  "version": "3.0.0-beta.1",
  "files": [{
    "size": {
      "raw": 482100,
      "gzip": 119954
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1588398,
      "gzip": 320371
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-01-09T04:29:07.640Z",
  "version": "3.0.0-beta.2",
  "files": [{
    "size": {
      "raw": 480051,
      "gzip": 119412
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1575213,
      "gzip": 316681
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-01-15T21:47:39.825Z",
  "version": "3.0.0-beta.3",
  "files": [{
    "size": {
      "raw": 1570974,
      "gzip": 315654
    },
    "name": "package/dist/ember.prod.js"
  }, {
    "size": {
      "raw": 479286,
      "gzip": 119159
    },
    "name": "package/dist/ember.min.js"
  }]
}, {
  "time": "2018-01-25T19:17:05.629Z",
  "version": "3.0.0-beta.4",
  "files": [{
    "size": {
      "raw": 1551452,
      "gzip": 311812
    },
    "name": "package/dist/ember.prod.js"
  }, {
    "size": {
      "raw": 473799,
      "gzip": 117865
    },
    "name": "package/dist/ember.min.js"
  }]
}, {
  "time": "2018-01-29T21:42:14.727Z",
  "version": "3.0.0-beta.5",
  "files": [{
    "size": {
      "raw": 1553924,
      "gzip": 312432
    },
    "name": "package/dist/ember.prod.js"
  }, {
    "size": {
      "raw": 474061,
      "gzip": 117952
    },
    "name": "package/dist/ember.min.js"
  }]
}, {
  "time": "2018-02-06T03:27:29.182Z",
  "version": "3.0.0-beta.6",
  "files": [{
    "size": {
      "raw": 1554104,
      "gzip": 312218
    },
    "name": "package/dist/ember.prod.js"
  }, {
    "size": {
      "raw": 474061,
      "gzip": 117951
    },
    "name": "package/dist/ember.min.js"
  }]
}, {
  "time": "2018-02-14T04:46:38.701Z",
  "version": "3.0.0",
  "files": [{
    "size": {
      "raw": 1554221,
      "gzip": 312207
    },
    "name": "package/dist/ember.prod.js"
  }, {
    "size": {
      "raw": 474120,
      "gzip": 117950
    },
    "name": "package/dist/ember.min.js"
  }]
}, {
  "time": "2018-02-14T15:17:30.877Z",
  "version": "3.1.0-beta.1",
  "files": [{
    "size": {
      "raw": 449998,
      "gzip": 116766
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1547114,
      "gzip": 318607
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-02-20T00:19:21.536Z",
  "version": "3.1.0-beta.2",
  "files": [{
    "size": {
      "raw": 450063,
      "gzip": 116790
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1547257,
      "gzip": 318604
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-02-26T19:46:04.385Z",
  "version": "3.1.0-beta.3",
  "files": [{
    "size": {
      "raw": 450601,
      "gzip": 116935
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1547109,
      "gzip": 318509
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-03-05T21:07:22.749Z",
  "version": "3.1.0-beta.4",
  "files": [{
    "size": {
      "raw": 450133,
      "gzip": 116709
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1544699,
      "gzip": 317773
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-03-12T21:51:20.451Z",
  "version": "3.1.0-beta.5",
  "files": [{
    "size": {
      "raw": 450211,
      "gzip": 116738
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1544849,
      "gzip": 317822
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-04-10T21:33:27.943Z",
  "version": "3.1.0",
  "files": [{
    "size": {
      "raw": 450298,
      "gzip": 116745
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1545283,
      "gzip": 317939
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-04-23T20:11:23.616Z",
  "version": "3.1.1",
  "files": [{
    "size": {
      "raw": 451424,
      "gzip": 117047
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1548938,
      "gzip": 318652
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-05-07T21:06:06.749Z",
  "version": "3.1.2",
  "files": [{
    "size": {
      "raw": 451411,
      "gzip": 117073
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1549270,
      "gzip": 318684
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-06-21T17:29:15.096Z",
  "version": "3.1.3",
  "files": [{
    "size": {
      "raw": 451597,
      "gzip": 117123
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1554009,
      "gzip": 320044
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-08-07T22:33:50.587Z",
  "version": "3.1.4",
  "files": [{
    "size": {
      "raw": 451217,
      "gzip": 116961
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1553377,
      "gzip": 319914
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-04-10T22:05:52.454Z",
  "version": "3.2.0-beta.1",
  "files": [{
    "size": {
      "raw": 457338,
      "gzip": 118310
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1577984,
      "gzip": 325560
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-04-17T02:12:10.788Z",
  "version": "3.2.0-beta.2",
  "files": [{
    "size": {
      "raw": 457733,
      "gzip": 118393
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1578976,
      "gzip": 325748
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-04-23T19:38:17.523Z",
  "version": "3.2.0-beta.3",
  "files": [{
    "size": {
      "raw": 458358,
      "gzip": 118493
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1581808,
      "gzip": 326283
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-05-07T22:04:46.578Z",
  "version": "3.2.0-beta.4",
  "files": [{
    "size": {
      "raw": 458377,
      "gzip": 118470
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1582651,
      "gzip": 326449
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-05-14T22:58:02.036Z",
  "version": "3.2.0-beta.5",
  "files": [{
    "size": {
      "raw": 458377,
      "gzip": 118470
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1582651,
      "gzip": 326449
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-06-01T03:35:39.928Z",
  "version": "3.2.0",
  "files": [{
    "size": {
      "raw": 458556,
      "gzip": 118411
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1582984,
      "gzip": 326248
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-06-19T15:52:26.944Z",
  "version": "3.2.1",
  "files": [{
    "size": {
      "raw": 458562,
      "gzip": 118415
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1583296,
      "gzip": 326282
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-06-21T16:08:27.780Z",
  "version": "3.2.2",
  "files": [{
    "size": {
      "raw": 458762,
      "gzip": 118476
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1588041,
      "gzip": 327603
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-06-11T20:44:03.843Z",
  "version": "3.3.0-beta.2",
  "files": [{
    "size": {
      "raw": 678748,
      "gzip": 155349
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1990590,
      "gzip": 378370
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-06-19T03:54:16.581Z",
  "version": "3.3.0-beta.3",
  "files": [{
    "size": {
      "raw": 678755,
      "gzip": 155352
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1990658,
      "gzip": 378373
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-06-25T21:27:41.454Z",
  "version": "3.3.0-beta.4",
  "files": [{
    "size": {
      "raw": 679264,
      "gzip": 155478
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1981977,
      "gzip": 376252
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-07-03T04:25:25.050Z",
  "version": "3.3.0-beta.5",
  "files": [{
    "size": {
      "raw": 467642,
      "gzip": 121345
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1630257,
      "gzip": 332032
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-07-16T20:42:04.411Z",
  "version": "3.3.0",
  "files": [{
    "size": {
      "raw": 467635,
      "gzip": 121338
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1630243,
      "gzip": 332020
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-07-23T21:30:46.556Z",
  "version": "3.3.1",
  "files": [{
    "size": {
      "raw": 467635,
      "gzip": 121338
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1630245,
      "gzip": 332012
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-08-20T21:30:11.855Z",
  "version": "3.3.2",
  "files": [{
    "size": {
      "raw": 467542,
      "gzip": 121307
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1630256,
      "gzip": 332069
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-07-16T22:12:19.118Z",
  "version": "3.4.0-beta.1",
  "files": [{
    "size": {
      "raw": 468206,
      "gzip": 121379
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1633348,
      "gzip": 332720
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-08-07T02:08:03.929Z",
  "version": "3.4.0-beta.2",
  "files": [{
    "size": {
      "raw": 468096,
      "gzip": 121345
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1633190,
      "gzip": 332693
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-08-21T03:58:43.080Z",
  "version": "3.4.0-beta.3",
  "files": [{
    "size": {
      "raw": 468751,
      "gzip": 121546
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1635333,
      "gzip": 333239
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-08-28T01:03:24.172Z",
  "version": "3.4.0",
  "files": [{
    "size": {
      "raw": 468744,
      "gzip": 121539
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1635319,
      "gzip": 333228
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-09-10T19:32:36.659Z",
  "version": "3.4.1",
  "files": [{
    "size": {
      "raw": 468862,
      "gzip": 121558
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1635542,
      "gzip": 333246
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-09-25T02:05:47.163Z",
  "version": "3.4.2",
  "files": [{
    "size": {
      "raw": 468898,
      "gzip": 121573
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1635593,
      "gzip": 333307
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-09-25T20:53:09.324Z",
  "version": "3.4.3",
  "files": [{
    "size": {
      "raw": 468880,
      "gzip": 121579
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1635141,
      "gzip": 333153
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-09-27T17:18:12.411Z",
  "version": "3.4.4",
  "files": [{
    "size": {
      "raw": 468946,
      "gzip": 121612
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1635412,
      "gzip": 333241
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-10-05T01:04:20.935Z",
  "version": "3.4.5",
  "files": [{
    "size": {
      "raw": 469698,
      "gzip": 121830
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1638068,
      "gzip": 333704
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-10-29T17:42:54.556Z",
  "version": "3.4.6",
  "files": [{
    "size": {
      "raw": 469695,
      "gzip": 121829
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1637627,
      "gzip": 333530
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-12-07T21:14:40.317Z",
  "version": "3.4.7",
  "files": [{
    "size": {
      "raw": 469898,
      "gzip": 121912
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1638321,
      "gzip": 333633
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-01-22T23:06:44.093Z",
  "version": "3.4.8",
  "files": [{
    "size": {
      "raw": 468817,
      "gzip": 121609
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1635086,
      "gzip": 333034
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-08-28T13:39:23.657Z",
  "version": "3.5.0-beta.1",
  "files": [{
    "size": {
      "raw": 468663,
      "gzip": 121522
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1635307,
      "gzip": 333222
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-09-10T21:36:57.282Z",
  "version": "3.5.0-beta.2",
  "files": [{
    "size": {
      "raw": 468864,
      "gzip": 121551
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1635643,
      "gzip": 333259
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-09-25T04:34:39.775Z",
  "version": "3.5.0-beta.3",
  "files": [{
    "size": {
      "raw": 468992,
      "gzip": 121594
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1635959,
      "gzip": 333359
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-10-02T00:36:42.285Z",
  "version": "3.5.0-beta.4",
  "files": [{
    "size": {
      "raw": 469040,
      "gzip": 121634
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1635778,
      "gzip": 333293
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-10-09T04:22:24.944Z",
  "version": "3.5.0",
  "files": [{
    "size": {
      "raw": 469033,
      "gzip": 121628
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1635765,
      "gzip": 333280
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-10-29T20:56:26.726Z",
  "version": "3.5.1",
  "files": [{
    "size": {
      "raw": 469782,
      "gzip": 121844
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1637978,
      "gzip": 333573
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-10-09T05:11:00.922Z",
  "version": "3.6.0-beta.1",
  "files": [{
    "size": {
      "raw": 475900,
      "gzip": 121301
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1657333,
      "gzip": 330376
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-10-30T00:24:19.874Z",
  "version": "3.6.0-beta.2",
  "files": [{
    "size": {
      "raw": 476804,
      "gzip": 121572
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1662096,
      "gzip": 331370
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-11-06T04:51:23.704Z",
  "version": "3.6.0-beta.3",
  "files": [{
    "size": {
      "raw": 477009,
      "gzip": 121613
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1662602,
      "gzip": 331447
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-11-13T04:12:16.145Z",
  "version": "3.6.0-beta.4",
  "files": [{
    "size": {
      "raw": 477227,
      "gzip": 121674
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1665095,
      "gzip": 331815
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-12-07T00:56:44.363Z",
  "version": "3.6.0",
  "files": [{
    "size": {
      "raw": 415019,
      "gzip": 115400
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1788820,
      "gzip": 372038
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-12-18T23:53:24.192Z",
  "version": "3.6.1",
  "files": [{
    "size": {
      "raw": 415381,
      "gzip": 115505
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1790115,
      "gzip": 372329
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-12-07T02:02:14.193Z",
  "version": "3.7.0-beta.1",
  "files": [{
    "size": {
      "raw": 415051,
      "gzip": 115452
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1790843,
      "gzip": 372397
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-12-18T01:24:48.615Z",
  "version": "3.7.0-beta.2",
  "files": [{
    "size": {
      "raw": 415520,
      "gzip": 115564
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1792902,
      "gzip": 372815
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2018-12-24T22:29:26.267Z",
  "version": "3.7.0-beta.3",
  "files": [{
    "size": {
      "raw": 415520,
      "gzip": 115564
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1792518,
      "gzip": 372703
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-01-07T22:16:28.225Z",
  "version": "3.7.0",
  "files": [{
    "size": {
      "raw": 415514,
      "gzip": 115560
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1792507,
      "gzip": 372708
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-01-21T21:03:46.225Z",
  "version": "3.7.1",
  "files": [{
    "size": {
      "raw": 415427,
      "gzip": 115535
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1792283,
      "gzip": 372666
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-01-23T00:18:57.148Z",
  "version": "3.7.2",
  "files": [{
    "size": {
      "raw": 415303,
      "gzip": 115499
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1791338,
      "gzip": 372607
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-02-06T17:53:37.028Z",
  "version": "3.7.3",
  "files": [{
    "size": {
      "raw": 415341,
      "gzip": 115515
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1791561,
      "gzip": 372660
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-01-07T23:06:19.256Z",
  "version": "3.8.0-beta.1",
  "files": [{
    "size": {
      "raw": 412517,
      "gzip": 114476
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1670498,
      "gzip": 368567
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-01-15T00:41:33.656Z",
  "version": "3.8.0-beta.2",
  "files": [{
    "size": {
      "raw": 412430,
      "gzip": 114452
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1670355,
      "gzip": 368521
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-01-29T05:02:04.914Z",
  "version": "3.8.0-beta.3",
  "files": [{
    "size": {
      "raw": 411682,
      "gzip": 114204
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1667996,
      "gzip": 367902
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-02-05T03:52:52.350Z",
  "version": "3.8.0-beta.4",
  "files": [{
    "size": {
      "raw": 411682,
      "gzip": 114204
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1667996,
      "gzip": 367901
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-02-12T03:42:09.424Z",
  "version": "3.8.0-beta.5",
  "files": [{
    "size": {
      "raw": 411720,
      "gzip": 114219
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1670359,
      "gzip": 368339
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-02-18T22:51:16.059Z",
  "version": "3.8.0",
  "files": [{
    "size": {
      "raw": 411713,
      "gzip": 114213
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1670345,
      "gzip": 368325
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-04-03T04:01:24.510Z",
  "version": "3.8.1",
  "files": [{
    "size": {
      "raw": 411784,
      "gzip": 114252
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1670836,
      "gzip": 368497
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-06-04T15:25:21.883Z",
  "version": "3.8.2",
  "files": [{
    "size": {
      "raw": 413175,
      "gzip": 114338
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1675910,
      "gzip": 368999
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-06-28T12:39:25.900Z",
  "version": "3.8.3",
  "files": [{
    "size": {
      "raw": 413198,
      "gzip": 114350
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1676030,
      "gzip": 369043
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-02-19T00:39:03.230Z",
  "version": "3.9.0-beta.1",
  "files": [{
    "size": {
      "raw": 413587,
      "gzip": 114900
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1691775,
      "gzip": 372876
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-02-27T04:05:24.572Z",
  "version": "3.9.0-beta.2",
  "files": [{
    "size": {
      "raw": 412366,
      "gzip": 114381
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1682502,
      "gzip": 370714
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-03-04T23:15:38.863Z",
  "version": "3.9.0-beta.3",
  "files": [{
    "size": {
      "raw": 412442,
      "gzip": 114430
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1683020,
      "gzip": 370893
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-03-12T02:37:20.813Z",
  "version": "3.9.0-beta.4",
  "files": [{
    "size": {
      "raw": 412960,
      "gzip": 114570
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1684380,
      "gzip": 371143
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-03-25T23:29:42.294Z",
  "version": "3.9.0-beta.5",
  "files": [{
    "size": {
      "raw": 412960,
      "gzip": 114570
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1685804,
      "gzip": 371661
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-04-02T05:41:25.360Z",
  "version": "3.9.0",
  "files": [{
    "size": {
      "raw": 412975,
      "gzip": 114573
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1685310,
      "gzip": 371520
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-04-09T17:28:24.217Z",
  "version": "3.9.1",
  "files": [{
    "size": {
      "raw": 412928,
      "gzip": 114562
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1687542,
      "gzip": 372020
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-04-03T04:23:56.748Z",
  "version": "3.10.0-beta.1",
  "files": [{
    "size": {
      "raw": 415163,
      "gzip": 115513
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1765912,
      "gzip": 384900
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-04-09T02:09:44.394Z",
  "version": "3.10.0-beta.2",
  "files": [{
    "size": {
      "raw": 414200,
      "gzip": 115294
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1770688,
      "gzip": 384922
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-04-16T01:48:40.791Z",
  "version": "3.10.0-beta.3",
  "files": [{
    "size": {
      "raw": 415135,
      "gzip": 115302
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1776914,
      "gzip": 385644
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-04-23T03:43:44.264Z",
  "version": "3.10.0-beta.4",
  "files": [{
    "size": {
      "raw": 415137,
      "gzip": 115303
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1776528,
      "gzip": 385622
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-04-30T04:19:16.392Z",
  "version": "3.10.0-beta.5",
  "files": [{
    "size": {
      "raw": 415280,
      "gzip": 115339
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1777259,
      "gzip": 385827
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-05-13T20:41:53.602Z",
  "version": "3.10.0",
  "files": [{
    "size": {
      "raw": 415300,
      "gzip": 115339
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1777305,
      "gzip": 385825
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-06-04T15:56:14.511Z",
  "version": "3.10.1",
  "files": [{
    "size": {
      "raw": 415684,
      "gzip": 115413
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1778234,
      "gzip": 385961
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-06-18T14:06:08.009Z",
  "version": "3.10.2",
  "files": [{
    "size": {
      "raw": 415690,
      "gzip": 115419
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1778999,
      "gzip": 386099
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-05-14T02:37:19.525Z",
  "version": "3.11.0-beta.1",
  "files": [{
    "size": {
      "raw": 421529,
      "gzip": 117259
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1819144,
      "gzip": 394186
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-06-03T20:07:24.587Z",
  "version": "3.11.0-beta.2",
  "files": [{
    "size": {
      "raw": 421564,
      "gzip": 117265
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1819186,
      "gzip": 394201
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-06-11T11:04:23.517Z",
  "version": "3.11.0-beta.3",
  "files": [{
    "size": {
      "raw": 422035,
      "gzip": 117363
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1820362,
      "gzip": 394358
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-06-18T05:53:59.727Z",
  "version": "3.11.0-beta.4",
  "files": [{
    "size": {
      "raw": 422041,
      "gzip": 117363
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1824611,
      "gzip": 395526
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-06-25T03:53:05.991Z",
  "version": "3.11.0",
  "files": [{
    "size": {
      "raw": 422050,
      "gzip": 117376
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1824623,
      "gzip": 395528
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-06-28T05:00:55.687Z",
  "version": "3.11.1",
  "files": [{
    "size": {
      "raw": 422073,
      "gzip": 117392
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1824743,
      "gzip": 395581
    },
    "name": "package/dist/ember.prod.js"
  }]
}, {
  "time": "2019-06-27T16:30:46.883Z",
  "version": "3.12.0-beta.1",
  "files": [{
    "size": {
      "raw": 421879,
      "gzip": 117518
    },
    "name": "package/dist/ember.min.js"
  }, {
    "size": {
      "raw": 1827821,
      "gzip": 396005
    },
    "name": "package/dist/ember.prod.js"
  }]
}];
},{}],"index.js":[function(require,module,exports) {
"use strict";

require("flexboxgrid2/flexboxgrid2.min.css");

const semver = require('semver');

const sizes = require('./meta/ember-source.json');

const wrapper = document.querySelector('#charts-wrapper'); // todo: this will fail if we have uneven amount of files

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

const addCanvas = fileName => {
  const div = document.createElement('div');
  div.className = 'canvas__wrapper col-xl-6 col-sm-12 col-xs-12';
  const title = document.createElement('h2');
  title.innerText = fileName;
  div.appendChild(title);
  const canvas = document.createElement('canvas');
  div.appendChild(canvas);
  wrapper.appendChild(div);
  return canvas.getContext("2d");
};

async function boot(file) {
  const ctx = addCanvas(file);
  const data = sizes.map(size => ({
    time: size.time,
    date: new Date(size.time),
    version: size.version,
    ...size.files.find(f => f.name === file)
  })).sort((a, b) => semver.compare(a.version, b.version));
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
        lineTension: 0
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
        lineTension: 0
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
        }]
      },
      tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
          title: function ([{
            index
          }]) {
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
            enabled: true,
            // enable trace line syncing with other charts
            group: 1,
            // chart group
            suppressTooltips: false // suppress tooltips when showing a synced tracer

          }
        }
      }
    }
  });
}

files.forEach(boot);
},{"flexboxgrid2/flexboxgrid2.min.css":"node_modules/flexboxgrid2/flexboxgrid2.min.css","semver":"node_modules/semver/semver.js","./meta/ember-source.json":"meta/ember-source.json"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "46749" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/ember-size-tracker.e31bb0bc.js.map