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
  this.setToken = function(token){
    localStorageService.set(_authTokenName, token);
  };
  this.getToken = function(){
    return localStorageService.get(_authTokenName);
  };
})
.service('UserStorage', function(localStorageService){
  var _userKeyName = 'com.agilitycourses.user';
  this.setUser = function(userKey){
    localStorageService.set(_userKeyName, userKey);
  };
  this.getUser = function(){
    return localStorageService.get(_userKeyName);
  };
})
.service('Login', function($http, Restangular, AuthTokenStorage, User){
  var that = this;

  this.login = function(username, password){
    var payload = {'username': username,
                   'password': password};
    var url = 'http://127.0.0.1:8000/rest-auth/login/';
    return $http({
      method: 'POST',
      url: url,
      transformRequest: function(obj) {
        var str = [];
        for(var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
      },
      data: payload,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data, status, headers, config){
      AuthTokenStorage.setToken(data.key);
      Restangular.setDefaultHeaders({Authorization: 'Token ' + data.key});
    }).then(that.getUser);
  };

  this.getUser = function(){
    return Restangular.oneUrl('rest-auth-user', 'http://127.0.0.1:8000/rest-auth/user/').get()
      .then(function(data){
        User.setUserId(data.id);
      });
  };

})
.service('User', function(Restangular, UserStorage) {
  var _userId,  _user, that = this;

  this.setUserId = function(id){
    _userId = id;
  };

  this.setUser = function(user){
    console.log("setUser "+user);
    _user = user;
    UserStorage.setUser(user);
  };

  this.user = function(){
    if (!_user){
      return Restangular.one('users', _userId).get().then(
        function(user) {
          that.setUser(user);
        });
    }
    console.log("returning existing user " + _user);
    return _user;
  };
})
.service('settings', function(User){
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
  var responseInterceptor = function(data, operation, what, url, response, deferred) {
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
