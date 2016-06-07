(function() {
	var app = angular.module('myApp', []);

	app.controller('formController', function() {
		this.details = objs;
	
	});

	app.controller("controller2", function() {

	});

	app.directive("directive1", function() {

	});

	var objs = [{
		name : 'Azurite',
		class : 10,
		address : 'delhi',
		email : "joe@example.org"
	}, {
        name : 'Bloodstone',
		class : 10,
		address : 'gurgaon',
		email : "john@sample.com"
	}

	];
})(); 