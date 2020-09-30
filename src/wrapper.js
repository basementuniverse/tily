(function() {
<%= contents %>
if (typeof module !== "undefined") {
  module.exports = Tily;
}
if (typeof window !== "undefined") {
  window.Tily = Tily;
}
})();
