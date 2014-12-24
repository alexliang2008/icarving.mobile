angular.module('icarving.controllers', [])

//View Controller
.controller('ViewCtrl', function($scope, $http, $ionicModal, PickActivity, PickedActivity, UserService) {
  $ionicModal.fromTemplateUrl('templates/user-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  }; 
  $scope.closeModal = function() {
    $scope.modal.hide();
  }; 
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  $scope.$on('modal.hidden', function() {
  });
  $scope.$on('modal.removed', function() {
  });
  
  $scope.login = function (data) { 
	  $http.get('/icarving.api.pinche/user/login?username='+data.username+'&password='+data.password).
	  success(function(data, status, headers, config) {
		  var userid = data.response.uid;
		  var username = data.response.username;
		  var password = data.response.password;
		  
		  var date=new Date();
		  var expireDays=10;
		  date.setTime(date.getTime()+expireDays*24*3600*1000);
		  var cookieStr = "uid="+userid+"; expires="+date.toUTCString();
		  document.cookie=cookieStr;
		  cookieStr = "username="+username+"; expires="+date.toUTCString();
		  document.cookie=cookieStr;
		  cookieStr = "password="+password+"; expires="+date.toUTCString();
		  document.cookie=cookieStr;
		  
		  uid=userid;		  
		  $scope.closeModal(); 
	  }).
	  error(function(data, status, headers, config) {
		  alert("登录失败");
	 });
  }; 
	
   $scope.register = function (data1) { 
	   var payload = {"username":data1.username,"password":data1.password,"name":data1.name,"phone":data1.phone}
	   $http.post('/icarving.api.pinche/user/register', payload).
	   success(function(data, status, headers, config) {
		  var userid = data.response.uid;
		  var username = data.response.username;
		  var password = data.response.password;
		  
		  var date=new Date();
		  var expireDays=10;
		  date.setTime(date.getTime()+expireDays*24*3600*1000);
		  var cookieStr = "uid="+userid+"; expires="+date.toUTCString();
		  document.cookie=cookieStr;
		  cookieStr = "username="+username+"; expires="+date.toUTCString();
		  document.cookie=cookieStr;
		  cookieStr = "password="+password+"; expires="+date.toUTCString();
		  document.cookie=cookieStr;
		  
		  uid=userid;		  
		  $scope.closeModal(); 
	   }).
	   error(function(data, status, headers, config) {
		  alert("注册失败");
	   });
  }; 
	
    var cookieUid = UserService.getUid();
	
	PickActivity.all().success(function(res){
		if(cookieUid != ""){
			uid = cookieUid;
		} else {
			 $scope.openModal();
		}
		$scope.items = res.response;
		PickActivity.save($scope.items);
	});
	PickedActivity.all().success(function(res){
		$scope.items1 = res.response;
		PickedActivity.save($scope.items1);
	});

	$scope.doRefresh = function() {
		PickActivity.all().success(function(res){
			$scope.items = res.response;
			PickActivity.save($scope.items);
		});
		PickedActivity.all().success(function(res){
			$scope.items1 = res.response;
			PickedActivity.save($scope.items1);
		});
		$scope.$broadcast('scroll.refreshComplete');
    }
})

//View Pick Activity Detail Controller
.controller('ViewPickDetailCtrl', function($scope, $http, $stateParams, PickActivity) {
	$scope.pick = PickActivity.get($stateParams.pickId);
	
	$scope.applyPickActivity = function(){
		var payload = {"pickActivityId":$scope.pick.pickActivityId,"applyUserId":uid};
		$http.post('/icarving.api.pinche/apply/pick/create', payload).
		  success(function(data, status, headers, config) {
			  alert("捡人活动申请成功");
		  }).
		  error(function(data, status, headers, config) {
			  alert("捡人活动申请失败");
		  });
	};
})

//View Picked Activity Detail Controller
.controller('ViewPickedDetailCtrl', function($scope, $http, $stateParams, PickedActivity) {
	$scope.picked = PickedActivity.get($stateParams.pickedId);
	
	$scope.applyPickedActivity = function(){
		var payload = {"pickedActivityId":$scope.picked.pickedActivityId,"applyUserId":uid};
		$http.post('/icarving.api.pinche/apply/picked/create', payload).
		  success(function(data, status, headers, config) {
			  alert("求捡活动申请成功");
		  }).
		  error(function(data, status, headers, config) {
			  alert("求捡活动申请失败");
		  });
	};
})

//Pick Activity Controller
.controller('PickCtrl', function($scope, $http) {
	$scope.model = {};
	$scope.publishPickActivity = function(){
		var payload = {"ownerId":uid,"startTime":$scope.model.startTime,"returnTime":$scope.model.returnTime,"sourceAddress":$scope.model.sourceAddress,"destAddress":$scope.model.destAddress,"charge":$scope.model.charge,"carType":$scope.model.carType,"capacity":$scope.model.capacity,"note":$scope.model.note};
		$http.post('/icarving.api.pinche/activity/pick/create', payload).
		  success(function(data, status, headers, config) {
			  alert("捡人活动发布成功");
		  }).
		  error(function(data, status, headers, config) {
			  alert("捡人活动发布失败");
		  });
	}
})

//Picked Activity Controller
.controller('PickedCtrl', function($scope, $http) {
	$scope.model = {};
	$scope.publishPickedActivity = function(){
		var payload = {"ownerId":uid,"startTime":$scope.model.startTime,"returnTime":$scope.model.returnTime,"sourceAddress":$scope.model.sourceAddress,"destAddress":$scope.model.destAddress,"charge":$scope.model.charge,"carType":$scope.model.carType,"note":$scope.model.note};
		$http.post('/icarving.api.pinche/activity/picked/create', payload).
		  success(function(data, status, headers, config) {
			  alert("求捡活动发布成功");
		  }).
		  error(function(data, status, headers, config) {
			  alert("求捡活动发布失败");
		  });
	}
})

//My Activity/Apply Controller
.controller('MyCtrl', function($scope, $http, $ionicModal, MyPickActivity, MyPickedActivity, MyPickActivityApply, MyPickedActivityApply, UserService) {
	 $ionicModal.fromTemplateUrl('templates/user-modal.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	  }).then(function(modal) {
	    $scope.modal = modal;
	  });
	  $scope.openModal = function() {
	    $scope.modal.show();
	  };
	  $scope.closeModal = function() {
		$scope.modal.hide();
	  }; 
	  $scope.$on('$destroy', function() {
	    $scope.modal.remove();
	  });
	  $scope.$on('modal.hidden', function() {
	  });
	  $scope.$on('modal.removed', function() {
	  });
	  
	  $scope.login = function (data) { 
		  $http.get('/icarving.api.pinche/user/login?username='+data.username+'&password='+data.password).
		  success(function(data, status, headers, config) {
			  var userid = data.response.uid;
			  var username = data.response.username;
			  var password = data.response.password;
			  
			  var date=new Date();
			  var expireDays=10;
			  date.setTime(date.getTime()+expireDays*24*3600*1000);
			  var cookieStr = "uid="+userid+"; expires="+date.toUTCString();
			  document.cookie=cookieStr;
			  cookieStr = "username="+username+"; expires="+date.toUTCString();
			  document.cookie=cookieStr;
			  cookieStr = "password="+password+"; expires="+date.toUTCString();
			  document.cookie=cookieStr;
			  
			  uid=userid;		  
			  $scope.closeModal(); 
		  }).
		  error(function(data, status, headers, config) {
			  alert("登录失败");
		 });
	  }; 
		
	   $scope.register = function (data1) { 
		   var payload = {"username":data1.username,"password":data1.password,"name":data1.name,"phone":data1.phone}
		   $http.post('/icarving.api.pinche/user/register', payload).
		   success(function(data, status, headers, config) {
		   var userid = data.response.uid;
		   var username = data.response.username;
		   var password = data.response.password;
		   
		   var date=new Date();
		   var expireDays=10;
		   date.setTime(date.getTime()+expireDays*24*3600*1000);
		   var cookieStr = "uid="+userid+"; expires="+date.toUTCString();
		   document.cookie=cookieStr;
		   cookieStr = "username="+username+"; expires="+date.toUTCString();
		   document.cookie=cookieStr;
		   cookieStr = "password="+password+"; expires="+date.toUTCString();
		   document.cookie=cookieStr;
		  
		   uid=userid;		  
		   $scope.closeModal(); 
		 }).
		   error(function(data, status, headers, config) {
			  alert("注册失败");
		   });
	  }; 
	  	   
	  $scope.logoff = function () { 
		  $http.get('/icarving.api.pinche/user/logoff?username='+UserService.getUsername()+'&password='+UserService.getPassword()).
		  success(function(data, status, headers, config) {
			  var userid = UserService.getUid();
			  var username = UserService.getUsername();
			  var password = UserService.getPassword();
			  
			  var date=new Date();
			  date.setTime(date.getTime()-10000);
			  var deleteCookieStr = "uid="+userid+"; expires="+date.toUTCString();
			  document.cookie=deleteCookieStr;	
			  deleteCookieStr = "username="+username+"; expires="+date.toUTCString();
			  document.cookie=deleteCookieStr;	
			  deleteCookieStr = "password="+password+"; expires="+date.toUTCString();
			  document.cookie=deleteCookieStr;	
			 
			  uid = 0;
			  $scope.openModal(); 
		  }).
		  error(function(data, status, headers, config) {
			 alert("退出登录失败");
		 });
	 }; 
	
	 var cookieUid = UserService.getUid();
	 
	 MyPickActivity.all().success(function(res){
		if(cookieUid != ""){
			uid = cookieUid;
		} else {
			 $scope.openModal();
		}
		 $scope.items = res.response;
		 MyPickActivity.save($scope.items);
	 });
	 MyPickedActivity.all().success(function(res){
		 $scope.items1 = res.response;
		 MyPickedActivity.save($scope.items1);
	 });
	 MyPickActivityApply.all().success(function(res){
		 $scope.items2 = res.response;
		 MyPickActivityApply.save($scope.items2);
	 });
	 MyPickedActivityApply.all().success(function(res){
		 $scope.items3 = res.response;
		 MyPickedActivityApply.save($scope.items3);
	 });
	 
	  $scope.doRefresh = function() {
		 MyPickActivity.all().success(function(res){
			 $scope.items = res.response;
			 MyPickActivity.save($scope.items);
		 });
		 MyPickedActivity.all().success(function(res){
			 $scope.items1 = res.response;
			 MyPickedActivity.save($scope.items1);
		 });
		 MyPickActivityApply.all().success(function(res){
			 $scope.items2 = res.response;
			 MyPickActivityApply.save($scope.items2);
		 });
		 MyPickedActivityApply.all().success(function(res){
			 $scope.items3 = res.response;
			 MyPickedActivityApply.save($scope.items3);
		 });
		 $scope.$broadcast('scroll.refreshComplete');
      }
	
})

//My Pick Activity Detail Controller
.controller('MyPickDetailCtrl', function($scope, $http, $stateParams, MyPickActivity) {
	$scope.pick = MyPickActivity.get($stateParams.pickId);

    $scope.updatePickActivity = function(){
		var payload = {"pickActivityId":$scope.pick.pickActivityId,"startTime":$scope.pick.startTime,"returnTime":$scope.pick.returnTime,"sourceAddress":$scope.pick.sourceAddress,"destAddress":$scope.pick.destAddress,"charge":$scope.pick.charge,"carType":$scope.pick.carType,"note":$scope.pick.note};
		$http.post('/icarving.api.pinche/activity/pick/update', payload).
		  success(function(data, status, headers, config) {
			  alert("捡人活动更新成功");
		  }).
		  error(function(data, status, headers, config) {
			  alert("捡人活动更新失败");
		  });
    };
    
    $scope.cancelPickActivity = function(){
		 $http.get('/icarving.api.pinche/activity/pick/cancel?uid='+uid+'&pickActivityId='+$scope.pick.pickActivityId).
		  success(function(data, status, headers, config) {
			  alert("捡人活动取消成功");
		  }).
		  error(function(data, status, headers, config) {
			  alert("捡人活动取消失败");
		  });
    };
    
})

//My Picked Activity Detail Controller
.controller('MyPickedDetailCtrl', function($scope, $http, $stateParams, MyPickedActivity) {
	$scope.picked = MyPickedActivity.get($stateParams.pickedId);
	
    $scope.updatePickedActivity = function(){
		var payload = {"pickedActivityId":$scope.picked.pickedActivityId,"startTime":$scope.picked.startTime,"returnTime":$scope.picked.returnTime,"sourceAddress":$scope.picked.sourceAddress,"destAddress":$scope.picked.destAddress,"charge":$scope.picked.charge,"carType":$scope.picked.carType,"note":$scope.picked.note};
		$http.post('/icarving.api.pinche/activity/picked/update', payload).
		  success(function(data, status, headers, config) {
			  alert("求捡活动更新成功");
		  }).
		  error(function(data, status, headers, config) {
			  alert("求捡活动更新失败");
		  });
    };
    
    $scope.cancelPickedActivity = function(){
		 $http.get('/icarving.api.pinche/activity/picked/cancel?uid='+uid+'&pickedActivityId='+$scope.picked.pickedActivityId).
		  success(function(data, status, headers, config) {
			  alert("求捡活动取消成功");
		  }).
		  error(function(data, status, headers, config) {
			  alert("求捡活动取消失败");
		  });
   };
})

//My Pick Activity Apply Detail Controller
.controller('MyPickApplyDetailCtrl', function($scope, $http, $stateParams, MyPickActivityApply) {
	$scope.pickApply = MyPickActivityApply.get($stateParams.pickApplyId);
	
	$scope.cancelPickActivityApply = function(){
		 $http.get('/icarving.api.pinche/apply/pick/cancel?uid='+uid+'&pickActivityApplyId='+$scope.pickApply.pickActivityApplyId).
		  success(function(data, status, headers, config) {
			  alert("捡人活动申请取消成功");
		  }).
		  error(function(data, status, headers, config) {
			  alert("捡人活动申请取消失败");
		  });
	};
})

//My Picked Activity Apply Detail Controller
.controller('MyPickedApplyDetailCtrl', function($scope, $http, $stateParams, MyPickedActivityApply) {
	$scope.pickedApply = MyPickedActivityApply.get($stateParams.pickedApplyId);
	
	$scope.cancelPickedActivityApply = function(){
		 $http.get('/icarving.api.pinche/apply/picked/cancel?uid='+uid+'&pickedActivityApplyId='+$scope.pickedApply.pickedActivityApplyId).
		  success(function(data, status, headers, config) {
			  alert("求捡活动申请取消成功");
		  }).
		  error(function(data, status, headers, config) {
			  alert("求捡活动申请取消失败");
		  });
	};
});