define(function (require) {
    'use strict';

    require('./controllers/creativesHeader');
    require('./controllers/creativesList');
    require('./controllers/newEditCreative');
    require('./controllers/creativesCtrl');
    require('./directives/creativeThumbnails');
    require('./directives/creativeOptions');
    require('./services/creatives');
    require('./services/studio/urlBuilder/index');
    require('./services/studio/studioWindow');
    require('./services/newCreative');
    require('./services/openCreative');
    require('./services/creative');
});
