'use strict';

angular.module('Acionic.layout', [])

  .directive('itemImage', function() {
    return {
      replace: true,
      restrict: 'E',
      scope: {
        section: '=',
        page: '='
      },
      templateUrl: 'item-image.tpl.html'
    };
  });
