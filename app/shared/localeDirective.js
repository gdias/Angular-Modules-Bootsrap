'use strict'

module.exports.localeDirective = ['localeService', function(localeService) {

    return {
        restrict: 'A',
        replace: true,
        template: ' \
          <div class="language-select" ng-if="visible"> \
                <div ng-model="currentLocaleDisplayName">\
                    <a ng-repeat="localesDisplayName in localesDisplayNames" href="#" ng-click="changeLanguage(localesDisplayName)" class="btn btn-default">{{localesDisplayName}}</a>\
                </div>\
        </div>',
        controller: function ($scope) {
            $scope.currentLocaleDisplayName = localeService.getLocaleDisplayName();
            $scope.localesDisplayNames = localeService.getLocalesDisplayNames();
            $scope.visible = $scope.localesDisplayNames && $scope.localesDisplayNames.length > 1;

            $scope.changeLanguage = function (locale) {
                localeService.setLocaleByDisplayName(locale);
            };
        }
    }
}]
