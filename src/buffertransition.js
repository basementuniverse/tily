	
Tily.BufferTransition = (function(_super) {
	"use strict";
	__extends(BufferTransition, _super);
	
	/**
	 * Represents a buffer transition for fading from one buffer to another.
	 * @class
	 * @extends Tily.Transition
	 * @memberof Tily
	 * @param {Tily.Buffer} start The starting buffer.
	 * @param {Tily.Buffer} finish The finishing buffer.
	 * @param {TransitionOptions} [options] An optional options object for configuring the
	 * transition.
	 */
	function BufferTransition(start, finish, options) {
		_super.call(this, start, finish, options);
	}
	
	/**
	 * Update the transition.
	 * @name update
	 * @function
	 * @instance
	 * @memberof Tily.BufferTransition
	 * @param {Number} elapsedTime The number of seconds that have elapsed since the last update.
	 * @returns {Number} An interpolated alpha value between 0 and 1.
	 */
	BufferTransition.prototype.update = function(elapsedTime) {
		this.currentTime += elapsedTime;
		
		// If transition is currently in progress, ease from start to finish value
		if (this.currentTime < this.totalTime) {
			return this.easeFunction(0, 1, this.amount);
		}
		
		// Otherwise, transition has finished
		if (this.finishedCallback && !this.finished) {
			this.finishedCallback(this.start, this.finish);
		}
		this.finished = true;
		return 1;
	};
	return BufferTransition;
}(Tily.Transition));