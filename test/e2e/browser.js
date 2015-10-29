var _browserSingleton;

function Browser() {
	this._browser = {};
}

Browser.prototype.getBrowser = function() {
	return this._browser;
};

Browser.prototype.addCommand = function(func, method) {
	this._browser[method] = function() {
		return func[method].apply(func, [].slice.call(arguments))
	};
};

function getBrowser() {
	if (!_browserSingleton) {
		_browserSingleton = new Browser();
	}

	return _browserSingleton;
}

module.exports = getBrowser();