(function() {
	'use strict';

	angular.module('dmi-crop', [])
		.directive('dmiCrop', ['$timeout', function($timeout) {
			return {
				restrict: 'EA',
				controller: 'CropController',
                controllerAs: 'crop',
				templateUrl: '../template/dmi-crop.html'
			};
		}])
		.controller('CropController', ['$scope', '$timeout', '$interval',
		function ($scope, $timeout, $interval) {
			var self = this;
            this.height = 200;
            this.width = 200;
            this.click = function(){
                console.log("ok");
                $timeout(function() {
                    var el = document.getElementById('input-crop');
                    angular.element(el).triggerHandler('click');
                }, 0);
            };

            var allowedTypes = ['png', 'jpg', 'jpeg', 'gif'],
                fileInput = document.querySelector('#input-crop'),
                canvas  = document.querySelector('#canvas-crop'),
                context = canvas.getContext('2d'),
                img, imgWidth, imgHeight, x, y, w, h, canvasRatio, imgRatio;
                
                

            fileInput.addEventListener('change', function() {

                var files = this.files,
                    filesLen = files.length,
                    imgType;

                for (var i = 0 ; i < filesLen ; i++) {

                    imgType = files[i].name.split('.');
                    imgType = imgType[imgType.length - 1];

                    if(allowedTypes.indexOf(imgType) != -1) {
                        createCanvas(files[i]);
                    }

                }

            }, false);
            function createCanvas(file) {
                
                $("#input-crop").css("display","none");
                $("#canvas-crop").css("cursor","move");

                var reader = new FileReader();

                reader.addEventListener('load', function() {
                    img = new Image();
                    //console.log(img);
                    img.src = this.result;
                    canvasRatio = self.width / self.height;
                    img.addEventListener('load', function() {
                        imgWidth = img.width;
                        imgHeight = img.height;
                        console.log("imgWidth:"+imgWidth);
                        console.log("imgHeight:"+imgHeight);
                        imgRatio = imgWidth / imgHeight;
                        console.log("imgRatio:"+imgRatio);
                        console.log("canvasRatio:"+canvasRatio);
                        if(imgRatio > canvasRatio){
                            console.log("bonne hauteur");
                            //bonne hauteur
                            y = 0;
                            h = imgHeight;
                            //on coupe la largeur
                            w = imgHeight / canvasRatio;
                            x = (imgWidth - w) / 2;
                        }else{
                            console.log("bonne largeur");
                            //bonne largeur
                            x = 0;
                            w = imgWidth;
                            //on coupe la hauteur
                            h = imgWidth * canvasRatio;
                            y = (imgHeight - h) / 2;
                        }
                        console.log("x:"+x);
                        console.log("y:"+y);
                        console.log("w:"+w);
                        console.log("h:"+h);
                        context.clearRect ( 0 , 0 , canvas.width, canvas.height );
                        context.drawImage(img, x, y, w, h, 0, 0, self.width, self.height);
                    }, false);
                }, false);
                reader.readAsDataURL(file);
            }
            var clicking = false;
            var mouseX, mouseY;

            $('#canvas-crop').mousedown(function(){
                clicking = true;
                console.log('mousedown');
            });

            $(document).mouseup(function(){
                clicking = false;
                console.log('mouseup');
                mouseX = undefined;
                mouseY = undefined;
            })

            $('#canvas-crop').mousemove(function(e){
                if(clicking == false) return;

                // Mouse click + moving logic here
                //console.log('mouse moving');
                //console.log(e);
                if(mouseX !== undefined && mouseY !== undefined){
                    //console.log(e.clientX - mouseX);
                    //console.log(e.clientY - mouseY);
                    var r = w / self.width;
                    if(imgRatio > canvasRatio){
                        x -= (e.clientX - mouseX) * r;
                    }
                    if(imgRatio < canvasRatio){
                        y -= (e.clientY - mouseY) * r;
                    }
                    if(x < 0){
                        x = 0;
                    }
                    if(y < 0){
                        y = 0;
                    }
                    if(x > w/2){
                        x = w/2;
                    }
                    if(y > h/2){
                        y = h/2;
                    }
                    console.log("x:"+x);
                    console.log("y:"+y);
                    console.log("w:"+w);
                    console.log("h:"+h);
                    context.clearRect ( 0 , 0 , canvas.width, canvas.height );
                    context.drawImage(img, x, y, w, h, 0, 0, self.width, self.height);
                }
                mouseX = e.clientX;
                mouseY = e.clientY;
            });
        }]);
})();