Tily.ForegroundAnimation = (function(_super) {
	"use strict";
	__extends(ForegroundAnimation, _super);
	
	/**
	 * Represents a foreground colour animation for changing the colour of active tiles.
	 * @class
	 * @extends Tily.Animation
	 * @memberof Tily
	 * @param {Tily.ActiveTile|Tily.ActiveTileLayer} activeTile The active tile or active tile
	 * layer that this animation belongs to.
	 * @param {} start The starting foreground colour.
	 * @param {} finish The finishing foreground colour.
	 * @param {AnimationOptions} [options] An optional options object for configuring the
	 * animation.
	 */
	function ForegroundAnimation(activeTile, start, finish, options) {
		if (!options.easeFunction) {
			options.easeFunction = (a, b, i) => ({
				r: Tily.utility.lerp(a.r, b.r, i),
				g: Tily.utility.lerp(a.g, b.g, i),
				b: Tily.utility.lerp(a.b, b.b, i),
				a: Tily.utility.lerp(a.a, b.a, i)
			});
		}
		_super.call(this, activeTile, start, finish, options);
	}
	
	/**
	 * Update the animation and the set the active tile foreground colour.
	 * @name update
	 * @function
	 * @instance
	 * @memberof Tily.ForegroundAnimation
	 * @param {Number} elapsedTime The number of seconds that have elapsed since the last update.
	 */
	ForegroundAnimation.prototype.update = function(elapsedTime) {
		const amount = _super.prototype.update.call(this, elapsedTime);
		this.activeTile.foreground = Tily.utility.colour(this.easeFunction(this.start, this.finish, amount));
	};
	return ForegroundAnimation;
}(Tily.Animation));