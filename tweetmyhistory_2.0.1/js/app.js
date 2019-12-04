const $swiper = new Swiper('.swiper-container', {
    cssMode: true,
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev', },
    pagination: { el: '.swiper-pagination' },
    mousewheel: true,
    keyboard: true,
});

chrome.storage.sync.get("tweetmyhistory_autoMode", result => {
    document.querySelector("#toggleSwitch").checked = result.tweetmyhistory_autoMode;
});

document.querySelector("#toggleSwitch").addEventListener("change", (elem) => {
    chrome.storage.sync.set({ "tweetmyhistory_autoMode": elem.target.checked });
})

function go() {
    return new Promise((resolve) => {
        getMoreHistory().then(cnt => {
            if (cnt.newCount > 0) go()
            else console.log("All history data:", cnt.items); resolve(cnt.items)
        });
    });
}

document.querySelector("#twitterShareButton").addEventListener("click", () => {
    go().then(items => {
        var $data = items,
            $filteredData = [];

        $filteredData = $data.filter(item => { if ((new URL(item.url)).host == 'www.google.com' && (new URL(item.url)).searchParams.get('q')) return item })

        const $historyItem = $filteredData[Math.floor((Math.random() * $filteredData.length))],
            $searchTime = new Date($historyItem.lastVisitTime),
            $tweetText = `On ${$searchTime.getDate()}/${$searchTime.getMonth()}/${$searchTime.getFullYear()} I searched for "${(new URL($historyItem.url)).searchParams.get('q')}" on Google`;

        var $tabID;
        chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, tabs => {
            $tabID = tabs[0].id;

            chrome.tabs.update($tabID, { url: `https://twitter.com/intent/tweet?text=${$tweetText.replace(" ", "%20").replace("#", "%23")}%20@ryncmrfrd%20%23tweetmyhistory` }, () => {
                var listener = chrome.tabs.onUpdated.addListener((tabId, info) => {
                    if (info.status === 'complete' && tabId === $tabID) {
                        chrome.tabs.onUpdated.removeListener(listener);
                        chrome.tabs.executeScript($tabID, { code: "document.body.style.filter='blur(5px)'; document.querySelector('.button.selected.submit').click();" }, () => {
                            var nestedListener = chrome.tabs.onUpdated.addListener((tabId, info) => {
                                chrome.tabs.remove($tabID, () => {
                                    chrome.tabs.onUpdated.removeListener(nestedListener);
                                    resolve();
                                });
                            });
                        });
                    }
                });
            });
            
        });

    });
})


var $nextEndTimeToUse = 0,
    $allItems = [],
    $itemIdToIndex = {};

function getMoreHistory() {
    return new Promise(resolve => {
        var params = { text: "", maxResults: 500 };
        params.startTime = 0;
        if ($nextEndTimeToUse > 0) params.endTime = $nextEndTimeToUse;
        chrome.history.search(params, function (items) {
            var newCount = 0;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.id in $itemIdToIndex) continue;
                newCount += 1;
                $allItems.push(item);
                $itemIdToIndex[item.id] = $allItems.length - 1;
            }
            if (items && items.length > 0) $nextEndTimeToUse = items[items.length - 1].lastVisitTime;
            resolve({ "newCount": newCount, "items": items });
        });
    })
}