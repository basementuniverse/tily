Tily.Transition = (function() {
  "use strict";
  
  /**
   * @callback easeFunction
   * @param {any} a The starting value.
   * @param {any} b The finishing value.
   * @param {Number} i The interpolation value, between 0 (start) and 1 (finish).
   * @returns {any} The interpolated value between a and b.
   */
  /**
   * @callback finishedCallback
   * @param {any} start The previous value before transitioning.
   * @param {any} finish The new value after transitioning.
   */
  /**
   * @typedef TransitionOptions
   * @type {Object}
   * @property {Number} [time=0] The amount of time in seconds that this transition should take
   * to complete.
   * @property {easeFunction} [easeFunction=Tily.utility.lerp] The easing function to use while
   * transitioning.
   * @property {?finishedCallback} [finishedCallback=null] A callback function that will be
   * called once the transition has finished.
   */
  /**
   * Default transition options, used as a fall-back for options passed to the constructor.
   * @type {TransitionOptions}
   */
  const _defaultTransitionOptions = {
    time: 0,
    easeFunction: null,
    finishedCallback: null
  };
  
  /**
   * Represents a timed transition from one value to another.
   * @class
   * @memberof Tily
   * @param {any} start The starting value.
   * @param {any} finish The finishing value.
   * @options {TransitionOptions} [options] An optional options object for configuring the
   * transition.
   */
  function Transition(start, finish, options) {
    options = { ..._defaultTransitionOptions, ...options || {} };
    
    /**
     * The starting value.
     * @type {any}
     */
    this.start = start;
    
    /**
     * The finishing value.
     * @type {any}
     */
    this.finish = finish;
    
    /**
     * The total amount of time that this transition should take.
     * @type {Number}
     */
    this.totalTime = options.time;
    
    /**
     * The current time elapsed since the transition began.
     * @type {Number}
     */
    this.currentTime = 0;
    
    /**
     * The easing function to use while transitioning.
     * @default Tily.utility.lerp
     * @type {easeFunction}
     */
    this.easeFunction = options.easeFunction || Tily.utility.lerp;
    
    /**
     * A callback function that will be called once the transition has finished.
     * @default null
     * @type {?finishedCallback}
     */
    this.finishedCallback = options.finishedCallback || function(start, finish) { };
    
    /**
     * True if this transition has finished and can be discarded.
     * @type {Boolean}
     */
    this.finished = false;
  }
  
  /**
   * Update the transition.
   * @name update
   * @function
   * @instance
   * @memberof Tily.Transition
   * @param {Number} elapsedTime The number of seconds that have elapsed since the last update.
   * @returns {any} An interpolated value between the start and finish values.
   */
  Transition.prototype.update = function(elapsedTime) {
    this.currentTime += elapsedTime;
    
    // If transition is currently in progress, ease from start to finish value
    if (this.currentTime < this.totalTime) {
      return this.easeFunction(this.start, this.finish, this.amount);
    }
    
    // Otherwise, transition has finished
    if (this.finishedCallback && !this.finished) {
      this.finishedCallback(this.start, this.finish);
    }
    this.finished = true;
    return this.finish;
  };
  
  /**
   * @name amount
   * @description The current interpolation amount between 0 and 1 (inclusive).
   * @instance
   * @memberof Tily.Transition
   * @type {Number}
   */
  Object.defineProperty(Transition.prototype, "amount", {
    get: function() {
      return Tily.utility.clamp(this.currentTime / this.totalTime);
    }
  });
  return Transition;
}());
