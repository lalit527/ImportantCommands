ticketApp.controller('mainController', ['$http', '$state', function($http, $state){
	  var main = this;
	  main.formData = {};
	  main.loginData = {};
      /*$http.get('http://localhost:3000/user/signup')
           .then(function(response){
              main.data = response;
       });*/

      
       main.signUp = function(){
       	  //alert('hello');
       	  $http({
       	  	method: 'POST',
       	  	url   :  'http://localhost:3000/user/signup',
       	  	data    : $.param(main.formData),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
       	  })
       	  .then(function(response){
              console.log(response);
           });
       }

       main.login = function(){
       	  //alert('hello');
       	  $http({
       	  	method: 'POST',
       	  	url   :  'http://localhost:3000/user/login',
       	  	data    : $.param(main.loginData),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
       	  })
       	  .then(function(response){
       	  	  alert('ok');
              console.log(response);
           });
       }

}]);