Tily.BufferBase = (function() {
	"use strict";
	
	/**
	 * @typedef BufferOptions
	 * @type {Object}
	 * @property {String} [lockedAxis="x"] Indicates which axis is used for scaling the tiles, the
	 * scale parameter will indicate how many tiles are visible on the locked axis. Should be
	 * either "x" or "y".
	 * @property {Number} [initialOffsetX=0] The starting offset x-coordinate for this buffer.
	 * @property {Number} [initialOffsetY=0] The starting offset y-coordinate for this buffer.
	 * @property {Number} [initialScale=16] The starting scale, represents the number of visible
	 * tiles along the locked axis.
	 * @property {Number} [maximumScale=32] The maximum number of tiles visible along the locked
	 * axis.
	 * @property {Number} [minimumScale=4] The minimum number of tiles visible along the locked
	 * axis.
	 * @property {Boolean} [clampCamera=false] Clamp the camera offset and zoom so that the buffer
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
		this.options = {}.extend(_defaultBufferOptions, options || {});
		
		/**
		 * A camera offset position for this buffer measured in pixels.
		 * @type {vec2}
		 */
		this.offset = vec2(this.options.initialOffsetX, this.options.initialOffsetY);
		
		/**
		 * The currently running offset transition or null if there is no transition currently
		 * running.
		 * @default null
		 * @type {?Tily.OffsetTransition}
		 */
		this.offsetTransition = null;
		
		/**
		 * The number of tiles currently visible along the locked axis.
		 * @type {Number}
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
		 * @type {Number}
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
	 * @param {vec2} p The position to check.
	 * @param {vec2} tl The top-left corner of the region.
	 * @param {vec2} br The bottom-right corner of the region.
	 * @returns {Boolean} True if the position p is inside the region.
	 */
	function checkBounds(p, tl, br) {
		return (p.x >= tl.x && p.x <= br.x && p.y >= tl.y && p.y <= br.y);
	}
	
	/**
	 * Get a string representation of the specified position for use as a hash.
	 * @param {vec2} p The position to hash.
	 * @returns {String} A hash string for the specified position.
	 */
	function hash(p) {
		return vec2.toString(p, "_");
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
	 * @property {String} [unit=""] The unit of measurement for the new offset. If this is set to
	 * 'px', the unit will be pixels and if it is set to anything else the unit will be tiles.
	 * @property {Boolean} [relative=false] True if the movement should be relative to the current
	 * offset.
	 */
	/**
	 * Move the offset with an optional transition animation.
	 * @name moveOffset
	 * @function
	 * @instance
	 * @memberof Tily.BufferBase
	 * @param {Number} x The x-coordinate of the target offset position.
	 * @param {Number} y The y-coordinate of the target offset position.
	 * @param {MoveOffsetTransitionOptions} [options] An optional options object.
	 */
	BufferBase.prototype.moveOffset = function(x, y, options) {
		options = {
			unit: "",
			relative: false,
			...options
		};
		var offset = vec2(x, y);
		if (options.unit == "px") {	// Adjust the offset position if moving in pixels
			offset = vec2.div(offset, this.tileSize);
		}
		if (this.offsetTransition) {
			this.offset = this.offsetTransition.update(0);
		}
		if (options.relative === true) {	// Add the current position if moving relatively
			offset = vec2.add(this.offset, offset);
		}
		const transition = new Tily.OffsetTransition(vec2(this.offset), vec2(offset), options);
		this.offsetTransition = transition;
		this.offset = offset;
		return new Promise(function(resolve, reject) { transition.finishedCallback = resolve; });
	};
	
	/**
	 * @name offsetPixels
	 * @description The offset of this buffer measured in pixels, as a vec2 object.
	 * @instance
	 * @memberof Tily.BufferBase
	 * @type {vec2}
	 */
	Object.defineProperty(BufferBase.prototype, "offsetPixels", {
		get: function() {
			return vec2.mul(this.offset, this.tileSize);
		}
	});
	
	/**
	 * Zoom the scale with an optional transition animation.
	 * @name zoom
	 * @function
	 * @instance
	 * @memberof Tily.BufferBase
	 * @param {Number} scale The target scale.
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
	 * @param {Number} x The x-coordinate of the pixel position.
	 * @param {Number} y The y-coordinate of the pixel position.
	 * @returns {vec2} The tile position currently at the specified pixel position.
	 */
	BufferBase.prototype.getPosition = function(x, y) {
		const tl = vec2.sub(
			vec2.add(this.offset, 0.5),
			vec2.div(vec2(this.viewSize.width, this.viewSize.height), 2)
		);
		return vec2.map(vec2.add(tl, vec2.div(vec2(x, y), this.tileSize)), Math.floor);
	};
	
	/**
	 * @typedef BufferBaseTileInfo
	 * @type {Object}
	 * @property {vec2} position The tile position.
	 * @property {ActiveTile[]} activeTiles A list of active tiles at a tile position.
	 */
	/**
	 * Get information about the active tiles at a tile position.
	 * @name getTileInfo
	 * @function
	 * @instance
	 * @memberof Tily.BufferBase
	 * @param {Number} x The x-coordinate of the tile position.
	 * @param {Number} y The y-coordinate of the tile position.
	 * @returns {BufferBaseTileInfo} Information about the tiles at the specified position.
	 */
	BufferBase.prototype.getTileInfo = function(x, y) {
		const p = vec2(x, y);
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
	 * @param {Number} elapsedTime The time elapsed in seconds since the last draw call.
	 * @returns {vec2} The interpolated offset position.
	 */
	BufferBase.prototype.updateTransitions = function(elapsedTime) {
		// Update offset transition
		var offset = this.offset;
		if (this.offsetTransition) {
			offset = this.offsetTransition.update(elapsedTime);
			if (this.offsetTransition.finished) {	// Remove the transition when it has finished
				this.offsetTransition = null;
			}
		}
		
		// Update scale transition
		if (this.scaleTransition) {
			this.scale = this.scaleTransition.update(elapsedTime);
			if (this.scaleTransition.finished) {	// Remove the transition when it has finished
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
	 * @param {vec2} tl The top-left tile position currently in view.
	 * @param {vec2} br The bottom-right tile position currently in view.
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
				vec2.add(this.activeTiles[i].position, this.activeTiles[i].offset),
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