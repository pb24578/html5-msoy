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
1. Create a class that extends AnimatedSprite such as in this example: https://github.com/pixijs/pixi.js/issues/6271.
    - Name these classes EntityControl, AvatarControl, BackgroundControl, ToyControl, etc.

2. Execute entity code (such as Avatar, Toys, etc.) in a WebWorker. You can post messages and receive messages from the main thread to the web worker and vice versa, which
is very helpful if you want to execute code at certain frames of the Sprite.
    - Ex: Execute a post message each frame on the AnimatedSprite's onFrameChange function.
    - If we cap the frames of an AnimatedSprite to 30 frames per second, then as long as the postMessage doesn't take more than ~33.3ms to send, then it will run each frame on time
    - Require the creator to create a settings object in the index.js file, which will specify which frames to register and listen for
    - https://surma.dev/things/is-postmessage-slow/ this article shows a graph of about how long postMessage takes based on the data being sent
    - https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage

3. An issue with the WebWorker class is that you cannot execute code from a cross-origin. To bypass this, create another worker and then call importScript on that external script. An example is below:

```js
const cross_origin_script_url = "https://greggman.github.io/doodles/test/ping-worker.js";

const worker_url = getWorkerURL( cross_origin_script_url );
const worker = new Worker( worker_url );
worker.onmessage = (evt) => console.log( evt.data );
URL.revokeObjectURL( worker_url );

// Returns a blob:// URL which points to a javascript file which will call importScripts with the given URL
function getWorkerURL( url ) {
  const content = `importScripts( "${ url }" );`;
  return URL.createObjectURL( new Blob( [ content ], { type: "text/javascript" } ) );
}
```

4. Instead of making the user put all files into a single zip folder, program a user interface in the web app to allow them to add new states, actions, etc. This makes it so much easier to create an avatar and allow them to do it natively. This makes previewing it easy, and this also makes uploading much easier. Also, the user doesn't have to wait for the entire avatar to be uploaded before it can preview it since now it's done while the user is creating the avatar.

5. Create a Body to handle how the Avatar body should function. Look here https://wiki.whirled.club/wiki/Zoltea%27s_Tweaked_Whirled_SDK to download the Whirled SDK and use the Body.as as an example.
    - In the custom editor, allow them to also code the Body and perform a live-preview. This means we'll need to install an in-browser code editor (this one seems good https://www.npmjs.com/package/codemirror)

6. Compress sprite sheet images before uploading it to the server. Look at this Stackoverflow
https://stackoverflow.com/questions/33077804/losslessly-compressing-images-on-django example
to see how it's done in Django. This will significantly help improve load times whenever loading
the sprite sheets.

7. Minify an entity's javascript files using https://github.com/wilsonzlin/minify-html/tree/master/python.

8. Minify the texture.json file using this small script https://gist.github.com/KinoAR/a5cf8a207529ee643389c4462ebf13cd.

9. Use https://github.com/davidfig/pixi-viewport to set the PixiJS VCam.
    - Make screen height and width equal to the width and height of the pixi app screen.
    - Make world height equal to the height of the pixi app screen.
    - Make world width equal to the width of the background the user uploads.
    - Disable wheel.
    - Set clamp to true, clamp both x and y so the user cannot view passed it.
