ticketApp.controller('dashboardController', ['$http', function($http){
	  var main = this;
	  main.ticketData = {};
    main.allAgent = [];
    main.name = 'Lalit Yadav';
      /*$http.get('http://localhost:3000/user/signup')
           .then(function(response){
              main.data = response;
       });*/

      
       main.getAllTicket = function(){
       	  //alert('hello');
       	  $http({
       	  	method: 'GET',
       	  	url   :  'http://localhost:3000/dashboard/ticket' 
       	  })
       	  .then(function(response){
              console.log(response);
           });
       }

       main.createTicket = function(){
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