var trackURL = document.URL;
if (trackURL.indexOf("?") != -1) {
    trackURL += "&async=true";
} else {
    trackURL += "?async=true";
}
var _elqQ = _elqQ || [];

var elqSiteID = '1795';

//Set up environment
if (!location.hostname) {
    location.hostname = window.location.host;
}

var host = location.hostname;

var isSandbox = (host.search('localhost') > -1 || host.search('redhat.dev') > -1 || host.search('qa.engage.redhat.com') > -1 || host.search('.usersys.redhat.com') > -1 || host.search('.devlab.redhat.com') > -1 || host.search('.rhcloud.com') > -1);

if (isSandbox) {
    elqSiteID = '711611696';
}

_elqQ.push(['elqSetSiteId', elqSiteID]);

_elqQ.push(['elqTrackPageView', trackURL]);

(function () {
    function async_load() {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = '//img.en25.com/i/elqCfg.min.js';
        //s.src = '/forms/scripts/vendor/elq/elqCfg.min.js';
        var x = document.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
    }
    if (window.addEventListener) {
        window.addEventListener('DOMContentLoaded', async_load, false);
    } else if (window.attachEvent) {
        window.attachEvent('onload', async_load);
    }
})();
