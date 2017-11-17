/**
 * Listens for the app launching, then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function (launchData) {
  chrome.app.window.create(
    'index.html',
    {
      id: 'mainWindow',
      bounds: { width: 800, height: 600 }
    }
  );
});

var updateBatteryStatus = function () {
  navigator.getBattery().then(function (battery) {
    var status = {};
    status.level = ""+battery.level*100;
    status.dischargingTime = ""+battery.dischargingTime;
    status.charging = ""+battery.charging;
    status.chargingTime = ""+battery.chargingTime;
    console.log(status);
    var item = {};
    item[new Date().toLocaleString()] = status;
    chrome.storage.local.set(item,function(){
      var e = chrome.runtime.lastError;
    });

    // chrome.notifications.create('reminder', {
    //   type: 'list',
    //   iconUrl: 'assets/battery_icon.png',
    //   title: 'Battery Monitor',
    //   message: "Main",
    //   items:[
    //     {title:"剩余电量",message:""+status.level},
    //     {title:"可用时长",message:""+status.dischargingTime},
    //     {title:"正在充电",message:""+status.charging},
    //     {title:"充满需时",message:""+status.chargingTime}
    //   ]
    // });

  });
};

chrome.alarms.create('battery', {
  when: Date.now() + 1000,
  periodInMinutes: 1
});

chrome.alarms.onAlarm.addListener(updateBatteryStatus);