var ContactsApp=angular.module('TodolistApp',[]);
ContactsApp.controller('AppCtrl',['$scope','$http',function ($scope,$http) {
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