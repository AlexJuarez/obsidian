define(function (require) {
    'use strict';

    var module = require('./../module');

    module.service('propertyByString', [function () {

        /**
         * Get a deeply nested property of an object by a string,
         * e.x. "car.drivetrain.wheels"
         *
         * @param object The object to get the property from
         * @param propertyString The string denoting the property of the object
         */
        function getPropertyByString(object, propertyString) {
            if (!propertyString) {
                return object;
            } else {
                var properties = propertyString.split('.');
                var currentProperty;
                var objectExplorer = object;

                for(var i = 0; i < properties.length; i ++) {
                    currentProperty = properties[i];
                    if(currentProperty in object) {
                        objectExplorer = objectExplorer[currentProperty];
                    } else {
                        return;
                    }
                }
                return objectExplorer;
            }
        }

        /**
         * Set a deeply-nested property of an object by a string
         * @param object The object to set the property of
         * @param value The value to se the property to
         * @param propertyString The string denoting the property of the object
         */
        function setPropertyByString(object, value, propertyString) {
            var properties = propertyString.split('.');
            var objectToAccess;
            if (properties.length > 1) {
                var objectToAccessString = properties.slice(0, properties.length - 1).join('.');
                objectToAccess = getPropertyByString(objectToAccessString);
            } else {
                objectToAccess = object;
            }
            var propertyToChange = properties.slice(-1)[0];
            objectToAccess[propertyToChange] = value;
        }

        return {
            get: getPropertyByString,
            set: setPropertyByString
        };
    }]);
});
