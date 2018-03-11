const maping_template = require(global.rootPath + '/maping_template/maping_template')
const fbTemplate = require(global.rootPath + '/controller/template_builder/botBuilder')

exports.demoFlow = function (req, res, callback) {

    let messages = req.body.result.fulfillment.messages;
    let data = fbtemplates = [];

    messages.forEach(message => {
        if (message.platform === 'facebook') {
            let arr = {
                'template_type': message.payload.type,
                'title': message.payload.data.title,
                'item': message.payload.data.item
            }
            data.push(arr);
        }
    });

    getTemplate(data, function (result) {
        fbtemplates = result;
    });

    res.status(200).json(
        JSON.parse(
            JSON.stringify(
                new fbTemplate
                    .BaseTemplate()
                    .getApi(fbtemplates)
            )
        )
    );

    return callback(res);

}

var getTemplate = function (data, callback) {
    let fbtemplates = [];

    if (data.length !== 0) {
        data.forEach(dataTemplate => {
            let arr;
            new maping_template.Maping(dataTemplate.template_type, dataTemplate, function (result) {
                arr = result.get();
            });
            fbtemplates.push(arr);
        });
    }

    return callback(fbtemplates);
}