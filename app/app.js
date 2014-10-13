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

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
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
    .state('exercises-menu', {
      url: '/exercises-menu',
      parent: 'app',
      views: {
        'menuContent' :{
          templateUrl: 'exercises-menu.html',
          controller: 'ExercisesMenuCtrl'
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
