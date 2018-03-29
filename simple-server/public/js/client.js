(function() {

	if ('serviceWorker' in navigator) {
		window.addEventListener('load', function() {
			navigator.serviceWorker.register('%PUBLIC_URL%/sw.js').then(function(registration) {
				// Registration was successful
				console.log('ServiceWorker registration successful with scope: ', registration.scope);
			}, function(err) {
				// registration failed :(
				console.log('ServiceWorker registration failed: ', err);
			});
		});
	}

	/*if(window.location.protocol != 'https:') {
		location.href = location.href.replace("http://", "https://");
	}*/

})();