var _browserSingleton;

function Browser() {
	this._browser = {};
}

Browser.prototype.getBrowser = function() {
	return this._browser;
};

Browser.prototype.addCommand = function(key, func) {
	this._browser[key] = func;
};

Browser.prototype.addCommands = function(pageObject) {
	var argArray = [].slice.call(arguments);
	argArray = argArray.slice(1);

	var newPageObject = new (Function.prototype.bind.apply(pageObject, argArray));

	var prototypeArray = Object.getOwnPropertyNames(pageObject.prototype);
	var that = this;

	prototypeArray.forEach(function(key) {
		if (!that._browser[key]) {
			console.log(key);
			that.addCommand(key, newPageObject[key]);
			console.log(that._browser);
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