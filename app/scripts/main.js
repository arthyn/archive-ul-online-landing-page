(function(document, window) {
	var domReady = function(callback) {
	    document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
	};

	function getParameterByName(name, url) {
	    if (!url) url = window.location.href;
	    name = name.replace(/[\[\]]/g, "\\$&");
	    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	        results = regex.exec(url);
	    if (!results) return null;
	    if (!results[2]) return '';
	    return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	function ajaxPost (elements, action, callback) {
	    var url = action,
	        xhr = new XMLHttpRequest();

	    var params = elements.map(function(el) {
	        //Map each field into a name=value string, make sure to properly escape!
	        return encodeURIComponent(el.name) + '=' + encodeURIComponent(el.value);
	    }).join('&'); //Then join all the strings by &

	    xhr.open("POST", url);
	    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	    //.bind ensures that this inside of the function is the XHR object.
	    xhr.onload = callback.bind(xhr); 

	    //All preperations are clear, send the request!
	    xhr.send(params);
	}

	function submitForm(e) {
		e.preventDefault();

		var body = document.querySelector('body');
		var signup = document.querySelector('#signup');
		var submit = document.querySelector('#form-submit');
		var elements = signup.querySelectorAll('input,select');


		elements = [].slice.call(elements);

		submit.className += ' loading';
		submit.innerHTML = '<div class="loader">Loading...</div>';
		ajaxPost(elements, signup.action, function(){
			if(this.status === 200) {
				signup.innerHTML = '<p>Thank you for completing the form. One of our enrollment counselors will contact you soon.</p>';
				var state = elements.filter(function (element) {
					return element.id.indexOf('state-select') > -1;
				});
				window.dataLayer = window.dataLayer || [];
				 window.dataLayer.push({
				   'event' : 'formSubmissionSuccess',
				   'formId' : 'contactForm',
				   'state' : state.textContent
				 });
				console.log(window.dataLayer);
			} else if(this.status !== 200) {
				signup.innerHTML = '<p>Your submission was unable to be submitted. Please try again later.</p>';
			}
		});

		return false;
	}

	function checkInputs() {
		var inputs = document.querySelectorAll('input:not([type=checkbox]):not([type=submit]), textarea, select');
		for(var i=0;i<inputs.length; i++) {
		    inputs[i].addEventListener('focus', isBlank, false);
		    inputs[i].addEventListener('keyup', isBlank, false);
		    inputs[i].addEventListener('change', isBlank, false);
		    inputs[i].addEventListener('blur', isBlank, false);
		    inputs[i].addEventListener('mousedown', isBlank, false);
		    
		    var evt = document.createEvent('HTMLEvents');
		    evt.initEvent('change', false, true);
		    inputs[i].dispatchEvent(evt);
		}
		function isBlank(event) {
		    var target = event.target;
		    var value = target.value;
		  
		    if(isEmpty(value)) {
		      if(!target.classList.contains('input-blank'))
		        target.classList.add('input-blank');
		    } else {
		        target.classList.remove('input-blank');
		    }
		}
		function isEmpty(str) {
		    return (!str || 0 === str.length);
		}
	}

	function attachFormSubmit() {
		var signup = document.querySelector('#signup');
		signup.addEventListener('submit', submitForm, false);
	}

	function captureSource() {
		var source = getParameterByName('utm_medium');
		var sourceInput = document.querySelector('#source');

		if(source) {
			sourceInput.value = source;
		}
	}

	domReady(function() {
		captureSource();
		attachFormSubmit();
		checkInputs();
		validate.init();
	});
})(document, window)