let spritesheet = {};
let states = [];
let actions = [];
let currentState = "";

self.onmessage = (event) => {
  const { data } = event;

  if (data.type === "spritesheet") {
    const { value } = data.payload;
    spritesheet = value;

    // the default state will be set to the first animation in the sprite sheet
    animations = Object.keys(value.animations);
    [currentState] = animations;

    // store all of the states and actions
    animations.forEach((animation) => {
      if (animation.startsWith("state_")) {
        states.push(animation);
      } else if (animation.startsWith("action_")) {
        actions.push(animation);
      }
    });

    // register the states
    self.postMessage({
      type: "registerStates",
      payload: { value: states },
    });

    // register the actions
    self.postMessage({
      type: "registerActions",
      payload: { value: actions },
    });
  }

  if (data.type === "moving") {
    const { value } = data.payload;
    if (value) {
      // the body is now moving, so transition to a walking state
      self.postMessage({
        type: "setState",
        payload: { value: `${currentState}_walking` },
      });
    } else {
      // the body is no longer moving, so transition back to the current state
      self.postMessage({
        type: "setState",
        payload: { value: currentState },
      });
    }
  }
};
