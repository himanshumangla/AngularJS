'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
	.factory('FeedService',['$http',function($http){
	    return {
	        parseFeed : function(url, $scope){

				var feed = new google.feeds.Feed(url);
				feed.setNumEntries(-1);
				feed.setResultFormat(google.feeds.Feed.JSON);
				feed.load(function(result) {
				    if (!result.error) {
				      /*var container = document.getElementById("feed");
				      for (var i = 0; i < result.feed.entries.length; i++) {
				        var entry = result.feed.entries[i];
				        var div = document.createElement("div");
				        div.appendChild(document.createTextNode(entry.title));
				        container.appendChild(div);
				        }*/
				      }
				      $scope.feeds=result.feed.entries;
				    });


				//alert ("Url : " + url);
	            //return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
	        }
	    }
  }])
  .value('version', '0.1');
