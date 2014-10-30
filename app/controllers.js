'use strict';

angular.module('Acionic.controllers', ['Acionic.services'])

.controller('AppCtrl', function($scope, $ionicModal, Login){
      $scope.ENV = {APPNAME: 'Agility Courses',
                    APPURL: 'http://agilitycourses.com/'};
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

  $scope.loginError = function(data){
    $scope.loginData.error = data.non_field_errors && data.non_field_errors[0];
  }
  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    Login.login($scope.loginData.username,
                $scope.loginData.password,
                $scope.closeLogin,
                $scope.loginError);
  };
    })
.controller('HomeCtrl', function($scope, homeModel){
    $scope.pages = homeModel.pages;
  })
.controller('SettingsCtrl', function($scope, settings){
    $scope.currentPage = {section: 'settings'};
    $scope.dogs = settings.data.dogs;
  })
.controller('CoursesMenuCtrl', function($scope, settings, coursesMenuModel){
    $scope.currentPage = _.assign({section: 'courses'}, coursesMenuModel.currentPage);
    $scope.pages = _.forEach(settings.data.subscriptions.courses.concat(coursesMenuModel.pages),
                             function(obj){_.assign({section: 'courses'}, obj)
                                          });
  })
.controller('CoursesGroupCtrl', function($stateParams, $scope, CourseGroupService){
//    $scope.currentPage = coursesMenuModel.currentPage;
    CourseGroupService.getCourses($stateParams.groupId).then(
        function(courses){
            $scope.courses = courses;
        },
        function(error) {
            console.log(error);
        });
});
