(function(angular, $, window, document, TheSlot){
    
    TheSlot
        .factory('IconsResurce',
        
                   ['$resource',
            function($resource){                
                return $resource('https://pixabay.com/api/');
            }
        ])
        
})(angular, window.jQuery, window, document, TheSlot);