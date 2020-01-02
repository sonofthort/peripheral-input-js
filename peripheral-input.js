PeripheralInput = {}
PeripheralInput.detail = {}

PeripheralInput.keyCodes = {
	backspace: 8,
	tab: 9,
	enter: 13,
	shift: 16,
	ctrl: 17,
	alt: 18,
	pause_break: 19,
	caps_lock: 20,
	escape: 27,
	space: 32,
	page_up: 33,
	page_down: 34,
	end: 35,
	home: 36,
	left_arrow: 37,
	up_arrow: 38,
	right_arrow: 39,
	down_arrow: 40,
	insert: 45,
	'delete': 46,
	'0': 48,
	'1': 49,
	'2': 50,
	'3': 51,
	'4': 52,
	'5': 53,
	'6': 54,
	'7': 55,
	'8': 56,
	'9': 57,
	a: 65,
	b: 66,
	c: 67,
	d: 68,
	e: 69,
	f: 70,
	g: 71,
	h: 72,
	i: 73,
	j: 74,
	k: 75,
	l: 76,
	m: 77,
	n: 78,
	o: 79,
	p: 80,
	q: 81,
	r: 82,
	s: 83,
	t: 84,
	u: 85,
	v: 86,
	w: 87,
	x: 88,
	y: 89,
	z: 90,
	left_window_key: 91,
	right_window_key: 92,
	select_key: 93,
	numpad_0: 96,
	numpad_1: 97,
	numpad_2: 98,
	numpad_3: 99,
	numpad_4: 100,
	numpad_5: 101,
	numpad_6: 102,
	numpad_7: 103,
	numpad_8: 104,
	numpad_9: 105,
	multiply: 106,
	add: 107,
	subtract: 109,
	decimal_point: 110,
	divide: 111,
	f1: 112,
	f2: 113,
	f3: 114,
	f4: 115,
	f5: 116,
	f6: 117,
	f7: 118,
	f8: 119,
	f9: 120,
	f10: 121,
	f11: 122,
	f12: 123,
	num_lock: 144,
	scroll_lock: 145,
	semi_colon: 186,
	equal_sign: 61,
	comma: 188,
	dash: 173,
	period: 190,
	forward_slash: 191,
	grave_accent: 192,
	open_bracket: 219,
	back_slash: 220,
	close_bracket: 221,
	single_quote: 222
}

PeripheralInput.PeripheralInputHandler = function(args) {
	args = args || {}
	
	if (args.keyboardElement !== false) {
		this.keyboardElement = args.keyboardElement || args.element || window
	}
	
	if (args.pointerElement !== false) {
		this.pointerElement = args.pointerElement || args.element || window
	}
	
	this._keyDownMap = []
	this._keyPressedMap = []
	this._keyReleasedMap = []
	this._keyPressedQueue = []
	this._keyReleasedQueue = []
	this._pointerX = Infinity
	this._pointerY = Infinity
	this._dragX = 0
	this._dragY = 0
	this._pointerDown = false
	this._pointerPressed = false
	this._pointerReleased = false
	this._dragging = false
	this._dragStarted = false
	this._dragEnded = false
	this._lastPressedKey = null
	this._lastReleasedKey = null
	
	var handler = this
	
	if (this.pointerElement) {
		this.pointerElement.addEventListener('pointerdown', function(event) {
			handler._pointerX = event.offsetX
			handler._pointerY = event.offsetY
			if (!handler._pointerDown) {
				handler._dragX = handler._pointerX
				handler._dragY = handler._pointerY
				handler._pointerDown = true
				handler._pointerPressed = true
			}
		}, false)
		
		this.pointerElement.addEventListener('pointerup', function(event) {
			handler._pointerX = event.offsetX
			handler._pointerY = event.offsetY
			handler._pointerDown = false
			handler._pointerReleased = true
			if (handler._dragging) {
				handler._dragging = false
				handler._dragEnded = true
			}
		}, false)
		
		this.pointerElement.addEventListener('pointerout', function(event) {
			if (handler._pointerDown) {
				handler._pointerDown = false
				handler._pointerReleased = true
			}
			if (handler._dragging) {
				handler._dragging = false
				handler._dragEnded = true
			}
		}, false)
		
		this.pointerElement.addEventListener('pointermove', function(event) {
			handler._pointerX = event.offsetX
			handler._pointerY = event.offsetY
			if (handler._pointerDown && !handler._dragging) {
				handler._dragging = true
				handler._dragStarted = true
			}
		}, false)
	}
	
	if (this.keyboardElement) {
		this.keyboardElement.addEventListener('keydown', function(event) {
			var key = event.keyCode
			event.preventDefault()
			if (!handler._keyDownMap[key]) {
				handler._keyPressedMap[key] = true
				handler._keyDownMap[key] = true
				handler._lastPressedKey = key
				handler._keyPressedQueue.push(key)
			}
		}, false)

		this.keyboardElement.addEventListener('keyup', function(event) {
			var key = event.keyCode
			event.preventDefault()
			handler._keyDownMap[key] = false
			handler._keyReleasedMap[key] = true
			handler._lastReleasedKey = key
			handler._keyReleasedQueue.push(key)
		}, false)
	}
}

PeripheralInput.detail.accessor = function(publicKey, privateKey) {
	privateKey = privateKey || ('_' + publicKey)
	Object.defineProperty(PeripheralInput.PeripheralInputHandler.prototype, publicKey, {
		get: function() {
			return this[privateKey]
		},
		set: function() {
			throw 'PeripheralInputHandler: key "' + publicKey + '" cannot be set'
		}
	})
}

PeripheralInput.detail.accessor('pointerDown')
PeripheralInput.detail.accessor('pointerPressed')
PeripheralInput.detail.accessor('pointerReleased')
PeripheralInput.detail.accessor('pointerX')
PeripheralInput.detail.accessor('pointerY')
PeripheralInput.detail.accessor('dragStarted')
PeripheralInput.detail.accessor('dragEnded')
PeripheralInput.detail.accessor('dragging')
PeripheralInput.detail.accessor('dragX')
PeripheralInput.detail.accessor('dragY')
PeripheralInput.detail.accessor('lastPressedKey')
PeripheralInput.detail.accessor('lastReleasedKey')

PeripheralInput.PeripheralInputHandler.prototype.isKeyDown = function(key) {
	return this._keyDownMap[key]
}

PeripheralInput.PeripheralInputHandler.prototype.wasKeyPressed = function(key) {
	return this._keyPressedMap[key]
}

PeripheralInput.PeripheralInputHandler.prototype.wasKeyReleased = function(key) {
	return this._keyReleasedMap[key]
}

// should call after input is checked
PeripheralInput.PeripheralInputHandler.prototype.update = function() {
	var keyPressedQueue = this._keyPressedQueue,
		keyReleasedQueue = this._keyReleasedQueue,
		keyPressedMap = this._keyPressedMap,
		keyReleasedMap = this._keyReleasedMap
	
	while (keyPressedQueue.length > 0) {
		keyPressedMap[keyPressedQueue.pop()] = false
	}
	
	while (keyReleasedQueue.length > 0) {
		keyReleasedMap[keyReleasedQueue.pop()] = false
	}
	
	this._pointerPressed = false
	this._pointerReleased = false
	this._dragStarted = false
	this._dragEnded = false
	this._lastPressedKey = null
	this._lastReleasedKey = null
}
	