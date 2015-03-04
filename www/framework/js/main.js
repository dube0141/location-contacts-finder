var pages = [],
	links = [];

var app = {

	initialize: function () {
		this.bindEvents();
	},

	bindEvents: function () {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},

	onDeviceReady: function () {
		onDeviceReady();
	}
}

function onDeviceReady() {
	pages = document.querySelectorAll('[data-role="page"]');
	links = document.querySelectorAll('[data-role="link"]');

	findGeo();
	findCon();

	for (var i = 0; i < links.length; i++) {
		var h = new Hammer(links[i]);
		h.on('tap', function (ev) {
			window.addEventListener("popstate", buttons, false);
		});
	}
}

function buttons() {
	for (var i = 0; i < pages.length; i++) {
		pages[i].className = "inactive";
		links[i].className = "idle";
	}
	try {
		var n = document.querySelector(location.hash);
		var v = document.querySelector('a[href="' + location.hash + '"]');
	} catch (err) {
		var n = document.querySelector("#home");
		var v = document.querySelector('a[href="#home"]');
	}
	n.className = "active";
	v.className = "selected";
}

function findGeo() {

	if (navigator.geolocation) {

		var onSuccess = function (position) {
			if (document.querySelector('[data-role="location"]')) {
				var img = document.querySelector('[data-role="location"]');
				img.src = "http://maps.google.com/maps/api/staticmap?sensor=false&center=" + position.coords.latitude + "," + position.coords.longitude + "&zoom=15&size=" + window.outerWidth + "x" + window.outerWidth + "&markers=color:red|label:A|" + position.coords.latitude + ',' + position.coords.longitude + "&key=AIzaSyBV2eMU1Bt-kPNuO7azMl_dZBwwR7G6lv8";
			};
		}

		function onError(error) {
			alert('code: ' + error.code + '\n' +
				'message: ' + error.message + '\n');
		};

		navigator.geolocation.getCurrentPosition(onSuccess, onError);
	} else {
		alert("Your device does not support geolocations.");
	}
}

function findCon() {
	var z = 0;

	if (navigator.contacts) {

		var options = new ContactFindOptions();
		options.filter = "";
		options.multiple = true;
		filter = ["displayName"];

		navigator.contacts.find(filter, onSuccess, onError, options);
	}

	function onSuccess(contacts) {
		var r = Math.floor(Math.random() * contacts.length);
				
		if (contacts[r].name.formatted) {
			console.log("Contact Found!");
			var randomContact = document.querySelector('[data-role="randomContact"]');

			function contactValidation(a) {
				if (a) {
					for (var i = 0; i < a.length; i++) {
						return a[i].value;
					}
				} else {
					return "Unknown";
				}
			}
			
			randomContact.innerHTML = "Name: " + contacts[r].name.formatted + "<br>" +
				"Birthday: " + contactValidation(contacts[r].birthday) + "<br>" +
				"Address: " + contactValidation(contacts[r].addresses) + "<br>" +
				"Email: " + contactValidation(contacts[r].emails) + "<br>" +
				"Phone: " + contactValidation(contacts[r].phoneNumbers) + "<br>" +
				"ID: " + contacts[r].id + "<br><br>" +
				"Number of Contacts: " + contacts.length + "<br>" + 
				"Random Selected User: " + r + "<br>";

		} else {
			if (z >= 10) {
				alert("No contacts found!");
				z = 0;
				return;
			} else {
				console.log("Could not find contacts. Searching again.");
				z++;
				onSuccess(contacts);
			}
		}
	}

	function onError() {
		console.log("error");
	}
}

app.initialize();