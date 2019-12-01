chrome.history.search({ text: '' }, results => {
    
    var $data = results, 
        $filteredData = [];

    $data.forEach(item => { if( (new URL(item.url)).host == 'www.google.com' && (new URL(item.url)).searchParams.get('q') ) $filteredData.push(item) })
 
    const $historyItem = $filteredData[Math.floor((Math.random() * $filteredData.length))]
    setTimeout(() => {

        const $searchTime = new Date($historyItem.lastVisitTime),
              $tweetText = `On ${$searchTime.getDate()}/${$searchTime.getMonth()}/${$searchTime.getFullYear()} I searched for "${(new URL($historyItem.url)).searchParams.get('q')}" on Google`

        document.querySelector("#tweetText").innerText = $tweetText;
        document.querySelector("#twitterShareButton").addEventListener("click", () => chrome.tabs.create({ url: `https://twitter.com/intent/tweet?text=${$tweetText.replace(" ", "%20").replace("#", "%23")}%20@ryncmrfrd%20%23tweetmyhistory` }) );
        document.querySelector("#loading").style.display = "none";
        document.querySelector("#result").style.display = "flex";

    }, 500)

})