ticketApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider,  $urlRouterProvider){
    

    //$urlRouterProvider.otherwise('/home');

    $stateProvider
     .state('home', {
        url: '/home',
        //template: 'hello'
        templateUrl     : 'views/landingPage.html',
        controller      : 'mainController',
        // what is the alias of that controller.
        controllerAs    : 'main'

     })

     .state('signup', {
        url: '/signup',

        templateUrl     : 'views/signup.html',
        controller      : 'mainController',
        // what is the alias of that controller.
        controllerAs    : 'main'

     })

     .state('login', {
        url: '/login',

        templateUrl     : 'views/login.html',
        controller      : 'mainController',
        // what is the alias of that controller.
        controllerAs    : 'main'
     })

     .state('dashboard',{
        abstract: true,
        url: '/dashboard',
        templateUrl     : 'views/dashboard.html'
     })

     .state('dashboard.home',{

        url: '/home',
        templateUrl     : 'views/dashboardhome.html'
     })

     .state('dashboard.newticket',{

        url: '/newticket',
        templateUrl     : 'views/ticket.html'
     })
    /*$stateProvider
        .when('/',{
            // location of the template
        	templateUrl		: 'views/landingPage.html',
        	// Which controller it should use 
            controller 		: 'mainController',
            // what is the alias of that controller.
        	controllerAs 	: 'main'
        })
		

        .otherwise(
            {
                //redirectTo:'/'
                template   : '<h1>404 page not found</h1>'
            }
        );*/
        /*$locationProvider.html5Mode({
             enabled: true,
            requireBase: false
        });*/
}]);