/**
* @preserve HTML5 Shiv v3.6.2 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
*/
;(function(window, document) {
/*jshint evil:true */
  /** version */
  var version = '3.6.2';

  /** Preset options */
  var options = window.html5 || {};

  /** Used to skip problem elements */
  var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

  /** Not all elements can be cloned in IE **/
  var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

  /** Detect whether the browser supports default html5 styles */
  var supportsHtml5Styles;

  /** Name of the expando, to work with multiple documents or to re-shiv one document */
  var expando = '_html5shiv';

  /** The id for the the documents expando */
  var expanID = 0;

  /** Cached data for each document */
  var expandoData = {};

  /** Detect whether the browser supports unknown elements */
  var supportsUnknownElements;

  (function() {
    try {
        var a = document.createElement('a');
        a.innerHTML = '<xyz></xyz>';
        //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
        supportsHtml5Styles = ('hidden' in a);

        supportsUnknownElements = a.childNodes.length == 1 || (function() {
          // assign a false positive if unable to shiv
          (document.createElement)('a');
          var frag = document.createDocumentFragment();
          return (
            typeof frag.cloneNode == 'undefined' ||
            typeof frag.createDocumentFragment == 'undefined' ||
            typeof frag.createElement == 'undefined'
          );
        }());
    } catch(e) {
      // assign a false positive if detection fails => unable to shiv
      supportsHtml5Styles = true;
      supportsUnknownElements = true;
    }

  }());

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a style sheet with the given CSS text and adds it to the document.
   * @private
   * @param {Document} ownerDocument The document.
   * @param {String} cssText The CSS text.
   * @returns {StyleSheet} The style element.
   */
  function addStyleSheet(ownerDocument, cssText) {
    var p = ownerDocument.createElement('p'),
        parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

    p.innerHTML = 'x<style>' + cssText + '</style>';
    return parent.insertBefore(p.lastChild, parent.firstChild);
  }

  /**
   * Returns the value of `html5.elements` as an array.
   * @private
   * @returns {Array} An array of shived element node names.
   */
  function getElements() {
    var elements = html5.elements;
    return typeof elements == 'string' ? elements.split(' ') : elements;
  }

    /**
   * Returns the data associated to the given document
   * @private
   * @param {Document} ownerDocument The document.
   * @returns {Object} An object of data.
   */
  function getExpandoData(ownerDocument) {
    var data = expandoData[ownerDocument[expando]];
    if (!data) {
        data = {};
        expanID++;
        ownerDocument[expando] = expanID;
        expandoData[expanID] = data;
    }
    return data;
  }

  /**
   * returns a shived element for the given nodeName and document
   * @memberOf html5
   * @param {String} nodeName name of the element
   * @param {Document} ownerDocument The context document.
   * @returns {Object} The shived element.
   */
  function createElement(nodeName, ownerDocument, data){
    if (!ownerDocument) {
        ownerDocument = document;
    }
    if(supportsUnknownElements){
        return ownerDocument.createElement(nodeName);
    }
    if (!data) {
        data = getExpandoData(ownerDocument);
    }
    var node;

    if (data.cache[nodeName]) {
        node = data.cache[nodeName].cloneNode();
    } else if (saveClones.test(nodeName)) {
        node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
    } else {
        node = data.createElem(nodeName);
    }

    // Avoid adding some elements to fragments in IE < 9 because
    // * Attributes like `name` or `type` cannot be set/changed once an element
    //   is inserted into a document/fragment
    // * Link elements with `src` attributes that are inaccessible, as with
    //   a 403 response, will cause the tab/window to crash
    // * Script elements appended to fragments will execute when their `src`
    //   or `text` property is set
    return node.canHaveChildren && !reSkip.test(nodeName) ? data.frag.appendChild(node) : node;
  }

  /**
   * returns a shived DocumentFragment for the given document
   * @memberOf html5
   * @param {Document} ownerDocument The context document.
   * @returns {Object} The shived DocumentFragment.
   */
  function createDocumentFragment(ownerDocument, data){
    if (!ownerDocument) {
        ownerDocument = document;
    }
    if(supportsUnknownElements){
        return ownerDocument.createDocumentFragment();
    }
    data = data || getExpandoData(ownerDocument);
    var clone = data.frag.cloneNode(),
        i = 0,
        elems = getElements(),
        l = elems.length;
    for(;i<l;i++){
        clone.createElement(elems[i]);
    }
    return clone;
  }

  /**
   * Shivs the `createElement` and `createDocumentFragment` methods of the document.
   * @private
   * @param {Document|DocumentFragment} ownerDocument The document.
   * @param {Object} data of the document.
   */
  function shivMethods(ownerDocument, data) {
    if (!data.cache) {
        data.cache = {};
        data.createElem = ownerDocument.createElement;
        data.createFrag = ownerDocument.createDocumentFragment;
        data.frag = data.createFrag();
    }


    ownerDocument.createElement = function(nodeName) {
      //abort shiv
      if (!html5.shivMethods) {
          return data.createElem(nodeName);
      }
      return createElement(nodeName, ownerDocument, data);
    };

    ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
      'var n=f.cloneNode(),c=n.createElement;' +
      'h.shivMethods&&(' +
        // unroll the `createElement` calls
        getElements().join().replace(/\w+/g, function(nodeName) {
          data.createElem(nodeName);
          data.frag.createElement(nodeName);
          return 'c("' + nodeName + '")';
        }) +
      ');return n}'
    )(html5, data.frag);
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Shivs the given document.
   * @memberOf html5
   * @param {Document} ownerDocument The document to shiv.
   * @returns {Document} The shived document.
   */
  function shivDocument(ownerDocument) {
    if (!ownerDocument) {
        ownerDocument = document;
    }
    var data = getExpandoData(ownerDocument);

    if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
      data.hasCSS = !!addStyleSheet(ownerDocument,
        // corrects block display not defined in IE6/7/8/9
        'article,aside,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
        // adds styling not present in IE6/7/8/9
        'mark{background:#FF0;color:#000}'
      );
    }
    if (!supportsUnknownElements) {
      shivMethods(ownerDocument, data);
    }
    return ownerDocument;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * The `html5` object is exposed so that more elements can be shived and
   * existing shiving can be detected on iframes.
   * @type Object
   * @example
   *
   * // options can be changed before the script is included
   * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
   */
  var html5 = {

    /**
     * An array or space separated string of node names of the elements to shiv.
     * @memberOf html5
     * @type Array|String
     */
    'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup main mark meter nav output progress section summary time video',

    /**
     * current version of html5shiv
     */
    'version': version,

    /**
     * A flag to indicate that the HTML5 style sheet should be inserted.
     * @memberOf html5
     * @type Boolean
     */
    'shivCSS': (options.shivCSS !== false),

    /**
     * Is equal to true if a browser supports creating unknown/HTML5 elements
     * @memberOf html5
     * @type boolean
     */
    'supportsUnknownElements': supportsUnknownElements,

    /**
     * A flag to indicate that the document's `createElement` and `createDocumentFragment`
     * methods should be overwritten.
     * @memberOf html5
     * @type Boolean
     */
    'shivMethods': (options.shivMethods !== false),

    /**
     * A string to describe the type of `html5` object ("default" or "default print").
     * @memberOf html5
     * @type String
     */
    'type': 'default',

    // shivs the document according to the specified `html5` object options
    'shivDocument': shivDocument,

    //creates a shived element
    createElement: createElement,

    //creates a shived documentFragment
    createDocumentFragment: createDocumentFragment
  };

  /*--------------------------------------------------------------------------*/

  // expose html5
  window.html5 = html5;

  // shiv the document
  shivDocument(document);

}(this, document));
var EventEmitter = new Function ();

EventEmitter.prototype.initEventEmitter = function () {
    this._listeners = {};
};

EventEmitter.prototype.initEventEmitterType = function (type) {
    if (!type) {
        return;
    }
    this._listeners[type] = [];
};

EventEmitter.prototype.hasEventListener = function (type, fn) {
    if (!this.listener) {
        return false;
    }

    if (type && !this.listener[type]) {
        return false;
    }

    return true;
};

EventEmitter.prototype.addListener = function (type, fn) {
    if (!this._listeners) {
        this.initEventEmitter();
    }
    if (!this._listeners[type]) {
        this.initEventEmitterType(type);
    }
    this._listeners[type].push(fn);

    this.emit('newListener', type, fn);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function (type, fn) {
    fn._onceListener = true;
    this.addListener(type, fn);
};

EventEmitter.prototype.removeListener = function (type, fn) {
    if (!this._listeners) {
        return;
    }
    if (!this._listeners[type]) {
        return;
    }
    if (!this._listeners[type].forEach) {
        return;
    }

    if (!type) {
        this.initEventEmitter();
        this.emit('removeListener', type, fn);
        return;
    }
    if (!fn) {
        this.initEventEmitterType(type);
        this.emit('removeListener', type, fn);
        return;
    }

    var self = this;
    this._listeners[type].forEach(function (listener, index) {
        if (listener === fn) {
            self._listeners[type].splice(index, 1);
        }
    });
    this.emit('removeListener', type, fn);
};

EventEmitter.prototype.emit = function (type) {
    if (!this._listeners) {
        return;
    }
    if (!this._listeners[type]) {
        return;
    }
    if (!this._listeners[type].forEach) {
        return;
    }

    var self = this,
        args = [].slice.call(arguments, 1);

    this._listeners[type].forEach(function (listener) {
        listener.apply(self, args);
        if (listener._onceListener) {
            self.removeListener(type, listener);
        }
    });
};

EventEmitter.prototype.listeners = function (type) {
    if (!type) {
        return undefined;
    }
    return this._listeners[type];
};

// jquery style alias
EventEmitter.prototype.trigger = EventEmitter.prototype.emit;
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
var inherits = function (Child, Parent) {
    for (var i in Parent.prototype) {
        if (Child.prototype[i]) {
            continue;
        }
        Child.prototype[i] = Parent.prototype[i];
    }
};
var Ticker = function (opts) {
    this.clock = opts.clock || 20;

    this.startTime = null;

    this.periods = {};

    this.initLoop();
};
inherits(Ticker, EventEmitter);

Ticker.prototype.initLoop = function () {
    this.loop = null;
};

Ticker.prototype.start = function () {
    var self = this;
    
    this.startTime = +(new Date());

    this.loop = setInterval(function () {
        self.processTick();
    }, this.clock);
};

Ticker.prototype.stop = function () {
    if (!this.loop) {
        return;
    }
    clearInterval(this.loop);
    this.initLoop();
};

Ticker.prototype.processTick = function () {
    var clock = this.clock;
    var periods = this.periods;
    var currentTime = +(new Date());

    this.emit('tick', {
        time: currentTime - this.startTime,
        periods: periods
    });

    var value, name, duration;
    for (name in periods) {
        duration = periods[name].duration;
        value = (currentTime - periods[name].startTime) / duration;
        periods[name].value = value;
    }

    for (name in periods) {
        if (periods[name].value >= 1) {
            this.emit('period:' + name);
            periods[name].value -= 1;
        }
    }
};

Ticker.prototype.addPeriod = function (name, duration) {
    this.periods[name] = {
        duration: duration
    };

    this.initPeriod(name);
};

Ticker.prototype.initPeriod = function (name) {
    if (!this.periods[name]) {
        return;
    }

    this.periods[name].startTime = +(new Date());
    this.periods[name].value = 0;
};

Ticker.prototype.emit = function (type) {
    EventEmitter.prototype.emit.apply(this, arguments);
};

var LightView = function (el) {
    this.el = el;
};

LightView.prototype.on = function (type, fn) {
    var el = this.el;

    if (el.addEventListener) {
        el.addEventListener(type, fn, false);
    } else if (el.attachEvent) {
        el.attachEvent('on' + type, fn);
    }
};

var EventEmitter = new Function ();

EventEmitter.prototype.initEventEmitter = function () {
    this._listeners = {};
};

EventEmitter.prototype.initEventEmitterType = function (type) {
    if (!type) {
        return;
    }
    this._listeners[type] = [];
};

EventEmitter.prototype.hasEventListener = function (type, fn) {
    if (!this.listener) {
        return false;
    }

    if (type && !this.listener[type]) {
        return false;
    }

    return true;
};

EventEmitter.prototype.addListener = function (type, fn) {
    if (!this._listeners) {
        this.initEventEmitter();
    }
    if (!this._listeners[type]) {
        this.initEventEmitterType(type);
    }
    this._listeners[type].push(fn);

    this.emit('newListener', type, fn);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function (type, fn) {
    fn._onceListener = true;
    this.addListener(type, fn);
};

EventEmitter.prototype.removeListener = function (type, fn) {
    if (!this._listeners) {
        return;
    }
    if (!this._listeners[type]) {
        return;
    }
    if (!this._listeners[type].forEach) {
        return;
    }

    if (!type) {
        this.initEventEmitter();
        this.emit('removeListener', type, fn);
        return;
    }
    if (!fn) {
        this.initEventEmitterType(type);
        this.emit('removeListener', type, fn);
        return;
    }

    var self = this;
    this._listeners[type].forEach(function (listener, index) {
        if (listener === fn) {
            self._listeners[type].splice(index, 1);
        }
    });
    this.emit('removeListener', type, fn);
};

EventEmitter.prototype.emit = function (type) {
    if (!this._listeners) {
        return;
    }
    if (!this._listeners[type]) {
        return;
    }
    if (!this._listeners[type].forEach) {
        return;
    }

    var self = this,
        args = [].slice.call(arguments, 1);

    this._listeners[type].forEach(function (listener) {
        listener.apply(self, args);
        if (listener._onceListener) {
            self.removeListener(type, listener);
        }
    });
};

EventEmitter.prototype.listeners = function (type) {
    if (!type) {
        return undefined;
    }
    return this._listeners[type];
};

// jquery style alias
EventEmitter.prototype.trigger = EventEmitter.prototype.emit;
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
var inherits = function (Child, Parent) {
    for (var i in Parent.prototype) {
        if (Child.prototype[i]) {
            continue;
        }
        Child.prototype[i] = Parent.prototype[i];
    }
};
(function (exports) {
    var Winstatus = function (opts) {
        this.windowWidth = 0;
        this.windowHeight = 0;
        this.scrollX = 0;
        this.scrollY = 0;

        this.updateWindowSize();
        this.updateScroll();

        this.initListeners();
    };
    inherits(Winstatus, EventEmitter);

    Winstatus.prototype.initListeners = function () {
        var self = this;
        var windowView = new LightView(window);
        var documentView = new LightView(document);

        windowView.on('load', function () {
            self.updateWindowSize();
            self.updateScroll();
        });

        windowView.on('resize', function () {
            self.updateWindowSize();
        });
        windowView.on('scroll', function () {
            self.updateScroll();
        });
        documentView.on('scroll', function () {
            self.updateScroll();
        });
    };

    Winstatus.prototype.updateWindowSize = function () {
        this.windowWidth = window.innerWidth || document.body.clientWidth || 0;
        this.windowHeight = window.innerHeight || document.body.clientHeight || 0;
        this.emit('resize', this);
        this.emit('change', this);
    };

    Winstatus.prototype.updateScroll = function () {
        this.scrollX = (document.body.scrollLeft || document.documentElement.scrollLeft || window.scrollLeft || 0);
        this.scrollY = (document.body.scrollTop || document.documentElement.scrollTop || window.scrollTop || 0);
        this.emit('scroll', this);
        this.emit('change', this);
    };

    exports.Winstatus = Winstatus;
})(window);

(function (win) {
    var ToneMap = function (soundPaths) {
        this.soundPaths = soundPaths || {};
        this.initContext();
    };
    inherits(ToneMap, EventEmitter);

    ToneMap.prototype.initContext = function () {
        var AudioContext = getAudioContext();
        var context = new AudioContext();
        this.context = context;
    };

    ToneMap.prototype.load = function () {
        var self = this;

        var soundPaths = this.soundPaths;
        var context = this.context;

        var buffers = {};

        var sounds = [];
        for (var name in soundPaths) {
            sounds.push({
                name: name,
                path: soundPaths[name]
            });
        }

        var loaded = 0;
        function progressLoading () {
            loaded++;
            if (sounds.length <= loaded) {
                self.buffers = buffers;
                self.emit('load');
            }
        }

        sounds.forEach(function (sound) {
            requestArrayBuffer(sound.path, function (res) {
                context.decodeAudioData(res, function (buf) {
                    buffers[sound.name] = buf;
                    progressLoading();
                });
            });
        });
    };

    ToneMap.prototype.play = function (name, opts) {
        opts = opts || {};

        var context = this.context;
        var buffer = this.buffers[name];

        if (!buffer) {
            throw Error('buffer "' + name + '" is not found!');
        }

        var source = context.createBufferSource();
        source.buffer = buffer;
        source.playbackRate.value = opts.playbackRate || 1.0;
        source.connect(context.destination);
        source.noteOn(0);
    };
    


    // short libraries

    var getAudioContext = function () {
        try {
            var AudioContext = window.AudioContext || window.webkitAudioContext;
            return AudioContext;
        } catch(e) {
            alert('Web Audio API is not supported in this browser');
        }
    };

    var async = function (fns) {
        (function exec (index) {
            if (!fns[index]) {
                return;
            }
            fns[index](function () {
                exec(index + 1);
            });
        })(0);
    };

    var requestArrayBuffer = function (path, callback) {
        var request = new XMLHttpRequest();
        request.open('GET', path, true);
        request.responseType = 'arraybuffer';
        
        request.send();
        request.onload = function () {
            callback(request.response);
        };
    };

    win.ToneMap = ToneMap;
})(window);

var MetroTones = function () {
    var prepared = false;
    this.initToneMap();
};

MetroTones.prototype.initToneMap = function () {
    var self = this;
    var toneMap = new ToneMap({
        tap: '/sounds/tap.wav'
    });

    toneMap.on('load', function () {
        self.prepared = true;
    });
    toneMap.load();

    this.toneMap = toneMap;
};

MetroTones.prototype.play = function (speed) {
    if (!this.prepared) {
        return;
    }

    speed = speed || 1.0;

    this.toneMap.play('tap', {
        playbackRate: speed
    });
};







var DripView = function (opts) {
    this.el = opts.el || document.createElement('canvas');
    this.clock = opts.clock || 0;

    this.width = 0;
    this.height = 0;

    this.prevValue = 0;

    this.ctx = this.el.getContext('2d');

    this.updateClock(this.clock);
};
inherits(DripView, EventEmitter);

DripView.prototype.updateClock = function (clock) {
    this.clock = clock;
};

DripView.prototype.resizeCanvas = function (w, h) {
    var el = this.el;
    el.width = this.width = w;
    el.height = this.height = h;
};

DripView.prototype.clear = function () {
    this.el.width = this.width;
};

DripView.prototype.draw = function (e) {
    var ctx = this.ctx;
    var width = this.width;
    var height = this.height;
    var clock = this.clock;

    var curveWidth = width * 0.1;

    var time = e.time;
    var value = (time % clock) / clock;

    function easing (t) {
        return t * t * t;
    }

    var maxHeight = height * 0.1;
    var dropHeight = (0.5 + 0.5 * -Math.cos(Math.PI * 2 * easing(value))) * maxHeight;
    var size = 15;
    var pos;

    if (easing(value) < 0.5) {
        pos = dropHeight;
    } else {
        pos = maxHeight + (easing(value) - 0.5) * 2 * (height - maxHeight);
    }

    this.clear();

    ctx.fillStyle = '#3fe4fe';
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
        width * 0.5,              0,
        width * 0.5 - curveWidth, dropHeight,
        width * 0.5,              dropHeight
    );
    ctx.bezierCurveTo(
        width * 0.5 + curveWidth, dropHeight,
        width * 0.5,              0,
        width * 1,                0
    );
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(width * 0.5, pos);
    ctx.arc(width * 0.5, pos - size + size * 2 * easing(value), size, 0, Math.PI * 2);
    ctx.fill();

    this.prevValue = value;
};

var BPMMeter = function (opts) {
    this.numElement = opts.numElement;
    this.downBtnElement = opts.downBtnElement;
    this.upBtnElement = opts.upBtnElement;

    this.initListeners();
};
inherits(BPMMeter, EventEmitter);

BPMMeter.prototype.setBPM = function (bpm) {
    var numElement = this.numElement;
    numElement.innerHTML = this.bpm = bpm;
    this.emit('change', bpm);
};

BPMMeter.prototype.initListeners = function () {
    var self = this;
    
    var numElement = this.numElement;
    var downBtnElement = this.downBtnElement;
    var upBtnElement = this.upBtnElement;

    // click listener
    numElement.addEventListener('click', function () {
        self.emit('click');
    }, false);

    function bpmDown (e) {
        e.preventDefault();
        self.setBPM(Number(numElement.innerHTML) - 1);
    }

    function bpmUp (e) {
        e.preventDefault();
        self.setBPM(Number(numElement.innerHTML) + 1);
    }

    // touch listener
    downBtnElement.addEventListener('touchstart', bpmDown, false);
    upBtnElement.addEventListener('touchstart', bpmUp, false);
    downBtnElement.addEventListener('touchmove', bpmDown, false);
    upBtnElement.addEventListener('touchmove', bpmUp, false);

    // mouse listener
    var mousedownFlag = false;
    downBtnElement.addEventListener('mousedown', function (e) {
        mousedownFlag = true;
        bpmDown(e);
    }, false);
    upBtnElement.addEventListener('mousedown', function (e) {
        mousedownFlag = true;
        bpmUp(e);
    }, false);

    downBtnElement.addEventListener('mousemove', function (e) {
        if (!mousedownFlag) {
            return;
        }
        bpmDown(e);
    }, false);
    upBtnElement.addEventListener('mousemove', function (e) {
        if (!mousedownFlag) {
            return;
        }
        bpmUp(e);
    }, false);

    downBtnElement.addEventListener('mouseup', function (e) {
        mousedownFlag = false;
    }, false);
    upBtnElement.addEventListener('mouseup', function (e) {
        mousedownFlag = false;
    }, false);
    downBtnElement.addEventListener('mouseout', function (e) {
        mousedownFlag = false;
    }, false);
    upBtnElement.addEventListener('mouseout', function (e) {
        mousedownFlag = false;
    }, false);

};











var Metronom = function () {
    this.clock = 0;
    this.prevRest = 0;
    this.setBPM();
};
inherits(Metronom, EventEmitter);

Metronom.prototype.check = function (e) {
    var time = e.time;
    var clock = this.clock;
    var rest = (time % clock) / clock;

    if (rest < this.prevRest) {
        this.emit('beat');
    }

    this.prevRest = rest;
};

Metronom.prototype.setBPM = function (bpm) {
    bpm = bpm || 0;

    this.bpm = bpm || 0;
    this.clock = (60 / bpm) * 1000;

    this.emit('change', this.clock);
};

(function () {
    var HEADER_HEIGHT = 44;
    var FOOTER_HEIGHT = 44;
    var MAX_WIDTH = 320;

    function init () {
        var viewerElement = document.getElementById('canvas-drip');

        // init metronom
        var metronom = new Metronom();

        // init bpm meter
        var bpmMeter = new BPMMeter({
            numElement: document.getElementById('num-bpm'),
            downBtnElement: document.getElementById('btn-bpmdown'),
            upBtnElement: document.getElementById('btn-bpmup')
        });

        // init dripview
        var dripView = new DripView({
            el: viewerElement
        });

        // init metro tones
        var metroTones = new MetroTones();

        // init winstatus
        var winstatus = new Winstatus();
        winstatus.on('resize', function () {
            dripView.resizeCanvas(
                Math.min(winstatus.windowWidth, MAX_WIDTH),
                winstatus.windowHeight - HEADER_HEIGHT - FOOTER_HEIGHT
            );
        });

        // init ticker
        var ticker = new Ticker({
            clock: 20
        });

        // init events
        ticker.on('tick', function (e) {
            dripView.draw(e);
        });
        ticker.on('tick', function (e) {
            metronom.check(e);
        });

        metronom.on('change', function (clock) {
            dripView.updateClock(clock);
        });

        metronom.on('beat', function () {
            metroTones.play(metronom.bpm / 60);
        });

        bpmMeter.on('change', function (bpm) {
            metronom.setBPM(bpm);
        });

        viewerElement.addEventListener('click', function () {
            if (!ticker.loop) {
                metroTones.play();
                ticker.start();
                viewerElement.className = 'active';
            } else {
                ticker.stop();
                viewerElement.className = null;
            }
        }, false);

        // start
        bpmMeter.setBPM(60);
    }

    window.addEventListener('DOMContentLoaded', init, false);
})();
