document.addEventListener('DOMContentLoaded', () => {
	var button_grab = document.getElementById('button_grab');
	var button_open = document.getElementById('button_open');

	button_grab.addEventListener('click', () => {
		chrome.tabs.query({'currentWindow': true}, function(tabs){
			var the_url = "";
			document.addEventListener("copy", function(e){
				e.clipboardData.setData("text/plain", the_url);
				e.preventDefault();
			});
			tabs.forEach(function(f){
				var k = f.url;
				k = k.concat("\r\n");
				the_url = the_url.concat(k);
			});
			document.execCommand("copy");
		});
	});

	button_open.addEventListener('click', () => {
		var str = document.getElementById('input_open').value;
		str = str.replace(" ", "");
		var arr = [];

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

		console.log(arr);
		console.log(arr.length); 

		for(var i = 0; i < arr.length; i++) {
			chrome.tabs.create({ url: arr[i]});
		}	
	});

});