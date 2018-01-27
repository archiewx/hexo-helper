(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(typeof self !== 'undefined' ? self : this, function() {
return webpackJsonp([1],{

/***/ 14:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _react = __webpack_require__(4);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(18);

var _reactDom2 = _interopRequireDefault(_reactDom);

__webpack_require__(27);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_reactDom2.default.render(_react2.default.createElement(
  'div',
  null,
  _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'p',
      null,
      'Hello World'
    ),
    _react2.default.createElement('img', { src: './assets/xpic6813.jpg' })
  )
), document.querySelector('#root')); // This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

/***/ }),

/***/ 27:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[14]);
});