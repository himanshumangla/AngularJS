'use strict';
// Declare app level module which depends on filters, and services
angular.module('myApp', [
        'ngRoute',
        "mobile-angular-ui",
        "mobile-angular-ui.touch",
        "mobile-angular-ui.scrollable",
        //'ngTouch',
        'myApp.filters',
        'myApp.services',
        'myApp.directives',
        'myApp.controllers'
        //'ui.bootstrap'
    ]).
    config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
        $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
        $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
        $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'});
        $routeProvider.when('/amakerhome', {templateUrl: 'partials/amakerhome.html', controller: 'AMakerHomeCtrl'});
        $routeProvider.when('/settings', {templateUrl: 'partials/settings.html', controller: 'SettingsCtrl'});
        $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'});
        $routeProvider.when('/device', {templateUrl: 'partials/device.html', controller: 'DeviceCtrl'});
        $routeProvider.when('/help', {templateUrl: 'partials/help.html', controller: 'HelpCtrl'});
        $routeProvider.when('/about', {templateUrl: 'partials/about.html', controller: 'AboutCtrl'});
        $routeProvider.when('/schoollist', {templateUrl: 'partials/schoollist.html', controller: 'SchoolListCtrl'});
        $routeProvider.when('/sendfeedback', {templateUrl: 'partials/feedback.html', controller: 'SendFeedbackCtrl'});
        $routeProvider.when('/reportissue', {templateUrl: 'partials/reportissue.html', controller: 'ReportIssueCtrl'});
        $routeProvider.when('/app/:appid/:pageid', {templateUrl: 'partials/app.html', controller: 'AppCtrl'});
        $routeProvider.when('/launch/:tenant', {templateUrl: 'partials/partial1.html', controller: 'LaunchCtrl'});
        $routeProvider.when('/applications', {templateUrl: 'partials/applications.html', controller: 'ApplicationsCtrl'});
        //$routeProvider.otherwise({redirectTo: '/amakerhome'});
        $routeProvider.otherwise({redirectTo: '/home'});
        $httpProvider.defaults.timeout = 5000;
    }])
    .service('analytics', [
    '$rootScope', '$window', '$location', function($rootScope, $window, $location) {
        var send = function(evt, data) {
            ga('send', evt, data);
        }
    }
]);

var onDeviceReady = function() {
    angular.bootstrap( document, ['myApp']);
    var handleOrientation = function() {
        if (orientation == 0) {
            if(MyCampusApp.homeScreenDisplayed) {
                MyCampusApp.currentPage = 1;
                setTimeout(function(){MyCampusApp.homeRoute.reload()},400);
            }
        } else if (orientation == 90) {
            if(MyCampusApp.homeScreenDisplayed) {
                MyCampusApp.currentPage = 1;
                setTimeout(function(){MyCampusApp.homeRoute.reload()},400);
            }
        } else if (orientation == -90) {
            if(MyCampusApp.homeScreenDisplayed) {
                MyCampusApp.currentPage = 1;
                setTimeout(function(){MyCampusApp.homeRoute.reload()},400);
            }
        } else if (orientation == 180) {
            if(MyCampusApp.homeScreenDisplayed) {
                MyCampusApp.currentPage = 1;
                setTimeout(function(){MyCampusApp.homeRoute.reload()},400);
            }
        } else {}
    }
    window.handleOrientation = handleOrientation;
    window.addEventListener('orientationchange', handleOrientation, false);
}

document.addEventListener('deviceready',onDeviceReady, false);


var MyCampusApp = {
    config : {
        tenant : "DTC",
        serverUrl : "https://kryptos.kryptosmobile.com",
        tenantFolder : function(device, tenant) {
            if(device.platform == 'Android') {
                return "file://MyCampusMobile-" + tenant + "/";
            } else {
                return "file://MyCampusMobile-" + tenant + "/";
            }
        }
    } ,
    homeRoute : null,
    initMode: false,
    modalDialogDisplayed: false,
    homeScreenDisplayed : true,
    rootScope : null,
    currentPage : 1,
    //debugMode: window.tinyHippos != undefined,

    init : function(){
        MyCampusApp.initMode = true;
        document.addEventListener('deviceready', MyCampusApp.deviceReadyHandler, false);

    },

    isAppAuthorized : function(app, $rootScope) {
        var retval = false;
        if(!$rootScope.userroles) {
            return true;
        }
        if(app.appFeatureType == 'Public') {
            retval = true;
        }else {
            if(app.roles == null || app.roles.trim().length == 0) {
                retval = true;
            }else {
                var roles = app.roles.split(",");
                var added = false;
                for(var i=0;i<roles.length; i++) {
                    var role = roles[i];
                    if(added) {
                        break;
                    }
                    for(var j=0;j<$rootScope.userroles.length; j++) {
                        if($rootScope.userroles[j] == role) {
                            retval = true;
                            added = true;
                            break;
                        }
                    }
                }
            }
        }
        return retval;
    },
    fillRootScopeForHome : function($rootScope, $sce, tenant, $window, $location, $route, $http, $scope, $compile) {
        MyCampusApp.homeScreenDisplayed=true;
        MyCampusApp.rootScope = $rootScope;
        $.KNMonitor.initialize($rootScope);
        var storedMetadata =  $.jStorage.get( tenant + '-metadata'); //window.localStorage.getItem('metadata');
        //If Metadata doesn't exist in the local storage. Then this app is launched for the first time.
        //Lets pull the default metadata file.
        if(!storedMetadata) {
            $http.get("default-metadata.json").success(function(data){
                var tenantid = data.tenantid
                $.jStorage.set(tenantid + '-metadata', data);
                MyCampusApp.config.tenant = tenantid;
                $rootScope.tenant = tenantid;
                $.jStorage.set('tenant', tenantid);
                storedMetadata = data;

                if(window.device && data.pushconfig) {
                    MyCampusApp.activatePushNotification(tenantid, data.pushconfig);
                }
               // var message = '<div style="margin: 2px; vertical-align: middle; display: inline-block"><i class="icon-cog icon-spin icon-4x"></i><h3 style="color:white;">Initializing..</h3></div>';
                var message = '<style>.blockOverlay{opacity:1 !important;}</style><div style="margin:auto;position:fixed;left:0px;right:0px;vertical-align: middle; display: inline-block;"><i class="icon-cog icon-spin icon-4x"></i><h3 style="color:white;">Initializing..</h3></div>';
                $.blockUI({message : message});
                setTimeout(function() {
                    $.unblockUI();
                    if ($.jStorage.get('launchedonce')) {
                        $route.reload();
                    }else {
                        $route.reload();
                        $rootScope.$apply(function () {
                            $location.path("/help");
                        });
                    }
                },4000);
            }).error(function(data){
                });
        }
        
        //Store update bug fix start (Nick)
        else {
			if(!$rootScope.imageoptimized) {
				$http.get("default-metadata.json").success(function(data){
                                                           $rootScope.imageoptimized = true;
                                                           if(data.version >= storedMetadata.version) {
                                                           var tenantid = data.tenantid
                                                           $.jStorage.set(tenantid + '-metadata', data);
                                                           MyCampusApp.config.tenant = tenantid;
                                                           $rootScope.tenant = tenantid;
                                                           $.jStorage.set('tenant', tenantid);
                                                           storedMetadata = data;
                                                           $rootScope.brandingUrl = storedMetadata.brandingurl + "?q=" + Math.random();
                                                           $rootScope.backgroundUrl = storedMetadata.backgroundurl + "?q=" + Math.random();
                                                           var message = '<div style="margin: auto; vertical-align: middle; display: inline-block;position:fixed;left:0px;right:0px;"><i class="icon-cog icon-spin icon-4x"></i><h3 style="color:white;">Starting up</h3></div>';
                                                           $.blockUI({message : message});
                                                           setTimeout(function() {
                                                                      $.unblockUI();
                                                                      $route.reload();
                                                                      },5000);
                                                           }
                                                           }).error(function(data){
                                                                    });
			}
		}
        //Store update bug fix end (Nick)
        
        if(storedMetadata) {
            if($rootScope.loggedin) {
                if($rootScope.userroles) {
                   var authorizedApps = [];
                    $.each(storedMetadata.apps, function(index, val) {
                        if(MyCampusApp.isAppAuthorized(val, $rootScope)) {
                            authorizedApps.push(val);
                        }
                    });
                    $rootScope.apps = authorizedApps;
                } else {
                    $rootScope.apps = storedMetadata.apps;
                }
            } else {
                var publicApps = [];
                $.each(storedMetadata.apps, function(index, val) {
                    if(val.appFeatureType == 'Public') {
                        publicApps.push(val);
                    }
                });
                $rootScope.apps = publicApps;
            }

            //AK app grouping
            var appgroups = [];
            var findGroup = function(groupname) {
                var data = null;
                $.each(appgroups, function(index, val) {
                    if(val.appFeatureType == groupname) {
                        data = val;
                    }
                });
                return data;
            }
            $.each($rootScope.apps, function(index, val) {
                if(val.appFeatureType == 'Public') {
                    if(window.device) {
                        $rootScope.apps[index].logo=$rootScope.apps[index].logo + "?q=" + Math.random()
                    }
                }
                var group = findGroup(val.appFeatureType);
                if(group) {
                    group.apps.push(val);
                }else {
                    group = {appFeatureType : val.appFeatureType, apps : [val]};
                    appgroups.push(group);
                }
            });
            $rootScope.appgroups = appgroups;
            $rootScope.appDisplayName = storedMetadata.appDisplayName;
            $rootScope.metadata = storedMetadata;
            $rootScope.middlewareServerUrl = storedMetadata.middlewareServerUrl;
            $rootScope.customStyle = $sce.trustAs($sce.CSS, storedMetadata.customStyle);

            $('#customstyle').html(storedMetadata.customStyle);
            try {
                var data1 = $compile($(storedMetadata.homeScreenTemplate))($scope);
                $("#homecontent").html(data1);
            }catch(exce) {
                //Ignore..
            }
            window.eval(storedMetadata.authFunction);
        }

        if( $.jStorage.get('serverUrl') ) { // window.localStorage.getItem('serverUrl') ) {
            $rootScope.serverUrl =  $.jStorage.get('serverUrl');  //window.localStorage.getItem('serverUrl');
        }
        if( $.jStorage.get('tenant') ) {//window.localStorage.getItem('tenant') ) {
            $rootScope.tenant = $.jStorage.get('tenant'); //window.localStorage.getItem('tenant');
        }

        $rootScope.setRoute = function (route) {
            $location.path(route);
        };
        $rootScope.logout = function() {
            var logoutcleanup = function(buttonIndex) {
                if(buttonIndex == 1) {
                    $rootScope.ticket = null;
                    $rootScope.loggedin = false;
                    $.jStorage.deleteKey('username');
                    $.jStorage.deleteKey('password');
                    $.jStorage.deleteKey('ticket');

                    if( angular.isFunction( $rootScope["logoutcb"] ) ) {
                        $rootScope["logoutcb"]();
                    }
                    $route.reload();
                }
            };
            if(window.device) {
                navigator.notification.confirm(
                    'Are you sure you want to logout?', // message
                    logoutcleanup,            // callback to invoke with index of button pressed
                    'Just Confirming',           // title
                    ['Yes','No']         // buttonLabels
                );
            }else {
                apprise("Are you sure you want to logout?", {'verify':true, 'textYes':"Yes", 'textNo':"No"}, function(r) {
                    if(r) {
                        logoutcleanup(1);
                    }
                    else {
                        MyCampusApp.modalDialogDisplayed = false;
                    }
                });
            }

        };
        $rootScope.loginlogout = function() {
            if($rootScope.loggedin) {
                $rootScope.logout();
            }else {
                $rootScope.setRoute("/login");
            }
        };
        $rootScope.back = function() {
            $window.history.back();
        };
        $rootScope.showlogin=true;
        if(window.device) {
            if($rootScope.metadata) {
                if(!$rootScope.brandingUrl) {
                    $rootScope.brandingUrl = $rootScope.metadata.brandingurl + "?q=" + Math.random();
                }
                if(!$rootScope.backgroundUrl) {
                    $rootScope.backgroundUrl = $rootScope.metadata.backgroundurl + "?q=" + Math.random();
                }
            }
        }else {
            if(!$rootScope.brandingUrl) {
                $rootScope.brandingUrl = "/metaData/branding/q=" + Math.random();
            }
            if(!$rootScope.backgroundUrl) {
                $rootScope.backgroundUrl = "/metaData/background/q=" + Math.random();
            }
        }

        $rootScope.leftswipe = function() {
            $rootScope.stage.next();
        }
        $rootScope.rightswipe = function() {
            $rootScope.stage.previous();
        }
    },

    deviceReadyHandler : function() {
        document.addEventListener("backbutton", MyCampusApp.backButtonHandler, true);
        document.addEventListener('pause', MyCampusApp.pauseHandler, false);
        document.addEventListener('resume', MyCampusApp.resumeHandler, false);
        document.addEventListener('online', MyCampusApp.onlineHandler, false);
        document.addEventListener('offline', MyCampusApp.offlineHandler, false);
    },
    backButtonHandler: function() {
        $.unblockUI();
        if(MyCampusApp.homeScreenDisplayed) {
            var onConfirm = function(buttonIndex) {
                if(buttonIndex == 1) {
                    navigator.app.exitApp();
                }
            };
            if(window.device) {
                navigator.notification.confirm(
                    'Are you sure you want to exit?', // message
                    onConfirm,            // callback to invoke with index of button pressed
                    'Just Confirming',           // title
                    ['Yes','No']         // buttonLabels
                );
            }else {
                apprise("Are you sure you want to exit?", {'verify':true, 'textYes':"Yes", 'textNo':"No"}, function(r) {
                    if(r) {
                        navigator.app.exitApp();
                    }
                    else MyCampusApp.modalDialogDisplayed = false;
                });
            }
        }else {
            navigator.app.backHistory();
        }
    },

    pauseHandler: function(){

    },

    resumeHandler: function(){
        try {
            $.unblockUI();
			if(MyCampusApp.rootScope) {
				MyCampusApp.rootScope.updateCheck();
			}
        }catch(e) {
            //alert("Exception in Resume handler : " + e);
        }
    },

    onlineHandler: function(){
        try {
            //alert("Online Called");
            var rootScope = MyCampusApp.rootScope;
            rootScope.$broadcast("onOnline", "Device is Online");
        }catch(e) {
            //alert("Exception in Online handler : " + e);
        }
    },

    offlineHandler: function(){
        try {
            //alert("Online Called");
            var rootScope = MyCampusApp.rootScope;
            rootScope.$broadcast("onOffline", "Device is Offline");
        }catch(e) {
            //alert("Exception in Online handler : " + e);
        }
    },

    updateAppLogos : function(tenant) {

        var processLogosDir = function(logosDir) {
            var reader = logosDir.createReader();
            reader.readEntries(function(entries){
                for (var i=0; i<entries.length; i++) {
                    if(entries[i].name == 'branding') {
                    }else {
                    }
                }
            },null);

        };

        var onFileSystemSuccess =  function(fileSystem) {
            fileSystem.root.getDirectory("MyCampusMobile-" + tenant ,{create:true},processLogosDir,null);
        };

        if(window.LocalFileSystem) {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, null);
        }
        //fileSystem.root.getDirectory("Android/data/org.campuseai." + tenant + ".appLogos",{create:true},gotDir,onError);
    },

    checkAndUpdateMetadata : function(tenant, url, $http, currentVersion,  $route, $rootScope, $scope, $sce, logosDirPath, $compile, silent) {
        $http.post(url + "/metagate/updatecheck/" + tenant + "?callback=JSON_CALLBACK", {device: window.device}).
            success(function(data) {
                if(data.version != currentVersion) {
                    var onConfirm = function(buttonIndex) {
                        if(buttonIndex == 1) {
                            MyCampusApp.updateMetadata(tenant, url, $http, data, $route, $rootScope, $scope, $sce, logosDirPath, $compile);
                        }
                        $rootScope.umalert = false;
                    };
                    if(!silent) {
						if(window.device) {
							if(!$rootScope.umalert) {
								$rootScope.umalert = true;
								navigator.notification.confirm(
									'App Updates available. Update?', // message
									onConfirm,            // callback to invoke with index of button pressed
									'Update Manager',           // title
									['Yes','No']         // buttonLabels
								);
							}
						}else {
							apprise("App Updates available. Update? ", {'verify':true, 'textYes':"Yes", 'textNo':"No"}, function(r) {
								if(r) {
									//navigator.app.exitApp();
									MyCampusApp.updateMetadata(tenant, url, $http, data, $route, $rootScope, $scope, $sce, logosDirPath, $compile);
								} else MyCampusApp.modalDialogDisplayed = false;
							});
						}
					}else {
						onConfirm(1);
					}
                }
            });
    },

    updateMetadata : function(tenant, url, $http, data, $route, $rootScope, $scope, $sce, logosDirPath, $compile) {
        $.blockUI();
        $http.post(url + "/metagate/metadata/" + tenant + "?callback=JSON_CALLBACK", {source: data.source, id : data.id, device: window.device}).
            success(function(data) {
                if(window.device && data.pushconfig) {
                    MyCampusApp.activatePushNotification(tenant, data.pushconfig);
                }
                MyCampusApp.refreshMetdata(data, $rootScope, $scope, $sce, tenant, url, logosDirPath, $route, $compile);
                //$.jStorage.set(tenant + '-metadata', data);
               // $route.reload();
            }).
            error(function(date) {
                $.unblockUI();
            });
    },

    refreshMetdata : function(data, $rootScope, $scope, $sce, tenant, baseUrl, logosDirPath, $route, $compile) {

        //window.localStorage.setItem('metadata', data);
        var message = '<div style="margin: 2px; vertical-align: middle; display: inline-block"><i class="icon-cog icon-spin icon-4x"></i><h3 style="color:white;">Initializing</h3></div>';
        //$.blockUI({message : message});
        //$.blockUI();
        if(window.device) {
            data.brandingurl = logosDirPath + "/" +  "branding";
            data.backgroundurl = logosDirPath + "/" + "background";
        }
        var allIcons, allScreens, dock, dockIcons, icon, stage, _i, _len, _results;
        allIcons = [];
        dockIcons = [];
        $.each(data.apps, function(index, val) {
            if(window.device) {
                data.apps[index].logo = logosDirPath + "/" + val.name;
            }else {
                data.apps[index].logo = "/metaData/appLogo/" + val.id;
            }

            if(MyCampusApp.isAppAuthorized(val, $rootScope)) {
                if($rootScope.loggedin || val.appFeatureType == 'Public') {
                    if(val.showInHome) {
                        allIcons.push(new Icon(val.name, val.displayname, "#app/" + val.name + "/" + val.name, val.logo));
                    }
                    if(val.showInDock) {
                        dockIcons.push(new DockIcon(val.name, val.displayname, "#app/" + val.name + "/" + val.name, val.logo));
                    }
                }else if(val.appFeatureType == 'Public') {
                    if(val.showInHome) {
                        allIcons.push(new Icon(val.name, val.displayname, "#app/" + val.name + "/" + val.name, val.logo));
                    }
                    if(val.showInDock) {
                        dockIcons.push(new DockIcon(val.name, val.displayname, "#app/" + val.name + "/" + val.name, val.logo));
                    }
                }
            }
        });
        $rootScope.customStyle = $sce.trustAs($sce.CSS, data.customStyle);
        try {
            var data1 = $compile($(data.homeScreenTemplate))($scope);
            $("#homecontent").html(data1);
        }catch(exce) {
            //Ignore..
        }

        $('#customstyle').html(data.customStyle);


        //allIcons = [new Icon('Photos', 'Photo Gallery'), new Icon('Maps', 'Google Maps'), new Icon('Chuzzle', 'Chuzzle'), new Icon('Safari', 'Safari'), new Icon('Weather', 'Weather'), new Icon('nes', 'NES Emulator'), new Icon('Calendar', 'Calendar'), new Icon('Clock', 'Clock'), new Icon('BossPrefs', 'Boss Prefs'), new Icon('Chess', 'Chess'), new Icon('Mail', 'Mail'), new Icon('Phone', 'Phone'), new Icon('SMS', 'SMS Center'), new Icon('Camera', 'Camera'), new Icon('iPod', 'iPod'), new Icon('Calculator', 'Calculator'), new Icon('Music', 'Music'), new Icon('Poof', 'Poof'), new Icon('Settings', 'Settings'), new Icon('YouTube', 'Youtube'), new Icon('psx4all', 'PSx4All'), new Icon('VideoRecorder', 'Record Video'), new Icon('Installer', 'Installer'), new Icon('Notes', 'Notes'), new Icon('RagingThunder', 'RagingThunder'), new Icon('Stocks', 'Stocks'), new Icon('genesis4iphone', 'Genesis'), new Icon('snes4iphone', 'SNES Emulator'), new Icon('Calendar', 'Calendar'), new Icon('Clock', 'Clock'), new Icon('Photos', 'Photo Gallery'), new Icon('Maps', 'Google Maps')];
        //dockIcons = [new DockIcon('Camera', 'Camera'), new DockIcon('iPod', 'iPod'), new DockIcon('Calculator', 'Calculator')];
        var docWidth  = $(document).width();
        var winWidth = $(window).width();
        if(docWidth != winWidth) {
            docWidth = docWidth - 15;
        }
        if(docWidth >= 768) {

        }

        Stage.prototype.screenWidth = docWidth; //$(window).width() + 16;
        allScreens = $('#allScreens');
        allScreens.html("");
        //allScreens.Touchable();
        if($.isNumeric(data.iconWidth)) {
            stage = new Stage(allIcons, data.iconWidth);
        }else {
            stage = new Stage(allIcons, 64);
        }

        stage.addScreensTo(allScreens);
        stage.addIndicatorsTo('#indicators');
        $rootScope.stage=stage;
        dock = $('#dock');
        dock.html("");
        _results = [];
        for (_i = 0, _len = dockIcons.length; _i < _len; _i++) {
            icon = dockIcons[_i];
            _results.push(dock.append(icon.markup));
        }
        
        
        /* Commenting for icon issue during update manager - Start (Nick)
        var homedata = $("#homedata");
        homedata.html("");
        var iconwidth = 64;
        var sampleicon = $('#sampleicon');
        var calculated = sampleicon.outerWidth(true);
        if(calculated != 0) {
            iconwidth = sampleicon.outerWidth(true) + 24;
        }
        var width = $(window).width() > 780 ? $(window).width() - 280 : $(window).width();
        var cols =  Math.floor(width / iconwidth);
        var rows = Math.floor(($(window).height() - 200) / iconwidth);

        for (_i = 0, _len = allIcons.length; _i < _len; _i++) {
            icon = allIcons[_i];
            var markup = '<li><a href="' + icon.url + '"><img src="' + icon.logourl + '" class="icon"></img></a>' +
                '<div class="campuseai-Info text-center" style="width:' + calculated + 'px;overflow:hidden;text-overflow: ellipsis;">'
                + icon.title + '</div></li>';
            homedata.append(markup);
        }

        //AK added for promptumenu
        $("#homedata").promptumenu({
            width:(width - 24),
            height:($(window).height() - 200),
            rows: rows,
            columns: cols,
            direction: 'horizontal',
            pages: true
        });
        //End AK
         
         Commenting for icon issue during update manager - end (Nick)*/
         
        /*
         if(window.device) {
         $rootScope.brandingUrl = MyCampusApp.config.tenantFolder(window.device, tenant) + "branding?q=" + Math.random();
         $rootScope.backgroundUrl = MyCampusApp.config.tenantFolder(window.device, tenant) + "background?q=" + Math.random();
         }
         */

        /*
         $.each(data.apps, function(index, val) {
         if(window.device) {
         //data.apps[index].logo = "file://Android/data/org.campuseai." + tenant + ".appLogos/" + val.name;
         data.apps[index].logo = MyCampusApp.config.tenantFolder(window.device, tenant) + val.name;
         }else {
         data.apps[index].logo = "/comet/metaData/appLogo/" + val.id;
         }
         });
         */

        $.jStorage.set(tenant + '-metadata', data);

        if($rootScope.loggedin) {
            $rootScope.apps = data.apps;
        } else {
            var publicApps = [];
            $.each(data.apps, function(index, val) {
                if(val.appFeatureType == 'Public') {
                    publicApps.push(val);
                }
            });
            $rootScope.apps = publicApps;
        }

        //AK app grouping
        var appgroups = [];
        var findGroup = function(groupname) {
            var data = null;
            $.each(appgroups, function(index, val) {
                if(val.appFeatureType == groupname) {
                    data = val;
                }
            });
            return data;
        }
        $.each($rootScope.apps, function(index, val) {
            var group = findGroup(val.appFeatureType);
            if(group) {
                group.apps.push(val);
            }else {
                group = {appFeatureType : val.appFeatureType, apps : [val]};
                appgroups.push(group);
            }
        });
        $rootScope.appgroups = appgroups;
        console.log("App groups " + appgroups);
        $rootScope.appDisplayName = data.appDisplayName;
        $rootScope.metadata = data;
        $rootScope.middlewareServerUrl = data.middlewareServerUrl;
        $rootScope.customStyle = $sce.trustAs($sce.CSS, data.customStyle);
            $('#customstyle').html(data.customStyle);
        window.eval(data.authFunction);
        console.log($scope.apps);
        console.log($rootScope.appDisplayName);
        var downcounter = 0;
        var onError = function(e){
            downcounter--;
            $.unblockUI();
            console.log("ERROR");
            console.log(JSON.stringify(e));
            alert ("Error inside onError : " + JSON.stringify(e));

        };

        var onFileSystemSuccess = function(fileSystem) {

            var  gotDir = function(d){
                var message = '<div style="margin: 2px; vertical-align: middle; display: inline-block"><i class="icon-cog icon-spin icon-4x"></i><h3>Installing Updates.!</h3></div>';
                //$.blockUI({message : message});
                //$.blockUI();

                console.log("got dir");
                var DATADIR = d;
                var reader = DATADIR.createReader();

                var ft = new FileTransfer();

                //var DATADIR = "Android/data/org.campuseai." + tenant + "/appLogos";

                //console.log("downloading crap to " + dlPath);
                var url = baseUrl + "/metaData/branding/" + tenant + "?q=" + Math.random();
                var dlPath = DATADIR.toURL() + "/branding";
                downcounter++;
                ft.download(url, dlPath, function(){
                    downcounter--;
                    /*message = '<div style="margin: 2px; vertical-align: middle; display: inline-block"><i class="icon-cog icon-spin icon-4x"></i><h3>Branding completed.!</h3></div>';
                     $.blockUI({message : message});
                     setTimeout(function() {
                     $.unblockUI();
                     },1000);*/

                    //renderPicture(dlPath);
                    //$('#branding').attr('src', dlPath);
                }, onError, true);

                url = baseUrl + "/metaData/background/" + tenant + "?q=" + Math.random();
                dlPath = DATADIR.toURL() + "/background";
                /*message = '<div style="margin: 2px; vertical-align: middle; display: inline-block"><i class="icon-cog icon-spin icon-4x"></i><h3>Downloading background.!</h3></div>';
                 $.blockUI({message : message});*/
                downcounter++;
                ft.download(url, dlPath, function(){
                    downcounter--;
                    /*message = '<div style="margin: 2px; vertical-align: middle; display: inline-block"><i class="icon-cog icon-spin icon-4x"></i><h3>Background completed.!</h3></div>';
                     $.blockUI({message : message});
                     setTimeout(function() {
                     $.unblockUI();
                     },1000);*/
                    //renderPicture(dlPath);
                    //$('#branding').attr('src', dlPath);
                }, onError, true);

                $.each(data.apps, function(index, val) {
                    url = baseUrl + "/metaData/appLogo/" + val.id
                    dlPath = DATADIR.toURL() + "/" + val.name;
                    /*message = '<div style="margin: 2px; vertical-align: middle; display: inline-block"><i class="icon-cog icon-spin icon-4x"></i><h3>Downloading ' + val.id + ' icons.!</h3></div>';
                     $.blockUI({message : message});*/
                    downcounter++;
                    ft = new FileTransfer();
                    ft.download(url, dlPath, function(){
                        downcounter--;
                        /*message = '<div style="margin: 2px; vertical-align: middle; display: inline-block"><i class="icon-cog icon-spin icon-4x"></i><h3>' + val.id + ' icon Downloaded.!</h3></div>';
                         $.blockUI({message : message});
                         setTimeout(function() {
                         $.unblockUI();
                         },1000);*/
                        //renderPicture(dlPath);
                        //$('#logo-' + val.name).attr('src', dlPath);
                    }, onError, true);

                });
                (function loop(){
                    setTimeout(function() {
						//alert ("Inside loop.." + downcounter);
                        if(downcounter == 0) {
                            //$route.reload();
                            //$rootScope.broadcast("");
                            //alert ("Inside downcounter 0.." + downcounter);
                            try{
                            $rootScope.$broadcast("onDownloadComplete", "Download Completed");
                            //alert ("Broadcast called..");
                            setTimeout(function() {
                                $.unblockUI();
                            },2000);
						}catch(exce) {
							//alert ("Exception .." + exce);
						}

                        } else {
                            loop();
                        }
                    },2000);
                })();
//                    setTimeout(function() {
//                        $route.reload();
//                    },1000);

                /*setTimeout(function() {
                 MyCampusApp.updateAppLogos(tenant);
                 }, 5000);*/
            };
            fileSystem.root.getDirectory("MyCampusMobile-" + tenant ,{create:true},gotDir,onError);
        };

        if(window.LocalFileSystem) {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, null);
        }
        setTimeout(function() {
            if(!window.device) {
                $.unblockUI();
            }
        }, 2000);
        //$scope.$apply();
    },

    invokeService : function($rootScope, $http, endpoint, method, data, successCB, errorCB ) {
        var serviceurl = $rootScope.middlewareServerUrl + endpoint;
        var isLogin = endpoint.indexOf("login") != -1;
        if($rootScope.ticket) {
            if(serviceurl.indexOf("?") != -1) {
                serviceurl=serviceurl + "&ticket=" + $rootScope.ticket;
            }else {
                serviceurl=serviceurl + "?ticket=" + $rootScope.ticket;
            }
        }
        var url = "";
        var proxyMethod = method;
        var proxyData = data;
        if(window.device) {
            url = serviceurl;
        }else {
            url = "/websimulator/json?url=" + serviceurl;
            proxyMethod = "POST";
            proxyData =  {method:method, body:data}
        }
        $http({method:proxyMethod, url: url, data: proxyData}).
            success(function(data, status, headers, config) {
                successCB(data, status, headers, config);
            }).
            error(function(data, status, headers, config) {

                if(!isLogin) {
                    alert ("Ticket might have expired.. silent authenticating");
                    MyCampusApp.silentAuth($rootScope, $http, function(data, status, headers, config) {
                        MyCampusApp.invokeService($rootScope, $http, endpoint, method, data, successCB, errorCB);
                    }, function() {

                    });
                }
                errorCB(data, status, headers, config);
            });
    },

    silentAuth : function($rootScope, $http, successCB, errorCB) {
        var username = $.jStorage.get('username');
        var password = $.jStorage.get('password');
        var data = "username=" + username + "&password=" + password;
        MyCampusApp.invokeService($rootScope, $http, "services/authenticate/login", "POST", data,
            function(data, status, headers, config) {
                //console.log("Success Data : " + data);
                //alert ("Success : " + data);
                if(data.error) {
                    apprise(data.error, {'verify':false, 'textYes':"Ok"}, function(r) {
                        $rootScope.ticket = null;
                        $rootScope.loggedin = false;
                        $.jStorage.deleteKey('username');
                        $.jStorage.deleteKey('password');
                        $.jStorage.deleteKey('ticket');
                    });
                }else {
                    var ticket = data.ticket;
                    $rootScope.ticket = ticket;
                    $rootScope.loggedin = true;
                    $.jStorage.set('username', username);
                    $.jStorage.set('password', password);
                    $.jStorage.set('ticket', ticket);
                    successCB(data, status, headers, config);
                }
            }, function(data, status, headers, config) {
                console.log("Error Data : " + data);
                alert ("Error : " + data);
            });
    },

    activatePushNotification : function(tenantId, pushconfig) {
        try {
            var appId = pushconfig.ApplicationId;
            var clientKey = pushconfig.ClientKey;
            parsePlugin.initialize(appId, clientKey, function() {
                //alert('Parse initialize success');
            }, function(e) {
                //alert('Parse initialize error');
            });

            parsePlugin.getInstallationId(function(id) {
                //alert(id);
            }, function(e) {
                //alert('error');
            });

            parsePlugin.getSubscriptions(function(subscriptions) {
                //alert(subscriptions);
            }, function(e) {
                //alert('error');
            });

            parsePlugin.subscribe(tenantId, function() {
                //alert('OK');
            }, function(e) {
                //alert('error');
            });

            /*parsePlugin.unsubscribe('SampleChannel', function(msg) {
             alert('OK');
             }, function(e) {
             alert('error');
             });*/
        }catch(e) {

        }

    },

    logPageAccess : function(tenant, url, $http, appid, appname, pageid) {
        try {
            var mydevice;
            if(window.device) {
                mydevice = window.device;
            }else {
                mydevice = {
                    model : "NA",
                    cordova : "NA",
                    platform : "NA",
                    uuid : "Emulator",
                    version : "NA",
                    name : "NA",
                }
            }
            $http.post(url + "/analytics/logpageaccess/" + tenant + "?callback=JSON_CALLBACK", {
                activity : {
                    "appid" : appid,
                    "appname"  : appname,
                    "pageid" : pageid
                }, device: mydevice}).
                success(function(data) {
                    //Ignore
                });
        }catch(e) {
            //Ignore
        }
    }

};


var DockIcon, Icon, Screen, Stage,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key))
                child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype; return child;
    };

Icon = (function() {

    function Icon(id, title, url, logourl) {
        this.id = id;
        this.title = title;
        this.url = url;
        this.logourl=logourl;
        this.markup = "<a href='" + this.url + "' class='icon' style='background-image:url(" + this.logourl + ");background-size:100% 100%;'  title='" + this.title + "'></a>";
    }

    return Icon;

})();

DockIcon = (function(_super) {

    __extends(DockIcon, _super);

    function DockIcon(id, title, url, logourl) {
        DockIcon.__super__.constructor.call(this, id, title, url, logourl);
        this.markup = this.markup.replace("class='icon'", "class='dockicon'");
    }

    return DockIcon;

})(Icon);

Screen = (function() {

    function Screen(icons) {
        if (icons == null) {
            icons = [];
        }
        this.icons = icons;
    }

    Screen.prototype.attachIcons = function(icons) {
        if (icons == null) {
            icons = [];
        }
        return Array.prototype.push.apply(this.icons, icons);
    };

    Screen.prototype.generate = function() {
        var icon, markup, _i, _len, _ref;
        markup = [];
        _ref = this.icons;
        var width = $(window).width();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            icon = _ref[_i];
            markup.push(icon.markup);
        }
        return "<div class='screen' style='width:" + width + "px; !important;'>" + (markup.join('')) + "</div>";
    };

    return Screen;

})();

Stage = (function() {

    Stage.prototype.screenWidth = 279;

    function Stage(icons, iconwidth) {
        //alert ($(window).width());

        if(!iconwidth) {
            iconwidth = 64;
        }
        var sampleicon = $('#sampleicon');
        var calculated = sampleicon.outerWidth(true);
        if(calculated != 0) {
            iconwidth = sampleicon.outerWidth(true) + 24;
        }
        var cols =  Math.floor(($(window).width() - 24) / iconwidth);
        var remainder = ($(window).width() - 24) % iconwidth;
        var rows = Math.floor(($(window).height() - 160) / iconwidth);
        var maskHeight = (iconwidth * rows) + 24;
        var maskStyle = "width:" + ($(window).width() - 24) + "px !important;height:" + maskHeight + "px !important;";
        $('#mask').attr("style",maskStyle);
        //alert ("Cols " + cols);
        //alert ("Rows " + rows);
        var noOfIconsAllwedInAScreen = cols * rows;
        var i, num, s;
        this.currentScreen = 0;
        this.screens = [];
        num = Math.ceil(icons.length / noOfIconsAllwedInAScreen);
        i = 0;
        while (num--) {
            s = new Screen(icons.slice(i, i + noOfIconsAllwedInAScreen));
            this.screens.push(s);
            i += noOfIconsAllwedInAScreen;
        }
    }

    Stage.prototype.addScreensTo = function(element) {
        var screen, _i, _len, _ref, _results;
        this.element = $(element);
        this.element.width((this.screens.length * this.screenWidth) + 15);
        _ref = this.screens;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            screen = _ref[_i];
            _results.push(this.element.append(screen.generate()));
        }
        return _results;
    };

    Stage.prototype.addIndicatorsTo = function(elem) {
        var screen, _i, _len, _ref;
        this.ul = $(elem);
        _ref = this.screens;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            screen = _ref[_i];
            this.ul.append('<li>');
        }
        return this.ul.find('li:first').addClass('active');
    };

    Stage.prototype.goTo = function(screenNum) {
        var from, to, _ref, _ref1,
            _this = this;
        if (this.element.is(':animated')) {
            return false;
        }
        if (this.currentScreen === screenNum) {
            _ref = ['+=0', '-=0'], from = _ref[0], to = _ref[1];
            if (this.currentScreen !== 0) {
                _ref1 = [to, from], from = _ref1[0], to = _ref1[1];
            }
            return this.element.animate({
                marginLeft: from
            }, 150).animate({
                    marginLeft: to
                }, 150);
        } else {
            this.element.animate({
                marginLeft: -screenNum * (this.screenWidth)
            }, function() {
                return _this.currentScreen = screenNum;
            });
            return this.ul.find('li').removeClass('active').eq(screenNum).addClass('active');
        }
    };

    Stage.prototype.next = function() {
        var toShow;
        toShow = this.currentScreen + 1;
        if (toShow === this.screens.length) {
            toShow = this.screens.length - 1;
        }
        return this.goTo(toShow);
    };

    Stage.prototype.previous = function() {
        var toShow;
        toShow = this.currentScreen - 1;
        if (toShow === -1) {
            toShow = 0;
        }
        return this.goTo(toShow);
    };

    return Stage;

})();

/** Kryptos Network Monitor **/
(function(){
    var onlineCallbacks = {};
    var offlineCallbacks = {};
    var initialized = false;

    /** Public Interface **/
    $.KNMonitor = {

        isOnline : function() {
            var networkState = navigator.connection.type;
            if (networkState == "none" || networkState == "unknown") {
                return false;
            }else {
                return true;
            }
         },

        registerOnlineCallback : function(processor, callback) {
            onlineCallbacks[processor] = callback;
        },

        removeOnlineCallback : function(processor) {
            delete onlineCallbacks[processor];
        },

        registerOfflineCallback : function(processor, callback) {
            offlineCallbacks[processor] = callback;
        },

        removeOfflineCallback : function(processor) {
            delete offlineCallbacks[processor];
        },

        initialize : function(rootscope) {
            if(!initialized) {
                rootscope.$on("onOnline", function(event, data) {
                    try {
                        var key;
                        for(key in onlineCallbacks ) {
                            if(onlineCallbacks.hasOwnProperty(key)) {
                                onlineCallbacks[key]();
                            }
                        }
                    }catch(e) {
                        //alert ("Exception while callback.." + e);
                    }
                });
                rootscope.$on("onOffline", function(event, data) {
                    try {
                        var key;
                        for(key in offlineCallbacks ) {
                            if(offlineCallbacks.hasOwnProperty(key)) {
                                offlineCallbacks[key]();
                            }
                        }
                    }catch(e) {
                        //alert ("Exception while callback.." + e);
                    }
                });
                initialized = true;
            }
        }

    };
})();


/** Kryptos Local Storage **/
(function(){
    //var processors = {};

    $.KStorage = {

        set : function(processor, key, value) {
            var processors = $.jStorage.get("kprs");
            if(processors == null) {
                processors = {};
            }
            if(processors[processor]) {
                processors[processor][key] = value;
            }else {
                processors[processor] = {};
                processors[processor][key] = value;
            }
            $.jStorage.set(processor + "-" + key, value);
            $.jStorage.set("kprs", processors);
        },

        get : function(processor, key) {
            return $.jStorage.get(processor + "-" + key);
        },

        flush : function(processor) {
            var processors = $.jStorage.get("kprs");
            if(processors != null) {
                if(processors[processor]) {
                    for(key in processors[processor]) {
                        $.jStorage.deleteKey(processor + "-" + key);
                    }
                    delete processors[processor];
                }
            }
        },

        flushAll : function() {
            var processors = $.jStorage.get("kprs");
            if(processors != null) {
                for(processor in processors) {
                    flush(processor);
                }
            }
        }
    };
})();


MyCampusApp.init();