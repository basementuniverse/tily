Tily.ShadowAnimation = (function(_super) {
  "use strict";
  Tily.utility.__extends(ShadowAnimation, _super);

  /**
   * Represents a shadow animation for animating active tile shadows.
   * @class
   * @extends Tily.Animation
   * @memberof Tily
   * @param {Tily.ActiveTile|Tily.ActiveTileLayer} activeTile The active tile or active tile
   * layer that this animation belongs to.
   * @param {Tily.utility.vec2} start The starting shadow.
   * @param {Tily.utility.vec2} finish The finishing shadow.
   * @param {AnimationOptions} [options] An optional options object for configuring the
   * animation.
   */
  function ShadowAnimation(activeTile, start, finish, options) {
    if (!options.easeFunction) {
      options.easeFunction = (a, b, i) => {
        const as = Tily.utility.shadow(a);
        const bs = Tily.utility.shadow(b);
        as.colour = Tily.utility.parseColor(as.colour);
        bs.colour = Tily.utility.parseColor(bs.colour);
        const result = {
          blur: Tily.utility.lerp(as.blur, bs.blur, i),
          xOffset: Tily.utility.lerp(as.xOffset, bs.xOffset, i),
          yOffset: Tily.utility.lerp(as.yOffset, bs.yOffset, i),
          colour: Tily.utility.colour({
            r: Tily.utility.lerp(as.colour.r, bs.colour.r, i),
            g: Tily.utility.lerp(as.colour.g, bs.colour.g, i),
            b: Tily.utility.lerp(as.colour.b, bs.colour.b, i),
            a: Tily.utility.lerp(as.colour.a, bs.colour.a, i)
          })
        };
        return `${result.blur} ${result.xOffset} ${result.yOffset} ${result.colour}`;
      };
    }
    _super.call(this, activeTile, start, finish, options);
  }

  /**
   * Update the animation and set the active tile shadow.
   * @name update
   * @function
   * @instance
   * @memberof Tily.ShadowAnimation
   * @param {number} elapsedTime The number of seconds that have elapsed since the last update.
   */
  ShadowAnimation.prototype.update = function(elapsedTime) {
    const amount = _super.prototype.update.call(this, elapsedTime);
    this.activeTile.shadow = this.easeFunction(this.start, this.finish, amount);
  };
  return ShadowAnimation;
}(Tily.Animation));
