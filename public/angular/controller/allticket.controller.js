ticketApp.controller('allTicketController', ['$http',  'getAllTicketService', function($http, 
 getAllTicketService){
	  var main = this;
	
    main.allTickets = [];
    var ticket = getAllTicketService.getAllTicketData;

    main.allTickets = ticket();

    console.log('ticket'+main.allTickets);

}]);