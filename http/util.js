var util = [];

util.replaceClass = function(element, oldClass, newClass) {
    if (element.hasClass(oldClass)) {
        element.removeClass(oldClass);
    }

    element.addClass(newClass);
}

util.changeBtnColor = function(button, newClass) {
    if (button.hasClass('btn-default')) {
        button.removeClass('btn-default');
    }

    if (button.hasClass('btn-primary')) {
        button.removeClass('btn-primary');
    }

    if (button.hasClass('btn-success')) {
        button.removeClass('btn-success');
    }

    if (button.hasClass('btn-info')) {
        button.removeClass('btn-info');
    }

    if (button.hasClass('btn-warning')) {
        button.removeClass('btn-warning');
    }

    if (button.hasClass('btn-danger')) {
        button.removeClass('btn-danger');
    }

    button.addClass(newClass);
}
