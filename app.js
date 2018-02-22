angular.module('tbbc', [
    "ngRoute",
    "mobile-angular-ui",
    "ui.router",
    "tbbc.main",
    "tbbc.book",
    "mobile-angular-ui.gestures",
    "tbbc.login",
    "tbbc.modal",
    "tbbc.bookings"
]).
config(['$locationProvider', '$routeProvider','$urlRouterProvider', function($locationProvider, $routeProvider, $urlRouterProvider) {
    $locationProvider.hashPrefix('!');

    $urlRouterProvider
        .otherwise('/login');

    // $routeProvider.otherwise({redirectTo: '/menu'});
}])


.run(['$rootScope', '$http', '$stateParams', '$state',
        function($rootScope, $http, $stateParams, $state) {

    $rootScope.bookings= function () {
            $state.go('bookings');
        };

        $rootScope.menu= function () {
            $state.go('menu');
        };

        socket.emit("register", { data: true });
        console.log("connected");

}])
.directive('carousel', function() {
    return {
        restrict: 'C',
        scope: {},
        controller: function() {
            this.itemCount = 0;
            this.activeItem = null;

            this.addItem = function() {
                var newId = this.itemCount++;
                this.activeItem = this.itemCount === 1 ? newId : this.activeItem;
                return newId;
            };

            this.next = function() {
                this.activeItem = this.activeItem || 0;
                this.activeItem = this.activeItem === this.itemCount - 1 ? 0 : this.activeItem + 1;
            };

            this.prev = function() {
                this.activeItem = this.activeItem || 0;
                this.activeItem = this.activeItem === 0 ? this.itemCount - 1 : this.activeItem - 1;
            };

        }
    };
})

.directive('carouselItem', function($drag) {
    return {
        restrict: 'C',
        require: '^carousel',
        scope: {},
        transclude: true,
        template: '<div class="item"><div ng-transclude></div></div>',
        link: function(scope, elem, attrs, carousel) {
            scope.carousel = carousel;
            var id = carousel.addItem();

            var zIndex = function() {
                var res = 0;
                if (id === carousel.activeItem) {
                    res = 2000;
                } else if (carousel.activeItem < id) {
                    res = 2000 - (id - carousel.activeItem);
                } else {
                    res = 2000 - (carousel.itemCount - 1 - carousel.activeItem + id);
                }
                return res;
            };

            scope.$watch(function() {
                return carousel.activeItem;
            }, function() {
                elem[0].style.zIndex = zIndex();
            });

            $drag.bind(elem, {
                //
                // This is an example of custom transform function
                //
                transform: function(element, transform, touch) {
                    //
                    // use translate both as basis for the new transform:
                    //
                    var t = $drag.TRANSLATE_BOTH(element, transform, touch);

                    //
                    // Add rotation:
                    //
                    var Dx = touch.distanceX;
                    var t0 = touch.startTransform;
                    var sign = Dx < 0 ? -1 : 1;
                    var angle = sign * Math.min((Math.abs(Dx) / 700) * 30, 30);

                    t.rotateZ = angle + (Math.round(t0.rotateZ));

                    return t;
                },
                move: function(drag) {
                    if (Math.abs(drag.distanceX) >= drag.rect.width / 4) {
                        elem.addClass('dismiss');
                    } else {
                        elem.removeClass('dismiss');
                    }
                },
                cancel: function() {
                    elem.removeClass('dismiss');
                },
                end: function(drag) {
                    elem.removeClass('dismiss');
                    if (Math.abs(drag.distanceX) >= drag.rect.width / 4) {
                        scope.$apply(function() {
                            carousel.next();
                        });
                    }
                    drag.reset();
                }
            });
        }
    };
})

.directive('dragMe', ['$drag', function($drag) {
    return {
        controller: function($scope, $element) {
            $drag.bind($element,
                {
                    //
                    // Here you can see how to limit movement
                    // to an element
                    //
                    transform: $drag.TRANSLATE_INSIDE($element.parent()),
                    end: function(drag) {
                        // go back to initial position
                        drag.reset();
                    }
                },
                { // release touch when movement is outside bounduaries
                    sensitiveArea: $element.parent()
                }
            );
        }
    };
}])

    .directive('qrcode', ['$window', function($window) {

        var canvas2D = !!$window.CanvasRenderingContext2D,
            levels = {
                'L': 'Low',
                'M': 'Medium',
                'Q': 'Quartile',
                'H': 'High'
            },
            draw = function(context, qr, modules, tile, color) {
                for (var row = 0; row < modules; row++) {
                    for (var col = 0; col < modules; col++) {
                        var w = (Math.ceil((col + 1) * tile) - Math.floor(col * tile)),
                            h = (Math.ceil((row + 1) * tile) - Math.floor(row * tile));

                        context.fillStyle = qr.isDark(row, col) ? color.foreground : color.background;
                        context.fillRect(Math.round(col * tile),
                            Math.round(row * tile), w, h);
                    }
                }
            };

        return {
            restrict: 'E',
            template: '<canvas class="qrcode"></canvas>',
            link: function(scope, element, attrs) {
                var domElement = element[0],
                    $canvas = element.find('canvas'),
                    canvas = $canvas[0],
                    context = canvas2D ? canvas.getContext('2d') : null,
                    download = 'download' in attrs,
                    href = attrs.href,
                    link = download || href ? document.createElement('a') : '',
                    trim = /^\s+|\s+$/g,
                    error,
                    version,
                    errorCorrectionLevel,
                    data,
                    size,
                    modules,
                    tile,
                    qr,
                    $img,
                    color = {
                        foreground: '#000',
                        background: '#fff'
                    },
                    setColor = function(value) {
                        color.foreground = value || color.foreground;
                    },
                    setBackground = function(value) {
                        color.background = value || color.background;
                    },
                    setVersion = function(value) {
                        version = Math.max(1, Math.min(parseInt(value, 10), 40)) || 5;
                    },
                    setErrorCorrectionLevel = function(value) {
                        errorCorrectionLevel = value in levels ? value : 'M';
                    },
                    setData = function(value) {
                        if (!value) {
                            return;
                        }

                        data = value.replace(trim, '');
                        qr = qrcode(version, errorCorrectionLevel);
                        qr.addData(data);

                        try {
                            qr.make();
                        } catch (e) {
                            var newVersion;
                            if (version >= 40) {
                                throw new Error('Data is too long', e);
                            }
                            newVersion = version + 1;
                            setVersion(newVersion);
                            console.warn('qrcode version is too low and has been incremented to', newVersion)
                            setData(value);
                            return;
                        }

                        error = false;
                        modules = qr.getModuleCount();
                    },
                    setSize = function(value) {
                        size = parseInt(value, 10) || modules * 2;
                        tile = size / modules;
                        canvas.width = canvas.height = size;
                    },
                    render = function() {
                        if (!qr) {
                            return;
                        }

                        if (error) {
                            if (link) {
                                link.removeAttribute('download');
                                link.title = '';
                                link.href = '#_';
                            }
                            if (!canvas2D) {
                                domElement.innerHTML = '<img src width="' + size + '"' +
                                    'height="' + size + '"' +
                                    'class="qrcode">';
                            }
                            scope.$emit('qrcode:error', error);
                            return;
                        }

                        if (download) {
                            domElement.download = 'qrcode.png';
                            domElement.title = 'Download QR code';
                        }

                        if (canvas2D) {
                            draw(context, qr, modules, tile, color);

                            if (download) {
                                domElement.href = canvas.toDataURL('image/png');
                                return;
                            }
                        } else {
                            domElement.innerHTML = qr.createImgTag(tile, 0);
                            $img = element.find('img');
                            $img.addClass('qrcode');

                            if (download) {
                                domElement.href = $img[0].src;
                                return;
                            }
                        }

                        if (href) {
                            domElement.href = href;
                        }
                    };

                if (link) {
                    link.className = 'qrcode-link';
                    $canvas.wrap(link);
                    domElement = domElement.firstChild;
                }

                setColor(attrs.color);
                setBackground(attrs.background);
                setVersion(attrs.version);
                setErrorCorrectionLevel(attrs.errorCorrectionLevel);
                setSize(attrs.size);

                attrs.$observe('version', function(value) {
                    if (!value) {
                        return;
                    }

                    setVersion(value);
                    setData(data);
                    setSize(size);
                    render();
                });

                attrs.$observe('errorCorrectionLevel', function(value) {
                    if (!value) {
                        return;
                    }

                    setErrorCorrectionLevel(value);
                    setData(data);
                    setSize(size);
                    render();
                });

                attrs.$observe('data', function(value) {
                    if (!value) {
                        return;
                    }

                    setData(value);
                    setSize(size);
                    render();
                });

                attrs.$observe('size', function(value) {
                    if (!value) {
                        return;
                    }

                    setSize(value);
                    render();
                });

                attrs.$observe('color', function(value) {
                    if (!value) {
                        return;
                    }

                    setColor(value);
                    render();
                });

                attrs.$observe('background', function(value) {
                    if (!value) {
                        return;
                    }

                    setBackground(value);
                    render();
                });

                attrs.$observe('href', function(value) {
                    if (!value) {
                        return;
                    }

                    href = value;
                    render();
                });
            }
        };}])
