(function(angular, $, window, documen, TheSlot, _){
    
    TheSlot.controller('MainController',
                ['$scope', '$q', 'IconsResurce', 'IconsListsResurce', 'getDraws',
        function ($scope,   $q,   IconsResurce,   IconsListsResurce,   getDraws) {
            
            var REELS_NUMBER = 5;
            
            var iconsList = [],
                imagesSet = [],
                reelsLoadingCount = 0;
            
            $scope.pageLoading = true;      
            $scope.reels = [];
            $scope.loadedIcons = [];
            $scope.spinButton = {
                isDisabled : true
            }
            
            //Reel Class
            function Reel(id){
                
                var reel = this;
                reel.id = id;
                reel.results = [];
                reel.status = "";
                reel.el;
                
                reel.init = function(results){
                    reel.el = angular.element("#results"+id);
                    reel.elAnimation = angular.element("#animation"+id);
                    reel.setResults(results)
                }                
                
                reel.spin = function(results){
                    
                    reel.el.removeClass("incoming-start");
                    reel.el.one(
                        'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
                        function(e) {
                            
                            reel.el
                                .off()
                                .addClass('hide');
                                
                            reel.elAnimation
                                .addClass("move");
                            
                            reel.timer = setTimeout(function(){
                                
                                reel.elAnimation
                                    .removeClass("move");
                                reel.el
                                    .removeClass('hide');
                                    
                                $scope.$apply(function(){
                                    reel.setResults(results);
                                });
                                            
                            }, (250*reel.id));
                            
                        }
                    );
                }
                
                reel.setResults = function(results){
                    
                    reel.results = results;
                    reel.el.addClass("incoming-start");
                    
                    reelsLoadingCount++;
                    if(reelsLoadingCount==REELS_NUMBER){
                        reelsLoadingCount = 0
                        $scope.spinButton.isDisabled = false;
                    }
                    
                } 
                
            }
            
            //To create a deferred object and manage the image loading
            function preload(id, url) {
                
                var deffered = $q.defer(),
                    image    = new Image(),
                    result   = {
                        id      : id,
                        success : true,
                        url     : url,
                    }
                    
                image.src = url;

                if (image.complete) {
                    result.success = true;
                    deffered.resolve(result);

                } else {

                    image.addEventListener('load', function() {
                        result.success = true;
                        deffered.resolve(result);
                    });

                    image.addEventListener('error', function() {
                        result.success = false;
                        deffered.reject(result);
                    });
                }

                return deffered.promise;
            }

            
            //To preLoad a subset of images
            function preLoadImages(newImages, callback){
                
                var requestedImageIDs = [].concat.apply([], newImages);
                var newImagesRequest = [];
                
                for(var i=0; i<requestedImageIDs.length; i++){
                    
                    var requestedImageID = requestedImageIDs[i];
                    if(typeof $scope.loadedIcons[requestedImageID] == 'undefined'){
                        
                        var newImage = _.find(imagesSet, function(image){
                            return (image.id == requestedImageID) ? image.previewURL : "";
                        })
                        newImagesRequest.push(preload(newImage.id, newImage.previewURL));
                    }  
                }
                
                //If some images are not loaded
                if(newImagesRequest.length>0){
                    
                    $q.all(newImagesRequest).then(
                        function(results) {

                        for(var i=0; i<results.length; i++){
                                
                                var image = results[i];
                                if(image.success){
                                    $scope.loadedIcons[image.id] = image.url;
                                }
                                
                            }
                            
                            $scope.pageLoading = false;
                            callback();                            
                        },
                        function(response){
                            //Manage Errors here
                            console.log(response);
                        }
                    );

                } else {
                    $scope.pageLoading = false;
                    callback();
                }
            }
            
            //To load the Icon List
            function getIconsList(){
                IconsListsResurce.get({},
                    function(response){
                        iconsList = response.fruits;
                        getImages(response.fruits);
                        
                    },
                    function(response){
                        //Manage Errors here
                    }
                )
            }
            
            //To get the images from Pixabay (in the icons list)
            function getImages(){
                
                var data = {
                        key : '1977706-68aaeadecf67f81ed50ad8c5f',
                        id  : iconsList.toString()
                    };         
                
                IconsResurce.get(data,
                    function(response){
                        imagesSet = response.hits;
                        //Set a factory to simulate a service to retrieve the spin result
                        getDraws.setDraws(iconsList, REELS_NUMBER);
                        initReels();
                    },
                    function(response){
                        //Manage Errors here
                        console.log(response);
                    }
                )                
            }
            
            function initReels(){
                
                var newResults = getDraws.getDraws();                
                
                function callback(){
                    
                    for(var i=0; i<REELS_NUMBER; i++){
                        
                        var result = newResults[i],
                            reel = $scope.reels[i];
                            
                        reel.init(result);
                    }
                    
                }
                
                preLoadImages(newResults, callback);       
            }
            
            //Method to start the Slot Spin
            function slotSpin(){
                
                $scope.pageLoading = true;
                $scope.spinButton.isDisabled = true;
                var newResults = getDraws.getDraws();                
                
                function callback(){
                    
                    for(var i=0; i<REELS_NUMBER; i++){
                        
                        var result = newResults[i],
                            reel = $scope.reels[i];
                            
                        reel.spin(result);
                    }
                    
                }
                
                preLoadImages(newResults, callback);
                
            }
            
            function init(){
                
                //Set the Reels
                for(var i=0; i<REELS_NUMBER; i++){
                    var reel = new Reel(i+1);
                    $scope.reels.push(reel);
                }
                
                //Load contents
                getIconsList();
            }
            
            init();
            
            $scope.slotSpin = slotSpin;    
        }
        
    ]);
    
}(angular, window.jQuery, window, document, TheSlot, _));