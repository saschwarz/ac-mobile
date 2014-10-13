'use strict';

angular.module('Acionic.services', [])

.service('homeModel', function(){
    this.pages = [
        {name: 'Exercises', state: 'exercises-menu'},
        {name: 'Workouts', state: 'workouts-menu'},
        {name: 'Warm Ups', state: 'warmups-menu'},
        {name: 'Blank Courses', state: 'blank-courses'},
      ];
})
.service('exercisesMenuModel', function(){
    this.currentPage = [{name: 'Exercises', state: 'exercises-menu'}];
    this.pages = [
        {name: 'AgilityNerd Exercises', state: ''},
        {name: 'Design Your Own', state: ''},
        {name: 'Browse', state: ''}
      ];
});
