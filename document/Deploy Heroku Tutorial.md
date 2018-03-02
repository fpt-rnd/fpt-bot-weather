	# Working with Heroku and Redis

## Heroku
1. Install Heroku
[Install Heroku](https://devcenter.heroku.com/articles/heroku-cli)
2. Login with account `heroku login`
3. Check version
	```
		node -v
		npm -v
		git --version
	```

4. Go folder which will be created ` cd folder__name `
5. Heroku create `heroku create`
6. Deploy your code `git push heroku master`

* Note: some method fix error

	- Heroku branch doesn't exist: `heroku git:remote -a app_name`
		
	- Add buildpacks `heroku buildpacks:set heroku/nodejs`

[Push different branch](https://stackoverflow.com/questions/2971550/how-to-push-different-local-git-branches-to-heroku-master)

### Some cmd
- Check status `heroku ps:scale web=1`
- Open app `heroku open`
- View Logs `heroku logs --tail`

## Redis

### Install Redis server on local
	```
		brew install redis
		redis-server

		// Port: 6379
		redis-cli
	```

[Document fo Redis](https://codeforgeek.com/2016/06/node-js-redis-tutorial-installation-commands/)

## Working with Heroku-Redis
1. Check status
`heroku addons | grep heroku-redis`

2. Install Redis for your app
`heroku addons:create heroku-redis:hobby-dev -a app_name`