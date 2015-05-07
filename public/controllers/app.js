'use strict';

/**********************************************************************
 * Angular Application
 **********************************************************************/
var app = angular.module('TodolistApp', ['ngResource', 'ngRoute'])
  .config(function($routeProvider, $locationProvider, $httpProvider) {
    //================================================
    // Check if the user is connected
    //================================================
    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user){
        // Authenticated
        if (user !== '0')
          /*$timeout(deferred.resolve, 0);*/
          deferred.resolve();

        // Not Authenticated
        else {
          $rootScope.message = 'You need to log in.';
          //$timeout(function(){deferred.reject();}, 0);
          deferred.reject();
          $location.url('/login');
        }
      });

      return deferred.promise;
    };
    //================================================
    
    //================================================
    // Add an interceptor for AJAX errors
    //================================================
    $httpProvider.interceptors.push(function($q, $location) {
      return {
        response: function(response) {
          // do something on success
          return response;
        },
        responseError: function(response) {
          if (response.status === 401)
            $location.url('/login');
          return $q.reject(response);
        }
      };
    });
    //================================================

    //================================================
    // Define all the routes
    //================================================
    $routeProvider
      .when('/completed', {
        templateUrl: 'completed.html',
        controller: 'completedCtrl',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .when('/task', {
        templateUrl: 'task.html',
        controller: 'AppCtrl',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .when('/login', {
        templateUrl: 'login.html',
        controller: 'LoginCtrl'
      })
      .when('/register', {
        templateUrl: 'register.html',
        controller: 'RegisterCtrl'
      })
      .when('/home', {
        templateUrl: 'home.html',
      })
      .otherwise({
        redirectTo: '/'
      });
    //================================================

  }) // end of config()
  .run(function($rootScope, $http){
    $rootScope.message = '';

    // Logout function is available in any pages
    $rootScope.logout = function(){
      $rootScope.message = 'Logged out.';
      $http.post('/logout');
    };
  });

  //for todolist
  app.controller('AppCtrl',['$scope','$http',function ($scope,$http) {
  console.log("Hello world from controller"); 
  //refresh page
  var refresh = function(){ 
        $http.get('/todolist').success(function(response){
        console.log("I got the data I requested");
        console.log(response);
        $scope.tastlist=response;
        $scope.tasks="";
        });
      };  

  refresh();
  //insert tasks
  $scope.addNewTask = function(){
    $http.post('/addnewtask',$scope.tasks).success(function(response){
      console.log($scope.tasks);
      refresh();
    });
  };
  //remove tasks
  $scope.remove = function(id){
    console.log(id);
    $http.delete('/deletetask/'+id).success(function(response){
      refresh();
    });
  };
  //done tasks
  $scope.donetask = function(id){
    console.log(id);
    $http.get('/done/' + id ).success(function(response){
      refresh();
    });
  };
  //all done
  $scope.alldone = function(){
    $http.get('/alldone/').success(function(response){
      refresh();
    });
  }
  //edit tasks
  $scope.edit=function(id){
    $http.get('/edittask/' + id).success(function(response){
      $scope.tasks = response;
      console.log(response);
    });
  };
  //update tasks
  $scope.update = function(){
    $http.put('/updatetask/'+ $scope.tasks._id,$scope.tasks).success(function(response){
      refresh();
    });
  };

  $scope.deselect = function() {
      $scope.contact = "";
  }
}]);

//for login
app.controller('LoginCtrl', function($scope, $rootScope, $http, $location) {
  // This object will be filled by the form
  $scope.user = {};

  // Register the login() function
  $scope.login = function(){
    $http.post('/login', {
      username: $scope.user.username,
      password: $scope.user.password,
    })
    .success(function(user){
      // No error: authentication OK
      $rootScope.message = 'Hello: ' + user.name;
      $location.url('/task');
    })
    .error(function(){
      // Error: authentication failed
      $rootScope.message = 'Authentication failed.';
      $location.url('/login');
    });
  };
});

 app.controller('completedCtrl',['$scope','$http',function ($scope,$http) {
  var refresh = function(){ 
        $http.get('/listcopleted').success(function(response){
        console.log("I got the data I requested");
        console.log(response);
        $scope.taskcompletedlist=response;
        $scope.taskscompleted="";
        });
      };  
  refresh();
  $scope.Deletetask = function(id){
    console.log(id);
    $http.delete('/deletetaskcpted/'+id).success(function(response){
      refresh();
    });
  };
 }]);

 app.controller('RegisterCtrl', function($scope, $rootScope, $http, $location) {
  // Register the login() function
  $scope.register = function(){
    $scope.message="";
      if($scope.users.password==$scope.users.cfpassword){
          
           $http.post('/register',$scope.users).success(function(response){
            console.log('response1: '+response.status);
            if (response.status==0) {
               $scope.message='username already exists';
            }else{
              console.log('response3: '+response.status);
               $http.post('/login', {
                  username: $scope.users.username,
                  password: $scope.users.password,
                })
                .success(function(user){
                  // No error: authentication OK
                  $rootScope.message = 'Hello: ' + user.name;
                  $location.url('/task');
                })
                .error(function(){
                  // Error: authentication failed
                  $rootScope.message = 'Authentication failed.';
                  $location.url('/login');
               });
            }
         });
    }
    else{
      $scope.message='password not match';
    }
  };
});