'use strict';

angular.module('Acionic.controllers', ['Acionic.services', 'ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, Login, User, UserStorage){
  $scope.ENV = {APPNAME: 'Agility Courses',
                APPURL: 'http://agilitycourses.com/'};
  $scope.loginData = {username: '',
                      password: ''};

  // prepopulate username on login dialog if we've previously logged in
  var user = UserStorage.get();
  if (!_.isEmpty(user)){
    $scope.loginData.username = user.username;
  }
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
.controller('SettingsCtrl',  function($scope, growl, user){
  $scope.isSaving = false;
  $scope.user = user;

  $scope.updateUser = function(form){
    if (!form.$invalid){
      $scope.isSaving = true;
      user.put()
        .then(function(){
          growl.success('Saved your changes');
        })
        .catch(function(){growl.error('Sorry there was a problem saving your changes', {ttl: 10000});})
        .finally(function(){
          $scope.isSaving = false;
        });
    }
  };
})
.controller('PreferencesCtrl',  function($scope, userProfile, languages, $cordovaFile, $cordovaCamera, AuthTokenStorage, growl){
  var _imageChanged = false;
  console.log('lang:'+userProfile.lang);
  $scope.isSaving = false;
  $scope.profile = userProfile;
  $scope.languages = languages;
  if (_.isEmpty(userProfile.avatar)){
    userProfile.avatar = 'http://placehold.it/100x100';
  }
  $scope.getPhoto = function() {
    // Retrieve image file location from specified source
    $cordovaCamera.getPicture({ quality: 50,
                                destinationType: Camera.DestinationType.FILE_URI,
                                sourceType: Camera.PictureSourceType.PHOTOLIBRARY })
    .then(function(image){
      $scope.profile.avatar = image;
      _imageChanged = true;
    });
  };

  $scope.updateProfile = function(form){
    var profile = $scope.profile;
    var params = {lang: profile.lang};

    if (!form.$invalid){
      $scope.isSaving = true;
      if (_imageChanged){
        var options = new FileUploadOptions();
        // get filename from full path
        var filename = profile.avatar.substr(profile.avatar.lastIndexOf('/')+1);
        console.log('filename:'+filename);
        options.fileKey = 'avatar';
        options.fileName = filename;
        options.mimeType = 'image/jpeg';
        options.httpMethod = 'PUT';
        options.headers = _.assign({'Authorization': 'Token ' + AuthTokenStorage.get()}, options.headers);
        options.params = params;

        var uri = profile.url;
        var fileSrc = profile.avatar;

        $cordovaFile.uploadFile(uri, fileSrc, options)
          .then(function(result) {
            // Success!
            console.log('success:'+result);
            _imageChanged = false; // allow image to change again once saved
          }, function(err) {
            // Error
            _.forOwn(err, function(num, key){console.log(key +':' + err[key]);});
            console.log('err:'+err);
          }, function (progress) {
            // constant progress updates
          })
          .finally(function(){$scope.isSaving = false;});
      } else {
        profile.patch(params)
          .then(function(){growl.success('Saved your changes');})
          .catch(function(){growl.error('Sorry there was a problem saving your changes', {ttl: 10000});})
          .finally(function(){ $scope.isSaving = false;});
      }
    }
  };
})
.controller('CoursesMenuCtrl', function($scope, $ionicPopover, settings, coursesMenuModel){
  $scope.currentPage = _.assign({section: 'courses'}, coursesMenuModel.currentPage);

  function buildPopover(obj){
    var popover = $ionicPopover.fromTemplate('<ion-popover-view class="fit"><ion-content>'+ obj.info +'</ion-content></ion-popover-view>');
    obj.popover = popover;
    $scope.$on('$destroy', function() {
      obj.popover.remove();
    });
    obj.displayInfo = function(event){
      obj.popover.show(event);
      event.preventDefault();
      event.stopPropagation();
    };
  };
  $scope.designs = _.forEach(coursesMenuModel.designs,
                             function(obj){_.assign({section: 'courses'}, obj);
                                           buildPopover(obj);
                                          });
    $scope.filters = _.forEach(coursesMenuModel.filters,
                             function(obj){_.assign({'section': 'courses'}, obj);
                                          });
    $scope.subscriptions = _.forEach(settings.data.subscriptions.courses,
                                     function(obj){_.assign({section: 'courses'}, obj);
                                                   buildPopover(obj);
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
