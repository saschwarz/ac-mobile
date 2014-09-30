angular.module('gettext').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('en_US', {});
    gettextCatalog.setStrings('fr', {"Browse":"French Browse"});
/* jshint +W100 */
}]);