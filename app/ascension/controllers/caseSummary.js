'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').controller('CaseSummary', [
    '$scope',
    'CaseDetailsService',
    'AlertService',
    'RHAUtils',
    function ($scope,CaseDetailsService,AlertService,RHAUtils) {
        $scope.editingSummary = false;
        $scope.updatingDetails = false;

        $scope.editCaseSummary = function (editSummary) {
            if (editSummary === true) {
                $scope.editingSummary = true;
            } else {
                if(RHAUtils.isNotEmpty(CaseDetailsService.kase.summary) && RHAUtils.isNotEmpty(CaseDetailsService.prestineKase.summary)){
                    CaseDetailsService.kase.summary.summaryText = CaseDetailsService.prestineKase.summary.summaryText;
                }else if(RHAUtils.isNotEmpty(CaseDetailsService.kase.summary) && RHAUtils.isEmpty(CaseDetailsService.prestineKase.summary)){
                    //from new case summary and pressed cancel
                    CaseDetailsService.kase.summary = undefined;
                }
                $scope.editingSummary = false;
                //$scope.updatingDetails = false;
            }
        };
        $scope.updatingDetails = false;
        $scope.updateCase = function() {
            $scope.updatingDetails = true;
            if (CaseDetailsService.kase !== undefined) {
                CaseDetailsService.updateCaseDetails().then(function () {
                    $scope.editingSummary = false;
                    $scope.updatingDetails = false;
                    //$scope.caseOverviewForm.$setPristine();
                }, function (error) {
                    AlertService.addStrataErrorMessage(error);
                    $scope.editingSummary = false;
                    $scope.updatingDetails = false;
                });
            }
        };
    }
]);
