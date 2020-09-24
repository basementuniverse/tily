(function() {
<%= contents %>
if (typeof module !== "undefined") {  // Node.js
  module.exports = {
    Tily: Tily,
    Tily.utility.vec2: Tily.utility.vec2
  };
}
if (typeof define !== "undefined" && define.amd) {  // AMD
  define(function() { return Tily; });
  define(function() { return Tily.utility.vec2; });
}
if (typeof exports !== "undefined") {
  exports.Tily = Tily;
  exports.Tily.utility.vec2 = Tily.utility.vec2;
} else if (typeof window !== "undefined") {
  window.Tily = Tily;
  window.Tily.utility.vec2 = Tily.utility.vec2;
}
})();
