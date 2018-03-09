const maping_template = require(global.rootPath + '/maping_template/maping_template')
const fbTemplate = require(global.rootPath + '/controller/template_builder/botBuilder')

exports.demoFlow = function (req, res, callback) {

    let messages = req.body.result.fulfillment.messages
    let data = []
    let fbtemplates = []

    for (i = 0; i < messages.length; i++) {
        if (messages[i].platform === 'facebook') {
            let arr = {
                    'template_type': messages[i].payload.type,
                    'title': messages[i].payload.data.title,
                    'item': messages[i].payload.data.item
                }
            data.push(arr);
        }
    }

    console.log(data);

    for (i = 0; i < data.length; i++) {
        console.log(i)
        let arr
        new maping_template.Maping(data[i].template_type, data[i].title, data[i].item, function (result) {
            arr = result;
        });
        fbtemplates.push(arr);
    }

    console.log(fbtemplates)
    res.status(200).json(
        JSON.parse(
            JSON.stringify(
                new fbTemplate
                    .BaseTemplate()
                    .getApi([fbtemplates[0].get()])
            )
        )
    );

    return callback(res);

}