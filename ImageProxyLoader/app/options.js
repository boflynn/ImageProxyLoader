// Cached DOM elements
var proxyUrlElement = document.getElementById('proxyUrl');
var urlsElement = document.getElementById('urls');
var statusElement = document.getElementById('status');
var enabledElement = document.getElementById('enabled');
var base64EncodeElement = document.getElementById('base64Encode');

// Restores options stored in chrome.storage.
function restoreOptions() {
    chrome.storage.sync.get({
        enabled: false,
        base64Encode: false,
        proxyUrl: 'http://MyProxy.com?url=$URL',
        urls: 'i.imgur.com\ni.stack.imgur.com'
    }, function (items) {
        enabledElement.checked = items.enabled;
        base64EncodeElement.checked = items.base64Encode;
        proxyUrlElement.value = items.proxyUrl;
        urlsElement.value = items.urls;
    });
}

// Saves options to chrome.storage
function saveOptions() {
    var isValid = true;
    var proxyUrl = proxyUrlElement.value;
    var urls = urlsElement.value;
    var enabled = enabledElement.checked;
    var base64Encode = base64EncodeElement.checked;

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
            base64Encode: base64Encode,
            proxyUrl: proxyUrl,
            urls: urls
        }, function () {
            statusElement.classList.remove('invalid');
            statusElement.textContent = 'Options saved.';
            setTimeout(function () {
                statusElement.textContent = '';
            }, 2500);

            var bkg = chrome.extension.getBackgroundPage();
            bkg.settings.enabled = enabled;
            bkg.settings.base64Encode = base64Encode;
            bkg.settings.proxyUrl = proxyUrl;
            bkg.settings.urls = urls;
        });
    } else {
        statusElement.classList.add('invalid');
        statusElement.textContent = 'There are errors with your options.';
    }
}

function toggleEnabledDisplay() {
    var enabled = enabledElement.checked;

    if (!enabled) {
        document.getElementById('options').classList.add('disabled');
    } else {
        document.getElementById('options').classList.remove('disabled');
    }
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
enabledElement.addEventListener('click', toggleEnabledDisplay);