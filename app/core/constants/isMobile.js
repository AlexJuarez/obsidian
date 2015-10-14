define(function(require) {
    'use strict';

    var module = require('./../module');

    module.constant('IS_MOBILE', isMobile());

    function isMobile() {
        try{ document.createEvent('TouchEvent'); return true; }
        catch(e){ return false; }
    }
});
