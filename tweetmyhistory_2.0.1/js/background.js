var $timeOut;

chrome.storage.sync.get("tweetmyhistory_autoMode", result => {
    all({ "tweetmyhistory_autoMode": result})
});

chrome.storage.onChanged.addListener(changes => all(changes) );

function all(changes) {
    if (changes.tweetmyhistory_autoMode) {
        chrome.storage.sync.get("tweetmyhistory_autoMode", result => {

            function attemptTweet() {

                go().then(items => {
                    var $data = items,
                        $filteredData = [];

                    $filteredData = $data.filter(item => { if ((new URL(item.url)).host == 'www.google.com' && (new URL(item.url)).searchParams.get('q')) return item })

                    const $historyItem = $filteredData[Math.floor((Math.random() * $filteredData.length))],
                        $searchTime = new Date($historyItem.lastVisitTime),
                        $tweetText = `On ${$searchTime.getDate()}/${$searchTime.getMonth()}/${$searchTime.getFullYear()} I searched for "${(new URL($historyItem.url)).searchParams.get('q')}" on Google`;

                    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, tabs => {
                        var $tabID = tabs[0].index;
                        chrome.tabs.create({ url: `https://twitter.com/intent/tweet?text=${$tweetText.replace(" ", "%20").replace("#", "%23")}%20@ryncmrfrd%20%23tweetmyhistory` }, tab => {
                            var $newTabID = tab.id;
                            chrome.tabs.highlight({ tabs: [$tabID] }, () => {
                                $tabID = null;
                                var listener = chrome.tabs.onUpdated.addListener((tabId, info) => {

                                    if (info.status === 'complete' && tabId === $newTabID) {

                                        chrome.tabs.onUpdated.removeListener(listener);

                                        chrome.tabs.executeScript($newTabID, { code: "document.body.style.filter='blur(5px)'; document.querySelector('.button.selected.submit').click();" }, () => {
                                            chrome.tabs.onUpdated.addListener(() => {
                                                if (info.status === 'complete' && tabId === $newTabID) {
                                                    chrome.tabs.remove($newTabID);
                                                    $newTabID = null;
                                                }
                                            });
                                        });

                                    }

                                });
                            })
                        });
                    });

                });

                $timeOut = setTimeout(attemptTweet, 60000);
            }

            if (result.tweetmyhistory_autoMode) $timeOut = setTimeout(attemptTweet, 10000);
            else clearTimeout($timeOut);

        });
    }
}

function go() {
    return new Promise((resolve) => {
        getMoreHistory().then(cnt => {
            if (cnt.newCount > 0) go()
            else console.log("All history data:", cnt.items); resolve(cnt.items)
        });
    });
}

var nextEndTimeToUse = 0,
    allItems = [],
    itemIdToIndex = {};

function getMoreHistory() {
    return new Promise((resolve) => {
        var params = { text: "", maxResults: 500 };
        params.startTime = 0;
        if (nextEndTimeToUse > 0) params.endTime = nextEndTimeToUse;

        chrome.history.search(params, function (items) {
            var newCount = 0;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.id in itemIdToIndex) continue;
                newCount += 1;
                allItems.push(item);
                itemIdToIndex[item.id] = allItems.length - 1;
            }
            if (items && items.length > 0) nextEndTimeToUse = items[items.length - 1].lastVisitTime;
            resolve({ "newCount": newCount, "items": items });
        });
    })
}