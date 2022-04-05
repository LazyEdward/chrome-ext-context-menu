// https://stackoverflow.com/questions/7703697/how-to-retrieve-the-element-where-a-contextmenu-has-been-executed

//content script
var ele = null;

document.addEventListener("contextmenu", (e) => {
    ele = e.target;
}, true);

chrome.runtime.onMessage.addListener((req, sender, sendRes) => {
    if(req === "copyAsText") {
		// would not work if you try to get whole object
		// console.log(ele.innerHTML)
		// console.log(ele.innerText)

		// https://www.30secondsofcode.org/articles/s/copy-text-to-clipboard-with-javascript
		if (navigator && navigator.clipboard && navigator.clipboard.writeText){
			navigator.clipboard.writeText(ele.innerText);
		}

        sendRes({ele: ele.innerText});
    }
	else{
		// https://stackoverflow.com/questions/59214202/receiving-error-in-chrome-extension-unchecked-runtime-lasterror-could-not-esta
		sendRes({ele: ''});
	}
});