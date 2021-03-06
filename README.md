# peripheral-input-js
Some JavaScript mouse/touch and keyboard input helpers.


Supplies a polling interface. Sometimes, its simpler to ask if a key is down, rather than registering and unregistering event callbacks.

PeripheralInput also resolves differences between the concept of "is key down?" vs. "was key pressed?". Normally, event callbacks will have to add additional boilerplate code to handle this distinction, and will have to handle the fact that the `keydown` event may be called repeatedly while a key is held down.

PeripheralInput also provides some helpers for pointer dragging.

To use PeripheralInput, create a PeripheralInputHandler. Then, call update() on the handler in your animation loop, after inputs are checked. Example:

```
var inputHandler = new PeripheralInput.PeripheralInputHandler({
    pointerElement: window, // element for which to handle pointer events (default is window, set to false to disable pointer handling)
    keyboardElement: window // element for which to handle keyboard events (default is window, set to false to disable keyboard handling)
})

function myAnimationLoop() {
    if (inputHandler.isKeyDown(PeripheralInput.keyCodes.space)) {
        // do something as long as the space key is held down
    }

    if (inputHandler.wasKeyPressed(PeripheralInput.keyCodes.enter)) {
        // do something only when the enter key is pressed
    }

    if (inputHandler.wasKeyReleased(PeripheralInput.keyCodes.enter)) {
        // do something only when the enter key is released
    }

    if (inputHandler.isPointerDown()) {
        // do something while the pointer is down
    }

    if (inputHandler.wasPointerPressed()) {
        // do something if the pointer was pressed
    }

    if (inputHandler.wasPointerReleased()) {
        // do something if the pointer was released
    }

    // do something with the pointer coordinates
    var pointerX = inputHandler.getPointerX(),
        pointerY = inputHandler.getPointerY()

    // update the PeripheralInputHandler
    inputHandler.update()
}
```
