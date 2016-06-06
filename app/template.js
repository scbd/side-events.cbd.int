define(['app', 'jquery',
      'lodash',
      'services/authentication',
      'directives/portal/portal-nav',
      'services/history'
    ], function(app, $,_) {
      'use strict';

    app.controller('TemplateController', ['$scope', '$rootScope', '$window', '$location', 'authentication',  'realm','$q','$timeout',function($scope, $rootScope, $window, $location, authentication,  realm,$q,$timeout) {



        $scope.$root.pageTitle = { text: "" };
        $rootScope.placeholderRecords=[];
        $scope.routeLoaded = false;

        $q.when(authentication.getUser()).then(function(u){
            $rootScope.user = u;
        });
        $scope.$on('$viewContentLoaded', function() {
          $timeout(function(){$scope.routeLoaded = true;},1000);

        });
        $scope.$on("$routeChangeSuccess", function(evt, current){

            $("head > title").text(current.$$route.label || "Side event Registration");
            $scope.path = $location.path();
        });
        $rootScope.$on('event:auth-emailVerification', function(evt, data){
            $scope.showEmailVerificationMessage = data.message;
        });

        //============================================================
        //
        //
        //============================================================
        $rootScope.$watch('user', _.debounce(function(user) {

            if (!user)
                return;

            require(["_slaask"], function(_slaask) {

                if (user.isAuthenticated) {
                    _slaask.identify(user.name, {
                        'user-id' : user.userID,
                        'name' : user.name,
                        'email' : user.email,
                    });

                    if(_slaask.initialized) {
                        _slaask.slaaskSendUserInfos();
                    }
                }

                if(!_slaask.initialized) {
                    _slaask.init('ae83e21f01860758210a799872e12ac4');
                    _slaask.initialized = true;
                }
            });
        }, 1000));


        $scope.goHome               = function() { $location.path('/'); };
        $scope.currentPath          = function() { return $location.path(); };


        //============================================================
           //
           //
           //============================================================
           $scope.encodedReturnUrl = function () {
               return encodeURIComponent($location.absUrl());
           };

           //============================================================
           //
           //
           //============================================================
           $scope.actionSignin = function () {
               var client_id    = $window.encodeURIComponent('55asz2laxbosdto6dfci0f37vbvdu43yljf8fkjacbq34ln9b09xgpy1ngo8pohd');
               var redirect_uri = $window.encodeURIComponent($location.protocol()+'://'+$location.host()+':'+$location.port()+'/oauth2/callback');
               $window.location.href = 'https://accounts.cbd.int/oauth2/authorize?client_id='+client_id+'&redirect_uri='+redirect_uri+'&scope=all';
           };

           //============================================================
           //
           //
           //============================================================
           $scope.actionSignOut = function () {
               document.cookie = 'authenticationToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
               var redirect_uri = $window.encodeURIComponent($location.protocol()+'://'+$location.host()+':'+$location.port()+'/');
               $window.location.href = 'https://accounts.cbd.int/signout?redirect_uri='+redirect_uri;
           };

           //============================================================
           //
           //
           //============================================================
           $scope.actionSignup = function () {
               var redirect_uri = $window.encodeURIComponent($location.protocol()+'://'+$location.host()+':'+$location.port()+'/');
               $window.location.href = 'https://accounts.cbd.int/signup?redirect_uri='+redirect_uri;
           };

           //============================================================
           //
           //
           //============================================================
           $scope.actionPassword = function () {
               var redirect_uri = $window.encodeURIComponent($location.protocol()+'://'+$location.host()+':'+$location.port()+'/');
               $window.location.href = 'https://accounts.cbd.int/password?redirect_uri='+redirect_uri;
           };

           //============================================================
           //
           //
           //============================================================
           $scope.actionProfile = function () {
               var redirect_uri = $window.encodeURIComponent($location.protocol()+'://'+$location.host()+':'+$location.port()+'/');
               $window.location.href = 'https://accounts.cbd.int/profile?redirect_uri='+redirect_uri;
           };

     }]);
});
