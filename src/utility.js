Tily.utility = {
	clamp: function(a, min, max) {
		if (min === undefined) { min = 0; };
		if (max === undefined) { max = 1; };
		return (a < min ? min : (a > max ? max : a));
	},

	lerp: function(a, b, i) {
		return a * (1 - i) + b * i;
	}
};
