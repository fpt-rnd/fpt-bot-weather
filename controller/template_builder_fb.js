const fbTemplate = require('./template_builder/botBuilder')



exports.getButton = function (title, item, callback) {
    let button = new fbTemplate.Button(title);
    for (i = 0; i < item.length; i++) {
        button
            .addButtonByType(item[i].title, item[i].payload, item[i].type)
    }

    return callback(button)
}

