Tily.Main = (function() {
  "use strict";

  /**
   * @typedef Size
   * @type {Object}
   * @property {number} width The width.
   * @property {number} height The height.
   */
  /**
   * @callback beforeDrawFunction
   * @param {number} elapsedTime The time elapsed in seconds since the last draw call.
   */
  /**
   * @callback afterDrawFunction
   * @param {number} elapsedTime The time elapsed in seconds since the last draw call.
   */
  /**
   * @typedef TilyOptions
   * @type {Object}
   * @property {?Size} [size=null] The viewport size, or null to use the canvas element
   * dimensions.
   * @property {boolean} [handleResize=true] True if the window resize event should be handled.
   * @property {boolean} [showFPS=false] True if the FPS should be displayed.
   * @property {boolean} [renderLoop=true] True if the render loop should be started
   * automatically.
   * @property {?beforeDrawFunction} [beforeDrawFunction=null] A function that will be called
   * after clearing the context but before drawing the active buffer. In the context of the
   * function, 'this' will point to the Tily instance.
   * @property {?afterDrawFunction} [afterDrawFunction=null] A function that will be called after
   * drawing the active buffer. In the context of the function, 'this' will point to the Tily instance.
   */
  /**
   * Default Tily options, used as a fall-back for options passed to the constructor.
   * @type {TilyOptions}
   */
  const _defaultTilyOptions = {
    size: null,
    handleResize: true,
    showFPS: false,
    renderLoop: true,
    beforeDrawFunction: null,
    afterDrawFunction: null
  };

  /**
   * The main Tily object. Initialises a canvas element and starts drawing tiles.
   * @class
   * @memberof Tily
   * @param {HTMLElement} canvas The canvas element in which to draw tiles.
   * @param {TilyOptions} [options] An optional object containing options for configuring this
   * Tily instance.
   */
  function Main(canvas, options) {
    if (!window) {  // Check that we are in a browser (ie. window exists)
      console.log("Couldn't find window. Tily.Main can only be created in the browser!");
      return
    }
    if (!canvas.getContext) {  // Check for canvas support
      console.log("Canvas not supported!");
      return;
    }

    /**
     * Options for configuring this Tily instance.
     * @type {TilyOptions}
     */
    this.options = { ..._defaultTilyOptions, ...options || {} };

    /**
     * The canvas element in which to draw tiles.
     * @type {HTMLElement}
     */
    this.canvas = canvas;

    /**
     * The context on which to draw tiles.
     * @type {CanvasRenderingContext2D}
     */
    this.context = canvas.getContext("2d");

    /**
     * The viewport width.
     * @type {number}
     */
    this.width = 0;

    /**
     * The viewport height.
     * @type {number}
     */
    this.height = 0;

    /**
     * The buffer currently being rendered.
     * @type {Tily.BufferBase}
     */
    this.activeBuffer = null;

    /**
     * The currently running buffer transition or null if there is no currently running
     * transition.
     * @default null
     * @type {?Tily.BufferTransition}
     */
    this.bufferTransition = null;

    /**
     * A request id returned from window.requestAnimationFrame that uniquely identifies the
     * entry in the callback list for the main render loop.
     * @type {number}
     */
    this.loop = null;

    /**
     * The unix epoch time of the last rendered frame.
     * @type {number}
     */
    this.lastFrameTime = new Date();

    /**
     * The number of frames rendered in the last second.
     * @type {number}
     */
    this.frameCount = 0;

    /**
     * The number of milliseconds elapsed since the last framerate update.
     * @type {number}
     */
    this.frameTime = 0;

    /**
     * The number of frames rendered per second.
     * @type {number}
     */
    this.frameRate = 0;

    // Handle the window resize event to get the current viewport size or use a fixed size
    if (!this.options.size || this.options.handleResize) {
      const self = this;
      function resize() {
        self.canvas.width = self.width = canvas.clientWidth * window.devicePixelRatio;
        self.canvas.height = self.height = canvas.clientHeight * window.devicePixelRatio;
      }
      window.addEventListener("resize", resize, false);
      resize();
    } else {
      this.canvas.width = this.width = this.options.size.width;
      this.canvas.height = this.height = this.options.size.height;
    }

    // Start the render loop
    if (this.options.renderLoop) {
      loop(this);
    }
  }

  /**
   * Perform a single iteration of the render loop.
   * @param {Tily.Main} t The Tily instance being looped.
   */
  function loop(t) {
    const now = new Date(),
      elapsedTime = (now - t.lastFrameTime) / 1000;
    t.lastFrameTime = now;
    t.frameTime += elapsedTime;
    t.frameCount++;
    if (t.frameTime > 1) {
      t.frameRate = t.frameCount;
      t.frameTime = 0;
      t.frameCount = 0;
    }
    t.draw(elapsedTime);
    t.loop = window.requestAnimationFrame(function() { loop(t) });
  }

  /**
   * Render the Tily instance onto the canvas.
   * @name draw
   * @function
   * @instance
   * @memberof Tily.Main
   * @param {number} elapsedTime The time elapsed in seconds since the last draw call.
   */
  Main.prototype.draw = function(elapsedTime) {
    this.context.save();
    this.context.clearRect(0, 0, this.width, this.height);
    if (typeof this.options.beforeDrawFunction == "function") {
      this.options.beforeDrawFunction.call(this, this.canvas, this.context, this.width, this.height, elapsedTime);
    }

    // Draw the active buffer and handle buffer fade transition
    const width = this.width,
      height = this.height;
    if (this.bufferTransition) {
      const alpha = this.bufferTransition.update(elapsedTime);
      if (this.bufferTransition.start) {
        this.context.globalAlpha = 1 - alpha;
        this.bufferTransition.start.draw(this.context, elapsedTime, width, height);
      }
      if (this.bufferTransition.finish) {
        this.context.globalAlpha = alpha;
        this.bufferTransition.finish.draw(this.context, elapsedTime, width, height);
      }
      if (this.bufferTransition.finished) {  // Remove the transition when it has finished
        this.bufferTransition = null;
      }
    } else if (this.activeBuffer) {
      this.context.globalAlpha = 1;
      this.activeBuffer.draw(this.context, elapsedTime, width, height);
    }
    if (typeof this.options.afterDrawFunction == "function") {
      this.options.afterDrawFunction.call(this, this.canvas, this.context, this.width, this.height, elapsedTime);
    }
    this.context.restore();
    if (this.options.showFPS) {
      this.context.save();
      this.context.font = '20px monospace';
      this.context.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.context.fillRect(this.width - (10 + 80), 10, 80, 30);
      this.context.fillStyle = 'white';
      this.context.textBaseline = 'top';
      this.context.textAlign = 'right';
      this.context.fillText(this.frameRate, this.width - 15, 15);
      this.context.restore();
    }
  };

  /**
   * Activate a new buffer with an optional fade transition from the current buffer.
   * @name activateBuffer
   * @function
   * @instance
   * @memberof Tily.Main
   * @param {Tily.Buffer} buffer The new buffer to activate.
   * @param {TransitionOptions} [options] An optional options object.
   * @returns {Promise} A promise instance for setting a transition finished callback.
   */
  Main.prototype.activateBuffer = function(buffer, options) {
    const transition = new Tily.BufferTransition(this.activeBuffer, buffer, options);
    this.bufferTransition = transition;
    this.activeBuffer = buffer;
    return new Promise(function(resolve, reject) { transition.finishedCallback = resolve; });
  };

  /**
   * @name size
   * @description The size of this Tily element measured in pixels.
   * @instance
   * @memberof Tily.Main
   * @type {Size}
   */
  Object.defineProperty(Main.prototype, "size", {
    get: function() {
      return {
        width: this.width,
        height: this.height
      };
    }
  });
  return Main;
}());
