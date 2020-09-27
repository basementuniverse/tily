Tily.OpacityAnimation = (function(_super) {
  "use strict";
  Tily.utility.__extends(OpacityAnimation, _super);

  /**
   * Represents an opacity animation for fading active tiles.
   * @class
   * @extends Tily.Animation
   * @memberof Tily
   * @param {Tily.ActiveTile|Tily.ActiveTileLayer} activeTile The active tile or active tile
   * layer that this animation belongs to.
   * @param {number} start The starting opacity.
   * @param {number} finish The finishing opacity.
   * @param {AnimationOptions} [options] An optional options object for configuring the
   * animation.
   */
  function OpacityAnimation(activeTile, start, finish, options) {
    _super.call(this, activeTile, start, finish, options);
  }

  /**
   * Update the animation and set the active tile opacity.
   * @name update
   * @function
   * @instance
   * @memberof Tily.OpacityAnimation
   * @param {number} elapsedTime The number of seconds that have elapsed since the last update.
   */
  OpacityAnimation.prototype.update = function(elapsedTime) {
    const amount = _super.prototype.update.call(this, elapsedTime);
    this.activeTile.opacity = this.easeFunction(this.start, this.finish, amount);
  };
  return OpacityAnimation;
}(Tily.Animation));
