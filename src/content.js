// https://stackoverflow.com/questions/7703697/how-to-retrieve-the-element-where-a-contextmenu-has-been-executed

//content script
// let copies = [];

var ele = null;

document.addEventListener("contextmenu", (e) => {
    ele = e.target;
}, true);

chrome.runtime.onMessage.addListener((req, sender, sendRes) => {
	if (chrome.runtime.lastError)
		return;

    if(req === "copyAsText") {
		// would not work if you try to get whole object
		// console.log(ele.innerHTML)
		// console.log(ele.innerText)

		// https://www.30secondsofcode.org/articles/s/copy-text-to-clipboard-with-javascript
		if (navigator && navigator.clipboard && navigator.clipboard.writeText){
			navigator.clipboard.writeText(ele.innerText);
		}

		let copyEle = null;

		if(ele){
			// if(copies > 9)
			// 	copies.pop()

			if(!ele.innerHTML && !ele.outerHTML && ele.innerText && ele.textContent){

			}
			else{
				copyEle = {
					html: ele.innerHTML ? ele.innerHTML : ele.outerHTML,
					text: ele.innerText ? ele.innerText : '<Cannot find Text in current selection>',
					textContent: ele.textContent ? ele.textContent : '<Cannot find Text in current selection>'
				}
			}

			// copies.unshift(copyEle)
		}

        sendRes({ele: copyEle});
    }
	// else if(req === "getCopies"){
    //     sendRes({copies: copies});
	// }
	// else{
	// 	// https://stackoverflow.com/questions/59214202/receiving-error-in-chrome-extension-unchecked-runtime-lasterror-could-not-esta
	// 	sendRes({ele: ''});
	// }
});

