var trackURL = document.URL;
if (trackURL.indexOf("?") != -1) {
	trackURL += "&async=true";
}
else {
	trackURL += "?async=true";
}
var _elqQ = _elqQ || [];


var elqSiteID;

switch (location.hostname) {
//LOCAL DEVELOPMENT
case 'localhost':
/* falls through */
case '127.0.0.1':
/* falls through */
case 'redhat.local':
    /* falls through */
case 'cms-300.usersys.redhat.com':
    elqSiteID = '1798';
    break;

//STAGING
case 'stage.redhat.com':
/* falls through */
case 'redhat.stage':
    elqSiteID = '1795';
    break;

//PRODUCTION
case 'redhat.prod':
/* falls through */
default:
    elqSiteID = '1795';
    break;
}

_elqQ.push(['elqSetSiteId', elqSiteID]);

_elqQ.push(['elqTrackPageView', trackURL]);

(function () {
	function async_load() {
        var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true;
        s.src = '//img.en25.com/i/elqCfg.min.js';
        //s.src = '/forms/scripts/vendor/elq/elqCfg.min.js';
        var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x);
    }
    if (window.addEventListener) window.addEventListener('DOMContentLoaded', async_load, false);
    else if (window.attachEvent) window.attachEvent('onload', async_load);
})();
