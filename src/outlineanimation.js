Tily.OutlineAnimation = (function(_super) {
	"use strict";
	__extends(OutlineAnimation, _super);
	
	/**
	 * Represents an outline animation for animating active tile outlines.
	 * @class
	 * @extends Tily.Animation
	 * @memberof Tily
	 * @param {Tily.ActiveTile|Tily.ActiveTileLayer} activeTile The active tile or active tile
	 * layer that this animation belongs to.
	 * @param {vec2} start The starting outline.
	 * @param {vec2} finish The finishing outline.
	 * @param {AnimationOptions} [options] An optional options object for configuring the
	 * animation.
	 */
	function OutlineAnimation(activeTile, start, finish, options) {
		_super.call(this, activeTile, start, finish, options);
	}
	
	/**
	 * Update the animation and set the active tile outline.
	 * @name update
	 * @function
	 * @instance
	 * @memberof Tily.OutlineAnimation
	 * @param {Number} elapsedTime The number of seconds that have elapsed since the last update.
	 */
	OutlineAnimation.prototype.update = function(elapsedTime) {
		const amount = _super.prototype.update.call(this, elapsedTime);
		const start = Tily.utility.outline(this.start);
		start.colour = parseColor(start.colour);
		const finish = Tily.utility.outline(this.finish);
		finish.colour = parseColor(finish.colour);
		const outlineWidth = this.easeFunction(start.width, finish.width, amount);
		const outlineColour = {
			r: this.easeFunction(start.colour.r, finish.colour.r, amount),
			g: this.easeFunction(start.colour.g, finish.colour.g, amount),
			b: this.easeFunction(start.colour.b, finish.colour.b, amount),
			a: this.easeFunction(start.colour.a, finish.colour.a, amount)
		};
		this.activeTile.outline = `${outlineWidth} ${Tily.utility.colour(outlineColour)}`;
	};
	return OutlineAnimation;
}(Tily.Animation));