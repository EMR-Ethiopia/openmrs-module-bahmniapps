'use strict';

angular.module('bahmni.registration')
    .controller('PatientCommonController', ['$scope', '$rootScope', '$translate', '$log', '$http', 'patientAttributeService', 'appService', 'spinner', '$location', 'ngDialog', '$window', '$state',
        function ($scope, $rootScope, $translate, $log, $http, patientAttributeService, appService, spinner, $location, ngDialog, $window, $state) {
            var autoCompleteFields = appService.getAppDescriptor().getConfigValue("autoCompleteFields", []);
            var personAttributes = [];
            $scope.showMiddleName = appService.getAppDescriptor().getConfigValue("showMiddleName");
            $scope.showLastName = appService.getAppDescriptor().getConfigValue("showLastName");
            $scope.isLastNameMandatory = $scope.showLastName && appService.getAppDescriptor().getConfigValue("isLastNameMandatory");
            $scope.showBirthTime = appService.getAppDescriptor().getConfigValue("showBirthTime") != null
                ? appService.getAppDescriptor().getConfigValue("showBirthTime") : true;  // show birth time by default
            $scope.genderCodes = Object.keys($rootScope.genderMap);
            $scope.dobMandatory = appService.getAppDescriptor().getConfigValue("dobMandatory") || false;
            $scope.readOnlyExtraIdentifiers = appService.getAppDescriptor().getConfigValue("readOnlyExtraIdentifiers");
            $scope.showSaveConfirmDialogConfig = appService.getAppDescriptor().getConfigValue("showSaveConfirmDialog");
            $scope.showSaveAndContinueButton = false;

            var dontSaveButtonClicked = false;

            var isHref = false;

            $rootScope.onHomeNavigate = function (event) {
                if ($scope.showSaveConfirmDialogConfig && $state.current.name != "patient.visit") {
                    event.preventDefault();
                    $scope.targetUrl = event.currentTarget.getAttribute('href');
                    isHref = true;
                    $scope.confirmationPrompt(event);
                }
            };

            var stateChangeListener = $rootScope.$on("$stateChangeStart", function (event, toState, toParams) {
                if ($scope.showSaveConfirmDialogConfig && (toState.url == "/search" || toState.url == "/patient/new")) {
                    $scope.targetUrl = toState.name;
                    isHref = false;
                    $scope.confirmationPrompt(event, toState, toParams);
                }
            });

            $scope.confirmationPrompt = function (event, toState) {
                if (dontSaveButtonClicked === false) {
                    if (event) {
                        event.preventDefault();
                    }
                    ngDialog.openConfirm({template: "../common/ui-helper/views/saveConfirmation.html", scope: $scope});
                }
            };

            $scope.continueWithoutSaving = function () {
                ngDialog.close();
                dontSaveButtonClicked = true;
                if (isHref === true) {
                    $window.open($scope.targetUrl, '_self');
                } else {
                    $state.go($scope.targetUrl);
                }
            };

            $scope.cancelTransition = function () {
                ngDialog.close();
                delete $scope.targetUrl;
            };

            $scope.$on("$destroy", function () {
                stateChangeListener();
            });

            $scope.getDeathConcepts = function () {
                return $http({
                    url: Bahmni.Common.Constants.globalPropertyUrl,
                    method: 'GET',
                    params: {
                        property: 'concept.reasonForDeath'
                    },
                    withCredentials: true,
                    transformResponse: [function (deathConcept) {
                        if (_.isEmpty(deathConcept)) {
                            $scope.deathConceptExists = false;
                        } else {
                            $http.get(Bahmni.Common.Constants.conceptSearchByFullNameUrl, {
                                params: {
                                    name: deathConcept,
                                    v: "custom:(uuid,name,set,setMembers:(uuid,display,name:(uuid,name),retired))"
                                },
                                withCredentials: true
                            }).then(function (results) {
                                $scope.deathConceptExists = !!results.data.results.length;
                                $scope.deathConcepts = results.data.results[0] ? results.data.results[0].setMembers : [];
                                $scope.deathConcepts = filterRetireDeathConcepts($scope.deathConcepts);
                            });
                        }
                    }]
                });
            };
            spinner.forPromise($scope.getDeathConcepts());
            var filterRetireDeathConcepts = function (deathConcepts) {
                return _.filter(deathConcepts, function (concept) {
                    return !concept.retired;
                });
            };

            $scope.isAutoComplete = function (fieldName) {
                return !_.isEmpty(autoCompleteFields) ? autoCompleteFields.indexOf(fieldName) > -1 : false;
            };

            var showSections = function (sectionsToShow, allSections) {
                _.each(sectionsToShow, function (sectionName) {
                    allSections[sectionName].canShow = true;
                    allSections[sectionName].expand = true;
                });
            };

            var hideSections = function (sectionsToHide, allSections) {
                _.each(sectionsToHide, function (sectionName) {
                    allSections[sectionName].canShow = false;
                });
            };

            var executeRule = function (ruleFunction) {
                var attributesShowOrHideMap = ruleFunction($scope.patient);
                var patientAttributesSections = $rootScope.patientConfiguration.getPatientAttributesSections().forEach(function (section) {
                    $scope.message = section.title;
                });
                showSections(attributesShowOrHideMap.show, patientAttributesSections);
                hideSections(attributesShowOrHideMap.hide, patientAttributesSections);
            };

            $scope.handleUpdate = function (attribute) {
                var ruleFunction = Bahmni.Registration.AttributesConditions.rules && Bahmni.Registration.AttributesConditions.rules[attribute];
                if (ruleFunction) {
                    executeRule(ruleFunction);
                }
            };

            var executeShowOrHideRules = function () {
                _.each(Bahmni.Registration.AttributesConditions.rules, function (rule) {
                    executeRule(rule);
                });
            };

            $scope.$watch('patientLoaded', function () {
                if ($scope.patientLoaded) {
                    executeShowOrHideRules();
                }
            });

            $scope.getAutoCompleteList = function (attributeName, query, type) {
                return patientAttributeService.search(attributeName, query, type);
            };

            $scope.getDataResults = function (data) {
                return data.results;
            };

            $scope.selectIsDead = function () {
                if ($scope.patient.causeOfDeath || $scope.patient.deathDate) {
                    $scope.patient.dead = true;
                }
            };

            $scope.disableIsDead = function () {
                return ($scope.patient.causeOfDeath || $scope.patient.deathDate) && $scope.patient.dead;
            };
        }]);

