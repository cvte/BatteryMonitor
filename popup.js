var updateBatteryStatus = function () {

    navigator.getBattery().then(function (battery) {
        document.querySelector('#time').innerText = new Date().toLocaleString();
        document.querySelector('#level').innerText = battery.level * 100;
        document.querySelector('#dischargingTime').innerText = battery.dischargingTime;
        document.querySelector('#charging').innerText = battery.charging;
        document.querySelector('#chargingTime').innerText = battery.chargingTime;
    });
    chrome.storage.local.get(null, function (items) {
        document.querySelector('#history').innerHTML = "";
        for (var key in items) {
            document.querySelector('#history').innerHTML += `<li>${key}:${JSON.stringify(items[key])}</li>`;
        }
    });
};

var errorHandler = function (message) {
    alert(message);
};
var index = 0;
window.onload = function () {
    document.querySelector('#exportBtn').onclick = function () {
        chrome.fileSystem.chooseEntry({ type: 'saveFile' }, function (writableFileEntry) {
            writableFileEntry.createWriter(function (writer) {
                writer.onerror = errorHandler;
                writer.onwriteend = function (e) {
                    console.log('write complete');
                };
                chrome.storage.local.get(null, function (items) {
                    writer.write(new Blob([JSON.stringify(items)]), { type: 'text/plain' });
                });
            }, errorHandler);
        });
    };
    document.querySelector('#clearBtn').onclick = function () {
        index++;
        if (index%2==0) {
            chrome.storage.local.clear();
            updateBatteryStatus();
        }
    };
    updateBatteryStatus();
};

chrome.alarms.onAlarm.addListener(updateBatteryStatus);
