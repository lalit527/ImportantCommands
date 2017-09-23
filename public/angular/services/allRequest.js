'use strict'
ticketApp.factory('getAllDataService', ['$http', function($http) {
    var main = this; //setting the context
    var signupUser = function(formData) {
        return $http({
            method: 'POST',
            url   :  'http://localhost:3000/user/signup',
            data    : $.param(formData),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
          });
    }


    var loginUser = function(formData) {
        return $http({
            method: 'POST',
            url   :  'http://localhost:3000/user/login',
            data    : $.param(formData),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
          });
    }

    var createTicket = function(formData) {
        return $http({
            method: 'POST',
            url   :  'http://localhost:3000/ticket/createticket',
            data    : $.param(formData),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
          });
    }
    
    var getAllTicket = function(pageNum) {
        return $http({
            method: 'GET',
            url   :  'http://localhost:3000/ticket/alltickets/check/'+pageNum 
          });
    }
    
    return {
        signupUser: signupUser,
        loginUser: loginUser,
        createTicket : createTicket,
        getAllTicket: getAllTicket
    }
}]);
