gotApp.factory('getSaveUser', ['$q','$http', '$interval', function($q, $http, $interval) {
     var main = this;
     main.books = 1;
     main.booksArr = [];
     var deferred = $q.defer();
     main.allData = [];
    


    var getAllBooksHelper = function(bookUrl, pageData){
        getAllDataService.getAllBookData(main.bookUrl, main.books , main.pageData).then(function successCallback(response){
                console.log(main.bookUrl+ main.books + main.pageData);
                console.log(response);
                for(var indx in response.data){
                   var tmpOject = {
                            "name": response.data[indx].name,
                            "bookName": response.data[indx].name,
                            "url" : response.data[indx].url,
                            "id"  : response.data[indx].url.substring(response.data[indx].url.lastIndexOf('/')+1),
                            "authors": response.data[indx].authors,
                            "released": response.data[indx].released,
                            "type": "books",
                            "result_id": main.books
                   };
                   main.booksArr.push(tmpOject);
                   main.allData.push(tmpOject);

                }
                ++main.books;
	     });

    }

    
    var getAllBooks = function(bookUrl, pageData){
    	main.bookUrl = bookUrl;
    	main.pageData = pageData;
    	$interval(getAllBooksHelper,5000,2).then(function(){
    		console.log(main.booksArr);
    		 deferred.resolve(main.booksArr);
    		
    	});
    	return deferred.promise;
    }

    return{
    	getAllBooks: getAllBooks
    }


    

}]);