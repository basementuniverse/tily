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
