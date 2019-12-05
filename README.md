# peripheral-input-js
Some JavaScript mouse/touch and keyboard input helpers.


Supplies a polling interface as well as an event interface. Sometimes, its easier to just check if a key is down, instead of registering and unregistering event callbacks.

PeripheralInput also resolves differences between the concept of "is key down?" vs. "was key pressed?". Normally, event callbacks will have to add additional boilerplate code to handle this distinction, and will have to handle the fact that the `keydown` event may be called repeatedly while a key is held down.

PeripheralInput needs to be updated in your animation loop (after you check inputs):

```
function myAnimationLoop() {
    if (PeripheralInput.isKeyDown(PeripheralInput.keyCodes.space)) {
        // do something
    }

    PeripheralInput.updatePeripheralInput()
}
```
