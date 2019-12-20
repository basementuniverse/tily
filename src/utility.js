Tily.utility = {
	clamp: function(a, min, max) {
		if (min === undefined) { min = 0; };
		if (max === undefined) { max = 1; };
		return (a < min ? min : (a > max ? max : a));
	},

	lerp: function(a, b, i) {
		return a * (1 - i) + b * i;
	},

	colour: function(c) {
		return `rgba(${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)},${Math.round(c.a * 100) / 100})`;
	},

	outline: function(s) {
		const parts = s.split(' ');
		return {
			width: parseFloat(parts[0]) || 0.1,
			colour: parts[1] || 'transparent'
		};
	},

	shadow: function(s) {
		const parts = s.split(' ');
		return {
			blur: parseFloat(parts[0] || 1),
			xOffset: parseFloat(parts[1] || 0),
			yOffset: parseFloat(parts[2] || 0),
			colour: parts[3]
		};
	}
};
