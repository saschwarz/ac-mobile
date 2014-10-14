'use strict';

angular.module('Acionic.services', ['restangular'])

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
  //  "description:" 'A description goes here"
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
