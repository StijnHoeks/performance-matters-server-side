var shaven =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /* eslint-disable no-console */

	exports.default = shaven;

	var _parseSugarString = __webpack_require__(1);

	var _parseSugarString2 = _interopRequireDefault(_parseSugarString);

	var _defaults = __webpack_require__(2);

	var _defaults2 = _interopRequireDefault(_defaults);

	var _namespaceToURL = __webpack_require__(3);

	var _namespaceToURL2 = _interopRequireDefault(_namespaceToURL);

	var _mapAttributeValue = __webpack_require__(4);

	var _mapAttributeValue2 = _interopRequireDefault(_mapAttributeValue);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function shaven(arrayOrObject) {

	  if (!arrayOrObject || (typeof arrayOrObject === 'undefined' ? 'undefined' : _typeof(arrayOrObject)) !== 'object') {
	    throw new Error('Argument must be either an array or an object ' + 'and not ' + arrayOrObject);
	  }

	  var config = {};
	  var elementArray = void 0;

	  if (Array.isArray(arrayOrObject)) {
	    elementArray = arrayOrObject;
	  } else {
	    elementArray = arrayOrObject.elementArray;
	    delete arrayOrObject.elementArray;
	    Object.assign(config, arrayOrObject);
	  }

	  config = Object.assign({}, _defaults2.default, config, {
	    returnObject: { // Shaven object to return at last
	      ids: {},
	      references: {}
	    }
	  });

	  config.nsStack = [config.namespace]; // Stack with current namespaces

	  function createElement(sugarString) {
	    var properties = (0, _parseSugarString2.default)(sugarString);
	    var currentNs = config.nsStack[config.nsStack.length - 1];

	    if (properties.tag === 'svg') {
	      config.nsStack.push('svg');
	    } else if (properties.tag === 'math') {
	      config.nsStack.push('mathml');
	    } else if (properties.tag === 'html') {
	      config.nsStack.push('xhtml');
	    } else {
	      // Keep current namespace
	      config.nsStack.push(currentNs);
	    }

	    var namespace = config.nsStack[config.nsStack.length - 1];
	    var element = document.createElementNS(_namespaceToURL2.default[namespace] ? _namespaceToURL2.default[namespace] : namespace, properties.tag);

	    if (properties.id) {
	      element.id = properties.id;
	      console.assert(!config.returnObject.ids.hasOwnProperty(properties.id), 'Ids must be unique and "' + properties.id + '" is already assigned');
	      config.returnObject.ids[properties.id] = element;
	    }
	    if (properties.class) {
	      var _element$classList;

	      (_element$classList = element.classList).add.apply(_element$classList, _toConsumableArray(properties.class.split(' ')));
	    }
	    if (properties.reference) {
	      console.assert(!config.returnObject.ids.hasOwnProperty(properties.reference), 'References must be unique and "' + properties.id + '" is already assigned');
	      config.returnObject.references[properties.reference] = element;
	    }

	    if (properties.escapeHTML != null) {
	      config.escapeHTML = properties.escapeHTML;
	    }

	    return element;
	  }

	  function buildDom(array) {

	    var index = 1;
	    var createdCallback = void 0;

	    if (typeof array[0] === 'string') {
	      array[0] = createElement(array[0]);
	    } else if (Array.isArray(array[0])) {
	      index = 0;
	    } else if (!(array[0] instanceof Element)) {
	      throw new Error('First element of array must be either a string, ' + 'an array or a DOM element and not ' + JSON.stringify(array[0]));
	    }

	    // For each in the element array (except the first)
	    for (; index < array.length; index++) {

	      // Don't render element if value is false or null
	      if (array[index] === false || array[index] === null) {
	        array[0] = false;
	        break;
	      }

	      // Continue with next array value if current is undefined or true
	      else if (array[index] === undefined || array[index] === true) {
	          continue;
	        }

	        // If is string has to be content so set it
	        else if (typeof array[index] === 'string' || typeof array[index] === 'number') {
	            if (config.escapeHTML) {
	              array[0].appendChild(document.createTextNode(array[index]));
	            } else {
	              array[0].innerHTML = array[index];
	            }
	          }

	          // If is array has to be child element
	          else if (Array.isArray(array[index])) {
	              // If is actually a sub-array, flatten it
	              if (Array.isArray(array[index][0])) {
	                array[index].reverse().forEach(function (subArray) {
	                  // eslint-disable-line no-loop-func
	                  array.splice(index + 1, 0, subArray);
	                });

	                if (index !== 0) continue;
	                index++;
	              }

	              // Build dom recursively for all child elements
	              buildDom(array[index]);

	              // Append the element to its parent element
	              if (array[index][0]) {
	                array[0].appendChild(array[index][0]);
	              }
	            } else if (typeof array[index] === 'function') {
	              createdCallback = array[index];
	            }

	            // If it is an element append it
	            else if (array[index] instanceof Element) {
	                array[0].appendChild(array[index]);
	              }

	              // Else must be an object with attributes
	              else if (_typeof(array[index]) === 'object') {
	                  // For each attribute
	                  for (var attributeKey in array[index]) {
	                    if (!array[index].hasOwnProperty(attributeKey)) continue;

	                    var attributeValue = array[index][attributeKey];

	                    if (array[index].hasOwnProperty(attributeKey) && attributeValue !== null && attributeValue !== false) {
	                      array[0].setAttribute(attributeKey, (0, _mapAttributeValue2.default)(attributeKey, attributeValue, config));
	                    }
	                  }
	                } else {
	                  throw new TypeError('"' + array[index] + '" is not allowed as a value');
	                }
	    }

	    config.nsStack.pop();

	    // Return root element on index 0
	    config.returnObject[0] = array[0];
	    config.returnObject.rootElement = array[0];

	    config.returnObject.toString = function () {
	      return array[0].outerHTML;
	    };

	    if (createdCallback) createdCallback(array[0]);
	  }

	  buildDom(elementArray);

	  return config.returnObject;
	}

	shaven.setDefaults = function (object) {
	  Object.assign(_defaults2.default, object);
	  return shaven;
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (sugarString) {
	  var tags = sugarString.match(/^[\w-]+/);
	  var properties = {
	    tag: tags ? tags[0] : 'div'
	  };
	  var ids = sugarString.match(/#([\w-]+)/);
	  var classes = sugarString.match(/\.[\w-]+/g);
	  var references = sugarString.match(/\$([\w-]+)/);

	  if (ids) properties.id = ids[1];

	  if (classes) {
	    properties.class = classes.join(' ').replace(/\./g, '');
	  }

	  if (references) properties.reference = references[1];

	  if (sugarString.endsWith('&') || sugarString.endsWith('!')) {
	    properties.escapeHTML = false;
	  }

	  return properties;
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  namespace: 'xhtml',
	  autoNamespacing: true,
	  escapeHTML: true,
	  quotationMark: '"',
	  quoteAttributes: true,
	  convertTransformArray: true
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  mathml: 'http://www.w3.org/1998/Math/MathML',
	  svg: 'http://www.w3.org/2000/svg',
	  xhtml: 'http://www.w3.org/1999/xhtml'
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _buildTransformString = __webpack_require__(5);

	var _buildTransformString2 = _interopRequireDefault(_buildTransformString);

	var _stringifyStyleObject = __webpack_require__(6);

	var _stringifyStyleObject2 = _interopRequireDefault(_stringifyStyleObject);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (key, value) {
	  if (value === undefined) {
	    return '';
	  }

	  if (key === 'style' && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
	    return (0, _stringifyStyleObject2.default)(value);
	  }

	  if (key === 'transform' && Array.isArray(value)) {
	    return (0, _buildTransformString2.default)(value);
	  }

	  return value;
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// Create transform string from list transform objects

	exports.default = function (transformObjects) {

	  return transformObjects.map(function (transformation) {
	    var values = [];

	    if (transformation.type === 'rotate' && transformation.degrees) {
	      values.push(transformation.degrees);
	    }
	    if (transformation.x) values.push(transformation.x);
	    if (transformation.y) values.push(transformation.y);

	    return transformation.type + '(' + values + ')';
	  }).join(' ');
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	function sanitizeProperties(key, value) {
	  if (value === null || value === false || value === undefined) return;
	  if (typeof value === 'string' || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') return value;

	  return String(value);
	}

	exports.default = function (styleObject) {
	  return JSON.stringify(styleObject, sanitizeProperties).slice(2, -2).replace(/","/g, ';').replace(/":"/g, ':').replace(/\\"/g, '\'');
	};

/***/ }
/******/ ]);