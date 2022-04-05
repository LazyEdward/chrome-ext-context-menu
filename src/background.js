chrome.runtime.onInstalled.addListener(() => {
	console.log("Background Start Up")

	chrome.contextMenus.create({
	  "id": "copyAsTextContextMenu",
	  "title": "Copy Current Element as Text",
	  "contexts": ["all"]
	});
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	// console.log("start copy")
	if(info.menuItemId === "copyAsTextContextMenu"){

		try{
			chrome.tabs.sendMessage(tab.id, "copyAsText", {frameId: info.frameId}, data => {
				// console.log("end copy")
				console.log(data)
			});
		}
		catch(e){
			console.log("send fail", e)
		}

	}
})