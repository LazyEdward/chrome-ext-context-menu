const ChromApi = {
	fetchHistory: (keys: string[], callbackSuccess: Function, callbackFails: Function) => {
		chrome.storage.local.get(keys, (data) => {
			if (chrome.runtime.lastError) {
			  console.log("runtime error: getCopyedEles")
			  callbackFails();
			  return;
			}
	  
			callbackSuccess(data);
		  })
	},
	cleanHistory: (copies: any[], callbackSuccess: Function, callbackFails: Function) => {
		chrome.storage.local.set({copies}, () => {
			if (chrome.runtime.lastError) {
				console.log("runtime error: clean history")
				callbackFails()
				return;
			}

			callbackSuccess();
		  })
	},
	setPreferences: (name: string, checked: boolean, callback: Function) => {
		chrome.storage.local.set({[name]: checked}, () => {
			if (chrome.runtime.lastError) {
			  console.log("runtime error: set preference")
			}
	  
			callback();	  
		  })
	}
}

export default ChromApi;