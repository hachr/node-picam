var lodash = require('lodash');

var CONSTANTS = {
	PREVIEW: {
		NONE: 'none',
		FULLSCREEN: 'fullscreen'
	},
	CONTROLS: {
		EXPOSURE: {
			OFF: 'off',
			AUTO: 'auto',
			NIGHT: 'night',
			NIGHTPREVIEW: 'nightpreview',
			BACKLIGHT: 'backlight',
			SPOTLIGHT: 'spotlight',
			SPORTS: 'sports',
			SNOW: 'snow',
			BEACH: 'beach',
			VERYLONG: 'verylong',
			FIXEDFPS: 'fixedfps',
			ANTISHAKE: 'antishake',
			FIREWORKS: 'fireworks'
		},
		AWB: {
			OFF: 'off',
			AUTO: 'auto',
			SUN: 'sun',
			CLOUD: 'cloud',
			SHADE: 'shade',
			TUNGSTEN: 'tungsten',
			FLORESCENT: 'florescent',
			INCANDESCENT: 'incandescent',
			FLASH: 'flash',
			HORIZON: 'horizon'
		},
		FILTER: {
			NONE: 'none',
			NEGATIVE: 'negative',
			SOLARISE: 'solarise',
			POSTERIZE: 'posterize',
			WHITEBOARD: 'whiteboard',
			BLACKBOARD: 'blackboard',
			SKETCH: 'sketch',
			DENOISE: 'denoise',
			EMBOSS: 'emboss',
			OILPANT: 'oilpaint',
			HATCH: 'hatch',
			OPEN: 'gpen',
			PASTEL: 'pastel',
			WATERCOLOR: 'watercolour',
			FILM: 'film',
			BLUR: 'blur',
			SATURATION: 'saturation',
			COLORSWAP: 'colourswap',
			WASHEDOUT: 'washedout',
			POSTERISE: 'posterise',
			COLOURPOINT: 'colourpoint',
			COLOURBALANCE: 'colourbalance',
			CARTOON: 'cartoon'
		},
		METERING: {
			AVERAGE: 'average',
			SPOT: 'spot',
			BACKLIT: 'backlit',
			MATRIX: 'matrix'
		}
	},
	SETTINGS: {
		ENCODING: {
			JPG: 'jpg',
			BMP: 'bmp',
			GIF: 'gif',
			PNG: 'png'
		}
	}
}

module.exports.Constants = CONSTANTS;
module.exports.Options = Options;

function Options(opts) {
	if (opts instanceof Options) {
		this.opts = opts.opts;
	} else {
		this.opts = opts;
	}
}

/**
 * modify internal data
 * @param json
 */
Options.prototype.merge = function (json) {
	lodash.merge(this.opts, json);
};

/**
 * clone
 * @param json
 */
Options.prototype.clone = function () {
	return new Options(lodash.clone(this.opts,true));
};


Options.prototype.toArray = function () {
	var opts = this.opts;
	var result = [];

	if (isDefined(opts.preview) && opts.preview.length == 1) {
		var val = opts.preview[0];
		var previewFlag = options.PREVIEW[val];
		if (val == "none") {
			result.push("--nopreview");
		} else if (val == "fullscreen") {
			result.push("--fullscreen");
		} else if (!previewFlag) {
			result.push(val);
			//TODO: [medium] (nhat) - validate the x,y,w,h string
		}
	}

	if (!isDefined(opts.controls)) {
		return result;
	}

	if (isDefined(opts.controls.sharpness)) {
		result.push("--sharpness");
		result.push(opts.controls.sharpness);
	}

	if (isDefined(opts.controls.contrast)) {
		result.push("--contrast");
		result.push(opts.controls.contrast);
	}

	if (isDefined(opts.controls.brightness)) {
		result.push("--brightness");
		result.push(opts.controls.brightness);
	}

	if (isDefined(opts.controls.saturation)) {
		result.push("--saturation");
		result.push(opts.controls.saturation);
	}

	if (isDefined(opts.controls.saturation)) {
		result.push("--saturation");
		result.push(opts.controls.saturation);
	}

	if (isDefined(opts.controls.iso) && !!opts.controls.iso) {
		result.push("--ISO");
	}

	if (isDefined(opts.controls.vstab) && !!opts.controls.vstab) {
		result.push("--vstab");
	}

	if (isDefined(opts.controls.ev) && !!opts.controls.ev) {
		result.push("--ev");
	}

	if (isDefined(opts.controls.exposure)) {
		result.push("--exposure");
		result.push(opts.controls.exposure);
	}

	if (isDefined(opts.controls.awb)) {
		result.push("--awb");
		result.push(opts.controls.awb);
	}

	if (isDefined(opts.controls.filter)) {
		result.push("--imxfx");
		result.push(opts.controls.filter);
	}

	if (isDefined(opts.controls.colorControl)) {
		result.push("--colfx");
		result.push(opts.controls.colorControl);
		//TODO: [medium] (nhat) - check for format U:V (0-255)
	}

	if (isDefined(opts.controls.flipVertical) && !!opts.controls.flipVertical) {
		result.push("--vflip");
	}

	if (isDefined(opts.controls.flipHorizontal) && !!opts.controls.flipHorizontal) {
		result.push("--hflip");
	}

	if (isDefined(opts.controls.rotation)) {
		result.push("--rotation");
		result.push(opts.controls.rotation);
	}

	if (isDefined(opts.controls.metering)) {
		result.push("--metering");
		result.push(opts.controls.metering);
	}

	if (!isDefined(opts.settings)) {
		return result;
	}

	if (isDefined(opts.settings.quality)) {
		result.push("--quality");
		result.push(opts.settings.quality);
	}

	if (isDefined(opts.settings.width)) {
		result.push("--width");
		result.push(opts.settings.width);
	}

	if (isDefined(opts.settings.height)) {
		result.push("--height");
		result.push(opts.settings.height);
	}

	if (isDefined(opts.settings.raw) && !!opts.settings.raw) {
		result.push("--raw");
	}

	if (isDefined(opts.settings.timeout)) {
		result.push("--timeout");
		result.push(opts.settings.timeout);
	}

	if (isDefined(opts.settings.imageType)) {
		result.push("--encoding");
		result.push(opts.settings.imageType);
	}

	//TODO: [medium] (nhat) - add timelapse


	return result;
};

Options.prototype.toString = function () {
	return this.toArray().join(" ");
}


function isDefined(val) {
	return typeof(val) != "undefined";
}


/*

 */
function assign(obj, keyPath, value) {
	var lastKeyIndex = keyPath.length - 1;
	for (var i = 0; i < lastKeyIndex; ++i) {
		var key = keyPath[i];
		if (!(key in obj))
			obj[key] = {}
		obj = obj[key];
	}
	obj[keyPath[lastKeyIndex]] = value;
}
