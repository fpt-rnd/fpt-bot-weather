# Deploy mLab MongoDB on Heroku

## Adding mLab as a Heroku add-on
`heroku addons:create mongolab`

After run command you will get info of mongodb
```
Created mongolab-adjacent-51797 as MONGODB_URI
Use heroku addons:docs mongolab to view documentation
```

## Configuration mongodb on server
1. Copy MONGODB_URI

`heroku config:get MONGODB_URI`

2. Paste into `config/environment/database_info.js`

```
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
        uri: 'MONGODB_URI'
    }
};

```
3. Commit new change
4. Deploy on Heroku

## CLI 
- Open mongodb 
`heroku addons:open mongolab`