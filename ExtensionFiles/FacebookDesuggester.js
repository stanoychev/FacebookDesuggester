/*jshint esversion: 6 */
(function() {
    'use strict';

    function deleteSuggestions(feedSubelements) {
        for (const feedSubelement of feedSubelements) {
            [...feedSubelement.target.querySelectorAll('div[data-pagelet*="FeedUnit"]')]
            .forEach(feedUnit => {

                let spans = [...feedUnit.querySelectorAll("span")];

                let filteredSpans = spans
                    .filter(element => element.getAttribute("style") == null
                        && element.getAttribute("class") != null);

                let name = "";
                filteredSpans
                    .filter(x => x.firstChild.nodeValue != null)
                    .forEach(x => name = name + x.firstChild.nodeValue);

                let isSponsored = name.includes("Sponsored");

                let isSuggestedForYou = spans.some(x => x.textContent.includes("Suggested for you"));

                let isSuggestedEvent = spans.some(x => x.textContent.includes("Suggested Events"));
                
                let isCovidInformation = spans.some(x => x.textContent.includes("Coronavirus (COVID-19) information"));
                
                if (isSponsored || isSuggestedForYou || isSuggestedEvent || isCovidInformation) {
                    if (isSponsored)
                        console.log(`Deleted >>Sponsored<<`);

                    if (isSuggestedForYou)
                        console.log(`Deleted >>Suggested for you<<`);

                    if (isSuggestedEvent)
                        console.log(`Deleted >>Suggested Events<<`);

                    if (isSuggestedEvent)
                        console.log(`Deleted >>Coronavirus (COVID-19) information<<`);

                    feedUnit.remove();
                }
            });
        }
    }

    let rootFeedElement = null;
    let isSet = false;
    let feedObserver = null;

    const domObserver = new MutationObserver(function(mutationsList) {
        let isFacebookRootUrl = window.location.pathname == '/' || window.location.pathname == '/index.php';

        if (!isFacebookRootUrl) {
            if (isSet)
                isSet = false;

            return;
        }

        if (isSet)
            return;

        rootFeedElement = document.querySelector('div[role="main"]');
        isSet = true;

        feedObserver = new MutationObserver(deleteSuggestions);
        feedObserver.observe(rootFeedElement, {
            childList: true,
            subtree: true
        });
    });

    setTimeout(function() {
        domObserver.observe(document, {
            childList: true,
            subtree: true
        });
    }, 2000);
})();