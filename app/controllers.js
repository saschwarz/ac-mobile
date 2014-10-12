'use strict';

angular.module('Acionic.controllers', [])

.controller('AppCtrl', function($scope){
      $scope.ENV = {APPNAME: 'Agility Courses',
                    APPURL: 'http://agilitycourses.com/'};
    })
.controller('HomeCtrl', function($scope){
    $scope.pages = [
        {name: 'Exercises', state: 'courses-menu'},
        {name: 'Workouts', state: 'workouts-menu'},
        {name: 'Warm Ups', state: 'warmups-menu'},
        {name: 'Blank Courses', state: 'blank-courses'},
      ];
  })
.controller('CoursesMenuCtrl', function($scope){
    $scope.currentPage = [{name: 'Exercises', state: 'courses-menu'}];
    $scope.pages = [
        {name: 'AgilityNerd Exercises', state: ''},
        {name: 'Design Your Own', state: ''},
        {name: 'Browse', state: ''}
      ];
  })
.controller('LoginCtrl', function($scope, $ionicModal, $timeout) {
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function() {
});
