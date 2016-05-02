(function(angular, $, window, document, TheSlot, _){
    
    TheSlot
        .service('getDraws', function () {
            
            var drawsList   = [],
                results     = [],
                drawsNumber = 0,
                nResults    = 3;

            return {
                getDraws: function () {
                    results = [];
                    //Drawing number sets
                    for(var i=0; i<drawsNumber; i++){
                        var resultsSet = [];
                        
                        for(var ii=0; ii<nResults; ii++){
                            var randomnumber = Math.floor(Math.random()*drawsList.length);
                            resultsSet.push(drawsList[randomnumber]);
                        }
                        
                        results.push(resultsSet);                            
                    }
                    return results;
                },
                setDraws: function(list, n) {
                    drawsList = list;
                    drawsNumber = n;
                }
            };
        });
        
})(angular, window.jQuery, window, document, TheSlot, _);

