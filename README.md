# 🐦 Tweet My History

Another project from my high school days, this Chrome extention tweets a random Google search from your Chrome history. I did actually attempt to list it on the Chrome web store, but my application was rejected. Something about privacy. Who would have thought.

## 💻 How It Works

> Disclaimer: The code is messy and poorly structured (I actually think the nesting runs 10 blocks deep at one point), hence the this repo is a public archive.

I used the `chrome.history` API retrieve the most recent 500 search entries and pick a random one (`Math.floor((Math.random() * $filteredData.length))`).
From here, the `chrome.tabs` API allowed me to create a new tab pointing to `https://twitter.com/intent/tweet`, which has (had?) a query string for the text of the intended tweet.
Once this tab opens, I injected javascript to blur the main body so the content of the tweet isn't spoiled, clicked the submit button, and closed the tab.

## 📚 Takeaways

While only being a quick and dirty Chrome extension project, I gained technical knowlege of handling promises in Javascript. Additionally, I got to explore the possibilities of browser APIs, and open my eyes to the privacy aspects of this niche aspect of web programming.
