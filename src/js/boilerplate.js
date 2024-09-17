
// @cell('bool', [])
export const bool = (
(_) =>
  _ === "true"
    ? true
    : _ === "false"
    ? false
    : _ instanceof Array
    ? _.length > 0
    : _ instanceof Object
    ? Object.keys(_).length > 0
    : false
);

// @cell('str', [])
export const str = (
_ => "" + _
);

// @cell('cmp', [])
export const cmp = (
(()=>{const cmp = (a, b) => {
    //if (a === undefined) {
    //    return b === undefined ? 0 : -cmp(b, a);
    //}
    const ta = typeof a;
    const tb = typeof b;
    if (ta === tb) {
        switch (ta) {
            case "string":
                return a.localeCompare(b);
            case "object":
                if (a === b) {
                    return 0;
                } else if (a instanceof Array) {
                    const la = a.length;
                    const lb = b.length;
                    if (la < lb) {
                        return -1;
                    } else if (la > b) {
                        return 1;
                    } else {
                        var i = 0;
                        while (i < la) {
                            const v = cmp(a[i], b[i]);
                            if (v !== 0) {
                                return v;
                            }
                          i += 1;
                        }
                        return 0;
                    }
                } else {
                    return -1;
                }
            default:
                return a === b ? 0 : a > b ? 1 : -1;
        }
    } else {
        return a === b ? 0 : a > b ? 1 : -1;
    }
}; return cmp})()
);

// @cell('is', [])
export const is = (
(v,...args) => {
  var i = 0;
  while (i < args.length ) {
    if (v === args[i]) {return true}
    else {i++}
  }
  return false
}
);

// @cell('isDef', [])
export const isDef = (
_ => _ !== undefined
);

// @cell('isValue', [])
export const isValue = (
_ => _ !== undefined && _ != null
);

// @cell('idem', [])
export const idem = (
_ => _
);

// @cell('asMappable', [])
export const asMappable = (
functor => _ => _ instanceof Array ? _.map(_ => functor(_)) : functor(_)
);

// @cell('callable', [])
export const callable = (
v => v instanceof Function ? v : () => v
);

// @cell('isMap', [])
export const isMap = (
_ => _ !== null && (_ instanceof Map || _ instanceof Object && !(_ instanceof Array))
);

// @cell('isList', [])
export const isList = (
_ => _ instanceof Array
);

// @cell('isIterator', [])
export const isIterator = (
(_) =>
  false &&
  _ &&
  (typeof _.next === "function" || typeof _[Symbol.iterator] === "function")
);

// @cell('isIterable', [])
export const isIterable = (
(_) =>
  // FIXME: Not sure about that one, see isCollection
  _ !== null && _ instanceof Object
);

// @cell('Nothing', [])
export const Nothing = (
new String("Nothing")
);

// @cell('swallow', [])
export const swallow = (
(a,b) => b
);

// @cell('nop', [])
export const nop = (
() => {}
);

// @cell('pipe', [])
export const pipe = (
(v,...f) => {var r=v;for(var i=0;i<f.length;i++){r=f[i](r)};return r}
);

// @cell('compose', [])
export const compose = (
(...args) => {
  const n = args.length;
  if (n == 2) {return _ => args[1](args[0](_))}
  else if (n == 3) {return _ => args[2](args[1](args[0](_)))}
  throw new window.Exception("Not supported");
}
);

// @cell('memoize', [])
export const memoize = (
(producer, key=true, store=undefined) => {
  var state   = undefined
  var trigger = undefined
  return ()=> {
    const t = store ? store(key,key) : trigger
    if (t !== key) {
      trigger = store ? store(key,t) : trigger
      key=trigger;state=producer();}
    return state;
  }
}
);

// @cell('freeze', [])
export const freeze = (
value => value instanceof Object && Object.freeze(value) ? value : value
);

// @cell('state', [])
export const state = (
( ()=>{
  const state = {};
  return (name,value=undefined) => {
    if (value === undefined) {
      return state[name];
    } else {
      state[name] = value;
      return value;
    }
  }
})()
);

// @cell('index', [])
export const index = (
(collection, value) => {
  if (collection instanceof Array) {
    return collection.indexOf(value);
  } else if (collection instanceof Object) {
    for (let k in collection) {
      if (collection[k] === value) {
        return k;
      }
    }
  }
  return -1;
}
);

// @cell('access', [])
export const access = (
(collection, path) => typeof collection === "object" 
  ? (typeof path === "string" ? collection[path] : path.reduce((r,v) => typeof r === "object" ? r[v] : undefined, collection))
  : undefined
);

// @cell('slice', [])
export const slice = (
(collection, min, max = undefined) =>
  collection && collection instanceof Object
    ? collection instanceof Array
      ? collection.slice(min, max)
      : Object.keys(collection)
          .slice(min, max)
          .reduce((r, v) => {
            r[v] = collection[v];
            return r;
          }, {})
    : undefined
);

// @cell('max', [])
export const max = (
(()=>{
  const max = (...args) =>
  args.length === 1 ? (args[0] instanceof Array ?args[0].reduce((r,v)=>r === undefined ? v : max(r,v)) : args[0]) :
  args.length === 2 ? Math.max(max(args[0]), max(args[1]))
  : args.reduce((r,v)=>r === undefined ? v : max(r,v))
return max})()
);

// @cell('array', [])
export const array = (
(count,creator=null) => {
  const res = new Array(count);
  while(count) {count--;res[count] = creator ? creator(count) : count}
  return res;
}
);

// @cell('merge', [])
export const merge = (
(value, other, replace = false) => {
  if (value === null || value === undefined) {
    return other;
  } else if (other === null || value === other) {
    return value;
  } else {
    for (let k in other) {
      const v = value[k];
      const w = other[k];
      if (v === undefined) {
        value[k] = w;
      } else if (replace === true) {
        value[k] = w;
      } else if (replace instanceof Function) {
        value[k] = replace(value[k], w);
      }
    }
    return value;
  }
}
);

// @cell('range', [])
export const range = (
(start, end, step = 1, closed = false) => {
  if (end === undefined) {end=start;start=0}
  const n = Math.ceil(Math.max(0, (end - start) / step)) + (closed ? 1 : 0)
  const r = new Array(n)
  var v = start
  for (let i = 0; i < n; i++) {
    r[i] = v
    v += step
  }
  return r
}
);

// @cell('sign', [])
export const sign = (
(value) => 
   value < 0 ? -1 : 1
);

// @cell('order', [])
export const order = (
(value, base = 10) =>
   Math.log(Math.abs(value)) / Math.log(base)
);

// @cell('lerp', [])
export const lerp = (
(a, b, k) => {
  k = k === undefined ? 0.5 : k
  return a + (b - a) * k
}
);

// @cell('prel', [])
export const prel = (
(v, a, b) =>
   (v - a) / (b - a)
);

// @cell('sinestep', [])
export const sinestep = (
x => (Math.cos(Math.PI+Math.PI*x) + 1) / 2
);

// @cell('smoothstep', [])
export const smoothstep = (
x => x * x * x * (x * (x * 6 - 15) + 10)
);

// @cell('smootherstep', [])
export const smootherstep = (
x => x*x*x*(x*(x*6-15)+10)
);

// @cell('clamp', [])
export const clamp = (
(v, a, b) => Math.max(a, Math.min(b, v))
);

// @cell('round', [])
export const round = (
(number, factor = 1, bound = 1) => {
  const base = number / factor
  const roundedBase =
        bound < 0
          ? Math.floor(base)
          : bound > 0
            ? Math.ceil(base)
            : Math.round(base)
  return roundedBase * factor
}
);

// @cell('min', [])
export const min = (
(()=>{
  const min = (...args) =>
  args.length === 1 ? (args[0] instanceof Array ?args[0].reduce((r,v)=>r === undefined ? v : min(r,v)) : args[0]) :
  args.length === 2 ? Math.min(min(args[0]), min(args[1]))
  : args.reduce((r,v)=>r === undefined ? v : min(r,v))
return min})()
);

// @cell('wrap', [])
export const wrap = (
(v,base=10) => {
  const b = Math.abs(base)
  return b === 0 || v===0 ? 0 :
    v > 0 ? v % b : (b + (v % b)) % b;}
);

// @cell('dist', [])
export const dist = (
(a,b) => Math.abs(b - a)
);

// @cell('closestInOrder', [])
export const closestInOrder = (
(values, value, affinity = 0) => {
  var i = 0
  const n = values.length
  var last = 0
  while (i < n) {
    const current = values[i]
    if (value === current) {
      return value
    } else if (value < current) {
      if (i === 0) {
        return current
      } else {
        if (affinity === 0) {
          return value - last < current - value ? last : current
        } else if (affinity < 0) {
          return last
        } else {
          return current
        }
      }
    }
    last = current
    i += 1
  }
  return last
}
);

// @cell('within', [])
export const within = (
(v,a,b) => a <= v && v <= b
);

// @cell('sub', [])
export const sub = (
(a,b) => a instanceof Array ? a[0] - a[1] : a - b
);

// @cell('sq', [])
export const sq = (
v => v * v
);

// @cell('sqrt', [])
export const sqrt = (
v => Math.sqrt(v)
);

// @cell('reldist', [])
export const reldist = (
(a,b) => (b-a)/b
);

// @cell('circdist', [])
export const circdist = (
(a,b) => {
  const d =  Math.abs(b - a) % 1.0;
  return d > 0.5 ? 1 - d : d;
}
);

// @cell('factorial', [])
export const factorial = (
n => {
  var res = n;
  while (n > 0) {res *= n--}
  return res;
}
);

// @cell('reducematches', [])
export const reducematches = (
(text, regexp, reducer, initial = []) => {
  let res = initial;
  let i = 0;
  let o = 0;
  let r = undefined;
  for (const match of text.matchAll(regexp)) {
    if (o != match.index) {
      r = reducer(res, text.substring(o, match.index), i++);
    }
    res = r === undefined ? res : r;
    r = reducer(res, match, i++);
    o = match.index + match[0].length;
    res = r === undefined ? res : r;
  }
  if (o != text.length) {
    r = reducer(res, text.substring(o), i++);
  }
  res = r === undefined ? res : r;
  return res;
}
);

// @cell('fromKebabCase', [])
export const fromKebabCase = (
(text) => text.split("-").map((_) => _.strip())
);

// @cell('capitalize', [])
export const capitalize = (
(text) => `${text.substr(0, 1).toUpperCase()}${text.substr(1)}`
);

// @cell('asNumber', [])
export const asNumber = (
(value) => {
  if (value === undefined || value === null) {
    return 0;
  }
  if (typeof value === "number") {
    return isNaN(value) ? 0 : value;
  }
  return value instanceof Date ? value.getTime() : 0;
}
);

// @cell('safekey', [])
export const safekey = (
(()=>{
  const RE_OFFKEY = new RegExp ("([^A-Za-z0-9 \t\n])", "g");
  const RE_SPACES = new RegExp ("[ \t\n]+", "g")
  return (_,sep="_") =>
    ("" + _).trim().replace(RE_OFFKEY, "_").replace(RE_SPACES, sep)
})()
);

// @cell('uid', [])
export const uid = (
() =>
  // FROM: https://stackoverflow.com/questions/6248666/how-to-generate-short-uid-like-ax4j9z-in-js
  // I generate the UID from two parts here
  // to ensure the random number provide enough bits.
  ("000" + ((Math.random() * 46656) | 0).toString(36)).slice(-3) +
  ("000" + ((Math.random() * 46656) | 0).toString(36)).slice(-3)
);

// @cell('style', [])
export const style = (
(n,d) => {
  for (var k in d) {n.style[k] = d[k]}
  return n
}
);

// @cell('setattr', [])
export const setattr = (
(node, name, value, append = 0, ns = undefined) => {
  const t = typeof value;
  if (!ns && name.startsWith("on")) {
    const n = name.toLowerCase();
    if (node[n] !== undefined) {
      // We have a callback
      node[n] = value;
    }
    return node;
  }
  if (!ns & (name === "style") && t === "object") {
    // We manage style properties by valle
    if (!append) {
      node.setAttribute("style", "");
    }
    Object.assign(node.style, value);
  } else if (!ns && name === "value" && node.value !== undefined) {
    node.value = value ? value : "";
  } else if (!ns && name.startsWith("on") && node[name] !== undefined) {
    // We have a callback
    node[name] = value;
  } else if (value === undefined || value === null) {
    // We remove the attribute
    ns ? node.removeAttributeNS(ns, name) : node.removeAttribute(name);
  } else {
    // We have a regular value that we stringify
    const v =
      t === "number"
        ? `${value}`
        : t === "string"
        ? value
        : JSON.stringify(value);
    // If we append, we create an inermediate value.
    if (append) {
      const e = ns ? node.getAttributeNS(ns, name) : node.getAttribute(name);
      const w = `${append < 0 && e ? e + " " : ""}${v}${
        append > 0 && e ? " " + e : ""
      }`;
      ns ? node.setAttributeNS(ns, name, w) : node.setAttribute(name, w);
    } else {
      ns ? node.setAttributeNS(ns, name, v) : node.setAttribute(name, v);
    }
  }
  return node;
}
);

// @cell('Empty', [])
export const Empty = (
"\u200b"
);

// @cell('bind', [])
export const bind = (
(scope,key,handler) => {
  if (scope[key]) {scope[key].push(handler)}
  else {scope[key]=[handler]}
  return scope;
}
);

// @cell('unbind', [])
export const unbind = (
(scope,key,handler) => {
  if (scope[key]) {scope[key]=scope[key].filter(_ => _ !== handler)}
  return scope;
}
);

// @cell('trigger', [])
export const trigger = (
(scope, key, ...value) =>
  scope && scope[key] &&
  scope[key].forEach(_ => _(...value))
);

// @cell('defer', [])
export const defer = (
(effector, delay=0, guard=undefined) => delay ? window.setTimeout(guard ? _ => (guard() && effector(effector)) : effector, delay) : effector(effector)
);

// @cell('sprintf', [])
export const sprintf = (
(...args)=>{
    var str_repeat  = function(i, m){ for (var o = []; m > 0; o[--m] = i) {}; return(o.join(''));};
		var i = 0, a, f = args[i++], o = [], m, p, c, x;
		while (f) {
			if (m = /^[^\x25]+/.exec(f)) {
				o.push(m[0]);
			} else if (m = /^\x25{2}/.exec(f)) {
				o.push('%');
			} else if (m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f)) {
				if (((a = args[m[1] || i++]) == null) || (a == undefined)) {
					return console.error("std.core.sprintf: too few arguments, expected ", args.length, "got", i - 1, "in", args[0]);
				}
				if (/[^s]/.test(m[7]) && (typeof(a) != 'number')) {
					return console.error("std.core.sprintf: expected number at", i - 1, "got",a, "in", args[0]);
				}
				switch (m[7]) {
					case 'b': a = a.toString(2); break;
					case 'c': a = String.fromCharCode(a); break;
					case 'd': a = parseInt(a); break;
					case 'e': a = m[6] ? a.toExponential(m[6]) : a.toExponential(); break;
					case 'f': a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a); break;
					case 'o': a = a.toString(8); break;
					case 's': a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a); break;
					case 'u': a = Math.abs(a); break;
					case 'x': a = a.toString(16); break;
					case 'X': a = a.toString(16).toUpperCase(); break;
				}
				a = (/[def]/.test(m[7]) && m[2] && a > 0 ? '+' + a : a);
				c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' ';
				x = m[5] - String(a).length;
				p = m[5] ? str_repeat(c, x) : '';
				o.push(m[4] ? a + p : p + a);
			} else {
				return console.error("std.core.sprintf: reached state that shouldn't have been reached.");
			}
			f = f.substring(m[0].length);
		}
		return o.join('');
}
);

// @cell('strhash', [])
export const strhash = (
(text, seed = 5381) => {
  let hash = 5381,
    i = text.length;
  while (i) {
    hash = (hash * 33) ^ text.charCodeAt(--i);
  }
  return hash >>> 0;
}
);

// @cell('numcode', [])
export const numcode = (
(
  number,
  alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
) => {
  const res = [];
  const n = alphabet.length;
  let v = number;
  while (v > 0) {
    const r = v % n;
    v = Math.floor(v / n);
    res.unshift(alphabet.charAt(r));
  }
  return res.join("");
}
);

// @cell('md5', [])
export const md5 = (
(inputString) => {
  var hc = "0123456789abcdef";
  function rh(n) {
    var j,
      s = "";
    for (j = 0; j <= 3; j++)
      s +=
        hc.charAt((n >> (j * 8 + 4)) & 0x0f) + hc.charAt((n >> (j * 8)) & 0x0f);
    return s;
  }
  function ad(x, y) {
    var l = (x & 0xffff) + (y & 0xffff);
    var m = (x >> 16) + (y >> 16) + (l >> 16);
    return (m << 16) | (l & 0xffff);
  }
  function rl(n, c) {
    return (n << c) | (n >>> (32 - c));
  }
  function cm(q, a, b, x, s, t) {
    return ad(rl(ad(ad(a, q), ad(x, t)), s), b);
  }
  function ff(a, b, c, d, x, s, t) {
    return cm((b & c) | (~b & d), a, b, x, s, t);
  }
  function gg(a, b, c, d, x, s, t) {
    return cm((b & d) | (c & ~d), a, b, x, s, t);
  }
  function hh(a, b, c, d, x, s, t) {
    return cm(b ^ c ^ d, a, b, x, s, t);
  }
  function ii(a, b, c, d, x, s, t) {
    return cm(c ^ (b | ~d), a, b, x, s, t);
  }
  function sb(x) {
    var i;
    var nblk = ((x.length + 8) >> 6) + 1;
    var blks = new Array(nblk * 16);
    for (i = 0; i < nblk * 16; i++) blks[i] = 0;
    for (i = 0; i < x.length; i++)
      blks[i >> 2] |= x.charCodeAt(i) << ((i % 4) * 8);
    blks[i >> 2] |= 0x80 << ((i % 4) * 8);
    blks[nblk * 16 - 2] = x.length * 8;
    return blks;
  }
  var i,
    x = sb(inputString),
    a = 1732584193,
    b = -271733879,
    c = -1732584194,
    d = 271733878,
    olda,
    oldb,
    oldc,
    oldd;
  for (i = 0; i < x.length; i += 16) {
    olda = a;
    oldb = b;
    oldc = c;
    oldd = d;
    a = ff(a, b, c, d, x[i + 0], 7, -680876936);
    d = ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = ff(c, d, a, b, x[i + 10], 17, -42063);
    b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = gg(b, c, d, a, x[i + 0], 20, -373897302);
    a = gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = hh(a, b, c, d, x[i + 5], 4, -378558);
    d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = hh(d, a, b, c, x[i + 0], 11, -358537222);
    c = hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = ii(a, b, c, d, x[i + 0], 6, -198630844);
    d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = ad(a, olda);
    b = ad(b, oldb);
    c = ad(c, oldc);
    d = ad(d, oldd);
  }
  return rh(a) + rh(b) + rh(c) + rh(d);
}
);

// @cell('ms', ['idem'])
export const ms = (
idem
);

// @cell('effect', ['swallow'])
export const effect = (
(v,f) => swallow(f(v), v)
);

// @cell('hide', ['swallow'])
export const hide = (
node => swallow(node.classList.add("hidden"), node)
);

// @cell('show', ['swallow'])
export const show = (
node => swallow(node.classList.remove("hidden"), node)
);

// @cell('keymap', ['swallow'])
export const keymap = (
(node, keys) => swallow(
  node.addEventListener("keydown", _ => keys[_.key] ? keys[_.key](_, "down"): undefined),
  node
)
);

// @cell('isIn', ['index'])
export const isIn = (
(collection, value) => index(collection, value) !== -1
);

// @cell('subdivide', ['range'])
export const subdivide = (
(start=0,end=1,steps=100,closed=true) => 
  // TODO: Support nice start and end?
  steps <= 0 
  ? [] 
  : start===end 
  ? (closed ? [start] : [])
  : range(start,end,(end-start)/(steps - (closed ? 1 : 0)),closed)
);

// @cell('nicer', ['sign', 'order', 'closestInOrder'])
export const nicer = (
(value, affinity = 0, values = [1, 5, 10, 20, 25, 50, 100]) => {
  const v = Math.abs(value)
  const s = sign(value)
  const k = Math.pow(10, Math.floor(order(v)) -1)
  return s * closestInOrder(values, v/k, affinity*s) * k
}
);

// @cell('delta', ['sub'])
export const delta = (
(series,distance=sub) => series.reduce((r,v,i)=>{
  if (i > 0) {r.push(distance(v, series[i - 1]))}
  return r;
}, [])
);

// @cell('sqdist', ['sq', 'sub'])
export const sqdist = (
(a,b) => sq(sub(a,b))
);

// @cell('cnk', ['factorial'])
export const cnk = (
(n,k) => factorial(n)/(factorial(k)*factorial(n-k))
);

// @cell('fromPascalCase', ['reducematches'])
export const fromPascalCase = (
(text) =>
  reducematches(text, /[A-Z][a-z]+/g, (r, v) => {
    r.push(typeof v === "string" ? v : v[0]);
  })
);

// @cell('until', ['defer'])
export const until = (
(condition, effector, interval=100, delay=0) => {
  const f = () => condition() ? effector(effector) : defer(f, interval)
  defer(f, delay)
  return f;
}
);

// @cell('type', ['NodeList', 'StyleSheetList'])
export const type = (
_ => _ === null ? "null" : _ instanceof Array || _ instanceof NodeList || _ instanceof StyleSheetList ? "list" : typeof(_)
);

// @cell('iter', ['idem', 'isIterator', 'NodeList', 'StyleSheetList'])
export const iter = (
(
  value,
  iterator = idem,
  processor = idem,
  initial = undefined,
  empty = undefined
) => {
  // TODO: This should be documented
  if (value === undefined || value === null) {
    return processor(initial, value, undefined);
  } else if (typeof value === "string") {
    var i = 0;
    var v = undefined;
    var r = initial;
    const n = value.length;
    while (i < n) {
      v = value.charAt(i);
      const rr = iterator(v, i, r, value);
      if (rr === false) {
        return processor(r, v, i, value);
      } else {
        r = rr === undefined ? r : rr;
      }
      i += 1;
    }
    return i === 0 ? empty : processor(r, v, i, value);
  } else if (typeof value === "object") {
    var v = undefined;
    var r = initial;
    // NOTE: This has to be consistent with type(value) === "list"
    if (isIterator(value)) {
      var i = 0;
      for (let v of value) {
        const rr = iterator(v, i, r, value);
        if (rr === false) {
          return processor(r, v, i, value);
        } else {
          r = rr === undefined ? r : rr;
        }
        i += 1;
      }
      return i === 0 ? empty : processor(r, v, i, value);
    } else if (
      value instanceof Array ||
      value instanceof NodeList ||
      value instanceof StyleSheetList
    ) {
      var i = 0;
      const n = value.length;
      while (i < n) {
        v = value[i];
        const rr = iterator(v, i, r, value);
        if (rr === false) {
          return processor(r, v, i, value);
        } else {
          r = rr === undefined ? r : rr;
        }
        i += 1;
      }
      return i === 0 ? empty : processor(r, v, i, value);
    } else {
      var k = undefined;
      var i = 0;
      for (k in value) {
        v = value[k];
        const rr = iterator(v, k, r, value);
        if (rr === false) {
          return processor(r, v, k, value);
        } else {
          r = rr === undefined ? r : rr;
        }
        i++;
      }
      return i == 0 ? empty : processor(r, v, undefined, value);
    }
  } else {
    return processor(iterator(value, undefined, initial));
  }
}
);

// @cell('s', ['ms'])
export const s = (
_ => ms(_ * 1000)
);

// @cell('showhide', ['show', 'hide'])
export const showhide = (
(node, value) => value ? show(node) : hide(node)
);

// @cell('empty', ['type'])
export const empty = (
(value) =>
  value === null || value === undefined
    ? value
    : value instanceof Array
    ? []
    : type(value) === "list"
    ? []
    : type(value) === "object"
    ? {}
    : typeof value === "string"
    ? ""
    : value
);

// @cell('eq', ['type'])
export const eq = (
(()=>{const eq = (a, b) => {

    if (a === b) {return true}
    const ta = type(a);
    const tb = type(b);
  
    if (ta === tb) {
        switch (ta) {
            case "string":
              return a == b;
            case "list":
              const la = a.length;
              const lb = b.length;
              if (la !== lb) {
                return false;
              } else {
                var i = 0;
                while (i < la) {
                  if (!eq(a[i], b[i])) {
                    return false;
                  }
                  i += 1;
                }
                return true;
              }
            case "object":
              // TODO: We might want to do that with keys
              return a === b;
            default:
                return a == b;
        }
    } else {
        return a == b;
    }
}; return eq})()
);

// @cell('maptype', ['callable', 'type', 'idem'])
export const maptype = (
(v,m) => callable(m[type(v)]||m["_"]||idem)(v)
);

// @cell('items', ['type'])
export const items = (
(collection, asList=true) => {
  let isList = false;
  // TODO: Should use iter
  switch (type(collection)) {
    case "list":
      isList = true;
    case "object":
      const res = [];
      let i=0;
      if (asList) {
        for (let k in collection) {
            res[i++] = [isList ? i : k, collection[k]];
        }
      } else {
         for (let k in collection) {
            res[i++] = {key:k, value:collection[k]};
        }
      }
      return res;
    default:
      return []
  }
}
);

// @cell('has', ['type'])
export const has = (
(collection,item) => {
  switch (type(collection)) {
    case "list": 
      return (collection.indexOf(item) !== -1) 
    case "object":
      for (let k in collection) {if (collection[k] === item) {return true}}
      return false;
    default:
      return false;
  }
}
);

// @cell('ensure', ['type'])
export const ensure = (
(collection,item) => {
  switch (type(collection)) {
    case "list":
      if (collection.indexOf(item) === -1) {
        const res = collection.slice()
        res.push(item);
        return res;
      } else {
        return collection;
      }
    case "object":
      let i = 0;
      for (let k in collection) {
        if (collection[k] === item) {return collection} 
        i++;
      }
      while(collection[i]){i++}
      const r = {};
      Object.assign(r,collection);
      r[i]=item;
      return r;
    default:
      return collection;
  }
}
);

// @cell('remove', ['type'])
export const remove = (
(collection,item) => {
  switch (type(collection)) {
    case "list":
      if (collection.indexOf(item) === -1) {
        return collection;
      } else {
        return collection.filter( _ => _ !== item);
      }
    case "object":
      let found = false;
      for (let k in collection) {
        if (collection[k] === item) {found=true;break} 
      }
      if (found) {
        const r = {};
        for (let k in collection) {
          if (collection[k] !== item) {r[k]=collection[k]}
        }
        return r
      } else {
        return collection
      }
    default:
      return collection;
  }
}
);

// @cell('reverse', ['type', 'array'])
export const reverse = (
(collection) => {
  const t = type(collection);
  switch (t) {
    case "list":
      const n = collection.length;
      return array(n, i => collection[n - i - 1]); 
    case "object":
      const l = Object.keys(collection);
      const r = {};
      for (let i=l.length - 1 ; i>=0 ; i--) {
        const k = l[i];
        r[k] = collection[k];
      }
      return r;
    default:
      return collection;
   }
}
);

// @cell('indexLike', ['iter'])
export const indexLike = (
(collection, predicate) =>
  iter(
    collection,
    (_) => !predicate(_),
    (r, v, i) => i
  )
);

// @cell('each', ['iter'])
export const each = (
(collection,functor) => iter(collection,functor,undefined,collection)
);

// @cell('m', ['s'])
export const m = (
_ => s(_ * 60)
);

// @cell('map', ['idem', 'type', 'empty', 'iter'])
export const map = (
(collection,processor=idem) => {
  const t = type(collection);
  const e = empty(collection);
  return iter(collection, 
       t === "string"
       ? (v,i,r) => {r.push(processor(v,i,collection));return r}
       : t === "list" 
       ? (v,i,r) => {r.push(processor(v,i,collection));return r}
       : (v,k,r) => {r[k]=processor(v,k,collection);return r},
       t === "string" ? _ => _.join("") : idem,
       e,
       e);
}
);

// @cell('reduce', ['iter', 'idem', 'empty'])
export const reduce = (
(collection,processor,initial=undefined) =>
  iter(collection,
      (v,k,r) => {const w=processor(r,v,k,collection);return w === undefined ? r : w},
      idem,
      initial === undefined ? empty(collection) : initial,
      initial)
);

// @cell('filter', ['bool', 'idem', 'iter', 'type', 'empty'])
export const filter = (
(collection, predicate=bool, processor=idem) =>
  iter(collection, 
       type(collection) === "list" 
       ? (v,i,r) => {predicate(v,i,collection) !== false && r.push(processor(v,i));return r}
       : (v,k,r) => {if (predicate(v,k,collection) !== false) {r[k]=processor(v,k)};return r},
       idem,
       empty(collection),
       collection)
);

// @cell('hasChanged', ['eq'])
export const hasChanged = (
(a,b) => !eq(a,b)
);

// @cell('list', ['maptype', 'idem'])
export const list = (
v => maptype(v,{
  null: _ => [],
  undefined: _ => [],
  list: idem,
  _: _ => {
    const n = _.length;
    if (typeof n === "number") {
      const r = [];
      for (var i=0 ; i<n ; i++) {r.push(_[i])}
      return r;
    } else {
      return [v];
    }
  }})
);

// @cell('len', ['maptype'])
export const len = (
v => maptype(v,{
  list: _ => _.length,
  object: _ => typeof _.length === "number" ? _.length : Object.keys(v).length,
  string: _ => _.length,
  _:1,
  null: _ => 0,
  undefined: _ => 0})
);

// @cell('values', ['maptype', 'idem'])
export const values = (
v => maptype(v,{
  list: idem,
  object: _ => Object.values(v),
  _:[v],
  null: _ => [],
  undefined: _ => []})
);

// @cell('keys', ['maptype'])
export const keys = (
v => maptype(v,{
  list: _ => _.map( (_,i) => i ),
  object: _ => Object.keys(v),
  _:[v],
  null: _ => [],
  undefined: _ => []})
);

// @cell('keyvalues', ['items'])
export const keyvalues = (
_ => items(_, false)
);

// @cell('withClass', ['each'])
export const withClass = (
(classname, scope=document.body) => {
  const res = scope.classList.contains(classname) ? [scope] : [];
  each(scope.querySelectorAll, _ => res.push(_))
  return res;
}
);

// @cell('copy', ['Node', 'maptype', 'idem', 'map'])
export const copy = (
(() => {
  const copy = (v, depth = 1) =>
    depth == 0
      ? v
      : v instanceof Node
      ? v.cloneNode(true)
      : maptype(v, {
          string: idem,
          number: idem,
          null: (_) => null,
          undefined: (_) => undefined,
          _: (_) => map(_, (_) => copy(_, depth - 1))
        });
  return copy;
})()
);

// @cell('mapkeys', ['reduce', 'empty'])
export const mapkeys = (
(collection, functor) =>
  reduce(
    collection,
    (r, v, k) => {
      r[functor(k, v)] = v;
    },
    empty(collection)
  )
);

// @cell('maplist', ['reduce'])
export const maplist = (
(collection,functor) =>
  reduce(collection, (r,v,k,l)=>{r.push(functor(v,k,l));}, [])
);

// @cell('rmerge', ['reduce'])
export const rmerge = (
(() => {
  const rmerge = (value, other, depth = -1) => {
    if (depth === 0) {
      return value;
    } else if (value === null || value === undefined) {
      return other;
    } else if (other === null || value === other) {
      return value;
    } else if (other instanceof Object && value instanceof Object) {
      return reduce(
        other,
        (r, v, k) => {
          r[k] = rmerge(r[k], v, depth > 0 ? depth - 1 : depth);
        },
        value
      );
    } else {
      return other;
    }
  };
  return rmerge;
})()
);

// @cell('groupBy', ['reduce'])
export const groupBy = (
(collection, extractor, processor=undefined) => 
reduce(collection,(r,v,k)=>{
  const g = extractor(v,k,collection);
  (r[g] = r[g] || []).push(processor ? processor(v) : v);
  return r;
}, {})
);

// @cell('partition', ['reduce'])
export const partition = (
(collection,predicate) => (collection instanceof Array
  ? reduce(collection, (r,v,i) => {r[predicate(v,i) ? 0 : 1].push(v)}, [[],[]])
  : reduce(collection, (r,v,k) => {r[predicate(v,k) ? 0 : 1][k] = v} , [{},{}])) || [[],[]]
);

// @cell('enumerate', ['freeze', 'reduce'])
export const enumerate = (
(...values) =>
  freeze(
    reduce(
      values,
      (r, v) => {
        r[v] = v;
        return r;
      },
      {}
    )
  )
);

// @cell('closest', ['dist', 'reduce'])
export const closest = (
(values, value, distance=dist) => 
  reduce(values, (r,v,i)=>{
    const d = distance(v,value);
    if (i === 0 || r.dist > d) {
      r.dist = d;
      r.value = v;
    }
    return r
  }, {dist:undefined, value:undefined}).value
);

// @cell('add', ['reduce'])
export const add = (
(a,b) => a instanceof Array ? reduce(a,(r,v)=>r+v,0) : a + b
);

// @cell('mul', ['reduce'])
export const mul = (
(a,b) => a instanceof Array ? reduce(a,(r,v)=>r*v,1) : a * b
);

// @cell('toKebabCase', ['reduce'])
export const toKebabCase = (
(words) => reduce(words, (r,v) => {r.push(v.toLowerCase())}, []).join("-")
);

// @cell('describe', ['reduce'])
export const describe = (
(series) => {
  const res = reduce(
    series,
    (r, v, k) => {
      r.min = Math.min(r.min === undefined ? v : r.min, v);
      r.max = Math.max(r.max === undefined ? v : r.min, v);
      r.total += v;
      r.count += 1;

      return r;
    },
    {
      min: undefined,
      max: undefined,
      total: 0,
      count: 0,
      mean: 0,
      variance: 0,
      deviation: 0,
      values: series
    }
  );
  res.mean = res.total / res.count;
  // FROM: https://en.wikipedia.org/wiki/Algorithms_for_calculating_variance
  // We do a two pass-algorithm as it's safer
  let m = res.mean;
  res.variance =
    reduce(
      series,
      (r, v, k) => {
        const dm = v - m;
        return r + dm * dm;
      },
      0
    ) / res.count;
  res.deviation = Math.sqrt(res.variance);
  return res;
}
);

// @cell('unique', ['filter'])
export const unique = (
(collection) => {
  const l = [];
  return filter(collection, _ =>  l.indexOf(_) !== -1 ? false : l.push(_)||true)
}
);

// @cell('difference', ['filter', 'index'])
export const difference = (
(a,b) => filter(a, _ => index(b,_) == -1)
);

// @cell('removeAt', ['filter'])
export const removeAt = (
(collection, index) => filter(collection, (v,i) => i !== index)
);

// @cell('iterable', ['list'])
export const iterable = (
_ => _ instanceof Object ? _ : list(_)
);

// @cell('prepend', ['type', 'list'])
export const prepend = (
(()=>{
  const prepend = (collection, item) => {
      switch (type(collection)) {
      case "list":
        const res = collection.slice();
        res.splice(0,0,item);
        return res;
      case "object":
        const r = {};
        let i = 0;
        while (collection[i] !== undefined) {i++}
        r[i] = item;
        Object.assign(r, collection);
        return r;
      default:
        return prepend(list(collection), item);
    }
  };
  return prepend;
})()
);

// @cell('append', ['type', 'list'])
export const append = (
(() => {
  const append = (collection, item, isMutable = false) => {
    switch (type(collection)) {
      case "list":
        const res = isMutable ? collection : collection.slice();
        res.push(item);
        return res;
      case "object":
        const r = isMutable ? collection : Object.assign({}, collection);
        let i = Object.entries(r).length;
        while (r[i] !== undefined) {
          i++;
        }
        r[i] = item;
        return r;
      default:
        return append(list(collection), item, isMutable);
    }
  };
  return append;
})()
);

// @cell('concat', ['list'])
export const concat = (
(a,b) => list(a).concat(list(b))
);

// @cell('sorted', ['cmp', 'idem', 'list'])
export const sorted = (
(collection, key=undefined, ordering=1, comparator=cmp) => {
    const extractor =
        typeof key === "function"
            ? key
            : key
            ? _ => (_ ? _[key] : undefined)
            : idem;
    const res =
        collection instanceof Array ? [].concat(collection) : list(collection);
    res.sort((a, b) => ordering * (key ? comparator(extractor(a), extractor(b)) : comparator(a, b)));
    
    return res;
}
);

// @cell('itemize', ['isMap', 'reduce', 'list', 'merge', 'str'])
export const itemize = (
l => isMap(l) ?
  reduce(l, (r,v,k)=> {
    r.push({label:k, key:k, index:r.length, value:v})
  }, [])
:
  list(l).map( (_,i) => merge({index:i,key:i}, _ && _.value !== undefined ? _ : {value:_, label:str(_)}))
);

// @cell('minmax', ['list', 'min', 'max'])
export const minmax = (
(()=>{
  const minmax = (...args) => {
    if (args.length === 1) {
      return list(args[0]).reduce((r, v, i) => {
        if (i === 0) {
          r[0] = r[1] = v;
        } else {
          r[0] = min(r[0], v);
          r[1] = max(r[1], v);
        }
        return r;
      }, [undefined, undefined])
    } else {
      return minmax(args);
    }
  }
  return minmax;
})()
);

// @cell('gradients', ['reduce', 'list'])
export const gradients = (
series =>
  reduce(list(series), (r,v,i,l) => {i > 0 && r.push(v - l[i -1])})
);

// @cell('dom', ['setattr', 'each', 'list'])
export const dom = (
(() => {
  const namespaces = {
    svg: "http://www.w3.org/2000/svg",
    xlink: "http://www.w3.org/1999/xlink"
  };
  const append = (node, value) => {
    const type = typeof value;
    if (value == undefined) {
      return;
    } else if (type === "string") {
      node.appendChild(document.createTextNode(value));
    } else if (type === "object" && value.nodeType !== undefined) {
      node.appendChild(value);
    } else if (type === "object" && value instanceof Array) {
      for (let j = 0; j < value.length; j++) {
        append(node, value[j]);
      }
    } else {
      var has_properties = false;
      for (let k in value) {
        let ns = null;
        let dot = k.lastIndexOf(":");
        let v = value[k];
        // We skip undefined properties
        if (v !== undefined) {
          if (dot >= 0) {
            ns = k.substr(0, dot);
            ns = namespaces[ns] || ns;
            k = k.substr(dot + 1, k.length);
          }
          if (k == "_" || k == "_class" || k == "klass") {
            k = "class";
          }
          // We leverage the `setattr` function that manages setting the attributes
          // easily.
          if (ns) {
            setattr(node, k, v, 0, ns);
          } else if (k.startsWith("on") && node[k] !== undefined) {
            // Event handlers like "onclick" cannot be set through the setAttribute method,
            // but have to be set explicitely.
            node[k] = v;
          } else {
            setattr(node, k, v);
          }
          has_properties = true;
        }
      }
      if (!has_properties) {
        node.appendChild(document.createTextNode("" + value));
      }
    }
    return node;
  };

  const clear = (node) => {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
    return node;
  };

  const set = (node, ...content) => append(clear(node), ...content);
  const replace = (node, ...content) => {
    var not_found = true;
    node.parentNode &&
      content.forEach((_) => {
        if (_ === node) {
          not_found = false;
        }
        if (node.parentNode) {
          node.parentNode.insertBefore(_, node);
        }
      });
    not_found && node.parentNode && node.removeChild(node);
    return content;
  };
  const unmount = (_) => {
    _ && _.parentNode && _.parentNode.removeChild(_);
    return _;
  };
  const remount = (node, current, previous) => {
    const parent = node.parentNode;
    each(list(previous), unmount);
    each(list(current), parent ? (_) => parent.insertBefore(_, node) : unmount);
    return current;
  };
  const create = (name, args) => {
    const node = document.createElement(name);
    for (var i = 0; i < args.length; i++) {
      append(node, args[i]);
    }
    return node;
  };
  const createns = (ns, name, args) => {
    const node = document.createElementNS(ns, name);
    for (var i = 0; i < args.length; i++) {
      append(node, args[i]);
    }
    return node;
  };
  return {
    namespaces,
    create,
    createns,
    set,
    append,
    clear,
    replace,
    unmount,
    remount
  };
})()
);

// @cell('on', ['list'])
export const on = (
(node, handlers) =>
  Object.entries(handlers).forEach(([k, v]) =>
    list(node).forEach((_) => _.addEventListener(k, v))
  ) || node
);

// @cell('off', ['list'])
export const off = (
(node,handlers) => Object.entries(handlers).forEach( ([k,v]) => list(node).forEach(_ => _.removeEventListener(k,v)) ) || node
);

// @cell('combinations', ['len', 'range'])
export const combinations = (
(values,k=2) => {
  // Straight port of: https://docs.python.org/3.8/library/itertools.html#itertools.combinations
  const res = [];
  const n = len(values);
  // We cannot have k > n
  if (k > n) {return res};
  // We're going to mutate the indicies, but right now it's going to
  // be 0..k
  const indices = range(k);
  // And the first value we add is the first k values of our set
  res.push(indices.map(_ => values[_]));
  // Now that's the loop
  while (true) {
    // We iterate in on 0..k in reverse
    let found = undefined;
    for (let i = k-1 ; i >=0 ; i--) {
      // NOTE: Not sure what happens here
      if (indices[i] !== i + n - k) {
        found = i;
        break}}
    // If we did not find that indice, we're done!
    if (found===undefined) {return res;}
    indices[found] += 1
    // TODO: Not sure what happens there either
    for (let j=found+1 ; j<k ; j++) {
       indices[j] = indices[j-1] + 1
    }
    res.push(indices.map( _ => values[_] ));}
  return res;
}
);

// @cell('stripe', ['len', 'array'])
export const stripe = (
(values) => {
  const n = len(values);
  const m = Math.floor(n/2);
  return array(n, i =>
    values[i < m 
    ? Math.min(n-1,i * 2)
    : Math.min(n-1,1 + (i-m)*2)]
  )
}
);

// @cell('rmsd', ['reduce', 'sqdist', 'len'])
export const rmsd = (
(series, target=1) =>
 Math.sqrt(reduce(series, (r,v) => r + sqdist(v, target), 0) / len(series))
);

// @cell('head', ['values'])
export const head = (
(value, count) => {
  const v = values(value);
  return count === undefined || count === 0
    ? v[0]
    : v.slice(0, count < 0 ? v.length + count : count);
}
);

// @cell('nth', ['values'])
export const nth = (
(value, index = 0) => {
  const v = values(value);
  return v[index < 0 ? v.length + index : index];
}
);

// @cell('set', ['copy'])
export const set = (
(scope,key,value) => {
  const res = copy(scope);
  if (scope instanceof Array && key instanceof Number) {
    while(res.length < key) {res.push(undefined)}
    res[key] = value;
    return res;
  } else {
    res[key]=value;
    return res
  }
}
);

// @cell('insertAt', ['type', 'copy', 'list'])
export const insertAt = (
(collection, index, item) => {
  const res = type(collection) === "list" ? copy(collection) : list(collection);
  const i = index < 0 ? res.length + index : index
  res.splice(i, 0, item);
  return res;
}
);

// @cell('sum', ['reduce', 'add'])
export const sum = (
collection => reduce(collection, add, 0)
);

// @cell('toggle', ['has', 'remove', 'append'])
export const toggle = (
(collection,item) => has(collection,item) ? remove(collection,item) : append(collection,item)
);

// @cell('resize', ['idem', 'len', 'concat', 'slice'])
export const resize = (
(values, size, creator = idem) => {
    let n = len(values);
    if (n < size) {
        const suffix = [];
        while (n < size) {
            suffix.push((creator||idem)(n++));
        }
        return concat(values, suffix)
    }
    else if (n > size) {
        return slice(values, 0, size);
    }
    else {
        return values;
    }
}
);

// @cell('flatten', ['isCollection', 'list', 'reduce', 'concat'])
export const flatten = (
(() => {
  const flatten = (value, depth = -1) => {
    if (depth === 0 || !isCollection(value)) {
      return list(value);
    } else {
      return reduce(value, (r, v) => concat(r, flatten(v, depth - 1)), []);
    }
  };
  return flatten;
})()
);

// @cell('maxmin', ['minmax'])
export const maxmin = (
(...args) => {
  const [a,b] = minmax(...args);
  return [b,a]
}
);

// @cell('extent', ['sub', 'minmax'])
export const extent = (
series => Math.abs(sub(minmax(series)))
);

// @cell('midpoint', ['lerp', 'minmax'])
export const midpoint = (
series => lerp(...minmax(series), 0.5)
);

// @cell('html', ['dom'])
export const html = (
(function () {
  const { create } = dom;
  return [
    "a",
    "abbr",
    "acronym",
    "address",
    "applet",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "base",
    "basefont",
    "bdo",
    "big",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "center",
    "cite",
    "code",
    "col",
    "colgroup",
    "command",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "dir",
    "div",
    "dl",
    "dt",
    "em",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "font",
    "footer",
    "form",
    "frame",
    "frameset",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hgroup",
    "hr",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "isindex",
    "kbd",
    "keygen",
    "label",
    "legend",
    "li",
    "link",
    "map",
    "mark",
    "menu",
    "meta",
    "meter",
    "nav",
    "noframes",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "param",
    "pre",
    "progress",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "script",
    "section",
    "select",
    "slot",
    "small",
    "source",
    "span",
    "strike",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "textarea",
    "template",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "tt",
    "u",
    "ul",
    "video",
    "wbr",
    "xmp"
  ].reduce(
    (r, k) => {
      r[k] = (...args) => create(k, args);
      return r;
    },
    { ...dom }
  );
})()
);

// @cell('svg', ['dom'])
export const svg = (
function(){
  const {namespaces,createns} = dom
  const create = (name,args) => createns(namespaces.svg, name, args)
  return ['altglyph', 'altglyphdef', 'altglyphitem', 'animate', 'animatecolor', 'animatemotion', 'animatetransform', 'circle', 'clippath', 'colorProfile', 'cursor', 'defs', 'desc', 'ellipse', 'feblend', 'fecolormatrix', 'fecomponenttransfer', 'fecomposite', 'feconvolvematrix', 'fediffuselighting', 'fedisplacementmap', 'fedistantlight', 'feflood', 'fefunca', 'fefuncb', 'fefuncg', 'fefuncr', 'fegaussianblur', 'feimage', 'femerge', 'femergenode', 'femorphology', 'feoffset', 'fepointlight', 'fespecularlighting', 'fespotlight', 'fetile', 'feturbulence', 'filter', 'font', 'fontFace', 'fontFaceFormat', 'fontFaceName', 'fontFaceSrc', 'fontFaceUri', 'foreignobject', 'g', 'glyph', 'glyphref', 'hkern', 'image', 'line', 'lineargradient', 'marker', 'mask', 'metadata', 'missingGlyph', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialgradient', 'rect', 'script', 'set', 'stop', 'style', 'svg', 'symbol', 'text', 'textpath', 'title', 'tref', 'tspan', 'use', 'view', 'vkern'].reduce((r,k) => {
    r[k] = (...args) => create(k, args);return r
  }, {...dom})
}()
);

// @cell('first', ['idem', 'iter', 'nth'])
export const first = (
(value, predicate = null, processor = idem) =>
  predicate
    ? iter(
        value,
        (v, i) => (predicate ? predicate(v, i, value) !== true : true),
        (r, v, i) => processor(value[i], i)
      )
    : processor(nth(value, 0), 0)
);

// @cell('last', ['nth'])
export const last = (
value => nth(value, -1)
);

// @cell('pick', ['values', 'nth', 'len'])
export const pick = (
(items) => {
  const l = values(items)
  return nth(values(l),Math.round(Math.random() * (len(l)-1)))
}
);

// @cell('mean', ['sum', 'len'])
export const mean = (
series =>
  sum(series)/len(series)
);

// @cell('clampsize', ['idem', 'len', 'resize'])
export const clampsize = (
(collection, min, max, creator=idem) => {
  const n = len(collection)
  if      (n < min) {return resize(collection,min,creator)}
  else if (n > max) {return resize(collection,max,creator)}
  else              {return collection}
}
);

// @cell('grow', ['isDef', 'resize', 'max', 'len'])
export const grow = (
(array,size,creator) => isDef(size) ? resize(array, max(size,len(array)), creator) : array
);

// @cell('stylesheet', ['html', 'each', 'maptype', 'str', 'until'])
export const stylesheet = (
(rules, name = "default", waitForAvailability = true) => {
  const id = `stylesheet-${name || "default"}`;
  const existing = document.getElementById(id);
  const node = existing || html.style({ id, name });
  const updater = () => {
    const sheet = node.sheet;
    if (!sheet) {
      return false;
    }
    while (sheet && sheet.cssRules && sheet.cssRules.length) {
      sheet.deleteRule(0);
    }
    Object.entries(rules).forEach(([k, v]) => {
      // We support {@:[...]} for imports and such
      if (k === "@") {
        each(v, (_) => sheet.insertRule(`${v};`, 0));
      } else {
        const w = maptype(v, {
          object: (_) =>
            Object.entries(_)
              .map(([k, v]) => `${k}: ${v};`)
              .join("\n"),
          array: (_) => _.join("\n"),
          _: str
        });
        sheet.insertRule(`${k} {${w}}`, 0);
      }
    }, sheet);
    return true;
  };
  // In Observable, the node will only be mounted at a later point, and we need
  // to test for the sheet and cssRules properties to be set before actually doing
  // the update. In other environments, we can just proceed with the update already.
  !updater() &&
    waitForAvailability &&
    until(
      () => {
        return node.sheet && node.sheet.cssRules;
      },
      updater,
      100,
      10
    );
  return node;
}
);

// @cell('Slot', ['callable', 'map', 'each', 'html', 'list'])
export const Slot = (
class Slot {
  constructor( value ) {
    this.value = value;
    this.views = [];
    this.effects = [];
  }
  reduce( ...slots ) {
    const functor = callable(this.value);
    const inputs  = slots;
    const updater = () =>
      this.set(functor(...(map(inputs, _ => _.value)), this.value))
    this.value = undefined;
    // NOTE: This will leak
    each(inputs, _ => _.effect(updater));
    updater();
    return this;
  }
  set( value ) {
    const previous = this.value;
    this.value = value;
    this.views.forEach( view => {
      view.content = html.remount(view.node, view.render(value, previous), view.content)
    })
    this.effects.forEach( effect => effect(value, previous) );
  }
 effect( effector ) {
   this.effects.push(effector);
 }
 view( render ) {
   if (!render) {return undefined};
   const node = document.createComment("view");
   const view = {node, render:render, content:render(this.value, undefined)}
   this.views.push(view)
   return [node].concat(list(view.content));
 }
}
);

// @cell('def', ['first'])
export const def = (
(...values) => first(values, _ => _ !== undefined)
);

// @cell('slot', ['Slot'])
export const slot = (
(view,value) => 
  new Slot(view,value)
);
// EOF
