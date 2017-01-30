Tily.Animation = (function(_super) {
	"use strict";
	__extends(Animation, _super);
	
	/**
	 * @typedef AnimationOptions
	 * @type {TransitionOptions}
	 * @property {Boolean} [repeat=false] Whether or not this animation should repeat until stopped
	 * or only play once.
	 * @property {Boolean} [reverse=false] Whether or not the animation should play in reverse, ie.
	 * from finish to start.
	 * @property {Boolean} [alternate=false] Whether or not the animation's direction should
	 * alternate between forward/reverse on each repeat. This is only valid if repeat is set to
	 * true.
	 */
	/**
	 * Default animation options, used as a fall-back for options passed to animation methods.
	 * @type {AnimationOptions}
	 */
	const _defaultAnimationOptions = {
		repeat: false,
		reverse: false,
		alternate: false
	};
	
	/**
	 * Base class for active tile animations.
	 * @class
	 * @extends Tily.Transition
	 * @memberof Tily
	 * @param {Tily.ActiveTile|Tily.ActiveTileLayer} activeTile The active tile or active tile
	 * layer that this animation belongs to.
	 * @param {any} start The starting value.
	 * @param {any} finish The finishing value.
	 * @param {AnimationOptions} [options] An optional options object for configuring the
	 * animation.
	 */
	function Animation(activeTile, start, finish, options) {
		options = {}.extend(_defaultAnimationOptions, options || {});
		_super.call(this, start, finish, options);
		
		/**
		 * The active tile or active tile layer that this animation belongs to.
		 * @type {Tily.ActiveTile|Tily.ActiveTileLayer}
		 */
		this.activeTile = activeTile;
		
		/**
		 * Whether or not this animation should repeat until stopped or only play once.
		 * @type {Boolean}
		 */
		this.repeat = !!options.repeat;
		
		/**
		 * Whether or not this animation should play in reverse.
		 * @type {Boolean}
		 */
		this.reverse = !!options.reverse;
		
		/**
		 * Whether or not this animation's direction should alternate on each repeat.
		 * @type {Boolean}
		 */
		this.alternate = !!options.alternate;
		
		/**
		 * True if this animation is currently running, false if the animation is currently paused.
		 * @default true
		 * @type {Boolean}
		 */
		this.running = true;
	}
	
	/**
	 * Update the animation.
	 * @name update
	 * @function
	 * @instance
	 * @memberof Tily.Animation
	 * @param {Number} elapsedTime The number of seconds that have elapsed since the last update.
	 * @returns {Number} The animation interpolation value between 0 and 1.
	 */
	Animation.prototype.update = function(elapsedTime) {
		if (this.running) {
			this.currentTime += elapsedTime;
		}
		
		// If animation is currently in progress, ease from start to finish or from finish to start
		// if direction is reversed
		if (this.currentTime < this.totalTime) {
			return this.reverse ? 1 - this.amount : this.amount;
		}
		
		// Otherwise, if this is a repeating animation then reset the current animation time
		if (this.repeat) {
			if (this.alternate) {
				this.reverse = !this.reverse;
			}
			this.currentTime = 0;
			return this.reverse ? 1 : 0;
		}
		
		// This is not a repeating animation, so finish the animation
		if (this.finishedCallback && !this.finished) {
			this.finishedCallback(this.start, this.finish);
		}
		this.finished = true;
		return 1;
	};
	return Animation;
}(Tily.Transition));