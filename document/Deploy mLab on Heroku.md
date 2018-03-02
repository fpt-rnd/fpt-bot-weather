# Deploy mLab MongoDB on Heroku

## Adding mLab as a Heroku add-on
`heroku addons:create mongolab`

After run command you will get info of mongodb
```
Created mongolab-adjacent-51797 as MONGODB_URI
Use heroku addons:docs mongolab to view documentation
```

- Get MONGODB_URI

`heroku config:get MONGODB_URI`

- Open mongodb 
`heroku addons:open mongolab`