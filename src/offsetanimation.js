Tily.OffsetAnimation = (function(_super) {
  "use strict";
  Tily.utility.__extends(OffsetAnimation, _super);

  /**
   * Represents an offset animation for moving active tiles.
   * @class
   * @extends Tily.Animation
   * @memberof Tily
   * @param {Tily.ActiveTile|Tily.ActiveTileLayer} activeTile The active tile or active tile
   * layer that this animation belongs to.
   * @param {Tily.utility.vec2} start The starting offset.
   * @param {Tily.utility.vec2} finish The finishing offset.
   * @param {AnimationOptions} [options] An optional options object for configuring the
   * animation.
   */
  function OffsetAnimation(activeTile, start, finish, options) {
    if (!options.easeFunction) {
      options.easeFunction = (a, b, i) => Tily.utility.vec2(
        Tily.utility.lerp(a.x, b.x, i),
        Tily.utility.lerp(a.y, b.y, i)
      );
    }
    _super.call(this, activeTile, start, finish, options);
  }

  /**
   * Update the animation and set the active tile offset.
   * @name update
   * @function
   * @instance
   * @memberof Tily.OffsetAnimation
   * @param {number} elapsedTime The number of seconds that have elapsed since the last update.
   */
  OffsetAnimation.prototype.update = function(elapsedTime) {
    const amount = _super.prototype.update.call(this, elapsedTime);
    this.activeTile.offset = this.easeFunction(this.start, this.finish, amount);
  };
  return OffsetAnimation;
}(Tily.Animation));
