Tily.Buffer = (function(_super) {
	"use strict";
	__extends(Buffer, _super);
	
	/**
	 * A buffer containing tile layers that can be rendered in the Tily canvas.
	 * @class
	 * @extends Tily.BufferBase
	 * @memberof Tily
	 * @param {Number} width The width of the buffer in tiles.
	 * @param {Number} height The height of the buffer in tiles.
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
	 * @param {Tily.TileLayer} layer The layer to add.
	 * @param {Number} [z] The z-index at which to add the layer. If this is -1, the layer will be
	 * added below existing layers and if it is undefined the layer will be added above existing
	 * layers.
	 */
	Buffer.prototype.addLayer = function(layer, z) {
		// Make sure the layer has a reference to this buffer
		layer.container = this;
		if (z === undefined) {
			this.layers.push(layer);
		} else if (z == -1) {
			this.layers.unshift(layer);
		} else {
			this.layers.splice(z, 0, layer);
		}
	};
	
	/**
	 * Remove a layer at the specified z-index. If the z-index is undefined, remove the top layer
	 * and if the z-index is -1, remove the bottom layer. The removed layer is returned.
	 * @name removeLayer
	 * @function
	 * @instance
	 * @memberof Tily.Buffer
	 * @param {Number} [z] The z-index of the layer to remove. If this is -1, the bottom layer will
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
	 * @param {Number} zFrom The z-index of the layer to move.
	 * @param {Number} zTo The z-index to move the layer to.
	 * @param {Boolean} relative If this is true, the layer will be moved relative to it's current
	 * z-index.
	 * @returns {Boolean} True if a layer was moved successfully.
	 */
	Buffer.prototype.moveLayer = function(zFrom, zTo, relative) {
		if (this.layers.length < 2) { return false; }
		if (zFrom < 0 || zFrom >= this.layers.length) { return false; }
		const layer = this.layers.splice(zFrom, 1)[0],
			toIndex = Math.clamp(relative ? zFrom + zTo : zTo, 0, this.layers.length);
		this.layers.splice(toIndex, 0, layer);
		return true;
	};
	
	/**
	 * Resize this buffer's layers.
	 * @name resize
	 * @function
	 * @instance
	 * @memberof Tily.Buffer
	 * @param {Number} width The new width.
	 * @param {Number} height The new height.
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
	 * @property {String[]} layers The tile layer characters in z-index order at a tile position.
	 */
	/**
	 * Get information about the tiles and active tiles at a tile position.
	 * @name getTileInfo
	 * @function
	 * @instance
	 * @memberof Tily.Buffer
	 * @param {Number} x The x-coordinate of the tile position.
	 * @param {Number} y The y-coordinate of the tile position.
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
	 * @param {Number} elapsedTime The time elapsed in seconds since the last draw call.
	 * @param {Number} width The width of the canvas in pixels.
	 * @param {Number} height The height of the canvas in pixels.
	 */
	Buffer.prototype.draw = function(context, elapsedTime, width, height) {
		this.canvas.width = width;
		this.canvas.height = height;
		this.context.save();
		this.context.textBaseline = "top";
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
		this.scale = Math.clamp(
			this.scale,
			Math.max(this.options.minimumScale, 1),	// Minimum scale cannot go below 1 tile
			maximumScale
		);
		this.tileSize = (lockedAxis == "y" ? height : width) / this.scale;
		this.viewSize.width = width / this.tileSize;
		this.viewSize.height = height / this.tileSize;
		
		// Clamp camera offset
		if (this.options.clampCamera) {
			const centerX = this.viewSize.width * 0.5 - 0.5,
				centerY = this.viewSize.height * 0.5 - 0.5;
			this.offset = offset = vec2(
				Math.clamp(offset.x, centerX, this.size.width - centerX - 1),
				Math.clamp(offset.y, centerY, this.size.height - centerY - 1)
			);
		}
		
		// Translate camera viewport
		this.context.translate(
			width * 0.5 - offset.x * this.tileSize - this.tileSize * 0.5,
			height * 0.5 - offset.y * this.tileSize - this.tileSize * 0.5
		);
		
		// Update active tiles map
		const halfSize = vec2(this.viewSize.width * 0.5 + 1, this.viewSize.height * 0.5 + 1),
			tl = vec2.map(vec2.sub(offset, halfSize), Math.floor),
			br = vec2.map(vec2.add(offset, halfSize), Math.ceil),
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
	 * @returns {String} This buffer serialized as JSON data.
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
	 * @param {String} s The JSON data to deserialize.
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