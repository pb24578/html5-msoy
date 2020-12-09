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

# HTML5 Whirled SDK Outline
You setup the states and actions and code in the website itself. There will be a customizable avatar creator in the website which you can specify which sprite sheets will be used for the state or action.

Avatars are created using spritesheets and the art can be made from whatever tool you wanna use (like paintnet, photoshop, adobe flash, etc). You create a sprite sheet using a free (and open-source) texture packer tool online at http://free-tex-packer.com/ for web version https://free-tex-packer.com/app/. You can upload those sprites into the avatar creator on the website to build your states and actions. This means avatar creation is now free and you do not need Adobe flash to make avatars (you can use any art tool you like).

I'll also have a code editor in the avatar creator that allows you to add your own code to the avatar and all that good stuff. You can also edit the Avatar Body code just like you could in the original Whirled (to make stuff like ImpatientBody, LSABody, etc.)

Makes it easier for the creator to do stuff and not have to worry about setting up a bunch of code and classpaths and all that hell. Also, this allows for you to edit your avatar's states/actions/code in real time.

You can tint a white sprite http://scottmcdonnell.github.io/pixi-examples/index.html?s=demos&f=tinting.js&title=Tinting this should be helpful for making configurable avatars. Only limitation is how can we program config sprite sheets? 

# To Do
1. Execute entity code (such as Avatar, Toys, etc.) in a WebWorker. You can post messages and receive messages from the main thread to the web worker and vice versa, which is very helpful if you want to execute code at certain frames of the Sprite.

2. Best way to make avatars is to create a sprite sheet with the entire avatar in there. Then add json tag called "animations" with array of images that specify the states, actions, and transitions. This is similar to how yo> is doing it.

This means the program will only have to load a single sprite sheet and only have to load a single json. This is much faster to do and it'll be much easier for the creator to make avatars too.

Also, only allow for one index.js file which will contain all of the logic for the Avatar. The script file can import other files (from a cdn) if it wants to extend functionality from other codes. This file will override functions or perform postMessage, which the AvatarControl will pick up.

3. Compress sprite sheet before uploading it to the server. Look at this Stackoverflow
https://stackoverflow.com/questions/33077804/losslessly-compressing-images-on-django example
to see how it's done in Django. This will significantly help improve load times whenever loading
the sprite sheets.

4. Minify an entity's javascript files using https://github.com/wilsonzlin/minify-html/tree/master/python.

5. Minify the texture.json file using this small script https://gist.github.com/KinoAR/a5cf8a207529ee643389c4462ebf13cd.

6. Use https://github.com/davidfig/pixi-viewport to set the PixiJS VCam.
    - Make screen height and width equal to the width and height of the pixi app screen.
    - Make world height equal to the height of the pixi app screen.
    - Make world width equal to the width of the background the user uploads.
    - Disable wheel.
    - Set clamp to true, clamp both x and y so the user cannot view passed it.
