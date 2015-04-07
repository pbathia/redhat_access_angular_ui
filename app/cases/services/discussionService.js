'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').service('DiscussionService', [
    '$location',
    '$q',
    'AlertService',
    'AttachmentsService',
    'CaseService',
    'strataService',
    'HeaderService',
    'RHAUtils',
    'securityService',
    function ($location, $q, AlertService, AttachmentsService, CaseService, strataService, HeaderService,RHAUtils,securityService) {
        this.discussionElements = [];
        this.chatTranscriptList = [];
        this.comments = CaseService.comments;
        this.attachments = AttachmentsService.originalAttachments;
        this.loadingAttachments = false;
        this.loadingComments = false;
        this.commentTextBoxEnlargen = false;
        this.getDiscussionElements = function(caseId){
            var attachPromise = null;
            var commentsPromise = null;
            this.discussionElements = [];
            //if (EDIT_CASE_CONFIG.showAttachments) {
            this.loadingAttachments = true;
            attachPromise = strataService.cases.attachments.list(caseId).then(angular.bind(this, function (attachmentsJSON) {
                AttachmentsService.defineOriginalAttachments(attachmentsJSON);
                angular.forEach(AttachmentsService.originalAttachments , angular.bind(this, function (element) {
                    var lastModifiedDate=RHAUtils.convertToTimezone(element.last_modified_date,securityService.loginStatus.authedUser.timezone);
                    element.timezone_last_modified_date=RHAUtils.formatDate(lastModifiedDate,'MMM DD YYYY');
                    element.timezone_last_modified_time=RHAUtils.formatDate(lastModifiedDate,'hh:mm A Z');
                    var createdDate=RHAUtils.convertToTimezone(element.created_date,securityService.loginStatus.authedUser.timezone);
                    element.timezone_created_date=RHAUtils.formatDate(createdDate,'MMM DD YYYY');
                    element.timezone_created_time=RHAUtils.formatDate(createdDate,'hh:mm A Z');

                }));
                //this.attachments = AttachmentsService.originalAttachments;
                //this.discussionElements = this.discussionElements.concat(this.attachments);
                this.loadingAttachments= false;
            }), angular.bind(this, function (error) {
                if(!HeaderService.pageLoadFailure) {
                    AlertService.addStrataErrorMessage(error);
                }
                this.loadingAttachments= false;
            }));
            commentsPromise = CaseService.populateComments(caseId).then(function (comments) {
            }, function (error) {
                if(!HeaderService.pageLoadFailure) {
                    AlertService.addStrataErrorMessage(error);
                }
            });
            //}
            //if (EDIT_CASE_CONFIG.showComments) {
            //TODO should this be done in case service???
            this.loadingComments = true;
            // strataService.cases.comments.get(caseId).then(angular.bind(this, function (commentsJSON) {
            //     this.comments = commentsJSON;
            //     this.discussionElements = this.discussionElements.concat(this.comments);
            //     this.loadingComments = false;
            // }), function (error) {
            //     AlertService.addStrataErrorMessage(error);
            //     this.loadingComments = false;
            // });
            //}


            return $q.all([attachPromise, commentsPromise]);
        };
        this.updateElements = function(){
            this.comments = CaseService.comments;
            this.attachments = AttachmentsService.originalAttachments;
            this.discussionElements = this.comments.concat(this.attachments);
            if (this.chatTranscriptList !== undefined && this.chatTranscriptList.length > 0) {
                this.discussionElements = this.discussionElements.concat(this.chatTranscriptList);
            }

        };
    }
]);
