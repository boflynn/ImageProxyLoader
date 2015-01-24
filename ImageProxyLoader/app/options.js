// Cached DOM elements
var proxyUrlElement = document.getElementById('proxyUrl');
var urlsElement = document.getElementById('urls');
var statusElement = document.getElementById('status');
var onOffSwitchElement = document.getElementById('myonoffswitch');

// Restores options stored in chrome.storage.
function restoreOptions() {
    chrome.storage.sync.get({
        enabled: false,
        proxyUrl: 'http://MyProxy.com?url=$URL',
        urls: 'i.imgur.com\ni.stack.imgur.com'
    }, function (items) {
        onOffSwitchElement.checked = items.enabled;
        proxyUrlElement.value = items.proxyUrl;
        urlsElement.value = items.urls;
    });
}

// Saves options to chrome.storage
function saveOptions() {
    var isValid = true;
    var proxyUrl = proxyUrlElement.value;
    var urls = urlsElement.value;
    var enabled = onOffSwitchElement.checked;

    // Don't bother with validation unless proxy is enabled
    if (enabled) {
        if (proxyUrl.indexOf('$URL') === -1) {
            proxyUrlElement.classList.add('invalid');

            isValid = false;
        } else {
            proxyUrlElement.classList.remove('invalid');
        }

        if (urls.indexOf('/') !== -1) {
            urlsElement.classList.add('invalid');

            isValid = false;
        } else {
            urlsElement.classList.remove('invalid');
        }
    }

    // If no errors, save settings
    if (isValid) {
        chrome.storage.sync.set({
            enabled: enabled,
            proxyUrl: proxyUrl,
            urls: urls
        }, function () {
            statusElement.classList.remove('invalid');
            statusElement.textContent = 'Options saved.';
            setTimeout(function () {
                statusElement.textContent = '';
            }, 2500);

            var bkg = chrome.extension.getBackgroundPage();
            bkg.settings.proxyUrl = proxyUrl;
            bkg.settings.enabled = enabled;
            bkg.settings.urls = urls;
        });
    } else {
        statusElement.classList.add('invalid');
        statusElement.textContent = 'There are errors with your options.';
    }
}

function toggleEnabledDisplay() {
    var enabled = onOffSwitchElement.checked;

    if (!enabled) {
        document.getElementById('options').classList.add('disabled');
    } else {
        document.getElementById('options').classList.remove('disabled');
    }
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
onOffSwitchElement.addEventListener('click', toggleEnabledDisplay);