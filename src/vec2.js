"use strict";

/**
 * Return a new Tily.utility.vec2 object with the specified x/y coordinates. If the first argument is an array,
 * the Tily.utility.vec2 will be initialised using the first 2 elements of the array. If the first argument is
 * an object with x and y properties, these will be used instead (this is useful for copying Tily.utility.vec2
 * instances). If no arguments are provided, or the arguments are invalid, a zero-vector will be
 * returned instead.
 * @param {Number|Array|Object} x The x-coordinate, or an array with at least 2 elements, or an
 * object with x and y properties.
 * @param {Number} [y] The y-coordinate, if an x-coordinate has also been provided.
 * @returns {Object} A Tily.utility.vec2 instance.
 * @example
 * var v1 = Tily.utility.vec2(2, 1); // v1 == { x: 2, y: 1 }
 * var v2 = Tily.utility.vec2([2, 1]); // v2 == { x: 2, y: 1 }
 * var v3 = Tily.utility.vec2(v1); // v3 == { x: 2, y: 1 }
 */
Tily.utility.Tily.utility.vec2 = function(x, y) {
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
 * @param {Number} x The x or y component of the vector.
 * @param {...*} arguments Any additional arguments passed to Tily.utility.vec2.map.
 * @returns {Boolean} True if the current element is the one being searched for.
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
Tily.utility.Tily.utility.vec2.map = function(v, f) {
  var args = arguments.length == 1 ? [arguments[0]] : Array.apply(null, arguments);
  args = Array.prototype.slice.call(args, 2);
  return Tily.utility.vec2(f.apply(this, [v.x].concat(args)), f.apply(this, [v.y].concat(args)));
};

/**
 * Get the length of a vector.
 * @param {Tily.utility.vec2} v The vector.
 * @returns {Number} The vector's length.
 */
Tily.utility.Tily.utility.vec2.len = function(v) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
};

/**
 * Get the angle of a vector in radians.
 * @param {Tily.utility.vec2} v The vector.
 * @returns {Number} The angle of the vector in radians.
 */
Tily.utility.Tily.utility.vec2.rad = function(v) {
  return Math.atan2(v.y, v.x);
};

/**
 * Get the dot product of two vectors.
 * @param {Tily.utility.vec2} v1 The first vector.
 * @param {Tily.utility.vec2} v2 The second vector.
 * @returns {Number} The dot product of v1 and v2.
 */
Tily.utility.Tily.utility.vec2.dot = function(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y;
};

/**
 * Normalise a vector
 * @param {Tily.utility.vec2} v The vector.
 * @returns {Tily.utility.vec2} The normalised vector.
 */
Tily.utility.Tily.utility.vec2.norm = function(v) {
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
Tily.utility.Tily.utility.vec2.reflect = function(v, n) {
  return Tily.utility.vec2.add(v, Tily.utility.vec2.mul(Tily.utility.vec2.mul(n, Tily.utility.vec2.dot(v, n)), -2));
};

/**
 * Get the cross product of two vectors. The z-coord is assumed to be 0, since these are 2d vectors.
 * @param {Tily.utility.vec2} v1 The first vector.
 * @param {Tily.utility.vec2} v2 The second vector.
 * @returns {Number} The cross product of v1 and v2.
 */
Tily.utility.Tily.utility.vec2.cross = function(v1, v2) {
  return v1.x * v2.y - v1.y * v2.x;
};

/**
 * Rotate a vector.
 * @param {Tily.utility.vec2} v The vector.
 * @param {Number} r The amount to rotate the vector by, in radians.
 * @returns {Tily.utility.vec2} The rotated vector.
 */
Tily.utility.Tily.utility.vec2.rot = function(v, r) {
  var sinAngle = Math.sin(r),
    cosAngle = Math.cos(r),
    x = cosAngle * v.x - sinAngle * v.y,
    y = sinAngle * v.x + cosAngle * v.y;
  return Tily.utility.vec2(x, y);
};

/**
 * Add two vectors or add a scalar to each component.
 * @param {Tily.utility.vec2} v1 The first vector.
 * @param {Tily.utility.vec2|Number} v2 The second vector, or a scalar value to add to each component of v1.
 * @returns {Tily.utility.vec2} The sum of v1 and v2.
 */
Tily.utility.Tily.utility.vec2.add = function(v1, v2) {
  if (v2.x !== undefined && v2.y !== undefined) {
    return Tily.utility.vec2(v1.x + v2.x, v1.y + v2.y);
  } else {
    return Tily.utility.vec2(v1.x + v2, v1.y + v2);
  }
};

/**
 * Subtract two vectors.
 * @param {Tily.utility.vec2} v1 The first vector.
 * @param {Tily.utility.vec2|Number} v2 The second vector, or a scalar value to subtract from each component of
 * v1.
 * @returns {Tily.utility.vec2} The difference of v1 and v2.
 */
Tily.utility.Tily.utility.vec2.sub = function(v1, v2) {
  if (v2.x !== undefined && v2.y !== undefined) {
    return Tily.utility.vec2(v1.x - v2.x, v1.y - v2.y);
  } else {
    return Tily.utility.vec2(v1.x - v2, v1.y - v2);
  }
};

/**
 * Multiply two vectors.
 * @param {Tily.utility.vec2} v1 The first vector.
 * @param {Tily.utility.vec2|Number} v2 The second vector, or a scalar value to multiply each component of v1 by.
 * @returns {Tily.utility.vec2} The product of v1 and v2.
 */
Tily.utility.Tily.utility.vec2.mul = function(v1, v2) {
  if (v2.x !== undefined && v2.y !== undefined) {
    return Tily.utility.vec2(v1.x * v2.x, v1.y * v2.y);
  } else {
    return Tily.utility.vec2(v1.x * v2, v1.y * v2);
  }
};

/**
 * Divide two vectors.
 * @param {Tily.utility.vec2} v1 The first vector.
 * @param {Tily.utility.vec2|Number} v2 The second vector, or a scalar value to divide each component of v1 by.
 * @returns {Tily.utility.vec2} The quotient of v1 and v2.
 */
Tily.utility.Tily.utility.vec2.div = function(v1, v2) {
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
 * @returns {Boolean} True if the vectors are equal.
 */
Tily.utility.Tily.utility.vec2.eq = function(v1, v2) {
  return (v1.x == v2.x && v1.y == v2.y);
};

/**
 * Convert a string representation of a vector (like '0,0' or '0, 0') into a Tily.utility.vec2.
 * @param {String} s The string representation of the vector.
 * @returns {Tily.utility.vec2} The resulting Tily.utility.vec2, or a zero-vector if the string couldn't be parsed.
 */
Tily.utility.Tily.utility.vec2.fromString = function(s) {
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
 * @param {String} [s=','] An optional separator string.
 * @returns {String} The string representation of v.
 */
Tily.utility.Tily.utility.vec2.toString = function(v, s) {
  return v.x + (s !== undefined ? s : ",") + v.y;
};
