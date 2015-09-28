define(function (require) {
    'use strict';

    require('./controllers/creativesHeader');
    require('./controllers/creativesList');
    require('./controllers/newEditCreative');
    require('./directives/creativeThumbnails');
    require('./directives/creativeOptions');
    require('./services/creatives');
    require('./services/studioDirectAdapter');
    require('./services/newEditModalTranslation');
    require('./services/newCreative');
    require('./services/creative');
});
