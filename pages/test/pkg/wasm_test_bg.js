let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => state.dtor(state.a, state.b));

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {

        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            state.a = a;
            real._wbg_cb_unref();
        }
    };
    real._wbg_cb_unref = () => {
        if (--state.cnt === 0) {
            state.dtor(state.a, state.b);
            state.a = 0;
            CLOSURE_DTORS.unregister(state);
        }
    };
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    }
}

let WASM_VECTOR_LEN = 0;

function wasm_bindgen__convert__closures_____invoke__hd9bc4963a9b22e4d(arg0, arg1) {
    wasm.wasm_bindgen__convert__closures_____invoke__hd9bc4963a9b22e4d(arg0, arg1);
}

export function run() {
    wasm.run();
}

export function __wbg___wbindgen_is_undefined_f6b95eab589e0269(arg0) {
    const ret = arg0 === undefined;
    return ret;
};

export function __wbg___wbindgen_rethrow_78714972834ecdf1(arg0) {
    throw arg0;
};

export function __wbg___wbindgen_throw_dd24417ed36fc46e(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export function __wbg__wbg_cb_unref_87dfb5aaa0cbcea7(arg0) {
    arg0._wbg_cb_unref();
};

export function __wbg_addEventListener_6a82629b3d430a48() { return handleError(function (arg0, arg1, arg2, arg3) {
    arg0.addEventListener(getStringFromWasm0(arg1, arg2), arg3);
}, arguments) };

export function __wbg_call_abb4ff46ce38be40() { return handleError(function (arg0, arg1) {
    const ret = arg0.call(arg1);
    return ret;
}, arguments) };

export function __wbg_document_5b745e82ba551ca5(arg0) {
    const ret = arg0.document;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_getElementById_e05488d2143c2b21(arg0, arg1, arg2) {
    const ret = arg0.getElementById(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_innerHTML_457ee77b726e21e6(arg0, arg1) {
    const ret = arg1.innerHTML;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_instanceof_HtmlElement_20a3acb594113d73(arg0) {
    let result;
    try {
        result = arg0 instanceof HTMLElement;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_Window_b5cf7783caa68180(arg0) {
    let result;
    try {
        result = arg0 instanceof Window;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_new_no_args_cb138f77cf6151ee(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return ret;
};

export function __wbg_set_innerHTML_f1d03f780518a596(arg0, arg1, arg2) {
    arg0.innerHTML = getStringFromWasm0(arg1, arg2);
};

export function __wbg_static_accessor_GLOBAL_769e6b65d6557335() {
    const ret = typeof global === 'undefined' ? null : global;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_GLOBAL_THIS_60cf02db4de8e1c1() {
    const ret = typeof globalThis === 'undefined' ? null : globalThis;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_SELF_08f5a74c69739274() {
    const ret = typeof self === 'undefined' ? null : self;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_WINDOW_a8924b26aa92d024() {
    const ret = typeof window === 'undefined' ? null : window;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbindgen_cast_aaa93aae03c115ab(arg0, arg1) {
    // Cast intrinsic for `Closure(Closure { dtor_idx: 1, function: Function { arguments: [], shim_idx: 2, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
    const ret = makeMutClosure(arg0, arg1, wasm.wasm_bindgen__closure__destroy__h273bf3ce697c5c46, wasm_bindgen__convert__closures_____invoke__hd9bc4963a9b22e4d);
    return ret;
};

export function __wbindgen_init_externref_table() {
    const table = wasm.__wbindgen_externrefs;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
};
