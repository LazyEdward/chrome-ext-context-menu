chrome.runtime.onInstalled.addListener(() => {
	console.log("Background Start Up")

	chrome.contextMenus.create({
	  "id": "copyAsTextContextMenu",
	  "title": "Copy as Text",
	  "contexts": ["all"]
	});
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	console.log("info")
	console.log(info)

	console.log("tab")
	console.log(tab)
})