define(function (require) {
    'use strict';

    require('./directives/modalWindow');
    require('./directives/modalAnimationClass');
    require('./directives/modalBackdrop');
    require('./directives/modalTransclude');
    require('./factories/modalStack');
    require('./factories/stackedMap');
    require('./providers/modal');
});
