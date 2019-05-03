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
})({"src/js/index.js":[function(require,module,exports) {
/**
 * @description catching the html element form#search-form  and asssigning it to a DOM object
 * @const
 * @name searchForm
 * @type {Object} DOM object
 */
var searchForm = document.getElementById("search-form");
/**
 * @description catching the html element button#search-btn  and asssigning it to a DOM object
 * @const
 * @name searchBtn
 * @type {Object} DOM object
 */

var searchBtn = document.getElementById("search-btn");
/**
 * @description catching the html element form#search-input  and asssigning it to a DOM object
 * @const
 * @name searchInput
 * @type {Object} DOM object
 */

var searchInput = document.getElementById("search-input");
/**
    * @description this object dealing with the reddit api usin fetch api
    * @see {@link http://www.reddit.com }
    * @this reddit  object
    * @name search 
    * @param  {string}  searchTerm   represents the word term user is looking for 
    * @param  {number} searchLimit   the number of search result reflect back from the api
    * @param {string}   sortBy       the priority of sorting by latest posts or revelancy
    * @function 
    * @returns {Array<Object>}       each object contains bunch of properties  {title , name ,image}   like so 
    */

function search(searchTerm, searchLimit, sortBy) {
  return fetch("https://www.reddit.com/search.json?q=".concat(searchTerm, "&sort=").concat(sortBy, "&limit=").concat(searchLimit)).then(function (res) {
    return res.json();
  }).then(function (data) {
    return data.data.children.map(function (data) {
      return data.data;
    });
  }).catch(function (err) {
    return console.log(err);
  });
}
/**
 * @description thei most important functio it takes the inputs parameters from the {@link searchform}
 * then passing the via the url from the method {@link search} then getting the respnse then populate the DOM
 * @summary make response/get response /populate the DOM
 * @param {Object} event object
 * @name handleSubmit
 * @function
 */


function handleSubmit(e) {
  // Get sort
  var sortBy = document.querySelector('input[name="sortby"]:checked').value; // Get limit

  var searchLimit = document.getElementById("limit").value; // Get search

  var searchTerm = searchInput.value; // Check for input

  if (searchTerm == "") {
    // Show message
    showMessage("Please add a search term", "alert-danger");
  } // Clear field


  searchInput.value = ""; // Search Reddit

  search(searchTerm, searchLimit, sortBy).then(function (results) {
    var output = '<div class="card-columns">';
    console.log(results);
    results.forEach(function (post) {
      // Check for image
      var image = post.preview ? post.preview.images[0].source.url : "https://cdn.comparitech.com/wp-content/uploads/2017/08/reddit-1.jpg";
      output += "\n            <div class=\"card mb-2\">\n            <img class=\"card-img-top\" src=\"".concat(image, "\" alt=\"Card image cap\">\n            <div class=\"card-body\">\n              <h5 class=\"card-title\">").concat(post.title, "</h5>\n              <p class=\"card-text\">").concat(truncateString(post.selftext, 100), "</p>\n              <a href=\"").concat(post.url, "\" target=\"_blank\n              \" class=\"btn btn-primary\">Read More</a>\n              <hr>\n              <span class=\"badge badge-secondary\">Subreddit: ").concat(post.subreddit, "</span> \n              <span class=\"badge badge-dark\">Score: ").concat(post.score, "</span>\n            </div>\n          </div>\n            ");
    });
    output += "</div>";
    document.getElementById("results").innerHTML = output;
  });
}
/**
 * @description submit event requesting the url and getting back the response viia the {@link handleSubmit}
 * @name submit
 * @event
 * @param {String} submit the name of event to be
 * @param {function} callback callback function takes event object an aparameter
 */


searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  handleSubmit(e);
});
/**
 * @description  if the user doesn't enter proper inputs this message gonnea alert reminding him to do
 * it also gonna fade seconds after
 * @function
 * @name showMessage
 * @param {String} message text to be shown to the user
 * @param {String}  className warning effect is aded to the text
 */

function showMessage(message, className) {
  // Create div
  var div = document.createElement("div"); // Add classes

  div.className = "alert ".concat(className); // Add text

  div.appendChild(document.createTextNode(message)); // Get parent

  var searchContainer = document.getElementById("search-container"); // Get form

  var search = document.getElementById("search"); // Insert alert

  searchContainer.insertBefore(div, search); // Timeout after 3 sec

  setTimeout(function () {
    document.querySelector(".alert").remove();
  }, 3000);
}
/**
 * @description truncating the too long texts
 * @name truncateString
 * @function
 * @param {String} myString  text to be truncated  in case it is too long to show
 * @param {Number} limit     the maximum letters length to be truncated (index to truncate from)
 * @returns {String}   trancated string fitting to be shown
 */


function truncateString(myString, limit) {
  var shortened = myString.indexOf(" ", limit);
  if (shortened == -1) return myString;
  return myString.substring(0, shortened);
}
},{}],"C:/Users/ِABDURRAHMAN/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "61895" + '/');

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
},{}]},{},["C:/Users/ِABDURRAHMAN/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/js/index.js"], null)
//# sourceMappingURL=/js.d818e0ef.js.map