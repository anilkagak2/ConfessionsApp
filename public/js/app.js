angular.module("confessionsApp", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
        .when("/", {
            templateUrl: "readingPane.html",
            controller: "ReadingPaneController", 
            resolve: {
                confessions : function(Confessions) {
                    return Confessions.getConfessions();
                }
            }
        })
        .when("/new/confession", {
            templateUrl: "newConfessionPane.html",
            controller: "NewConfessionController"
        })
        .otherwise({
            redirectTo: "/"
        })
    })
    .service("Confessions", function($http) {
        this.getConfessions = function() {
            return $http.get("/confessions")
                    .then(function(response) {
                        return response;
                    }, function(response) {
                        alert("Error retrieving confessions.");
                    });
        }

        this.createConfession = function(confession) {
            return $http.post("/confession", confession)
                    .then(function(response) {
                        return response;
                    }, function(response) {
                        alert("Error creating confession.");
                    });
        }
    })
    .controller("ReadingPaneController", function(confessions, $scope) {
        $scope.confessions = confessions.data;
    })
    .controller("NewConfessionController", function($scope, $location, Confessions) {
        $scope.back = function() {
            $location.path("#/");
        }

        $scope.saveConfession = function(confession) {
            Confessions.createConfession(confession).then(function(doc) {
                alert("Created confession with id" + doc.data._id);
                $location.path("#/");
            }, function(response) {
                alert(response);
            });
        }
    });