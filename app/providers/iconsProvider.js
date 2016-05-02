(function(angular, $, window, document, TheSlot){
    
    TheSlot.provider('icons', function () {
        
        var menu = {};
        
        return {
            setMenu : function(data){
                menu = data;
            },
            $get : function(){
                return menu;
            }
        };
        
    });
        
})(angular, window.jQuery, window, document, TheSlot);