var log4js = require('log4js');
var logger = log4js.getLogger();
const fbTemplate = require(global.rootPath + '/controller/template_builder/botBuilder')

class Maping {
    constructor(template_type, dataTemplate, callback) {
        if (!template_type)
            logger.debug('Template type cannot be empty');

        if (!dataTemplate)
            logger.debug('Data cannot be empty');

        let data
        switch (template_type) {
            case 'button':
                this.getButtonTemplate(dataTemplate, function (result) {
                    data = result;
                });
                break;
            case 'text':
                this.getTextTemplate(dataTemplate, function (result) {
                    data = result;
                });
                break;
            case 'quick_reply':
                this.getQuickReplyTemplate(dataTemplate, function (result) {
                    data = result;
                });
                break;
            case 'generic':
                this.getGenericTemplate(dataTemplate, function (result) {
                    data = result;
                });
                break;
            case 'list':
                this.getListTemplate(dataTemplate, function (result) {
                    data = result;
                });
                break;
            default:
                break;
        }

        return callback(data)
    }

    getTextTemplate(dataTemplate, callback) {
        let text = new fbTemplate.Text(dataTemplate.title);
        return callback(text);
    }

    getButtonTemplate(dataTemplate, callback) {
        let button = new fbTemplate.Button(dataTemplate.title);
        dataTemplate.item.forEach(element => {
            if (element.type === 'web_url') {
                button
                    .addButtonByType(element.title, element.url, element.type);
            } else if (element.type === 'account_link') {
                button
                    .addLoginButton(element.url);
            } else if (element.type === 'account_unlink') {
                button
                    .addLogoutButton();
            } else if (element.type === 'element_share') {
                button
                    .addShareButton(element.share_contents);
            } else if (element.type === 'phone_number') {
                button
                    .addCallButton(element.title, element.payload);
            } else {
                button
                    .addButtonByType(element.title, element.payload, element.type);
            }
        });

        return callback(button);
    }

    getQuickReplyTemplate(dataTemplate, callback) {
        let quick_reply = new fbTemplate.Text(dataTemplate.title);
        dataTemplate.item.forEach(element => {
            if (element.type === 'location') {
                quick_reply
                    .addQuickReplyLocation();
            } else if (element.type === 'text') {
                if (!element.title || !element.payload)
                    logger.debug('Both text and payload are required for a quick reply');

                element.image_url ?
                    quick_reply
                        .addQuickReply(element.title, element.payload, element.image_url)
                    :
                    quick_reply
                        .addQuickReply(element.title, element.payload, '');
            }
        });

        return callback(quick_reply);
    }

    getGenericTemplate(dataTemplate, callback) {
        let generic = new fbTemplate.Generic();
        dataTemplate.item.forEach(element => {
            if (!element.image_url)
                logger.debug('Image URL is required for addImage method');

            generic
                .addBubble(element.title, element.subtitle)
                .addImage(element.image_url)

            element.buttons.forEach(el => {
                if (el.type === 'web_url') {
                    generic
                        .addButtonByType(el.title, el.url, el.type);
                } else if (el.type === 'account_link') {
                    generic
                        .addLoginButton(el.url);
                } else if (el.type === 'account_unlink') {
                    generic
                        .addLogoutButton();
                } else if (el.type === 'element_share') {
                    generic
                        .addShareButton(el.share_contents);
                } else if (el.type === 'phone_number') {
                    generic
                        .addCallButton(el.title, el.payload);
                } else {
                    generic
                        .addButtonByType(el.title, el.payload, el.type);
                }
            });
        });

        return callback(generic);
    }

    getListTemplate(dataTemplate, callback) {
        let list = new fbTemplate.List('');
        dataTemplate.item.forEach(element => {
            element.image_url ?
                list
                    .addBubble(element.title, element.subtitle)
                    .addImage(element.image_url)
                :
                list
                    .addBubble(element.title, element.subtitle);

            element.buttons ?
                element.buttons.forEach(el => {
                    if (el.type === 'element_share') {
                        list
                            .addShareButton(el.share_contents);
                    } else if (el.type === 'web_url') {
                        list
                            .addButton(el.title, el.url, el.type);
                    } else {
                        list
                            .addButton(el.title, el.payload, el.type);
                    }
                })
                :
                null;
        });

        return callback(list);
    }
}

module.exports = {
    Maping: Maping
};