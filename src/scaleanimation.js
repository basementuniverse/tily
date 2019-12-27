Tily.ScaleAnimation = (function(_super) {
	"use strict";
	__extends(ScaleAnimation, _super);
	
	/**
	 * Represents a scale animation for scaling active tiles.
	 * @class
	 * @extends Tily.Animation
	 * @memberof Tily
	 * @param {Tily.ActiveTile|Tily.ActiveTileLayer} activeTile The active tile or active tile
	 * layer that this animation belongs to.
	 * @param {vec2} start The starting scale.
	 * @param {vec2} finish The finishing scale.
	 * @param {AnimationOptions} [options] An optional options object for configuring the
	 * animation.
	 */
	function ScaleAnimation(activeTile, start, finish, options) {
		if (!options.easeFunction) {
			options.easeFunction = (a, b, i) => vec2(
				Tily.utility.lerp(a.x, b.x, i),
				Tily.utility.lerp(a.y, b.y, i)
			);
		}
		_super.call(this, activeTile, start, finish, options);
	}
	
	/**
	 * Update the animation and set the active tile scale.
	 * @name update
	 * @function
	 * @instance
	 * @memberof Tily.ScaleAnimation
	 * @param {Number} elapsedTime The number of seconds that have elapsed since the last update.
	 */
	ScaleAnimation.prototype.update = function(elapsedTime) {
		const amount = _super.prototype.update.call(this, elapsedTime);
		this.activeTile.scale = this.easeFunction(this.start, this.finish, amount);
	};
	return ScaleAnimation;
}(Tily.Animation));