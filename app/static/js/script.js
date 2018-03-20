

(function() {

    "use strict"

    // initialize application
    var app = {
        init: function() {
            api.init();
            routes.init();
            if ( window.location.hash.substring(1) == '' ) {
                window.location.href = '#gallery';
            }
        },
        loader: {
            show: function(loader) {
                loader.classList.remove('hide');
                TweenMax.set([send1,send2,send3], { opacity: 1 });
                TweenMax.to([wheel1,wheel2,wheel3], 3, { rotation: 360, transformOrigin: "center center", ease:Linear.easeNone, repeat: -1 });
                TweenMax.to(send1, 0.5, { opacity: 0, repeat: -1, repeatDelay: 0.75 });
                TweenMax.to(send2, 0.5, { opacity: 0, repeat: -1, repeatDelay: 0.75, delay: 0.2 });
                TweenMax.to(send3, 0.5, { opacity: 0, repeat: -1, repeatDelay: 0.75, delay: 0.4 });
            },
            hide: function(loader) {
                loader.classList.add('hide');
                TweenMax.killTweensOf([send1,send2,send3,wheel1,wheel2,wheel3]);
            }   
        }
    }

    var api = {
        init: function() {
            var solValue = 1000;
            this.request(solValue);
        },
        request: function(solValue) {
            var loader = document.getElementById('loader');
            app.loader.show(loader)
            // api_key=dbuOrGB7xoks2WobqPacpFP6fODFIU7gR0rStswa
            var self = this;
            var request = new XMLHttpRequest();
            request.open('GET', 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol='+solValue+'&page=1&api_key=dbuOrGB7xoks2WobqPacpFP6fODFIU7gR0rStswa', true);

            request.onload = function() {
                if (request.status >= 200 && request.status < 400) {
                    var rawData = JSON.parse(request.responseText).photos;
                    collection.init(rawData);
                    app.loader.hide(loader)
                } else { //console.log('Request niet toegestaan')
                    api.error();
                }
            };
            request.onerror = function() { //console.log('Geen response van de server')
                api.error();
            };

            request.send();
            
        },
        error: function(rawData) {

            var errorMessage = document.createElement('article');
            errorMessage.id = 'errorMessage';
            document.getElementById('gallery').appendChild(errorMessage);
            shaven.default(
                [document.getElementById('errorMessage'),
                    ['img', {src:'static/img/rover_broken kopie.svg'} ],
                    ['article',
                        ['h1', 'SERVER ERROR'],
                        ['p', 'De request kon niet worden voltooid'],
                        ['a', 'Probeer opnieuw', {href:'index.html'} ]
                    ]
                ]
            )
        }
    }

    // manipulate data
    var collection = {
        init: function(rawData) {
            this.clean(rawData);
        },
        clean: function(rawData) {

            var data = rawData.filter( function(currentValue, index, arr){
                if ( index/2 % 1 === 0 ) { 
                    return currentValue
                }
            });
            content.init(data);

        }
    }

    // handle routes & states
    var routes = {
        init: function() {
            this.handleEvent();
        },
        handleEvent: function() {
            var self = this;
            routie({
                ':id': function() {
                    var $this = this.params.id;
                    self.current($this);
                }
            });
        },
        current: function($this) {

            var routes = document.querySelectorAll('section.active')
            for (var i = 0; i < routes.length; i++) {
                routes[i].classList.remove('active');
            }
            var targetElement = document.getElementById($this);
            if ( targetElement ) {
                targetElement.classList.add('active');
            }

        }

    }

    // main template
    var content = {

        init: function(data) {

            this.create(data)

        },
        create: function(data) {
            
            for (var i = 0; i < data.length; i++) {
                var newEntry = document.createElement('a');
                newEntry.id = data[i].camera.name+'_'+i;//data.photos[i].id;
                newEntry.href = '#detail';
                document.getElementById('content').appendChild(newEntry);
            }
            this.render(data)
            detail.init(data);
            controls.event(data);
        },
        render: function(data) {
 
            for (var i = 0; i < data.length; i++) {
                var imgsrcRaw = data[i].img_src;
                var imgsrc = imgsrcRaw.replace("http", "https");
                var imgalt = 'ID: '+data[i].id+' | Camera: '+data[i].camera.full_name;
                shaven.default(
                    [document.getElementById(data[i].camera.name+'_'+i),//data.photos[i].id
                        ['div', 
                            ['img', {src: imgsrc, alt: 'NASA Mars Rover Images | '+imgalt}]
                        /*{
                            style: { 'background-image': 'url('+imgsrc+')' },
                        }*/
                        ],
                        ['ul',    
                            ['li', 'Camera',
                                ['p',data[i].camera.name]
                            ],
                            ['li', 'ID',
                                ['p',data[i].id]
                            ],    
                        ]   
                    ]
                )
            }
            this.animate(data)
        },
        animate: function(data) {
        	var a = document.querySelectorAll('#content>a');

    		for (var i = 0; i < a.length; i++) {
    			TweenMax.to(a[i], 0.5, { opacity: 1, scale: 1, y: 0, delay: (i-1)/10 });
    		}
        }
    }

    // detail template
    var detail = {
        init: function(data) {
            this.create(data);
        },
        create: function(data) {

            var newEntry_detail = document.createElement('section');
            newEntry_detail.id = 'detail';
            document.getElementById('body').appendChild(newEntry_detail);
            this.render(data);
            
        },
        render: function(data) {

            shaven.default(
                [document.getElementById('detail'),
                    ['header',
                        ['h1',
                            ['a','Gallery', {href:'index.html#gallery'}]],
                        ['p','>'],
                        ['p', 'detail' ]
                    ],
                    ['img', {id: 'detail_img'} ],
                    ['ul',    
                        ['li', 'ID',
                            ['p', {id: 'detail_id'} ]
                        ],
                        ['li', 'CAM',
                            ['p', {id: 'detail_cam'} ]
                        ],    
                    ]   
                ]
            )
            this.current(data);

        },
        current: function(data) {
            var self = this;
            var allElements = document.querySelectorAll("#content>a");
            for ( var i = 0; i < allElements.length; i++ ) {
                allElements[i].addEventListener("click", function() {
                    var aCurrent = this;
                    var aIndex = aCurrent.id.substr(-1);
                    self.update(data,aIndex);
                });    
            }
        },
        update: function(data,aIndex) {

            document.getElementById('detail_img').src       = data[aIndex].img_src;
            document.getElementById('detail_id').innerHTML  = data[aIndex].id;
            document.getElementById('detail_cam').innerHTML = data[aIndex].camera.name;

        }
    }

   // Filter UI
    var controls = {
    	event: function(data) {

            var self = this;
    		var filters = document.querySelectorAll('#gallery header a');

    		for (var i = 0; i < filters.length; i++) {
    			filters[i].addEventListener("click", function() {
    				var filterValue = this.innerHTML;
    				self.filter(data,filterValue)
    			});
    		}

            var filterSol = document.getElementById('submit');
            filterSol.addEventListener('click', function() {
                self.sol(data,filterSol)
            })

    	},
    	filter: function(data,filterValue) {

			var entries = document.querySelectorAll('#content>a');

    		for ( var i = 0; i < entries.length; i++ ) {
    			var camera = entries[i].id.substr(0,4)
    			if ( camera == filterValue || filterValue == 'Reset' ) {
    				entries[i].classList.remove('hide');
    			}
    			else {
    				entries[i].classList.add('hide');
    			}
    			
    		}
    	},
    	sol: function(data,filterSol) { // NOT WORKING YET

            var list = document.querySelectorAll("#content>a, #detail");

            for (var i = list.length-1; 0 <= i; i--) {
                list[i].remove()
            }
            var solValue = document.getElementById('solValue').value;

            document.getElementById('sol').innerHTML = solValue;

            api.request(solValue) // filter by sol (new api request)


    	}
    }

    // roep app.init aan
    app.init()

})()






