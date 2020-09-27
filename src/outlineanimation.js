Tily.OutlineAnimation = (function(_super) {
  "use strict";
  Tily.utility.__extends(OutlineAnimation, _super);

  /**
   * Represents an outline animation for animating active tile outlines.
   * @class
   * @extends Tily.Animation
   * @memberof Tily
   * @param {Tily.ActiveTile|Tily.ActiveTileLayer} activeTile The active tile or active tile
   * layer that this animation belongs to.
   * @param {Tily.utility.vec2} start The starting outline.
   * @param {Tily.utility.vec2} finish The finishing outline.
   * @param {AnimationOptions} [options] An optional options object for configuring the
   * animation.
   */
  function OutlineAnimation(activeTile, start, finish, options) {
    if (!options.easeFunction) {
      options.easeFunction = (a, b, i) => {
        const ao = Tily.utility.outline(a);
        const bo = Tily.utility.outline(b);
        ao.colour = Tily.utility.parseColor(ao.colour);
        bo.colour = Tily.utility.parseColor(bo.colour);
        const result = {
          width: Tily.utility.lerp(ao.width, bo.width, i),
          colour: Tily.utility.colour({
            r: Tily.utility.lerp(ao.colour.r, bo.colour.r, i),
            g: Tily.utility.lerp(ao.colour.g, bo.colour.g, i),
            b: Tily.utility.lerp(ao.colour.b, bo.colour.b, i),
            a: Tily.utility.lerp(ao.colour.a, bo.colour.a, i)
          })
        };
        return `${result.width} ${result.colour}`;
      };
    }
    _super.call(this, activeTile, start, finish, options);
  }

  /**
   * Update the animation and set the active tile outline.
   * @name update
   * @function
   * @instance
   * @memberof Tily.OutlineAnimation
   * @param {number} elapsedTime The number of seconds that have elapsed since the last update.
   */
  OutlineAnimation.prototype.update = function(elapsedTime) {
    const amount = _super.prototype.update.call(this, elapsedTime);
    this.activeTile.outline = this.easeFunction(this.start, this.finish, amount);
  };
  return OutlineAnimation;
}(Tily.Animation));
