(function(angular, $, window, document, TheSlot){
    
    TheSlot
        .factory('IconsListsResurce',
        
                   ['$resource',
            function($resource){                
                return $resource('/moks/icons.json');
            }
        ])
        
})(angular, window.jQuery, window, document, TheSlot);