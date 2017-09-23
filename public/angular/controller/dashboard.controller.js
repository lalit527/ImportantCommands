ticketApp.controller('dashboardController', ['$http', 'getAllDataService', 'getAllTicketService', function($http, getAllDataService, getAllTicketService){
	  var main = this;
	  main.orightml = '';
    
    main.ticketData = {};
    main.ticketData.description = main.orightml;

    main.createTicket = function(){
        getAllDataService.createTicket(main.ticketData).then(function successCallback(response){
              if(response.data.error === true){
                 alert(response.data.message);
                  main.loginFail = true;
                  main.loginFailMsg = response.data.message;
              }else{
                  console.log(response);
                  //$location.path('/dashboard/home');
                  //main.loginFail = false;
              }
       });
    }
    
   

}]);