!(function(e) {
  function t(r) {
    if (n[r]) return n[r].exports;
    var o = (n[r] = { i: r, l: !1, exports: {} });
    return e[r].call(o.exports, o, o.exports, t), (o.l = !0), o.exports;
  }
  var n = {};
  (t.m = e),
    (t.c = n),
    (t.d = function(e, n, r) {
      t.o(e, n) ||
        Object.defineProperty(e, n, {
          configurable: !1,
          enumerable: !0,
          get: r
        });
    }),
    (t.n = function(e) {
      var n =
        e && e.__esModule
          ? function() {
              return e.default;
            }
          : function() {
              return e;
            };
      return t.d(n, 'a', n), n;
    }),
    (t.o = function(e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (t.p = ''),
    t((t.s = 0));
})([
  function(e, t, n) {
    e.exports = n(1);
  },
  function(e, t, n) {
    'use strict';
    function r(e, t) {
      if (!(e instanceof t))
        throw new TypeError('Cannot call a class as a function');
    }
    function o(e, t) {
      if (!e)
        throw new ReferenceError(
          "this hasn't been initialised - super() hasn't been called"
        );
      return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
    }
    function i(e, t) {
      if ('function' != typeof t && null !== t)
        throw new TypeError(
          'Super expression must either be null or a function, not ' + typeof t
        );
      (e.prototype = Object.create(t && t.prototype, {
        constructor: {
          value: e,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      })),
        t &&
          (Object.setPrototypeOf
            ? Object.setPrototypeOf(e, t)
            : (e.__proto__ = t));
    }
    function a(e, t, n) {
      return (
        t in e
          ? Object.defineProperty(e, t, {
              value: n,
              enumerable: !0,
              configurable: !0,
              writable: !0
            })
          : (e[t] = n),
        e
      );
    }
    function s(e) {
      if (Array.isArray(e)) {
        for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
        return n;
      }
      return Array.from(e);
    }
    function u(e) {
      if (Array.isArray(e)) {
        for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
        return n;
      }
      return Array.from(e);
    }
    function c(e, t) {
      if (!(e instanceof t))
        throw new TypeError('Cannot call a class as a function');
    }
    function l(e) {
      if (Array.isArray(e)) {
        for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
        return n;
      }
      return Array.from(e);
    }
    function p(e, t) {
      if (!(e instanceof t))
        throw new TypeError('Cannot call a class as a function');
    }
    function f(e, t) {
      if (!e)
        throw new ReferenceError(
          "this hasn't been initialised - super() hasn't been called"
        );
      return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
    }
    function d(e, t) {
      if ('function' != typeof t && null !== t)
        throw new TypeError(
          'Super expression must either be null or a function, not ' + typeof t
        );
      (e.prototype = Object.create(t && t.prototype, {
        constructor: {
          value: e,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      })),
        t &&
          (Object.setPrototypeOf
            ? Object.setPrototypeOf(e, t)
            : (e.__proto__ = t));
    }
    function h(e, t) {
      if (!(e instanceof t))
        throw new TypeError('Cannot call a class as a function');
    }
    function y(e, t) {
      if (!e)
        throw new ReferenceError(
          "this hasn't been initialised - super() hasn't been called"
        );
      return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
    }
    function _(e, t) {
      if ('function' != typeof t && null !== t)
        throw new TypeError(
          'Super expression must either be null or a function, not ' + typeof t
        );
      (e.prototype = Object.create(t && t.prototype, {
        constructor: {
          value: e,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      })),
        t &&
          (Object.setPrototypeOf
            ? Object.setPrototypeOf(e, t)
            : (e.__proto__ = t));
    }
    function m(e, t) {
      if (!(e instanceof t))
        throw new TypeError('Cannot call a class as a function');
    }
    function v(e, t) {
      if (!e)
        throw new ReferenceError(
          "this hasn't been initialised - super() hasn't been called"
        );
      return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
    }
    function b(e, t) {
      if ('function' != typeof t && null !== t)
        throw new TypeError(
          'Super expression must either be null or a function, not ' + typeof t
        );
      (e.prototype = Object.create(t && t.prototype, {
        constructor: {
          value: e,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      })),
        t &&
          (Object.setPrototypeOf
            ? Object.setPrototypeOf(e, t)
            : (e.__proto__ = t));
    }
    function g(e, t) {
      if (!(e instanceof t))
        throw new TypeError('Cannot call a class as a function');
    }
    function w(e, t) {
      if (!e)
        throw new ReferenceError(
          "this hasn't been initialised - super() hasn't been called"
        );
      return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
    }
    function E(e, t) {
      if ('function' != typeof t && null !== t)
        throw new TypeError(
          'Super expression must either be null or a function, not ' + typeof t
        );
      (e.prototype = Object.create(t && t.prototype, {
        constructor: {
          value: e,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      })),
        t &&
          (Object.setPrototypeOf
            ? Object.setPrototypeOf(e, t)
            : (e.__proto__ = t));
    }
    function O(e, t) {
      if (!(e instanceof t))
        throw new TypeError('Cannot call a class as a function');
    }
    function S(e, t) {
      if (!e)
        throw new ReferenceError(
          "this hasn't been initialised - super() hasn't been called"
        );
      return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
    }
    function k(e, t) {
      if ('function' != typeof t && null !== t)
        throw new TypeError(
          'Super expression must either be null or a function, not ' + typeof t
        );
      (e.prototype = Object.create(t && t.prototype, {
        constructor: {
          value: e,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      })),
        t &&
          (Object.setPrototypeOf
            ? Object.setPrototypeOf(e, t)
            : (e.__proto__ = t));
    }
    function P(e, t) {
      if (!(e instanceof t))
        throw new TypeError('Cannot call a class as a function');
    }
    function A(e, t) {
      if (!e)
        throw new ReferenceError(
          "this hasn't been initialised - super() hasn't been called"
        );
      return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
    }
    function C(e, t) {
      if ('function' != typeof t && null !== t)
        throw new TypeError(
          'Super expression must either be null or a function, not ' + typeof t
        );
      (e.prototype = Object.create(t && t.prototype, {
        constructor: {
          value: e,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      })),
        t &&
          (Object.setPrototypeOf
            ? Object.setPrototypeOf(e, t)
            : (e.__proto__ = t));
    }
    function T(e, t, n) {
      return (
        t in e
          ? Object.defineProperty(e, t, {
              value: n,
              enumerable: !0,
              configurable: !0,
              writable: !0
            })
          : (e[t] = n),
        e
      );
    }
    function j(e, t, n) {
      return (
        t in e
          ? Object.defineProperty(e, t, {
              value: n,
              enumerable: !0,
              configurable: !0,
              writable: !0
            })
          : (e[t] = n),
        e
      );
    }
    function R(e, t, n) {
      return (
        t in e
          ? Object.defineProperty(e, t, {
              value: n,
              enumerable: !0,
              configurable: !0,
              writable: !0
            })
          : (e[t] = n),
        e
      );
    }
    function I(e, t) {
      var n = {};
      for (var r in e)
        t.indexOf(r) >= 0 ||
          (Object.prototype.hasOwnProperty.call(e, r) && (n[r] = e[r]));
      return n;
    }
    function M(e, t) {
      if (!(e instanceof t))
        throw new TypeError('Cannot call a class as a function');
    }
    function q(e, t) {
      if (!(e instanceof t))
        throw new TypeError('Cannot call a class as a function');
    }
    function N(e, t) {
      if (!e)
        throw new ReferenceError(
          "this hasn't been initialised - super() hasn't been called"
        );
      return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
    }
    function L(e, t) {
      if ('function' != typeof t && null !== t)
        throw new TypeError(
          'Super expression must either be null or a function, not ' + typeof t
        );
      (e.prototype = Object.create(t && t.prototype, {
        constructor: {
          value: e,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      })),
        t &&
          (Object.setPrototypeOf
            ? Object.setPrototypeOf(e, t)
            : (e.__proto__ = t));
    }
    function x(e, t, n) {
      return (
        t in e
          ? Object.defineProperty(e, t, {
              value: n,
              enumerable: !0,
              configurable: !0,
              writable: !0
            })
          : (e[t] = n),
        e
      );
    }
    function F(e) {
      if (Array.isArray(e)) {
        for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
        return n;
      }
      return Array.from(e);
    }
    function B(e) {
      if (Array.isArray(e)) {
        for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
        return n;
      }
      return Array.from(e);
    }
    function D(e, t, n) {
      return (
        t in e
          ? Object.defineProperty(e, t, {
              value: n,
              enumerable: !0,
              configurable: !0,
              writable: !0
            })
          : (e[t] = n),
        e
      );
    }
    function U(e) {
      if (Array.isArray(e)) {
        for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
        return n;
      }
      return Array.from(e);
    }
    function H(e, t) {
      var n = {};
      for (var r in e)
        t.indexOf(r) >= 0 ||
          (Object.prototype.hasOwnProperty.call(e, r) && (n[r] = e[r]));
      return n;
    }
    function z(e, t) {
      if (!(e instanceof t))
        throw new TypeError('Cannot call a class as a function');
    }
    function K(e, t) {
      if (!e)
        throw new ReferenceError(
          "this hasn't been initialised - super() hasn't been called"
        );
      return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
    }
    function V(e, t) {
      if ('function' != typeof t && null !== t)
        throw new TypeError(
          'Super expression must either be null or a function, not ' + typeof t
        );
      (e.prototype = Object.create(t && t.prototype, {
        constructor: {
          value: e,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      })),
        t &&
          (Object.setPrototypeOf
            ? Object.setPrototypeOf(e, t)
            : (e.__proto__ = t));
    }
    function Y(e, t) {
      var n = {};
      for (var r in e)
        t.indexOf(r) >= 0 ||
          (Object.prototype.hasOwnProperty.call(e, r) && (n[r] = e[r]));
      return n;
    }
    function G(e, t) {
      if (!(e instanceof t))
        throw new TypeError('Cannot call a class as a function');
    }
    function J(e, t) {
      if (!e)
        throw new ReferenceError(
          "this hasn't been initialised - super() hasn't been called"
        );
      return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
    }
    function W(e, t) {
      if ('function' != typeof t && null !== t)
        throw new TypeError(
          'Super expression must either be null or a function, not ' + typeof t
        );
      (e.prototype = Object.create(t && t.prototype, {
        constructor: {
          value: e,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      })),
        t &&
          (Object.setPrototypeOf
            ? Object.setPrototypeOf(e, t)
            : (e.__proto__ = t));
    }
    function $(e, t) {
      if (!(e instanceof t))
        throw new TypeError('Cannot call a class as a function');
    }
    function Z(e, t) {
      if (!e)
        throw new ReferenceError(
          "this hasn't been initialised - super() hasn't been called"
        );
      return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
    }
    function Q(e, t) {
      if ('function' != typeof t && null !== t)
        throw new TypeError(
          'Super expression must either be null or a function, not ' + typeof t
        );
      (e.prototype = Object.create(t && t.prototype, {
        constructor: {
          value: e,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      })),
        t &&
          (Object.setPrototypeOf
            ? Object.setPrototypeOf(e, t)
            : (e.__proto__ = t));
    }
    function X(e, t) {
      var n = {};
      for (var r in e)
        t.indexOf(r) >= 0 ||
          (Object.prototype.hasOwnProperty.call(e, r) && (n[r] = e[r]));
      return n;
    }
    function ee(e) {
      if (Array.isArray(e)) {
        for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
        return n;
      }
      return Array.from(e);
    }
    function te(e, t) {
      if (!(e instanceof t))
        throw new TypeError('Cannot call a class as a function');
    }
    function ne(e, t) {
      if (!e)
        throw new ReferenceError(
          "this hasn't been initialised - super() hasn't been called"
        );
      return !t || ('object' != typeof t && 'function' != typeof t) ? e : t;
    }
    function re(e, t) {
      if ('function' != typeof t && null !== t)
        throw new TypeError(
          'Super expression must either be null or a function, not ' + typeof t
        );
      (e.prototype = Object.create(t && t.prototype, {
        constructor: {
          value: e,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      })),
        t &&
          (Object.setPrototypeOf
            ? Object.setPrototypeOf(e, t)
            : (e.__proto__ = t));
    }
    function oe(e) {
      if (Array.isArray(e)) {
        for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
        return n;
      }
      return Array.from(e);
    }
    function ie(e, t) {
      if (!(e instanceof t))
        throw new TypeError('Cannot call a class as a function');
    }
    function ae(e, t) {
      if (!(e instanceof t))
        throw new TypeError('Cannot call a class as a function');
    }
    function se(e, t, n) {
      return (
        t in e
          ? Object.defineProperty(e, t, {
              value: n,
              enumerable: !0,
              configurable: !0,
              writable: !0
            })
          : (e[t] = n),
        e
      );
    }
    function ue(e, t) {
      if (!(e instanceof t))
        throw new TypeError('Cannot call a class as a function');
    }
    Object.defineProperty(t, '__esModule', { value: !0 });
    var ce,
      le,
      pe,
      fe,
      de,
      he = (function(e) {
        function t(e) {
          r(this, t);
          var n = o(
            this,
            (t.__proto__ || Object.getPrototypeOf(t)).call(this, e)
          );
          return (
            window.__stripeElementsController &&
              window.__stripeElementsController.reportIntegrationError(e),
            (n.name = 'IntegrationError'),
            n
          );
        }
        return i(t, e), t;
      })(Error),
      ye = he,
      _e =
        Object.assign ||
        function(e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        },
      me =
        'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
          ? function(e) {
              return typeof e;
            }
          : function(e) {
              return e &&
                'function' == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? 'symbol'
                : typeof e;
            },
      ve = function(e, t) {
        for (var n = 0; n < e.length; n++) if (t(e[n])) return e[n];
      },
      be = function(e, t) {
        for (var n = 0; n < e.length; n++) if (t(e[n])) return n;
        return -1;
      },
      ge = function(e) {
        return (
          e &&
          'object' === (void 0 === e ? 'undefined' : me(e)) &&
          (e.constructor === Array || e.constructor === Object)
        );
      },
      we = function(e) {
        return ge(e)
          ? Array.isArray(e) ? e.slice(0, e.length) : _e({}, e)
          : e;
      },
      Ee = function e(t) {
        return function() {
          for (var n = arguments.length, r = Array(n), o = 0; o < n; o++)
            r[o] = arguments[o];
          if (Array.isArray(r[0]) && t) return we(r[0]);
          var i = Array.isArray(r[0]) ? [] : {};
          return (
            r.forEach(function(n) {
              n &&
                Object.keys(n).forEach(function(r) {
                  var o = i[r],
                    a = n[r],
                    s = ge(o) && !(t && Array.isArray(o));
                  'object' === (void 0 === a ? 'undefined' : me(a)) && s
                    ? (i[r] = e(t)(o, we(a)))
                    : void 0 !== a
                      ? (i[r] = ge(a) ? e(t)(a) : we(a))
                      : void 0 !== o && (i[r] = o);
                });
            }),
            i
          );
        };
      },
      Oe = (Ee(!1), Ee(!0)),
      Se = function(e, t) {
        for (var n = {}, r = 0; r < t.length; r++) n[t[r]] = !0;
        for (var o = [], i = 0; i < e.length; i++) n[e[i]] && o.push(e[i]);
        return o;
      },
      ke = [
        'aed',
        'afn',
        'all',
        'amd',
        'ang',
        'aoa',
        'ars',
        'aud',
        'awg',
        'azn',
        'bam',
        'bbd',
        'bdt',
        'bgn',
        'bhd',
        'bif',
        'bmd',
        'bnd',
        'bob',
        'brl',
        'bsd',
        'btn',
        'bwp',
        'byr',
        'bzd',
        'cad',
        'cdf',
        'chf',
        'clf',
        'clp',
        'cny',
        'cop',
        'crc',
        'cuc',
        'cup',
        'cve',
        'czk',
        'djf',
        'dkk',
        'dop',
        'dzd',
        'egp',
        'ern',
        'etb',
        'eur',
        'fjd',
        'fkp',
        'gbp',
        'gel',
        'ghs',
        'gip',
        'gmd',
        'gnf',
        'gtq',
        'gyd',
        'hkd',
        'hnl',
        'hrk',
        'htg',
        'huf',
        'idr',
        'ils',
        'inr',
        'iqd',
        'irr',
        'isk',
        'jmd',
        'jod',
        'jpy',
        'kes',
        'kgs',
        'khr',
        'kmf',
        'kpw',
        'krw',
        'kwd',
        'kyd',
        'kzt',
        'lak',
        'lbp',
        'lkr',
        'lrd',
        'lsl',
        'ltl',
        'lvl',
        'lyd',
        'mad',
        'mdl',
        'mga',
        'mkd',
        'mmk',
        'mnt',
        'mop',
        'mro',
        'mur',
        'mvr',
        'mwk',
        'mxn',
        'myr',
        'mzn',
        'nad',
        'ngn',
        'nio',
        'nok',
        'npr',
        'nzd',
        'omr',
        'pab',
        'pen',
        'pgk',
        'php',
        'pkr',
        'pln',
        'pyg',
        'qar',
        'ron',
        'rsd',
        'rub',
        'rwf',
        'sar',
        'sbd',
        'scr',
        'sdg',
        'sek',
        'sgd',
        'shp',
        'skk',
        'sll',
        'sos',
        'srd',
        'ssp',
        'std',
        'svc',
        'syp',
        'szl',
        'thb',
        'tjs',
        'tmt',
        'tnd',
        'top',
        'try',
        'ttd',
        'twd',
        'tzs',
        'uah',
        'ugx',
        'usd',
        'uyu',
        'uzs',
        'vef',
        'vnd',
        'vuv',
        'wst',
        'xaf',
        'xag',
        'xau',
        'xcd',
        'xdr',
        'xof',
        'xpf',
        'yer',
        'zar',
        'zmk',
        'zmw',
        'btc',
        'jep',
        'eek',
        'ghc',
        'mtl',
        'tmm',
        'yen',
        'zwd',
        'zwl',
        'zwn',
        'zwr'
      ],
      Pe = ke,
      Ae = [
        'AT',
        'AU',
        'BE',
        'BR',
        'CA',
        'CH',
        'DE',
        'DK',
        'EE',
        'ES',
        'FI',
        'FR',
        'GB',
        'HK',
        'IE',
        'IN',
        'IT',
        'JP',
        'LT',
        'LU',
        'LV',
        'MX',
        'NL',
        'NZ',
        'NO',
        'PH',
        'PL',
        'PT',
        'RO',
        'SE',
        'SG',
        'SK',
        'US'
      ],
      Ce = Ae,
      Te =
        Object.assign ||
        function(e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        },
      je =
        'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
          ? function(e) {
              return typeof e;
            }
          : function(e) {
              return e &&
                'function' == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? 'symbol'
                : typeof e;
            },
      Re = function(e, t, n) {
        return (
          'Invalid value for ' +
          n.label +
          ': ' +
          (n.path.join('.') || 'value') +
          ' should be ' +
          e +
          '. You specified: ' +
          t +
          '.'
        );
      },
      Ie = function(e) {
        return {
          type: 'valid',
          value: e,
          warnings:
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : []
        };
      },
      Me = function(e) {
        return { error: e, errorType: 'full', type: 'error' };
      },
      qe = function(e, t, n) {
        return {
          expected: e,
          actual: String(t),
          options: n,
          errorType: 'mismatch',
          type: 'error'
        };
      },
      Ne = function(e) {
        return function(t, n) {
          return void 0 === t ? Ie(t) : e(t, n);
        };
      },
      Le = function(e, t) {
        return function(n, r) {
          var o = e(n, r),
            i = t(n, r);
          return 'error' === o.type && 'error' === i.type
            ? 'mismatch' === o.errorType
              ? 'mismatch' === i.errorType
                ? qe(o.expected + ' or ' + i.expected, n, r)
                : Me(i.error)
              : Me(o.error)
            : 'valid' === o.type ? o : i;
        };
      },
      xe = function(e, t) {
        return function(n, r) {
          var o = ve(e, function(e) {
            return e === n;
          });
          if (void 0 === o) {
            var i = t
              ? 'a recognized string.'
              : 'one of the following strings: ' + e.join(', ');
            return qe(i, n, r);
          }
          return Ie(o);
        };
      },
      Fe = function() {
        for (var e = arguments.length, t = Array(e), n = 0; n < e; n++)
          t[n] = arguments[n];
        return xe(t, !1);
      },
      Be = function() {
        for (var e = arguments.length, t = Array(e), n = 0; n < e; n++)
          t[n] = arguments[n];
        return xe(t, !0);
      },
      De = Fe.apply(void 0, s(Ce)),
      Ue = Fe.apply(void 0, s(Pe)),
      He = function(e, t) {
        return 'string' == typeof e ? Ie(e) : qe('a string', e, t);
      },
      ze = function(e, t) {
        return function(n, r) {
          return void 0 === n ? Ie(t()) : e(n, r);
        };
      },
      Ke = function(e, t) {
        return 'boolean' == typeof e ? Ie(e) : qe('a boolean', e, t);
      },
      Ve = function(e, t) {
        return 'number' == typeof e && e === parseInt(e, 10)
          ? Ie(e)
          : qe("an amount in the currency's subunit", e, t);
      },
      Ye = function(e, t) {
        return e && 'object' === (void 0 === e ? 'undefined' : je(e))
          ? Ie(e)
          : qe('an object', e, t);
      },
      Ge = function(e) {
        return function(t, n) {
          if (Array.isArray(t)) {
            return t
              .map(function(t, r) {
                return e(
                  t,
                  Te({}, n, { path: [].concat(s(n.path), [String(r)]) })
                );
              })
              .reduce(function(e, t) {
                return 'error' === e.type
                  ? e
                  : 'error' === t.type
                    ? t
                    : Ie(
                        [].concat(s(e.value), [t.value]),
                        [].concat(s(e.warnings), s(t.warnings))
                      );
              }, Ie([]));
          }
          return qe('array', t, n);
        };
      },
      Je = function(e) {
        return function(t) {
          return function(n, r) {
            if (Array.isArray(n)) {
              var o = t(n, r);
              if ('valid' === o.type)
                for (var i = {}, a = 0; a < o.value.length; a += 1) {
                  var s = o.value[a];
                  if (
                    'object' === (void 0 === s ? 'undefined' : je(s)) &&
                    s &&
                    'string' == typeof s[e]
                  ) {
                    var u = s[e];
                    if (i[u])
                      return Me(
                        new ye(
                          'Duplicate value for ' +
                            e +
                            ': ' +
                            u +
                            ". The property '" +
                            e +
                            "' of '" +
                            r.path.join('.') +
                            "' has to be unique."
                        )
                      );
                    i[u] = !0;
                  }
                }
              return o;
            }
            return qe('array', n, r);
          };
        };
      },
      We = function(e) {
        return function(t, n) {
          return void 0 === t
            ? Ie(void 0)
            : qe('used in ' + e + ' instead', t, n);
        };
      },
      $e = function(e) {
        return function(t) {
          return function(n, r) {
            if (
              n &&
              'object' === (void 0 === n ? 'undefined' : je(n)) &&
              !Array.isArray(n)
            ) {
              var o = n,
                i = ve(Object.keys(o), function(e) {
                  return !t[e];
                });
              if (i && e)
                return Me(
                  new ye(
                    'Invalid ' +
                      r.label +
                      ' parameter: ' +
                      [].concat(s(r.path), [i]).join('.') +
                      ' is not an accepted parameter.'
                  )
                );
              var u = Ie({});
              return (
                i &&
                  (u = Object.keys(o).reduce(function(e, n) {
                    return t[n]
                      ? e
                      : Ie(
                          e.value,
                          [].concat(s(e.warnings), [
                            'Unrecognized ' +
                              r.label +
                              ' parameter: ' +
                              [].concat(s(r.path), [n]).join('.') +
                              ' is not a recognized parameter. This may cause issues with your integration in the future.'
                          ])
                        );
                  }, u)),
                Object.keys(t).reduce(function(e, n) {
                  if ('error' === e.type) return e;
                  var i = t[n],
                    u = i(o[n], Te({}, r, { path: [].concat(s(r.path), [n]) }));
                  return 'valid' === u.type && void 0 !== u.value
                    ? Ie(
                        Te({}, e.value, a({}, n, u.value)),
                        [].concat(s(e.warnings), s(u.warnings))
                      )
                    : 'valid' === u.type
                      ? Ie(e.value, [].concat(s(e.warnings), s(u.warnings)))
                      : u;
                }, u)
              );
            }
            return qe('an object', n, r);
          };
        };
      },
      Ze = $e(!0),
      Qe = $e(!1),
      Xe = function(e, t, n, r) {
        var o = r || {},
          i = e(t, {
            origin: o.origin || '',
            element: o.element || '',
            label: n,
            path: []
          });
        if ('valid' === i.type) return { value: i.value, warnings: i.warnings };
        throw 'full' === i.errorType
          ? i.error
          : new ye(Re(i.expected, i.actual, i.options));
      },
      et = function(e) {
        return /^http(s)?:\/\//.test(e);
      },
      tt = function(e) {
        if (!et(e)) return null;
        var t = document.createElement('a');
        t.href = e;
        var n = t.protocol,
          r = t.host,
          o = /:80$/,
          i = /:443$/;
        return (
          'http:' === n && o.test(r)
            ? (r = r.replace(o, ''))
            : 'https:' === n && i.test(r) && (r = r.replace(i, '')),
          { host: r, protocol: n, origin: n + '//' + r }
        );
      },
      nt = function(e) {
        var t =
            arguments.length > 1 && void 0 !== arguments[1]
              ? arguments[1]
              : null,
          n = tt(e);
        return !!n && n.host !== (t || window.location.host);
      },
      rt = function(e, t) {
        if ('/' === t[0]) {
          var n = tt(e);
          return n ? '' + n.origin + t : t;
        }
        return '' + e.replace(/\/[^\/]*$/, '/') + t;
      },
      ot = {
        TOKENIZE: 'TOKENIZE',
        FETCH_LOCALE: 'FETCH_LOCALE',
        UPDATE_CSS_FONTS: 'UPDATE_CSS_FONTS',
        CREATE_SOURCE: 'CREATE_SOURCE',
        AUTHORIZE_SOURCE: 'AUTHORIZE_SOURCE',
        GET_AUTHORIZATION_STATUS: 'GET_AUTHORIZATION_STATUS',
        RETRIEVE_SOURCE: 'RETRIEVE_SOURCE',
        RETRIEVE_PAYMENT_INTENT: 'RETRIEVE_PAYMENT_INTENT',
        CONFIRM_PAYMENT_INTENT: 'CONFIRM_PAYMENT_INTENT',
        CREATE_APPLE_PAY_SESSION: 'CREATE_APPLE_PAY_SESSION'
      },
      it = ot,
      at = {
        CARD_ELEMENT: 'CARD_ELEMENT',
        CONTROLLER: 'CONTROLLER',
        METRICS_CONTROLLER: 'METRICS_CONTROLLER',
        PAYMENT_REQUEST_ELEMENT: 'PAYMENT_REQUEST_ELEMENT',
        PAYMENT_REQUEST: 'PAYMENT_REQUEST',
        SEPA_IBAN_ELEMENT: 'SEPA_IBAN_ELEMENT',
        IDEAL_BANK_ELEMENT: 'IDEAL_BANK_ELEMENT',
        THREE_DS: 'THREE_DS'
      },
      st = at,
      ut = function(e) {
        var t =
          arguments.length > 1 && void 0 !== arguments[1]
            ? arguments[1]
            : 'absurd';
        throw new Error(t);
      },
      ct = function(e) {
        return 'https://js.stripe.com/v3/' + (e || '');
      },
      lt = function(e) {
        switch (e) {
          case 'CARD_ELEMENT':
            return ct(
              'elements-inner-card-3ac70a26bbb8e24e436085d232c0e52d.html'
            );
          case 'CONTROLLER':
            return ct('controller-94acefa09a202573c3ddb63c6634707a.html');
          case 'METRICS_CONTROLLER':
            return 'https://js.stripe.com/v2/m/outer.html';
          case 'PAYMENT_REQUEST_ELEMENT':
            return ct(
              'elements-inner-payment-request-54cf0793de3591affc54b6b19da4e06c.html'
            );
          case 'PAYMENT_REQUEST':
            return ct(
              'payment-request-inner-b11f956822bc186baac093baf879dea6.html'
            );
          case 'SEPA_IBAN_ELEMENT':
            return ct(
              'elements-inner-sepa-iban-40a2409629e944a95996dd9b6ed448a1.html'
            );
          case 'IDEAL_BANK_ELEMENT':
            return ct(
              'elements-inner-ideal-bank-2c14ef9e1b52aea4066d43e28e2e2e98.html'
            );
          case 'THREE_DS':
            return ct('three-ds-inner-d70709362d16a5524f0da4edcc8ad8d3.html');
          default:
            return ut(e);
        }
      },
      pt = lt,
      ft = {
        card: 'card',
        cardNumber: 'cardNumber',
        cardExpiry: 'cardExpiry',
        cardCvc: 'cardCvc',
        postalCode: 'postalCode',
        sepaIban: 'betaSepaIban',
        idealBank: 'betaIdealBank',
        idealSecondary: 'idealSecondary',
        paymentRequestButton: 'paymentRequestButton'
      },
      dt = ft,
      ht = tt('https://js.stripe.com/v3/'),
      yt = ht ? ht.origin : '',
      _t = {
        family: 'font-family',
        src: 'src',
        unicodeRange: 'unicode-range',
        style: 'font-style',
        variant: 'font-variant',
        stretch: 'font-stretch',
        weight: 'font-weight',
        display: 'font-display'
      },
      mt = Object.keys(_t).reduce(function(e, t) {
        return (e[_t[t]] = t), e;
      }, {}),
      vt = [dt.idealBank, dt.idealSecondary],
      bt = 0,
      gt = function(e) {
        return '' + e + bt++;
      },
      wt = function e() {
        var t =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : '';
        return t
          ? (
              parseInt(t, 10) ^
              ((16 * Math.random()) >> (parseInt(t, 10) / 4))
            ).toString(16)
          : '00000000-0000-4000-8000-000000000000'.replace(/[08]/g, e);
      },
      Et =
        'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
          ? function(e) {
              return typeof e;
            }
          : function(e) {
              return e &&
                'function' == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? 'symbol'
                : typeof e;
            },
      Ot = function e(t, n) {
        var r = [];
        return (
          Object.keys(t).forEach(function(o) {
            var i = t[o],
              a = n ? n + '[' + o + ']' : o;
            if (i && 'object' === (void 0 === i ? 'undefined' : Et(i))) {
              var s = e(i, a);
              '' !== s && (r = [].concat(u(r), [s]));
            } else void 0 !== i && null !== i && (r = [].concat(u(r), [a + '=' + encodeURIComponent(String(i))]));
          }),
          r.join('&').replace(/%20/g, '+')
        );
      },
      St = Ot,
      kt = n(2),
      Pt = n.n(kt),
      At = window.Promise ? Promise : Pt.a,
      Ct = At,
      Tt = n(6),
      jt = n.n(Tt),
      Rt = (function() {
        function e(e, t) {
          var n = [],
            r = !0,
            o = !1,
            i = void 0;
          try {
            for (
              var a, s = e[Symbol.iterator]();
              !(r = (a = s.next()).done) &&
              (n.push(a.value), !t || n.length !== t);
              r = !0
            );
          } catch (e) {
            (o = !0), (i = e);
          } finally {
            try {
              !r && s.return && s.return();
            } finally {
              if (o) throw i;
            }
          }
          return n;
        }
        return function(t, n) {
          if (Array.isArray(t)) return t;
          if (Symbol.iterator in Object(t)) return e(t, n);
          throw new TypeError(
            'Invalid attempt to destructure non-iterable instance'
          );
        };
      })(),
      It = function(e, t) {
        var n = {};
        t.forEach(function(e) {
          var t = Rt(e, 2),
            r = t[0],
            o = t[1];
          r.split(/\s+/).forEach(function(e) {
            e && (n[e] = n[e] || o);
          });
        }),
          (e.className = jt()(e.className, n));
      },
      Mt = function(e, t) {
        e.style.cssText = Object.keys(t)
          .map(function(e) {
            return e + ': ' + t[e] + ' !important;';
          })
          .join(' ');
      },
      qt = function(e) {
        try {
          return window.parent.frames[e];
        } catch (e) {
          return null;
        }
      },
      Nt =
        Object.assign ||
        function(e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        },
      Lt = function(e) {
        var t = e.frameId,
          n = e.controllerId,
          r = e.type,
          o = yt,
          i = void 0;
        'controller' === r
          ? (i = qt(t))
          : 'group' === r
            ? (i = qt(n))
            : 'outer' === r
              ? (i = window.frames[t])
              : 'inner' === r && ((o = '*'), (i = window.parent)),
          i &&
            i.postMessage(JSON.stringify(Nt({}, e, { __stripeJsV3: !0 })), o);
      },
      xt = function(e) {
        try {
          var t = 'string' == typeof e ? JSON.parse(e) : e;
          return t.__stripeJsV3 ? t : null;
        } catch (e) {
          return null;
        }
      },
      Ft = (n(7),
      function(e, t) {
        var n = e._isUserError || 'IntegrationError' === e.name;
        throw (t &&
          !n &&
          t.report('fatal.uncaught_error', {
            iframe: !1,
            name: e.name,
            message: e.message || e.description,
            fileName: e.fileName,
            lineNumber: e.lineNumber,
            columnNumber: e.columnNumber,
            stack: e.stack && e.stack.substring(0, 1e3)
          }),
        e);
      }),
      Bt = function(e, t) {
        return function(n) {
          try {
            return e.call(this, n);
          } catch (e) {
            return Ft(e, t || (this && this._controller));
          }
        };
      },
      Dt = function(e, t) {
        return function(n, r) {
          try {
            return e.call(this, n, r);
          } catch (e) {
            return Ft(e, t || (this && this._controller));
          }
        };
      },
      Ut = function(e, t) {
        return function(n, r, o) {
          try {
            return e.call(this, n, r, o);
          } catch (e) {
            return Ft(e, t || (this && this._controller));
          }
        };
      },
      Ht = function(e, t) {
        return function() {
          try {
            for (var n = arguments.length, r = Array(n), o = 0; o < n; o++)
              r[o] = arguments[o];
            return e.call.apply(e, [this].concat(r));
          } catch (e) {
            return Ft(e, t || (this && this._controller));
          }
        };
      },
      zt = function e() {
        var t = this;
        c(this, e),
          (this._emit = function(e) {
            for (
              var n = arguments.length, r = Array(n > 1 ? n - 1 : 0), o = 1;
              o < n;
              o++
            )
              r[o - 1] = arguments[o];
            return (
              (t._callbacks[e] || []).forEach(function(e) {
                var t = e.fn;
                if (t._isUserCallback)
                  try {
                    t.apply(void 0, r);
                  } catch (e) {
                    throw ((e._isUserError = !0), e);
                  }
                else t.apply(void 0, r);
              }),
              t
            );
          }),
          (this._once = function(e, n) {
            var r = function r() {
              t._off(e, r), n.apply(void 0, arguments);
            };
            return t._on(e, r, n);
          }),
          (this._removeAllListeners = function() {
            return (t._callbacks = {}), t;
          }),
          (this._on = function(e, n, r) {
            return (
              (t._callbacks[e] = t._callbacks[e] || []),
              t._callbacks[e].push({ original: r, fn: n }),
              t
            );
          }),
          (this._userOn = function(e, n) {
            if ('string' != typeof e)
              throw new ye(
                'When adding an event listener, the first argument should be a string event name.'
              );
            if ('function' != typeof n)
              throw new ye(
                'When adding an event listener, the second argument should be a function callback.'
              );
            return (n._isUserCallback = !0), t._on(e, n);
          }),
          (this._hasRegisteredListener = function(e) {
            return t._callbacks[e] && t._callbacks[e].length > 0;
          }),
          (this._off = function(e, n) {
            if (n) {
              for (
                var r = t._callbacks[e], o = void 0, i = 0;
                i < r.length;
                i++
              )
                if (((o = r[i]), o.fn === n || o.original === n)) {
                  r.splice(i, 1);
                  break;
                }
            } else delete t._callbacks[e];
            return t;
          }),
          (this._callbacks = {});
        var n = Dt(this._userOn),
          r = Dt(this._off),
          o = Dt(this._once),
          i = Bt(this._hasRegisteredListener),
          a = Bt(this._removeAllListeners),
          s = Ht(this._emit);
        (this.on = this.addListener = this.addEventListener = n),
          (this.off = this.removeListener = this.removeEventListener = r),
          (this.once = o),
          (this.hasRegisteredListener = i),
          (this.removeAllListeners = a),
          (this.emit = s);
      },
      Kt = zt,
      Vt =
        Object.assign ||
        function(e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        },
      Yt = (function() {
        function e(e, t) {
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              'value' in r && (r.writable = !0),
              Object.defineProperty(e, r.key, r);
          }
        }
        return function(t, n, r) {
          return n && e(t.prototype, n), r && e(t, r), t;
        };
      })(),
      Gt = (function(e) {
        function t(e, n, r) {
          p(this, t);
          var o = f(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
          return (
            (o.type = e),
            (o.loaded = !1),
            (o._controllerId = n),
            (o._persistentMessages = []),
            (o._queuedMessages = []),
            (o._requests = {}),
            (o.id = o._generateId()),
            (o._iframe = o._createIFrame(r)),
            o._on('load', function() {
              (o.loaded = !0),
                o._ensureMounted(),
                o.loaded &&
                  (o._persistentMessages.forEach(function(e) {
                    return o._send(e);
                  }),
                  o._queuedMessages.forEach(function(e) {
                    return o._send(e);
                  }),
                  (o._queuedMessages = []));
            }),
            o
          );
        }
        return (
          d(t, e),
          Yt(t, [
            {
              key: '_generateId',
              value: function() {
                return gt('__privateStripeFrame');
              }
            },
            {
              key: 'send',
              value: function(e) {
                this._send({
                  message: e,
                  type: 'outer',
                  frameId: this.id,
                  controllerId: this._controllerId
                });
              }
            },
            {
              key: 'sendPersistent',
              value: function(e) {
                this._ensureMounted();
                var t = {
                  message: e,
                  type: 'outer',
                  frameId: this.id,
                  controllerId: this._controllerId
                };
                (this._persistentMessages = [].concat(
                  l(this._persistentMessages),
                  [t]
                )),
                  this.loaded && Lt(t);
              }
            },
            {
              key: 'action',
              value: function(e) {
                var t = this,
                  n =
                    arguments.length > 1 && void 0 !== arguments[1]
                      ? arguments[1]
                      : {},
                  r = gt(e),
                  o = new Ct(function(o, i) {
                    (t._requests[r] = Vt({}, t._requests[r], {
                      resolve: o,
                      reject: i
                    })),
                      t._send({
                        message: {
                          action: 'stripe-frame-action',
                          payload: { type: e, nonce: r, options: n }
                        },
                        type: 'outer',
                        frameId: t.id,
                        controllerId: t._controllerId
                      });
                  });
                return (
                  (this._requests[r] = Vt({}, this._requests[r], {
                    promise: o
                  })),
                  o
                );
              }
            },
            {
              key: 'resolve',
              value: function(e, t) {
                this._requests[e] && this._requests[e].resolve(t);
              }
            },
            {
              key: '_send',
              value: function(e) {
                this._ensureMounted(),
                  this.loaded
                    ? Lt(e)
                    : (this._queuedMessages = [].concat(
                        l(this._queuedMessages),
                        [e]
                      ));
              }
            },
            {
              key: 'appendTo',
              value: function(e) {
                e.appendChild(this._iframe);
              }
            },
            {
              key: 'unmount',
              value: function() {
                (this.loaded = !1), this._emit('unload');
              }
            },
            {
              key: '_ensureMounted',
              value: function() {
                this._isMounted() || this.unmount();
              }
            },
            {
              key: '_isMounted',
              value: function() {
                return !!document.body && document.body.contains(this._iframe);
              }
            },
            {
              key: '_createIFrame',
              value: function(e) {
                var t = window.location.href.toString(),
                  n = tt(t),
                  r = n ? n.origin : '',
                  o =
                    e.queryString && 'string' == typeof e.queryString
                      ? e.queryString
                      : St(
                          Vt({}, e, {
                            origin: r,
                            referrer: t,
                            controllerId: this._controllerId
                          })
                        ),
                  i = document.createElement('iframe');
                return (
                  i.setAttribute('frameborder', '0'),
                  i.setAttribute('allowTransparency', 'true'),
                  i.setAttribute('scrolling', 'no'),
                  i.setAttribute('name', this.id),
                  i.setAttribute('allowpaymentrequest', 'true'),
                  (i.src = pt(this.type) + '#' + o),
                  i
                );
              }
            }
          ]),
          t
        );
      })(Kt),
      Jt = Gt,
      Wt = (function() {
        function e(e, t) {
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              'value' in r && (r.writable = !0),
              Object.defineProperty(e, r.key, r);
          }
        }
        return function(t, n, r) {
          return n && e(t.prototype, n), r && e(t, r), t;
        };
      })(),
      $t = function e(t, n, r) {
        null === t && (t = Function.prototype);
        var o = Object.getOwnPropertyDescriptor(t, n);
        if (void 0 === o) {
          var i = Object.getPrototypeOf(t);
          return null === i ? void 0 : e(i, n, r);
        }
        if ('value' in o) return o.value;
        var a = o.get;
        if (void 0 !== a) return a.call(r);
      },
      Zt = {
        border: 'none',
        margin: '0',
        padding: '0',
        width: '1px',
        'min-width': '100%',
        overflow: 'hidden',
        display: 'block',
        visibility: 'hidden',
        position: 'fixed',
        height: '1px',
        'pointer-events': 'none'
      },
      Qt = (function(e) {
        function t(e, n, r) {
          h(this, t);
          var o = y(
            this,
            (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n, r)
          );
          if (
            ((o.autoload = r.autoload || !1),
            'complete' === document.readyState)
          )
            o._ensureMounted();
          else {
            var i = o._ensureMounted.bind(o);
            document.addEventListener('DOMContentLoaded', i),
              window.addEventListener('load', i),
              setTimeout(i, 5e3);
          }
          return o;
        }
        return (
          _(t, e),
          Wt(t, [
            {
              key: '_ensureMounted',
              value: function() {
                $t(
                  t.prototype.__proto__ || Object.getPrototypeOf(t.prototype),
                  '_ensureMounted',
                  this
                ).call(this),
                  this._isMounted() || this._autoMount();
              }
            },
            {
              key: '_autoMount',
              value: function() {
                if (document.body) this.appendTo(document.body);
                else if (
                  'complete' === document.readyState ||
                  'interactive' === document.readyState
                )
                  throw new ye(
                    'Stripe.js requires that your page has a <body> element.'
                  );
                this.autoload && (this.loaded = !0);
              }
            },
            {
              key: '_createIFrame',
              value: function(e) {
                var n = $t(
                  t.prototype.__proto__ || Object.getPrototypeOf(t.prototype),
                  '_createIFrame',
                  this
                ).call(this, e);
                return (
                  n.setAttribute('aria-hidden', 'true'),
                  n.setAttribute('allowpaymentrequest', 'true'),
                  n.setAttribute('tabIndex', '-1'),
                  Mt(n, Zt),
                  n
                );
              }
            }
          ]),
          t
        );
      })(Jt),
      Xt = Qt,
      en = (function() {
        function e(e, t) {
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              'value' in r && (r.writable = !0),
              Object.defineProperty(e, r.key, r);
          }
        }
        return function(t, n, r) {
          return n && e(t.prototype, n), r && e(t, r), t;
        };
      })(),
      tn = (function(e) {
        function t() {
          return (
            m(this, t),
            v(
              this,
              (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments)
            )
          );
        }
        return (
          b(t, e),
          en(t, [
            {
              key: '_generateId',
              value: function() {
                return this._controllerId;
              }
            }
          ]),
          t
        );
      })(Xt),
      nn = tn,
      rn = (function() {
        function e(e, t) {
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              'value' in r && (r.writable = !0),
              Object.defineProperty(e, r.key, r);
          }
        }
        return function(t, n, r) {
          return n && e(t.prototype, n), r && e(t, r), t;
        };
      })(),
      on = function e(t, n, r) {
        null === t && (t = Function.prototype);
        var o = Object.getOwnPropertyDescriptor(t, n);
        if (void 0 === o) {
          var i = Object.getPrototypeOf(t);
          return null === i ? void 0 : e(i, n, r);
        }
        if ('value' in o) return o.value;
        var a = o.get;
        if (void 0 !== a) return a.call(r);
      },
      an = {
        border: 'none',
        margin: '0',
        padding: '0',
        width: '1px',
        'min-width': '100%',
        overflow: 'hidden',
        display: 'block'
      },
      sn = (function(e) {
        function t() {
          return (
            g(this, t),
            w(
              this,
              (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments)
            )
          );
        }
        return (
          E(t, e),
          rn(t, [
            {
              key: 'update',
              value: function(e) {
                this.send({ action: 'stripe-user-update', payload: e });
              }
            },
            {
              key: 'updateStyle',
              value: function(e) {
                var t = this;
                Object.keys(e).forEach(function(n) {
                  t._iframe.style[n] = e[n];
                });
              }
            },
            {
              key: 'focus',
              value: function() {
                this.loaded &&
                  this.send({ action: 'stripe-user-focus', payload: {} });
              }
            },
            {
              key: 'blur',
              value: function() {
                this.loaded &&
                  (this._iframe.contentWindow.blur(), this._iframe.blur());
              }
            },
            {
              key: 'clear',
              value: function() {
                this.send({ action: 'stripe-user-clear', payload: {} });
              }
            },
            {
              key: '_createIFrame',
              value: function(e) {
                var n = on(
                  t.prototype.__proto__ || Object.getPrototypeOf(t.prototype),
                  '_createIFrame',
                  this
                ).call(this, e);
                return (
                  n.setAttribute('title', 'Secure payment input frame'),
                  Mt(n, an),
                  n
                );
              }
            }
          ]),
          t
        );
      })(Jt),
      un = sn,
      cn = (function() {
        function e(e, t) {
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              'value' in r && (r.writable = !0),
              Object.defineProperty(e, r.key, r);
          }
        }
        return function(t, n, r) {
          return n && e(t.prototype, n), r && e(t, r), t;
        };
      })(),
      ln = function e(t, n, r) {
        null === t && (t = Function.prototype);
        var o = Object.getOwnPropertyDescriptor(t, n);
        if (void 0 === o) {
          var i = Object.getPrototypeOf(t);
          return null === i ? void 0 : e(i, n, r);
        }
        if ('value' in o) return o.value;
        var a = o.get;
        if (void 0 !== a) return a.call(r);
      },
      pn = function(e) {
        return {
          display: e ? 'block' : 'none',
          visibility: 'visible',
          position: 'fixed',
          'z-index': '2147483647',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          margin: '0px',
          padding: '0px',
          border: '0px none transparent',
          'overflow-x': 'hidden',
          'overflow-y': 'auto'
        };
      },
      fn = pn(!1),
      dn = pn(!0),
      hn = (function(e) {
        function t(e, n, r) {
          O(this, t);
          var o = S(
            this,
            (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n, r)
          );
          return (
            (o._mountAfterBody = function() {
              if (!o._isMounted())
                if (document.body) o.appendTo(document.body);
                else if (
                  'complete' === document.readyState ||
                  'interactive' === document.readyState
                )
                  throw new ye(
                    'Stripe.js requires that your page has a <body> element.'
                  );
            }),
            (o._autoMount = function() {
              'complete' === document.readyState
                ? o._mountAfterBody()
                : (document.addEventListener(
                    'DOMContentLoaded',
                    o._mountAfterBody
                  ),
                  window.addEventListener('load', o._mountAfterBody));
            }),
            (o.show = function() {
              Mt(o._iframe, dn);
            }),
            (o.hide = function() {
              Mt(o._iframe, fn);
            }),
            o._autoMount(),
            o
          );
        }
        return (
          k(t, e),
          cn(t, [
            {
              key: '_createIFrame',
              value: function(e) {
                var n = ln(
                  t.prototype.__proto__ || Object.getPrototypeOf(t.prototype),
                  '_createIFrame',
                  this
                ).call(this, e);
                return Mt(n, fn), n;
              }
            }
          ]),
          t
        );
      })(Jt),
      yn = hn,
      _n =
        Object.assign ||
        function(e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        },
      mn = (function() {
        function e(e, t) {
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              'value' in r && (r.writable = !0),
              Object.defineProperty(e, r.key, r);
          }
        }
        return function(t, n, r) {
          return n && e(t.prototype, n), r && e(t, r), t;
        };
      })(),
      vn = function e(t, n, r) {
        null === t && (t = Function.prototype);
        var o = Object.getOwnPropertyDescriptor(t, n);
        if (void 0 === o) {
          var i = Object.getPrototypeOf(t);
          return null === i ? void 0 : e(i, n, r);
        }
        if ('value' in o) return o.value;
        var a = o.get;
        if (void 0 !== a) return a.call(r);
      },
      bn = {
        display: 'block',
        position: 'absolute',
        'z-index': '1',
        height: '0',
        width: '1px',
        'min-width': '100%',
        margin: '2px 0 0 0',
        padding: '0',
        border: 'none',
        overflow: 'hidden'
      },
      gn = (function(e) {
        function t() {
          return (
            P(this, t),
            A(
              this,
              (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments)
            )
          );
        }
        return (
          C(t, e),
          mn(t, [
            {
              key: 'updateStyle',
              value: function(e) {
                var t = this;
                Object.keys(e).forEach(function(n) {
                  t._iframe.style[n] = e[n];
                });
              }
            },
            {
              key: '_createIFrame',
              value: function(e) {
                var n = vn(
                  t.prototype.__proto__ || Object.getPrototypeOf(t.prototype),
                  '_createIFrame',
                  this
                ).call(this, _n({}, e, { isSecondaryFrame: !0 }));
                return Mt(n, bn), n;
              }
            }
          ]),
          t
        );
      })(Jt),
      wn = gn,
      En = function(e) {
        var t = tt(e),
          n = t ? t.host : '';
        return 'stripe.com' === n || !!n.match(/\.stripe\.(com|me)$/);
      },
      On = function(e) {
        return En(e);
      },
      Sn = function(e, t) {
        var n = tt(e),
          r = tt(t);
        return !(!n || !r) && n.origin === r.origin;
      },
      kn = [
        'button',
        'checkbox',
        'file',
        'hidden',
        'image',
        'submit',
        'radio',
        'reset'
      ],
      Pn = function(e) {
        var t = e.tagName;
        if (e.isContentEditable || 'TEXTAREA' === t) return !0;
        if ('INPUT' !== t) return !1;
        var n = e.getAttribute('type');
        return -1 === kn.indexOf(n);
      },
      An = Pn,
      Cn = function(e) {
        return /(MSIE ([0-9]{1,}[.0-9]{0,})|Trident\/)/i.test(e);
      },
      Tn = function(e) {
        return /SamsungBrowser/.test(e);
      },
      jn = function(e) {
        return /iPad|iPhone/i.test(e) && !Cn(e);
      },
      Rn = function(e) {
        return /Android/.test(e) && !Cn(e);
      },
      In = window.navigator.userAgent,
      Mn = (function(e) {
        return /Edge\//i.test(e);
      })(In),
      qn = (Cn(In),
      (function(e) {
        /MSIE 9/i.test(e);
      })(In),
      (function(e) {
        /MSIE ([0-9]{1,}[.0-9]{0,})/i.test(e);
      })(In),
      jn(In)),
      Nn = ((function(e) {
        jn(e) || Rn(e);
      })(In),
      Rn(In),
      (function(e) {
        /^((?!chrome|android).)*safari/i.test(e) && Tn(e);
      })(In),
      (function(e) {
        /Firefox\//i.test(e);
      })(In),
      Tn(In)),
      Ln = (window.ApplePaySession,
      (ce = {}),
      T(ce, dt.card, {
        unique: !0,
        conflict: [dt.cardNumber, dt.cardExpiry, dt.cardCvc, dt.postalCode]
      }),
      T(ce, dt.cardNumber, { unique: !0, conflict: [dt.card] }),
      T(ce, dt.cardExpiry, { unique: !0, conflict: [dt.card] }),
      T(ce, dt.cardCvc, { unique: !0, conflict: [dt.card] }),
      T(ce, dt.postalCode, { unique: !0, conflict: [dt.card] }),
      T(ce, dt.paymentRequestButton, { unique: !0, conflict: [] }),
      T(ce, dt.sepaIban, { unique: !0, conflict: [], beta: !0 }),
      T(ce, dt.idealBank, { unique: !0, conflict: [], beta: !0 }),
      ce),
      xn = Ln,
      Fn = ((le = {}),
      j(le, dt.card, st.CARD_ELEMENT),
      j(le, dt.cardNumber, st.CARD_ELEMENT),
      j(le, dt.cardExpiry, st.CARD_ELEMENT),
      j(le, dt.cardCvc, st.CARD_ELEMENT),
      j(le, dt.postalCode, st.CARD_ELEMENT),
      j(le, dt.paymentRequestButton, st.PAYMENT_REQUEST_ELEMENT),
      j(le, dt.sepaIban, st.SEPA_IBAN_ELEMENT),
      j(le, dt.idealBank, st.IDEAL_BANK_ELEMENT),
      le),
      Bn = Fn,
      Dn = ['brand'],
      Un = ['country', 'bankName'],
      Hn = ((pe = {}),
      R(pe, dt.card, Dn),
      R(pe, dt.cardNumber, Dn),
      R(pe, dt.sepaIban, Un),
      pe),
      zn = R({}, dt.idealBank, { secondary: dt.idealSecondary }),
      Kn =
        Object.assign ||
        function(e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        },
      Vn = !1,
      Yn = function e(t) {
        M(this, e), Gn.call(this);
        var n = t.apiKey,
          r = t.stripeAccount,
          o = t.stripeJsId,
          i = t.features;
        (this._id = gt('__privateStripeController')),
          (this._stripeJsId = o),
          (this._apiKey = n),
          (this._stripeAccount = r),
          (this._features = i || {}),
          (this._controllerFrame = new nn(st.CONTROLLER, this._id, t)),
          (this._frames = {}),
          (this._requests = {}),
          this._setupPostMessage(),
          (this._handleMessage = Bt(this._handleMessage, this));
      },
      Gn = function() {
        var e = this;
        (this.action = function(t, n) {
          var r = gt(it[t]),
            o = new Ct(function(o, i) {
              (e._requests[r] = Kn({}, e._requests[r], {
                resolve: o,
                reject: i
              })),
                e._controllerFrame.send({
                  action: 'stripe-user-action',
                  payload: { type: t, nonce: r, options: n }
                });
            });
          return (e._requests[r] = Kn({}, e._requests[r], { promise: o })), o;
        }),
          (this.createElementFrame = function(t, n) {
            var r = n.groupId,
              o = I(n, ['groupId']),
              i = new un(t, e._id, Kn({}, o, { features: e._features }));
            return e._setupFrame(i, r);
          }),
          (this.createSecondaryElementFrame = function(t, n) {
            var r = n.groupId,
              o = I(n, ['groupId']),
              i = new wn(t, e._id, Kn({}, o, { features: e._features }));
            return e._setupFrame(i, r);
          }),
          (this.createHiddenFrame = function(t, n) {
            var r = new Xt(t, e._id, Kn({}, n, { features: e._features }));
            return e._setupFrame(r);
          }),
          (this.createLightboxFrame = function(t, n) {
            var r = new yn(t, e._id, Kn({}, n, { features: e._features }));
            return e._setupFrame(r);
          }),
          (this._setupFrame = function(t, n) {
            return (
              (e._frames[t.id] = t),
              e._controllerFrame.sendPersistent({
                action: 'stripe-user-createframe',
                payload: { newFrameId: t.id, groupId: n }
              }),
              t._on('unload', function() {
                e._controllerFrame.sendPersistent({
                  action: 'stripe-frame-unload',
                  payload: { unloadedFrameId: t.id }
                });
              }),
              t._on('load', function() {
                e._controllerFrame.sendPersistent({
                  action: 'stripe-frame-load',
                  payload: { loadedFrameId: t.id }
                }),
                  e._controllerFrame.loaded &&
                    t.send({ action: 'stripe-controller-load', payload: {} });
              }),
              t
            );
          }),
          (this.report = function(t) {
            var n =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {};
            e._controllerFrame.send({
              action: 'stripe-controller-report',
              payload: { event: t, data: n }
            });
          }),
          (this.warn = function() {
            for (var t = arguments.length, n = Array(t), r = 0; r < t; r++)
              n[r] = arguments[r];
            e._controllerFrame.send({
              action: 'stripe-controller-warn',
              payload: { args: n }
            });
          }),
          (this._setupPostMessage = function() {
            window.addEventListener('message', function(t) {
              var n = t.data,
                r = t.origin,
                o = xt(n);
              o && Sn(yt, r) && e._handleMessage(o);
            });
          }),
          (this._handleMessage = function(t) {
            var n = t.controllerId,
              r = t.frameId,
              o = t.message,
              i = e._frames[r];
            if (n === e._id)
              switch (o.action) {
                case 'stripe-frame-event':
                  var a = o.payload,
                    s = a.event,
                    u = a.data;
                  if (i) {
                    if (qn) {
                      var c = i._iframe.parentElement,
                        l =
                          c && c.querySelector('.__PrivateStripeElement-input'),
                        p =
                          document.activeElement === i._iframe ||
                          (c && document.activeElement === l);
                      if ('focus' === s && !Vn && !p) {
                        l && l.focus(), (Vn = !0);
                        break;
                      }
                      if ('blur' === s && Vn) {
                        Vn = !1;
                        break;
                      }
                      'blur' === s &&
                        setTimeout(function() {
                          var e = document.activeElement;
                          if (e && !p && !An(e)) {
                            var t =
                              c &&
                              c.querySelector(
                                '.__PrivateStripeElement-safariInput'
                              );
                            t && (t.focus(), t.blur()), e.focus();
                          }
                        }, 400);
                    }
                    i._emit(s, u);
                  }
                  break;
                case 'stripe-frame-action-complete':
                  i && i.resolve(o.payload.nonce, o.payload.result);
                  break;
                case 'stripe-frame-error':
                  throw new ye(o.payload.message);
                case 'stripe-integration-error':
                  i &&
                    i._emit('__privateIntegrationError', {
                      message: o.payload.message
                    });
                  break;
                case 'stripe-controller-load':
                  e._controllerFrame._emit('load'),
                    Object.keys(e._frames).forEach(function(t) {
                      return e._frames[t].send({
                        action: 'stripe-controller-load',
                        payload: {}
                      });
                    });
                  break;
                case 'stripe-user-action-complete':
                  e._requests[o.payload.nonce] &&
                    e._requests[o.payload.nonce].resolve(o.payload.result);
                  break;
                case 'stripe-user-action-error':
                  e._requests[o.payload.nonce] &&
                    e._requests[o.payload.nonce].reject(
                      new ye(o.payload.error)
                    );
              }
          });
      },
      Jn = Yn,
      Wn = (function(e) {
        function t() {
          q(this, t);
          var e = N(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
          return (e.name = 'NetworkError'), e;
        }
        return L(t, e), t;
      })(Error),
      $n = Wn,
      Zn =
        Object.assign ||
        function(e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        },
      Qn = {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      Xn = function(e) {
        return (
          Object.keys(Qn).forEach(function(t) {
            e.setRequestHeader(t, Qn[t]);
          }),
          e
        );
      },
      er = function e(t) {
        return new Ct(function(n, r) {
          var o = t.method,
            i = t.url,
            a = t.timeout,
            s = t.data,
            u = t.withCredentials,
            c = s ? St(s) : '',
            l =
              !window.XMLHttpRequest ||
              (nt(i) && void 0 === new XMLHttpRequest().withCredentials),
            p = 'GET' === o && c ? i + '?' + c : i,
            f = 'GET' === o ? '' : c;
          if (l) {
            var d = new window.XDomainRequest();
            try {
              d.open(o, p);
            } catch (e) {
              r(e);
            }
            (d.onerror = function() {
              n({
                responseText: JSON.stringify({ error: { type: 'api_error' } })
              });
            }),
              (d.onload = function() {
                n({ status: 200, responseText: d.responseText });
              }),
              setTimeout(function() {
                d.send(f);
              }, 0);
          } else {
            var h = new XMLHttpRequest(),
              y = void 0;
            a &&
              (y = setTimeout(function() {
                return h.abort();
              }, a)),
              u && (h.withCredentials = u),
              h.open(o, p, !0),
              Xn(h),
              (h.onreadystatechange = function() {
                4 === h.readyState &&
                  (clearTimeout(y),
                  (h.onreadystatechange = function() {}),
                  0 === h.status
                    ? u
                      ? r(new $n())
                      : e(Zn({}, t, { withCredentials: !0 })).then(n, r)
                    : n(h));
              });
            try {
              h.send(f);
            } catch (e) {
              r(e);
            }
          }
        });
      },
      tr = er,
      nr =
        Object.assign ||
        function(e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        },
      rr = function(e, t) {
        var n = /@font-face[ ]?{[^}]*}/g,
          r = e.match(n);
        if (!r) throw new ye('No @font-face rules found in file from ' + t);
        return r;
      },
      or = function(e) {
        var t = e.match(/@font-face[ ]?{([^}]*)}/);
        return t ? t[1] : '';
      },
      ir = function(e, t) {
        var n = e.replace(/\/\*.*\*\//g, '').trim(),
          r = n.length && /;$/.test(n) ? n : n + ';',
          o = r.match(/((([^;(]*\([^()]*\)[^;)]*)|[^;]+)+)(?=;)/g);
        if (!o)
          throw new ye(
            'Found @font-face rule containing no valid font-properties in file from ' +
              t
          );
        return o;
      },
      ar = function(e, t) {
        var n = e.indexOf(':');
        if (-1 === n)
          throw new ye(
            'Invalid css declaration in file from ' + t + ': "' + e + '"'
          );
        var r = e.slice(0, n).trim(),
          o = mt[r];
        if (!o)
          throw new ye(
            'Unsupported css property in file from ' + t + ': "' + r + '"'
          );
        return { property: o, value: e.slice(n + 1).trim() };
      },
      sr = function(e, t) {
        var n = e.reduce(function(e, n) {
          var r = ar(n, t),
            o = r.property,
            i = r.value;
          return nr({}, e, x({}, o, i));
        }, {});
        return (
          ['family', 'src'].forEach(function(e) {
            if (!n[e])
              throw new ye(
                'Missing css property in file from ' + t + ': "' + _t[e] + '"'
              );
          }),
          n
        );
      },
      ur = function(e) {
        return tr({ url: e, method: 'GET' })
          .then(function(e) {
            return e.responseText;
          })
          .then(function(t) {
            return rr(t, e).map(function(t) {
              var n = or(t),
                r = ir(n, e);
              return sr(r, e);
            });
          });
      },
      cr = ur,
      lr = function(e, t) {
        if (!(e && e in xn))
          throw new ye(
            'A valid Element name must be provided. Valid Elements are:\n' +
              Object.keys(xn)
                .filter(function(e) {
                  return !xn[e].beta;
                })
                .join(', ') +
              '; you passed: ' +
              e +
              '.'
          );
        if (xn[e].unique && -1 !== t.indexOf(e))
          throw new ye('Can only create one Element of type ' + e + '.');
        var n = Se(t, xn[e].conflict);
        if (n.length) {
          var r = n[0];
          throw new ye(
            'Cannot create an Element of type ' +
              e +
              ' after an Element of type ' +
              r +
              ' has already been created.'
          );
        }
      },
      pr = function(e, t) {
        var n = Array.prototype.slice.call(
            document.querySelectorAll(
              'a[href], area[href], input:not([disabled]),\n  select:not([disabled]), textarea:not([disabled]), button:not([disabled]),\n  object, embed, *[tabindex], *[contenteditable]'
            )
          ),
          r = [];
        n.forEach(function(e) {
          var t = e.getAttribute('tabindex'),
            n = !t || parseInt(t, 10) >= 0,
            o = e.getBoundingClientRect(),
            i = o.width > 0 && o.height > 0;
          n && i && r.push(e);
        });
        var o = be(r, function(t) {
          return t === e || e.contains(t);
        });
        return r[o + ('previous' === t ? -1 : 1)];
      },
      fr = pr,
      dr = '14px',
      hr = function(e) {
        var t = e.split(' ').map(function(e) {
          return parseInt(e.trim(), 10);
        });
        return 1 === t.length || 2 === t.length
          ? 2 * t[0]
          : 3 === t.length || 4 === t.length ? t[0] + t[2] : 0;
      },
      yr = function() {
        var e =
            arguments.length > 0 && void 0 !== arguments[0]
              ? arguments[0]
              : '1.2em',
          t =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : dr,
          n =
            arguments.length > 2 && void 0 !== arguments[2]
              ? arguments[2]
              : '0',
          r = hr(n);
        if ('string' == typeof e && /^[0-9.]+px$/.test(e)) {
          return parseFloat(e.toString().replace(/[^0-9.]/g, '')) + r + 'px';
        }
        var o = parseFloat(e.toString().replace(/[^0-9.]/g, '')),
          i = parseFloat(dr.replace(/[^0-9.]/g, '')),
          a = parseFloat(t.toString().replace(/[^0-9.]/g, '')),
          s = void 0;
        if ('string' == typeof t && /^(\d+|\d*\.\d+)px$/.test(t)) s = a;
        else if ('string' == typeof t && /^(\d+|\d*\.\d+)em$/.test(t))
          s = a * i;
        else if ('string' == typeof t && /^(\d+|\d*\.\d+)%$/.test(t))
          s = a / 100 * i;
        else {
          if (
            'string' != typeof t ||
            (!/^[\d.]+$/.test(t) && !/^\d*\.(px|em|%)$/.test(t))
          )
            return '100%';
          s = i;
        }
        var u = o * s + r,
          c = u + 'px';
        return /^[0-9.]+px$/.test(c) ? c : '100%';
      },
      _r = yr,
      mr = function(e, t) {
        return e ? window.getComputedStyle(e, t) : null;
      },
      vr = mr,
      br = (function() {
        if (!window.PaymentRequest) return null;
        if (/CriOS\/59/.test(navigator.userAgent)) return null;
        if (/.*\(.*; wv\).*Chrome\/(?:53|54)\.\d.*/g.test(navigator.userAgent))
          return null;
        var e = window.PaymentRequest;
        return (
          e.prototype.canMakePayment ||
            (e.prototype.canMakePayment = function() {
              return Ct.resolve(!1);
            }),
          e
        );
      })(),
      gr = { CAN_MAKE_PAYMENT: 'CAN_MAKE_PAYMENT' },
      wr = function() {
        try {
          return window.location.origin === window.top.location.origin;
        } catch (e) {
          return !1;
        }
      },
      Er = void 0,
      Or = (function(e) {
        var t = {};
        return function(n) {
          if (void 0 !== t[n]) return t[n];
          var r = e(n);
          return (t[n] = r), r;
        };
      })(function(e) {
        return window.ApplePaySession.canMakePaymentsWithActiveCard(e).then(
          function(e) {
            return (
              Er &&
                Er('payreq.can_make_payment_native_response', { available: e }),
              e
            );
          }
        );
      }),
      Sr = function(e, t, n, r) {
        if (((Er = r), window.ApplePaySession)) {
          if (wr()) {
            if (n && 'https:' !== window.location.protocol)
              return (
                window.console &&
                  window.console.warn(
                    'To test Apple Pay, you must serve this page over HTTPS.'
                  ),
                Ct.resolve(!1)
              );
            if (window.ApplePaySession.supportsVersion(2)) {
              var o = t ? [e, t] : [e],
                i = 'merchant.' + o.join('.') + '.stripe';
              return Or(i).then(function(r) {
                if (n && !r && window.console) {
                  var o = t ? 'or stripeAccount parameter (' + t + ') ' : '';
                  window.console.warn(
                    'Either you do not have a card saved to your Wallet or the current domain (' +
                      e +
                      ') ' +
                      o +
                      'is not registered for Apple Pay. Visit https://dashboard.stripe.com/account/apple_pay to register this domain.'
                  );
                }
                return r;
              });
            }
            return (
              n &&
                window.console &&
                window.console.warn(
                  'This version of Safari does not support ApplePay JS version 2.'
                ),
              Ct.resolve(!1)
            );
          }
          return Ct.resolve(!1);
        }
        return Ct.resolve(!1);
      },
      kr = null,
      Pr = function(e, t) {
        return null !== kr
          ? Ct.resolve(kr)
          : br
            ? Mn &&
              -1 ===
                window.location.href.indexOf('__stripe_debug_microsoft_pay')
              ? Ct.resolve(!1)
              : Nn
                ? Ct.resolve(!1)
                : t && 'https:' !== window.location.protocol
                  ? (window.console &&
                      window.console.warn(
                        'To test Payment Request, you must serve this page over HTTPS.'
                      ),
                    Ct.resolve(!1))
                  : e
                    ? e.action(gr.CAN_MAKE_PAYMENT).then(function(e) {
                        var t = e.available;
                        return (kr = 'boolean' == typeof t && t);
                      })
                    : Ct.resolve(!1)
            : Ct.resolve(!1);
      },
      Ar =
        Object.assign ||
        function(e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        },
      Cr = { merchantCapabilities: ['supports3DS'], displayItems: [] },
      Tr = { amount: Ve, label: He, pending: Ne(Ke) },
      jr = Ar({}, Tr, {
        id: ze(He, function() {
          return gt('shippingOption');
        }),
        detail: ze(He, function() {
          return '';
        })
      }),
      Rr = {
        displayItems: Ne(Ge(Qe(Tr))),
        shippingOptions: Ne(Je('id')(Ge(Qe(jr)))),
        total: Ne(Qe(Tr))
      },
      Ir = { shipping: 'shipping', delivery: 'delivery', pickup: 'pickup' },
      Mr = {
        requestShipping: Ne(Ke),
        requestPayerName: Ne(Ke),
        requestPayerEmail: Ne(Ke),
        requestPayerPhone: Ne(Ke),
        shippingType: Ne(Fe.apply(void 0, F(Object.keys(Ir))))
      },
      qr = Ar({}, Mr, {
        displayItems: Ne(Ge(Qe(Tr))),
        shippingOptions: Ne(Je('id')(Ge(Qe(jr)))),
        total: Qe(Tr),
        currency: Ue,
        country: De,
        jcbEnabled: Ne(Ke)
      }),
      Nr = {
        success: 'success',
        fail: 'fail',
        invalid_payer_name: 'invalid_payer_name',
        invalid_payer_email: 'invalid_payer_email',
        invalid_payer_phone: 'invalid_payer_phone',
        invalid_shipping_address: 'invalid_shipping_address'
      },
      Lr = Ar({}, Rr, { status: Fe.apply(void 0, F(Object.keys(Nr))) }),
      xr = Ar({}, Rr, { currency: Ne(He) }),
      Fr = Qe(Lr),
      Br = Ze(xr),
      Dr = Qe(qr),
      Ur = ['mastercard', 'visa'],
      Hr = [
        'AT',
        'AU',
        'BE',
        'CA',
        'CH',
        'DE',
        'DK',
        'ES',
        'FI',
        'FR',
        'GB',
        'HK',
        'IE',
        'IT',
        'JP',
        'LU',
        'NL',
        'NO',
        'NZ',
        'PT',
        'SE',
        'SG',
        'US'
      ],
      zr = function(e, t) {
        var n = 'US' === e || t ? ['discover', 'diners', 'jcb'].concat(Ur) : Ur;
        return -1 !== Hr.indexOf(e) ? ['amex'].concat(B(n)) : n;
      },
      Kr = function(e, t) {
        return zr(e, t).reduce(function(e, t) {
          return 'mastercard' === t
            ? [].concat(B(e), ['masterCard'])
            : 'diners' === t ? e : [].concat(B(e), [t]);
        }, []);
      },
      Vr = {
        bif: 1,
        clp: 1,
        djf: 1,
        gnf: 1,
        jpy: 1,
        kmf: 1,
        krw: 1,
        mga: 1,
        pyg: 1,
        rwf: 1,
        vnd: 1,
        vuv: 1,
        xaf: 1,
        xof: 1,
        xpf: 1
      },
      Yr = function(e, t) {
        var n = Vr[t.toLowerCase()] || 100,
          r = e / n,
          o = Math.log(n) / Math.log(10);
        return r.toFixed(Math.round(o));
      },
      Gr =
        Object.assign ||
        function(e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        },
      Jr = function(e, t) {
        return {
          amount: Yr(e.amount, t.currency),
          label: e.label,
          type: e.pending ? 'pending' : 'final'
        };
      },
      Wr = function(e, t) {
        return {
          amount: Yr(e.amount, t.currency),
          label: e.label,
          detail: e.detail,
          identifier: e.id
        };
      },
      $r = function(e) {
        return function(t) {
          return t[e] && 'string' == typeof t[e] ? t[e].toUpperCase() : null;
        };
      },
      Zr = ((fe = {}),
      D(fe, Nr.success, 0),
      D(fe, Nr.fail, 1),
      D(fe, Nr.invalid_payer_name, 2),
      D(fe, Nr.invalid_shipping_address, 3),
      D(fe, Nr.invalid_payer_phone, 4),
      D(fe, Nr.invalid_payer_email, 4),
      fe),
      Qr = ((de = {}),
      D(de, Ir.pickup, 'storePickup'),
      D(de, Ir.shipping, 'shipping'),
      D(de, Ir.delivery, 'delivery'),
      de),
      Xr = {
        total: function(e) {
          return Jr(e.total, e);
        },
        lineItems: function(e) {
          return e.displayItems
            ? e.displayItems.map(function(t) {
                return Jr(t, e);
              })
            : [];
        },
        shippingMethods: function(e) {
          return e.shippingOptions
            ? e.shippingOptions.map(function(t) {
                return Wr(t, e);
              })
            : [];
        }
      },
      eo = Gr({}, Xr, {
        shippingType: function(e) {
          var t = e.shippingType;
          if (!t) return null;
          var n = Qr[t];
          if (void 0 !== n) return n;
          throw new ye('Invalid value for shippingType: ' + t);
        },
        requiredBillingContactFields: function(e) {
          return e.requestPayerName ? ['postalAddress'] : null;
        },
        requiredShippingContactFields: function(e) {
          var t = [];
          return (
            e.requestShipping && t.push('postalAddress'),
            e.requestPayerEmail && t.push('email'),
            e.requestPayerPhone && t.push('phone'),
            t.length ? t : null
          );
        },
        countryCode: $r('country'),
        currencyCode: $r('currency'),
        merchantCapabilities: (function(e) {
          return function(t) {
            return t[e] || null;
          };
        })('merchantCapabilities'),
        supportedNetworks: function(e) {
          return Kr(e.country, e.jcbEnabled || !1);
        }
      }),
      to = Gr({}, Xr, {
        status: function(e) {
          return Zr[e.status] || 0;
        }
      }),
      no = (Gr({}, to, eo),
      function(e) {
        var t = {},
          n = Gr({}, Cr, e);
        return (
          Object.keys(eo).forEach(function(e) {
            var r = eo[e],
              o = r(n);
            null !== o && (t[e] = o);
          }),
          t
        );
      }),
      ro = function(e) {
        var t = {};
        return (
          Object.keys(to).forEach(function(n) {
            var r = to[n],
              o = r(e);
            null !== o && (t[n] = o);
          }),
          t
        );
      },
      oo = no,
      io = function(e) {
        return 'string' == typeof e ? e : null;
      },
      ao = function(e) {
        return e ? io(e.phoneNumber) : null;
      },
      so = function(e) {
        return e ? io(e.emailAddress) : null;
      },
      uo = function(e) {
        return e
          ? [e.givenName, e.familyName]
              .filter(function(e) {
                return e && 'string' == typeof e;
              })
              .join(' ')
          : null;
      },
      co = function(e) {
        if (e) {
          var t = e.addressLines,
            n = e.countryCode,
            r = e.postalCode,
            o = e.administrativeArea,
            i = e.locality,
            a = e.phoneNumber,
            s = io(n);
          return {
            addressLine: Array.isArray(t)
              ? t.reduce(function(e, t) {
                  return 'string' == typeof t ? [].concat(U(e), [t]) : e;
                }, [])
              : [],
            country: s ? s.toUpperCase() : '',
            postalCode: io(r) || '',
            recipient: uo(e) || '',
            region: io(o) || '',
            city: io(i) || '',
            phone: io(a) || '',
            sortingCode: '',
            dependentLocality: '',
            organization: ''
          };
        }
        return null;
      },
      lo = function(e, t) {
        if (e && t.shippingOptions) {
          var n = e.identifier,
            r = e.label;
          return (
            t.shippingOptions.filter(function(e) {
              return e.id === n && e.label === r;
            })[0] || null
          );
        }
        return null;
      },
      po = function(e, t) {
        var n = e.shippingContact,
          r = e.shippingMethod,
          o = e.billingContact;
        return {
          shippingOption: lo(r, t),
          shippingAddress: co(n),
          payerEmail: so(n),
          payerPhone: ao(n),
          payerName: uo(o),
          methodName: 'apple-pay'
        };
      },
      fo = po,
      ho = function(e) {
        if (!e || !e.length)
          throw new ye(
            'When requesting shipping information, you must specify shippingOptions once a shipping address is selected.\nEither provide shippingOptions in stripe.paymentRequest(...) or listen for the shippingaddresschange event and provide shippingOptions to the updateWith callback there.'
          );
        return e;
      },
      yo = ho,
      _o = { live: 'live', test: 'test', unknown: 'unknown' },
      mo = function(e) {
        return /^pk_test_/.test(e)
          ? _o.test
          : /^pk_live_/.test(e) ? _o.live : _o.unknown;
      },
      vo = function(e) {
        if (e === _o.unknown)
          throw new ye(
            "It looks like you're using an older Stripe key. In order to use this API, you'll need to use a modern API key, which is prefixed with 'pk_live_' or 'pk_test_'.\n    You can roll your publishable key here: https://dashboard.stripe.com/account/apikeys"
          );
      },
      bo =
        'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
          ? function(e) {
              return typeof e;
            }
          : function(e) {
              return e &&
                'function' == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? 'symbol'
                : typeof e;
            },
      go =
        Object.assign ||
        function(e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        },
      wo = (function() {
        function e(e, t) {
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              'value' in r && (r.writable = !0),
              Object.defineProperty(e, r.key, r);
          }
        }
        return function(t, n, r) {
          return n && e(t.prototype, n), r && e(t, r), t;
        };
      })(),
      Eo = {
        australia: 'AU',
        austria: 'AT',
        canada: 'CA',
        schweiz: 'CH',
        deutschland: 'DE',
        hongkong: 'HK',
        saudiarabia: 'SA',
        espaa: 'ES',
        singapore: 'SG',
        us: 'US',
        usa: 'US',
        unitedstatesofamerica: 'US',
        unitedstates: 'US',
        england: 'GB',
        gb: 'GB',
        uk: 'GB',
        unitedkingdom: 'GB'
      },
      Oo = (function(e) {
        function t(e, n, r) {
          z(this, t);
          var o = K(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
          So.call(o),
            (o._showCalledByButtonElement = null),
            (o._authentication = n),
            (o._controller = e),
            o._report('payreq.options', { options: r });
          var i = Xe(Dr, r || {}, 'paymentRequest()'),
            a = i.value;
          return (
            i.warnings.forEach(function(e) {
              return o._controller.warn(e);
            }),
            (o._cachedCanMakePayment = null),
            (o._canMakePaymentCalled = !1),
            (o._initialPaymentRequest = a),
            (o._isShowing = !1),
            o._initializeSessionState(),
            o
          );
        }
        return (
          V(t, e),
          wo(t, [
            {
              key: '_initializeSessionState',
              value: function() {
                (this._paymentRequestOptions = go(
                  {},
                  this._initialPaymentRequest,
                  { status: Nr.success }
                )),
                  (this._privateSession = null),
                  (this._privateShippingOption = null);
                var e = this._paymentRequestOptions.shippingOptions;
                e && e.length && (this._privateShippingOption = e[0]);
              }
            },
            {
              key: '_setupSession',
              value: function(e) {
                var t = this;
                e.addEventListener(
                  'validatemerchant',
                  Bt(this._validateMerchant(e))
                ),
                  e.addEventListener(
                    'paymentauthorized',
                    Bt(this._paymentAuthorized(e))
                  ),
                  e.addEventListener(
                    'cancel',
                    Bt(function() {
                      t._report('payreq.show_rejected'),
                        (t._isShowing = !1),
                        t._emit('cancel');
                    })
                  ),
                  e.addEventListener(
                    'shippingcontactselected',
                    Bt(this._shippingContactSelected(e))
                  ),
                  e.addEventListener(
                    'shippingmethodselected',
                    Bt(this._shippingMethodSelected(e))
                  );
              }
            }
          ]),
          t
        );
      })(Kt),
      So = function() {
        var e = this;
        (this.canMakePayment = Bt(function() {
          return null === e._cachedCanMakePayment
            ? Sr(
                window.location.hostname,
                e._authentication.stripeAccount,
                mo(e._authentication.apiKey) === _o.test,
                e._report
              ).then(function(t) {
                return (
                  (e._canMakePaymentCalled = !0),
                  (e._cachedCanMakePayment = t),
                  e._report('payreq.can_make_payment_response', {
                    available: e._cachedCanMakePayment
                  }),
                  e._cachedCanMakePayment ? { applePay: !0 } : null
                );
              })
            : Ct.resolve().then(function() {
                return (
                  (e._canMakePaymentCalled = !0),
                  e._report('payreq.can_make_payment_response', {
                    available: e._cachedCanMakePayment,
                    cached: !0
                  }),
                  e._cachedCanMakePayment ? { applePay: !0 } : null
                );
              });
        })),
          (this.update = Bt(function(t) {
            if (e._isShowing)
              throw new ye(
                'You cannot update Payment Request options while the payment sheet is showing.'
              );
            var n = Xe(Br, t, 'PaymentRequest update()'),
              r = n.value;
            n.warnings.forEach(function(t) {
              return e._controller.warn(t);
            }),
              (e._initialPaymentRequest = Oe(e._paymentRequestOptions, r)),
              e._initializeSessionState(),
              e._report('payreq.update', { updates: t });
          })),
          (this.show = Bt(function() {
            if (
              (null === e._showCalledByButtonElement &&
                (e._showCalledByButtonElement = !1),
              e._usedByButtonElement &&
                !e._showCalledByButtonElement &&
                (e._report('payreq.show_called_with_button'),
                e._controller.warn(
                  'Do not call show() yourself if you are using the paymentRequestButton Element.\nThe Element handles showing the payment sheet.'
                )),
              !e._canMakePaymentCalled)
            )
              throw new ye(
                "You must first check the Payment Request API's\navailability using paymentRequest.canMakePayment() before calling show()."
              );
            if (!e._cachedCanMakePayment)
              throw new ye('Payment Request is not available in this browser.');
            e._initializeSessionState();
            var t = new window.ApplePaySession(2, oo(e._paymentRequestOptions));
            (e._privateSession = t),
              e._setupSession(t),
              t.begin(),
              (e._isShowing = !0),
              e._report('payreq.show', {
                listeners: Object.keys(e._callbacks).sort()
              });
          })),
          (this.abort = Bt(function() {
            e._privateSession &&
              (e._privateSession.abort(), e._report('payreq.abort'));
          })),
          (this._report = function(t, n) {
            e._controller.report(
              t,
              go(
                {},
                n,
                null !== e._showCalledByButtonElement
                  ? { usesButtonElement: e._showCalledByButtonElement }
                  : {},
                { impl: 'applepay' }
              )
            );
          }),
          (this._elementShow = function() {
            (e._showCalledByButtonElement = !0), e.show();
          }),
          (this._registerElement = function() {
            e._usedByButtonElement = !0;
          }),
          (this._validateMerchant = function(t) {
            return function(n) {
              e._controller
                .action(it.CREATE_APPLE_PAY_SESSION, {
                  data: {
                    validation_url: n.validationURL,
                    domain_name: window.location.hostname,
                    display_name: e._paymentRequestOptions.total.label
                  },
                  usesButtonElement: e._showCalledByButtonElement
                })
                .then(function(n) {
                  switch (n.type) {
                    case 'object':
                      t.completeMerchantValidation(
                        JSON.parse(n.object.session)
                      );
                      break;
                    case 'error':
                      e._handleValidationError(t)(n.error);
                      break;
                    default:
                      ut(n);
                  }
                }, e._handleValidationError(t));
            };
          }),
          (this._handleValidationError = function(t) {
            return function(n) {
              var r = n.message;
              t.abort(),
                'string' == typeof r
                  ? (e._controller.warn(n.message),
                    e._report('user_error.apple_pay_session_error', {
                      error: n
                    }))
                  : e._report('fatal.payreq.unexpected_error', { error: n });
            };
          }),
          (this._paymentAuthorized = function(t) {
            return function(n) {
              var r = n.payment;
              e._report('payreq.paymentauthorized'),
                e._controller
                  .action(
                    it.TOKENIZE,
                    go({}, r, {
                      billingContact: e._normalizeContact(r.billingContact),
                      type: 'apple_pay',
                      elementName: e._showCalledByButtonElement
                        ? dt.paymentRequestButton
                        : void 0
                    })
                  )
                  .then(function(n) {
                    var o = n.token,
                      i = n.error;
                    if (i)
                      t.completePayment(window.ApplePaySession.STATUS_FAILURE),
                        e._report('fatal.payreq.on_error', { error: i });
                    else {
                      var a = e._normalizeContact(r.shippingContact),
                        s = e._normalizeContact(r.billingContact);
                      a &&
                        e._paymentRequestOptions.requestShipping &&
                        !a.countryCode &&
                        t.completePayment(
                          window.ApplePaySession
                            .STATUS_INVALID_SHIPPING_POSTAL_ADDRESS
                        );
                      var u = fo(
                        { shippingContact: a, billingContact: s },
                        e._paymentRequestOptions
                      );
                      e._onToken(t)(
                        go({}, u, {
                          shippingOption: e._privateShippingOption,
                          token: o
                        })
                      );
                    }
                  });
            };
          }),
          (this._normalizeContact = function(t) {
            if (
              t &&
              'object' === (void 0 === t ? 'undefined' : bo(t)) &&
              t.country &&
              'string' == typeof t.country
            ) {
              var n = t.country.toLowerCase().replace(/[^a-z]+/g, ''),
                r = void 0;
              return (
                t.countryCode
                  ? 'string' == typeof t.countryCode &&
                    (r = t.countryCode.toUpperCase())
                  : (r = Eo[n]) ||
                    e._report('fatal.payreq.missing_country_code', {
                      country: t.country
                    }),
                go({}, t, { countryCode: r })
              );
            }
            return 'object' === (void 0 === t ? 'undefined' : bo(t)) ? t : null;
          }),
          (this._onToken = function(t) {
            return function(n) {
              if (
                (e._hasRegisteredListener('token') &&
                  e._emit(
                    'token',
                    go({}, n, { complete: e._completePayment(t) })
                  ),
                e._hasRegisteredListener('source'))
              ) {
                var r = n.token,
                  o = H(n, ['token']),
                  i = o.payerPhone,
                  a = o.payerEmail;
                e._controller
                  .action(it.CREATE_SOURCE, {
                    elementName: e._showCalledByButtonElement
                      ? dt.paymentRequestButton
                      : void 0,
                    data: {
                      type: 'card',
                      token: r.id,
                      owner: { phone: i, email: a }
                    }
                  })
                  .then(function(n) {
                    var i = n.source,
                      a = n.error;
                    a
                      ? (e._report('fatal.payreq.source_failed', {
                          error: a,
                          token: r
                        }),
                        t.completePayment(
                          window.ApplePaySession.STATUS_FAILURE
                        ))
                      : e._emit(
                          'source',
                          go({}, o, {
                            source: i,
                            complete: e._completePayment(t)
                          })
                        );
                  });
              }
            };
          }),
          (this._completePayment = function(t) {
            return function(n) {
              var r = Xe(
                  Fr,
                  { status: n },
                  'status for PaymentRequest completion'
                ),
                o = r.value;
              r.warnings.forEach(function(t) {
                return e._controller.warn(t);
              }),
                (e._paymentRequestOptions = Oe(e._paymentRequestOptions, o));
              var i = ro(e._paymentRequestOptions),
                a = i.status;
              t.completePayment(a), (e._isShowing = !1);
            };
          }),
          (this._shippingContactSelected = function(t) {
            return function(n) {
              var r = fo(
                { shippingContact: e._normalizeContact(n.shippingContact) },
                e._paymentRequestOptions
              ).shippingAddress;
              if (e._hasRegisteredListener('shippingaddresschange')) {
                var o = {
                  shippingAddress: r,
                  updateWith: e._completeShippingContactSelection(t)
                };
                e._emit('shippingaddresschange', o);
              } else {
                yo(e._paymentRequestOptions.shippingOptions);
                var i = ro(e._paymentRequestOptions),
                  a = i.total,
                  s = i.lineItems,
                  u = i.shippingMethods;
                t.completeShippingContactSelection(
                  window.ApplePaySession.STATUS_SUCCESS,
                  u,
                  a,
                  s
                );
              }
            };
          }),
          (this._completeShippingContactSelection = function(t) {
            return function(n) {
              var r = Xe(Fr, n || {}, 'shipping address selection callback'),
                o = r.value;
              if (
                (r.warnings.forEach(function(t) {
                  return e._controller.warn(t);
                }),
                (e._paymentRequestOptions = Oe(e._paymentRequestOptions, o)),
                e._paymentRequestOptions.status === Nr.success)
              ) {
                var i = yo(e._paymentRequestOptions.shippingOptions);
                e._privateShippingOption = i[0];
              }
              var a = ro(e._paymentRequestOptions),
                s = a.status,
                u = a.shippingMethods,
                c = a.total,
                l = a.lineItems;
              t.completeShippingContactSelection(s, u, c, l);
            };
          }),
          (this._shippingMethodSelected = function(t) {
            return function(n) {
              if (
                ((e._privateShippingOption = fo(
                  { shippingMethod: n.shippingMethod },
                  e._paymentRequestOptions
                ).shippingOption),
                e._hasRegisteredListener('shippingoptionchange'))
              ) {
                var r = {
                  shippingOption: e._privateShippingOption,
                  updateWith: e._completeShippingMethodSelection(t)
                };
                e._emit('shippingoptionchange', r);
              } else {
                var o = ro(e._paymentRequestOptions),
                  i = o.total,
                  a = o.lineItems;
                t.completeShippingMethodSelection(
                  window.ApplePaySession.STATUS_SUCCESS,
                  i,
                  a
                );
              }
            };
          }),
          (this._completeShippingMethodSelection = function(t) {
            return function(n) {
              var r = Xe(Fr, n || {}, 'shipping option selection callback'),
                o = r.value;
              r.warnings.forEach(function(t) {
                return e._controller.warn(t);
              }),
                (e._paymentRequestOptions = Oe(e._paymentRequestOptions, o));
              var i = ro(e._paymentRequestOptions),
                a = i.status,
                s = i.total,
                u = i.lineItems;
              t.completeShippingMethodSelection(a, s, u);
            };
          });
      },
      ko = Oo,
      Po =
        Object.assign ||
        function(e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        },
      Ao = (function(e) {
        function t(e, n, r) {
          G(this, t);
          var o = J(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
          Co.call(o),
            (o._showCalledByButtonElement = null),
            (o._authentication = n),
            (o._controller = e),
            o._report('payreq.options', { options: r }),
            (o._cachedCanMakePayment = null),
            (o._canMakePaymentCalled = !1);
          var i = Xe(Dr, r || {}, 'paymentRequest()'),
            a = i.value;
          if (
            (i.warnings.forEach(function(e) {
              return o._controller.warn(e);
            }),
            br && 'https:' === window.location.protocol)
          ) {
            o._controller.action(it.FETCH_LOCALE, { locale: 'auto' });
            var s = o._controller.createHiddenFrame(st.PAYMENT_REQUEST, {
              authentication: n
            });
            o._setupPrFrame(s, a), (o._prFrame = s);
          } else o._prFrame = null;
          return o;
        }
        return W(t, e), t;
      })(Kt),
      Co = function() {
        var e = this;
        (this.canMakePayment = Bt(function() {
          return null === e._cachedCanMakePayment
            ? Pr(e._prFrame, mo(e._authentication.apiKey) === _o.test).then(
                function(t) {
                  return (
                    (e._canMakePaymentCalled = !0),
                    (e._cachedCanMakePayment = t),
                    e._report('payreq.can_make_payment_response', {
                      available: e._cachedCanMakePayment
                    }),
                    e._cachedCanMakePayment ? { applePay: !1 } : null
                  );
                }
              )
            : Ct.resolve().then(function() {
                return (
                  (e._canMakePaymentCalled = !0),
                  e._report('payreq.can_make_payment_response', {
                    available: e._cachedCanMakePayment,
                    cached: !0
                  }),
                  e._cachedCanMakePayment ? { applePay: !1 } : null
                );
              });
        })),
          (this.update = Bt(function(t) {
            var n = e._prFrame;
            if (n) {
              var r = Xe(Br, t, 'PaymentRequest update()'),
                o = r.value;
              r.warnings.forEach(function(t) {
                return e._controller.warn(t);
              }),
                n.send({ action: 'stripe-pr-update', payload: { data: o } });
            }
            e._report('payreq.update', { updates: t });
          })),
          (this.show = Bt(function() {
            if (
              (null === e._showCalledByButtonElement &&
                (e._showCalledByButtonElement = !1),
              e._usedByButtonElement &&
                !e._showCalledByButtonElement &&
                (e._report('payreq.show_called_with_button'),
                e._controller.warn(
                  'Do not call show() yourself if you are using the paymentRequestButton Element.\nThe Element handles showing the payment sheet.'
                )),
              !e._canMakePaymentCalled)
            )
              throw new ye(
                "You must first check the Payment Request API's\navailability using paymentRequest.canMakePayment() before calling show()."
              );
            if (!e._cachedCanMakePayment || !e._prFrame)
              throw new ye('Payment Request is not available in this browser.');
            e._prFrame.send({
              action: 'stripe-pr-show',
              payload: {
                data: { usesButtonElement: e._showCalledByButtonElement }
              }
            }),
              e._report('payreq.show', {
                listeners: Object.keys(e._callbacks).sort()
              });
          })),
          (this.abort = Bt(function() {
            e._prFrame &&
              (e._prFrame.send({ action: 'stripe-pr-abort', payload: {} }),
              e._report('payreq.abort'));
          })),
          (this._report = function(t, n) {
            e._controller.report(
              t,
              Po(
                {},
                n,
                null !== e._showCalledByButtonElement
                  ? { usesButtonElement: e._showCalledByButtonElement }
                  : {},
                { impl: 'prapi' }
              )
            );
          }),
          (this._elementShow = function() {
            (e._showCalledByButtonElement = !0), e.show();
          }),
          (this._registerElement = function() {
            e._usedByButtonElement = !0;
          }),
          (this._setupPrFrame = function(t, n) {
            t.send({ action: 'stripe-pr-initialize', payload: { data: n } }),
              t._on('pr-cancel', function() {
                e._emit('cancel');
              }),
              t._on('pr-error', function(t) {
                e._report('fatal.payreq.on_error', {
                  error:
                    "Would have emitted 'error' event, but 'error' is silenced."
                });
              }),
              t._on('pr-callback', function(r) {
                var o = r.event,
                  i = r.nonce,
                  a = r.options;
                if ('token' === o) {
                  var s = function(n) {
                    var r = Xe(
                        Fr,
                        { status: n },
                        'status for PaymentRequest completion'
                      ),
                      o = r.value;
                    r.warnings.forEach(function(t) {
                      return e._controller.warn(t);
                    }),
                      t.send({
                        action: 'stripe-pr-callback-complete',
                        payload: { data: o, nonce: i }
                      });
                  };
                  e._handleToken(t, a, s);
                } else if (
                  'shippingaddresschange' === o ||
                  'shippingoptionchange' === o
                )
                  if (e._hasRegisteredListener(o)) {
                    var u = a.shippingAddress,
                      c = a.shippingOption,
                      l =
                        'shippingaddresschange' === o
                          ? { shippingAddress: u }
                          : { shippingOption: c };
                    e._emit(
                      o,
                      Po({}, l, {
                        updateWith: function(r) {
                          var a = Xe(Fr, r || {}, o + ' callback'),
                            s = a.value;
                          a.warnings.forEach(function(t) {
                            return e._controller.warn(t);
                          }),
                            'shippingaddresschange' === o &&
                              s.status === Nr.success &&
                              yo(s.shippingOptions || n.shippingOptions),
                            t.send({
                              action: 'stripe-pr-callback-complete',
                              payload: { nonce: i, data: s }
                            });
                        }
                      })
                    );
                  } else
                    'shippingaddresschange' === o && yo(n.shippingOptions),
                      t.send({
                        action: 'stripe-pr-callback-complete',
                        payload: { nonce: i, data: { status: Nr.success } }
                      });
                else
                  e._report('error.payreq.unknown_event', {
                    event: o,
                    options: a
                  });
              });
          }),
          (this._handleToken = function(t, n, r) {
            var o = n._privateOwner,
              i = Y(n, ['_privateOwner']);
            if (
              (e._hasRegisteredListener('token') &&
                e._emit('token', Po({}, i, { complete: r })),
              e._hasRegisteredListener('source'))
            ) {
              var a = i.token,
                s = Y(i, ['token']),
                u = n.payerPhone || null,
                c = n.payerEmail || null;
              e._controller
                .action(it.CREATE_SOURCE, {
                  elementName: e._showCalledByButtonElement
                    ? dt.paymentRequestButton
                    : void 0,
                  data: {
                    type: 'card',
                    token: a.id,
                    owner: Po({ phone: u, email: c }, o || {})
                  }
                })
                .then(function(t) {
                  var n = t.source,
                    o = t.error;
                  o
                    ? (e._report('fatal.payreq.source_failed', {
                        error: o,
                        token: a
                      }),
                      r(Nr.fail))
                    : e._emit('source', Po({}, s, { source: n, complete: r }));
                });
            }
          });
      },
      To = Ao,
      jo = window.ApplePaySession
        ? (function(e) {
            function t() {
              return (
                $(this, t),
                Z(
                  this,
                  (t.__proto__ || Object.getPrototypeOf(t)).apply(
                    this,
                    arguments
                  )
                )
              );
            }
            return Q(t, e), t;
          })(ko)
        : (function(e) {
            function t() {
              return (
                $(this, t),
                Z(
                  this,
                  (t.__proto__ || Object.getPrototypeOf(t)).apply(
                    this,
                    arguments
                  )
                )
              );
            }
            return Q(t, e), t;
          })(To),
      Ro = jo,
      Io =
        Object.assign ||
        function(e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        },
      Mo = (function() {
        function e(e, t) {
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              'value' in r && (r.writable = !0),
              Object.defineProperty(e, r.key, r);
          }
        }
        return function(t, n, r) {
          return n && e(t.prototype, n), r && e(t, r), t;
        };
      })(),
      qo = {
        base: Ne(Ye),
        complete: Ne(Ye),
        empty: Ne(Ye),
        invalid: Ne(Ye),
        paymentRequestButton: Ne(Ye)
      },
      No = {
        classes: Ne(
          Qe({
            base: Ne(He),
            complete: Ne(He),
            empty: Ne(He),
            focus: Ne(He),
            invalid: Ne(He),
            webkitAutofill: Ne(He)
          })
        ),
        hidePostalCode: Ne(Ke),
        hideIcon: Ne(Ke),
        style: Ne(Qe(qo)),
        iconStyle: Ne(Fe('solid', 'default')),
        value: Ne(Le(He, Ye)),
        __privateCvcOptional: Ne(Ke),
        __privateValue: Ne(Le(He, Ye)),
        __privateEmitIbanValue: Ne(Ke),
        error: Ne(
          Qe({ type: He, code: Ne(He), decline_code: Ne(He), param: Ne(He) })
        ),
        locale: We('elements()'),
        fonts: We('elements()'),
        placeholder: Ne(He),
        placeholderCountry: Ne(He),
        paymentRequest: Ne(
          (function(e, t) {
            return function(n, r) {
              return n instanceof e ? Ie(n) : qe('a ' + t + ' instance', n, r);
            };
          })(Ro, 'stripe.paymentRequest(...)')
        )
      },
      Lo = Qe(No),
      xo = {
        base: 'StripeElement',
        focus: 'StripeElement--focus',
        invalid: 'StripeElement--invalid',
        complete: 'StripeElement--complete',
        empty: 'StripeElement--empty',
        webkitAutofill: 'StripeElement--webkit-autofill'
      },
      Fo = {
        margin: '0',
        padding: '0',
        border: 'none',
        display: 'block',
        background: 'transparent',
        position: 'relative',
        opacity: '1'
      },
      Bo = {
        border: 'none',
        display: 'block',
        position: 'absolute',
        height: '1px',
        top: '0',
        left: '0',
        padding: '0',
        margin: '0',
        width: '100%',
        opacity: '0',
        background: 'transparent',
        'pointer-events': 'none',
        'font-size': '16px'
      },
      Do = function(e) {
        return parseFloat(e.toFixed(1));
      },
      Uo = function(e) {
        return /^\d+(\.\d*)?px$/.test(e);
      },
      Ho = (function(e) {
        function t(e) {
          te(this, t);
          var n = ne(
            this,
            (t.__proto__ || Object.getPrototypeOf(t)).call(this)
          );
          zo.call(n);
          var r = e.controller,
            o = e.componentName,
            i = e.paymentRequest;
          (n._controller = r), (n._componentName = o);
          var a = 'paymentRequestButton' === n._componentName;
          if (a) {
            if (!i)
              throw new ye(
                'You must pass in a stripe.paymentRequest object in order to use this Element.'
              );
            (n._paymentRequest = i), n._paymentRequest._registerElement();
          }
          return (
            n._createComponent(e, o),
            (n._classes = Io({}, xo)),
            n._changeClasses(e.classes || {}),
            (n._lastBackgroundColor = ''),
            (n._destroyed = !1),
            (n._focused = !1),
            (n._empty = !a),
            (n._invalid = !1),
            (n._complete = !1),
            (n._autofilled = !1),
            (n._lastSubmittedAt = null),
            n
          );
        }
        return (
          re(t, e),
          Mo(t, [
            {
              key: '_checkDestroyed',
              value: function() {
                if (this._destroyed)
                  throw new ye(
                    'This Element has already been destroyed. Please create a new one.'
                  );
              }
            },
            {
              key: '_isMounted',
              value: function() {
                return (
                  !!document.body && document.body.contains(this._component)
                );
              }
            },
            {
              key: '_mountToParent',
              value: function(e) {
                var t = this._component.parentElement,
                  n = this._isMounted();
                if (e === t) {
                  if (n) return;
                  this.unmount(), this._mountTo(e);
                } else if (t) {
                  if (n)
                    throw new ye(
                      'This Element is already mounted. Use `unmount()` to unmount the Element before re-mounting.'
                    );
                  this.unmount(), this._mountTo(e);
                } else this._mountTo(e);
              }
            },
            {
              key: '_mountTo',
              value: function(e) {
                var t = Date.now(),
                  n = vr(e, null),
                  r = !!n && 'rtl' === n.getPropertyValue('direction');
                for (this._parent = e; e.firstChild; )
                  e.removeChild(e.firstChild);
                e.appendChild(this._component),
                  this._frame.send({
                    action: 'stripe-user-mount',
                    payload: { mountTime: t, rtl: r }
                  }),
                  this._findPossibleLabel(),
                  this._updateClasses();
              }
            },
            {
              key: '_updateClasses',
              value: function() {
                this._parent &&
                  It(this._parent, [
                    [this._classes.base, !0],
                    [this._classes.empty, this._empty],
                    [this._classes.focus, this._focused],
                    [this._classes.invalid, this._invalid],
                    [this._classes.complete, this._complete],
                    [this._classes.webkitAutofill, this._autofilled]
                  ]);
              }
            },
            {
              key: '_removeClasses',
              value: function() {
                this._parent &&
                  It(this._parent, [
                    [this._classes.base, !1],
                    [this._classes.empty, !1],
                    [this._classes.focus, !1],
                    [this._classes.invalid, !1],
                    [this._classes.complete, !1],
                    [this._classes.webkitAutofill, !1]
                  ]);
              }
            },
            {
              key: '_findPossibleLabel',
              value: function() {
                var e = this._parent;
                if (e) {
                  var t = e.getAttribute('id'),
                    n = void 0;
                  if (
                    (t && (n = document.querySelector('label[for=' + t + ']')),
                    n)
                  )
                    e.addEventListener('click', this.focus);
                  else
                    for (
                      n = n || e.parentElement;
                      n && 'LABEL' !== n.nodeName;

                    )
                      n = n.parentElement;
                  n
                    ? ((this._label = n),
                      n.addEventListener('click', this.focus))
                    : e.addEventListener('click', this.focus);
                }
              }
            },
            {
              key: '_changeClasses',
              value: function(e) {
                var t = {};
                return (
                  Object.keys(e).forEach(function(n) {
                    if (!xo[n])
                      throw new ye(
                        n +
                          ' is not a customizable class name.\nYou can customize: ' +
                          Object.keys(xo).join(', ')
                      );
                    var r = e[n] || xo[n];
                    t[n] = r.replace(/\./g, ' ');
                  }),
                  (this._classes = Io({}, this._classes, t)),
                  this
                );
              }
            },
            {
              key: '_emitEvent',
              value: function(e, t) {
                return this._emit(
                  e,
                  Io({ elementType: this._componentName }, t)
                );
              }
            },
            {
              key: '_setupEvents',
              value: function() {
                var e = this;
                this._frame._on('redirectfocus', function(t) {
                  var n = t.focusDirection,
                    r = fr(e._component, n);
                  r && r.focus();
                }),
                  this._frame._on('focus', function() {
                    (e._focused = !0), e._updateClasses();
                  }),
                  this._frame._on('blur', function() {
                    (e._focused = !1),
                      e._updateClasses(),
                      e._lastSubmittedAt &&
                        'paymentRequestButton' === e._componentName &&
                        (e._controller.report(
                          'payment_request_button.sheet_visible',
                          { latency: new Date() - e._lastSubmittedAt }
                        ),
                        (e._lastSubmittedAt = null));
                  }),
                  this._frame._on('submit', function() {
                    if ('paymentRequestButton' === e._componentName) {
                      e._lastSubmittedAt = new Date();
                      var t = !1,
                        n = !1;
                      e._emitEvent('click', {
                        preventDefault: function() {
                          e._controller.report(
                            'payment_request_button.default_prevented'
                          ),
                            t &&
                              e._controller.warn(
                                'event.preventDefault() was called after the payment sheet was shown. Make sure to call it synchronously when handling the `click` event.'
                              ),
                            (n = !0);
                        }
                      }),
                        !n &&
                          e._paymentRequest &&
                          (e._paymentRequest._elementShow(), (t = !0));
                    } else e._emitEvent('submit'), e._formSubmit();
                  }),
                  ['ready', 'focus', 'blur', 'escape'].forEach(function(t) {
                    e._frame._on(t, function() {
                      e._emitEvent(t);
                    });
                  }),
                  this._frame._on('change', function(t) {
                    var n = {};
                    ['error', 'value', 'empty', 'complete']
                      .concat(ee(Hn[e._componentName] || []))
                      .forEach(function(e) {
                        return (n[e] = t[e]);
                      }),
                      e._emitEvent('change', n),
                      (e._empty = n.empty),
                      (e._invalid = !!n.error),
                      (e._complete = n.complete),
                      e._updateClasses();
                  }),
                  this._frame._on('__privateIntegrationError', function(t) {
                    var n = t.message;
                    e._emitEvent('__privateIntegrationError', { message: n });
                  }),
                  this._frame._on('dimensions', function(t) {
                    if (e._parent) {
                      var n = vr(e._parent, null);
                      if (n) {
                        var r = parseFloat(n.getPropertyValue('height')),
                          o = t.height;
                        if ('border-box' === n.getPropertyValue('box-sizing')) {
                          var i = parseFloat(n.getPropertyValue('padding-top')),
                            a = parseFloat(
                              n.getPropertyValue('padding-bottom')
                            );
                          r =
                            r -
                            parseFloat(n.getPropertyValue('border-top')) -
                            parseFloat(n.getPropertyValue('border-bottom')) -
                            i -
                            a;
                        }
                        0 !== r &&
                          Do(r) < Do(o) &&
                          e._controller.report('wrapper_height_mismatch', {
                            height: o,
                            outer_height: r
                          });
                        var s = e._component.getBoundingClientRect().height;
                        0 !== s &&
                          0 !== o &&
                          Do(s) !== Do(o) &&
                          (e._frame.updateStyle({ height: o + 'px' }),
                          e._controller.report('iframe_height_update', {
                            height: o,
                            calculated_height: s
                          }));
                      }
                    }
                  }),
                  this._frame._on('autofill', function() {
                    if (e._parent) {
                      var t = e._parent.style.backgroundColor,
                        n = '#faffbd' === t || 'rgb(250, 255, 189)' === t;
                      (e._lastBackgroundColor = n ? e._lastBackgroundColor : t),
                        (e._parent.style.backgroundColor = '#faffbd'),
                        (e._autofilled = !0),
                        e._updateClasses();
                    }
                  }),
                  this._frame._on('autofill-cleared', function() {
                    (e._autofilled = !1),
                      e._parent &&
                        (e._parent.style.backgroundColor =
                          e._lastBackgroundColor),
                      e._updateClasses();
                  });
              }
            },
            {
              key: '_handleOutsideClick',
              value: function() {
                this._secondaryFrame &&
                  this._secondaryFrame.send({
                    action: 'stripe-outside-click',
                    payload: {}
                  });
              }
            },
            {
              key: '_createSecondFrame',
              value: function(e, t, n) {
                var r = this._controller.createSecondaryElementFrame(
                  e,
                  Io({}, n, { componentName: t })
                );
                return (
                  r &&
                    r.on &&
                    r.on('height-change', function(e) {
                      r.updateStyle({ height: e.height + 'px' });
                    }),
                  r
                );
              }
            },
            {
              key: '_createComponent',
              value: function(e, t) {
                this._createElement(e, t),
                  this._setupEvents(),
                  this._updateFrameHeight(e, !0);
              }
            },
            {
              key: '_updateFrameHeight',
              value: function(e) {
                var t =
                  arguments.length > 1 &&
                  void 0 !== arguments[1] &&
                  arguments[1];
                if ('paymentRequestButton' === this._componentName) {
                  var n = (e.style && e.style.paymentRequestButton) || {},
                    r = n.height,
                    o = 'string' == typeof r ? r : void 0;
                  (t || o) &&
                    (this._frame.updateStyle({
                      height: o || this._lastHeight || '40px'
                    }),
                    (this._lastHeight = o || this._lastHeight));
                } else {
                  var i = (e.style && e.style.base) || {},
                    a = i.lineHeight,
                    s = i.fontSize,
                    u = i.padding,
                    c =
                      'string' != typeof a || isNaN(parseFloat(a)) ? void 0 : a,
                    l = 'string' == typeof s ? s : void 0,
                    p = 'string' == typeof u ? u : void 0;
                  if (
                    (l &&
                      !Uo(l) &&
                      this._controller.warn(
                        'The fontSize style you specified (' +
                          l +
                          ") is not in px. We do not recommend using relative css units, as they will be calculated relative to our iframe's styles rather than your site's."
                      ),
                    t || c || l)
                  ) {
                    var f =
                        -1 === vt.indexOf(this._componentName)
                          ? void 0
                          : p || this._lastPadding,
                      d = _r(c || this._lastHeight, l || this._lastFontSize, f);
                    this._frame.updateStyle({ height: d }),
                      (this._lastFontSize = l || this._lastFontSize),
                      (this._lastHeight = c || this._lastHeight),
                      (this._lastPadding = f);
                  }
                }
              }
            },
            {
              key: '_createElement',
              value: function(e, t) {
                var n = this,
                  r = (e.classes,
                  e.controller,
                  e.paymentRequest,
                  X(e, ['classes', 'controller', 'paymentRequest'])),
                  o = document.createElement('div');
                o.className = '__PrivateStripeElement';
                var i = document.createElement('input');
                (i.className = '__PrivateStripeElement-input'),
                  i.setAttribute('aria-hidden', 'true'),
                  (i.disabled = !0);
                var a = document.createElement('input');
                (a.className = '__PrivateStripeElement-safariInput'),
                  a.setAttribute('aria-hidden', 'true'),
                  a.setAttribute('tabindex', '-1'),
                  Mt(o, Fo),
                  Mt(i, Bo),
                  Mt(a, Bo);
                var s = vr(document.body),
                  u = !!s && 'rtl' === s.getPropertyValue('direction'),
                  c = Bn[t],
                  l = Io({}, r, { rtl: u }),
                  p = this._controller.createElementFrame(c, l);
                if (
                  (p._on('load', function() {
                    i.disabled = !1;
                  }),
                  i.addEventListener('focus', function() {
                    p.focus();
                  }),
                  p.appendTo(o),
                  zn[t])
                ) {
                  var f = zn[t].secondary;
                  (this._secondaryFrame = this._createSecondFrame(c, f, l)),
                    this._secondaryFrame.appendTo(o),
                    window.addEventListener('click', function() {
                      return n._handleOutsideClick();
                    });
                }
                o.appendChild(i),
                  o.appendChild(a),
                  (this._component = o),
                  (this._frame = p),
                  (this._fakeInput = i);
              }
            }
          ]),
          t
        );
      })(Kt),
      zo = function() {
        var e = this;
        (this.mount = Bt(function(t) {
          e._checkDestroyed();
          var n = void 0;
          if (!t)
            throw new ye(
              'Missing argument. Make sure to call mount() with a valid DOM element or selector.'
            );
          if ('string' == typeof t) {
            var r = document.querySelectorAll(t);
            if (
              (r.length > 1 &&
                e._controller.warn(
                  'The selector you specified (' +
                    t +
                    ') applies to ' +
                    r.length +
                    ' DOM elements that are currently on the page.\nThe Stripe Element will be mounted to the first one.'
                ),
              !r.length)
            )
              throw new ye(
                'The selector you specified (' +
                  t +
                  ') applies to no DOM elements that are currently on the page.\nMake sure the element exists on the page before calling mount().'
              );
            n = r[0];
          } else {
            if (!t.appendChild)
              throw new ye(
                'Invalid DOM element. Make sure to call mount() with a valid DOM element or selector.'
              );
            n = t;
          }
          if ('INPUT' === n.nodeName)
            throw new ye(
              'Stripe Elements must be mounted in a DOM element that\ncan contain child nodes. `input` elements are not permitted to have child\nnodes. Try using a `div` element instead.'
            );
          if (
            (n.children.length &&
              e._controller.warn(
                'This Element will be mounted to a DOM element that contains child nodes.'
              ),
            e._paymentRequest)
          ) {
            if (!e._paymentRequest._canMakePaymentCalled)
              throw new ye(
                "For paymentRequest Elements, you must first check the Payment Request API's\navailability using paymentRequest.canMakePayment() before mounting the Element."
              );
            if (!e._paymentRequest._cachedCanMakePayment)
              throw new ye(
                'The ' +
                  e._componentName +
                  ' Element is not available in the current environment.'
              );
            e._mountToParent(n);
          } else e._mountToParent(n);
        })),
          (this.update = Bt(function(t) {
            e._checkDestroyed();
            var n = Xe(Lo, t || {}, 'element.update()'),
              r = n.value;
            if (
              (n.warnings.forEach(function(t) {
                return e._controller.warn(t);
              }),
              r)
            ) {
              var o = r.classes,
                i = X(r, ['classes']);
              e._changeClasses(o || {}),
                e._updateFrameHeight(r),
                Object.keys(i).length && e._frame.update(i);
            }
            return e;
          })),
          (this.focus = Bt(function(t) {
            return (
              e._checkDestroyed(),
              t && t.preventDefault(),
              document.activeElement &&
                document.activeElement.blur &&
                document.activeElement.blur(),
              e._fakeInput.focus(),
              e
            );
          })),
          (this.blur = Bt(function() {
            return e._checkDestroyed(), e._frame.blur(), e._fakeInput.blur(), e;
          })),
          (this.clear = Bt(function() {
            return e._checkDestroyed(), e._frame.clear(), e;
          })),
          (this.unmount = Bt(function() {
            e._checkDestroyed();
            var t = e._component.parentElement,
              n = e._label;
            return (
              t &&
                (t.removeChild(e._component),
                t.removeEventListener('click', e.focus),
                e._removeClasses()),
              (e._parent = null),
              n && (n.removeEventListener('click', e.focus), (e._label = null)),
              e._secondaryFrame &&
                (e._secondaryFrame.unmount(),
                window.removeEventListener('click', e._handleOutsideClick)),
              (e._fakeInput.disabled = !0),
              e._frame.unmount(),
              e
            );
          })),
          (this.destroy = Bt(function() {
            return (
              e._checkDestroyed(),
              e.unmount(),
              (e._destroyed = !0),
              e._emitEvent('destroy'),
              e
            );
          })),
          (this._formSubmit = function() {
            for (
              var t = e._component.parentElement;
              t && 'FORM' !== t.nodeName;

            )
              t = t.parentElement;
            if (t) {
              var n = document.createEvent('Event');
              n.initEvent('submit', !0, !0), t.dispatchEvent(n);
            }
          });
      },
      Ko = Ho,
      Vo =
        Object.assign ||
        function(e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        },
      Yo = { locale: Ne(He), fonts: Ne(Ge(Ye)) },
      Go = Qe(Yo),
      Jo = function e(t, n) {
        var r = this;
        ie(this, e), Wo.call(this);
        var o = Xe(Go, n || {}, 'elements()'),
          i = o.value;
        o.warnings.forEach(function(e) {
          return t.warn(e);
        }),
          t.report('elements', { options: n }),
          (this._elements = []),
          (this._id = gt('elements')),
          (this._controller = t);
        var a = i.locale,
          s = i.fonts || [];
        this._controller.action(it.FETCH_LOCALE, { locale: a || 'auto' });
        var u = s.filter(function(e) {
            return !e.cssSrc || 'string' != typeof e.cssSrc;
          }),
          c = s
            .map(function(e) {
              return e.cssSrc;
            })
            .reduce(function(e, t) {
              return 'string' == typeof t ? [].concat(oe(e), [t]) : e;
            }, [])
            .map(function(e) {
              return et(e) ? e : rt(window.location.href, e);
            });
        return (
          (this._pendingFonts = c.length),
          (this._commonOptions = Vo({}, i, { fonts: u })),
          c.forEach(function(e) {
            if ('string' == typeof e) {
              var t = Date.now();
              cr(e)
                .then(function(n) {
                  r._controller.report('font.loaded', {
                    load_time: Date.now() - t,
                    font_count: n.length,
                    css_src: e
                  }),
                    r._controller.action(it.UPDATE_CSS_FONTS, {
                      fonts: n.map(function(t) {
                        return Vo({}, t, { __privateCssSrc: e });
                      }),
                      groupId: r._id
                    });
                })
                .catch(function(n) {
                  r._controller.report('error.font.not_loaded', {
                    load_time: Date.now() - t,
                    message: n && n.message && n.message,
                    css_src: e
                  }),
                    r._controller.warn('Failed to load CSS file at ' + e + '.');
                });
            }
          }),
          this
        );
      },
      Wo = function() {
        var e = this;
        this.create = Dt(function(t, n) {
          lr(t, e._elements);
          var r = Xe(Lo, n || {}, 'create()'),
            o = r.value;
          r.warnings.forEach(function(t) {
            return e._controller.warn(t);
          });
          var i = !!e._pendingFonts,
            a = new Ko(
              Vo({}, o, e._commonOptions, {
                controller: e._controller,
                componentName: t,
                groupId: e._id,
                wait: i
              })
            );
          return (
            (e._elements = [].concat(oe(e._elements), [t])),
            a._on('destroy', function() {
              e._elements = e._elements.filter(function(e) {
                return e !== t;
              });
            }),
            a
          );
        });
      },
      $o = Jo,
      Zo = ze(Fe('base', 'slower'), function() {
        return 'base';
      }),
      Qo = {
        amount: He,
        purchaseDate: ze(He, function() {
          return new Date().toLocaleDateString();
        }),
        locale: ze(He, function() {
          return 'auto';
        }),
        merchantName: He,
        phoneNumber: He,
        witness: He,
        bin: He
      },
      Xo = (Ze(Qo),
      function(e, t, n, r) {
        return e
          ? (t.report('3ds.shown_twice'),
            Ct.resolve({ error: { code: 'show_called_twice' } }))
          : (t.report('3ds.show'),
            n.show(),
            n.send({ action: 'stripe-3ds-show', payload: { data: r } }),
            new Ct(function(e, t) {
              n._on('verification_result', function(t) {
                n.hide(), e(t);
              });
            }));
      }),
      ei = function(e, t) {
        e.report('3ds.mount');
        var n = e.createLightboxFrame(st.THREE_DS, { variation: t }),
          r = !1;
        return {
          show: function(t) {
            var o = Xo(r, e, n, t);
            return (r = !0), o;
          }
        };
      },
      ti = { payment_intent_beta_1: 'payment_intent_beta_1' },
      ni = Object.keys(ti),
      ri = function(e, t, n) {
        return e.indexOf(t) < 0 ? void 0 : n;
      },
      oi = function(e) {
        var t = e.name,
          n = e.value,
          r = e.expiresIn,
          o = e.path,
          i = e.domain,
          a = new Date(),
          s = r || 31536e6;
        a.setTime(a.getTime() + s);
        var u = o || '/',
          c = (n || '').replace(/[^!#-+\--:<-[\]-~]/g, encodeURIComponent),
          l =
            encodeURIComponent(t) +
            '=' +
            c +
            ';expires=' +
            a.toGMTString() +
            ';path=' +
            u;
        i && (l += ';domain=' + i), (document.cookie = l);
      },
      ii = function(e) {
        var t = ve(document.cookie.split('; '), function(t) {
          var n = t.indexOf('=');
          return decodeURIComponent(t.substr(0, n)) === e;
        });
        if (t) {
          var n = t.indexOf('=');
          return decodeURIComponent(t.substr(n + 1));
        }
        return null;
      },
      ai = (function() {
        function e(e, t) {
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              'value' in r && (r.writable = !0),
              Object.defineProperty(e, r.key, r);
          }
        }
        return function(t, n, r) {
          return n && e(t.prototype, n), r && e(t, r), t;
        };
      })(),
      si = '__privateStripeMetricsController',
      ui = { MERCHANT: 'merchant', SESSION: 'session' },
      ci = (function() {
        function e() {
          ae(this, e),
            (this._muid = this._getID(ui.MERCHANT)),
            (this._sid = this._getID(ui.SESSION)),
            (this._id = gt(si)),
            (this._controllerFrame = new nn(st.METRICS_CONTROLLER, this._id, {
              autoload: !0,
              queryString: this._buildFrameQueryString()
            })),
            this._establishMessageChannel(),
            this._startIntervalCheck(),
            setTimeout(this._testLatency.bind(this), 2e3 + 500 * Math.random());
        }
        return (
          ai(e, [
            {
              key: 'ids',
              value: function() {
                return {
                  guid: this._guid || 'NA',
                  muid: this._muid || 'NA',
                  sid: this._sid || 'NA'
                };
              }
            },
            {
              key: '_establishMessageChannel',
              value: function() {
                var e = this;
                window.addEventListener('message', function(t) {
                  try {
                    var n = JSON.parse(t.data),
                      r = n.originatingScript,
                      o = n.payload;
                    'm' === r && (e._guid = o);
                  } catch (e) {}
                });
              }
            },
            {
              key: '_startIntervalCheck',
              value: function() {
                var e = this,
                  t = window.location.href;
                setInterval(function() {
                  var n = window.location.href;
                  n !== t &&
                    (e._controllerFrame.send({
                      action: 'ping',
                      payload: {
                        sid: e._getID(ui.SESSION),
                        muid: e._getID(ui.MERCHANT),
                        title: document.title,
                        referrer: document.referrer,
                        url: document.location.href
                      }
                    }),
                    (t = n));
                }, 5e3);
              }
            },
            {
              key: 'report',
              value: function(e, t) {
                try {
                  this._controllerFrame.send({
                    action: 'track',
                    payload: {
                      sid: this._getID(ui.SESSION),
                      muid: this._getID(ui.MERCHANT),
                      url: document.location.href,
                      source: e,
                      data: t
                    }
                  });
                } catch (e) {}
              }
            },
            {
              key: '_testLatency',
              value: function() {
                var e = this,
                  t = [],
                  n = new Date(),
                  r = function r() {
                    try {
                      var o = new Date();
                      t.push(o - n),
                        t.length >= 10 &&
                          (e.report('mouse-timings-10', t),
                          document.removeEventListener('mousemove', r)),
                        (n = o);
                    } catch (e) {}
                  };
                document.addEventListener('mousemove', r);
              }
            },
            {
              key: '_extractMetaReferrerPolicy',
              value: function() {
                var e = document.querySelector('meta[name=referrer]');
                return null != e && e instanceof HTMLMetaElement
                  ? e.content.toLowerCase()
                  : null;
              }
            },
            {
              key: '_extractUrl',
              value: function(e) {
                var t = document.location.href;
                switch (e) {
                  case 'origin':
                  case 'strict-origin':
                  case 'origin-when-cross-origin':
                  case 'strict-origin-when-cross-origin':
                    return document.location.origin;
                  case 'unsafe-url':
                    return t.split('#')[0];
                  default:
                    return t;
                }
              }
            },
            {
              key: '_buildFrameQueryString',
              value: function() {
                var e = this._extractMetaReferrerPolicy(),
                  t = this._extractUrl(e),
                  n = {
                    url: t,
                    title: document.title,
                    referrer: document.referrer,
                    muid: this._muid,
                    sid: this._sid,
                    preview: On(t)
                  };
                return (
                  null != e && (n.metaReferrerPolicy = e),
                  Object.keys(n)
                    .map(function(e) {
                      return null != n[e]
                        ? e + '=' + encodeURIComponent(n[e].toString())
                        : null;
                    })
                    .join('&')
                );
              }
            },
            {
              key: '_getID',
              value: function(e) {
                switch (e) {
                  case ui.MERCHANT:
                    try {
                      var t = ii('__stripe_mid') || wt();
                      return (
                        oi({
                          name: '__stripe_mid',
                          value: t,
                          domain: '.' + document.location.hostname
                        }),
                        t
                      );
                    } catch (e) {
                      return 'NA';
                    }
                  case ui.SESSION:
                    try {
                      var n = ii('__stripe_sid') || wt();
                      return (
                        oi({
                          name: '__stripe_sid',
                          value: n,
                          domain: '.' + document.location.hostname,
                          expiresIn: 18e5
                        }),
                        n
                      );
                    } catch (e) {
                      return 'NA';
                    }
                  default:
                    throw new Error('Invalid ID type specified: ' + e);
                }
              }
            }
          ]),
          e
        );
      })(),
      li = ci,
      pi = function(e) {
        for (var t = 0, n = 0; n < e.length; n++) {
          (t = 31 * t + e.charCodeAt(n)), (t |= 0);
        }
        return t.toString();
      },
      fi = pi,
      di = { noop: { likelihood: 0.3 } },
      hi = function(e, t) {
        return e + '-' + t;
      },
      yi = function(e) {
        try {
          window.localStorage.setItem(
            '__stripe-js-v3-features__',
            JSON.stringify(e)
          );
        } catch (e) {}
      },
      _i = function() {
        var e = {};
        try {
          e =
            JSON.parse(
              window.localStorage.getItem('__stripe-js-v3-features__')
            ) || {};
        } catch (e) {}
        return e;
      },
      mi = function(e) {
        var t = _i(),
          n = {},
          r = {};
        return (
          Object.keys(di).forEach(function(o) {
            if (di[o]) {
              var i = di[o],
                a = i.likelihood,
                s = i.whitelist,
                u = hi(o, a);
              if (s && -1 === s.indexOf(fi(e))) n[o] = r[u] = !1;
              else {
                var c = t[u],
                  l = Math.random() < a;
                n[o] = r[u] = void 0 !== c ? c : l;
              }
            }
          }),
          yi(r),
          n
        );
      },
      vi = function(e, t) {
        throw ye('Not yet.');
      },
      bi = function(e, t, n, r) {
        throw ye('Not yet.');
      },
      gi =
        'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
          ? function(e) {
              return typeof e;
            }
          : function(e) {
              return e &&
                'function' == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? 'symbol'
                : typeof e;
            },
      wi =
        Object.assign ||
        function(e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        },
      Ei = (function() {
        function e(e, t) {
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              'value' in r && (r.writable = !0),
              Object.defineProperty(e, r.key, r);
          }
        }
        return function(t, n, r) {
          return n && e(t.prototype, n), r && e(t, r), t;
        };
      })(),
      Oi = Qe({
        apiKey: He,
        stripeAccount: Ne(He),
        __privateForcedFeatures: Ne(Ye),
        betas: Ne(
          Ge(
            Be.apply(
              void 0,
              (function(e) {
                if (Array.isArray(e)) {
                  for (var t = 0, n = Array(e.length); t < e.length; t++)
                    n[t] = e[t];
                  return n;
                }
                return Array.from(e);
              })(ni)
            )
          )
        )
      }),
      Si = (function() {
        function e(t, n) {
          var r = this;
          ue(this, e), ki.call(this);
          var o = Xe(Oi, t || {}, 'Stripe()'),
            i = o.value,
            a = o.warnings,
            s = i.apiKey,
            u = i.stripeAccount,
            c = i.__privateForcedFeatures,
            l = i.betas;
          if ('' === s)
            throw new ye(
              'Please call Stripe() with your publishable key. You used an empty string.'
            );
          if (0 === s.indexOf('sk_'))
            throw new ye(
              'You should not use your secret key with Stripe.js.\n        Please pass a publishable key instead.'
            );
          (this._apiKey = s), (this._keyMode = mo(s));
          var p = this._initFeatures(c || {});
          (this._betas = l || []),
            (this._stripeAccount = u || null),
            (this._controller = new Jn({
              apiKey: s,
              stripeAccount: u,
              stripeJsId: e.stripeJsId,
              features: p
            })),
            a.forEach(function(e) {
              return r._controller.warn(e);
            }),
            this._ensureHTTPS(),
            this._ensureStripeHosted(n),
            (this.retrievePaymentIntent = ri(
              this._betas,
              ti.payment_intent_beta_1,
              Bt(function(e) {
                return vi(e, r._controller);
              })
            )),
            (this.fulfillPaymentIntent = ri(
              this._betas,
              ti.payment_intent_beta_1,
              Ut(function(e, t, n) {
                return bi(e, t, n, r._controller);
              })
            ));
        }
        return (
          Ei(e, [
            {
              key: '_redirect',
              value: function(e) {
                window.location.href = e;
              }
            },
            {
              key: '_ensureHTTPS',
              value: function() {
                var e = window.location.protocol,
                  t = -1 !== ['https:', 'file:'].indexOf(e),
                  n =
                    -1 !==
                    ['localhost', '127.0.0.1', '0.0.0.0'].indexOf(
                      window.location.hostname
                    ),
                  r = this._keyMode === _o.live,
                  o =
                    'Live Stripe.js integrations must use HTTPS. For more information: https://stripe.com/docs/stripe-js/elements/quickstart#http-requirements';
                if (!t) {
                  if (r && !n)
                    throw (this._controller.report(
                      'user_error.non_https_error',
                      { protocol: e }
                    ),
                    new ye(o));
                  !r || n
                    ? window.console &&
                      console.warn(
                        'You may test your Stripe.js integration over HTTP. However, live Stripe.js integrations must use HTTPS.'
                      )
                    : window.console && console.warn(o);
                }
              }
            },
            {
              key: '_ensureStripeHosted',
              value: function(e) {
                if (!e)
                  throw (this._controller.report('user_error.self_hosted'),
                  new ye(
                    'Stripe.js must be loaded from js.stripe.com. For more information https://stripe.com/docs/stripe-js/reference#including-stripejs'
                  ));
              }
            },
            {
              key: '_initFeatures',
              value: function(e) {
                var t = mi(this._apiKey),
                  n = wi({}, t);
                return (
                  e &&
                    (Object.keys(e).forEach(function(e) {
                      di.hasOwnProperty(e) ||
                        console.error(
                          'Unrecognized feature "' +
                            e +
                            '" passed to "forcedFeatures".'
                        );
                    }),
                    Object.keys(t).forEach(function(t) {
                      void 0 !== e[t] && (n = wi({}, n, se({}, t, !!e[t])));
                    })),
                  n
                );
              }
            }
          ]),
          e
        );
      })();
    (Si.version = 3), (Si.stripeJsId = wt());
    var ki = function() {
        var e = this;
        (this.elements = Bt(function(t) {
          return new $o(e._controller, t);
        })),
          (this.createToken = Dt(function(t, n) {
            var r = 'string' == typeof t ? t : void 0,
              o = t && t._frame && t._frame.id ? t._frame.id : void 0,
              i = t && t._componentName ? t._componentName : void 0,
              a =
                n && 'object' === (void 0 === n ? 'undefined' : gi(n)) ? n : {},
              s = wi({ type: r, frameId: o, elementName: i }, a);
            return (
              Si._ec && (s.mids = Si._ec.ids()),
              e._controller.action(it.TOKENIZE, s)
            );
          })),
          (this.createSource = Dt(function(t, n) {
            var r = t && t._frame && t._frame.id ? t._frame.id : void 0,
              o = t && t._componentName ? t._componentName : void 0,
              i = r ? n : t;
            if (!r && i && 'object' !== (void 0 === i ? 'undefined' : gi(i)))
              return Ct.reject(
                new ye(
                  'Please provide Source creation parameters to createSource.'
                )
              );
            var a =
              i && 'object' === (void 0 === i ? 'undefined' : gi(i)) ? i : {};
            return (
              Si._ec && (a.mids = Si._ec.ids()),
              e._controller.action(it.CREATE_SOURCE, {
                frameId: r,
                data: a,
                elementName: o
              })
            );
          })),
          (this.retrieveSource = Bt(function(t) {
            return e._controller.action(it.RETRIEVE_SOURCE, { source: t });
          })),
          (this.paymentRequest = Bt(function(t) {
            return (
              vo(e._keyMode),
              new Ro(
                e._controller,
                { apiKey: e._apiKey, stripeAccount: e._stripeAccount },
                t
              )
            );
          })),
          (this._threeDSPilot = Bt(function(t) {
            vo(e._keyMode);
            var n = Xe(Zo, t, '3DS2 Pilot Variation'),
              r = n.value;
            return ei(e._controller, r);
          })),
          (this._authorizeSource = function(t) {
            return e._controller
              .action(it.AUTHORIZE_SOURCE, { source: t })
              .then(function(t) {
                var n = t.source,
                  r = t.authorizationStatus;
                if ('redirect' === t.nextAction) {
                  var o = n.redirect;
                  return (
                    e._redirect(o.url),
                    new Ct(function(t, n) {
                      setTimeout(function() {
                        e._controller.report('error.redirect_error', {
                          url: o.url
                        }),
                          n({
                            error: new Error('Failed to perform a redirect.')
                          });
                      }, 1e4);
                    })
                  );
                }
                return { source: n, authorizationStatus: r };
              });
          }),
          (this._getAuthorizationStatus = function(t) {
            return e._controller.action(it.GET_AUTHORIZATION_STATUS, {
              source: t
            });
          });
      },
      Pi = Si,
      Ai =
        'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
          ? function(e) {
              return typeof e;
            }
          : function(e) {
              return e &&
                'function' == typeof Symbol &&
                e.constructor === Symbol &&
                e !== Symbol.prototype
                ? 'symbol'
                : typeof e;
            },
      Ci =
        Object.assign ||
        function(e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        },
      Ti = (function() {
        if (document.currentScript) {
          var e = tt(document.currentScript.src);
          return !e || On(e.origin);
        }
        return !0;
      })(),
      ji = function(e, t) {
        return new Pi(
          Ci(
            { apiKey: e },
            t && 'object' === (void 0 === t ? 'undefined' : Ai(t)) ? t : {}
          ),
          Ti
        );
      };
    (ji.version = Pi.version),
      window.addEventListener('load', function() {
        Pi._ec = new li();
      }),
      window.Stripe && 2 === window.Stripe.version && !window.Stripe.StripeV3
        ? (window.Stripe.StripeV3 = ji)
        : window.Stripe
          ? window.console &&
            console.warn(
              'It looks like Stripe.js was loaded more than one time. Please only load it once per page.'
            )
          : (window.Stripe = ji);
    t.default = ji;
  },
  function(e, t, n) {
    'use strict';
    function r(e) {
      var t = new o(o._61);
      return (t._81 = 1), (t._65 = e), t;
    }
    var o = n(3);
    e.exports = o;
    var i = r(!0),
      a = r(!1),
      s = r(null),
      u = r(void 0),
      c = r(0),
      l = r('');
    (o.resolve = function(e) {
      if (e instanceof o) return e;
      if (null === e) return s;
      if (void 0 === e) return u;
      if (!0 === e) return i;
      if (!1 === e) return a;
      if (0 === e) return c;
      if ('' === e) return l;
      if ('object' == typeof e || 'function' == typeof e)
        try {
          var t = e.then;
          if ('function' == typeof t) return new o(t.bind(e));
        } catch (e) {
          return new o(function(t, n) {
            n(e);
          });
        }
      return r(e);
    }),
      (o.all = function(e) {
        var t = Array.prototype.slice.call(e);
        return new o(function(e, n) {
          function r(a, s) {
            if (s && ('object' == typeof s || 'function' == typeof s)) {
              if (s instanceof o && s.then === o.prototype.then) {
                for (; 3 === s._81; ) s = s._65;
                return 1 === s._81
                  ? r(a, s._65)
                  : (2 === s._81 && n(s._65),
                    void s.then(function(e) {
                      r(a, e);
                    }, n));
              }
              var u = s.then;
              if ('function' == typeof u) {
                return void new o(u.bind(s)).then(function(e) {
                  r(a, e);
                }, n);
              }
            }
            (t[a] = s), 0 == --i && e(t);
          }
          if (0 === t.length) return e([]);
          for (var i = t.length, a = 0; a < t.length; a++) r(a, t[a]);
        });
      }),
      (o.reject = function(e) {
        return new o(function(t, n) {
          n(e);
        });
      }),
      (o.race = function(e) {
        return new o(function(t, n) {
          e.forEach(function(e) {
            o.resolve(e).then(t, n);
          });
        });
      }),
      (o.prototype.catch = function(e) {
        return this.then(null, e);
      });
  },
  function(e, t, n) {
    'use strict';
    function r() {}
    function o(e) {
      try {
        return e.then;
      } catch (e) {
        return (m = e), v;
      }
    }
    function i(e, t) {
      try {
        return e(t);
      } catch (e) {
        return (m = e), v;
      }
    }
    function a(e, t, n) {
      try {
        e(t, n);
      } catch (e) {
        return (m = e), v;
      }
    }
    function s(e) {
      if ('object' != typeof this)
        throw new TypeError('Promises must be constructed via new');
      if ('function' != typeof e) throw new TypeError('not a function');
      (this._45 = 0),
        (this._81 = 0),
        (this._65 = null),
        (this._54 = null),
        e !== r && y(e, this);
    }
    function u(e, t, n) {
      return new e.constructor(function(o, i) {
        var a = new s(r);
        a.then(o, i), c(e, new h(t, n, a));
      });
    }
    function c(e, t) {
      for (; 3 === e._81; ) e = e._65;
      if ((s._10 && s._10(e), 0 === e._81))
        return 0 === e._45
          ? ((e._45 = 1), void (e._54 = t))
          : 1 === e._45
            ? ((e._45 = 2), void (e._54 = [e._54, t]))
            : void e._54.push(t);
      l(e, t);
    }
    function l(e, t) {
      _(function() {
        var n = 1 === e._81 ? t.onFulfilled : t.onRejected;
        if (null === n)
          return void (1 === e._81 ? p(t.promise, e._65) : f(t.promise, e._65));
        var r = i(n, e._65);
        r === v ? f(t.promise, m) : p(t.promise, r);
      });
    }
    function p(e, t) {
      if (t === e)
        return f(e, new TypeError('A promise cannot be resolved with itself.'));
      if (t && ('object' == typeof t || 'function' == typeof t)) {
        var n = o(t);
        if (n === v) return f(e, m);
        if (n === e.then && t instanceof s)
          return (e._81 = 3), (e._65 = t), void d(e);
        if ('function' == typeof n) return void y(n.bind(t), e);
      }
      (e._81 = 1), (e._65 = t), d(e);
    }
    function f(e, t) {
      (e._81 = 2), (e._65 = t), s._97 && s._97(e, t), d(e);
    }
    function d(e) {
      if ((1 === e._45 && (c(e, e._54), (e._54 = null)), 2 === e._45)) {
        for (var t = 0; t < e._54.length; t++) c(e, e._54[t]);
        e._54 = null;
      }
    }
    function h(e, t, n) {
      (this.onFulfilled = 'function' == typeof e ? e : null),
        (this.onRejected = 'function' == typeof t ? t : null),
        (this.promise = n);
    }
    function y(e, t) {
      var n = !1,
        r = a(
          e,
          function(e) {
            n || ((n = !0), p(t, e));
          },
          function(e) {
            n || ((n = !0), f(t, e));
          }
        );
      n || r !== v || ((n = !0), f(t, m));
    }
    var _ = n(4),
      m = null,
      v = {};
    (e.exports = s),
      (s._10 = null),
      (s._97 = null),
      (s._61 = r),
      (s.prototype.then = function(e, t) {
        if (this.constructor !== s) return u(this, e, t);
        var n = new s(r);
        return c(this, new h(e, t, n)), n;
      });
  },
  function(e, t, n) {
    'use strict';
    (function(t) {
      function n(e) {
        a.length || (i(), (s = !0)), (a[a.length] = e);
      }
      function r() {
        for (; u < a.length; ) {
          var e = u;
          if (((u += 1), a[e].call(), u > c)) {
            for (var t = 0, n = a.length - u; t < n; t++) a[t] = a[t + u];
            (a.length -= u), (u = 0);
          }
        }
        (a.length = 0), (u = 0), (s = !1);
      }
      function o(e) {
        return function() {
          function t() {
            clearTimeout(n), clearInterval(r), e();
          }
          var n = setTimeout(t, 0),
            r = setInterval(t, 50);
        };
      }
      e.exports = n;
      var i,
        a = [],
        s = !1,
        u = 0,
        c = 1024,
        l = void 0 !== t ? t : self,
        p = l.MutationObserver || l.WebKitMutationObserver;
      (i =
        'function' == typeof p
          ? (function(e) {
              var t = 1,
                n = new p(e),
                r = document.createTextNode('');
              return (
                n.observe(r, { characterData: !0 }),
                function() {
                  (t = -t), (r.data = t);
                }
              );
            })(r)
          : o(r)),
        (n.requestFlush = i),
        (n.makeRequestCallFromTimer = o);
    }.call(t, n(5)));
  },
  function(e, t) {
    var n;
    n = (function() {
      return this;
    })();
    try {
      n = n || Function('return this')() || (0, eval)('this');
    } catch (e) {
      'object' == typeof window && (n = window);
    }
    e.exports = n;
  },
  function(e, t, n) {
    var r, o;
    !(function() {
      'use strict';
      var n = (function() {
        function e() {}
        function t(e, t) {
          for (var n = t.length, r = 0; r < n; ++r) i(e, t[r]);
        }
        function n(e, t) {
          e[t] = !0;
        }
        function r(e, t) {
          for (var n in t) s.call(t, n) && (e[n] = !!t[n]);
        }
        function o(e, t) {
          for (var n = t.split(u), r = n.length, o = 0; o < r; ++o)
            e[n[o]] = !0;
        }
        function i(e, i) {
          if (i) {
            var a = typeof i;
            'string' === a
              ? o(e, i)
              : Array.isArray(i)
                ? t(e, i)
                : 'object' === a ? r(e, i) : 'number' === a && n(e, i);
          }
        }
        function a() {
          for (var n = arguments.length, r = Array(n), o = 0; o < n; o++)
            r[o] = arguments[o];
          var i = new e();
          t(i, r);
          var a = [];
          for (var s in i) i[s] && a.push(s);
          return a.join(' ');
        }
        e.prototype = Object.create(null);
        var s = {}.hasOwnProperty,
          u = /\s+/;
        return a;
      })();
      void 0 !== e && e.exports
        ? (e.exports = n)
        : ((r = []),
          void 0 !==
            (o = function() {
              return n;
            }.apply(t, r)) && (e.exports = o));
    })();
  },
  function(e, t) {}
]);
