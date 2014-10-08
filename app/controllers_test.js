'use strict';

describe('Controller: PlaylistsCtrl', function () {

    // var should = chai.should();

    // load the controller's module
    beforeEach(module('Acionic'));

    var PlaylistsCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        PlaylistsCtrl = $controller('PlaylistsCtrl', {
            $scope: scope
          });
      }));

    it('should attach a list of playlists to the scope', function () {
        scope.playlists.should.have.length(6);
      });
  });
