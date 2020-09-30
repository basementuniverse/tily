(function() {
/**
 * @namespace
 */
const Tily = {};

Tily.utility = {
  clamp: function(a, min, max) {
    if (min === undefined) { min = 0; };
    if (max === undefined) { max = 1; };
    return (a < min ? min : (a > max ? max : a));
  },

  lerp: function(a, b, i) {
    return a * (1 - i) + b * i;
  },

  colour: function(c) {
    return `rgba(${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)},${Math.round(c.a * 100) / 100})`;
  },

  outline: function(s) {
    const parts = s.split(' ');
    return {
      width: parseFloat(parts[0]) || 0.1,
      colour: parts[1] || 'transparent'
    };
  },

  shadow: function(s) {
    const parts = s.split(' ');
    return {
      blur: parseFloat(parts[0] || 1),
      xOffset: parseFloat(parts[1] || 0),
      yOffset: parseFloat(parts[2] || 0),
      colour: parts[3]
    };
  },

  parseColor: (function() {
    const names = {
      "aliceblue": "f0f8ff",
      "antiquewhite": "faebd7",
      "aqua": "0ff",
      "aquamarine": "7fffd4",
      "azure": "f0ffff",
      "beige": "f5f5dc",
      "bisque": "ffe4c4",
      "black": "000",
      "blanchedalmond": "ffebcd",
      "blue": "00f",
      "blueviolet": "8a2be2",
      "brown": "a52a2a",
      "burlywood": "deb887",
      "cadetblue": "5f9ea0",
      "chartreuse": "7fff00",
      "chocolate": "d2691e",
      "coral": "ff7f50",
      "cornflowerblue": "6495ed",
      "cornsilk": "fff8dc",
      "crimson": "dc143c",
      "cyan": "0ff",
      "darkblue": "00008b",
      "darkcyan": "008b8b",
      "darkgoldenrod": "b8860b",
      "darkgray": "a9a9a9",
      "darkgreen": "006400",
      "darkgrey": "a9a9a9",
      "darkkhaki": "bdb76b",
      "darkmagenta": "8b008b",
      "darkolivegreen": "556b2f",
      "darkorange": "ff8c00",
      "darkorchid": "9932cc",
      "darkred": "8b0000",
      "darksalmon": "e9967a",
      "darkseagreen": "8fbc8f",
      "darkslateblue": "483d8b",
      "darkslategray": "2f4f4f",
      "darkslategrey": "2f4f4f",
      "darkturquoise": "00ced1",
      "darkviolet": "9400d3",
      "deeppink": "ff1493",
      "deepskyblue": "00bfff",
      "dimgray": "696969",
      "dimgrey": "696969",
      "dodgerblue": "1e90ff",
      "firebrick": "b22222",
      "floralwhite": "fffaf0",
      "forestgreen": "228b22",
      "fuchsia": "f0f",
      "gainsboro": "dcdcdc",
      "ghostwhite": "f8f8ff",
      "gold": "ffd700",
      "goldenrod": "daa520",
      "gray": "808080",
      "green": "008000",
      "greenyellow": "adff2f",
      "grey": "808080",
      "honeydew": "f0fff0",
      "hotpink": "ff69b4",
      "indianred": "cd5c5c",
      "indigo": "4b0082",
      "ivory": "fffff0",
      "khaki": "f0e68c",
      "lavender": "e6e6fa",
      "lavenderblush": "fff0f5",
      "lawngreen": "7cfc00",
      "lemonchiffon": "fffacd",
      "lightblue": "add8e6",
      "lightcoral": "f08080",
      "lightcyan": "e0ffff",
      "lightgoldenrodyellow": "fafad2",
      "lightgray": "d3d3d3",
      "lightgreen": "90ee90",
      "lightgrey": "d3d3d3",
      "lightpink": "ffb6c1",
      "lightsalmon": "ffa07a",
      "lightseagreen": "20b2aa",
      "lightskyblue": "87cefa",
      "lightslategray": "789",
      "lightslategrey": "789",
      "lightsteelblue": "b0c4de",
      "lightyellow": "ffffe0",
      "lime": "0f0",
      "limegreen": "32cd32",
      "linen": "faf0e6",
      "magenta": "f0f",
      "maroon": "800000",
      "mediumaquamarine": "66cdaa",
      "mediumblue": "0000cd",
      "mediumorchid": "ba55d3",
      "mediumpurple": "9370db",
      "mediumseagreen": "3cb371",
      "mediumslateblue": "7b68ee",
      "mediumspringgreen": "00fa9a",
      "mediumturquoise": "48d1cc",
      "mediumvioletred": "c71585",
      "midnightblue": "191970",
      "mintcream": "f5fffa",
      "mistyrose": "ffe4e1",
      "moccasin": "ffe4b5",
      "navajowhite": "ffdead",
      "navy": "000080",
      "oldlace": "fdf5e6",
      "olive": "808000",
      "olivedrab": "6b8e23",
      "orange": "ffa500",
      "orangered": "ff4500",
      "orchid": "da70d6",
      "palegoldenrod": "eee8aa",
      "palegreen": "98fb98",
      "paleturquoise": "afeeee",
      "palevioletred": "db7093",
      "papayawhip": "ffefd5",
      "peachpuff": "ffdab9",
      "peru": "cd853f",
      "pink": "ffc0cb",
      "plum": "dda0dd",
      "powderblue": "b0e0e6",
      "purple": "800080",
      "rebeccapurple": "639",
      "red": "f00",
      "rosybrown": "bc8f8f",
      "royalblue": "4169e1",
      "saddlebrown": "8b4513",
      "salmon": "fa8072",
      "sandybrown": "f4a460",
      "seagreen": "2e8b57",
      "seashell": "fff5ee",
      "sienna": "a0522d",
      "silver": "c0c0c0",
      "skyblue": "87ceeb",
      "slateblue": "6a5acd",
      "slategray": "708090",
      "slategrey": "708090",
      "snow": "fffafa",
      "springgreen": "00ff7f",
      "steelblue": "4682b4",
      "tan": "d2b48c",
      "teal": "008080",
      "thistle": "d8bfd8",
      "tomato": "ff6347",
      "turquoise": "40e0d0",
      "violet": "ee82ee",
      "wheat": "f5deb3",
      "white": "fff",
      "whitesmoke": "f5f5f5",
      "yellow": "ff0",
      "yellowgreen": "9acd32",
      "transparent": "00000000"
    };
    
    const clamp = (n, a, b) => n < a ? a : (n > b ? b : n),  // Clamp n in interval [a, b]
      round = (n, d) => {  // Round n to nearest integer, or to d decimal places (if d is defined)
        var p = Math.pow(10, d || 0);
        return Math.round(n * p) / p;
      },
      hi = n => clamp(parseInt(n, 16), 0, 255),  // Convert 2-digit hex to int in interval [0, 255]
      hf = n => clamp(round(parseInt(n, 16) / 255, 2), 0, 1),  // Convert 2-digit hex to float with 2 decimal places in interval [0, 1]
      si = n => clamp(round(parseFloat(n)), 0, 255),  // Convert string to int in interval [0, 255]
      sf = n => clamp(round(parseFloat(n), 2), 0, 1),  // Convert string to float with 2 decimal places in interval [0, 1]
      pi = n => clamp(round(parseFloat(n) / 100 * 255), 0, 255),  // Convert percentage string to int in interval [0, 255]
      uf = n => clamp(parseFloat(n) / 360, 0, 1),  // Convert hue string to float in interval [0, 1]
      pf = n => clamp(parseFloat(n) / 100, 0, 1);  // Convert percentage string to float in interval [0, 1]
    
    // Convert hsl to rgb, alpha value gets passed straight through
    // h, s, l values are assumed to be in interval [0, 1]
    // Returns an object like { r, g, b, a }
    // http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
    function hslToRgb(h, s, l, a) {
      var r, g, b,
        hue = function(p, q, t) {
          if (t < 0) { t += 1; }
          if (t > 1) { t -= 1; }
          if (t < 1 / 6) { return p + (q - p) * 6 * t };
          if (t < 1 / 2) { return q; }
          if (t < 2 / 3) { return p + (q - p) * (2 / 3 - t) * 6 };
          return p;
        };
      if (s == 0) {
        r = g = b = l;
      } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s,
          p = 2 * l - q;
        r = hue(p, q, h + 1 / 3);
        g = hue(p, q, h);
        b = hue(p, q, h - 1 / 3);
      }
      return { r: round(r * 255), g: round(g * 255), b: round(b * 255), a: a };
    }
    return function(c) {
      var o = { r: 0, g: 0, b: 0, a: 0 }, m = null;
      if (typeof c == "string") {
        if (c in names) { c = "#" + names[c]; }
        if ((m = c.match(/#([a-f0-9])([a-f0-9])([a-f0-9])$/i)) !== null) {
          o = { r: hi(m[1] + m[1]), g: hi(m[2] + m[2]), b: hi(m[3] + m[3]), a: 1 };
        } else if ((m = c.match(/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i)) !== null) {
          o = { r: hi(m[1]), g: hi(m[2]), b: hi(m[3]), a: 1 };
        } else if ((m = c.match(/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i)) !== null) {
          o = { r: hi(m[1]), g: hi(m[2]), b: hi(m[3]), a: hf(m[4]) };
        } else if ((m = c.match(/rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/)) !== null) {
          o = { r: si(m[1]), g: si(m[2]), b: si(m[3]), a: 1 };
        } else if ((m = c.match(/rgb\(\s*(\d{1,3}\.?\d?%)\s*,\s*(\d{1,3}\.?\d?%)\s*,\s*(\d{1,3}\.?\d?%)\s*\)/)) !== null) {
          o = { r: pi(m[1]), g: pi(m[2]), b: pi(m[3]), a: 1 };
        } else if ((m = c.match(/rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d?\.?\d*?)?\s*\)/)) !== null) {
          o = { r: si(m[1]), g: si(m[2]), b: si(m[3]), a: sf(m[4]) };
        } else if ((m = c.match(/rgba\(\s*(\d{1,3}\.?\d?%)\s*,\s*(\d{1,3}\.?\d?%)\s*,\s*(\d{1,3}\.?\d?%)\s*,\s*(\d?\.?\d*?)?\s*\)/)) !== null) {
          o = { r: pi(m[1]), g: pi(m[2]), b: pi(m[3]), a: sf(m[4]) };
        } else if ((m = c.match(/hsl\(\s*(\d{1,3}\.?\d?)\s*,\s*(\d{1,3}\.?\d?%)\s*,\s*(\d{1,3}\.?\d?%)\s*\)/)) !== null) {
          o = hslToRgb(uf(m[1]), pf(m[2]), pf(m[3]), 1);
        } else if ((m = c.match(/hsla\(\s*(\d{1,3}\.?\d?)\s*,\s*(\d{1,3}\.?\d?%)\s*,\s*(\d{1,3}\.?\d?%)\s*,\s*(\d?\.?\d*?)?\s*\)/)) !== null) {
          o = hslToRgb(uf(m[1]), pf(m[2]), pf(m[3]), sf(m[4]));
        }
      } else if (typeof c == "object") {
        if (c.r !== undefined && c.g != undefined && c.b !== undefined) {
          o = { r: si(c.r), g: si(c.g), b: si(c.b), a: sf(c.a || 1) };
        } else if (c.h !== undefined && c.s !== undefined && c.l !== undefined) {
          o = hslToRgb(uf(c.h), pf(c.s), pf(c.l), sf(c.a || 1));
        }
      }
      return o;
    };
  }())
};

Tily.utility.__extends = (this && this.__extends) || function (d, b) {
  for (var p in b) {
    if (b.hasOwnProperty(p)) { d[p] = b[p]; }
  }
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

"use strict";

/**
 * Return a new Tily.utility.vec2 object with the specified x/y coordinates. If the first argument is an array,
 * the Tily.utility.vec2 will be initialised using the first 2 elements of the array. If the first argument is
 * an object with x and y properties, these will be used instead (this is useful for copying Tily.utility.vec2
 * instances). If no arguments are provided, or the arguments are invalid, a zero-vector will be
 * returned instead.
 * @param {number|Array|Object} x The x-coordinate, or an array with at least 2 elements, or an
 * object with x and y properties.
 * @param {number} [y] The y-coordinate, if an x-coordinate has also been provided.
 * @returns {Object} A Tily.utility.vec2 instance.
 * @example
 * var v1 = Tily.utility.vec2(2, 1); // v1 == { x: 2, y: 1 }
 * var v2 = Tily.utility.vec2([2, 1]); // v2 == { x: 2, y: 1 }
 * var v3 = Tily.utility.vec2(v1); // v3 == { x: 2, y: 1 }
 */
Tily.utility.vec2 = function(x, y) {
  if (arguments.length == 1) {
    if (x instanceof Array && x.length > 1) { // Tily.utility.vec2 from array
      return { x: x[0], y: x[1] };
    } else if (x.x !== undefined && x.y !== undefined) {
      return { x: x.x, y: x.y }; // Tily.utility.vec2 from Tily.utility.vec2 (copy)
    }
    return { x: 0, y: 0 }; // Arguments incorrect, return [0, 0]
  }
  return { x: x || 0, y: y || 0 };
};

/**
 * @callback mapCallback
 * @param {number} x The x or y component of the vector.
 * @param {...*} arguments Any additional arguments passed to Tily.utility.vec2.map.
 * @returns {boolean} True if the current element is the one being searched for.
 */
/**
 * Return a new vector from v by mapping it's components to f.
 * @param {Tily.utility.vec2} v The vector to transform.
 * @param {mapCallback} f A callback that will be called for both the x and y components.
 * @param {...*} arguments Additional arguments will be passed to f for each component.
 * @returns {Tily.utility.vec2} The transformed vector.
 * @example
 * var v = Tily.utility.vec2(1.5, 2.5);
 * v = Tily.utility.vec2.map(v, Math.floor); // v == { x: 1, y: 2 }
 */
Tily.utility.vec2.map = function(v, f) {
  var args = arguments.length == 1 ? [arguments[0]] : Array.apply(null, arguments);
  args = Array.prototype.slice.call(args, 2);
  return Tily.utility.vec2(f.apply(this, [v.x].concat(args)), f.apply(this, [v.y].concat(args)));
};

/**
 * Get the length of a vector.
 * @param {Tily.utility.vec2} v The vector.
 * @returns {number} The vector's length.
 */
Tily.utility.vec2.len = function(v) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
};

/**
 * Get the angle of a vector in radians.
 * @param {Tily.utility.vec2} v The vector.
 * @returns {number} The angle of the vector in radians.
 */
Tily.utility.vec2.rad = function(v) {
  return Math.atan2(v.y, v.x);
};

/**
 * Get the dot product of two vectors.
 * @param {Tily.utility.vec2} v1 The first vector.
 * @param {Tily.utility.vec2} v2 The second vector.
 * @returns {number} The dot product of v1 and v2.
 */
Tily.utility.vec2.dot = function(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y;
};

/**
 * Normalise a vector
 * @param {Tily.utility.vec2} v The vector.
 * @returns {Tily.utility.vec2} The normalised vector.
 */
Tily.utility.vec2.norm = function(v) {
  var length = Tily.utility.vec2.len(v);
  if (length) {
    return Tily.utility.vec2.div(v, length);
  }
  return Tily.utility.vec2();
};

/**
 * Reflect a vector across a plane with normal n
 * @param {Tily.utility.vec2} v The vector.
 * @param {Tily.utility.vec2} n The plane normal vector.
 * @returns {Tily.utility.vec2} The reflected vector.
 */
Tily.utility.vec2.reflect = function(v, n) {
  return Tily.utility.vec2.add(v, Tily.utility.vec2.mul(Tily.utility.vec2.mul(n, Tily.utility.vec2.dot(v, n)), -2));
};

/**
 * Get the cross product of two vectors. The z-coord is assumed to be 0, since these are 2d vectors.
 * @param {Tily.utility.vec2} v1 The first vector.
 * @param {Tily.utility.vec2} v2 The second vector.
 * @returns {number} The cross product of v1 and v2.
 */
Tily.utility.vec2.cross = function(v1, v2) {
  return v1.x * v2.y - v1.y * v2.x;
};

/**
 * Rotate a vector.
 * @param {Tily.utility.vec2} v The vector.
 * @param {number} r The amount to rotate the vector by, in radians.
 * @returns {Tily.utility.vec2} The rotated vector.
 */
Tily.utility.vec2.rot = function(v, r) {
  var sinAngle = Math.sin(r),
    cosAngle = Math.cos(r),
    x = cosAngle * v.x - sinAngle * v.y,
    y = sinAngle * v.x + cosAngle * v.y;
  return Tily.utility.vec2(x, y);
};

/**
 * Add two vectors or add a scalar to each component.
 * @param {Tily.utility.vec2} v1 The first vector.
 * @param {Tily.utility.vec2|number} v2 The second vector, or a scalar value to add to each component of v1.
 * @returns {Tily.utility.vec2} The sum of v1 and v2.
 */
Tily.utility.vec2.add = function(v1, v2) {
  if (v2.x !== undefined && v2.y !== undefined) {
    return Tily.utility.vec2(v1.x + v2.x, v1.y + v2.y);
  } else {
    return Tily.utility.vec2(v1.x + v2, v1.y + v2);
  }
};

/**
 * Subtract two vectors.
 * @param {Tily.utility.vec2} v1 The first vector.
 * @param {Tily.utility.vec2|number} v2 The second vector, or a scalar value to subtract from each component of
 * v1.
 * @returns {Tily.utility.vec2} The difference of v1 and v2.
 */
Tily.utility.vec2.sub = function(v1, v2) {
  if (v2.x !== undefined && v2.y !== undefined) {
    return Tily.utility.vec2(v1.x - v2.x, v1.y - v2.y);
  } else {
    return Tily.utility.vec2(v1.x - v2, v1.y - v2);
  }
};

/**
 * Multiply two vectors.
 * @param {Tily.utility.vec2} v1 The first vector.
 * @param {Tily.utility.vec2|number} v2 The second vector, or a scalar value to multiply each component of v1 by.
 * @returns {Tily.utility.vec2} The product of v1 and v2.
 */
Tily.utility.vec2.mul = function(v1, v2) {
  if (v2.x !== undefined && v2.y !== undefined) {
    return Tily.utility.vec2(v1.x * v2.x, v1.y * v2.y);
  } else {
    return Tily.utility.vec2(v1.x * v2, v1.y * v2);
  }
};

/**
 * Divide two vectors.
 * @param {Tily.utility.vec2} v1 The first vector.
 * @param {Tily.utility.vec2|number} v2 The second vector, or a scalar value to divide each component of v1 by.
 * @returns {Tily.utility.vec2} The quotient of v1 and v2.
 */
Tily.utility.vec2.div = function(v1, v2) {
  if (v2.x !== undefined && v2.y !== undefined) {
    return Tily.utility.vec2(v1.x / v2.x, v1.y / v2.y);
  } else {
    return Tily.utility.vec2(v1.x / v2, v1.y / v2);
  }
};

/**
 * Check if two vectors are equal.
 * @param {Tily.utility.vec2} v1 The first vector.
 * @param {Tily.utility.vec2} v2 The second vector.
 * @returns {boolean} True if the vectors are equal.
 */
Tily.utility.vec2.eq = function(v1, v2) {
  return (v1.x == v2.x && v1.y == v2.y);
};

/**
 * Convert a string representation of a vector (like '0,0' or '0, 0') into a Tily.utility.vec2.
 * @param {string} s The string representation of the vector.
 * @returns {Tily.utility.vec2} The resulting Tily.utility.vec2, or a zero-vector if the string couldn't be parsed.
 */
Tily.utility.vec2.fromString = function(s) {
  var values = s.split(",", 2);
  if (values.length == 2) {
    var x = parseFloat(values[0]),
      y = parseFloat(values[1]);
    return Tily.utility.vec2(x, y);
  }
  return Tily.utility.vec2(0, 0);
};

/**
 * Convert a Tily.utility.vec2 into a string.
 * @param {Tily.utility.vec2} v The vector to convert.
 * @param {string} [s=','] An optional separator string.
 * @returns {string} The string representation of v.
 */
Tily.utility.vec2.toString = function(v, s) {
  return v.x + (s !== undefined ? s : ",") + v.y;
};

Tily.Main = (function() {
  "use strict";

  /**
   * @typedef Size
   * @type {Object}
   * @property {number} width The width.
   * @property {number} height The height.
   */
  /**
   * @callback beforeDrawFunction
   * @param {number} elapsedTime The time elapsed in seconds since the last draw call.
   */
  /**
   * @callback afterDrawFunction
   * @param {number} elapsedTime The time elapsed in seconds since the last draw call.
   */
  /**
   * @typedef TilyOptions
   * @type {Object}
   * @property {?Size} [size=null] The viewport size, or null to use the canvas element
   * dimensions.
   * @property {boolean} [handleResize=true] True if the window resize event should be handled.
   * @property {boolean} [showFPS=false] True if the FPS should be displayed.
   * @property {boolean} [renderLoop=true] True if the render loop should be started
   * automatically.
   * @property {?beforeDrawFunction} [beforeDrawFunction=null] A function that will be called
   * after clearing the context but before drawing the active buffer. In the context of the
   * function, 'this' will point to the Tily instance.
   * @property {?afterDrawFunction} [afterDrawFunction=null] A function that will be called after
   * drawing the active buffer. In the context of the function, 'this' will point to the Tily instance.
   */
  /**
   * Default Tily options, used as a fall-back for options passed to the constructor.
   * @type {TilyOptions}
   */
  const _defaultTilyOptions = {
    size: null,
    handleResize: true,
    showFPS: false,
    renderLoop: true,
    beforeDrawFunction: null,
    afterDrawFunction: null
  };

  /**
   * The main Tily object. Initialises a canvas element and starts drawing tiles.
   * @class
   * @memberof Tily
   * @param {HTMLElement} canvas The canvas element in which to draw tiles.
   * @param {TilyOptions} [options] An optional object containing options for configuring this
   * Tily instance.
   */
  function Main(canvas, options) {
    if (!window) {  // Check that we are in a browser (ie. window exists)
      console.log("Couldn't find window. Tily.Main can only be created in the browser!");
      return
    }
    if (!canvas.getContext) {  // Check for canvas support
      console.log("Canvas not supported!");
      return;
    }

    /**
     * Options for configuring this Tily instance.
     * @type {TilyOptions}
     */
    this.options = { ..._defaultTilyOptions, ...options || {} };

    /**
     * The canvas element in which to draw tiles.
     * @type {HTMLElement}
     */
    this.canvas = canvas;

    /**
     * The context on which to draw tiles.
     * @type {CanvasRenderingContext2D}
     */
    this.context = canvas.getContext("2d");

    /**
     * The viewport width.
     * @type {number}
     */
    this.width = 0;

    /**
     * The viewport height.
     * @type {number}
     */
    this.height = 0;

    /**
     * The buffer currently being rendered.
     * @type {Tily.BufferBase}
     */
    this.activeBuffer = null;

    /**
     * The currently running buffer transition or null if there is no currently running
     * transition.
     * @default null
     * @type {?Tily.BufferTransition}
     */
    this.bufferTransition = null;

    /**
     * A request id returned from window.requestAnimationFrame that uniquely identifies the
     * entry in the callback list for the main render loop.
     * @type {number}
     */
    this.loop = null;

    /**
     * The unix epoch time of the last rendered frame.
     * @type {number}
     */
    this.lastFrameTime = new Date();

    /**
     * The number of frames rendered in the last second.
     * @type {number}
     */
    this.frameCount = 0;

    /**
     * The number of milliseconds elapsed since the last framerate update.
     * @type {number}
     */
    this.frameTime = 0;

    /**
     * The number of frames rendered per second.
     * @type {number}
     */
    this.frameRate = 0;

    // Handle the window resize event to get the current viewport size or use a fixed size
    if (!this.options.size || this.options.handleResize) {
      const self = this;
      function resize() {
        self.canvas.width = self.width = canvas.clientWidth * window.devicePixelRatio;
        self.canvas.height = self.height = canvas.clientHeight * window.devicePixelRatio;
      }
      window.addEventListener("resize", resize, false);
      resize();
    } else {
      this.canvas.width = this.width = this.options.size.width;
      this.canvas.height = this.height = this.options.size.height;
    }

    // Start the render loop
    if (this.options.renderLoop) {
      loop(this);
    }
  }

  /**
   * Perform a single iteration of the render loop.
   * @param {Tily.Main} t The Tily instance being looped.
   */
  function loop(t) {
    const now = new Date(),
      elapsedTime = (now - t.lastFrameTime) / 1000;
    t.lastFrameTime = now;
    t.frameTime += elapsedTime;
    t.frameCount++;
    if (t.frameTime > 1) {
      t.frameRate = t.frameCount;
      t.frameTime = 0;
      t.frameCount = 0;
    }
    t.draw(elapsedTime);
    t.loop = window.requestAnimationFrame(function() { loop(t) });
  }

  /**
   * Render the Tily instance onto the canvas.
   * @name draw
   * @function
   * @instance
   * @memberof Tily.Main
   * @param {number} elapsedTime The time elapsed in seconds since the last draw call.
   */
  Main.prototype.draw = function(elapsedTime) {
    this.context.save();
    this.context.clearRect(0, 0, this.width, this.height);
    if (typeof this.options.beforeDrawFunction == "function") {
      this.options.beforeDrawFunction.call(this, this.canvas, this.context, this.width, this.height, elapsedTime);
    }

    // Draw the active buffer and handle buffer fade transition
    const width = this.width,
      height = this.height;
    if (this.bufferTransition) {
      const alpha = this.bufferTransition.update(elapsedTime);
      if (this.bufferTransition.start) {
        this.context.globalAlpha = 1 - alpha;
        this.bufferTransition.start.draw(this.context, elapsedTime, width, height);
      }
      if (this.bufferTransition.finish) {
        this.context.globalAlpha = alpha;
        this.bufferTransition.finish.draw(this.context, elapsedTime, width, height);
      }
      if (this.bufferTransition.finished) {  // Remove the transition when it has finished
        this.bufferTransition = null;
      }
    } else if (this.activeBuffer) {
      this.context.globalAlpha = 1;
      this.activeBuffer.draw(this.context, elapsedTime, width, height);
    }
    if (typeof this.options.afterDrawFunction == "function") {
      this.options.afterDrawFunction.call(this, this.canvas, this.context, this.width, this.height, elapsedTime);
    }
    this.context.restore();
    if (this.options.showFPS) {
      this.context.save();
      this.context.font = '20px monospace';
      this.context.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.context.fillRect(this.width - (10 + 80), 10, 80, 30);
      this.context.fillStyle = 'white';
      this.context.textBaseline = 'top';
      this.context.textAlign = 'right';
      this.context.fillText(this.frameRate, this.width - 15, 15);
      this.context.restore();
    }
  };

  /**
   * Activate a new buffer with an optional fade transition from the current buffer.
   * @name activateBuffer
   * @function
   * @instance
   * @memberof Tily.Main
   * @param {Tily.Buffer} buffer The new buffer to activate.
   * @param {TransitionOptions} [options] An optional options object.
   * @returns {Promise} A promise instance for setting a transition finished callback.
   */
  Main.prototype.activateBuffer = function(buffer, options) {
    const transition = new Tily.BufferTransition(this.activeBuffer, buffer, options);
    this.bufferTransition = transition;
    this.activeBuffer = buffer;
    return new Promise(function(resolve, reject) { transition.finishedCallback = resolve; });
  };

  /**
   * @name size
   * @description The size of this Tily element measured in pixels.
   * @instance
   * @memberof Tily.Main
   * @type {Size}
   */
  Object.defineProperty(Main.prototype, "size", {
    get: function() {
      return {
        width: this.width,
        height: this.height
      };
    }
  });
  return Main;
}());

Tily.Transition = (function() {
  "use strict";

  /**
   * @callback easeFunction
   * @param {any} a The starting value.
   * @param {any} b The finishing value.
   * @param {number} i The interpolation value, between 0 (start) and 1 (finish).
   * @returns {any} The interpolated value between a and b.
   */
  /**
   * @callback finishedCallback
   * @param {any} start The previous value before transitioning.
   * @param {any} finish The new value after transitioning.
   */
  /**
   * @typedef TransitionOptions
   * @type {Object}
   * @property {number} [time=0] The amount of time in seconds that this transition should take
   * to complete.
   * @property {easeFunction} [easeFunction=Tily.utility.lerp] The easing function to use while
   * transitioning.
   * @property {?finishedCallback} [finishedCallback=null] A callback function that will be
   * called once the transition has finished.
   */
  /**
   * Default transition options, used as a fall-back for options passed to the constructor.
   * @type {TransitionOptions}
   */
  const _defaultTransitionOptions = {
    time: 0,
    easeFunction: null,
    finishedCallback: null
  };

  /**
   * Represents a timed transition from one value to another.
   * @class
   * @memberof Tily
   * @param {any} start The starting value.
   * @param {any} finish The finishing value.
   * @options {TransitionOptions} [options] An optional options object for configuring the
   * transition.
   */
  function Transition(start, finish, options) {
    options = { ..._defaultTransitionOptions, ...options || {} };

    /**
     * The starting value.
     * @type {any}
     */
    this.start = start;

    /**
     * The finishing value.
     * @type {any}
     */
    this.finish = finish;

    /**
     * The total amount of time that this transition should take.
     * @type {number}
     */
    this.totalTime = options.time;

    /**
     * The current time elapsed since the transition began.
     * @type {number}
     */
    this.currentTime = 0;

    /**
     * The easing function to use while transitioning.
     * @default Tily.utility.lerp
     * @type {easeFunction}
     */
    this.easeFunction = options.easeFunction || Tily.utility.lerp;

    /**
     * A callback function that will be called once the transition has finished.
     * @default null
     * @type {?finishedCallback}
     */
    this.finishedCallback = options.finishedCallback || function(start, finish) { };

    /**
     * True if this transition has finished and can be discarded.
     * @type {boolean}
     */
    this.finished = false;
  }

  /**
   * Update the transition.
   * @name update
   * @function
   * @instance
   * @memberof Tily.Transition
   * @param {number} elapsedTime The number of seconds that have elapsed since the last update.
   * @returns {any} An interpolated value between the start and finish values.
   */
  Transition.prototype.update = function(elapsedTime) {
    this.currentTime += elapsedTime;

    // If transition is currently in progress, ease from start to finish value
    if (this.currentTime < this.totalTime) {
      return this.easeFunction(this.start, this.finish, this.amount);
    }

    // Otherwise, transition has finished
    if (this.finishedCallback && !this.finished) {
      this.finishedCallback(this.start, this.finish);
    }
    this.finished = true;
    return this.finish;
  };

  /**
   * @name amount
   * @description The current interpolation amount between 0 and 1 (inclusive).
   * @instance
   * @memberof Tily.Transition
   * @type {number}
   */
  Object.defineProperty(Transition.prototype, "amount", {
    get: function() {
      return Tily.utility.clamp(this.currentTime / this.totalTime);
    }
  });
  return Transition;
}());


Tily.BufferTransition = (function(_super) {
  "use strict";
  Tily.utility.__extends(BufferTransition, _super);

  /**
   * Represents a buffer transition for fading from one buffer to another.
   * @class
   * @extends Tily.Transition
   * @memberof Tily
   * @param {Tily.Buffer} start The starting buffer.
   * @param {Tily.Buffer} finish The finishing buffer.
   * @param {TransitionOptions} [options] An optional options object for configuring the
   * transition.
   */
  function BufferTransition(start, finish, options) {
    _super.call(this, start, finish, options);
  }

  /**
   * Update the transition.
   * @name update
   * @function
   * @instance
   * @memberof Tily.BufferTransition
   * @param {number} elapsedTime The number of seconds that have elapsed since the last update.
   * @returns {number} An interpolated alpha value between 0 and 1.
   */
  BufferTransition.prototype.update = function(elapsedTime) {
    this.currentTime += elapsedTime;

    // If transition is currently in progress, ease from start to finish value
    if (this.currentTime < this.totalTime) {
      return this.easeFunction(0, 1, this.amount);
    }

    // Otherwise, transition has finished
    if (this.finishedCallback && !this.finished) {
      this.finishedCallback(this.start, this.finish);
    }
    this.finished = true;
    return 1;
  };
  return BufferTransition;
}(Tily.Transition));

Tily.OffsetTransition = (function(_super) {
  "use strict";
  Tily.utility.__extends(OffsetTransition, _super);

  /**
   * Represents an offset position transition for moving the buffer camera with a movement
   * animation.
   * @class
   * @extends Tily.Transition
   * @memberof Tily
   * @param {Tily.utility.vec2} start The starting offset.
   * @param {Tily.utility.vec2} finish The finishing offset.
   * @param {TransitionOptions} [options] An optional options object for configuring the
   * transition.
   */
  function OffsetTransition(start, finish, options) {
    _super.call(this, start, finish, options);
  }

  /**
   * Update the transition.
   * @name update
   * @function
   * @instance
   * @memberof Tily.OffsetTransition
   * @param {number} elapsedTime The number of seconds that have elapsed since the last update.
   * @returns {number} An interpolated offset value between the start and finish offsets.
   */
  OffsetTransition.prototype.update = function(elapsedTime) {
    this.currentTime += elapsedTime;

    // If transition is currently in progress, ease from start to finish value
    if (this.currentTime < this.totalTime) {
      const amount = this.amount;
      return Tily.utility.vec2(
        this.easeFunction(this.start.x, this.finish.x, amount),
        this.easeFunction(this.start.y, this.finish.y, amount)
      );
    }

    // Otherwise, transition has finished
    if (this.finishedCallback && !this.finished) {
      this.finishedCallback(this.start, this.finish);
    }
    this.finished = true;
    return this.finish;
  };
  return OffsetTransition;
}(Tily.Transition));

Tily.ScaleTransition = (function(_super) {
  "use strict";
  Tily.utility.__extends(ScaleTransition, _super);

  /**
   * Represents a scale transition for zooming a buffer in/out with a zoom animation.
   * @class
   * @extends Tily.Transition
   * @memberof Tily
   * @param {number} start The starting scale.
   * @param {number} finish The finishing scale.
   * @param {TransitionOptions} [options] An optional options object for configuring the
   * transition.
   */
  function ScaleTransition(start, finish, options) {
    _super.call(this, start, finish, options);
  }

  /**
   * Update the transition.
   * @name update
   * @function
   * @instance
   * @memberof Tily.ScaleTransition
   * @param {number} elapsedTime The number of seconds that have elapsed since the last update.
   * @returns {number} An interpolated scale value between the start and finish scales.
   */
  ScaleTransition.prototype.update = function(elapsedTime) {
    return _super.prototype.update.call(this, elapsedTime);
  };
  return ScaleTransition;
}(Tily.Transition));

Tily.BufferBase = (function() {
  "use strict";

  /**
   * @typedef BufferOptions
   * @type {Object}
   * @property {string} [lockedAxis="x"] Indicates which axis is used for scaling the tiles, the
   * scale parameter will indicate how many tiles are visible on the locked axis. Should be
   * either "x" or "y".
   * @property {number} [initialOffsetX=0] The starting offset x-coordinate for this buffer.
   * @property {number} [initialOffsetY=0] The starting offset y-coordinate for this buffer.
   * @property {number} [initialScale=16] The starting scale, represents the number of visible
   * tiles along the locked axis.
   * @property {number} [maximumScale=32] The maximum number of tiles visible along the locked
   * axis.
   * @property {number} [minimumScale=4] The minimum number of tiles visible along the locked
   * axis.
   * @property {boolean} [clampCamera=false] Clamp the camera offset and zoom so that the buffer
   * always fills the canvas.
   */
  /**
   * Default buffer options, used as a fall-back for options passed to the constructor.
   * @type {BufferOptions}
   */
  const _defaultBufferOptions = {
    lockedAxis: "x",
    initialOffsetX: 0,
    initialOffsetY: 0,
    initialScale: 16,
    maximumScale: 32,
    minimumScale: 4,
    clampCamera: false
  };

  /**
   * Implements basic functionality for buffers and cell buffers.
   * @class
   * @memberof Tily
   * @param {BufferOptions} [options] An optional options object for configuring the buffer.
   */
  function BufferBase(options) {
    /**
     * The canvas element to render this buffer onto.
     * @type {HTMLElement}
     */
    this.canvas = document.createElement("canvas");

    /**
     * The canvas context to render onto.
     * @type {CanvasRenderingContext2D}
     */
    this.context = this.canvas.getContext("2d");

    /**
     * An array of active tiles contained in this buffer.
     * @type {Tily.ActiveTile[]}
     */
    this.activeTiles = [];

    /**
     * A map of active tiles, with hashed tile positions as keys and an array of tiles at a
     * position as values.
     * @type {Object}
     */
    this.activeTilesMap = {};

    /**
     * Options for configuring this buffer.
     * @type {BufferOptions}
     */
    this.options = { ..._defaultBufferOptions, ...options || {} };

    /**
     * A camera offset position for this buffer measured in pixels.
     * @type {Tily.utility.vec2}
     */
    this.offset = Tily.utility.vec2(this.options.initialOffsetX, this.options.initialOffsetY);

    /**
     * The currently running offset transition or null if there is no transition currently
     * running.
     * @default null
     * @type {?Tily.OffsetTransition}
     */
    this.offsetTransition = null;

    /**
     * The number of tiles currently visible along the locked axis.
     * @type {number}
     */
    this.scale = this.options.initialScale;

    /**
     * The currently running scale transition or null if there is no transition currently
     * running.
     * @default null
     * @type {?Tily.ScaleTransition}
     */
    this.scaleTransition = null;

    /**
     * The size of this buffer measured in tiles.
     * @type {Size}
     */
    this.size = { width: 0, height: 0 };

    /**
     * The side length of each tile measured in pixels.
     * @type {number}
     */
    this.tileSize = 0;

    /**
     * The size of the viewport measured in tiles.
     * @type {Size}
     */
    this.viewSize = { width: 0, height: 0 };
  }

  /**
   * Check if position p is inside the region between tl and br.
   * @param {Tily.utility.vec2} p The position to check.
   * @param {Tily.utility.vec2} tl The top-left corner of the region.
   * @param {Tily.utility.vec2} br The bottom-right corner of the region.
   * @returns {boolean} True if the position p is inside the region.
   */
  function checkBounds(p, tl, br) {
    return (p.x >= tl.x && p.x <= br.x && p.y >= tl.y && p.y <= br.y);
  }

  /**
   * Get a string representation of the specified position for use as a hash.
   * @param {Tily.utility.vec2} p The position to hash.
   * @returns {string} A hash string for the specified position.
   */
  function hash(p) {
    return Tily.utility.vec2.toString(p, "_");
  }

  /**
   * Add an active tile or multiple active tiles to this buffer.
   * @name addActiveTile
   * @function
   * @instance
   * @memberof Tily.BufferBase
   * @param {...Tily.ActiveTile} tiles The tile(s) to add.
   * @returns {Tily.ActiveTile|array} The tile(s) that were added
   */
  BufferBase.prototype.addActiveTile = function(...tiles) {
    this.activeTiles.push(...tiles);
    return tiles.length == 1 ? tiles[0] : tiles;
  };

  /**
   * Remove an active tile from this buffer.
   * @name removeActiveTile
   * @function
   * @instance
   * @memberof Tily.BufferBase
   * @param {Tily.ActiveTile} tile The tile to remove.
   */
  BufferBase.prototype.removeActiveTile = function(tile) {
    tile.destroyed = true;
  };

  /**
   * Remove all active tiles from this buffer.
   * @name removeAllActiveTiles
   * @function
   * @instance
   * @memberof Tily.BufferBase
   */
  BufferBase.prototype.removeAllActiveTiles = function() {
    this.activeTiles = [];
  };

  /**
   * @typedef MoveOffsetTransitionOptions
   * @type {TransitionOptions}
   * @property {string} [unit=""] The unit of measurement for the new offset. If this is set to
   * 'px', the unit will be pixels and if it is set to anything else the unit will be tiles.
   * @property {boolean} [relative=false] True if the movement should be relative to the current
   * offset.
   */
  /**
   * Move the offset with an optional transition animation.
   * @name moveOffset
   * @function
   * @instance
   * @memberof Tily.BufferBase
   * @param {number} x The x-coordinate of the target offset position.
   * @param {number} y The y-coordinate of the target offset position.
   * @param {MoveOffsetTransitionOptions} [options] An optional options object.
   */
  BufferBase.prototype.moveOffset = function(x, y, options) {
    options = {
      unit: "",
      relative: false,
      ...options
    };
    var offset = Tily.utility.vec2(x, y);
    if (options && options.unit == "px") {  // Adjust the offset position if moving in pixels
      offset = Tily.utility.vec2.div(offset, this.tileSize);
    }
    if (this.offsetTransition) {
      this.offset = this.offsetTransition.update(0);
    }
    if (options && options.relative === true) {  // Add the current position if moving relatively
      offset = Tily.utility.vec2.add(this.offset, offset);
    }
    const transition = new Tily.OffsetTransition(Tily.utility.vec2(this.offset), Tily.utility.vec2(offset), options);
    this.offsetTransition = transition;
    this.offset = offset;
    return new Promise(function(resolve, reject) { transition.finishedCallback = resolve; });
  };

  /**
   * @name offsetPixels
   * @description The offset of this buffer measured in pixels, as a Tily.utility.vec2 object.
   * @instance
   * @memberof Tily.BufferBase
   * @type {Tily.utility.vec2}
   */
  Object.defineProperty(BufferBase.prototype, "offsetPixels", {
    get: function() {
      return Tily.utility.vec2.mul(this.offset, this.tileSize);
    }
  });

  /**
   * Zoom the scale with an optional transition animation.
   * @name zoom
   * @function
   * @instance
   * @memberof Tily.BufferBase
   * @param {number} scale The target scale.
   * @param {TransitionOptions} [options] An optional options object.
   */
  BufferBase.prototype.zoom = function(scale, options) {
    if (this.scaleTransition) {
      this.scale = this.scaleTransition.update(0);
    }
    const transition = new Tily.ScaleTransition(this.scale, scale, options);
    this.scaleTransition = transition;
    this.scale = scale;
    return new Promise(function(resolve, reject) { transition.finishedCallback = resolve; });
  };

  /**
   * Return the tile position for the specified pixel position, based on the current offset and
   * scale.
   * @name getPosition
   * @function
   * @instance
   * @memberof Tily.BufferBase
   * @param {number} x The x-coordinate of the pixel position.
   * @param {number} y The y-coordinate of the pixel position.
   * @returns {Tily.utility.vec2} The tile position currently at the specified pixel position.
   */
  BufferBase.prototype.getPosition = function(x, y) {
    const tl = Tily.utility.vec2.sub(
      Tily.utility.vec2.add(this.offset, 0.5),
      Tily.utility.vec2.div(Tily.utility.vec2(this.viewSize.width, this.viewSize.height), 2)
    );
    return Tily.utility.vec2.map(Tily.utility.vec2.add(tl, Tily.utility.vec2.div(Tily.utility.vec2(x, y), this.tileSize)), Math.floor);
  };

  /**
   * @typedef BufferBaseTileInfo
   * @type {Object}
   * @property {Tily.utility.vec2} position The tile position.
   * @property {ActiveTile[]} activeTiles A list of active tiles at a tile position.
   */
  /**
   * Get information about the active tiles at a tile position.
   * @name getTileInfo
   * @function
   * @instance
   * @memberof Tily.BufferBase
   * @param {number} x The x-coordinate of the tile position.
   * @param {number} y The y-coordinate of the tile position.
   * @returns {BufferBaseTileInfo} Information about the tiles at the specified position.
   */
  BufferBase.prototype.getTileInfo = function(x, y) {
    const p = Tily.utility.vec2(x, y);
    return {
      position: p,
      activeTiles: this.activeTilesMap[hash(p)] || []
    };
  };

  /**
   * Update offset and scale transitions.
   * @name updateTransitions
   * @function
   * @instance
   * @memberof Tily.BufferBase
   * @param {number} elapsedTime The time elapsed in seconds since the last draw call.
   * @returns {Tily.utility.vec2} The interpolated offset position.
   */
  BufferBase.prototype.updateTransitions = function(elapsedTime) {
    // Update offset transition
    var offset = this.offset;
    if (this.offsetTransition) {
      offset = this.offsetTransition.update(elapsedTime);
      if (this.offsetTransition.finished) {  // Remove the transition when it has finished
        this.offsetTransition = null;
      }
    }

    // Update scale transition
    if (this.scaleTransition) {
      this.scale = this.scaleTransition.update(elapsedTime);
      if (this.scaleTransition.finished) {  // Remove the transition when it has finished
        this.scaleTransition = null;
      }
    }
    return offset;
  };

  /**
   * Update the active tiles map and get a list of active tiles currently in view.
   * @name updateActiveTilesMap
   * @function
   * @instance
   * @memberof Tily.BufferBase
   * @param {Tily.utility.vec2} tl The top-left tile position currently in view.
   * @param {Tily.utility.vec2} br The bottom-right tile position currently in view.
   * @returns {Tily.ActiveTile[]} A list of active tiles current in view, sorted by z-index.
   */
  BufferBase.prototype.updateActiveTilesMap = function(tl, br) {
    const activeTiles = [];
    var h = null;
    this.activeTilesMap = {};

    // Remove destroyed active tiles
    this.activeTiles = this.activeTiles.filter(i => !i.destroyed);

    // Get active tiles currently in view
    for (let i = 0, length = this.activeTiles.length; i < length; i++) {
      if (checkBounds(
        Tily.utility.vec2.add(this.activeTiles[i].position, this.activeTiles[i].offset),
        tl, br
      )) {
        activeTiles.push(this.activeTiles[i]);
      }

      // Update the active tiles map
      h = hash(this.activeTiles[i].position);
      if (this.activeTilesMap[h] === undefined) {
        this.activeTilesMap[h] = [];
      }
      this.activeTilesMap[h].push(this.activeTiles[i]);
    }
    activeTiles.sort((a, b) => a.zIndex - b.zIndex);
    return activeTiles;
  };
  return BufferBase;
}());

Tily.Buffer = (function(_super) {
  "use strict";
  Tily.utility.__extends(Buffer, _super);

  /**
   * A buffer containing tile layers that can be rendered in the Tily canvas.
   * @class
   * @extends Tily.BufferBase
   * @memberof Tily
   * @param {number} width The width of the buffer in tiles.
   * @param {number} height The height of the buffer in tiles.
   * @param {BufferOptions} [options] An optional options object for configuring the buffer.
   */
  function Buffer(width, height, options) {
    _super.call(this, options);

    /**
     * The layers contained in this buffer.
     * @type {Tily.TileLayer[]}
     */
    this.layers = [];
    this.size.width = width;
    this.size.height = height;
  }

  /**
   * Add a layer to this buffer at the specified z-index. If the z-index is undefined, add the
   * layer on top of existing layers, and if the z-index is -1, add the layer below existing
   * layers.
   * @name addLayer
   * @function
   * @instance
   * @memberof Tily.Buffer
   * @param {?Tily.TileLayer} [layer] The layer to add. If null, add an empty new layer.
   * @param {number} [z] The z-index at which to add the layer. If this is -1, the layer will be
   * added below existing layers and if it is undefined the layer will be added above existing
   * layers.
   * @returns {Tily.TileLayer} The layer that was added.
   */
  Buffer.prototype.addLayer = function(layer, z) {
    // If no layer is specified, create a new one
    layer = layer || new Tily.TileLayer(this);

    // Make sure the layer has a reference to this buffer
    layer.container = this;
    if (z === undefined) {
      this.layers.push(layer);
    } else if (z == -1) {
      this.layers.unshift(layer);
    } else {
      this.layers.splice(z, 0, layer);
    }
    return layer;
  };

  /**
   * Remove a layer at the specified z-index. If the z-index is undefined, remove the top layer
   * and if the z-index is -1, remove the bottom layer. The removed layer is returned.
   * @name removeLayer
   * @function
   * @instance
   * @memberof Tily.Buffer
   * @param {number} [z] The z-index of the layer to remove. If this is -1, the bottom layer will
   * be removed and if it is undefined the top layer will be removed.
   * @returns {Tily.TileLayer} The layer that was removed.
   */
  Buffer.prototype.removeLayer = function(z) {
    if (this.layers.length < 1) { return null; }
    if (z === undefined) {
      return this.layers.pop();
    } else if (z == -1) {
      return this.layers.shift();
    }
    return this.layers.splice(z, 1)[0];
  };

  /**
   * Remove all layers from this buffer.
   * @name removeAllLayers
   * @function
   * @instance
   * @memberof Tily.Buffer
   */
  Buffer.prototype.removeAllLayers = function() {
    this.layers = [];
  };

  /**
   * Move a layer from one z-index to another z-index, either an absolute value or relative to
   * the layer's current z-index.
   * @name moveLayer
   * @function
   * @instance
   * @memberof Tily.Buffer
   * @param {number} zFrom The z-index of the layer to move.
   * @param {number} zTo The z-index to move the layer to.
   * @param {boolean} relative If this is true, the layer will be moved relative to it's current
   * z-index.
   * @returns {boolean} True if a layer was moved successfully.
   */
  Buffer.prototype.moveLayer = function(zFrom, zTo, relative) {
    if (this.layers.length < 2) { return false; }
    if (zFrom < 0 || zFrom >= this.layers.length) { return false; }
    const layer = this.layers.splice(zFrom, 1)[0],
      toIndex = Tily.utility.clamp(relative ? zFrom + zTo : zTo, 0, this.layers.length);
    this.layers.splice(toIndex, 0, layer);
    return true;
  };

  /**
   * Resize this buffer's layers.
   * @name resize
   * @function
   * @instance
   * @memberof Tily.Buffer
   * @param {number} width The new width.
   * @param {number} height The new height.
   */
  Buffer.prototype.resize = function(width, height) {
    for (let i = this.layers.length; i--;) {
      this.layers[i].resize(width, height);
    }
    this.size.width = width;
    this.size.height = height;
  };

  /**
   * @typedef BufferTileInfo
   * @type {BufferBaseTileInfo}
   * @property {string[]} layers The tile layer characters in z-index order at a tile position.
   */
  /**
   * Get information about the tiles and active tiles at a tile position.
   * @name getTileInfo
   * @function
   * @instance
   * @memberof Tily.Buffer
   * @param {number} x The x-coordinate of the tile position.
   * @param {number} y The y-coordinate of the tile position.
   * @returns {BufferTileInfo} Information about the tiles at the specified position.
   */
  Buffer.prototype.getTileInfo = function(x, y) {
    const tileInfo = _super.prototype.getTileInfo.call(this, x, y);
    tileInfo.layers = this.layers.map(i => i.getTile(x, y));
    return tileInfo;
  };

  /**
   * Render this buffer's layers onto the specified context.
   * @name draw
   * @function
   * @instance
   * @memberof Tily.Buffer
   * @param {CanvasRenderingContext2D} context The context to render the buffer onto.
   * @param {number} elapsedTime The time elapsed in seconds since the last draw call.
   * @param {number} width The width of the canvas in pixels.
   * @param {number} height The height of the canvas in pixels.
   */
  Buffer.prototype.draw = function(context, elapsedTime, width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.context.save();
    // this.context.textBaseline = "top";
    this.context.clearRect(0, 0, width, height);
    var offset = this.updateTransitions(elapsedTime);

    // Clamp camera scale
    var lockedAxis = this.options.lockedAxis,
      maximumScale = this.options.maximumScale;

    // If clamping is enabled, make sure the maximum scale doesn't exceed the smallest buffer
    // dimension (so that there are no empty edges visible)
    if (this.options.clampCamera) {
      maximumScale = Math.min(maximumScale, this.size.width, this.size.height);
      if (width > height) {
        lockedAxis = "x";
      } else if (height > width) {
        lockedAxis = "y";
      }
    }
    this.scale = Tily.utility.clamp(
      this.scale,
      Math.max(this.options.minimumScale, 1),  // Minimum scale cannot go below 1 tile
      maximumScale
    );
    this.tileSize = (lockedAxis == "y" ? height : width) / this.scale;
    this.viewSize.width = width / this.tileSize;
    this.viewSize.height = height / this.tileSize;

    // Clamp camera offset
    if (this.options.clampCamera) {
      const centerX = this.viewSize.width * 0.5 - 0.5,
        centerY = this.viewSize.height * 0.5 - 0.5;
      this.offset = offset = Tily.utility.vec2(
        Tily.utility.clamp(offset.x, centerX, this.size.width - centerX - 1),
        Tily.utility.clamp(offset.y, centerY, this.size.height - centerY - 1)
      );
    }

    // Translate camera viewport
    this.context.translate(
      width * 0.5 - offset.x * this.tileSize - this.tileSize * 0.5,
      height * 0.5 - offset.y * this.tileSize - this.tileSize * 0.5
    );

    // Update active tiles map
    const halfSize = Tily.utility.vec2(this.viewSize.width * 0.5 + 1, this.viewSize.height * 0.5 + 1),
      tl = Tily.utility.vec2.map(Tily.utility.vec2.sub(offset, halfSize), Math.floor),
      br = Tily.utility.vec2.map(Tily.utility.vec2.add(offset, halfSize), Math.ceil),
      activeTiles = this.updateActiveTilesMap(tl, br);

    // Render layers and active tiles in z-order
    var j = 0;
    for (let i = 0, length = this.layers.length; i < length; i++) {
      this.layers[i].draw(this.context, this.tileSize, tl, br);

      // Draw active tiles on or below this layer
      while (j < activeTiles.length && activeTiles[j].zIndex < i + 1) {
        activeTiles[j].draw(this.context, elapsedTime, this.tileSize);
        j++;
      }
    }

    // Draw any remaining active tiles (ie. on the top layer)
    while (j < activeTiles.length) {
      activeTiles[j].draw(this.context, elapsedTime, this.tileSize);
      j++;
    }
    this.context.restore();
    context.drawImage(this.canvas, 0, 0);
  };

  /**
   * Get serializable data for this buffer.
   * @name getData
   * @function
   * @instance
   * @memberof Tily.Buffer
   * @returns {Object} This buffer's data.
   */
  Buffer.prototype.getData = function() {
    return {
      layers: this.layers.map(i => i.getData()),
      activeTiles: this.activeTiles.map(i => i.getData()),
      options: this.options,
      size: this.size,
      offset: this.offset,
      scale: this.scale
    };
  };

  /**
   * Create a buffer from data.
   * @name fromData
   * @function
   * @static
   * @memberof Tily.Buffer
   * @param {Object} data Serialized buffer data.
   * @returns {Tily.Buffer} A buffer created from the provided data.
   */
  Buffer.fromData = function(data) {
    const buffer = new Tily.Buffer(data.size.width, data.size.height, data.options);
    buffer.size = data.size;
    buffer.offset = data.offset;
    buffer.scale = data.scale;
    buffer.layers = data.layers.map(i => Tily.TileLayer.fromData(buffer, i));
    buffer.activeTiles = data.activeTiles.map(i => Tily.ActiveTile.fromData(i));
    return buffer;
  };

  /**
   * Serialize this buffer and return the serialized JSON data.
   * @name serialize
   * @function
   * @instance
   * @memberof Tily.Buffer
   * @returns {string} This buffer serialized as JSON data.
   */
  Buffer.prototype.serialize = function() {
    return JSON.stringify(this.getData());
  };

  /**
   * Deserialize the JSON data into a buffer.
   * @name deserialize
   * @function
   * @static
   * @memberof Tily.Buffer
   * @param {string} s The JSON data to deserialize.
   * @returns {Tily.Buffer} The deserialized buffer.
   */
  Buffer.deserialize = function(s) {
    var data = null;
    try {
      data = JSON.parse(s);
    } catch (e) {
      console.log("Couldn't deserialize data: %O", e);
      return null;
    }
    return Tily.Buffer.fromData(data);
  };
  return Buffer;
}(Tily.BufferBase));

Tily.CellBuffer = (function(_super) {
  "use strict";
  Tily.utility.__extends(CellBuffer, _super);

  /**
   * @callback resolveCellFunction
   * @param {Tily.Cell} cell The generated cell.
   */
  /**
   * @callback rejectCellFunction
   * @param {string} reason A string containing the reason that cell generation failed.
   */
  /**
   * @callback cellFunction
   * @param {Tily.CellBuffer} buffer The cell buffer that the resulting cell will belong to.
   * @param {number} x The cell x-coordinate.
   * @param {number} y The cell y-coordinate.
   * @param {resolveCellFunction} resolve A function to call if the cell is generated
   * successfully.
   * @param {rejectCellFunction} reject A function to call if cell generation failed.
   */
  /**
   * @typedef CellBufferOptions
   * @type {BufferOptions}
   * @property {number} [cellWidth=16] The width of each cell measured in tiles.
   * @property {number} [cellHeight=16] The height of each cell measured in tiles.
   * @property {?number} [minimumX=null] The minimum cell x-coordinate. If this is null, the cell
   * buffer will scroll infinitely in the negative-x direction.
   * @property {?number} [minimumY=null] The minimum cell y-coordinate. If this is null, the cell
   * buffer will scroll infinitely in the negative-x direction.
   * @property {?number} [maximumX=null] The maximum cell x-coordinate. If this is null, the cell
   * buffer will scroll infinitely in the positive-x direction.
   * @property {?number} [maximumY=null] The maximum cell y-coordinate. If this is null, the cell
   * buffer will scroll infinitely in the positive-y direction.
   * @property {?cellFunction} [cellFunction=null] A function for generating cells.
   */
  /**
   * Default cell buffer options, used as a fall-back for options passed to the constructor.
   * @type {CellBufferOptions}
   */
  const _defaultCellBufferOptions = {
    cellWidth: 16,
    cellHeight: 16,
    minimumX: null,
    minimumY: null,
    maximumX: null,
    maximumY: null,
    cellFunction: null
  };

  /**
   * A buffer made out of rectangular cells generated by a cell function, used for infinite
   * scrolling buffers and procedurally generated buffers.
   * @class
   * @extends Tily.BufferBase
   * @memberof Tily
   * @param {CellBufferOptions} [options] An optional options object for configuring the buffer.
   */
  function CellBuffer(options) {
    _super.call(this, options);

    /**
     * A cache of loaded cells with hashed cell positions as keys and cell instances as values.
     * @type {Object}
     */
    this.cellCache = {};

    /**
     * Options for configuring this cell buffer.
     * @type {CellBufferOptions}
     */
    this.options = { ..._defaultCellBufferOptions, ...this.options, ...options || {} };
  }

  /**
   * Get a string representation of the specified position for use as a hash.
   * @param {Tily.utility.vec2} p The position to hash.
   * @returns {string} A hash string for the specified position.
   */
  function hash(p) {
    return Tily.utility.vec2.toString(p, "_");
  }

  /**
   * @typedef CellBufferTileInfo
   * @type {BufferBaseTileInfo}
   * @property {Tily.utility.vec2} cell The cell coordinate for the specified tile position.
   * @property {string[]} layers The tile layer characters in z-index order at a tile position.
   */
  /**
   * Get information about the tiles and active tiles at a tile position.
   * @name getTileInfo
   * @function
   * @instance
   * @memberof Tily.CellBuffer
   * @param {number} x The x-coordinate of the tile position.
   * @param {number} y The y-coordinate of the tile position.
   * @returns {CellBufferTileInfo} Information about the tiles at the specified position.
   */
  CellBuffer.prototype.getTileInfo = function(x, y) {
    const tileInfo = _super.prototype.getTileInfo.call(this, x, y),
      cell = Tily.utility.vec2.map(
        Tily.utility.vec2(x / this.options.cellWidth, y / this.options.cellHeight),
        Math.floor
      ),
      cellOffset = Tily.utility.vec2(
        x - cell.x * this.options.cellWidth,
        y - cell.y * this.options.cellHeight
      ),
      h = hash(cell);
    var layers = [];
    if (this.cellCache[h]) {
      layers = this.cellCache[h].layers.map(i => i.getTile(cellOffset.x, cellOffset.y));
    }
    tileInfo.cell = cell;
    tileInfo.layers = layers;
    return tileInfo;
  };

  /**
   * Render this buffer's cells onto the specified context.
   * @name draw
   * @function
   * @instance
   * @memberof Tily.CellBuffer
   * @param {CanvasRenderingContext2D} context The context to render the buffer onto.
   * @param {number} elapsedTime The time elapsed in seconds since the last draw call.
   * @param {number} width The width of the canvas in pixels.
   * @param {number} height The height of the canvas in pixels.
   */
  CellBuffer.prototype.draw = function(context, elapsedTime, width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.context.save();
    // this.context.textBaseline = "top";
    this.context.clearRect(0, 0, width, height);

    // Update transitions
    const offset = this.updateTransitions(elapsedTime);

    // Clamp camera scale
    var lockedAxis = this.options.lockedAxis,
      maximumScale = this.options.maximumScale;

    // Get cell buffer size
    const size = { width: Infinity, height: Infinity };
    if (this.options.minimumX && this.options.maximumX) {
      size.width = (this.options.maximumX - this.options.minimumX) * this.options.cellWidth;
    }
    if (this.options.minimumY && this.options.maximumY) {
      size.height = (this.options.maximumY - this.options.minimumY) * this.options.cellHeight;
    }

    // Camera clamping only clamps scale when the cell buffer has a finite dimension
    if (this.options.clampCamera) {
      maximumScale = Math.min(maximumScale, size.width, size.height);
      if (width > height) {
        lockedAxis = "x";
      } else if (height > width) {
        lockedAxis = "y";
      }
    }
    this.scale = Tily.utility.clamp(
      this.scale,
      Math.max(this.options.minimumScale, 1),  // Minimum scale cannot go below 1 tile
      maximumScale
    );
    this.tileSize = (lockedAxis == "y" ? height : width) / this.scale;
    this.viewSize.width = width / this.tileSize;
    this.viewSize.height = height / this.tileSize;

    // Clamp camera offset
    if (this.options.clampCamera) {
      const centerX = this.viewSize.width * 0.5 - 0.5,
        centerY = this.viewSize.height * 0.5 - 0.5;
      if (isFinite(size.width)) {
        this.offset.x = offset.x = Tily.utility.clamp(offset.x, centerX, size.width - centerX - 1);
      }
      if (isFinite(size.height)) {
        this.offset.y = offset.y = Tily.utility.clamp(offset.y, centerY, size.height - centerY - 1);
      }
    }

    // Translate camera viewport
    this.context.translate(
      width * 0.5 - offset.x * this.tileSize - this.tileSize * 0.5,
      height * 0.5 - offset.y * this.tileSize - this.tileSize * 0.5
    );

    // Update active tiles map
    const halfSize = Tily.utility.vec2(this.viewSize.width * 0.5 + 1, this.viewSize.height * 0.5 + 1),
      tl = Tily.utility.vec2.map(Tily.utility.vec2.sub(offset, halfSize), Math.floor),
      br = Tily.utility.vec2.map(Tily.utility.vec2.add(offset, halfSize), Math.ceil),
      activeTiles = this.updateActiveTilesMap(tl, br);

    // Find the top-left and bottom-right cell positions currently in view
    const cellSize = Tily.utility.vec2(this.options.cellWidth, this.options.cellHeight),
      tlCell = Tily.utility.vec2.map(Tily.utility.vec2.div(tl, cellSize), Math.floor),
      brCell = Tily.utility.vec2.map(Tily.utility.vec2.div(br, cellSize), Math.ceil),
      cache = this.cellCache,
      getResolve = function(x, y) {
        return function(cell) {
          cache[hash(Tily.utility.vec2(x, y))] = cell;
        };
      },
      getReject = function(x, y) {
        return function(reason) {
          console.log("Couldn't generate cell (%i, %i): %s", x, y, reason);
        };
      };
    var h = null;
    for (let x = tlCell.x; x < brCell.x; x++) {
      for (let y = tlCell.y; y < brCell.y; y++) {
        h = hash(Tily.utility.vec2(x, y));

        // If the cell isn't already in the cell cache and there is a cell function,
        // generate a cell and temporarily mark it as loading
        if (this.cellCache[h] === undefined) {
          this.cellCache[h] = true;  // Mark it as currently loading
          if (this.options.cellFunction) {
            this.options.cellFunction(this, x, y, getResolve(x, y), getReject(x, y));
          }

        // Otherwise, if the cell isn't currently loading, render the cell
        } else if (this.cellCache[h] !== true) {
          this.cellCache[h].draw(
            this.context,
            elapsedTime,
            x, y,
            this.tileSize,
            tl, br,
            activeTiles
          );
        }
      }
    }
    this.context.restore();
    context.drawImage(this.canvas, 0, 0);
  };

  /**
   * Serialize this cell buffer and return the serialized JSON data. The cell function will not
   * be serialized and will need to be re-attached when the data is deserialized.
   * @name serialize
   * @function
   * @instance
   * @memberof Tily.CellBuffer
   * @returns {string} This buffer serialized as JSON data.
   */
  CellBuffer.prototype.serialize = function() {
    const cellCache = {};
    for (let i in this.cellCache) {
      if (!this.cellCache.hasOwnProperty(i)) { continue; }
      cellCache[i] = this.cellCache[i].getData();
    }
    return JSON.stringify({
      cellCache: cellCache,
      activeTiles: this.activeTiles.map(i => i.getData()),
      options: this.options,
      offset: this.offset,
      scale: this.scale
    });
  };

  /**
   * Deserialize the JSON data into a cell buffer. The cell function will need to be re-attached
   * to the resulting cell buffer, as it cannot be serialized.
   * @name deserialize
   * @function
   * @static
   * @memberof Tily.CellBuffer
   * @param {string} s The JSON data to deserialize.
   * @returns {Tily.CellBuffer} The deserialized buffer.
   */
  CellBuffer.deserialize = function(s) {
    var data = null;
    const cellCache = {};
    try {
      data = JSON.parse(s);
    } catch (e) {
      console.log("Couldn't deserialize data: %O", e);
      return null;
    }
    for (let i in data.cellCache) {
      if (!data.cellCache.hasOwnProperty(i)) { continue; }
      cellCache[i] = Tily.Cell.fromData(data.cellCache[i]);
    }
    const buffer = new Tily.CellBuffer(data.options);
    buffer.offset = data.offset;
    buffer.scale = data.scale;
    buffer.cellCache = cellCache;
    buffer.activeTiles = data.activeTiles.map(i => Tily.ActiveTile.fromData(i));
    return buffer;
  };
  return CellBuffer;
}(Tily.BufferBase));

Tily.Cell = (function() {
  "use strict";

  /**
   * A rectangular cell of tiles displayed in a cell buffer.
   * @class
   * @memberof Tily
   * @param {Tily.CellBuffer} buffer The cell buffer that this cell belongs to.
   */
  function Cell(buffer) {
    /**
     * The cell buffer that this cell belongs to.
     * @type {Tily.CellBuffer}
     */
    this.buffer = buffer;

    /**
     * An array of layers contained in this cell.
     * @type {Tily.TilyLayer[]}
     */
    this.layers = [];
  }

  /**
   * Check if position p is inside the region between tl and br.
   * @param {Tily.utility.vec2} p The position to check.
   * @param {Tily.utility.vec2} tl The top-left corner of the region.
   * @param {Tily.utility.vec2} br The bottom-right corner of the region.
   * @returns {boolean} True if the position p is inside the region.
   */
  function checkBounds(p, tl, br) {
    return (p.x >= tl.x && p.x <= br.x && p.y >= tl.y && p.y <= br.y);
  }

  /**
   * Add a layer to this cell at the specified z-index. If the z-index is undefined, add the
   * layer on top of existing layers, and if the z-index is -1, add the layer below existing
   * layers.
   * @name addLayer
   * @function
   * @instance
   * @memberof Tily.Cell
   * @param {Tily.TileLayer} layer The layer to add.
   * @param {number} [z] The z-index at which to add the layer. If this is -1, the layer will be
   * added below existing layers and if it is undefined the layer will be added above existing
   * layers.
   */
  Cell.prototype.addLayer = function(layer, z) {
    // If no layer is specified, create a new one
    layer = layer || new Tily.TileLayer(this);

    // Make sure the layer has a reference to this buffer
    layer.container = this;
    if (z === undefined) {
      this.layers.push(layer);
    } else if (z == -1) {
      this.layers.unshift(layer);
    } else {
      this.layers.splice(z, 0, layer);
    }
    return layer;
  };

  /**
   * Remove a layer at the specified z-index. If the z-index is undefined, remove the top layer
   * and if the z-index is -1, remove the bottom layer. The removed layer is returned.
   * @name removeLayer
   * @function
   * @instance
   * @memberof Tily.Cell
   * @param {number} [z] The z-index of the layer to remove. If this is -1, the bottom layer will
   * be removed and if it is undefined the top layer will be removed.
   * @returns {Tily.TileLayer} The layer that was removed.
   */
  Cell.prototype.removeLayer = function(z) {
    if (this.layers.length < 1) { return null; }
    if (z === undefined) {
      return this.layers.pop();
    } else if (z == -1) {
      return this.layers.shift();
    }
    return this.layers.splice(z, 1)[0];
  };

  /**
   * Remove all layers from this cell.
   * @name removeAllLayers
   * @function
   * @instance
   * @memberof Tily.Cell
   */
  Cell.prototype.removeAllLayers = function() {
    this.layers = [];
  };

  /**
   * Move a layer from one z-index to another z-index, either an absolute value or relative to
   * the layer's current z-index.
   * @name moveLayer
   * @function
   * @instance
   * @memberof Tily.Cell
   * @param {number} zFrom The z-index of the layer to move.
   * @param {number} zTo The z-index to move the layer to.
   * @param {boolean} relative If this is true, the layer will be moved relative to it's current
   * z-index.
   * @returns {boolean} True if a layer was moved successfully.
   */
  Cell.prototype.moveLayer = function(zFrom, zTo, relative) {
    if (this.layers.length < 2) { return false; }
    if (zFrom < 0 || zFrom >= this.layers.length) { return false; }
    const layer = this.layers.splice(zFrom, 1)[0],
      toIndex = Tily.utility.clamp(relative ? zFrom + zTo : zTo, 0, this.layers.length);
    this.layers.splice(toIndex, 0, layer);
    return true;
  };

  /**
   * @name size
   * @description The size of this cell, as defined in the cell buffer options.
   * @instance
   * @memberof Tily.Cell
   * @type {Size}
   */
  Object.defineProperty(Cell.prototype, "size", {
    get: function() {
      return {
        width: this.buffer.options.cellWidth,
        height: this.buffer.options.cellHeight
      };
    }
  });

  /**
   * Render this layer onto the specified context.
   * @name draw
   * @function
   * @instance
   * @memberof Tily.Cell
   * @param {CanvasRenderingContext2D} context The context to render the layer onto.
   * @param {number} elapsedTime The time elapsed in seconds since the last draw call.
   * @param {number} x The cell x-coordinate.
   * @param {number} y The cell y-coordinate.
   * @param {number} tileSize The size of each tile measured in pixels.
   * @param {Tily.utility.vec2} tl The top-left tile position currently in view.
   * @param {Tily.utility.vec2} br The bottom-right tile position currently in view.
   * @param {Tily.ActiveTile[]} activeTiles A list of active tiles currently in view, sorted by
   * z-index (ascending).
   */
  Cell.prototype.draw = function(context, elapsedTime, x, y, tileSize, tl, br, activeTiles) {
    context.save();

    // Translate to cell position
    const size = this.size;
    context.translate(x * tileSize * size.width, y * tileSize * size.height);

    // Get a list of active tiles in this cell
    const activeTilesCell = activeTiles.filter(i => checkBounds(
      Tily.utility.vec2.add(i.position, i.offset),
      Tily.utility.vec2(x * size.width, y * size.height),
      Tily.utility.vec2((x + 1) * size.width, (y + 1) * size.height)
    ));

    // Get tl and br in terms of cell offsets
    const cellOffset = Tily.utility.vec2(x * size.width, y * size.height),
      tlCell = Tily.utility.vec2.sub(tl, cellOffset),
      brCell = Tily.utility.vec2.sub(br, cellOffset);
    var j = 0;
    for (let i = 0, length = this.layers.length; i < length; i++) {
      this.layers[i].draw(context, tileSize, tlCell, brCell);

      // Draw active tiles on or below this layer
      while (j < activeTilesCell.length && activeTilesCell[j].zIndex < i + 1) {
        activeTilesCell[j].draw(context, elapsedTime, tileSize);
        j++;
      }
    }

    // Draw any remaining active tiles in this cell (ie. on the top layer)
    while (j < activeTilesCell.length) {
      activeTilesCell[j].draw(context, elapsedTime, tileSize);
      j++;
    }
    context.restore();
  };

  /**
   * Get serializable data for this cell.
   * @name getData
   * @function
   * @instance
   * @memberof Tily.Cell
   * @returns {Object} This cell's data.
   */
  Cell.prototype.getData = function() {
    return {
      layers: this.layers.map(i => i.getData())
    };
  };

  /**
   * Create a cell from data.
   * @name fromData
   * @function
   * @static
   * @memberof Tily.Cell
   * @param {Tily.CellBuffer} buffer The cell buffer that the cell belongs to.
   * @param {Object} data Serialized cell data.
   * @returns {Tily.Cell} A cell created from the provided data.
   */
  Cell.fromData = function(buffer, data) {
    const cell = new Tily.Cell(buffer);
    cell.layers = data.layers.map(i => Tily.TileLayer.fromData(cell, i));
    return cell;
  };

  /**
   * Serialize this cell and return the serialized JSON data.
   * @name serialize
   * @function
   * @instance
   * @memberof Tily.Cell
   * @returns {string} This cell serialized as JSON data.
   */
  Cell.prototype.serialize = function() {
    return JSON.stringify(this.getData());
  };

  /**
   * Deserialize the JSON data into a cell.
   * @name deserialize
   * @function
   * @static
   * @memberof Tily.Cell
   * @param {Tily.CellBuffer} buffer The cell buffer that the cell belongs to.
   * @param {string} s The JSON data to deserialize.
   * @returns {Tily.Cell} The deserialized cell.
   */
  Cell.deserialize = function(buffer, s) {
    var data = null;
    try {
      data = JSON.parse(s);
    } catch (e) {
      console.log("Couldn't deserialize data: %O", e);
      return null;
    }
    return Tily.Cell.fromData(buffer, data);
  };
  return Cell;
}());

Tily.TileLayer = (function() {
  "use strict";

  /**
   * A layer of tiles displayed in a buffer or a cell.
   * @class
   * @memberof Tily
   * @param {Tily.Buffer|Tily.Cell} container The buffer or cell that this layer belongs to.
   */
  function TileLayer(container) {
    /**
     * The buffer or cell that this layer belongs to.
     * @type {Tily.Buffer|Tily.Cell}
     */
    this.container = container;

    /**
     * The font to use for this layer's tiles.
     * @default "sans-serif"
     * @type {string}
     */
    this.font = "sans-serif";

    /**
     * The colour to use for this layer's tile characters.
     * @default "white"
     * @type {string}
     */
    this.foreground = "white";

    /**
     * The colour to use for this layer's tile backgrounds. If the string is empty, tile
     * backgrounds won't be rendered.
     * @default ""
     * @type {string}
     */
    this.background = "";

    /**
     * Optional map of foreground colours
     * @default null
     * @type {string}
     */
    this.foregroundMap = null;

    /**
     * Optional map of background colours
     * @default null
     * @type {string}
     */
    this.backgroundMap = null;

    /**
     * The opacity of this layer's tiles.
     * @default 1
     * @type {number}
     */
    this.opacity = 1;

    /**
     * The composite operation to use when drawing this layer.
     * @default "source-over"
     * @type {string}
     */
    this.compositeMode = "source-over";

    /**
     * Whether or not to clip this layer's tiles at their edges.
     * @default false
     * @type {boolean}
     */
    this.clip = false;

    /**
     * True if the text in this layer's tiles should be centered.
     * @default false
     * @type {boolean}
     */
    this.centered = false;

    /**
     * An array of strings for each tile. If any element in this array has length greater than
     * 1, the string characters will be rendered on top of each other. If any element is an
     * empty string, the tile won't be rendered.
     * @type {string[]}
     */
    this.tiles = [];
  }

  /**
   * Return the array index from a given position.
   * @param {number} x The x-coordinate of the position.
   * @param {number} y The y-coordinate of the position.
   * @param {number} w The width of this layer.
   * @returns {number} An array index.
   */
  function index(x, y, w) {
    return w * y + x;
  }

  /**
   * Return the position from a given array index.
   * @param {number} i The array index.
   * @param {number} w The width of this layer.
   * @returns {Tily.utility.vec2} A 2d position.
   */
  function position(i, w) {
    return Tily.utility.vec2(i % w, Math.floor(i / w));
  }

  /**
   * Return information about the region between (x1, y1) and (x2, y2). The second corner must be
   * below and to the right of the first corner. Corners will default to the top-left and
   * bottom-right corners of the layer if undefined.
   * @param {number} x1 The x-coordinate of the top-left corner of the region.
   * @param {number} y1 The y-coordinate of the top-left corner of the region.
   * @param {number} x2 The x-coordinate of the bottom-right corner of the region.
   * @param {number} y2 The y-coordinate of the bottom-right corner of the region.
   * @param {number} w The width of this layer.
   * @param {number} h The height of this layer.
   * @returns {Object} An object containing the start offset into the tiles array, the width and
   * height of the region and the gap between row sections.
   */
  function region(x1, y1, x2, y2, w, h) {
    x1 = x1 || 0;
    y1 = y1 || 0;
    x2 = x2 || w;
    y2 = y2 || h;

    // Make sure (x2, y2) is below and to the right of (x1, y1), or at the same position.
    x2 = Math.max(x1, x2);
    y2 = Math.max(y1, y2);

    // Make sure both corners are within layer bounds
    x1 = Tily.utility.clamp(x1, 0, w);
    y1 = Tily.utility.clamp(y1, 0, h);
    x2 = Tily.utility.clamp(x2, 0, w);
    y2 = Tily.utility.clamp(y2, 0, h);
    const width = x2 - x1;
    return {
      start: index(x1, y1, w),
      width: Math.abs(width),
      height: Math.abs(y2 - y1),
      gap: w - width
    };
  }

  /**
   * Get the characters at the specified tile position, or an empty string if there are no
   * characters at this tile position.
   * @name getTile
   * @function
   * @instance
   * @memberof Tily.TileLayer
   * @param {number} x The x-coordinate of the position.
   * @param {number} y The y-coordinate of the position.
   * @returns {string} The character or characters at the specified position.
   */
  TileLayer.prototype.getTile = function(x, y) {
    if (
      x >= 0 && x < this.container.size.width &&
      y >= 0 && y < this.container.size.height
    ) {
      return this.tiles[index(x, y, this.container.size.width)] || "";
    }
    return "";
  };

  TileLayer.prototype.getForeground = function(x, y) {
    if (
      this.foregroundMap !== null &&
      x >= 0 && x < this.container.size.width &&
      y >= 0 && y < this.container.size.height
    ) {
      return this.foregroundMap[index(x, y, this.container.size.width)] || this.foreground;
    }
    return this.foreground;
  };

  TileLayer.prototype.getBackground = function(x, y) {
    if (
      this.backgroundMap !== null &&
      x >= 0 && x < this.container.size.width &&
      y >= 0 && y < this.container.size.height
    ) {
      return this.backgroundMap[index(x, y, this.container.size.width)] || this.background;
    }
    return this.background;
  };

  /**
   * Set the characters at the specified tile position.
   * @name setTile
   * @function
   * @instance
   * @memberof Tily.TileLayer
   * @param {number} x The x-coordinate of the position.
   * @param {number} y The y-coordinate of the position.
   * @param {string} character The character or characters to set.
   * @param {string} foreground The foreground colour for this tile, or null to use default
   * @param {string} background The background colour for this tile, or null to use default
   * @returns {boolean} True if the tile was set successfully.
   */
  TileLayer.prototype.setTile = function(x, y, character, foreground = null, background = null) {
    if (
      x >= 0 && x < this.container.size.width &&
      y >= 0 && y < this.container.size.height
    ) {
      this.tiles[index(x, y, this.container.size.width)] = character;
      if (foreground !== null) {
        if (this.foregroundMap === null) {
          this.foregroundMap = [];
        }
        this.foregroundMap[index(x, y, this.container.size.width)] = foreground;
      }
      if (background !== null) {
        if (this.backgroundMap === null) {
          this.backgroundMap = [];
        }
        this.backgroundMap[index(x, y, this.container.size.width)] = background;
      }
      return true;
    }
    return false;
  };

  /**
   * Set the characters for all tiles in a rectangular region. If x2 and y2 are not specified
   * then fill from (x1, y1) to the bottom-right corner, and if no coordinates are specified then
   * fill the entire layer. Top-left corner is inclusive, bottom-right corner is exclusive.
   * @name fill
   * @function
   * @instance
   * @memberof Tily.TileLayer
   * @param {string} character The character or characters to set.
   * @param {number} [x1] The x-coordinate of the top-left corner of the region.
   * @param {number} [y1] The y-coordinate of the top-left corner of the region.
   * @param {number} [x2] The x-coordinate of the bottom-right corner of the region.
   * @param {number} [y2] The y-coordinate of the bottom-right corner of the region.
   */
  TileLayer.prototype.fill = function(character, x1, y1, x2, y2, foreground = null, background = null) {
    const r = region(x1, y1, x2, y2, this.container.size.width, this.container.size.height);
    for (let i = r.start, y = r.height; y--; i += r.gap) {
      for (let x = r.width; x--; i++) {
        this.tiles[i] = character;
        if (foreground !== null) {
          if (this.foregroundMap === null) {
            this.foregroundMap = [];
          }
          this.foregroundMap[i] = foreground;
        }
        if (background !== null) {
          if (this.backgroundMap === null) {
            this.backgroundMap = [];
          }
          this.backgroundMap[i] = background;
        }
      }
    }
  };

  /**
   * Clear all tiles in a rectangular region. If x2 and y2 are not specified then clear from
   * (x1, y1) to the bottom-right corner, and if no coordinates are specified then clear the
   * entire layer. Top-left corner is inclusive, bottom-right corner is exclusive.
   * @name clear
   * @function
   * @instance
   * @memberof Tily.TileLayer
   * @param {number} [x1] The x-coordinate of the top-left corner of the region.
   * @param {number} [y1] The y-coordinate of the top-left corner of the region.
   * @param {number} [x2] The x-coordinate of the bottom-right corner of the region.
   * @param {number} [y2] The y-coordinate of the bottom-right corner of the region.
   */
  TileLayer.prototype.clear = function(x1, y1, x2, y2) {
    const r = region(x1, y1, x2, y2, this.container.size.width, this.container.size.height);
    for (let i = r.start, y = r.height; y--; i += r.gap) {
      for (let x = r.width; x--; i++) {
        this.tiles[i] = "";
        if (this.foregroundMap !== null) {
          this.foregroundMap[i] = null;
        }
        if (this.backgroundMap !== null) {
          this.backgroundMap[i] = null;
        }
      }
    }
  };

  /**
   * Rearrange the tiles in this layer so they align with the specified width and height.
   * @name resize
   * @function
   * @instance
   * @memberof Tily.TileLayer
   * @param {number} width The new layer width.
   * @param {number} height The new layer height.
   */
  TileLayer.prototype.resize = function(width, height) {
    if (width == this.container.size.width && height == this.container.size.height) { return; }
    const tiles = [], foreground = [], background = [];
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const i = index(x, y, width);
        tiles[i] = this.getTile(x, y);
        foreground[i] = this.getForeground(x, y);
        background[i] = this.getBackground(x, y);
      }
    }
    this.tiles = tiles;
    if (this.foregroundMap) {
      this.foregroundMap = foreground;
    }
    if (this.backgroundMap) {
      this.backgroundMap = background;
    }
  };

  /**
   * Render this layer onto the specified context. If a tile has a string with length greater
   * than 1, draw each character of the string on top of each other.
   * @name draw
   * @function
   * @instance
   * @memberof Tily.TileLayer
   * @param {CanvasRenderingContext2D} context The context to render the layer onto.
   * @param {number} tileSize The size of each tile measured in pixels.
   * @param {Tily.utility.vec2} tl The top-left tile position currently in view.
   * @param {Tily.utility.vec2} br The bottom-right tile position currently in view.
   */
  TileLayer.prototype.draw = function(context, tileSize, tl, br) {
    if (!this.container || !this.tiles) { return; }  // Layer has no container or no tiles
    const width = this.container.size.width,
      height = this.container.size.height,
      r = region(tl.x, tl.y, br.x, br.y, width, height);
    var p = null;
    context.save();
    context.font = (tileSize + 1) + "px " + this.font;
    context.globalAlpha = this.opacity;
    context.globalCompositeOperation = this.compositeMode;

    // Render background tiles if a background colour or background map is defined
    if (this.background || this.backgroundMap) {
      context.fillStyle = this.background;
      for (let i = r.start, y = r.height; y--; i += r.gap) {
        for (let x = r.width; x--; i++) {
          if (!this.tiles[i]) { continue; }
          p = position(i, width);
          context.save();
          if (this.backgroundMap && this.backgroundMap[i]) {
            context.fillStyle = this.backgroundMap[i];
          }
          context.fillRect(
            p.x * tileSize - 0.5,
            p.y * tileSize - 0.5,
            tileSize + 1,
            tileSize + 1
          );
          context.restore();
        }
      }
    }

    // Render foreground characters
    let c;
    if (this.centered === true) {
      c = Tily.utility.vec2.mul(Tily.utility.vec2(0.5, 0.5), tileSize);
      context.textAlign = "center";
      context.textBaseline = "middle";
    } else {
      c = Tily.utility.vec2.mul(Tily.utility.vec2(0, 0), tileSize);
      context.textAlign = "left";
      context.textBaseline = "top";
    }
    context.fillStyle = this.foreground;
    for (let i = r.start, y = r.height; y--; i += r.gap) {
      for (let x = r.width; x--; i++) {
        if (!this.tiles[i]) { continue; }
        p = position(i, width);
        context.save();
        if (this.foregroundMap && this.foregroundMap[i]) {
          context.fillStyle = this.foregroundMap[i];
        }
        if (this.clip) {  // Clip tile boundaries if clipping is enabled
          context.rect(p.x * tileSize, p.y * tileSize, tileSize, tileSize);
          context.clip();
        }
        for (let j = 0, length = this.tiles[i].length; j < length; j++) {
          context.fillText(this.tiles[i][j], p.x * tileSize + c.x, p.y * tileSize + c.y);
        }
        context.restore();
      }
    }
    context.restore();
  };

  /**
   * Get serializable data for this tile layer.
   * @name getData
   * @function
   * @instance
   * @memberof Tily.TileLayer
   * @returns {Object} This tile layer's data.
   */
  TileLayer.prototype.getData = function() {
    return {
      font: this.font,
      foreground: this.foreground,
      background: this.background,
      foregroundMap: this.foregroundMap,
      backgroundMap: this.backgroundMap,
      opacity: this.opacity,
      compositeMode: this.compositeMode,
      clip: this.clip,
      centered: this.centered,
      tiles: this.tiles
    };
  };

  /**
   * Create a tile layer from data.
   * @name fromData
   * @function
   * @static
   * @memberof Tily.TileLayer
   * @param {Tily.Buffer|Tily.Cell} container The buffer or cell that the layer belongs to.
   * @param {Object} data Serialized buffer layer data.
   * @returns {Tily.TileLayer} A buffer layer created from the provided data.
   */
  TileLayer.fromData = function(container, data) {
    const layer = new Tily.TileLayer(container);
    layer.font = data.font;
    layer.foreground = data.foreground;
    layer.background = data.background;
    layer.foregroundMap = data.foregroundMap;
    layer.backgroundMap = data.backgroundMap;
    layer.opacity = data.opacity;
    layer.compositeMode = data.compositeMode;
    layer.clip = data.clip;
    layer.centered = data.centered;
    layer.tiles = data.tiles;
    return layer;
  };
  return TileLayer;
}());

Tily.ActiveTileBase = (function() {
  "use strict";

  /**
   * Implements basic functionality for active tiles and active tile layers.
   * @class
   * @memberof Tily
   */
  function ActiveTileBase() {
    /**
     * The layers in this active tile.
     * @type {Tily.ActiveTileLayer[]}
     */
    this.layers = [];

    /**
     * The animations currently running on this active tile.
     * @type {Tily.Animation[]}
     */
    this.animations = [];

    /**
     * The font to use when rendering this active tile. Set this to null to inherit from the
     * parent object.
     * @default null
     * @type {?string}
     */
    this.font = null;

    /**
     * The font style to use when rendering this active tile. Set this to null to inherit from the
     * parent object.
     * @default null
     * @type {?string}
     */
    this.fontStyle = null;

    /**
     * The font size to use when rendering this active tile. Set this to null to inherit from the
     * parent object.
     * @default null
     * @type {?string}
     */
    this.fontSize = null;

    /**
     * The foreground colour of this active tile. Set this to null to inherit from the parent
     * object.
     * @default null
     * @type {?string}
     */
    this.foreground = null;

    /**
     * The outline width and colour of this active tile. Set this to null to inherit from the parent
     * object.
     * @default null
     * @type {?string}
     */
    this.outline = null;

    /**
     * The shadow width, offset and colour of this active tile. Set this to null to inherit from the parent
     * object.
     * @default null
     * @type {?string}
     */
    this.shadow = null;

    /**
     * The opacity of this active tile. Set this to null to inherit from the parent object.
     * @default null
     * @type {?number}
     */
    this.opacity = null;

    /**
     * The composite operation to use when drawing this active tile.
     * @default "source-over"
     * @type {string}
     */
    this.compositeMode = "source-over";

    /**
     * The offset of this active tile measured in tiles. Set this to null to inherit from the
     * parent object.
     * @default null
     * @type {?Tily.utility.vec2}
     */
    this.offset = null;

    /**
     * The scale of this active tile. Set this to null to inherit from the parent object.
     * @default null
     * @type {?Tily.utility.vec2}
     */
    this.scale = null;

    /**
     * The rotation angle of this active tile measured in radians. Set this to null to inherit
     * from the parent object.
     * @default null
     * @type {?number}
     */
    this.rotation = null;

    /**
     * If the text in this tile should be centered. Set this to null to inherit from the parent object.
     * @default null
     * @type {?boolean}
     */
    this.centered = null;
  }

  /**
   * Define an inherited property on this object's prototype
   * @param {string} name The name of the property that is inherited from the parent object.
   * @param {string} inheritedName The name of the inherited property that will be defined.
   */
  function createInheritedProperty(name, inheritedName) {
    Object.defineProperty(ActiveTileBase.prototype, inheritedName, {
      get: function() {
        if (this[name] !== null) {
          return this[name];
        }
        if (this.parent instanceof Tily.ActiveTile) {
          return this.parent[name];
        }
        return this.parent[inheritedName];
      }
    });
  }

  /**
   * @name inheritedFont
   * @description The font set in this layer or inherited from the parent object if null.
   * @instance
   * @memberof Tily.ActiveTileBase
   * @type {string}
   */
  createInheritedProperty("font", "inheritedFont");

  /**
   * @name inheritedFontStyle
   * @description The font style set in this layer or inherited from the parent object if null.
   * @instance
   * @memberof Tily.ActiveTileBase
   * @type {string}
   */
  createInheritedProperty("fontStyle", "inheritedFontStyle");

  /**
   * @name inheritedFontSize
   * @description The font size set in this layer or inherited from the parent object if null.
   * @instance
   * @memberof Tily.ActiveTileBase
   * @type {string}
   */
  createInheritedProperty("fontSize", "inheritedFontSize");

  /**
   * @name inheritedForeground
   * @description The foreground colour set in this layer or inherited from the parent object if
   * null.
   * @instance
   * @memberof Tily.ActiveTileBase
   * @type {string}
   */
  createInheritedProperty("foreground", "inheritedForeground");

  /**
   * @name inheritedOutline
   * @description The outline set in this layer or inherited from the parent object if
   * null.
   * @instance
   * @memberof Tily.ActiveTileBase
   * @type {string}
   */
  createInheritedProperty("outline", "inheritedOutline");

  /**
   * @name inheritedShadow
   * @description The shadow set in this layer or inherited from the parent object if
   * null.
   * @instance
   * @memberof Tily.ActiveTileBase
   * @type {string}
   */
  createInheritedProperty("shadow", "inheritedShadow");

  /**
   * @name inheritedOpacity
   * @description The opacity set in this layer or inherited from the parent object if null.
   * @instance
   * @memberof Tily.ActiveTileBase
   * @type {number}
   */
  createInheritedProperty("opacity", "inheritedOpacity");

  /**
   * @name inheritedCompositeMode
   * @description The composite operation set in this layer or inherited from the parent object if null.
   * @instance
   * @memberof Tily.ActiveTileBase
   * @type {string}
   */
  createInheritedProperty("compositeMode", "inheritedCompositeMode");

  /**
   * @name inheritedOffset
   * @description The offset set in this layer or inherited from the parent object if null.
   * @instance
   * @memberof Tily.ActiveTileBase
   * @type {Tily.utility.vec2}
   */
  createInheritedProperty("offset", "inheritedOffset");

  /**
   * @name inheritedScale
   * @description The scale set in this layer or inherited from the parent object if null.
   * @instance
   * @memberof Tily.ActiveTileBase
   * @type {Tily.utility.vec2}
   */
  createInheritedProperty("scale", "inheritedScale");

  /**
   * @name inheritedRotation
   * @description The rotation set in this layer or inherited from the parent object if null.
   * @instance
   * @memberof Tily.ActiveTileBase
   * @type {number}
   */
  createInheritedProperty("rotation", "inheritedRotation");

  /**
   * @name inheritedCentered
   * @description The centering mode in this layer or inherited from the parent object if null.
   * @instance
   * @memberof Tily.ActiveTileBase
   * @type {boolean}
   */
  createInheritedProperty("centered", "inheritedCentered");

  /**
   * Pause all animations below this layer.
   * @name pauseAnimations
   * @function
   * @instance
   * @memberof Tily.ActiveTileBase
   * @param {boolean} [inherit] If true (default) then pass down to child layers
   */
  ActiveTileBase.prototype.pauseAnimations = function(inherit = true) {
    this.animations.forEach(a => a.pause());
    if (inherit) {
      this.layers.forEach(l => l.pauseAnimations(inherit));
    }
  };

  /**
   * Un-pause all animations below this layer.
   * @name runAnimations
   * @function
   * @instance
   * @memberof Tily.ActiveTileBase
   * @param {boolean} [inherit] If true (default) then pass down to child layers
   */
  ActiveTileBase.prototype.runAnimations = function(inherit = true) {
    this.animations.forEach(a => a.run());
    if (inherit) {
      this.layers.forEach(l => l.runAnimations(inherit));
    }
  };

  /**
   * Reset all animations below this layer.
   * @name resetAnimations
   * @function
   * @instance
   * @memberof Tily.ActiveTileBase
   * @param {boolean} [inherit] If true (default) then pass down to child layers
   */
  ActiveTileBase.prototype.resetAnimations = function(inherit = true) {
    this.animations.forEach(a => a.reset());
    if (inherit) {
      this.layers.forEach(l => l.resetAnimations(inherit));
    }
  };

  /**
   * Stop and remove all animations below this layer.
   * @name stopAnimations
   * @function
   * @instance
   * @memberof Tily.ActiveTileBase
   * @param {boolean} [inherit] If true (default) then pass down to child layers
   */
  ActiveTileBase.prototype.stopAnimations = function(inherit = true) {
    this.animations = [];
    if (inherit) {
      this.layers.forEach(l => { l.animations = []; });
    }
  };

  /**
   * Animate this active tile's foreground colour.
   * @name animateForeground
   * @function
   * @instance
   * @memberof Tily.ActiveTileBase
   * @param {string} foreground The target foreground colour.
   * @param {AnimationOptions} [options] An optional options object.
   */
  ActiveTileBase.prototype.animateForeground = function(foreground, options) {
    const current = Tily.utility.parseColor(this.inheritedForeground),
      target = Tily.utility.parseColor(foreground),
      animation = new Tily.ForegroundAnimation(this, current, target, options);
    this.animations.push(animation);
    return new Promise(function(resolve, reject) { animation.finishedCallback = resolve; });
  };

  /**
   * Animate this active tile's outline.
   * @name animateOutline
   * @function
   * @instance
   * @memberof Tily.ActiveTileBase
   * @param {string} outline The target outline.
   * @param {AnimationOptions} [options] An optional options object.
   */
  ActiveTileBase.prototype.animateOutline = function(outline, options) {
    const current = this.inheritedOutline,
      target = outline,
      animation = new Tily.OutlineAnimation(this, current, target, options);
    this.animations.push(animation);
    return new Promise(function(resolve, reject) { animation.finishedCallback = resolve; });
  };

  /**
   * Animate this active tile's fshadow.
   * @name animateShadow
   * @function
   * @instance
   * @memberof Tily.ActiveTileBase
   * @param {string} shadow The target shadow.
   * @param {AnimationOptions} [options] An optional options object.
   */
  ActiveTileBase.prototype.animateShadow = function(shadow, options) {
    const current = this.inheritedShadow,
      target = shadow,
      animation = new Tily.ShadowAnimation(this, current, target, options);
    this.animations.push(animation);
    return new Promise(function(resolve, reject) { animation.finishedCallback = resolve; });
  };

  /**
   * Animate this active tile's opacity.
   * @name animateOpacity
   * @function
   * @instance
   * @memberof Tily.ActiveTileBase
   * @param {number} opacity The target opacity.
   * @param {AnimationOptions} [options] An optional options object.
   */
  ActiveTileBase.prototype.animateOpacity = function(opacity, options) {
    const current = this.inheritedOpacity,
      animation = new Tily.OpacityAnimation(this, current, opacity, options);
    this.animations.push(animation);
    return new Promise(function(resolve, reject) { animation.finishedCallback = resolve; });
  };

  /**
   * Animate this active tile's scale.
   * @name animateScale
   * @function
   * @instance
   * @memberof Tily.ActiveTileBase
   * @param {number} x The target x-scale.
   * @param {number} y The target y-scale.
   * @param {AnimationOptions} [options] An optional options object.
   */
  ActiveTileBase.prototype.animateScale = function(x, y, options) {
    const current = Tily.utility.vec2(this.inheritedScale),
      scale = Tily.utility.vec2(x, y),
      animation = new Tily.ScaleAnimation(this, current, Tily.utility.vec2(scale), options);
    this.animations.push(animation);
    return new Promise(function(resolve, reject) { animation.finishedCallback = resolve; });
  };

  /**
   * @typedef OffsetAnimationOptions
   * @type {AnimationOptions}
   * @property {boolean} [relative=false] True if the movement should be relative to the current
   * offset.
   */
  /**
   * Animate this active tile's offset.
   * @name animateOffset
   * @function
   * @instance
   * @memberof Tily.ActiveTileBase
   * @param {number} x The x-coordinate of the target offset position.
   * @param {number} y The y-coordinate of the target offset position.
   * @param {OffsetAnimationOptions} [options] An optional options object.
   */
  ActiveTileBase.prototype.animateOffset = function(x, y, options) {
    const current = Tily.utility.vec2(this.inheritedOffset);
    var offset = Tily.utility.vec2(x, y);
    if (options && options.relative === true) {  // Add the current offset if moving relatively
      offset = Tily.utility.vec2.add(current, offset);
    }
    const animation = new Tily.OffsetAnimation(this, current, Tily.utility.vec2(offset), options);
    this.animations.push(animation);
    return new Promise(function(resolve, reject) { animation.finishedCallback = resolve; });
  };

  /**
   * @typedef RotationAnimationOptions
   * @type {AnimationOptions}
   * @property {boolean} [relative=false] True if the rotation should be relative to the current
   * angle.
   * @property {string} [direction=""] The rotation direction. This should be 'cw' for clockwise,
   * 'ccw' for counter-clockwise. If this is not 'cw' or 'ccw', the rotation will be in the
   * direction of the smallest change in angle.
   */
  /**
   * Animate this active tile's rotation.
   * @name animateRotation
   * @function
   * @instance
   * @memberof Tily.ActiveTileBase
   * @param {number} angle The target angle in radians.
   * @param {RotationAnimationOptions} [options] An optional options object.
   */
  ActiveTileBase.prototype.animateRotation = function(angle, options) {
    const current = this.inheritedRotation;
    if (options && options.relative === true) {  // Add the current angle if rotating relatively
      angle += current;
    }
    const animation = new Tily.RotationAnimation(this, current, angle, options);
    this.animations.push(animation);
    return new Promise(function(resolve, reject) { animation.finishedCallback = resolve; });
  };

  /**
   * Add an active tile layer to this active tile at the specified z-index. If the z-index is
   * undefined, add the layer on top of existing layers, and if the z-index is -1, add the layer
   * below existing layers.
   * @name addLayer
   * @function
   * @instance
   * @memberof Tily.ActiveTileBase
   * @param {Tily.ActiveTileLayer} layer The layer to add.
   * @param {number} [z] The z-index at which to add the layer. If this is -1, the layer will be
   * added below existing layers and if it is undefined the layer will be added above existing
   * layers.
   * @returns {Tily.ActiveTileLayer} The layer that was added.
   */
  ActiveTileBase.prototype.addLayer = function(layer, z) {
    if (z === undefined) {
      this.layers.push(layer);
    } else if (z == -1) {
      this.layers.unshift(layer);
    } else {
      this.layers.splice(z, 0, layer);
    }
    return layer;
  };

  /**
   * Remove a layer at the specified z-index. If the z-index is undefined, remove the top layer
   * and if the z-index is -1, remove the bottom layer. The removed layer is returned.
   * @name removeLayer
   * @function
   * @instance
   * @memberof Tily.ActiveTileBase
   * @param {number} [z] The z-index of the layer to remove. If this is -1, the bottom layer will
   * be removed and if it is undefined the top layer will be removed.
   * @returns {Tily.ActiveTileLayer} The layer that was removed.
   */
  ActiveTileBase.prototype.removeLayer = function(z) {
    if (this.layers.length < 1) { return null; }
    if (z === undefined) {
      return this.layers.pop();
    } else if (z == -1) {
      return this.layers.shift();
    }
    return this.layers.splice(z, 1)[0];
  };

  /**
   * Remove all layers from this active tile.
   * @name removeAllLayers
   * @function
   * @instance
   * @memberof Tily.ActiveTileBase
   */
  ActiveTileBase.prototype.removeAllLayers = function() {
    this.layers = [];
  };

  /**
   * Move a layer from one z-index to another z-index, either an absolute value or relative to
   * the layer's current z-index.
   * @name moveLayer
   * @function
   * @instance
   * @memberof Tily.ActiveTileBase
   * @param {number} zFrom The z-index of the layer to move.
   * @param {number} zTo The z-index to move the layer to.
   * @param {boolean} relative If this is true, the layer will be moved relative to it's current
   * z-index.
   * @returns {boolean} True if a layer was moved successfully.
   */
  ActiveTileBase.prototype.moveLayer = function(zFrom, zTo, relative) {
    if (this.layers.length < 2) { return false; }
    if (zFrom < 0 || zFrom >= this.layers.length) { return false; }
    const layer = this.layers.splice(zFrom, 1)[0],
      toIndex = Tily.utility.clamp(relative ? zFrom + zTo : zTo, 0, this.layers.length);
    this.layers.splice(toIndex, 0, layer);
    return true;
  };

  /**
   * Handle this active tile's animations.
   * @name draw
   * @function
   * @instance
   * @memberof Tily.ActiveTileBase
   * @param {number} elapsedTime The time elapsed in seconds since the last draw call.
   */
  ActiveTileBase.prototype.draw = function(elapsedTime) {
    for (let i = 0, length = this.animations.length; i < length; i++) {
      this.animations[i].update(elapsedTime);
    }

    // Remove any animations that have finished
    this.animations = this.animations.filter(i => !i.finished);
  };
  return ActiveTileBase;
}());

Tily.ActiveTile = (function(_super) {
  "use strict";
  Tily.utility.__extends(ActiveTile, _super);

  /**
   * A tile that can be translated, scaled, rotated and animated.
   * @class
   * @extends Tily.ActiveTileBase
   * @memberof Tily
   * @param {number} [x=0] The initial x-coordinate of this active tile.
   * @param {number} [y=0] The initial y-coordinate of this active tile.
   * @param {number} [zIndex=0] The initial z-index of this active tile.
   */
  function ActiveTile(x, y, zIndex) {
    _super.call(this);

    /**
     * The position of this active tile.
     * @type {Tily.utility.vec2}
     */
    this.position = Tily.utility.vec2(x || 0, y || 0);

    /**
     * The layer ordering of this active tile.
     * @type {number}
     */
    this.zIndex = zIndex || 0;

    /**
     * True if this active tile should clip at the tile edges.
     * @default false
     * @type {boolean}
     */
    this.clip = false;

    /**
     * True if this active tile should wrap around tile edges.
     * @default false
     * @type {boolean}
     */
    this.wrap = false;

    /**
     * True if this active tile should be flipped along the x-axis.
     * @default false
     * @type {boolean}
     */
    this.flip = false;

    /**
     * The font to use when rendering this active tile's layers.
     * @default "sans-serif"
     * @type {string}
     */
    this.font = "sans-serif";

    /**
     * The font style to use when rendering this active tile's layers.
     * @default "normal"
     * @type {string}
     */
    this.fontStyle = "normal";

    /**
     * The font size to use when rendering this active tile's layers. If null, fit characters to the tile.
     * @default null
     * @type {?string}
     */
    this.fontSize = null;

    /**
     * The foreground colour, used for rendering text on this active tile's layers.
     * @default "white"
     * @type {string}
     */
    this.foreground = "white";

    /**
     * The outline width and colour for this active tile's layers.
     * @default null
     * @type {?string}
     */
    this.outline = null;

    /**
     * The shadow amount, offset and colour for this active tile's layers.
     * @default null
     * @type {?string}
     */
    this.shadow = null;

    /**
     * The opacity of this active tile.
     * @default 1
     * @type {number}
     */
    this.opacity = 1;

    /**
     * The composite operation to use when drawing this active tile.
     * @default "source-over"
     * @type {string}
     */
    this.compositeMode = "source-over";

    /**
     * An offset from this active tile's position measured in tiles.
     * @default { x: 0, y: 0 }
     * @type {Tily.utility.vec2}
     */
    this.offset = Tily.utility.vec2();

    /**
     * The scale of this active tile.
     * @default { x: 1, y: 1 }
     * @type {Tily.utility.vec2}
     */
    this.scale = Tily.utility.vec2(1, 1);

    /**
     * The rotation angle of this active tile measured in radians.
     * @default 0
     * @type {number}
     */
    this.rotation = 0;

    /**
     * True if the text in this active tile should be centered.
     * @default false
     * @type {boolean}
     */
    this.centered = false;

    /**
     * True if this active tile should be removed in the next frame.
     * @default false
     * @type {boolean}
     */
    this.destroyed = false;
  }
  /**
   * Animate this active tile's position.
   * @name move
   * @function
   * @instance
   * @memberof Tily.ActiveTile
   * @param {string} direction The movement direction, either 'up', 'down', 'left', 'right'.
   * @param {AnimationOptions} [options] An optional options object.
   */
  ActiveTile.prototype.move = function(direction, options) {
    const directions = {
      up: Tily.utility.vec2(0, -1),
      down: Tily.utility.vec2(0, 1),
      left: Tily.utility.vec2(-1, 0),
      right: Tily.utility.vec2(1, 0)
    };
    this.position = Tily.utility.vec2.add(this.position, directions[direction]);
    const animation = new Tily.OffsetAnimation(this, Tily.utility.vec2.mul(directions[direction], -1), Tily.utility.vec2(), options);
    this.animations.push(animation);
    return new Promise(function(resolve, reject) { animation.finishedCallback = resolve; });
  };

  /**
   * Add an active tile layer to this active tile at the specified z-index. If the z-index is
   * undefined, add the layer on top of existing layers, and if the z-index is -1, add the layer
   * below existing layers.
   * @name addLayer
   * @function
   * @instance
   * @memberof Tily.ActiveTile
   * @param {?Tily.ActiveTileLayer} layer The layer to add. If this is null, a new layer will be created.
   * @param {number} [z] The z-index at which to add the layer. If this is -1, the layer will be
   * added below existing layers and if it is undefined the layer will be added above existing
   * layers.
   * @returns {Tily.ActiveTileLayer} The layer that was added.
   */
  ActiveTile.prototype.addLayer = function(layer, z) {
    // If no layer is specified, create a new one
    layer = layer || new Tily.ActiveTileLayer(this);

    // Make sure the layer has a reference to the top-level active tile
    layer.activeTile = this;

    // Make sure the layer has a reference to its parent (ie. this active tile)
    layer.parent = this;
    return _super.prototype.addLayer.call(this, layer, z);
  };

  /**
   * Draw layers onto the specified context.
   * @param {Tily.ActiveTileLayer[]} layers The layers to draw.
   * @param {CanvasRenderingContext2D} context The context to draw this active tile onto.
   * @param {number} elapsedTime The time elapsed in seconds since the last draw call.
   * @param {number} tileSize The tile size measured in pixels.
   */
  function drawLayers(layers, context, elapsedTime, tileSize) {
    for (let i = 0, length = layers.length; i < length; i++) {
      layers[i].draw(context, elapsedTime, tileSize);
    }
  }

  /**
   * Render this active tile onto the container context.
   * @name draw
   * @function
   * @instance
   * @memberof Tily.ActiveTile
   * @param {CanvasRenderingContext2D} context The context to draw this active tile onto.
   * @param {number} elapsedTime The time elapsed in seconds since the last draw call.
   * @param {number} tileSize The tile size measured in pixels.
   */
  ActiveTile.prototype.draw = function(context, elapsedTime, tileSize) {
    if (!this.layers) { return; }  // Active tile has no layers so don't render
    _super.prototype.draw.call(this, elapsedTime);
    context.save();
    const fontSize = this.fontSize || ((tileSize + 1) + 'px');
    context.font = `${this.fontStyle} ${fontSize} ${this.font}`;
    context.fillStyle = this.foreground;
    context.globalAlpha = this.opacity;
    context.globalCompositeOperation = this.compositeMode;

    // Outline
    if (this.outline) {
      const { width: outlineWidth, colour: outlineColour } = Tily.utility.outline(this.outline);
      context.lineWidth = Math.floor(outlineWidth * tileSize);
      context.strokeStyle = outlineColour;
    }

    // Shadow
    if (this.shadow) {
      const {
        blur: shadowBlur,
        xOffset: shadowXOffset,
        yOffset: shadowYOffset,
        colour: shadowColour
      } = Tily.utility.shadow(this.shadow);
      context.shadowBlur = shadowBlur * tileSize;
      context.shadowOffsetX = Math.floor(shadowXOffset * tileSize);
      context.shadowOffsetY = Math.floor(shadowYOffset * tileSize);
      context.shadowColor = shadowColour;
    }

    // Clip tile boundaries if clipping is enabled
    context.translate(this.position.x * tileSize - 0.5, this.position.y * tileSize - 0.5);
    if (this.clip) {
      context.rect(0, 0, tileSize + 1, tileSize + 1);
      context.clip();
    }
    context.translate((this.offset.x + 0.5) * tileSize, (this.offset.y + 0.5) * tileSize);
    context.rotate(this.rotation);
    context.scale(this.scale.x * (this.flip ? -1 : 1), this.scale.y);
    drawLayers(this.layers, context, elapsedTime, tileSize);

    // If both clipping and wrapping are enabled, re-draw the layers at inverted offsets
    if (this.clip && this.wrap) {
      const wrapX = tileSize * (this.offset.x > 0 ? -1 : 1) * (this.flip ? -1 : 1),
        wrapY = tileSize * (this.offset.y > 0 ? -1 : 1);
      if (this.offset.x != 0) {
        context.save();
        context.translate(this.offset.x + wrapX, 0);
        drawLayers(this.layers, context, elapsedTime, tileSize);
        context.restore();
      }
      if (this.offset.y != 0) {
        context.save();
        context.translate(0, this.offset.y + wrapY, 0);
        drawLayers(this.layers, context, elapsedTime, tileSize);
        context.restore();
      }
      if (this.offset.x != 0 && this.offset.y != 0) {
        context.save();
        context.translate(this.offset.x + wrapX, this.offset.y + wrapY);
        drawLayers(this.layers, context, elapsedTime, tileSize);
        context.restore();
      }
    }
    context.restore();
  };

  /**
   * Get serializable data for this active tile.
   * @name getData
   * @function
   * @instance
   * @memberof Tily.ActiveTile
   * @returns {Object} This active tile's data.
   */
  ActiveTile.prototype.getData = function() {
    return {
      layers: this.layers.map(i => i.getData()),
      position: this.position,
      zIndex: this.zIndex,
      clip: this.clip,
      wrap: this.wrap,
      flip: this.flip,
      font: this.font,
      fontStyle: this.fontStyle,
      fontSize: this.fontSize,
      foreground: this.foreground,
      outline: this.outline,
      shadow: this.shadow,
      opacity: this.opacity,
      compositeMode: this.compositeMode,
      offset: this.offset,
      scale: this.scale,
      rotation: this.rotation,
      centered: this.centered
    };
  };

  /**
   * Create an active tile from data.
   * @name fromData
   * @function
   * @static
   * @memberof Tily.ActiveTile
   * @param {Object} data Serialized active tile data.
   * @returns {Tily.ActiveTile} An active tile created from the provided data.
   */
  ActiveTile.fromData = function(data) {
    const tile = new Tily.ActiveTile(data.position.x, data.position.y, data.zIndex);
    tile.layers = data.layers.map(i => Tily.ActiveTileLayer.fromData(tile, tile, i));
    tile.clip = data.clip;
    tile.wrap = data.wrap;
    tile.flip = data.flip;
    tile.font = data.font;
    tile.fontStyle = data.fontStyle;
    tile.fontSize = data.fontSize;
    tile.foreground = data.foreground;
    tile.outline = data.outline;
    tile.shadow = data.shadow;
    tile.opacity = data.opacity;
    tile.compositeMode = data.compositeMode;
    tile.offset = data.offset;
    tile.scale = data.scale;
    tile.rotation = data.rotation;
    tile.centered = data.centered;
    return tile;
  };
  return ActiveTile;
}(Tily.ActiveTileBase));

Tily.ActiveTileLayer = (function(_super) {
  "use strict";
  Tily.utility.__extends(ActiveTileLayer, _super);

  /**
   * A layer displayed as part of an active tile.
   * @class
   * @extends Tily.ActiveTileBase
   * @memberof Tily
   * @param {Tily.ActiveTile} activeTile The top-level active tile that this layer belongs to.
   * @param {Tily.ActiveTile|Tily.ActiveTileLayer} parent The object that this layer belongs to.
   */
  function ActiveTileLayer(activeTile, parent) {
    _super.call(this);

    /**
     * The top-level active tile that this layer belongs to.
     * @type {Tily.ActiveTile}
     */
    this.activeTile = activeTile;

    /**
     * The object that this layer belongs to.
     * @type {Tily.ActiveTile|Tily.ActiveTileLayer}
     */
    this.parent = parent;

    /**
     * The string value to render for this active tile layer.
     * @default ""
     * @type {string}
     */
    this.text = "";
  }

  /**
   * @callback animateTextFunction
   * @param {string} t The starting text.
   * @param {number} i The interpolation value, between 0 (start) and 1 (finish).
   * @returns {string} The text to use in the active tile.
   */
  /**
   * Animate this active tile's text.
   * @name animateText
   * @function
   * @instance
   * @memberof Tily.ActiveTileLayer
   * @param {string|string[]|animateTextFunction} text If this is a string, the active tile's
   * text will animate through each character one-by-one. If this is an array of strings, the
   * active tile's text will animate through each string one-by-one. If this is a function, the
   * initial text value and the interpolation value will be passed to it and the active tile's
   * text will be set to the returned string.
   * @param {AnimationOptions} [options] An optional options object.
   */
  ActiveTileLayer.prototype.animateText = function(text, options) {
    const animation = new Tily.TextAnimation(this, this.text, text, options);
    this.animations.push(animation);
    return new Promise(function(resolve, reject) { animation.finishedCallback = resolve; });
  };

  /**
   * Add an active tile layer to this active tile at the specified z-index. If the z-index is
   * undefined, add the layer on top of existing layers, and if the z-index is -1, add the layer
   * below existing layers.
   * @name addLayer
   * @function
   * @instance
   * @memberof Tily.ActiveTileLayer
   * @param {Tily.ActiveTileLayer} layer The layer to add.
   * @param {number} [z] The z-index at which to add the layer. If this is -1, the layer will be
   * added below existing layers and if it is undefined the layer will be added above existing
   * layers.
   * @returns {Tily.ActiveTileLayer} The layer that was added.
   */
  ActiveTileLayer.prototype.addLayer = function(layer, z) {
    // If no layer is specified, create a new one
    layer = layer || new Tily.ActiveTileLayer(this.activeTile);

    // Make sure the layer has a reference to the top-level active tile
    layer.activeTile = this.activeTile;

    // Make sure the layer has a reference to its parent (ie. this active tile layer)
    layer.parent = this;
    return _super.prototype.addLayer.call(this, layer, z);
  };

  /**
   * Render this active tile layer onto the buffer context.
   * @name draw
   * @function
   * @instance
   * @memberof Tily.ActiveTileLayer
   * @param {CanvasRenderingContext2D} context The context to draw this active tile layer onto.
   * @param {number} elapsedTime The time elapsed in seconds since the last draw call.
   * @param {number} tileSize The tile size measured in pixels.
   */
  ActiveTileLayer.prototype.draw = function(context, elapsedTime, tileSize) {
    if (!this.parent) { return; }  // Layer doesn't belong to an active tile or another layer
    _super.prototype.draw.call(this, elapsedTime);
    context.save();
    if (this.font !== null || this.fontStyle !== null || this.fontSize !== null) {
      const font = this.font || this.inheritedFont;
      const style = this.fontStyle || this.inheritedFontStyle;
      const size = this.fontSize || this.inheritedFontSize || ((tileSize + 1) + 'px');
      context.font = `${style} ${size} ${font}`;
    }
    if (this.foreground !== null) {
      context.fillStyle = this.foreground;
    }
    if (this.opacity !== null) {
      context.globalAlpha = this.opacity;
    }
    if (this.compositeMode !== null) {
      context.globalCompositeOperation = this.compositeMode;
    }
    if (this.outline !== null) {
      const { width: outlineWidth, colour: outlineColour } = Tily.utility.outline(this.outline);
      context.lineWidth = Math.floor(outlineWidth * tileSize);
      context.strokeStyle = outlineColour;
    }
    if (this.shadow !== null) {
      const {
        blur: shadowBlur,
        xOffset: shadowXOffset,
        yOffset: shadowYOffset,
        colour: shadowColour
      } = Tily.utility.shadow(this.shadow);
      context.shadowBlur = shadowBlur * tileSize;
      context.shadowOffsetX = Math.floor(shadowXOffset * tileSize);
      context.shadowOffsetY = Math.floor(shadowYOffset * tileSize);
      context.shadowColor = shadowColour;
    }
    if (this.offset !== null) {
      context.translate(this.offset.x * tileSize, this.offset.y * tileSize);
    }
    if (this.rotation !== null) {
      context.rotate(this.rotation);
    }
    if (this.scale !== null) {
      context.scale(this.scale.x, this.scale.y);
    }
    let p;
    if (this.centered === true) {
      p = Tily.utility.vec2(0, 0);
      context.textAlign = "center";
      context.textBaseline = "middle";
    } else {
      p = Tily.utility.vec2(-tileSize * 0.5, -tileSize * 0.5);
      context.textAlign = "left";
      context.textBaseline = "top";
    }
    if (this.inheritedOutline !== null) {
      context.miterLimit = 2;
      context.strokeText(this.text, p.x, p.y);
    }
    context.fillText(this.text, p.x, p.y);

    // Render sub-layers contained in this layer
    for (let i = 0, length = this.layers.length; i < length; i++) {
      this.layers[i].draw(context, elapsedTime, tileSize);
    }
    context.restore();
  };

  /**
   * Get serializable data for this active tile layer.
   * @name getData
   * @function
   * @instance
   * @memberof Tily.ActiveTileLayer
   * @returns {Object} This active tile layer's data.
   */
  ActiveTileLayer.prototype.getData = function() {
    return {
      layers: this.layers.map(i => i.getData()),
      text: this.text,
      font: this.font,
      fontStyle: this.fontStyle,
      fontSize: this.fontSize,
      foreground: this.foreground,
      outline: this.outline,
      shadow: this.shadow,
      opacity: this.opacity,
      compositeMode: this.compositeMode,
      offset: this.offset,
      scale: this.scale,
      rotation: this.rotation,
      centered: this.centered
    };
  };

  /**
   * Create an active tile layer from data.
   * @name fromData
   * @function
   * @static
   * @memberof Tily.ActiveTileLayer
   * @param {Tily.ActiveTile} activeTile The top-level active tile that the layer belongs to.
   * @param {Tily.ActiveTile|Tily.ActiveTileLayer} parent The object that the layer belongs to.
   * @param {Object} data Serialized active tile layer data.
   * @returns {Tily.ActiveTileLayer} An active tile layer created from the provided data.
   */
  ActiveTileLayer.fromData = function(activeTile, parent, data) {
    const layer = new Tily.ActiveTileLayer(activeTile, parent);
    layer.layers = data.layers.map(i => Tily.ActiveTileLayer.fromData(activeTile, layer, i));
    layer.text = data.text;
    layer.font = data.font;
    layer.fontStyle = data.fontStyle;
    layer.fontSize = data.fontSize;
    layer.foreground = data.foreground;
    layer.outline = data.outline;
    layer.shadow = data.shadow;
    layer.opacity = data.opacity;
    layer.compositeMode = data.compositeMode;
    layer.offset = data.offset;
    layer.scale = data.scale;
    layer.rotation = data.rotation;
    layer.centered = data.centered;
    return layer;
  };
  return ActiveTileLayer;
}(Tily.ActiveTileBase));

Tily.Animation = (function(_super) {
  "use strict";
  Tily.utility.__extends(Animation, _super);

  /**
   * @typedef AnimationOptions
   * @type {TransitionOptions}
   * @property {boolean} [repeat=false] Whether or not this animation should repeat until stopped
   * or only play once.
   * @property {boolean} [reverse=false] Whether or not the animation should play in reverse, ie.
   * from finish to start.
   * @property {boolean} [alternate=false] Whether or not the animation's direction should
   * alternate between forward/reverse on each repeat. This is only valid if repeat is set to
   * true.
   */
  /**
   * Default animation options, used as a fall-back for options passed to animation methods.
   * @type {AnimationOptions}
   */
  const _defaultAnimationOptions = {
    repeat: false,
    reverse: false,
    alternate: false,
    repeatCallback: null
  };

  /**
   * Base class for active tile animations.
   * @class
   * @extends Tily.Transition
   * @memberof Tily
   * @param {Tily.ActiveTile|Tily.ActiveTileLayer} activeTile The active tile or active tile
   * layer that this animation belongs to.
   * @param {any} start The starting value.
   * @param {any} finish The finishing value.
   * @param {AnimationOptions} [options] An optional options object for configuring the
   * animation.
   */
  function Animation(activeTile, start, finish, options) {
    options = {
      ..._defaultAnimationOptions,
      ...options || {}
    };
    _super.call(this, start, finish, options);

    /**
     * The active tile or active tile layer that this animation belongs to.
     * @type {Tily.ActiveTile|Tily.ActiveTileLayer}
     */
    this.activeTile = activeTile;

    /**
     * Whether or not this animation should repeat until stopped or only play once.
     * @type {boolean}
     */
    this.repeat = !!options.repeat;

    /**
     * Whether or not this animation should play in reverse.
     * @type {boolean}
     */
    this.reverse = !!options.reverse;

    /**
     * Whether or not this animation's direction should alternate on each repeat.
     * @type {boolean}
     */
    this.alternate = !!options.alternate;

    /**
     * A function to call on each repetition of the animation.
     * @type {Function}
     */
    this.repeatCallback = options.repeatCallback;

    /**
     * True if this animation is currently running, false if the animation is currently paused.
     * @default true
     * @type {boolean}
     */
    this.running = true;
  }

  /**
   * Pause this animation.
   * @name pause
   * @function
   * @instance
   * @memberof Tily.Animation
   */
  Animation.prototype.pause = function() {
    this.running = false;
  };

  /**
   * Un-pause this animation.
   * @name run
   * @function
   * @instance
   * @memberof Tily.Animation
   */
  Animation.prototype.run = function() {
    this.running = true;
  };

  /**
   * Reset this animation.
   * @name reset
   * @function
   * @instance
   * @memberof Tily.Animation
   */
  Animation.prototype.reset = function() {
    this.currentTime = 0;
  };

  /**
   * Update the animation.
   * @name update
   * @function
   * @instance
   * @memberof Tily.Animation
   * @param {number} elapsedTime The number of seconds that have elapsed since the last update.
   * @returns {number} The animation interpolation value between 0 and 1.
   */
  Animation.prototype.update = function(elapsedTime) {
    if (this.running) {
      this.currentTime += elapsedTime;
    }

    // If animation is currently in progress, ease from start to finish or from finish to start
    // if direction is reversed
    if (this.currentTime < this.totalTime) {
      return this.reverse ? 1 - this.amount : this.amount;
    }

    // Otherwise, if this is a repeating animation then reset the current animation time
    if (this.repeatCallback) {
      this.repeatCallback();
    }
    if (this.repeat) {
      if (this.alternate) {
        this.reverse = !this.reverse;
      }
      this.currentTime = 0;
      return this.reverse ? 1 : 0;
    }

    // This is not a repeating animation, so finish the animation
    if (this.finishedCallback && !this.finished) {
      this.finishedCallback(this.start, this.finish);
    }
    this.finished = true;
    return 1;
  };
  return Animation;
}(Tily.Transition));

Tily.OffsetAnimation = (function(_super) {
  "use strict";
  Tily.utility.__extends(OffsetAnimation, _super);

  /**
   * Represents an offset animation for moving active tiles.
   * @class
   * @extends Tily.Animation
   * @memberof Tily
   * @param {Tily.ActiveTile|Tily.ActiveTileLayer} activeTile The active tile or active tile
   * layer that this animation belongs to.
   * @param {Tily.utility.vec2} start The starting offset.
   * @param {Tily.utility.vec2} finish The finishing offset.
   * @param {AnimationOptions} [options] An optional options object for configuring the
   * animation.
   */
  function OffsetAnimation(activeTile, start, finish, options) {
    if (!options.easeFunction) {
      options.easeFunction = (a, b, i) => Tily.utility.vec2(
        Tily.utility.lerp(a.x, b.x, i),
        Tily.utility.lerp(a.y, b.y, i)
      );
    }
    _super.call(this, activeTile, start, finish, options);
  }

  /**
   * Update the animation and set the active tile offset.
   * @name update
   * @function
   * @instance
   * @memberof Tily.OffsetAnimation
   * @param {number} elapsedTime The number of seconds that have elapsed since the last update.
   */
  OffsetAnimation.prototype.update = function(elapsedTime) {
    const amount = _super.prototype.update.call(this, elapsedTime);
    this.activeTile.offset = this.easeFunction(this.start, this.finish, amount);
  };
  return OffsetAnimation;
}(Tily.Animation));

Tily.ScaleAnimation = (function(_super) {
  "use strict";
  Tily.utility.__extends(ScaleAnimation, _super);

  /**
   * Represents a scale animation for scaling active tiles.
   * @class
   * @extends Tily.Animation
   * @memberof Tily
   * @param {Tily.ActiveTile|Tily.ActiveTileLayer} activeTile The active tile or active tile
   * layer that this animation belongs to.
   * @param {Tily.utility.vec2} start The starting scale.
   * @param {Tily.utility.vec2} finish The finishing scale.
   * @param {AnimationOptions} [options] An optional options object for configuring the
   * animation.
   */
  function ScaleAnimation(activeTile, start, finish, options) {
    if (!options.easeFunction) {
      options.easeFunction = (a, b, i) => Tily.utility.vec2(
        Tily.utility.lerp(a.x, b.x, i),
        Tily.utility.lerp(a.y, b.y, i)
      );
    }
    _super.call(this, activeTile, start, finish, options);
  }

  /**
   * Update the animation and set the active tile scale.
   * @name update
   * @function
   * @instance
   * @memberof Tily.ScaleAnimation
   * @param {number} elapsedTime The number of seconds that have elapsed since the last update.
   */
  ScaleAnimation.prototype.update = function(elapsedTime) {
    const amount = _super.prototype.update.call(this, elapsedTime);
    this.activeTile.scale = this.easeFunction(this.start, this.finish, amount);
  };
  return ScaleAnimation;
}(Tily.Animation));

Tily.ForegroundAnimation = (function(_super) {
  "use strict";
  Tily.utility.__extends(ForegroundAnimation, _super);

  /**
   * Represents a foreground colour animation for changing the colour of active tiles.
   * @class
   * @extends Tily.Animation
   * @memberof Tily
   * @param {Tily.ActiveTile|Tily.ActiveTileLayer} activeTile The active tile or active tile
   * layer that this animation belongs to.
   * @param {} start The starting foreground colour.
   * @param {} finish The finishing foreground colour.
   * @param {AnimationOptions} [options] An optional options object for configuring the
   * animation.
   */
  function ForegroundAnimation(activeTile, start, finish, options) {
    if (!options.easeFunction) {
      options.easeFunction = (a, b, i) => ({
        r: Tily.utility.lerp(a.r, b.r, i),
        g: Tily.utility.lerp(a.g, b.g, i),
        b: Tily.utility.lerp(a.b, b.b, i),
        a: Tily.utility.lerp(a.a, b.a, i)
      });
    }
    _super.call(this, activeTile, start, finish, options);
  }

  /**
   * Update the animation and the set the active tile foreground colour.
   * @name update
   * @function
   * @instance
   * @memberof Tily.ForegroundAnimation
   * @param {number} elapsedTime The number of seconds that have elapsed since the last update.
   */
  ForegroundAnimation.prototype.update = function(elapsedTime) {
    const amount = _super.prototype.update.call(this, elapsedTime);
    this.activeTile.foreground = Tily.utility.colour(this.easeFunction(this.start, this.finish, amount));
  };
  return ForegroundAnimation;
}(Tily.Animation));

Tily.OpacityAnimation = (function(_super) {
  "use strict";
  Tily.utility.__extends(OpacityAnimation, _super);

  /**
   * Represents an opacity animation for fading active tiles.
   * @class
   * @extends Tily.Animation
   * @memberof Tily
   * @param {Tily.ActiveTile|Tily.ActiveTileLayer} activeTile The active tile or active tile
   * layer that this animation belongs to.
   * @param {number} start The starting opacity.
   * @param {number} finish The finishing opacity.
   * @param {AnimationOptions} [options] An optional options object for configuring the
   * animation.
   */
  function OpacityAnimation(activeTile, start, finish, options) {
    _super.call(this, activeTile, start, finish, options);
  }

  /**
   * Update the animation and set the active tile opacity.
   * @name update
   * @function
   * @instance
   * @memberof Tily.OpacityAnimation
   * @param {number} elapsedTime The number of seconds that have elapsed since the last update.
   */
  OpacityAnimation.prototype.update = function(elapsedTime) {
    const amount = _super.prototype.update.call(this, elapsedTime);
    this.activeTile.opacity = this.easeFunction(this.start, this.finish, amount);
  };
  return OpacityAnimation;
}(Tily.Animation));

Tily.RotationAnimation = (function(_super) {
  "use strict";
  Tily.utility.__extends(RotationAnimation, _super);

  /**
   * Represents a rotation animation for rotating active tiles.
   * @class
   * @extends Tily.Animation
   * @memberof Tily
   * @param {Tily.ActiveTile|Tily.ActiveTileLayer} activeTile The active tile or active tile
   * layer that this animation belongs to.
   * @param {} start The starting angle in radians.
   * @param {} finish The finishing angle in radians.
   * @param {RotationAnimationOptions} [options] An optional options object for configuring the
   * animation.
   */
  function RotationAnimation(activeTile, start, finish, options) {
    /**
     * The rotation direction. This should be 'cw' for clockwise, 'ccw' for counter-clockwise.
     * If this is not 'cw' or 'ccw', the rotation will be in the direction of the smallest
     * change in angle.
     * @type {string}
     */
    this.direction = options.direction;

    // Set up the actual start and finish values based on the direction, or if no valid
    // direction is specified then calculate one from the start and finish angles
    if (this.direction == "cw") {
      while (start >= finish) { finish += Math.PI * 2; }  // Make sure start < finish
    } else if (this.direction == "ccw") {
      while (start <= finish) { start += Math.PI * 2; }  // Make sure start > finish
    } else {
      const mod = (a, b) => a - Math.floor(a / b) * b,
        tau = Math.PI * 2;
      var a = finish - start;
      a = mod(a + Math.PI, tau) - Math.PI;  // Get the signed difference between angles
      start = mod(start, tau);
      finish = start + a;
    }
    _super.call(this, activeTile, start, finish, options);
  }

  /**
   * Update the animation.
   * @name update
   * @function
   * @instance
   * @memberof Tily.RotationAnimation
   * @param {number} elapsedTime The number of seconds that have elapsed since the last update.
   * @returns {number}
   */
  RotationAnimation.prototype.update = function(elapsedTime) {
    const amount = _super.prototype.update.call(this, elapsedTime);
    this.activeTile.rotation = this.easeFunction(this.start, this.finish, amount);
  };
  return RotationAnimation;
}(Tily.Animation));

Tily.TextAnimation = (function(_super) {
  "use strict";
  Tily.utility.__extends(TextAnimation, _super);

  /**
   * Represents a text animation for changing an active tile's text over a given time interval.
   * @class
   * @extends Tily.Animation
   * @memberof Tily
   * @param {Tily.ActiveTile|Tily.ActiveTileLayer} activeTile The active tile or active tile
   * layer that this animation belongs to.
   * @param {string} start The starting text.
   * @param {string|string[]|animateTextFunction} finish Either a string with characters
   * for each animation frame, an array of strings for each animation frame or a function that
   * returns a string for each animation frame.
   * @param {AnimationOptions} [options] An optional options object for configuring the
   * animation.
   */
  function TextAnimation(activeTile, start, finish, options) {
    _super.call(this, activeTile, start, finish, options);

    /**
     * The type of the finishing value. Will be either "string", "array" or "function".
     * @type {string}
     */
    this.finishType = typeof finish;
  }

  /**
   * Update the animation.
   * @name update
   * @function
   * @instance
   * @memberof Tily.TextAnimation
   * @param {number} elapsedTime The number of seconds that have elapsed since the last update.
   * @returns {number}
   */
  TextAnimation.prototype.update = function(elapsedTime) {
    const amount = _super.prototype.update.call(this, elapsedTime);
    var text = this.start;
    if (this.finishType == "function") {
      text = this.finish(this.start, amount);
    } else {
      text = this.finish[Math.max(0, Math.ceil(amount * this.finish.length) - 1)];
    }
    this.activeTile.text = text;
  };
  return TextAnimation;
}(Tily.Animation));

Tily.OutlineAnimation = (function(_super) {
  "use strict";
  Tily.utility.__extends(OutlineAnimation, _super);

  /**
   * Represents an outline animation for animating active tile outlines.
   * @class
   * @extends Tily.Animation
   * @memberof Tily
   * @param {Tily.ActiveTile|Tily.ActiveTileLayer} activeTile The active tile or active tile
   * layer that this animation belongs to.
   * @param {Tily.utility.vec2} start The starting outline.
   * @param {Tily.utility.vec2} finish The finishing outline.
   * @param {AnimationOptions} [options] An optional options object for configuring the
   * animation.
   */
  function OutlineAnimation(activeTile, start, finish, options) {
    if (!options.easeFunction) {
      options.easeFunction = (a, b, i) => {
        const ao = Tily.utility.outline(a);
        const bo = Tily.utility.outline(b);
        ao.colour = Tily.utility.parseColor(ao.colour);
        bo.colour = Tily.utility.parseColor(bo.colour);
        const result = {
          width: Tily.utility.lerp(ao.width, bo.width, i),
          colour: Tily.utility.colour({
            r: Tily.utility.lerp(ao.colour.r, bo.colour.r, i),
            g: Tily.utility.lerp(ao.colour.g, bo.colour.g, i),
            b: Tily.utility.lerp(ao.colour.b, bo.colour.b, i),
            a: Tily.utility.lerp(ao.colour.a, bo.colour.a, i)
          })
        };
        return `${result.width} ${result.colour}`;
      };
    }
    _super.call(this, activeTile, start, finish, options);
  }

  /**
   * Update the animation and set the active tile outline.
   * @name update
   * @function
   * @instance
   * @memberof Tily.OutlineAnimation
   * @param {number} elapsedTime The number of seconds that have elapsed since the last update.
   */
  OutlineAnimation.prototype.update = function(elapsedTime) {
    const amount = _super.prototype.update.call(this, elapsedTime);
    this.activeTile.outline = this.easeFunction(this.start, this.finish, amount);
  };
  return OutlineAnimation;
}(Tily.Animation));

Tily.ShadowAnimation = (function(_super) {
  "use strict";
  Tily.utility.__extends(ShadowAnimation, _super);

  /**
   * Represents a shadow animation for animating active tile shadows.
   * @class
   * @extends Tily.Animation
   * @memberof Tily
   * @param {Tily.ActiveTile|Tily.ActiveTileLayer} activeTile The active tile or active tile
   * layer that this animation belongs to.
   * @param {Tily.utility.vec2} start The starting shadow.
   * @param {Tily.utility.vec2} finish The finishing shadow.
   * @param {AnimationOptions} [options] An optional options object for configuring the
   * animation.
   */
  function ShadowAnimation(activeTile, start, finish, options) {
    if (!options.easeFunction) {
      options.easeFunction = (a, b, i) => {
        const as = Tily.utility.shadow(a);
        const bs = Tily.utility.shadow(b);
        as.colour = Tily.utility.parseColor(as.colour);
        bs.colour = Tily.utility.parseColor(bs.colour);
        const result = {
          blur: Tily.utility.lerp(as.blur, bs.blur, i),
          xOffset: Tily.utility.lerp(as.xOffset, bs.xOffset, i),
          yOffset: Tily.utility.lerp(as.yOffset, bs.yOffset, i),
          colour: Tily.utility.colour({
            r: Tily.utility.lerp(as.colour.r, bs.colour.r, i),
            g: Tily.utility.lerp(as.colour.g, bs.colour.g, i),
            b: Tily.utility.lerp(as.colour.b, bs.colour.b, i),
            a: Tily.utility.lerp(as.colour.a, bs.colour.a, i)
          })
        };
        return `${result.blur} ${result.xOffset} ${result.yOffset} ${result.colour}`;
      };
    }
    _super.call(this, activeTile, start, finish, options);
  }

  /**
   * Update the animation and set the active tile shadow.
   * @name update
   * @function
   * @instance
   * @memberof Tily.ShadowAnimation
   * @param {number} elapsedTime The number of seconds that have elapsed since the last update.
   */
  ShadowAnimation.prototype.update = function(elapsedTime) {
    const amount = _super.prototype.update.call(this, elapsedTime);
    this.activeTile.shadow = this.easeFunction(this.start, this.finish, amount);
  };
  return ShadowAnimation;
}(Tily.Animation));

if (typeof module !== "undefined") {
  module.exports = Tily;
}
if (typeof window !== "undefined") {
  window.Tily = Tily;
}
})();