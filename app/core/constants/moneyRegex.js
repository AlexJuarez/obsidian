define(function (require) {
	'use strict';

	var module = require('./../module');

	module.constant('MONEY_REGEX', new RegExp('^\\d+((\\.|\\,)\\d{2})?$'));
});
