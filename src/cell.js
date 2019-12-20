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
	 * @param {vec2} p The position to check.
	 * @param {vec2} tl The top-left corner of the region.
	 * @param {vec2} br The bottom-right corner of the region.
	 * @returns {Boolean} True if the position p is inside the region.
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
	 * @param {Number} [z] The z-index at which to add the layer. If this is -1, the layer will be
	 * added below existing layers and if it is undefined the layer will be added above existing
	 * layers.
	 */
	Cell.prototype.addLayer = function(layer, z) {
		// Make sure the layer has a reference to this cell
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
	 * @memberof Tily.Cell
	 * @param {Number} [z] The z-index of the layer to remove. If this is -1, the bottom layer will
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
	 * @param {Number} zFrom The z-index of the layer to move.
	 * @param {Number} zTo The z-index to move the layer to.
	 * @param {Boolean} relative If this is true, the layer will be moved relative to it's current
	 * z-index.
	 * @returns {Boolean} True if a layer was moved successfully.
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
	 * @param {Number} elapsedTime The time elapsed in seconds since the last draw call.
	 * @param {Number} x The cell x-coordinate.
	 * @param {Number} y The cell y-coordinate.
	 * @param {Number} tileSize The size of each tile measured in pixels.
	 * @param {vec2} tl The top-left tile position currently in view.
	 * @param {vec2} br The bottom-right tile position currently in view.
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
			vec2.add(i.position, i.offset),
			vec2(x * size.width, y * size.height),
			vec2((x + 1) * size.width, (y + 1) * size.height)
		));
		
		// Get tl and br in terms of cell offsets
		const cellOffset = vec2(x * size.width, y * size.height),
			tlCell = vec2.sub(tl, cellOffset),
			brCell = vec2.sub(br, cellOffset);
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
	 * @returns {String} This cell serialized as JSON data.
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
	 * @param {String} s The JSON data to deserialize.
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