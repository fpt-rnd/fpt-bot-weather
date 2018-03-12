const maping_template = require(global.rootPath + '/maping_template/maping_template')
const fbTemplate = require(global.rootPath + '/controller/template_builder/botBuilder')

exports.demoFlow = function (req, res, callback) {

    let messages = req.body.result.fulfillment.messages;

    let dataReplace = ["Thu", "Văn"];

    let replaceItems = req.body.result.fulfillment.messages[0].payload.replace;

    let data = JSON.stringify(req.body.result.fulfillment);
    if (replaceItems && replaceItems.length > 0) {
        for (i = 0; i < replaceItems.length; i++) {
            data = data.replace(new RegExp(replaceItems[i], "g"), dataReplace[i]);
        }
    }


    let fbtemplates = [];

    getTemplate(JSON.parse(data), function (result) {
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

var getTemplate = function (dataJson, callback) {
    let fbtemplates = data = [];

    dataJson.messages.forEach(message => {
        if (message.platform === 'facebook' && message.payload.type) {
            let arr = {
                'template_type': message.payload.type,
                'title': message.payload.data.title,
                'item': message.payload.data.item
            }
            data.push(arr);
        }
    });

    if (data.length > 0) {
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