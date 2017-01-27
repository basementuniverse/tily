Tily.RotationAnimation = (function(_super) {
	"use strict";
	__extends(RotationAnimation, _super);
	
	/**
	 * Represents a rotation animation for rotating active tiles.
	 * @class
	 * @extends Tily.Animation
	 * @memberof Tily
	 * @param {Tily.ActiveTile|Tily.ActiveTileLayer} activeTile The active tile or active tile
	 * layer that this animation belongs to.
	 * @param {} start The starting angle in radians.
	 * @param {} finish The finishing angle in radians.
	 * @param {RotationAnimationOptions} [options] An optional options object for configuring the
	 * animation.
	 */
	function RotationAnimation(activeTile, start, finish, options) {
		/**
		 * The rotation direction. This should be 'cw' for clockwise, 'ccw' for counter-clockwise.
		 * If this is not 'cw' or 'ccw', the rotation will be in the direction of the smallest
		 * change in angle.
		 * @type {String}
		 */
		this.direction = options.direction;
		
		// Set up the actual start and finish values based on the direction, or if no valid
		// direction is specified then calculate one from the start and finish angles
		if (this.direction == "cw") {
			while (start >= finish) { finish += Math.PI * 2; }	// Make sure start < finish
		} else if (this.direction == "ccw") {
			while (start <= finish) { start += Math.PI * 2; }	// Make sure start > finish
		} else {
			const mod = (a, b) => a - Math.floor(a / b) * b,
				tau = Math.PI * 2;
			var a = finish - start;
			a = mod(a + Math.PI, tau) - Math.PI;	// Get the signed difference between angles
			start = mod(start, tau);
			finish = start + a;
		}
		_super.call(this, activeTile, start, finish, options);
	}
	
	/**
	 * Update the animation.
	 * @name update
	 * @function
	 * @instance
	 * @memberof Tily.RotationAnimation
	 * @param {Number} elapsedTime The number of seconds that have elapsed since the last update.
	 * @returns {Number} 
	 */
	RotationAnimation.prototype.update = function(elapsedTime) {
		const amount = _super.prototype.update.call(this, elapsedTime);
		this.activeTile.rotation = this.easeFunction(this.start, this.finish, amount);
	};
	return RotationAnimation;
}(Tily.Animation));