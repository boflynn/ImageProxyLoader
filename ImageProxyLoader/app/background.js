// Backers to setters and getters
var _proxyUrl = '';
var _urls = '';
var _enabled = false;

// Constants
var _domainRegEx = /(.[^:]+):\/\/(.[^/]+)/;
var _listenerFilters = {
    urls: [
        '*://*/*'
    ],
    types: ['image']
};
var _extraInfoSpec = ['blocking'];

// Global settings object
var settings = {
    get proxyUrl() { return _proxyUrl; },
    set proxyUrl(val) { _proxyUrl = val; },
    get urls() { return _urls; },
    set urls(val) {
        if (val) {
            _urls = val.split('\n');
        } else {
            _urls = '';
        }
    },
    get enabled() { return _enabled; },
    set enabled(val) {
        _enabled = val;

        // Icons small tweak from http://www.iconshock.com/android-icons/
        var imgUrl = _enabled ? 'on38.png' : 'off38.png';
        chrome.browserAction.setIcon({ path: 'img/' + imgUrl });

        var hasListener = chrome.webRequest.onBeforeRequest.hasListener(getRedirectInformation);

        if (_enabled && !hasListener) {
            addListener();
        }
        else if (!_enabled && hasListener) {
            removeListener();
        }
    }
};

function loadSettingsFromChromeStorage() {
    chrome.storage.sync.get({
        enabled: false,
        proxyUrl: '',
        urls: ''
    }, function (items) {
        settings.proxyUrl = items.proxyUrl;
        settings.enabled = items.enabled;
        settings.urls = items.urls;
    });
}

function addListener() {
    chrome.webRequest.onBeforeRequest.addListener(getRedirectInformation, _listenerFilters, _extraInfoSpec);
}

function removeListener() {
    chrome.webRequest.onBeforeRequest.removeListener(getRedirectInformation);
}

function getRedirectInformation(info) {
    if (!(settings.enabled && settings.proxyUrl && settings.urls)) {
        return;
    }

    var originalUrl = info.url;
    var domain = originalUrl.match(_domainRegEx)[2];

    var isRedirectedDomain = contains(settings.urls, domain);

    if (isRedirectedDomain) {
        var newUrl = settings.proxyUrl.replace('$URL', originalUrl);

        return {
            redirectUrl: newUrl
        };
    }

    return;
}

function contains(array, itemToFind) {
    var i = array.length;
    while (i--) {
        if (array[i] === itemToFind) {
            return true;
        }
    }
    return false;
}

loadSettingsFromChromeStorage();
addListener();