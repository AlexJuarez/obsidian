define(function (require) {
    'use strict';

    require('./controllers/creativesHeader');
    require('./controllers/creativesList');
    require('./controllers/newEditCreative');
    require('./controllers/creativesCtrl');
    require('./directives/creativeThumbnails');
    require('./directives/creativeOptions');
    require('./services/creatives');
    require('./services/studio/studioCreativeAdapter');
    require('./services/studio/urlBuilder/index');
    require('./services/newCreative');
    require('./services/creative');
});
