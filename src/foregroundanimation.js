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
		const amount = _super.prototype.update.call(this, elapsedTime),
			c = {
				r: this.easeFunction(this.start.r, this.finish.r, amount),
				g: this.easeFunction(this.start.g, this.finish.g, amount),
				b: this.easeFunction(this.start.b, this.finish.b, amount),
				a: this.easeFunction(this.start.a, this.finish.a, amount)
			};
		this.activeTile.foreground = "rgba(" +
			Math.round(c.r) + ", " +
			Math.round(c.g) + ", " +
			Math.round(c.b) + ", " +
			(Math.round(c.a * 100) / 100) + ")";
	};
	return ForegroundAnimation;
}(Tily.Animation));