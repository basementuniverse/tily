Tily.ShadowAnimation = (function(_super) {
	"use strict";
	__extends(ShadowAnimation, _super);
	
	/**
	 * Represents a shadow animation for animating active tile shadows.
	 * @class
	 * @extends Tily.Animation
	 * @memberof Tily
	 * @param {Tily.ActiveTile|Tily.ActiveTileLayer} activeTile The active tile or active tile
	 * layer that this animation belongs to.
	 * @param {vec2} start The starting shadow.
	 * @param {vec2} finish The finishing shadow.
	 * @param {AnimationOptions} [options] An optional options object for configuring the
	 * animation.
	 */
	function ShadowAnimation(activeTile, start, finish, options) {
		_super.call(this, activeTile, start, finish, options);
	}
	
	/**
	 * Update the animation and set the active tile shadow.
	 * @name update
	 * @function
	 * @instance
	 * @memberof Tily.ShadowAnimation
	 * @param {Number} elapsedTime The number of seconds that have elapsed since the last update.
	 */
	ShadowAnimation.prototype.update = function(elapsedTime) {
		const amount = _super.prototype.update.call(this, elapsedTime);
		const start = Tily.utility.shadow(this.start);
		start.colour = parseColor(start.colour);
		const finish = Tily.utility.shadow(this.finish);
		finish.colour = parseColor(finish.colour);
		const shadowBlur = this.easeFunction(start.blur, finish.blur, amount);
		const shadowXOffset = this.easeFunction(start.xOffset, finish.xOffset, amount);
		const shadowYOffset = this.easeFunction(start.yOffset, finish.yOffset, amount);
		const shadowColour = {
			r: this.easeFunction(start.colour.r, finish.colour.r, amount),
			g: this.easeFunction(start.colour.g, finish.colour.g, amount),
			b: this.easeFunction(start.colour.b, finish.colour.b, amount),
			a: this.easeFunction(start.colour.a, finish.colour.a, amount)
		};
		this.activeTile.shadow = `${shadowBlur} ${shadowXOffset} ${shadowYOffset} ${Tily.utility.colour(shadowColour)}`;
	};
	return ShadowAnimation;
}(Tily.Animation));