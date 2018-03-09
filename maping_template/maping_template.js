const fbTemplate = require(global.rootPath + '/controller/template_builder/botBuilder')

class Maping {
    constructor(template_type, title, item, callback) {
        if (!template_type)
            logger.debug('Template type cannot be empty');

        if (!item)
            logger.debug('Data cannot be empty');

        let data
        switch (template_type) {
            case 'button':
                this.getButtonTemplate(title, item, function (result) {
                    data = result;
                });
                break;
            case 'text':
                this.getTextTemplate(title, item, function (result) {
                    data = result;
                });
                break;
            case 'generic':
                this.getGenericTemplate(title, item);
                break;
            case 'list':
                this.getListTemplate(title, item);
                break;
            default:
                break;
        }

        return callback(data)
    }

    getTextTemplate(title, item, callback) {
        let text = new fbTemplate.Text(title);

        return callback(text);
    }

    getButtonTemplate(title, item, callback) {
        let button = new fbTemplate.Button(title);
        for (i = 0; i < item.length; i++) {
            button
                .addButtonByType(item[i].title, item[i].payload, item[i].type)
        }

        return callback(button);
    }

    getGenericTemplate(title, item) {

    }

    getListTemplate(title, item) {

    }
}

module.exports = {
    Maping: Maping
};