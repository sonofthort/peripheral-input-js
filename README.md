# peripheral-input-js
Some JavaScript mouse/touch and keyboard input helpers.


Supplies a polling interface as well as an event interface. Sometimes, its easier to just check is\f a key is down, instead of registering and unregistering event callbacks.


PeripheralInput needs to be updated in your animation loop (after you check inputs):

```
function myAnimationLoop() {
    if (PeripheralInput.isKeyDown(PeripheralInput.keyCodes.space)) {
        // do something
    }

    PeripheralInput.updatePeripheralInput()
}
```
