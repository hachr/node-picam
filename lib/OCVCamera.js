var Camera = require("./Camera").Camera;
var util = require("util");
var cv = require('opencv');

function OCVCamera(opts) {
	Camera.call(this, opts);
}

util.inherits(OCVCamera, Camera);


OCVCamera.prototype.buildImage = function (data, callback) {
	cv.readImage(data, function (err, img) {
		callback.call(null, img);
	});
};

module.exports.OCVCamera = OCVCamera;
module.exports.OCVCamera.Options = Camera.Options;
