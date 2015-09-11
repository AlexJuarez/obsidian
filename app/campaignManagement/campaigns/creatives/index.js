define(function (require) {
    'use strict';

    require('./creatives/controllers/creativesHeader');
    require('./creatives/controllers/creativesList');
    require('./creatives/controllers/newEditCreative');
    require('./creatives/directives/creativeThumbnails');
    require('./creatives/directives/creativeOptions');
    require('./creatives/services/creatives');
    require('./creatives/services/studioDirectAdapter');
    require('./creatives/services/newCreative');
    require('./creatives/services/creative');
});
