'use strict';

angular.module('Acionic.services', ['restangular', 'LocalStorageModule'])
.factory('Languages', function(){
  return [['en', 'English'],
          ['es', 'Spanish'],
          ['fr', 'French'],
          ['ja', 'Japanese'],
          ['de', 'German'],
          ['fi', 'Finnish'],
          ['it', 'Italian'],
          ['pl', 'Polish'],
          ['pt', 'Portuguese'],
          ['lt', 'Lithuanian']
         ];
})
.service('AuthTokenStorage', function(localStorageService){
  var _authTokenName = 'com.agilitycourses.authToken';
  this.set = function(token){
    localStorageService.set(_authTokenName, token);
  };
  this.get = function(){
    return localStorageService.get(_authTokenName);
  };
  this.remove = function(){
    return localStorageService.get(_authTokenName);
  };
})
.service('UserStorage', function(localStorageService){
  var _userKeyName = 'com.agilitycourses.user';
  this.set = function(userKey){
    localStorageService.set(_userKeyName, userKey);
  };
  this.get = function(){
    return localStorageService.get(_userKeyName);
  };
  this.clearUser = function(){
    return localStorageService.remove(_userKeyName);
  };
})
.service('Login', function($http, Restangular, AuthTokenStorage, User){
  var _this = this;

  this.login = function(username, password){
    var payload = {'username': username,
                   'password': password};
    var url = 'http://10.0.0.4:8000/rest-auth/login/';
    return $http({
      method: 'POST',
      url: url,
      transformRequest: function(obj) {
        var str = [];
        for(var p in obj) {
          str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
        return str.join('&');
      },
      data: payload,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(response){
      var key = response.data.key;
      AuthTokenStorage.set(key);
      Restangular.setDefaultHeaders({Authorization: 'Token ' + key});
      User.clearUser();
      return _this.get();
    })
    .catch(function(e){
      console.log(e);
    });
  };

  this.get = function(){
    return Restangular.oneUrl('rest-auth-user', 'http://10.0.0.4:8000/rest-auth/user/').get()
      .then(function(data){
        console.log(data);
        User.setUserId(data.id);
    //   })
    // .catch(function(e){
    //   console.log(e);
      });
  };

})
.service('User', function($q, Restangular, UserStorage) {
  var _userId,  _user = {}, _this = this;

  this.setUserId = function(id){
    _userId = id;
  };

  this.set = function(user){
    _user = user;
    UserStorage.set(user);
  };

  this.clearUser = function(){
    _user = {};
    UserStorage.clearUser();
  };

  this.user = function(){
    if (_.isEmpty(_user)){
      var user = UserStorage.get();
      if (user){
        _this.setUserId(user.id);
      }
      // refresh from server to get latest data
      return Restangular.one('users', _userId).get().then(
        function(user) {
          _this.set(user);
          return user;
        });
    }
    return $q.when(_user);
  };
})
.service('UserProfile', function(Restangular, User) {
  this.profile = function(){
    return User.user().then(function(user){
      return Restangular.withConfig(function(config){
        config.setRestangularFields({selfLink: 'url'});
      }).oneUrl(user.profile, user.profile).get();
    });
  };
})
.service('settings', function(){
    // TODO get this via API
    this.data = {
        user: {
            id: 1,
            name: 'agilitynerd',
            firstname: 'Steve',
            lastname: 'Schwarz',
            joined: '2014-01-01',
            image: '',
            lang: 'en_US'
        },
        dogs: [{
            id: 1,
            name: 'Flyer',
            birthday: '2011-07-11',
            breed: 'Border Collie',
            image: ''
        }],
        subscriptions: {
            courses: [{
                name: 'AgilityNerd',
                state: 'courses-group({groupId: 1})',
                url: '',
                image: ''
            }],
            workouts: [{
                name: 'AgilityNerd',
                state: 'courses-group',
                url: '',
                image: ''
            }],
            warmups: [{
                name: 'AgilityNerd',
                state: 'courses-group',
                url: '',
                image: ''
            }]
        }
    };
})
.service('homeModel', function(){
  this.pages = [
    {name: 'Courses', state: 'courses-menu', section: 'courses'},
    {name: 'Workouts', state: 'workouts-menu', section: 'workouts'},
    {name: 'Warm Ups', state: 'warmups-menu', section: 'warmups'},
    {name: 'Blank Courses', state: 'blank-courses', section: 'blankcourses'}
  ];
})
.service('coursesMenuModel', function(){
    this.currentPage = {name: 'Courses', state: 'courses-menu'};
    this.pages = [
        {name: 'Design Your Own', state: 'courses-menu'},
        {name: 'Browse', state: 'courses-menu'}
      ];
})

.factory('CourseGroupService', function(Restangular){
  var responseInterceptor = function(data, operation) {
    var extractedData;
    // .. to look for getList operations
    if (operation === 'getList') {
      extractedData = data.objects;
      extractedData.meta = data.meta;
    } else {
      extractedData = data.data;
    }
    return extractedData;
  };

  var courseListTransformer = function(courses){
    var newCourses = _.forEach(courses, function(course){
      var layoutName, layoutId;
      if (/\/box\//.test(course.resource_uri)){
        layoutName = 'box';
        layoutId = 1;
      }
      _.assign(course, {layout_name: layoutName,
                        layout_id: layoutId});
    });
    return newCourses;
  };

  var rest = Restangular.withConfig(function(Configurer) {
    Configurer.setBaseUrl('/api/v1/');
    Configurer.addResponseInterceptor(responseInterceptor);
    Configurer.setRestangularFields({selfLink: 'resource_uri'});
    Configurer.addElementTransformer('courses', true, courseListTransformer);
  });

  // {"created": "2010-10-24T23:38:11",
  //  "generator": "S",
  //  "id": "8",
  //  "png":  "http://agilitycourses.com/courses/box/ABNGFMFHNLBM.png",
  //  "resource_uri": "/api/v1/box/ABNGFMFHNLBM/",
  //  "sequence": "ABNGFMFHNLBM",
  //  "short_url": "http://goo.gl/0nSX",
  //  "svg": "http://agilitycourses.com/courses/box/ABNGFMFHNLBM.svg"
  //  "layout_id": 1,
  //  "layout_name": "box,
  //  "layout_uri": "http://agilitycourses.com/layouts/1",
  //  "description": 'A description goes here",
  //  "skills": ["180/270", "Threadle", "Serpentine"]
  // }
  // TODO:
  // 1. Add description
  // 2. Add skills
  // 3. Add layout
  return {
    getCourses: function(userId) {
      return rest.one('users', userId).all('courses').getList();
    }
  };
});
