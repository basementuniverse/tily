(function() {
<%= contents %>
if (typeof module !== "undefined") {  // Node.js
  module.exports = Tily;
}
if (typeof define !== "undefined" && define.amd) {  // AMD
  define(function() { return Tily; });
}
if (typeof exports !== "undefined") {
  exports.Tily = Tily;
} else if (typeof window !== "undefined") {
  window.Tily = Tily;
}
})();
