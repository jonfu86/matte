/**

    @requires montage/core/core
    @requires montage/ui/component
*/
var Component = require("montage/ui/component").Component;
/**
 @class module:"matte/ui/toggle-switch.reel".ToggleSwitch
 @extends module:montage/ui/component.Component
 */
exports.ToggleSwitch = Component.specialize(/** @lends module:"matte/ui/toggle-switch.reel".ToggleSwitch# */ {


    _value: {
        enumerable: false,
        value: false
    },
/**
        Description TODO
        @type {Function}
        @default {Boolean} false
    */
    value: {
        enumerable: true,
        get: function() {
            return this._value;
        },
        set: function(value) {
            if (!this._pressed) {
                value = !!value;
                if (this._value !== value) {
                    this._value = value;
                    window.clearInterval(this._animation);
                    this._animation = null;
                    this._speed = 0;
                    this.needsDraw = true;
                }
            }
        }
    },
/**
  Description TODO
  @private
*/
    _toggle: {
        enumerable: false,
        value: null
    },
/**
  Description TODO
  @private
*/
    _scroll: {
        enumerable: false,
        value: null
    },
/**
  Description TODO
  @private
*/
    _circle: {
        enumerable: false,
        value: null
    },
/**
  Description TODO
  @private
*/
    _handlerBg: {
        enumerable: false,
        value: null
    },
/**
  Description TODO
  @private
*/
    _handler: {
        enumerable: false,
        value: null
    },
/**
  Description TODO
  @private
*/
    _handlerOnBg: {
        enumerable: false,
        value: null
    },
/**
  Description TODO
  @private
*/
    _handlerOn: {
        enumerable: false,
        value: null
    },
/**
  Description TODO
  @private
*/
    _handlerDragArea: {
        enumerable: false,
        value: null
    },
/**
  Description TODO
  @private
*/
    _pressed: {
        enumerable: false,
        value: false
    },
/**
  Description TODO
  @private
*/
    _cursorPosition: {
        enumerable: false,
        value: null
    },
/**
  Description TODO
  @private
*/
    _width: {
        enumerable: false,
        value: 60 - 22
    },
/**
  Description TODO
  @private
*/
    _scrollTo: {
        enumerable: false,
        value: null
    },
/**
  Description TODO
  @private
*/
    _touchIdentifier: {
        enumerable: false,
        value: null
    },
/**
  Description TODO
  @private
*/
    _speed: {
        enumerable: false,
        value: 0
    },
/**
    Description TODO
    @function
    @param {Event} event TODO
    */
    handleTouchstart: {
        enumerable: false,
        value: function (event) {
            if (event.target === this._toggle) {
                this.value = !this.value;
            } else {
                this._touchIdentifier = event.targetTouches[0].identifier;
                document.addEventListener("touchmove", this, false);
                document.addEventListener("touchend", this, false);
                this._cursorPosition = event.targetTouches[0].clientX;

                if (this._scrollTo < 0) {
                    this._scrollTo = 0;
                } else if (this._scrollTo > this._width) {
                    this._scrollTo = this._width;
                }
                window.clearInterval(this._animation);
                this._animation = null;
                this._pressed = true;
                this.needsDraw = true;
            }
            event.preventDefault();
            event.stopPropagation();
        }
    },
/**
    Description TODO
    @function
    @param {Event} event TODO
    */
    handleMousedown: {
        enumerable: false,
        value: function (event) {
            if (event.target === this._toggle) {
                this.value = !this.value;
            } else {
                document.addEventListener("mousemove", this, false);
                document.addEventListener("mouseup", this, false);
                this._cursorPosition = event.clientX;

                if (this._scrollTo < 0) {
                    this._scrollTo = 0;
                } else if (this._scrollTo > this._width) {
                    this._scrollTo = this._width;
                }
                window.clearInterval(this._animation);
                this._animation = null;
                this._pressed = true;
                this.needsDraw = true;
            }
            event.preventDefault();
            event.stopPropagation();
        }
    },
/**
    Description TODO
    @function
    @param {Event} event TODO
    */
    handleTouchmove: {
        enumerable: false,
        value: function (event) {
            if (this._pressed) {
                var i = 0, changedTouches = event.changedTouches, length = changedTouches.length;

                while ((i < length) && (changedTouches[i].identifier !== this._touchIdentifier)) {
                    i++;
                }
                if (i < length) {
                    this._scrollTo = this._scrollTo + (event.changedTouches[i].clientX - this._cursorPosition);
                    this._cursorPosition = event.changedTouches[i].clientX;
                    event.preventDefault();
                    this.needsDraw = true;
                }
            }
        }
    },
/**
    Description TODO
    @function
    @param {Event} event TODO
    */
    handleMousemove: {
        enumerable: false,
        value: function (event) {
            if (this._pressed) {
                this._scrollTo = this._scrollTo + (event.clientX - this._cursorPosition);
                this._cursorPosition = event.clientX;
                event.preventDefault();
                event.stopPropagation();
                this.needsDraw = true;
            }
        }
    },
/**
    Description TODO
    @function
    @param {Event} event TODO
    */
    handleTouchend: {
        enumerable: false,
        value: function (event) {
            var i = 0, length = event.changedTouches.length;

            while ((i < length) && (event.changedTouches[i].identifier !== this._touchIdentifier)) {
                i++;
            }
            if (i < length) {
                this._pressed = false;
                if (this._scrollTo > ((this._width) / 2)) {
                    this.value = true;
                } else {
                    this.value = false;
                }
                this._speed = event.changedTouches[i].velocity.x;
                document.removeEventListener("touchmove", this, false);
                document.removeEventListener("touchend", this, false);
                this.needsDraw = true;
            }
        }
    },
/**
    Description TODO
    @function
    @param {Event} event TODO
    */
    handleMouseup: {
        enumerable: false,
        value: function (event) {
            this._pressed = false;
            if (this._scrollTo > ((this._width) / 2)) {
                this.value = true;
            } else {
                this.value = false;
            }
            this._speed = event.velocity.x;
            document.removeEventListener("mousemove", this, false);
            document.removeEventListener("mouseup", this, false);
            this.needsDraw = true;
        }
    },
/**
    Description TODO
    @function
    */
    prepareForActivationEvents: {
        enumerable: false,
        value: function() {
            if (window.Touch) {
                this._handlerDragArea.addEventListener("touchstart", this, false);
                this._toggle.addEventListener("touchstart", this, false);
                this._handlerDragArea.addEventListener("mousedown", this, false);
                this._toggle.addEventListener("mousedown", this, false);
            }
            this.eventManager.isStoringPointerEvents = true;
        }
    },
/**
    Description TODO
    @function
    */
    enterDocument: {
        value: function(firstTime) {
            if (firstTime) {
                this._element.classList.add("matte-ToggleSwitch");
                this._toggle = document.createElement('div');
                this._scroll = document.createElement('div');
                this._circle = document.createElement('div');
                this._handlerBg = document.createElement('div');
                this._handler = document.createElement('div');
                this._handlerOnBg = document.createElement('div');
                this._handlerOn = document.createElement('div');
                this._handlerDragArea = document.createElement('div');
                this._toggle.className = "toggle";
                this._scroll.className = "scroll";
                this._circle.className = "circle";
                this._handlerBg.className = "handlerbg";
                this._handler.className = "handler";
                this._handlerOnBg.className = "handleronbg";
                this._handlerOn.className = "handleron";
                this._handlerDragArea.className = "handlerdragarea";
                this._element.appendChild(this._toggle);
                this._toggle.appendChild(this._scroll);
                this._scroll.appendChild(this._handlerBg);
                this._handlerBg.appendChild(this._circle);
                this._handlerBg.appendChild(this._handler);
                this._handlerBg.appendChild(this._handlerOnBg);
                this._handlerBg.appendChild(this._handlerDragArea);
                this._handlerOnBg.appendChild(this._handlerOn);
                this._toggle.style.width = (this._width + 20) + "px";

                this._scrollTo = this._value ? this._width : 0;
            }
        }
    },
/**
  Description TODO
  @private
*/
    _animation: {
        enumerable: false,
        value: null
    },
/**
    Description TODO
    @function
    */
    draw: {
        enumerable: false,
        value: function () {
            var x = this._scrollTo;

            if (this._pressed) {
                this.element.classList.add("pressed");
                this._circle.style.webkitTransition = "-webkit-transform 150ms";
            } else {
                this.element.classList.remove("pressed");
                if (this._animation === null) {
                    if ((this._value && (this._scrollTo < this._width)) || (!this._value && (this._scrollTo > 0))) {
                        var startTime = new Date().getTime(),
                            startPos = this._scrollTo,
                            self = this;

                        this._animation = window.setInterval(function () {
                            var time = new Date().getTime() - startTime;

                            if ((self._value && (self._scrollTo < self._width)) || (!self._value && (self._scrollTo > 0))) {
                                if (self._value) {
                                    if (self._speed > 0) {
                                        self._scrollTo = startPos + self._speed * time / 1000 + time * time / 750;
                                    } else {
                                        self._scrollTo = startPos + time * time / 750;
                                    }
                                } else {
                                    if (self._speed < 0) {
                                        self._scrollTo = startPos + self._speed * time / 1000 - time * time / 750;
                                    } else {
                                        self._scrollTo = startPos - time * time / 750;
                                    }
                                }
                                self.needsDraw = true;
                            } else {
                                this._scrollTo = this._value ? this._width : 0;
                                window.clearInterval(self._animation);
                                self._animation = null;
                                self.needsDraw = true;
                            }
                        }, 16);
                    }
                }
            }
            if (x < 0) {
                x = 0;
            } else if (x > this._width) {
                x = this._width;
            }
            this._scroll.style.webkitTransform = "translate3d(" + x + "px,0,0)";
            this._handlerOnBg.style.opacity = x / (this._width);
        }
    }
});
