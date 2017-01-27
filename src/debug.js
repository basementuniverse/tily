/**
 * @module debug
 * @description Display debug information in a draw-loop on a canvas.
 */
var debug = (function() {
	"use strict";
	
	const MARGIN = { top: 10, left: 10 },
		PADDING = 4,
		LINE_HEIGHT = 12,
		FONT = "10pt Lucida Console, monospace",
		TEXT_COLOUR = "white",
		BACKGROUND_COLOUR = "rgba(0, 0, 0, 0.5)",
		MARKER_FONT = "9pt Lucida Console, monospace",
		MARKER_CROSS_SIZE = 6,
		MARKER_CROSS_LINEWIDTH = 2,
		MARKER_LABEL_OFFSET = { x: 12, y: -6 };
	
	var values = {},
		markers = [];
	
	/**
	 * Draw text with a background rectangle.
	 * @param {CanvasRenderingContext2D} context The context to draw text onto.
	 * @param {Number} x The x-coordinate of the position at which to draw the text.
	 * @param {Number} y The y-coordinate of the position at which to draw the text.
	 * @param {String} text The text to draw.
	 * @param {String} font The font to use when drawing the text.
	 * @param {String} colour The text colour.
	 * @param {String} backgroundColour The background rectangle colour.
	 */
	function drawText(context, x, y, text, font, colour, backgroundColour) {
		context.save();
		context.font = font;
		context.textBaseline = "top";
		var bgWidth = context.measureText(text).width + PADDING * 2,
			bgHeight = LINE_HEIGHT + PADDING * 2;
		context.fillStyle = backgroundColour;
		context.fillRect(x - PADDING, y - PADDING, bgWidth, bgHeight);
		context.fillStyle = colour;
		context.fillText(text, x, y);
		context.restore();
	}
	
	/**
	 * Draw a cross at the specified position.
	 * @param {CanvasRenderingContext2D} context The context to draw the cross onto.
	 * @param {Number} x The x-coordinate of the position at which to draw the cross.
	 * @param {Number} y The y-coordinate of the position at which to draw the cross.
	 * @param {String} colour The colour of the cross.
	 */
	function drawCross(context, x, y, colour) {
		var halfCrossSize = Math.floor(MARKER_CROSS_SIZE / 2);
		context.save();
		context.strokeStyle = colour;
		context.lineWidth = MARKER_CROSS_LINEWIDTH;
		context.translate(x, y);
		context.beginPath();
		context.moveTo(-halfCrossSize, -halfCrossSize);
		context.lineTo(halfCrossSize, halfCrossSize);
		context.moveTo(-halfCrossSize, halfCrossSize);
		context.lineTo(halfCrossSize, -halfCrossSize);
		context.stroke();
		context.restore();
	};
	
	return {
		/**
		 * Whether or not debug output is enabled.
		 * @static
		 * @type {Boolean}
		 */
		enabled: true,
		
		/**
		 * @typedef ValueOptions
		 * @type {Object}
		 * @property {Boolean} showName Whether or not the name should be displayed.
		 * @property {Boolean} showValue Whether or not the value should be displayed.
		 * @property {String} font The font to use for this value.
		 * @property {String} colour The text colour for this value.
		 * @property {String} backgroundColour The background colour for this value.
		 */
		/**
		 * Show a labelled text value in the corner of the canvas.
		 * @function
		 * @static
		 * @param {String} name The name to display by the value.
		 * @param {String} value The value to display.
		 * @param {ValueOptions} [options] Optional options for configuring the value.
		 */
		show: function(name, value, options) {
			var data = Object.assign({
				value: value,
				showName: true,
				showValue: true,
				font: FONT,
				colour: TEXT_COLOUR,
				backgroundColour: BACKGROUND_COLOUR
			}, options);
			values[name] = data;
		},
		
		/**
		 * @typedef MarkerOptions
		 * @type {Object}
		 * @property {Boolean} showName Whether or not the name should be displayed.
		 * @property {Boolean} showValue Whether or not the value should be displayed.
		 * @property {Boolean} showMarker Whether or not a marker cross should be displayed.
		 * @property {Number} size The size of the marker cross.
		 * @property {String} font The font to use for this marker.
		 * @property {String} colour The text and cross colour for this marker.
		 * @property {String} backgroundColour The background colour for this value.
		 * @property {Boolean} persistent Whether or not the marker should be removed once it has
		 * been drawn once. Set this to true if you want to create a marker in one frame and have
		 * it stay visible until this property is set to false.
		 */
		/**
		 * Show a value with an optional marker at the specified position on the canvas. This uses
		 * the current canvas transform, so that markers can be displayed at the camera position.
		 * If the marker has a name, it can be overwritten/updated by calling the method again
		 * using the same name.
		 * @function
		 * @static
		 * @param {Number} x The x-coordinate of the position to display this marker.
		 * @param {Number} y The y-coordinate of the position to display this marker.
		 * @param {String} [name=""] The name to display by the value.
		 * @param {String} [value=""] The value to display.
		 * @param {MarkerOptions} [options] Optional options for configuring the marker.
		 */
		marker: function(x, y, name, value, options) {
			var data = Object.assign({
				position: { x: x, y: y },
				name: name || "",
				value: value || "",
				showName: true,
				showValue: true,
				showMarker: true,
				size: MARKER_CROSS_SIZE,
				font: MARKER_FONT,
				colour: TEXT_COLOUR,
				backgroundColour: BACKGROUND_COLOUR,
				persistent: false
			}, options);
			if (name) {
				for (var i = 0, length = markers.length; i < length; i++) {
					if (markers[i].name == name) {
						markers[i] = data;
						return;
					}
				}
			}
			markers.push(data);
		},
		
		/**
		 * Draw values and markers onto the specified context.
		 * @function
		 * @static
		 * @param {CanvasRenderingContext2D} context The context to draw values and markers onto.
		 */
		draw: function(context) {
			if (this.enabled) {
				// Draw markers at their set positions in world space
				for (var i = 0, length = markers.length; i < length; i++) {
					name = (markers[i].showName && markers[i].name) ? markers[i].name + ": " : "";
					value = markers[i].showValue ? markers[i].value : "";
					context.save();
					context.translate(markers[i].position.x, markers[i].position.y);
					if (markers[i].showMarker) {
						drawCross(context, 0, 0, markers[i].colour);
					}
					if (markers[i].shownName || markers[i].showValue) {
						drawText(
							context,
							MARKER_LABEL_OFFSET.x,
							MARKER_LABEL_OFFSET.y,
							name + value,
							markers[i].font,
							markers[i].colour,
							markers[i].backgroundColour
						);
					}
					context.restore();
				}
				
				// Draw values in the corner of the screen
				context.save();
				context.setTransform(1, 0, 0, 1, 0, 0);
				var y = MARGIN.top,
					name = "",
					value = "";
				for (var i in values) {
					if (!values.hasOwnProperty(i)) { continue; }
					if (!values[i].showName && !values[i].showValue) { continue; }
					name = values[i].showName ? i + ": " : "";
					value = values[i].showValue ? values[i].value : "";
					drawText(
						context,
						MARGIN.left,
						y,
						name + value,
						values[i].font,
						values[i].colour,
						values[i].backgroundColour
					);
					y += (LINE_HEIGHT + PADDING * 2);
				}
				context.restore();
			}
			
			// Reset values and markers ready for next frame
			values = {};
			markers = markers.filter(i => i.persistent);
		}
	};
}());