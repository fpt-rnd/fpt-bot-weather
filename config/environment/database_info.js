// All configurations will extend these options
// ============================================
module.exports = {
    // Should we populate the DB with sample data?
    seedDB: true,

    // MongoDB connection options
    mongo: {
        options: {
            db: {
                safe: true
            }
        },
        uri: 'mongodb://heroku_kfg2thh1:7e6mljdduerr91p5amd79kr5bo@ds153958.mlab.com:53958/heroku_kfg2thh1'
    }
};