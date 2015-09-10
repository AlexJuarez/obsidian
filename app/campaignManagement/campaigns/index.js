define(function (require) {
    'use strict';

    services();
    controllers();
    directives();
    factories();
    filters();

    function services() {
        require('./services/campaignCache');
        require('./services/campaignsByAccount');
        require('./services/campaignsByStatus');
        require('./services/campaignsFilter');
        require('./services/campaignsHeader');
        require('./services/campaignModal');
        require('./services/campaignDetails');
    }

    function controllers() {
        require('./controllers/newEditCampaign');
        require('./controllers/campaigns');
        require('./controllers/campaign');
        require('./controllers/analyticsPreview');
    }

    function directives() {
        require('./directives/campaignDetails');
        require('./directives/campaignsByAccount');
        require('./directives/campaignsByStatus');
    }

    function factories() {
        require('./factories/campaignsByStatusAccordionTable');
    }

    function filters() {
        require('./filters/campaignStatus');
    }

    require('./placements/controllers/placementsList');
    require('./placements/controllers/placementsHeader');
    require('./placements/controllers/newEditPlacement');
    require('./placements/directives/placementOptions');
    require('./placements/directives/expandAnchorsDirections');
    require('./placements/services/placements');
    require('./placements/services/placementsByPublisher');
    require('./placements/services/placementsByCreative');
    require('./placements/services/placementsByAdType');

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
