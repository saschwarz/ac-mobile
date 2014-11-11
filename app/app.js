'use strict';

// angular.module is a global place for creating, registering and retrieving Angular modules

angular.module('Acionic', ['ionic', 'config', 'Acionic.controllers', 'gettext', 'Acionic.layout'])
.run(function($ionicPlatform, gettextCatalog) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      window.StatusBar.styleDefault();
    }
    gettextCatalog.setCurrentLanguage('fr');
  });
})

.config(function($stateProvider, $urlRouterProvider, RestangularProvider) {
  RestangularProvider.setBaseUrl('http://127.0.0.1:8000/api/v2/');
  RestangularProvider.setRequestSuffix('/');

  $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      resolve: {
        restSetup: function(Restangular, AuthTokenStorage){
          var token = AuthTokenStorage.getToken();
          if (token){
            console.log("setting auth token");
            Restangular.setDefaultHeaders({Authorization: 'Token ' + token});
          }
        }
      },
      templateUrl: 'menu.html',
      controller: 'AppCtrl'
    })
    .state('home', {
      url: '/home',
      parent: 'app',
      views: {
        'menuContent' :{
          templateUrl: 'home.html',
          controller: 'HomeCtrl'
        }
      }
    })
    .state('settings', {
      url: '/settings',
      parent: 'app',
      resolve: {
        user: function(User){
          return User.user();
        }
      },
      views: {
        'menuContent' :{
          templateUrl: 'settings.html',
          controller: 'SettingsCtrl'
        }
      }
    })
    .state('preferences', {
      url: '/preferences',
      parent: 'app',
      resolve: {
        userProfile: function(UserProfile){
          return UserProfile.profile();
        },
        languages: 'Languages'
      },
      views: {
        'menuContent' :{
          templateUrl: 'preferences.html',
          controller: 'PreferencesCtrl'
        }
      }
    })
    .state('courses-menu', {
      url: '/courses-menu',
      parent: 'app',
      views: {
        'menuContent' :{
          templateUrl: 'courses-menu.html',
          controller: 'CoursesMenuCtrl'
        }
      }
    })
    .state('courses-group', {
      url: '/courses/:groupId',
      parent: 'app',
      views: {
        'menuContent' :{
          templateUrl: 'courses-filtered.html',
          controller: 'CoursesGroupCtrl'
        }
      }
    })
    .state('course-view', {
      // View of an individual course.
      // All courses (regardless of the layout on which they are based ) have a unique id.
      url: '/courses/:courseId',
      parent: 'app',
      views: {
        'menuContent' :{
          templateUrl: 'courses-filtered.html',
          controller: 'CoursesGroupCtrl'
        }
      }
    })
    .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent' :{
          templateUrl: 'browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent' :{
          templateUrl: 'playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })
    .state('app.single', {
      url: '/playlists/:playlistId',
      views: {
        'menuContent' :{
          templateUrl: 'playlist.html',
          controller: 'PlaylistCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
