var Options = require('./StillOptions').Options;
var OptionsConstants = require('./StillOptions').Constants;
var util = require("util");
var EventEmitter = require("events").EventEmitter;
var spawn = require("child_process").spawn;

var COMMAND = 'raspistill';

module.exports.Camera = Camera;

Camera.Options = OptionsConstants;

Camera.DEFAULT_PROFILE = new Options({
	controls: {
		exposure: OptionsConstants.CONTROLS.EXPOSURE.AUTO,
		awb: OptionsConstants.CONTROLS.AWB.AUTO,
		flipVertical: true
	},
	settings: {
		imageType: OptionsConstants.SETTINGS.ENCODING.JPG,
		quality: 75
	}
});

function Camera(opts) {
	this.opts = new Options(opts);
	EventEmitter.call(this);
}

util.inherits(Camera, EventEmitter);

var generateTakePhotoFunction = function(format) {
	var a = function (optionalIdentifier, optionalOpts) {
		var opts = optionalOpts || this.opts;
		var id = optionalIdentifier || Date.now()
		var options = buildOptions(opts, OptionsConstants.SETTINGS.ENCODING[format]);
		takePhoto(id, options, this);
		return id;
	};
	return a;
};

Camera.prototype.takeJPG = generateTakePhotoFunction('JPG');
Camera.prototype.takePNG = generateTakePhotoFunction('PNG');
Camera.prototype.takeBMP = generateTakePhotoFunction('BMP');

Camera.prototype.setFilter = function (filter) {
	this.opts.merge({controls: {filter: filter}});
};

function buildOptions(options, imageType) {
	var cloned = options.clone();
	cloned.merge({settings: {imageType: imageType}});
	return cloned;
}

function takePhoto(id, options, camera) {
	var pid = spawn(COMMAND, ["--output", "-"].concat(options.toArray()));

	var imageData = new Buffer(0);

	pid.stdout.on('data', function (data) {
		imageData = Buffer.concat([imageData, data]);
	});

	pid.on('error', function (err) {
		camera.emit('error', {id: id, error: err});
	});

	pid.on('close', function (code) {
		camera.buildImage(imageData, function (img) {
			camera.emit('snapped', {id: id, image: img});
		});
	});
}


/**
 * allow subclass to construct different kind of image.
 * @param data
 */
Camera.prototype.buildImage = function (data, callback) {
	callback.call(null, data);
};
