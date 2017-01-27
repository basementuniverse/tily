/**
 * @name shuffle
 * @function
 * @instance
 * @description In-place array shuffle (using Fisher-Yates shuffle).
 * @example
 * existingArray.shuffle();
 */
Object.defineProperty(Array.prototype, "shuffle", {
	enumerable: false,
	configurable: true,
	writable: true,
	value: function() {
		var i = this.length, r = 0, swap = null;
		if (!i) { return; }
		while (--i) {
			r = Math.floor(Math.random() * (i + 1));
			swap = this[r];
			this[r] = this[i];
			this[i] = swap;
		}
	}
});

/**
 * @name extend
 * @function
 * @instance
 * @description In-place object extend, merges properties of all objects in the arguments list into
 * the target object. If the first argument is a boolean set to true, then do a deep extend
 * (recursively extends all sub-objects and their properties).
 * @param {Boolean} [deep] - If set to true, do a deep extend.
 * @param {...Object} arguments - The objects from which to merge properties (properties are merged
 * from left to right).
 * @returns {Object} The merged object.
 * @example
 * // Demonstrates in-place usage
 * var existingObject = { a: 1, b: 1, c: { d: 1 } };
 * existingObject.extend(true, { a: 2, b: 2 }, { a: 3, c: { e: 1 } });
 * // existingObject is now { a: 3, b: 2, c: { d: 1, e: 1 } }
 * @example
 * // Demonstrates using the return value to create a new object
 * var newObject = {}.extend({ a: 1, b: 1, c: 1 }, { a: 2, b: 2 }, { a: 3, c: 2 });
 * // newObject is { a: 3, b: 2, c: 2 }
 */
Object.defineProperty(Object.prototype, "extend", {
	enumerable: false,
	configurable: true,
	writable: true,
	value: function() {
		"use strict";
		var i = 0,
			length = arguments.length,
			deep = false,
			merge = function(target, source) {	// Merge source object into target object
				for (var p in source) {
					if (source.hasOwnProperty(p)) {
						if (	// If this is a deep extend, recursively extend properties
							deep &&
							Object.prototype.toString.call(source[p]) === "[object Object]"
						) {
							if (!target[p]) {
								target[p] = {};
							}
							target[p].extend(true, source[p]);
						} else {	// Otherwise just copy property values
							target[p] = source[p];
						}
					}
				}
			};
		
		// Check if the first argument is a boolean (set to true for a deep extend, false for
		// a shallow extend)
		if (typeof arguments[0] == "boolean") {
			deep = arguments[0];
			i++;
		}
		
		// Merge each object in the arguments list
		for (; i < length; i++) {
			var o = arguments[i];
			merge(this, o);
		}
		return this;
	}
});

/**
 * @name keys
 * @function
 * @instance
 * @description Get an object's keys as an array (this function might already exist in ES5
 * browsers).
 * @returns {Array} An array of keys contained in the object.
 * @example
 * var keys = Object.keys(existingObject);
 */
if (!Object.keys) {
	Object.defineProperty(Object.prototype, "keys", {
		enumerable: false,
		configurable: true,
		writable: true,
		value: function(object) {
			var keys = [];
			for (var i in object) {
				if (object.hasOwnProperty(i)) {
					keys.push(i);
				}
			}
			return keys;
		}
	});
}

/**
 * @callback findIndexCallback
 * @param value The value of the current element.
 * @param {Number} index The index of the current element.
 * @param {Array} array The array being searched.
 * @returns {Boolean} True if the current element is the one being searched for.
 */
/**
 * @name findIndex
 * @function
 * @instance
 * @description Find an element in an array using a callback (this function might already exist
 * in ES6 browsers).
 * @returns {Number} The matching element's index or -1 if no matching element was found.
 * @param {findIndexCallback} f A callback that will be called for each item in the array.
 * @example
 * var foundIndex = existingArray.findIndex(function(value, index, array) { \/* ... *\/ });
 */
if (!Array.prototype.findIndex) {
	Object.defineProperty(Array.prototype, "findIndex", {
		enumerable: false,
		configurable: true,
		writable: true,
		value: function(f) {
			var value = null;
			for (var i = 0, length = this.length; i < length; i++) {
				value = this[i];
				if (f(value, i, this)) {
					return i;
				}
			}
			return -1;
		}
	});
}

/**
 * @name trim
 * @function
 * @instance
 * @description Trims whitespace from beginning/end of a string and returns the result.
 * @returns {String} The trimmed string.
 * @example
 * var trimmedString = existingString.trim();
 */
if (!String.prototype.trim) {
	Object.defineProperty(String.prototype, "trim", {
		enumerable: false,
		configurable: true,
		writable: true,
		value: function() {
			return this.replace(/^\s+|\s+$/g, "");
		}
	});
}

/**
 * @name clamp
 * @function
 * @static
 * @description Clamps a value between min and max (or 0 and 1 respectively, if either argument is
 * undefined).
 * @param {Number} a The number to clamp.
 * @param {Number} [min=0] The minimum value.
 * @param {Number} [max=1] The maximum value.
 * @returns {Number} The clamped value.
 */
Math.clamp = function(a, min, max) {
	if (min === undefined) { min = 0; };
	if (max === undefined) { max = 1; };
	return (a < min ? min : (a > max ? max : a));
};

/**
 * @name lerp
 * @function
 * @static
 * @description Does a linear interpolation from a to b.
 * @param {Number} a The starting value.
 * @param {Number} b The finishing value.
 * @param {Number} i The interpolation value.
 * @returns {Number} An interpolated value between a and b.
 */
Math.lerp = function(a, b, i) {
	return a * (1 - i) + b * i;
};

/**
 * @name quadraticInterpolate
 * @function
 * @static
 * @description Does a 1-dimensional quadratic interpolation from a (at i = 0) to c (at i = 1),
 * with b as the control offset.
 * @param {Number} a The starting value.
 * @param {Number} b The control offset.
 * @param {Number} c The finishing value.
 * @param {Number} i The interpolation value.
 * @returns {Number} An interpolated value between a and c.
 */
Math.quadraticInterpolate = function(a, b, c, i) {
	var b0 = (1 - i) * (1 - i),
		b1 = 2 * i * (1 - i),
		b2 = i * i;
	return b0 * a + b1 * b + b2 * c;
};

/**
 * @name cubicInterpolate
 * @function
 * @static
 * @description Does a 1-dimensional cubic interpolation from a (at i = 0) to d (at i = 1), with b
 * and c as the control offsets.
 * @param {Number} a The starting value.
 * @param {Number} b The first control offset.
 * @param {Number} c The second control offset.
 * @param {Number} d The finishing value.
 * @param {Number} i The interpolation value.
 * @returns {Number} An interpolated value between a and d.
 */
Math.cubicInterpolate = function(a, b, c, d, i) {
	var b0 = (1 - i) * (1 - i) * (1 - i),
		b1 = 3 * i * ((1 - i) * (1 - i)),
		b2 = 3 * (i * i) * (1 - i),
		b3 = (i * i * i);
	return b0 * a + b1 * b + b2 * c + b3 * d;
};

/**
 * @name radians
 * @function
 * @static
 * @description Converts degrees to radians.
 * @param {Number} degrees The value to convert to radians.
 * @returns {Number} A value in radians.
 */
Math.radians = function(degrees) {
	return (Math.PI / 180) * degrees;
};

/**
 * @name degrees
 * @function
 * @static
 * @description Converts radians to degrees.
 * @param {Number} radians The value to convert to degrees.
 * @returns {Number} A value in degrees.
 */
Math.degrees = function(radians) {
	return (180 / Math.PI) * radians;
};

/**
 * @name randomBetween
 * @function
 * @static
 * @description Returns a random float between min (inclusive) and max (exclusive).
 * @param {Number} min The minimum value (inclusive).
 * @param {Number} max The maximum value (exclusive).
 * @returns {Number} A random float.
 */
Math.randomBetween = function(min, max) {
	return Math.random() * (max - min) + min;
};

/**
 * @name randomIntBetween
 * @function
 * @static
 * @description Return a random integer between min (inclusive) and max (inclusive).
 * @param {Number} min The minimum value (inclusive).
 * @param {Number} max The maximum value (inclusive).
 * @returns {Number} A random integer.
 */
Math.randomIntBetween = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * @name cltRandom
 * @function
 * @static
 * @description Return a normally-distributed value (uses central limit theorem).
 * @param {Number} mu The mean value.
 * @param {Number} sigma The standard deviation.
 * @param {Number} samples The number of samples (ie. how shallow/steep the curve is, 1 is uniform).
 * @returns {Number} A random float.
 */
Math.cltRandom = function(mu, sigma, samples) {
	"use strict";
	mu = mu || 0.5;
	sigma = sigma || 0.5;
	samples = samples || 2;
	var total = 0;
	for (var i = samples; i--;) {
		total += Math.random();
	}
	return mu + (total - samples / 2) / (samples / 2) * sigma;
};

/**
 * @name cltRandomInt
 * @function
 * @static
 * @description Return a normally-distributed integer between min (inclusive) and max (inclusive).
 * @param {Number} min The minimum value.
 * @param {Number} max The maximum value.
 * @returns {Number} A random integer.
 */
Math.cltRandomInt = function(min, max) {
	return min + Math.cltRandom(0.5, 0.5, 2) * (max - min);
};
