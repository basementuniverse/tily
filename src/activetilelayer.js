Tily.ActiveTileLayer = (function(_super) {
	"use strict";
	__extends(ActiveTileLayer, _super);
	
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
		 * @type {String}
		 */
		this.text = "";
	}
	
	/**
	 * @callback animateTextFunction
	 * @param {String} t The starting text.
	 * @param {Number} i The interpolation value, between 0 (start) and 1 (finish).
	 * @returns {String} The text to use in the active tile.
	 */
	/**
	 * Animate this active tile's text.
	 * @name animateText
	 * @function
	 * @instance
	 * @memberof Tily.ActiveTileLayer
	 * @param {String|String[]|animateTextFunction} text If this is a string, the active tile's
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
	 * @param {Number} [z] The z-index at which to add the layer. If this is -1, the layer will be
	 * added below existing layers and if it is undefined the layer will be added above existing
	 * layers.
	 */
	ActiveTileLayer.prototype.addLayer = function(layer, z) {
		// Make sure the layer has a reference to the top-level active tile
		layer.activeTile = this.activeTile;
		
		// Make sure the layer has a reference to its parent (ie. this active tile layer)
		layer.parent = this;
		_super.prototype.addLayer.call(this, layer, z);
	};
	
	/**
	 * Render this active tile layer onto the buffer context.
	 * @name draw
	 * @function
	 * @instance
	 * @memberof Tily.ActiveTileLayer
	 * @param {CanvasRenderingContext2D} context The context to draw this active tile layer onto.
	 * @param {Number} elapsedTime The time elapsed in seconds since the last draw call.
	 * @param {Number} tileSize The tile size measured in pixels.
	 */
	ActiveTileLayer.prototype.draw = function(context, elapsedTime, tileSize) {
		if (!this.parent) { return; }	// Layer doesn't belong to an active tile or another layer
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
		if (this.offset !== null) {
			context.translate(this.offset.x * tileSize, this.offset.y * tileSize);
		}
		if (this.rotation !== null) {
			context.rotate(this.rotation);
		}
		if (this.scale !== null) {
			context.scale(this.scale.x, this.scale.y);
		}
		context.fillText(this.text, -tileSize * 0.5, -tileSize * 0.5);
		
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
			opacity: this.opacity,
			compositeMode: this.compositeMode,
			offset: this.offset,
			scale: this.scale,
			rotation: this.rotation
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
		layer.opacity = data.opacity;
		layer.compositeMode = data.compositeMode;
		layer.offset = data.offset;
		layer.scale = data.scale;
		layer.rotation = data.rotation;
		return layer;
	};
	return ActiveTileLayer;
}(Tily.ActiveTileBase));