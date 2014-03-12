'use strict';

angular.module('RedhatAccessCases')
.directive('rhaAttachLocalFile', function () {
  return {
    templateUrl: 'views/case/attachLocalFile.html',
    restrict: 'EA',
    controller: 'AttachLocalFile',
    scope: {
      attachments: '=attachments'
    },
    link: function postLink(scope, element, attrs) {
    }
  };
});