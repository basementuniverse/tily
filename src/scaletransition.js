Tily.ScaleTransition = (function(_super) {
	"use strict";
	__extends(ScaleTransition, _super);
	
	/**
	 * Represents a scale transition for zooming a buffer in/out with a zoom animation.
	 * @class
	 * @extends Tily.Transition
	 * @memberof Tily
	 * @param {Number} start The starting scale.
	 * @param {Number} finish The finishing scale.
	 * @param {TransitionOptions} [options] An optional options object for configuring the
	 * transition.
	 */
	function ScaleTransition(start, finish, options) {
		_super.call(this, start, finish, options);
	}
	
	/**
	 * Update the transition.
	 * @name update
	 * @function
	 * @instance
	 * @memberof Tily.ScaleTransition
	 * @param {Number} elapsedTime The number of seconds that have elapsed since the last update.
	 * @returns {Number} An interpolated scale value between the start and finish scales.
	 */
	ScaleTransition.prototype.update = function(elapsedTime) {
		return _super.prototype.update.call(this, elapsedTime);
	};
	return ScaleTransition;
}(Tily.Transition));