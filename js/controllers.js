'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
    controller('MyCtrl1', [function () {

    }])
    .controller('MyCtrl2', [function () {

    }])
    .controller('AboutCtrl', ['$rootScope', function ($rootScope) {
        $rootScope.showlogin = false;
    }])
.controller('ReportIssueCtrl', ['$scope', '$rootScope', '$http', '$location',
                                function ($scope, $rootScope, $http, $location) {
                                if (window.device) {
                                var userID="";
                                if($.jStorage.get('username')==null || $.jStorage.get('username') =="")
                                {  userID= "";}
                                else{
                                userID = 'User ID : ' +$.jStorage.get('username');
                                }
                                window.plugin.email.isServiceAvailable(
                                                                       function (isAvailable) {
                                                                       
                                                                       if(isAvailable){window.plugin.email.open({
                                                                                                                to: [$rootScope.metadata.reportissueEmail],
                                                                                                                cc:["support@kryptosmobile.com"],
                                                                                                                subject: 'myCampus Mobile ( ' + $rootScope.tenant + ' ) Issue reporting',
                                                                                                                body: '\n\n\n\n\n\n\n<h3>Device Details</h3><br/><p>' +
                                                                                                                'Platform : ' + window.device.platform + '<br/>' +
                                                                                                                'UUID : ' + window.device.uuid + '<br/>' +
                                                                                                                'Device version : ' + window.device.version + '<br/>' +
                                                                                                                'Device model : ' + window.device.model + '<br/>' +
                                                                                                                'Build Version : ' + $rootScope.metadata.version + '<br/>' +
                                                                                                                userID + '<br/>' +
                                                                                                                '</p>',
                                                                                                                isHtml: true
                                                                                                                });}
                                                                       else{navigator.notification.alert("Please check your Email configurations",null,"Report Issue Email","OK");}
                                                                       }
                                                                       );
                                
                                } else {
                                apprise("This feature is not available on Emulator", {'verify': false, 'textYes': "Ok"}, function (r) {
                                        
                                        });
                                }
                                $location.path("/home");
                                }])
.controller('SendFeedbackCtrl', ['$scope', '$rootScope', '$http', '$location',
                                 function ($scope, $rootScope, $http, $location) {
                                 if (window.device) {
                                 var userID="";
                                 if($.jStorage.get('username')==null || $.jStorage.get('username') =="")
                                 {  userID= "";}
                                 else{
                                 userID = 'User ID : ' +$.jStorage.get('username');
                                 }
                                 window.plugin.email.isServiceAvailable(
                                                                        function (isAvailable) {
                                                                        if(isAvailable){window.plugin.email.open({
                                                                                                                 to: [$rootScope.metadata.feedbackEmail],
                                                                                                                 cc:["support@kryptosmobile.com"],
                                                                                                                 subject: 'myCampus Mobile ( ' + $rootScope.tenant + ' ) Feedback',
                                                                                                                 body: '\n\n\n\n\n\n\n<h3>Device Details</h3><br/><p>' +
                                                                                                                 'Platform : ' + window.device.platform + '<br/>' +
                                                                                                                 'UUID : ' + window.device.uuid + '<br/>' +
                                                                                                                 'Device version : ' + window.device.version + '<br/>' +
                                                                                                                 'Device model : ' + window.device.model + '<br/>' +
                                                                                                                 'Build Version : ' + $rootScope.metadata.version + '<br/>' +
                                                                                                                 userID + '<br/>' +
                                                                                                                 '</p>',
                                                                                                                 isHtml: true
                                                                                                                 });}
                                                                        else{navigator.notification.alert("Please check your Email configurations",null,"Feedback Email","OK");}
                                                                        }
                                                                        );
                                 } else {
                                 apprise("This feature is not available on Emulator", {'verify': false, 'textYes': "Ok"}, function (r) {
                                         
                                         });
                                 }
                                 $location.path("/home");
                                 }])

    .controller('DeviceCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
        if(window.device) {
            $scope.devicename = window.device.name;
            $scope.deviceuuid = window.device.uuid;
            $scope.deviceplatform = window.device.platform;
            $scope.deviceversion = window.device.version;
            $scope.devicemodel = window.device.model;
        }else {
            $scope.devicename = "Kryptos Emulator";
            $scope.deviceuuid = "N/A";
            $scope.deviceplatform = "Desktop";
            $scope.deviceversion = "N/A";
            $scope.devicemodel = "N/A";
        }
        $rootScope.showlogin = false;
        MyCampusApp.homeScreenDisplayed = false;
    }])
    .controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location',
        function ($scope, $rootScope, $http, $location) {
            $rootScope.back = function () {
                $location.path("/home");
            };
            $scope.forgotpassword = function() {
                var url = $rootScope.metadata.forgotPasswordUrl;
                if (window.device) {
                    $.blockUI();
                }
                var iabRef = window.open(url, "_blank", "location=yes,EnableViewPortScale=yes");
                var hideBlockUi = function() {
                    iabRef.show();
                    $.unblockUI();
                };
                var iabClose = function(data) {
                    window.location.href = "index.html#login";
                              $.unblockUI();
                };
                iabRef.addEventListener("exit", iabClose);
                var loadStop = function(data) {
                    hideBlockUi();
                };
                iabRef.addEventListener("loadstop", loadStop);
            }

            $rootScope.showlogin = false;
            $("#loginUsername").focus();
            $rootScope.login = function () {
                if ($("#loginUsername").val().length == 0) {
                    navigator.notification.alert('Please enter your username');
                    return false;
                }
                if ($("#loginPassword").val().length == 0) {
                    navigator.notification.alert('Please enter your password');
                    return false;
                }
                var username = $("#loginUsername").val();
                var password = $("#loginPassword").val();
                var data = "username=" + username + "&password=" + password;
                window['authFunction'](username, password, $http, $rootScope, function (data) {
                    if (data.error) {
                        apprise(data.error, {'verify': false, 'textYes': "Ok"}, function (r) {
                            $rootScope.ticket = null;
                            $rootScope.loggedin = false;
                            $rootScope.userroles = null;
                            $.jStorage.deleteKey('username');
                            $.jStorage.deleteKey('password');
                            $.jStorage.deleteKey('ticket');
                            $.jStorage.deleteKey('userroles');
                        });
                    } else {
                        var ticket = data.ticket;
                        $rootScope.ticket = ticket;
                        $rootScope.userroles = data.roles;
                        $.jStorage.set('username', username);
                        $.jStorage.set('password', password);
                        $.jStorage.set('ticket', ticket);
                        $.jStorage.set('userroles', data.roles);
                        if ($rootScope.loggedin == true) {
                        } else {
                            $rootScope.loggedin = true;
                            $location.path("/home");
                        }

                    }
                }, function (data) {
                    //alert("Error call back" + data);
                    apprise("Error occurred while processing this request.", {'verify': false, 'textYes': "Ok"}, function (r) {
                        $rootScope.ticket = null;
                        $rootScope.loggedin = false;
                        $rootScope.userroles = null;
                        $.jStorage.deleteKey('username');
                        $.jStorage.deleteKey('password');
                        $.jStorage.deleteKey('ticket');
                        $.jStorage.deleteKey('userroles');
                    });
                });
            };

        }])


    .controller('SettingsCtrl', ['$rootScope', '$scope', '$http', '$location', '$window', '$sce', '$route', '$compile',
        function ($rootScope, $scope, $http, $location, $window, $sce, $route, $compile) {
            //$scope.serverUrl = "http://localhost:8081/";
            $rootScope.showlogin = false;
            $scope.serverUrlChange = function () {
                $rootScope.serverUrl = $scope.serverUrl;
                $.jStorage.set('serverUrl', $rootScope.serverUrl);
                //window.localStorage.setItem('serverUrl', $rootScope.serverUrl);
            };
            $scope.tenantChange = function () {
                $rootScope.tenant = $scope.tenant;
                $.jStorage.set('tenant', $rootScope.tenant);
                //window.localStorage.setItem('tenant', $rootScope.tenant);
            };
            $rootScope.showlogin = false;
            MyCampusApp.homeScreenDisplayed = false;

            $scope.grid = function () {
                $rootScope.hslayout = "grid";
                $('#gridbtn').attr('class', 'btn btn-primary');
                $('#listbtn').attr('class', 'btn btn-befault');
            };

            $scope.list = function () {
                $rootScope.hslayout = "list";
                $('#gridbtn').attr('class', 'btn btn-default');
                $('#listbtn').attr('class', 'btn btn-primary');
            };

            if ($rootScope.hslayout == "list") {
                $('#gridbtn').attr('class', 'btn btn-default');
                $('#listbtn').attr('class', 'btn btn-primary');
            } else {
                $('#gridbtn').attr('class', 'btn btn-primary');
                $('#listbtn').attr('class', 'btn btn-befault');
            }

            $scope.resetmyapp = function () {
                var tenant = MyCampusApp.config.tenant;
                $.jStorage.deleteKey(tenant + '-metadata');
                $location.path("/home");
            }
        }])
    .controller('HomeCtrl', ['$rootScope', '$scope', '$http', '$location', '$window', '$sce', '$route', '$compile',
        function ($rootScope, $scope, $http, $location, $window, $sce, $route, $compile) {
            //alert("Home controller called..");
            //alert ("Home Controller called");
            //setTimeout(function () {


            if(!$rootScope.homeDownloadCompleteAdded) {
                $rootScope.$on("onDownloadComplete", function(event, data) {
                    $.unblockUI();
                    $route.reload();
                    $rootScope.$apply(function () {
                        $location.path("/home");
                    });
                });
                $rootScope.homeDownloadCompleteAdded = true;
            }
                MyCampusApp.homeRoute = $route;
                if (window.device) {
                    if ($.jStorage.get('username')) {
                        $rootScope.loggedin = true;
                        $rootScope.userroles = $.jStorage.get('userroles');
                    } else {
                        $rootScope.loggedin = false;
                    }
                }
                if ($rootScope.loggedin) {
                    $rootScope.loginclass = "fa fa-power-off fa-2x";
                    $rootScope.logintext = "Logout";
                } else {
                    $rootScope.loginclass = "fa fa-user fa-2x";
                    $rootScope.logintext = "Login";
                }


                if (!$rootScope.hslayout) {
                    $rootScope.hslayout = 'grid';
                }

                /** Get the Tenant information **/
                var tenant = MyCampusApp.config.tenant;

                if ($.jStorage.get('tenant')) {
                    tenant = $.jStorage.get('tenant');
                }


                /**
                 * Update the Root scope model for Home screen
                 */
                    //alert ("Before fillRootScopeForHome ");
                MyCampusApp.fillRootScopeForHome($rootScope, $sce, tenant, $window, $location, $route, $http,  $scope, $compile);

                if (window.device) {
                    var allIcons, allScreens, dock, dockIcons, icon, stage, _i, _len, _results;
                    allIcons = [];
                    dockIcons = [];
                    $.each($rootScope.apps, function (index, val) {
                        if (val.showInHome) {
                            allIcons.push(new Icon(val.name, val.displayname, "#app/" + val.name + "/" + val.name, val.logo));
                        }
                        if (val.showInDock) {
                            dockIcons.push(new DockIcon(val.name, val.displayname, "#app/" + val.name + "/" + val.name, val.logo));
                        }
                    });
                    var docWidth = $(document).width();
                    var winWidth = $(window).width();
                    if (docWidth != winWidth) {
                        docWidth = docWidth - 15;
                    }
                    Stage.prototype.screenWidth = docWidth; //$(window).width() + 16;
                    allScreens = $('#allScreens');
                    allScreens.html("");
                    //allScreens.Touchable();
                    if ($.isNumeric($rootScope.metadata.iconWidth)) {
                        stage = new Stage(allIcons, $rootScope.metadata.iconWidth);
                    } else {
                        stage = new Stage(allIcons, 64);
                    }
                    //stage = new Stage(allIcons);
                    stage.addScreensTo(allScreens);
                    stage.addIndicatorsTo('#indicators');
                    $rootScope.stage = stage;
                    dock = $('#dock');
                    dock.html("");
                    _results = [];
                    for (_i = 0, _len = dockIcons.length; _i < _len; _i++) {
                        icon = dockIcons[_i];
                        _results.push(dock.append(icon.markup));
                    }
                    var homedata = $("#homedata");
                    homedata.html("");
                    var iconwidth = 64;
                    var sampleicon = $('#sampleicon');
                    var calculated = sampleicon.outerWidth(true);
                    if (calculated != 0) {
                        iconwidth = sampleicon.outerWidth(true) + 24;
                    }
                    var width = $(window).width() > 780 ? $(window).width() - 280 : $(window).width();
                    var cols = Math.floor(width / iconwidth);
                    var rows = Math.floor(($(window).height() - 200) / iconwidth);

                    for (_i = 0, _len = allIcons.length; _i < _len; _i++) {
                        icon = allIcons[_i];
                        var markup = '<li class="dashboardIcon"><a href="' + icon.url + '"><img src="' + icon.logourl + '" class="icon"></img></a>' +
                            '<div class="campuseai-Info text-center" style="width:' + calculated + 'px;overflow:hidden;text-overflow: ellipsis;">'
                            + icon.title + '</div></li>';
                        homedata.append(markup);
                    }

                    //AK added for promptumenu
                    $("#homedata").promptumenu({
                        width: (width - 24),
                        height: ($(window).height() - 200),
                        rows: rows,
                        columns: cols,
                        direction: 'horizontal',
                        pages: true
                    });
                    //End AK
                }

                var baseUrl = MyCampusApp.config.serverUrl; //"http://localhost:8081/";
                if ($rootScope.serverUrl != undefined) {
                    baseUrl = $rootScope.serverUrl;
                }
                if (!$rootScope.routeloaded) {
                    $rootScope.routeloaded = true;

                }
                MyCampusApp.updateAppLogos(tenant);
                if (window.device) {  //Check and update metadata

                    var processLogosDir = function (logosDir) {
                        var logosDirPath = logosDir.toNativeURL();
                        if ($rootScope.metadata) {
                            $rootScope.updateCheck = function () {
                                MyCampusApp.checkAndUpdateMetadata(tenant, baseUrl, $http, $rootScope.metadata.version, $route,
                                    $rootScope, $scope, $sce, logosDirPath, $compile);
                            };
                            MyCampusApp.checkAndUpdateMetadata(tenant, baseUrl, $http, $rootScope.metadata.version, $route,
                                $rootScope, $scope, $sce, logosDirPath, $compile);
                        } else {
                            $rootScope.updateCheck = function () {
                                MyCampusApp.checkAndUpdateMetadata(tenant, baseUrl, $http, -1, $route, $rootScope, $scope, $sce, logosDirPath, $compile);
                            };
                            MyCampusApp.checkAndUpdateMetadata(tenant, baseUrl, $http, -1, $route, $rootScope, $scope, $sce, logosDirPath, $compile);
                        }
                    };

                    var onFileSystemSuccess = function (fileSystem) {
                        fileSystem.root.getDirectory("MyCampusMobile-" + tenant, {create: true}, processLogosDir, null);
                    };

                    if (window.LocalFileSystem) {
                        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, null);
                    }

                } else {
                    $http.jsonp(baseUrl + "/metaData/index/" + tenant + "?callback=JSON_CALLBACK").
                        success(function (data) {
                        MyCampusApp.refreshMetdata(data, $rootScope, $scope, $sce, tenant, baseUrl, "", $route, $compile);
                    })
                }
            //} , 500);
            //Anonymous authentication..
            if(!$rootScope.frameworkSilentAuth) {
                $rootScope.frameworkSilentAuth = true;
                if ($rootScope.loggedin && window.device) {
                    try {
                        var username = $.jStorage.get('username');
                        var password = $.jStorage.get('password');
                        window['authFunction'](username, password, $http, $rootScope, function (data) {
                            if (data.error) {
                                var handler = function () {
                                    $rootScope.ticket = null;
                                    $rootScope.loggedin = false;
                                    $rootScope.userroles = null;
                                    $.jStorage.deleteKey('username');
                                    $.jStorage.deleteKey('password');
                                    $.jStorage.deleteKey('ticket');
                                    $.jStorage.deleteKey('userroles');
                                };
                                //navigator.notification.alert(data.error, handler, 'Authentication', 'Ok');
                                handler();
                            } else {
                                var ticket = data.ticket;
                                $rootScope.ticket = ticket;
                                $rootScope.userroles = data.roles;
                                $.jStorage.set('username', username);
                                $.jStorage.set('password', password);
                                $.jStorage.set('ticket', ticket);
                                $.jStorage.set('userroles', data.roles);
                                if ($rootScope.loggedin == true) {
                                } else {
                                    $rootScope.loggedin = true;
                                    $location.path("/home");
                                }
                            }
                        }, function (data) {
                            //alert("Error call back" + data);
                            var handler = function () {
                                $rootScope.ticket = null;
                                $rootScope.loggedin = false;
                                $rootScope.userroles = null;
                                $.jStorage.deleteKey('username');
                                $.jStorage.deleteKey('password');
                                $.jStorage.deleteKey('ticket');
                                $.jStorage.deleteKey('userroles');
                            };
                            //handler();
                            //navigator.notification.alert("Error occurred while processing this request.", handler, 'Authentication', 'Ok');
                        });
                    }catch(e) {
                        //ignore the exception as its silent authentication
                    }
                }
            }
        }])
    .controller('AppCtrl', ['$scope', '$routeParams', '$compile', '$http', '$rootScope', '$sce', '$window',
        '$location',
        function ($scope, $routeParams, $compile, $http, $rootScope, $sce, $window, $location) {
            MyCampusApp.homeScreenDisplayed = false;
            $scope.appname = $routeParams.appid;
            $scope.pageid = $routeParams.pageid;
            if ($scope.appname == $scope.pageid) {
                $rootScope.back = function () {
                    $location.path("/home");
                };
            } else {
                $rootScope.back = function () {
                    $window.history.back();
                };
            }
            $rootScope.showlogin = false;
            var appDef = function (appid) {
                var app;
                var i;
                for (i = 0; i < $scope.metadata.apps.length; i++) {
                    var tempApp = $scope.metadata.apps[i]
                    if (tempApp.id == appid || tempApp.name == appid) {
                        //alert (tempApp.name);
                        app = tempApp;
                        break;
                    }
                }
                return app;
            };
            var pageDef = function (appDefinition, pageId) {
                var pageDef;
                var i;
                for (i = 0; i < appDefinition.pages.length; i++) {
                    var tempPage = appDefinition.pages[i]
                    if (tempPage.pageid == pageId) {
                        //alert (tempApp.name);
                        pageDef = tempPage;
                        break;
                    }
                }
                return pageDef;
            };
            var appDefinition = appDef($scope.appname);
            var pageDefinition = pageDef(appDefinition, $scope.pageid);
            if(appDefinition.analytics) {
                /** Get the Tenant information **/
                var tenant = MyCampusApp.config.tenant;

                if ($.jStorage.get('tenant')) {
                    tenant = $.jStorage.get('tenant');
                }
                var baseUrl = MyCampusApp.config.serverUrl;
                MyCampusApp.logPageAccess(tenant, baseUrl, $http, appDefinition.id,
                    appDefinition.displayname, pageDefinition.pageid);
            }
            if (window.device && appDefinition.networkrequired) {
                var networkState = navigator.connection.type;
                if (networkState == "none" || networkState == "unknown") {
                    var backToPrevPage = function () {
                        $window.history.back();
                    };
                    navigator.notification.alert("Oops! You are not connected to Internet. Please check your settings and try again",
                        backToPrevPage, 'No Network', 'Ok');
                    return;
                }
            }
            try {
                $rootScope.appDisplayName = appDefinition.displayname;

                console.log("page Def : " + pageDefinition);
                window.eval(pageDefinition.pageprocessor);
                var pageProcessorName = 'pageprocessor' + pageDefinition.pageid;
                //Invoke the Pre processor

                if (window[pageProcessorName] != undefined) {
                    window[pageProcessorName](pageDefinition, $scope, $routeParams, $compile,
                        $http, $rootScope, $sce, $window, $location);
                }
            } catch (e) {

                $.unblockUI();
                apprise("Unknown error occurred while processing the request.", {'verify': false, 'textYes': "Ok"}, function (r) {
                    $rootScope.back();
                });
            }
        }])
    .controller('HelpCtrl', ['$scope', '$compile', '$location', '$rootScope', function ($scope, $compile, $location, $rootScope) {
        MyCampusApp.homeScreenDisplayed=false;
        $scope.firsttime = true;
        $rootScope.showlogin = false;
        if ($.jStorage.get('launchedonce')) {
            $scope.firsttime = false;
        }else {
            $scope.brandingUrl=MyCampusApp.config.tenant + "/branding.png";
            var helpcustostyle=".navbar {display:none;}.app-body {padding-top:0px !important;padding-bottom:0px !important;}";
            $("#helpcustomstyle").html(helpcustostyle);
            $.jStorage.set('launchedonce', 'true');
        }

        $scope.gohome = function() {
            $location.path("/home");
        }
    }])
    .controller('MainController', function ($rootScope, $scope, analytics) {

        $rootScope.$on("$routeChangeStart", function () {
            $rootScope.loading = true;
            $.blockUI();
        });

        $rootScope.$on("$routeChangeSuccess", function () {
            $rootScope.loading = false;
            $.unblockUI();
        });
    })
    .controller('AMakerHomeCtrl', ['$rootScope', '$scope', '$http', '$location', '$window', '$sce', '$route', '$compile',
        function ($rootScope, $scope, $http, $location, $window, $sce, $route, $compile) {
			//alert ("Appmaker home ctrl called");
			$('#customstyle').html("");
			$rootScope.backgroundUrl = "./images/block.png";
			$rootScope.brandingUrl = "./images/Banner-03.png";
                    $rootScope.ticket = null;
                    $rootScope.loggedin = false;
                    $.jStorage.deleteKey('username');
                    $.jStorage.deleteKey('password');
                    $.jStorage.deleteKey('ticket');
                    $.jStorage.deleteKey('userroles');

                    if( angular.isFunction( $rootScope["logoutcb"] ) ) {
                        $rootScope["logoutcb"]();
                    }

			$rootScope.appDisplayName = "KRYPTOS AppMaker";
			var url = "https://kryptos.kryptosmobile.com";
			$scope.loadApps = function(token) {
				var message = '<div style="margin: 2px; vertical-align: middle; display: inline-block"><i class="icon-cog icon-spin icon-4x"></i><h3 style="color:white;">Loading ..!!</h3></div>';
				$.blockUI({message : message});

				$http.get(url + "/api/mobapp/listMyApps?token=" + token).
					success(function (dt) {
						//alert ("List Apps data : " + d1);
						$rootScope.tenants = dt;
						$.unblockUI();
						if(dt.length == 1) {
							$location.search('appid',dt[0].appid).path('/launch/' + dt[0].tenantid);
						}
					}).error (function(edata, status) {
						$.unblockUI();
						if(status == 403) {
                        	var username = $.jStorage.get('kusername');
                        	var password = $.jStorage.get('kpassword');

							$http.post(url + "/api/authenticate" , {username : username, password : password}).
								success(function(data) {
									$rootScope.klogin = true;
									$.jStorage.set('kusername', username);
									$.jStorage.set('kpassword', password);
									$.jStorage.set('ktoken', data.token);
									$.unblockUI();
									//alert ("Login success : " + data.token);
									$scope.loadApps(data.token);
								}).error(function(data){
									$.unblockUI();
									apprise(data, {'verify': false, 'textYes': "Ok"}, function (r) {
                					});
								}
							);
						}
				});
			}

			if ($.jStorage.get('kusername')) {
				$rootScope.klogin = true;
				$scope.loadApps($.jStorage.get('ktoken'));
			} else {
				$rootScope.klogin = false;
			}

			$scope.klogout = function() {
				$rootScope.klogin = false;
				$.jStorage.deleteKey('kusername');
				$.jStorage.deleteKey('kpassword');
				$.jStorage.deleteKey('ktoken');
			};

			$scope.login = function() {
 				if ($("#loginUsername").val().length == 0) {
                    navigator.notification.alert('Please enter your username');
                    return false;
                }
                if ($("#loginPassword").val().length == 0) {
                    navigator.notification.alert('Please enter your password');
                    return false;
                }
                var username = $("#loginUsername").val();
                var password = $("#loginPassword").val();
                var networkState = navigator.connection.type;
                if (networkState == "none" || networkState == "unknown") {
					var errorCB = function() {
					};
					navigator.notification.alert("Oops! You are not connected to Internet. Please check your settings and try again",
					    errorCB, 'No Network', 'Ok');
					return;
				}
				var message = '<div style="margin: 2px; vertical-align: middle; display: inline-block"><i class="icon-cog icon-spin icon-4x"></i><h3 style="color:white;">Authenticating</h3></div>';
				$.blockUI({message : message});

				$http.post(url + "/api/authenticate" , {username : username, password : password}).
					success(function(data) {
						$rootScope.klogin = true;
                        $.jStorage.set('kusername', username);
                        $.jStorage.set('kpassword', password);
                        $.jStorage.set('ktoken', data.token);
						$.unblockUI();
						//alert ("Login success : " + data.token);
						$scope.loadApps(data.token);
					}).error(function(data){
						$.unblockUI();
						var errorCB = function() {
						};
						navigator.notification.alert(data,
                        	errorCB, 'Authentication', 'Ok');
                	}
                );
			}
    }])
    .controller('LaunchCtrl', ['$rootScope', '$scope', '$http', '$location', '$window', '$sce', '$route', '$compile','$routeParams',
        function ($rootScope, $scope, $http, $location, $window, $sce, $route, $compile, $routeParams) {

			$scope.klogout = function() {
				$rootScope.klogin = false;
				$.jStorage.deleteKey('kusername');
				$.jStorage.deleteKey('kpassword');
				$.jStorage.deleteKey('ktoken');
				$rootScope.$apply(function () {
						$location.path("/junk");
				});
			};
			var tenant = $routeParams.tenant;
			var appid = $routeParams.appid;
			$rootScope.ktenant = tenant;
			$rootScope.kappid = appid;
			//alert ("Launch control called with : " + $routeParams.tenant);
			try {

                if(!$rootScope.homeDownloadCompleteAdded) {
                    $rootScope.$on("onDownloadComplete", function(event, data) {
                        $.unblockUI();
                        $rootScope.$apply(function () {
                            $location.path("/home");
                        });
                    });
                    $rootScope.homeDownloadCompleteAdded = true;
                }
			MyCampusApp.config.tenant = $routeParams.tenant;

			MyCampusApp.config.serverUrl = "https://kryptos.kryptosmobile.com";
			$rootScope.backgroundUrl = MyCampusApp.config.serverUrl + "/metaData/background/" + tenant;
			$rootScope.brandingUrl = MyCampusApp.config.serverUrl + "/metaData/branding/" + tenant;

			$scope.launchApp = function() {

                var networkState = navigator.connection.type;
                if (networkState == "none" || networkState == "unknown") {
					var errorCB = function() {
					};
					navigator.notification.alert("Oops! You are not connected to Internet. Please check your settings and try again",
					    errorCB, 'No Network', 'Ok');
					return;
				}

			var message = '<div style="margin: 2px; vertical-align: middle; display: inline-block"><i class="icon-cog icon-spin icon-4x"></i><h3 style="color:white;">Loading the App..</h3></div>';
			$.blockUI({message : message});

				var baseUrl = MyCampusApp.config.serverUrl;
				$.jStorage.deleteKey(tenant + '-metadata');
				var processLogosDir = function (logosDir) {
					var logosDirPath = logosDir.toNativeURL();
					MyCampusApp.checkAndUpdateMetadata(tenant, baseUrl, $http, -1, $route, $rootScope, $scope, $sce, logosDirPath, $compile, true);
					$rootScope.$apply(function () {
						setTimeout(function () {
							//$location.path("/home");
						},10000);
						//$location.reload();
					});
					//$location.path("/home");
					//$location.reload();
					//alert ("After location reload");
				};

				var onFileSystemSuccess = function (fileSystem) {
					fileSystem.root.getDirectory("MyCampusMobile-" + tenant, {create: true}, processLogosDir, null);
				};

				if (window.LocalFileSystem) {
					window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, null);
				}
			}
		}catch(e) {
			alert ("Exception : " + e);
		}
	}])
	.controller('ApplicationsCtrl', ['$rootScope', '$scope', '$http', '$location', '$window', '$sce', '$route', '$compile','$routeParams',
        function ($rootScope, $scope, $http, $location, $window, $sce, $route, $compile, $routeParams) {
			$rootScope.showlogin = false;
			$rootScope.back = function() {
	            $window.history.back();
	        };
			$rootScope.ktenant;
			$rootScope.kappid;
			var url = "https://kryptos.kryptosmobile.com";
			$scope.loadApplications = function(token) {
				var message = '<div style="margin: 2px; vertical-align: middle; display: inline-block"><i class="icon-cog icon-spin icon-4x"></i><h3 style="color:white;">Loading App..!!</h3></div>';
				$.blockUI({message : message});

				$http.get(url + "/api/mobapp/appFeatures?id=" + $rootScope.kappid + "&token=" + token).
					success(function (d1) {
						$scope.appFeatures = d1;
						$.unblockUI();
					}).error (function(edata) {
						$.unblockUI();
						alert ("Error in appFeatures : " + edata);
				});
			}
			$scope.loadApplications($.jStorage.get('ktoken'));

		}]);
