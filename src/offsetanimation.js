Tily.OffsetAnimation = (function(_super) {
	"use strict";
	__extends(OffsetAnimation, _super);
	
	/**
	 * Represents an offset animation for moving active tiles.
	 * @class
	 * @extends Tily.Animation
	 * @memberof Tily
	 * @param {Tily.ActiveTile|Tily.ActiveTileLayer} activeTile The active tile or active tile
	 * layer that this animation belongs to.
	 * @param {vec2} start The starting offset.
	 * @param {vec2} finish The finishing offset.
	 * @param {AnimationOptions} [options] An optional options object for configuring the
	 * animation.
	 */
	function OffsetAnimation(activeTile, start, finish, options) {
		_super.call(this, activeTile, start, finish, options);
	}
	
	/**
	 * Update the animation and set the active tile offset.
	 * @name update
	 * @function
	 * @instance
	 * @memberof Tily.OffsetAnimation
	 * @param {Number} elapsedTime The number of seconds that have elapsed since the last update.
	 */
	OffsetAnimation.prototype.update = function(elapsedTime) {
		const amount = _super.prototype.update.call(this, elapsedTime);
		this.activeTile.offset = vec2(
			this.easeFunction(this.start.x, this.finish.x, amount),
			this.easeFunction(this.start.y, this.finish.y, amount)
		);
	};
	return OffsetAnimation;
}(Tily.Animation));