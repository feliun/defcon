angular.module('defconApp').directive('cmHandlebars',
    function cmHandlebarsDirective() {
        return {
            compile: function cmHandlebarsCompile(tElement) {
                var template = Handlebars.compile(tElement.html());
                tElement.empty();

                return function cmHandlebarsLink(iScope, iElement, iAttrs) {
                    if (iAttrs.cmHandlebars) {
                        iScope.$watch(iAttrs.cmHandlebars, render);
                    } else {
                        render();
                    }

                    function render() {
                        iElement.html(template(iScope));
                    }
                }
            }
        };
    }
);

Handlebars.registerHelper('equals', function(value1, value2, options) {
    if (value1 == value2) return options.fn(this);
    return options.inverse(this);
});

Handlebars.registerHelper('titleCase', function(value) {
    return value.replace(/\w\S*/g, function(text){
        return text.charAt(0).toUpperCase() + text.substr(1);
    });
}); 

Handlebars.registerHelper('cssCase', function(value) {
    return value.replace(/\w\S*/g, function(text){
        return text.charAt(0).toLowerCase() + text.substr(1);
    });
}); 