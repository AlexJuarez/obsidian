/**
 * Register functions that will need to be added to the browser object in
 * wdio.conf, but don't have access to that object yet.
 */

var _browserSingleton;

function Browser() {
	this._browser = {};
}

/**
 * Set registered functions on a browser object
 *
 * @param browser
 */
Browser.prototype.setBrowser = function(browser) {
	for(var key in this._browser) {
		if (this._browser.hasOwnProperty(key)) {
			browser.addCommand(key, this._browser[key]);
		}
	}
};

/**
 * Register a function to be placed on the browser using setBrowser
 *
 * @param func
 * @param method
 */
Browser.prototype.addCommand = function(func, method) {
	console.log('Adding command ' + method + ' to browser...');

	// Return a function that wraps the apply call
	this._browser[method] = function() {
		return func[method].apply(func, [].slice.call(arguments))
	};
};

/**
 * Register all methods on a function's prototype to be placed on the browser
 * using setBrowser
 *
 * @param func
 * @param varArgs 1-to-many arguments
 */
Browser.prototype.addCommands = function(func, varArgs) {
	var prototypes = Object.getOwnPropertyNames(func.prototype);
	var that = this;

	// Bind additional arguments of this function to the provided function,
	// and instantiate a new instance of that function
	var closure = new (func.bind.apply(func, [].slice.call(arguments)));

	prototypes.forEach(function(method) {

		// Skip the constructor that lives in each prototype
		if (method !== 'constructor') {
			that.addCommand(closure, method);
		}
	});
};

function getBrowser() {
	if (!_browserSingleton) {
		_browserSingleton = new Browser();
	}

	return _browserSingleton;
}

module.exports = getBrowser();