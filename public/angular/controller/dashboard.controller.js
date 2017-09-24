ticketApp.controller('dashboardController', ['$http', 'getAllDataService', 'getAllTicketService', '$location', function($http, getAllDataService, getAllTicketService, $location){
	  var main = this;
	  main.orightml = '';
    
    main.ticketData = {};
    main.ticketData.description = main.orightml;
    main.types = ["Question","Incident","Problem"];
    main.status = ["Open","Pending","Resolved"];
    main.priority = ["Low","Medium","Critical"];

    main.formInput = {};

    main.createTicket = function(){
        getAllDataService.createTicket(main.ticketData).then(function successCallback(response){
              if(response.data.error === true){
                 alert(response.data.message);
                  main.loginFail = true;
                  main.loginFailMsg = response.data.message;
              }else{
                  console.log(response);
                  $location.path('/dashboard/home');
                  //main.loginFail = false;
              }
       });
    }


    var formdata = new FormData();
    main.getTheFiles = function ($files) {
        angular.forEach($files, function (value, key) {
            formdata.append(key, value);
        });
    };
    
    main.loadFile = function(){
      $http({
          method: 'POST',
          url   :  'http://localhost:3000/ticket/file/upload/1',
          data    : formdata,  // pass in data as strings
          headers : { 'Content-Type': undefined } 
      }).then(function successCallback(response){
              if(response.data.error === true){
                 alert(response.data.message);
                  //main.loginFail = true;
                  //main.loginFailMsg = response.data.message;
              }else{
                  console.log(response);
                  //$location.path('/dashboard/home');
                  //main.loginFail = false;
              };
    });
  }
   

}]);