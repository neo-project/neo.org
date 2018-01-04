var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
Array.copy = function (src, srcOffset, dst, dstOffset, count) {
    for (var i = 0; i < count; i++)
        dst[i + dstOffset] = src[i + srcOffset];
};
Array.from = Array.from || function (arr) {
    var array = new Array(arr.length);
    for (var i = 0; i < array.length; i++)
        array[i] = arr[i];
    return array;
};
Array.repeat = function (value, count) {
    var array = new Array(count);
    array.fill(value);
    return array;
};
Uint8Array.fromArrayBuffer = function (buffer) {
    if (buffer instanceof Uint8Array)
        return buffer;
    else if (buffer instanceof ArrayBuffer)
        return new Uint8Array(buffer);
    else {
        var view = buffer;
        return new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
    }
};
String.prototype.hexToBytes = function () {
    if ((this.length & 1) != 0)
        throw new RangeError();
    var bytes = new Uint8Array(this.length / 2);
    for (var i = 0; i < bytes.length; i++)
        bytes[i] = parseInt(this.substr(i * 2, 2), 16);
    return bytes;
};
ArrayBuffer.prototype.slice = ArrayBuffer.prototype.slice || function (begin, end) {
    if (end === void 0) { end = this.byteLength; }
    if (begin < 0)
        begin += this.byteLength;
    if (begin < 0)
        begin = 0;
    if (end < 0)
        end += this.byteLength;
    if (end > this.byteLength)
        end = this.byteLength;
    var length = end - begin;
    if (length < 0)
        length = 0;
    var src = new Uint8Array(this);
    var dst = new Uint8Array(length);
    for (var i = 0; i < length; i++)
        dst[i] = src[i + begin];
    return dst.buffer;
};
Uint8Array.prototype.toHexString = function () {
    var s = "";
    for (var i = 0; i < this.length; i++) {
        s += (this[i] >>> 4).toString(16);
        s += (this[i] & 0xf).toString(16);
    }
    return s;
};
void function () {
    function fillArray(value, start, end) {
        if (start === void 0) { start = 0; }
        if (end === void 0) { end = this.length; }
        if (start < 0)
            start += this.length;
        if (start < 0)
            start = 0;
        if (start >= this.length)
            return this;
        if (end < 0)
            end += this.length;
        if (end < 0)
            return this;
        if (end > this.length)
            end = this.length;
        for (var i = start; i < end; i++)
            this[i] = value;
        return this;
    }
    Array.prototype.fill = Array.prototype.fill || fillArray;
    Int8Array.prototype.fill = Int8Array.prototype.fill || fillArray;
    Int16Array.prototype.fill = Int16Array.prototype.fill || fillArray;
    Int32Array.prototype.fill = Int32Array.prototype.fill || fillArray;
    Uint8Array.prototype.fill = Uint8Array.prototype.fill || fillArray;
    Uint16Array.prototype.fill = Uint16Array.prototype.fill || fillArray;
    Uint32Array.prototype.fill = Uint32Array.prototype.fill || fillArray;
}();
if (window.Map == null)
    window.Map = (function () {
        function class_1() {
            this._map = new Object();
            this._size = 0;
        }
        Object.defineProperty(class_1.prototype, "size", {
            get: function () { return this._size; },
            enumerable: true,
            configurable: true
        });
        class_1.prototype.clear = function () {
            for (var key in this._map)
                delete this._map[key];
            this._size = 0;
        };
        class_1.prototype.delete = function (key) {
            if (!this._map.hasOwnProperty(key))
                return false;
            this._size--;
            return delete this._map[key];
        };
        class_1.prototype.forEach = function (callback) {
            for (var key in this._map)
                callback(this._map[key], key, this);
        };
        class_1.prototype.get = function (key) {
            return this._map[key];
        };
        class_1.prototype.has = function (key) {
            return this._map.hasOwnProperty(key);
        };
        class_1.prototype.set = function (key, value) {
            if (!this._map.hasOwnProperty(key))
                this._size++;
            this._map[key] = value;
        };
        return class_1;
    }());
if (window.Promise == null)
    window.Promise = (function () {
        var PromiseState;
        (function (PromiseState) {
            PromiseState[PromiseState["pending"] = 0] = "pending";
            PromiseState[PromiseState["fulfilled"] = 1] = "fulfilled";
            PromiseState[PromiseState["rejected"] = 2] = "rejected";
        })(PromiseState || (PromiseState = {}));
        return (function () {
            function Promise(executor) {
                this._state = PromiseState.pending;
                this._callback_attached = false;
                if (executor != null)
                    executor(this.resolve.bind(this), this.reject.bind(this));
            }
            Promise.all = function (iterable) {
                return new Promise(function (resolve, reject) {
                    if (iterable.length == 0) {
                        resolve([]);
                        return;
                    }
                    var results = new Array(iterable.length);
                    var rejected = false;
                    var onFulfilled = function (result) {
                        results[this._tag] = result;
                        for (var i = 0; i < iterable.length; i++)
                            if (iterable[i]._state != PromiseState.fulfilled)
                                return;
                        resolve(results);
                    };
                    var onRejected = function (reason) {
                        if (!rejected) {
                            rejected = true;
                            reject(reason);
                        }
                    };
                    for (var i = 0; i < iterable.length; i++) {
                        iterable[i]._tag = i;
                        iterable[i].then(onFulfilled, onRejected);
                    }
                });
            };
            Promise.prototype.catch = function (onRejected) {
                return this.then(null, onRejected);
            };
            Promise.prototype.checkState = function () {
                if (this._state != PromiseState.pending && this._callback_attached) {
                    var callback = this._state == PromiseState.fulfilled ? this._onFulfilled : this._onRejected;
                    var arg = this._state == PromiseState.fulfilled ? this._value : this._reason;
                    var value = void 0, reason = void 0;
                    try {
                        value = callback == null ? this : callback.call(this, arg);
                    }
                    catch (ex) {
                        reason = ex;
                    }
                    if (this._next_promise == null) {
                        if (reason != null)
                            return Promise.reject(reason);
                        else if (value instanceof Promise)
                            return value;
                        else
                            return Promise.resolve(value);
                    }
                    else {
                        if (reason != null)
                            this._next_promise.reject(reason);
                        else if (value instanceof Promise)
                            value.then(this.resolve.bind(this._next_promise), this.reject.bind(this._next_promise));
                        else
                            this._next_promise.resolve(value);
                    }
                }
            };
            Promise.prototype.reject = function (reason) {
                this._state = PromiseState.rejected;
                this._reason = reason;
                this.checkState();
            };
            Promise.reject = function (reason) {
                return new Promise(function (resolve, reject) { return reject(reason); });
            };
            Promise.prototype.resolve = function (value) {
                this._state = PromiseState.fulfilled;
                this._value = value;
                this.checkState();
            };
            Promise.resolve = function (value) {
                if (value instanceof Promise)
                    return value;
                return new Promise(function (resolve, reject) { return resolve(value); });
            };
            Promise.prototype.then = function (onFulfilled, onRejected) {
                this._onFulfilled = onFulfilled;
                this._onRejected = onRejected;
                this._callback_attached = true;
                if (this._state == PromiseState.pending) {
                    this._next_promise = new Promise(null);
                    return this._next_promise;
                }
                else {
                    return this.checkState();
                }
            };
            return Promise;
        }());
    })();
var __event = (function () {
    function __event(sender) {
        this.sender = sender;
        this.handlers = new Array();
    }
    __event.prototype.addEventListener = function (handler) {
        this.handlers.push(handler);
    };
    __event.prototype.dispatchEvent = function (args) {
        for (var i = 0; i < this.handlers.length; i++)
            this.handlers[i](this.sender, args);
    };
    __event.prototype.removeEventListener = function (handler) {
        for (var i = 0; i < this.handlers.length; i++)
            if (this.handlers[i] === handler) {
                this.handlers.splice(i, 1);
                return;
            }
    };
    return __event;
}());
var __extends = function (d, b) {
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TESTNET = true;
var AntShares;
(function (AntShares) {
    var DB = 26;
    var DM = (1 << DB) - 1;
    var DV = DM + 1;
    var _minusone, _one, _zero;
    var BigInteger = (function () {
        function BigInteger(value) {
            this._sign = 0;
            this._bits = new Array();
            if (typeof value === "number") {
                if (!isFinite(value) || isNaN(value))
                    throw new RangeError();
                var parts = BigInteger.getDoubleParts(value);
                if (parts.man.equals(AntShares.Uint64.Zero) || parts.exp <= -64)
                    return;
                if (parts.exp <= 0) {
                    this.fromUint64(parts.man.rightShift(-parts.exp), parts.sign);
                }
                else if (parts.exp <= 11) {
                    this.fromUint64(parts.man.leftShift(parts.exp), parts.sign);
                }
                else {
                    parts.man = parts.man.leftShift(11);
                    parts.exp -= 11;
                    var units = Math.ceil((parts.exp + 64) / DB);
                    var cu = Math.ceil(parts.exp / DB);
                    var cbit = cu * DB - parts.exp;
                    for (var i = cu; i < units; i++)
                        this._bits[i] = parts.man.rightShift(cbit + (i - cu) * DB).toUint32() & DM;
                    if (cbit > 0)
                        this._bits[cu - 1] = (parts.man.toUint32() << (DB - cbit)) & DM;
                    this._sign = parts.sign;
                    this.clamp();
                }
            }
            else if (typeof value === "string") {
                this.fromString(value);
            }
            else if (value instanceof ArrayBuffer) {
                this.fromUint8Array(new Uint8Array(value));
            }
            else if (value instanceof Uint8Array) {
                this.fromUint8Array(value);
            }
        }
        Object.defineProperty(BigInteger, "MinusOne", {
            get: function () { return _minusone || (_minusone = new BigInteger(-1)); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BigInteger, "One", {
            get: function () { return _one || (_one = new BigInteger(1)); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BigInteger, "Zero", {
            get: function () { return _zero || (_zero = new BigInteger(0)); },
            enumerable: true,
            configurable: true
        });
        BigInteger.add = function (x, y) {
            var bi_x = typeof x === "number" ? new BigInteger(x) : x;
            var bi_y = typeof y === "number" ? new BigInteger(y) : y;
            if (bi_x._sign == 0)
                return bi_y;
            if (bi_y._sign == 0)
                return bi_x;
            if ((bi_x._sign > 0) != (bi_y._sign > 0))
                return BigInteger.subtract(bi_x, bi_y.negate());
            var bits_r = new Array();
            BigInteger.addTo(bi_x._bits, bi_y._bits, bits_r);
            return BigInteger.create(bi_x._sign, bits_r);
        };
        BigInteger.prototype.add = function (other) {
            return BigInteger.add(this, other);
        };
        BigInteger.addTo = function (x, y, r) {
            if (x.length < y.length) {
                var t = x;
                x = y;
                y = t;
            }
            var c = 0, i = 0;
            while (i < y.length) {
                c += x[i] + y[i];
                r[i++] = c & DM;
                c >>>= DB;
            }
            while (i < x.length) {
                c += x[i];
                r[i++] = c & DM;
                c >>>= DB;
            }
            if (c > 0)
                r[i] = c;
        };
        BigInteger.prototype.bitLength = function () {
            var l = this._bits.length;
            if (l == 0)
                return 0;
            return --l * DB + BigInteger.bitLengthInternal(this._bits[l]);
        };
        BigInteger.bitLengthInternal = function (w) {
            return (w < 1 << 15 ? (w < 1 << 7
                ? (w < 1 << 3 ? (w < 1 << 1
                    ? (w < 1 << 0 ? (w < 0 ? 32 : 0) : 1)
                    : (w < 1 << 2 ? 2 : 3)) : (w < 1 << 5
                    ? (w < 1 << 4 ? 4 : 5)
                    : (w < 1 << 6 ? 6 : 7)))
                : (w < 1 << 11
                    ? (w < 1 << 9 ? (w < 1 << 8 ? 8 : 9) : (w < 1 << 10 ? 10 : 11))
                    : (w < 1 << 13 ? (w < 1 << 12 ? 12 : 13) : (w < 1 << 14 ? 14 : 15)))) : (w < 1 << 23 ? (w < 1 << 19
                ? (w < 1 << 17 ? (w < 1 << 16 ? 16 : 17) : (w < 1 << 18 ? 18 : 19))
                : (w < 1 << 21 ? (w < 1 << 20 ? 20 : 21) : (w < 1 << 22 ? 22 : 23))) : (w < 1 << 27
                ? (w < 1 << 25 ? (w < 1 << 24 ? 24 : 25) : (w < 1 << 26 ? 26 : 27))
                : (w < 1 << 29 ? (w < 1 << 28 ? 28 : 29) : (w < 1 << 30 ? 30 : 31)))));
        };
        BigInteger.prototype.clamp = function () {
            var l = this._bits.length;
            while (l > 0 && (this._bits[--l] | 0) == 0)
                this._bits.pop();
            while (l > 0)
                this._bits[--l] |= 0;
            if (this._bits.length == 0)
                this._sign = 0;
        };
        BigInteger.compare = function (x, y) {
            var bi_x = typeof x === "number" ? new BigInteger(x) : x;
            var bi_y = typeof y === "number" ? new BigInteger(y) : y;
            if (bi_x._sign >= 0 && bi_y._sign < 0)
                return +1;
            if (bi_x._sign < 0 && bi_y._sign >= 0)
                return -1;
            var c = BigInteger.compareAbs(bi_x, bi_y);
            return bi_x._sign < 0 ? -c : c;
        };
        BigInteger.compareAbs = function (x, y) {
            if (x._bits.length > y._bits.length)
                return +1;
            if (x._bits.length < y._bits.length)
                return -1;
            for (var i = x._bits.length - 1; i >= 0; i--)
                if (x._bits[i] > y._bits[i])
                    return +1;
                else if (x._bits[i] < y._bits[i])
                    return -1;
            return 0;
        };
        BigInteger.prototype.compareTo = function (other) {
            return BigInteger.compare(this, other);
        };
        BigInteger.create = function (sign, bits, clamp) {
            if (clamp === void 0) { clamp = false; }
            var bi = Object.create(BigInteger.prototype);
            bi._sign = sign;
            bi._bits = bits;
            if (clamp)
                bi.clamp();
            return bi;
        };
        BigInteger.divide = function (x, y) {
            var bi_x = typeof x === "number" ? new BigInteger(x) : x;
            var bi_y = typeof y === "number" ? new BigInteger(y) : y;
            return BigInteger.divRem(bi_x, bi_y).result;
        };
        BigInteger.prototype.divide = function (other) {
            return BigInteger.divide(this, other);
        };
        BigInteger.divRem = function (x, y) {
            var bi_x = typeof x === "number" ? new BigInteger(x) : x;
            var bi_y = typeof y === "number" ? new BigInteger(y) : y;
            if (bi_y._sign == 0)
                throw new RangeError();
            if (bi_x._sign == 0)
                return { result: BigInteger.Zero, remainder: BigInteger.Zero };
            if (bi_y._sign == 1 && bi_y._bits == null)
                return { result: bi_x, remainder: BigInteger.Zero };
            if (bi_y._sign == -1 && bi_y._bits == null)
                return { result: bi_x.negate(), remainder: BigInteger.Zero };
            var sign_result = (bi_x._sign > 0) == (bi_y._sign > 0) ? +1 : -1;
            var c = BigInteger.compareAbs(bi_x, bi_y);
            if (c == 0)
                return { result: sign_result > 0 ? BigInteger.One : BigInteger.MinusOne, remainder: BigInteger.Zero };
            if (c < 0)
                return { result: BigInteger.Zero, remainder: bi_x };
            var bits_result = new Array();
            var bits_rem = new Array();
            Array.copy(bi_x._bits, 0, bits_rem, 0, bi_x._bits.length);
            var df = bi_y._bits[bi_y._bits.length - 1];
            for (var i = bi_x._bits.length - 1; i >= bi_y._bits.length - 1; i--) {
                var offset = i - bi_y._bits.length + 1;
                var d = bits_rem[i] + (bits_rem[i + 1] || 0) * DV;
                var max = Math.floor(d / df);
                if (max > DM)
                    max = DM;
                var min = 0;
                while (min != max) {
                    var bits_sub_1 = new Array(offset + bi_y._bits.length);
                    for (var i_1 = 0; i_1 < offset; i_1++)
                        bits_sub_1[i_1] = 0;
                    bits_result[offset] = Math.ceil((min + max) / 2);
                    BigInteger.multiplyTo(bi_y._bits, [bits_result[offset]], bits_sub_1, offset);
                    if (BigInteger.subtractTo(bits_rem, bits_sub_1))
                        max = bits_result[offset] - 1;
                    else
                        min = bits_result[offset];
                }
                var bits_sub = new Array(offset + bi_y._bits.length);
                for (var i_2 = 0; i_2 < offset; i_2++)
                    bits_sub[i_2] = 0;
                bits_result[offset] = min;
                BigInteger.multiplyTo(bi_y._bits, [bits_result[offset]], bits_sub, offset);
                BigInteger.subtractTo(bits_rem, bits_sub, bits_rem);
            }
            return { result: BigInteger.create(sign_result, bits_result, true), remainder: BigInteger.create(bi_x._sign, bits_rem, true) };
        };
        BigInteger.equals = function (x, y) {
            var bi_x = typeof x === "number" ? new BigInteger(x) : x;
            var bi_y = typeof y === "number" ? new BigInteger(y) : y;
            if (bi_x._sign != bi_y._sign)
                return false;
            if (bi_x._bits.length != bi_y._bits.length)
                return false;
            for (var i = 0; i < bi_x._bits.length; i++)
                if (bi_x._bits[i] != bi_y._bits[i])
                    return false;
            return true;
        };
        BigInteger.prototype.equals = function (other) {
            return BigInteger.equals(this, other);
        };
        BigInteger.fromString = function (str, radix) {
            if (radix === void 0) { radix = 10; }
            var bi = Object.create(BigInteger.prototype);
            bi.fromString(str, radix);
            return bi;
        };
        BigInteger.prototype.fromString = function (str, radix) {
            if (radix === void 0) { radix = 10; }
            if (radix < 2 || radix > 36)
                throw new RangeError();
            if (str.length == 0) {
                this._sign == 0;
                this._bits = [];
                return;
            }
            var bits_radix = [radix];
            var bits_a = [0];
            var first = str.charCodeAt(0);
            var withsign = first == 0x2b || first == 0x2d;
            this._sign = first == 0x2d ? -1 : +1;
            this._bits = [];
            for (var i = withsign ? 1 : 0; i < str.length; i++) {
                bits_a[0] = str.charCodeAt(i);
                if (bits_a[0] >= 0x30 && bits_a[0] <= 0x39)
                    bits_a[0] -= 0x30;
                else if (bits_a[0] >= 0x41 && bits_a[0] <= 0x5a)
                    bits_a[0] -= 0x37;
                else if (bits_a[0] >= 0x61 && bits_a[0] <= 0x7a)
                    bits_a[0] -= 0x57;
                else
                    throw new RangeError();
                var bits_temp = new Array();
                BigInteger.multiplyTo(this._bits, bits_radix, bits_temp);
                BigInteger.addTo(bits_temp, bits_a, this._bits);
            }
            this.clamp();
        };
        BigInteger.fromUint8Array = function (arr, sign, littleEndian) {
            if (sign === void 0) { sign = 1; }
            if (littleEndian === void 0) { littleEndian = true; }
            var bi = Object.create(BigInteger.prototype);
            bi.fromUint8Array(arr, sign, littleEndian);
            return bi;
        };
        BigInteger.prototype.fromUint8Array = function (arr, sign, littleEndian) {
            if (sign === void 0) { sign = 1; }
            if (littleEndian === void 0) { littleEndian = true; }
            if (!littleEndian) {
                var arr_new = new Uint8Array(arr.length);
                for (var i = 0; i < arr.length; i++)
                    arr_new[arr.length - 1 - i] = arr[i];
                arr = arr_new;
            }
            var actual_length = BigInteger.getActualLength(arr);
            var bits = actual_length * 8;
            var units = Math.ceil(bits / DB);
            this._bits = [];
            for (var i = 0; i < units; i++) {
                var cb = i * DB;
                var cu = Math.floor(cb / 8);
                cb %= 8;
                this._bits[i] = ((arr[cu] | arr[cu + 1] << 8 | arr[cu + 2] << 16 | arr[cu + 3] << 24) >>> cb) & DM;
            }
            this._sign = sign < 0 ? -1 : +1;
            this.clamp();
        };
        BigInteger.prototype.fromUint64 = function (i, sign) {
            while (i.bits[0] != 0 || i.bits[1] != 0) {
                this._bits.push(i.toUint32() & DM);
                i = i.rightShift(DB);
            }
            this._sign = sign;
            this.clamp();
        };
        BigInteger.getActualLength = function (arr) {
            var actual_length = arr.length;
            for (var i = arr.length - 1; i >= 0; i--)
                if (arr[i] != 0) {
                    actual_length = i + 1;
                    break;
                }
            return actual_length;
        };
        BigInteger.getDoubleParts = function (dbl) {
            var uu = new Uint32Array(2);
            new Float64Array(uu.buffer)[0] = dbl;
            var result = {
                sign: 1 - ((uu[1] >>> 30) & 2),
                man: new AntShares.Uint64(uu[0], uu[1] & 0x000FFFFF),
                exp: (uu[1] >>> 20) & 0x7FF,
                fFinite: true
            };
            if (result.exp == 0) {
                if (!result.man.equals(AntShares.Uint64.Zero))
                    result.exp = -1074;
            }
            else if (result.exp == 0x7FF) {
                result.fFinite = false;
            }
            else {
                result.man = result.man.or(new AntShares.Uint64(0, 0x00100000));
                result.exp -= 1075;
            }
            return result;
        };
        BigInteger.prototype.getLowestSetBit = function () {
            if (this._sign == 0)
                return -1;
            var w = 0;
            while (this._bits[w] == 0)
                w++;
            for (var x = 0; x < DB; x++)
                if ((this._bits[w] & 1 << x) > 0)
                    return x + w * DB;
        };
        BigInteger.prototype.isEven = function () {
            if (this._sign == 0)
                return true;
            return (this._bits[0] & 1) == 0;
        };
        BigInteger.prototype.isZero = function () {
            return this._sign == 0;
        };
        BigInteger.prototype.leftShift = function (shift) {
            if (shift == 0)
                return this;
            var shift_units = Math.floor(shift / DB);
            shift %= DB;
            var bits_new = new Array(this._bits.length + shift_units);
            if (shift == 0) {
                for (var i = 0; i < this._bits.length; i++)
                    bits_new[i + shift_units] = this._bits[i];
            }
            else {
                for (var i = shift_units; i < bits_new.length; i++)
                    bits_new[i] = (this._bits[i - shift_units] << shift | this._bits[i - shift_units - 1] >>> (DB - shift)) & DM;
                bits_new[bits_new.length] = this._bits[this._bits.length - 1] >>> (DB - shift) & DM;
            }
            return BigInteger.create(this._sign, bits_new, true);
        };
        BigInteger.mod = function (x, y) {
            var bi_x = typeof x === "number" ? new BigInteger(x) : x;
            var bi_y = typeof y === "number" ? new BigInteger(y) : y;
            var bi_new = BigInteger.divRem(bi_x, bi_y).remainder;
            if (bi_new._sign < 0)
                bi_new = BigInteger.add(bi_new, bi_y);
            return bi_new;
        };
        BigInteger.prototype.mod = function (other) {
            return BigInteger.mod(this, other);
        };
        BigInteger.modInverse = function (value, modulus) {
            var a = typeof value === "number" ? new BigInteger(value) : value;
            var n = typeof modulus === "number" ? new BigInteger(modulus) : modulus;
            var i = n, v = BigInteger.Zero, d = BigInteger.One;
            while (a._sign > 0) {
                var t = BigInteger.divRem(i, a);
                var x = d;
                i = a;
                a = t.remainder;
                d = v.subtract(t.result.multiply(x));
                v = x;
            }
            return BigInteger.mod(v, n);
        };
        BigInteger.prototype.modInverse = function (modulus) {
            return BigInteger.modInverse(this, modulus);
        };
        BigInteger.modPow = function (value, exponent, modulus) {
            var bi_v = typeof value === "number" ? new BigInteger(value) : value;
            var bi_e = typeof exponent === "number" ? new BigInteger(exponent) : exponent;
            var bi_m = typeof modulus === "number" ? new BigInteger(modulus) : modulus;
            if (bi_e._sign < 0 || bi_m._sign == 0)
                throw new RangeError();
            if (Math.abs(bi_m._sign) == 1 && bi_m._bits == null)
                return BigInteger.Zero;
            var h = bi_e.bitLength();
            var bi_new = BigInteger.One;
            for (var i = 0; i < h; i++) {
                if (i > 0)
                    bi_v = BigInteger.multiply(bi_v, bi_v);
                bi_v = bi_v.remainder(bi_m);
                if (bi_e.testBit(i))
                    bi_new = BigInteger.multiply(bi_v, bi_new).remainder(bi_m);
            }
            if (bi_new._sign < 0)
                bi_new = BigInteger.add(bi_new, bi_m);
            return bi_new;
        };
        BigInteger.prototype.modPow = function (exponent, modulus) {
            return BigInteger.modPow(this, exponent, modulus);
        };
        BigInteger.multiply = function (x, y) {
            var bi_x = typeof x === "number" ? new BigInteger(x) : x;
            var bi_y = typeof y === "number" ? new BigInteger(y) : y;
            if (bi_x._sign == 0)
                return bi_x;
            if (bi_y._sign == 0)
                return bi_y;
            if (bi_x._sign == 1 && bi_x._bits == null)
                return bi_y;
            if (bi_x._sign == -1 && bi_x._bits == null)
                return bi_y.negate();
            if (bi_y._sign == 1 && bi_y._bits == null)
                return bi_x;
            if (bi_y._sign == -1 && bi_y._bits == null)
                return bi_x.negate();
            var bits_r = new Array();
            BigInteger.multiplyTo(bi_x._bits, bi_y._bits, bits_r);
            return BigInteger.create((bi_x._sign > 0) == (bi_y._sign > 0) ? +1 : -1, bits_r);
        };
        BigInteger.prototype.multiply = function (other) {
            return BigInteger.multiply(this, other);
        };
        BigInteger.multiplyTo = function (x, y, r, offset) {
            if (offset === void 0) { offset = 0; }
            if (x.length > y.length) {
                var t = x;
                x = y;
                y = t;
            }
            for (var i = x.length + y.length - 2; i >= 0; i--)
                r[i + offset] = 0;
            for (var i = 0; i < x.length; i++) {
                if (x[i] == 0)
                    continue;
                for (var j = 0; j < y.length; j++) {
                    var c = x[i] * y[j];
                    if (c == 0)
                        continue;
                    var k = i + j;
                    do {
                        c += r[k + offset] || 0;
                        r[k + offset] = c & DM;
                        c = Math.floor(c / DV);
                        k++;
                    } while (c > 0);
                }
            }
        };
        BigInteger.prototype.negate = function () {
            return BigInteger.create(-this._sign, this._bits);
        };
        BigInteger.parse = function (str) {
            return BigInteger.fromString(str);
        };
        BigInteger.pow = function (value, exponent) {
            var bi_v = typeof value === "number" ? new BigInteger(value) : value;
            if (exponent < 0 || exponent > 0x7fffffff)
                throw new RangeError();
            if (exponent == 0)
                return BigInteger.One;
            if (exponent == 1)
                return bi_v;
            if (bi_v._sign == 0)
                return bi_v;
            if (bi_v._bits.length == 1) {
                if (bi_v._bits[0] == 1)
                    return bi_v;
                if (bi_v._bits[0] == -1)
                    return (exponent & 1) != 0 ? bi_v : BigInteger.One;
            }
            var h = BigInteger.bitLengthInternal(exponent);
            var bi_new = BigInteger.One;
            for (var i = 0; i < h; i++) {
                var e = 1 << i;
                if (e > 1)
                    bi_v = BigInteger.multiply(bi_v, bi_v);
                if ((exponent & e) != 0)
                    bi_new = BigInteger.multiply(bi_v, bi_new);
            }
            return bi_new;
        };
        BigInteger.prototype.pow = function (exponent) {
            return BigInteger.pow(this, exponent);
        };
        BigInteger.random = function (bitLength, rng) {
            if (bitLength == 0)
                return BigInteger.Zero;
            var bytes = new Uint8Array(Math.ceil(bitLength / 8));
            if (rng == null) {
                for (var i = 0; i < bytes.length; i++)
                    bytes[i] = Math.random() * 256;
            }
            else {
                rng.getRandomValues(bytes);
            }
            bytes[bytes.length - 1] &= 0xff >>> (8 - bitLength % 8);
            return new BigInteger(bytes);
        };
        BigInteger.remainder = function (x, y) {
            var bi_x = typeof x === "number" ? new BigInteger(x) : x;
            var bi_y = typeof y === "number" ? new BigInteger(y) : y;
            return BigInteger.divRem(bi_x, bi_y).remainder;
        };
        BigInteger.prototype.remainder = function (other) {
            return BigInteger.remainder(this, other);
        };
        BigInteger.prototype.rightShift = function (shift) {
            if (shift == 0)
                return this;
            var shift_units = Math.floor(shift / DB);
            shift %= DB;
            if (this._bits.length <= shift_units)
                return BigInteger.Zero;
            var bits_new = new Array(this._bits.length - shift_units);
            if (shift == 0) {
                for (var i = 0; i < bits_new.length; i++)
                    bits_new[i] = this._bits[i + shift_units];
            }
            else {
                for (var i = 0; i < bits_new.length; i++)
                    bits_new[i] = (this._bits[i + shift_units] >>> shift | this._bits[i + shift_units + 1] << (DB - shift)) & DM;
            }
            return BigInteger.create(this._sign, bits_new, true);
        };
        BigInteger.prototype.sign = function () {
            return this._sign;
        };
        BigInteger.subtract = function (x, y) {
            var bi_x = typeof x === "number" ? new BigInteger(x) : x;
            var bi_y = typeof y === "number" ? new BigInteger(y) : y;
            if (bi_x._sign == 0)
                return bi_y.negate();
            if (bi_y._sign == 0)
                return bi_x;
            if ((bi_x._sign > 0) != (bi_y._sign > 0))
                return BigInteger.add(bi_x, bi_y.negate());
            var c = BigInteger.compareAbs(bi_x, bi_y);
            if (c == 0)
                return BigInteger.Zero;
            if (c < 0)
                return BigInteger.subtract(bi_y, bi_x).negate();
            var bits_r = new Array();
            BigInteger.subtractTo(bi_x._bits, bi_y._bits, bits_r);
            return BigInteger.create(bi_x._sign, bits_r, true);
        };
        BigInteger.prototype.subtract = function (other) {
            return BigInteger.subtract(this, other);
        };
        BigInteger.subtractTo = function (x, y, r) {
            if (r == null)
                r = [];
            var l = Math.min(x.length, y.length);
            var c = 0, i = 0;
            while (i < l) {
                c += x[i] - y[i];
                r[i++] = c & DM;
                c >>= DB;
            }
            if (x.length < y.length)
                while (i < y.length) {
                    c -= y[i];
                    r[i++] = c & DM;
                    c >>= DB;
                }
            else
                while (i < x.length) {
                    c += x[i];
                    r[i++] = c & DM;
                    c >>= DB;
                }
            return c < 0;
        };
        BigInteger.prototype.testBit = function (n) {
            var units = Math.floor(n / DB);
            if (this._bits.length <= units)
                return false;
            return (this._bits[units] & (1 << (n %= DB))) != 0;
        };
        BigInteger.prototype.toInt32 = function () {
            if (this._sign == 0)
                return 0;
            if (this._bits.length == 1)
                return this._bits[0] * this._sign;
            return ((this._bits[0] | this._bits[1] * DV) & 0x7fffffff) * this._sign;
        };
        BigInteger.prototype.toString = function (radix) {
            if (radix === void 0) { radix = 10; }
            if (this._sign == 0)
                return "0";
            if (radix < 2 || radix > 36)
                throw new RangeError();
            var s = "";
            for (var bi = this; bi._sign != 0;) {
                var r = BigInteger.divRem(bi, radix);
                var rem = Math.abs(r.remainder.toInt32());
                if (rem < 10)
                    rem += 0x30;
                else
                    rem += 0x57;
                s = String.fromCharCode(rem) + s;
                bi = r.result;
            }
            if (this._sign < 0)
                s = "-" + s;
            return s;
        };
        BigInteger.prototype.toUint8Array = function (littleEndian, length) {
            if (littleEndian === void 0) { littleEndian = true; }
            if (this._sign == 0)
                return new Uint8Array(length || 1);
            var cb = Math.ceil(this._bits.length * DB / 8);
            var array = new Uint8Array(length || cb);
            for (var i = 0; i < array.length; i++) {
                var offset = littleEndian ? i : array.length - 1 - i;
                var cbits = i * 8;
                var cu = Math.floor(cbits / DB);
                cbits %= DB;
                if (DB - cbits < 8)
                    array[offset] = (this._bits[cu] >>> cbits | this._bits[cu + 1] << (DB - cbits)) & 0xff;
                else
                    array[offset] = this._bits[cu] >>> cbits & 0xff;
            }
            length = length || BigInteger.getActualLength(array);
            if (length < array.length)
                array = array.subarray(0, length);
            return array;
        };
        return BigInteger;
    }());
    AntShares.BigInteger = BigInteger;
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var D = 100000000;
    var _max, _min, _one, _satoshi;
    var Fixed8 = (function () {
        function Fixed8(data) {
            this.data = data;
            if (data.bits[1] >= 0x80000000)
                throw new RangeError();
        }
        Object.defineProperty(Fixed8, "MaxValue", {
            get: function () { return _max || (_max = new Fixed8(AntShares.Uint64.MaxValue)); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Fixed8, "MinValue", {
            get: function () { return _min || (_min = new Fixed8(AntShares.Uint64.MinValue)); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Fixed8, "One", {
            get: function () { return _one || (_one = Fixed8.fromNumber(1)); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Fixed8, "Satoshi", {
            get: function () { return _satoshi || (_satoshi = new Fixed8(new AntShares.Uint64(1))); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Fixed8, "Zero", {
            get: function () { return Fixed8.MinValue; },
            enumerable: true,
            configurable: true
        });
        Fixed8.prototype.add = function (other) {
            var result = this.data.add(other.data);
            if (result.compareTo(this.data) < 0)
                throw new Error();
            return new Fixed8(result);
        };
        Fixed8.prototype.compareTo = function (other) {
            return this.data.compareTo(other.data);
        };
        Fixed8.prototype.equals = function (other) {
            return this.data.equals(other.data);
        };
        Fixed8.fromNumber = function (value) {
            if (value < 0)
                throw new RangeError();
            value *= D;
            if (value >= 0x8000000000000000)
                throw new RangeError();
            var array = new Uint32Array((new AntShares.BigInteger(value)).toUint8Array(true, 8).buffer);
            return new Fixed8(new AntShares.Uint64(array[0], array[1]));
        };
        Fixed8.prototype.getData = function () {
            return this.data;
        };
        Fixed8.max = function (first) {
            var others = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                others[_i - 1] = arguments[_i];
            }
            for (var i = 0; i < others.length; i++)
                if (first.compareTo(others[i]) < 0)
                    first = others[i];
            return first;
        };
        Fixed8.min = function (first) {
            var others = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                others[_i - 1] = arguments[_i];
            }
            for (var i = 0; i < others.length; i++)
                if (first.compareTo(others[i]) > 0)
                    first = others[i];
            return first;
        };
        Fixed8.parse = function (str) {
            var dot = str.indexOf('.');
            var digits = dot >= 0 ? str.length - dot - 1 : 0;
            str = str.replace('.', '');
            if (digits > 8)
                str = str.substr(0, str.length - digits + 8);
            else if (digits < 8)
                for (var i = digits; i < 8; i++)
                    str += '0';
            return new Fixed8(AntShares.Uint64.parse(str));
        };
        Fixed8.prototype.subtract = function (other) {
            if (this.data.compareTo(other.data) < 0)
                throw new Error();
            return new Fixed8(this.data.subtract(other.data));
        };
        Fixed8.prototype.toString = function () {
            var str = this.data.toString();
            while (str.length <= 8)
                str = '0' + str;
            str = str.substr(0, str.length - 8) + '.' + str.substr(str.length - 8);
            var e = 0;
            for (var i = str.length - 1; i >= 0; i--)
                if (str[i] == '0')
                    e++;
                else
                    break;
            str = str.substr(0, str.length - e);
            if (str[str.length - 1] == '.')
                str = str.substr(0, str.length - 1);
            return str;
        };
        return Fixed8;
    }());
    AntShares.Fixed8 = Fixed8;
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var UintVariable = (function () {
        function UintVariable(bits) {
            if (typeof bits === "number") {
                if (bits <= 0 || bits % 32 != 0)
                    throw new RangeError();
                this._bits = new Uint32Array(bits / 32);
            }
            else if (bits instanceof Uint8Array) {
                if (bits.length == 0 || bits.length % 4 != 0)
                    throw new RangeError();
                if (bits.byteOffset % 4 == 0) {
                    this._bits = new Uint32Array(bits.buffer, bits.byteOffset, bits.length / 4);
                }
                else {
                    var bits_new = new Uint8Array(bits);
                    this._bits = new Uint32Array(bits_new.buffer);
                }
            }
            else if (bits instanceof Uint32Array) {
                this._bits = bits;
            }
            else if (bits instanceof Array) {
                if (bits.length == 0)
                    throw new RangeError();
                this._bits = new Uint32Array(bits);
            }
        }
        Object.defineProperty(UintVariable.prototype, "bits", {
            get: function () {
                return this._bits;
            },
            enumerable: true,
            configurable: true
        });
        UintVariable.prototype.compareTo = function (other) {
            var max = Math.max(this._bits.length, other._bits.length);
            for (var i = max - 1; i >= 0; i--)
                if ((this._bits[i] || 0) > (other._bits[i] || 0))
                    return 1;
                else if ((this._bits[i] || 0) < (other._bits[i] || 0))
                    return -1;
            return 0;
        };
        UintVariable.prototype.equals = function (other) {
            var max = Math.max(this._bits.length, other._bits.length);
            for (var i = 0; i < max; i++)
                if ((this._bits[i] || 0) != (other._bits[i] || 0))
                    return false;
            return true;
        };
        UintVariable.prototype.toString = function () {
            var s = "";
            for (var i = this._bits.length * 32 - 4; i >= 0; i -= 4)
                s += ((this._bits[i >>> 5] >>> (i % 32)) & 0xf).toString(16);
            return s;
        };
        return UintVariable;
    }());
    AntShares.UintVariable = UintVariable;
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var _zero;
    var Uint160 = (function (_super) {
        __extends(Uint160, _super);
        function Uint160(value) {
            if (value == null)
                value = new ArrayBuffer(20);
            if (value.byteLength != 20)
                throw new RangeError();
            _super.call(this, new Uint32Array(value));
        }
        Object.defineProperty(Uint160, "Zero", {
            get: function () { return _zero || (_zero = new Uint160()); },
            enumerable: true,
            configurable: true
        });
        Uint160.parse = function (str) {
            if (str.length != 40)
                throw new RangeError();
            return new Uint160(str.hexToBytes().buffer);
        };
        return Uint160;
    }(AntShares.UintVariable));
    AntShares.Uint160 = Uint160;
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var _zero;
    var Uint256 = (function (_super) {
        __extends(Uint256, _super);
        function Uint256(value) {
            if (value == null)
                value = new ArrayBuffer(32);
            if (value.byteLength != 32)
                throw new RangeError();
            _super.call(this, new Uint32Array(value));
        }
        Object.defineProperty(Uint256, "Zero", {
            get: function () { return _zero || (_zero = new Uint256()); },
            enumerable: true,
            configurable: true
        });
        Uint256.parse = function (str) {
            if (str.length != 64)
                throw new RangeError();
            return new Uint256(str.hexToBytes().buffer);
        };
        return Uint256;
    }(AntShares.UintVariable));
    AntShares.Uint256 = Uint256;
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var _max, _min;
    var Uint64 = (function (_super) {
        __extends(Uint64, _super);
        function Uint64(low, high) {
            if (low === void 0) { low = 0; }
            if (high === void 0) { high = 0; }
            _super.call(this, [low, high]);
        }
        Object.defineProperty(Uint64, "MaxValue", {
            get: function () { return _max || (_max = new Uint64(0xffffffff, 0xffffffff)); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Uint64, "MinValue", {
            get: function () { return _min || (_min = new Uint64()); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Uint64, "Zero", {
            get: function () { return Uint64.MinValue; },
            enumerable: true,
            configurable: true
        });
        Uint64.prototype.add = function (other) {
            var low = this._bits[0] + other._bits[0];
            var high = this._bits[1] + other._bits[1] + (low > 0xffffffff ? 1 : 0);
            return new Uint64(low, high);
        };
        Uint64.prototype.and = function (other) {
            if (typeof other === "number") {
                return this.and(new Uint64(other));
            }
            else {
                var bits = new Uint32Array(this._bits.length);
                for (var i = 0; i < bits.length; i++)
                    bits[i] = this._bits[i] & other._bits[i];
                return new Uint64(bits[0], bits[1]);
            }
        };
        Uint64.prototype.leftShift = function (shift) {
            if (shift == 0)
                return this;
            var shift_units = shift >>> 5;
            shift = shift & 0x1f;
            var bits = new Uint32Array(this._bits.length);
            for (var i = shift_units; i < bits.length; i++)
                if (shift == 0)
                    bits[i] = this._bits[i - shift_units];
                else
                    bits[i] = this._bits[i - shift_units] << shift | this._bits[i - shift_units - 1] >>> (32 - shift);
            return new Uint64(bits[0], bits[1]);
        };
        Uint64.prototype.not = function () {
            var bits = new Uint32Array(this._bits.length);
            for (var i = 0; i < bits.length; i++)
                bits[i] = ~this._bits[i];
            return new Uint64(bits[0], bits[1]);
        };
        Uint64.prototype.or = function (other) {
            if (typeof other === "number") {
                return this.or(new Uint64(other));
            }
            else {
                var bits = new Uint32Array(this._bits.length);
                for (var i = 0; i < bits.length; i++)
                    bits[i] = this._bits[i] | other._bits[i];
                return new Uint64(bits[0], bits[1]);
            }
        };
        Uint64.parse = function (str) {
            var bi = AntShares.BigInteger.parse(str);
            if (bi.bitLength() > 64)
                throw new RangeError();
            var array = new Uint32Array(bi.toUint8Array(true, 8).buffer);
            return new Uint64(array[0], array[1]);
        };
        Uint64.prototype.rightShift = function (shift) {
            if (shift == 0)
                return this;
            var shift_units = shift >>> 5;
            shift = shift & 0x1f;
            var bits = new Uint32Array(this._bits.length);
            for (var i = 0; i < bits.length - shift_units; i++)
                if (shift == 0)
                    bits[i] = this._bits[i + shift_units];
                else
                    bits[i] = this._bits[i + shift_units] >>> shift | this._bits[i + shift_units + 1] << (32 - shift);
            return new Uint64(bits[0], bits[1]);
        };
        Uint64.prototype.subtract = function (other) {
            var low = this._bits[0] - other._bits[0];
            var high = this._bits[1] - other._bits[1] - (this._bits[0] < other._bits[0] ? 1 : 0);
            return new Uint64(low, high);
        };
        Uint64.prototype.toInt32 = function () {
            return this._bits[0] | 0;
        };
        Uint64.prototype.toNumber = function () {
            return this._bits[0] + this._bits[1] * Math.pow(2, 32);
        };
        Uint64.prototype.toString = function () {
            return (new AntShares.BigInteger(this._bits.buffer)).toString();
        };
        Uint64.prototype.toUint32 = function () {
            return this._bits[0];
        };
        Uint64.prototype.xor = function (other) {
            if (typeof other === "number") {
                return this.xor(new Uint64(other));
            }
            else {
                var bits = new Uint32Array(this._bits.length);
                for (var i = 0; i < bits.length; i++)
                    bits[i] = this._bits[i] ^ other._bits[i];
                return new Uint64(bits[0], bits[1]);
            }
        };
        return Uint64;
    }(AntShares.UintVariable));
    AntShares.Uint64 = Uint64;
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Wallets;
    (function (Wallets) {
        var Account = (function () {
            function Account() {
            }
            Account.create = function (privateKey) {
                if (privateKey == null) {
                    privateKey = new Uint8Array(32);
                    window.crypto.getRandomValues(privateKey);
                }
                if (privateKey.byteLength != 32 && privateKey.byteLength != 96 && privateKey.byteLength != 104)
                    throw new RangeError();
                privateKey = Uint8Array.fromArrayBuffer(privateKey);
                var account = new Account();
                account.privateKey = new ArrayBuffer(32);
                Array.copy(privateKey, privateKey.byteLength - 32, new Uint8Array(account.privateKey), 0, 32);
                if (privateKey.byteLength == 32)
                    account.publicKey = AntShares.Cryptography.ECPoint.multiply(AntShares.Cryptography.ECCurve.secp256r1.G, privateKey);
                else
                    account.publicKey = AntShares.Cryptography.ECPoint.fromUint8Array(privateKey, AntShares.Cryptography.ECCurve.secp256r1);
                return account.publicKey.encodePoint(true).toScriptHash().then(function (result) {
                    account.publicKeyHash = result;
                    return account;
                });
            };
            Account.prototype.equals = function (other) {
                if (this === other)
                    return true;
                if (null == other)
                    return false;
                return this.publicKeyHash.equals(other.publicKeyHash);
            };
            Account.prototype.export = function () {
                var data = new Uint8Array(38);
                data[0] = 0x80;
                Array.copy(new Uint8Array(this.privateKey), 0, data, 1, 32);
                data[33] = 0x01;
                return window.crypto.subtle.digest("SHA-256", new Uint8Array(data.buffer, 0, data.byteLength - 4)).then(function (result) {
                    return window.crypto.subtle.digest("SHA-256", new Uint8Array(result));
                }).then(function (result) {
                    var checksum = new Uint8Array(result, 0, 4);
                    Array.copy(checksum, 0, data, data.byteLength - 4, 4);
                    var wif = data.base58Encode();
                    data.fill(0);
                    return wif;
                });
            };
            return Account;
        }());
        Wallets.Account = Account;
    })(Wallets = AntShares.Wallets || (AntShares.Wallets = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Wallets;
    (function (Wallets) {
        var Coin = (function () {
            function Coin() {
                this._state = Wallets.CoinState.Unconfirmed;
            }
            Object.defineProperty(Coin.prototype, "key", {
                get: function () { return this.input.toString(); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Coin.prototype, "state", {
                get: function () { return this._state; },
                set: function (value) {
                    if (this._state != value) {
                        this._state = value;
                        if (this.trackState == AntShares.IO.Caching.TrackState.None)
                            this.trackState = AntShares.IO.Caching.TrackState.Changed;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Coin.prototype.equals = function (other) {
                if (this === other)
                    return true;
                if (null === other)
                    return false;
                return this.input.equals(other.input);
            };
            Coin.prototype.getAddress = function () {
                return Wallets.Wallet.toAddress(this.scriptHash);
            };
            return Coin;
        }());
        Wallets.Coin = Coin;
    })(Wallets = AntShares.Wallets || (AntShares.Wallets = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Wallets;
    (function (Wallets) {
        (function (CoinState) {
            CoinState[CoinState["Unconfirmed"] = 0] = "Unconfirmed";
            CoinState[CoinState["Unspent"] = 1] = "Unspent";
            CoinState[CoinState["Spending"] = 2] = "Spending";
            CoinState[CoinState["Spent"] = 3] = "Spent";
            CoinState[CoinState["SpentAndClaimed"] = 4] = "SpentAndClaimed";
        })(Wallets.CoinState || (Wallets.CoinState = {}));
        var CoinState = Wallets.CoinState;
    })(Wallets = AntShares.Wallets || (AntShares.Wallets = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Wallets;
    (function (Wallets) {
        var Contract = (function () {
            function Contract() {
            }
            Contract.create = function (publicKeyHash, parameterList, redeemScript) {
                var contract = new Contract();
                contract.redeemScript = redeemScript;
                contract.parameterList = parameterList;
                contract.publicKeyHash = publicKeyHash;
                return redeemScript.toScriptHash().then(function (result) {
                    contract.scriptHash = result;
                    return contract;
                });
            };
            Contract.createMultiSigContract = function (publicKeyHash, m) {
                var publicKeys = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    publicKeys[_i - 2] = arguments[_i];
                }
                var redeemScript = Contract.createMultiSigRedeemScript.apply(null, [m].concat(publicKeys));
                var parameterList = Array.repeat(Wallets.ContractParameterType.Signature, m);
                return Contract.create(publicKeyHash, parameterList, redeemScript);
            };
            Contract.createMultiSigRedeemScript = function (m) {
                var publicKeys = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    publicKeys[_i - 1] = arguments[_i];
                }
                if (!(1 <= m && m <= publicKeys.length && publicKeys.length <= 1024))
                    throw new RangeError();
                publicKeys.sort(function (a, b) { return a.compareTo(b); });
                var sb = new AntShares.Core.Scripts.ScriptBuilder();
                sb.push(m);
                for (var i = 0; i < publicKeys.length; i++) {
                    sb.push(publicKeys[i].encodePoint(true));
                }
                sb.push(publicKeys.length);
                sb.add(174);
                return sb.toArray();
            };
            Contract.createSignatureContract = function (publicKey) {
                return publicKey.encodePoint(true).toScriptHash().then(function (result) {
                    return Contract.create(result, [Wallets.ContractParameterType.Signature], Contract.createSignatureRedeemScript(publicKey));
                });
            };
            Contract.createSignatureRedeemScript = function (publicKey) {
                var sb = new AntShares.Core.Scripts.ScriptBuilder();
                sb.push(publicKey.encodePoint(true));
                sb.add(172);
                return sb.toArray();
            };
            Contract.prototype.deserialize = function (reader) {
                this.scriptHash = reader.readUint160();
                this.publicKeyHash = reader.readUint160();
                this.parameterList = Array.from(new Uint8Array(reader.readVarBytes()));
                this.redeemScript = reader.readVarBytes();
            };
            Contract.prototype.equals = function (other) {
                if (this === other)
                    return true;
                if (null === other)
                    return false;
                return this.scriptHash.equals(other.scriptHash);
            };
            Contract.prototype.getAddress = function () {
                return Wallets.Wallet.toAddress(this.scriptHash);
            };
            Contract.prototype.isStandard = function () {
                if (this.redeemScript.byteLength != 35)
                    return false;
                var array = new Uint8Array(this.redeemScript);
                if (array[0] != 33 || array[34] != 172)
                    return false;
                return true;
            };
            Contract.prototype.serialize = function (writer) {
                writer.writeUintVariable(this.scriptHash);
                writer.writeUintVariable(this.publicKeyHash);
                writer.writeVarBytes((new Uint8Array(this.parameterList)).buffer);
                writer.writeVarBytes(this.redeemScript);
            };
            return Contract;
        }());
        Wallets.Contract = Contract;
    })(Wallets = AntShares.Wallets || (AntShares.Wallets = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Wallets;
    (function (Wallets) {
        (function (ContractParameterType) {
            ContractParameterType[ContractParameterType["Signature"] = 0] = "Signature";
            ContractParameterType[ContractParameterType["Integer"] = 1] = "Integer";
            ContractParameterType[ContractParameterType["Hash160"] = 2] = "Hash160";
            ContractParameterType[ContractParameterType["Hash256"] = 3] = "Hash256";
            ContractParameterType[ContractParameterType["ByteArray"] = 4] = "ByteArray";
        })(Wallets.ContractParameterType || (Wallets.ContractParameterType = {}));
        var ContractParameterType = Wallets.ContractParameterType;
    })(Wallets = AntShares.Wallets || (AntShares.Wallets = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Wallets;
    (function (Wallets) {
        var Wallet = (function () {
            function Wallet() {
                this.balanceChanged = new __event(this);
                this.accounts = new Map();
                this.contracts = new Map();
                this.isrunning = true;
            }
            Object.defineProperty(Wallet, "CoinVersion", {
                get: function () { return 0x17; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Wallet.prototype, "dbPath", {
                get: function () { return this.path; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Wallet.prototype, "walletHeight", {
                get: function () { return this.current_height; },
                enumerable: true,
                configurable: true
            });
            Wallet.prototype.addContract = function (contract) {
                if (!this.accounts.has(contract.publicKeyHash.toString()))
                    throw new RangeError();
                this.contracts.set(contract.scriptHash.toString(), contract);
                return Promise.resolve(null);
            };
            Wallet.prototype.buildDatabase = function () {
                return Promise.resolve(void 0);
            };
            Wallet.prototype.changePassword = function (password) {
                var _this = this;
                return password.toAesKey().then(function (result) {
                    return window.crypto.subtle.importKey("jwk", { kty: "oct", k: (new Uint8Array(result)).base64UrlEncode(), alg: "A256CBC", ext: true }, "AES-CBC", false, ["encrypt"]);
                }).then(function (result) {
                    return window.crypto.subtle.encrypt({ name: "AES-CBC", iv: _this.iv }, result, _this.masterKey);
                }).then(function (result) {
                    _this.saveStoredData("MasterKey", result);
                });
            };
            Wallet.prototype.containsAccount = function () {
                var _this = this;
                if (arguments[0] instanceof AntShares.Cryptography.ECPoint) {
                    return arguments[0].encodePoint(true).toScriptHash().then(function (result) {
                        return _this.containsAccount(result);
                    });
                }
                else {
                    return this.accounts.has(arguments[0].toString());
                }
            };
            Wallet.prototype.containsAddress = function (scriptHash) {
                return this.contracts.has(scriptHash.toString());
            };
            Wallet.prototype.createAccount = function (privateKey) {
                var _this = this;
                return Wallets.Account.create(privateKey).then(function (result) {
                    _this.accounts.set(result.publicKeyHash.toString(), result);
                    return result;
                });
            };
            Wallet.prototype.decryptPrivateKey = function (encryptedPrivateKey) {
                var _this = this;
                if (encryptedPrivateKey == null)
                    throw new RangeError();
                if (encryptedPrivateKey.byteLength != 112)
                    throw new RangeError();
                return window.crypto.subtle.importKey("jwk", { kty: "oct", k: this.masterKey.base64UrlEncode(), alg: "A256CBC", ext: true }, "AES-CBC", false, ["decrypt"]).then(function (result) {
                    return window.crypto.subtle.decrypt({ name: "AES-CBC", iv: _this.iv }, result, encryptedPrivateKey);
                }).then(function (result) {
                    return new Uint8Array(result);
                });
            };
            Wallet.prototype.deleteAccount = function (publicKeyHash) {
                var _this = this;
                var promises = new Array();
                this.contracts.forEach(function (contract) {
                    if (contract.publicKeyHash.equals(publicKeyHash))
                        promises.push(_this.deleteContract(contract.scriptHash));
                });
                return Promise.all(promises).then(function () {
                    return _this.accounts.delete(publicKeyHash.toString());
                });
            };
            Wallet.prototype.deleteContract = function (scriptHash) {
                var _this = this;
                this.coins.forEach(function (coin, key) {
                    if (coin.scriptHash.equals(scriptHash))
                        _this.coins.remove(key);
                });
                this.coins.commit();
                return Promise.resolve(this.contracts.delete(scriptHash.toString()));
            };
            Wallet.prototype.encryptPrivateKey = function (decryptedPrivateKey) {
                var _this = this;
                return window.crypto.subtle.importKey("jwk", { kty: "oct", k: this.masterKey.base64UrlEncode(), alg: "A256CBC", ext: true }, "AES-CBC", false, ["encrypt"]).then(function (result) {
                    return window.crypto.subtle.encrypt({ name: "AES-CBC", iv: _this.iv }, result, decryptedPrivateKey);
                }).then(function (result) {
                    return new Uint8Array(result);
                });
            };
            Wallet.prototype.findCoins = function () {
                var array = new Array();
                this.coins.forEach(function (coin) {
                    if (coin.state == Wallets.CoinState.Unconfirmed || coin.state == Wallets.CoinState.Unspent)
                        array.push(coin);
                });
                return array;
            };
            Wallet.prototype.findUnspentCoins = function (asset_id, amount) {
                var array = new Array();
                this.coins.forEach(function (coin) {
                    if (coin.state == Wallets.CoinState.Unspent)
                        array.push(coin);
                });
                if (arguments.length == 0)
                    return array;
                return Wallet.findUnspentCoins(array, asset_id, amount);
            };
            Wallet.findUnspentCoins = function (unspents, asset_id, amount) {
                var array = new Array();
                for (var i = 0; i < unspents.length; i++)
                    if (unspents[i].assetId.equals(asset_id))
                        array.push(unspents[i]);
                unspents = array;
                for (var i = 0; i < unspents.length; i++)
                    if (unspents[i].value.equals(amount))
                        return [unspents[i]];
                unspents.sort(function (a, b) { return a.value.compareTo(b.value); });
                for (var i = 0; i < unspents.length; i++)
                    if (unspents[i].value.compareTo(amount) > 0)
                        return [unspents[i]];
                var sum = AntShares.Fixed8.Zero;
                for (var i = 0; i < unspents.length; i++)
                    sum = sum.add(unspents[i].value);
                if (sum.compareTo(amount) < 0)
                    return null;
                if (sum.equals(amount))
                    return unspents;
                array = new Array();
                for (var i = unspents.length - 1; i >= 0; i--) {
                    if (amount.equals(AntShares.Fixed8.Zero))
                        break;
                    amount = amount.subtract(AntShares.Fixed8.min(amount, unspents[i].value));
                }
                return array;
            };
            Wallet.prototype.getAccount = function () {
                var _this = this;
                if (arguments[0] instanceof AntShares.Cryptography.ECPoint) {
                    return arguments[0].encodePoint(true).toScriptHash().then(function (result) {
                        return _this.getAccount(result);
                    });
                }
                else {
                    var key = arguments[0].toString();
                    if (!this.accounts.has(key))
                        return null;
                    return this.accounts.get(key);
                }
            };
            Wallet.prototype.getAccountByScriptHash = function (scriptHash) {
                var key = scriptHash.toString();
                if (!this.contracts.has(key))
                    return null;
                return this.accounts.get(this.contracts.get(key).publicKeyHash.toString());
            };
            Wallet.prototype.getAccounts = function () {
                var array = new Array();
                this.accounts.forEach(function (account) {
                    array.push(account);
                });
                return array;
            };
            Wallet.prototype.getAddresses = function () {
                var array = new Array();
                this.contracts.forEach(function (contract) {
                    array.push(contract.scriptHash);
                });
                return array;
            };
            Wallet.prototype.getAvailable = function (asset_id) {
                var sum = AntShares.Fixed8.Zero;
                this.coins.forEach(function (coin) {
                    if (coin.state == Wallets.CoinState.Unspent && coin.assetId.equals(asset_id))
                        sum = sum.add(coin.value);
                });
                return sum;
            };
            Wallet.prototype.getBalance = function (asset_id) {
                var sum = AntShares.Fixed8.Zero;
                this.coins.forEach(function (coin) {
                    if ((coin.state == Wallets.CoinState.Unconfirmed || coin.state == Wallets.CoinState.Unspent) && coin.assetId.equals(asset_id))
                        sum = sum.add(coin.value);
                });
                return sum;
            };
            Wallet.prototype.getChangeAddress = function () {
                var array = this.getContracts();
                for (var i = 0; i < array.length; i++)
                    if (array[i].isStandard())
                        return array[i].scriptHash;
                return array[0].scriptHash;
            };
            Wallet.prototype.getContract = function (scriptHash) {
                var key = scriptHash.toString();
                if (!this.contracts.has(key))
                    return null;
                return this.contracts.get(key);
            };
            Wallet.prototype.getContracts = function (publicKeyHash) {
                var array = new Array();
                this.contracts.forEach(function (contract) {
                    if (publicKeyHash == null || publicKeyHash.equals(contract.publicKeyHash))
                        array.push(contract);
                });
                return array;
            };
            Wallet.getPrivateKeyFromWIF = function (wif) {
                if (wif == null)
                    throw new RangeError();
                var data = wif.base58Decode();
                if (data.length != 38 || data[0] != 0x80 || data[33] != 0x01)
                    throw new RangeError();
                return window.crypto.subtle.digest("SHA-256", new Uint8Array(data.buffer, 0, data.length - 4)).then(function (result) {
                    return window.crypto.subtle.digest("SHA-256", result);
                }).then(function (result) {
                    var array = new Uint8Array(result);
                    for (var i = 0; i < 4; i++)
                        if (data[data.length - 4 + i] != array[i])
                            throw new RangeError();
                    var privateKey = new Uint8Array(32);
                    Array.copy(data, 1, privateKey, 0, privateKey.length);
                    return privateKey.buffer;
                });
            };
            Wallet.prototype.getUnclaimedCoins = function () {
                var array = new Array();
                this.coins.forEach(function (coin) {
                    if (coin.state == Wallets.CoinState.Spent && coin.assetId.equals(AntShares.Core.Blockchain.AntShare.hash))
                        array.push(coin);
                });
                return array;
            };
            Wallet.prototype.import = function (wif) {
                var _this = this;
                return Wallet.getPrivateKeyFromWIF(wif).then(function (result) {
                    return _this.createAccount(new Uint8Array(result));
                });
            };
            Wallet.prototype.init = function (path, password, create) {
                var _this = this;
                this.path = path;
                var passwordKey, passwordKeyHash, aesKey;
                var current_version = new Uint8Array([0, 7, 0, 0]);
                return Promise.resolve(typeof password === "string" ? password.toAesKey() : password).then(function (result) {
                    passwordKey = new Uint8Array(result);
                    return Promise.all([
                        window.crypto.subtle.digest("SHA-256", passwordKey),
                        window.crypto.subtle.importKey("jwk", { kty: "oct", k: passwordKey.base64UrlEncode(), alg: "A256CBC", ext: true }, "AES-CBC", false, ["encrypt", "decrypt"])
                    ]);
                }).then(function (results) {
                    passwordKeyHash = new Uint8Array(results[0]);
                    aesKey = results[1];
                    if (create) {
                        _this.iv = new Uint8Array(16);
                        _this.masterKey = new Uint8Array(32);
                        _this.coins = new AntShares.IO.Caching.TrackableCollection();
                        return Promise.resolve(AntShares.Core.Blockchain.Default == null ? 0 : AntShares.Core.Blockchain.Default.getBlockCount()).then(function (result) {
                            _this.current_height = result;
                            window.crypto.getRandomValues(_this.iv);
                            window.crypto.getRandomValues(_this.masterKey);
                            return Promise.all([
                                _this.buildDatabase(),
                                window.crypto.subtle.encrypt({ name: "AES-CBC", iv: _this.iv }, aesKey, _this.masterKey)
                            ]);
                        }).then(function (results) {
                            return Promise.all([
                                _this.saveStoredData("PasswordHash", passwordKeyHash),
                                _this.saveStoredData("IV", _this.iv.buffer),
                                _this.saveStoredData("MasterKey", results[1]),
                                _this.saveStoredData("Version", current_version.buffer),
                                _this.saveStoredData("Height", new Uint32Array([_this.current_height]).buffer)
                            ]);
                        });
                    }
                    else {
                        return Promise.all([
                            _this.loadStoredData("PasswordHash"),
                            _this.loadStoredData("IV")
                        ]).then(function (results) {
                            var passwordHash = new Uint8Array(results[0]);
                            if (passwordHash.length != passwordKeyHash.length)
                                throw new Error();
                            for (var i = 0; i < passwordHash.length; i++)
                                if (passwordHash[i] != passwordKeyHash[i])
                                    throw new Error();
                            _this.iv = new Uint8Array(results[1]);
                            return Promise.all([
                                _this.loadStoredData("MasterKey").then(function (result) {
                                    return window.crypto.subtle.decrypt({ name: "AES-CBC", iv: _this.iv }, aesKey, result);
                                }),
                                _this.loadAccounts(),
                                _this.loadContracts(),
                                _this.loadCoins(),
                                _this.loadStoredData("Height"),
                            ]);
                        }).then(function (results) {
                            _this.masterKey = new Uint8Array(results[0]);
                            for (var i = 0; i < results[1].length; i++)
                                _this.accounts.set(results[1][i].publicKeyHash.toString(), results[1][i]);
                            for (var i = 0; i < results[2].length; i++)
                                _this.contracts.set(results[2][i].scriptHash.toString(), results[2][i]);
                            _this.coins = new AntShares.IO.Caching.TrackableCollection(results[3]);
                            _this.current_height = (new Uint32Array(results[4]))[0];
                        });
                    }
                }).then(function () {
                    setTimeout(_this.processBlocks.bind(_this), AntShares.Core.Blockchain.SecondsPerBlock * 1000);
                });
            };
            Wallet.prototype.makeTransaction = function (tx, fee) {
                var _this = this;
                if (tx.outputs == null)
                    throw new RangeError();
                if (tx.attributes == null)
                    tx.attributes = new Array();
                fee = fee.add(tx.systemFee);
                var outputs = tx instanceof AntShares.Core.IssueTransaction ? new Array() : tx.outputs;
                var pay_total = new Map();
                for (var i = 0; i < outputs.length; i++) {
                    var key = outputs[i].assetId.toString();
                    if (pay_total.has(key)) {
                        var item = pay_total.get(key);
                        item.value = item.value.add(outputs[i].value);
                    }
                    else {
                        pay_total.set(key, { assetId: outputs[i].assetId, value: outputs[i].value });
                    }
                }
                if (fee.compareTo(AntShares.Fixed8.Zero) > 0) {
                    var key = AntShares.Core.Blockchain.AntCoin.hash.toString();
                    if (pay_total.has(key)) {
                        var item = pay_total.get(key);
                        item.value = item.value.add(fee);
                    }
                    else {
                        pay_total.set(key, { assetId: AntShares.Core.Blockchain.AntCoin.hash, value: fee });
                    }
                }
                var pay_coins = new Array(), input_sum = new Array(), insufficient = false;
                pay_total.forEach(function (item) {
                    var unspents = _this.findUnspentCoins(item.assetId, item.value);
                    if (unspents == null) {
                        insufficient = true;
                        return;
                    }
                    var sum = AntShares.Fixed8.Zero;
                    for (var i = 0; i < unspents.length; i++) {
                        sum = sum.add(unspents[i].value);
                        pay_coins.push(unspents[i].input);
                    }
                    input_sum.push({ assetId: item.assetId, value: sum });
                });
                if (insufficient)
                    return null;
                var change_address = this.getChangeAddress();
                for (var i = 0; i < input_sum.length; i++) {
                    var key = input_sum[i].assetId.toString();
                    if (input_sum[i].value.compareTo(pay_total.get(key).value) > 0) {
                        var output = new AntShares.Core.TransactionOutput();
                        output.assetId = input_sum[i].assetId;
                        output.value = input_sum[i].value.subtract(pay_total.get(key).value);
                        output.scriptHash = change_address;
                        tx.outputs.push(output);
                    }
                }
                tx.inputs = pay_coins;
                return tx;
            };
            Wallet.prototype.processBlocks = function () {
                var _this = this;
                if (!this.isrunning)
                    return;
                Promise.resolve(AntShares.Core.Blockchain.Default == null ? 0 : AntShares.Core.Blockchain.Default.getBlockCount()).then(function (result) {
                    var block_height = result;
                    if (_this.current_height >= block_height)
                        return AntShares.Core.Blockchain.SecondsPerBlock;
                    return AntShares.Core.Blockchain.Default.getBlock(_this.current_height).then(function (result) {
                        if (result == null)
                            return 0;
                        return _this.processNewBlock(result).then(function () {
                            return _this.current_height < block_height ? 0 : AntShares.Core.Blockchain.SecondsPerBlock;
                        });
                    });
                }).then(function (result) {
                    if (_this.isrunning)
                        setTimeout(_this.processBlocks.bind(_this), result * 1000);
                });
            };
            Wallet.prototype.processNewBlock = function (block) {
                var _this = this;
                var promises = new Array();
                promises.push(block.ensureHash());
                for (var i = 0; i < block.transactions.length; i++)
                    promises.push(block.transactions[i].ensureHash());
                return Promise.all(promises).then(function () {
                    var map = new Map();
                    for (var i = 0; i < block.transactions.length; i++) {
                        var tx = block.transactions[i];
                        for (var index = 0; index < tx.outputs.length; index++) {
                            var output = tx.outputs[index];
                            if (_this.contracts.has(output.scriptHash.toString())) {
                                var input = new AntShares.Core.TransactionInput();
                                input.prevHash = tx.hash;
                                input.prevIndex = index;
                                if (_this.coins.has(input.toString())) {
                                    _this.coins.get(input.toString()).state = Wallets.CoinState.Unspent;
                                }
                                else {
                                    var coin = new Wallets.Coin();
                                    coin.input = input;
                                    coin.assetId = output.assetId;
                                    coin.value = output.value;
                                    coin.scriptHash = output.scriptHash;
                                    coin.state = Wallets.CoinState.Unspent;
                                    _this.coins.add(coin);
                                }
                                map.set(tx.hash.toString(), tx);
                            }
                        }
                    }
                    for (var i = 0; i < block.transactions.length; i++) {
                        var tx = block.transactions[i];
                        var inputs = tx.getAllInputs();
                        for (var j = 0; j < inputs.length; j++) {
                            var inputKey = inputs[j].toString();
                            if (_this.coins.has(inputKey)) {
                                if (_this.coins.get(inputKey).assetId.equals(AntShares.Core.Blockchain.AntShare.hash))
                                    _this.coins.get(inputKey).state = Wallets.CoinState.Spent;
                                else
                                    _this.coins.remove(inputKey);
                                map.set(tx.hash.toString(), tx);
                            }
                        }
                    }
                    for (var i = 0; i < block.transactions.length; i++) {
                        if (block.transactions[i].type != AntShares.Core.TransactionType.ClaimTransaction)
                            continue;
                        var tx = block.transactions[i];
                        for (var j = 0; j < tx.claims.length; j++) {
                            var claimKey = tx.claims[j].toString();
                            if (_this.coins.has(claimKey)) {
                                _this.coins.remove(claimKey);
                                map.set(tx.hash.toString(), tx);
                            }
                        }
                    }
                    _this.current_height++;
                    var changeset = _this.coins.getChangeSet();
                    if (changeset.length == 0)
                        return;
                    var transactions = new Array();
                    map.forEach(function (tx) { return transactions.push(tx); });
                    var added = new Array(), changed = new Array(), deleted = new Array();
                    for (var i = 0; i < changeset.length; i++) {
                        if (changeset[i].trackState == AntShares.IO.Caching.TrackState.Added)
                            added.push(changeset[i]);
                        else if (changeset[i].trackState == AntShares.IO.Caching.TrackState.Changed)
                            changed.push(changeset[i]);
                        else if (changeset[i].trackState == AntShares.IO.Caching.TrackState.Deleted)
                            deleted.push(changeset[i]);
                    }
                    return _this.onProcessNewBlock(block, transactions, added, changed, deleted).then(function () {
                        _this.coins.commit();
                        _this.balanceChanged.dispatchEvent(null);
                    });
                });
            };
            Wallet.prototype.rebuild = function () {
                this.coins.clear();
                this.coins.commit();
                this.current_height = 0;
                return Promise.resolve(null);
            };
            Wallet.prototype.sendTransaction = function (tx) {
                var _this = this;
                var inputs = tx.getAllInputs();
                for (var i = 0; i < inputs.length; i++) {
                    var key = inputs[i].toString();
                    if (!this.coins.has(key) || this.coins.get(key).state != Wallets.CoinState.Unspent)
                        return Promise.resolve(false);
                }
                return tx.ensureHash().then(function () {
                    for (var i = 0; i < inputs.length; i++)
                        _this.coins.get(inputs[i].toString()).state = Wallets.CoinState.Spending;
                    for (var i = 0; i < tx.outputs.length; i++) {
                        if (_this.contracts.has(tx.outputs[i].scriptHash.toString())) {
                            var coin = new Wallets.Coin();
                            coin.input = new AntShares.Core.TransactionInput();
                            coin.input.prevHash = tx.hash;
                            coin.input.prevIndex = i;
                            coin.assetId = tx.outputs[i].assetId;
                            coin.value = tx.outputs[i].value;
                            coin.scriptHash = tx.outputs[i].scriptHash;
                            coin.state = Wallets.CoinState.Unconfirmed;
                            _this.coins.add(coin);
                        }
                    }
                    var changeset = _this.coins.getChangeSet();
                    if (changeset.length == 0)
                        return true;
                    var added = new Array(), changed = new Array();
                    for (var i = 0; i < changeset.length; i++) {
                        if (changeset[i].trackState == AntShares.IO.Caching.TrackState.Added)
                            added.push(changeset[i]);
                        else if (changeset[i].trackState == AntShares.IO.Caching.TrackState.Changed)
                            changed.push(changeset[i]);
                    }
                    return _this.onSendTransaction(tx, added, changed).then(function () {
                        _this.coins.commit();
                        _this.balanceChanged.dispatchEvent(null);
                        return true;
                    });
                });
            };
            Wallet.prototype.sign = function (context) {
                var promises = new Array();
                var _loop_1 = function(i) {
                    var contract = this_1.getContract(context.scriptHashes[i]);
                    if (contract == null)
                        return "continue";
                    var account = this_1.getAccountByScriptHash(context.scriptHashes[i]);
                    if (account == null)
                        return "continue";
                    promises.push(this_1.signInternal(context.signable, account).then(function (result) {
                        return { contract: contract, account: account, signature: result };
                    }));
                };
                var this_1 = this;
                for (var i = 0; i < context.scriptHashes.length; i++) {
                    var state_1 = _loop_1(i);
                    if (state_1 === "continue") continue;
                }
                return Promise.all(promises).then(function (results) {
                    var fSuccess = false;
                    for (var i = 0; i < results.length; i++) {
                        fSuccess = fSuccess || context.add(results[i].contract, results[i].account.publicKey, results[i].signature);
                    }
                    return fSuccess;
                });
            };
            Wallet.prototype.signInternal = function (signable, account) {
                var pubkey = account.publicKey.encodePoint(false);
                var d = new Uint8Array(account.privateKey).base64UrlEncode();
                var x = pubkey.subarray(1, 33).base64UrlEncode();
                var y = pubkey.subarray(33, 65).base64UrlEncode();
                var ms = new AntShares.IO.MemoryStream();
                var writer = new AntShares.IO.BinaryWriter(ms);
                signable.serializeUnsigned(writer);
                return Promise.all([
                    window.crypto.subtle.importKey("jwk", { kty: "EC", crv: "P-256", d: d, x: x, y: y, ext: true }, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]),
                    window.crypto.subtle.digest("SHA-256", ms.toArray())
                ]).then(function (results) {
                    return window.crypto.subtle.sign({ name: "ECDSA", hash: { name: "SHA-256" } }, results[0], results[1]);
                });
            };
            Wallet.SignMessage = function (message, account)
            {
                var pubkey = account.publicKey.encodePoint(false);
                var d = new Uint8Array(account.privateKey).base64UrlEncode();
                var x = pubkey.subarray(1, 33).base64UrlEncode();
                var y = pubkey.subarray(33, 65).base64UrlEncode();
                return window.crypto.subtle.importKey("jwk", { kty: "EC", crv: "P-256", d: d, x: x, y: y, ext: true }, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]).then(function (result)
                {
                    var codes = new Uint8Array(message.length);
                    for (var i = 0; i < codes.length; i++)
                        codes[i] = message.charCodeAt(i);
                    return window.crypto.subtle.sign({ name: "ECDSA", hash: { name: "SHA-256" } }, result, codes);
                });
            };
            Wallet.toAddress = function (scriptHash) {
                var data = new Uint8Array(25);
                data[0] = Wallet.CoinVersion;
                Array.copy(new Uint8Array(scriptHash.bits.buffer), 0, data, 1, 20);
                return window.crypto.subtle.digest("SHA-256", new Uint8Array(data.buffer, 0, 21)).then(function (result) {
                    return window.crypto.subtle.digest("SHA-256", result);
                }).then(function (result) {
                    Array.copy(new Uint8Array(result), 0, data, 21, 4);
                    return data.base58Encode();
                });
            };
            Wallet.toScriptHash = function (address) {
                var data = address.base58Decode();
                if (data.length != 25)
                    throw new RangeError();
                if (data[0] != Wallet.CoinVersion)
                    throw new RangeError();
                return window.crypto.subtle.digest("SHA-256", new Uint8Array(data.buffer, 0, data.length - 4)).then(function (result) {
                    return window.crypto.subtle.digest("SHA-256", result);
                }).then(function (result) {
                    var array = new Uint8Array(result);
                    for (var i = 0; i < 4; i++)
                        if (array[i] != data[data.length - 4 + i])
                            throw new RangeError();
                    array = new Uint8Array(20);
                    Array.copy(data, 1, array, 0, 20);
                    return new AntShares.Uint160(array.buffer);
                });
            };
            return Wallet;
        }());
        Wallets.Wallet = Wallet;
    })(Wallets = AntShares.Wallets || (AntShares.Wallets = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Network;
    (function (Network) {
        var Inventory = (function () {
            function Inventory() {
            }
            Inventory.prototype.ensureHash = function () {
                var _this = this;
                if (this.hash != null)
                    return Promise.resolve(this.hash);
                return window.crypto.subtle.digest("SHA-256", this.getHashData()).then(function (result) {
                    return window.crypto.subtle.digest("SHA-256", result);
                }).then(function (result) {
                    return _this.hash = new AntShares.Uint256(result);
                });
            };
            Inventory.prototype.getHashData = function () {
                var ms = new AntShares.IO.MemoryStream();
                var w = new AntShares.IO.BinaryWriter(ms);
                this.serializeUnsigned(w);
                return ms.toArray();
            };
            return Inventory;
        }());
        Network.Inventory = Inventory;
    })(Network = AntShares.Network || (AntShares.Network = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Network;
    (function (Network) {
        var RPC;
        (function (RPC) {
            var RpcClient = (function () {
                function RpcClient(url) {
                    if (url === void 0) { url = "http://localhost/"; }
                    this.url = url;
                }
                RpcClient.makeRequest = function (method, params) {
                    return { jsonrpc: "2.0", method: method, params: params, id: Math.random() };
                };
                RpcClient.send = function (url, request) {
                    return new Promise(function (resolve, reject) {
                        var xhr = new XMLHttpRequest();
                        xhr.addEventListener("load", function () { resolve(JSON.parse(xhr.responseText)); });
                        xhr.open("POST", url, true);
                        xhr.setRequestHeader('Content-Type', 'application/json-rpc');
                        xhr.send(JSON.stringify(request));
                    });
                };
                RpcClient.prototype.call = function (method, params) {
                    return RpcClient.send(this.url, RpcClient.makeRequest(method, params)).then(function (response) {
                        return new Promise(function (resolve, reject) {
                            if (response.error !== undefined)
                                reject(response.error);
                            else
                                resolve(response.result);
                        });
                    });
                };
                RpcClient.prototype.callBatch = function (batch) {
                    var request = [];
                    for (var i = 0; i < batch.length; i++)
                        request.push(RpcClient.makeRequest(batch[i].method, batch[i].params));
                    return RpcClient.send(this.url, request).then(function (response) {
                        return new Promise(function (resolve, reject) {
                            if (response.error !== undefined)
                                reject(response.error);
                            else {
                                var results = [];
                                for (var i = 0; i < response.length; i++)
                                    results.push(response[i].result);
                                resolve(results);
                            }
                        });
                    });
                };
                return RpcClient;
            }());
            RPC.RpcClient = RpcClient;
        })(RPC = Network.RPC || (Network.RPC = {}));
    })(Network = AntShares.Network || (AntShares.Network = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var IO;
    (function (IO) {
        var BinaryReader = (function () {
            function BinaryReader(input) {
                this.input = input;
                this._buffer = new ArrayBuffer(8);
            }
            BinaryReader.prototype.close = function () {
            };
            BinaryReader.prototype.fillBuffer = function (buffer, count) {
                var i = 0;
                while (count > 0) {
                    var actual_count = this.input.read(buffer, 0, count);
                    if (actual_count == 0)
                        throw new Error("EOF");
                    i += actual_count;
                    count -= actual_count;
                }
            };
            BinaryReader.prototype.read = function (buffer, index, count) {
                return this.input.read(buffer, index, count);
            };
            BinaryReader.prototype.readBoolean = function () {
                return this.readByte() != 0;
            };
            BinaryReader.prototype.readByte = function () {
                this.fillBuffer(this._buffer, 1);
                if (this.array_uint8 == null)
                    this.array_uint8 = new Uint8Array(this._buffer, 0, 1);
                return this.array_uint8[0];
            };
            BinaryReader.prototype.readBytes = function (count) {
                var buffer = new ArrayBuffer(count);
                this.fillBuffer(buffer, count);
                return buffer;
            };
            BinaryReader.prototype.readDouble = function () {
                this.fillBuffer(this._buffer, 8);
                if (this.array_float64 == null)
                    this.array_float64 = new Float64Array(this._buffer, 0, 1);
                return this.array_float64[0];
            };
            BinaryReader.prototype.readFixed8 = function () {
                return new AntShares.Fixed8(this.readUint64());
            };
            BinaryReader.prototype.readInt16 = function () {
                this.fillBuffer(this._buffer, 2);
                if (this.array_int16 == null)
                    this.array_int16 = new Int16Array(this._buffer, 0, 1);
                return this.array_int16[0];
            };
            BinaryReader.prototype.readInt32 = function () {
                this.fillBuffer(this._buffer, 4);
                if (this.array_int32 == null)
                    this.array_int32 = new Int32Array(this._buffer, 0, 1);
                return this.array_int32[0];
            };
            BinaryReader.prototype.readSByte = function () {
                this.fillBuffer(this._buffer, 1);
                if (this.array_int8 == null)
                    this.array_int8 = new Int8Array(this._buffer, 0, 1);
                return this.array_int8[0];
            };
            BinaryReader.prototype.readSerializable = function (T) {
                var obj = new T();
                obj.deserialize(this);
                return obj;
            };
            BinaryReader.prototype.readSerializableArray = function (T) {
                var array = new Array(this.readVarInt(0x10000000));
                for (var i = 0; i < array.length; i++)
                    array[i] = this.readSerializable(T);
                return array;
            };
            BinaryReader.prototype.readSingle = function () {
                this.fillBuffer(this._buffer, 4);
                if (this.array_float32 == null)
                    this.array_float32 = new Float32Array(this._buffer, 0, 1);
                return this.array_float32[0];
            };
            BinaryReader.prototype.readUint16 = function () {
                this.fillBuffer(this._buffer, 2);
                if (this.array_uint16 == null)
                    this.array_uint16 = new Uint16Array(this._buffer, 0, 1);
                return this.array_uint16[0];
            };
            BinaryReader.prototype.readUint160 = function () {
                return new AntShares.Uint160(this.readBytes(20));
            };
            BinaryReader.prototype.readUint256 = function () {
                return new AntShares.Uint256(this.readBytes(32));
            };
            BinaryReader.prototype.readUint32 = function () {
                this.fillBuffer(this._buffer, 4);
                if (this.array_uint32 == null)
                    this.array_uint32 = new Uint32Array(this._buffer, 0, 2);
                return this.array_uint32[0];
            };
            BinaryReader.prototype.readUint64 = function () {
                this.fillBuffer(this._buffer, 8);
                if (this.array_uint32 == null)
                    this.array_uint32 = new Uint32Array(this._buffer, 0, 2);
                return new AntShares.Uint64(this.array_uint32[0], this.array_uint32[1]);
            };
            BinaryReader.prototype.readVarBytes = function (max) {
                if (max === void 0) { max = 0X7fffffc7; }
                return this.readBytes(this.readVarInt(max));
            };
            BinaryReader.prototype.readVarInt = function (max) {
                if (max === void 0) { max = 9007199254740991; }
                var fb = this.readByte();
                var value;
                if (fb == 0xfd)
                    value = this.readUint16();
                else if (fb == 0xfe)
                    value = this.readUint32();
                else if (fb == 0xff)
                    value = this.readUint64().toNumber();
                else
                    value = fb;
                if (value > max)
                    throw new RangeError();
                return value;
            };
            BinaryReader.prototype.readVarString = function () {
                return decodeURIComponent(escape(String.fromCharCode.apply(null, new Uint8Array(this.readVarBytes()))));
            };
            return BinaryReader;
        }());
        IO.BinaryReader = BinaryReader;
    })(IO = AntShares.IO || (AntShares.IO = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var IO;
    (function (IO) {
        var BinaryWriter = (function () {
            function BinaryWriter(output) {
                this.output = output;
                this._buffer = new ArrayBuffer(8);
            }
            BinaryWriter.prototype.close = function () {
            };
            BinaryWriter.prototype.seek = function (offset, origin) {
                return this.output.seek(offset, origin);
            };
            BinaryWriter.prototype.write = function (buffer, index, count) {
                if (index === void 0) { index = 0; }
                if (count === void 0) { count = buffer.byteLength - index; }
                this.output.write(buffer, index, count);
            };
            BinaryWriter.prototype.writeBoolean = function (value) {
                this.writeByte(value ? 0xff : 0);
            };
            BinaryWriter.prototype.writeByte = function (value) {
                if (this.array_uint8 == null)
                    this.array_uint8 = new Uint8Array(this._buffer, 0, 1);
                this.array_uint8[0] = value;
                this.output.write(this._buffer, 0, 1);
            };
            BinaryWriter.prototype.writeDouble = function (value) {
                if (this.array_float64 == null)
                    this.array_float64 = new Float64Array(this._buffer, 0, 1);
                this.array_float64[0] = value;
                this.output.write(this._buffer, 0, 8);
            };
            BinaryWriter.prototype.writeFixed8 = function (value) {
                this.writeUintVariable(value.getData());
            };
            BinaryWriter.prototype.writeInt16 = function (value) {
                if (this.array_int16 == null)
                    this.array_int16 = new Int16Array(this._buffer, 0, 1);
                this.array_int16[0] = value;
                this.output.write(this._buffer, 0, 2);
            };
            BinaryWriter.prototype.writeInt32 = function (value) {
                if (this.array_int32 == null)
                    this.array_int32 = new Int32Array(this._buffer, 0, 1);
                this.array_int32[0] = value;
                this.output.write(this._buffer, 0, 4);
            };
            BinaryWriter.prototype.writeSByte = function (value) {
                if (this.array_int8 == null)
                    this.array_int8 = new Int8Array(this._buffer, 0, 1);
                this.array_int8[0] = value;
                this.output.write(this._buffer, 0, 1);
            };
            BinaryWriter.prototype.writeSerializableArray = function (array) {
                this.writeVarInt(array.length);
                for (var i = 0; i < array.length; i++)
                    array[i].serialize(this);
            };
            BinaryWriter.prototype.writeSingle = function (value) {
                if (this.array_float32 == null)
                    this.array_float32 = new Float32Array(this._buffer, 0, 1);
                this.array_float32[0] = value;
                this.output.write(this._buffer, 0, 4);
            };
            BinaryWriter.prototype.writeUint16 = function (value) {
                if (this.array_uint16 == null)
                    this.array_uint16 = new Uint16Array(this._buffer, 0, 1);
                this.array_uint16[0] = value;
                this.output.write(this._buffer, 0, 2);
            };
            BinaryWriter.prototype.writeUint32 = function (value) {
                if (this.array_uint32 == null)
                    this.array_uint32 = new Uint32Array(this._buffer, 0, 1);
                this.array_uint32[0] = value;
                this.output.write(this._buffer, 0, 4);
            };
            BinaryWriter.prototype.writeUintVariable = function (value) {
                this.write(value.bits.buffer);
            };
            BinaryWriter.prototype.writeVarBytes = function (value) {
                this.writeVarInt(value.byteLength);
                this.output.write(value, 0, value.byteLength);
            };
            BinaryWriter.prototype.writeVarInt = function (value) {
                if (value < 0)
                    throw new RangeError();
                if (value < 0xfd) {
                    this.writeByte(value);
                }
                else if (value <= 0xffff) {
                    this.writeByte(0xfd);
                    this.writeUint16(value);
                }
                else if (value <= 0xFFFFFFFF) {
                    this.writeByte(0xfe);
                    this.writeUint32(value);
                }
                else {
                    this.writeByte(0xff);
                    this.writeUint32(value);
                    this.writeUint32(value / Math.pow(2, 32));
                }
            };
            BinaryWriter.prototype.writeVarString = function (value) {
                value = unescape(encodeURIComponent(value));
                var codes = new Uint8Array(value.length);
                for (var i = 0; i < codes.length; i++)
                    codes[i] = value.charCodeAt(i);
                this.writeVarBytes(codes.buffer);
            };
            return BinaryWriter;
        }());
        IO.BinaryWriter = BinaryWriter;
    })(IO = AntShares.IO || (AntShares.IO = {}));
})(AntShares || (AntShares = {}));
Uint8Array.prototype.asSerializable = function (T) {
    var ms = new AntShares.IO.MemoryStream(this.buffer, false);
    var reader = new AntShares.IO.BinaryReader(ms);
    return reader.readSerializable(T);
};
Uint8Array.fromSerializable = function (obj) {
    var ms = new AntShares.IO.MemoryStream();
    var writer = new AntShares.IO.BinaryWriter(ms);
    obj.serialize(writer);
    return new Uint8Array(ms.toArray());
};
var AntShares;
(function (AntShares) {
    var IO;
    (function (IO) {
        (function (SeekOrigin) {
            SeekOrigin[SeekOrigin["Begin"] = 0] = "Begin";
            SeekOrigin[SeekOrigin["Current"] = 1] = "Current";
            SeekOrigin[SeekOrigin["End"] = 2] = "End";
        })(IO.SeekOrigin || (IO.SeekOrigin = {}));
        var SeekOrigin = IO.SeekOrigin;
        var Stream = (function () {
            function Stream() {
                this._array = new Uint8Array(1);
            }
            Stream.prototype.close = function () { };
            Stream.prototype.readByte = function () {
                if (this.read(this._array.buffer, 0, 1) == 0)
                    return -1;
                return this._array[0];
            };
            Stream.prototype.writeByte = function (value) {
                if (value < 0 || value > 255)
                    throw new RangeError();
                this._array[0] = value;
                this.write(this._array.buffer, 0, 1);
            };
            return Stream;
        }());
        IO.Stream = Stream;
    })(IO = AntShares.IO || (AntShares.IO = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var IO;
    (function (IO) {
        var BufferSize = 1024;
        var MemoryStream = (function (_super) {
            __extends(MemoryStream, _super);
            function MemoryStream() {
                _super.call(this);
                this._buffers = new Array();
                this._origin = 0;
                this._position = 0;
                if (arguments.length == 0) {
                    this._length = 0;
                    this._capacity = 0;
                    this._expandable = true;
                    this._writable = true;
                }
                else if (arguments.length == 1 && typeof arguments[0] === "number") {
                    this._length = 0;
                    this._capacity = arguments[0];
                    this._expandable = true;
                    this._writable = true;
                    this._buffers.push(new ArrayBuffer(this._capacity));
                }
                else {
                    var buffer = arguments[0];
                    this._buffers.push(buffer);
                    this._expandable = false;
                    if (arguments.length == 1) {
                        this._writable = false;
                        this._length = buffer.byteLength;
                    }
                    else if (typeof arguments[1] === "boolean") {
                        this._writable = arguments[1];
                        this._length = buffer.byteLength;
                    }
                    else {
                        this._origin = arguments[1];
                        this._length = arguments[2];
                        this._writable = arguments.length == 4 ? arguments[3] : false;
                        if (this._origin < 0 || this._origin + this._length > buffer.byteLength)
                            throw new RangeError();
                    }
                    this._capacity = this._length;
                }
            }
            MemoryStream.prototype.canRead = function () {
                return true;
            };
            MemoryStream.prototype.canSeek = function () {
                return true;
            };
            MemoryStream.prototype.canWrite = function () {
                return this._writable;
            };
            MemoryStream.prototype.capacity = function () {
                return this._capacity;
            };
            MemoryStream.prototype.findBuffer = function (position) {
                var iBuff, pBuff;
                var firstSize = this._buffers[0] == null ? BufferSize : this._buffers[0].byteLength;
                if (position < firstSize) {
                    iBuff = 0;
                    pBuff = position;
                }
                else {
                    iBuff = Math.floor((position - firstSize) / BufferSize) + 1;
                    pBuff = (position - firstSize) % BufferSize;
                }
                return { iBuff: iBuff, pBuff: pBuff };
            };
            MemoryStream.prototype.length = function () {
                return this._length;
            };
            MemoryStream.prototype.position = function () {
                return this._position;
            };
            MemoryStream.prototype.read = function (buffer, offset, count) {
                if (this._position + count > this._length)
                    count = this._length - this._position;
                this.readInternal(new Uint8Array(buffer, offset, count), this._position);
                this._position += count;
                return count;
            };
            MemoryStream.prototype.readInternal = function (dst, srcPos) {
                if (this._expandable) {
                    var i = 0, count = dst.length;
                    var d = this.findBuffer(srcPos);
                    while (count > 0) {
                        var actual_count = void 0;
                        if (this._buffers[d.iBuff] == null) {
                            actual_count = Math.min(count, BufferSize - d.pBuff);
                            dst.fill(0, i, i + actual_count);
                        }
                        else {
                            actual_count = Math.min(count, this._buffers[d.iBuff].byteLength - d.pBuff);
                            var src = new Uint8Array(this._buffers[d.iBuff]);
                            Array.copy(src, d.pBuff, dst, i, actual_count);
                        }
                        i += actual_count;
                        count -= actual_count;
                        d.iBuff++;
                        d.pBuff = 0;
                    }
                }
                else {
                    var src = new Uint8Array(this._buffers[0], this._origin, this._length);
                    Array.copy(src, srcPos, dst, 0, dst.length);
                }
            };
            MemoryStream.prototype.seek = function (offset, origin) {
                switch (origin) {
                    case IO.SeekOrigin.Begin:
                        break;
                    case IO.SeekOrigin.Current:
                        offset += this._position;
                        break;
                    case IO.SeekOrigin.End:
                        offset += this._length;
                        break;
                    default:
                        throw new RangeError();
                }
                if (offset < 0 || offset > this._length)
                    throw new RangeError();
                this._position = offset;
                return offset;
            };
            MemoryStream.prototype.setLength = function (value) {
                if (value < 0 || (value != this._length && !this._writable) || (value > this._capacity && !this._expandable))
                    throw new RangeError();
                this._length = value;
                if (this._position > this._length)
                    this._position = this._length;
                if (this._capacity < this._length)
                    this._capacity = this._length;
            };
            MemoryStream.prototype.toArray = function () {
                if (this._buffers.length == 1 && this._origin == 0 && this._length == this._buffers[0].byteLength)
                    return this._buffers[0];
                var bw = new Uint8Array(this._length);
                this.readInternal(bw, 0);
                return bw.buffer;
            };
            MemoryStream.prototype.write = function (buffer, offset, count) {
                if (!this._writable || (!this._expandable && this._capacity - this._position < count))
                    throw new Error();
                if (this._expandable) {
                    var src = new Uint8Array(buffer);
                    var d = this.findBuffer(this._position);
                    while (count > 0) {
                        if (this._buffers[d.iBuff] == null)
                            this._buffers[d.iBuff] = new ArrayBuffer(BufferSize);
                        var actual_count = Math.min(count, this._buffers[d.iBuff].byteLength - d.pBuff);
                        var dst = new Uint8Array(this._buffers[d.iBuff]);
                        Array.copy(src, offset, dst, d.pBuff, actual_count);
                        this._position += actual_count;
                        offset += actual_count;
                        count -= actual_count;
                        d.iBuff++;
                        d.pBuff = 0;
                    }
                }
                else {
                    var src = new Uint8Array(buffer, offset, count);
                    var dst = new Uint8Array(this._buffers[0], this._origin, this._capacity);
                    Array.copy(src, 0, dst, this._position, count);
                    this._position += count;
                }
                if (this._length < this._position)
                    this._length = this._position;
                if (this._capacity < this._length)
                    this._capacity = this._length;
            };
            return MemoryStream;
        }(IO.Stream));
        IO.MemoryStream = MemoryStream;
    })(IO = AntShares.IO || (AntShares.IO = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var IO;
    (function (IO) {
        var Caching;
        (function (Caching) {
            var TrackableCollection = (function () {
                function TrackableCollection(items) {
                    this._map = new Map();
                    if (items != null) {
                        for (var i = 0; i < items.length; i++) {
                            this._map.set(items[i].key, items[i]);
                            items[i].trackState = Caching.TrackState.None;
                        }
                    }
                }
                TrackableCollection.prototype.add = function (item) {
                    this._map.set(item.key, item);
                    item.trackState = Caching.TrackState.Added;
                };
                TrackableCollection.prototype.clear = function () {
                    this._map.forEach(function (value, key, map) {
                        if (value.trackState == Caching.TrackState.Added)
                            map.delete(key);
                        else
                            value.trackState = Caching.TrackState.Deleted;
                    });
                };
                TrackableCollection.prototype.commit = function () {
                    this._map.forEach(function (value, key, map) {
                        if (value.trackState == Caching.TrackState.Deleted)
                            map.delete(key);
                        else
                            value.trackState = Caching.TrackState.None;
                    });
                };
                TrackableCollection.prototype.forEach = function (callback) {
                    var _this = this;
                    this._map.forEach(function (value, key) {
                        callback(value, key, _this);
                    });
                };
                TrackableCollection.prototype.get = function (key) {
                    return this._map.get(key);
                };
                TrackableCollection.prototype.getChangeSet = function () {
                    var array = new Array();
                    this._map.forEach(function (value) {
                        if (value.trackState != Caching.TrackState.None)
                            array.push(value);
                    });
                    return array;
                };
                TrackableCollection.prototype.has = function (key) {
                    return this._map.has(key);
                };
                TrackableCollection.prototype.remove = function (key) {
                    var item = this._map.get(key);
                    if (item.trackState == Caching.TrackState.Added)
                        this._map.delete(key);
                    else
                        item.trackState = Caching.TrackState.Deleted;
                };
                return TrackableCollection;
            }());
            Caching.TrackableCollection = TrackableCollection;
        })(Caching = IO.Caching || (IO.Caching = {}));
    })(IO = AntShares.IO || (AntShares.IO = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var IO;
    (function (IO) {
        var Caching;
        (function (Caching) {
            (function (TrackState) {
                TrackState[TrackState["None"] = 0] = "None";
                TrackState[TrackState["Added"] = 1] = "Added";
                TrackState[TrackState["Changed"] = 2] = "Changed";
                TrackState[TrackState["Deleted"] = 3] = "Deleted";
            })(Caching.TrackState || (Caching.TrackState = {}));
            var TrackState = Caching.TrackState;
        })(Caching = IO.Caching || (IO.Caching = {}));
    })(IO = AntShares.IO || (AntShares.IO = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Implementations;
    (function (Implementations) {
        var Wallets;
        (function (Wallets) {
            var IndexedDB;
            (function (IndexedDB) {
                var DbContext = (function () {
                    function DbContext(name) {
                        this.name = name;
                    }
                    DbContext.prototype.onModelCreating = function (db) { };
                    DbContext.prototype.open = function () {
                        var _this = this;
                        if (this.db != null)
                            return Promise.resolve();
                        var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
                        var request = indexedDB.open(this.name, 1);
                        return new Promise(function (resolve, reject) {
                            request.onsuccess = function () {
                                _this.db = request.result;
                                resolve();
                            };
                            request.onupgradeneeded = function () {
                                _this.onModelCreating(request.result);
                            };
                            request.onerror = function () {
                                reject(request.error);
                            };
                        });
                    };
                    DbContext.prototype.transaction = function (storeNames, mode) {
                        if (mode === void 0) { mode = "readonly"; }
                        return new IndexedDB.DbTransaction(this.db.transaction(storeNames, mode));
                    };
                    return DbContext;
                }());
                IndexedDB.DbContext = DbContext;
            })(IndexedDB = Wallets.IndexedDB || (Wallets.IndexedDB = {}));
        })(Wallets = Implementations.Wallets || (Implementations.Wallets = {}));
    })(Implementations = AntShares.Implementations || (AntShares.Implementations = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Implementations;
    (function (Implementations) {
        var Wallets;
        (function (Wallets) {
            var IndexedDB;
            (function (IndexedDB) {
                var DbTransaction = (function () {
                    function DbTransaction(transaction) {
                        this.transaction = transaction;
                    }
                    DbTransaction.prototype.commit = function () {
                        var _this = this;
                        return new Promise(function (resolve, reject) {
                            _this.transaction.oncomplete = function () { return resolve(); };
                            _this.transaction.onerror = function () { return reject(_this.transaction.error); };
                        });
                    };
                    DbTransaction.prototype.store = function (name) {
                        return this.transaction.objectStore(name);
                    };
                    return DbTransaction;
                }());
                IndexedDB.DbTransaction = DbTransaction;
            })(IndexedDB = Wallets.IndexedDB || (Wallets.IndexedDB = {}));
        })(Wallets = Implementations.Wallets || (Implementations.Wallets = {}));
    })(Implementations = AntShares.Implementations || (AntShares.Implementations = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Implementations;
    (function (Implementations) {
        var Wallets;
        (function (Wallets) {
            var IndexedDB;
            (function (IndexedDB) {
                var IndexedDBWallet = (function (_super) {
                    __extends(IndexedDBWallet, _super);
                    function IndexedDBWallet(name) {
                        _super.call(this);
                        this.db = new IndexedDB.WalletDataContext(name);
                    }
                    IndexedDBWallet.prototype.addContract = function (contract) {
                        var _this = this;
                        return _super.prototype.addContract.call(this, contract).then(function () {
                            return IndexedDBWallet.requestToPromise(_this.db.transaction("Contract", "readwrite").store("Contract").put({
                                redeemScript: new Uint8Array(contract.redeemScript).toHexString(),
                                parameterList: contract.parameterList,
                                publicKeyHash: contract.publicKeyHash.toString(),
                                scriptHash: contract.scriptHash.toString()
                            }));
                        });
                    };
                    IndexedDBWallet.create = function (name, password) {
                        var wallet = new IndexedDBWallet(name);
                        return wallet.init(name, password, true).then(function () {
                            return wallet.createAccount();
                        }).then(function () {
                            return wallet;
                        });
                    };
                    IndexedDBWallet.prototype.createAccount = function (privateKey) {
                        var _this = this;
                        var account;
                        return _super.prototype.createAccount.call(this, privateKey).then(function (result) {
                            account = result;
                            return _this.onCreateAccount(account);
                        }).then(function () {
                            return AntShares.Wallets.Contract.createSignatureContract(account.publicKey);
                        }).then(function (result) {
                            return _this.addContract(result);
                        }).then(function () {
                            return account;
                        });
                    };
                    IndexedDBWallet.prototype.deleteAccount = function (publicKeyHash) {
                        var _this = this;
                        var transaction = this.db.transaction(["Account", "Contract", "Coin"], "readwrite");
                        transaction.store("Contract").index("publicKeyHash").openCursor(IDBKeyRange.only(publicKeyHash.toString())).onsuccess = function (e) {
                            var cursor = e.target.result;
                            transaction.store("Coin").index("scriptHash").openCursor(IDBKeyRange.only(cursor.value.scriptHash)).onsuccess = function (e) {
                                var cursor = e.target.result;
                                cursor.delete();
                                cursor.continue();
                            };
                            cursor.delete();
                            cursor.continue();
                        };
                        transaction.store("Account").delete(publicKeyHash.toString());
                        return transaction.commit().then(function () {
                            return _super.prototype.deleteAccount.call(_this, publicKeyHash);
                        });
                    };
                    IndexedDBWallet.prototype.deleteContract = function (scriptHash) {
                        var _this = this;
                        return _super.prototype.deleteContract.call(this, scriptHash).then(function (result) {
                            if (!result)
                                return false;
                            var transaction = _this.db.transaction(["Contract", "Coin"], "readwrite");
                            transaction.store("Coin").index("scriptHash").openCursor(IDBKeyRange.only(scriptHash.toString())).onsuccess = function (e) {
                                var cursor = e.target.result;
                                cursor.delete();
                                cursor.continue();
                            };
                            transaction.store("Contract").delete(scriptHash.toString());
                            return transaction.commit().then(function () { return true; });
                        });
                    };
                    IndexedDBWallet.prototype.loadAccounts = function () {
                        var _this = this;
                        var promises = new Array();
                        var transaction = this.db.transaction("Account", "readonly");
                        transaction.store("Account").openCursor().onsuccess = function (e) {
                            var cursor = e.target.result;
                            promises.push(_this.decryptPrivateKey(cursor.value.privateKeyEncrypted.hexToBytes()).then(function (result) {
                                return AntShares.Wallets.Account.create(result);
                            }));
                            cursor.continue();
                        };
                        return transaction.commit().then(function () {
                            return Promise.all(promises);
                        });
                    };
                    IndexedDBWallet.prototype.loadCoins = function () {
                        var array = new Array();
                        var transaction = this.db.transaction("Coin", "readonly");
                        transaction.store("Coin").openCursor().onsuccess = function (e) {
                            var cursor = e.target.result;
                            var coin = new AntShares.Wallets.Coin();
                            coin.input = new AntShares.Core.TransactionInput();
                            coin.input.prevHash = AntShares.Uint256.parse(cursor.value.txid);
                            coin.input.prevIndex = cursor.value.index;
                            coin.assetId = AntShares.Uint256.parse(cursor.value.assetId);
                            coin.value = AntShares.Fixed8.parse(cursor.value.value);
                            coin.scriptHash = AntShares.Uint160.parse(cursor.value.scriptHash);
                            coin.state = cursor.value.state;
                            array.push(coin);
                            cursor.continue();
                        };
                        return transaction.commit().then(function () {
                            return array;
                        });
                    };
                    IndexedDBWallet.prototype.loadContracts = function () {
                        var array = new Array();
                        var transaction = this.db.transaction("Contract", "readonly");
                        transaction.store("Contract").openCursor().onsuccess = function (e) {
                            var cursor = e.target.result;
                            var contract = new AntShares.Wallets.Contract();
                            contract.redeemScript = cursor.value.redeemScript.hexToBytes().buffer;
                            contract.parameterList = cursor.value.parameterList;
                            contract.publicKeyHash = AntShares.Uint160.parse(cursor.value.publicKeyHash);
                            contract.scriptHash = AntShares.Uint160.parse(cursor.value.scriptHash);
                            array.push(contract);
                            cursor.continue();
                        };
                        return transaction.commit().then(function () {
                            return array;
                        });
                    };
                    IndexedDBWallet.prototype.loadStoredData = function (name) {
                        return IndexedDBWallet.requestToPromise(this.db.transaction("Key", "readonly").store("Key").get(name));
                    };
                    IndexedDBWallet.prototype.onCoinsChanged = function (transaction, added, changed, deleted) {
                        for (var i = 0; i < added.length; i++) {
                            transaction.store("Coin").add({
                                txid: added[i].input.prevHash.toString(),
                                index: added[i].input.prevIndex,
                                assetId: added[i].assetId.toString(),
                                value: added[i].value.toString(),
                                scriptHash: added[i].scriptHash.toString(),
                                state: AntShares.Wallets.CoinState.Unspent
                            });
                        }
                        for (var i = 0; i < changed.length; i++) {
                            transaction.store("Coin").put({
                                txid: changed[i].input.prevHash.toString(),
                                index: changed[i].input.prevIndex,
                                assetId: changed[i].assetId.toString(),
                                value: changed[i].value.toString(),
                                scriptHash: changed[i].scriptHash.toString(),
                                state: changed[i].state
                            });
                        }
                        for (var i = 0; i < deleted.length; i++) {
                            transaction.store("Coin").delete([deleted[i].input.prevHash.toString(), deleted[i].input.prevIndex]);
                        }
                    };
                    IndexedDBWallet.prototype.onCreateAccount = function (account) {
                        var _this = this;
                        var decryptedPrivateKey = new Uint8Array(96);
                        Array.copy(account.publicKey.encodePoint(false), 1, decryptedPrivateKey, 0, 64);
                        Array.copy(new Uint8Array(account.privateKey), 0, decryptedPrivateKey, 64, 32);
                        return this.encryptPrivateKey(decryptedPrivateKey).then(function (result) {
                            return IndexedDBWallet.requestToPromise(_this.db.transaction("Account", "readwrite").store("Account").put({
                                privateKeyEncrypted: result.toHexString(),
                                publicKeyHash: account.publicKeyHash.toString()
                            }));
                        });
                    };
                    IndexedDBWallet.prototype.onProcessNewBlock = function (block, transactions, added, changed, deleted) {
                        var transaction = this.db.transaction(["Coin", "Key", "Transaction"], "readwrite");
                        transaction.store("Transaction").index("height").openCursor(IDBKeyRange.only(null)).onsuccess = function (e) {
                            var cursor = e.target.result;
                            for (var i = 0; i < block.transactions.length; i++)
                                if (cursor.value.hash == block.transactions[i].hash.toString()) {
                                    cursor.value.height = block.height;
                                    cursor.update(cursor.value);
                                    break;
                                }
                            cursor.continue();
                        };
                        for (var i = 0; i < transactions.length; i++) {
                            transaction.store("Transaction").put({
                                hash: transactions[i].hash.toString(),
                                type: transactions[i].type,
                                rawData: Uint8Array.fromSerializable(transactions[i]).toHexString(),
                                height: block.height,
                                time: block.timestamp
                            });
                        }
                        this.onCoinsChanged(transaction, added, changed, deleted);
                        IndexedDBWallet.saveStoredData(transaction, "Height", new Uint32Array([this.walletHeight]).buffer);
                        return transaction.commit();
                    };
                    IndexedDBWallet.prototype.onSendTransaction = function (tx, added, changed) {
                        var transaction = this.db.transaction(["Coin", "Transaction"], "readwrite");
                        transaction.store("Transaction").add({
                            hash: tx.hash.toString(),
                            type: tx.type,
                            rawData: Uint8Array.fromSerializable(tx).toHexString(),
                            height: null,
                            time: Date.now() / 1000
                        });
                        this.onCoinsChanged(transaction, added, changed, []);
                        return transaction.commit();
                    };
                    IndexedDBWallet.open = function (name, password) {
                        var wallet = new IndexedDBWallet(name);
                        return wallet.init(name, password, false).then(function () {
                            return wallet;
                        });
                    };
                    IndexedDBWallet.prototype.rebuild = function () {
                        var _this = this;
                        return _super.prototype.rebuild.call(this).then(function () {
                            var transaction = _this.db.transaction(["Coin", "Key", "Transaction"], "readwrite");
                            IndexedDBWallet.saveStoredData(transaction, "Height", new ArrayBuffer(4));
                            transaction.store("Transaction").clear();
                            transaction.store("Coin").clear();
                            return transaction.commit();
                        });
                    };
                    IndexedDBWallet.requestToPromise = function (request) {
                        return new Promise(function (resolve, reject) {
                            request.onsuccess = function () { return resolve(request.result); };
                            request.onerror = function () { return reject(request.error); };
                        });
                    };
                    IndexedDBWallet.prototype.saveStoredData = function (name, value) {
                        var transaction = this.db.transaction("Key", "readwrite");
                        IndexedDBWallet.saveStoredData(transaction, name, value);
                        return transaction.commit();
                    };
                    IndexedDBWallet.saveStoredData = function (transaction, name, value) {
                        transaction.store("Key").put({
                            name: name,
                            value: new Uint8Array(value).toHexString()
                        });
                    };
                    return IndexedDBWallet;
                }(AntShares.Wallets.Wallet));
                IndexedDB.IndexedDBWallet = IndexedDBWallet;
            })(IndexedDB = Wallets.IndexedDB || (Wallets.IndexedDB = {}));
        })(Wallets = Implementations.Wallets || (Implementations.Wallets = {}));
    })(Implementations = AntShares.Implementations || (AntShares.Implementations = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Implementations;
    (function (Implementations) {
        var Wallets;
        (function (Wallets) {
            var IndexedDB;
            (function (IndexedDB) {
                var WalletDataContext = (function (_super) {
                    __extends(WalletDataContext, _super);
                    function WalletDataContext() {
                        _super.apply(this, arguments);
                    }
                    WalletDataContext.prototype.onModelCreating = function (db) {
                        var objectStore = db.createObjectStore("Account", { keyPath: "publicKeyHash" });
                        objectStore = db.createObjectStore("Contract", { keyPath: "scriptHash" });
                        objectStore.createIndex("publicKeyHash", "publicKeyHash", { unique: false });
                        objectStore = db.createObjectStore("Key", { keyPath: "name" });
                        objectStore = db.createObjectStore("Transaction", { keyPath: "hash" });
                        objectStore.createIndex("type", "type", { unique: false });
                        objectStore.createIndex("height", "height", { unique: false });
                        objectStore = db.createObjectStore("Coin", { keyPath: ["txid", "index"] });
                        objectStore.createIndex("assetId", "assetId", { unique: false });
                        objectStore.createIndex("scriptHash", "scriptHash", { unique: false });
                    };
                    return WalletDataContext;
                }(IndexedDB.DbContext));
                IndexedDB.WalletDataContext = WalletDataContext;
            })(IndexedDB = Wallets.IndexedDB || (Wallets.IndexedDB = {}));
        })(Wallets = Implementations.Wallets || (Implementations.Wallets = {}));
    })(Implementations = AntShares.Implementations || (AntShares.Implementations = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Core;
    (function (Core) {
        var Blockchain = (function () {
            function Blockchain() {
            }
            Object.defineProperty(Blockchain, "SecondsPerBlock", {
                get: function () { return 15; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Blockchain, "DecrementInterval", {
                get: function () { return 2000000; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Blockchain, "MintingAmount", {
                get: function () { return Blockchain._MintingAmount; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Blockchain, "GenesisBlock", {
                get: function () {
                    if (Blockchain._GenesisBlock == null) {
                        Blockchain._GenesisBlock = "000000000000000000000000000000000000000000000000000000000000000000000000854f0d1fc6b4ebdd594132e399ac842976d7f5b2fc8a4dc68385766760e7714165fc8857000000001dac2b7c00000000f3812db982f3b0089a21a278988efeec6a027b250100015104001dac2b7c000000004000565b7b276c616e67273a277a682d434e272c276e616d65273a27e5b08fe89a81e882a128e6b58be8af9529277d2c7b276c616e67273a27656e272c276e616d65273a27416e74536861726528546573744e657429277d5d0000c16ff286230002a2d6adf934fe7f7e860ed48117e7590fd19db1ad018d15d5425fc5b3d6f11e74da1745e9b549bd0bfa1a569971c77eba30cd5a4b000000004001555b7b276c616e67273a277a682d434e272c276e616d65273a27e5b08fe89a81e5b88128e6b58be8af9529277d2c7b276c616e67273a27656e272c276e616d65273a27416e74436f696e28546573744e657429277d5d0000c16ff286230002a2d6adf934fe7f7e860ed48117e7590fd19db1ad018d15d5425fc5b3d6f11e749f7fd096d37ed2c0e3f7f0cfc924beef4ffceb6800000000011dac2b7c000001c9b4afd3375aa51e02531d5b2b5d9d1e0dad11b6f958ed6c86a4132da19d3ddc0000c16ff2862300197ff6783d512a740d42f4cc4f5572955fa44c9501000151".hexToBytes().asSerializable(Core.Block);
                    }
                    return Blockchain._GenesisBlock;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Blockchain, "AntShare", {
                get: function () {
                    if (Blockchain._AntShare == null) {
                        for (var i = 0; i < Blockchain.GenesisBlock.transactions.length; i++)
                            if (Blockchain.GenesisBlock.transactions[i].type == Core.TransactionType.RegisterTransaction) {
                                var asset = Blockchain.GenesisBlock.transactions[i];
                                if (asset.assetType == Core.AssetType.AntShare) {
                                    Blockchain._AntShare = asset;
                                    break;
                                }
                            }
                    }
                    return Blockchain._AntShare;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Blockchain, "AntCoin", {
                get: function () {
                    if (Blockchain._AntCoin == null) {
                        for (var i = 0; i < Blockchain.GenesisBlock.transactions.length; i++)
                            if (Blockchain.GenesisBlock.transactions[i].type == Core.TransactionType.RegisterTransaction) {
                                var asset = Blockchain.GenesisBlock.transactions[i];
                                if (asset.assetType == Core.AssetType.AntCoin) {
                                    Blockchain._AntCoin = asset;
                                    break;
                                }
                            }
                    }
                    return Blockchain._AntCoin;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Blockchain, "Default", {
                get: function () { return Blockchain._Default; },
                enumerable: true,
                configurable: true
            });
            Blockchain.registerBlockchain = function (blockchain) {
                if (blockchain == null)
                    throw new RangeError();
                return Blockchain._Default = blockchain;
            };
            Blockchain._MintingAmount = [8, 7, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            return Blockchain;
        }());
        Core.Blockchain = Blockchain;
    })(Core = AntShares.Core || (AntShares.Core = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Implementations;
    (function (Implementations) {
        var Blockchains;
        (function (Blockchains) {
            var RPC;
            (function (RPC) {
                var RpcBlockchain = (function (_super) {
                    __extends(RpcBlockchain, _super);
                    function RpcBlockchain(rpc) {
                        _super.call(this);
                        this.rpc = rpc;
                        this.map_block_index = new Map();
                        this.map_block_hash = new Map();
                        this.map_tx_hash = new Map();
                    }
                    RpcBlockchain.prototype.getBestBlockHash = function () {
                        return this.rpc.call("getbestblockhash", []).then(function (result) {
                            return new AntShares.Uint256(result.hexToBytes().buffer);
                        });
                    };
                    RpcBlockchain.prototype.getBlock = function (hashOrIndex) {
                        var _this = this;
                        var key = typeof hashOrIndex === "number" ? hashOrIndex : hashOrIndex.toString();
                        var map = typeof hashOrIndex === "number" ? this.map_block_index : this.map_block_hash;
                        if (map.has(key))
                            return Promise.resolve(map.get(key));
                        return this.rpc.call("getblock", [key, false]).then(function (result) {
                            if (map.has(key))
                                return map.get(key);
                            var block = result.hexToBytes().asSerializable(AntShares.Core.Block);
                            return block.ensureHash().then(function (result) {
                                if (map.has(key))
                                    return map.get(key);
                                _this.map_block_index.set(block.height, block);
                                _this.map_block_hash.set(block.hash.toString(), block);
                                return block;
                            });
                        });
                    };
                    RpcBlockchain.prototype.getBlockCount = function () {
                        return this.rpc.call("getblockcount", []);
                    };
                    RpcBlockchain.prototype.getBlockHash = function (index) {
                        if (this.map_block_index.has(index))
                            return Promise.resolve(this.map_block_index.get(index).hash);
                        return this.rpc.call("getblockhash", [index]).then(function (result) {
                            return new AntShares.Uint256(result.hexToBytes().buffer);
                        });
                    };
                    RpcBlockchain.prototype.getTransaction = function (hash) {
                        var _this = this;
                        var key = hash.toString();
                        if (this.map_tx_hash.has(key))
                            return Promise.resolve(this.map_tx_hash.get(key));
                        return this.rpc.call("getrawtransaction", [key, false]).then(function (result) {
                            if (_this.map_tx_hash.has(key))
                                return _this.map_tx_hash.get(key);
                            var tx = AntShares.Core.Transaction.deserializeFrom(result.hexToBytes().buffer);
                            return tx.ensureHash().then(function (result) {
                                if (_this.map_tx_hash.has(key))
                                    return _this.map_tx_hash.get(key);
                                _this.map_tx_hash.set(key, tx);
                                return tx;
                            });
                        });
                    };
                    return RpcBlockchain;
                }(AntShares.Core.Blockchain));
                RPC.RpcBlockchain = RpcBlockchain;
            })(RPC = Blockchains.RPC || (Blockchains.RPC = {}));
        })(Blockchains = Implementations.Blockchains || (Implementations.Blockchains = {}));
    })(Implementations = AntShares.Implementations || (AntShares.Implementations = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Cryptography;
    (function (Cryptography) {
        var Aes = (function () {
            function Aes(key, iv) {
                this._Ke = [];
                this._Kd = [];
                this._lastCipherblock = new Uint8Array(16);
                var rounds = Aes.numberOfRounds[key.byteLength];
                if (rounds == null) {
                    throw new RangeError('invalid key size (must be length 16, 24 or 32)');
                }
                if (iv.byteLength != 16) {
                    throw new RangeError('initialation vector iv must be of length 16');
                }
                for (var i = 0; i <= rounds; i++) {
                    this._Ke.push([0, 0, 0, 0]);
                    this._Kd.push([0, 0, 0, 0]);
                }
                var roundKeyCount = (rounds + 1) * 4;
                var KC = key.byteLength / 4;
                var tk = Aes.convertToInt32(Uint8Array.fromArrayBuffer(key));
                var index;
                for (var i = 0; i < KC; i++) {
                    index = i >> 2;
                    this._Ke[index][i % 4] = tk[i];
                    this._Kd[rounds - index][i % 4] = tk[i];
                }
                var rconpointer = 0;
                var t = KC, tt;
                while (t < roundKeyCount) {
                    tt = tk[KC - 1];
                    tk[0] ^= ((Aes.S[(tt >> 16) & 0xFF] << 24) ^
                        (Aes.S[(tt >> 8) & 0xFF] << 16) ^
                        (Aes.S[tt & 0xFF] << 8) ^
                        Aes.S[(tt >> 24) & 0xFF] ^
                        (Aes.rcon[rconpointer] << 24));
                    rconpointer += 1;
                    if (KC != 8) {
                        for (var i = 1; i < KC; i++) {
                            tk[i] ^= tk[i - 1];
                        }
                    }
                    else {
                        for (var i = 1; i < (KC / 2); i++) {
                            tk[i] ^= tk[i - 1];
                        }
                        tt = tk[(KC / 2) - 1];
                        tk[KC / 2] ^= (Aes.S[tt & 0xFF] ^
                            (Aes.S[(tt >> 8) & 0xFF] << 8) ^
                            (Aes.S[(tt >> 16) & 0xFF] << 16) ^
                            (Aes.S[(tt >> 24) & 0xFF] << 24));
                        for (var i = (KC / 2) + 1; i < KC; i++) {
                            tk[i] ^= tk[i - 1];
                        }
                    }
                    var i = 0;
                    while (i < KC && t < roundKeyCount) {
                        var r_1 = t >> 2;
                        var c_1 = t % 4;
                        this._Ke[r_1][c_1] = tk[i];
                        this._Kd[rounds - r_1][c_1] = tk[i++];
                        t++;
                    }
                }
                for (var r = 1; r < rounds; r++) {
                    for (var c = 0; c < 4; c++) {
                        tt = this._Kd[r][c];
                        this._Kd[r][c] = (Aes.U1[(tt >> 24) & 0xFF] ^
                            Aes.U2[(tt >> 16) & 0xFF] ^
                            Aes.U3[(tt >> 8) & 0xFF] ^
                            Aes.U4[tt & 0xFF]);
                    }
                }
                this._lastCipherblock.set(Uint8Array.fromArrayBuffer(iv));
            }
            Object.defineProperty(Aes.prototype, "mode", {
                get: function () {
                    return "CBC";
                },
                enumerable: true,
                configurable: true
            });
            Aes.convertToInt32 = function (bytes) {
                var result = [];
                for (var i = 0; i < bytes.length; i += 4) {
                    result.push((bytes[i] << 24) |
                        (bytes[i + 1] << 16) |
                        (bytes[i + 2] << 8) |
                        bytes[i + 3]);
                }
                return result;
            };
            Aes.prototype.decrypt = function (ciphertext) {
                if (ciphertext.byteLength == 0 || ciphertext.byteLength % 16 != 0)
                    throw new RangeError();
                var plaintext = new Uint8Array(ciphertext.byteLength);
                var ciphertext_view = Uint8Array.fromArrayBuffer(ciphertext);
                for (var i = 0; i < ciphertext_view.length; i += 16)
                    this.decryptBlock(ciphertext_view.subarray(i, i + 16), plaintext.subarray(i, i + 16));
                return plaintext.buffer.slice(0, plaintext.length - plaintext[plaintext.length - 1]);
            };
            Aes.prototype.decryptBlock = function (ciphertext, plaintext) {
                if (ciphertext.length != 16 || plaintext.length != 16)
                    throw new RangeError();
                var rounds = this._Kd.length - 1;
                var a = [0, 0, 0, 0];
                var t = Aes.convertToInt32(ciphertext);
                for (var i = 0; i < 4; i++) {
                    t[i] ^= this._Kd[0][i];
                }
                for (var r = 1; r < rounds; r++) {
                    for (var i = 0; i < 4; i++) {
                        a[i] = (Aes.T5[(t[i] >> 24) & 0xff] ^
                            Aes.T6[(t[(i + 3) % 4] >> 16) & 0xff] ^
                            Aes.T7[(t[(i + 2) % 4] >> 8) & 0xff] ^
                            Aes.T8[t[(i + 1) % 4] & 0xff] ^
                            this._Kd[r][i]);
                    }
                    t = a.slice(0);
                }
                for (var i = 0; i < 4; i++) {
                    var tt = this._Kd[rounds][i];
                    plaintext[4 * i] = (Aes.Si[(t[i] >> 24) & 0xff] ^ (tt >> 24)) & 0xff;
                    plaintext[4 * i + 1] = (Aes.Si[(t[(i + 3) % 4] >> 16) & 0xff] ^ (tt >> 16)) & 0xff;
                    plaintext[4 * i + 2] = (Aes.Si[(t[(i + 2) % 4] >> 8) & 0xff] ^ (tt >> 8)) & 0xff;
                    plaintext[4 * i + 3] = (Aes.Si[t[(i + 1) % 4] & 0xff] ^ tt) & 0xff;
                }
                for (var i = 0; i < 16; i++) {
                    plaintext[i] ^= this._lastCipherblock[i];
                }
                Array.copy(ciphertext, 0, this._lastCipherblock, 0, ciphertext.length);
            };
            Aes.prototype.encrypt = function (plaintext) {
                var block_count = Math.ceil((plaintext.byteLength + 1) / 16);
                var ciphertext = new Uint8Array(block_count * 16);
                var plaintext_view = Uint8Array.fromArrayBuffer(plaintext);
                for (var i = 0; i < block_count - 1; i++)
                    this.encryptBlock(plaintext_view.subarray(i * 16, (i + 1) * 16), ciphertext.subarray(i * 16, (i + 1) * 16));
                var padding = ciphertext.length - plaintext.byteLength;
                var final_block = new Uint8Array(16);
                final_block.fill(padding);
                if (padding < 16)
                    Array.copy(plaintext_view, ciphertext.length - 16, final_block, 0, 16 - padding);
                this.encryptBlock(final_block, ciphertext.subarray(ciphertext.length - 16));
                return ciphertext.buffer;
            };
            Aes.prototype.encryptBlock = function (plaintext, ciphertext) {
                if (plaintext.length != 16 || ciphertext.length != 16)
                    throw new RangeError();
                var precipherblock = new Uint8Array(plaintext.length);
                for (var i = 0; i < precipherblock.length; i++) {
                    precipherblock[i] = plaintext[i] ^ this._lastCipherblock[i];
                }
                var rounds = this._Ke.length - 1;
                var a = [0, 0, 0, 0];
                var t = Aes.convertToInt32(precipherblock);
                for (var i = 0; i < 4; i++) {
                    t[i] ^= this._Ke[0][i];
                }
                for (var r = 1; r < rounds; r++) {
                    for (var i = 0; i < 4; i++) {
                        a[i] = (Aes.T1[(t[i] >> 24) & 0xff] ^
                            Aes.T2[(t[(i + 1) % 4] >> 16) & 0xff] ^
                            Aes.T3[(t[(i + 2) % 4] >> 8) & 0xff] ^
                            Aes.T4[t[(i + 3) % 4] & 0xff] ^
                            this._Ke[r][i]);
                    }
                    t = a.slice(0);
                }
                for (var i = 0; i < 4; i++) {
                    var tt = this._Ke[rounds][i];
                    ciphertext[4 * i] = (Aes.S[(t[i] >> 24) & 0xff] ^ (tt >> 24)) & 0xff;
                    ciphertext[4 * i + 1] = (Aes.S[(t[(i + 1) % 4] >> 16) & 0xff] ^ (tt >> 16)) & 0xff;
                    ciphertext[4 * i + 2] = (Aes.S[(t[(i + 2) % 4] >> 8) & 0xff] ^ (tt >> 8)) & 0xff;
                    ciphertext[4 * i + 3] = (Aes.S[t[(i + 3) % 4] & 0xff] ^ tt) & 0xff;
                }
                Array.copy(ciphertext, 0, this._lastCipherblock, 0, ciphertext.length);
            };
            Aes.numberOfRounds = { 16: 10, 24: 12, 32: 14 };
            Aes.rcon = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91];
            Aes.S = [0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15, 0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75, 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf, 0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73, 0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08, 0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf, 0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16];
            Aes.Si = [0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb, 0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb, 0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e, 0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25, 0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92, 0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84, 0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06, 0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b, 0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73, 0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e, 0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b, 0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4, 0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f, 0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef, 0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61, 0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d];
            Aes.T1 = [0xc66363a5, 0xf87c7c84, 0xee777799, 0xf67b7b8d, 0xfff2f20d, 0xd66b6bbd, 0xde6f6fb1, 0x91c5c554, 0x60303050, 0x02010103, 0xce6767a9, 0x562b2b7d, 0xe7fefe19, 0xb5d7d762, 0x4dababe6, 0xec76769a, 0x8fcaca45, 0x1f82829d, 0x89c9c940, 0xfa7d7d87, 0xeffafa15, 0xb25959eb, 0x8e4747c9, 0xfbf0f00b, 0x41adadec, 0xb3d4d467, 0x5fa2a2fd, 0x45afafea, 0x239c9cbf, 0x53a4a4f7, 0xe4727296, 0x9bc0c05b, 0x75b7b7c2, 0xe1fdfd1c, 0x3d9393ae, 0x4c26266a, 0x6c36365a, 0x7e3f3f41, 0xf5f7f702, 0x83cccc4f, 0x6834345c, 0x51a5a5f4, 0xd1e5e534, 0xf9f1f108, 0xe2717193, 0xabd8d873, 0x62313153, 0x2a15153f, 0x0804040c, 0x95c7c752, 0x46232365, 0x9dc3c35e, 0x30181828, 0x379696a1, 0x0a05050f, 0x2f9a9ab5, 0x0e070709, 0x24121236, 0x1b80809b, 0xdfe2e23d, 0xcdebeb26, 0x4e272769, 0x7fb2b2cd, 0xea75759f, 0x1209091b, 0x1d83839e, 0x582c2c74, 0x341a1a2e, 0x361b1b2d, 0xdc6e6eb2, 0xb45a5aee, 0x5ba0a0fb, 0xa45252f6, 0x763b3b4d, 0xb7d6d661, 0x7db3b3ce, 0x5229297b, 0xdde3e33e, 0x5e2f2f71, 0x13848497, 0xa65353f5, 0xb9d1d168, 0x00000000, 0xc1eded2c, 0x40202060, 0xe3fcfc1f, 0x79b1b1c8, 0xb65b5bed, 0xd46a6abe, 0x8dcbcb46, 0x67bebed9, 0x7239394b, 0x944a4ade, 0x984c4cd4, 0xb05858e8, 0x85cfcf4a, 0xbbd0d06b, 0xc5efef2a, 0x4faaaae5, 0xedfbfb16, 0x864343c5, 0x9a4d4dd7, 0x66333355, 0x11858594, 0x8a4545cf, 0xe9f9f910, 0x04020206, 0xfe7f7f81, 0xa05050f0, 0x783c3c44, 0x259f9fba, 0x4ba8a8e3, 0xa25151f3, 0x5da3a3fe, 0x804040c0, 0x058f8f8a, 0x3f9292ad, 0x219d9dbc, 0x70383848, 0xf1f5f504, 0x63bcbcdf, 0x77b6b6c1, 0xafdada75, 0x42212163, 0x20101030, 0xe5ffff1a, 0xfdf3f30e, 0xbfd2d26d, 0x81cdcd4c, 0x180c0c14, 0x26131335, 0xc3ecec2f, 0xbe5f5fe1, 0x359797a2, 0x884444cc, 0x2e171739, 0x93c4c457, 0x55a7a7f2, 0xfc7e7e82, 0x7a3d3d47, 0xc86464ac, 0xba5d5de7, 0x3219192b, 0xe6737395, 0xc06060a0, 0x19818198, 0x9e4f4fd1, 0xa3dcdc7f, 0x44222266, 0x542a2a7e, 0x3b9090ab, 0x0b888883, 0x8c4646ca, 0xc7eeee29, 0x6bb8b8d3, 0x2814143c, 0xa7dede79, 0xbc5e5ee2, 0x160b0b1d, 0xaddbdb76, 0xdbe0e03b, 0x64323256, 0x743a3a4e, 0x140a0a1e, 0x924949db, 0x0c06060a, 0x4824246c, 0xb85c5ce4, 0x9fc2c25d, 0xbdd3d36e, 0x43acacef, 0xc46262a6, 0x399191a8, 0x319595a4, 0xd3e4e437, 0xf279798b, 0xd5e7e732, 0x8bc8c843, 0x6e373759, 0xda6d6db7, 0x018d8d8c, 0xb1d5d564, 0x9c4e4ed2, 0x49a9a9e0, 0xd86c6cb4, 0xac5656fa, 0xf3f4f407, 0xcfeaea25, 0xca6565af, 0xf47a7a8e, 0x47aeaee9, 0x10080818, 0x6fbabad5, 0xf0787888, 0x4a25256f, 0x5c2e2e72, 0x381c1c24, 0x57a6a6f1, 0x73b4b4c7, 0x97c6c651, 0xcbe8e823, 0xa1dddd7c, 0xe874749c, 0x3e1f1f21, 0x964b4bdd, 0x61bdbddc, 0x0d8b8b86, 0x0f8a8a85, 0xe0707090, 0x7c3e3e42, 0x71b5b5c4, 0xcc6666aa, 0x904848d8, 0x06030305, 0xf7f6f601, 0x1c0e0e12, 0xc26161a3, 0x6a35355f, 0xae5757f9, 0x69b9b9d0, 0x17868691, 0x99c1c158, 0x3a1d1d27, 0x279e9eb9, 0xd9e1e138, 0xebf8f813, 0x2b9898b3, 0x22111133, 0xd26969bb, 0xa9d9d970, 0x078e8e89, 0x339494a7, 0x2d9b9bb6, 0x3c1e1e22, 0x15878792, 0xc9e9e920, 0x87cece49, 0xaa5555ff, 0x50282878, 0xa5dfdf7a, 0x038c8c8f, 0x59a1a1f8, 0x09898980, 0x1a0d0d17, 0x65bfbfda, 0xd7e6e631, 0x844242c6, 0xd06868b8, 0x824141c3, 0x299999b0, 0x5a2d2d77, 0x1e0f0f11, 0x7bb0b0cb, 0xa85454fc, 0x6dbbbbd6, 0x2c16163a];
            Aes.T2 = [0xa5c66363, 0x84f87c7c, 0x99ee7777, 0x8df67b7b, 0x0dfff2f2, 0xbdd66b6b, 0xb1de6f6f, 0x5491c5c5, 0x50603030, 0x03020101, 0xa9ce6767, 0x7d562b2b, 0x19e7fefe, 0x62b5d7d7, 0xe64dabab, 0x9aec7676, 0x458fcaca, 0x9d1f8282, 0x4089c9c9, 0x87fa7d7d, 0x15effafa, 0xebb25959, 0xc98e4747, 0x0bfbf0f0, 0xec41adad, 0x67b3d4d4, 0xfd5fa2a2, 0xea45afaf, 0xbf239c9c, 0xf753a4a4, 0x96e47272, 0x5b9bc0c0, 0xc275b7b7, 0x1ce1fdfd, 0xae3d9393, 0x6a4c2626, 0x5a6c3636, 0x417e3f3f, 0x02f5f7f7, 0x4f83cccc, 0x5c683434, 0xf451a5a5, 0x34d1e5e5, 0x08f9f1f1, 0x93e27171, 0x73abd8d8, 0x53623131, 0x3f2a1515, 0x0c080404, 0x5295c7c7, 0x65462323, 0x5e9dc3c3, 0x28301818, 0xa1379696, 0x0f0a0505, 0xb52f9a9a, 0x090e0707, 0x36241212, 0x9b1b8080, 0x3ddfe2e2, 0x26cdebeb, 0x694e2727, 0xcd7fb2b2, 0x9fea7575, 0x1b120909, 0x9e1d8383, 0x74582c2c, 0x2e341a1a, 0x2d361b1b, 0xb2dc6e6e, 0xeeb45a5a, 0xfb5ba0a0, 0xf6a45252, 0x4d763b3b, 0x61b7d6d6, 0xce7db3b3, 0x7b522929, 0x3edde3e3, 0x715e2f2f, 0x97138484, 0xf5a65353, 0x68b9d1d1, 0x00000000, 0x2cc1eded, 0x60402020, 0x1fe3fcfc, 0xc879b1b1, 0xedb65b5b, 0xbed46a6a, 0x468dcbcb, 0xd967bebe, 0x4b723939, 0xde944a4a, 0xd4984c4c, 0xe8b05858, 0x4a85cfcf, 0x6bbbd0d0, 0x2ac5efef, 0xe54faaaa, 0x16edfbfb, 0xc5864343, 0xd79a4d4d, 0x55663333, 0x94118585, 0xcf8a4545, 0x10e9f9f9, 0x06040202, 0x81fe7f7f, 0xf0a05050, 0x44783c3c, 0xba259f9f, 0xe34ba8a8, 0xf3a25151, 0xfe5da3a3, 0xc0804040, 0x8a058f8f, 0xad3f9292, 0xbc219d9d, 0x48703838, 0x04f1f5f5, 0xdf63bcbc, 0xc177b6b6, 0x75afdada, 0x63422121, 0x30201010, 0x1ae5ffff, 0x0efdf3f3, 0x6dbfd2d2, 0x4c81cdcd, 0x14180c0c, 0x35261313, 0x2fc3ecec, 0xe1be5f5f, 0xa2359797, 0xcc884444, 0x392e1717, 0x5793c4c4, 0xf255a7a7, 0x82fc7e7e, 0x477a3d3d, 0xacc86464, 0xe7ba5d5d, 0x2b321919, 0x95e67373, 0xa0c06060, 0x98198181, 0xd19e4f4f, 0x7fa3dcdc, 0x66442222, 0x7e542a2a, 0xab3b9090, 0x830b8888, 0xca8c4646, 0x29c7eeee, 0xd36bb8b8, 0x3c281414, 0x79a7dede, 0xe2bc5e5e, 0x1d160b0b, 0x76addbdb, 0x3bdbe0e0, 0x56643232, 0x4e743a3a, 0x1e140a0a, 0xdb924949, 0x0a0c0606, 0x6c482424, 0xe4b85c5c, 0x5d9fc2c2, 0x6ebdd3d3, 0xef43acac, 0xa6c46262, 0xa8399191, 0xa4319595, 0x37d3e4e4, 0x8bf27979, 0x32d5e7e7, 0x438bc8c8, 0x596e3737, 0xb7da6d6d, 0x8c018d8d, 0x64b1d5d5, 0xd29c4e4e, 0xe049a9a9, 0xb4d86c6c, 0xfaac5656, 0x07f3f4f4, 0x25cfeaea, 0xafca6565, 0x8ef47a7a, 0xe947aeae, 0x18100808, 0xd56fbaba, 0x88f07878, 0x6f4a2525, 0x725c2e2e, 0x24381c1c, 0xf157a6a6, 0xc773b4b4, 0x5197c6c6, 0x23cbe8e8, 0x7ca1dddd, 0x9ce87474, 0x213e1f1f, 0xdd964b4b, 0xdc61bdbd, 0x860d8b8b, 0x850f8a8a, 0x90e07070, 0x427c3e3e, 0xc471b5b5, 0xaacc6666, 0xd8904848, 0x05060303, 0x01f7f6f6, 0x121c0e0e, 0xa3c26161, 0x5f6a3535, 0xf9ae5757, 0xd069b9b9, 0x91178686, 0x5899c1c1, 0x273a1d1d, 0xb9279e9e, 0x38d9e1e1, 0x13ebf8f8, 0xb32b9898, 0x33221111, 0xbbd26969, 0x70a9d9d9, 0x89078e8e, 0xa7339494, 0xb62d9b9b, 0x223c1e1e, 0x92158787, 0x20c9e9e9, 0x4987cece, 0xffaa5555, 0x78502828, 0x7aa5dfdf, 0x8f038c8c, 0xf859a1a1, 0x80098989, 0x171a0d0d, 0xda65bfbf, 0x31d7e6e6, 0xc6844242, 0xb8d06868, 0xc3824141, 0xb0299999, 0x775a2d2d, 0x111e0f0f, 0xcb7bb0b0, 0xfca85454, 0xd66dbbbb, 0x3a2c1616];
            Aes.T3 = [0x63a5c663, 0x7c84f87c, 0x7799ee77, 0x7b8df67b, 0xf20dfff2, 0x6bbdd66b, 0x6fb1de6f, 0xc55491c5, 0x30506030, 0x01030201, 0x67a9ce67, 0x2b7d562b, 0xfe19e7fe, 0xd762b5d7, 0xabe64dab, 0x769aec76, 0xca458fca, 0x829d1f82, 0xc94089c9, 0x7d87fa7d, 0xfa15effa, 0x59ebb259, 0x47c98e47, 0xf00bfbf0, 0xadec41ad, 0xd467b3d4, 0xa2fd5fa2, 0xafea45af, 0x9cbf239c, 0xa4f753a4, 0x7296e472, 0xc05b9bc0, 0xb7c275b7, 0xfd1ce1fd, 0x93ae3d93, 0x266a4c26, 0x365a6c36, 0x3f417e3f, 0xf702f5f7, 0xcc4f83cc, 0x345c6834, 0xa5f451a5, 0xe534d1e5, 0xf108f9f1, 0x7193e271, 0xd873abd8, 0x31536231, 0x153f2a15, 0x040c0804, 0xc75295c7, 0x23654623, 0xc35e9dc3, 0x18283018, 0x96a13796, 0x050f0a05, 0x9ab52f9a, 0x07090e07, 0x12362412, 0x809b1b80, 0xe23ddfe2, 0xeb26cdeb, 0x27694e27, 0xb2cd7fb2, 0x759fea75, 0x091b1209, 0x839e1d83, 0x2c74582c, 0x1a2e341a, 0x1b2d361b, 0x6eb2dc6e, 0x5aeeb45a, 0xa0fb5ba0, 0x52f6a452, 0x3b4d763b, 0xd661b7d6, 0xb3ce7db3, 0x297b5229, 0xe33edde3, 0x2f715e2f, 0x84971384, 0x53f5a653, 0xd168b9d1, 0x00000000, 0xed2cc1ed, 0x20604020, 0xfc1fe3fc, 0xb1c879b1, 0x5bedb65b, 0x6abed46a, 0xcb468dcb, 0xbed967be, 0x394b7239, 0x4ade944a, 0x4cd4984c, 0x58e8b058, 0xcf4a85cf, 0xd06bbbd0, 0xef2ac5ef, 0xaae54faa, 0xfb16edfb, 0x43c58643, 0x4dd79a4d, 0x33556633, 0x85941185, 0x45cf8a45, 0xf910e9f9, 0x02060402, 0x7f81fe7f, 0x50f0a050, 0x3c44783c, 0x9fba259f, 0xa8e34ba8, 0x51f3a251, 0xa3fe5da3, 0x40c08040, 0x8f8a058f, 0x92ad3f92, 0x9dbc219d, 0x38487038, 0xf504f1f5, 0xbcdf63bc, 0xb6c177b6, 0xda75afda, 0x21634221, 0x10302010, 0xff1ae5ff, 0xf30efdf3, 0xd26dbfd2, 0xcd4c81cd, 0x0c14180c, 0x13352613, 0xec2fc3ec, 0x5fe1be5f, 0x97a23597, 0x44cc8844, 0x17392e17, 0xc45793c4, 0xa7f255a7, 0x7e82fc7e, 0x3d477a3d, 0x64acc864, 0x5de7ba5d, 0x192b3219, 0x7395e673, 0x60a0c060, 0x81981981, 0x4fd19e4f, 0xdc7fa3dc, 0x22664422, 0x2a7e542a, 0x90ab3b90, 0x88830b88, 0x46ca8c46, 0xee29c7ee, 0xb8d36bb8, 0x143c2814, 0xde79a7de, 0x5ee2bc5e, 0x0b1d160b, 0xdb76addb, 0xe03bdbe0, 0x32566432, 0x3a4e743a, 0x0a1e140a, 0x49db9249, 0x060a0c06, 0x246c4824, 0x5ce4b85c, 0xc25d9fc2, 0xd36ebdd3, 0xacef43ac, 0x62a6c462, 0x91a83991, 0x95a43195, 0xe437d3e4, 0x798bf279, 0xe732d5e7, 0xc8438bc8, 0x37596e37, 0x6db7da6d, 0x8d8c018d, 0xd564b1d5, 0x4ed29c4e, 0xa9e049a9, 0x6cb4d86c, 0x56faac56, 0xf407f3f4, 0xea25cfea, 0x65afca65, 0x7a8ef47a, 0xaee947ae, 0x08181008, 0xbad56fba, 0x7888f078, 0x256f4a25, 0x2e725c2e, 0x1c24381c, 0xa6f157a6, 0xb4c773b4, 0xc65197c6, 0xe823cbe8, 0xdd7ca1dd, 0x749ce874, 0x1f213e1f, 0x4bdd964b, 0xbddc61bd, 0x8b860d8b, 0x8a850f8a, 0x7090e070, 0x3e427c3e, 0xb5c471b5, 0x66aacc66, 0x48d89048, 0x03050603, 0xf601f7f6, 0x0e121c0e, 0x61a3c261, 0x355f6a35, 0x57f9ae57, 0xb9d069b9, 0x86911786, 0xc15899c1, 0x1d273a1d, 0x9eb9279e, 0xe138d9e1, 0xf813ebf8, 0x98b32b98, 0x11332211, 0x69bbd269, 0xd970a9d9, 0x8e89078e, 0x94a73394, 0x9bb62d9b, 0x1e223c1e, 0x87921587, 0xe920c9e9, 0xce4987ce, 0x55ffaa55, 0x28785028, 0xdf7aa5df, 0x8c8f038c, 0xa1f859a1, 0x89800989, 0x0d171a0d, 0xbfda65bf, 0xe631d7e6, 0x42c68442, 0x68b8d068, 0x41c38241, 0x99b02999, 0x2d775a2d, 0x0f111e0f, 0xb0cb7bb0, 0x54fca854, 0xbbd66dbb, 0x163a2c16];
            Aes.T4 = [0x6363a5c6, 0x7c7c84f8, 0x777799ee, 0x7b7b8df6, 0xf2f20dff, 0x6b6bbdd6, 0x6f6fb1de, 0xc5c55491, 0x30305060, 0x01010302, 0x6767a9ce, 0x2b2b7d56, 0xfefe19e7, 0xd7d762b5, 0xababe64d, 0x76769aec, 0xcaca458f, 0x82829d1f, 0xc9c94089, 0x7d7d87fa, 0xfafa15ef, 0x5959ebb2, 0x4747c98e, 0xf0f00bfb, 0xadadec41, 0xd4d467b3, 0xa2a2fd5f, 0xafafea45, 0x9c9cbf23, 0xa4a4f753, 0x727296e4, 0xc0c05b9b, 0xb7b7c275, 0xfdfd1ce1, 0x9393ae3d, 0x26266a4c, 0x36365a6c, 0x3f3f417e, 0xf7f702f5, 0xcccc4f83, 0x34345c68, 0xa5a5f451, 0xe5e534d1, 0xf1f108f9, 0x717193e2, 0xd8d873ab, 0x31315362, 0x15153f2a, 0x04040c08, 0xc7c75295, 0x23236546, 0xc3c35e9d, 0x18182830, 0x9696a137, 0x05050f0a, 0x9a9ab52f, 0x0707090e, 0x12123624, 0x80809b1b, 0xe2e23ddf, 0xebeb26cd, 0x2727694e, 0xb2b2cd7f, 0x75759fea, 0x09091b12, 0x83839e1d, 0x2c2c7458, 0x1a1a2e34, 0x1b1b2d36, 0x6e6eb2dc, 0x5a5aeeb4, 0xa0a0fb5b, 0x5252f6a4, 0x3b3b4d76, 0xd6d661b7, 0xb3b3ce7d, 0x29297b52, 0xe3e33edd, 0x2f2f715e, 0x84849713, 0x5353f5a6, 0xd1d168b9, 0x00000000, 0xeded2cc1, 0x20206040, 0xfcfc1fe3, 0xb1b1c879, 0x5b5bedb6, 0x6a6abed4, 0xcbcb468d, 0xbebed967, 0x39394b72, 0x4a4ade94, 0x4c4cd498, 0x5858e8b0, 0xcfcf4a85, 0xd0d06bbb, 0xefef2ac5, 0xaaaae54f, 0xfbfb16ed, 0x4343c586, 0x4d4dd79a, 0x33335566, 0x85859411, 0x4545cf8a, 0xf9f910e9, 0x02020604, 0x7f7f81fe, 0x5050f0a0, 0x3c3c4478, 0x9f9fba25, 0xa8a8e34b, 0x5151f3a2, 0xa3a3fe5d, 0x4040c080, 0x8f8f8a05, 0x9292ad3f, 0x9d9dbc21, 0x38384870, 0xf5f504f1, 0xbcbcdf63, 0xb6b6c177, 0xdada75af, 0x21216342, 0x10103020, 0xffff1ae5, 0xf3f30efd, 0xd2d26dbf, 0xcdcd4c81, 0x0c0c1418, 0x13133526, 0xecec2fc3, 0x5f5fe1be, 0x9797a235, 0x4444cc88, 0x1717392e, 0xc4c45793, 0xa7a7f255, 0x7e7e82fc, 0x3d3d477a, 0x6464acc8, 0x5d5de7ba, 0x19192b32, 0x737395e6, 0x6060a0c0, 0x81819819, 0x4f4fd19e, 0xdcdc7fa3, 0x22226644, 0x2a2a7e54, 0x9090ab3b, 0x8888830b, 0x4646ca8c, 0xeeee29c7, 0xb8b8d36b, 0x14143c28, 0xdede79a7, 0x5e5ee2bc, 0x0b0b1d16, 0xdbdb76ad, 0xe0e03bdb, 0x32325664, 0x3a3a4e74, 0x0a0a1e14, 0x4949db92, 0x06060a0c, 0x24246c48, 0x5c5ce4b8, 0xc2c25d9f, 0xd3d36ebd, 0xacacef43, 0x6262a6c4, 0x9191a839, 0x9595a431, 0xe4e437d3, 0x79798bf2, 0xe7e732d5, 0xc8c8438b, 0x3737596e, 0x6d6db7da, 0x8d8d8c01, 0xd5d564b1, 0x4e4ed29c, 0xa9a9e049, 0x6c6cb4d8, 0x5656faac, 0xf4f407f3, 0xeaea25cf, 0x6565afca, 0x7a7a8ef4, 0xaeaee947, 0x08081810, 0xbabad56f, 0x787888f0, 0x25256f4a, 0x2e2e725c, 0x1c1c2438, 0xa6a6f157, 0xb4b4c773, 0xc6c65197, 0xe8e823cb, 0xdddd7ca1, 0x74749ce8, 0x1f1f213e, 0x4b4bdd96, 0xbdbddc61, 0x8b8b860d, 0x8a8a850f, 0x707090e0, 0x3e3e427c, 0xb5b5c471, 0x6666aacc, 0x4848d890, 0x03030506, 0xf6f601f7, 0x0e0e121c, 0x6161a3c2, 0x35355f6a, 0x5757f9ae, 0xb9b9d069, 0x86869117, 0xc1c15899, 0x1d1d273a, 0x9e9eb927, 0xe1e138d9, 0xf8f813eb, 0x9898b32b, 0x11113322, 0x6969bbd2, 0xd9d970a9, 0x8e8e8907, 0x9494a733, 0x9b9bb62d, 0x1e1e223c, 0x87879215, 0xe9e920c9, 0xcece4987, 0x5555ffaa, 0x28287850, 0xdfdf7aa5, 0x8c8c8f03, 0xa1a1f859, 0x89898009, 0x0d0d171a, 0xbfbfda65, 0xe6e631d7, 0x4242c684, 0x6868b8d0, 0x4141c382, 0x9999b029, 0x2d2d775a, 0x0f0f111e, 0xb0b0cb7b, 0x5454fca8, 0xbbbbd66d, 0x16163a2c];
            Aes.T5 = [0x51f4a750, 0x7e416553, 0x1a17a4c3, 0x3a275e96, 0x3bab6bcb, 0x1f9d45f1, 0xacfa58ab, 0x4be30393, 0x2030fa55, 0xad766df6, 0x88cc7691, 0xf5024c25, 0x4fe5d7fc, 0xc52acbd7, 0x26354480, 0xb562a38f, 0xdeb15a49, 0x25ba1b67, 0x45ea0e98, 0x5dfec0e1, 0xc32f7502, 0x814cf012, 0x8d4697a3, 0x6bd3f9c6, 0x038f5fe7, 0x15929c95, 0xbf6d7aeb, 0x955259da, 0xd4be832d, 0x587421d3, 0x49e06929, 0x8ec9c844, 0x75c2896a, 0xf48e7978, 0x99583e6b, 0x27b971dd, 0xbee14fb6, 0xf088ad17, 0xc920ac66, 0x7dce3ab4, 0x63df4a18, 0xe51a3182, 0x97513360, 0x62537f45, 0xb16477e0, 0xbb6bae84, 0xfe81a01c, 0xf9082b94, 0x70486858, 0x8f45fd19, 0x94de6c87, 0x527bf8b7, 0xab73d323, 0x724b02e2, 0xe31f8f57, 0x6655ab2a, 0xb2eb2807, 0x2fb5c203, 0x86c57b9a, 0xd33708a5, 0x302887f2, 0x23bfa5b2, 0x02036aba, 0xed16825c, 0x8acf1c2b, 0xa779b492, 0xf307f2f0, 0x4e69e2a1, 0x65daf4cd, 0x0605bed5, 0xd134621f, 0xc4a6fe8a, 0x342e539d, 0xa2f355a0, 0x058ae132, 0xa4f6eb75, 0x0b83ec39, 0x4060efaa, 0x5e719f06, 0xbd6e1051, 0x3e218af9, 0x96dd063d, 0xdd3e05ae, 0x4de6bd46, 0x91548db5, 0x71c45d05, 0x0406d46f, 0x605015ff, 0x1998fb24, 0xd6bde997, 0x894043cc, 0x67d99e77, 0xb0e842bd, 0x07898b88, 0xe7195b38, 0x79c8eedb, 0xa17c0a47, 0x7c420fe9, 0xf8841ec9, 0x00000000, 0x09808683, 0x322bed48, 0x1e1170ac, 0x6c5a724e, 0xfd0efffb, 0x0f853856, 0x3daed51e, 0x362d3927, 0x0a0fd964, 0x685ca621, 0x9b5b54d1, 0x24362e3a, 0x0c0a67b1, 0x9357e70f, 0xb4ee96d2, 0x1b9b919e, 0x80c0c54f, 0x61dc20a2, 0x5a774b69, 0x1c121a16, 0xe293ba0a, 0xc0a02ae5, 0x3c22e043, 0x121b171d, 0x0e090d0b, 0xf28bc7ad, 0x2db6a8b9, 0x141ea9c8, 0x57f11985, 0xaf75074c, 0xee99ddbb, 0xa37f60fd, 0xf701269f, 0x5c72f5bc, 0x44663bc5, 0x5bfb7e34, 0x8b432976, 0xcb23c6dc, 0xb6edfc68, 0xb8e4f163, 0xd731dcca, 0x42638510, 0x13972240, 0x84c61120, 0x854a247d, 0xd2bb3df8, 0xaef93211, 0xc729a16d, 0x1d9e2f4b, 0xdcb230f3, 0x0d8652ec, 0x77c1e3d0, 0x2bb3166c, 0xa970b999, 0x119448fa, 0x47e96422, 0xa8fc8cc4, 0xa0f03f1a, 0x567d2cd8, 0x223390ef, 0x87494ec7, 0xd938d1c1, 0x8ccaa2fe, 0x98d40b36, 0xa6f581cf, 0xa57ade28, 0xdab78e26, 0x3fadbfa4, 0x2c3a9de4, 0x5078920d, 0x6a5fcc9b, 0x547e4662, 0xf68d13c2, 0x90d8b8e8, 0x2e39f75e, 0x82c3aff5, 0x9f5d80be, 0x69d0937c, 0x6fd52da9, 0xcf2512b3, 0xc8ac993b, 0x10187da7, 0xe89c636e, 0xdb3bbb7b, 0xcd267809, 0x6e5918f4, 0xec9ab701, 0x834f9aa8, 0xe6956e65, 0xaaffe67e, 0x21bccf08, 0xef15e8e6, 0xbae79bd9, 0x4a6f36ce, 0xea9f09d4, 0x29b07cd6, 0x31a4b2af, 0x2a3f2331, 0xc6a59430, 0x35a266c0, 0x744ebc37, 0xfc82caa6, 0xe090d0b0, 0x33a7d815, 0xf104984a, 0x41ecdaf7, 0x7fcd500e, 0x1791f62f, 0x764dd68d, 0x43efb04d, 0xccaa4d54, 0xe49604df, 0x9ed1b5e3, 0x4c6a881b, 0xc12c1fb8, 0x4665517f, 0x9d5eea04, 0x018c355d, 0xfa877473, 0xfb0b412e, 0xb3671d5a, 0x92dbd252, 0xe9105633, 0x6dd64713, 0x9ad7618c, 0x37a10c7a, 0x59f8148e, 0xeb133c89, 0xcea927ee, 0xb761c935, 0xe11ce5ed, 0x7a47b13c, 0x9cd2df59, 0x55f2733f, 0x1814ce79, 0x73c737bf, 0x53f7cdea, 0x5ffdaa5b, 0xdf3d6f14, 0x7844db86, 0xcaaff381, 0xb968c43e, 0x3824342c, 0xc2a3405f, 0x161dc372, 0xbce2250c, 0x283c498b, 0xff0d9541, 0x39a80171, 0x080cb3de, 0xd8b4e49c, 0x6456c190, 0x7bcb8461, 0xd532b670, 0x486c5c74, 0xd0b85742];
            Aes.T6 = [0x5051f4a7, 0x537e4165, 0xc31a17a4, 0x963a275e, 0xcb3bab6b, 0xf11f9d45, 0xabacfa58, 0x934be303, 0x552030fa, 0xf6ad766d, 0x9188cc76, 0x25f5024c, 0xfc4fe5d7, 0xd7c52acb, 0x80263544, 0x8fb562a3, 0x49deb15a, 0x6725ba1b, 0x9845ea0e, 0xe15dfec0, 0x02c32f75, 0x12814cf0, 0xa38d4697, 0xc66bd3f9, 0xe7038f5f, 0x9515929c, 0xebbf6d7a, 0xda955259, 0x2dd4be83, 0xd3587421, 0x2949e069, 0x448ec9c8, 0x6a75c289, 0x78f48e79, 0x6b99583e, 0xdd27b971, 0xb6bee14f, 0x17f088ad, 0x66c920ac, 0xb47dce3a, 0x1863df4a, 0x82e51a31, 0x60975133, 0x4562537f, 0xe0b16477, 0x84bb6bae, 0x1cfe81a0, 0x94f9082b, 0x58704868, 0x198f45fd, 0x8794de6c, 0xb7527bf8, 0x23ab73d3, 0xe2724b02, 0x57e31f8f, 0x2a6655ab, 0x07b2eb28, 0x032fb5c2, 0x9a86c57b, 0xa5d33708, 0xf2302887, 0xb223bfa5, 0xba02036a, 0x5ced1682, 0x2b8acf1c, 0x92a779b4, 0xf0f307f2, 0xa14e69e2, 0xcd65daf4, 0xd50605be, 0x1fd13462, 0x8ac4a6fe, 0x9d342e53, 0xa0a2f355, 0x32058ae1, 0x75a4f6eb, 0x390b83ec, 0xaa4060ef, 0x065e719f, 0x51bd6e10, 0xf93e218a, 0x3d96dd06, 0xaedd3e05, 0x464de6bd, 0xb591548d, 0x0571c45d, 0x6f0406d4, 0xff605015, 0x241998fb, 0x97d6bde9, 0xcc894043, 0x7767d99e, 0xbdb0e842, 0x8807898b, 0x38e7195b, 0xdb79c8ee, 0x47a17c0a, 0xe97c420f, 0xc9f8841e, 0x00000000, 0x83098086, 0x48322bed, 0xac1e1170, 0x4e6c5a72, 0xfbfd0eff, 0x560f8538, 0x1e3daed5, 0x27362d39, 0x640a0fd9, 0x21685ca6, 0xd19b5b54, 0x3a24362e, 0xb10c0a67, 0x0f9357e7, 0xd2b4ee96, 0x9e1b9b91, 0x4f80c0c5, 0xa261dc20, 0x695a774b, 0x161c121a, 0x0ae293ba, 0xe5c0a02a, 0x433c22e0, 0x1d121b17, 0x0b0e090d, 0xadf28bc7, 0xb92db6a8, 0xc8141ea9, 0x8557f119, 0x4caf7507, 0xbbee99dd, 0xfda37f60, 0x9ff70126, 0xbc5c72f5, 0xc544663b, 0x345bfb7e, 0x768b4329, 0xdccb23c6, 0x68b6edfc, 0x63b8e4f1, 0xcad731dc, 0x10426385, 0x40139722, 0x2084c611, 0x7d854a24, 0xf8d2bb3d, 0x11aef932, 0x6dc729a1, 0x4b1d9e2f, 0xf3dcb230, 0xec0d8652, 0xd077c1e3, 0x6c2bb316, 0x99a970b9, 0xfa119448, 0x2247e964, 0xc4a8fc8c, 0x1aa0f03f, 0xd8567d2c, 0xef223390, 0xc787494e, 0xc1d938d1, 0xfe8ccaa2, 0x3698d40b, 0xcfa6f581, 0x28a57ade, 0x26dab78e, 0xa43fadbf, 0xe42c3a9d, 0x0d507892, 0x9b6a5fcc, 0x62547e46, 0xc2f68d13, 0xe890d8b8, 0x5e2e39f7, 0xf582c3af, 0xbe9f5d80, 0x7c69d093, 0xa96fd52d, 0xb3cf2512, 0x3bc8ac99, 0xa710187d, 0x6ee89c63, 0x7bdb3bbb, 0x09cd2678, 0xf46e5918, 0x01ec9ab7, 0xa8834f9a, 0x65e6956e, 0x7eaaffe6, 0x0821bccf, 0xe6ef15e8, 0xd9bae79b, 0xce4a6f36, 0xd4ea9f09, 0xd629b07c, 0xaf31a4b2, 0x312a3f23, 0x30c6a594, 0xc035a266, 0x37744ebc, 0xa6fc82ca, 0xb0e090d0, 0x1533a7d8, 0x4af10498, 0xf741ecda, 0x0e7fcd50, 0x2f1791f6, 0x8d764dd6, 0x4d43efb0, 0x54ccaa4d, 0xdfe49604, 0xe39ed1b5, 0x1b4c6a88, 0xb8c12c1f, 0x7f466551, 0x049d5eea, 0x5d018c35, 0x73fa8774, 0x2efb0b41, 0x5ab3671d, 0x5292dbd2, 0x33e91056, 0x136dd647, 0x8c9ad761, 0x7a37a10c, 0x8e59f814, 0x89eb133c, 0xeecea927, 0x35b761c9, 0xede11ce5, 0x3c7a47b1, 0x599cd2df, 0x3f55f273, 0x791814ce, 0xbf73c737, 0xea53f7cd, 0x5b5ffdaa, 0x14df3d6f, 0x867844db, 0x81caaff3, 0x3eb968c4, 0x2c382434, 0x5fc2a340, 0x72161dc3, 0x0cbce225, 0x8b283c49, 0x41ff0d95, 0x7139a801, 0xde080cb3, 0x9cd8b4e4, 0x906456c1, 0x617bcb84, 0x70d532b6, 0x74486c5c, 0x42d0b857];
            Aes.T7 = [0xa75051f4, 0x65537e41, 0xa4c31a17, 0x5e963a27, 0x6bcb3bab, 0x45f11f9d, 0x58abacfa, 0x03934be3, 0xfa552030, 0x6df6ad76, 0x769188cc, 0x4c25f502, 0xd7fc4fe5, 0xcbd7c52a, 0x44802635, 0xa38fb562, 0x5a49deb1, 0x1b6725ba, 0x0e9845ea, 0xc0e15dfe, 0x7502c32f, 0xf012814c, 0x97a38d46, 0xf9c66bd3, 0x5fe7038f, 0x9c951592, 0x7aebbf6d, 0x59da9552, 0x832dd4be, 0x21d35874, 0x692949e0, 0xc8448ec9, 0x896a75c2, 0x7978f48e, 0x3e6b9958, 0x71dd27b9, 0x4fb6bee1, 0xad17f088, 0xac66c920, 0x3ab47dce, 0x4a1863df, 0x3182e51a, 0x33609751, 0x7f456253, 0x77e0b164, 0xae84bb6b, 0xa01cfe81, 0x2b94f908, 0x68587048, 0xfd198f45, 0x6c8794de, 0xf8b7527b, 0xd323ab73, 0x02e2724b, 0x8f57e31f, 0xab2a6655, 0x2807b2eb, 0xc2032fb5, 0x7b9a86c5, 0x08a5d337, 0x87f23028, 0xa5b223bf, 0x6aba0203, 0x825ced16, 0x1c2b8acf, 0xb492a779, 0xf2f0f307, 0xe2a14e69, 0xf4cd65da, 0xbed50605, 0x621fd134, 0xfe8ac4a6, 0x539d342e, 0x55a0a2f3, 0xe132058a, 0xeb75a4f6, 0xec390b83, 0xefaa4060, 0x9f065e71, 0x1051bd6e, 0x8af93e21, 0x063d96dd, 0x05aedd3e, 0xbd464de6, 0x8db59154, 0x5d0571c4, 0xd46f0406, 0x15ff6050, 0xfb241998, 0xe997d6bd, 0x43cc8940, 0x9e7767d9, 0x42bdb0e8, 0x8b880789, 0x5b38e719, 0xeedb79c8, 0x0a47a17c, 0x0fe97c42, 0x1ec9f884, 0x00000000, 0x86830980, 0xed48322b, 0x70ac1e11, 0x724e6c5a, 0xfffbfd0e, 0x38560f85, 0xd51e3dae, 0x3927362d, 0xd9640a0f, 0xa621685c, 0x54d19b5b, 0x2e3a2436, 0x67b10c0a, 0xe70f9357, 0x96d2b4ee, 0x919e1b9b, 0xc54f80c0, 0x20a261dc, 0x4b695a77, 0x1a161c12, 0xba0ae293, 0x2ae5c0a0, 0xe0433c22, 0x171d121b, 0x0d0b0e09, 0xc7adf28b, 0xa8b92db6, 0xa9c8141e, 0x198557f1, 0x074caf75, 0xddbbee99, 0x60fda37f, 0x269ff701, 0xf5bc5c72, 0x3bc54466, 0x7e345bfb, 0x29768b43, 0xc6dccb23, 0xfc68b6ed, 0xf163b8e4, 0xdccad731, 0x85104263, 0x22401397, 0x112084c6, 0x247d854a, 0x3df8d2bb, 0x3211aef9, 0xa16dc729, 0x2f4b1d9e, 0x30f3dcb2, 0x52ec0d86, 0xe3d077c1, 0x166c2bb3, 0xb999a970, 0x48fa1194, 0x642247e9, 0x8cc4a8fc, 0x3f1aa0f0, 0x2cd8567d, 0x90ef2233, 0x4ec78749, 0xd1c1d938, 0xa2fe8cca, 0x0b3698d4, 0x81cfa6f5, 0xde28a57a, 0x8e26dab7, 0xbfa43fad, 0x9de42c3a, 0x920d5078, 0xcc9b6a5f, 0x4662547e, 0x13c2f68d, 0xb8e890d8, 0xf75e2e39, 0xaff582c3, 0x80be9f5d, 0x937c69d0, 0x2da96fd5, 0x12b3cf25, 0x993bc8ac, 0x7da71018, 0x636ee89c, 0xbb7bdb3b, 0x7809cd26, 0x18f46e59, 0xb701ec9a, 0x9aa8834f, 0x6e65e695, 0xe67eaaff, 0xcf0821bc, 0xe8e6ef15, 0x9bd9bae7, 0x36ce4a6f, 0x09d4ea9f, 0x7cd629b0, 0xb2af31a4, 0x23312a3f, 0x9430c6a5, 0x66c035a2, 0xbc37744e, 0xcaa6fc82, 0xd0b0e090, 0xd81533a7, 0x984af104, 0xdaf741ec, 0x500e7fcd, 0xf62f1791, 0xd68d764d, 0xb04d43ef, 0x4d54ccaa, 0x04dfe496, 0xb5e39ed1, 0x881b4c6a, 0x1fb8c12c, 0x517f4665, 0xea049d5e, 0x355d018c, 0x7473fa87, 0x412efb0b, 0x1d5ab367, 0xd25292db, 0x5633e910, 0x47136dd6, 0x618c9ad7, 0x0c7a37a1, 0x148e59f8, 0x3c89eb13, 0x27eecea9, 0xc935b761, 0xe5ede11c, 0xb13c7a47, 0xdf599cd2, 0x733f55f2, 0xce791814, 0x37bf73c7, 0xcdea53f7, 0xaa5b5ffd, 0x6f14df3d, 0xdb867844, 0xf381caaf, 0xc43eb968, 0x342c3824, 0x405fc2a3, 0xc372161d, 0x250cbce2, 0x498b283c, 0x9541ff0d, 0x017139a8, 0xb3de080c, 0xe49cd8b4, 0xc1906456, 0x84617bcb, 0xb670d532, 0x5c74486c, 0x5742d0b8];
            Aes.T8 = [0xf4a75051, 0x4165537e, 0x17a4c31a, 0x275e963a, 0xab6bcb3b, 0x9d45f11f, 0xfa58abac, 0xe303934b, 0x30fa5520, 0x766df6ad, 0xcc769188, 0x024c25f5, 0xe5d7fc4f, 0x2acbd7c5, 0x35448026, 0x62a38fb5, 0xb15a49de, 0xba1b6725, 0xea0e9845, 0xfec0e15d, 0x2f7502c3, 0x4cf01281, 0x4697a38d, 0xd3f9c66b, 0x8f5fe703, 0x929c9515, 0x6d7aebbf, 0x5259da95, 0xbe832dd4, 0x7421d358, 0xe0692949, 0xc9c8448e, 0xc2896a75, 0x8e7978f4, 0x583e6b99, 0xb971dd27, 0xe14fb6be, 0x88ad17f0, 0x20ac66c9, 0xce3ab47d, 0xdf4a1863, 0x1a3182e5, 0x51336097, 0x537f4562, 0x6477e0b1, 0x6bae84bb, 0x81a01cfe, 0x082b94f9, 0x48685870, 0x45fd198f, 0xde6c8794, 0x7bf8b752, 0x73d323ab, 0x4b02e272, 0x1f8f57e3, 0x55ab2a66, 0xeb2807b2, 0xb5c2032f, 0xc57b9a86, 0x3708a5d3, 0x2887f230, 0xbfa5b223, 0x036aba02, 0x16825ced, 0xcf1c2b8a, 0x79b492a7, 0x07f2f0f3, 0x69e2a14e, 0xdaf4cd65, 0x05bed506, 0x34621fd1, 0xa6fe8ac4, 0x2e539d34, 0xf355a0a2, 0x8ae13205, 0xf6eb75a4, 0x83ec390b, 0x60efaa40, 0x719f065e, 0x6e1051bd, 0x218af93e, 0xdd063d96, 0x3e05aedd, 0xe6bd464d, 0x548db591, 0xc45d0571, 0x06d46f04, 0x5015ff60, 0x98fb2419, 0xbde997d6, 0x4043cc89, 0xd99e7767, 0xe842bdb0, 0x898b8807, 0x195b38e7, 0xc8eedb79, 0x7c0a47a1, 0x420fe97c, 0x841ec9f8, 0x00000000, 0x80868309, 0x2bed4832, 0x1170ac1e, 0x5a724e6c, 0x0efffbfd, 0x8538560f, 0xaed51e3d, 0x2d392736, 0x0fd9640a, 0x5ca62168, 0x5b54d19b, 0x362e3a24, 0x0a67b10c, 0x57e70f93, 0xee96d2b4, 0x9b919e1b, 0xc0c54f80, 0xdc20a261, 0x774b695a, 0x121a161c, 0x93ba0ae2, 0xa02ae5c0, 0x22e0433c, 0x1b171d12, 0x090d0b0e, 0x8bc7adf2, 0xb6a8b92d, 0x1ea9c814, 0xf1198557, 0x75074caf, 0x99ddbbee, 0x7f60fda3, 0x01269ff7, 0x72f5bc5c, 0x663bc544, 0xfb7e345b, 0x4329768b, 0x23c6dccb, 0xedfc68b6, 0xe4f163b8, 0x31dccad7, 0x63851042, 0x97224013, 0xc6112084, 0x4a247d85, 0xbb3df8d2, 0xf93211ae, 0x29a16dc7, 0x9e2f4b1d, 0xb230f3dc, 0x8652ec0d, 0xc1e3d077, 0xb3166c2b, 0x70b999a9, 0x9448fa11, 0xe9642247, 0xfc8cc4a8, 0xf03f1aa0, 0x7d2cd856, 0x3390ef22, 0x494ec787, 0x38d1c1d9, 0xcaa2fe8c, 0xd40b3698, 0xf581cfa6, 0x7ade28a5, 0xb78e26da, 0xadbfa43f, 0x3a9de42c, 0x78920d50, 0x5fcc9b6a, 0x7e466254, 0x8d13c2f6, 0xd8b8e890, 0x39f75e2e, 0xc3aff582, 0x5d80be9f, 0xd0937c69, 0xd52da96f, 0x2512b3cf, 0xac993bc8, 0x187da710, 0x9c636ee8, 0x3bbb7bdb, 0x267809cd, 0x5918f46e, 0x9ab701ec, 0x4f9aa883, 0x956e65e6, 0xffe67eaa, 0xbccf0821, 0x15e8e6ef, 0xe79bd9ba, 0x6f36ce4a, 0x9f09d4ea, 0xb07cd629, 0xa4b2af31, 0x3f23312a, 0xa59430c6, 0xa266c035, 0x4ebc3774, 0x82caa6fc, 0x90d0b0e0, 0xa7d81533, 0x04984af1, 0xecdaf741, 0xcd500e7f, 0x91f62f17, 0x4dd68d76, 0xefb04d43, 0xaa4d54cc, 0x9604dfe4, 0xd1b5e39e, 0x6a881b4c, 0x2c1fb8c1, 0x65517f46, 0x5eea049d, 0x8c355d01, 0x877473fa, 0x0b412efb, 0x671d5ab3, 0xdbd25292, 0x105633e9, 0xd647136d, 0xd7618c9a, 0xa10c7a37, 0xf8148e59, 0x133c89eb, 0xa927eece, 0x61c935b7, 0x1ce5ede1, 0x47b13c7a, 0xd2df599c, 0xf2733f55, 0x14ce7918, 0xc737bf73, 0xf7cdea53, 0xfdaa5b5f, 0x3d6f14df, 0x44db8678, 0xaff381ca, 0x68c43eb9, 0x24342c38, 0xa3405fc2, 0x1dc37216, 0xe2250cbc, 0x3c498b28, 0x0d9541ff, 0xa8017139, 0x0cb3de08, 0xb4e49cd8, 0x56c19064, 0xcb84617b, 0x32b670d5, 0x6c5c7448, 0xb85742d0];
            Aes.U1 = [0x00000000, 0x0e090d0b, 0x1c121a16, 0x121b171d, 0x3824342c, 0x362d3927, 0x24362e3a, 0x2a3f2331, 0x70486858, 0x7e416553, 0x6c5a724e, 0x62537f45, 0x486c5c74, 0x4665517f, 0x547e4662, 0x5a774b69, 0xe090d0b0, 0xee99ddbb, 0xfc82caa6, 0xf28bc7ad, 0xd8b4e49c, 0xd6bde997, 0xc4a6fe8a, 0xcaaff381, 0x90d8b8e8, 0x9ed1b5e3, 0x8ccaa2fe, 0x82c3aff5, 0xa8fc8cc4, 0xa6f581cf, 0xb4ee96d2, 0xbae79bd9, 0xdb3bbb7b, 0xd532b670, 0xc729a16d, 0xc920ac66, 0xe31f8f57, 0xed16825c, 0xff0d9541, 0xf104984a, 0xab73d323, 0xa57ade28, 0xb761c935, 0xb968c43e, 0x9357e70f, 0x9d5eea04, 0x8f45fd19, 0x814cf012, 0x3bab6bcb, 0x35a266c0, 0x27b971dd, 0x29b07cd6, 0x038f5fe7, 0x0d8652ec, 0x1f9d45f1, 0x119448fa, 0x4be30393, 0x45ea0e98, 0x57f11985, 0x59f8148e, 0x73c737bf, 0x7dce3ab4, 0x6fd52da9, 0x61dc20a2, 0xad766df6, 0xa37f60fd, 0xb16477e0, 0xbf6d7aeb, 0x955259da, 0x9b5b54d1, 0x894043cc, 0x87494ec7, 0xdd3e05ae, 0xd33708a5, 0xc12c1fb8, 0xcf2512b3, 0xe51a3182, 0xeb133c89, 0xf9082b94, 0xf701269f, 0x4de6bd46, 0x43efb04d, 0x51f4a750, 0x5ffdaa5b, 0x75c2896a, 0x7bcb8461, 0x69d0937c, 0x67d99e77, 0x3daed51e, 0x33a7d815, 0x21bccf08, 0x2fb5c203, 0x058ae132, 0x0b83ec39, 0x1998fb24, 0x1791f62f, 0x764dd68d, 0x7844db86, 0x6a5fcc9b, 0x6456c190, 0x4e69e2a1, 0x4060efaa, 0x527bf8b7, 0x5c72f5bc, 0x0605bed5, 0x080cb3de, 0x1a17a4c3, 0x141ea9c8, 0x3e218af9, 0x302887f2, 0x223390ef, 0x2c3a9de4, 0x96dd063d, 0x98d40b36, 0x8acf1c2b, 0x84c61120, 0xaef93211, 0xa0f03f1a, 0xb2eb2807, 0xbce2250c, 0xe6956e65, 0xe89c636e, 0xfa877473, 0xf48e7978, 0xdeb15a49, 0xd0b85742, 0xc2a3405f, 0xccaa4d54, 0x41ecdaf7, 0x4fe5d7fc, 0x5dfec0e1, 0x53f7cdea, 0x79c8eedb, 0x77c1e3d0, 0x65daf4cd, 0x6bd3f9c6, 0x31a4b2af, 0x3fadbfa4, 0x2db6a8b9, 0x23bfa5b2, 0x09808683, 0x07898b88, 0x15929c95, 0x1b9b919e, 0xa17c0a47, 0xaf75074c, 0xbd6e1051, 0xb3671d5a, 0x99583e6b, 0x97513360, 0x854a247d, 0x8b432976, 0xd134621f, 0xdf3d6f14, 0xcd267809, 0xc32f7502, 0xe9105633, 0xe7195b38, 0xf5024c25, 0xfb0b412e, 0x9ad7618c, 0x94de6c87, 0x86c57b9a, 0x88cc7691, 0xa2f355a0, 0xacfa58ab, 0xbee14fb6, 0xb0e842bd, 0xea9f09d4, 0xe49604df, 0xf68d13c2, 0xf8841ec9, 0xd2bb3df8, 0xdcb230f3, 0xcea927ee, 0xc0a02ae5, 0x7a47b13c, 0x744ebc37, 0x6655ab2a, 0x685ca621, 0x42638510, 0x4c6a881b, 0x5e719f06, 0x5078920d, 0x0a0fd964, 0x0406d46f, 0x161dc372, 0x1814ce79, 0x322bed48, 0x3c22e043, 0x2e39f75e, 0x2030fa55, 0xec9ab701, 0xe293ba0a, 0xf088ad17, 0xfe81a01c, 0xd4be832d, 0xdab78e26, 0xc8ac993b, 0xc6a59430, 0x9cd2df59, 0x92dbd252, 0x80c0c54f, 0x8ec9c844, 0xa4f6eb75, 0xaaffe67e, 0xb8e4f163, 0xb6edfc68, 0x0c0a67b1, 0x02036aba, 0x10187da7, 0x1e1170ac, 0x342e539d, 0x3a275e96, 0x283c498b, 0x26354480, 0x7c420fe9, 0x724b02e2, 0x605015ff, 0x6e5918f4, 0x44663bc5, 0x4a6f36ce, 0x587421d3, 0x567d2cd8, 0x37a10c7a, 0x39a80171, 0x2bb3166c, 0x25ba1b67, 0x0f853856, 0x018c355d, 0x13972240, 0x1d9e2f4b, 0x47e96422, 0x49e06929, 0x5bfb7e34, 0x55f2733f, 0x7fcd500e, 0x71c45d05, 0x63df4a18, 0x6dd64713, 0xd731dcca, 0xd938d1c1, 0xcb23c6dc, 0xc52acbd7, 0xef15e8e6, 0xe11ce5ed, 0xf307f2f0, 0xfd0efffb, 0xa779b492, 0xa970b999, 0xbb6bae84, 0xb562a38f, 0x9f5d80be, 0x91548db5, 0x834f9aa8, 0x8d4697a3];
            Aes.U2 = [0x00000000, 0x0b0e090d, 0x161c121a, 0x1d121b17, 0x2c382434, 0x27362d39, 0x3a24362e, 0x312a3f23, 0x58704868, 0x537e4165, 0x4e6c5a72, 0x4562537f, 0x74486c5c, 0x7f466551, 0x62547e46, 0x695a774b, 0xb0e090d0, 0xbbee99dd, 0xa6fc82ca, 0xadf28bc7, 0x9cd8b4e4, 0x97d6bde9, 0x8ac4a6fe, 0x81caaff3, 0xe890d8b8, 0xe39ed1b5, 0xfe8ccaa2, 0xf582c3af, 0xc4a8fc8c, 0xcfa6f581, 0xd2b4ee96, 0xd9bae79b, 0x7bdb3bbb, 0x70d532b6, 0x6dc729a1, 0x66c920ac, 0x57e31f8f, 0x5ced1682, 0x41ff0d95, 0x4af10498, 0x23ab73d3, 0x28a57ade, 0x35b761c9, 0x3eb968c4, 0x0f9357e7, 0x049d5eea, 0x198f45fd, 0x12814cf0, 0xcb3bab6b, 0xc035a266, 0xdd27b971, 0xd629b07c, 0xe7038f5f, 0xec0d8652, 0xf11f9d45, 0xfa119448, 0x934be303, 0x9845ea0e, 0x8557f119, 0x8e59f814, 0xbf73c737, 0xb47dce3a, 0xa96fd52d, 0xa261dc20, 0xf6ad766d, 0xfda37f60, 0xe0b16477, 0xebbf6d7a, 0xda955259, 0xd19b5b54, 0xcc894043, 0xc787494e, 0xaedd3e05, 0xa5d33708, 0xb8c12c1f, 0xb3cf2512, 0x82e51a31, 0x89eb133c, 0x94f9082b, 0x9ff70126, 0x464de6bd, 0x4d43efb0, 0x5051f4a7, 0x5b5ffdaa, 0x6a75c289, 0x617bcb84, 0x7c69d093, 0x7767d99e, 0x1e3daed5, 0x1533a7d8, 0x0821bccf, 0x032fb5c2, 0x32058ae1, 0x390b83ec, 0x241998fb, 0x2f1791f6, 0x8d764dd6, 0x867844db, 0x9b6a5fcc, 0x906456c1, 0xa14e69e2, 0xaa4060ef, 0xb7527bf8, 0xbc5c72f5, 0xd50605be, 0xde080cb3, 0xc31a17a4, 0xc8141ea9, 0xf93e218a, 0xf2302887, 0xef223390, 0xe42c3a9d, 0x3d96dd06, 0x3698d40b, 0x2b8acf1c, 0x2084c611, 0x11aef932, 0x1aa0f03f, 0x07b2eb28, 0x0cbce225, 0x65e6956e, 0x6ee89c63, 0x73fa8774, 0x78f48e79, 0x49deb15a, 0x42d0b857, 0x5fc2a340, 0x54ccaa4d, 0xf741ecda, 0xfc4fe5d7, 0xe15dfec0, 0xea53f7cd, 0xdb79c8ee, 0xd077c1e3, 0xcd65daf4, 0xc66bd3f9, 0xaf31a4b2, 0xa43fadbf, 0xb92db6a8, 0xb223bfa5, 0x83098086, 0x8807898b, 0x9515929c, 0x9e1b9b91, 0x47a17c0a, 0x4caf7507, 0x51bd6e10, 0x5ab3671d, 0x6b99583e, 0x60975133, 0x7d854a24, 0x768b4329, 0x1fd13462, 0x14df3d6f, 0x09cd2678, 0x02c32f75, 0x33e91056, 0x38e7195b, 0x25f5024c, 0x2efb0b41, 0x8c9ad761, 0x8794de6c, 0x9a86c57b, 0x9188cc76, 0xa0a2f355, 0xabacfa58, 0xb6bee14f, 0xbdb0e842, 0xd4ea9f09, 0xdfe49604, 0xc2f68d13, 0xc9f8841e, 0xf8d2bb3d, 0xf3dcb230, 0xeecea927, 0xe5c0a02a, 0x3c7a47b1, 0x37744ebc, 0x2a6655ab, 0x21685ca6, 0x10426385, 0x1b4c6a88, 0x065e719f, 0x0d507892, 0x640a0fd9, 0x6f0406d4, 0x72161dc3, 0x791814ce, 0x48322bed, 0x433c22e0, 0x5e2e39f7, 0x552030fa, 0x01ec9ab7, 0x0ae293ba, 0x17f088ad, 0x1cfe81a0, 0x2dd4be83, 0x26dab78e, 0x3bc8ac99, 0x30c6a594, 0x599cd2df, 0x5292dbd2, 0x4f80c0c5, 0x448ec9c8, 0x75a4f6eb, 0x7eaaffe6, 0x63b8e4f1, 0x68b6edfc, 0xb10c0a67, 0xba02036a, 0xa710187d, 0xac1e1170, 0x9d342e53, 0x963a275e, 0x8b283c49, 0x80263544, 0xe97c420f, 0xe2724b02, 0xff605015, 0xf46e5918, 0xc544663b, 0xce4a6f36, 0xd3587421, 0xd8567d2c, 0x7a37a10c, 0x7139a801, 0x6c2bb316, 0x6725ba1b, 0x560f8538, 0x5d018c35, 0x40139722, 0x4b1d9e2f, 0x2247e964, 0x2949e069, 0x345bfb7e, 0x3f55f273, 0x0e7fcd50, 0x0571c45d, 0x1863df4a, 0x136dd647, 0xcad731dc, 0xc1d938d1, 0xdccb23c6, 0xd7c52acb, 0xe6ef15e8, 0xede11ce5, 0xf0f307f2, 0xfbfd0eff, 0x92a779b4, 0x99a970b9, 0x84bb6bae, 0x8fb562a3, 0xbe9f5d80, 0xb591548d, 0xa8834f9a, 0xa38d4697];
            Aes.U3 = [0x00000000, 0x0d0b0e09, 0x1a161c12, 0x171d121b, 0x342c3824, 0x3927362d, 0x2e3a2436, 0x23312a3f, 0x68587048, 0x65537e41, 0x724e6c5a, 0x7f456253, 0x5c74486c, 0x517f4665, 0x4662547e, 0x4b695a77, 0xd0b0e090, 0xddbbee99, 0xcaa6fc82, 0xc7adf28b, 0xe49cd8b4, 0xe997d6bd, 0xfe8ac4a6, 0xf381caaf, 0xb8e890d8, 0xb5e39ed1, 0xa2fe8cca, 0xaff582c3, 0x8cc4a8fc, 0x81cfa6f5, 0x96d2b4ee, 0x9bd9bae7, 0xbb7bdb3b, 0xb670d532, 0xa16dc729, 0xac66c920, 0x8f57e31f, 0x825ced16, 0x9541ff0d, 0x984af104, 0xd323ab73, 0xde28a57a, 0xc935b761, 0xc43eb968, 0xe70f9357, 0xea049d5e, 0xfd198f45, 0xf012814c, 0x6bcb3bab, 0x66c035a2, 0x71dd27b9, 0x7cd629b0, 0x5fe7038f, 0x52ec0d86, 0x45f11f9d, 0x48fa1194, 0x03934be3, 0x0e9845ea, 0x198557f1, 0x148e59f8, 0x37bf73c7, 0x3ab47dce, 0x2da96fd5, 0x20a261dc, 0x6df6ad76, 0x60fda37f, 0x77e0b164, 0x7aebbf6d, 0x59da9552, 0x54d19b5b, 0x43cc8940, 0x4ec78749, 0x05aedd3e, 0x08a5d337, 0x1fb8c12c, 0x12b3cf25, 0x3182e51a, 0x3c89eb13, 0x2b94f908, 0x269ff701, 0xbd464de6, 0xb04d43ef, 0xa75051f4, 0xaa5b5ffd, 0x896a75c2, 0x84617bcb, 0x937c69d0, 0x9e7767d9, 0xd51e3dae, 0xd81533a7, 0xcf0821bc, 0xc2032fb5, 0xe132058a, 0xec390b83, 0xfb241998, 0xf62f1791, 0xd68d764d, 0xdb867844, 0xcc9b6a5f, 0xc1906456, 0xe2a14e69, 0xefaa4060, 0xf8b7527b, 0xf5bc5c72, 0xbed50605, 0xb3de080c, 0xa4c31a17, 0xa9c8141e, 0x8af93e21, 0x87f23028, 0x90ef2233, 0x9de42c3a, 0x063d96dd, 0x0b3698d4, 0x1c2b8acf, 0x112084c6, 0x3211aef9, 0x3f1aa0f0, 0x2807b2eb, 0x250cbce2, 0x6e65e695, 0x636ee89c, 0x7473fa87, 0x7978f48e, 0x5a49deb1, 0x5742d0b8, 0x405fc2a3, 0x4d54ccaa, 0xdaf741ec, 0xd7fc4fe5, 0xc0e15dfe, 0xcdea53f7, 0xeedb79c8, 0xe3d077c1, 0xf4cd65da, 0xf9c66bd3, 0xb2af31a4, 0xbfa43fad, 0xa8b92db6, 0xa5b223bf, 0x86830980, 0x8b880789, 0x9c951592, 0x919e1b9b, 0x0a47a17c, 0x074caf75, 0x1051bd6e, 0x1d5ab367, 0x3e6b9958, 0x33609751, 0x247d854a, 0x29768b43, 0x621fd134, 0x6f14df3d, 0x7809cd26, 0x7502c32f, 0x5633e910, 0x5b38e719, 0x4c25f502, 0x412efb0b, 0x618c9ad7, 0x6c8794de, 0x7b9a86c5, 0x769188cc, 0x55a0a2f3, 0x58abacfa, 0x4fb6bee1, 0x42bdb0e8, 0x09d4ea9f, 0x04dfe496, 0x13c2f68d, 0x1ec9f884, 0x3df8d2bb, 0x30f3dcb2, 0x27eecea9, 0x2ae5c0a0, 0xb13c7a47, 0xbc37744e, 0xab2a6655, 0xa621685c, 0x85104263, 0x881b4c6a, 0x9f065e71, 0x920d5078, 0xd9640a0f, 0xd46f0406, 0xc372161d, 0xce791814, 0xed48322b, 0xe0433c22, 0xf75e2e39, 0xfa552030, 0xb701ec9a, 0xba0ae293, 0xad17f088, 0xa01cfe81, 0x832dd4be, 0x8e26dab7, 0x993bc8ac, 0x9430c6a5, 0xdf599cd2, 0xd25292db, 0xc54f80c0, 0xc8448ec9, 0xeb75a4f6, 0xe67eaaff, 0xf163b8e4, 0xfc68b6ed, 0x67b10c0a, 0x6aba0203, 0x7da71018, 0x70ac1e11, 0x539d342e, 0x5e963a27, 0x498b283c, 0x44802635, 0x0fe97c42, 0x02e2724b, 0x15ff6050, 0x18f46e59, 0x3bc54466, 0x36ce4a6f, 0x21d35874, 0x2cd8567d, 0x0c7a37a1, 0x017139a8, 0x166c2bb3, 0x1b6725ba, 0x38560f85, 0x355d018c, 0x22401397, 0x2f4b1d9e, 0x642247e9, 0x692949e0, 0x7e345bfb, 0x733f55f2, 0x500e7fcd, 0x5d0571c4, 0x4a1863df, 0x47136dd6, 0xdccad731, 0xd1c1d938, 0xc6dccb23, 0xcbd7c52a, 0xe8e6ef15, 0xe5ede11c, 0xf2f0f307, 0xfffbfd0e, 0xb492a779, 0xb999a970, 0xae84bb6b, 0xa38fb562, 0x80be9f5d, 0x8db59154, 0x9aa8834f, 0x97a38d46];
            Aes.U4 = [0x00000000, 0x090d0b0e, 0x121a161c, 0x1b171d12, 0x24342c38, 0x2d392736, 0x362e3a24, 0x3f23312a, 0x48685870, 0x4165537e, 0x5a724e6c, 0x537f4562, 0x6c5c7448, 0x65517f46, 0x7e466254, 0x774b695a, 0x90d0b0e0, 0x99ddbbee, 0x82caa6fc, 0x8bc7adf2, 0xb4e49cd8, 0xbde997d6, 0xa6fe8ac4, 0xaff381ca, 0xd8b8e890, 0xd1b5e39e, 0xcaa2fe8c, 0xc3aff582, 0xfc8cc4a8, 0xf581cfa6, 0xee96d2b4, 0xe79bd9ba, 0x3bbb7bdb, 0x32b670d5, 0x29a16dc7, 0x20ac66c9, 0x1f8f57e3, 0x16825ced, 0x0d9541ff, 0x04984af1, 0x73d323ab, 0x7ade28a5, 0x61c935b7, 0x68c43eb9, 0x57e70f93, 0x5eea049d, 0x45fd198f, 0x4cf01281, 0xab6bcb3b, 0xa266c035, 0xb971dd27, 0xb07cd629, 0x8f5fe703, 0x8652ec0d, 0x9d45f11f, 0x9448fa11, 0xe303934b, 0xea0e9845, 0xf1198557, 0xf8148e59, 0xc737bf73, 0xce3ab47d, 0xd52da96f, 0xdc20a261, 0x766df6ad, 0x7f60fda3, 0x6477e0b1, 0x6d7aebbf, 0x5259da95, 0x5b54d19b, 0x4043cc89, 0x494ec787, 0x3e05aedd, 0x3708a5d3, 0x2c1fb8c1, 0x2512b3cf, 0x1a3182e5, 0x133c89eb, 0x082b94f9, 0x01269ff7, 0xe6bd464d, 0xefb04d43, 0xf4a75051, 0xfdaa5b5f, 0xc2896a75, 0xcb84617b, 0xd0937c69, 0xd99e7767, 0xaed51e3d, 0xa7d81533, 0xbccf0821, 0xb5c2032f, 0x8ae13205, 0x83ec390b, 0x98fb2419, 0x91f62f17, 0x4dd68d76, 0x44db8678, 0x5fcc9b6a, 0x56c19064, 0x69e2a14e, 0x60efaa40, 0x7bf8b752, 0x72f5bc5c, 0x05bed506, 0x0cb3de08, 0x17a4c31a, 0x1ea9c814, 0x218af93e, 0x2887f230, 0x3390ef22, 0x3a9de42c, 0xdd063d96, 0xd40b3698, 0xcf1c2b8a, 0xc6112084, 0xf93211ae, 0xf03f1aa0, 0xeb2807b2, 0xe2250cbc, 0x956e65e6, 0x9c636ee8, 0x877473fa, 0x8e7978f4, 0xb15a49de, 0xb85742d0, 0xa3405fc2, 0xaa4d54cc, 0xecdaf741, 0xe5d7fc4f, 0xfec0e15d, 0xf7cdea53, 0xc8eedb79, 0xc1e3d077, 0xdaf4cd65, 0xd3f9c66b, 0xa4b2af31, 0xadbfa43f, 0xb6a8b92d, 0xbfa5b223, 0x80868309, 0x898b8807, 0x929c9515, 0x9b919e1b, 0x7c0a47a1, 0x75074caf, 0x6e1051bd, 0x671d5ab3, 0x583e6b99, 0x51336097, 0x4a247d85, 0x4329768b, 0x34621fd1, 0x3d6f14df, 0x267809cd, 0x2f7502c3, 0x105633e9, 0x195b38e7, 0x024c25f5, 0x0b412efb, 0xd7618c9a, 0xde6c8794, 0xc57b9a86, 0xcc769188, 0xf355a0a2, 0xfa58abac, 0xe14fb6be, 0xe842bdb0, 0x9f09d4ea, 0x9604dfe4, 0x8d13c2f6, 0x841ec9f8, 0xbb3df8d2, 0xb230f3dc, 0xa927eece, 0xa02ae5c0, 0x47b13c7a, 0x4ebc3774, 0x55ab2a66, 0x5ca62168, 0x63851042, 0x6a881b4c, 0x719f065e, 0x78920d50, 0x0fd9640a, 0x06d46f04, 0x1dc37216, 0x14ce7918, 0x2bed4832, 0x22e0433c, 0x39f75e2e, 0x30fa5520, 0x9ab701ec, 0x93ba0ae2, 0x88ad17f0, 0x81a01cfe, 0xbe832dd4, 0xb78e26da, 0xac993bc8, 0xa59430c6, 0xd2df599c, 0xdbd25292, 0xc0c54f80, 0xc9c8448e, 0xf6eb75a4, 0xffe67eaa, 0xe4f163b8, 0xedfc68b6, 0x0a67b10c, 0x036aba02, 0x187da710, 0x1170ac1e, 0x2e539d34, 0x275e963a, 0x3c498b28, 0x35448026, 0x420fe97c, 0x4b02e272, 0x5015ff60, 0x5918f46e, 0x663bc544, 0x6f36ce4a, 0x7421d358, 0x7d2cd856, 0xa10c7a37, 0xa8017139, 0xb3166c2b, 0xba1b6725, 0x8538560f, 0x8c355d01, 0x97224013, 0x9e2f4b1d, 0xe9642247, 0xe0692949, 0xfb7e345b, 0xf2733f55, 0xcd500e7f, 0xc45d0571, 0xdf4a1863, 0xd647136d, 0x31dccad7, 0x38d1c1d9, 0x23c6dccb, 0x2acbd7c5, 0x15e8e6ef, 0x1ce5ede1, 0x07f2f0f3, 0x0efffbfd, 0x79b492a7, 0x70b999a9, 0x6bae84bb, 0x62a38fb5, 0x5d80be9f, 0x548db591, 0x4f9aa883, 0x4697a38d];
            return Aes;
        }());
        Cryptography.Aes = Aes;
    })(Cryptography = AntShares.Cryptography || (AntShares.Cryptography = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Cryptography;
    (function (Cryptography) {
        var Base58 = (function () {
            function Base58() {
            }
            Base58.decode = function (input) {
                var bi = AntShares.BigInteger.Zero;
                for (var i = input.length - 1; i >= 0; i--) {
                    var index = Base58.Alphabet.indexOf(input[i]);
                    if (index == -1)
                        throw new RangeError();
                    bi = AntShares.BigInteger.add(bi, AntShares.BigInteger.multiply(AntShares.BigInteger.pow(Base58.Alphabet.length, input.length - 1 - i), index));
                }
                var bytes = bi.toUint8Array();
                var leadingZeros = 0;
                for (var i = 0; i < input.length && input[i] == Base58.Alphabet[0]; i++) {
                    leadingZeros++;
                }
                var tmp = new Uint8Array(bytes.length + leadingZeros);
                for (var i = 0; i < bytes.length; i++)
                    tmp[i + leadingZeros] = bytes[bytes.length - 1 - i];
                return tmp;
            };
            Base58.encode = function (input) {
                var value = AntShares.BigInteger.fromUint8Array(input, 1, false);
                var s = "";
                while (!value.isZero()) {
                    var r = AntShares.BigInteger.divRem(value, Base58.Alphabet.length);
                    s = Base58.Alphabet[r.remainder.toInt32()] + s;
                    value = r.result;
                }
                for (var i = 0; i < input.length; i++) {
                    if (input[i] == 0)
                        s = Base58.Alphabet[0] + s;
                    else
                        break;
                }
                return s;
            };
            Base58.Alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
            return Base58;
        }());
        Cryptography.Base58 = Base58;
    })(Cryptography = AntShares.Cryptography || (AntShares.Cryptography = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Cryptography;
    (function (Cryptography) {
        var CryptoKey = (function () {
            function CryptoKey(type, extractable, algorithm, usages) {
                this.type = type;
                this.extractable = extractable;
                this.algorithm = algorithm;
                this.usages = usages;
            }
            return CryptoKey;
        }());
        var AesCryptoKey = (function (_super) {
            __extends(AesCryptoKey, _super);
            function AesCryptoKey(_key_bytes) {
                _super.call(this, "secret", true, { name: "AES-CBC", length: _key_bytes.length * 8 }, ["encrypt", "decrypt"]);
                this._key_bytes = _key_bytes;
            }
            AesCryptoKey.create = function (length) {
                if (length != 128 && length != 192 && length != 256)
                    throw new RangeError();
                var key = new AesCryptoKey(new Uint8Array(length / 8));
                window.crypto.getRandomValues(key._key_bytes);
                return key;
            };
            AesCryptoKey.prototype.export = function () {
                return this._key_bytes;
            };
            AesCryptoKey.import = function (keyData) {
                if (keyData.byteLength != 16 && keyData.byteLength != 24 && keyData.byteLength != 32)
                    throw new RangeError();
                return new AesCryptoKey(Uint8Array.fromArrayBuffer(keyData));
            };
            return AesCryptoKey;
        }(CryptoKey));
        Cryptography.AesCryptoKey = AesCryptoKey;
        var ECDsaCryptoKey = (function (_super) {
            __extends(ECDsaCryptoKey, _super);
            function ECDsaCryptoKey(publicKey, privateKey) {
                _super.call(this, privateKey == null ? "public" : "private", true, { name: "ECDSA", namedCurve: "P-256" }, [privateKey == null ? "verify" : "sign"]);
                this.publicKey = publicKey;
                this.privateKey = privateKey;
            }
            return ECDsaCryptoKey;
        }(CryptoKey));
        Cryptography.ECDsaCryptoKey = ECDsaCryptoKey;
    })(Cryptography = AntShares.Cryptography || (AntShares.Cryptography = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Cryptography;
    (function (Cryptography) {
        var _secp256k1;
        var _secp256r1;
        var ECCurve = (function () {
            function ECCurve(Q, A, B, N, G) {
                this.Q = Q;
                this.A = new Cryptography.ECFieldElement(A, this);
                this.B = new Cryptography.ECFieldElement(B, this);
                this.N = N;
                this.Infinity = new Cryptography.ECPoint(null, null, this);
                this.G = Cryptography.ECPoint.decodePoint(G, this);
            }
            Object.defineProperty(ECCurve, "secp256k1", {
                get: function () {
                    return _secp256k1 || (_secp256k1 = new ECCurve(AntShares.BigInteger.fromString("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F", 16), AntShares.BigInteger.Zero, new AntShares.BigInteger(7), AntShares.BigInteger.fromString("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141", 16), ("04" + "79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798" + "483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8").hexToBytes()));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ECCurve, "secp256r1", {
                get: function () {
                    return _secp256r1 || (_secp256r1 = new ECCurve(AntShares.BigInteger.fromString("FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF", 16), AntShares.BigInteger.fromString("FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFC", 16), AntShares.BigInteger.fromString("5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B", 16), AntShares.BigInteger.fromString("FFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551", 16), ("04" + "6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296" + "4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5").hexToBytes()));
                },
                enumerable: true,
                configurable: true
            });
            return ECCurve;
        }());
        Cryptography.ECCurve = ECCurve;
    })(Cryptography = AntShares.Cryptography || (AntShares.Cryptography = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Cryptography;
    (function (Cryptography) {
        var ECDsa = (function () {
            function ECDsa(key) {
                this.key = key;
            }
            ECDsa.calculateE = function (n, message) {
                return AntShares.BigInteger.fromUint8Array(new Uint8Array(Cryptography.Sha256.computeHash(message)), 1, false);
            };
            ECDsa.generateKey = function (curve) {
                var prikey = new Uint8Array(32);
                window.crypto.getRandomValues(prikey);
                var pubkey = Cryptography.ECPoint.multiply(curve.G, prikey);
                return {
                    privateKey: new Cryptography.ECDsaCryptoKey(pubkey, prikey),
                    publicKey: new Cryptography.ECDsaCryptoKey(pubkey)
                };
            };
            ECDsa.prototype.sign = function (message) {
                if (this.key.privateKey == null)
                    throw new Error();
                var e = ECDsa.calculateE(this.key.publicKey.curve.N, message);
                var d = AntShares.BigInteger.fromUint8Array(this.key.privateKey, 1, false);
                var r, s;
                do {
                    var k = void 0;
                    do {
                        do {
                            k = AntShares.BigInteger.random(this.key.publicKey.curve.N.bitLength(), window.crypto);
                        } while (k.sign() == 0 || k.compareTo(this.key.publicKey.curve.N) >= 0);
                        var p = Cryptography.ECPoint.multiply(this.key.publicKey.curve.G, k);
                        var x = p.x.value;
                        r = x.mod(this.key.publicKey.curve.N);
                    } while (r.sign() == 0);
                    s = k.modInverse(this.key.publicKey.curve.N).multiply(e.add(d.multiply(r))).mod(this.key.publicKey.curve.N);
                    if (s.compareTo(this.key.publicKey.curve.N.divide(2)) > 0) {
                        s = this.key.publicKey.curve.N.subtract(s);
                    }
                } while (s.sign() == 0);
                var arr = new Uint8Array(64);
                Array.copy(r.toUint8Array(false, 32), 0, arr, 0, 32);
                Array.copy(s.toUint8Array(false, 32), 0, arr, 32, 32);
                return arr.buffer;
            };
            ECDsa.sumOfTwoMultiplies = function (P, k, Q, l) {
                var m = Math.max(k.bitLength(), l.bitLength());
                var Z = Cryptography.ECPoint.add(P, Q);
                var R = P.curve.Infinity;
                for (var i = m - 1; i >= 0; --i) {
                    R = R.twice();
                    if (k.testBit(i)) {
                        if (l.testBit(i))
                            R = Cryptography.ECPoint.add(R, Z);
                        else
                            R = Cryptography.ECPoint.add(R, P);
                    }
                    else {
                        if (l.testBit(i))
                            R = Cryptography.ECPoint.add(R, Q);
                    }
                }
                return R;
            };
            ECDsa.prototype.verify = function (message, signature) {
                var arr = Uint8Array.fromArrayBuffer(signature);
                var r = AntShares.BigInteger.fromUint8Array(arr.subarray(0, 32), 1, false);
                var s = AntShares.BigInteger.fromUint8Array(arr.subarray(32, 64), 1, false);
                if (r.compareTo(this.key.publicKey.curve.N) >= 0 || s.compareTo(this.key.publicKey.curve.N) >= 0)
                    return false;
                var e = ECDsa.calculateE(this.key.publicKey.curve.N, message);
                var c = s.modInverse(this.key.publicKey.curve.N);
                var u1 = e.multiply(c).mod(this.key.publicKey.curve.N);
                var u2 = r.multiply(c).mod(this.key.publicKey.curve.N);
                var point = ECDsa.sumOfTwoMultiplies(this.key.publicKey.curve.G, u1, this.key.publicKey, u2);
                var v = point.x.value.mod(this.key.publicKey.curve.N);
                return v.equals(r);
            };
            ECDsa.verifyFromPubKey = function (message, signature, publicKey)
            {
                var codes = new Uint8Array(message.length);
                for (var i = 0; i < codes.length; i++)
                    codes[i] = message.charCodeAt(i);
                var r = AntShares.BigInteger.fromUint8Array(signature.subarray(0, 32), 1, false);
                var s = AntShares.BigInteger.fromUint8Array(signature.subarray(32, 64), 1, false);
                if (r.compareTo(publicKey.curve.N) >= 0 || s.compareTo(publicKey.curve.N) >= 0)
                    return false;
                var e = Cryptography.ECDsa.calculateE(publicKey.curve.N, codes);
                var c = s.modInverse(publicKey.curve.N);
                var u1 = e.multiply(c).mod(publicKey.curve.N);
                var u2 = r.multiply(c).mod(publicKey.curve.N);
                var point = Cryptography.ECDsa.sumOfTwoMultiplies(publicKey.curve.G, u1, publicKey, u2);
                var v = point.x.value.mod(publicKey.curve.N);
                return v.equals(r);
            };
            return ECDsa;
        }());
        Cryptography.ECDsa = ECDsa;
    })(Cryptography = AntShares.Cryptography || (AntShares.Cryptography = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Cryptography;
    (function (Cryptography) {
        var ECFieldElement = (function () {
            function ECFieldElement(value, curve) {
                this.value = value;
                this.curve = curve;
                if (AntShares.BigInteger.compare(value, curve.Q) >= 0)
                    throw new RangeError("x value too large in field element");
            }
            ECFieldElement.prototype.add = function (other) {
                return new ECFieldElement(this.value.add(other.value).mod(this.curve.Q), this.curve);
            };
            ECFieldElement.prototype.compareTo = function (other) {
                if (this === other)
                    return 0;
                return this.value.compareTo(other.value);
            };
            ECFieldElement.prototype.divide = function (other) {
                return new ECFieldElement(this.value.multiply(other.value.modInverse(this.curve.Q)).mod(this.curve.Q), this.curve);
            };
            ECFieldElement.prototype.equals = function (other) {
                return this.value.equals(other.value);
            };
            ECFieldElement.fastLucasSequence = function (p, P, Q, k) {
                var n = k.bitLength();
                var s = k.getLowestSetBit();
                console.assert(k.testBit(s));
                var Uh = AntShares.BigInteger.One;
                var Vl = new AntShares.BigInteger(2);
                var Vh = P;
                var Ql = AntShares.BigInteger.One;
                var Qh = AntShares.BigInteger.One;
                for (var j = n - 1; j >= s + 1; --j) {
                    Ql = AntShares.BigInteger.mod(AntShares.BigInteger.multiply(Ql, Qh), p);
                    if (k.testBit(j)) {
                        Qh = Ql.multiply(Q).mod(p);
                        Uh = Uh.multiply(Vh).mod(p);
                        Vl = Vh.multiply(Vl).subtract(P.multiply(Ql)).mod(p);
                        Vh = Vh.multiply(Vh).subtract(Qh.leftShift(1)).mod(p);
                    }
                    else {
                        Qh = Ql;
                        Uh = Uh.multiply(Vl).subtract(Ql).mod(p);
                        Vh = Vh.multiply(Vl).subtract(P.multiply(Ql)).mod(p);
                        Vl = Vl.multiply(Vl).subtract(Ql.leftShift(1)).mod(p);
                    }
                }
                Ql = Ql.multiply(Qh).mod(p);
                Qh = Ql.multiply(Q).mod(p);
                Uh = Uh.multiply(Vl).subtract(Ql).mod(p);
                Vl = Vh.multiply(Vl).subtract(P.multiply(Ql)).mod(p);
                Ql = Ql.multiply(Qh).mod(p);
                for (var j = 1; j <= s; ++j) {
                    Uh = Uh.multiply(Vl).multiply(p);
                    Vl = Vl.multiply(Vl).subtract(Ql.leftShift(1)).mod(p);
                    Ql = Ql.multiply(Ql).mod(p);
                }
                return [Uh, Vl];
            };
            ECFieldElement.prototype.multiply = function (other) {
                return new ECFieldElement(this.value.multiply(other.value).mod(this.curve.Q), this.curve);
            };
            ECFieldElement.prototype.negate = function () {
                return new ECFieldElement(this.value.negate().mod(this.curve.Q), this.curve);
            };
            ECFieldElement.prototype.sqrt = function () {
                if (this.curve.Q.testBit(1)) {
                    var z = new ECFieldElement(AntShares.BigInteger.modPow(this.value, this.curve.Q.rightShift(2).add(1), this.curve.Q), this.curve);
                    return z.square().equals(this) ? z : null;
                }
                var qMinusOne = this.curve.Q.subtract(1);
                var legendreExponent = qMinusOne.rightShift(1);
                if (AntShares.BigInteger.modPow(this.value, legendreExponent, this.curve.Q).equals(1))
                    return null;
                var u = qMinusOne.rightShift(2);
                var k = u.leftShift(1).add(1);
                var Q = this.value;
                var fourQ = Q.leftShift(2).mod(this.curve.Q);
                var U, V;
                do {
                    var P = void 0;
                    do {
                        P = AntShares.BigInteger.random(this.curve.Q.bitLength());
                    } while (P.compareTo(this.curve.Q) >= 0 || !AntShares.BigInteger.modPow(P.multiply(P).subtract(fourQ), legendreExponent, this.curve.Q).equals(qMinusOne));
                    var result = ECFieldElement.fastLucasSequence(this.curve.Q, P, Q, k);
                    U = result[0];
                    V = result[1];
                    if (V.multiply(V).mod(this.curve.Q).equals(fourQ)) {
                        if (V.testBit(0)) {
                            V = V.add(this.curve.Q);
                        }
                        V = V.rightShift(1);
                        console.assert(V.multiply(V).mod(this.curve.Q).equals(this.value));
                        return new ECFieldElement(V, this.curve);
                    }
                } while (U.equals(AntShares.BigInteger.One) || U.equals(qMinusOne));
                return null;
            };
            ECFieldElement.prototype.square = function () {
                return new ECFieldElement(this.value.multiply(this.value).mod(this.curve.Q), this.curve);
            };
            ECFieldElement.prototype.subtract = function (other) {
                return new ECFieldElement(this.value.subtract(other.value).mod(this.curve.Q), this.curve);
            };
            return ECFieldElement;
        }());
        Cryptography.ECFieldElement = ECFieldElement;
    })(Cryptography = AntShares.Cryptography || (AntShares.Cryptography = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Cryptography;
    (function (Cryptography) {
        var ECPoint = (function () {
            function ECPoint(x, y, curve) {
                this.x = x;
                this.y = y;
                this.curve = curve;
                if ((x == null) != (y == null))
                    throw new RangeError("Exactly one of the field elements is null");
            }
            ECPoint.add = function (x, y) {
                if (x.isInfinity())
                    return y;
                if (y.isInfinity())
                    return x;
                if (x.x.equals(y.x)) {
                    if (x.y.equals(y.y))
                        return x.twice();
                    console.assert(x.y.equals(y.y.negate()));
                    return x.curve.Infinity;
                }
                var gamma = y.y.subtract(x.y).divide(y.x.subtract(x.x));
                var x3 = gamma.square().subtract(x.x).subtract(y.x);
                var y3 = gamma.multiply(x.x.subtract(x3)).subtract(x.y);
                return new ECPoint(x3, y3, x.curve);
            };
            ECPoint.prototype.compareTo = function (other) {
                if (this === other)
                    return 0;
                var result = this.x.compareTo(other.x);
                if (result != 0)
                    return result;
                return this.y.compareTo(other.y);
            };
            ECPoint.decodePoint = function (encoded, curve) {
                var p;
                var expectedLength = Math.ceil(curve.Q.bitLength() / 8);
                switch (encoded[0]) {
                    case 0x00:
                        {
                            if (encoded.length != 1)
                                throw new RangeError("Incorrect length for infinity encoding");
                            p = curve.Infinity;
                            break;
                        }
                    case 0x02:
                    case 0x03:
                        {
                            if (encoded.length != (expectedLength + 1))
                                throw new RangeError("Incorrect length for compressed encoding");
                            var yTilde = encoded[0] & 1;
                            var X1 = AntShares.BigInteger.fromUint8Array(encoded.subarray(1), 1, false);
                            p = ECPoint.decompressPoint(yTilde, X1, curve);
                            break;
                        }
                    case 0x04:
                    case 0x06:
                    case 0x07:
                        {
                            if (encoded.length != (2 * expectedLength + 1))
                                throw new RangeError("Incorrect length for uncompressed/hybrid encoding");
                            var X1 = AntShares.BigInteger.fromUint8Array(encoded.subarray(1, 1 + expectedLength), 1, false);
                            var Y1 = AntShares.BigInteger.fromUint8Array(encoded.subarray(1 + expectedLength), 1, false);
                            p = new ECPoint(new Cryptography.ECFieldElement(X1, curve), new Cryptography.ECFieldElement(Y1, curve), curve);
                            break;
                        }
                    default:
                        throw new RangeError("Invalid point encoding " + encoded[0]);
                }
                return p;
            };
            ECPoint.decompressPoint = function (yTilde, X1, curve) {
                var x = new Cryptography.ECFieldElement(X1, curve);
                var alpha = x.multiply(x.square().add(curve.A)).add(curve.B);
                var beta = alpha.sqrt();
                if (beta == null)
                    throw new RangeError("Invalid point compression");
                var betaValue = beta.value;
                var bit0 = betaValue.isEven() ? 0 : 1;
                if (bit0 != yTilde) {
                    beta = new Cryptography.ECFieldElement(curve.Q.subtract(betaValue), curve);
                }
                return new ECPoint(x, beta, curve);
            };
            ECPoint.deserializeFrom = function (reader, curve) {
                var expectedLength = (curve.Q.bitLength() + 7) / 8;
                var array = new Uint8Array(1 + expectedLength * 2);
                array[0] = reader.readByte();
                switch (array[0]) {
                    case 0x00:
                        return curve.Infinity;
                    case 0x02:
                    case 0x03:
                        reader.read(array.buffer, 1, expectedLength);
                        return ECPoint.decodePoint(new Uint8Array(array.buffer, 0, 33), curve);
                    case 0x04:
                    case 0x06:
                    case 0x07:
                        reader.read(array.buffer, 1, expectedLength * 2);
                        return ECPoint.decodePoint(array, curve);
                    default:
                        throw new Error("Invalid point encoding " + array[0]);
                }
            };
            ECPoint.prototype.encodePoint = function (commpressed) {
                if (this.isInfinity())
                    return new Uint8Array(1);
                var data;
                if (commpressed) {
                    data = new Uint8Array(33);
                }
                else {
                    data = new Uint8Array(65);
                    var yBytes = this.y.value.toUint8Array();
                    for (var i = 0; i < yBytes.length; i++)
                        data[65 - yBytes.length + i] = yBytes[yBytes.length - 1 - i];
                }
                var xBytes = this.x.value.toUint8Array();
                for (var i = 0; i < xBytes.length; i++)
                    data[33 - xBytes.length + i] = xBytes[xBytes.length - 1 - i];
                data[0] = commpressed ? this.y.value.isEven() ? 0x02 : 0x03 : 0x04;
                return data;
            };
            ECPoint.prototype.equals = function (other) {
                if (this === other)
                    return true;
                if (null === other)
                    return false;
                if (this.isInfinity && other.isInfinity)
                    return true;
                if (this.isInfinity || other.isInfinity)
                    return false;
                return this.x.equals(other.x) && this.y.equals(other.y);
            };
            ECPoint.fromUint8Array = function (arr, curve) {
                switch (arr.length) {
                    case 33:
                    case 65:
                        return ECPoint.decodePoint(arr, curve);
                    case 64:
                    case 72:
                        {
                            var arr_new = new Uint8Array(65);
                            arr_new[0] = 0x04;
                            arr_new.set(arr.subarray(arr.length - 64), 1);
                            return ECPoint.decodePoint(arr_new, curve);
                        }
                    case 96:
                    case 104:
                        {
                            var arr_new = new Uint8Array(65);
                            arr_new[0] = 0x04;
                            arr_new.set(arr.subarray(arr.length - 96, arr.length - 32), 1);
                            return ECPoint.decodePoint(arr_new, curve);
                        }
                    default:
                        throw new RangeError();
                }
            };
            ECPoint.prototype.isInfinity = function () {
                return this.x == null && this.y == null;
            };
            ECPoint.multiply = function (p, n) {
                var k = n instanceof Uint8Array ? AntShares.BigInteger.fromUint8Array(n, 1, false) : n;
                if (p.isInfinity())
                    return p;
                if (k.isZero())
                    return p.curve.Infinity;
                var m = k.bitLength();
                var width;
                var reqPreCompLen;
                if (m < 13) {
                    width = 2;
                    reqPreCompLen = 1;
                }
                else if (m < 41) {
                    width = 3;
                    reqPreCompLen = 2;
                }
                else if (m < 121) {
                    width = 4;
                    reqPreCompLen = 4;
                }
                else if (m < 337) {
                    width = 5;
                    reqPreCompLen = 8;
                }
                else if (m < 897) {
                    width = 6;
                    reqPreCompLen = 16;
                }
                else if (m < 2305) {
                    width = 7;
                    reqPreCompLen = 32;
                }
                else {
                    width = 8;
                    reqPreCompLen = 127;
                }
                var preCompLen = 1;
                var preComp = [p];
                var twiceP = p.twice();
                if (preCompLen < reqPreCompLen) {
                    var oldPreComp = preComp;
                    preComp = new Array(reqPreCompLen);
                    for (var i = 0; i < preCompLen; i++)
                        preComp[i] = oldPreComp[i];
                    for (var i = preCompLen; i < reqPreCompLen; i++) {
                        preComp[i] = ECPoint.add(twiceP, preComp[i - 1]);
                    }
                }
                var wnaf = ECPoint.windowNaf(width, k);
                var l = wnaf.length;
                var q = p.curve.Infinity;
                for (var i = l - 1; i >= 0; i--) {
                    q = q.twice();
                    if (wnaf[i] != 0) {
                        if (wnaf[i] > 0) {
                            q = ECPoint.add(q, preComp[Math.floor((wnaf[i] - 1) / 2)]);
                        }
                        else {
                            q = ECPoint.subtract(q, preComp[Math.floor((-wnaf[i] - 1) / 2)]);
                        }
                    }
                }
                return q;
            };
            ECPoint.prototype.negate = function () {
                return new ECPoint(this.x, this.y.negate(), this.curve);
            };
            ECPoint.parse = function (str, curve) {
                return ECPoint.decodePoint(str.hexToBytes(), curve);
            };
            ECPoint.subtract = function (x, y) {
                if (y.isInfinity())
                    return x;
                return ECPoint.add(x, y.negate());
            };
            ECPoint.prototype.toString = function () {
                return this.encodePoint(true).toHexString();
            };
            ECPoint.prototype.twice = function () {
                if (this.isInfinity())
                    return this;
                if (this.y.value.sign() == 0)
                    return this.curve.Infinity;
                var TWO = new Cryptography.ECFieldElement(new AntShares.BigInteger(2), this.curve);
                var THREE = new Cryptography.ECFieldElement(new AntShares.BigInteger(3), this.curve);
                var gamma = this.x.square().multiply(THREE).add(this.curve.A).divide(this.y.multiply(TWO));
                var x3 = gamma.square().subtract(this.x.multiply(TWO));
                var y3 = gamma.multiply(this.x.subtract(x3)).subtract(this.y);
                return new ECPoint(x3, y3, this.curve);
            };
            ECPoint.windowNaf = function (width, k) {
                var wnaf = new Array(k.bitLength() + 1);
                var pow2wB = 1 << width;
                var i = 0;
                var length = 0;
                while (k.sign() > 0) {
                    if (!k.isEven()) {
                        var remainder = AntShares.BigInteger.remainder(k, pow2wB);
                        if (remainder.testBit(width - 1)) {
                            wnaf[i] = AntShares.BigInteger.subtract(remainder, pow2wB).toInt32();
                        }
                        else {
                            wnaf[i] = remainder.toInt32();
                        }
                        k = k.subtract(wnaf[i]);
                        length = i;
                    }
                    else {
                        wnaf[i] = 0;
                    }
                    k = k.rightShift(1);
                    i++;
                }
                wnaf.length = length + 1;
                return wnaf;
            };
            return ECPoint;
        }());
        Cryptography.ECPoint = ECPoint;
    })(Cryptography = AntShares.Cryptography || (AntShares.Cryptography = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Cryptography;
    (function (Cryptography) {
        var RandomNumberGenerator = (function () {
            function RandomNumberGenerator() {
            }
            RandomNumberGenerator.addEntropy = function (data, strength) {
                if (RandomNumberGenerator._stopped)
                    return;
                for (var i = 0; i < data.length; i++)
                    if (data[i] != null && data[i] != 0) {
                        RandomNumberGenerator._entropy.push(data[i]);
                        RandomNumberGenerator._strength += strength;
                        RandomNumberGenerator._key = null;
                    }
                if (RandomNumberGenerator._strength >= 512)
                    RandomNumberGenerator.stopCollectors();
            };
            RandomNumberGenerator.getRandomValues = function (array) {
                if (RandomNumberGenerator._strength < 256)
                    throw new Error();
                if (RandomNumberGenerator._key == null) {
                    var data = new Float64Array(RandomNumberGenerator._entropy);
                    RandomNumberGenerator._key = new Uint8Array(Cryptography.Sha256.computeHash(data));
                }
                var aes = new Cryptography.Aes(RandomNumberGenerator._key, RandomNumberGenerator.getWeakRandomValues(16));
                var src = new Uint8Array(16);
                var dst = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
                for (var i = 0; i < dst.length; i += 16) {
                    aes.encryptBlock(RandomNumberGenerator.getWeakRandomValues(16), src);
                    Array.copy(src, 0, dst, i, Math.min(dst.length - i, 16));
                }
                return array;
            };
            RandomNumberGenerator.getWeakRandomValues = function (array) {
                var buffer = typeof array === "number" ? new Uint8Array(array) : array;
                for (var i = 0; i < buffer.length; i++)
                    buffer[i] = Math.random() * 256;
                return buffer;
            };
            RandomNumberGenerator.processDeviceMotionEvent = function (event) {
                RandomNumberGenerator.addEntropy([event.accelerationIncludingGravity.x, event.accelerationIncludingGravity.y, event.accelerationIncludingGravity.z], 1);
                RandomNumberGenerator.processEvent(event);
            };
            RandomNumberGenerator.processEvent = function (event) {
                if (window.performance && window.performance.now)
                    RandomNumberGenerator.addEntropy([window.performance.now()], 20);
                else
                    RandomNumberGenerator.addEntropy([event.timeStamp], 2);
            };
            RandomNumberGenerator.processMouseEvent = function (event) {
                RandomNumberGenerator.addEntropy([event.clientX, event.clientY, event.offsetX, event.offsetY, event.screenX, event.screenY], 4);
                RandomNumberGenerator.processEvent(event);
            };
            RandomNumberGenerator.processTouchEvent = function (event) {
                var touches = event.changedTouches || event.touches;
                for (var i = 0; i < touches.length; i++)
                    RandomNumberGenerator.addEntropy([touches[i].clientX, touches[i].clientY, touches[i].radiusX, touches[i].radiusY, touches[i].force], 1);
                RandomNumberGenerator.processEvent(event);
            };
            RandomNumberGenerator.startCollectors = function () {
                if (RandomNumberGenerator._started)
                    return;
                window.addEventListener("load", RandomNumberGenerator.processEvent, false);
                window.addEventListener("mousemove", RandomNumberGenerator.processMouseEvent, false);
                window.addEventListener("keypress", RandomNumberGenerator.processEvent, false);
                window.addEventListener("devicemotion", RandomNumberGenerator.processDeviceMotionEvent, false);
                window.addEventListener("touchmove", RandomNumberGenerator.processTouchEvent, false);
                RandomNumberGenerator._started = true;
            };
            RandomNumberGenerator.stopCollectors = function () {
                if (RandomNumberGenerator._stopped)
                    return;
                window.removeEventListener("load", RandomNumberGenerator.processEvent, false);
                window.removeEventListener("mousemove", RandomNumberGenerator.processMouseEvent, false);
                window.removeEventListener("keypress", RandomNumberGenerator.processEvent, false);
                window.removeEventListener("devicemotion", RandomNumberGenerator.processDeviceMotionEvent, false);
                window.removeEventListener("touchmove", RandomNumberGenerator.processTouchEvent, false);
                RandomNumberGenerator._stopped = true;
            };
            RandomNumberGenerator._entropy = [];
            RandomNumberGenerator._strength = 0;
            RandomNumberGenerator._started = false;
            RandomNumberGenerator._stopped = false;
            return RandomNumberGenerator;
        }());
        Cryptography.RandomNumberGenerator = RandomNumberGenerator;
    })(Cryptography = AntShares.Cryptography || (AntShares.Cryptography = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Cryptography;
    (function (Cryptography) {
        String.prototype.base58Decode = function () {
            return Cryptography.Base58.decode(this);
        };
        String.prototype.base64UrlDecode = function () {
            var str = window.atob(this.replace(/-/g, '+').replace(/_/g, '/'));
            var arr = new Uint8Array(str.length);
            for (var i = 0; i < str.length; i++)
                arr[i] = str.charCodeAt(i);
            return arr;
        };
        String.prototype.toAesKey = function () {
            var utf8 = unescape(encodeURIComponent(this));
            var codes = new Uint8Array(utf8.length);
            for (var i = 0; i < codes.length; i++)
                codes[i] = utf8.charCodeAt(i);
            return window.crypto.subtle.digest("SHA-256", codes).then(function (result) {
                return window.crypto.subtle.digest("SHA-256", result);
            });
        };
        Uint8Array.prototype.base58Encode = function () {
            return Cryptography.Base58.encode(this);
        };
        Uint8Array.prototype.base64UrlEncode = function () {
            var str = String.fromCharCode.apply(null, this);
            str = window.btoa(str);
            return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        };
        var getAlgorithmName = function (algorithm) { return typeof algorithm === "string" ? algorithm : algorithm.name; };
        if (window.crypto == null)
            window.crypto = { subtle: null, getRandomValues: null };
        if (window.crypto.getRandomValues == null) {
            if (window.msCrypto) {
                window.crypto.getRandomValues = function (array) { return window.msCrypto.getRandomValues(array); };
            }
            else {
                Cryptography.RandomNumberGenerator.startCollectors();
                window.crypto.getRandomValues = Cryptography.RandomNumberGenerator.getRandomValues;
            }
        }
        window.crypto.subtle = window.crypto.subtle || window.crypto.webkitSubtle;
        if (window.crypto.subtle == null && window.msCrypto) {
            window.crypto.subtle = {
                decrypt: function (a, b, c) { return new Promise(function (resolve, reject) { var op = window.msCrypto.subtle.decrypt(a, b, c); op.oncomplete = function () { return resolve(op.result); }; op.onerror = function (e) { return reject(e); }; }); },
                deriveBits: function (a, b, c) { return new Promise(function (resolve, reject) { var op = window.msCrypto.subtle.deriveBits(a, b, c); op.oncomplete = function () { return resolve(op.result); }; op.onerror = function (e) { return reject(e); }; }); },
                deriveKey: function (a, b, c, d, e) { return new Promise(function (resolve, reject) { var op = window.msCrypto.subtle.deriveKey(a, b, c, d, e); op.oncomplete = function () { return resolve(op.result); }; op.onerror = function (e) { return reject(e); }; }); },
                digest: function (a, b) { return new Promise(function (resolve, reject) { var op = window.msCrypto.subtle.digest(a, b); op.oncomplete = function () { return resolve(op.result); }; op.onerror = function (e) { return reject(e); }; }); },
                encrypt: function (a, b, c) { return new Promise(function (resolve, reject) { var op = window.msCrypto.subtle.encrypt(a, b, c); op.oncomplete = function () { return resolve(op.result); }; op.onerror = function (e) { return reject(e); }; }); },
                exportKey: function (a, b) { return new Promise(function (resolve, reject) { var op = window.msCrypto.subtle.exportKey(a, b); op.oncomplete = function () { return resolve(op.result); }; op.onerror = function (e) { return reject(e); }; }); },
                generateKey: function (a, b, c) { return new Promise(function (resolve, reject) { var op = window.msCrypto.subtle.generateKey(a, b, c); op.oncomplete = function () { return resolve(op.result); }; op.onerror = function (e) { return reject(e); }; }); },
                importKey: function (a, b, c, d, e) { return new Promise(function (resolve, reject) { var op = window.msCrypto.subtle.importKey(a, b, c, d, e); op.oncomplete = function () { return resolve(op.result); }; op.onerror = function (e) { return reject(e); }; }); },
                sign: function (a, b, c) { return new Promise(function (resolve, reject) { var op = window.msCrypto.subtle.sign(a, b, c); op.oncomplete = function () { return resolve(op.result); }; op.onerror = function (e) { return reject(e); }; }); },
                unwrapKey: function (a, b, c, d, e, f, g) { return new Promise(function (resolve, reject) { var op = window.msCrypto.subtle.unwrapKey(a, b, c, d, e, f, g); op.oncomplete = function () { return resolve(op.result); }; op.onerror = function (e) { return reject(e); }; }); },
                verify: function (a, b, c, d) { return new Promise(function (resolve, reject) { var op = window.msCrypto.subtle.verify(a, b, c, d); op.oncomplete = function () { return resolve(op.result); }; op.onerror = function (e) { return reject(e); }; }); },
                wrapKey: function (a, b, c, d) { return new Promise(function (resolve, reject) { var op = window.msCrypto.subtle.wrapKey(a, b, c, d); op.oncomplete = function () { return resolve(op.result); }; op.onerror = function (e) { return reject(e); }; }); },
            };
        }
        if (window.crypto.subtle == null) {
            window.crypto.subtle = {
                decrypt: function (algorithm, key, data) { return new Promise(function (resolve, reject) {
                    if (typeof algorithm === "string" || algorithm.name != "AES-CBC" || !algorithm.iv || algorithm.iv.byteLength != 16 || data.byteLength % 16 != 0) {
                        reject(new RangeError());
                        return;
                    }
                    try {
                        var aes = new Cryptography.Aes(key.export(), algorithm.iv);
                        resolve(aes.decrypt(data));
                    }
                    catch (e) {
                        reject(e);
                    }
                }); },
                deriveBits: null,
                deriveKey: null,
                digest: function (algorithm, data) { return new Promise(function (resolve, reject) {
                    if (getAlgorithmName(algorithm) != "SHA-256") {
                        reject(new RangeError());
                        return;
                    }
                    try {
                        resolve(Cryptography.Sha256.computeHash(data));
                    }
                    catch (e) {
                        reject(e);
                    }
                }); },
                encrypt: function (algorithm, key, data) { return new Promise(function (resolve, reject) {
                    if (typeof algorithm === "string" || algorithm.name != "AES-CBC" || !algorithm.iv || algorithm.iv.byteLength != 16) {
                        reject(new RangeError());
                        return;
                    }
                    try {
                        var aes = new Cryptography.Aes(key.export(), algorithm.iv);
                        resolve(aes.encrypt(data));
                    }
                    catch (e) {
                        reject(e);
                    }
                }); },
                exportKey: function (format, key) { return new Promise(function (resolve, reject) {
                    if (format != "jwk" || !(key instanceof Cryptography.AesCryptoKey)) {
                        reject(new RangeError());
                        return;
                    }
                    try {
                        var k = key;
                        resolve({
                            alg: "A256CBC",
                            ext: true,
                            k: k.export().base64UrlEncode(),
                            key_ops: k.usages,
                            kty: "oct"
                        });
                    }
                    catch (e) {
                        reject(e);
                    }
                }); },
                generateKey: function (algorithm, extractable, keyUsages) { return new Promise(function (resolve, reject) {
                    if (typeof algorithm === "string" || algorithm.name != "AES-CBC" || (algorithm.length != 128 && algorithm.length != 192 && algorithm.length != 256)) {
                        reject(new RangeError());
                        return;
                    }
                    try {
                        resolve(Cryptography.AesCryptoKey.create(algorithm.length));
                    }
                    catch (e) {
                        reject(e);
                    }
                }); },
                importKey: function (format, keyData, algorithm, extractable, keyUsages) { return new Promise(function (resolve, reject) {
                    if (format != "jwk" || getAlgorithmName(algorithm) != "AES-CBC") {
                        reject(new RangeError());
                        return;
                    }
                    try {
                        resolve(Cryptography.AesCryptoKey.import(keyData.k.base64UrlDecode()));
                    }
                    catch (e) {
                        reject(e);
                    }
                }); },
                sign: null,
                unwrapKey: null,
                verify: null,
                wrapKey: null,
            };
        }
        function hook_ripemd160() {
            var digest_old = window.crypto.subtle.digest;
            window.crypto.subtle.digest = function (algorithm, data) {
                if (getAlgorithmName(algorithm) != "RIPEMD-160")
                    return digest_old.call(window.crypto.subtle, algorithm, data);
                return new Promise(function (resolve, reject) {
                    try {
                        resolve(Cryptography.RIPEMD160.computeHash(data));
                    }
                    catch (e) {
                        reject(e);
                    }
                });
            };
        }
        hook_ripemd160();
        function hook_ecdsa() {
            var exportKey_old = window.crypto.subtle.exportKey;
            window.crypto.subtle.exportKey = function (format, key) {
                if (key.algorithm.name != "ECDSA")
                    return exportKey_old.call(window.crypto.subtle, format, key);
                return new Promise(function (resolve, reject) {
                    var k = key;
                    if (format != "jwk" || k.algorithm.namedCurve != "P-256")
                        reject(new RangeError());
                    else
                        try {
                            if (k.type == "private")
                                resolve({
                                    crv: k.algorithm.namedCurve,
                                    d: k.privateKey.base64UrlEncode(),
                                    ext: true,
                                    key_ops: k.usages,
                                    kty: "EC",
                                    x: k.publicKey.x.value.toUint8Array(false, 32).base64UrlEncode(),
                                    y: k.publicKey.y.value.toUint8Array(false, 32).base64UrlEncode()
                                });
                            else
                                resolve({
                                    crv: k.algorithm.namedCurve,
                                    ext: true,
                                    key_ops: k.usages,
                                    kty: "EC",
                                    x: k.publicKey.x.value.toUint8Array(false, 32).base64UrlEncode(),
                                    y: k.publicKey.y.value.toUint8Array(false, 32).base64UrlEncode()
                                });
                        }
                        catch (e) {
                            reject(e);
                        }
                });
            };
            var generateKey_old = window.crypto.subtle.generateKey;
            window.crypto.subtle.generateKey = function (algorithm, extractable, keyUsages) {
                if (getAlgorithmName(algorithm) != "ECDSA")
                    return generateKey_old.call(window.crypto.subtle, algorithm, extractable, keyUsages);
                return new Promise(function (resolve, reject) {
                    if (algorithm.namedCurve != "P-256")
                        reject(new RangeError());
                    else
                        try {
                            resolve(Cryptography.ECDsa.generateKey(Cryptography.ECCurve.secp256r1));
                        }
                        catch (e) {
                            reject(e);
                        }
                });
            };
            var importKey_old = window.crypto.subtle.importKey;
            window.crypto.subtle.importKey = function (format, keyData, algorithm, extractable, keyUsages) {
                if (getAlgorithmName(algorithm) != "ECDSA")
                    return importKey_old.call(window.crypto.subtle, format, keyData, algorithm, extractable, keyUsages);
                return new Promise(function (resolve, reject) {
                    if (format != "jwk" || algorithm.namedCurve != "P-256")
                        reject(new RangeError());
                    else
                        try {
                            var k = keyData;
                            var x = k.x.base64UrlDecode();
                            var y = k.y.base64UrlDecode();
                            var arr = new Uint8Array(65);
                            arr[0] = 0x04;
                            Array.copy(x, 0, arr, 1, 32);
                            Array.copy(y, 0, arr, 33, 32);
                            var pubkey = Cryptography.ECPoint.decodePoint(arr, Cryptography.ECCurve.secp256r1);
                            if (k.d)
                                resolve(new Cryptography.ECDsaCryptoKey(pubkey, k.d.base64UrlDecode()));
                            else
                                resolve(new Cryptography.ECDsaCryptoKey(pubkey));
                        }
                        catch (e) {
                            reject(e);
                        }
                });
            };
            var sign_old = window.crypto.subtle.sign;
            window.crypto.subtle.sign = function (algorithm, key, data) {
                if (getAlgorithmName(algorithm) != "ECDSA")
                    return sign_old.call(window.crypto.subtle, algorithm, key, data);
                return new Promise(function (resolve, reject) {
                    if (algorithm.hash.name != "SHA-256" || key.algorithm.name != "ECDSA")
                        reject(new RangeError());
                    else
                        try {
                            var ecdsa = new Cryptography.ECDsa(key);
                            resolve(ecdsa.sign(data));
                        }
                        catch (e) {
                            reject(e);
                        }
                });
            };
            var verify_old = window.crypto.subtle.verify;
            window.crypto.subtle.verify = function (algorithm, key, signature, data) {
                if (getAlgorithmName(algorithm) != "ECDSA")
                    return verify_old.call(window.crypto.subtle, algorithm, key, signature, data);
                return new Promise(function (resolve, reject) {
                    if (algorithm.hash.name != "SHA-256" || key.algorithm.name != "ECDSA")
                        reject(new RangeError());
                    else
                        try {
                            var ecdsa = new Cryptography.ECDsa(key);
                            resolve(ecdsa.verify(data, signature));
                        }
                        catch (e) {
                            reject(e);
                        }
                });
            };
        }
        try {
            window.crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, false, ["sign", "verify"]).catch(hook_ecdsa);
        }
        catch (ex) {
            hook_ecdsa();
        }
    })(Cryptography = AntShares.Cryptography || (AntShares.Cryptography = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Cryptography;
    (function (Cryptography) {
        var RIPEMD160 = (function () {
            function RIPEMD160() {
            }
            RIPEMD160.bytesToWords = function (bytes) {
                var words = [];
                for (var i = 0, b = 0; i < bytes.length; i++, b += 8) {
                    words[b >>> 5] |= bytes[i] << (24 - b % 32);
                }
                return words;
            };
            RIPEMD160.wordsToBytes = function (words) {
                var bytes = [];
                for (var b = 0; b < words.length * 32; b += 8) {
                    bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
                }
                return bytes;
            };
            RIPEMD160.processBlock = function (H, M, offset) {
                for (var i = 0; i < 16; i++) {
                    var offset_i = offset + i;
                    var M_offset_i = M[offset_i];
                    M[offset_i] = ((((M_offset_i << 8) | (M_offset_i >>> 24)) & 0x00ff00ff) |
                        (((M_offset_i << 24) | (M_offset_i >>> 8)) & 0xff00ff00));
                }
                var al, bl, cl, dl, el;
                var ar, br, cr, dr, er;
                ar = al = H[0];
                br = bl = H[1];
                cr = cl = H[2];
                dr = dl = H[3];
                er = el = H[4];
                var t;
                for (var i = 0; i < 80; i += 1) {
                    t = (al + M[offset + RIPEMD160.zl[i]]) | 0;
                    if (i < 16) {
                        t += RIPEMD160.f1(bl, cl, dl) + RIPEMD160.hl[0];
                    }
                    else if (i < 32) {
                        t += RIPEMD160.f2(bl, cl, dl) + RIPEMD160.hl[1];
                    }
                    else if (i < 48) {
                        t += RIPEMD160.f3(bl, cl, dl) + RIPEMD160.hl[2];
                    }
                    else if (i < 64) {
                        t += RIPEMD160.f4(bl, cl, dl) + RIPEMD160.hl[3];
                    }
                    else {
                        t += RIPEMD160.f5(bl, cl, dl) + RIPEMD160.hl[4];
                    }
                    t = t | 0;
                    t = RIPEMD160.rotl(t, RIPEMD160.sl[i]);
                    t = (t + el) | 0;
                    al = el;
                    el = dl;
                    dl = RIPEMD160.rotl(cl, 10);
                    cl = bl;
                    bl = t;
                    t = (ar + M[offset + RIPEMD160.zr[i]]) | 0;
                    if (i < 16) {
                        t += RIPEMD160.f5(br, cr, dr) + RIPEMD160.hr[0];
                    }
                    else if (i < 32) {
                        t += RIPEMD160.f4(br, cr, dr) + RIPEMD160.hr[1];
                    }
                    else if (i < 48) {
                        t += RIPEMD160.f3(br, cr, dr) + RIPEMD160.hr[2];
                    }
                    else if (i < 64) {
                        t += RIPEMD160.f2(br, cr, dr) + RIPEMD160.hr[3];
                    }
                    else {
                        t += RIPEMD160.f1(br, cr, dr) + RIPEMD160.hr[4];
                    }
                    t = t | 0;
                    t = RIPEMD160.rotl(t, RIPEMD160.sr[i]);
                    t = (t + er) | 0;
                    ar = er;
                    er = dr;
                    dr = RIPEMD160.rotl(cr, 10);
                    cr = br;
                    br = t;
                }
                t = (H[1] + cl + dr) | 0;
                H[1] = (H[2] + dl + er) | 0;
                H[2] = (H[3] + el + ar) | 0;
                H[3] = (H[4] + al + br) | 0;
                H[4] = (H[0] + bl + cr) | 0;
                H[0] = t;
            };
            RIPEMD160.f1 = function (x, y, z) { return ((x) ^ (y) ^ (z)); };
            RIPEMD160.f2 = function (x, y, z) { return (((x) & (y)) | ((~x) & (z))); };
            RIPEMD160.f3 = function (x, y, z) { return (((x) | (~(y))) ^ (z)); };
            RIPEMD160.f4 = function (x, y, z) { return (((x) & (z)) | ((y) & (~(z)))); };
            RIPEMD160.f5 = function (x, y, z) { return ((x) ^ ((y) | (~(z)))); };
            RIPEMD160.rotl = function (x, n) { return (x << n) | (x >>> (32 - n)); };
            RIPEMD160.computeHash = function (data) {
                var H = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0];
                var m = RIPEMD160.bytesToWords(Uint8Array.fromArrayBuffer(data));
                var nBitsLeft = data.byteLength * 8;
                var nBitsTotal = data.byteLength * 8;
                m[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
                m[(((nBitsLeft + 64) >>> 9) << 4) + 14] = ((((nBitsTotal << 8) | (nBitsTotal >>> 24)) & 0x00ff00ff) |
                    (((nBitsTotal << 24) | (nBitsTotal >>> 8)) & 0xff00ff00));
                for (var i = 0; i < m.length; i += 16) {
                    RIPEMD160.processBlock(H, m, i);
                }
                for (var i = 0; i < 5; i++) {
                    var H_i = H[i];
                    H[i] = (((H_i << 8) | (H_i >>> 24)) & 0x00ff00ff) |
                        (((H_i << 24) | (H_i >>> 8)) & 0xff00ff00);
                }
                var digestbytes = RIPEMD160.wordsToBytes(H);
                return new Uint8Array(digestbytes).buffer;
            };
            RIPEMD160.zl = [
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
                3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
                1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
                4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
            ];
            RIPEMD160.zr = [
                5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
                6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
                15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
                8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
                12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
            ];
            RIPEMD160.sl = [
                11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
                7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
                11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
                11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
                9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
            ];
            RIPEMD160.sr = [
                8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
                9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
                9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
                15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
                8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
            ];
            RIPEMD160.hl = [0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E];
            RIPEMD160.hr = [0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000];
            return RIPEMD160;
        }());
        Cryptography.RIPEMD160 = RIPEMD160;
    })(Cryptography = AntShares.Cryptography || (AntShares.Cryptography = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Cryptography;
    (function (Cryptography) {
        var Sha256 = (function () {
            function Sha256() {
            }
            Sha256.computeHash = function (data) {
                var H = new Uint32Array([
                    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]);
                var l = data.byteLength / 4 + 2;
                var N = Math.ceil(l / 16);
                var M = new Array(N);
                var view = Uint8Array.fromArrayBuffer(data);
                for (var i = 0; i < N; i++) {
                    M[i] = new Uint32Array(16);
                    for (var j = 0; j < 16; j++) {
                        M[i][j] = (view[i * 64 + j * 4] << 24) | (view[i * 64 + j * 4 + 1] << 16) |
                            (view[i * 64 + j * 4 + 2] << 8) | (view[i * 64 + j * 4 + 3]);
                    }
                }
                M[Math.floor(data.byteLength / 4 / 16)][Math.floor(data.byteLength / 4) % 16] |= 0x80 << ((3 - data.byteLength % 4) * 8);
                M[N - 1][14] = (data.byteLength * 8) / Math.pow(2, 32);
                M[N - 1][15] = (data.byteLength * 8) & 0xffffffff;
                var W = new Uint32Array(64);
                var a, b, c, d, e, f, g, h;
                for (var i = 0; i < N; i++) {
                    for (var t = 0; t < 16; t++)
                        W[t] = M[i][t];
                    for (var t = 16; t < 64; t++)
                        W[t] = (Sha256.σ1(W[t - 2]) + W[t - 7] + Sha256.σ0(W[t - 15]) + W[t - 16]) & 0xffffffff;
                    a = H[0];
                    b = H[1];
                    c = H[2];
                    d = H[3];
                    e = H[4];
                    f = H[5];
                    g = H[6];
                    h = H[7];
                    for (var t = 0; t < 64; t++) {
                        var T1 = h + Sha256.Σ1(e) + Sha256.Ch(e, f, g) + Sha256.K[t] + W[t];
                        var T2 = Sha256.Σ0(a) + Sha256.Maj(a, b, c);
                        h = g;
                        g = f;
                        f = e;
                        e = (d + T1) & 0xffffffff;
                        d = c;
                        c = b;
                        b = a;
                        a = (T1 + T2) & 0xffffffff;
                    }
                    H[0] = (H[0] + a) & 0xffffffff;
                    H[1] = (H[1] + b) & 0xffffffff;
                    H[2] = (H[2] + c) & 0xffffffff;
                    H[3] = (H[3] + d) & 0xffffffff;
                    H[4] = (H[4] + e) & 0xffffffff;
                    H[5] = (H[5] + f) & 0xffffffff;
                    H[6] = (H[6] + g) & 0xffffffff;
                    H[7] = (H[7] + h) & 0xffffffff;
                }
                var result = new Uint8Array(32);
                for (var i = 0; i < H.length; i++) {
                    result[i * 4 + 0] = (H[i] >>> (3 * 8)) & 0xff;
                    result[i * 4 + 1] = (H[i] >>> (2 * 8)) & 0xff;
                    result[i * 4 + 2] = (H[i] >>> (1 * 8)) & 0xff;
                    result[i * 4 + 3] = (H[i] >>> (0 * 8)) & 0xff;
                }
                return result.buffer;
            };
            Sha256.ROTR = function (n, x) { return (x >>> n) | (x << (32 - n)); };
            Sha256.Σ0 = function (x) { return Sha256.ROTR(2, x) ^ Sha256.ROTR(13, x) ^ Sha256.ROTR(22, x); };
            Sha256.Σ1 = function (x) { return Sha256.ROTR(6, x) ^ Sha256.ROTR(11, x) ^ Sha256.ROTR(25, x); };
            Sha256.σ0 = function (x) { return Sha256.ROTR(7, x) ^ Sha256.ROTR(18, x) ^ (x >>> 3); };
            Sha256.σ1 = function (x) { return Sha256.ROTR(17, x) ^ Sha256.ROTR(19, x) ^ (x >>> 10); };
            Sha256.Ch = function (x, y, z) { return (x & y) ^ (~x & z); };
            Sha256.Maj = function (x, y, z) { return (x & y) ^ (x & z) ^ (y & z); };
            Sha256.K = [
                0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
                0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
                0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
                0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
                0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
                0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
                0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
                0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
            return Sha256;
        }());
        Cryptography.Sha256 = Sha256;
    })(Cryptography = AntShares.Cryptography || (AntShares.Cryptography = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Core;
    (function (Core) {
        var Transaction = (function (_super) {
            __extends(Transaction, _super);
            function Transaction(type) {
                _super.call(this);
                this.type = type;
            }
            Object.defineProperty(Transaction.prototype, "systemFee", {
                get: function () { return AntShares.Fixed8.Zero; },
                enumerable: true,
                configurable: true
            });
            Transaction.prototype.deserialize = function (reader) {
                this.deserializeUnsigned(reader);
                this.scripts = reader.readSerializableArray(Core.Scripts.Script);
            };
            Transaction.prototype.deserializeExclusiveData = function (reader) { };
            Transaction.deserializeFrom = function () {
                if (arguments[0] instanceof ArrayBuffer) {
                    var value = arguments[0];
                    var offset = arguments.length == 2 ? arguments[1] : 0;
                    var ms = new AntShares.IO.MemoryStream(value, offset, value.byteLength - offset, false);
                    var reader = new AntShares.IO.BinaryReader(ms);
                    return Transaction.deserializeFrom(reader);
                }
                else {
                    var reader = arguments[0];
                    var type = reader.readByte();
                    var typeName = "AntShares.Core." + Core.TransactionType[type];
                    var t = eval(typeName);
                    var transaction = new t();
                    if (transaction == null)
                        throw new Error();
                    transaction.deserializeUnsignedWithoutType(reader);
                    transaction.scripts = reader.readSerializableArray(Core.Scripts.Script);
                    return transaction;
                }
            };
            Transaction.prototype.deserializeUnsigned = function (reader) {
                if (reader.readByte() != this.type)
                    throw new Error();
                this.deserializeUnsignedWithoutType(reader);
            };
            Transaction.prototype.deserializeUnsignedWithoutType = function (reader) {
                this.deserializeExclusiveData(reader);
                this.attributes = reader.readSerializableArray(Core.TransactionAttribute);
                this.inputs = reader.readSerializableArray(Core.TransactionInput);
                this.outputs = reader.readSerializableArray(Core.TransactionOutput);
            };
            Transaction.prototype.getAllInputs = function () {
                return this.inputs;
            };
            Transaction.prototype.getReferences = function () {
                var inputs = this.getAllInputs();
                var promises = new Array();
                for (var i = 0; i < inputs.length; i++)
                    promises.push(Core.Blockchain.Default.getTransaction(inputs[i].prevHash));
                return Promise.all(promises).then(function (results) {
                    var dictionary = new Map();
                    for (var i = 0; i < inputs.length; i++) {
                        if (results[i] == null)
                            return null;
                        dictionary.set(inputs[i].toString(), results[i].outputs[inputs[i].prevIndex]);
                    }
                    return dictionary;
                });
            };
            Transaction.prototype.getScriptHashesForVerifying = function () {
                var _this = this;
                var hashes = new Map();
                return this.getReferences().then(function (result) {
                    if (result == null)
                        throw new Error();
                    for (var i = 0; i < _this.inputs.length; i++) {
                        var hash = result.get(_this.inputs[i].toString()).scriptHash;
                        hashes.set(hash.toString(), hash);
                    }
                    var promises = new Array();
                    for (var i = 0; i < _this.outputs.length; i++)
                        promises.push(Core.Blockchain.Default.getTransaction(_this.outputs[i].assetId));
                    return Promise.all(promises);
                }).then(function (results) {
                    for (var i = 0; i < _this.outputs.length; i++) {
                        var tx = results[i];
                        if (tx == null)
                            throw new Error();
                        if (tx.assetType & Core.AssetType.DutyFlag) {
                            hashes.set(_this.outputs[i].scriptHash.toString(), _this.outputs[i].scriptHash);
                        }
                    }
                    var array = new Array();
                    hashes.forEach(function (hash) {
                        array.push(hash);
                    });
                    return array.sort(function (a, b) { return a.compareTo(b); });
                });
            };
            Transaction.prototype.serialize = function (writer) {
                this.serializeUnsigned(writer);
                writer.writeSerializableArray(this.scripts);
            };
            Transaction.prototype.serializeExclusiveData = function (writer) { };
            Transaction.prototype.serializeUnsigned = function (writer) {
                writer.writeByte(this.type);
                this.serializeExclusiveData(writer);
                writer.writeSerializableArray(this.attributes);
                writer.writeSerializableArray(this.inputs);
                writer.writeSerializableArray(this.outputs);
            };
            return Transaction;
        }(AntShares.Network.Inventory));
        Core.Transaction = Transaction;
    })(Core = AntShares.Core || (AntShares.Core = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Core;
    (function (Core) {
        var AgencyTransaction = (function (_super) {
            __extends(AgencyTransaction, _super);
            function AgencyTransaction() {
                _super.call(this, Core.TransactionType.AgencyTransaction);
            }
            AgencyTransaction.prototype.deserializeExclusiveData = function (reader) {
                this.assetId = reader.readUint256();
                this.valueAssetId = reader.readUint256();
                this.agent = reader.readUint160();
                this.orders = new Core.Order[reader.readVarInt(0x10000000)];
                for (var i = 0; i < this.orders.length; i++) {
                    this.orders[i] = new Core.Order();
                    this.orders[i].deserializeInTransaction(reader, this);
                }
                if (reader.readVarInt(1) == 0) {
                    this.splitOrder = null;
                }
                else {
                    this.splitOrder = reader.readSerializable(Core.SplitOrder);
                }
            };
            AgencyTransaction.prototype.getAllInputs = function () {
                var array = new Array();
                for (var i = 0; i < this.orders.length; i++)
                    Array.prototype.push.apply(array, this.orders[i].inputs);
                Array.prototype.push.apply(array, this.inputs);
                return array;
            };
            AgencyTransaction.prototype.getScriptHashesForVerifying = function () {
                throw new Error("NotSupported");
            };
            AgencyTransaction.prototype.serializeExclusiveData = function (writer) {
                writer.writeUintVariable(this.assetId);
                writer.writeUintVariable(this.valueAssetId);
                writer.writeUintVariable(this.agent);
                writer.writeVarInt(this.orders.length);
                for (var i = 0; i < this.orders.length; i++) {
                    this.orders[i].serializeInTransaction(writer);
                }
                if (this.splitOrder == null) {
                    writer.writeByte(0);
                }
                else {
                    writer.writeByte(1);
                    this.splitOrder.serialize(writer);
                }
            };
            return AgencyTransaction;
        }(Core.Transaction));
        Core.AgencyTransaction = AgencyTransaction;
    })(Core = AntShares.Core || (AntShares.Core = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Core;
    (function (Core) {
        (function (AssetType) {
            AssetType[AssetType["CreditFlag"] = 64] = "CreditFlag";
            AssetType[AssetType["DutyFlag"] = 128] = "DutyFlag";
            AssetType[AssetType["AntShare"] = 0] = "AntShare";
            AssetType[AssetType["AntCoin"] = 1] = "AntCoin";
            AssetType[AssetType["Currency"] = 8] = "Currency";
            AssetType[AssetType["Share"] = 144] = "Share";
            AssetType[AssetType["Invoice"] = 152] = "Invoice";
            AssetType[AssetType["Token"] = 96] = "Token";
        })(Core.AssetType || (Core.AssetType = {}));
        var AssetType = Core.AssetType;
    })(Core = AntShares.Core || (AntShares.Core = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Core;
    (function (Core) {
        var Block = (function (_super) {
            __extends(Block, _super);
            function Block() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(Block.prototype, "header", {
                get: function () {
                    if (this.isHeader)
                        return this;
                    if (this._header == null) {
                        this._header = new Block();
                        this._header.version = this.version;
                        this._header.prevBlock = this.prevBlock;
                        this._header.merkleRoot = this.merkleRoot;
                        this._header.timestamp = this.timestamp;
                        this._header.height = this.height;
                        this._header.nonce = this.nonce;
                        this._header.nextMiner = this.nextMiner;
                        this._header.script = this.script;
                        this._header.transactions = [];
                    }
                    return this._header;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Block.prototype, "isHeader", {
                get: function () { return this.transactions.length == 0; },
                enumerable: true,
                configurable: true
            });
            Block.prototype.deserialize = function (reader) {
                this.deserializeUnsigned(reader);
                if (reader.readByte() != 1)
                    throw new Error();
                this.script = reader.readSerializable(Core.Scripts.Script);
                this.transactions = new Array(reader.readVarInt(0x10000000));
                for (var i = 0; i < this.transactions.length; i++)
                    this.transactions[i] = Core.Transaction.deserializeFrom(reader);
            };
            Block.prototype.deserializeUnsigned = function (reader) {
                this.version = reader.readUint32();
                this.prevBlock = reader.readUint256();
                this.merkleRoot = reader.readUint256();
                this.timestamp = reader.readUint32();
                this.height = reader.readUint32();
                this.nonce = reader.readUint64();
                this.nextMiner = reader.readUint160();
                this.transactions = [];
            };
            Block.prototype.getScriptHashesForVerifying = function () {
                if (this.prevBlock.equals(AntShares.Uint256.Zero))
                    return this.script.redeemScript.toScriptHash().then(function (result) {
                        return [result];
                    });
                return Core.Blockchain.Default.getBlock(this.prevBlock).then(function (result) {
                    if (result == null)
                        throw new Error();
                    return [result.nextMiner];
                });
            };
            Block.prototype.serialize = function (writer) {
                this.serializeUnsigned(writer);
                writer.writeByte(1);
                this.script.serialize(writer);
                writer.writeSerializableArray(this.transactions);
            };
            Block.prototype.serializeUnsigned = function (writer) {
                writer.writeUint32(this.version);
                writer.writeUintVariable(this.prevBlock);
                writer.writeUintVariable(this.merkleRoot);
                writer.writeUint32(this.timestamp);
                writer.writeUint32(this.height);
                writer.writeUintVariable(this.nonce);
                writer.writeUintVariable(this.nextMiner);
            };
            return Block;
        }(AntShares.Network.Inventory));
        Core.Block = Block;
    })(Core = AntShares.Core || (AntShares.Core = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Core;
    (function (Core) {
        var ClaimTransaction = (function (_super) {
            __extends(ClaimTransaction, _super);
            function ClaimTransaction() {
                _super.call(this, Core.TransactionType.ClaimTransaction);
            }
            ClaimTransaction.prototype.deserializeExclusiveData = function (reader) {
                this.claims = reader.readSerializableArray(Core.TransactionInput);
            };
            ClaimTransaction.prototype.getScriptHashesForVerifying = function () {
                var _this = this;
                var hashes = new Map();
                return _super.prototype.getScriptHashesForVerifying.call(this).then(function (result) {
                    for (var i = 0; i < result.length; i++)
                        hashes.set(result[i].toString(), result[i]);
                    var promises = new Array();
                    for (var i = 0; i < _this.claims.length; i++)
                        promises.push(Core.Blockchain.Default.getTransaction(_this.claims[i].prevHash));
                    return Promise.all(promises);
                }).then(function (results) {
                    for (var i = 0; i < _this.claims.length; i++) {
                        if (results[i] == null)
                            throw new Error();
                        if (results[i].outputs.length <= _this.claims[i].prevIndex)
                            throw new Error();
                        hashes.set(results[i].outputs[_this.claims[i].prevIndex].scriptHash.toString(), results[i].outputs[_this.claims[i].prevIndex].scriptHash);
                    }
                    var array = new Array();
                    hashes.forEach(function (hash) {
                        array.push(hash);
                    });
                    return array.sort(function (a, b) { return a.compareTo(b); });
                });
            };
            ClaimTransaction.prototype.serializeExclusiveData = function (writer) {
                writer.writeSerializableArray(this.claims);
            };
            return ClaimTransaction;
        }(Core.Transaction));
        Core.ClaimTransaction = ClaimTransaction;
    })(Core = AntShares.Core || (AntShares.Core = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Core;
    (function (Core) {
        var ContractTransaction = (function (_super) {
            __extends(ContractTransaction, _super);
            function ContractTransaction() {
                _super.call(this, Core.TransactionType.ContractTransaction);
            }
            return ContractTransaction;
        }(Core.Transaction));
        Core.ContractTransaction = ContractTransaction;
    })(Core = AntShares.Core || (AntShares.Core = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Core;
    (function (Core) {
        var EnrollmentTransaction = (function (_super) {
            __extends(EnrollmentTransaction, _super);
            function EnrollmentTransaction() {
                _super.call(this, Core.TransactionType.EnrollmentTransaction);
            }
            Object.defineProperty(EnrollmentTransaction.prototype, "systemFee", {
                get: function () { return AntShares.Fixed8.fromNumber(1000); },
                enumerable: true,
                configurable: true
            });
            EnrollmentTransaction.prototype.deserializeExclusiveData = function (reader) {
                this.publicKey = AntShares.Cryptography.ECPoint.deserializeFrom(reader, AntShares.Cryptography.ECCurve.secp256r1);
            };
            EnrollmentTransaction.prototype.getScriptHashesForVerifying = function () {
                var _this = this;
                var hashes = new Map();
                return _super.prototype.getScriptHashesForVerifying.call(this).then(function (result) {
                    for (var i = 0; i < result.length; i++)
                        hashes.set(result[i].toString(), result[i]);
                    return AntShares.Wallets.Contract.createSignatureRedeemScript(_this.publicKey).toScriptHash();
                }).then(function (result) {
                    hashes.set(result.toString(), result);
                    var array = new Array();
                    hashes.forEach(function (hash) {
                        array.push(hash);
                    });
                    return array.sort(function (a, b) { return a.compareTo(b); });
                });
            };
            EnrollmentTransaction.prototype.serializeExclusiveData = function (writer) {
                writer.write(this.publicKey.encodePoint(true).buffer);
            };
            return EnrollmentTransaction;
        }(Core.Transaction));
        Core.EnrollmentTransaction = EnrollmentTransaction;
    })(Core = AntShares.Core || (AntShares.Core = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Core;
    (function (Core) {
        var IssueTransaction = (function (_super) {
            __extends(IssueTransaction, _super);
            function IssueTransaction() {
                _super.call(this, Core.TransactionType.IssueTransaction);
            }
            Object.defineProperty(IssueTransaction.prototype, "systemFee", {
                get: function () {
                    if (!TESTNET)
                        for (var i = 0; i < this.outputs.length; i++)
                            if (!this.outputs[i].assetId.equals(Core.Blockchain.AntShare.hash) && !this.outputs[i].assetId.equals(Core.Blockchain.AntCoin.hash))
                                return AntShares.Fixed8.fromNumber(500);
                    return AntShares.Fixed8.Zero;
                },
                enumerable: true,
                configurable: true
            });
            IssueTransaction.prototype.deserializeExclusiveData = function (reader) {
                this.nonce = reader.readUint32();
            };
            IssueTransaction.prototype.getScriptHashesForVerifying = function () {
                var _this = this;
                var hashes = new Map();
                return _super.prototype.getScriptHashesForVerifying.call(this).then(function (result) {
                    for (var i = 0; i < result.length; i++)
                        hashes.set(result[i].toString(), result[i]);
                    return _this.getReferences();
                }).then(function (result) {
                    if (result == null)
                        throw new Error();
                    var assets = new Map();
                    for (var i = 0; i < _this.outputs.length; i++) {
                        var key = _this.outputs[i].assetId.toString();
                        if (assets.has(key)) {
                            var asset = assets.get(key);
                            asset.amount = asset.amount.add(_this.outputs[i].value);
                        }
                        else {
                            assets.set(key, { assetId: _this.outputs[i].assetId, amount: _this.outputs[i].value });
                        }
                    }
                    result.forEach(function (reference) {
                        var key = reference.assetId.toString();
                        if (assets.has(key)) {
                            var asset = assets.get(key);
                            if (asset.amount.compareTo(reference.value) > 0)
                                asset.amount = asset.amount.subtract(reference.value);
                            else
                                assets.delete(key);
                        }
                    });
                    var promises = new Array();
                    assets.forEach(function (asset) {
                        promises.push(Core.Blockchain.Default.getTransaction(asset.assetId));
                    });
                    return Promise.all(promises);
                }).then(function (results) {
                    for (var i = 0; i < results.length; i++) {
                        var tx = results[i];
                        if (tx == null)
                            throw new Error();
                        hashes.set(tx.admin.toString(), tx.admin);
                    }
                    var array = new Array();
                    hashes.forEach(function (hash) {
                        array.push(hash);
                    });
                    return array.sort(function (a, b) { return a.compareTo(b); });
                });
            };
            IssueTransaction.prototype.serializeExclusiveData = function (writer) {
                writer.writeUint32(this.nonce);
            };
            return IssueTransaction;
        }(Core.Transaction));
        Core.IssueTransaction = IssueTransaction;
    })(Core = AntShares.Core || (AntShares.Core = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Core;
    (function (Core) {
        var MinerTransaction = (function (_super) {
            __extends(MinerTransaction, _super);
            function MinerTransaction() {
                _super.call(this, Core.TransactionType.MinerTransaction);
            }
            MinerTransaction.prototype.deserializeExclusiveData = function (reader) {
                this.nonce = reader.readUint32();
            };
            MinerTransaction.prototype.serializeExclusiveData = function (writer) {
                writer.writeUint32(this.nonce);
            };
            return MinerTransaction;
        }(Core.Transaction));
        Core.MinerTransaction = MinerTransaction;
    })(Core = AntShares.Core || (AntShares.Core = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Core;
    (function (Core) {
        var Order = (function () {
            function Order() {
            }
            Order.prototype.deserialize = function (reader) {
                this.deserializeUnsigned(reader);
                this.scripts = reader.readSerializableArray(Core.Scripts.Script);
            };
            Order.prototype.deserializeInTransaction = function (reader, tx) {
                this.deserializeUnsignedInternal(reader, tx.assetId, tx.valueAssetId, tx.agent);
                this.scripts = reader.readSerializableArray(Core.Scripts.Script);
            };
            Order.prototype.deserializeUnsigned = function (reader) {
                var asset_id = reader.readUint256();
                var value_asset_id = reader.readUint256();
                var agent = reader.readUint160();
                this.deserializeUnsignedInternal(reader, asset_id, value_asset_id, agent);
            };
            Order.prototype.deserializeUnsignedInternal = function (reader, asset_id, value_asset_id, agent) {
                this.assetId = asset_id;
                this.valueAssetId = value_asset_id;
                this.agent = agent;
                this.amount = reader.readFixed8();
                this.price = reader.readFixed8();
                this.client = reader.readUint160();
                this.inputs = reader.readSerializableArray(Core.TransactionInput);
            };
            Order.prototype.getScriptHashesForVerifying = function () {
                throw new Error("NotSupported");
            };
            Order.prototype.serialize = function (writer) {
                this.serializeUnsigned(writer);
                writer.writeSerializableArray(this.scripts);
            };
            Order.prototype.serializeInTransaction = function (writer) {
                writer.writeFixed8(this.amount);
                writer.writeFixed8(this.price);
                writer.writeUintVariable(this.client);
                writer.writeSerializableArray(this.inputs);
                writer.writeSerializableArray(this.scripts);
            };
            Order.prototype.serializeUnsigned = function (writer) {
                writer.writeUintVariable(this.assetId);
                writer.writeUintVariable(this.valueAssetId);
                writer.writeUintVariable(this.agent);
                writer.writeFixed8(this.amount);
                writer.writeFixed8(this.price);
                writer.writeUintVariable(this.client);
                writer.writeSerializableArray(this.inputs);
            };
            return Order;
        }());
        Core.Order = Order;
    })(Core = AntShares.Core || (AntShares.Core = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Core;
    (function (Core) {
        var RegisterTransaction = (function (_super) {
            __extends(RegisterTransaction, _super);
            function RegisterTransaction() {
                _super.call(this, Core.TransactionType.RegisterTransaction);
            }
            Object.defineProperty(RegisterTransaction.prototype, "systemFee", {
                get: function () {
                    return this.assetType == Core.AssetType.AntShare || this.assetType == Core.AssetType.AntCoin ? AntShares.Fixed8.Zero :
                        TESTNET ? AntShares.Fixed8.fromNumber(100) : AntShares.Fixed8.fromNumber(10000);
                },
                enumerable: true,
                configurable: true
            });
            RegisterTransaction.prototype.deserializeExclusiveData = function (reader) {
                this.assetType = reader.readByte();
                this.name = reader.readVarString();
                this.amount = reader.readFixed8();
                this.issuer = AntShares.Cryptography.ECPoint.deserializeFrom(reader, AntShares.Cryptography.ECCurve.secp256r1);
                this.admin = reader.readUint160();
            };
            RegisterTransaction.prototype.getScriptHashesForVerifying = function () {
                var _this = this;
                var hashes = new Map();
                return _super.prototype.getScriptHashesForVerifying.call(this).then(function (result) {
                    for (var i = 0; i < result.length; i++)
                        hashes.set(result[i].toString(), result[i]);
                    return AntShares.Wallets.Contract.createSignatureRedeemScript(_this.issuer).toScriptHash();
                }).then(function (result) {
                    hashes.set(result.toString(), result);
                    hashes.set(_this.admin.toString(), _this.admin);
                    var array = new Array();
                    hashes.forEach(function (hash) {
                        array.push(hash);
                    });
                    return array.sort(function (a, b) { return a.compareTo(b); });
                });
            };
            RegisterTransaction.prototype.serializeExclusiveData = function (writer) {
                writer.writeByte(this.assetType);
                writer.writeVarString(this.name);
                writer.writeFixed8(this.amount);
                writer.write(this.issuer.encodePoint(true).buffer);
                writer.writeUintVariable(this.admin);
            };
            return RegisterTransaction;
        }(Core.Transaction));
        Core.RegisterTransaction = RegisterTransaction;
    })(Core = AntShares.Core || (AntShares.Core = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Core;
    (function (Core) {
        var SignatureContext = (function () {
            function SignatureContext() {
            }
            SignatureContext.prototype.add = function (contract, pubkey, signature) {
                for (var i = 0; i < this.scriptHashes.length; i++) {
                    if (this.scriptHashes[i].equals(contract.scriptHash)) {
                        if (this.redeemScripts[i] == null)
                            this.redeemScripts[i] = contract.redeemScript;
                        if (this.signatures[i] == null)
                            this.signatures[i] = new Map();
                        this.signatures[i].set(pubkey.toString(), signature);
                        var completed = contract.parameterList.length == this.signatures[i].size;
                        for (var j = 0; j < contract.parameterList.length && completed; j++)
                            if (contract.parameterList[j] != AntShares.Wallets.ContractParameterType.Signature)
                                completed = false;
                        this.completed[i] = this.completed[i] || completed;
                        return true;
                    }
                }
                return false;
            };
            SignatureContext.create = function (signable) {
                return signable.getScriptHashesForVerifying().then(function (result) {
                    var context = new SignatureContext();
                    context.signable = signable;
                    context.scriptHashes = result;
                    context.redeemScripts = new Array(result.length);
                    context.signatures = new Array(result.length);
                    context.completed = new Array(result.length);
                    return context;
                });
            };
            SignatureContext.prototype.getScripts = function () {
                if (!this.isCompleted())
                    throw new Error();
                var scripts = new Array(this.signatures.length);
                var _loop_2 = function(i) {
                    var array = new Array();
                    this_2.signatures[i].forEach(function (signature, key) {
                        array.push({ pubkey: AntShares.Cryptography.ECPoint.parse(key, AntShares.Cryptography.ECCurve.secp256r1), signature: signature });
                    });
                    array.sort(function (a, b) { return a.pubkey.compareTo(b.pubkey); });
                    var sb = new Core.Scripts.ScriptBuilder();
                    for (var j = 0; j < array.length; j++)
                        sb.push(array[j].signature);
                    scripts[i] = new Core.Scripts.Script();
                    scripts[i].stackScript = sb.toArray();
                    scripts[i].redeemScript = this_2.redeemScripts[i];
                };
                var this_2 = this;
                for (var i = 0; i < scripts.length; i++) {
                    _loop_2(i);
                }
                return scripts;
            };
            SignatureContext.prototype.isCompleted = function () {
                for (var i = 0; i < this.completed.length; i++)
                    if (!this.completed[i])
                        return false;
                return true;
            };
            return SignatureContext;
        }());
        Core.SignatureContext = SignatureContext;
    })(Core = AntShares.Core || (AntShares.Core = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Core;
    (function (Core) {
        var SplitOrder = (function () {
            function SplitOrder() {
            }
            SplitOrder.prototype.deserialize = function (reader) {
                this.amount = reader.readFixed8();
                this.price = reader.readFixed8();
                this.client = reader.readUint160();
            };
            SplitOrder.prototype.serialize = function (writer) {
                writer.writeFixed8(this.amount);
                writer.writeFixed8(this.price);
                writer.writeUintVariable(this.client);
            };
            return SplitOrder;
        }());
        Core.SplitOrder = SplitOrder;
    })(Core = AntShares.Core || (AntShares.Core = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Core;
    (function (Core) {
        var TransactionAttribute = (function () {
            function TransactionAttribute() {
            }
            TransactionAttribute.prototype.deserialize = function (reader) {
                this.usage = reader.readByte();
                if (this.usage == Core.TransactionAttributeUsage.ContractHash || (this.usage >= Core.TransactionAttributeUsage.Hash1 && this.usage <= Core.TransactionAttributeUsage.Hash15))
                    this.data = reader.readBytes(32);
                else if (this.usage == Core.TransactionAttributeUsage.ECDH02 || this.usage == Core.TransactionAttributeUsage.ECDH03) {
                    var array = new Uint8Array(33);
                    array[0] = this.usage;
                    Array.copy(new Uint8Array(reader.readBytes(32)), 0, array, 1, 32);
                    this.data = array.buffer;
                }
                else if (this.usage == Core.TransactionAttributeUsage.Script)
                    this.data = reader.readVarBytes(0xffff);
                else if (this.usage == Core.TransactionAttributeUsage.CertUrl || this.usage == Core.TransactionAttributeUsage.DescriptionUrl)
                    this.data = reader.readVarBytes(0xff);
                else if (this.usage == Core.TransactionAttributeUsage.Description || this.usage >= Core.TransactionAttributeUsage.Remark)
                    this.data = reader.readVarBytes(0xff);
                else
                    throw new RangeError();
            };
            TransactionAttribute.prototype.serialize = function (writer) {
                writer.writeByte(this.usage);
                if (this.usage == Core.TransactionAttributeUsage.Script)
                    writer.writeVarInt(this.data.byteLength);
                else if (this.usage == Core.TransactionAttributeUsage.CertUrl || this.usage == Core.TransactionAttributeUsage.DescriptionUrl)
                    writer.writeVarInt(this.data.byteLength);
                else if (this.usage == Core.TransactionAttributeUsage.Description || this.usage >= Core.TransactionAttributeUsage.Remark)
                    writer.writeVarInt(this.data.byteLength);
                if (this.usage == Core.TransactionAttributeUsage.ECDH02 || this.usage == Core.TransactionAttributeUsage.ECDH03)
                    writer.write(this.data, 1, 32);
                else
                    writer.write(this.data);
            };
            return TransactionAttribute;
        }());
        Core.TransactionAttribute = TransactionAttribute;
    })(Core = AntShares.Core || (AntShares.Core = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Core;
    (function (Core) {
        (function (TransactionAttributeUsage) {
            TransactionAttributeUsage[TransactionAttributeUsage["ContractHash"] = 0] = "ContractHash";
            TransactionAttributeUsage[TransactionAttributeUsage["ECDH02"] = 2] = "ECDH02";
            TransactionAttributeUsage[TransactionAttributeUsage["ECDH03"] = 3] = "ECDH03";
            TransactionAttributeUsage[TransactionAttributeUsage["Script"] = 32] = "Script";
            TransactionAttributeUsage[TransactionAttributeUsage["CertUrl"] = 128] = "CertUrl";
            TransactionAttributeUsage[TransactionAttributeUsage["DescriptionUrl"] = 129] = "DescriptionUrl";
            TransactionAttributeUsage[TransactionAttributeUsage["Description"] = 144] = "Description";
            TransactionAttributeUsage[TransactionAttributeUsage["Hash1"] = 161] = "Hash1";
            TransactionAttributeUsage[TransactionAttributeUsage["Hash2"] = 162] = "Hash2";
            TransactionAttributeUsage[TransactionAttributeUsage["Hash3"] = 163] = "Hash3";
            TransactionAttributeUsage[TransactionAttributeUsage["Hash4"] = 164] = "Hash4";
            TransactionAttributeUsage[TransactionAttributeUsage["Hash5"] = 165] = "Hash5";
            TransactionAttributeUsage[TransactionAttributeUsage["Hash6"] = 166] = "Hash6";
            TransactionAttributeUsage[TransactionAttributeUsage["Hash7"] = 167] = "Hash7";
            TransactionAttributeUsage[TransactionAttributeUsage["Hash8"] = 168] = "Hash8";
            TransactionAttributeUsage[TransactionAttributeUsage["Hash9"] = 169] = "Hash9";
            TransactionAttributeUsage[TransactionAttributeUsage["Hash10"] = 170] = "Hash10";
            TransactionAttributeUsage[TransactionAttributeUsage["Hash11"] = 171] = "Hash11";
            TransactionAttributeUsage[TransactionAttributeUsage["Hash12"] = 172] = "Hash12";
            TransactionAttributeUsage[TransactionAttributeUsage["Hash13"] = 173] = "Hash13";
            TransactionAttributeUsage[TransactionAttributeUsage["Hash14"] = 174] = "Hash14";
            TransactionAttributeUsage[TransactionAttributeUsage["Hash15"] = 175] = "Hash15";
            TransactionAttributeUsage[TransactionAttributeUsage["Remark"] = 240] = "Remark";
            TransactionAttributeUsage[TransactionAttributeUsage["Remark1"] = 241] = "Remark1";
            TransactionAttributeUsage[TransactionAttributeUsage["Remark2"] = 242] = "Remark2";
            TransactionAttributeUsage[TransactionAttributeUsage["Remark3"] = 243] = "Remark3";
            TransactionAttributeUsage[TransactionAttributeUsage["Remark4"] = 244] = "Remark4";
            TransactionAttributeUsage[TransactionAttributeUsage["Remark5"] = 245] = "Remark5";
            TransactionAttributeUsage[TransactionAttributeUsage["Remark6"] = 246] = "Remark6";
            TransactionAttributeUsage[TransactionAttributeUsage["Remark7"] = 247] = "Remark7";
            TransactionAttributeUsage[TransactionAttributeUsage["Remark8"] = 248] = "Remark8";
            TransactionAttributeUsage[TransactionAttributeUsage["Remark9"] = 249] = "Remark9";
            TransactionAttributeUsage[TransactionAttributeUsage["Remark10"] = 250] = "Remark10";
            TransactionAttributeUsage[TransactionAttributeUsage["Remark11"] = 251] = "Remark11";
            TransactionAttributeUsage[TransactionAttributeUsage["Remark12"] = 252] = "Remark12";
            TransactionAttributeUsage[TransactionAttributeUsage["Remark13"] = 253] = "Remark13";
            TransactionAttributeUsage[TransactionAttributeUsage["Remark14"] = 254] = "Remark14";
            TransactionAttributeUsage[TransactionAttributeUsage["Remark15"] = 255] = "Remark15";
        })(Core.TransactionAttributeUsage || (Core.TransactionAttributeUsage = {}));
        var TransactionAttributeUsage = Core.TransactionAttributeUsage;
    })(Core = AntShares.Core || (AntShares.Core = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Core;
    (function (Core) {
        var TransactionInput = (function () {
            function TransactionInput() {
            }
            TransactionInput.prototype.deserialize = function (reader) {
                this.prevHash = reader.readUint256();
                this.prevIndex = reader.readUint16();
            };
            TransactionInput.prototype.equals = function (other) {
                if (this === other)
                    return true;
                if (null == other)
                    return false;
                return this.prevHash.equals(other.prevHash) && this.prevIndex == other.prevIndex;
            };
            TransactionInput.prototype.serialize = function (writer) {
                writer.writeUintVariable(this.prevHash);
                writer.writeUint16(this.prevIndex);
            };
            TransactionInput.prototype.toString = function () {
                return this.prevHash.toString() + ':' + this.prevIndex;
            };
            return TransactionInput;
        }());
        Core.TransactionInput = TransactionInput;
    })(Core = AntShares.Core || (AntShares.Core = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Core;
    (function (Core) {
        var TransactionOutput = (function () {
            function TransactionOutput() {
            }
            TransactionOutput.prototype.deserialize = function (reader) {
                this.assetId = reader.readUint256();
                this.value = reader.readFixed8();
                this.scriptHash = reader.readUint160();
            };
            TransactionOutput.prototype.serialize = function (writer) {
                writer.writeUintVariable(this.assetId);
                writer.writeFixed8(this.value);
                writer.writeUintVariable(this.scriptHash);
            };
            return TransactionOutput;
        }());
        Core.TransactionOutput = TransactionOutput;
    })(Core = AntShares.Core || (AntShares.Core = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Core;
    (function (Core) {
        (function (TransactionType) {
            TransactionType[TransactionType["MinerTransaction"] = 0] = "MinerTransaction";
            TransactionType[TransactionType["IssueTransaction"] = 1] = "IssueTransaction";
            TransactionType[TransactionType["ClaimTransaction"] = 2] = "ClaimTransaction";
            TransactionType[TransactionType["EnrollmentTransaction"] = 32] = "EnrollmentTransaction";
            TransactionType[TransactionType["VotingTransaction"] = 36] = "VotingTransaction";
            TransactionType[TransactionType["RegisterTransaction"] = 64] = "RegisterTransaction";
            TransactionType[TransactionType["ContractTransaction"] = 128] = "ContractTransaction";
            TransactionType[TransactionType["AgencyTransaction"] = 176] = "AgencyTransaction";
        })(Core.TransactionType || (Core.TransactionType = {}));
        var TransactionType = Core.TransactionType;
    })(Core = AntShares.Core || (AntShares.Core = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Core;
    (function (Core) {
        var VotingTransaction = (function (_super) {
            __extends(VotingTransaction, _super);
            function VotingTransaction() {
                _super.call(this, Core.TransactionType.VotingTransaction);
            }
            Object.defineProperty(VotingTransaction.prototype, "systemFee", {
                get: function () { return AntShares.Fixed8.fromNumber(10); },
                enumerable: true,
                configurable: true
            });
            VotingTransaction.prototype.deserializeExclusiveData = function (reader) {
                this.enrollments = new Array(reader.readVarInt(0x10000000));
                for (var i = 0; i < this.enrollments.length; i++)
                    this.enrollments[i] = reader.readUint256();
            };
            VotingTransaction.prototype.serializeExclusiveData = function (writer) {
                writer.writeVarInt(this.enrollments.length);
                for (var i = 0; i < this.enrollments.length; i++)
                    writer.writeUintVariable(this.enrollments[i]);
            };
            return VotingTransaction;
        }(Core.Transaction));
        Core.VotingTransaction = VotingTransaction;
    })(Core = AntShares.Core || (AntShares.Core = {}));
})(AntShares || (AntShares = {}));
ArrayBuffer.prototype.toScriptHash = Uint8Array.prototype.toScriptHash = function () {
    return window.crypto.subtle.digest("SHA-256", this).then(function (result) {
        return window.crypto.subtle.digest("RIPEMD-160", result);
    }).then(function (result) {
        return new AntShares.Uint160(result);
    });
};
var AntShares;
(function (AntShares) {
    var Core;
    (function (Core) {
        var Scripts;
        (function (Scripts) {
            var Script = (function () {
                function Script() {
                }
                Script.prototype.deserialize = function (reader) {
                    this.stackScript = reader.readVarBytes();
                    this.redeemScript = reader.readVarBytes();
                };
                Script.prototype.serialize = function (writer) {
                    writer.writeVarBytes(this.stackScript);
                    writer.writeVarBytes(this.redeemScript);
                };
                return Script;
            }());
            Scripts.Script = Script;
        })(Scripts = Core.Scripts || (Core.Scripts = {}));
    })(Core = AntShares.Core || (AntShares.Core = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Core;
    (function (Core) {
        var Scripts;
        (function (Scripts) {
            var ScriptBuilder = (function () {
                function ScriptBuilder() {
                    this.ms = new Array();
                }
                ScriptBuilder.prototype.add = function (script) {
                    if (typeof script === "number") {
                        this.ms.push(script);
                    }
                    else {
                        Array.prototype.push.apply(this.ms, Uint8Array.fromArrayBuffer(script));
                    }
                    return this;
                };
                ScriptBuilder.prototype.push = function (data) {
                    if (data == null)
                        throw new RangeError();
                    if (typeof data === "number") {
                        if (data == -1)
                            return this.add(79);
                        if (data == 0)
                            return this.add(0);
                        if (data > 0 && data <= 16)
                            return this.add(81 - 1 + data);
                        return this.push(new AntShares.BigInteger(data).toUint8Array());
                    }
                    else {
                        var buffer = data;
                        if (buffer.byteLength <= 75) {
                            this.add(buffer.byteLength);
                            this.add(buffer);
                        }
                        else if (buffer.byteLength < 0x100) {
                            this.add(76);
                            this.add(buffer.byteLength);
                            this.add(buffer);
                        }
                        else if (buffer.byteLength < 0x10000) {
                            this.add(77);
                            this.add(buffer.byteLength & 0xff);
                            this.add(buffer.byteLength >>> 8);
                            this.add(buffer);
                        }
                        else if (buffer.byteLength < 0x100000000) {
                            this.add(78);
                            this.add(buffer.byteLength & 0xff);
                            this.add((buffer.byteLength >>> 8) & 0xff);
                            this.add((buffer.byteLength >>> 16) & 0xff);
                            this.add(buffer.byteLength >>> 24);
                            this.add(buffer);
                        }
                        else {
                            throw new RangeError();
                        }
                        return this;
                    }
                };
                ScriptBuilder.prototype.toArray = function () {
                    return (new Uint8Array(this.ms)).buffer;
                };
                return ScriptBuilder;
            }());
            Scripts.ScriptBuilder = ScriptBuilder;
        })(Scripts = Core.Scripts || (Core.Scripts = {}));
    })(Core = AntShares.Core || (AntShares.Core = {}));
})(AntShares || (AntShares = {}));
var AntShares;
(function (AntShares) {
    var Core;
    (function (Core) {
        Core.Blockchain.GenesisBlock.ensureHash();
        for (var i = 0; i < Core.Blockchain.GenesisBlock.transactions.length; i++)
            Core.Blockchain.GenesisBlock.transactions[i].ensureHash();
    })(Core = AntShares.Core || (AntShares.Core = {}));
})(AntShares || (AntShares = {}));
//# sourceMappingURL=AntSharesSDK.js.map