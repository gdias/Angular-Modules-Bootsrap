"use strict";

module.exports.labelDirective = function(){
    return{
        restrict: 'E', //Element (Tag)
        template:
            '<span class="label label-info">{{cat.Name}}</span>'
    };
}
