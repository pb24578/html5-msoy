let currentState = 'state_default';

self.onmessage = (event) => {
  const { data } = event;

  if (data.type === 'isMoving') {
    const { value } = data.payload;
    if (value) {
      // the body is now moving, so transition to a walking state
      self.postMessage({
        type: 'setState',
        payload: { value: `${currentState}_walking` },
      });
    } else {
      // the body is no longer moving, so transition back to the current state
      self.postMessage({
        type: 'setState',
        payload: { value: currentState },
      });
    }
  }
};
