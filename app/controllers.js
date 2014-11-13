'use strict';

angular.module('Acionic.controllers', ['Acionic.services', 'ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, Login, User){
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
  };
  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    Login.login($scope.loginData.username,
                $scope.loginData.password)
      .then($scope.closeLogin)
      .catch($scope.loginError)
      .then(User.user);
  };
    })
.controller('HomeCtrl', function($scope, homeModel){
    $scope.pages = homeModel.pages;
  })
.controller('SettingsCtrl',  function($scope, user){
  $scope.user = user;

  $scope.updateUser = function(form){
    if (!form.$invalid){
      user.put();
    }
  };
})
.controller('PreferencesCtrl',  function($scope, userProfile, languages, $cordovaFile){
  $scope.profile = userProfile;
  $scope.languages = languages;

  $scope.updateProfile = function(form){
    if (!form.$invalid){
//      $scope.profile.put();
      var profile = $scope.profile;
      var options = new FileUploadOptions();
      options.fileKey = 'avatar';
      options.fileName = profile.avatar;
      options.mimeType = 'image/jpeg';
      var uri = profile.url;
      console.log(profile.avatar);
      console.log(uri);

      $cordovaFile.uploadFile(profile.avatar, uri, options)
        .then(function(result) {
          // Success!
          console.log(result);
        }, function(err) {
          // Error
          console.log(err);
        }, function (progress) {
          // constant progress updates
        });
    }
  };
})
.controller('CoursesMenuCtrl', function($scope, settings, coursesMenuModel){
    $scope.currentPage = _.assign({section: 'courses'}, coursesMenuModel.currentPage);
    $scope.pages = _.forEach(settings.data.subscriptions.courses.concat(coursesMenuModel.pages),
                             function(obj){_.assign({section: 'courses'}, obj);
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
