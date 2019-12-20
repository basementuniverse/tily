// sudo gulp

const gulp = require("gulp");
const concat = require("gulp-concat");
const wrap = require("gulp-wrap");
const jsmin = require("gulp-jsmin");

const paths = [
	"src/vec2.js",
	"src/parsecolor.js",
	"src/extends.js",
	"src/tily.js",
	"src/utility.js",
	"src/main.js",
	"src/transition.js",
	"src/buffertransition.js",
	"src/offsettransition.js",
	"src/scaletransition.js",
	"src/bufferbase.js",
	"src/buffer.js",
	"src/cellbuffer.js",
	"src/cell.js",
	"src/tilelayer.js",
	"src/activetilebase.js",
	"src/activetile.js",
	"src/activetilelayer.js",
	"src/animation.js",
	"src/offsetanimation.js",
	"src/scaleanimation.js",
	"src/foregroundanimation.js",
	"src/opacityanimation.js",
	"src/rotationanimation.js",
	"src/textanimation.js",
	"src/outlineanimation.js",
	"src/shadowanimation.js"
];

function scripts() {
	return gulp.src(paths)
	.pipe(concat("tily.min.js"))
	.pipe(wrap({ src: "src/wrapper.js" }))
	.pipe(jsmin())
	.pipe(gulp.dest("."));
}

exports.default = gulp.series(scripts);
