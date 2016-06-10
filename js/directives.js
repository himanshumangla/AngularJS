'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).
  directive('parseStyle', [function() {
        return function(scope, elm, attrs) {
            //elm.text(version);
            elem.html(scope.$eval('\'' + elem.html() + '\''));
        };
  }]);
