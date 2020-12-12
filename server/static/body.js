self.postMessage({
  type: 'addEventListener',
  payload: {
    type: 'appearanceChanged',
    name: 'bodyAppearanceChanged',
  },
});

self.onmessage = (event) => {
  const { data } = event;

  if (data.type === 'event') {
    const { type, name } = data.payload;
    if (type === 'appearanceChanged' && name === 'bodyAppearanceChanged') {
      self.postMessage({ type: 'isMoving' });
    }
  }

  if(data.type === 'isMoving') {
    const { value } = data.payload;
    if(value) {
      console.log('the body is moving!');
    } else {
      console.log('the body is not moving!');
    }
  }
};
