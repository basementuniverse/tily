Tily.OffsetTransition = (function(_super) {
  "use strict";
  Tily.utility.__extends(OffsetTransition, _super);
  
  /**
   * Represents an offset position transition for moving the buffer camera with a movement 
   * animation.
   * @class
   * @extends Tily.Transition
   * @memberof Tily
   * @param {Tily.utility.vec2} start The starting offset.
   * @param {Tily.utility.vec2} finish The finishing offset.
   * @param {TransitionOptions} [options] An optional options object for configuring the
   * transition.
   */
  function OffsetTransition(start, finish, options) {
    _super.call(this, start, finish, options);
  }
  
  /**
   * Update the transition.
   * @name update
   * @function
   * @instance
   * @memberof Tily.OffsetTransition
   * @param {Number} elapsedTime The number of seconds that have elapsed since the last update.
   * @returns {Number} An interpolated offset value between the start and finish offsets.
   */
  OffsetTransition.prototype.update = function(elapsedTime) {
    this.currentTime += elapsedTime;
    
    // If transition is currently in progress, ease from start to finish value
    if (this.currentTime < this.totalTime) {
      const amount = this.amount;
      return Tily.utility.vec2(
        this.easeFunction(this.start.x, this.finish.x, amount),
        this.easeFunction(this.start.y, this.finish.y, amount)
      );
    }
    
    // Otherwise, transition has finished
    if (this.finishedCallback && !this.finished) {
      this.finishedCallback(this.start, this.finish);
    }
    this.finished = true;
    return this.finish;
  };
  return OffsetTransition;
}(Tily.Transition));
