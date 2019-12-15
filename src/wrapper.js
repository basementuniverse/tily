(function() {
<%= contents %>
if (typeof module !== "undefined") {	// Node.js
	module.exports = {
		Tily: Tily,
		vec2: vec2
	};
}
if (typeof define !== "undefined" && define.amd) {	// AMD
	define(function() { return Tily; });
	define(function() { return vec2; });
}
if (typeof exports !== "undefined") {
	exports.Tily = Tily;
	exports.vec2 = vec2;
} else if (typeof window !== "undefined") {
	window.Tily = Tily;
	window.vec2 = vec2;
}
})();