Tily.ActiveTile = (function(_super) {
	"use strict";
	__extends(ActiveTile, _super);
	
	/**
	 * A tile that can be translated, scaled, rotated and animated.
	 * @class
	 * @extends Tily.ActiveTileBase
	 * @memberof Tily
	 * @param {Number} [x=0] The initial x-coordinate of this active tile.
	 * @param {Number} [y=0] The initial y-coordinate of this active tile.
	 * @param {Number} [zIndex=0] The initial z-index of this active tile.
	 */
	function ActiveTile(x, y, zIndex) {
		_super.call(this);
		
		/**
		 * The position of this active tile.
		 * @type {vec2}
		 */
		this.position = vec2(x || 0, y || 0);
		
		/**
		 * The layer ordering of this active tile.
		 * @type {Number}
		 */
		this.zIndex = zIndex || 0;
		
		/**
		 * True if this active tile should clip at the tile edges.
		 * @default false
		 * @type {Boolean}
		 */
		this.clip = false;
		
		/**
		 * True if this active tile should wrap around tile edges.
		 * @default false
		 * @type {Boolean}
		 */
		this.wrap = false;
		
		/**
		 * True if this active tile should be flipped along the x-axis.
		 * @default false
		 * @type {Boolean}
		 */
		this.flip = false;
		
		/**
		 * The font to use when rendering this active tile's layers.
		 * @default "sans-serif"
		 * @type {String}
		 */
		this.font = "sans-serif";

		/**
		 * The font style to use when rendering this active tile's layers.
		 * @default "normal"
		 * @type {String}
		 */
		this.fontStyle = "normal";

		/**
		 * The font size to use when rendering this active tile's layers. If null, fit characters to the tile.
		 * @default null
		 * @type {?String}
		 */
		this.fontSize = null;
		
		/**
		 * The foreground colour, used for rendering text on this active tile's layers.
		 * @default "white"
		 * @type {String}
		 */
		this.foreground = "white";

		/**
		 * The outline width and colour for this active tile's layers.
		 * @default null
		 * @type {?String}
		 */
		this.outline = null;

		/**
		 * The shadow amount, offset and colour for this active tile's layers.
		 * @default null
		 * @type {?String}
		 */
		this.shadow = null;
		
		/**
		 * The opacity of this active tile.
		 * @default 1
		 * @type {Number}
		 */
		this.opacity = 1;

		/**
		 * The composite operation to use when drawing this active tile.
		 * @default "source-over"
		 * @type {String}
		 */
		this.compositeMode = "source-over";
		
		/**
		 * An offset from this active tile's position measured in tiles.
		 * @default { x: 0, y: 0 }
		 * @type {vec2}
		 */
		this.offset = vec2();
		
		/**
		 * The scale of this active tile.
		 * @default { x: 1, y: 1 }
		 * @type {vec2}
		 */
		this.scale = vec2(1, 1);
		
		/**
		 * The rotation angle of this active tile measured in radians.
		 * @default 0
		 * @type {Number}
		 */
		this.rotation = 0;

		/**
		 * True if the text in this active tile should be centered.
		 * @default false
		 * @type {Boolean}
		 */
		this.centered = false;
		
		/**
		 * True if this active tile should be removed in the next frame.
		 * @default false
		 * @type {Boolean}
		 */
		this.destroyed = false;
	}
	/**
	 * Animate this active tile's position.
	 * @name move
	 * @function
	 * @instance
	 * @memberof Tily.ActiveTile
	 * @param {String} direction The movement direction, either 'up', 'down', 'left', 'right'.
	 * @param {AnimationOptions} [options] An optional options object.
	 */
	ActiveTile.prototype.move = function(direction, options) {
		const directions = {
			up: vec2(0, -1),
			down: vec2(0, 1),
			left: vec2(-1, 0),
			right: vec2(1, 0)
		};
		this.position = vec2.add(this.position, directions[direction]);
		const animation = new Tily.OffsetAnimation(this, vec2.mul(directions[direction], -1), vec2(), options);
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
	 * @param {Number} [z] The z-index at which to add the layer. If this is -1, the layer will be
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
	 * @param {Number} elapsedTime The time elapsed in seconds since the last draw call.
	 * @param {Number} tileSize The tile size measured in pixels.
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
	 * @param {Number} elapsedTime The time elapsed in seconds since the last draw call.
	 * @param {Number} tileSize The tile size measured in pixels.
	 */
	ActiveTile.prototype.draw = function(context, elapsedTime, tileSize) {
		if (!this.layers) { return; }	// Active tile has no layers so don't render
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