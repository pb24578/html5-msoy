# HTML5 Msoy
Install the client dependencies by running ```yarn install``` in the client directory.

Install the server dependencies by running ```pip install -r requirements``` in the server directory.
  
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

# To Do
Create a class that extends AnimatedSprite such as in this example: https://github.com/pixijs/pixi.js/issues/6271.
- Make a class for Entity: Avatar extends Entity, Toy extends Entity, Furniture extends Entity, etc.

Compress sprite sheet images before uploading it to the server. Look at this Stackoverflow
https://stackoverflow.com/questions/33077804/losslessly-compressing-images-on-django example
to see how it's done in Django. This will significantly help improve load times whenever loading
the sprite sheets.

Minify an entity's javascript files using https://github.com/wilsonzlin/minify-html/tree/master/python.

Minify the texture.json file using this small script https://gist.github.com/KinoAR/a5cf8a207529ee643389c4462ebf13cd.

Execute entity code (such as Avatar, Toys, etc.) in a WebWorker. You can post messages and receive messages from the main thread to the web worker and vice versa, which
is very helpful if you want to execute code at certain frames of the Sprite.
- Ex: Execute a post message each frame on the AnimatedSprite's onFrameChange function.
  - If we cap the frames of an AnimatedSprite to 30 frames per second, then as long as the postMessage doesn't take more than ~33.3ms to send, then it will run each frame on time
  - Require the creator to create a settings object in the index.js file, which will specify which frames to register and listen for
  - https://surma.dev/things/is-postmessage-slow/ this article shows a graph of about how long postMessage takes based on the data being sent
- https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage

Use https://github.com/davidfig/pixi-viewport to set the PixiJS VCam.
- Make screen height and width equal to the width and height of the pixi app screen.
- Make world height equal to the height of the pixi app screen.
- Make world width equal to the width of the background the user uploads.
- Disable wheel.
- Set clamp to true, clamp both x and y so the user cannot view passed it.
