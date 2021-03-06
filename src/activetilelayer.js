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
