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
