 ! function(t) {
    "function" == typeof define && define.amd ? define(["jquery"], t) : t(jQuery)
}(function(t) {
    return t.widget("ui.rotatable", t.ui.mouse, {
        widgetEventPrefix: "rotate",
        options: {
            angle: !1,
            degrees: !1,
            handle: !1,
            handleOffset: {
                top: 0,
                left: 0
            },
            radians: !1,
            rotate: null,
            rotationCenterOffset: {
                top: 0,
                left: 0
            },
            snap: !1,
            start: null,
            step: 22.5,
            stop: null,
            transforms: null,
            wheelRotate: !0
        },
        angle: function(t) {
            if (void 0 === t) return this.options.angle;
            this.options.angle = t, this.elementCurrentAngle = t, this._performRotation(this.options.angle)
        },
        getElementCenter: function() {
            return this.elementCenter = this._calculateElementCenter(), this.elementCenter
        },
        handle: function(t) {
            if (void 0 === t) return this.options.handle;
            this.options.handle = t
        },
        plugins: {},
        rotationCenterOffset: function(t) {
            if (void 0 === t) return this.options.rotationCenterOffset;
            null !== t.top && (this.options.rotationCenterOffset.top = t.top), null !== t.left && (this.options.rotationCenterOffset.left = t.left)
        },
        rotateElement: function(t) {
            if (!this.element || this.element.disabled || this.options.disabled) return !1;
            if (!t.which) return this.stopRotate(t), !1;
            var e = this._calculateRotateAngle(t),
                n = this.elementCurrentAngle;
            if (this.elementCurrentAngle = e, this._propagate("rotate", t), !1 === this._propagate("rotate", t)) return this.elementCurrentAngle = n, !1;
            var s = this.ui();
            return !1 === this._trigger("rotate", t, s) ? (this.elementCurrentAngle = n, !1) : (s.angle.current !== e && (e = s.angle.current, this.elementCurrentAngle = e), this._performRotation(e), n !== e && (this.hasRotated = !0), !1)
        },
        startRotate: function(e) {
            var n = this.getElementCenter(),
                s = e.pageX - n.x,
                i = e.pageY - n.y;
            return this.mouseStartAngle = Math.atan2(i, s), this.elementStartAngle = this.elementCurrentAngle, this.hasRotated = !1, this._propagate("start", e), t(document).bind("mousemove", this.listeners.rotateElement), t(document).bind("mouseup", this.listeners.stopRotate), !1
        },
        stopRotate: function(e) {
            if (this.element && !this.element.disabled) return t(document).unbind("mousemove", this.listeners.rotateElement), t(document).unbind("mouseup", this.listeners.stopRotate), this.elementStopAngle = this.elementCurrentAngle, this._propagate("stop", e), setTimeout(function() {
                this.element = !1
            }, 10), !1
        },
        wheelRotate: function(t) {
            var e = this._angleInRadians(Math.round(t.originalEvent.deltaY / 10));
            (this.options.snap || t.shiftKey) && (e = this._calculateSnap(e)), e = this.elementCurrentAngle + e, this.angle(e), this._trigger("rotate", t, this.ui())
        },
        ui: function() {
            return {
                api: this,
                element: this.element,
                angle: {
                    start: this.elementStartAngle,
                    current: this.elementCurrentAngle,
                    degrees: Math.abs(this._angleInDegrees(this.elementCurrentAngle)),
                    stop: this.elementStopAngle
                }
            }
        },
        _angleInRadians: function(t) {
            return t * Math.PI / 180
        },
        _angleInDegrees: function(t) {
            return 180 * t / Math.PI
        },
        _calculateElementCenter: function() {
            var t = this._getElementOffset();
            if (this._isRotationCenterSet()) return {
                x: t.left + this.rotationCenterOffset().left,
                y: t.top + this.rotationCenterOffset().top
            };
            if (void 0 !== this.element.css("transform-origin")) {
                var e = this.element.css("transform-origin").match(/([\d.]+)px +([\d.]+)px/);
                if (null != e) return {
                    x: t.left + parseFloat(e[1]),
                    y: t.top + parseFloat(e[2])
                }
            }
            return {
                x: t.left + this.element.width() / 2,
                y: t.top + this.element.height() / 2
            }
        },
        _calculateSnap: function(t) {
            var e = this._angleInDegrees(t);
            return e = Math.round(e / this.options.step) * this.options.step, this._angleInRadians(e)
        },
        _calculateRotateAngle: function(t) {
            var e = this.getElementCenter(),
                n = t.pageX - e.x,
                s = t.pageY - e.y,
                i = Math.atan2(s, n) - this.mouseStartAngle + this.elementStartAngle;
            return (this.options.snap || t.shiftKey) && (i = this._calculateSnap(i)), i
        },
        _create: function() {
            var e;
            this.options.handle ? e = this.options.handle : ((e = t(document.createElement("div"))).addClass("ui-rotatable-handle"), 0 === this.options.handleOffset.top && 0 === this.options.handleOffset.left || (e.css("position", "relative"), e.css("top", this.options.handleOffset.top + "px"), e.css("left", this.options.handleOffset.left + "px"))), this.listeners = {
                rotateElement: t.proxy(this.rotateElement, this),
                startRotate: t.proxy(this.startRotate, this),
                stopRotate: t.proxy(this.stopRotate, this),
                wheelRotate: t.proxy(this.wheelRotate, this)
            }, this.options.wheelRotate && this.element.bind("wheel", this.listeners.wheelRotate), e.draggable({
                helper: "clone",
                start: this._dragStart,
                handle: e
            }), e.bind("mousedown", this.listeners.startRotate), e.closest(this.element).length || e.appendTo(this.element), this.rotationCenterOffset(this.options.rotationCenterOffset), this.options.degrees ? this.elementCurrentAngle = this._angleInRadians(this.options.degrees) : this.elementCurrentAngle = this.options.radians || this.options.angle || 0, this._performRotation(this.elementCurrentAngle)
        },
        _destroy: function() {
            this.element.removeClass("ui-rotatable"), this.element.find(".ui-rotatable-handle").remove(), this.options.wheelRotate && this.element.unbind("wheel", this.listeners.wheelRotate)
        },
        _dragStart: function(t) {
            if (this.element) return !1
        },
        _getElementOffset: function() {
            this._performRotation(0);
            var t = this.element.offset();
            return this._performRotation(this.elementCurrentAngle), t
        },
        _getTransforms: function(t) {
            var e = "rotate(" + t + "rad)";
            return this.options.transforms && (e += " " + function(t) {
                var e = [];
                for (var n in t) t.hasOwnProperty(n) && t[n] && e.push(n + "(" + t[n] + ")");
                return e.join(" ")
            }(this.options.transforms)), e
        },
        _isRotationCenterSet: function() {
            return 0 !== this.options.rotationCenterOffset.top || 0 !== this.options.rotationCenterOffset.left
        },
        _performRotation: function(t) {
            this._isRotationCenterSet() && (this.element.css("transform-origin", this.options.rotationCenterOffset.left + "px " + this.options.rotationCenterOffset.top + "px"), this.element.css("-ms-transform-origin", this.options.rotationCenterOffset.left + "px " + this.options.rotationCenterOffset.top + "px"), this.element.css("-webkit-transform-origin", this.options.rotationCenterOffset.left + "px " + this.options.rotationCenterOffset + "px"));
            var e = this._getTransforms(t);
            this.element.css("transform", e), this.element.css("-moz-transform", e), this.element.css("-webkit-transform", e), this.element.css("-o-transform", e)
        },
        _propagate: function(e, n) {
            t.ui.plugin.call(this, e, [n, this.ui()]), "rotate" !== e && this._trigger(e, n, this.ui())
        }
    }), t.ui.rotatable
});