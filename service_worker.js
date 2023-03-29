chrome.action.onClicked.addListener(async () => {
    chrome.tabs.create({
        url: "https://bitbucketrd.brita.net/rest/api/1.0/projects/bdp/repos/bdp/pull-requests"
    });
});