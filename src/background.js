

chrome.runtime.onInstalled.addListener(() => {
	console.log("Background Start Up")

	// https://stackoverflow.com/questions/66391018/how-do-i-call-a-function-periodically-in-a-manifest-v3-chrome-extension
	chrome.alarms.create('alarm', { delayInMinutes: 3.0 });

	chrome.contextMenus.create({
	  "id": "copyAsTextContextMenu",
	  "title": "Copy Current Element",
	  "contexts": ["all"]
	});
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	console.log("start copy")
	if(tab.id === chrome.tabs.TAB_ID_NONE){
		console.log("send fail tab no found");
		return;
	}

	if(info.menuItemId === "copyAsTextContextMenu"){

		try{
			chrome.tabs.sendMessage(tab.id, "copyAsText", {frameId: info.frameId}, data => {
				if (chrome.runtime.lastError)
					return;

				// console.log("end copy")
				// console.log(copies)
				console.log(data)

				if(data && data.ele){
					let copies = [];

					chrome.storage.local.get(["copies", "alwaysShowPopUp"], (storage) => {
						if (chrome.runtime.lastError) {
						  console.log("runtime error: copy")
						  return;
						}
				  
						if(storage && storage["copies"] && storage["copies"].length > 0){
						  console.log(storage["copies"])
						  copies = storage["copies"];
						}

						if(copies.length > 9)
							copies.pop()

						copies.unshift(data.ele)

						chrome.storage.local.set({copies: copies}, () => {
							if (chrome.runtime.lastError) {
								console.log("runtime error: sendMessage")
								return;
							}

							// missing api although stated in document
							// https://github.com/GoogleChrome/developer.chrome.com/issues/204
							// if(storage["alwaysShowPopUp"])
							// 	chrome.action.openPopup()
						})

					})
				}

				chrome.alarms.create('alarm', { delayInMinutes: 3.0 });
			});
		}
		catch(e){
			console.log("send fail", e)
			return;
		}

	}
})

// chrome.runtime.onConnect.addListener(() => {
// 	if (chrome.runtime.lastError)
// 		return;

// 	console.log('connected')
// })

// chrome.runtime.onSuspend.addListener(() => {
// 	if (chrome.runtime.lastError)
// 		return;

// 	console.log('suspended')
// })

// chrome.runtime.onMessage.addListener((req, sender, sendRes) => {
// 	if (chrome.runtime.lastError)
// 		return;
// });

chrome.alarms.onAlarm.addListener(() => {
	console.log('wake up')

	// chrome.action.setTitle({
	// 	details: {title: "wake up"},
	// }, () => { console.log('wake up') });

	chrome.alarms.create('alarm', { delayInMinutes: 3.0 });
});