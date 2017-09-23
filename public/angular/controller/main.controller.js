ticketApp.controller('mainController', ['$http', '$state', 'getAllDataService', '$location', function($http, $state, getAllDataService, $location){
	  var main = this;
	  main.formData = {};
	  main.loginData = {};
    main.showLogin = true;
    main.loginFail = false;
    main.loginFailMsg = '';
      /*$http.get('http://localhost:3000/user/signup')
           .then(function(response){
              main.data = response;
       });*/

      
       main.signUp = function(){
       	  //alert('hello');
       	  /*$http({
       	  	method: 'POST',
       	  	url   :  'http://localhost:3000/user/signup',
       	  	data    : $.param(main.formData),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
       	  })
       	  .then(function(response){
              console.log(response);
           });*/
           getAllDataService.signupUser(main.formData).then(function successCallback(response){
                  $location.path('/dashboard/home');
           });
       }

       main.login = function(){
       	  //alert('hello');
       	  /*$http({
       	  	method: 'POST',
       	  	url   :  'http://localhost:3000/user/login',
       	  	data    : $.param(main.loginData),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
       	  })
       	  .then(function(response){
       	  	  alert('ok');
              console.log(response);
           });*/
           getAllDataService.loginUser(main.loginData).then(function successCallback(response){
                  if(response.data.error === true){
                     alert(response.data.message);
                      main.loginFail = true;
                      main.loginFailMsg = response.data.message;
                  }else{
                      console.log(response);
                      $location.path('/dashboard/home');
                      main.loginFail = false;
                  }
                  
           });
       }

}]);