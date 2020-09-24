Tily.TextAnimation = (function(_super) {
  "use strict";
  Tily.utility.__extends(TextAnimation, _super);
  
  /**
   * Represents a text animation for changing an active tile's text over a given time interval.
   * @class
   * @extends Tily.Animation
   * @memberof Tily
   * @param {Tily.ActiveTile|Tily.ActiveTileLayer} activeTile The active tile or active tile
   * layer that this animation belongs to.
   * @param {String} start The starting text.
   * @param {String|String[]|animateTextFunction} finish Either a string with characters
   * for each animation frame, an array of strings for each animation frame or a function that
   * returns a string for each animation frame.
   * @param {AnimationOptions} [options] An optional options object for configuring the
   * animation.
   */
  function TextAnimation(activeTile, start, finish, options) {
    _super.call(this, activeTile, start, finish, options);
    
    /**
     * The type of the finishing value. Will be either "string", "array" or "function".
     * @type {String}
     */
    this.finishType = typeof finish;
  }
  
  /**
   * Update the animation.
   * @name update
   * @function
   * @instance
   * @memberof Tily.TextAnimation
   * @param {Number} elapsedTime The number of seconds that have elapsed since the last update.
   * @returns {Number} 
   */
  TextAnimation.prototype.update = function(elapsedTime) {
    const amount = _super.prototype.update.call(this, elapsedTime);
    var text = this.start;
    if (this.finishType == "function") {
      text = this.finish(this.start, amount);
    } else {
      text = this.finish[Math.max(0, Math.ceil(amount * this.finish.length) - 1)];
    }
    this.activeTile.text = text;
  };
  return TextAnimation;
}(Tily.Animation));
