ticketApp.controller('mainController', ['$http', '$state', 'getAllDataService', '$location', '$cookies', 'getUserData', function($http, $state, getAllDataService, $location, $cookies, getUserData){
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
                      var userObject = {};
                      userObject.userName = response.data.userName;
                      userObject.id = response.data._id;
                      userObject.email = response.data.email;
                      userObject.mobile = response.data.mobileNumber;
                      userObject.auth = response.headers('x-auth');
                      var mainObject = {
                        currentUser: {
                          userName : response.data.userName,
                          id : response.data._id,
                          email : response.data.email,
                          mobile : response.data.mobileNumber,
                          auth : response.headers('x-auth')
                        }
                      }
                      $cookies.put('ensembleUser-auth', response.headers('x-auth'));
                      getUserData.setUser(response.data.email, response.data.userName);
                      $location.path('/dashboard/home');
                      main.loginFail = false;
                  }
                  
           });
       }

}]);