ticketApp.directive("allTickets", ['$compile', '$templateRequest', '$interpolate', function ($compile, $templateRequest, $interpolate){
   var templateUrl = 'angular/directives/templates/ticket.template.html';
   /*return {
   		restrict:'EA',
        templateUrl: 'angular/directives/templates/books.template.html'
    }*/
    /*return function($scope, element, attr){
    	  $templateRequest(templateUrl).then(function(html){
                  var ele = angular.element(html);
		          element.parent().find('ul').append(ele);
		          $compile(ele)(scope);
    	  });
          
    }*/
    return{
    compile: function( tElement, tAttributes ) {

            return {
                pre: function preLink( scope, element, attributes ) {
                },
                post: function postLink( scope, element, attributes ) {
                    $templateRequest(templateUrl).then(function(html){
                        var ele = angular.element(html);
                        element.parent().append(ele);
                        //element.append((ele));
                        $compile(ele)(scope);
                    });
                }
            };
         }
    }
}]);