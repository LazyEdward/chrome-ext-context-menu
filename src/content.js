// https://stackoverflow.com/questions/7703697/how-to-retrieve-the-element-where-a-contextmenu-has-been-executed

//content script
// let copies = [];

const focusStyle = { 'border': '2px dashed #4ACDF5', 'opacity': 0.75 }

let highlightTargetEle = true;
let alwaysShowContextMenu = false;

let prevStyle = null;
let ele = null;

const focusElement = () => {
	if(!highlightTargetEle)
		return;

	prevStyle = {}
	for(let key of Object.keys(focusStyle)){
		prevStyle[key] = ele.style[key] ?? ''
		ele.style[key] = focusStyle[key]
	}
}

const cancelElementFocus = () => {
	if(!prevStyle)
		return;

	for(let key of Object.keys(prevStyle))
		ele.style[key] = prevStyle[key]

	ele = null
	prevStyle = null
}

document.addEventListener("contextmenu", (e) => {
	if(!!ele)
		cancelElementFocus();

	if(!!alwaysShowContextMenu)
		e.stopPropagation();

    ele = e.target;

	focusElement();

}, true);

document.addEventListener("click", (e) => {
	if(!!ele)
		cancelElementFocus();
})

document.addEventListener("visibilitychange", () => {
	if (document.visibilityState !== "visible"){
		if(!!ele)
			cancelElementFocus();
	}
});

chrome.storage.onChanged.addListener((changes) => {
	if(!!changes['highlightTargetEle'])
		highlightTargetEle = changes['highlightTargetEle'].newValue

	if(!!changes['alwaysShowContextMenu'])
		alwaysShowContextMenu = changes['alwaysShowContextMenu'].newValue
})

chrome.runtime.onMessage.addListener((req, sender, sendRes) => {
	if (chrome.runtime.lastError)
		return;

    if(req === "copyAsText") {
		// would not work if you try to get whole object
		// console.log(ele.innerHTML)
		// console.log(ele.innerText)

		// https://www.30secondsofcode.org/articles/s/copy-text-to-clipboard-with-javascript
		if (navigator && navigator.clipboard && navigator.clipboard.writeText && ele.innerText){
			navigator.clipboard.writeText(ele.innerText);
		}

		let copyEle = null;

		if(ele){
			// if(copies > 9)
			// 	copies.pop()

			if(!ele.innerHTML && !ele.outerHTML && !ele.innerText && !ele.textContent){

			}
			else{
				copyEle = {
					html: ele.innerHTML ? ele.innerHTML : ele.outerHTML,
					text: ele.innerText ? ele.innerText : '<Cannot find Text in current selection>',
					textContent: ele.textContent ? ele.textContent : '<Cannot find Text in current selection>'
				}
				
				if(copyEle.html)
					copyEle.html = copyEle.html.replace(/<a /g, '<not-support ')				
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

