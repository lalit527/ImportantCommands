ticketApp.controller('allTicketController', ['$http',  'getAllDataService', 'NgTableParams', '$location', function($http, 
 getAllDataService, NgTableParams, $location){
	  var main = this;
	
    main.allTickets = [];
    main.ticket = 1;
    main.ticketArr = [];
    /*var ticket = getAllTicketService.getAllTicketData(1).then(function(result){
    	
    });*/
    var ticketFunc = function(ticket){
    getAllDataService.getAllTicket(ticket).then(function successCallback(response){

                  console.log(response);
                  for(var indx in response.data){
                      var tmpObject = {
                          "requestor" :  response.data[indx].requestor,
                          "subject" :  response.data[indx].subject,
                          "type" :  response.data[indx].type,
                          "status" :  response.data[indx].status,
                          "priority" :  response.data[indx].priority,
                          "agent" :  response.data[indx].agent,
                          "description" :  response.data[indx].description,
                          "createdOn" : response.data[indx].createdOn,
                          "ticketNum" : response.data[indx].ticketNum,
                          "id" : response.data[indx]._id
                      }

                     main.allTickets.push(tmpObject);
                      if(response.headers('link')){

                        main.ticket = response.headers('link');
                        //return deferred.promise;    
                      }else{
                        main.ticket = 0;
                        //deferred.resolve(main.ticketArr);   
                      }
                      
                  }
                  //main.allTickets = result;
			        main.ticketTable = new NgTableParams({
			        // initial sort order
			        page: 1,
			        count: 25
			        }, {
			           //console.log(main.houseArr);
			           dataset: main.allTickets
			        });

            });
        
    }(main.ticket);

    main.goToDetail = function(id){
        $location.path('/dashboard/ticketdetail/'+id);
    }
    

    console.log('ticket'+main.allTickets);

}]);