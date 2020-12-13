# HTML5 Msoy
Install the client dependencies by running ```yarn install``` in the client directory.

Install the server dependencies by running ```pip install -r requirements``` in the server directory.

### Media and Static Files
In order to generate the staticfiles, cd into the server directory and run ```python manage.py collectstatic```.

In the ```server/server/settings.py```, change the STATIC_URL and MEDIA_URL to the CDN (content delivery network) that hosts the static and media files.
  
# Run HTML5 Msoy
HTML5 Msoy has two different environments: staging and production.

Before continuing, modify the connection settings in the constants.ts file to your server's settings.

### Staging (Development)
1. To run the client for staging (development), execute ```yarn start```
2. To run server for staging (development), execute ```python manage.py runserver```.

### Production
1. You must have pm2 and serve installed. ```npm install -g pm2``` and ```npm install -g serve```.  
2. In the client directory, execute ```yarn run build``` to build the React app.  
3. Use the Python virtual environment that installed your server's pip requirements.  
4. Execute cd into the scripts directory and execute ```bash production.sh``` to run the web app for production.  
5. Now view your web app running on port 80.
    - The ports can be configured in deploy-client.sh and deploy-server.sh
    - If you configure the ports in either script, make sure to edit the port in constants.ts

To see the production processes running, execute ```pm2 list```. To end any of those processes, execute ```pm2 delete <name>```.

# Uploading Avatars
1. Best way to make avatars is to create a sprite sheet with the entire avatar in there. Avatars are created using spritesheets and the art can be made from whatever tool you wanna use (like paintnet, photoshop, adobe flash, etc). You create a sprite sheet using a free (and open-source) texture packer tool online at http://free-tex-packer.com/ for web version https://free-tex-packer.com/app/.

Then the creator add a json tag called "animations" with array of images that specify the states, actions, and transitions. This is similar to how y0> is doing it.

2. The body.js will receive the texture.json file from post message. Then the body will start sending messages back to the avatar control to setup the avatar. This file will be modeled after the file from Whirled. Note that the index.js (logic script by the user) file will import the body.js.

3. Compress sprite sheet before uploading it to the server. Look at this Stackoverflow
https://stackoverflow.com/questions/33077804/losslessly-compressing-images-on-django example
to see how it's done in Django. This will significantly help improve load times whenever loading
the sprite sheets.

4. Minify the index.js file using https://github.com/wilsonzlin/minify-html/tree/master/python.

5. Minify the texture.json file using this small script https://gist.github.com/KinoAR/a5cf8a207529ee643389c4462ebf13cd.

### 1. Example addEventListener Between index.js and Avatar:
In index.js worker:  
```js
postMessage(type: 'addEventListener', payload: { type: 'onEnterFrame', name: 'enterFrame');
```

Now the AvatarBody.ts will receive the message, then register an onEnterFrame listener.

Then in the worker "message" event listener, it will listen for the event.

To remove event, execute in worker:  
```js
postMessage(type: 'removeEventListener', payload: { type: 'onEnterFrame', name: 'enterFrame');
```

### 2. Example setState Between index.js and Avatar:
In worker:  
```
postMessage(type: 'setState', payload: { name: 'Dance' });
```

Now the AvatarBody will receive this message, then send a socket message to the world to perform a setState('Dance'), the server will validate that the entity id
that called the setState is owned by the user (since the entity has a foreign key to the user), then it'll send a message to update the state for all users.
- This backend logic is performed in the world_consumer.py

In the update state listener (on the client), the client then updates the state of the Avatar for all users viewing it by performing the setState function in AvatarControl.

# PixiJS VCam To Do
6. Use https://github.com/davidfig/pixi-viewport to set the PixiJS VCam.
    - Make screen height and width equal to the width and height of the pixi app screen.
    - Make world height equal to the height of the pixi app screen.
    - Make world width equal to the width of the background the user uploads.
    - Disable wheel.
    - Set clamp to true, clamp both x and y so the user cannot view passed it.
