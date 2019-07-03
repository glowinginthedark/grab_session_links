// main functlionality
function logTabsChrome () {
	var the_url = "";
	var status = document.getElementById('status');

	status.style.display = 'block';

	document.addEventListener("copy", function(e){
		e.clipboardData.setData("text/plain", the_url);
		e.preventDefault();
	});

	chrome.tabs.query({'currentWindow': true}, function(tabs){
		tabs.forEach(function(f){
			var k = f.url;
			k = k.concat("\r\n");
			the_url = the_url.concat(k);
		});

		document.execCommand("copy");

		status.style.textAlign = 'left';
		status.textContent = '✔️ Copied to clipboard!';
		status.style.backgroundColor = 'green';
		hideStatus(status);
	});
}

function logTabsFirefox(windowInfo) {
	var the_url = "";
	var status = document.getElementById('status');

	status.style.display = 'block';

	for (let tabInfo of windowInfo.tabs) {
		let e = tabInfo.url;
		e = e.concat("\r\n");
		the_url = the_url.concat(e);
	};

	navigator.clipboard.writeText(the_url).then(() => {
		status.style.textAlign = 'left';
		status.textContent = '✔️ Copied to clipboard!';
		status.style.backgroundColor = 'green';
		hideStatus(status);

	}).catch(() => {
		status.style.textAlign = 'left';
		status.textContent = '⚠️ There was an error :(';
		status.style.backgroundColor = 'orange';
		status.style.color = 'black';
		hideStatus(status);

	});
}

function openTabs (isChrome) {
	var str = document.getElementById('input_open').value;
	var arr = [];

	str = str.replace(" ", "");

	// parse links in arr
	while( str.indexOf("https://") > -1 || str.indexOf("http://") > -1 ){
		var start, start_one, start_two;
		var len = str.indexOf("://") + 3;
		var end, end_one, end_two;
		var chunk, chunk_one, chunk_two;

		start_one = str.indexOf("https://");
		start_two = str.indexOf("http://");

		if( start_one < 0 || start_two < 0 ){
			if( start_one < 0 )
				start = start_two;

			if( start_two < 0 )
				start = start_one;
		}else{
			start = Math.min(start_one, start_two);
		}

		chunk_one = str.substr(start, len);
		str = str.substr(len, str.length);

		end_one = str.indexOf("https://");
		end_two = str.indexOf("http://");

		if( end_one < 0 || end_two < 0 ){
			if( end_one < 0 && end_two < 0 ){
				end = str.length;
			}else if( end_one < 0 ){
				end = end_two;
			}else if( end_two < 0 ){
				end = end_one;
			} 
		}else{
			end = Math.min(end_one, end_two);
		}

		chunk_two = str.substr(0, end);
		str = str.substr(end, str.length);
		chunk = chunk_one + chunk_two;
		arr.push(chunk);
	}

	if ( !isChrome ) {
		for(var i = 0; i < arr.length; i++) {
			browser.tabs.create({ url: arr[i]});
		}	
	} else {
		for(var i = 0; i < arr.length; i++) {
			chrome.tabs.create({ url: arr[i]});
		}	
	}
}

// UI / other
function hideStatus (status) {
	setTimeout(() => {
		status.style.display = 'none';
		status.style.color = 'black';
		status.style.backgroundColor = 'grey';
		status.textContent = '...';
		status.style.textAlign = 'center';
	}, 3000);
}

function onError(error) {
	console.log(`Error: ${error}`);
}

document.addEventListener('DOMContentLoaded', () => {
	var button_grab = document.getElementById('button_grab');
	var button_open = document.getElementById('button_open');
	var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
	var input = document.getElementsByTagName('input')[0];

	button_grab.addEventListener('click', () => {
		if ( !isChrome ) {
			var getting = browser.windows.getCurrent({populate: true});
			getting.then(logTabsFirefox, onError);
		} else {
			logTabsChrome();
		}
	});

	button_open.addEventListener('click', () => {
		openTabs(isChrome);
	});

	input.focus();

	input.addEventListener('input', () => {
		document.addEventListener('keypress', (e) => {
			var key = e.which || e.keyCode;

			if (key === 13) {
				openTabs(isChrome);
			}
		});
	});

});