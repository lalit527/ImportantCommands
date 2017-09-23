ticketApp.controller('allTicketController', ['$http',  'getAllTicketService', function($http, 
 getAllTicketService){
	  var main = this;
	  
    main.allTickets = [];

    
    
    main.allTickets = getAllTicketService.getAllTicketData();

    console.log('ticket'+main.allTickets);

}]);