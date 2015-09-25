define(function (require) {
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');

    require('tpl!./../notification.html');

    module.provider('$notification', function() {
        this.options = {
            timeout: 5000,
            startTop: 10,
            verticalSpacing: 10,
            bufferTop: 50,
            positionY: 'top',
            templateUrl: 'core/notifications/notification.html'
        };

        this.setOptions = function(options) {
            this.options = ng.extend({}, this.options, options);
        };

        this.$get = ['$timeout', '$compile', '$templateRequest', '$rootScope', '$injector', '$q', '$controller', '$document',
            function($timeout, $compile, $templateRequest, $rootScope, $injector, $q, $controller, $document){
                var opts = this.options;
                var messageElements = [];

                /**
                 *
                 * @param {{timeout: number, scope: object, templateUrl: string, resolve: object, controller: string}} args
                 * @param t
                 */
                var notify = function (args, t) {
                    var deferred = $q.defer();

                    //if args is not an object make it the message
                    if (!ng.isObject(args)) {
                        args = {
                            message: args
                        };
                    }

                    var defaults = {
                        scope: $rootScope,
                        templateUrl: opts.templateUrl,
                        timeout: opts.timeout,
                        positionY: opts.positionY,
                        type: t || '',
                        resolve: {},
                        locals: {}
                    };

                    var settings = ng.merge(defaults, args);

                    var promises = [getTemplatePromise(settings)].concat(getResolvePromises(settings.resolve));

                    $q.all(promises).then(function(templateAndVars) {
                        var scope = settings.scope.$new();

                        ng.merge(scope, settings.locals);

                        var notificationInstance = {
                            content: templateAndVars[0],
                            scope: scope,
                            positionY: settings.positionY
                        };

                        var resolveIter = 1;

                        //bind the passed in controller to the scope
                        if (settings.controller) {
                            var locals = {
                                $scope: scope,
                                $notificationInstance: notificationInstance
                            };

                            ng.forEach(settings.resolve, function(value, key) {
                                locals[key] = templateAndVars[resolveIter++];
                            });

                            notificationInstance.controller = $controller(settings.controller, locals);
                        }

                        //Create notification element
                        var element = notificationInstance.element = $compile(templateAndVars[0])(scope);
                        var message = $compile('<div>' + settings.message + '</div>')(scope);
                        element.find('.message').html(message);

                        element.bind('webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd click', function(e) {
                            e = e.originalEvent || e;
                            var target = ng.element(e.target);
                            if (e.propertyName === 'opacity' && target.css('opacity') === '0') {
                                removeElement(notificationInstance);
                            }
                        });

                        scope.dismiss = function() {
                            removeElement(notificationInstance);
                        };

                        //Set the timeout
                        if(ng.isNumber(settings.timeout) && settings.timeout !== 0) {
                            $timeout(function() {
                                element.addClass('killed');
                            }, settings.timeout);
                        }

                        //attach element
                        addElement(notificationInstance);

                        var offset = -(parseInt(element[0].offsetHeight) + opts.bufferTop);
                        element.addClass(settings.type);
                        element.css(notificationInstance.positionY, offset + 'px');

                        messageElements.push(notificationInstance);

                        reposition();

                        deferred.resolve(notificationInstance);
                    });

                    return deferred.promise;
                };

                function reposition() {
                    var j = 0,
                        lastPosition = [],
                        top = 0,
                        instance,
                        el,
                        position,
                        elHeight;

                    for(var i = messageElements.length - 1; i >= 0; i--) {
                        instance = messageElements[i];
                        el = messageElements[i].element;
                        position = lastPosition[instance.positionY];
                        elHeight = parseInt(el[0].offsetHeight);

                        top = position ? (j === 0 ? position : position + opts.verticalSpacing) : opts.startTop;

                        el.css(instance.positionY, top + 'px');

                        lastPosition[instance.positionY] = top + elHeight;

                        j++;
                    }
                }

                function getTemplatePromise(options) {
                    return options.template ? $q.when(options.template) :
                        $templateRequest(ng.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl);
                }

                function getResolvePromises(resolves) {
                    var promisesArr = [];
                    ng.forEach(resolves, function (value) {
                        if(ng.isFunction(value) || ng.isArray(value)) {
                            promisesArr.push($q.when($injector.invoke(value)));
                        } else {
                            promisesArr.push($q.when(value));
                        }
                    });
                    return promisesArr;
                }

                function addElement(notificationInstance) {
                    var element = notificationInstance.element;
                    if (!messageElements.length) {
                        $document.find('body').append(ng.element('<div id="ui-notification-container"></div>'));
                    }
                    $document.find('#ui-notification-container').append(element);
                }

                function removeElement(notificationInstance) {
                    notificationInstance.element.remove();
                    messageElements.splice(messageElements.indexOf(notificationInstance), 1);
                    if (!messageElements.length) {
                        $document.find('#ui-notification-container').remove();
                    }
                    $timeout(reposition);
                }

                notify.primary = function(args) {
                    return this(args, 'primary');
                };

                notify.error = function(args) {
                    return this(args, 'error');
                };

                notify.success = function(args) {
                    return this(args, 'success');
                };

                notify.info = function(args) {
                    return this(args, 'info');
                };

                notify.warn = function(args) {
                    return this(args, 'warn');
                };

                notify.clearAll = function() {
                    ng.forEach(messageElements, function(d) {
                        d.element.addClass('killed');
                    });
                };

                return notify;
            }
        ];
    });
});
