define(function(require, exports, modules) {
	"require:nomunge,exports:nomunge,modules:nomunge";
	require('ui-core');
	require('ui-widget');
	require('ui-mouse');
	require('ui-position');
	require('ui-resizable');
	require('ui-draggable');
	require('ui-droppable');
	require('ui-sortable');
	require('ui-dialog');
	require('ui-messagebox');
	require('ui-calendar');
	require('ui-checkbox');
	require('ui-combo');
	require('ui-textpopup');
	require('ui-radio');
	require('ui-search');
	require('ui-flip');
	require('ui-textarea');
	require('ui-textfield');
	require('ui-panel');
	require('ui-menu');
	require('ui-tabs');
	require('ui-breadcrumb');
	require('ui-validate');
	require('ui-form');
	require('ui-progressbar');
	require('ui-tree');
	require('ui-grid');
	require('ui-popup');
	require('ui-tips');
	require('ui-pageflow');
	require('ui-tpl');
	require('ui-slider');
	require("ui-offCanvas");
	require("ui-irguide");
	require("ui-guide");
	require("ui-menutree");
	require("ui-advcombo");
    require("ui-toggle");
    require("ui-include");
    require("ui-currency");
});
/**
 * 块列表模块
 * @module ui-core
 */
define('ui-core',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";

	/**
	 * appEngin名称空间
	 * @namespace $.ae
	 */
	$.ae = $.ae || {};

	if ($.ae.version) {
		return;
	}
	/**
	 * 版本号
	 * @name version
	 * @type string
	 * @readonly
	 * @memberof $.ae
	 */
	/**
	 * 键盘键值常量
	 * @name keyCode
	 * @readonly
	 * @memberof $.ae
	 * @property {object} keyCode
	 * @property {number} keyCode.BACKSPACE    - 退格键键值常量
	 * @property {number} keyCode.COMMA        - command键键值常量
	 * @property {number} keyCode.DELETE       - 删除键键值常量
	 * @property {number} keyCode.DOWN         - 下键键值常量
	 * @property {number} keyCode.END          - end键键值常量
	 * @property {number} keyCode.ENTER        - 回车键键值常量
	 * @property {number} keyCode.ESCAPE       - esc键键值常量
	 * @property {number} keyCode.HOME         - home键键值常量
	 * @property {number} keyCode.LEFT         - 左键键值常量
	 * @property {number} keyCode.PAGE_DOWN    - 下翻页键键值常量
	 * @property {number} keyCode.PAGE_UP      - 上翻页键键值常量
	 * @property {number} keyCode.PERIOD       - 句号键键值常量
	 * @property {number} keyCode.RIGHT        - 右键键值常量
	 * @property {number} keyCode.SPACE        - 空格键键值常量
	 * @property {number} keyCode.TAB          - tab键键值常量
	 * @property {number} keyCode.UP           - 上键键值常量
	 * @example
	 * console.log("page down key code is: "+$.ae.keyCode.PAGE_DOWN);
	 */
	/**
	 * 国际化语言
	 * @name lang
	 * @readonly
	 * @memberof $.ae
	 * @property {object} lang
	 */
	$.extend( $.ae, {
		version: "1.11.4",

		keyCode: {
			BACKSPACE: 8,
			COMMA: 188,
			DELETE: 46,
			DOWN: 40,
			END: 35,
			ENTER: 13,
			ESCAPE: 27,
			HOME: 36,
			LEFT: 37,
			PAGE_DOWN: 34,
			PAGE_UP: 33,
			PERIOD: 190,
			RIGHT: 39,
			SPACE: 32,
			TAB: 9,
			UP: 38
		},
		lang : {}
	});

	// plugins
	$.fn.extend({
		scrollParent: function( includeHidden ) {
			var position = this.css( "position" ),
				excludeStaticParent = position === "absolute",
				overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
				scrollParent = this.parents().filter( function() {
					var parent = $( this );
					if ( excludeStaticParent && parent.css( "position" ) === "static" ) {
						return false;
					}
					return overflowRegex.test( parent.css( "overflow" ) + parent.css( "overflow-y" ) + parent.css( "overflow-x" ) );
				}).eq( 0 );

			return position === "fixed" || !scrollParent.length ? $( this[ 0 ].ownerDocument || document ) : scrollParent;
		},

		uniqueId: (function() {
			var uuid = 0;

			return function() {
				return this.each(function() {
					if ( !this.id ) {
						this.id = "ui-id-" + ( ++uuid );
					}
				});
			};
		})(),

		removeUniqueId: function() {
			return this.each(function() {
				if ( /^ui-id-\d+$/.test( this.id ) ) {
					$( this ).removeAttr( "id" );
				}
			});
		}
	});

	// selectors
	function focusable( element, isTabIndexNotNaN ) {
		var map, mapName, img,
			nodeName = element.nodeName.toLowerCase();
		if ( "area" === nodeName ) {
			map = element.parentNode;
			mapName = map.name;
			if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
				return false;
			}
			img = $( "img[usemap='#" + mapName + "']" )[ 0 ];
			return !!img && visible( img );
		}
		return ( /^(input|select|textarea|button|object)$/.test( nodeName ) ?
			!element.disabled :
			"a" === nodeName ?
				element.href || isTabIndexNotNaN :
				isTabIndexNotNaN) &&
			// the element and all of its ancestors must be visible
			visible( element );
	}

	function visible( element ) {
		return $.expr.filters.visible( element ) &&
			!$( element ).parents().addBack().filter(function() {
				return $.css( this, "visibility" ) === "hidden";
			}).length;
	}

	$.extend( $.expr[ ":" ], {
		data: $.expr.createPseudo ?
			$.expr.createPseudo(function( dataName ) {
				return function( elem ) {
					return !!$.data( elem, dataName );
				};
			}) :
			// support: jQuery <1.8
			function( elem, i, match ) {
				return !!$.data( elem, match[ 3 ] );
			},

		focusable: function( element ) {
			return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
		},

		tabbable: function( element ) {
			var tabIndex = $.attr( element, "tabindex" ),
				isTabIndexNaN = isNaN( tabIndex );
			return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
		}
	});

	// support: jQuery <1.8
	if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
		$.each( [ "Width", "Height" ], function( i, name ) {
			var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
				type = name.toLowerCase(),
				orig = {
					innerWidth: $.fn.innerWidth,
					innerHeight: $.fn.innerHeight,
					outerWidth: $.fn.outerWidth,
					outerHeight: $.fn.outerHeight
				};

			function reduce( elem, size, border, margin ) {
				$.each( side, function() {
					size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
					if ( border ) {
						size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
					}
					if ( margin ) {
						size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
					}
				});
				return size;
			}

			$.fn[ "inner" + name ] = function( size ) {
				if ( size === undefined ) {
					return orig[ "inner" + name ].call( this );
				}

				return this.each(function() {
					$( this ).css( type, reduce( this, size ) + "px" );
				});
			};

			$.fn[ "outer" + name] = function( size, margin ) {
				if ( typeof size !== "number" ) {
					return orig[ "outer" + name ].call( this, size );
				}

				return this.each(function() {
					$( this).css( type, reduce( this, size, true, margin ) + "px" );
				});
			};
		});
	}

	// support: jQuery <1.8
	if ( !$.fn.addBack ) {
		$.fn.addBack = function( selector ) {
			return this.add( selector == null ?
				this.prevObject : this.prevObject.filter( selector )
			);
		};
	}

	// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
	if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
		$.fn.removeData = (function( removeData ) {
			return function( key ) {
				if ( arguments.length ) {
					return removeData.call( this, $.camelCase( key ) );
				} else {
					return removeData.call( this );
				}
			};
		})( $.fn.removeData );
	}

	// deprecated
	$.ae.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

	$.fn.extend({
		focus: (function( orig ) {
			return function( delay, fn ) {
				return typeof delay === "number" ?
					this.each(function() {
						var elem = this;
						setTimeout(function() {
							$( elem ).focus();
							if ( fn ) {
								fn.call( elem );
							}
						}, delay );
					}) :
					orig.apply( this, arguments );
			};
		})( $.fn.focus ),

		disableSelection: (function() {
			var eventType = "onselectstart" in document.createElement( "div" ) ?
				"selectstart" :
				"mousedown";

			return function() {
				return this.bind( eventType + ".ui-disableSelection", function( event ) {
					event.preventDefault();
				});
			};
		})(),

		enableSelection: function() {
			return this.unbind( ".ui-disableSelection" );
		},

		zIndex: function( zIndex ) {
			if ( zIndex !== undefined ) {
				return this.css( "zIndex", zIndex );
			}

			if ( this.length ) {
				var elem = $( this[ 0 ] ), position, value;
				while ( elem.length && elem[ 0 ] !== document ) {
					// Ignore z-index if position is set to a value where z-index is ignored by the browser
					// This makes behavior of this function consistent across browsers
					// WebKit always returns auto if the element is positioned
					position = elem.css( "position" );
					if ( position === "absolute" || position === "relative" || position === "fixed" ) {
						// IE returns 0 when zIndex is not specified
						// other browsers return a string
						// we ignore the case of nested elements with an explicit value of 0
						// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
						value = parseInt( elem.css( "zIndex" ), 10 );
						if ( !isNaN( value ) && value !== 0 ) {
							return value;
						}
					}
					elem = elem.parent();
				}
			}

			return 0;
		}
	});

	// $.ae.plugin is deprecated. Use $.widget() extensions instead.
	$.ae.plugin = {
		add: function( module, option, set ) {
			var i,
				proto = $.ae[ module ].prototype;
			for ( i in set ) {
				proto.plugins[ i ] = proto.plugins[ i ] || [];
				proto.plugins[ i ].push( [ option, set[ i ] ] );
			}
		},
		call: function( instance, name, args, allowDisconnected ) {
			var i,
				set = instance.plugins[ name ];

			if ( !set ) {
				return;
			}

			if ( !allowDisconnected && ( !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) ) {
				return;
			}

			for ( i = 0; i < set.length; i++ ) {
				if ( instance.options[ set[ i ][ 0 ] ] ) {
					set[ i ][ 1 ].apply( instance.element, args );
				}
			}
		}
	};

});

/**
 * 小部件模块
 * @module ui-widget
 */
define('ui-widget',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";

	var widget_uuid = 0,
		widget_slice = Array.prototype.slice;

	$.cleanData = (function( orig ) {
		return function( elems ) {
			var events, elem, i;
			for ( i = 0; (elem = elems[i]) != null; i++ ) {
				try {

					// Only trigger remove when necessary to save time
					events = $._data( elem, "events" );
					if ( events && events.remove ) {
						$( elem ).triggerHandler( "remove" );
					}

				// http://bugs.jquery.com/ticket/8235
				} catch ( e ) {}
			}
			orig( elems );
		};
	})( $.cleanData );

	$.aeWidget = function( name, base, prototype ) {
		var fullName, existingConstructor, constructor, basePrototype,
			// proxiedPrototype allows the provided prototype to remain unmodified
			// so that it can be used as a mixin for multiple widgets (#8876)
			proxiedPrototype = {},
			namespace = name.split( "." )[ 0 ];

		name = name.split( "." )[ 1 ];
		fullName = namespace + "-" + name;

		if ( !prototype ) {
			prototype = base;
			base = $.AEWidget;
		}

		// create selector for plugin
		$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
			return !!$.data( elem, fullName );
		};

		$[ namespace ] = $[ namespace ] || {};
		existingConstructor = $[ namespace ][ name ];
		constructor = $[ namespace ][ name ] = function( options, element ) {
			// allow instantiation without "new" keyword
			if ( !this._createWidget ) {
				return new constructor( options, element );
			}

			// allow instantiation without initializing for simple inheritance
			// must use "new" keyword (the code above always passes args)
			if ( arguments.length ) {
				this._createWidget( options, element );
			}
		};
		// extend with the existing constructor to carry over any static properties
		$.extend( constructor, existingConstructor, {
			version: prototype.version,
			// copy the object used to create the prototype in case we need to
			// redefine the widget later
			_proto: $.extend( {}, prototype ),
			// track widgets that inherit from this widget in case this widget is
			// redefined after a widget inherits from it
			_childConstructors: []
		});

		basePrototype = new base();
		// we need to make the options hash a property directly on the new instance
		// otherwise we'll modify the options hash on the prototype that we're
		// inheriting from
		basePrototype.options = $.aeWidget.extend( {}, basePrototype.options );
		$.each( prototype, function( prop, value ) {
			if ( !$.isFunction( value ) ) {
				proxiedPrototype[ prop ] = value;
				return;
			}
			proxiedPrototype[ prop ] = (function() {
				var _super = function() {
						return base.prototype[ prop ].apply( this, arguments );
					},
					_superApply = function( args ) {
						return base.prototype[ prop ].apply( this, args );
					};
				return function() {
					var __super = this._super,
						__superApply = this._superApply,
						returnValue;

					this._super = _super;
					this._superApply = _superApply;

					returnValue = value.apply( this, arguments );

					this._super = __super;
					this._superApply = __superApply;

					return returnValue;
				};
			})();
		});
		constructor.prototype = $.aeWidget.extend( basePrototype, {
			// TODO: remove support for widgetEventPrefix
			// always use the name + a colon as the prefix, e.g., draggable:start
			// don't prefix for widgets that aren't DOM-based
			widgetEventPrefix: existingConstructor ? (basePrototype.widgetEventPrefix || name) : name
		}, proxiedPrototype, {
			constructor: constructor,
			namespace: namespace,
			widgetName: name,
			widgetFullName: fullName
		});

		// If this widget is being redefined then we need to find all widgets that
		// are inheriting from it and redefine all of them so that they inherit from
		// the new version of this widget. We're essentially trying to replace one
		// level in the prototype chain.
		if ( existingConstructor ) {
			$.each( existingConstructor._childConstructors, function( i, child ) {
				var childPrototype = child.prototype;

				// redefine the child widget using the same prototype that was
				// originally used, but inherit from the new version of the base
				$.aeWidget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
			});
			// remove the list of existing child constructors from the old constructor
			// so the old child constructors can be garbage collected
			delete existingConstructor._childConstructors;
		} else {
			base._childConstructors.push( constructor );
		}

		$.aeWidget.bridge( name, constructor );

		return constructor;
	};

	$.aeWidget.extend = function( target ) {
		var input = widget_slice.call( arguments, 1 ),
			inputIndex = 0,
			inputLength = input.length,
			key,
			value;
		for ( ; inputIndex < inputLength; inputIndex++ ) {
			for ( key in input[ inputIndex ] ) {
				value = input[ inputIndex ][ key ];
				if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
					// Clone objects
					if ( $.isPlainObject( value ) ) {
						target[ key ] = $.isPlainObject( target[ key ] ) ?
							$.aeWidget.extend( {}, target[ key ], value ) :
							// Don't extend strings, arrays, etc. with objects
							$.aeWidget.extend( {}, value );
					// Copy everything else by reference
					} else {
						target[ key ] = value;
					}
				}
			}
		}
		return target;
	};

	$.aeWidget.bridge = function( name, object ) {
		var fullName = object.prototype.widgetFullName || name;
		$.fn[ name ] = function( options ) {
			var isMethodCall = typeof options === "string",
				args = widget_slice.call( arguments, 1 ),
				returnValue = this;

			if ( isMethodCall ) {
				this.each(function() {
					var methodValue,
						instance = $.data( this, fullName );
					if ( options === "instance" ) {
						returnValue = instance;
						return false;
					}
					if ( !instance ) {
						if($(this).attr("aeType") === name){
							$.data( this, fullName, new object( options, this ) );
							var instance = $.data( this, fullName );
							if(instance){
								instance.options._initial=true;
							}
				 		}else{
				 			alert( "cannot call methods on " + name + " prior to initialization; " +
									"attempted to call method '" + options + "'" );
				 		}
	//					return $.error( "cannot call methods on " + name + " prior to initialization; " +
	//						"attempted to call method '" + options + "'" );
					}
					if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
						return $.error( "no such method '" + options + "' for " + name + " widget instance" );
					}
					methodValue = instance[ options ].apply( instance, args );
					if ( methodValue !== instance && methodValue !== undefined ) {
						returnValue = methodValue && methodValue.jquery ?
							returnValue.pushStack( methodValue.get() ) :
							methodValue;
						return false;
					}
				});
			} else {

				// Allow multiple hashes to be passed on init
				if ( args.length ) {
					options = $.aeWidget.extend.apply( null, [ options ].concat(args) );
				}

				this.each(function() {
					var instance = $.data( this, fullName );
					if ( instance ) {
						instance.option( options || {} );
						if ( instance._init && fullName === 'ae-aeDialog') {
							instance._init();
						}
					} else {
						$.data( this, fullName, new object( options, this ) );
					}
				});
			}

			return returnValue;
		};
	};

	$.AEWidget = function( /* options, element */ ) {};
	$.AEWidget._childConstructors = [];

	$.AEWidget.prototype = {
		widgetName: "widget",
		widgetEventPrefix: "",
		defaultElement: "<div>",
		options: {
			disabled: false,

			// callbacks
			create: null
		},
		_createWidget: function( options, element ) {
			element = $( element || this.defaultElement || this )[ 0 ];
			this.element = $( element );
			this.uuid = widget_uuid++;
			this.eventNamespace = "." + this.widgetName + this.uuid;

			this.bindings = $();
			this.hoverable = $();
			this.focusable = $();

			if ( element !== this ) {
				$.data( element, this.widgetFullName, this );
				this._on( true, this.element, {
					remove: function( event ) {
						if ( event.target === element ) {
							this.destroy();
						}
					}
				});
				this.document = $( element.style ?
					// element within the document
					element.ownerDocument :
					// element is window or document
					element.document || element );
				this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
			}

			this.options = $.aeWidget.extend( {},
				this.options,
				this._getCreateOptions(),
				options );

			this._create();
			this._trigger( "create", null, this._getCreateEventData() );
			this._init();
		},
		_getCreateOptions: $.noop,
		_getCreateEventData: $.noop,
		_create: $.noop,
		_init: $.noop,

		destroy: function() {
			this._destroy();
			// we can probably remove the unbind calls in 2.0
			// all event bindings should go through this._on()
			this.element
				.unbind( this.eventNamespace )
				.removeData( this.widgetFullName )
				// support: jquery <1.6.3
				// http://bugs.jquery.com/ticket/9413
				.removeData( $.camelCase( this.widgetFullName ) );
			this.widget()
				.unbind( this.eventNamespace )
				.removeAttr( "aria-disabled" )
				.removeClass(
					this.widgetFullName + "-disabled " +
					"ui-state-disabled" );

			// clean up events and states
			this.bindings.unbind( this.eventNamespace );
			this.hoverable.removeClass( "ui-state-hover" );
			this.focusable.removeClass( "ui-state-focus" );
		},
		_destroy: $.noop,

		widget: function() {
			return this.element;
		},

		option: function( key, value ) {
			var options = key,
				parts,
				curOption,
				i;

			if ( arguments.length === 0 ) {
				// don't return a reference to the internal hash
				return $.aeWidget.extend( {}, this.options );
			}

			if ( typeof key === "string" ) {
				// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
				options = {};
				parts = key.split( "." );
				key = parts.shift();
				if ( parts.length ) {
					curOption = options[ key ] = $.aeWidget.extend( {}, this.options[ key ] );
					for ( i = 0; i < parts.length - 1; i++ ) {
						curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
						curOption = curOption[ parts[ i ] ];
					}
					key = parts.pop();
					if ( arguments.length === 1 ) {
						return curOption[ key ] === undefined ? null : curOption[ key ];
					}
					curOption[ key ] = value;
				} else {
					if ( arguments.length === 1 ) {
						return this.options[ key ] === undefined ? null : this.options[ key ];
					}
					options[ key ] = value;
				}
			}

			this._setOptions( options );

			return this;
		},
		_setOptions: function( options ) {
			var key;

			for ( key in options ) {
				this._setOption( key, options[ key ] );
			}

			return this;
		},
		_setOption: function( key, value ) {
			this.options[ key ] = value;

			if ( key === "disabled" ) {
				this.widget()
					.toggleClass( this.widgetFullName + "-disabled", !!value );

				// If the widget is becoming disabled, then nothing is interactive
				if ( value ) {
					this.hoverable.removeClass( "ui-state-hover" );
					this.focusable.removeClass( "ui-state-focus" );
				}
			}

			return this;
		},

		enable: function() {
			return this._setOptions({ disabled: false });
		},
		disable: function() {
			return this._setOptions({ disabled: true });
		},

		_on: function( suppressDisabledCheck, element, handlers ) {
			var delegateElement,
				instance = this;

			// no suppressDisabledCheck flag, shuffle arguments
			if ( typeof suppressDisabledCheck !== "boolean" ) {
				handlers = element;
				element = suppressDisabledCheck;
				suppressDisabledCheck = false;
			}

			// no element argument, shuffle and use this.element
			if ( !handlers ) {
				handlers = element;
				element = this.element;
				delegateElement = this.widget();
			} else {
				element = delegateElement = $( element );
				this.bindings = this.bindings.add( element );
			}

			$.each( handlers, function( event, handler ) {
				function handlerProxy() {
					// allow widgets to customize the disabled handling
					// - disabled as an array instead of boolean
					// - disabled class as method for disabling individual parts
					if ( !suppressDisabledCheck &&
							( instance.options.disabled === true ||
								$( this ).hasClass( "ui-state-disabled" ) ) ) {
						return;
					}
					return ( typeof handler === "string" ? instance[ handler ] : handler )
						.apply( instance, arguments );
				}

				// copy the guid so direct unbinding works
				if ( typeof handler !== "string" ) {
					handlerProxy.guid = handler.guid =
						handler.guid || handlerProxy.guid || $.guid++;
				}

				var match = event.match( /^([\w:-]*)\s*(.*)$/ ),
					eventName = match[1] + instance.eventNamespace,
					selector = match[2];
				if ( selector ) {
					delegateElement.delegate( selector, eventName, handlerProxy );
				} else {
					element.bind( eventName, handlerProxy );
				}
			});
		},

		_off: function( element, eventName ) {
			eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) +
				this.eventNamespace;
			element.unbind( eventName ).undelegate( eventName );

			// Clear the stack to avoid memory leaks (#10056)
			this.bindings = $( this.bindings.not( element ).get() );
			this.focusable = $( this.focusable.not( element ).get() );
			this.hoverable = $( this.hoverable.not( element ).get() );
		},

		_delay: function( handler, delay ) {
			function handlerProxy() {
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}
			var instance = this;
			return setTimeout( handlerProxy, delay || 0 );
		},

		_hoverable: function( element ) {
			this.hoverable = this.hoverable.add( element );
			this._on( element, {
				mouseenter: function( event ) {
					$( event.currentTarget ).addClass( "ui-state-hover" );
				},
				mouseleave: function( event ) {
					$( event.currentTarget ).removeClass( "ui-state-hover" );
				}
			});
		},

		_focusable: function( element ) {
			this.focusable = this.focusable.add( element );
			this._on( element, {
				focusin: function( event ) {
					$( event.currentTarget ).addClass( "ui-state-focus" );
				},
				focusout: function( event ) {
					$( event.currentTarget ).removeClass( "ui-state-focus" );
				}
			});
		},

		/**
		 * NOTE：_trigger方法暂时不升级，沿用aries3.0版本
		 * $.widget中优化过的trigger方法。type是回调事件的名称，如"onRowClick"，event是触发回调的事件（通常没有这个事件的时候传null）
		 * 这个方法只声明了两个参数，如有其他参数可以直接写在event参数后面
		 */
		_trigger: function( type, event ) {
			// 获取初始化配置config中的回调方法
			var callback = this.options[ type ];
			// 封装js标准event对象为jquery的Event对象
			event = $.Event( event );
			event.type = type;
			// copy original event properties over to the new event
			// this would happen if we could call $.event.fix instead of $.Event
			// but we don't have a way to force an event to be fixed multiple times
			if ( event.originalEvent ) {
				for ( var i = $.event.props.length, prop; i; ) {
					prop = $.event.props[ --i ];
					event[ prop ] = event.originalEvent[ prop ];
				}
			}
			// 构造传给回调函数的参数，event放置在最后
			var newArgs = [],
				argLength = arguments.length;
			for(var i = 2; i < argLength; i++){
				newArgs[i-2] = arguments[i];
			}
			if( argLength > 1){
				newArgs[argLength-2] = arguments[1];
			}
			return !( $.isFunction(callback) &&
				callback.apply( this.element, newArgs ) === false ||
				event.isDefaultPrevented() );
		}
		/*
		 * jQuery UI - v1.11.4 - 2015-05-17
		 * _trigger方法
		 *
		   _trigger: function( type, event, data ) {
			var prop, orig,
				callback = this.options[ type ];

			data = data || {};
			event = $.Event( event );
			event.type = ( type === this.widgetEventPrefix ?
				type :
				this.widgetEventPrefix + type ).toLowerCase();
			// the original event may come from any element
			// so we need to reset the target on the new event
			event.target = this.element[ 0 ];

			// copy original event properties over to the new event
			orig = event.originalEvent;
			if ( orig ) {
				for ( prop in orig ) {
					if ( !( prop in event ) ) {
						event[ prop ] = orig[ prop ];
					}
				}
			}

			this.element.trigger( event, data );
			return !( $.isFunction( callback ) &&
				callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
				event.isDefaultPrevented() );
		}*/
	};

	$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
		$.AEWidget.prototype[ "_" + method ] = function( element, options, callback ) {
			if ( typeof options === "string" ) {
				options = { effect: options };
			}
			var hasOptions,
				effectName = !options ?
					method :
					options === true || typeof options === "number" ?
						defaultEffect :
						options.effect || defaultEffect;
			options = options || {};
			if ( typeof options === "number" ) {
				options = { duration: options };
			}
			hasOptions = !$.isEmptyObject( options );
			options.complete = callback;
			if ( options.delay ) {
				element.delay( options.delay );
			}
			if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
				element[ method ]( options );
			} else if ( effectName !== method && element[ effectName ] ) {
				element[ effectName ]( options.duration, options.easing, callback );
			} else {
				element.queue(function( next ) {
					$( this )[ method ]();
					if ( callback ) {
						callback.call( element[ 0 ] );
					}
					next();
				});
			}
		};
	});

});

/**
 * 鼠标交互模块
 * @module ui-mouse
 * @requires ui-core
 * @requires ui-widget
 */
define('ui-mouse',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";

	var mouseHandled = false;
	$( document ).on("mouseup", function() {
		mouseHandled = false;
	});

	/**
     * 鼠标交互基础功能，为某些需要支持鼠标交互的组件提供鼠标交互能力，一般不直接使用。
     * @namespace ae.aeMouse
     */
	$.aeWidget("ae.aeMouse", {
		/**
         * 版本号
         * @name ae.aeMouse#version
         * @type string
         */
		version: "1.11.4",
		/**
         * 可选项
         * @name ae.aeMouse#options
         * @property {object} options
         * @property {string} options.cancel       - 需要忽略的元素名称，多个元素用逗号分隔
         * @property {number} options.distance     - 鼠标开始交互动作的等待距离
         * @property {number} options.delay        - 鼠标开始交互动作的延迟时间
         */
		options: {
			cancel: "input,textarea,button,select,option",
			distance: 1,
			delay: 0
		},
		_mouseInit: function() {
			var that = this;

			this.element.on("mousedown." + this.widgetName, function(event) {
					return that._mouseDown(event);
				}).on("click." + this.widgetName, function(event) {
					if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
						$.removeData(event.target, that.widgetName + ".preventClickEvent");
						event.stopImmediatePropagation();
						return false;
					}
				});

			this.started = false;
		},

		// TODO: make sure destroying one instance of mouse doesn't mess with
		// other instances of mouse
		_mouseDestroy: function() {
			this.element.off("." + this.widgetName);
			if ( this._mouseMoveDelegate ) {
				this.document
					.off("mousemove." + this.widgetName, this._mouseMoveDelegate)
					.off("mouseup." + this.widgetName, this._mouseUpDelegate);
			}
		},

		_mouseDown: function(event) {
			// don't let more than one widget handle mouseStart
			if ( mouseHandled ) {
				return;
			}

			this._mouseMoved = false;

			// we may have missed mouseup (out of window)
			(this._mouseStarted && this._mouseUp(event));

			this._mouseDownEvent = event;

			var that = this,
				btnIsLeft = (event.which === 1),
				// event.target.nodeName works around a bug in IE 8 with
				// disabled inputs (#7620)
				elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
			if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
				return true;
			}

			this.mouseDelayMet = !this.options.delay;
			if (!this.mouseDelayMet) {
				this._mouseDelayTimer = setTimeout(function() {
					that.mouseDelayMet = true;
				}, this.options.delay);
			}

			if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
				this._mouseStarted = (this._mouseStart(event) !== false);
				if (!this._mouseStarted) {
					event.preventDefault();
					return true;
				}
			}

			// Click event may never have fired (Gecko & Opera)
			if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
				$.removeData(event.target, this.widgetName + ".preventClickEvent");
			}

			// these delegates are required to keep context
			this._mouseMoveDelegate = function(event) {
				return that._mouseMove(event);
			};
			this._mouseUpDelegate = function(event) {
				return that._mouseUp(event);
			};

			this.document
				.on( "mousemove." + this.widgetName, this._mouseMoveDelegate )
				.on( "mouseup." + this.widgetName, this._mouseUpDelegate );

			event.preventDefault();

			mouseHandled = true;
			return true;
		},

		_mouseMove: function(event) {
			// Only check for mouseups outside the document if you've moved inside the document
			// at least once. This prevents the firing of mouseup in the case of IE<9, which will
			// fire a mousemove event if content is placed under the cursor. See #7778
			// Support: IE <9
			if ( this._mouseMoved ) {
				// IE mouseup check - mouseup happened when mouse was out of window
				if ($.ae.ie && ( !document.documentMode || document.documentMode < 9 ) && !event.button) {
					return this._mouseUp(event);

				// Iframe mouseup check - mouseup occurred in another document
				} else if ( !event.which ) {
					return this._mouseUp( event );
				}
			}

			if ( event.which || event.button ) {
				this._mouseMoved = true;
			}

			if (this._mouseStarted) {
				this._mouseDrag(event);
				return event.preventDefault();
			}

			if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
				this._mouseStarted =
					(this._mouseStart(this._mouseDownEvent, event) !== false);
				(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
			}

			return !this._mouseStarted;
		},

		_mouseUp: function(event) {
			this.document
				.off( "mousemove." + this.widgetName, this._mouseMoveDelegate )
				.off( "mouseup." + this.widgetName, this._mouseUpDelegate );

			if (this._mouseStarted) {
				this._mouseStarted = false;

				if (event.target === this._mouseDownEvent.target) {
					$.data(event.target, this.widgetName + ".preventClickEvent", true);
				}

				this._mouseStop(event);
			}

			mouseHandled = false;
			return false;
		},

		_mouseDistanceMet: function(event) {
			return (Math.max(
					Math.abs(this._mouseDownEvent.pageX - event.pageX),
					Math.abs(this._mouseDownEvent.pageY - event.pageY)
				) >= this.options.distance
			);
		},

		_mouseDelayMet: function(/* event */) {
			return this.mouseDelayMet;
		},

		// These are placeholder methods, to be overriden by extending plugin
		_mouseStart: function(/* event */) {},
		_mouseDrag: function(/* event */) {},
		_mouseStop: function(/* event */) {},
		_mouseCapture: function(/* event */) { return true; }
	});

});

define('ui-resizable',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
/*
 * ui-resizable.js
 * 
 * Depends:
 *  ui-core.js
 *  ui-widget.js
 *  ui-mouse.js
 */
$.aeWidget("ae.aeResizable", $.ae.aeMouse, {
	version: "1.11.4",
	widgetEventPrefix: "resize",
	options: {
		alsoResize: false,
		animate: false,
		animateDuration: "slow",
		animateEasing: "swing",
		aspectRatio: false,
		autoHide: false,
		containment: false,
		ghost: false,
		grid: false,
		handles: "e,s,se",
		helper: false,
		maxHeight: null,
		maxWidth: null,
		minHeight: 10,
		minWidth: 10,
		// See #7960
		zIndex: 90,

		// callbacks
		resize: null,
		start: null,
		stop: null
	},

	_num: function( value ) {
		return parseInt( value, 10 ) || 0;
	},

	_isNumber: function( value ) {
		return !isNaN( parseInt( value, 10 ) );
	},

	_hasScroll: function( el, a ) {

		if ( $( el ).css( "overflow" ) === "hidden") {
			return false;
		}

		var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
			has = false;

		if ( el[ scroll ] > 0 ) {
			return true;
		}

		// TODO: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		el[ scroll ] = 1;
		has = ( el[ scroll ] > 0 );
		el[ scroll ] = 0;
		return has;
	},

	_create: function() {

		var n, i, handle, axis, hname,
			that = this,
			o = this.options;
		this.element.addClass("ui-resizable");

		$.extend(this, {
			_aspectRatio: !!(o.aspectRatio),
			aspectRatio: o.aspectRatio,
			originalElement: this.element,
			_proportionallyResizeElements: [],
			_helper: o.helper || o.ghost || o.animate ? o.helper || "ui-resizable-helper" : null
		});

		// Wrap the element if it cannot hold child nodes
		if (this.element[0].nodeName.match(/^(canvas|textarea|input|select|button|img)$/i)) {

			this.element.wrap(
				$("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({
					position: this.element.css("position"),
					width: this.element.outerWidth(),
					height: this.element.outerHeight(),
					top: this.element.css("top"),
					left: this.element.css("left")
				})
			);

			this.element = this.element.parent().data(
				"ui-resizable", this.element.resizable( "instance" )
			);

			this.elementIsWrapper = true;

			this.element.css({
				marginLeft: this.originalElement.css("marginLeft"),
				marginTop: this.originalElement.css("marginTop"),
				marginRight: this.originalElement.css("marginRight"),
				marginBottom: this.originalElement.css("marginBottom")
			});
			this.originalElement.css({
				marginLeft: 0,
				marginTop: 0,
				marginRight: 0,
				marginBottom: 0
			});
			// support: Safari
			// Prevent Safari textarea resize
			this.originalResizeStyle = this.originalElement.css("resize");
			this.originalElement.css("resize", "none");

			this._proportionallyResizeElements.push( this.originalElement.css({
				position: "static",
				zoom: 1,
				display: "block"
			}) );

			// support: IE9
			// avoid IE jump (hard set the margin)
			this.originalElement.css({ margin: this.originalElement.css("margin") });

			this._proportionallyResize();
		}

		this.handles = o.handles ||
			( !$(".popup-resizable-handle", this.element).length ?
				"e,s,se" : {
					n: ".popup-resizable-n",
					e: ".popup-resizable-e",
					s: ".popup-resizable-s",
					w: ".popup-resizable-w",
					se: ".popup-resizable-se",
					sw: ".popup-resizable-sw",
					ne: ".popup-resizable-ne",
					nw: ".popup-resizable-nw"
				} );

                this._handles = $();
		if (this.handles.constructor === String) {

			if ( this.handles === "all") {
				this.handles = "n,e,s,w,se,sw,ne,nw";
			}

			n = this.handles.split(",");
			this.handles = {};

			for (i = 0; i < n.length; i++) {

				handle = $.trim(n[i]);
				hname = "popup-resizable-" + handle;
				axis = $("<div class='popup-resizable-handle " + hname + "'></div>");

				axis.css({ zIndex: o.zIndex });

				// TODO : What's going on here?
				if ("se" === handle) {
					axis.addClass("ui-icon ui-icon-gripsmall-diagonal-se");
				}

				this.handles[handle] = ".popup-resizable-" + handle;
				this.element.append(axis);
			}

		}

		this._renderAxis = function(target) {

			var i, axis, padPos, padWrapper;

			target = target || this.element;

			for (i in this.handles) {

				if (this.handles[i].constructor === String) {
			            this.handles[i] = this.element.children( this.handles[ i ] ).first().show();
                                } else if ( this.handles[ i ].jquery || this.handles[ i ].nodeType ) {
                                    this.handles[ i ] = $( this.handles[ i ] );
                                    this._on( this.handles[ i ], { "mousedown": that._mouseDown });
				}

				if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/^(textarea|input|select|button)$/i)) {

					axis = $(this.handles[i], this.element);

					padWrapper = /sw|ne|nw|se|n|s/.test(i) ? axis.outerHeight() : axis.outerWidth();

					padPos = [ "padding",
						/ne|nw|n/.test(i) ? "Top" :
						/se|sw|s/.test(i) ? "Bottom" :
						/^e$/.test(i) ? "Right" : "Left" ].join("");

					target.css(padPos, padWrapper);

					this._proportionallyResize();

				}

			        
				 this._handles = this._handles.add( this.handles[ i ] );
			}
		};

		// TODO: make renderAxis a prototype function
		this._renderAxis(this.element);

	        this._handles = this._handles.add( this.element.find( ".popup-resizable-handle" ) );
                this._handles.disableSelection();

		this._handles.mouseover(function() {
			if (!that.resizing) {
				if (this.className) {
					axis = this.className.match(/popup-resizable-(se|sw|ne|nw|n|e|s|w)/i);
				}
				that.axis = axis && axis[1] ? axis[1] : "se";
			}
		});

		if (o.autoHide) {
			this._handles.hide();
			$(this.element)
				.addClass("ui-resizable-autohide")
				.mouseenter(function() {
					if (o.disabled) {
						return;
					}
					$(this).removeClass("ui-resizable-autohide");
					that._handles.show();
				})
				.mouseleave(function() {
					if (o.disabled) {
						return;
					}
					if (!that.resizing) {
						$(this).addClass("ui-resizable-autohide");
						that._handles.hide();
					}
				});
		}

		this._mouseInit();

	},

	_destroy: function() {

		this._mouseDestroy();

		var wrapper,
			_destroy = function(exp) {
				$(exp)
					.removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing")
					.removeData("resizable")
					.removeData("ui-resizable")
					.unbind(".resizable")
					.find(".ui-resizable-handle")
						.remove();
			};

		// TODO: Unwrap at same DOM position
		if (this.elementIsWrapper) {
			_destroy(this.element);
			wrapper = this.element;
			this.originalElement.css({
				position: wrapper.css("position"),
				width: wrapper.outerWidth(),
				height: wrapper.outerHeight(),
				top: wrapper.css("top"),
				left: wrapper.css("left")
			}).insertAfter( wrapper );
			wrapper.remove();
		}

		this.originalElement.css("resize", this.originalResizeStyle);
		_destroy(this.originalElement);

		return this;
	},

	_mouseCapture: function(event) {
		var i, handle,
			capture = false;

		for (i in this.handles) {
			handle = $(this.handles[i])[0];
			if (handle === event.target || $.contains(handle, event.target)) {
				capture = true;
			}
		}

		return !this.options.disabled && capture;
	},

	_mouseStart: function(event) {

		var curleft, curtop, cursor,
			o = this.options,
			el = this.element;

		this.resizing = true;

		this._renderProxy();

		curleft = this._num(this.helper.css("left"));
		curtop = this._num(this.helper.css("top"));

		if (o.containment) {
			curleft += $(o.containment).scrollLeft() || 0;
			curtop += $(o.containment).scrollTop() || 0;
		}

		this.offset = this.helper.offset();
		this.position = { left: curleft, top: curtop };

		this.size = this._helper ? {
				width: this.helper.width(),
				height: this.helper.height()
			} : {
				width: el.width(),
				height: el.height()
			};

		this.originalSize = this._helper ? {
				width: el.outerWidth(),
				height: el.outerHeight()
			} : {
				width: el.width(),
				height: el.height()
			};

		this.sizeDiff = {
			width: el.outerWidth() - el.width(),
			height: el.outerHeight() - el.height()
		};

		this.originalPosition = { left: curleft, top: curtop };
		this.originalMousePosition = { left: event.pageX, top: event.pageY };

		this.aspectRatio = (typeof o.aspectRatio === "number") ?
			o.aspectRatio :
			((this.originalSize.width / this.originalSize.height) || 1);

		cursor = $(".popup-resizable-" + this.axis).css("cursor");
		$("body").css("cursor", cursor === "auto" ? this.axis + "-resize" : cursor);

		el.addClass("ui-resizable-resizing");
		this._propagate("start", event);
		return true;
	},

	_mouseDrag: function(event) {

		var data, props,
			smp = this.originalMousePosition,
			a = this.axis,
			dx = (event.pageX - smp.left) || 0,
			dy = (event.pageY - smp.top) || 0,
			trigger = this._change[a];

		this._updatePrevProperties();

		if (!trigger) {
			return false;
		}

		data = trigger.apply(this, [ event, dx, dy ]);

		this._updateVirtualBoundaries(event.shiftKey);
		if (this._aspectRatio || event.shiftKey) {
			data = this._updateRatio(data, event);
		}

		data = this._respectSize(data, event);

		this._updateCache(data);

		this._propagate("resize", event);

		props = this._applyChanges();

		if ( !this._helper && this._proportionallyResizeElements.length ) {
			this._proportionallyResize();
		}

		if ( !$.isEmptyObject( props ) ) {
			this._updatePrevProperties();
			this._trigger( "resize", event, this.ui() );
			this._applyChanges();
		}

		return false;
	},

	_mouseStop: function(event) {

		this.resizing = false;
		var pr, ista, soffseth, soffsetw, s, left, top,
			o = this.options, that = this;

		if (this._helper) {

			pr = this._proportionallyResizeElements;
			ista = pr.length && (/textarea/i).test(pr[0].nodeName);
			soffseth = ista && this._hasScroll(pr[0], "left") ? 0 : that.sizeDiff.height;
			soffsetw = ista ? 0 : that.sizeDiff.width;

			s = {
				width: (that.helper.width()  - soffsetw),
				height: (that.helper.height() - soffseth)
			};
			left = (parseInt(that.element.css("left"), 10) +
				(that.position.left - that.originalPosition.left)) || null;
			top = (parseInt(that.element.css("top"), 10) +
				(that.position.top - that.originalPosition.top)) || null;

			if (!o.animate) {
				this.element.css($.extend(s, { top: top, left: left }));
			}

			that.helper.height(that.size.height);
			that.helper.width(that.size.width);

			if (this._helper && !o.animate) {
				this._proportionallyResize();
			}
		}

		$("body").css("cursor", "auto");

		this.element.removeClass("ui-resizable-resizing");

		this._propagate("stop", event);

		if (this._helper) {
			this.helper.remove();
		}

		return false;

	},

	_updatePrevProperties: function() {
		this.prevPosition = {
			top: this.position.top,
			left: this.position.left
		};
		this.prevSize = {
			width: this.size.width,
			height: this.size.height
		};
	},

	_applyChanges: function() {
		var props = {};

		if ( this.position.top !== this.prevPosition.top ) {
			props.top = this.position.top + "px";
		}
		if ( this.position.left !== this.prevPosition.left ) {
			props.left = this.position.left + "px";
		}
		if ( this.size.width !== this.prevSize.width ) {
			props.width = this.size.width + "px";
		}
		if ( this.size.height !== this.prevSize.height ) {
			props.height = this.size.height + "px";
		}

		this.helper.css( props );

		return props;
	},

	_updateVirtualBoundaries: function(forceAspectRatio) {
		var pMinWidth, pMaxWidth, pMinHeight, pMaxHeight, b,
			o = this.options;

		b = {
			minWidth: this._isNumber(o.minWidth) ? o.minWidth : 0,
			maxWidth: this._isNumber(o.maxWidth) ? o.maxWidth : Infinity,
			minHeight: this._isNumber(o.minHeight) ? o.minHeight : 0,
			maxHeight: this._isNumber(o.maxHeight) ? o.maxHeight : Infinity
		};

		if (this._aspectRatio || forceAspectRatio) {
			pMinWidth = b.minHeight * this.aspectRatio;
			pMinHeight = b.minWidth / this.aspectRatio;
			pMaxWidth = b.maxHeight * this.aspectRatio;
			pMaxHeight = b.maxWidth / this.aspectRatio;

			if (pMinWidth > b.minWidth) {
				b.minWidth = pMinWidth;
			}
			if (pMinHeight > b.minHeight) {
				b.minHeight = pMinHeight;
			}
			if (pMaxWidth < b.maxWidth) {
				b.maxWidth = pMaxWidth;
			}
			if (pMaxHeight < b.maxHeight) {
				b.maxHeight = pMaxHeight;
			}
		}
		this._vBoundaries = b;
	},

	_updateCache: function(data) {
		this.offset = this.helper.offset();
		if (this._isNumber(data.left)) {
			this.position.left = data.left;
		}
		if (this._isNumber(data.top)) {
			this.position.top = data.top;
		}
		if (this._isNumber(data.height)) {
			this.size.height = data.height;
		}
		if (this._isNumber(data.width)) {
			this.size.width = data.width;
		}
	},

	_updateRatio: function( data ) {

		var cpos = this.position,
			csize = this.size,
			a = this.axis;

		if (this._isNumber(data.height)) {
			data.width = (data.height * this.aspectRatio);
		} else if (this._isNumber(data.width)) {
			data.height = (data.width / this.aspectRatio);
		}

		if (a === "sw") {
			data.left = cpos.left + (csize.width - data.width);
			data.top = null;
		}
		if (a === "nw") {
			data.top = cpos.top + (csize.height - data.height);
			data.left = cpos.left + (csize.width - data.width);
		}

		return data;
	},

	_respectSize: function( data ) {

		var o = this._vBoundaries,
			a = this.axis,
			ismaxw = this._isNumber(data.width) && o.maxWidth && (o.maxWidth < data.width),
			ismaxh = this._isNumber(data.height) && o.maxHeight && (o.maxHeight < data.height),
			isminw = this._isNumber(data.width) && o.minWidth && (o.minWidth > data.width),
			isminh = this._isNumber(data.height) && o.minHeight && (o.minHeight > data.height),
			dw = this.originalPosition.left + this.originalSize.width,
			dh = this.position.top + this.size.height,
			cw = /sw|nw|w/.test(a), ch = /nw|ne|n/.test(a);
		if (isminw) {
			data.width = o.minWidth;
		}
		if (isminh) {
			data.height = o.minHeight;
		}
		if (ismaxw) {
			data.width = o.maxWidth;
		}
		if (ismaxh) {
			data.height = o.maxHeight;
		}

		if (isminw && cw) {
			data.left = dw - o.minWidth;
		}
		if (ismaxw && cw) {
			data.left = dw - o.maxWidth;
		}
		if (isminh && ch) {
			data.top = dh - o.minHeight;
		}
		if (ismaxh && ch) {
			data.top = dh - o.maxHeight;
		}

		// Fixing jump error on top/left - bug #2330
		if (!data.width && !data.height && !data.left && data.top) {
			data.top = null;
		} else if (!data.width && !data.height && !data.top && data.left) {
			data.left = null;
		}

		return data;
	},

	_getPaddingPlusBorderDimensions: function( element ) {
		var i = 0,
			widths = [],
			borders = [
				element.css( "borderTopWidth" ),
				element.css( "borderRightWidth" ),
				element.css( "borderBottomWidth" ),
				element.css( "borderLeftWidth" )
			],
			paddings = [
				element.css( "paddingTop" ),
				element.css( "paddingRight" ),
				element.css( "paddingBottom" ),
				element.css( "paddingLeft" )
			];

		for ( ; i < 4; i++ ) {
			widths[ i ] = ( parseInt( borders[ i ], 10 ) || 0 );
			widths[ i ] += ( parseInt( paddings[ i ], 10 ) || 0 );
		}

		return {
			height: widths[ 0 ] + widths[ 2 ],
			width: widths[ 1 ] + widths[ 3 ]
		};
	},

	_proportionallyResize: function() {

		if (!this._proportionallyResizeElements.length) {
			return;
		}

		var prel,
			i = 0,
			element = this.helper || this.element;

		for ( ; i < this._proportionallyResizeElements.length; i++) {

			prel = this._proportionallyResizeElements[i];

			// TODO: Seems like a bug to cache this.outerDimensions
			// considering that we are in a loop.
			if (!this.outerDimensions) {
				this.outerDimensions = this._getPaddingPlusBorderDimensions( prel );
			}

			prel.css({
				height: (element.height() - this.outerDimensions.height) || 0,
				width: (element.width() - this.outerDimensions.width) || 0
			});

		}

	},

	_renderProxy: function() {

		var el = this.element, o = this.options;
		this.elementOffset = el.offset();

		if (this._helper) {

			this.helper = this.helper || $("<div style='overflow:hidden;'></div>");

			this.helper.addClass(this._helper).css({
				width: this.element.outerWidth() - 1,
				height: this.element.outerHeight() - 1,
				position: "absolute",
				left: this.elementOffset.left + "px",
				top: this.elementOffset.top + "px",
				zIndex: ++o.zIndex //TODO: Don't modify option
			});

			this.helper
				.appendTo("body")
				.disableSelection();

		} else {
			this.helper = this.element;
		}

	},

	_change: {
		e: function(event, dx) {
			return { width: this.originalSize.width + dx };
		},
		w: function(event, dx) {
			var cs = this.originalSize, sp = this.originalPosition;
			return { left: sp.left + dx, width: cs.width - dx };
		},
		n: function(event, dx, dy) {
			var cs = this.originalSize, sp = this.originalPosition;
			return { top: sp.top + dy, height: cs.height - dy };
		},
		s: function(event, dx, dy) {
			return { height: this.originalSize.height + dy };
		},
		se: function(event, dx, dy) {
			return $.extend(this._change.s.apply(this, arguments),
				this._change.e.apply(this, [ event, dx, dy ]));
		},
		sw: function(event, dx, dy) {
			return $.extend(this._change.s.apply(this, arguments),
				this._change.w.apply(this, [ event, dx, dy ]));
		},
		ne: function(event, dx, dy) {
			return $.extend(this._change.n.apply(this, arguments),
				this._change.e.apply(this, [ event, dx, dy ]));
		},
		nw: function(event, dx, dy) {
			return $.extend(this._change.n.apply(this, arguments),
				this._change.w.apply(this, [ event, dx, dy ]));
		}
	},

	_propagate: function(n, event) {
		$.ae.plugin.call(this, n, [ event, this.ui() ]);
		(n !== "resize" && this._trigger(n, event, this.ui()));
	},

	plugins: {},

	ui: function() {
		return {
			originalElement: this.originalElement,
			element: this.element,
			helper: this.helper,
			position: this.position,
			size: this.size,
			originalSize: this.originalSize,
			originalPosition: this.originalPosition
		};
	}

});

/*
 * Resizable Extensions
 */

$.ae.plugin.add("aeResizable", "animate", {

	stop: function( event ) {
		var that = $(this).aeResizable( "instance" ),
			o = that.options,
			pr = that._proportionallyResizeElements,
			ista = pr.length && (/textarea/i).test(pr[0].nodeName),
			soffseth = ista && that._hasScroll(pr[0], "left") ? 0 : that.sizeDiff.height,
			soffsetw = ista ? 0 : that.sizeDiff.width,
			style = { width: (that.size.width - soffsetw), height: (that.size.height - soffseth) },
			left = (parseInt(that.element.css("left"), 10) +
				(that.position.left - that.originalPosition.left)) || null,
			top = (parseInt(that.element.css("top"), 10) +
				(that.position.top - that.originalPosition.top)) || null;

		that.element.animate(
			$.extend(style, top && left ? { top: top, left: left } : {}), {
				duration: o.animateDuration,
				easing: o.animateEasing,
				step: function() {

					var data = {
						width: parseInt(that.element.css("width"), 10),
						height: parseInt(that.element.css("height"), 10),
						top: parseInt(that.element.css("top"), 10),
						left: parseInt(that.element.css("left"), 10)
					};

					if (pr && pr.length) {
						$(pr[0]).css({ width: data.width, height: data.height });
					}

					// propagating resize, and updating values for each animation step
					that._updateCache(data);
					that._propagate("resize", event);

				}
			}
		);
	}

});

$.ae.plugin.add( "aeResizable", "containment", {

	start: function() {
		var element, p, co, ch, cw, width, height,
			that = $( this ).aeResizable( "instance" ),
			o = that.options,
			el = that.element,
			oc = o.containment,
			ce = ( oc instanceof $ ) ? oc.get( 0 ) : ( /parent/.test( oc ) ) ? el.parent().get( 0 ) : oc;

		if ( !ce ) {
			return;
		}

		that.containerElement = $( ce );

		if ( /document/.test( oc ) || oc === document ) {
			that.containerOffset = {
				left: 0,
				top: 0
			};
			that.containerPosition = {
				left: 0,
				top: 0
			};

			that.parentData = {
				element: $( document ),
				left: 0,
				top: 0,
				width: $( document ).width(),
				height: $( document ).height() || document.body.parentNode.scrollHeight
			};
		} else {
			element = $( ce );
			p = [];
			$([ "Top", "Right", "Left", "Bottom" ]).each(function( i, name ) {
				p[ i ] = that._num( element.css( "padding" + name ) );
			});

			that.containerOffset = element.offset();
			that.containerPosition = element.position();
			that.containerSize = {
				height: ( element.innerHeight() - p[ 3 ] ),
				width: ( element.innerWidth() - p[ 1 ] )
			};

			co = that.containerOffset;
			ch = that.containerSize.height;
			cw = that.containerSize.width;
			width = ( that._hasScroll ( ce, "left" ) ? ce.scrollWidth : cw );
			height = ( that._hasScroll ( ce ) ? ce.scrollHeight : ch ) ;

			that.parentData = {
				element: ce,
				left: co.left,
				top: co.top,
				width: width,
				height: height
			};
		}
	},

	resize: function( event ) {
		var woset, hoset, isParent, isOffsetRelative,
			that = $( this ).aeResizable( "instance" ),
			o = that.options,
			co = that.containerOffset,
			cp = that.position,
			pRatio = that._aspectRatio || event.shiftKey,
			cop = {
				top: 0,
				left: 0
			},
			ce = that.containerElement,
			continueResize = true;

		if ( ce[ 0 ] !== document && ( /static/ ).test( ce.css( "position" ) ) ) {
			cop = co;
		}

		if ( cp.left < ( that._helper ? co.left : 0 ) ) {
			that.size.width = that.size.width +
				( that._helper ?
					( that.position.left - co.left ) :
					( that.position.left - cop.left ) );

			if ( pRatio ) {
				that.size.height = that.size.width / that.aspectRatio;
				continueResize = false;
			}
			that.position.left = o.helper ? co.left : 0;
		}

		if ( cp.top < ( that._helper ? co.top : 0 ) ) {
			that.size.height = that.size.height +
				( that._helper ?
					( that.position.top - co.top ) :
					that.position.top );

			if ( pRatio ) {
				that.size.width = that.size.height * that.aspectRatio;
				continueResize = false;
			}
			that.position.top = that._helper ? co.top : 0;
		}

		isParent = that.containerElement.get( 0 ) === that.element.parent().get( 0 );
		isOffsetRelative = /relative|absolute/.test( that.containerElement.css( "position" ) );

		if ( isParent && isOffsetRelative ) {
			that.offset.left = that.parentData.left + that.position.left;
			that.offset.top = that.parentData.top + that.position.top;
		} else {
			that.offset.left = that.element.offset().left;
			that.offset.top = that.element.offset().top;
		}

		woset = Math.abs( that.sizeDiff.width +
			(that._helper ?
				that.offset.left - cop.left :
				(that.offset.left - co.left)) );

		hoset = Math.abs( that.sizeDiff.height +
			(that._helper ?
				that.offset.top - cop.top :
				(that.offset.top - co.top)) );

		if ( woset + that.size.width >= that.parentData.width ) {
			that.size.width = that.parentData.width - woset;
			if ( pRatio ) {
				that.size.height = that.size.width / that.aspectRatio;
				continueResize = false;
			}
		}

		if ( hoset + that.size.height >= that.parentData.height ) {
			that.size.height = that.parentData.height - hoset;
			if ( pRatio ) {
				that.size.width = that.size.height * that.aspectRatio;
				continueResize = false;
			}
		}

		if ( !continueResize ) {
			that.position.left = that.prevPosition.left;
			that.position.top = that.prevPosition.top;
			that.size.width = that.prevSize.width;
			that.size.height = that.prevSize.height;
		}
	},

	stop: function() {
		var that = $( this ).aeResizable( "instance" ),
			o = that.options,
			co = that.containerOffset,
			cop = that.containerPosition,
			ce = that.containerElement,
			helper = $( that.helper ),
			ho = helper.offset(),
			w = helper.outerWidth() - that.sizeDiff.width,
			h = helper.outerHeight() - that.sizeDiff.height;

		if ( that._helper && !o.animate && ( /relative/ ).test( ce.css( "position" ) ) ) {
			$( this ).css({
				left: ho.left - cop.left - co.left,
				width: w,
				height: h
			});
		}

		if ( that._helper && !o.animate && ( /static/ ).test( ce.css( "position" ) ) ) {
			$( this ).css({
				left: ho.left - cop.left - co.left,
				width: w,
				height: h
			});
		}
	}
});
$.ae.plugin.add("aeResizable", "alsoResize", {

 start: function() {
        var that = $(this).aeResizable( "instance" ),
            o = that.options;

        $(o.alsoResize).each(function() {
            var el = $(this);
            el.data("ui-resizable-alsoresize", {
                width: parseInt(el.width(), 10), height: parseInt(el.height(), 10),
                left: parseInt(el.css("left"), 10), top: parseInt(el.css("top"), 10)
            });
        });
    },

    resize: function(event, ui) {
        var that = $(this).aeResizable( "instance" ),
            o = that.options,
            os = that.originalSize,
            op = that.originalPosition,
            delta = {
                height: (that.size.height - os.height) || 0,
                width: (that.size.width - os.width) || 0,
                top: (that.position.top - op.top) || 0,
                left: (that.position.left - op.left) || 0
            };

        $(o.alsoResize).each(function() {
            var el = $(this), start = $(this).data("ui-resizable-alsoresize"), style = {},
                css = el.parents(ui.originalElement[0]).length ?
                    [ "width", "height" ] :
                    [ "width", "height", "top", "left" ];

            $.each(css, function(i, prop) {
                var sum = (start[prop] || 0) + (delta[prop] || 0);
                if (sum && sum >= 0) {
                    style[prop] = sum || null;
                }
            });

            el.css(style);
        });
    },

    stop: function() {
        $(this).removeData("resizable-alsoresize");
    }

});

$.ae.plugin.add("aeResizable", "ghost", {

	start: function() {

		var that = $(this).aeResizable( "instance" ), o = that.options, cs = that.size;

		that.ghost = that.originalElement.clone();
		that.ghost
			.css({
				opacity: 0.25,
				display: "block",
				position: "relative",
				height: cs.height,
				width: cs.width,
				margin: 0,
				left: 0,
				top: 0
			})
			.addClass("ui-resizable-ghost")
			.addClass(typeof o.ghost === "string" ? o.ghost : "");

		that.ghost.appendTo(that.helper);

	},

	resize: function() {
		var that = $(this).aeResizable( "instance" );
		if (that.ghost) {
			that.ghost.css({
				position: "relative",
				height: that.size.height,
				width: that.size.width
			});
		}
	},

	stop: function() {
		var that = $(this).aeResizable( "instance" );
		if (that.ghost && that.helper) {
			that.helper.get(0).removeChild(that.ghost.get(0));
		}
	}

});

$.ae.plugin.add("aeResizable", "grid", {

	resize: function() {
		var outerDimensions,
			that = $(this).aeResizable( "instance" ),
			o = that.options,
			cs = that.size,
			os = that.originalSize,
			op = that.originalPosition,
			a = that.axis,
			grid = typeof o.grid === "number" ? [ o.grid, o.grid ] : o.grid,
			gridX = (grid[0] || 1),
			gridY = (grid[1] || 1),
			ox = Math.round((cs.width - os.width) / gridX) * gridX,
			oy = Math.round((cs.height - os.height) / gridY) * gridY,
			newWidth = os.width + ox,
			newHeight = os.height + oy,
			isMaxWidth = o.maxWidth && (o.maxWidth < newWidth),
			isMaxHeight = o.maxHeight && (o.maxHeight < newHeight),
			isMinWidth = o.minWidth && (o.minWidth > newWidth),
			isMinHeight = o.minHeight && (o.minHeight > newHeight);

		o.grid = grid;

		if (isMinWidth) {
			newWidth += gridX;
		}
		if (isMinHeight) {
			newHeight += gridY;
		}
		if (isMaxWidth) {
			newWidth -= gridX;
		}
		if (isMaxHeight) {
			newHeight -= gridY;
		}

		if (/^(se|s|e)$/.test(a)) {
			that.size.width = newWidth;
			that.size.height = newHeight;
		} else if (/^(ne)$/.test(a)) {
			that.size.width = newWidth;
			that.size.height = newHeight;
			that.position.top = op.top - oy;
		} else if (/^(sw)$/.test(a)) {
			that.size.width = newWidth;
			that.size.height = newHeight;
			that.position.left = op.left - ox;
		} else {
			if ( newHeight - gridY <= 0 || newWidth - gridX <= 0) {
				outerDimensions = that._getPaddingPlusBorderDimensions( this );
			}

			if ( newHeight - gridY > 0 ) {
				that.size.height = newHeight;
				that.position.top = op.top - oy;
			} else {
				newHeight = gridY - outerDimensions.height;
				that.size.height = newHeight;
				that.position.top = op.top + os.height - newHeight;
			}
			if ( newWidth - gridX > 0 ) {
				that.size.width = newWidth;
				that.position.left = op.left - ox;
			} else {
				newWidth = gridX - outerDimensions.width;
				that.size.width = newWidth;
				that.position.left = op.left + os.width - newWidth;
			}
		}
	}

});

var aeResizable = $.ae.aeResizable;

});
define('ui-position',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";

//(function() {

$.ae = $.ae || {};

var cachedScrollbarWidth, supportsOffsetFractions,
	max = Math.max,
	abs = Math.abs,
	round = Math.round,
	rhorizontal = /left|center|right/,
	rvertical = /top|center|bottom/,
	roffset = /[\+\-]\d+(\.[\d]+)?%?/,
	rposition = /^\w+/,
	rpercent = /%$/,
	_position = $.fn.position;

function getOffsets( offsets, width, height ) {
	return [
		parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
		parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
	];
}

function parseCss( element, property ) {
	return parseInt( $.css( element, property ), 10 ) || 0;
}

function getDimensions( elem ) {
	var raw = elem[0];
	if ( raw.nodeType === 9 ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: 0, left: 0 }
		};
	}
	if ( $.isWindow( raw ) ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
		};
	}
	if ( raw.preventDefault ) {
		return {
			width: 0,
			height: 0,
			offset: { top: raw.pageY, left: raw.pageX }
		};
	}
	return {
		width: elem.outerWidth(),
		height: elem.outerHeight(),
		offset: elem.offset()
	};
}

$.aePosition = {
	scrollbarWidth: function() {
		if ( cachedScrollbarWidth !== undefined ) {
			return cachedScrollbarWidth;
		}
		var w1, w2,
			div = $( "<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
			innerDiv = div.children()[0];

		$( "body" ).append( div );
		w1 = innerDiv.offsetWidth;
		div.css( "overflow", "scroll" );

		w2 = innerDiv.offsetWidth;

		if ( w1 === w2 ) {
			w2 = div[0].clientWidth;
		}

		div.remove();

		return (cachedScrollbarWidth = w1 - w2);
	},
	getScrollInfo: function( within ) {
		var overflowX = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-x" ),
			overflowY = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-y" ),
			hasOverflowX = overflowX === "scroll" ||
				( overflowX === "auto" && within.width < within.element[0].scrollWidth ),
			hasOverflowY = overflowY === "scroll" ||
				( overflowY === "auto" && within.height < within.element[0].scrollHeight );
		return {
			width: hasOverflowY ? $.aePosition.scrollbarWidth() : 0,
			height: hasOverflowX ? $.aePosition.scrollbarWidth() : 0
		};
	},
	getWithinInfo: function( element ) {
		var withinElement = $( element || window ),
			isWindow = $.isWindow( withinElement[0] ),
			isDocument = !!withinElement[ 0 ] && withinElement[ 0 ].nodeType === 9;
		return {
			element: withinElement,
			isWindow: isWindow,
			isDocument: isDocument,
			offset: withinElement.offset() || { left: 0, top: 0 },
			scrollLeft: withinElement.scrollLeft(),
			scrollTop: withinElement.scrollTop(),

			// support: jQuery 1.6.x
			// jQuery 1.6 doesn't support .outerWidth/Height() on documents or windows
			width: isWindow || isDocument ? withinElement.width() : withinElement.outerWidth(),
			height: isWindow || isDocument ? withinElement.height() : withinElement.outerHeight()
		};
	}
};

$.fn.position = function( options ) {
	if ( !options || !options.of ) {
		return _position.apply( this, arguments );
	}

	// make a copy, we don't want to modify arguments
	options = $.extend( {}, options );

	var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
		target = $( options.of ),
		within = $.aePosition.getWithinInfo( options.within ),
		scrollInfo = $.aePosition.getScrollInfo( within ),
		collision = ( options.collision || "flip" ).split( " " ),
		offsets = {};

	dimensions = getDimensions( target );
	if ( target[0].preventDefault ) {
		// force left top to allow flipping
		options.at = "left top";
	}
	targetWidth = dimensions.width;
	targetHeight = dimensions.height;
	targetOffset = dimensions.offset;
	// clone to reuse original targetOffset later
	basePosition = $.extend( {}, targetOffset );

	// force my and at to have valid horizontal and vertical positions
	// if a value is missing or invalid, it will be converted to center
	$.each( [ "my", "at" ], function() {
		var pos = ( options[ this ] || "" ).split( " " ),
			horizontalOffset,
			verticalOffset;

		if ( pos.length === 1) {
			pos = rhorizontal.test( pos[ 0 ] ) ?
				pos.concat( [ "center" ] ) :
				rvertical.test( pos[ 0 ] ) ?
					[ "center" ].concat( pos ) :
					[ "center", "center" ];
		}
		pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
		pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

		// calculate offsets
		horizontalOffset = roffset.exec( pos[ 0 ] );
		verticalOffset = roffset.exec( pos[ 1 ] );
		offsets[ this ] = [
			horizontalOffset ? horizontalOffset[ 0 ] : 0,
			verticalOffset ? verticalOffset[ 0 ] : 0
		];

		// reduce to just the positions without the offsets
		options[ this ] = [
			rposition.exec( pos[ 0 ] )[ 0 ],
			rposition.exec( pos[ 1 ] )[ 0 ]
		];
	});

	// normalize collision option
	if ( collision.length === 1 ) {
		collision[ 1 ] = collision[ 0 ];
	}

	if ( options.at[ 0 ] === "right" ) {
		basePosition.left += targetWidth;
	} else if ( options.at[ 0 ] === "center" ) {
		basePosition.left += targetWidth / 2;
	}

	if ( options.at[ 1 ] === "bottom" ) {
		basePosition.top += targetHeight;
	} else if ( options.at[ 1 ] === "center" ) {
		basePosition.top += targetHeight / 2;
	}

	atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
	basePosition.left += atOffset[ 0 ];
	basePosition.top += atOffset[ 1 ];

	return this.each(function() {
		var collisionPosition, using,
			elem = $( this ),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.outerHeight(),
			marginLeft = parseCss( this, "marginLeft" ),
			marginTop = parseCss( this, "marginTop" ),
			collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) + scrollInfo.width,
			collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) + scrollInfo.height,
			position = $.extend( {}, basePosition ),
			myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

		if ( options.my[ 0 ] === "right" ) {
			position.left -= elemWidth;
		} else if ( options.my[ 0 ] === "center" ) {
			position.left -= elemWidth / 2;
		}

		if ( options.my[ 1 ] === "bottom" ) {
			position.top -= elemHeight;
		} else if ( options.my[ 1 ] === "center" ) {
			position.top -= elemHeight / 2;
		}

		position.left += myOffset[ 0 ];
		position.top += myOffset[ 1 ];

		// if the browser doesn't support fractions, then round for consistent results
		if ( !supportsOffsetFractions ) {
			position.left = round( position.left );
			position.top = round( position.top );
		}

		collisionPosition = {
			marginLeft: marginLeft,
			marginTop: marginTop
		};

		$.each( [ "left", "top" ], function( i, dir ) {
			if ( $.ae.aePosition[ collision[ i ] ] ) {
				$.ae.aePosition[ collision[ i ] ][ dir ]( position, {
					targetWidth: targetWidth,
					targetHeight: targetHeight,
					elemWidth: elemWidth,
					elemHeight: elemHeight,
					collisionPosition: collisionPosition,
					collisionWidth: collisionWidth,
					collisionHeight: collisionHeight,
					offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
					my: options.my,
					at: options.at,
					within: within,
					elem: elem
				});
			}
		});

		if ( options.using ) {
			// adds feedback as second argument to using callback, if present
			using = function( props ) {
				var left = targetOffset.left - position.left,
					right = left + targetWidth - elemWidth,
					top = targetOffset.top - position.top,
					bottom = top + targetHeight - elemHeight,
					feedback = {
						target: {
							element: target,
							left: targetOffset.left,
							top: targetOffset.top,
							width: targetWidth,
							height: targetHeight
						},
						element: {
							element: elem,
							left: position.left,
							top: position.top,
							width: elemWidth,
							height: elemHeight
						},
						horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
						vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
					};
				if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
					feedback.horizontal = "center";
				}
				if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
					feedback.vertical = "middle";
				}
				if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
					feedback.important = "horizontal";
				} else {
					feedback.important = "vertical";
				}
				options.using.call( this, props, feedback );
			};
		}

		elem.offset( $.extend( position, { using: using } ) );
	});
};

$.ae.aePosition = {
	fit: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
				outerWidth = within.width,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = withinOffset - collisionPosLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
				newOverRight;

			// element is wider than within
			if ( data.collisionWidth > outerWidth ) {
				// element is initially over the left side of within
				if ( overLeft > 0 && overRight <= 0 ) {
					newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
					position.left += overLeft - newOverRight;
				// element is initially over right side of within
				} else if ( overRight > 0 && overLeft <= 0 ) {
					position.left = withinOffset;
				// element is initially over both left and right sides of within
				} else {
					if ( overLeft > overRight ) {
						position.left = withinOffset + outerWidth - data.collisionWidth;
					} else {
						position.left = withinOffset;
					}
				}
			// too far left -> align with left edge
			} else if ( overLeft > 0 ) {
				position.left += overLeft;
			// too far right -> align with right edge
			} else if ( overRight > 0 ) {
				position.left -= overRight;
			// adjust based on position and margin
			} else {
				position.left = max( position.left - collisionPosLeft, position.left );
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
				outerHeight = data.within.height,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = withinOffset - collisionPosTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
				newOverBottom;

			// element is taller than within
			if ( data.collisionHeight > outerHeight ) {
				// element is initially over the top of within
				if ( overTop > 0 && overBottom <= 0 ) {
					newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
					position.top += overTop - newOverBottom;
				// element is initially over bottom of within
				} else if ( overBottom > 0 && overTop <= 0 ) {
					position.top = withinOffset;
				// element is initially over both top and bottom of within
				} else {
					if ( overTop > overBottom ) {
						position.top = withinOffset + outerHeight - data.collisionHeight;
					} else {
						position.top = withinOffset;
					}
				}
			// too far up -> align with top
			} else if ( overTop > 0 ) {
				position.top += overTop;
			// too far down -> align with bottom edge
			} else if ( overBottom > 0 ) {
				position.top -= overBottom;
			// adjust based on position and margin
			} else {
				position.top = max( position.top - collisionPosTop, position.top );
			}
		}
	},
	flip: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.left + within.scrollLeft,
				outerWidth = within.width,
				offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = collisionPosLeft - offsetLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
				myOffset = data.my[ 0 ] === "left" ?
					-data.elemWidth :
					data.my[ 0 ] === "right" ?
						data.elemWidth :
						0,
				atOffset = data.at[ 0 ] === "left" ?
					data.targetWidth :
					data.at[ 0 ] === "right" ?
						-data.targetWidth :
						0,
				offset = -2 * data.offset[ 0 ],
				newOverRight,
				newOverLeft;

			if ( overLeft < 0 ) {
				newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
				if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
					position.left += myOffset + atOffset + offset;
				}
			} else if ( overRight > 0 ) {
				newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
				if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
					position.left += myOffset + atOffset + offset;
				}
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.top + within.scrollTop,
				outerHeight = within.height,
				offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = collisionPosTop - offsetTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
				top = data.my[ 1 ] === "top",
				myOffset = top ?
					-data.elemHeight :
					data.my[ 1 ] === "bottom" ?
						data.elemHeight :
						0,
				atOffset = data.at[ 1 ] === "top" ?
					data.targetHeight :
					data.at[ 1 ] === "bottom" ?
						-data.targetHeight :
						0,
				offset = -2 * data.offset[ 1 ],
				newOverTop,
				newOverBottom;
			if ( overTop < 0 ) {
				newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
				if ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) {
					position.top += myOffset + atOffset + offset;
				}
			} else if ( overBottom > 0 ) {
				newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
				if ( newOverTop > 0 || abs( newOverTop ) < overBottom ) {
					position.top += myOffset + atOffset + offset;
				}
			}
		}
	},
	flipfit: {
		left: function() {
			$.ae.aePosition.flip.left.apply( this, arguments );
			$.ae.aePosition.fit.left.apply( this, arguments );
		},
		top: function() {
			$.ae.aePosition.flip.top.apply( this, arguments );
			$.ae.aePosition.fit.top.apply( this, arguments );
		}
	}
};

// fraction support test
(function() {
	var testElement, testElementParent, testElementStyle, offsetLeft, i,
		body = document.getElementsByTagName( "body" )[ 0 ],
		div = document.createElement( "div" );

	//Create a "fake body" for testing based on method used in jQuery.support
	testElement = document.createElement( body ? "div" : "body" );
	testElementStyle = {
		visibility: "hidden",
		width: 0,
		height: 0,
		border: 0,
		margin: 0,
		background: "none"
	};
	if ( body ) {
		$.extend( testElementStyle, {
			position: "absolute",
			left: "-1000px",
			top: "-1000px"
		});
	}
	for ( i in testElementStyle ) {
		testElement.style[ i ] = testElementStyle[ i ];
	}
	testElement.appendChild( div );
	testElementParent = body || document.documentElement;
	testElementParent.insertBefore( testElement, testElementParent.firstChild );

	div.style.cssText = "position: absolute; left: 10.7432222px;";

	offsetLeft = $( div ).offset().left;
	supportsOffsetFractions = offsetLeft > 10 && offsetLeft < 11;

	testElement.innerHTML = "";
	testElementParent.removeChild( testElement );
})();

//})();

var aePosition = $.ae.aePosition;

});
define('ui-draggable',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
/*
 * $Id: ui-draggable.js
 * Depends:
 *	ui-core.js
 *  ui-widget.js
 *	ui-mouse.js
 */

$.aeWidget("ae.aeDraggable", $.ae.aeMouse, {
    version: "1.11.4",
    widgetEventPrefix: "drag",
    options: {
        addClasses: true,
        appendTo: "parent",
        axis: false,
        connectToSortable: false,
        containment: false,
        cursor: "auto",
        cursorAt: false,
        grid: false,
        handle: false,
        helper: "original",
        iframeFix: false,
        opacity: false,
        refreshPositions: false,
        revert: false,
        revertDuration: 500,
        scope: "default",
        scroll: true,
        scrollSensitivity: 20,
        scrollSpeed: 20,
        snap: false,
        snapMode: "both",
        snapTolerance: 20,
        stack: false,
        zIndex: false,

        // callbacks
        drag: null,
        start: null,
        stop: null
    },
    _create: function() {

        if ( this.options.helper === "original" ) {
            this._setPositionRelative();
        }
        if (this.options.addClasses){
            this.element.addClass("ui-draggable");
        }
        if (this.options.disabled){
            this.element.addClass("ui-draggable-disabled");
        }
        this._setHandleClassName();

        this._mouseInit();
    },

    _setOption: function( key, value ) {
        this._super( key, value );
        if ( key === "handle" ) {
            this._removeHandleClassName();
            this._setHandleClassName();
        }
    },

    _destroy: function() {
        if ( ( this.helper || this.element ).is( ".ui-draggable-dragging" ) ) {
            this.destroyOnClear = true;
            return;
        }
        this.element.removeClass( "ui-draggable ui-draggable-dragging ui-draggable-disabled" );
        this._removeHandleClassName();
        this._mouseDestroy();
    },
    
    destroy:function(){
    	this._destroy();
    },

    _mouseCapture: function(event) {
        var o = this.options;

        this._blurActiveElement( event );

        // among others, prevent a drag on a resizable-handle
        if (this.helper || o.disabled || $(event.target).closest(".ui-resizable-handle").length > 0) {
            return false;
        }

        //Quit if we're not on a valid handle
        this.handle = this._getHandle(event);
        if (!this.handle) {
            return false;
        }

        this._blockFrames( o.iframeFix === true ? "iframe" : o.iframeFix );

        return true;

    },

    _blockFrames: function( selector ) {
        this.iframeBlocks = this.document.find( selector ).map(function() {
            var iframe = $( this );

            return $( "<div>" )
                .css( "position", "absolute" )
                .appendTo( iframe.parent() )
                .outerWidth( iframe.outerWidth() )
                .outerHeight( iframe.outerHeight() )
                .offset( iframe.offset() )[ 0 ];
        });
    },

    _unblockFrames: function() {
        if ( this.iframeBlocks ) {
            this.iframeBlocks.remove();
            delete this.iframeBlocks;
        }
    },

    _blurActiveElement: function( event ) {
        var document = this.document[ 0 ];

        // Only need to blur if the event occurred on the draggable itself, see #10527
        if ( !this.handleElement.is( event.target ) ) {
            return;
        }

        // support: IE9
        // IE9 throws an "Unspecified error" accessing document.activeElement from an <iframe>
        try {

            // Support: IE9, IE10
            // If the <body> is blurred, IE will switch windows, see #9520
            if ( document.activeElement && document.activeElement.nodeName.toLowerCase() !== "body" ) {

                // Blur any element that currently has focus, see #4261
                $( document.activeElement ).blur();
            }
        } catch ( error ) {}
    },

    _mouseStart: function(event) {

        var o = this.options;

        //Create and append the visible helper
        this.helper = this._createHelper(event);

        this.helper.addClass("ui-draggable-dragging");

        //Cache the helper size
        this._cacheHelperProportions();

        //If ddmanager is used for droppables, set the global draggable
        if ($.ae.ddmanager) {
            $.ae.ddmanager.current = this;
        }

        /*
         * - Position generation -
         * This block generates everything position related - it's the core of draggables.
         */

        //Cache the margins of the original element
        this._cacheMargins();

        //Store the helper's css position
        this.cssPosition = this.helper.css( "position" );
        this.scrollParent = this.helper.scrollParent( true );
        this.offsetParent = this.helper.offsetParent();
        this.hasFixedAncestor = this.helper.parents().filter(function() {
            return $( this ).css( "position" ) === "fixed";
        }).length > 0;

        //The element's absolute position on the page minus margins
        this.positionAbs = this.element.offset();
        this._refreshOffsets( event );

        //Generate the original position
        this.originalPosition = this.position = this._generatePosition( event, false );
        this.originalPageX = event.pageX;
        this.originalPageY = event.pageY;

        //Adjust the mouse offset relative to the helper if "cursorAt" is supplied
        (o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

        //Set a containment if given in the options
        this._setContainment();

        //Trigger event + callbacks
        if (this._trigger("start", event) === false) {
            this._clear();
            return false;
        }

        //Recache the helper size
        this._cacheHelperProportions();

        //Prepare the droppable offsets
        if ($.ae.ddmanager && !o.dropBehaviour) {
            $.ae.ddmanager.prepareOffsets(this, event);
        }

        // Reset helper's right/bottom css if they're set and set explicit width/height instead
        // as this prevents resizing of elements with right/bottom set (see #7772)
        this._normalizeRightBottom();

        this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its correct position

        //If the ddmanager is used for droppables, inform the manager that dragging has started (see #5003)
        if ( $.ae.ddmanager ) {
            $.ae.ddmanager.dragStart(this, event);
        }

        return true;
    },

    _refreshOffsets: function( event ) {
        this.offset = {
            top: this.positionAbs.top - this.margins.top,
            left: this.positionAbs.left - this.margins.left,
            scroll: false,
            parent: this._getParentOffset(),
            relative: this._getRelativeOffset()
        };

        this.offset.click = {
            left: event.pageX - this.offset.left,
            top: event.pageY - this.offset.top
        };
    },

    _mouseDrag: function(event, noPropagation) {
        // reset any necessary cached properties (see #5009)
        if ( this.hasFixedAncestor ) {
            this.offset.parent = this._getParentOffset();
        }

        //Compute the helpers position
        this.position = this._generatePosition( event, true );
        this.positionAbs = this._convertPositionTo("absolute");

        //Call plugins and callbacks and use the resulting position if something is returned
        if (!noPropagation) {
            var ui = this._uiHash();
            if (this._trigger("drag", event, ui) === false) {
                this._mouseUp({});
                return false;
            }
            this.position = ui.position;
        }

        this.helper[ 0 ].style.left = this.position.left + "px";
        this.helper[ 0 ].style.top = this.position.top + "px";

        if ($.ae.ddmanager) {
            $.ae.ddmanager.drag(this, event);
        }

        return false;
    },

    _mouseStop: function(event) {

        //If we are using droppables, inform the manager about the drop
        var that = this,
            dropped = false;
        if ($.ae.ddmanager && !this.options.dropBehaviour) {
            dropped = $.ae.ddmanager.drop(this, event);
        }

        //if a drop comes from outside (a sortable)
        if (this.dropped) {
            dropped = this.dropped;
            this.dropped = false;
        }

        if ((this.options.revert === "invalid" && !dropped) || (this.options.revert === "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
            $(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
                if (that._trigger("stop", event) !== false) {
                    that._clear();
                }
            });
        } else {
            if (this._trigger("stop", event) !== false) {
                this._clear();
            }
        }

        return false;
    },

    _mouseUp: function( event ) {
        this._unblockFrames();

        //If the ddmanager is used for droppables, inform the manager that dragging has stopped (see #5003)
        if ( $.ae.ddmanager ) {
            $.ae.ddmanager.dragStop(this, event);
        }

        // Only need to focus if the event occurred on the draggable itself, see #10527
        if ( this.handleElement.is( event.target ) ) {
            // The interaction is over; whether or not the click resulted in a drag, focus the element
            this.element.focus();
        }

        return $.ae.aeMouse.prototype._mouseUp.call(this, event);
    },

    cancel: function() {

        if (this.helper.is(".ui-draggable-dragging")) {
            this._mouseUp({});
        } else {
            this._clear();
        }

        return this;

    },

    _getHandle: function(event) {
        return this.options.handle ?
            !!$( event.target ).closest( this.element.find( this.options.handle ) ).length :
            true;
    },

    _setHandleClassName: function() {
        this.handleElement = this.options.handle ?
            this.element.find( this.options.handle ) : this.element;
        this.handleElement.addClass( "ui-draggable-handle" );
    },

    _removeHandleClassName: function() {
        this.handleElement.removeClass( "ui-draggable-handle" );
    },

    _createHelper: function(event) {

        var o = this.options,
            helperIsFunction = $.isFunction( o.helper ),
            helper = helperIsFunction ?
                $( o.helper.apply( this.element[ 0 ], [ event ] ) ) :
                ( o.helper === "clone" ?
                    this.element.clone().removeAttr( "id" ) :
                    this.element );

        if (!helper.parents("body").length) {
            helper.appendTo((o.appendTo === "parent" ? this.element[0].parentNode : o.appendTo));
        }

        // http://bugs.jqueryui.com/ticket/9446
        // a helper function can return the original element
        // which wouldn't have been set to relative in _create
        if ( helperIsFunction && helper[ 0 ] === this.element[ 0 ] ) {
            this._setPositionRelative();
        }

        if (helper[0] !== this.element[0] && !(/(fixed|absolute)/).test(helper.css("position"))) {
            helper.css("position", "absolute");
        }

        return helper;

    },

    _setPositionRelative: function() {
        if ( !( /^(?:r|a|f)/ ).test( this.element.css( "position" ) ) ) {
            this.element[ 0 ].style.position = "relative";
        }
    },

    _adjustOffsetFromHelper: function(obj) {
        if (typeof obj === "string") {
            obj = obj.split(" ");
        }
        if ($.isArray(obj)) {
            obj = { left: +obj[0], top: +obj[1] || 0 };
        }
        if ("left" in obj) {
            this.offset.click.left = obj.left + this.margins.left;
        }
        if ("right" in obj) {
            this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
        }
        if ("top" in obj) {
            this.offset.click.top = obj.top + this.margins.top;
        }
        if ("bottom" in obj) {
            this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
        }
    },

    _isRootNode: function( element ) {
        return ( /(html|body)/i ).test( element.tagName ) || element === this.document[ 0 ];
    },

    _getParentOffset: function() {

        //Get the offsetParent and cache its position
        var po = this.offsetParent.offset(),
            document = this.document[ 0 ];

        // This is a special case where we need to modify a offset calculated on start, since the following happened:
        // 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
        // 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
        //    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
        if (this.cssPosition === "absolute" && this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
            po.left += this.scrollParent.scrollLeft();
            po.top += this.scrollParent.scrollTop();
        }

        if ( this._isRootNode( this.offsetParent[ 0 ] ) ) {
            po = { top: 0, left: 0 };
        }

        return {
            top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
            left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
        };

    },

    _getRelativeOffset: function() {
        if ( this.cssPosition !== "relative" ) {
            return { top: 0, left: 0 };
        }

        var p = this.element.position(),
            scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] );

        return {
            top: p.top - ( parseInt(this.helper.css( "top" ), 10) || 0 ) + ( !scrollIsRootNode ? this.scrollParent.scrollTop() : 0 ),
            left: p.left - ( parseInt(this.helper.css( "left" ), 10) || 0 ) + ( !scrollIsRootNode ? this.scrollParent.scrollLeft() : 0 )
        };

    },

    _cacheMargins: function() {
        this.margins = {
            left: (parseInt(this.element.css("marginLeft"), 10) || 0),
            top: (parseInt(this.element.css("marginTop"), 10) || 0),
            right: (parseInt(this.element.css("marginRight"), 10) || 0),
            bottom: (parseInt(this.element.css("marginBottom"), 10) || 0)
        };
    },

    _cacheHelperProportions: function() {
        this.helperProportions = {
            width: this.helper.outerWidth(),
            height: this.helper.outerHeight()
        };
    },

    _setContainment: function() {

        var isUserScrollable, c, ce,
            o = this.options,
            document = this.document[ 0 ];

        this.relativeContainer = null;

        if ( !o.containment ) {
            this.containment = null;
            return;
        }

        if ( o.containment === "window" ) {
            this.containment = [
                $( window ).scrollLeft() - this.offset.relative.left - this.offset.parent.left,
                $( window ).scrollTop() - this.offset.relative.top - this.offset.parent.top,
                $( window ).scrollLeft() + $( window ).width() - this.helperProportions.width - this.margins.left,
                $( window ).scrollTop() + ( $( window ).height() || document.body.parentNode.scrollHeight ) - this.helperProportions.height - this.margins.top
            ];
            return;
        }

        if ( o.containment === "document") {
            this.containment = [
                0,
                0,
                $( document ).width() - this.helperProportions.width - this.margins.left,
                ( $( document ).height() || document.body.parentNode.scrollHeight ) - this.helperProportions.height - this.margins.top
            ];
            return;
        }

        if ( o.containment.constructor === Array ) {
            this.containment = o.containment;
            return;
        }

        if ( o.containment === "parent" ) {
            o.containment = this.helper[ 0 ].parentNode;
        }

        c = $( o.containment );
        ce = c[ 0 ];

        if ( !ce ) {
            return;
        }

        isUserScrollable = /(scroll|auto)/.test( c.css( "overflow" ) );

        this.containment = [
            ( parseInt( c.css( "borderLeftWidth" ), 10 ) || 0 ) + ( parseInt( c.css( "paddingLeft" ), 10 ) || 0 ),
            ( parseInt( c.css( "borderTopWidth" ), 10 ) || 0 ) + ( parseInt( c.css( "paddingTop" ), 10 ) || 0 ),
            ( isUserScrollable ? Math.max( ce.scrollWidth, ce.offsetWidth ) : ce.offsetWidth ) -
            ( parseInt( c.css( "borderRightWidth" ), 10 ) || 0 ) -
            ( parseInt( c.css( "paddingRight" ), 10 ) || 0 ) -
            this.helperProportions.width -
            this.margins.left -
            this.margins.right,
            ( isUserScrollable ? Math.max( ce.scrollHeight, ce.offsetHeight ) : ce.offsetHeight ) -
            ( parseInt( c.css( "borderBottomWidth" ), 10 ) || 0 ) -
            ( parseInt( c.css( "paddingBottom" ), 10 ) || 0 ) -
            this.helperProportions.height -
            this.margins.top -
            this.margins.bottom
        ];
        this.relativeContainer = c;
    },

    _convertPositionTo: function(d, pos) {

        if (!pos) {
            pos = this.position;
        }

        var mod = d === "absolute" ? 1 : -1,
            scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] );

        return {
            top: (
            pos.top	+																// The absolute mouse position
            this.offset.relative.top * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
            this.offset.parent.top * mod -										// The offsetParent's offset without borders (offset + border)
            ( ( this.cssPosition === "fixed" ? -this.offset.scroll.top : ( scrollIsRootNode ? 0 : this.offset.scroll.top ) ) * mod)
            ),
            left: (
            pos.left +																// The absolute mouse position
            this.offset.relative.left * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
            this.offset.parent.left * mod	-										// The offsetParent's offset without borders (offset + border)
            ( ( this.cssPosition === "fixed" ? -this.offset.scroll.left : ( scrollIsRootNode ? 0 : this.offset.scroll.left ) ) * mod)
            )
        };

    },

    _generatePosition: function( event, constrainPosition ) {

        var containment, co, top, left,
            o = this.options,
            scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] ),
            pageX = event.pageX,
            pageY = event.pageY;

        // Cache the scroll
        if ( !scrollIsRootNode || !this.offset.scroll ) {
            this.offset.scroll = {
                top: this.scrollParent.scrollTop(),
                left: this.scrollParent.scrollLeft()
            };
        }

        /*
         * - Position constraining -
         * Constrain the position to a mix of grid, containment.
         */

        // If we are not dragging yet, we won't check for options
        if ( constrainPosition ) {
            if ( this.containment ) {
                if ( this.relativeContainer ){
                    co = this.relativeContainer.offset();
                    containment = [
                        this.containment[ 0 ] + co.left,
                        this.containment[ 1 ] + co.top,
                        this.containment[ 2 ] + co.left,
                        this.containment[ 3 ] + co.top
                    ];
                } else {
                    containment = this.containment;
                }

                if (event.pageX - this.offset.click.left < containment[0]) {
                    pageX = containment[0] + this.offset.click.left;
                }
                if (event.pageY - this.offset.click.top < containment[1]) {
                    pageY = containment[1] + this.offset.click.top;
                }
                if (event.pageX - this.offset.click.left > containment[2]) {
                    pageX = containment[2] + this.offset.click.left;
                }
                if (event.pageY - this.offset.click.top > containment[3]) {
                    pageY = containment[3] + this.offset.click.top;
                }
            }

            if (o.grid) {
                //Check for grid elements set to 0 to prevent divide by 0 error causing invalid argument errors in IE (see ticket #6950)
                top = o.grid[1] ? this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY;
                pageY = containment ? ((top - this.offset.click.top >= containment[1] || top - this.offset.click.top > containment[3]) ? top : ((top - this.offset.click.top >= containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

                left = o.grid[0] ? this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0] : this.originalPageX;
                pageX = containment ? ((left - this.offset.click.left >= containment[0] || left - this.offset.click.left > containment[2]) ? left : ((left - this.offset.click.left >= containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
            }

            if ( o.axis === "y" ) {
                pageX = this.originalPageX;
            }

            if ( o.axis === "x" ) {
                pageY = this.originalPageY;
            }
        }

        return {
            top: (
            pageY -																	// The absolute mouse position
            this.offset.click.top	-												// Click offset (relative to the element)
            this.offset.relative.top -												// Only for relative positioned nodes: Relative offset from element to offset parent
            this.offset.parent.top +												// The offsetParent's offset without borders (offset + border)
            ( this.cssPosition === "fixed" ? -this.offset.scroll.top : ( scrollIsRootNode ? 0 : this.offset.scroll.top ) )
            ),
            left: (
            pageX -																	// The absolute mouse position
            this.offset.click.left -												// Click offset (relative to the element)
            this.offset.relative.left -												// Only for relative positioned nodes: Relative offset from element to offset parent
            this.offset.parent.left +												// The offsetParent's offset without borders (offset + border)
            ( this.cssPosition === "fixed" ? -this.offset.scroll.left : ( scrollIsRootNode ? 0 : this.offset.scroll.left ) )
            )
        };

    },

    _clear: function() {
        this.helper.removeClass("ui-draggable-dragging");
        if (this.helper[0] !== this.element[0] && !this.cancelHelperRemoval) {
            this.helper.remove();
        }
        this.helper = null;
        this.cancelHelperRemoval = false;
        if ( this.destroyOnClear ) {
            this.destroy();
        }
    },

    _normalizeRightBottom: function() {
        if ( this.options.axis !== "y" && this.helper.css( "right" ) !== "auto" ) {
            this.helper.width( this.helper.width() );
            this.helper.css( "right", "auto" );
        }
        if ( this.options.axis !== "x" && this.helper.css( "bottom" ) !== "auto" ) {
            this.helper.height( this.helper.height() );
            this.helper.css( "bottom", "auto" );
        }
    },

    // From now on bulk stuff - mainly helpers

    _trigger: function( type, event, ui ) {
        ui = ui || this._uiHash();
        $.ae.plugin.call( this, type, [ event, ui, this ], true );

        // Absolute position and offset (see #6884 ) have to be recalculated after plugins
        if ( /^(drag|start|stop)/.test( type ) ) {
            this.positionAbs = this._convertPositionTo( "absolute" );
            ui.offset = this.positionAbs;
        }
        return $.AEWidget.prototype._trigger.call( this, type, event, ui );
    },

    plugins: {},

    _uiHash: function() {
        return {
            helper: this.helper,
            position: this.position,
            originalPosition: this.originalPosition,
            offset: this.positionAbs
        };
    }

});

$.ae.plugin.add( "aeDraggable", "connectToSortable", {
    start: function( event, ui, draggable ) {
        var uiSortable = $.extend( {}, ui, {
            item: draggable.element
        });

        draggable.sortables = [];
        $( draggable.options.connectToSortable ).each(function() {
            var sortable = $( this ).aeSortable( "instance" );

            if ( sortable && !sortable.options.disabled ) {
                draggable.sortables.push( sortable );

                // refreshPositions is called at drag start to refresh the containerCache
                // which is used in drag. This ensures it's initialized and synchronized
                // with any changes that might have happened on the page since initialization.
                sortable.refreshPositions();
                sortable._trigger("activate", event, uiSortable);
            }
        });
    },
    stop: function( event, ui, draggable ) {
        var uiSortable = $.extend( {}, ui, {
            item: draggable.element
        });

        draggable.cancelHelperRemoval = false;

        $.each( draggable.sortables, function() {
            var sortable = this;

            if ( sortable.isOver ) {
                sortable.isOver = 0;

                // Allow this sortable to handle removing the helper
                draggable.cancelHelperRemoval = true;
                sortable.cancelHelperRemoval = false;

                // Use _storedCSS To restore properties in the sortable,
                // as this also handles revert (#9675) since the draggable
                // may have modified them in unexpected ways (#8809)
                sortable._storedCSS = {
                    position: sortable.placeholder.css( "position" ),
                    top: sortable.placeholder.css( "top" ),
                    left: sortable.placeholder.css( "left" )
                };

                sortable._mouseStop(event);

                // Once drag has ended, the sortable should return to using
                // its original helper, not the shared helper from draggable
                sortable.options.helper = sortable.options._helper;
            } else {
                // Prevent this Sortable from removing the helper.
                // However, don't set the draggable to remove the helper
                // either as another connected Sortable may yet handle the removal.
                sortable.cancelHelperRemoval = true;

                sortable._trigger( "deactivate", event, uiSortable );
            }
        });
    },
    drag: function( event, ui, draggable ) {
        $.each( draggable.sortables, function() {
            var innermostIntersecting = false,
                sortable = this;

            // Copy over variables that sortable's _intersectsWith uses
            sortable.positionAbs = draggable.positionAbs;
            sortable.helperProportions = draggable.helperProportions;
            sortable.offset.click = draggable.offset.click;

            if ( sortable._intersectsWith( sortable.containerCache ) ) {
                innermostIntersecting = true;

                $.each( draggable.sortables, function() {
                    // Copy over variables that sortable's _intersectsWith uses
                    this.positionAbs = draggable.positionAbs;
                    this.helperProportions = draggable.helperProportions;
                    this.offset.click = draggable.offset.click;

                    if ( this !== sortable &&
                        this._intersectsWith( this.containerCache ) &&
                        $.contains( sortable.element[ 0 ], this.element[ 0 ] ) ) {
                        innermostIntersecting = false;
                    }

                    return innermostIntersecting;
                });
            }

            if ( innermostIntersecting ) {
                // If it intersects, we use a little isOver variable and set it once,
                // so that the move-in stuff gets fired only once.
                if ( !sortable.isOver ) {
                    sortable.isOver = 1;

                    // Store draggable's parent in case we need to reappend to it later.
                    draggable._parent = ui.helper.parent();

                    sortable.currentItem = ui.helper
                        .appendTo( sortable.element )
                        .data( "ui-sortable-item", true );

                    // Store helper option to later restore it
                    sortable.options._helper = sortable.options.helper;

                    sortable.options.helper = function() {
                        return ui.helper[ 0 ];
                    };

                    // Fire the start events of the sortable with our passed browser event,
                    // and our own helper (so it doesn't create a new one)
                    event.target = sortable.currentItem[ 0 ];
                    sortable._mouseCapture( event, true );
                    sortable._mouseStart( event, true, true );

                    // Because the browser event is way off the new appended portlet,
                    // modify necessary variables to reflect the changes
                    sortable.offset.click.top = draggable.offset.click.top;
                    sortable.offset.click.left = draggable.offset.click.left;
                    sortable.offset.parent.left -= draggable.offset.parent.left -
                    sortable.offset.parent.left;
                    sortable.offset.parent.top -= draggable.offset.parent.top -
                    sortable.offset.parent.top;

                    draggable._trigger( "toSortable", event );

                    // Inform draggable that the helper is in a valid drop zone,
                    // used solely in the revert option to handle "valid/invalid".
                    draggable.dropped = sortable.element;

                    // Need to refreshPositions of all sortables in the case that
                    // adding to one sortable changes the location of the other sortables (#9675)
                    $.each( draggable.sortables, function() {
                        this.refreshPositions();
                    });

                    // hack so receive/update callbacks work (mostly)
                    draggable.currentItem = draggable.element;
                    sortable.fromOutside = draggable;
                }

                if ( sortable.currentItem ) {
                    sortable._mouseDrag( event );
                    // Copy the sortable's position because the draggable's can potentially reflect
                    // a relative position, while sortable is always absolute, which the dragged
                    // element has now become. (#8809)
                    ui.position = sortable.position;
                }
            } else {
                // If it doesn't intersect with the sortable, and it intersected before,
                // we fake the drag stop of the sortable, but make sure it doesn't remove
                // the helper by using cancelHelperRemoval.
                if ( sortable.isOver ) {

                    sortable.isOver = 0;
                    sortable.cancelHelperRemoval = true;

                    // Calling sortable's mouseStop would trigger a revert,
                    // so revert must be temporarily false until after mouseStop is called.
                    sortable.options._revert = sortable.options.revert;
                    sortable.options.revert = false;

                    sortable._trigger( "out", event, sortable._uiHash( sortable ) );
                    sortable._mouseStop( event, true );

                    // restore sortable behaviors that were modfied
                    // when the draggable entered the sortable area (#9481)
                    sortable.options.revert = sortable.options._revert;
                    sortable.options.helper = sortable.options._helper;

                    if ( sortable.placeholder ) {
                        sortable.placeholder.remove();
                    }

                    // Restore and recalculate the draggable's offset considering the sortable
                    // may have modified them in unexpected ways. (#8809, #10669)
                    ui.helper.appendTo( draggable._parent );
                    draggable._refreshOffsets( event );
                    ui.position = draggable._generatePosition( event, true );

                    draggable._trigger( "fromSortable", event );

                    // Inform draggable that the helper is no longer in a valid drop zone
                    draggable.dropped = false;

                    // Need to refreshPositions of all sortables just in case removing
                    // from one sortable changes the location of other sortables (#9675)
                    $.each( draggable.sortables, function() {
                        this.refreshPositions();
                    });
                }
            }
        });
    }
});

$.ae.plugin.add("aeDraggable", "cursor", {
    start: function( event, ui, instance ) {
        var t = $( "body" ),
            o = instance.options;

        if (t.css("cursor")) {
            o._cursor = t.css("cursor");
        }
        t.css("cursor", o.cursor);
    },
    stop: function( event, ui, instance ) {
        var o = instance.options;
        if (o._cursor) {
            $("body").css("cursor", o._cursor);
        }
    }
});

$.ae.plugin.add("aeDraggable", "opacity", {
    start: function( event, ui, instance ) {
        var t = $( ui.helper ),
            o = instance.options;
        if (t.css("opacity")) {
            o._opacity = t.css("opacity");
        }
        t.css("opacity", o.opacity);
    },
    stop: function( event, ui, instance ) {
        var o = instance.options;
        if (o._opacity) {
            $(ui.helper).css("opacity", o._opacity);
        }
    }
});

$.ae.plugin.add("aeDraggable", "scroll", {
    start: function( event, ui, i ) {
        if ( !i.scrollParentNotHidden ) {
            i.scrollParentNotHidden = i.helper.scrollParent( false );
        }

        if ( i.scrollParentNotHidden[ 0 ] !== i.document[ 0 ] && i.scrollParentNotHidden[ 0 ].tagName !== "HTML" ) {
            i.overflowOffset = i.scrollParentNotHidden.offset();
        }
    },
    drag: function( event, ui, i  ) {

        var o = i.options,
            scrolled = false,
            scrollParent = i.scrollParentNotHidden[ 0 ],
            document = i.document[ 0 ];

        if ( scrollParent !== document && scrollParent.tagName !== "HTML" ) {
            if ( !o.axis || o.axis !== "x" ) {
                if ( ( i.overflowOffset.top + scrollParent.offsetHeight ) - event.pageY < o.scrollSensitivity ) {
                    scrollParent.scrollTop = scrolled = scrollParent.scrollTop + o.scrollSpeed;
                } else if ( event.pageY - i.overflowOffset.top < o.scrollSensitivity ) {
                    scrollParent.scrollTop = scrolled = scrollParent.scrollTop - o.scrollSpeed;
                }
            }

            if ( !o.axis || o.axis !== "y" ) {
                if ( ( i.overflowOffset.left + scrollParent.offsetWidth ) - event.pageX < o.scrollSensitivity ) {
                    scrollParent.scrollLeft = scrolled = scrollParent.scrollLeft + o.scrollSpeed;
                } else if ( event.pageX - i.overflowOffset.left < o.scrollSensitivity ) {
                    scrollParent.scrollLeft = scrolled = scrollParent.scrollLeft - o.scrollSpeed;
                }
            }

        } else {

            if (!o.axis || o.axis !== "x") {
                if (event.pageY - $(document).scrollTop() < o.scrollSensitivity) {
                    scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
                } else if ($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity) {
                    scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
                }
            }

            if (!o.axis || o.axis !== "y") {
                if (event.pageX - $(document).scrollLeft() < o.scrollSensitivity) {
                    scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
                } else if ($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity) {
                    scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
                }
            }

        }

        if (scrolled !== false && $.ae.ddmanager && !o.dropBehaviour) {
            $.ae.ddmanager.prepareOffsets(i, event);
        }

    }
});

$.ae.plugin.add("aeDraggable", "snap", {
    start: function( event, ui, i ) {

        var o = i.options;

        i.snapElements = [];

        $(o.snap.constructor !== String ? ( o.snap.items || ":data(ui-draggable)" ) : o.snap).each(function() {
            var $t = $(this),
                $o = $t.offset();
            if (this !== i.element[0]) {
                i.snapElements.push({
                    item: this,
                    width: $t.outerWidth(), height: $t.outerHeight(),
                    top: $o.top, left: $o.left
                });
            }
        });

    },
    drag: function( event, ui, inst ) {

        var ts, bs, ls, rs, l, r, t, b, i, first,
            o = inst.options,
            d = o.snapTolerance,
            x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
            y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;

        for (i = inst.snapElements.length - 1; i >= 0; i--){

            l = inst.snapElements[i].left - inst.margins.left;
            r = l + inst.snapElements[i].width;
            t = inst.snapElements[i].top - inst.margins.top;
            b = t + inst.snapElements[i].height;

            if ( x2 < l - d || x1 > r + d || y2 < t - d || y1 > b + d || !$.contains( inst.snapElements[ i ].item.ownerDocument, inst.snapElements[ i ].item ) ) {
                if (inst.snapElements[i].snapping) {
                    (inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
                }
                inst.snapElements[i].snapping = false;
                continue;
            }

            if (o.snapMode !== "inner") {
                ts = Math.abs(t - y2) <= d;
                bs = Math.abs(b - y1) <= d;
                ls = Math.abs(l - x2) <= d;
                rs = Math.abs(r - x1) <= d;
                if (ts) {
                    ui.position.top = inst._convertPositionTo("relative", { top: t - inst.helperProportions.height, left: 0 }).top;
                }
                if (bs) {
                    ui.position.top = inst._convertPositionTo("relative", { top: b, left: 0 }).top;
                }
                if (ls) {
                    ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l - inst.helperProportions.width }).left;
                }
                if (rs) {
                    ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r }).left;
                }
            }

            first = (ts || bs || ls || rs);

            if (o.snapMode !== "outer") {
                ts = Math.abs(t - y1) <= d;
                bs = Math.abs(b - y2) <= d;
                ls = Math.abs(l - x1) <= d;
                rs = Math.abs(r - x2) <= d;
                if (ts) {
                    ui.position.top = inst._convertPositionTo("relative", { top: t, left: 0 }).top;
                }
                if (bs) {
                    ui.position.top = inst._convertPositionTo("relative", { top: b - inst.helperProportions.height, left: 0 }).top;
                }
                if (ls) {
                    ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l }).left;
                }
                if (rs) {
                    ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r - inst.helperProportions.width }).left;
                }
            }

            if (!inst.snapElements[i].snapping && (ts || bs || ls || rs || first)) {
                (inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
            }
            inst.snapElements[i].snapping = (ts || bs || ls || rs || first);

        }

    }
});

$.ae.plugin.add("aeDraggable", "stack", {
    start: function( event, ui, instance ) {
        var min,
            o = instance.options,
            group = $.makeArray($(o.stack)).sort(function(a, b) {
                return (parseInt($(a).css("zIndex"), 10) || 0) - (parseInt($(b).css("zIndex"), 10) || 0);
            });

        if (!group.length) { return; }

        min = parseInt($(group[0]).css("zIndex"), 10) || 0;
        $(group).each(function(i) {
            $(this).css("zIndex", min + i);
        });
        this.css("zIndex", (min + group.length));
    }
});

$.ae.plugin.add("aeDraggable", "zIndex", {
    start: function( event, ui, instance ) {
        var t = $( ui.helper ),
            o = instance.options;

        if (t.css("zIndex")) {
            o._zIndex = t.css("zIndex");
        }
        t.css("zIndex", o.zIndex);
    },
    stop: function( event, ui, instance ) {
        var o = instance.options;

        if (o._zIndex) {
            $(ui.helper).css("zIndex", o._zIndex);
        }
    }
});

var aeDraggable = $.ae.aeDraggable;
});
define('ui-droppable',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
/*
 * $Id: ui-droppable.js
 * Depends:
 *	ui-core.js
 *  ui-widget.js
 *	ui-mouse.js
 *  ui-draggable.js
 */
$.aeWidget( "ae.aeDroppable", {
	version: "1.11.4",
	widgetEventPrefix: "drop",
	options: {
		accept: "*",
		activeClass: false,
		addClasses: true,
		greedy: false,
		hoverClass: false,
		scope: "default",
		tolerance: "intersect",

		// callbacks
		activate: null,
		deactivate: null,
		drop: null,
		out: null,
		over: null
	},
	_create: function() {

		var proportions,
			o = this.options,
			accept = o.accept;

		this.isover = false;
		this.isout = true;

		this.accept = $.isFunction( accept ) ? accept : function( d ) {
			return d.is( accept );
		};

		this.proportions = function( /* valueToWrite */ ) {
			if ( arguments.length ) {
				// Store the droppable's proportions
				proportions = arguments[ 0 ];
			} else {
				// Retrieve or derive the droppable's proportions
				return proportions ?
					proportions :
					proportions = {
						width: this.element[ 0 ].offsetWidth,
						height: this.element[ 0 ].offsetHeight
					};
			}
		};

		this._addToManager( o.scope );

		o.addClasses && this.element.addClass( "ui-droppable" );

	},

	_addToManager: function( scope ) {
		// Add the reference and positions to the manager
		$.ae.ddmanager.droppables[ scope ] = $.ae.ddmanager.droppables[ scope ] || [];
		$.ae.ddmanager.droppables[ scope ].push( this );
	},

	_splice: function( drop ) {
		var i = 0;
		for ( ; i < drop.length; i++ ) {
			if ( drop[ i ] === this ) {
				drop.splice( i, 1 );
			}
		}
	},

	_destroy: function() {
		var drop = $.ae.ddmanager.droppables[ this.options.scope ];

		this._splice( drop );

		this.element.removeClass( "ui-droppable ui-droppable-disabled" );
	},

	_setOption: function( key, value ) {

		if ( key === "accept" ) {
			this.accept = $.isFunction( value ) ? value : function( d ) {
				return d.is( value );
			};
		} else if ( key === "scope" ) {
			var drop = $.ae.ddmanager.droppables[ this.options.scope ];

			this._splice( drop );
			this._addToManager( value );
		}

		this._super( key, value );
	},

	_activate: function( event ) {
		var draggable = $.ae.ddmanager.current;
		if ( this.options.activeClass ) {
			this.element.addClass( this.options.activeClass );
		}
		if ( draggable ){
			this._trigger( "activate", event, this.ui( draggable ) );
		}
	},

	_deactivate: function( event ) {
		var draggable = $.ae.ddmanager.current;
		if ( this.options.activeClass ) {
			this.element.removeClass( this.options.activeClass );
		}
		if ( draggable ){
			this._trigger( "deactivate", event, this.ui( draggable ) );
		}
	},

	_over: function( event ) {

		var draggable = $.ae.ddmanager.current;

		// Bail if draggable and droppable are same element
		if ( !draggable || ( draggable.currentItem || draggable.element )[ 0 ] === this.element[ 0 ] ) {
			return;
		}

		if ( this.accept.call( this.element[ 0 ], ( draggable.currentItem || draggable.element ) ) ) {
			if ( this.options.hoverClass ) {
				this.element.addClass( this.options.hoverClass );
			}
			this._trigger( "over", event, this.ui( draggable ) );
		}

	},

	_out: function( event ) {

		var draggable = $.ae.ddmanager.current;

		// Bail if draggable and droppable are same element
		if ( !draggable || ( draggable.currentItem || draggable.element )[ 0 ] === this.element[ 0 ] ) {
			return;
		}

		if ( this.accept.call( this.element[ 0 ], ( draggable.currentItem || draggable.element ) ) ) {
			if ( this.options.hoverClass ) {
				this.element.removeClass( this.options.hoverClass );
			}
			this._trigger( "out", event, this.ui( draggable ) );
		}

	},

	_drop: function( event, custom ) {

		var draggable = custom || $.ae.ddmanager.current,
			childrenIntersection = false;

		// Bail if draggable and droppable are same element
		if ( !draggable || ( draggable.currentItem || draggable.element )[ 0 ] === this.element[ 0 ] ) {
			return false;
		}

		this.element.find( ":data(ui-droppable)" ).not( ".ui-draggable-dragging" ).each(function() {
			var inst = $( this ).droppable( "instance" );
			if (
				inst.options.greedy &&
				!inst.options.disabled &&
				inst.options.scope === draggable.options.scope &&
				inst.accept.call( inst.element[ 0 ], ( draggable.currentItem || draggable.element ) ) &&
				$.ae.intersect( draggable, $.extend( inst, { offset: inst.element.offset() } ), inst.options.tolerance, event )
			) { childrenIntersection = true; return false; }
		});
		if ( childrenIntersection ) {
			return false;
		}

		if ( this.accept.call( this.element[ 0 ], ( draggable.currentItem || draggable.element ) ) ) {
			if ( this.options.activeClass ) {
				this.element.removeClass( this.options.activeClass );
			}
			if ( this.options.hoverClass ) {
				this.element.removeClass( this.options.hoverClass );
			}
			this._trigger( "drop", event, this.ui( draggable ) );
			return this.element;
		}

		return false;

	},

	ui: function( c ) {
		return {
			draggable: ( c.currentItem || c.element ),
			helper: c.helper,
			position: c.position,
			offset: c.positionAbs
		};
	}

});

$.ae.intersect = (function() {
	function isOverAxis( x, reference, size ) {
		return ( x >= reference ) && ( x < ( reference + size ) );
	}

	return function( draggable, droppable, toleranceMode, event ) {

		if ( !droppable.offset ) {
			return false;
		}

		var x1 = ( draggable.positionAbs || draggable.position.absolute ).left + draggable.margins.left,
			y1 = ( draggable.positionAbs || draggable.position.absolute ).top + draggable.margins.top,
			x2 = x1 + draggable.helperProportions.width,
			y2 = y1 + draggable.helperProportions.height,
			l = droppable.offset.left,
			t = droppable.offset.top,
			r = l + droppable.proportions().width,
			b = t + droppable.proportions().height;

		switch ( toleranceMode ) {
		case "fit":
			return ( l <= x1 && x2 <= r && t <= y1 && y2 <= b );
		case "intersect":
			return ( l < x1 + ( draggable.helperProportions.width / 2 ) && // Right Half
				x2 - ( draggable.helperProportions.width / 2 ) < r && // Left Half
				t < y1 + ( draggable.helperProportions.height / 2 ) && // Bottom Half
				y2 - ( draggable.helperProportions.height / 2 ) < b ); // Top Half
		case "pointer":
			return isOverAxis( event.pageY, t, droppable.proportions().height ) && isOverAxis( event.pageX, l, droppable.proportions().width );
		case "touch":
			return (
				( y1 >= t && y1 <= b ) || // Top edge touching
				( y2 >= t && y2 <= b ) || // Bottom edge touching
				( y1 < t && y2 > b ) // Surrounded vertically
			) && (
				( x1 >= l && x1 <= r ) || // Left edge touching
				( x2 >= l && x2 <= r ) || // Right edge touching
				( x1 < l && x2 > r ) // Surrounded horizontally
			);
		default:
			return false;
		}
	};
})();

/*
	This manager tracks offsets of draggables and droppables
*/
$.ae.ddmanager = {
	current: null,
	droppables: { "default": [] },
	prepareOffsets: function( t, event ) {

		var i, j,
			m = $.ae.ddmanager.droppables[ t.options.scope ] || [],
			type = event ? event.type : null, // workaround for #2317
			list = ( t.currentItem || t.element ).find( ":data(ui-droppable)" ).addBack();

		droppablesLoop: for ( i = 0; i < m.length; i++ ) {

			// No disabled and non-accepted
			if ( m[ i ].options.disabled || ( t && !m[ i ].accept.call( m[ i ].element[ 0 ], ( t.currentItem || t.element ) ) ) ) {
				continue;
			}

			// Filter out elements in the current dragged item
			for ( j = 0; j < list.length; j++ ) {
				if ( list[ j ] === m[ i ].element[ 0 ] ) {
					m[ i ].proportions().height = 0;
					continue droppablesLoop;
				}
			}

			m[ i ].visible = m[ i ].element.css( "display" ) !== "none";
			if ( !m[ i ].visible ) {
				continue;
			}

			// Activate the droppable if used directly from draggables
			if ( type === "mousedown" ) {
				m[ i ]._activate.call( m[ i ], event );
			}

			m[ i ].offset = m[ i ].element.offset();
			m[ i ].proportions({ width: m[ i ].element[ 0 ].offsetWidth, height: m[ i ].element[ 0 ].offsetHeight });

		}

	},
	drop: function( draggable, event ) {

		var dropped = false;
		// Create a copy of the droppables in case the list changes during the drop (#9116)
		$.each( ( $.ae.ddmanager.droppables[ draggable.options.scope ] || [] ).slice(), function() {

			if ( !this.options ) {
				return;
			}
			if ( !this.options.disabled && this.visible && $.ae.intersect( draggable, this, this.options.tolerance, event ) ) {
				dropped = this._drop.call( this, event ) || dropped;
			}

			if ( !this.options.disabled && this.visible && this.accept.call( this.element[ 0 ], ( draggable.currentItem || draggable.element ) ) ) {
				this.isout = true;
				this.isover = false;
				this._deactivate.call( this, event );
			}

		});
		return dropped;

	},
	dragStart: function( draggable, event ) {
		// Listen for scrolling so that if the dragging causes scrolling the position of the droppables can be recalculated (see #5003)
		draggable.element.parentsUntil( "body" ).bind( "scroll.droppable", function() {
			if ( !draggable.options.refreshPositions ) {
				$.ae.ddmanager.prepareOffsets( draggable, event );
			}
		});
	},
	drag: function( draggable, event ) {

		// If you have a highly dynamic page, you might try this option. It renders positions every time you move the mouse.
		if ( draggable.options.refreshPositions ) {
			$.ae.ddmanager.prepareOffsets( draggable, event );
		}

		// Run through all droppables and check their positions based on specific tolerance options
		$.each( $.ae.ddmanager.droppables[ draggable.options.scope ] || [], function() {

			if ( this.options.disabled || this.greedyChild || !this.visible ) {
				return;
			}

			var parentInstance, scope, parent,
				intersects = $.ae.intersect( draggable, this, this.options.tolerance, event ),
				c = !intersects && this.isover ? "isout" : ( intersects && !this.isover ? "isover" : null );
			if ( !c ) {
				return;
			}

			if ( this.options.greedy ) {
				// find droppable parents with same scope
				scope = this.options.scope;
				parent = this.element.parents( ":data(ui-droppable)" ).filter(function() {
					return $( this ).droppable( "instance" ).options.scope === scope;
				});

				if ( parent.length ) {
					parentInstance = $( parent[ 0 ] ).droppable( "instance" );
					parentInstance.greedyChild = ( c === "isover" );
				}
			}

			// we just moved into a greedy child
			if ( parentInstance && c === "isover" ) {
				parentInstance.isover = false;
				parentInstance.isout = true;
				parentInstance._out.call( parentInstance, event );
			}

			this[ c ] = true;
			this[c === "isout" ? "isover" : "isout"] = false;
			this[c === "isover" ? "_over" : "_out"].call( this, event );

			// we just moved out of a greedy child
			if ( parentInstance && c === "isout" ) {
				parentInstance.isout = false;
				parentInstance.isover = true;
				parentInstance._over.call( parentInstance, event );
			}
		});

	},
	dragStop: function( draggable, event ) {
		draggable.element.parentsUntil( "body" ).unbind( "scroll.droppable" );
		// Call prepareOffsets one final time since IE does not fire return scroll events when overflow was caused by drag (see #5003)
		if ( !draggable.options.refreshPositions ) {
			$.ae.ddmanager.prepareOffsets( draggable, event );
		}
	}
};

var aeDroppable = $.ae.aeDroppable;
});
define('ui-sortable',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
/*
 * $Id: ui-sortable.js
 * Depends:
 *	ui-core.js
 *  ui-widget.js
 *	ui-mouse.js
 */

var aeSortable = $.aeWidget("ae.aeSortable", $.ae.aeMouse, {
	version: "1.11.4",
	widgetEventPrefix: "sort",
	ready: false,
	options: {
		appendTo: "parent",
		axis: false,
		connectWith: false,
		containment: false,
		cursor: "auto",
		cursorAt: false,
		dropOnEmpty: true,
		forcePlaceholderSize: false,
		forceHelperSize: false,
		grid: false,
		handle: false,
		helper: "original",
		items: "> *",
		opacity: false,
		placeholder: false,
		revert: false,
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		scope: "default",
		tolerance: "intersect",
		zIndex: 1000,

		// callbacks
		activate: null,
		beforeStop: null,
		change: null,
		deactivate: null,
		out: null,
		over: null,
		receive: null,
		remove: null,
		sort: null,
		start: null,
		stop: null,
		update: null
	},

	_isOverAxis: function( x, reference, size ) {
		return ( x >= reference ) && ( x < ( reference + size ) );
	},

	_isFloating: function( item ) {
		return (/left|right/).test(item.css("float")) || (/inline|table-cell/).test(item.css("display"));
	},

	 _create: function() {
	        this.containerCache = {};
	        this.element.addClass("ui-sortable");

	        //Get the items
	        this.refresh();

	        //Let's determine the parent's offset
	        this.offset = this.element.offset();

	        //Initialize mouse events for interaction
	        this._mouseInit();

	        this._setHandleClassName();

	        //We're ready to go
	        this.ready = true;

	},


	_setOption: function( key, value ) {
		this._super( key, value );

		if ( key === "handle" ) {
			this._setHandleClassName();
		}
	},

	_setHandleClassName: function() {
		this.element.find( ".ui-sortable-handle" ).removeClass( "ui-sortable-handle" );
		$.each( this.items, function() {
			( this.instance.options.handle ?
				this.item.find( this.instance.options.handle ) : this.item )
				.addClass( "ui-sortable-handle" );
		});
	},

	_destroy: function() {
		this.element
			.removeClass( "ui-sortable ui-sortable-disabled" )
			.find( ".ui-sortable-handle" )
				.removeClass( "ui-sortable-handle" );
		this._mouseDestroy();

		for ( var i = this.items.length - 1; i >= 0; i-- ) {
			this.items[i].item.removeData(this.widgetName + "-item");
		}

		return this;
	},
	destroy: function() {
		this.destroy();
	},

	_mouseCapture: function(event, overrideHandle) {
		var currentItem = null,
			validHandle = false,
			that = this;

		if (this.reverting) {
			return false;
		}

		if(this.options.disabled || this.options.type === "static") {
			return false;
		}

		//We have to refresh the items data once first
		this._refreshItems(event);

		//Find out if the clicked node (or one of its parents) is a actual item in this.items
		$(event.target).parents().each(function() {
			if($.data(this, that.widgetName + "-item") === that) {
				currentItem = $(this);
				return false;
			}
		});
		if($.data(event.target, that.widgetName + "-item") === that) {
			currentItem = $(event.target);
		}

		if(!currentItem) {
			return false;
		}
		if(this.options.handle && !overrideHandle) {
			$(this.options.handle, currentItem).find("*").addBack().each(function() {
				if(this === event.target) {
					validHandle = true;
				}
			});
			if(!validHandle) {
				return false;
			}
		}

		this.currentItem = currentItem;
		this._removeCurrentsFromItems();
		return true;

	},

	_mouseStart: function(event, overrideHandle, noActivation) {

		var i, body,
			o = this.options;

		this.currentContainer = this;

		//We only need to call refreshPositions, because the refreshItems call has been moved to mouseCapture
		this.refreshPositions();

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		//Cache the helper size
		this._cacheHelperProportions();

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Get the next scrolling parent
		this.scrollParent = this.helper.scrollParent();

		//The element's absolute position on the page minus margins
		this.offset = this.currentItem.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		$.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
		});

		// Only after we got the offset, we can change the helper's position to absolute
		// TODO: Still need to figure out a way to make relative sorting possible
		this.helper.css("position", "absolute");
		this.cssPosition = this.helper.css("position");

		//Generate the original position
		this.originalPosition = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if "cursorAt" is supplied
		(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

		//Cache the former DOM position
		this.domPosition = { prev: this.currentItem.prev()[0], parent: this.currentItem.parent()[0] };

		//If the helper is not the original, hide the original so it's not playing any role during the drag, won't cause anything bad this way
		if(this.helper[0] !== this.currentItem[0]) {
			this.currentItem.hide();
		}

		//Create the placeholder
		this._createPlaceholder();

		//Set a containment if given in the options
		if(o.containment) {
			this._setContainment();
		}

		if( o.cursor && o.cursor !== "auto" ) { // cursor option
			body = this.document.find( "body" );

			// support: IE
			this.storedCursor = body.css( "cursor" );
			body.css( "cursor", o.cursor );

			this.storedStylesheet = $( "<style>*{ cursor: "+o.cursor+" !important; }</style>" ).appendTo( body );
		}

		if(o.opacity) { // opacity option
			if (this.helper.css("opacity")) {
				this._storedOpacity = this.helper.css("opacity");
			}
			this.helper.css("opacity", o.opacity);
		}

		if(o.zIndex) { // zIndex option
			if (this.helper.css("zIndex")) {
				this._storedZIndex = this.helper.css("zIndex");
			}
			this.helper.css("zIndex", o.zIndex);
		}

		//Prepare scrolling
		if(this.scrollParent[0] !== this.document[0] && this.scrollParent[0].tagName !== "HTML") {
			this.overflowOffset = this.scrollParent.offset();
		}

		//Call callbacks
		this._trigger("start", event, this._uiHash());

		//Recache the helper size
		if(!this._preserveHelperProportions) {
			this._cacheHelperProportions();
		}


		//Post "activate" events to possible containers
		if( !noActivation ) {
			for ( i = this.containers.length - 1; i >= 0; i-- ) {
				this.containers[ i ]._trigger( "activate", event, this._uiHash( this ) );
			}
		}

		//Prepare possible droppables
		if($.ae.ddmanager) {
			$.ae.ddmanager.current = this;
		}

		if ($.ae.ddmanager && !o.dropBehaviour) {
			$.ae.ddmanager.prepareOffsets(this, event);
		}

		this.dragging = true;

		this.helper.addClass("ui-sortable-helper");
		this._mouseDrag(event); //Execute the drag once - this causes the helper not to be visible before getting its correct position
		return true;

	},

	_mouseDrag: function(event) {
		var i, item, itemElement, intersection,
			o = this.options,
			scrolled = false;

		//Compute the helpers position
		this.position = this._generatePosition(event);
		this.positionAbs = this._convertPositionTo("absolute");

		if (!this.lastPositionAbs) {
			this.lastPositionAbs = this.positionAbs;
		}

		//Do scrolling
		if(this.options.scroll) {
			if(this.scrollParent[0] !== this.document[0] && this.scrollParent[0].tagName !== "HTML") {

				if((this.overflowOffset.top + this.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity) {
					this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop + o.scrollSpeed;
				} else if(event.pageY - this.overflowOffset.top < o.scrollSensitivity) {
					this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop - o.scrollSpeed;
				}

				if((this.overflowOffset.left + this.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity) {
					this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft + o.scrollSpeed;
				} else if(event.pageX - this.overflowOffset.left < o.scrollSensitivity) {
					this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft - o.scrollSpeed;
				}

			} else {

				if(event.pageY - this.document.scrollTop() < o.scrollSensitivity) {
					scrolled = this.document.scrollTop(this.document.scrollTop() - o.scrollSpeed);
				} else if(this.window.height() - (event.pageY - this.document.scrollTop()) < o.scrollSensitivity) {
					scrolled = this.document.scrollTop(this.document.scrollTop() + o.scrollSpeed);
				}

				if(event.pageX - this.document.scrollLeft() < o.scrollSensitivity) {
					scrolled = this.document.scrollLeft(this.document.scrollLeft() - o.scrollSpeed);
				} else if(this.window.width() - (event.pageX - this.document.scrollLeft()) < o.scrollSensitivity) {
					scrolled = this.document.scrollLeft(this.document.scrollLeft() + o.scrollSpeed);
				}

			}

			if(scrolled !== false && $.ae.ddmanager && !o.dropBehaviour) {
				$.ae.ddmanager.prepareOffsets(this, event);
			}
		}

		//Regenerate the absolute position used for position checks
		this.positionAbs = this._convertPositionTo("absolute");

		//Set the helper position
		if(!this.options.axis || this.options.axis !== "y") {
			this.helper[0].style.left = this.position.left+"px";
		}
		if(!this.options.axis || this.options.axis !== "x") {
			this.helper[0].style.top = this.position.top+"px";
		}

		//Rearrange
		for (i = this.items.length - 1; i >= 0; i--) {

			//Cache variables and intersection, continue if no intersection
			item = this.items[i];
			itemElement = item.item[0];
			intersection = this._intersectsWithPointer(item);
			if (!intersection) {
				continue;
			}

			// Only put the placeholder inside the current Container, skip all
			// items from other containers. This works because when moving
			// an item from one container to another the
			// currentContainer is switched before the placeholder is moved.
			//
			// Without this, moving items in "sub-sortables" can cause
			// the placeholder to jitter between the outer and inner container.
			if (item.instance !== this.currentContainer) {
				continue;
			}

			// cannot intersect with itself
			// no useless actions that have been done before
			// no action if the item moved is the parent of the item checked
			if (itemElement !== this.currentItem[0] &&
				this.placeholder[intersection === 1 ? "next" : "prev"]()[0] !== itemElement &&
				!$.contains(this.placeholder[0], itemElement) &&
				(this.options.type === "semi-dynamic" ? !$.contains(this.element[0], itemElement) : true)
			) {

				this.direction = intersection === 1 ? "down" : "up";

				if (this.options.tolerance === "pointer" || this._intersectsWithSides(item)) {
					this._rearrange(event, item);
				} else {
					break;
				}

				this._trigger("change", event, this._uiHash());
				break;
			}
		}

		//Post events to containers
		this._contactContainers(event);

		//Interconnect with droppables
		if($.ae.ddmanager) {
			$.ae.ddmanager.drag(this, event);
		}

		//Call callbacks
		this._trigger("sort", event, this._uiHash());

		this.lastPositionAbs = this.positionAbs;
		return false;

	},

	_mouseStop: function(event, noPropagation) {

		if(!event) {
			return;
		}

		//If we are using droppables, inform the manager about the drop
		if ($.ae.ddmanager && !this.options.dropBehaviour) {
			$.ae.ddmanager.drop(this, event);
		}

		if(this.options.revert) {
			var that = this,
				cur = this.placeholder.offset(),
				axis = this.options.axis,
				animation = {};

			if ( !axis || axis === "x" ) {
				animation.left = cur.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] === this.document[0].body ? 0 : this.offsetParent[0].scrollLeft);
			}
			if ( !axis || axis === "y" ) {
				animation.top = cur.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] === this.document[0].body ? 0 : this.offsetParent[0].scrollTop);
			}
			this.reverting = true;
			$(this.helper).animate( animation, parseInt(this.options.revert, 10) || 500, function() {
				that._clear(event);
			});
		} else {
			this._clear(event, noPropagation);
		}

		return false;

	},

	cancel: function() {

		if(this.dragging) {

			this._mouseUp({ target: null });

			if(this.options.helper === "original") {
				this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
			} else {
				this.currentItem.show();
			}

			//Post deactivating events to containers
			for (var i = this.containers.length - 1; i >= 0; i--){
				this.containers[i]._trigger("deactivate", null, this._uiHash(this));
				if(this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", null, this._uiHash(this));
					this.containers[i].containerCache.over = 0;
				}
			}

		}

		if (this.placeholder) {
			//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
			if(this.placeholder[0].parentNode) {
				this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
			}
			if(this.options.helper !== "original" && this.helper && this.helper[0].parentNode) {
				this.helper.remove();
			}

			$.extend(this, {
				helper: null,
				dragging: false,
				reverting: false,
				_noFinalSort: null
			});

			if(this.domPosition.prev) {
				$(this.domPosition.prev).after(this.currentItem);
			} else {
				$(this.domPosition.parent).prepend(this.currentItem);
			}
		}

		return this;

	},

	serialize: function(o) {

		var items = this._getItemsAsjQuery(o && o.connected),
			str = [];
		o = o || {};

		$(items).each(function() {
			var res = ($(o.item || this).attr(o.attribute || "id") || "").match(o.expression || (/(.+)[\-=_](.+)/));
			if (res) {
				str.push((o.key || res[1]+"[]")+"="+(o.key && o.expression ? res[1] : res[2]));
			}
		});

		if(!str.length && o.key) {
			str.push(o.key + "=");
		}

		return str.join("&");

	},

	toArray: function(o) {

		var items = this._getItemsAsjQuery(o && o.connected),
			ret = [];

		o = o || {};

		items.each(function() { ret.push($(o.item || this).attr(o.attribute || "id") || ""); });
		return ret;

	},

	/* Be careful with the following core functions */
	_intersectsWith: function(item) {

		var x1 = this.positionAbs.left,
			x2 = x1 + this.helperProportions.width,
			y1 = this.positionAbs.top,
			y2 = y1 + this.helperProportions.height,
			l = item.left,
			r = l + item.width,
			t = item.top,
			b = t + item.height,
			dyClick = this.offset.click.top,
			dxClick = this.offset.click.left,
			isOverElementHeight = ( this.options.axis === "x" ) || ( ( y1 + dyClick ) > t && ( y1 + dyClick ) < b ),
			isOverElementWidth = ( this.options.axis === "y" ) || ( ( x1 + dxClick ) > l && ( x1 + dxClick ) < r ),
			isOverElement = isOverElementHeight && isOverElementWidth;

		if ( this.options.tolerance === "pointer" ||
			this.options.forcePointerForContainers ||
			(this.options.tolerance !== "pointer" && this.helperProportions[this.floating ? "width" : "height"] > item[this.floating ? "width" : "height"])
		) {
			return isOverElement;
		} else {

			return (l < x1 + (this.helperProportions.width / 2) && // Right Half
				x2 - (this.helperProportions.width / 2) < r && // Left Half
				t < y1 + (this.helperProportions.height / 2) && // Bottom Half
				y2 - (this.helperProportions.height / 2) < b ); // Top Half

		}
	},

	_intersectsWithPointer: function(item) {

		var isOverElementHeight = (this.options.axis === "x") || this._isOverAxis(this.positionAbs.top + this.offset.click.top, item.top, item.height),
			isOverElementWidth = (this.options.axis === "y") || this._isOverAxis(this.positionAbs.left + this.offset.click.left, item.left, item.width),
			isOverElement = isOverElementHeight && isOverElementWidth,
			verticalDirection = this._getDragVerticalDirection(),
			horizontalDirection = this._getDragHorizontalDirection();

		if (!isOverElement) {
			return false;
		}

		return this.floating ?
			( ((horizontalDirection && horizontalDirection === "right") || verticalDirection === "down") ? 2 : 1 )
			: ( verticalDirection && (verticalDirection === "down" ? 2 : 1) );

	},

	_intersectsWithSides: function(item) {

		var isOverBottomHalf = this._isOverAxis(this.positionAbs.top + this.offset.click.top, item.top + (item.height/2), item.height),
			isOverRightHalf = this._isOverAxis(this.positionAbs.left + this.offset.click.left, item.left + (item.width/2), item.width),
			verticalDirection = this._getDragVerticalDirection(),
			horizontalDirection = this._getDragHorizontalDirection();

		if (this.floating && horizontalDirection) {
			return ((horizontalDirection === "right" && isOverRightHalf) || (horizontalDirection === "left" && !isOverRightHalf));
		} else {
			return verticalDirection && ((verticalDirection === "down" && isOverBottomHalf) || (verticalDirection === "up" && !isOverBottomHalf));
		}

	},

	_getDragVerticalDirection: function() {
		var delta = this.positionAbs.top - this.lastPositionAbs.top;
		return delta !== 0 && (delta > 0 ? "down" : "up");
	},

	_getDragHorizontalDirection: function() {
		var delta = this.positionAbs.left - this.lastPositionAbs.left;
		return delta !== 0 && (delta > 0 ? "right" : "left");
	},

	refresh: function(event) {
		this._refreshItems(event);
		this._setHandleClassName();
		this.refreshPositions();
		return this;
	},

	_connectWith: function() {
		var options = this.options;
		return options.connectWith.constructor === String ? [options.connectWith] : options.connectWith;
	},

	_getItemsAsjQuery: function(connected) {

		var i, j, cur, inst,
			items = [],
			queries = [],
			connectWith = this._connectWith();

		if(connectWith && connected) {
			for (i = connectWith.length - 1; i >= 0; i--){
				cur = $(connectWith[i], this.document[0]);
				for ( j = cur.length - 1; j >= 0; j--){
					inst = $.data(cur[j], this.widgetFullName);
					if(inst && inst !== this && !inst.options.disabled) {
						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element) : $(inst.options.items, inst.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), inst]);
					}
				}
			}
		}

		queries.push([$.isFunction(this.options.items) ? this.options.items.call(this.element, null, { options: this.options, item: this.currentItem }) : $(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]);

		function addItems() {
			items.push( this );
		}
		for (i = queries.length - 1; i >= 0; i--){
			queries[i][0].each( addItems );
		}

		return $(items);

	},

	_removeCurrentsFromItems: function() {

		var list = this.currentItem.find(":data(" + this.widgetName + "-item)");

		this.items = $.grep(this.items, function (item) {
			for (var j=0; j < list.length; j++) {
				if(list[j] === item.item[0]) {
					return false;
				}
			}
			return true;
		});

	},

	_refreshItems: function(event) {

		this.items = [];
		this.containers = [this];

		var i, j, cur, inst, targetData, _queries, item, queriesLength,
			items = this.items,
			queries = [[$.isFunction(this.options.items) ? this.options.items.call(this.element[0], event, { item: this.currentItem }) : $(this.options.items, this.element), this]],
			connectWith = this._connectWith();

		if(connectWith && this.ready) { //Shouldn't be run the first time through due to massive slow-down
			for (i = connectWith.length - 1; i >= 0; i--){
				cur = $(connectWith[i], this.document[0]);
				for (j = cur.length - 1; j >= 0; j--){
					inst = $.data(cur[j], this.widgetFullName);
					if(inst && inst !== this && !inst.options.disabled) {
						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element[0], event, { item: this.currentItem }) : $(inst.options.items, inst.element), inst]);
						this.containers.push(inst);
					}
				}
			}
		}

		for (i = queries.length - 1; i >= 0; i--) {
			targetData = queries[i][1];
			_queries = queries[i][0];

			for (j=0, queriesLength = _queries.length; j < queriesLength; j++) {
				item = $(_queries[j]);

				item.data(this.widgetName + "-item", targetData); // Data for target checking (mouse manager)

				items.push({
					item: item,
					instance: targetData,
					width: 0, height: 0,
					left: 0, top: 0
				});
			}
		}

	},

	refreshPositions: function(fast) {

	        // Determine whether items are being displayed horizontally
	        this.floating = this.items.length ?
	        this.options.axis === "x" || this._isFloating( this.items[ 0 ].item ) :
	            false;

	        //This has to be redone because due to the item being moved out/into the offsetParent, the offsetParent's position will change
	        if(this.offsetParent && this.helper) {
	            this.offset.parent = this._getParentOffset();
		    
	        }


		var i, item, t, p;

		for (i = this.items.length - 1; i >= 0; i--){
			item = this.items[i];

			//We ignore calculating positions of all connected containers when we're not over them
			if(item.instance !== this.currentContainer && this.currentContainer && item.item[0] !== this.currentItem[0]) {
				continue;
			}

			t = this.options.toleranceElement ? $(this.options.toleranceElement, item.item) : item.item;

			if (!fast) {
				item.width = t.outerWidth();
				item.height = t.outerHeight();
			}

			p = t.offset();
			item.left = p.left;
			item.top = p.top;
		}

		if(this.options.custom && this.options.custom.refreshContainers) {
			this.options.custom.refreshContainers.call(this);
		} else {
			for (i = this.containers.length - 1; i >= 0; i--){
				p = this.containers[i].element.offset();
				this.containers[i].containerCache.left = p.left;
				this.containers[i].containerCache.top = p.top;
				this.containers[i].containerCache.width = this.containers[i].element.outerWidth();
				this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
			}
		}

		return this;
	},

    _createPlaceholder: function(that) {
        that = that || this;
        var className,
            o = that.options;

        if(!o.placeholder || o.placeholder.constructor === String) {
            className = o.placeholder;
            o.placeholder = {
                element: function() {

                    var nodeName = that.currentItem[0].nodeName.toLowerCase(),
                        element = $( "<" + nodeName + ">", that.document[0] )
                            .addClass(className || that.currentItem[0].className+" ui-sortable-placeholder")
                            .removeClass("ui-sortable-helper");

                    if ( nodeName === "tbody" ) {
                        that._createTrPlaceholder(
                            that.currentItem.find( "tr" ).eq( 0 ),
                            $( "<tr>", that.document[ 0 ] ).appendTo( element )
                        );
                    } else if ( nodeName === "tr" ) {
                        that._createTrPlaceholder( that.currentItem, element );
                    } else if ( nodeName === "img" ) {
                        element.attr( "src", that.currentItem.attr( "src" ) );
                    }

                    if ( !className ) {
                        element.css( "visibility", "hidden" );
                    }

                    return element;
                },
                update: function(container, p) {

                    // 1. If a className is set as 'placeholder option, we don't force sizes - the class is responsible for that
                    // 2. The option 'forcePlaceholderSize can be enabled to force it even if a class name is specified
                    if(className && !o.forcePlaceholderSize) {
                        return;
                    }

                    //If the element doesn't have a actual height by itself (without styles coming from a stylesheet), it receives the inline height from the dragged item
                    if(!p.height()) { p.height(that.currentItem.innerHeight() - parseInt(that.currentItem.css("paddingTop")||0, 10) - parseInt(that.currentItem.css("paddingBottom")||0, 10)); }
                    if(!p.width()) { p.width(that.currentItem.innerWidth() - parseInt(that.currentItem.css("paddingLeft")||0, 10) - parseInt(that.currentItem.css("paddingRight")||0, 10)); }
                }
            };
        }

        //Create the placeholder
        that.placeholder = $(o.placeholder.element.call(that.element, that.currentItem));

        //Append it after the actual current item
        that.currentItem.after(that.placeholder);

        //Update the size of the placeholder (TODO: Logic to fuzzy, see line 316/317)
        o.placeholder.update(that, that.placeholder);

    },

    _createTrPlaceholder: function( sourceTr, targetTr ) {
        var that = this;

        sourceTr.children().each(function() {
            $( "<td>&#160;</td>", that.document[ 0 ] )
                .attr( "colspan", $( this ).attr( "colspan" ) || 1 )
                .appendTo( targetTr );
        });
	
    },


	_contactContainers: function(event) {
		var i, j, dist, itemWithLeastDistance, posProperty, sizeProperty, cur, nearBottom, floating, axis,
			innermostContainer = null,
			innermostIndex = null;

		// get innermost container that intersects with item
		for (i = this.containers.length - 1; i >= 0; i--) {

			// never consider a container that's located within the item itself
			if($.contains(this.currentItem[0], this.containers[i].element[0])) {
				continue;
			}

			if(this._intersectsWith(this.containers[i].containerCache)) {

				// if we've already found a container and it's more "inner" than this, then continue
				if(innermostContainer && $.contains(this.containers[i].element[0], innermostContainer.element[0])) {
					continue;
				}

				innermostContainer = this.containers[i];
				innermostIndex = i;

			} else {
				// container doesn't intersect. trigger "out" event if necessary
				if(this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", event, this._uiHash(this));
					this.containers[i].containerCache.over = 0;
				}
			}

		}

		// if no intersecting containers found, return
		if(!innermostContainer) {
			return;
		}

		// move the item into the container if it's not there already
		if(this.containers.length === 1) {
			if (!this.containers[innermostIndex].containerCache.over) {
				this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
				this.containers[innermostIndex].containerCache.over = 1;
			}
		} else {

			//When entering a new container, we will find the item with the least distance and append our item near it
			dist = 10000;
			itemWithLeastDistance = null;
			floating = innermostContainer.floating || this._isFloating(this.currentItem);
			posProperty = floating ? "left" : "top";
			sizeProperty = floating ? "width" : "height";
			axis = floating ? "clientX" : "clientY";

			for (j = this.items.length - 1; j >= 0; j--) {
				if(!$.contains(this.containers[innermostIndex].element[0], this.items[j].item[0])) {
					continue;
				}
				if(this.items[j].item[0] === this.currentItem[0]) {
					continue;
				}

				cur = this.items[j].item.offset()[posProperty];
				nearBottom = false;
				if ( event[ axis ] - cur > this.items[ j ][ sizeProperty ] / 2 ) {
					nearBottom = true;
				}

				if ( Math.abs( event[ axis ] - cur ) < dist ) {
					dist = Math.abs( event[ axis ] - cur );
					itemWithLeastDistance = this.items[ j ];
					this.direction = nearBottom ? "up": "down";
				}
			}

			//Check if dropOnEmpty is enabled
			if(!itemWithLeastDistance && !this.options.dropOnEmpty) {
				return;
			}

			if(this.currentContainer === this.containers[innermostIndex]) {
				if ( !this.currentContainer.containerCache.over ) {
					this.containers[ innermostIndex ]._trigger( "over", event, this._uiHash() );
					this.currentContainer.containerCache.over = 1;
				}
				return;
			}

			itemWithLeastDistance ? this._rearrange(event, itemWithLeastDistance, null, true) : this._rearrange(event, null, this.containers[innermostIndex].element, true);
			this._trigger("change", event, this._uiHash());
			this.containers[innermostIndex]._trigger("change", event, this._uiHash(this));
			this.currentContainer = this.containers[innermostIndex];

			//Update the placeholder
			this.options.placeholder.update(this.currentContainer, this.placeholder);

			this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
			this.containers[innermostIndex].containerCache.over = 1;
		}


	},

	_createHelper: function(event) {

		var o = this.options,
			helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event, this.currentItem])) : (o.helper === "clone" ? this.currentItem.clone() : this.currentItem);

		//Add the helper to the DOM if that didn't happen already
		if(!helper.parents("body").length) {
			$(o.appendTo !== "parent" ? o.appendTo : this.currentItem[0].parentNode)[0].appendChild(helper[0]);
		}

		if(helper[0] === this.currentItem[0]) {
			this._storedCSS = { width: this.currentItem[0].style.width, height: this.currentItem[0].style.height, position: this.currentItem.css("position"), top: this.currentItem.css("top"), left: this.currentItem.css("left") };
		}

		if(!helper[0].style.width || o.forceHelperSize) {
			helper.width(this.currentItem.width());
		}
		if(!helper[0].style.height || o.forceHelperSize) {
			helper.height(this.currentItem.height());
		}

		return helper;

	},

	_adjustOffsetFromHelper: function(obj) {
		if (typeof obj === "string") {
			obj = obj.split(" ");
		}
		if ($.isArray(obj)) {
			obj = {left: +obj[0], top: +obj[1] || 0};
		}
		if ("left" in obj) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ("right" in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ("top" in obj) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ("bottom" in obj) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_getParentOffset: function() {


		//Get the offsetParent and cache its position
		this.offsetParent = this.helper.offsetParent();
		var po = this.offsetParent.offset();

		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if(this.cssPosition === "absolute" && this.scrollParent[0] !== this.document[0] && $.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		// This needs to be actually done for all browsers, since pageX/pageY includes this information
		// with an ugly IE fix
		if( this.offsetParent[0] === this.document[0].body || (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() === "html" && $.ae.ie)) {
			po = { top: 0, left: 0 };
		}

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};

	},

	_getRelativeOffset: function() {

		if(this.cssPosition === "relative") {
			var p = this.currentItem.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.currentItem.css("marginLeft"),10) || 0),
			top: (parseInt(this.currentItem.css("marginTop"),10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var ce, co, over,
			o = this.options;
		if(o.containment === "parent") {
			o.containment = this.helper[0].parentNode;
		}
		if(o.containment === "document" || o.containment === "window") {
			this.containment = [
				0 - this.offset.relative.left - this.offset.parent.left,
				0 - this.offset.relative.top - this.offset.parent.top,
				o.containment === "document" ? this.document.width() : this.window.width() - this.helperProportions.width - this.margins.left,
				(o.containment === "document" ? this.document.width() : this.window.height() || this.document[0].body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
			];
		}

		if(!(/^(document|window|parent)$/).test(o.containment)) {
			ce = $(o.containment)[0];
			co = $(o.containment).offset();
			over = ($(ce).css("overflow") !== "hidden");

			this.containment = [
				co.left + (parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0) - this.margins.left,
				co.top + (parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0) - this.margins.top,
				co.left+(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left,
				co.top+(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top
			];
		}

	},

	_convertPositionTo: function(d, pos) {

		if(!pos) {
			pos = this.position;
		}
		var mod = d === "absolute" ? 1 : -1,
			scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== this.document[0] && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
			scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		return {
			top: (
				pos.top	+																// The absolute mouse position
				this.offset.relative.top * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.top * mod -											// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
			),
			left: (
				pos.left +																// The absolute mouse position
				this.offset.relative.left * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left * mod	-										// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
			)
		};

	},

	_generatePosition: function(event) {

		var top, left,
			o = this.options,
			pageX = event.pageX,
			pageY = event.pageY,
			scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== this.document[0] && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		// This is another very weird special case that only happens for relative elements:
		// 1. If the css position is relative
		// 2. and the scroll parent is the document or similar to the offset parent
		// we have to refresh the relative offset during the scroll so there are no jumps
		if(this.cssPosition === "relative" && !(this.scrollParent[0] !== this.document[0] && this.scrollParent[0] !== this.offsetParent[0])) {
			this.offset.relative = this._getRelativeOffset();
		}

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		if(this.originalPosition) { //If we are not dragging yet, we won't check for options

			if(this.containment) {
				if(event.pageX - this.offset.click.left < this.containment[0]) {
					pageX = this.containment[0] + this.offset.click.left;
				}
				if(event.pageY - this.offset.click.top < this.containment[1]) {
					pageY = this.containment[1] + this.offset.click.top;
				}
				if(event.pageX - this.offset.click.left > this.containment[2]) {
					pageX = this.containment[2] + this.offset.click.left;
				}
				if(event.pageY - this.offset.click.top > this.containment[3]) {
					pageY = this.containment[3] + this.offset.click.top;
				}
			}

			if(o.grid) {
				top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
				pageY = this.containment ? ( (top - this.offset.click.top >= this.containment[1] && top - this.offset.click.top <= this.containment[3]) ? top : ((top - this.offset.click.top >= this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
				pageX = this.containment ? ( (left - this.offset.click.left >= this.containment[0] && left - this.offset.click.left <= this.containment[2]) ? left : ((left - this.offset.click.left >= this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

		}

		return {
			top: (
				pageY -																// The absolute mouse position
				this.offset.click.top -													// Click offset (relative to the element)
				this.offset.relative.top	-											// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.top +												// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
			),
			left: (
				pageX -																// The absolute mouse position
				this.offset.click.left -												// Click offset (relative to the element)
				this.offset.relative.left	-											// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left +												// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
			)
		};

	},

	_rearrange: function(event, i, a, hardRefresh) {

		a ? a[0].appendChild(this.placeholder[0]) : i.item[0].parentNode.insertBefore(this.placeholder[0], (this.direction === "down" ? i.item[0] : i.item[0].nextSibling));

		//Various things done here to improve the performance:
		// 1. we create a setTimeout, that calls refreshPositions
		// 2. on the instance, we have a counter variable, that get's higher after every append
		// 3. on the local scope, we copy the counter variable, and check in the timeout, if it's still the same
		// 4. this lets only the last addition to the timeout stack through
		this.counter = this.counter ? ++this.counter : 1;
		var counter = this.counter;

		this._delay(function() {
			if(counter === this.counter) {
				this.refreshPositions(!hardRefresh); //Precompute after each DOM insertion, NOT on mousemove
			}
		});

	},

	_clear: function(event, noPropagation) {

		this.reverting = false;
		// We delay all events that have to be triggered to after the point where the placeholder has been removed and
		// everything else normalized again
		var i,
			delayedTriggers = [];

		// We first have to update the dom position of the actual currentItem
		// Note: don't do it if the current item is already removed (by a user), or it gets reappended (see #4088)
		if(!this._noFinalSort && this.currentItem.parent().length) {
			this.placeholder.before(this.currentItem);
		}
		this._noFinalSort = null;

		if(this.helper[0] === this.currentItem[0]) {
			for(i in this._storedCSS) {
				if(this._storedCSS[i] === "auto" || this._storedCSS[i] === "static") {
					this._storedCSS[i] = "";
				}
			}
			this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
		} else {
			this.currentItem.show();
		}

		if(this.fromOutside && !noPropagation) {
			delayedTriggers.push(function(event) { this._trigger("receive", event, this._uiHash(this.fromOutside)); });
		}
		if((this.fromOutside || this.domPosition.prev !== this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent !== this.currentItem.parent()[0]) && !noPropagation) {
			delayedTriggers.push(function(event) { this._trigger("update", event, this._uiHash()); }); //Trigger update callback if the DOM position has changed
		}

		// Check if the items Container has Changed and trigger appropriate
		// events.
		if (this !== this.currentContainer) {
			if(!noPropagation) {
				delayedTriggers.push(function(event) { this._trigger("remove", event, this._uiHash()); });
				delayedTriggers.push((function(c) { return function(event) { c._trigger("receive", event, this._uiHash(this)); };  }).call(this, this.currentContainer));
				delayedTriggers.push((function(c) { return function(event) { c._trigger("update", event, this._uiHash(this));  }; }).call(this, this.currentContainer));
			}
		}


		//Post events to containers
		function delayEvent( type, instance, container ) {
			return function( event ) {
				container._trigger( type, event, instance._uiHash( instance ) );
			};
		}
		for (i = this.containers.length - 1; i >= 0; i--){
			if (!noPropagation) {
				delayedTriggers.push( delayEvent( "deactivate", this, this.containers[ i ] ) );
			}
			if(this.containers[i].containerCache.over) {
				delayedTriggers.push( delayEvent( "out", this, this.containers[ i ] ) );
				this.containers[i].containerCache.over = 0;
			}
		}

		//Do what was originally in plugins
		if ( this.storedCursor ) {
			this.document.find( "body" ).css( "cursor", this.storedCursor );
			this.storedStylesheet.remove();
		}
		if(this._storedOpacity) {
			this.helper.css("opacity", this._storedOpacity);
		}
		if(this._storedZIndex) {
			this.helper.css("zIndex", this._storedZIndex === "auto" ? "" : this._storedZIndex);
		}

		this.dragging = false;

		if(!noPropagation) {
			this._trigger("beforeStop", event, this._uiHash());
		}

		//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
		this.placeholder[0].parentNode.removeChild(this.placeholder[0]);

		if ( !this.cancelHelperRemoval ) {
			if ( this.helper[ 0 ] !== this.currentItem[ 0 ] ) {
				this.helper.remove();
			}
			this.helper = null;
		}

		if(!noPropagation) {
			for (i=0; i < delayedTriggers.length; i++) {
				delayedTriggers[i].call(this, event);
			} //Trigger all delayed events
			this._trigger("stop", event, this._uiHash());
		}

		this.fromOutside = false;
		return !this.cancelHelperRemoval;

	},

	_trigger: function() {
		if ($.AEWidget.prototype._trigger.apply(this, arguments) === false) {
			this.cancel();
		}
	},

	_uiHash: function(_inst) {
		var inst = _inst || this;
		return {
			helper: inst.helper,
			placeholder: inst.placeholder || $([]),
			position: inst.position,
			originalPosition: inst.originalPosition,
			offset: inst.positionAbs,
			item: inst.currentItem,
			sender: _inst ? _inst.element : null
		};
	}

});

});
define('ui-dialog',function (require, exports, moudles) {
    "require:nomunge,exports:nomunge,moudles:nomunge";
/*
 * $Id: ui-dialog.js$
 * Depends:
 *  ui-core.js
 *  ui-widget.js
 *  ui-mouse.js
 *  ui-position.js
 *  ui-draggable.js
 *  ui-resizable.js
 */
var aeDialog = $.aeWidget( "ae.aeDialog", {
    version: "1.11.4",
    options: {
        appendTo: "body",
        autoOpen: true,
        buttons: [],
        closeOnEscape: true,
        closeText: "Close",
        dialogClass: "",
        draggable: true,
        hide: null,
        height: "auto",
        maxHeight: null,
        maxWidth: null,
        minHeight: 90,
        minWidth: 150,
        modal: false,
        confirmButtonText:"Confirm",
        cancelButtonText:"Cancel",
        position: {
            my: "top",
            at: "top",
            of: window,
            collision: "flipfit",
            // Ensure the titlebar is always visible
            using: function( pos ) {
                /*var topOffset = $( this ).css( pos ).offset().top;
                if ( topOffset < 0 ) {
                    $( this ).css( "top", pos.top - topOffset );
                }else{
                	$( this ).css( "top", topOffset);
                }*/
                //TODO 窗口定位问题，jquery ui position 算法相关问题，top先固定30px解决，后续分析
                $( this ).css( pos );
                $(this).css("top","30px");
            }
        },
        resizable: true,
        show: null,
        title: '',
        width: 300,

        // callbacks
        beforeClose: null,
        close: null,
        drag: null,
        dragStart: null,
        dragStop: null,
        focus: null,
        open: null,
        resize: null,
        resizeStart: null,
        resizeStop: null,
        afterInit:null
    },

    sizeRelatedOptions: {
        buttons: true,
        height: true,
        maxHeight: true,
        maxWidth: true,
        minHeight: true,
        minWidth: true,
        width: true
    },

    resizableRelatedOptions: {
        maxHeight: true,
        maxWidth: true,
        minHeight: true,
        minWidth: true
    },
    _create: function() {
        var id=this.element.attr("id"),
            $el=$(document.body).find( "[aria-describedby='"+id+"']" );

        if(id){
            this.element.attr("aeId",id);
        }

        this._buildOptions(this.options,this.element);

        this.originalCss = {
            display: this.element[ 0 ].style.display,
            width: this.element[ 0 ].style.width,
            minHeight: this.element[ 0 ].style.minHeight,
            maxHeight: this.element[ 0 ].style.maxHeight,
            height: this.element[ 0 ].style.height
        };
        this.originalPosition = {
            parent: this.element.parent(),
            index: this.element.parent().children().index( this.element )
        };
        this.originalTitle = this.element.attr( "title" );
        this.options.title = this.options.title;

        this._createWrapper();

        this.element
            .show()
            .removeAttr( "title" )
            .addClass( "modal-body" )
            .appendTo( this.modalContent );

        if(this.options.componentType !== 'message'){
            this._createTitlebar();
        }
        this._createButton();
//        this._createButtonPane();

        if ( this.options.draggable && $.fn.aeDraggable ) {
            this._makeDraggable();
        }
        if ( this.options.resizable && $.fn.aeResizable ) {
            this._makeResizable();
        }

        this._isOpen = false;

        this._trackFocus();
    },

    _init: function() {
        if ( this.options.autoOpen ) {
            this.element.prev(".modal-header").children("h4.modal-title").text(this.options.title); //TODO 暂时解决div弹窗复用时标题只读取一次的问题
            this.open();
        }
    },

    _buildOptions: function (options,$ele) {
        options.confirmButtonText = ($ele.attr("confirmButtonText") || options.confirmButtonText);
        options.cancelButtonText = ($ele.attr("cancelButtonText") || options.cancelButtonText);
    },

    _appendTo: function() {
        var element = this.options.appendTo;
        if ( element && (element.jquery || element.nodeType) ) {
            return $( element );
        }
        return this.document.find( element || "body" ).eq( 0 );
    },
    _destroy: function() {
        var next,
            originalPosition = this.originalPosition;

        if ( this.options.draggable && $.fn.aeDraggable ) {
            this.modalContent.aeDraggable("destroy");
        }
        if ( this.options.resizable && $.fn.aeResizable ) {
            this.modalContent.aeResizable("destroy");
        }

        $("#"+this.options.elementId).getNiceScroll().remove();

        this._untrackInstance();
      //  this._destroyOverlay();

        this.element
            .removeUniqueId()
            .removeClass( "ui-dialog-content ui-widget-content" )
            .css( this.originalCss )
            // Without detaching first, the following becomes really slow
            .detach();

        this.uiDialog.stop( true, true ).remove();

        if ( this.originalTitle ) {
            this.element.attr( "title", this.originalTitle );
        }

        next = originalPosition.parent.children().eq( originalPosition.index );
        // Don't try to place the dialog next to itself (#8613)
        if ( next.length && next[ 0 ] !== this.element[ 0 ] ) {
            next.before( this.element );
        } else {
            originalPosition.parent.append( this.element );
        }
    },

    widget: function() {
        return this.uiDialog;
    },

    disable: $.noop,
    enable: $.noop,

    close: function( event ) {
        var activeElement,
            that = this;

        if ( !this._isOpen || this._trigger( "beforeClose", event ) === false ) {
            return;
        }

        this._isOpen = false;
        this._focusedElement = null;
      //  this._destroyOverlay();
        this._untrackInstance();

        if ( !this.opener.filter( ":focusable" ).focus().length ) {

            // support: IE9
            // IE9 throws an "Unspecified error" accessing document.activeElement from an <iframe>
            try {
                activeElement = this.document[ 0 ].activeElement;

                // Support: IE9, IE10
                // If the <body> is blurred, IE will switch windows, see #4520
                if ( activeElement && activeElement.nodeName.toLowerCase() !== "body" ) {

                    // Hiding a focused element doesn't trigger blur in WebKit
                    // so in case we have nothing to focus on, explicitly blur the active element
                    // https://bugs.webkit.org/show_bug.cgi?id=47182
                    $( activeElement ).blur();
                }
            } catch ( error ) {}
        }
        this.uiDialog.removeClass('in');
        var hdTimer = null;
        if(hdTimer!=null){
            clearTimeout(hdTimer);
            hdTimer=null;
        }
        hdTimer=setTimeout(function(){
        	that._hide( that.uiDialog, that.options.hide, function() {
                that._trigger( "close", event );
            });
        	if(that.options.popupType !== 'div'){
        		that.element.remove();
       		}
        },150);

        $(document.body).css("overflow","");
        // $(document.body).removeClass("modal-open");

        this._resetScrollbar()
    },

    //resolve body beat when modal
    _checkScrollbar : function () {
        this.bodyIsOverflowing = document.body.scrollHeight > document.documentElement.clientHeight;
        this.scrollbarWidth = this._measureScrollbar()
    },
    _setScrollbar: function () {
        var bodyPad = parseInt(($(document.body).css('padding-right') || 0), 10);
        if (this.bodyIsOverflowing) $(document.body).css('padding-right', bodyPad + this.scrollbarWidth)
    },
    _resetScrollbar: function () {
        $(document.body).css('padding-right', '')
    },
    _measureScrollbar : function () { // thx walsh
        var scrollDiv = document.createElement('div');
        scrollDiv.className = 'modal-scrollbar-measure';
        $(document.body).append(scrollDiv);
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        $(document.body)[0].removeChild(scrollDiv);
        return scrollbarWidth
    },

    isOpen: function() {
        return this._isOpen;
    },

    moveToTop: function() {
        this._moveToTop();
    },

    _moveToTop: function( event, silent ) {
        var moved = false,
            zIndices = this.uiDialog.siblings( ".ui-front:visible" ).map(function() {
                return +$( this ).css( "z-index" );
            }).get(),
            zIndexMax = Math.max.apply( null, zIndices );

        if ( zIndexMax >= +this.uiDialog.css( "z-index" ) ) {
            this.uiDialog.css( "z-index", zIndexMax + 1 );
            moved = true;
        }

        if ( moved && !silent ) {
            this._trigger( "focus", event );
        }
        return moved;
    },

    open: function() {
        var that = this;
        if ( this._isOpen ) {
            if ( this._moveToTop() ) {
                this._focusTabbable();
            }
            return;
        }

        this._isOpen = true;
        this.opener = $( this.document[ 0 ].activeElement );

        this._size();
        this._position();
        //this._createOverlay();
        this._moveToTop( null, true );

        // Ensure the overlay is moved to the top with the dialog, but only when
        // opening. The overlay shouldn't move after the dialog is open so that
        // modeless dialogs opened after the modal dialog stack properly.
        if ( this.overlay ) {
            this.overlay.css( "z-index", this.uiDialog.css( "z-index" ) - 1 );
        }

        this._show( this.uiDialog, this.options.show, function() {
           // that._focusTabbable();
            that._trigger( "focus" );
        });

        // Track the dialog immediately upon openening in case a focus event
        // somehow occurs outside of the dialog before an element inside the
        // dialog is focused (#10152)
        this._makeFocusTarget();

        if(this.options.modal){
            this.modalBackdrop.css('height', this.uiDialog[0].scrollHeight);
        }
        that.uiDialog.addClass('in');

        $(document.body).css("overflow","hidden");
        // $(document.body).addClass("modal-open");
        $(".modal").scrollTop(0);
        this._trigger( "open" );
        this._trigger("afterInit",null);
        this._checkScrollbar();
        this._setScrollbar();

    },

    _focusTabbable: function() {
        // Set focus to the first match:
        // 1. An element that was focused previously
        // 2. First element inside the dialog matching [autofocus]
        // 3. Tabbable element inside the content element
        // 4. Tabbable element inside the buttonpane
        // 5. The close button
        // 6. The dialog itself
        var hasFocus = this._focusedElement;
        if ( !hasFocus ) {
            hasFocus = this.element.find( "[autofocus]" );
        }
        if ( !hasFocus.length ) {
            hasFocus = this.element.find( ":tabbable" );
        }
//        if ( !hasFocus.length ) {
//            hasFocus = this.uiDialogButtonPane.find( ":tabbable" );
//        }
//        if ( !hasFocus.length ) {
//            hasFocus = this.uiDialogTitlebarClose.filter( ":tabbable" );
//        }
        if ( !hasFocus.length ) {
            hasFocus = this.uiDialog;
        }
        hasFocus.eq( 0 ).focus();
    },

    _keepFocus: function( event ) {
        function checkFocus() {
            var activeElement = this.document[0].activeElement,
                isActive = this.uiDialog[0] === activeElement ||
                    $.contains( this.uiDialog[0], activeElement );
            if ( !isActive ) {
                this._focusTabbable();
            }
        }
        event.preventDefault();
        checkFocus.call( this );
        // support: IE
        // IE <= 8 doesn't prevent moving focus even with event.preventDefault()
        // so we check again later
        this._delay( checkFocus );
    },

    _createWrapper: function() {
//        this.uiDialog = $("<div>")
//            .addClass( "ui-dialog ui-widget ui-widget-content ui-corner-all ui-front " +
//            this.options.dialogClass )
//            .hide()
//            .attr({
//                // Setting tabIndex makes the div focusable
//                tabIndex: -1,
//                role: "dialog"
//            })
//            .appendTo( this._appendTo() );

		  this.uiDialog = $("<div>")
		      .addClass( "modal fade" )
		      .hide()
		      .attr({
		          // Setting tabIndex makes the div focusable
		    	  "aria-hidden":false,
		          tabIndex: -1,
		          role: "dialog"
		      })
		      .appendTo( this._appendTo() );

		  if(this.options.modal){
			  this.modalBackdrop = $("<div>")
	              .addClass( "modal-backdrop fade in" )
	              .prependTo( this.uiDialog );
		  }

		  this.modalDialog = $("<div>")
		      .addClass( "modal-dialog" )
		      .css('width','auto')
		      .appendTo( this.uiDialog );

		  this.modalContent = $("<div>")
		      .addClass( "modal-content" )
		      .appendTo( this.modalDialog );

		  if(this.options.componentType === 'message'){
			  var modalDialog  = this.modalDialog,messageType = this.options.messageType;
			  modalDialog.addClass('popup-notic-default').removeClass('popup-notic-warning popup-notic-error popup-notic-success');
				 if(messageType === 'alert'){
					 modalDialog.addClass('popup-notic-warning');
				 }
				 if(messageType === 'success'){
					 modalDialog.addClass('popup-notic-success');
				 }
				 if(messageType === 'error'){
					 modalDialog.addClass('popup-notic-error');
				 }
		  }

        this._on( this.uiDialog, {
            keydown: function( event ) {
                if ( this.options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode &&
                    event.keyCode === $.ae.keyCode.ESCAPE ) {
                    event.preventDefault();
                    this.close( event );
                    return;
                }

                // prevent tabbing out of dialogs
                if ( event.keyCode !== $.ae.keyCode.TAB || event.isDefaultPrevented() ) {
                    return;
                }
                var tabbables = this.uiDialog.find( ":tabbable" ),
                    first = tabbables.filter( ":first" ),
                    last = tabbables.filter( ":last" );

                if ( ( event.target === last[0] || event.target === this.uiDialog[0] ) && !event.shiftKey ) {
                    this._delay(function() {
                        first.focus();
                    });
                    event.preventDefault();
                } else if ( ( event.target === first[0] || event.target === this.uiDialog[0] ) && event.shiftKey ) {
                    this._delay(function() {
                        last.focus();
                    });
                    event.preventDefault();
                }
            },
            mousedown: function( event ) {
                if ( this._moveToTop( event ) ) {
                    this._focusTabbable();
                }
            }
        });

        // We assume that any existing aria-describedby attribute means
        // that the dialog content is marked up properly
        // otherwise we brute force the content as the description
        if ( !this.element.find( "[aria-describedby]" ).length ) {
            this.uiDialog.attr({
                "aria-describedby": this.element.uniqueId().attr( "id" )
            });
        }
    },

    _createTitlebar: function() {
        var uiDialogTitle;

        this.uiDialogTitlebar = $( "<div>" )
            .addClass( "modal-header" )
            .prependTo( this.modalContent );

        this._on( this.uiDialogTitlebar, {
            mousedown: function( event ) {
                // Don't prevent click on close button (#8838)
                // Focusing a dialog that is partially scrolled out of view
                // causes the browser to scroll it into view, preventing the click event
                if ( !$( event.target ).closest( ".ui-dialog-titlebar-close" ) ) {
                    // Dialog isn't getting focus when dragging (#8063)
                    this.uiDialog.focus();
                }
            }
        });

        // support: IE
        // Use type="button" to prevent enter keypresses in textboxes from closing the
        // dialog in IE (#9312)
//        this.uiDialogTitlebarClose = $( "<button type='button'></button>" )
//            .button({
//                label: this.options.closeText,
//                icons: {
//                    primary: "ui-icon-closethick"
//                },
//                text: false
//            })
//            .addClass( "ui-dialog-titlebar-close" )
//            .appendTo( this.uiDialogTitlebar );
//        this._on( this.uiDialogTitlebarClose, {
//            click: function( event ) {
//                event.preventDefault();
//                this.close( event );
//            }
//        });

	      this.uiDialogTitlebarClose = $( "<button type='button'> × </button>" )
	          .addClass( "close" )
	          .attr({
		          // Setting tabIndex makes the div focusable
		    	  "aria-hidden":true
		      })
	          .appendTo( this.uiDialogTitlebar );
	      this._on( this.uiDialogTitlebarClose, {
	          click: function( event ) {
	             event.preventDefault();
	             this.close( event );
	          }
	      });
	      $('<h4 class="modal-title">'+this.options.title+'</h4>').appendTo(this.uiDialogTitlebar);

//        uiDialogTitle = $( "<span>" )
//            .uniqueId()
//            .addClass( "ui-dialog-title" )
//            .prependTo( this.uiDialogTitlebar );
//        this._title( uiDialogTitle );

//        this.uiDialog.attr({
//            "aria-labelledby": uiDialogTitle.attr( "id" )
//        });

	      if(!this.options.showClose){
	    	  this.uiDialogTitlebarClose.hide();
		  }
    },
    _createButton:function(){
    	var self = this;
	    this.modalFooter = $("<div>")
	        .addClass( "modal-footer" )
	        .appendTo( this.modalContent );

	    this.modalCancel = $('<button class="btn btn-default" type="button">'+this.options.cancelButtonText+'</button>').appendTo( this.modalFooter );
	    this.modalConfirm = $('<button class="btn btn-primary" type="button">'+this.options.confirmButtonText+'</button>').appendTo( this.modalFooter );

	    if(this.options.componentType === 'message'){
			  var messageType = this.options.messageType;
			  this.modalConfirm.text('Ok');
			  if(messageType === 'alert' || messageType === 'success'){
				  this.modalCancel.hide();
			  }
			  if(messageType === 'error'){
				 this.modalConfirm.hide();
			  }
		}

	    this._on( this.modalConfirm, {
	          click: function( event ) {
                  var aeId = self.element.attr("aeId");
	        	  if(self.options.popupType !== 'div'){
	        		  var array = $.aries.page.data._privateArray;
	        		  if($.isArray(array) && array.length>0){
	        			  var popupConfirmEvent = array[array.length-1];
                          if(typeof popupConfirmEvent=="function"){
                              popupConfirmEvent(event);
                          }else{
                              if(popupConfirmEvent && popupConfirmEvent.confirmFunc && typeof popupConfirmEvent.confirmFunc=="function"){
                                  if(aeId.substring(13) == popupConfirmEvent.id){
                                      popupConfirmEvent.confirmFunc(event,popupConfirmEvent.id);
                                  }
                              }
                          }
	        		  }

                      if($.aries.page.data._textPopPageConfirm && typeof $.aries.page.data._textPopPageConfirm==="function"){
                          $.aries.page.data._textPopPageConfirm(event);
                      }
	        		  /*if(typeof $.popupConfirmEvent == 'function' ){
		        		  $.popupConfirmEvent(event);
		        		  $.popupConfirmEvent = undefined;
		        	  }*/
	        	  }else{
	        		  self._trigger('confirm',event);
	        	  }
	          }
	    });

	    this._on( this.modalCancel, {
	          click: function( event ) {
	             event.preventDefault();
	             this.close( event );
	          }
	    });

	    if(!this.options.showButton){
	    	this.modalFooter.hide();
	    }
    },

    _title: function( title ) {
        if ( !this.options.title ) {
            title.html( "&#160;" );
        }
        title.text( this.options.title );
    },

//    _createButtonPane: function() {
//        this.uiDialogButtonPane = $( "<div>" )
//            .addClass( "ui-dialog-buttonpane ui-widget-content ui-helper-clearfix" );
//
//        this.uiButtonSet = $( "<div>" )
//            .addClass( "ui-dialog-buttonset" )
//            .appendTo( this.uiDialogButtonPane );
//
//        this._createButtons();
//    },

//    _createButtons: function() {
//        var that = this,
//            buttons = this.options.buttons;
//
//        // if we already have a button pane, remove it
//        this.uiDialogButtonPane.remove();
//        this.uiButtonSet.empty();
//
//        if ( $.isEmptyObject( buttons ) || ($.isArray( buttons ) && !buttons.length) ) {
//            this.uiDialog.removeClass( "ui-dialog-buttons" );
//            return;
//        }
//
//        $.each( buttons, function( name, props ) {
//            var click, buttonOptions;
//            props = $.isFunction( props ) ?
//            { click: props, text: name } :
//                props;
//            // Default to a non-submitting button
//            props = $.extend( { type: "button" }, props );
//            // Change the context for the click callback to be the main element
//            click = props.click;
//            props.click = function() {
//                click.apply( that.element[ 0 ], arguments );
//            };
//            buttonOptions = {
//                icons: props.icons,
//                text: props.showText
//            };
//            delete props.icons;
//            delete props.showText;
//            $( "<button></button>", props )
//                .button( buttonOptions )
//                .appendTo( that.uiButtonSet );
//        });
//        this.uiDialog.addClass( "ui-dialog-buttons" );
//        this.uiDialogButtonPane.appendTo( this.uiDialog );
//    },

    _makeDraggable: function() {
        var that = this,
            options = this.options;

        function filteredUi( ui ) {
            return {
                position: ui.position,
                offset: ui.offset
            };
        }
        this.modalContent.aeDraggable({
            cancel: ".modal-body, .close",
            handle: ".modal-header",
            containment: "document",
            start: function( event, ui ) {
                $( this ).addClass( "ui-dialog-dragging" );
                that._blockFrames();
                that._trigger( "dragStart", event, filteredUi( ui ) );
            },
            drag: function( event, ui ) {
                that._trigger( "drag", event, filteredUi( ui ) );
            },
            stop: function( event, ui ) {
//                var left = ui.offset.left - that.document.scrollLeft(),
//                    top = ui.offset.top - that.document.scrollTop();
//
//                options.position = {
//                    my: "left top",
//                    at: "left" + (left >= 0 ? "+" : "") + left + " " +
//                    "top" + (top >= 0 ? "+" : "") + top,
//                    of: that.window
//                };
//                $( this ).removeClass( "ui-dialog-dragging" );
//                that._unblockFrames();
                that._trigger( "dragStop", event, filteredUi( ui ) );
            }
        });
    },

    _makeResizable: function() {
        var that = this,
            options = this.options,
            handles = options.resizable,
        // .ui-resizable has position: relative defined in the stylesheet
        // but dialogs have to use absolute or fixed positioning
            position = this.modalContent.css("position"),
            resizeHandles = typeof handles === "string" ?
                handles	:
                "n,e,s,w,se,sw,ne,nw";

        function filteredUi( ui ) {
            return {
                originalPosition: ui.originalPosition,
                originalSize: ui.originalSize,
                position: ui.position,
                size: ui.size
            };
        }

        this.modalContent.aeResizable({
//            cancel: ".ui-dialog-content",
//            containment: "document",
            alsoResize: this.element,
            maxWidth: options.maxWidth,
            maxHeight: options.maxHeight,
            minWidth: options.minWidth,
            minHeight: this._minHeight(),
            handles: resizeHandles,
            start: function( event, ui ) {
                $( this ).addClass( "ui-dialog-resizing" );
                that._blockFrames();
                that._trigger( "resizeStart", event, filteredUi( ui ) );
            },
            resize: function( event, ui ) {
               that._trigger( "resize", event, filteredUi( ui ) );
            },
            stop: function( event, ui ) {
                var offset = that.uiDialog.offset(),
                    left = offset.left - that.document.scrollLeft(),
                    top = offset.top - that.document.scrollTop();

                options.height = that.uiDialog.height();
                options.width = that.uiDialog.width();
                options.position = {
                    my: "left top",
                    at: "left" + (left >= 0 ? "+" : "") + left + " " +
                    "top" + (top >= 0 ? "+" : "") + top,
                    of: that.window
                };
                $( this ).removeClass( "ui-dialog-resizing" );
                that._unblockFrames();
                that._trigger( "resizeStop", event, filteredUi( ui ) );
            }
        })
            .css( "position", position );
    },

    _trackFocus: function() {
        this._on( this.widget(), {
            focusin: function( event ) {
                this._makeFocusTarget();
                this._focusedElement = $( event.target );
            }
        });
    },

    _makeFocusTarget: function() {
        this._untrackInstance();
        this._trackingInstances().unshift( this );
    },

    _untrackInstance: function() {
        var instances = this._trackingInstances(),
            exists = $.inArray( this, instances );
        if ( exists !== -1 ) {
            instances.splice( exists, 1 );
        }
    },

    _trackingInstances: function() {
        var instances = this.document.data( "ui-dialog-instances" );
        if ( !instances ) {
            instances = [];
            this.document.data( "ui-dialog-instances", instances );
        }
        return instances;
    },

    _minHeight: function() {
        var options = this.options;

        return options.height === "auto" ?
            options.minHeight :
            Math.min( options.minHeight, options.height );
    },

    _position: function() {
        // Need to show the dialog to get the actual offset in the position plugin
        var isVisible = this.uiDialog.is( ":visible" );
        if ( !isVisible ) {
            this.uiDialog.show();
        }

        this.modalContent.position( this.options.position );
        if ( !isVisible ) {
            this.uiDialog.hide();
        }
    },

    _setOptions: function( options ) {
        var that = this,
            resize = false,
            resizableOptions = {};

        $.each( options, function( key, value ) {
            that._setOption( key, value );

            if ( key in that.sizeRelatedOptions ) {
                resize = true;
            }
            if ( key in that.resizableRelatedOptions ) {
                resizableOptions[ key ] = value;
            }
        });

        if ( resize ) {
            this._size();
            this._position();
        }
        if ( this.uiDialog.is( ":data(ui-resizable)" ) ) {
            this.uiDialog.resizable( "option", resizableOptions );
        }
    },

    _setOption: function( key, value ) {
        var isDraggable, isResizable,
            uiDialog = this.uiDialog;

        if ( key === "dialogClass" ) {
            uiDialog
                .removeClass( this.options.dialogClass )
                .addClass( value );
        }

        if ( key === "disabled" ) {
            return;
        }

        this._super( key, value );

        if ( key === "appendTo" ) {
            this.uiDialog.appendTo( this._appendTo() );
        }

//        if ( key === "buttons" ) {
//            this._createButtons();
//        }

//        if ( key === "closeText" ) {
//            this.uiDialogTitlebarClose.button({
//                // Ensure that we always pass a string
//                label: "" + value
//            });
//        }

        if ( key === "draggable" ) {
            isDraggable = uiDialog.is( ":data(ui-draggable)" );
            if ( isDraggable && !value ) {
                uiDialog.draggable( "destroy" );
            }

            if ( !isDraggable && value ) {
                this._makeDraggable();
            }
        }

        if ( key === "position" ) {
            this._position();
        }

        if ( key === "resizable" ) {
            // currently resizable, becoming non-resizable
            isResizable = uiDialog.is( ":data(ui-resizable)" );
            if ( isResizable && !value ) {
                uiDialog.resizable( "destroy" );
            }

            // currently resizable, changing handles
            if ( isResizable && typeof value === "string" ) {
                uiDialog.resizable( "option", "handles", value );
            }

            // currently non-resizable, becoming resizable
            if ( !isResizable && value !== false ) {
                this._makeResizable();
            }
        }
        /*//注释 2015-09-21
        if ( key === "title" ) {
            this._title( this.uiDialogTitlebar.find( ".ui-dialog-title" ) );
        }*/
    },

    _size: function() {
        // If the user has resized the dialog, the .ui-dialog and .ui-dialog-content
        // divs will both have width and height set, so we need to reset them
        var nonContentHeight, minContentHeight, maxContentHeight,
            options = this.options;

        // Reset content sizing
        this.element.show().css({
            width: "auto",
            minHeight: 0,
            maxHeight: "none",
            height: 0
        });

        if ( options.minWidth > options.width ) {
            options.width = options.minWidth;
        }
        // reset wrapper sizing
        // determine the height of all the non-content elements
        nonContentHeight = this.modalContent.css({
            height: "auto",
            width: options.width
        })
            .outerHeight();
        minContentHeight = Math.max( 0, options.minHeight - nonContentHeight );
        maxContentHeight = typeof options.maxHeight === "number" ?
            Math.max( 0, options.maxHeight - nonContentHeight ) :
            "none";

        if ( options.height === "auto" ) {
            this.element.css({
                minHeight: minContentHeight,
                maxHeight: maxContentHeight,
                height: "auto"
            });
        } else {
            this.element.height( Math.max( 0, options.height - nonContentHeight ) );
        }



        if ( this.uiDialog.is( ":data(ui-resizable)" ) ) {
            this.uiDialog.resizable( "option", "minHeight", this._minHeight() );
        }

        if(!this.element.hasClass('scorll-bar-box')){
        	this.element.addClass('scorll-bar-box');
        	$("#"+this.options.elementId).niceScroll();
    	}
    },

    _blockFrames: function() {
        this.iframeBlocks = this.document.find( "iframe" ).map(function() {
            var iframe = $( this );

            return $( "<div>" )
                .css({
                    position: "absolute",
                    width: iframe.outerWidth(),
                    height: iframe.outerHeight()
                })
                .appendTo( iframe.parent() )
                .offset( iframe.offset() )[0];
        });
    },

    _unblockFrames: function() {
        if ( this.iframeBlocks ) {
            this.iframeBlocks.remove();
            delete this.iframeBlocks;
        }
    },

    _allowInteraction: function( event ) {
        if ( $( event.target ).closest( ".ui-dialog" ).length ) {
            return true;
        }

        // TODO: Remove hack when datepicker implements
        // the .ui-front logic (#8989)
        return !!$( event.target ).closest( ".ui-datepicker" ).length;
    },

    _createOverlay: function() {
        if ( !this.options.modal ) {
            return;
        }

        // We use a delay in case the overlay is created from an
        // event that we're going to be cancelling (#2804)
        var isOpening = true;
        this._delay(function() {
            isOpening = false;
        });

        if ( !this.document.data( "ui-dialog-overlays" ) ) {

            // Prevent use of anchors and inputs
            // Using _on() for an event handler shared across many instances is
            // safe because the dialogs stack and must be closed in reverse order
            this._on( this.document, {
                focusin: function( event ) {
                    if ( isOpening ) {
                        return;
                    }

                    if ( !this._allowInteraction( event ) ) {
                        event.preventDefault();
                        this._trackingInstances()[ 0 ]._focusTabbable();
                    }
                }
            });
        }

        this.overlay = $( "<div>" )
            .addClass( "ui-widget-overlay ui-front" )
            .appendTo( this._appendTo() );
        this._on( this.overlay, {
            mousedown: "_keepFocus"
        });
        this.document.data( "ui-dialog-overlays",
            (this.document.data( "ui-dialog-overlays" ) || 0) + 1 );
    },

    _destroyOverlay: function() {
        if ( !this.options.modal ) {
            return;
        }

        if ( this.overlay ) {
            var overlays = this.document.data( "ui-dialog-overlays" ) - 1;

            if ( !overlays ) {
                this.document
                    .unbind( "focusin" )
                    .removeData( "ui-dialog-overlays" );
            } else {
                this.document.data( "ui-dialog-overlays", overlays );
            }

            this.overlay.remove();
            this.overlay = null;
        }
    }
});

});

/**
 * 日历模块
 * @module ui-calendar
 */
define('ui-calendar', function (require, exports, moudles) {
    "require:nomunge,exports:nomunge,moudles:nomunge";
    /**
     * 下拉框
     * @namespace ae.aeCalendar
     */
    $.aeWidget('ae.aeCalendar', {
        /**
         * 可选项
         * @name ae.aeCalendar#options
         * @property {object} options                      - 可选项
         * @property {boolean} options.enable              - 是否启用组件，默认为true即启用组件，为false则禁用组件。
         * @property {boolean} options.visible             - 是否隐藏组件，默认为false即显示组件，为false则隐藏组件
         * @property {string} options.dateFormat           - 日期格式字符串，默认为“yyyy-mm-dd”
         * @property {boolean} options.showTime            - 是否显示时分秒。默认为false即不显示时分秒，为true则显示时分秒。
         * @property {number} options.weekStart            - 日历下拉框中第一列是星期几。值为0-6的数字，分别代表星期天到星期六，默认起始星期是0，即星期天。
         * @property {boolean} options.showClear           - 是否显示清除按钮。默认为false即不显示，为true则显示清除按钮。
         * @property {boolean} options.timezone            - 是否使用时区。默认为false。
         * @property {boolean} options.timezoneValue       - 时区值。
         * @property {string} options.initType             - 初始化方式，如果为“html”则通过html来设置参数，如果为“js”则通过javascript中设置的option来初始化。
         * @property {boolean} options.showSeconds         - 是否显示秒数。
         */
        options: {
            enable: true,
            visible: true,
            dateFormat: false,
            showTime: false,
            weekStart: 0,
            showClear: false,
            _minViewMode: 0,
            _viewMode: 0,
            _flag: false,
            timezone : false,
            timezoneValue : '',
            isCurrentTime:false,
            initType: 'html',
            onValueChange:null,
            showSeconds:false
        },
        /**
         * 设置控件选中的日期
         * @name ae.aeCalendar#setValue
         * @function
         * @param {string} date 日期字符串
         * @example
         * $('#expiryDate').aeCombo("setValue","2016-01-01");
         */
        setValue: function(date){
            var d;
            if (!date) {
                this.element.val("");
            } else {
            	if(this.options.timezone){
            		date = date + "";
            		date = date.indexOf('T') != -1 ? date = date.replace('T',' ') : date;
            		if(date.indexOf('+') > 9 ){
            			this.options.timezoneValue = date.substring(date.indexOf('+'),date.length);
            			date = date.substring(0,date.indexOf('+'));
            		}
            		if(date.lastIndexOf('-') > 9 ){
            			this.options.timezoneValue = date.substring(date.lastIndexOf('-'),date.length);
            			date = date.substring(0,date.lastIndexOf('-'));
            		}
            	}
                d = this._parseDate(date);
                if (d) {
                    this.options._date = d;
                    this._fillDate();
                    this._fillTime();
                    this._set(d);
                }
            }
        },
        /**
         * 获取控件选中的日期。
         * @name ae.aeCalendar#getValue
         * @function
         * @return {string} 返回选中日期对应的字符串
         * @example
         * var date = $('#expiryDate').aeCalendar('getValue');
         */
        getValue: function () {
        	var value = this.element.val() || '';
        	if(value && this.options.timezone){
        		value = value.replace(' ','T');
        		value = value + this.options.timezoneValue;
        	}
            if(value && !this.options.showSeconds){
                value += ":00"
            }
        	return value;
        },
        /**
         * 清除当前日期
         * @name ae.aeCalendar#clear
         * @function
         * @example
         * $('#expiryDate').aeCalendar('clear');
         */
        clear: function () {
            this.element.val('');
            if (this.options.showClear) {
                this.element.next().hide();
            }
        },
        /**
         * 显示或隐藏组件
         * @name ae.aeCalendar#visible
         * @function
         * @param {boolean} value 为true显示组件，否则隐藏组件
         * @example
         * $('#expiryDate').aeCalendar('visible',false);
         */
        visible: function (value) {
            if (value === undefined || value === '') {
                value = true;
            }
            var $ele = this.element;
            if (value === true || value === 'true') {
                $ele.closest('div.input-group').removeClass('hidden');
                this.options.visible = true;
            }
            if (value === false || value === 'false') {
                $ele.closest('div.input-group').addClass('hidden');
                this.options.visible = false;
            }
        },
        /**
         * 设置控件的启用禁用状态
         * @name ae.aeCalendar#enable
         * @function
         * @param {boolean} value 为true则启用组件，否则禁用组件
         * @example
         * $('#expiryDate').aeCalendar('enable',false);
         */
        enable: function (value) {
            var self = this;
            if (value === undefined) {
                value = true;
            }
            var $ele = this.element;
            if (value === true || value === 'true') {
                this.options.enable = true;
                $ele.prop({'readonly': true, 'disabled': false}).addClass('form-readonly');
                $ele.closest('div.input-group').find('.btn-default').prop('disabled', false);
                self._attachDatePickerEvents();
                if (this.options.showClear) {
                    if ($ele.val() !== '' && typeof ($ele.val()) != 'undefined') {
                        $ele.next().show();
                    }
                    $ele.next().click(function () {
                        $ele.val('');
                        $(this).hide();
                        self._trigger("onClear");
                    });
                }
            }
            if (value === false || value === 'false') {
                this.options.enable = false;
                $ele.prop({'readonly': false, 'disabled': true}).removeClass('form-readonly').off();
                $ele.closest('div.input-group').find('.btn-default').prop('disabled', true);
                if ($ele.next().css("display") === 'block') {
                    $ele.next().hide();
                }
            }
        },
        /**
         * 设置控件的最小时间
         * @name ae.aeCalendar#setStartDate
         * @function
         * @param {string} date 日期字符串
         */
        setStartDate:function(date){
        	 var d = this._parseDate(date);
             if (d) {
                 this.options.startDate = d;
                 this._fillDate();
             }
        },
        /**
         * 设置控件的最大时间
         * @name ae.aeCalendar#setEndDate
         * @function
         * @param {string} date 日期字符串
         */
        setEndDate:function(date){
        	 var d = this._parseDate(date);
             if (d) {
                 this.options.endDate = d;
                 this._fillDate();
             }
        },
        /**
         * 设置是否禁用今天按钮
         * @name ae.aeCalendar#isDisableTodayBtn
         * @function
         * @param {boolean} value 为true则禁用
         */
        isDisableTodayBtn:function(value){
        	if (value === true || value === 'true') {
        		this.widget.find('>li >div.btn_box >button').hide();
        	    var today = new Date(),day;
        	    day = today.getDate();
        	    var active = this.widget.find('>li table >tbody >tr >td.active').text();
        	    if(day === parseInt(active)){
        	    	this.widget.find('>li table >tbody >tr >td.active').removeClass('active');
        	    }
            }
        },
        _create: function () {
            var $self = this.element, opts = this.options;
            if (opts.initType == 'html') {
                this._buildOptions(opts, $self);
            }
            var obj = $("<input></input>");
            obj.attr({"aeType": $self.attr("aeType"), "aeId": $self.attr("id"), "aeInit": "false", "aeValidate": $self.attr("aeValidate"), "rules": $self.attr("rules")});
            this.element = obj;
            $self.after(obj);
            $self.empty().hide();
            this.element.addClass('form-control').wrap('<div class="input-group"></div>');
            this.element.after('<span class="input-group-btn"><button class="btn btn-default"><i class="icon-calendar1"></i></button></span>');
        },
        _init: function () {
            var self = this,
                opts = this.options,
                $ele = this.element,
                defaultFormat = '',
                ss;

            if (!opts.visible) {
                $ele.closest('div.input-group').addClass('hidden');
            }
            if (opts.width) {
                $ele.closest('div.input-group').css("width", opts.width);
            }
            if (opts.showClear && opts.enable) {
                $ele.wrap('<div class="input-icon right"></div>');
                $('<i class="icon-error2"></i>').insertAfter($ele).on('click',this,function(event){
                    var oldValue=$ele.val(),
                        inst=event.data;
                    inst.element.attr("data-index","");
                    opts.value = '';
                    $ele.val('');
                    $(this).hide();
                    if(oldValue!==""){
                        $ele.trigger("valuechange",$ele);
                        inst._trigger("onValueChange", null,$ele, '', oldValue);
                    }
                }).hide();
            }
            if(!opts.dateFormat){
                if(opts.showTime){
                    if(opts.showSeconds){
                        defaultFormat = "yyyy-MM-dd hh:mm:ss";
                    }else{
                        defaultFormat = "yyyy-MM-dd hh:mm";
                    }
                }else{
                    defaultFormat = ("yyyy-MM-dd");
                }

            }
            this.format = opts.dateFormat || defaultFormat;
            self._compileFormat();
            var obj = document.body;
            var popupArray = $.aries.page.data._getHidedData("ae_popup_Id");
            if ($.isArray(popupArray)) {
                if (popupArray.length === 1) {
                    ss = popupArray[0];
                    obj = (ss && ss.popupType !== 'div') ? $("#" + ss.elementId) : document.body;
                }
                if (popupArray.length === 2) {
                    ss = popupArray[1];
                    obj = (ss && ss.popupType !== 'div') ? $("#" + ss.elementId) : document.body;
                }
            }
            this.widget = $(self._buildTemplate()).appendTo(obj);
            self._fillDow();
            self._fillMonths();
            self._fillHours();
            self._fillMinutes();
            self._fillSeconds();
            self._update();
            self._showMode();
            self.enable(!!opts.enable);
            if (opts.emptyText) {
                this.element.focus(function () {
                    self._refeshEmptyText(opts.emptyText);
                }).blur(function () {
                    self._refeshEmptyText(opts.emptyText);
                });
                self._refeshEmptyText(opts.emptyText);
            }
            if(opts.isCurrentTime){
            	var t = new Date(),
            	today = self._UTCDate(t.getFullYear(),
	                        t.getMonth(),
	                        t.getDate(),
	                        t.getHours(),
	                        t.getMinutes(),
	                        t.getSeconds(),
	                        t.getMilliseconds());
            	self._set(today);
            }
            //设置租户默认时区
            if(opts.timezone && $.aries.config.tenant){
            	var timezoneValue = $.cookie($.aries.config.tenant.TIMEZONE_KEY);
            	opts.timezoneValue = timezoneValue || '';
            }
        },
        _buildOptions: function (options, inputEl) {
            var i,
                funName,
                onValueChange = inputEl.attr("onValueChange"),
                onClear = inputEl.attr("onClear");

            options.visible = inputEl.attr("visible") == 'false' ? false : options.visible;
            options.enable = inputEl.attr("enable") == 'false' ? false : options.enable;
            options.dateFormat = inputEl.attr("dateFormat") || options.dateFormat;
            options.showTime = inputEl.attr("showTime") == 'true' ? true : options.showTime;
            options.weekStart = inputEl.attr("weekStart") ? parseInt(inputEl.attr("weekStart")) : options.weekStart;
            options.startDate = inputEl.attr("startDate");
            options.endDate = inputEl.attr("endDate");
            options.emptyText = inputEl.attr("emptyText");
            options.width = inputEl.attr("width");
            options.showClear = inputEl.attr("showClear") == 'true' ? true : options.showClear;
            options.timezone = inputEl.attr("timezone") == 'true' ? true : options.timezone;
            options.isCurrentTime = inputEl.attr("isCurrentTime") == 'true' ? true : options.isCurrentTime;

            if(inputEl.attr("showSeconds")==='false'){
                options.showSeconds = false;
            }else if(inputEl.attr("showSeconds")==='true'){
                options.showSeconds = true;
            }else{
                options.showSeconds = options.showSeconds;
            }

            if(onValueChange && typeof(onValueChange)==="string"){
                i = onValueChange.indexOf("(");
                funName=(i>0)?onValueChange.substring(0, i):onValueChange;
                options.onValueChange=(typeof(window[funName])==="function")?window[funName]:"";
            }

            funName="";
            if(onClear && typeof(onClear)==="string"){
                i = onClear.indexOf("(");
                funName = (i > 0)?onClear.substring(0, i):onClear;
            }
            options.onClear=(typeof(window[funName])==="function")?window[funName]:"";
        },
        _refeshEmptyText: function (emptyText) {
            var el = this.element;
            if (!emptyText)
                return;
            if (el.prop('placeholder') === '') {
                el.prop('placeholder', emptyText);
            } else {
                if (el.prop('placeholder') === emptyText) {
                    el.prop('placeholder', '');
                }
            }
        },
        _show: function (e) {
            var popupArray = $.aries.page.data._getHidedData("ae_popup_Id"), ss = '';
            if ($.isArray(popupArray)) {
                if (popupArray.length === 1) {
                    ss = popupArray[0];
                }
                if (popupArray.length === 2) {
                    ss = popupArray[1];
                }
            }
            var widgetTop, widgetLeft;
            var offset = this.element.offset();
            if (ss && ss.popupType !== 'div') {
                var popup = $("#" + ss.elementId).offset();
                widgetTop = offset.top + this.element.outerHeight() - popup.top;
                widgetLeft = offset.left - popup.left;
            } else {
                widgetTop = offset.top + this.element.outerHeight();
                widgetLeft = offset.left;

                //adjust the widget position Start
                //It does effect not in popup.
                var epos = offset;
                var wh = $(window).height();
                var ws = $(window).scrollTop();
                var woh = this.widget.outerHeight();
                var eoh = this.element.outerHeight();
                if (offset.top + eoh + woh > ws + wh) {
                    widgetTop = offset.top - woh ;
                }
            }

            this.widget.show().css({
                position: 'absolute',
                top: widgetTop,
                left: widgetLeft,
                right: 'auto'
            });
            this.element.trigger({
                type: 'show.aries',
                date: this.options._date
            });
            this._attachDatePickerGlobalEvents();
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
        },
        _hide: function () {
            var self = this;
            this.widget.hide();
            this.options._viewMode = 0;
            self._showMode();
            this.element.trigger({
                type: 'hide.aries',
                date: this.options._date
            });
            self._detachDatePickerGlobalEvents();
        },
        _detachDatePickerGlobalEvents: function () {
            $(document).off('mousedown.aeCalendar');
        },
        _showMode: function (dir) {
            if (dir) {
                this.options._viewMode = Math.max(this.options._minViewMode, Math.min(
                    2, this.options._viewMode + dir));
            }
            this.widget.find('.datepicker > div').hide().filter(
                '.datepicker-' + $.aeCalendar.modes[this.options._viewMode].clsName).show();
            if (this.options.showTime) {
                if (this.options._viewMode === 0) {
                    this.widget.find('.datepicker > div.datepicker-time').show();
                    if(!this.options.showSeconds){
                        this.widget.find('.datepicker > div.datepicker-time').find('[data-time-component="seconds"]').parents('div.input-group').remove();

                        $(this.widget.find('.datepicker > div.datepicker-time').addClass('datepicker-time-no-minute').find('span')[3]).remove();
                    }
                }
            }
            if (this.options._viewMode !== 0) {
                this.widget.find('.btn_box').hide();
            } else {
                this.widget.find('.btn_box').show();
            }
        },
        _attachDatePickerGlobalEvents: function () {
            $(document).on('mousedown.aeCalendar', $.proxy(this._hide, this));
        },
        _stopEvent: function (e) {
            e.stopPropagation();
            e.preventDefault();
        },
        _attachDatePickerEvents: function () {
            var self = this;
            this.widget.on('click', '.datepicker *', $.proxy(self._click, this));
            this.widget.on('mousedown.aeCalendar', $.proxy(self._stopEvent, this));
            this.element.on('click', $.proxy(self._show, this))
                .closest('div.input-group').find('span.input-group-btn').off().on('click', function () {
                    self.element.trigger('click');
                });
            this.widget.find('div.btn_box >button.btn-default').on('click', function () {
                var tmp = new Date();
                self.options._date = self._UTCDate(tmp.getFullYear(),
                    tmp.getMonth(),
                    tmp.getDate(),
                    tmp.getHours(),
                    tmp.getMinutes(),
                    tmp.getSeconds(),
                    tmp.getMilliseconds());
                self._fillDate();
                self._fillTime();
                self._set(self.options._date);
                self._notifyChange();
                self._hide();
            });
            this.widget.find('.datepicker-time > ul').on('mousedown.aeCalendar', $.proxy(self._stopEvent, this));
            this.widget.on('mousedown.aeCalendar', this.globalEvent = function () {
                self.widget.find('.datepicker-time > ul').hide();
            });
        },
        _set: function (value) {
            var formatted = '';
            if (!this._unset) formatted = this._formatDate(value);
            var input = this.element, oldValue = input.val(), valueChange = true;
            input.val(formatted);
            this._resetMaskPos(input);
            this.element.data('date', formatted);
            if (formatted == oldValue) {
                valueChange = false;
            }
            if (valueChange) {
                input.trigger("valuechange",input);
                if( this.options.onValueChange ){
                  this._trigger("onValueChange", null, input,formatted,oldValue);
                }
            }
            if (this.options.showClear) {
                this.element.next().show();
            }
        },
        _resetMaskPos: function (input) {
            var val = input.val();
            for (var i = 0; i < this._mask.length; i++) {
                if (this._mask[i].end > val.length) {
                    // If the mask has ended then jump to the next
                    this._maskPos = i;
                    break;
                } else if (this._mask[i].end === val.length) {
                    this._maskPos = i + 1;
                    break;
                }
            }
        },
        _formatDate: function (d) {
            var self = this;
            return this.format.replace($.aeCalendar.formatReplacer(), function (match) {
                var methodName, property, rv, len = match.length;
                if (match === 'ms')
                    len = 1;
                property = $.aeCalendar.dateFormatComponents[match].property;
                if (property === 'Hours12') {
                    rv = d.getUTCHours();
                    if (rv === 0) rv = 12;
                    else if (rv !== 12) rv = rv % 12;
                } else if (property === 'Period12') {
                    if (d.getUTCHours() >= 12) return 'PM';
                    else return 'AM';
                } else if (property === 'UTCYear') {
                    rv = d.getUTCFullYear();
                    rv = rv.toString().substr(2);
                } else {
                    methodName = 'get' + property;
                    rv = d[methodName]();
                }
                if (methodName === 'getUTCMonth') rv = rv + 1;
                return self._padLeft(rv.toString(), len, '0');
            });
        },
        _padLeft: function (s, l, c) {
            if (l < s.length) return s;
            else return Array(l - s.length + 1).join(c || ' ') + s;
        },
        _click: function (e) {
            var self=this,
                target,
                month,
                day,
                year;

            e.stopPropagation();
            e.preventDefault();
            this._unset = false;
            target = $(e.target).closest('span, td, th');

            if (target.length === 1) {
                if (!target.is('.disabled')) {
                    switch (target[0].nodeName.toLowerCase()) {
                        case 'th':
                            switch (target[0].className) {
                                case 'switch':
                                    if (target[0].colSpan === 2 || target[0].colSpan === 5) {
                                        this._showMode(1);
                                    }
                                    if (target[0].colSpan === 3) {
                                        this._showMode(2);
                                        this.options._flag = true;
                                    }
                                    break;
                                case 'prev':
                                case 'next':
                                    var vd = this.options._viewDate;
                                    var navFnc = $.aeCalendar.modes[this.options._viewMode].navFnc;
                                    var step = $.aeCalendar.modes[this.options._viewMode].navStep;
                                    if (target[0].className === 'prev') step = step * -1;
                                    vd['set' + navFnc](vd['get' + navFnc]() + step);
                                    this._fillDate();
                                    //this._set();
                                    break;
                            }
                            break;
                        case 'span':
                            if (target.is('.month')) {
                                month = target.parent().find('span').index(target);
                                this.options._viewDate.setUTCMonth(month);
                            }
                            if (target.is('.year')) {
                                year = parseInt(target.text(), 10) || 0;
                                this.options._viewDate.setUTCFullYear(year);
                            }
                            if (target.is('.input-group-btn')) {
                                var offset = target.prev().offset();
                                var obj = this.widget.find('.datepicker-time > ul').hide();
                                var ul = obj.filter('[data-time-component=' + target.attr('data-time-component') + ']');
                                ul.show().css({
                                    top: offset.top - this.widget.offset().top - 162,
                                    left: offset.left - this.widget.offset().left - 1,
                                    right: 'auto'
                                }).find('a').mousedown(function () {
                                    self._backfill(this);
                                });
                                var nowValue = target.prev().val();
                                ul.find('li').removeClass('current').find('>i.fa-check').remove();
                                if (nowValue !== undefined && nowValue !== '') {
                                    ul.find('a').each(function () {
                                        if ($(this).text() === nowValue) {
                                            $(this).parent().addClass('current').prepend('<i class="fa fa-check"></i>');
                                        }
                                    });
                                }
                                return;
                            }
                            if (this.options._viewMode !== 0) {
                                this.options._date = this._UTCDate(
                                    this.options._viewDate.getUTCFullYear(),
                                    this.options._viewDate.getUTCMonth(),
                                    this.options._viewDate.getUTCDate(),
                                    this.options._date.getUTCHours(),
                                    this.options._date.getUTCMinutes(),
                                    this.options._date.getUTCSeconds(),
                                    this.options._date.getUTCMilliseconds()
                                );
                                this._notifyChange();
                            }
                            if (this.options._flag) {
                                this._showMode(-2);
                                this.options._flag = false;
                            } else {
                                this._showMode(-1);
                            }
                            this._fillDate();
                            // this._set();
                            break;
                        case 'td':
                            if (target.is('.day')) {
                                day = parseInt(target.text(), 10) || 1;
                                month = this.options._viewDate.getUTCMonth();
                                year = this.options._viewDate.getUTCFullYear();
                                if (target.is('.old')) {
                                    if (month === 0) {
                                        month = 11;
                                        year -= 1;
                                    } else {
                                        month -= 1;
                                    }
                                } else if (target.is('.new')) {
                                    if (month == 11) {
                                        month = 0;
                                        year += 1;
                                    } else {
                                        month += 1;
                                    }
                                }
                                var currentDate = this._UTCDate(
                                    year, month, day,
                                    this.options._date.getUTCHours(),
                                    this.options._date.getUTCMinutes(),
                                    this.options._date.getUTCSeconds(),
                                    this.options._date.getUTCMilliseconds()
                                );
                                if(this.options.showTime && this._isDaylightSavingTime()){
                                	if(this._isInDaylightSavingTime(currentDate)){
                                		return;
                                	}
                                }
                                this.options._date = currentDate;
                                this.options._viewDate = this._UTCDate(
                                    year, month, Math.min(28, day), 0, 0, 0, 0);
                                this._fillDate();
                                this._set(this.options._date);
                                this._notifyChange();
                                if (!this.options.showTime) {
                                    this._hide();
                                }
                            }
                            break;
                    }
                }
            }
        },
        _backfill: function (source) {
            if (source.length === 0) {
                return;
            }
            var obj = this.widget.find('.datepicker-time > ul').filter(function () {
                if ($(this).css('display') == 'block')
                    return $(this);
            });
            obj.find('a').parent().removeClass('current').find('>i.fa-check').remove();
            $(source).parent().addClass('current').prepend('<i class="fa fa-check"></i>');
            var target = obj.find('li[class*=current] >a'),
                value = parseInt(target.text(), 10);
            obj.hide();
            var formatted = (this.options._date).toString();
        	var currentDate = new Date(formatted);
            if (obj.attr("data-time-component") === 'hours') {
            	currentDate.setUTCHours(value);
            }
            if (obj.attr("data-time-component") === 'minutes') {
            	currentDate.setUTCMinutes(value);
            }
            if (obj.attr("data-time-component") === 'seconds') {
            	currentDate.setUTCSeconds(value);
            }
            if(this.options.showTime && this._isDaylightSavingTime()){
            	if(this._isInDaylightSavingTime(currentDate)){
            		return;
            	}
            }
            this.options._date = currentDate;
            this._set(this.options._date);
            this._fillTime();
            this._notifyChange();
        },
        _notifyChange: function () {
            this.element.trigger({
                type: 'changeDate',
                date: this._getDate(),
                localDate: this._getLocalDate()
            });
        },
        _getLocalDate: function () {
            if (this._unset) return null;
            var d = this.options._date;
            return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(),
                d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds());
        },
        _getDate: function () {
            if (this._unset) return null;
            return new Date(this.options._date.valueOf());
        },
        _update: function (newDate) {
            var dateStr = newDate, self = this, $el = this.element, opts = this.options;
            if (!dateStr) {
                dateStr = $el.val();
                if (dateStr) {
                    opts._date = self._parseDate(dateStr);
                }
                if (!opts._date) {
                    var tmp = new Date();
                    opts._date = self._UTCDate(tmp.getFullYear(),
                        tmp.getMonth(),
                        tmp.getDate(),
                        tmp.getHours(),
                        tmp.getMinutes(),
                        tmp.getSeconds(),
                        tmp.getMilliseconds());
                }
            }
            opts._viewDate = self._UTCDate(opts._date.getUTCFullYear(), opts._date.getUTCMonth(), 1, 0, 0, 0, 0);
            self._fillDate();
            self._fillTime();
        },
        _fillDow: function () {
            var dowCnt = this.options.weekStart;
            var html = $('<tr>');
            while (dowCnt < this.options.weekStart + 7) {
                html.append('<th class="dow">' + $.aeCalendar.daysMin[(dowCnt++) % 7] + '</th>');
            }
            this.widget.find('.datepicker-days thead').append(html);
        },
        _fillMonths: function () {
            var html = '',
                i = 0;
            while (i < 12) {
                html += '<span class="month">' + $.aeCalendar.monthsShort[i++] + '</span>';
            }
            this.widget.find('.datepicker-months td').append(html);
        },
        _fillDate: function () {
            var self = this,
                i,
                opts = this.options,
                _date = opts._date,
                year = opts._viewDate.getUTCFullYear(),
                month = opts._viewDate.getUTCMonth(),
                tmp = new Date(),
                currentDate = self._UTCDate(
                    _date.getUTCFullYear(),
                    _date.getUTCMonth(),
                    _date.getUTCDate(),
                    0, 0, 0, 0
                ),
                systemDate = self._UTCDate(
                    tmp.getUTCFullYear(),
                    tmp.getUTCMonth(),
                    tmp.getUTCDate(),
                    0, 0, 0, 0);
            if (typeof opts.startDate === 'string') {
                opts.startDate = self._parseDate(opts.startDate);
            }
            if (typeof opts.endDate === 'string') {
                opts.endDate = self._parseDate(opts.endDate);
            }
            var startYear = typeof opts.startDate === 'object' ? opts.startDate.getUTCFullYear() : -Infinity;
            var startMonth = typeof opts.startDate === 'object' ? opts.startDate.getUTCMonth() : -1;
            var endYear = typeof opts.endDate === 'object' ? opts.endDate.getUTCFullYear() : Infinity;
            var endMonth = typeof opts.endDate === 'object' ? opts.endDate.getUTCMonth() : 12;
            this.widget.find('.datepicker-days').find('.disabled').removeClass('disabled');
            this.widget.find('.datepicker-months').find('.disabled').removeClass('disabled');
            this.widget.find('.datepicker-years').find('.disabled').removeClass('disabled');
            var datepickerDays = this.widget.find('.datepicker-days th:eq(1)');
            datepickerDays.text($.aeCalendar.months[month]);
            datepickerDays.next().text(year);
            var prevMonth = self._UTCDate(year, month - 1, 28, 0, 0, 0, 0);
            var day = $.aeCalendar.getDaysInMonth(
                prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
            prevMonth.setUTCDate(day);
            prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - opts.weekStart + 7) % 7);
            if ((year == startYear && month <= startMonth) || year < startYear) {
                this.widget.find('.datepicker-days th:eq(0)').addClass('disabled');
            }
            if ((year == endYear && month >= endMonth) || year > endYear) {
                this.widget.find('.datepicker-days th:eq(3)').addClass('disabled');
            }
            var nextMonth = new Date(prevMonth.valueOf());
            nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
            nextMonth = nextMonth.valueOf();
            var html = [];
            var row;
            var clsName;
            while (prevMonth.valueOf() < nextMonth) {
                if (prevMonth.getUTCDay() === opts.weekStart) {
                    row = $('<tr>');
                    html.push(row);
                }
                clsName = '';
                if (prevMonth.getUTCFullYear() < year ||
                    (prevMonth.getUTCFullYear() == year &&
                    prevMonth.getUTCMonth() < month)) {
                    clsName += ' old';
                } else if (prevMonth.getUTCFullYear() > year ||
                    (prevMonth.getUTCFullYear() == year &&
                    prevMonth.getUTCMonth() > month)) {
                    clsName += ' new';
                }
                if (prevMonth.valueOf() === currentDate.valueOf()) {
                    clsName += ' active';
                }
                if (prevMonth.valueOf() === systemDate.valueOf()) {
                    if (clsName !== ' active') {
                        clsName += ' today';
                    }
                }
                if ((prevMonth.valueOf() + 86400000) <= opts.startDate) {
                	if(clsName === ' active'){
                		clsName = '';
                	}
                    clsName += ' disabled';
                }
                if (prevMonth.valueOf() > opts.endDate) {
                    clsName += ' disabled';
                }
                row.append('<td class="day' + clsName + '">' + prevMonth.getUTCDate() + '</td>');
                prevMonth.setUTCDate(prevMonth.getUTCDate() + 1);
            }
            this.widget.find('.datepicker-days tbody').empty().append(html);
            var currentYear = _date.getUTCFullYear();
            var months = this.widget.find('.datepicker-months')
                .find('th:eq(1)').text(year).end().find('span').removeClass('active');
            if (currentYear === year) {
                months.eq(_date.getUTCMonth()).addClass('active');
            }
            if (currentYear - 1 < startYear) {
                this.widget.find('.datepicker-months th:eq(0)').addClass('disabled');
            }
            if (currentYear + 1 > endYear) {
                this.widget.find('.datepicker-months th:eq(2)').addClass('disabled');
            }
            for (i = 0; i < 12; i++) {
                if ((year == startYear && startMonth > i) || (year < startYear)) {
                    $(months[i]).addClass('disabled');
                } else if ((year == endYear && endMonth < i) || (year > endYear)) {
                    $(months[i]).addClass('disabled');
                }
            }
            html = '';
            year = parseInt(year / 10, 10) * 10;
            var yearCont = this.widget.find('.datepicker-years').find(
                'th:eq(1)').text(year + '-' + (year + 9)).end().find('td');
            this.widget.find('.datepicker-years').find('th').removeClass('disabled');
            if (startYear > year) {
                this.widget.find('.datepicker-years').find('th:eq(0)').addClass('disabled');
            }
            if (endYear < year + 9) {
                this.widget.find('.datepicker-years').find('th:eq(2)').addClass('disabled');
            }
            year -= 1;
            for (i = -1; i < 11; i++) {
                html += '<span class="year' + (i === -1 || i === 10 ? ' old' : '') + (currentYear === year ? ' active' : '') + ((year < startYear || year > endYear) ? ' disabled' : '') + '">' + year + '</span>';
                year += 1;
            }
            yearCont.html(html);
        },
        _fillTime: function () {
            var _date = this.options._date;
            if (!_date)
                return;
            var timeComponents = this.widget.find('.datepicker-time input[data-time-component]');
            var hour = this._padLeft(_date.getUTCHours().toString(), 2, '0');
            var minute = this._padLeft(_date.getUTCMinutes().toString(), 2, '0');
            var second = this._padLeft(_date.getUTCSeconds().toString(), 2, '0');
            timeComponents.filter('[data-time-component=hours]').val(hour);
            timeComponents.filter('[data-time-component=minutes]').val(minute);
            timeComponents.filter('[data-time-component=seconds]').val(second);
        },
        _fillHours: function () {
            var timeComponents = this.widget.find('.datepicker-time div.input-group'),
                html = '<ul class="dropdown-menu thin-scroll" id="' + this.element.attr("aeId") + '_hours" data-time-component="hours" style="height:160px;width:64px;overflow-y:auto">',
                current = 0,
                i;
            for (i = 0; i < 24; i += 1) {
                var c = current.toString();
                html += '<li><a href="#">' + this._padLeft(c, 2, '0') + '</a></li>';
                current++;
            }
            html += '</ul>';
            $(timeComponents[0]).next().after(html);
            $("#" + this.element.attr("aeId") + "_hours").niceScroll();
        },
        _fillMinutes: function () {
            var timeComponents = this.widget.find('.datepicker-time div.input-group'),
                html = '<ul class="dropdown-menu thin-scroll" id="' + this.element.attr("aeId") + '_minutes" data-time-component="minutes" style="height:160px;width:64px;overflow-y:auto">',
                current = 0,
                i;
            for (i = 0; i < 60; i += 1) {
                var c = current.toString();
                html += '<li><a href="#">' + this._padLeft(c, 2, '0') + '</a></li>';
                current++;
            }
            html += '</ul>';
            $(timeComponents[1]).next().after(html);
            $("#" + this.element.attr("aeId") + "_minutes").niceScroll();
        },
        _fillSeconds: function () {
            var timeComponents = this.widget.find('.datepicker-time div.input-group'),
                html = '<ul class="dropdown-menu thin-scroll" id="' + this.element.attr("aeId") + '_seconds" data-time-component="seconds" style="height:160px;width:64px;overflow-y:auto">',
                current = 0,
                i,
                c;
            for (i = 0; i < 60; i += 1) {
                c = current.toString();
                html += '<li><a href="#">' + this._padLeft(c, 2, '0') + '</a></li>';
                current++;
            }
            html += '</ul>';
            $(timeComponents[2]).after(html);
            $("#" + this.element.attr("aeId") + "_seconds").niceScroll();
        },
        _buildTemplate: function () {
            return (
                '<div class="datetimepicker-widget dropdown-menu">' +
                '<li class="collapse in">' +
                '<div class="datepicker">' +
                $.aeCalendar.template() +
                '</div>' +
                '<div class="btn_box">' +
                '<button class="btn btn-default">Today</button>' +
                '</div>' +
                '</li>' +
                '</div>'
            );
        },
        _compileFormat: function () {
            var self = this,
                match,
                component,
                components = [],
                mask = [],
                //str = self.format,yyyy-MM-dd hh:mm:ss
                str = 'yyyy-MM-dd hh:mm:ss',
                propertiesByIndex = {},
                i = 0,
                pos = 0,
                formatComponent = $.aeCalendar.formatComponent(),
                dateFormatComponents = $.aeCalendar.dateFormatComponents;
            while (match = formatComponent.exec(str)) {
                component = match[0];
                if (component in dateFormatComponents) {
                    i++;
                    propertiesByIndex[i] = dateFormatComponents[component].property;
                    components.push('\\s*' + dateFormatComponents[component].getPattern(this) + '\\s*');
                    mask.push({
                        pattern: new RegExp(dateFormatComponents[component].getPattern(this)),
                        property: dateFormatComponents[component].property,
                        start: pos,
                        end: pos += component.length
                    });
                }else {
                    components.push(self._escapeRegExp(component));
                    mask.push({
                        pattern: new RegExp(self._escapeRegExp(component)),
                        character: component,
                        start: pos,
                        end: ++pos
                    });
                }
                str = str.slice(component.length);
            }
            this._mask = mask;
            this._maskPos = 0;
            this._formatPattern = new RegExp(
                '^\\s*' + components.join('') + '\\s*$');
            this._propertiesByIndex = propertiesByIndex;
        },
        _escapeRegExp: function (str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        },
        _parseDate: function (str) {
            var match, i, property, methodName, value, parsed = {};
            if (!(match = this._formatPattern.exec(str)))
                return null;
            for (i = 1; i < match.length; i++) {
                property = this._propertiesByIndex[i];
                if (!property)
                    continue;
                value = match[i];
                if (/^\d+$/.test(value))
                    value = parseInt(value, 10);
                parsed[property] = value;
            }
            return this._finishParsingDate(parsed);
        },
        _finishParsingDate: function (parsed) {
            var year, month, date, hours, minutes, seconds, milliseconds;
            year = parsed.UTCFullYear;
            if (parsed.UTCYear) year = 2000 + parsed.UTCYear;
            if (!year) year = 1970;
            if (parsed.UTCMonth) month = parsed.UTCMonth - 1;
            else month = 0;
            date = parsed.UTCDate || 1;
            hours = parsed.UTCHours || 0;
            minutes = parsed.UTCMinutes || 0;
            seconds = parsed.UTCSeconds || 0;
            milliseconds = parsed.UTCMilliseconds || 0;
            if (parsed.Hours12) {
                hours = parsed.Hours12;
            }
            if (parsed.Period12) {
                if (/pm/i.test(parsed.Period12)) {
                    if (hours != 12) hours = (hours + 12) % 24;
                } else {
                    hours = hours % 12;
                }
            }
            return this._UTCDate(year, month, date, hours, minutes, seconds, milliseconds);
        },
        _UTCDate: function () {
            return new Date(Date.UTC.apply(Date, arguments));
        },
        _isDaylightSavingTime : function (){
            /*var start = new Date();
            //得到一年的开始时间
            start.setMonth(0);
            start.setDate(1);
            start.setHours(0);
            start.setMinutes(0);
            start.setSeconds(0);
            //得到一年的年中时间
            var middle = new Date(start.getTime());
            middle.setMonth(6);
            // 如果年始和年中时差相同，则认为此国家没有夏令时
            if ((middle.getTimezoneOffset() - start.getTimezoneOffset()) == 0) {
                return false;
            }
            return true;*/
        	var rtn = false;
        	if(this.options.timezone && this.options.timezoneValue){
        		switch(this.options.timezoneValue){
        			case '+0000' :
        				rtn = true;
        				break;
        			case '+1000' :
        				rtn = true;
        				break;
        			default :
        				break;
        		}
        	}
        	return rtn;
        },
        _isInDaylightSavingTime : function (orgindata){
        	var formatted = this._formatDate(orgindata) ;
        	var data = new Date(formatted);
      	  	var dateGap = 31 - data.getDate();
      	  	var $msg = $('div[aria-describedby*=messagebox_div]');
      	  	if((data.getMonth()+1) == 3 && data.getDay()==0 && dateGap < 7 && data.getHours() == 2){
      	  		if(!$msg.length){
      	  			$.message.alert("","The last Sunday in March between 02:00:00 and 02:59:59 can not be selected!");
      	  		}
      		    return true;
      	  	}
      	  	return false;
        },
        _destroy:function(){
            this.widget.remove();
            this.widget=null;
        }
    });
    $.aeCalendar = $.aeCalendar || {};
    $.extend($.aeCalendar, {
        dateFormatComponents: {
            dd: {
                property: 'UTCDate', getPattern: function () {
                    return '(0?[1-9]|[1-2][0-9]|3[0-1])\\b';
                }
            },
            MM: {
                property: 'UTCMonth', getPattern: function () {
                    return '(0?[1-9]|1[0-2])\\b';
                }
            },
            yy: {
                property: 'UTCYear', getPattern: function () {
                    return '(\\d{2})\\b';
                }
            },
            yyyy: {
                property: 'UTCFullYear', getPattern: function () {
                    return '(\\d{4})\\b';
                }
            },
            hh: {
                property: 'UTCHours', getPattern: function () {
                    return '(0?[0-9]|1[0-9]|2[0-3])\\b';
                }
            },
            mm: {
                property: 'UTCMinutes', getPattern: function () {
                    return '(0?[0-9]|[1-5][0-9])\\b';
                }
            },
            ss: {
                property: 'UTCSeconds', getPattern: function () {
                    return '(0?[0-9]|[1-5][0-9])\\b';
                }
            },
            ms: {
                property: 'UTCMilliseconds', getPattern: function () {
                    return '([0-9]{1,3})\\b';
                }
            },
            HH: {
                property: 'Hours12', getPattern: function () {
                    return '(0?[1-9]|1[0-2])\\b';
                }
            },
            PP: {
                property: 'Period12', getPattern: function () {
                    return '(AM|PM|am|pm|Am|aM|Pm|pM)\\b';
                }
            }
        },
        formatComponent: function () {
            var keys = [];
            for (var k in $.aeCalendar.dateFormatComponents) keys.push(k);
            keys[keys.length - 1] += '\\b';
            keys.push('.');
            return new RegExp(keys.join('\\b|'));
        },
        formatReplacer: function () {
            var keys = [];
            for (var k in $.aeCalendar.dateFormatComponents) keys.push(k);
            keys[keys.length - 1] += '\\b';
            keys.push('.');
            keys.pop();
            return new RegExp(keys.join('\\b|'), 'g');
        },
        isLeapYear: function (year) {
            return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
        },
        getDaysInMonth: function (year, month) {
            return [31, ($.aeCalendar.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        },
        getHeadTemplate: function () {
            return (
            '<thead>' +
            '<tr>' +
            '<th class="prev">&lsaquo;</th>' +
            '<th colspan="5" class="switch"></th>' +
            '<th class="next">&rsaquo;</th>' +
            '</tr>' +
            '</thead>'
            );
        },
        getContTemplate: function () {
            return '<tbody><tr><td colspan="7"></td></tr></tbody>';
        },
        template: function () {
            return (
            '<div class="datepicker-days">' +
            '<table class="table-condensed">' +
            '<thead>' +
            '<tr>' +
            '<th class="prev">&lsaquo;</th>' +
            '<th colspan="2" class="switch"></th>' +
            '<th colspan="3" class="switch"></th>' +
            '<th class="next">&rsaquo;</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody></tbody>' +
            '</table>' +
            '</div>' +
            '<div class="datepicker-months">' +
            '<table class="table-condensed">' +
            $.aeCalendar.getHeadTemplate() +
            $.aeCalendar.getContTemplate() +
            '</table>' +
            '</div>' +
            '<div class="datepicker-years">' +
            '<table class="table-condensed">' +
            $.aeCalendar.getHeadTemplate() +
            $.aeCalendar.getContTemplate() +
            '</table>' +
            '</div>' +
            '<div class="datepicker-time">' +
            '<div class="input-group">' +
            '<input type="text" class="form-control" maxlength="3" data-time-component="hours">' +
            '<span class="input-group-btn" data-time-component="hours"><button type="button" class="btn btn-default btn-sm"><i class="fa fa-sort"></i></button></span>' +
            '</div>' +
            '<span>：</span>' +
            '<div class="input-group">' +
            '<input type="text" class="form-control" maxlength="3" data-time-component="minutes">' +
            '<span class="input-group-btn" data-time-component="minutes"><button type="button" class="btn btn-default btn-sm"><i class="fa fa-sort"></i></button></span>' +
            '</div>' +
            '<span>：</span>' +
            '<div class="input-group">' +
            '<input type="text" class="form-control" maxlength="3" data-time-component="seconds">' +
            '<span class="input-group-btn" data-time-component="seconds"><button type="button" class="btn btn-default btn-sm"><i class="fa fa-sort"></i></button></span>' +
            '</div>' +
            '</div>'
            );
        },
        modes: [
            {
                clsName: 'days',
                navFnc: 'UTCMonth',
                navStep: 1
            },
            {
                clsName: 'months',
                navFnc: 'UTCFullYear',
                navStep: 1
            },
            {
                clsName: 'years',
                navFnc: 'UTCFullYear',
                navStep: 10
            }
        ],
        daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    });
});

define('ui-checkbox',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
//;(function($){
	 $.aeWidget('ae.aeCheckbox', {
		 options:{
			 /**
              * 是否水平排列，默认水平排列。
              * @type Boolean
              * @default true
              * @example
              * isHorizontal : false
              */
			 isHorizontal:true,
			 /**
              * 支持多个选项之间的分隔符，默认为 ','.
              * @type String
              * @default ','
              * @example
              *  multiSeparator : ';'
              */
             multiSeparator : ',',
             /**
              * 是否禁用组件。如果禁用，则不可以输入，form提交时也将忽略这个输入框。
              * @type Boolean
              * @default true
              * @example
              * enable : false
              */
             enable : true,
             /**
              * 隐藏组件。
              * @type Boolean
              * @default true
              * @example
              * visible : false
              */
             visible :true,
             /**
              * JSON对象中哪个字段作为radio的label属性，可以指定为JSON的一个属性。
              * @type String
              * @default 'text'
              * @example
              * labelField : 'codeName'
              */
             labelField : 'text',
             /**
              * JSON对象中哪个字段作为radio的label属性，可以指定为JSON的一个属性。
              * @type String
              * @default 'value'
              * @example
              * valueField : 'codeValue'
              */
             valueField : 'value',
             /**
              * aeCheckbox初始化方式，默认通过html来设置参数。传值为js时，则通过js中设置的option来初始化。
              * @type String
              * @default 'html'
              * @example
              * $('.selector').aeCheckbox({initType : 'js'});
              */
             initType : 'html'
		 },
		 _create:function(){
			 var options=this.options,
			 	inputEl=this.element,
				id=inputEl.attr("id");
			 if(options.initType=='html'){
	             this._buildOptions(options,inputEl);
	         }
			 if(id){
			 	inputEl.attr("aeId",id);
			 }
             inputEl.hide();
		 },
		 _init:function(){
			 var self = this,
			     options = self.options,
			     source = options.dataSource,
			     inputEl = self.element;

	         options.aeType ? inputEl.attr("aeType",options.aeType) : inputEl.attr("aeType","aeCheckbox");

	         if(source && typeof source == 'string'){
           	     source = $.parseJSON(source);
           	     self.reload(source);
             }
		 },
		 _buildOptions:function(options,inputEl){
			 options.isHorizontal = inputEl.attr("isHorizontal") =='false' ? false : options.isHorizontal;
		     options.multiSeparator = inputEl.attr("multiSeparator")|| options.multiSeparator;
			 options.enable = inputEl.attr("enable") =='false' ? false : options.enable;
		     options.visible = inputEl.attr("visible") == 'false' ? false : options.visible;
		     options.aeType = inputEl.attr("aeType");
	         options.labelField = inputEl.attr("labelField") || options.labelField;
	         options.valueField = inputEl.attr("valueField") || options.valueField;
		     options.dataSource = inputEl.attr("dataSource");

		     var onSelect = inputEl.attr("onSelect");
	         options.onSelect=onSelect ? function(event){
					if($.isString(onSelect)){
						var i = onSelect.indexOf("(");
						var actName = i>0 ? onSelect.substring(0, i) : onSelect;
						var func = 	"return window."+actName+"?"+actName+".call(window,e):false;";
						return new Function("e",func)(event);
					}
	        }: options.onSelect;
		 },
		 _bindEvent:function(){
			 var self = this,
			     onSelect = self.options.onSelect,
			     label = self._getAllOptions();
			 label.off('click.aeCheckbox').on('click.aeCheckbox',function(event){
				 event.preventDefault();
				 event.stopPropagation();
				 event.cancelBubble=true;
				 $(this).hasClass('checked') ? $(this).removeClass('checked') : $(this).addClass('checked');
				 if (onSelect) {
					 if(onSelect){
			             self._trigger("onSelect",null,event);
					 }
		         }
			 });
		 },
		/**
         * 得到aeCheckbox的值。
         * @function
         * @name aeCheckbox#getValue
         * @returns 返回aeCheckbox的值
         *
         */
		 getValue:function(){
			 var options=this.options,
			     input = this._getAllOptions(),
			     values=[];
			 input.each(function(){
				 if($(this).hasClass('checked')){
					 values.push('' + $(this).prev().val());
				 }
			 });
			 return values.join(options.multiSeparator);
		 },
	   /**
         * 得到aeCheckbox的值。
         * @function
         * @name aeCheckbox#setValue
         *
         */
		 setValue:function(value){
		    if (typeof value === 'undefined' || value === '' || value == null){
        		return;
        	}
            var self = this,valueEl = self.element,options = self.options,
                values=[],
                allValues = $.data(valueEl, 'allValues'),
                input = self._getAllOptions();
            input.removeClass('checked');
            values = value.split(options.multiSeparator);
            for (var i=0; i<values.length; i++) {
                var index = allValues?allValues.indexOf(values[i]):-1;
                if(index>-1){
                	if(!$(input[index]).hasClass('disabled')){
	                	$(input[index]).addClass('checked');
                	}
                }
            }
	     },
	   /**
         * 得到aeCheckbox的显示值。
         * @function
         * @name aeCheckbox#getDisplayText
         * @returns 返回aeCheckbox的显示值
         *
         */
        getDisplayText:function(){
        	 var options=this.options,
			     input = this._getAllOptions(),
			     textValues=[];
			 input.each(function(){
				 if($(this).hasClass('checked')){
					 textValues.push('' + $(this).text());
				 }
			 });
			 return textValues.join(options.multiSeparator);
	    },
       /**
         * 清除aeCheckbox的值。
         * @function
         * @name aeCheckbox#clear
         *
         */
	     clear:function(){
	    	 this._getAllOptions().removeClass('checked');
	     },
	    /**
         * 加载aeCheckbox数据。
         * @function
         * @name aeCheckbox#reload
         *
         */
	     reload:function(data){
	    	 this._loadData(data);
	         if(!this.options.visible){
				 this.element.nextAll('.ckbox').addClass('hidden');
			 }
             !this.options.enable ? this.enable(false) : this.enable(true);
	     },
	     /**
	       * 设置控件的启用禁用状态　value = true(启用),则会将input设置为可用状态,false(禁用),则会将input设置为不可用
	       * @name aeCheckbox#enable(value)
	       * @function
	       * @returns jQuery对象
	       * @example
	       * $('#input').aeCheckbox('enable',false);
	       * $('#input').aeCheckbox('enable',true);
	     */
	     enable : function(value){
	    	if(value === undefined){
	    		value = true;
	    	}
	    	var self = this,opts = self.options,enable = opts.enable,
	    	    input = self._getAllOptions();
	    	if(value === true || value === 'true'){
	    		input.removeClass('disabled');
		        enable = true;
		        this._bindEvent();
	    	}
	    	if(value === false || value === 'false'){
	    		input.addClass('disabled').off('click.aeCheckbox');
	    		enable = false;
	    	}
	     },
	     /**
	       * 显示和隐藏组件　value = true(显示),false(隐藏)
	       * @name aeCheckbox#visible(value)
	       * @function
	       * @returns jQuery对象
	       * @example
	       * $('#input').aeCheckbox('visible',false);
	       * $('#input').aeCheckbox('visible',true);
	    */
	    visible : function(value){
	    	if(value === undefined){
	    		value = true;
	    	}
	    	var $ele = this.element,visible = this.options.visible;
	    	if(value === true || value === 'true'){
	    		$ele.nextAll('.ckbox').removeClass('hidden');
	    		visible = true;
	    	}
	    	if(value === false || value === 'false'){
	    		$ele.nextAll('.ckbox').addClass('hidden');
	    		visible = false;
	    	}
	    },
	   _loadData:function(records){
	          var self = this,valueEl=self.element,innerHtml='',
	              allValues = [];
	          if(valueEl.nextAll('.ckbox').length>0){
	        	  valueEl.nextAll('.ckbox').remove();
	          }
	          $(records).each(function(index,item){
	              innerHtml += self._wrapText(item);
	              allValues.push('' + item[self.options.valueField]);
	          });
	          $(innerHtml).insertAfter(valueEl);
	          $.data(valueEl, 'allValues', allValues);
	   },
	   _getAllOptions:function(){
		   return  this.element.nextAll('.ckbox').find('>label');
	   },
	   _wrapText:function(item) {
	        return '<div class="ckbox ckbox-default '+(this.options.isHorizontal ? 'ckbox_horizontal' : '')+'"><input type="checkbox" id="'+item[this.options.valueField]+'" value="'+item[this.options.valueField]+'"/><label for="'+item[this.options.valueField]+'" class="'+(item.checked ? 'checked' : '')+' '+(item.disabled ? 'disabled' : '' )+'">'+item[this.options.labelField]+'</label></div>';
	   }
	 });
//})(jQuery);
});

/**
 * 下拉框模块
 * @module ui-combo
 */
define('ui-combo', function (require, exports, moudles) {
    "require:nomunge,exports:nomunge,moudles:nomunge";
    /**
     * 下拉框
     * @namespace ae.aeCombo
     */
    $.aeWidget('ae.aeCombo', {
        /**
         * 可选项
         * @name ae.aeCombo#options
         * @property {object} options                      - 可选项
         * @property {string|function} options.optionField - 字段名，在调用 {@link load} 方法时将使用这个名称到指定的JSON对象内获取下拉框需要展现的下拉项文本。
         * @property {string|function} options.valueField  - 字段值，在调用 {@link load} 方法时将使用这个名称到指定的JSON对象内获取下拉框需要展现的下拉项文本。
         * @property {boolean} options.enable              - 是否启用组件，如果为true则启用组件，否则禁用组件。
         * @property {number} options.listMaxHeight        - 组件的下拉框的最大高度，默认值为300px，当内容超出最大高度时，以最大高度值显示，并出现滚动条。当内容区域在最大值范围内时，高度自适应显示。特殊情况下最大值是支持可配置原则。
         * @property {boolean} options.multi               - 是否多选，如果为true则组件能够多选，否则不能多选。
         * @property {string} options.multiSeparator       - 支持多选时的多个选项之间的分隔符，默认为","。
         * @property {string} options.showClear            - 是否显示清除按钮。
         * @property {string} options.initType             - 初始化方式，如果为“html”则通过html来设置参数，如果为“js”则通过javascript中设置的option来初始化。
         * @property {function|null} options.onValueChange - 值改变事件回调函数
         */
        options: {
            optionLabel:"",
            optionField: 'text',
            valueField: 'value',
            enable: true,
            visible: true,
            listMaxHeight: 300,
            multi: false,
            multiSeparator: ",",
            showClear: false,
            initType: 'html',
            _keyIndex: -1,
            _scrollTop: -28,
            editable:false,
            onValueChange:null
        },
        /**
         * 加载combo数据。
         * @name ae.aeCombo#reload
         * @function
         * @param  {object} data 数据对象
         * @example
         * $('#mycombo').aeCombo("reload",data);
         */
        reload: function (data) {
            var self = this, inputEl = self.textInput, valueEl = self.element;
            self.options.value = '';
            valueEl.val('');
            inputEl.val('');
            self._loadData(data);
        },
        /**
         * 得到combo的value值。
         * @name ae.aeCombo#getValue
         * @function
         * @returns 返回combo的value值
         * @example
         * var v=$('#mycombo').aeCombo("getValue");
         * console.debug("value is "+v);
         */
        getValue: function () {
            var value = this.element.val();
            return value ? value : '';
        },
        /**
         * 设置combo的value值。
         * @name ae.aeCombo#setValue
         * @function
         * @param {string} value 设置的值
         * @return 返回组件实例对象。
         * @example
         * $('#mycombo').aeCombo("setValue","01");
         */
        setValue: function (value) {
            this._setValue(value + '');
            return this;
        },
        /**
         * 设置combo的默认值。
         * @name ae.aeCombo#setDefault
         * @function
         * @param {string} value 设置的默认值
         * @return 返回组件实例对象。
         * @example
         * $('#mycombo').aeCombo("setDefault","00");
         */
        setDefault: function (value) {
            this._flag = true;
            this._setValue(value + '');
            this._flag = false;
            return this;
        },
        /**
         * 得到combo的显示值。
         * @name ae.aeCombo#getDisplayText
         * @function
         * @return 返回下拉框当前显示的文本
         * @example
         * $('#mycombo').aeCombo("getDisplayText","00");
         */
        getDisplayText: function () {
            var value = this.textInput.val();
            return value ? value : '';
        },
        /**
         * 清除值
         * @name ae.aeCombo#clear
         * @function
         * @example
         * $('#mycombo').aeCombo('clear');
         */
        clear: function () {
            var self = this, inputEl = self.textInput, valueEl = self.element;
            self.options.value = '';
            if (self.options.multi) {
                valueEl.parent().find('>span').remove();
                if (self.options.emptyText) {
                    $('<em class="label-tip">' + self.options.emptyText + '</em>').prependTo(valueEl.parent()).width(valueEl.parent().width() - 12);
                }
            }
            valueEl.val('');
            inputEl.val('');
            if (!self.options.multi && self.options.showClear) {
                if (valueEl.prevAll().is('.icon-error2')) {
                    valueEl.prevAll('.icon-error2').hide();
                }
            }
        },
        /**
         * 显示或隐藏组件
         * @name ae.aeCombo#visible
         * @function
         * @param {boolean} value 是否显示或隐藏，为true则显示组件，否则隐藏组件
         * @example
         * $('#mycombo').aeCombo("visible",false);
         */
        visible: function (value) {
            if (value === undefined) {
                value = true;
            }
            var $ele = this.element;
            if (value === true || value === 'true') {
                $ele.closest('div.input-icon').removeClass('hidden');
                this.options.visible = true;
            }
            if (value === false || value === 'false') {
                $ele.closest('div.input-icon').addClass('hidden');
                this.options.visible = false;
            }
        },
        /**
         * 设置控件的启用禁用状态
         * @name ae.aeCombo#enable
         * @function
         * @param {boolean} value 是否启用组件，为true则启用组件，否则禁用组件
         * @example
         * $('#mycombo').aeCombo("enable",false);
         */
        enable: function (value) {
            var self = this,
                labelInfo,
                textInput = this.textInput,
                val = this.element.val(),
                valueEl = this.element;
            if (value === undefined) {
                value = true;
            }
            if (value === true || value === 'true') {
                this.options.enable = true;
                if (!self.options.multi) {
                    textInput.prop({'readonly': true, 'disabled': false}).addClass('form-readonly');
                    if (self.options.showClear) {
                        if (this.element.prevAll().is('.icon-error2') && (val !== '' && typeof (val) != 'undefined')) {
                            this.element.prevAll('.icon-error2').show();
                        }
                    }
                } else {
                    textInput.prop('disabled', false);
                    labelInfo = valueEl.parent().find('>span.label-info');
                    if (labelInfo.length > 0) {
                        labelInfo.find('>i.icon-error2').on('click',this, function (event) {
                            var inst=event.data,
                                arr = [],
                                s = '',
                                idx,
                                curIdxs,
                                arrIdxs,
                                i;

                            idx=$(this).parent().remove().attr("data-index");
                            curIdxs=inst.element.attr("data-index");
                            arrIdxs=curIdxs.split(",");
                            if(arrIdxs.length>0){
                                for(i=arrIdxs.length-1;i>=0;i--){
                                    if(arrIdxs[i]===idx){
                                        arrIdxs.splice(i,1);
                                    }
                                }
                                this.element.attr("data-index",arrIdxs.join(","));
                            }

                            valueEl.parent().find('>span.label-info').each(function () {
                                arr.push($(this).attr('value'));
                            });
                            s = arr.join(self.options.multiSeparator);
                            valueEl.val(s);
                            self.options.value = s;
                        });
                    }
                }
            }
            if (value === false || value === 'false') {
                this.options.enable = false;
                if (!self.options.multi) {
                    textInput.prop({'readonly': false, 'disabled': true}).removeClass('form-readonly');
                    if (self.options.showClear) {
                        if (this.element.prevAll().is('.icon-error2') && (val !== '' && typeof (val) != 'undefined')) {
                            this.element.prevAll('.icon-error2').hide();
                        }
                    }
                } else {
                    textInput.prop('disabled', true);
                    labelInfo = valueEl.parent().find('>span.label-info');
                    if (labelInfo.length > 0) {
                        labelInfo.find('>i.icon-error2').off();
                    }
                }
            }
        },
        _init: function () {
            var options = this.options,
                inputEl = this.textInput,
                source = options.dataSource,
                valueEl = this.element;
            this._flag = false;
            if (!options.labelField) {
                options.labelField = options.optionField;
            }
            if (!options.visible) {
                valueEl.closest('div.input-icon').addClass('hidden');
            }
            this.enable(!!options.enable);
            if (options.width) {
                valueEl.parents('.input-icon').css("width", options.width);
            }
            this._refeshEmptyText(options.emptyText);
            if (options.multi && options.emptyText) {
                $('<em class="label-tip">' + options.emptyText + '</em>').prependTo(valueEl.parent()).width(valueEl.parent().width() - 12);
            }
            if (options.showClear && !options.multi) {
                var div = valueEl.closest('div.input-icon');
                div.addClass('comboxclear');
                $('<i class="icon-error2"></i>').prependTo(div).on('click',this, function (event) {
                    var oldValue=valueEl.val(),
                        inst=event.data;
                    inst.element.attr("data-index","");
                    options.value = '';
                    inputEl.val('');
                    valueEl.val('');
                    $(this).hide();
                    if(oldValue!==""){
                        valueEl.trigger("valuechange",valueEl);
                        inst._trigger("onValueChange", null,inputEl,'',oldValue, event);
                    }
                }).hide();
            }
            if(options.optionLabel){//添加label
                var _$wrap = valueEl.closest('div.input-icon');
                 _$wrap.prepend('<span class="text-muted optionLabel">'+options.optionLabel+'</span>');
                 var _$label = _$wrap.find("span.optionLabel");
                _$label.css({
                    "position": "absolute",
                    "line-height": "32px",
                    "left": "10px"
                });
                var _width = _$label.width() || 0;
                if(_width===0){
                    _width = (_$wrap.find("span.optionLabel").text().length)*6.4;
                    _width = Math.ceil(_width);
                }
                _$wrap.find("input").css("padding-left",(_width+15)+"px");

            }
            if (source && typeof source == 'string') {
                source = $.parseJSON(source);
                this.reload(source);
            }
            this._bindEvent();
            if (valueEl.attr("value")) {
                this.setValue(valueEl.attr("value"));
                this._flag = true;
            }
            if (valueEl.attr("defaultValue")) {
                this.setValue(valueEl.attr("defaultValue"));
            }
            //为了特定需求,需要编辑下拉框(一般情况下不许使用)
            if(options.editable){
            	inputEl.prop({'readonly': false}).removeClass('form-readonly');
            }
        },
        _create: function () {
            var valueEl = this.element,
                options = this.options,
                $dlg = this.element.parents(".modal-content"),
                obj,
                ss;
            if (options.initType == 'html') {
                this._buildOptions(options, valueEl);
            }
            obj = $("<input></input>");
            obj.attr({
                "aeType": valueEl.attr("aeType"),
                "aeId": valueEl.attr("id"),
                "aeInit": false,
                "aeValidate": valueEl.attr("aeValidate"),
                "rules": valueEl.attr("rules"),
                "value": valueEl.attr("value"),
                "defaultValue" : valueEl.attr("defaultValue")
            });
            this.element = obj;
            valueEl.after(obj);
            valueEl.empty().hide();
            this.element.wrap('<div class="input-icon right"></div>');
            $('<i class="icon-arrowlup-down"></i>').insertBefore(this.element);
            if (options.multi) {
                this.element.wrap('<div class="form-control"></div>');
            }
            this.textInput = this.element.clone().attr({
                "id": "COMBO_INPUT_TEXT_" + this.element.attr("aeId"),
                "aeInit": false
            }).removeAttr("dataField").insertAfter(this.element);
            obj = document.body;
            var popupArray = $.aries.page.data._getHidedData("ae_popup_Id");
            if ($.isArray(popupArray)) {
                if (popupArray.length === 1) {
                    ss = popupArray[0];
                    obj = (ss && ss.popupType !== 'div') ? $("#" + ss.elementId) : document.body;
                }
                if (popupArray.length === 2) {
                    ss = popupArray[1];
                    obj = (ss && ss.popupType !== 'div') ? $("#" + ss.elementId) : document.body;
                }
            }

            this.dropList = $('<ul class="dropdown-menu dropdown-menu-hover" role="menu" id="' + this.element.attr("aeId") + '_scrollbar">').appendTo(obj).hide();
            if (!options.multi) {
                this.textInput.addClass('form-control');
            }
            this.element.hide();
        },
        _buildOptions: function (options, valueEl) {
            options.enable = valueEl.attr("enable") == 'false' ? false : options.enable;
            options.visible = valueEl.attr("visible") == 'false' ? false : options.visible;
            options.emptyText = valueEl.attr("emptyText");
            options.listMaxHeight = parseInt(valueEl.attr("listMaxHeight")) || options.listMaxHeight;
            options.multi = valueEl.attr("multi") == 'true' ? true : options.multi;
            options.multiSeparator = valueEl.attr("multiSeparator") || options.multiSeparator;
            options.labelField = valueEl.attr("labelField");
            options.optionField = valueEl.attr("optionField") || options.optionField;
            options.valueField = valueEl.attr("valueField") || options.valueField;
            options.showClear = valueEl.attr("showClear") == 'true' ? true : options.showClear;
            options.dataSource = valueEl.attr("dataSource");
            options.aeType = valueEl.attr("aeType");
            options.width = valueEl.attr("width");
            options.value = valueEl.attr("value");
            options.optionLabel = valueEl.attr("optionLabel") || options.optionLabel;
            //为了特定需求,需要编辑下拉框(一般情况下不许使用)
            options.editable = valueEl.attr("editable") == 'true' ? true : options.editable;
            this._buildOptionsEvent(options, valueEl);
        },
        _buildOptionsEvent: function (options, valueEl) {
            var onValueChange = valueEl.attr("onValueChange") || options.onValueChange,
                onClick = valueEl.attr("onClick") || "",
                i,
                funName = "";
            this._buildCommonEvent(options, 'labelField', options.labelField);
            this._buildCommonEvent(options, 'optionField', options.optionField);
            this._buildCommonEvent(options, 'valueField', options.valueField);
        	if($.isString(onValueChange)){
        		options.onValueChange=onValueChange ? function(target, newValue, oldValue){
        			var i = onValueChange.indexOf("(");
					var actName = i>0 ? onValueChange.substring(0, i) : onValueChange;
					var func = "return window."+actName+"?"+actName+".call(window,t,n,o):false;";
					return new Function("t","n","o",func)(target, newValue, oldValue);
            	}: function(target, newValue, oldValue, event){};
        	}
            //options.onValueChange = (typeof(window[funName]) === "function") ? window[funName] : "";
            funName = "";
            if (onClick && typeof(onClick) === "string") {
                i = onClick.indexOf("(");
                funName = (i > 0) ? onClick.substring(0, i) : onClick;
            }
            options.onClick = (typeof(window[funName]) === "function") ? window[funName] : "";
        },
        _buildCommonEvent: function (ops, evtName, evtValue) {
            var i,
                funName = evtValue;
            if (funName && typeof(funName) === "string") {
                i = funName.indexOf("(");
                if (i > 0) {
                    funName = funName.substring(0, i);
                    ops[evtName] = eval(funName);
                }
            }
        },
        _bindEvent: function () {
            var self = this, options = self.options,
                valueEl = self.element,
                dropList = self.dropList,
                emptyText = options.emptyText;

            input = self.textInput;
            input.focus(function (event) {
                self._refeshEmptyText(emptyText);
                if (self.options.multi && options.emptyText) {
                    var em = self.element.parent().find('>em');
                    if (em.length > 0) {
                        em.remove();
                    }
                }
                if (options.onClick) {
                    self._trigger("onClick", null, event);
                }
                self._showDropList();
            }).blur(function () {
                self._refeshEmptyText(emptyText);
                if(!self.options.multi && options.emptyText){
                    options._keyIndex = -1;
                }

                if (self.options.multi && options.emptyText) {
                    var span = self.element.parent().find('>span');
                    if (span.length <= 0) {
                        $('<em class="label-tip">' + self.options.emptyText + '</em>').prependTo(self.element.parent()).width(self.element.parent().width() - 12);
                    }
                }
                $(document).off('keydown');
            });
            //为了特定需求,需要编辑下拉框(一般情况下不许使用)
            if(!options.editable){
            	input.keydown(function(e){
	                var evt = e || window.event,
	                    curKey = evt.keyCode || evt.charCode || evt.which,
	                    hoverColor = '#EDF1F2',
	                    curDropList = $('ul.dropdown-menu').not(':hidden'),
	                    curDropListItems = curDropList.children('li'),
	                    curDropListItemHeight = curDropListItems.eq(0).height(),
	                    allScrollTop = (curDropListItems.eq(0).height() * curDropListItems.size()) - (curDropList.innerHeight() - 10);

	                    $(document).on('keydown',function(e){
	                        e.stopPropagation();
	                        e.preventDefault();
	                    });

	                    if(curKey === 40 || curKey === 38){
	                        curDropListItems.each(function(i,listItem){
	                            $(listItem).css('background-color','transparent');
	                            $(listItem).removeClass('item-selected');
	                        });
	                    }

	                    if(curKey === 40){
	                        if(options._keyIndex === curDropListItems.size()-1){
	                            options._keyIndex = -1;
	                            curDropListItems.eq(0).css('background-color',hoverColor)
	                                .addClass('item-selected');
	                            if(curDropList.hasClass('scorll-bar-box')){
	                                curDropList.getNiceScroll(0).doScrollTop(0, 100);
	                                options._scrollTop = 0 - curDropListItemHeight;
	                            }
	                            return false;
	                        }
	                        curDropListItems.eq(++options._keyIndex).css('background-color',hoverColor)
	                            .addClass('item-selected');
	                        if(curDropList.hasClass('scorll-bar-box')) {
	                            curDropList.getNiceScroll(0).doScrollTop(options._scrollTop, 100);
	                            if (options._scrollTop >= allScrollTop) {
	                                options._scrollTop = allScrollTop + curDropListItemHeight;
	                            } else {
	                                options._scrollTop += curDropListItemHeight;
	                            }
	                        }
	                    }else if(curKey === 38){
	                        if(options._keyIndex === -1 || options._keyIndex === 0){
	                            options._keyIndex = curDropListItems.size() - 1;
	                            curDropListItems.eq(options._keyIndex).css('background-color',hoverColor)
	                                .addClass('item-selected');
	                            if(curDropList.hasClass('scorll-bar-box')) {
	                                curDropList.getNiceScroll(0).doScrollTop(allScrollTop, 100);
	                                options._scrollTop = allScrollTop + curDropListItemHeight;
	                            }
	                            return false;
	                        }
	                        curDropListItems.eq(--options._keyIndex).css('background-color',hoverColor)
	                            .addClass('item-selected');
	                        if(curDropList.hasClass('scorll-bar-box')) {
	                            if (options._scrollTop <= 0) {
	                                options._scrollTop = 0 - curDropListItemHeight;
	                            } else {
	                                options._scrollTop -= curDropListItemHeight;
	                                curDropList.getNiceScroll(0).doScrollTop(options._scrollTop, 100);
	                            }
	                        }
	                    }else if(curKey === 13){
	                        var source = curDropList.children('li.item-selected').children('a');
	                        self._backfill(source);
	                        if(options.multi){
	                        }else{
	                            self.textInput.blur();
	                        }
	                    }
                });
            }
            dropList.mousedown(function (e) {
                e.stopPropagation();
            });
            valueEl.parents('.input-icon').find('>i.icon-arrowlup-down').click(function () {
                self.textInput.focus();
            });
            if (options.multi) {
                valueEl.parent().click(function () {
                    self.textInput.focus();
                });
            }
            $(document).on('mousedown.aeCombo', this.globalEvent = function () {
                dropList.hide();
            });
        },
        _showDropList: function () {
            var self = this, options = self.options,
                inputEl = self.textInput, valueInput = self.element,
                dropList = self.dropList,
                valuedItem,
                i,
                ss = "",
                span,
                inputPos,
                allValues,
                popupArray,
                nowValue = valueInput.val(),
                $listRows = dropList.find('li'),
                allItems = self._getAllOptionsBeforeFiltered(),
                index;
            if (allItems.size() <= 0) { //如果下拉框没有数据
                return;
            }
            //在初始化展示列表时清空所有由keyup产生的选中项颜色
            dropList.children('li').each(function(i,dropListItem){
                $(dropListItem).css('background-color','transparent');
                $(dropListItem).removeClass('item-selected');
            });
            options._keyIndex = -1;
            $listRows.removeClass('current').find('>i.fa-check').remove();
            if (nowValue !== undefined && nowValue !== '') {
                allValues = $.data(valueInput, 'allValues');
                if (options.multi) {
                    var selectedValues = nowValue.split(options.multiSeparator);
                    for (i = 0; i < selectedValues.length; i++) {
                        index = allValues.indexOf(selectedValues[i]);
                        if (index > -1) {
                            $(dropList.find('li').get(index)).addClass('current').prepend('<i class="fa fa-check"></i>');
                        }
                    }
                    valueItem = selectedValues[0];
                } else {
                    index = allValues ? allValues.indexOf(nowValue) : -1;
                    if (index > -1) {
                        valuedItem = $(dropList.find('li').get(index)).addClass('current').prepend('<i class="fa fa-check"></i>');
                        $(dropList.find('li').get(index)).css('background-color','#EDF1F2');
                        options._keyIndex = index;
                    }
                }
            }
            span = valueInput.parent();
            inputPos = span.offset();
            popupArray = $.aries.page.data._getHidedData("ae_popup_Id");
            if ($.isArray(popupArray)) {
                if (popupArray.length === 1) {
                    ss = popupArray[0];
                }
                if (popupArray.length === 2) {
                    ss = popupArray[1];
                }
            }
            var widgetTop, widgetLeft;
            if (ss && ss.popupType !== 'div') {
                var popup = $("#" + ss.elementId).offset();
                widgetTop = inputPos.top + span.outerHeight() - popup.top;
                widgetLeft = inputPos.left - popup.left;
            } else {
                widgetTop = inputPos.top + span.outerHeight();
                widgetLeft = inputPos.left;
                //It does effect not in popup.
                /*adjust the widget position Start*/
                var epos = inputPos;
                var wh = $(window).height();
                var ws = $(window).scrollTop();
                var woh = dropList.outerHeight();
                var eoh = this.element.outerHeight();
                if (epos.top + eoh + woh > ws + wh) {
                    //widgetTop = (ws + wh - woh - 10);
                    widgetTop = epos.top - woh - 10;
                }
                /*adjust the widget position End*/
            }

            dropList.css({
                'position': 'absolute',
                'left': widgetLeft,
                'top': widgetTop,
                'width': span.outerWidth()
            });
            dropList.show();
        },
        _loadData: function (records) {
            var options = this.options, valueEl = this.element;
            options.dataSource = records;
            //build all inputText
            var labelField = options.labelField;
            var allInputText = [];
            if (typeof labelField === 'string') {
                $(records).each(function () {
                    allInputText.push(this[labelField]);
                });
            } else {
                $(records).each(function (index) {
                    allInputText.push(labelField(this, index));
                });
            }
            $.data(valueEl, 'allInputText', allInputText);
            //build all value
            var valueField = options.valueField;
            var allValues = [];
            if (typeof valueField === 'string') {
                $(records).each(function () {
                    allValues.push('' + this[valueField]);
                });
            } else {
                $(records).each(function (index) {
                    allValues.push('' + valueField(this, index));
                });
            }
            $.data(valueEl, 'allValues', allValues);
            //build dropList
            var dropList = this.dropList.empty();
            var optionField = options.optionField;
            var innerHtml = '';
            var self = this;
            if (typeof optionField === 'string') {
                $(records).each(function (index) {
                    innerHtml += self._wrapText(this[optionField],index);
                });
            } else {
                $(records).each(function (index) {
                    innerHtml += self._wrapText(options.optionField(this, index),index);
                });
            }
            if (innerHtml) {
                $(innerHtml).appendTo(dropList);
                dropList.show().css('height', 'auto');
                dropList.hide();
            }
            if (dropList.height() > options.listMaxHeight) {
                if (!dropList.hasClass('scorll-bar-box')) {
                    dropList.addClass('scorll-bar-box').height(options.listMaxHeight);
                    $("#" + this.element.attr("aeId") + "_scrollbar").niceScroll();
                }
            }
            if (options.value) {
                this._setValue('' + options.value);
            }
            this._bindEventsToList();
        },
        _wrapText: function (text,index) {
            if (typeof this.options.optionField === 'string') {
                return '<li data-index="'+index+'"><a title="' + text + '">' + text + '</a></li>';
            } else {
                return '<li data-index="'+index+'"><a>' + text + '</a></li>';
            }
        },
        _getAllOptionsBeforeFiltered: function () {
            return this.dropList.find('a');
        },
        _bindEventsToList: function () {
            var self = this,
                items = self._getAllOptionsBeforeFiltered();
            items.mousedown(function () {
                self._backfill(this);
            });
        },
        _backfill: function (source) {
            var self,
                valueEl,
                dropList,
                options,
                $li,
                obj,
                value,
                selectedIndexs,
                idxs,
                multi;
            if (source.length === 0) {
                return;
            }
            self = this;
            valueEl = self.element;
            dropList = self.dropList;
            options = self.options;
            multi = options.multi;
            if (multi) {
                obj = $(source).parent();
                obj.toggleClass('current');
                if (obj.find('>i.fa-check').length > 0) {
                    obj.find('>i.fa-check').remove();
                } else {
                    obj.prepend('<i class="fa fa-check"></i>');
                }
            } else {
                $li=this.dropList.find(".current");
                $li.removeClass("current").find('>i.fa-check').remove();
                // this._getAllOptionsBeforeFiltered().parent().removeClass('current').find('>i.fa-check').remove();
                $(source).parent().addClass('current').prepend('<i class="fa fa-check"></i>');
            }
            if (dropList.css('display') == 'none') {
                return;
            }
            value = [];
            idxs=[];
            selectedIndexs = dropList.find('li[class*=current]');
            for (var i = 0; i < selectedIndexs.length; i++) {
                var nowIndex = this._getAllOptionsBeforeFiltered().parent().index(selectedIndexs[i]);
                if (nowIndex > -1) {
                    value.push($.data(valueEl, 'allValues')[nowIndex]);
                    idxs.push(nowIndex);
                }
            }
            if(multi===true){
                this.element.attr("data-index",idxs.join(","));
            }else{
                this.element.attr("data-index",(idxs[0] || ""));
            }
            this._setValue(value.join(multi ? options.multiSeparator : ''));
            if (multi===false) {
                dropList.hide();
            }
        },
        /**
         * 设置用户数据，即绑定数据到指定的下拉项上
         * @name ae.aeCombo#setUserdata
         * @function
         * @param  {number|array} index 序号，如果是数组，那么data参数也将是数组
         * @param  {*} data 数据，如果index参数是数组，那么本参数也必须是数组且数组
         * 每个元素表示一个数据
         * @returns {boolean} 如果绑定数据成功则返回true，否则返回false。注意如果
         * 只设置成功一个也算成功
         */
        setUserdata:function(index,data){
            var $li,
                i,
                r=false;
            if($.isArray(index)===true){
                if($.isArray(data)===true && index.length===data.length){
                    for(i=index.length-1;i>=0;i--){
                        $li=this.dropList.find('li[data-index="'+index[i]+'"]');
                        if($li.length>0){
                            $li.data("userdata",data[i]);
                            r=true;
                        }
                    }
                }
            }else{
                $li=this.dropList.find('li[data-index="'+index+'"]');
                if($li.length>0){
                    $li.data("userdata",data);
                    r=true;
                }
            }
            return r;
        },
        /**
         * 根据下拉项序号获取用户数据
         * @name ae.aeCombo#getUserdata
         * @function
         * @param  {number} [index] 序号，如果不传表示获得当前选中项的用户数据
         * @returns {object|array|null} 返回指定下拉项序号的绑定数据，如果是多
         * 选模式返回一个数组，没有对应的index，返回空数组，否则直接返回数据，没有
         * 对应的index，返回null
         */
        getUserdata:function(index){
            var $li,
                arr,
                count,
                i;
            if(isNaN(index)===true || index<0){
                index=this.getIndex();
            }
            if($.isArray(index)===true){
                arr=[];
                for(i=0,count=index.length;i<count;i++){
                    arr.push(this._getUserdata(index[i]));
                }
                return arr;
            }else{
                return this._getUserdata(index);
            }
            return null;
        },
        _getUserdata:function(index){
            var $li,
                data;
            if(index>=0){
                $li=this.dropList.find('li[data-index="'+index+'"]');
                data=$li.data("userdata");
                return (data || null);
            }
            return null;
        },
        /**
         * 获取当前选中项的序号
         * @name ae.aeCombo#getIndex
         * @function
         * @return {number|array|-1} 返回当前选中项的序号，如果是单选返回一个数值，否则返回一个数值数组，如果没有选中任何项返回－1
         */
        getIndex:function(){
            var s=this.element.attr("data-index"),
                arr,
                i;
            if(s){
                if(this.options.multi){
                    arr=s.split(",");
                    for(i=arr.length-1;i>=0;i--){
                        arr[i]=parseInt(arr[i],10);
                    }
                    return arr;
                }else{
                    return parseInt(s,10);
                }
            }
            return -1;
        },
        _setValue: function (value) {
            var input = this.textInput,
                valueEl = this.element,
                dropList = this.dropList,
                idxs=[],
                self=this;
            var valueChange = true;
            var oldValue = valueEl.val();
            var options = this.options;
            if (value == oldValue) {
                valueChange = false;
            }
            var allValues = $.data(valueEl, 'allValues');
            var inputText = [], values = [];
            if (options.multi) {
                values = value.split(options.multiSeparator);
            } else {
                values.push(value);
            }
            for (var i = 0; i < values.length; i++) {
                var index = allValues ? allValues.indexOf(values[i]) : -1;
                if (index > -1) {
                    inputText.push($.data(valueEl, 'allInputText')[index]);
                    idxs.push(index);
                } else {
                    valueEl.val('');
                    value = '';
                }
            }
            valueEl.val(value);

            if (options.multi) {
                if(idxs.length>=0){
                    this.element.attr("data-index",idxs.join(","));
                }
                if (valueEl.parent().find('>span.label-info').length > 0) {
                    valueEl.parent().find('>span.label-info').remove();
                }
                var innerHtml = '';
                for (var j = 0; j < inputText.length; j++) {
                    innerHtml += '<span class="label label-info label-as-badge" data-index="'+idxs[j]+'" value="' + values[j] + '">' + inputText[j] + '<i class="icon-error2"></i></span>';
                }
                $(innerHtml).insertBefore(valueEl);
                valueEl.parent().find('>span.label-info').each(function () {
                    var ulWidth = dropList.width() - 60;
                    if ($(this).width() > ulWidth) {
                        $(this).width(ulWidth).prop('title', $(this).text());
                    }
                }).find('>i.icon-error2').on('click',this, function (event) {
                    var inst=event.data,
                        val = [],
                        objVal = '',
                        curIdxs,
                        arrIdxs,
                        i,
                        idx;
                    idx=$(this).parent().remove().attr("data-index");
                    curIdxs=inst.element.attr("data-index");
                    arrIdxs=curIdxs.split(",");
                    if(arrIdxs.length>0){
                        for(i=arrIdxs.length-1;i>=0;i--){
                            if(arrIdxs[i]===idx){
                                arrIdxs.splice(i,1);
                            }
                        }
                        this.element.attr("data-index",arrIdxs.join(","));
                    }
                    valueEl.parent().find('>span.label-info').each(function () {
                        val.push($(this).attr('value'));
                    });
                    objVal = val.join(options.multiSeparator);
                    valueEl.val(objVal);
                    options.value = objVal;
                    valueEl.trigger("valuechange",valueEl);
                    self._trigger("onValueChange",null,event);
                });
                if (options.emptyText) {
                    var em = valueEl.parent().find('>em');
                    if (em.length > 0) {
                        em.remove();
                    }
                }
                input.val(inputText.join(options.multiSeparator));
                input.parent().attr("title",self.textInput.val());
            } else {
                if(idxs.length>=0){
                    this.element.attr("data-index",idxs[0]);
                }
                input.val(inputText.join(''));
                if (options.showClear && options.enable) {
                    if (valueEl.val() !== '' && typeof (valueEl.val()) != 'undefined') {
                        valueEl.prevAll('.icon-error2').show();
                    }
                }
                input.attr("title",self.textInput.val());
            }
            options.value = value;
            // trigger onValueChange event
            if (!this._flag) {
                if(valueChange) {
                    valueEl.trigger("valuechange",valueEl);
                    if (options.onValueChange){
                      this._trigger("onValueChange", null, input, value, oldValue);
                    }
                }
            }

            var span = valueEl.parent(), inputPos = span.offset();

            /*adjust the widget position Start*/
            var epos = inputPos;
            var widgetTop = inputPos.top + span.outerHeight();
            var wh = $(window).height();
            var ws = $(window).scrollTop();
            var woh = dropList.outerHeight();
            var eoh = span.outerHeight();
            if (epos.top + eoh + woh > ws + wh) {
                //widgetTop = (ws + wh - woh - 10);
                widgetTop = epos.top - woh - 10;
            }
            /*adjust the widget position End*/

            dropList.css({
                'position': 'absolute',
                'left': inputPos.left,
                'top': widgetTop,
                'width': span.outerWidth()
            });
        },
        _refeshEmptyText: function (emptyText) {
            var inputEl = this.textInput, el = this.element,options = this.options;
            if (!emptyText)
                return;
            if (!this.options.multi) {
                if (inputEl.prop('placeholder') === '') {
                    inputEl.prop('placeholder', emptyText);
                } else {
                    if (inputEl.prop('placeholder') === emptyText) {
                        inputEl.prop('placeholder', '');
                    }
                }
            }
        },
        _destroy: function () {
            this.dropList.remove();
            this.dropList = null;
        }
    });
});

define('ui-radio',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
	 $.aeWidget('ae.aeRadio', {
		 options:{
			 /**
              * 是否水平排列，默认水平排列。
              * @type Boolean
              * @default true
              * @example
              * isHorizontal : false
              */
			 isHorizontal:true,
			 /**
              * 是否禁用组件。如果禁用，则不可以输入，form提交时也将忽略这个输入框。
              * @type Boolean
              * @default true
              * @example
              * enable : false
              */
			 enable : true,
			 /**
              * 隐藏组件。
              * @type Boolean
              * @default true
              * @example
              * visible : false
              */
             visible :true,
             /**
              * JSON对象中哪个字段作为radio的label属性，可以指定为JSON的一个属性。
              * @type String
              * @default 'text'
              * @example
              * labelField : 'codeName'
              */
             labelField : 'text',
             /**
              * JSON对象中哪个字段作为radio的label属性，可以指定为JSON的一个属性。
              * @type String
              * @default 'value'
              * @example
              * valueField : 'codeValue'
              */
             valueField : 'value',
             /**
              * aeRadio初始化方式，默认通过html来设置参数。传值为js时，则通过js中设置的option来初始化。
              * @type String
              * @default 'html'
              * @example
              * $('.selector').aeRadio({initType : 'js'});
              */
             initType : 'html'
		 },
		 _create:function(){
			 var options=this.options,
			 	inputEl=this.element,
				id=inputEl.attr("id");
			 if(options.initType=='html'){
				 this._buildOptions(options,inputEl);
	         }
			 if(id){
				this.id = id;
			 	inputEl.attr("aeId",id);
			 }
             inputEl.hide();
		 },
		 _init:function(){
			 var self = this,
			     options = self.options,
			     source = options.dataSource,
			     inputEl = self.element;

			 inputEl.attr("aeType",(options.aeType || "aeRadio"));

			 if(source && typeof source == 'string'){
           	     source = $.parseJSON(source);
           	     self.reload(source);
             }
		 },
		 _buildOptions:function(options,inputEl){
			 options.isHorizontal = inputEl.attr("isHorizontal") =='false' ? false : options.isHorizontal;
			 options.enable = inputEl.attr("enable") =='false' ? false : options.enable;
		     options.visible = inputEl.attr("visible") == 'false' ? false : options.visible;
			 options.aeType = inputEl.attr("aeType");
	         options.labelField = inputEl.attr("labelField") || options.labelField;
	         options.valueField = inputEl.attr("valueField") || options.valueField;
		     options.dataSource = inputEl.attr("dataSource");

	         var onSelect = inputEl.attr("onSelect");
	         options.onSelect=onSelect ? function(event){
					if($.isString(onSelect)){
						var i = onSelect.indexOf("(");
						var actName = i>0 ? onSelect.substring(0, i) : onSelect;
						var func = 	"return window."+actName+"?"+actName+".call(window,e):false;";
						return new Function("e",func)(event);
					}
	        }: options.onSelect;
		 },
		 _buildEvent:function(){
			 var self = this,
			     input = self._getAllOptions(),
			     onSelect = self.options.onSelect;
			 input.bind('click.aeRadio',function(e){
				 if(onSelect){
					 onSelect(e);
				 }
			 });
		 },
		/**
         * 得到aeRadio的值。
         * @function
         * @name aeRadio#getValue
         * @returns 返回aeRadio的值
         *
         */
		 getValue:function(){
			 var input = this._getAllOptions(),
			     values=[];
			 input.each(function(index,item){
				 if($.prop(item,"checked")){
					 values.push('' + $(item).val());
				 }
			 });
			 return values.join('');
		},
		/**
         * 得到aeRadio的值。
         * @function
         * @name aeRadio#setValue
         *
         */
		setValue:function(v){
			  if (typeof v === 'undefined' || v === '' || v===null){
	        	 return;
	          }
			  var input = this._getAllOptions();
			  input.each(function(idx,item){
				 if($(item).val() === v && !$.attr(item,'disabled')){
					 $.prop(item,'checked',true);
				 }
			 });
		},
		/**
         * 得到aeRadio的显示值。
         * @function
         * @name aeRadio#getDisplayText
         * @returns 返回aeRadio的显示值
         *
         */
        getDisplayText:function(){
			 var input = this._getAllOptions(),
			     textValues=[];
			 input.each(function(index,item){
				 if($.prop(item,"checked")){
					 textValues.push('' + $(item).next().text());
				 }
			 });
			 return textValues.join('');
	    },
        /**
         * 清除aeRadio的值。
         * @function
         * @name aeRadio#clear
         *
         */
	    clear:function(){
	    	 this._getAllOptions().prop('checked',false);
	    },
	    /**
         * 加载aeRadio数据。
         * @function
         * @name aeRadio#reload
         *
         */
	    reload:function(data){
	        this._loadData(data);
		    if(!this.options.visible){
				 this.element.nextAll('.rdio').addClass('hidden');
			}
            this.enable(!!this.options.enable);
	    },
	    /**
	       * 设置控件的启用禁用状态　value = true(启用),则会将input设置为可用状态,false(禁用),则会将input设置为不可用
	       * @name aeCheckbox#enable(value)
	       * @function
	       * @returns jQuery对象
	       * @example
	       * $('#input').aeCheckbox('enable',false);
	       * $('#input').aeCheckbox('enable',true);
	     */
	     enable : function(value){
	    	if(value === undefined){
	    		value = true;
	    	}
	    	var self = this,opts = self.options,enable = opts.enable,
	    	    input = self._getAllOptions();
	    	if(value === true || value === 'true'){
	    		input.prop('disabled',false);
		        enable = true;
	    	}
	    	if(value === false || value === 'false'){
	    		input.prop('disabled', true);
	    		enable = false;
	    	}
	     },
	     /**
	       * 显示和隐藏组件　value = true(显示),false(隐藏)
	       * @name aeCheckbox#visible(value)
	       * @function
	       * @returns jQuery对象
	       * @example
	       * $('#input').aeCheckbox('visible',false);
	       * $('#input').aeCheckbox('visible',true);
	    */
	    visible : function(value){
	    	if(value === undefined){
	    		value = true;
	    	}
	    	var $ele = this.element,visible = this.options.visible;
	    	if(value === true || value === 'true'){
	    		$ele.nextAll('.rdio').removeClass('hidden');
	    		visible = true;
	    	}
	    	if(value === false || value === 'false'){
	    		$ele.nextAll('.rdio').addClass('hidden');
	    		visible = false;
	    	}
	    },
		_loadData:function(records){
            var self = this,$ele = this.element,innerHtml='';
            if($ele.nextAll('.rdio').length>0){
            	$ele.nextAll('.rdio').remove();
            }
            $(records).each(function(index,item){
            	innerHtml += self._wrapText(item);
            });
            $(innerHtml).insertAfter($ele);

            self._buildEvent();
		},
		_getAllOptions:function(){
			 return  this.element.nextAll('.rdio').find('input[type="radio"]');
		},
		_wrapText:function(item) {
			var random  = parseInt(Math.random()*1000);
            return '<div class="rdio '+(this.options.isHorizontal ? 'rdio_horizontal' : '')+'"><input type="radio" '+(item.checked ? 'checked' : '' )+' '+(item.disabled ? 'disabled' : '')+' id="ae_radio_'+random+'" name="'+this.id+'" value="'+item[this.options.valueField]+'"/><label for="ae_radio_'+random+'">'+item[this.options.labelField]+'</label></div>';
        }
	 });
});

define('ui-search',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
/*
 * $Id: ui-search.js$
 * Depends:
 *  ui-core.js
 */
    /**
     * @name aeSearch
     * @class
     * &nbsp;&nbsp;&nbsp;&nbsp;Ajax提示组件。类似于google首页的搜索功能（在输入的同时下拉框里给出可用的提示，用户可以从里面选择一个）。<br/>
     * &nbsp;&nbsp;&nbsp;&nbsp;将该功能添加到一个input输入框上，将允许用户在输入的同时可以快速地查找和选择所要的内容。当输入框得到焦点并输入字符时，该组件会将用户输入的内容以Ajax方式发送到服务器进行处理，服务器处理完后返回一个数据集，客户端将数据集显示成一个可选列表，用户可以从可选列表中很方便地选择自己所要查找的东西。<br/>
     * &nbsp;&nbsp;&nbsp;&nbsp;目前该组件主要用于从远程URL取得数据（如果是本地数据的话，可以使用aeCombo组件，它也有边输入边过滤的功能）。一般用于从大量数据中进行查找的场合，如百度搜索、google搜索、taobao商品搜索、邮件系统快速输入收件人。<br/>
     * &nbsp;&nbsp;&nbsp;&nbsp;该组件有客户端缓存的功能，如输入a开始Ajax查找；再输入b（输入框内容是ab）再次Ajax查找；再删除b（输入框内容是a）将不进行Ajax查找，因为缓存中已经有key=a的缓存内容，将直接根据缓存内容来重构可选列表而不发送Ajax请求从服务器取数。如果不需要缓存可以将cacheSize参数设成0。如果要清除缓存可以调用clearCache()方法。<br/>
     * &nbsp;&nbsp;&nbsp;&nbsp;实际应用中一般都要控制可选列表框中记录的数目（如百度搜索、google搜索、taobao商品搜索的可选列表中记录数都为10，有道搜索的可选列表中记录数为8），这个要由服务器进行控制，服务器返回数据时请不要返回得太多（比如从数据库中查询时一般使用TOP-N查询）。<br/><br/>
     * <b>特点：</b><br/>
     * <ol>
     *      <li>可以使用普通数组，也可使用JSON数组</li>
     *      <li>支持鼠标操作和键盘操作</li>
     *      <li>支持数据的客户端缓存</li>
     *      <li>提供丰富的事件</li>
     *      <li>用户可定制数据的显示效果</li>
     *      <li>用户可定制请求的发送与处理</li>
     *      <li>支持跨域请求数据</li>
     * </ol><br/>
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" >
     * $(document).ready(function() {
     *     $('#input1').aeSearch({
     *         dataSource:'/search.json',
     *         minChars :3,
     *         listMaxHeight:40
     *     });
     * });
     * &lt;/script>
     *
     * &lt;input id="input1"/>
     * </pre>
     * @constructor
     * @description 构造函数.
     * @param p 标准config对象：
     */
    $.aeWidget('ae.aeSearch', {
        options:/** @lends aeSearch#*/{
            /**
             * 是否禁用组件。如果禁用，则不可以输入，form提交时也将忽略这个输入框。
             * @type Boolean
             * @default true
             */
        	enable : true,
            /**
             * 组件是否只读。如果是只读，则不可以输入，form提交时将会包含这个输入框。
             * @type Boolean
             * @default false
             */
            onlyRead : false,
            /**
             * 输入框输入字符数大于等于minChars时，才发送请求。<b>注意：如果要页面一显示完就开始提示，可以设成0。</b>
             * @type Number
             * @default 1
             */
            minChars : 1,
            /**
             * 发送请求的延迟时间（单位是毫秒）。比如设成300，假设输入时每隔100ms输入一个字符，则快速输入1234时，只会在4输入完成后300ms才进行一次提示。<b>注意：如果此属性值设成0或负数则不会延迟</b>
             * @type Number
             * @default 500
             */
            delay : 500,
            /**
             * 本地缓存的数目。组件针对每一次输入值进行缓存，如果缓存中存在输入域中的输入值，不再发送ajax请求取数。<br/>
             * <b>注意：该属性值必须为非负整数。设置cacheSize:0禁用缓存</b>
             * @type Number
             * @default 10
             */
            cacheSize : 10,
            /**
             * Ajax请求时的方式，取值GET'或'POST'。
             * @type String
             * @default 'GET'
             */
            method : 'POST',
            /**
             * 下拉框的最大高度（单位是px）。<b>注意：由于浏览器的限制，这个属性的最小值是31，如果小于这个值时将看不到垂直滚动条</b>
             * @type Number
             * @default 300
             */
            listMaxHeight : 300,
            /**
             * 发送Ajax请求时代表输入值的参数名。比如url是'fetchData.jsp?type=book'，queryName是'q'，当前输入的值是'abc'，则最终发送请求的url是'fetchData.jsp?type=book&q=abc'。
             * @type String
             * @default 'key'
             */
            queryName : 'key',
            /**
             * Ajax请求是否需要跨域（从本页面所在的网站以外的地方取数）。<b>注意：跨域请求时后台处理逻辑要进行特殊处理，具体请参考jQuery的JSONP相关知识。</b>
             * @type Boolean
             * @default false
             */
            crossDomain : false,
            /**
             * 数据成功响应后触发事件。<br/>
             * 一个Ajax请求成功（不出错误也不超时）后会先执行onSuccess事件的监听器，如果它返回false则不显示下拉框。如果没有监听器或者监听没有返回false则执行此preProcess预处理，处理结束后开始刷新并显示下拉框。
             * @param text 输入框的值
             * @param data 服务器返回的数据
             * @name aeSearch#preProcess
             * @type Function
             * @default 无
             * @example
             * preProcess:function(text,data){
             *      $(data).each(function(){
             *         this.sex = this.sex==0?'男':'女';
             *     });
             * }
             */
            preProcess : function(text,data){
                return data;
            },
            /**
             * Ajax请求的URL路径，所有的请求将由此URL来处理，处理结果必须返回一个JSON数组。<br/>
             * 后台可以返回两种格式的数据：
             * <ul>
             * <li><b>普通数组（如['a','b','c']）：可以不设置clientFormatter属性，也可以设置这个属性。</b></li>
             * <li><b>非普通数组（如{"valueField":"text","data":[{"name":'张三',"sex":"男"},{"name":'李四',"sex":"女"},{"name":'王五',"sex":"男"}]}）：其中valueField表示回填时把data中每个JSON对象的哪个字段回填到输入框里。非普通数组时必须设置clientFormatter属性来告诉组件如果把这个JSON对象显示到下拉框里。</b></li>
             * @name aeSearch#dataSource
             * @type URL
             * @default 无
             * @example
             * dataSource:'/operamasks-ui/getData.json'
             */
            /**
             * 下拉框中每行显示内容的转换器。对dataSource进行格式化（<b>注意：如果dataSource返回的是非普通数组(具体请看dataSource属性的描述)一定要写clientFormatter属性进行格式化</b>）。<br/>
             * @name aeSearch#clientFormatter
             * @type Function
             * @default 无
             * @example
             * //对于非普通record一定要写这个属性
             * clientFormatter:function(data,index){
             *         return '&lt;b>'+data.text+'&lt;/b>(共找到'+data.count+'条记录)';
             * }
             *
             * //对于普通的record也可以写这个属性
             * clientFormatter:function(data,index){
             *         return '&lt;span style="color:red">'+data+'&lt;/span>;
             * }
             */
            /**
             * 下拉框的宽度。必须为数字。<b>不设置时默认与输入框一样宽</b>
             * @name aeSearch#listWidth
             * @type Number
             * @default 无
             */
            /**
             * 发送Ajax请求之前触发事件。<b>注意：return false将会阻止请求发送。无返回值或return true将继续发送请求</b>
             * @event
             * @param text 输入框里当前文本
             * @param event jQuery.Event对象
             * @example
             * $('#inputID').aeSearch({
             *         onBeforeSuggest:function(text,event){
             *                 if(text=='不文明用语'){
             *                         return false;//如果是不文明用语不进行提示
             *                 }else{
             *                         return true;
             *                 }
             *         }
             * });
             */
            onBeforeSuggest : function(text,event){/*do nothing*/},
            /**
             * Ajax请求发送后响应回来前触发事件。
             * @event
             * @param text 输入框里当前文本
             * @param event jQuery.Event对象
             * @example
             * $('#inputID').aeSearch({
             *         onSuggesting:function(text,event){
             *                 $('#inputID').aeSearch('showMessage','正在加载...');
             *         }
             * });
             */
            onSuggesting : function(text,event){/*do nothing*/},
            /**
             * Ajax响应回来时触发事件。
             * @event
             * @param data Ajax请求返回的数据
             * @param textStatus 响应的状态
             * @param event jQuery.Event对象
             * @example
             * $('#inputID').aeSearch({
             *         onSuccess:function(data, textStatus, event){
             *                 if(data.length==0){
             *                         $('#txt').aeSearch('showMessage','无提示数据！');
             *                 }
             *         }
             * });
             */
            onSuccess : function(data, textStatus, event){/*do nothing*/},
            /**
             * Ajax请求出错时触发事件。
             * @event
             * @param xmlHttpRequest XMLHttpRequest对象
             * @param textStatus  错误类型
             * @param errorThrown  捕获的异常对象
             * @param event jQuery.Event对象
             * @example
             * $('#inputID').aeSearch({
             *         onError:function(xmlHttpRequest, textStatus, errorThrown, event){
             *                 $('#txt').aeSearch('showMessage','请求出错。原因：'+errorThrown.message);
             *         }
             * });
             */
            onError : function(code, info, error, event){/*do nothing*/},
            /**
             * 选择下拉框中一个后触发事件。
             * @event
             * @param text 输入框里当前文本
             * @param rowData 行记录，是Ajax请求返回的数据中的一行
             * @param index 当前行在下拉框所有行中的索引（第一行是0，第二行是1...）
             * @param event jQuery.Event对象
             * @example
             * $('#inputID').aeSearch({
             *         onSelect:function(rowData,text,index,event){
             *                 $('#searchbut').click(); //选择完后自动点击“查询”按钮
             *         }
             * });
             */
            onSelect : function(rowData,text,index,event){/*do nothing*/},
            /**
             * suggestion初始化方式，默认通过html来设置参数。传值为js时，则通过js中设置的option来初始化。
             * @type String
             * @default 'html'
             * @example
             * $('.selector').aeCombo({initType : 'js'});
             */
            initType : 'html'
        },
        _create:function(){
            var valueEl = this.element,
				options=this.options,
				id=valueEl.attr("id");

            if(options.initType=='html'){
            	this._buildOptions(options,valueEl);
            }
			if(id){
			   valueEl.attr("aeId",id);
			}
            valueEl.wrap('<span class="e_elements"><span class="e_input e_input-left"><span></span></span></span>');
            this.dropList = $($('<div class="c_combox"><div class="c_comboxContent"></div></div>').css({position:'absolute', zIndex:2000}).appendTo(document.body).children().first()).hide();

//            this.element.addClass('om-suggestion om-widget om-state-default om-state-nobg');
//            this.dropList = $('<div class="om-widget"><div class="om-widget-content om-droplist"></div></div>').css({position:'absolute', zIndex:2000}).appendTo(document.body).children().first().hide();
        },
        _buildOptions:function(options,valueEl){
        	if(valueEl.attr("cacheSize")){
        		options.cacheSize = parseInt(valueEl.attr("cacheSize"));
        	}
			options.delay = parseInt(valueEl.attr("delay"))|| options.delay;
			options.enable = valueEl.attr("enable")=='false' ? false : options.enable;
		    options.onlyRead = valueEl.attr("onlyRead") == 'true' ? true : options.onlyRead;
			options.listMaxHeight = parseInt(valueEl.attr("listMaxHeight"))|| options.listMaxHeight;
			options.listWidth = parseInt(valueEl.attr("listWidth"));
			options.minChars = parseInt(valueEl.attr("minChars")) || options.minChars;
			options.queryName = valueEl.attr("queryName") || options.queryName;
			options.dataSource = valueEl.attr("dataSource");

			var clientFormatter = valueEl.attr("clientFormatter");
			var preProcess = valueEl.attr("preProcess");
			var onBeforeSuggest = valueEl.attr("onBeforeSuggest");
			var onSuggesting = valueEl.attr("onSuggesting");
			var onSelect = valueEl.attr("onSelect");
			var onSuccess = valueEl.attr("onSuccess");
			var onError = valueEl.attr("onError");

			this._buildOptionsEvent(options, 'clientFormatter',clientFormatter);
			this._buildOptionsEvent(options, 'preProcess',preProcess);
			this._buildOptionsEvent(options, 'onBeforeSuggest',onBeforeSuggest);
			this._buildOptionsEvent(options, 'onSuggesting',onSuggesting);

			options.onSelect=onSelect ? function(text,rowData,index,event){
				if($.isString(onSelect)){
					var i = onSelect.indexOf("(");
					var actName = i>0 ? onSelect.substring(0, i) : onSelect;
					var func = 	"return window."+actName+"?"+actName+".call(window, t ,r , i , e):false;";
					return new Function("t","r","i","e",func)(text,rowData,index,event);
				}
        	}: options.onSelect;

			options.onSuccess=onSuccess ? function(data,textStatus,event){
				if($.isString(onSuccess)){
					var i = onSuccess.indexOf("(");
					var actName = i>0 ? onSuccess.substring(0, i) : onSuccess;
					var func = 	"return window."+actName+"?"+actName+".call(window, d ,t ,e):false;";
					return new Function("d","t","e",func)(data,textStatus,event);
				}
        	}: options.onSuccess;

        	options.onError= onError ? function(code,info,error,event){
				if($.isString(onError)){
					var i = onError.indexOf("(");
					var actName = i>0 ? onError.substring(0, i) : onError;
					var func = 	"return window."+actName+"?"+actName+".call(window, c ,i ,er ,e):false;";
					return new Function("c","i","er","e",func)(code,info,error,event);
				}
        	}: options.onError;
        },
        _buildOptionsEvent:function(ops,evtName,evtValue){
         	ops[evtName]= evtValue? function(param1,param2){
        		if($.isString(evtValue)){
					var i = evtValue.indexOf("(");
					var actName = i>0 ? evtValue.substring(0, i) : evtValue;
					var func = "return window."+actName+"?"+actName+".call(window,p1,p2):false;";
					return new Function("p1","p2",func)(param1,param2);
				}
        	}: ops[evtName];
        },
        _init:function(){
            var self = this,
				options = this.options,
				inputEl = this.element,
				dropList = this.dropList;
            //非法属性值修正
            if(options.minChars<0){
                options.minChars=0;
            }
            if(options.cacheSize<0){
                options.cacheSize=0;
            }
            if(options.delay<0){
                options.delay=0;
            }
            //其它处理
            if(!options.enable){
				self.disable();
			}else{
				self.enable();
			}
            if(options.onlyRead){
				inputEl.attr('readonly', 'readonly');
			}else{
				inputEl.removeAttr('readonly');
			}
            //绑定按键事件
            inputEl.focus(function(){
//                $(this).addClass("om-state-focus");
            	  $('.c_comboxContent').hide();
                  $('.c_option').css('visibility', 'hidden');
            }).blur(function(){
//                $(this).removeClass("om-state-focus");
            }).keydown(function(e){
                if(e.keyCode == $.ae.keyCode.TAB){
                    dropList.hide();
                }
            }).keyup(function(e){
                var key = e.keyCode,
                    keyEnum = $.ae.keyCode;
                switch (key) {
                    case keyEnum.DOWN: //down
                        if (dropList.css('display') !== 'none') {
                            self._selectNext();
                        } else {
                            if (dropList.find('a').size() > 0) {
                                dropList.show();
                            }
                        }
                        break;
                    case keyEnum.UP: //up
                        if (dropList.css('display') !== 'none') {
                            self._selectPrev();
                        } else {
                            if (dropList.find('a').size() > 0) {
                                dropList.show();
                            }
                        }
                        break;
                    case keyEnum.ENTER: //enter
                        if (dropList.css('display') === 'none'){
                            return;
                        }
                        dropList.hide();
                        //trigger onSelect handler
                        self._triggerOnSelect(e);
                        return false;
                    case keyEnum.ESCAPE: //esc
                        dropList.hide();
                        break;
                    case keyEnum.TAB: //tab
                        //only trigger the blur event
                        break;
                    default:
                        if (!options.enable || options.onlyRead) {
                            return false;
                        }
                        if (options.delay > 0) {
                            var delayTimer = $.data(inputEl, 'delayTimer');
                            if (delayTimer) {
                                clearTimeout(delayTimer);
                            }
                            delayTimer = setTimeout(function(){
                                self._suggest();
                            }, options.delay);
                            $.data(inputEl, 'delayTimer', delayTimer);
                        } else {
                            self._suggest();
                        }
                }
            }).mousedown(function(e){
                e.stopPropagation();
            });
            dropList.mousedown(function(e){
                e.stopPropagation();
            });
            $(document).bind('mousedown.aeSearch',this.globalEvent=function(){
                dropList.hide();
            });
        },
        /**
         * 清空与此组件相关的缓存数据。每次提示后都会将结果集缓存（缓存的数目为config中配置的cacheSize），下次再需要对相同内容进行提示时会直接从缓存读取而不发送请求到服务器，如果需要忽略缓存而从服务器重新提示则可以调用此方法清除缓存。
         * @name aeSearch#clearCache
         * @function
         * @returns 无
         * @example
         * $('#txt').aeSearch('clearCache');
         */
        clearCache:function(){
            $.removeData(this.element,'cache');
        },
        /**
         * 在下拉框中显示一个提示信息（仅用于阅读，不可以通过快捷键或鼠标选择它）。
         * @name aeSearch#showMessage
         * @function
         * @param message 要显示在下拉框中的消息
         * @example
         * $('#txt').aeSearch('showMessage','请求数据出错');
         */
        showMessage: function(message){
            var inputEl = this.element;
            var dropList = this.dropList.empty().css('height','auto');
            $('<div>' + message + '<div>').appendTo(dropList);
            dropList.parent().css('left', inputEl.parent().offset().left).css('top',inputEl.offset().top+inputEl.outerHeight());
            var listWidth = this.options.listWidth;
            if (!listWidth) {//没有定义
                dropList.parent().width(inputEl.parent().outerWidth());
            } else if (listWidth !== 'auto') {
                dropList.parent().width(listWidth);
            }
            dropList.show();
            var listMaxHeight = this.options.listMaxHeight;
            if(listMaxHeight !== 'auto'){
                if(dropList.height() > listMaxHeight){
                    dropList.height(listMaxHeight).css('overflow','auto');
                }
            }
            return this;
        },
        /**
         * 禁用组件。
         * @name aeSearch#disable
         * @function
         * @example
         * $('#myinput').aeSearch('disable');
         */
        disable:function(){
            this.options.enable=false;
            this.element.attr('disabled', 'disabled')
                    .parent().parent().addClass('e_dis');
        },
        /**
         * 启用组件。
         * @name aeSearch#enable
         * @function
         * @example
         * $('#myinput').aeSearch('enable');
         */
        enable:function(){
            this.options.enable=true;
            this.element.removeAttr('disabled')
                   .parent().parent().removeClass('e_dis');
        },
        /**
         * 设置新的请求地址，新地址表示参数的改变或者地址的改变。
         * @name aeSearch#reload
         * @function
         * @param dataSource
         * @example
         * $('#country').change(function() {
         *   var v = $('#country').val();
         *   $('#txt').aeSearch("setData","../../../advancedSuggestion.json?contry="+v+"&province=hunan");
         * });
         */
        reload:function(dataSource){
            var options = this.options;
            if(dataSource){
                options.dataSource = dataSource;
            }
			if(options.cacheSize > 0){
			    this.clearCache(); //清空缓存
			}
        },
        /**
         * 获取当前下拉框中的数据（服务器端返回的数据）。
         * @name aeSearch#getData
         * @function
         * @return Array[Json]
         * @example
         * $('#txt').aeSearch("getData");
         */
        getData:function(){
            var returnValue = $.data(this.element, 'records');
            return returnValue || null;
        },
        /**
         * 获取当前组件的下拉框。
         * @name aeSearch#getDropList
         * @function
         * @return jQuery Element
         * @example
         * $('#txt').aeSearch("getDropList").addClass('myselfClass');
         */
        getDropList:function(){
            return this.dropList;
        },
        destroy:function(){
        	$(document).unbind('mousedown.aeSearch',this.globalEvent);
        	this.dropList.parent().remove();
        },
        _clear:function(){
            this.element.val('');
            return this.dropList.find('li').removeClass('on');
        },
        _selectNext:function(){
            var dropList = this.dropList,
                index = dropList.find('.on').index(),
                all = this._clear();
            index += 1;
            if (index >= all.size()) {
                index = 0;
            }
            this._scrollToAndSelect(all,index,dropList);
        },
        _selectPrev:function(){
            var dropList = this.dropList,
                index = dropList.find('.on').index(),
                all = this._clear();
            index-=1;
            if(index<0){
                index=all.size()-1;
            }
            this._scrollToAndSelect(all,index,dropList);
        },
        _scrollToAndSelect:function(all,index,dropList){
        	if(all.size()<1){
        		return;
        	}
            var target = $(all.get(index)).addClass('on');
            var targetTop = target.position().top;
            if (targetTop <= 0) {
                //需要向上滚动滚动条
                dropList.scrollTop(dropList.scrollTop() + targetTop);
            } else {
                //需要向下滚动滚动条
                var offset = targetTop + target.outerHeight() - dropList.height();
                if (offset > 0) {
                    dropList.scrollTop(dropList.scrollTop() + offset);
                }
            }
            this._select(index);
        },
        _select:function(index){
            var inputEl = this.element;
            var records=$.data(inputEl, 'records');
            var rowData,text;
            if(records.valueField){
                rowData=records.data[index];
                text=rowData[records.valueField];
            }else{
                rowData=records[index];
                text=rowData;
            }
            inputEl.val(text);
            $.data(inputEl, 'lastStr', text);
        },
        _suggest:function(){
            var inputEl = this.element;
            var text = inputEl.val();
            var last = $.data(inputEl, 'lastStr');
            if (last && last === text) {
                return;
            }
            $.data(inputEl, 'lastStr', text);
            var options = this.options;
            var cache = $.data(inputEl, 'cache');
            if (text.length > 0 && text.length >= options.minChars) {
                if (cache) {
                    var data = cache[text];
                    if (data) {//有缓存
                        $.data(inputEl, 'records', data);
                        this._buildDropList(data, text);
                        return;
                    }
                }
                //无缓存
                if (options.onBeforeSuggest) {
                    if (this._trigger("onBeforeSuggest",null,text) === false) {
                    	this.dropList.empty().hide();
                        return;
                    }
                }
                var self = this;
                var params = '{"'+options.queryName+'":"'+text+'"}';
                $.aries.ajax.post(options.dataSource,params,function(data, textStatus){
                	var onSuccess = options.onSuccess;
                    if (onSuccess && self._trigger("onSuccess",null,data, textStatus) === false) {
                        return;
                    }
                    var preProcess = options.preProcess;
                    if(preProcess){
                        data = preProcess(text,data);
                    }
                    //如果有preProcess且没有返回值
                    if($.isEmptyObject(data)){
                        data=[];
                    }
                    //cache data
                    if (options.cacheSize > 0) {
                        var cache = $.data(inputEl, 'cache') ||
                        {
                            ___keys: []
                        };
                        var keys = cache.___keys;
                        if (keys.length == options.cacheSize) {
                            //cache满了先去掉一个
                            var k = keys[0];
                            cache.___keys = keys.slice(1);
                            cache[k] = undefined;
                        }
                        cache[text] = data;
                        cache.___keys.push(text);
                        $.data(inputEl, 'cache', cache);
                    }
                    $.data(inputEl, 'records', data);
                    //buildDropList
                    var delay = $.data(inputEl, 'delay');
                    if (delay) {
                        clearTimeout(delay);
                    }
                    delay = setTimeout(function(){
                    	self._buildDropList(data, text);
                    }, 100);
                    $.data(inputEl, 'delay', delay);
                },function(code, info, error){
                	 var onError = options.onError;
                     if (onError) {
                         self._trigger("onError",null,code, info, error);
                     }
                },$.extend({},{type:options.method,dataType:options.crossDomain ? 'jsonp':'json'}));
            /*    var requestOption = {
                    url: options.dataSource,
                    type: options.method,
                    dataType: options.crossDomain ? 'jsonp':'json',
                    data: {},
                    success: function(data, textStatus){
                        var onSuccess = options.onSuccess;
                        if (onSuccess && self._trigger("onSuccess",null,data, textStatus) === false) {
                            return;
                        }
                        var preProcess = options.preProcess;
                        if(preProcess){
                            data = preProcess(text,data);
                        }
                        //如果有preProcess且没有返回值
                        if($.isEmptyObject(data)){
                            data=[];
                        }
                        //cache data
                        if (options.cacheSize > 0) {
                            var cache = $.data(inputEl, 'cache') ||
                            {
                                ___keys: []
                            };
                            var keys = cache.___keys;
                            if (keys.length == options.cacheSize) {
                                //cache满了先去掉一个
                                var k = keys[0];
                                cache.___keys = keys.slice(1);
                                cache[k] = undefined;
                            }
                            cache[text] = data;
                            cache.___keys.push(text);
                            $.data(inputEl, 'cache', cache);
                        }
                        $.data(inputEl, 'records', data);
                        //buildDropList
                        self._buildDropList(data, text);
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown){
                        var onError = options.onError;
                        if (onError) {
                            self._trigger("onError",null,XMLHttpRequest, textStatus, errorThrown);
                        }
                    }
                };
                requestOption.data[options.queryName]=text;
                $.ajax(requestOption);*/
                var onSuggesting = options.onSuggesting;
                if (onSuggesting) {
                    self._trigger("onSuggesting",null,text);
                }
            } else {
            	this.dropList.empty().hide();
            }
        },
        _buildDropList:function(records,text){
            var inputEl = this.element,
                dropList = this.dropList.empty().css('height','auto'),
                isSimple = records.valueField ? false : true,
                clientFormatter = this.options.clientFormatter,
                self = this,
                innerHtml = '<div class="c_list c_list-table c_list-col-1"><ul>';
            if (isSimple) {
                if (clientFormatter) {
                    $(records).each(function(index){
                    	innerHtml += self._addRow(clientFormatter(this, index));
                    });
                } else {
                    $(records).each(function(index){
                    	innerHtml += self._addRow(this);
                    });
                }
            } else {
                if (clientFormatter) {
                    $(records.data).each(function(index){
                    	innerHtml += self._addRow(clientFormatter(this, index));
                    });
                }
            }
            innerHtml += '</ul></div>';
            if (innerHtml) {
                $(innerHtml).appendTo(dropList);
            }
            var all = dropList.find('a'),
                $listRows = dropList.find('li');

            if (all.size() > 0) {
                dropList.parent().css('left', parseInt(inputEl.parent().offset().left)).css('top',inputEl.offset().top+inputEl.outerHeight());
                var listWidth = this.options.listWidth;
                if (!listWidth) {//没有定义
                    dropList.parent().width(inputEl.parents('.e_input').outerWidth());
                } else if (listWidth !== 'auto') {
                    dropList.parent().width(listWidth);
                }
                $listRows.mouseover(function(){
                	$listRows.removeClass('on');
                    $(this).addClass('on');
                }).mousedown(function(event){
                    var index = dropList.find('.on').index();
                    self._select(index);
                    dropList.hide();
                    //trigger onSelect handler
                    self._triggerOnSelect(event);
                });
                dropList.show();
                var listMaxHeight = this.options.listMaxHeight;
                if(listMaxHeight !== 'auto'){
                    if(dropList.height() > listMaxHeight){
                        dropList.height(listMaxHeight).css('overflow','auto');
                    }
                }
                dropList.scrollTop(0);
            }
        },
        _addRow: function(html){
        	return '<li><a class="text"><span>' + html + '</span></a></li>';
        },
        _triggerOnSelect: function(event){
            var onSelect=this.options.onSelect;
            if(onSelect){
                var index = this.dropList.find('.on').index();
                if(index<0){
                    return;
                }
                var records=$.data(this.element, 'records'),
                    rowData,
                    text;
                if(records.valueField){
                    rowData=records.data[index];
                    text=rowData[records.valueField];
                }else{
                    rowData=records[index];
                    text=rowData;
                }
                this._trigger("onSelect",event,rowData,text,index);
            }
        }
    });
});

define('ui-textarea',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
	 $.aeWidget('ae.aeTextarea', {
		 options:{
             /**
              * 是否禁用组件。如果禁用，则不可以输入，form提交时也将忽略这个输入框。
              * @type Boolean
              * @default true
              * @example
              * enable : false
              */
			 enable : true,
             /**
              * 组件是否可以输入。设成false时不可以输入。
              * @type Boolean
              * @default true
              * @example
              * editable : true
              */
			 editable : true,
             /**
              * 隐藏组件。
              * @type Boolean
              * @default true
              * @example
              * visible : false
              */
             visible :true,
             /**
              * 失去焦点时是否进行校验。
              * @type Boolean
              * @default false
              * @example
              * isValidate : true
              */
             //isValidate:false,
             /**
              * aeTextarea初始化方式，默认通过html来设置参数。传值为js时，则通过js中设置的option来初始化。
              * @type String
              * @default 'html'
              * @example
              * $('.selector').aeTextarea({initType : 'js'});
              */
             initType : 'html',
			 /**
			  * 限制输入的长度。
			  * @type Boolean
			  * @default 无限制
			  * @example
			  * maxlength : "10"
			  */
			 maxlength: null

		 },
		 _create:function(){
			 var options=this.options,inputEl=this.element,
				 id = inputEl.attr('id');
			 if(options.initType=='html'){
				 this._buildOptions(options,inputEl);
			 }
			 if(id){
				 inputEl.attr("aeId",id);
			 }
			 var  obj = $("<textarea></textarea>");
             obj.attr({"aeType":inputEl.attr("aeType"),"aeId":inputEl.attr("id"),"aeInit":"false","aeValidate":inputEl.attr("aeValidate"),"rules":inputEl.attr("rules"),"onAddRules":inputEl.attr("onAddRules"),"maxlength":inputEl.attr("maxlength")});
             this.element=obj;
             inputEl.after(obj);
             inputEl.empty().hide();
             this.element.addClass('form-control').wrap('<div class="input-icon right"></div>');
		 },
		 _init:function(){
			 var self=this,options = this.options,inputEl=this.element;
			 if(!options.visible){
				 inputEl.addClass('hidden');
			 }
			 if(options.row){
				 inputEl.attr('rows', options.row);
			 }
			 if(options.width){
				 inputEl.css("width",options.width);
			 }
	         self.enable(!!options.enable);
	         if(!options.editable){
				 inputEl.attr('readonly', 'readOnly');
			 }else{
				 inputEl.removeAttr('readonly');
			 }
	         inputEl.attr("aeType",(options.aeType || "aeTextarea"));
	       //   if(options.isValidate){
	       //  	 inputEl.blur(function(){
		    		//  inputEl.validate();
		    	 // });
	         //}
	         if(options.value){
	        	self.setValue(options.value);
	         }
			 if(options.maxlength){
				 inputEl.attr('maxlength', options.maxlength);
			 }
		 },
		 _buildOptions:function(options,inputEl){
	         options.visible = inputEl.attr("visible")=='false' ? false : options.visible;
		     options.enable = inputEl.attr("enable")=='false' ? false : options.enable;
		     options.editable = inputEl.attr("editable") == 'false' ? false : options.editable;
		     //options.isValidate = inputEl.attr("isValidate") == 'true' ? true : options.isValidate;
		     options.aeType = inputEl.attr("aeType");
	         options.row = parseInt(inputEl.attr("row"));
		     options.width = inputEl.attr("width");
		     options.value = inputEl.attr("value");
		 },
	    /**
	     * 设置控件的启用禁用状态　value = true(启用),则会将input设置为可用状态,false(禁用),则会将input设置为不可用
	     * @name aeTextarea#enable(value)
	     * @function
	     * @returns jQuery对象
	     * @example
	     * $('#input').aeTextarea('enable',false);
	     * $('#input').aeTextarea('enable',true);
	    */
	    enable : function(value){
	    	if(value === undefined || value === ''){
	    		value = true;
	    	}
	    	var $ele = this.element;
	    	if(value === true || value === 'true'){
		        $ele.removeAttr('disabled');
		        this.options.enable = true;
	    	}
	    	if(value === false || value === 'false'){
	    		$ele.attr('disabled', true);
	    		this.options.enable = false;
	    	}
	    },
	    /**
	     * 设置控件的编辑状态　value = true(可编辑),false(不可编辑)
	     * @name aeTextarea#editable(value)
	     * @function
	     * @returns jQuery对象
	     * @example
	     * $('#input').aeTextarea('editable',false);
	     * $('#input').aeTextarea('editable',true);
	    */
	    editable : function(value){
	    	if(value === undefined || value === ''){
	    		value = true;
	    	}
	    	var $ele = this.element;
	    	if(value === true || value === 'true'){
	    		  $ele.removeAttr('readonly');
	    		  this.options.editable = true;
	    	}
	    	if(value === false || value === 'false'){
	    		$ele.attr('readonly', 'readOnly');
	    		this.options.editable = false;
	    	}
	    },
	    /**
	     * 显示和隐藏组件　value = true(显示),false(隐藏)
	     * @name aeTextarea#visible(value)
	     * @function
	     * @returns jQuery对象
	     * @example
	     * $('#input').aeTextarea('visible',false);
	     * $('#input').aeTextarea('visible',true);
	    */
	    visible : function(value){
	    	if(value === undefined || value === ''){
	    		value = true;
	    	}
	    	var $ele = this.element;
	    	if(value === true || value === 'true'){
	    		$ele.removeClass('hidden');
	    		this.options.visible = true;
	    	}
	    	if(value === false || value === 'false'){
	    		$ele.addClass('hidden');
	    		this.options.visible = false;
	    	}
	    },
	    getValue : function(){
	    	 var value =this.element.val();
        	 return value ? value : '';
	    },
	    setValue : function(v){
	    	if(typeof v === 'undefined' || v === '' || v===null){
	    		this.element.val('');
	    	}else{
	    		this.element.val(v);
	    	}
	    },
	    clear : function(){
	    	this.element.val('').focus();
	    }
	 });
});

define('ui-textfield',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
	 $.aeWidget('ae.aeTextfield', {
		 options:{
             /**
              * 是否禁用组件。如果禁用，则不可以输入，form提交时也将忽略这个输入框。
              * @type Boolean
              * @default true
              * @example
              * enable : false
              */
			 enable : true,
			  /**
              * 组件是否可以输入。设成false时不可以输入。
              * @type Boolean
              * @default true
              * @example
              * editable : false
              */
             editable : true,
             /**
              * 隐藏组件。
              * @type Boolean
              * @default true
              * @example
              * visible : false
              */
             visible :true,
             /**
              * 是否显示清除按钮。
              * @type Boolean
              * @default false
              * @example
              * showClear : true
              */
             showClear:false,
             /**
              * 是否置为密码框。
              * @type Boolean
              * @default false
              * @example
              * password : true
              */
             password:false,
             /**
              * 失去焦点时是否进行校验。
              * @type Boolean
              * @default false
              * @example
              * isValidate : true
              */
             //isValidate:false,
             /**
              * aeTextfield初始化方式，默认通过html来设置参数。传值为js时，则通过js中设置的option来初始化。
              * @type String
              * @default 'html'
              * @example
              * $('.selector').aeTextfield({initType : 'js'});
              */
             initType : 'html',
			 /**
			  * 值改变事件
			  * @type {Function|null}
			  * @default null
			  * $('.selector').aeTextfield({onValueChange : function(){
			  * 	console.log("onValueChange");
			  * }});
			  */
			 onValueChange: null,
			 /**
			  * 输入框聚焦时触发的事件
			  * @type {Function |null}
			  * @default null
			  * $('.selector').aeTextfield({onSelfFocus : function(){
			  * 	console.log("onSelfFocus");
			  * }});
			  *
			  * */
			 onSelfFocus: null,
			 /**
			  * 输入框失焦时触发的事件
			  *  @type {Function |null}
			  * @default null
			  * $('.selector').aeTextfield({onSelfBlur : function(){
			  * 	console.log("onSelfBlur");
			  * }});
			  * */
			 onSelfBlur: null,
			 /**
			  * 输入时按键按下去时触发的事件
			  *  @type {Function |null}
			  * @default null
			  * $('.selector').aeTextfield({onSelfKeyDown : function(){
			  * 	console.log("onSelfKeyDown");
			  * }});
			  * */
			 onSelfKeyDown: null,
			 /**
			  * 输入时按键抬起时触发的事件
			  *  @type {Function |null}
			  * @default null
			  * $('.selector').aeTextfield({onSelfKeyUp : function(){
			  * 	console.log("onSelfKeyUp");
			  * }});
			  * */
			 onSelfKeyUp: null,
			 /**
			  * 限制输入的长度。
			  * @type Boolean
			  * @default 无限制
			  * @example
			  * maxlength : "10"
			  */
			 maxlength: null


		 },
		 _create:function(){
			 var options=this.options,inputEl=this.element,
				 id = inputEl.attr('id');
			 if(options.initType=='html'){
				 this._buildOptions(options,inputEl);
	         }
			 if(id){
				 inputEl.attr("aeId",id);
			 }
		     var  obj = $("<input></input>");
             obj.attr({"aeType":inputEl.attr("aeType"),"aeId":inputEl.attr("id"),"aeInit":"false","aeValidate":inputEl.attr("aeValidate"),"rules":inputEl.attr("rules"),"onAddRules":inputEl.attr("onAddRules"),"maxlength":inputEl.attr("maxlength")});
             this.element=obj;
             inputEl.after(obj);
             inputEl.empty().hide();
             this.element.addClass('form-control').wrap('<div class="input-icon"></div>');
		 },
		 _init:function(){
			 var self = this,
			 	options = this.options,
				inputEl=this.element,
				onValueChange=options.onValueChange;

			 if(!options.visible){
				 inputEl.addClass('hidden');
			 }
			 if(options.password){
				 inputEl.prop('type','password');
			 }
			 if(options.width){
				 inputEl.parent().css("width",options.width);
			 }
			 self.enable(!!options.enable);
		     if(!options.editable){
				 inputEl.attr('readonly', 'readOnly');
			 }else{
				 inputEl.removeAttr('readonly');
			 }
		     if(options.aeType){
				 inputEl.attr("aeType",options.aeType);
			 }else{
				 inputEl.attr("aeType","aeTextfield");
			 }

		     if(options.showClear && options.visible && options.enable){
		    	 this.element.parent().addClass('right');
	    		 var inputClear = $('<i class="icon-error2"></i>').insertAfter(this.element).hide();
		    	 inputEl.bind('input propertychange',function(e){
			    	 if(inputEl.val() !== '' && typeof (inputEl.val()) != 'undefined'){
			    		 inputClear.show();
				     }else{
				    	 inputClear.hide();
				     }
			     });
			     inputClear.click(function(e){
		             inputEl.val('');
		             inputClear.hide();
		             inputEl.focus();
					 if(typeof(onValueChange)==="function"){
						 self._trigger("onValueChange",null,e);
					 }
		         });
		     }
		     if(options.height){
				 inputEl.css("height",options.height);
				 if(options.showClear){
					 inputEl.next().css("line-height",options.height+"px");
				 }
			 }
			 if(options.maxlength){
				 inputEl.attr('maxlength', options.maxlength);
			 }
		     inputEl.bind('input propertychange',function(e){
		    	 if(typeof(onValueChange)==="function"){
		    		 self._trigger("onValueChange",null,e);
		    	 }
		     });
			 inputEl.focus(function (e) {
				 self._trigger("onSelfFocus", null, e);
			 });
			 inputEl.blur(function (e) {
				 self._trigger("onSelfBlur", null, e);
			 });
			 inputEl.keydown(function (e) {
				 self._trigger('onSelfKeyDown', null, e);
			 });
			 //绑定按键响应事件
			 inputEl.keyup(function (e) {
				 self._trigger('onSelfKeyUp', null, e);
			 });
		     if(options.emptyText){
		    	 inputEl.focus(function(){
			    	 self._refeshEmptyText(options.emptyText);
			     }).blur(function(){

			    	 self._refeshEmptyText(options.emptyText);
			     });
			     self._refeshEmptyText(options.emptyText);
		     }
		     // if(options.isValidate){
		    	//  inputEl.blur(function(){
		    	// 	 inputEl.validate();
		    	//  });
		     // }
		     if(options.value){
		    	 self.setValue(options.value);
		     }
		 },
		 _buildOptions:function(options,inputEl){
			 var i,
			 	onValueChange,
				 onSelfFocus,
				 onSelfBlur,
				 onSelfKeyUp,
				 onSelfKeyDown;
			 options.visible = inputEl.attr("visible") == 'false' ? false : options.visible;
			 options.enable = inputEl.attr("enable") == 'false' ? false : options.enable;
			 options.editable = inputEl.attr("editable") == 'false' ? false : options.editable;
			 options.showClear = inputEl.attr("showClear") == 'true' ? true : options.showClear;
			 options.password = inputEl.attr("password") == 'true' ? true : options.password;
			 //options.isValidate = inputEl.attr("isValidate") == 'true' ? true : options.isValidate;
			 options.emptyText = inputEl.attr("emptyText");
			 options.width = inputEl.attr("width");
			 options.height = parseInt(inputEl.attr("height"));
			 options.aeType = inputEl.attr("aeType");
			 options.value = inputEl.attr("value");
			 onSelfFocus = options.onSelfFocus;
			 onSelfBlur = options.onSelfBlur;
	         onValueChange = options.onValueChange;
			 onSelfKeyDown = options.onSelfKeyDown;
			 onSelfKeyUp =options.onSelfKeyUp ;
			 if($.isFunction(options.onValueChange)===false){
				 onValueChange = inputEl.attr("onValueChange");
			 }
			 if($.isFunction(options.onValueChange)===false){
				 onSelfFocus = inputEl.attr('onSelfFocus');
			 }
			 if($.isFunction(options.onValueChange)===false){
				 onSelfBlur = inputEl.attr('onSelfBlur');
			 }
			 if($.isFunction(options.onValueChange)===false){
				 onSelfKeyDown = inputEl.attr('onSelfKeyDown');
			 }
			 if($.isFunction(options.onValueChange)===false){
				 onSelfKeyUp = inputEl.attr('onSelfKeyUp');
			 }
			 this._getFunName(options, onValueChange, 'onValueChange');
			 this._getFunName(options, onSelfFocus, 'onSelfFocus');
			 this._getFunName(options, onSelfBlur, 'onSelfBlur');
			 this._getFunName(options, onSelfKeyDown, 'onSelfKeyDown');
			 this._getFunName(options, onSelfKeyUp, 'onSelfKeyUp');
		 },
		 _getFunName: function (options, handleName, handle) {
			 var funName;
			 if ($.isString(handleName) && handleName !== "") {
				 i = handleName.indexOf("(");
				 funName = handleName;
				 if (i > 0) {
					 funName = handleName.substring(0, i);
				 }
				 try {
					 options[handle] = eval(funName);
				 } catch (e) { //定义的函数为无效函数
				 }
			 }
			 if (typeof(options[handle]) !== "function") {
				 options[handle] = null;
			 }
		 },
		 _refeshEmptyText:function(emptyText){
        	 var el = this.element;
             if(!emptyText)
                 return;
        	 if (el.prop('placeholder') === '') {
        		 el.prop('placeholder',emptyText);
             } else {
                 if(el.prop('placeholder') === emptyText){
                	 el.prop('placeholder','');
                 }
             }
        },
	   /**
	     * 设置控件的启用禁用状态　value = true(启用),则会将input设置为可用状态,false(禁用),则会将input设置为不可用
	     * @name aeTextfield#enable(value)
	     * @function
	     * @returns jQuery对象
	     * @example
	     * $('#input').aeTextfield('enable',false);
	     * $('#input').aeTextfield('enable',true);
	    */
	    enable : function(value){
	    	if(value === undefined || value === ''){
	    		value = true;
	    	}
	    	var $ele = this.element;
	    	if(value === true || value === 'true'){
		        $ele.removeAttr('disabled');
		        this.options.enable = true;
		        if(this.options.showClear){
	    			  if($ele.val() !== '' && typeof ($ele.val()) != 'undefined'){
		    			  $ele.next().show();
		    		  }
	    		}
	    	}
	    	if(value === false || value === 'false'){
	    		$ele.attr('disabled', true);
	    		this.options.enable = false;
	    		if($ele.next().css("display")==='block'){
	    			 $ele.next().hide();
	    		}
	    	}
	    },
	    /**
	     * 设置控件的编辑状态　value = true(可编辑),false(不可编辑)
	     * @name aeTextfield#editable(value)
	     * @function
	     * @returns jQuery对象
	     * @example
	     * $('#input').aeTextfield('editable',false);
	     * $('#input').aeTextfield('editable',true);
	    */
	    editable : function(value){
	    	if(value === undefined || value === ''){
	    		value = true;
	    	}
	    	var $ele = this.element;
	    	if(value === true || value === 'true'){
	    		  $ele.removeAttr('readonly');
	    		  this.options.editable = true;
	    		  if(this.options.showClear){
	    			  if($ele.val() !== '' && typeof ($ele.val()) != 'undefined'){
		    			  $ele.next().show();
		    		  }
	    		  }
	    	}
	    	if(value === false || value === 'false'){
	    		  $ele.attr('readonly', 'readOnly');
	    		  this.options.editable = false;
	    		  if($ele.next().css("display")==='block'){
	    			  $ele.next().hide();
	    		  }
	    	}
	    },
	    /**
	     * 显示和隐藏组件　value = true(显示),false(隐藏)
	     * @name aeTextfield#visible(value)
	     * @function
	     * @returns jQuery对象
	     * @example
	     * $('#input').aeTextfield('visible',false);
	     * $('#input').aeTextfield('visible',true);
	    */
	    visible : function(value){
	    	if(value === undefined || value === ''){
	    		value = true;
	    	}
	    	var $ele = this.element;
	    	if(value === true || value === 'true'){
	    		$ele.removeClass('hidden');
	    		this.options.visible = true;
	    		var inputClear = $('<i class="icon-error2"></i>').insertAfter($ele).hide();
	    		$ele.bind('input propertychange',function(e){
			    	if($ele.val() !== '' && typeof ($ele.val()) != 'undefined'){
			    		inputClear.show();
				    }
			    });
			    inputClear.click(function(){
			    	$ele.val('');
		            inputClear.hide();
		        });

	    	}
	    	if(value === false || value === 'false'){
	    		$ele.addClass('hidden');
	    		this.options.visible = false;
	    		if($ele.next().is('.icon-error2')){
	    			$ele.next().remove();
	    		}
	    	}
	    },
	    getValue : function(){
	    	 var value =this.element.val();
        	 return value ? value : '';
	    },
	    setValue : function(v){
	    	if(typeof v === 'undefined' || v === '' || v===null){
	    		this.element.val('');
	    	}else{
	    		this.element.val(v);
	    		if(this.options.showClear && this.options.editable&&this.options.enable){
	    			this.element.next().show();
	    		}
	    	}
	    },
	    clear : function(){
	    	this.element.val('').focus();
	    	if(this.options.showClear){
	    		this.element.next().hide();
	    	}
	    }
	 });
});

define('ui-textpopup',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
	 $.aeWidget('ae.aeTextpopup', {
		 options:{
      
			 /**
              * 是否禁用组件。如果禁用，则不可以输入，form提交时也将忽略这个输入框。
              * @type Boolean
              * @default true
              * @example
              * enable : false
              */
			 enable : true,
             /**
              * 隐藏组件。
              * @type Boolean
              * @default true
              * @example
              * visible : false
              */
             visible :true,
             /**
     		 * 组件是否可拖动。
     		 * @type Boolean
     		 * @default true
     		 * @example
     		 */
     		draggable: false,
     		/**
    		 * 是否可改变大小。
    		 * @type Boolean
    		 * @default true
    		 * @example
    		 */
    		resizable: false,
	         /**
              * 弹出本页面的DIV的Id
              * @name aeTextpopup#popupDiv
              * @default 无
              * @type String
              * @example
              * popupDiv : 'popup-div-tree'
              */
			 /**
              * 弹出框标题
              * @name aeTextpopup#popupTitle
              * @default 无
              * @type String
              * @example
              * popupTitle : '客户信息'
              */
			 /**
              * 弹出框对应的page名
              * @name aeTextpopup#popupPage
              * @default 无
              * @type String
              * @example
              * popupPage : 'demo-grid.html'
              */
			 /**
	          * 弹出框宽度。可以使用px、pt、em、auto，如'100px'、'10pt'、'15em'、'auto'
	          * @type String
	          * @default '300'
	          * @example
	          * <input id="userName" popupWidth="100"/>
	          */
	         popupWidth : '600',
			 /**
	          * 弹出框高度。可以使用px、pt、em、auto，如'100px'、'10pt'、'15em'、'auto'
	          * @type Number
	          * @default 'auto'
	          * @example
	          * <input id="userName" popupHeight="100"/>
	          */
	         popupHeight : 'auto',
	         /**
		      * 是否显示弹出框关闭按钮
		      * @type Boolean
              * @default true
		      * @example
		      * <input id="userName" showClose="false"/>
		      */
	         showClose : true,
	         /**
		      * 是否显示弹出框确认取消按钮
		      * @type Boolean
              * @default true
		      * @example
		      * <input id="userName" showButton="false"/>
		      */
	         showButton : true,
			 onValueChange:null,
	         /**
		      * 是否是模态窗口
		      * @type Boolean
              * @default true
		      * @example
		      * <input id="userName" modal="false"/>
		      */
	         modal:true,
	         /**
              * 是否显示清除按钮。
              * @type Boolean
              * @default false
              * @example
              * showClear : true
              */
             showClear:false,
	         /**
		      * div方式弹出框的初始化回调函数
		      * @name aeTextpopup#initAfterAction
		      * @type Function
              * @default 无
		      * @example
		      * function initAfterAction(){
    	            $("#demo-tree").aeTree();
	            }
		      */
	         /**
		      * page方式弹出框的回调函数
		      * @name aeTextpopup#afterAction
		      * @type Function
              * @default 无
		      * @example
		      * function afterAction(json){
    	            ("#demoForm_userName2").val(json.custId+"|"+json.custName);
                }
		      */
	         /**
              * aeTextpopup初始化方式，默认通过html来设置参数。传值为js时，则通过js中设置的option来初始化。
              * @type String
              * @default 'html'
              * @example
              * $('.selector').aeTextpopup({initType : 'js'});
              */
             initType : 'html'
		 },
	    /**
	     * 设置控件的启用禁用状态　value = true(启用),则会将input设置为可用状态,false(禁用),则会将input设置为不可用
	     * @name aeTextpopup#enable(value)
	     * @function
	     * @returns jQuery对象
	     * @example
	     * $('#input').aeTextpopup('enable',false);
	     * $('#input').aeTextpopup('enable',true);
		 */
	     enable : function(value) {
	    	 var self = this;
	    	 if(value === undefined){
		    		value = true;
	    	 }
	    	 var $ele = this.element,opts = this.options,enable = opts.enable;
	    	 if(value === true || value === 'true'){
	    		 enable = true;
	    		 $ele.prop({'readonly':true,'disabled':false}).addClass('form-readonly');
		         $ele.closest('div.input-group').find('.btn-default').prop('disabled',false);
		         if(opts.emptyText){
		        	 $ele.focus(function(){
				    	 self._refeshEmptyText(opts.emptyText);
				     }).blur(function(){
				    	 self._refeshEmptyText(opts.emptyText);
				     });
				     self._refeshEmptyText(opts.emptyText);
			     }
		         self._bindEvent();
	    	 }
	    	 if(value === false || value === 'false'){
	    		 enable = false;
	    		 $ele.prop({'readonly':false,'disabled':true}).removeClass('form-readonly').off('click.aeTextpopup');
		         $ele.closest('div.input-group').find('.btn-default').prop('disabled', true);
	    	 }
	     },
		 /**
		   * 显示和隐藏组件　value = true(显示),false(隐藏)
		   * @name aeTextpopup#visible(value)
		   * @function
		   * @returns jQuery对象
		   * @example
		   * $('#input').aeTextpopup('visible',false);
		   * $('#input').aeTextpopup('visible',true);
		 */
		  visible : function(value){
		    	if(value === undefined){
		    		value = true;
		    	}
		    	var $ele = this.element,visible = this.options.visible;
		    	if(value === true || value === 'true'){
		    		$ele.closest('div.input-group').removeClass('hidden');
		    		visible = true;
		    	}
		    	if(value === false || value === 'false'){
		    		$ele.closest('div.input-group').addClass('hidden');
		    		visible = false;
		    	}
		  },
		  clear : function(){
			  var oldValue=this.element.val();
		    	this.element.val('').focus();
		    	this.element.removeAttr("valueField");
		    	if(this.options.showClear){
		    		this.element.next().hide();
		    	}
				if(oldValue!=="" && this.options.onValueChange!==null){
					this._trigger("onValueChange");
				}
		  },
	   /**
         * 获取显示值
         * @name aeTextpopup#getDisplayText
         * @function
         * @example
         * $('#myTextpopup').aeTextpopup('getDisplayText');
         */
         getDisplayText:function(){
        	 var value =this.element.val();
        	 return value ? value : '';
         },
        /**
         * 获取值
         * @name aeTextpopup#getValue
         * @function
         * @example
         * $('#myTextpopup').aeTextpopup('getValue');
         */
         getValue:function(){
        	 var value =this.element.attr("valueField");
        	 return value ? value : '';
         },
         /**
          * 设置值
          * @name aeTextpopup#setValue
          * @function
          * @example
          * $('#myTextpopup').aeTextpopup('setValue','v');
          */
         setValue:function(v){
        	if(typeof v !== 'undefined' || v !== ''){
        		this.element.attr("valueField",v);
 	    	}
         },
        /**
          * 设置值
          * @name aeTextpopup#setDisplayText
          * @function
          * @example
          * $('#myTextpopup').aeTextpopup('setDisplayText','v');
         */
         setDisplayText:function(v){
         	if(typeof v === 'undefined' || v === ''){
  	    		this.element.val('');
  	    	}else{
  	    		this.element.val(v);
  	    		if(this.options.showClear){
	    			this.element.next().show();
	    		}
  	    	}
         },
		 _create:function(){
			 var $self = this.element, opts = this.options;
			 if(opts.initType=='html'){
				 this._buildOptions(opts,$self);
			 }
			 var  obj = $("<input></input>");
             obj.attr({"aeType":$self.attr("aeType"),"aeId":$self.attr("id"),"aeInit":"false","afterAction":$self.attr("afterAction"), "aeValidate":$self.attr("aeValidate"),"rules":$self.attr("rules")});
             this.element=obj;
             $self.after(obj);
             $self.empty().hide();
             this.element.addClass('form-control').wrap('<div class="input-group"></div>');
             this.element.after('<span class="input-group-btn"><button class="btn btn-default"><i class="fa fa-search"></i></button></span>');
		 },
		 _init:function(){
			 var self = this,
			 	$ele = this.element,
				opts = this.options;

			 if(!opts.visible){
				$ele.closest('div.input-group').addClass('hidden');
			 }
			 if(opts.showClear && opts.enable){
				 $ele.wrap('<div class="input-icon right"></div>');
	    		 $('<i class="icon-error2"></i>').insertAfter($ele).hide();
				 $ele.next().click(function(){
					 self.clear();
				 });
		     }
			 if(opts.width){
				 $ele.closest('div.input-group').css("width",opts.width);
			 }
			 self.enable(!!opts.enable);
			 if(opts.aeType){
				 $ele.attr("aeType",opts.aeType);
			 }else{
				 $ele.attr("aeType","aeTextpopup");
			 }
		 },
		 _buildOptions:function(options,element){
			 var val=element.attr("onValueChange");
			 if(val!==undefined){
				 val=(window[val] || null);
			 }
			 options.onValueChange=($.isFunction(val))?val:options.onValueChange;
			 options.enable = element.attr("enable")=='false' ? false : options.enable;
			 options.visible = element.attr("visible")=='false' ? false : options.visible;
			 options.draggable = element.attr("draggable")=='true' ? true : options.draggable;
			 options.resizable = element.attr("resizable")=='true' ? true : options.resizable;
			 options.popupWidth = parseInt(element.attr("popupWidth"))|| options.popupWidth;
			 options.popupHeight = parseInt(element.attr("popupHeight"))|| options.popupHeight;
			 options.showClose = element.attr("showClose")=='false' ? false : options.showClose;
			 options.showButton = element.attr("showButton")=='false' ? false : options.showButton;
			 options.popupTitle = $.evalI18nString(element.attr("popupTitle"));
			 options.appendTo = options.appendTo || element.attr("appendTo");
			 val=element.attr("popupSource");
			 if(val===undefined){
				val= options.popupSource;
			 }
			 options.popupSource = val;
			 val=element.attr("popupType");
			 if(val===undefined){
				 val=options.popupType;
			 }
			 options.popupType = val;
			 options.modal = element.attr("modal") == 'false' ? false : options.modal;
	         options.showClear = element.attr("showClear") == 'true' ? true : options.showClear;
		     options.emptyText = element.attr("emptyText");
		     options.aeType = element.attr("aeType");
		     options.width = element.attr("width");

			 var initAfterAction = element.attr("initAfterAction");
			 options.initAfterAction = initAfterAction ? function(){
				 if($.isString(initAfterAction)){
					    var i = initAfterAction.indexOf("(");
						var actName = i>0 ? initAfterAction.substring(0, i) : initAfterAction;
						var func = "return window."+actName+"?"+actName+".call(window):false;";
						return new Function(func)();
			    }
			 }: '';

			 var setParam = element.attr("setParam");
			 options.setParam = setParam ? function(){
				 if($.isString(setParam)){
					    var i = setParam.indexOf("(");
						var actName = i>0 ? setParam.substring(0, i) : setParam;
						var func = "return window."+actName+"?"+actName+".call(window):false;";
						return new Function(func)();
			    }
			 }: '';

			 var onConfirm = element.attr("onConfirm");
			 options.onConfirm = onConfirm ? function(event){
				 if($.isString(onConfirm)){
					    var i = onConfirm.indexOf("(");
						var actName = i>0 ? onConfirm.substring(0, i) : onConfirm;
						var func = 	"return window."+actName+"?"+actName+".call(window,e):false;";
						return new Function("e",func)(event);
			    }
			 }: '';

		 },

		 _bindEvent:function(){
			  var self = this, opts = self.options,initAfterAction = opts.initAfterAction;
			  this.element.off('click.aeTextpopup').on('click.aeTextpopup',function(){
	          var cfg = {
		        		 autoOpen: true,
		 		  		 modal: opts.modal,
						 appendTo:opts.appendTo,
		 		  		 draggable:opts.draggable,
		 		  		 resizable:opts.resizable,
		 		  		 showClose:opts.showClose,
		 		  		 showButton:opts.showButton,
		 		  		 width:opts.popupWidth,
		 		  		 height:opts.popupHeight,
		 		  		 title:opts.popupTitle,
		 		  		 popupType:opts.popupType,
		 		  		 close:function(){
		 		  			 var array = $.aries.page.data._paramArray;
		 		  			 if(array.length>0){
					    		 array.pop();
					    	 }else{
					    		 $.aries.page.data._removeHidedData("ae_popup_Id");
					    	 }
		 		  			 $.aries.page.data._removeHidedData("ae_popup_param");
		 		  			 if(opts.popupType === 'page'){
		 		  				 var _privateArray = $.aries.page.data._privateArray;
				        		 if($.isArray(_privateArray) && _privateArray.length>0){
					        		 _privateArray.pop();
				        		 }
		 		  			 }
		 		  		 },
		 		  		 confirm:opts.onConfirm
		          };
		          if(opts.popupSource){
		        	  if(opts.popupType === 'page'){
		        		  if(opts.setParam){
		        			  var popupParam = opts.setParam();
		        			  if(popupParam){
		        				  $.aries.page.data._setHidedData("ae_popup_param",popupParam);
		        			  }
		        		  }
		        		  $.ajax(opts.popupSource, {
			    		 		cache: false,
			    		 		success: function(data, textStatus, jqXHR){
			    		 			if($(document.body).find('div[id="ae_popup_div_'+self.element.attr("aeId")+'"]').length<=0){
				    		 			$('<div id="ae_popup_div_'+self.element.attr("aeId")+'"></div>').appendTo('body');
			    		 			}
			    		 			//$("#ae_popup_div_"+self.element.attr("aeId")).aeDialog(cfg);
			    		 			//self.options.elementId = "ae_popup_div_"+self.element.attr("aeId");
			    		 			var obj=$.extend(true,{},$.extend({
			    						    elementId:"ae_popup_div_"+self.element.attr("aeId")
			    						 },cfg));
			    		 			$("#ae_popup_div_"+self.element.attr("aeId")).aeDialog(obj);
			    		 			$.aries.page.data._paramArray.push(obj);
				  		        	$.aries.page.data._setHidedData("ae_popup_Id",$.aries.page.data._paramArray);
			    		 			$("#ae_popup_div_"+self.element.attr("aeId")).html(data);
			    		 			if(typeof $.popupConfirmEvent == 'function'){
			    		 				var array = $.aries.page.data._privateArray;
			    		 				array.push({
									        "id" : self.element.attr("aeId"),
									        "confirmFunc" : $.popupConfirmEvent
								        });
			    		 			}
							        if(opts.popupConfirmEvent && typeof opts.popupConfirmEvent==="function"){
								        $.aries.page.data._textPopPageConfirm = opts.popupConfirmEvent;
							        }
			    		 			$.aries.common.globalInit("ae_popup_div_"+self.element.attr("aeId"));
			    		 		},
			    		 		error: function(jqXHR, textStatus, errorThrown){
			    		 		}
			    		 	});
		              }
		        	  if(opts.popupType === 'div'){
		        		   if(initAfterAction){
							   self._trigger("initAfterAction");
						   }
		        		   var obj=$.extend(true,{},$.extend({
   						       elementId:opts.popupSource
   						   },cfg));
		        		   $.aries.page.data._paramArray.push(obj);
	  		        	   $.aries.page.data._setHidedData("ae_popup_Id",$.aries.page.data._paramArray);
		        		   $("#"+opts.popupSource).attr("elementId",self.element.attr("aeId"));
				           $("#"+opts.popupSource).aeDialog(obj);
		        	  }
		          }
			 }).closest('div.input-group').find('span.input-group-btn').off('click.aeTextpopup').click(function() {
				 self.element.trigger('click');
		     });
		 },
		 _refeshEmptyText:function(emptyText){
        	 var el = this.element;
             if(!emptyText)
                 return;
        	 if (el.prop('placeholder') === '') {
        		 el.prop('placeholder',emptyText);
             } else {
                 if(el.prop('placeholder') === emptyText){
                	 el.prop('placeholder','');
                 }
             }
        }
	 });
     $.extend($.ae.aeTextpopup, {
		   closePopup:function(json,textField,valueField){
			   var afterAction,
			   		object,
					prevValue,
					oldValueField;
			   var paramArray = $.aries.page.data._getHidedData("ae_popup_Id");
			   if(!$.isArray(paramArray) || paramArray.length<0)return;
			   var obj = paramArray[paramArray.length-1];
	           var divId = obj.elementId;
			   if(divId.indexOf('ae_popup_div_')>-1){
				   $("#"+divId).aeDialog('close');
				   var id = divId.substring(('ae_popup_div_').length);
				   object = $('input[aeId='+id+']');
				   afterAction = object.attr("afterAction");
			   }else{
				   $("#"+divId).aeDialog('close');
				   var elementId = $("#"+divId).attr("elementId");
				   if(elementId){
					   object= $('input[aeId='+elementId+']');
					   afterAction = object.attr("afterAction");
				   }
			   }
			   if(object){
				   oldValueField=object.attr("valueField");
			   }
			   if(json){
					if(afterAction){
						var i = afterAction.indexOf("(");
						var actName = i>0 ? afterAction.substring(0, i) : afterAction;
						var func = "return window."+actName+"?"+actName+".call(window,j):false;";
						new Function("j",func)(json);
					}else{
						if(textField && object){
							prevValue=object.val();
							object.val(json[textField]);
						}
						if(valueField && object){
							object.attr("valueField",json[valueField]);
						}else if(prevValue!==object.val()){
							object.removeAttr("valueField");
						}
					}
					if(object && object.next().is('.icon-error2')){
					   if(object.val() !== '' && typeof (object.val()) != 'undefined'){
						   object.next().show();
					   }
					}
				}
				if(object && object.attr("valueField")!==oldValueField){
 				   $("#"+object.attr("aeId")).data("ae-aeTextpopup")._trigger("onValueChange");
 			   	}
		  },
		  getParam:function(){
			  return $.aries.page.data._getHidedData("ae_popup_param") || '';
		  }
     });
     $.closeTextPopup = $.ae.aeTextpopup.closePopup;
     $.getTextPopupParam = $.ae.aeTextpopup.getParam;
});

/**
 * 下拉框模块
 * @module ui-flip
 */
define('ui-flip',function(require, exports, modules) {
	"require:nomunge,exports:nomunge,modules:nomunge";
	var FLIP_TIME=100,
		DELAY_TIME=1000,
		IN_THE_RANGE=0,
		LESS_THAN_MIN=-1,
		MORE_THAN_MAX=-2;

	function setCursorPosition(el,pos){
		var range;

		if(el.selectionStart!==undefined){ //ie
			el.selectionStart=pos;
		}else{
			range=el.createTextRange();
			range.move("character",pos);
			range.select();
		}
	}
	function getClipboardData(clipboardEvent){
		var data;
		if(window.clipboardData!==undefined){
			data=window.clipboardData.getData("Text");
		}else{
			data=clipboardEvent.originalEvent.clipboardData.getData("text/plain");
		}
		return data;
	}
	/**
     * 数值输入框
     * @namespace ae.aeFlip
     */
	$.aeWidget('ae.aeFlip', {
		/**
         * 可选项
         * @name ae.aeFlip#options
         * @property {object} options                      - 可选项
		 * @property {boolean} options.enable              - 是否启用组件，如果为true则启用组件，否则禁用组件。
         * @property {boolean} options.editable            - 是否可以输入，默认为false即不可编辑，为true则可以编辑
         * @property {boolean} options.visible             - 组件是否可见，默认为true即可见，为false则不可见
         * @property {number} options.value                - 组件默认值。默认为0
         * @property {number} options.degree               - 数值递增步长。默认为1
		 * @property {string} options.initType             - 初始化方式，如果为“html”则通过html来设置参数，如果为“js”则通过javascript中设置的option来初始化。
		 * @property {function|null} options.onValueChange - 值改变事件回调函数
         * @property {function|null} options.onSelfFocus   - 组件文本框获得焦点事件回调函数
         * @property {function|null} options.onSelfBlur    - 组件文本框失去焦点事件回调函数
         */
		 options:{
			 enable : true,
             editable : true,
             visible :true,
			 value:0,
			 degree:1,
             initType : 'html',
			 onValueChange:null,
			 onSelfFocus:null,
			 onSelfBlur:null
		 },
		 _fireChangeEvent:function(){
			 var hdValueChange= this.options.onValueChange;
			 if(typeof(hdValueChange)==="function"){
				 hdValueChange.apply(this,[this.element]);
			 }
		 },
		 _hdTimer:null,
		 _fireChangeEventDelay:function() {
	         if(this._hdTimer !== null) {
	             clearTimeout(this._hdTimer);
	             this._hdTimer = null;
	         }
	         this._hdTimer = setTimeout($.proxy(this._fireChangeEvent,this), 500);
	     },
	    /**
	     * 设置组件是否可以编辑
	     * @name ae.aeFlip#editable
	     * @function
	     * @param {boolean} value 是否可编辑，为true则可以编辑，否则不能编辑
	     * @example
	     * $('#myFlip').aeFlip('editable',false);
	    */
	    editable : function(value){
	    	if(value === undefined || value === ''){
	    		value=true;
	    	}
	    	var $ele = this.element;
	    	if(value === true || value === 'true'){
	    		  $ele.removeAttr('readonly');
	    		  this.options.editable = true;
	    	}
	    	if(value === false || value === 'false'){
	    		  $ele.attr('readonly', 'readOnly');
	    		  this.options.editable = false;
	    	}
	    },
	    /**
	     * 设置组件是否可见
	     * @name ae.aeFlip#visible
	     * @function
	     * @param {boolean} value 是否可见，如果为true则可见，否则隐藏
	     * @example
	     * $('#myFlip').aeFlip('visible',false);
	    */
	    visible : function(value){
	    	if(value === undefined || value === ''){
	    		value = true;
	    	}
	    	var $ele = this.element;
	    	if(value === true || value === 'true'){
	    		$ele.closest('div.input-group').removeClass('hidden');
	    		this.options.visible = true;
	    	}
	    	if(value === false || value === 'false'){
	    		$ele.closest('div.input-group').addClass('hidden');
	    		this.options.visible = false;
	    	}
	     },
        /**
	     * 设置组件是否可用
	     * @name ae.aeFlip#enable
	     * @function
	     * @param {boolean} value 是否可用，为true则组件可用，否则组件不可用
	     * @example
	     * $('#myFlip').aeFlip('enable',false);
	    */
	    enable : function(value){
		   	 var self = this;
	    	 if(value === undefined){
		    		value = true;
	    	 }
	    	 var $ele = this.element;
	    	 if(value === true || value === 'true'){
	    		 this.options.enable = true;
	    		 $ele.prop('disabled',false);
		         $ele.closest('div.input-group').find('.btn-default').prop('disabled',false);
	    	 }
	    	 if(value === false || value === 'false'){
	    		 this.options.enable = false;
	    		 $ele.prop('disabled',true);
	    		 $ele.closest('div.input-group').find('.btn-default').prop('disabled', true);
	    	 }
	     },
        /**
         * 获取组件字符串数值。
         * @name ae.aeFlip#getValue
         * @function
         * @return {string} 返回组件的当前数值，它是一个字符串。
         * @example
         * var value = $('#myFlip').aeFlip('getValue');
	     */
		 getValue:function(){
	    	 return this.element.val() || '';
		 },
		/**
         * 获取数值组件的值。
         * @name ae.aeFlip#setValue
         * @function
         * @param {number} value 数值
         * @example
         * $('#myFlip').aeFlip('setValue',97);
	     */
		 setValue:function(value){
			 if(!value){
	    		 this.element.val(this.options.value);
	    	 }else{
				 if($.isNumeric(value)){
					 this.element.val(value);
					 this._fireChangeEvent();
				 }
	    	 }
		 },
		 /**
		  * 复位组件，复位后组件的当前值将变为默认值
		  * @name ae.aeFlip#reset
		  * @function
		  * @example
		  * $('#myFlip').reset();
		  */
		 reset:function(){
			 this.element.val(this.options.value);
			 this._fireChangeEvent();
		 },
		 _create:function(){
			 var $self = this.element,
			 	opts = this.options,
				obj,
			 	id = $self.attr('id');

			 if(opts.initType=='html'){
				 this._buildOptions(opts,$self);
			 }
			 if(id){
				 $self.attr('aeId', id);
			 }
			 obj = $("<input></input>");
             obj.attr({"aeType":$self.attr("aeType"),"aeId":$self.attr("id"),"aeInit":"false", "aeValidate":$self.attr("aeValidate"),"rules":$self.attr("rules")});
             this.element=obj;
             $self.after(obj);
             $self.empty().hide();
             this.element.addClass('form-control').wrap('<div class="input-group"></div>');
             this.element.after('<div class="input-group-btn-vertical"><button type="button" class="btn btn-default" data-flip="up"><i class="fa fa-caret-up"></i></button><button type="button" class="btn btn-default" data-flip="down"><i class="fa fa-caret-down"></i></button></div>');
			 this._addEvents();
		 },
		 _addEvents:function(){
			 this.element.on("focus",$.proxy(function(){
				 var opts=this.options;
				 if(typeof(opts.onSelfFocus)==="function"){
					 opts.onSelfFocus.apply(this,[this.element]);
				 }
			 },this));
			 this.element.on("blur",$.proxy(function(){
				 var opts=this.options;
				 if(typeof(opts.onSelfBlur)==="function"){
					 opts.onSelfBlur.apply(this,[this.element]);
				 }
			 },this));
		 },
		 _init:function(){
			var self  = this,el = self.element,options=self.options;
			if(options.width){
				el.closest('div.input-group').css("width",options.width);
			}
			if(!options.visible){
				el.closest('div.input-group').addClass('hidden');
			}
			if(!options.editable){
				el.attr('readonly', 'readOnly');
			}else{
				el.removeAttr('readonly');
			}
			$(document).on("mouseup.ae.aeFlip",function(event){
				self._resetTimer();
			});
			self.enable(!!options.enable);
			self._buildInitEvent();
			options.previousValue = self._getInitValue();
			el.val(this.options.previousValue);
		 },
		 _buildOptions:function(options,inputEl){
			  options.visible = inputEl.attr("visible")=='false' ? false : options.visible;
		      options.enable = inputEl.attr("enable")=='false' ? false : options.enable;
		      options.editable = inputEl.attr("editable") == 'false' ? false : options.editable;
	    	  options.value = inputEl.attr("value") || options.value;
	    	  options.degree = inputEl.attr("degree") || options.degree;
	    	  options.minData = inputEl.attr("minData") || options.minData || null;
	    	  options.maxData = inputEl.attr("maxData") || options.maxData || null;
	    	  options.width = inputEl.attr("width");
			  options.onValueChange=inputEl.attr("onValueChange") || options.onValueChange || null;
			  options.onSelfFocus=inputEl.attr("onSelfFocus") || options.onSelfFocus || null;
			  options.onSelfBlur=inputEl.attr("onSelfBlur") || options.onSelfBlur || null;
		 },
		_hdProcValue:function(event){
			var $el = this.element,
				previousValue=this.options.previousValue,
				curVal,
				which=event.which,
				hitmap,
				check;

			if(which===38){ //up
				$el.closest('div.input-group').find("[data-flip='up']").trigger("click");
			}else if(which===40){ //down
				$el.closest('div.input-group').find("[data-flip='down']").trigger("click");
			}else{
				hitmap={8:1,17:1,18:1,19:1,32:1,37:1,39:1,46:1,127:1};
				curVal=$el.val();

				//此处简单处理，如果步长数为浮点数则允许输入小数点
				if((this.options.degree+"").indexOf(".")>=0){
					hitmap[190]=1;
				}

				check=((which>=48 && which<=57) || (which in hitmap));
				if(check===true){
					if(curVal==="0" && which!=48){
						$el.val("");
					}else if(curVal==="0" && which===48){
						event.stopPropagation();
						return false;
					}
				}else{
					event.stopPropagation();
					return false;
				}
				this._fireChangeEventDelay();
			}
		},
		 _buildInitEvent:function(){
			var $el = this.element;

			$el.on("keydown",$.proxy(this._hdProcValue,this));
			$el.on("keyup",$.proxy(function(event){
				var $this=this.element,
					curVal=$this.val(),
					which=event.which,
					inRange;

				inRange=this._checkNumbericRange(curVal);
				if(inRange===LESS_THAN_MIN){
					curVal=this.options.minData;
					$this.val(curVal);
				}else if(inRange===MORE_THAN_MAX){
					curVal=this.options.maxData;
					$this.val(curVal);
				}
				setCursorPosition($this[0],curVal.length);
			},this));
			$el.on("blur",$.proxy(function(event){
				var $this=this.element,
					v=$this.val(),
					inRange;

				if(v!=="0"){
					v=v.replace(/^[0]*/g,"");
				}
				if(v===""){
					$this.val(this.options.minData || this.options.previousValue);
				}else{
					inRange=this._checkNumbericRange(v);
					if(inRange===LESS_THAN_MIN){
						v=this.options.minData;
						$this.val(v);
					}else if(inRange===MORE_THAN_MAX){
						v=this.options.maxData;
						$this.val(v);
					}

					$this.val(v);
				}
			},this));
			$el.on("paste",$.proxy(function(event){
				var $this=this.element,
					ss=getClipboardData(event),
					v,
					inRange;

				if($.isNumeric(ss)===false){
					event.stopPropagation();
					return false;
				}else{
					inRange=this._checkNumbericRange(ss);
					if(inRange===LESS_THAN_MIN){
						v=this.options.minData;
						$this.val(v);
						event.stopPropagation();
						return false;
					}else if(inRange===MORE_THAN_MAX){
						v=this.options.maxData;
						$this.val(v);
						event.stopPropagation();
						return false;
					}
				}
			},this));
			 $el.closest('div.input-group').on('click', "[data-flip='up'],[data-flip='down']", $.proxy(this._flip, this)).on('mousedown', "[data-flip='up']", $.proxy(this._continuedIncrease, this)).on('mousedown', "[data-flip='down']", $.proxy(this._continuedDecrease, this)).on("mouseup","[data-flip='down'],[data-flip='up']", $.proxy(this._resetTimer, this));
		 },
		 _hdFlipTimer:null,
		 _hdDelayTimer:null,
		 _resetTimer:function(){
			 if(this._hdDelayTimer!==null){
				 clearTimeout(this._hdDelayTimer);
			 }
			 if(this._hdFlipTimer!==null){
				 clearInterval(this._hdFlipTimer);
			 }
		 },
		 _continuedIncrease:function(){
			 var hdFlipTimer,
			 	hdDelayTimer;
			 this._resetTimer();
			 this._hdDelayTimer=setTimeout($.proxy(function(){
				 this._hdFlipTimer=setInterval($.proxy(this._increase,this),FLIP_TIME);
			 },this),DELAY_TIME);
		 },
		 _continuedDecrease:function(){
			 var hdFlipTimer,
			 	hdDelayTimer;
			 this._resetTimer();
			 this._hdDelayTimer=setTimeout($.proxy(function(){
				 this._hdFlipTimer=setInterval($.proxy(this._decrease,this),FLIP_TIME);
			 },this),DELAY_TIME);
		 },
		 _flip:function(e){
			  var dir = $(e.currentTarget).data('flip');
			  if(dir === 'up'){
				  this._increase();
			  }
			  if(dir === 'down'){
				  this._decrease();
			  }
		 },
		 _verifyNumeric:function(checkVal){
			    var self = this, el = this.element, opts = this.options,
			        previousValue=opts.previousValue,
					previousIsNumberic;

				var isNumeric = self._checkNumeric(checkVal);
				if(isNumeric){
					isNumeric = self._checkNumbericRange(checkVal);
					if(isNumeric!==IN_THE_RANGE){
						$.message.alert("","The value is beyond the range of data set!");
						previousIsNumberic = self._checkNumeric(previousValue);
						el.val(previousIsNumberic?previousValue:self._getInitValue());
						return;
					}
				}else{
					$.message.alert("","The value is not a number!");
					previousIsNumberic = self._checkNumeric(previousValue);
					el.val(previousIsNumberic?previousValue:self._getInitValue());
					return;
				}
				opts.previousValue = checkVal;
		 },
		 _valueChanged:function(){
			    var self = this, el = this.element, opts = this.options,
			        previousValue=opts.previousValue,
				    checkVal = el.val();
				if(checkVal == previousValue)return;
				if(checkVal){
					if(checkVal.lastIndexOf(".")==checkVal.length-1){
						checkVal = checkVal.substring(0,checkVal.length-1);
					}
					self._verifyNumeric(checkVal);
				}
		 },
		 _increase:function(){
			    var self = this,
			        el = this.element,
			        opts = this.options,
			        degree = opts.degree,
			        previousValue = opts.previousValue,
			        objValue = el.val(),
					isNumeric = self._checkNumeric(objValue);
				if(!isNumeric){
					previousIsNumberic = self._checkNumeric(previousValue);
					el.val(previousIsNumberic?previousValue:self._getInitValue());
					this._fireChangeEvent();
					return;
				}
				var objIndex = objValue.indexOf(".");
				var degreeIndex = (degree+"").indexOf(".");

				var objLength = objValue.length;
				var degreeLength = (degree+"").length;
				var isFloat = objIndex>-1||degreeIndex>-1;
				objValue  = isFloat ? (parseFloat(objValue,10)+parseFloat(degree,10)) : (parseInt(objValue,10)+parseInt(degree,10));

				var decreaseVerify = self._checkNumbericRange(objValue);
				if(decreaseVerify!==IN_THE_RANGE){
					objValue = isFloat ? (parseFloat(objValue,10) - parseFloat(degree,10)) : (parseInt(objValue,10) - parseInt(degree,10));
				}
				if(isFloat){
					if(objIndex==-1){
						objIndex = objLength;
					}
					if(degreeIndex==-1){
						degreeIndex = degreeLength;
					}
					var objFix = objLength-objIndex;
					var degreeFix = degreeLength - degreeIndex;
					if(degreeFix<objFix){
						degreeFix = objFix;
					}
					var degreeFormat = "0.";
					degreeFix = degreeFix-1;
					for(var i=0;i<degreeFix;i++){
						degreeFormat+="0";
					}
					objValue = $.format.number(objValue,degreeFormat);
				}
				opts.previousValue=objValue;
				el.val(objValue);
				this._fireChangeEvent();
	    },
	    _decrease:function(){
	    	var self = this,
	    	    el = this.element,
		        opts = this.options,
		        degree = opts.degree,
		        previousValue = opts.previousValue,
		        objValue = el.val(),
				previousIsNumberic;

	    	 var isNumeric = self._checkNumeric(objValue);
			 if(!isNumeric){
				previousIsNumberic = self._checkNumeric(previousValue);
				el.val(previousIsNumberic?previousValue:self._getInitValue());
				this._fireChangeEvent();
				return;
			}
			var objIndex = objValue.indexOf(".");
			var degreeIndex = (degree+"").indexOf(".");

			var objLength = objValue.length;
			var degreeLength = (degree+"").length;
			var isFloat = objIndex>-1||degreeIndex>-1;
			if(isFloat){
				objValue=(parseFloat(objValue,10)-parseFloat(degree,10));
			}else{
				objValue=(parseInt(objValue,10)-parseInt(degree,10));
			}
			var decreaseVerify = self._checkNumbericRange(objValue);
			if(decreaseVerify!==IN_THE_RANGE){
				objValue = isFloat ? (parseFloat(objValue,10) + parseFloat(degree,10)) :(parseInt(objValue,10) + parseInt(degree,10));
			}
			if(isFloat){
				if(objIndex==-1){
					objIndex = objLength;
				}
				if(degreeIndex==-1){
					degreeIndex = degreeLength;
				}
				var objFix = objLength-objIndex;
				var degreeFix = degreeLength - degreeIndex;
				if(degreeFix<objFix){
					degreeFix = objFix;
				}
				var degreeFormat = "0.";
				degreeFix = degreeFix-1;
				for(var i=0;i<degreeFix;i++){
					degreeFormat+="0";
				}
				objValue = $.format.number(objValue,degreeFormat);
			}
			opts.previousValue=objValue;
			el.val(objValue);
			this._fireChangeEvent();
		},
		_getInitValue:function(){
			var self = this,
			    verifyValue = this.options.value;
			var isNumeric = self._checkNumeric(verifyValue);
			if(isNumeric){
				isNumeric = self._checkNumbericRange(verifyValue);
				if(isNumeric!==IN_THE_RANGE){
					this.options.previousValue=verifyValue=this.options.minData || "0";
				}
			}else{
				verifyValue="";
			}
			return verifyValue;
		},
		_checkNumeric:function(val ,format) {
			if (""!==val && !/^(-|\+)?\d+(\.\d+)?$/.test(val)) {
				return false;
			}
			if(""!==val && format && $.isString(format) && format.indexOf(".") != -1 && val) {
				var fval = parseFloat(val);
				if (fval < 0) {
					fval = -fval;
				}
				fval = fval.toString();
				if (fval.indexOf(".") != -1 && (format.length - format.indexOf(".") < fval.length - fval.indexOf("."))) {
					return false;
				}
			}
			return true;
		},
		_checkNumbericRange:function(val) {
			var min=this.options.minData,
				max=this.options.maxData,
				num;

			if($.isNumeric(val)){
				num=parseFloat(val);
				if($.isNumeric(min) && (num < parseFloat(min))){
					return LESS_THAN_MIN;
				}else if($.isNumeric(max) && (num > parseFloat(max))){
					return MORE_THAN_MAX;
				}
			}
			return IN_THE_RANGE;
		},
		_destroy:function(){
			$(document).off("mouseup.ae.aeFlip");
		}
	 });
});

define('ui-advcombo',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";

	/*
	 * $Id: ui-advcombo.js$
	 * Depends : ui-core.js, ui-widget.js, Handlebars.js
	 * version : 3.1
	 * The last modification time :  2015-6-19 16:54
	 * log :	bootstrap 组件初步封装完成； 2015-6-8 9:51
	 * 			内部代码重构，下拉层代码漂在document.body； 2015-6-9 16:33
	 * 			修复火狐初始化失败bug； 2015-6-10 19:51
	 * 			设置下拉框最大高度300px; 2015-6-11 09:56
	 * 			新增方法getBody, 获取下拉层对象; 2015-6-11 16:56
	 * 			新增属性 minHeight, 设置输入框最小高度, 用户空值时候的高度设置; 2015-6-15 16:22
	 * 			_trigger 事件bug修复； 2015-6-19 14:05
	 * 			新增方法 refresh, 用于刷新下拉层高度； 2015-6-19 16:54
	 * 			修改滚动条构建逻辑，放在下拉层显示后构建，解决首次加载滚动条位置闪现问题；2015-9-29 10:50
	 * 			设置默认值为空；2015-9-30 10:15
	 * 			更新自定义输入框代码结构；去除minHeight,新增inputHeight属性；修复模板预编译bug；2015-10-29 10:47
	 * 			增加属性 bodyScroll，并完善滚动条构建逻辑；2016-4-13 10:49
	 *
	 */
	/**
	 * @name aeAdvcombo
	 *
	 * @class 高级定制下拉框
	 * @使用方式
	 * @页面上的html标记如下
	 * <pre>
	 * 		<div id="demo-advcombo" aeType="aeAdvcombo" aeInit="true">
	 * 			<ul>
	 * 				//下拉层内容
	 * 			</ul>
	 * 		</div>
	 * </pre>
	 *
	 * @数据结构如下
	 *
	 * @最终展示页面代码如下
	 *
	 * @example
	 * $('#demo-advcombo').aeAdvcombo('reload',data);
	 */
	$.aeWidget('ae.aeAdvcombo', {
		options : /** @lends aeAdvcombo#*/ {
			/**
			 * 防止重复初始化
			 * @type Boolean
			 * @default false
			 */
			_initial : false,
			/**
			 * 多选
			 * @type Boolean
			 * @default false
			 * @example
			 *  multi="true"
			 */
			multi : false,
			/**
			 * 组件宽度
			 * @type Number
			 * @default auto
			 * @example
			 *  width = "300"
			 */
			width : 'auto',
			/**
			 * 组件下拉层高度
			 * @type Number
			 * @default auto
			 * @example
			 *  height = "300"
			 */
			height : 'auto',
			/**
			 * 组件输入框高度
			 * 仅在 renderer 复杂下拉框时生效
			 * 定义在button上的属性
			 * @type Number
			 * @default 60
			 * @example
			 *  height = "58"
			 */
			inputHeight : 60,
			/**
			 * 组件下拉层最大高度
			 * @type Number
			 * @default 300
			 * @example
			 *
			 */
			_maxHeight : 300,
			/**
			 * 输入框中的内容布局格式
			 * @type Function
			 * @default auto
			 * @example
			 * <pre>
			 * <div id="demo-advcombo" aeType="aeAdvcombo" aeInit="true" renderer="myTools()"></div>
			 * function myTools(){
			 * 		return str = '<a><dl><dt><img src="assets72/img/ico_user.png">12345678901</dt><dd>FRI + 2GB | GSM</dd></dl></a>';
			 * }
			 * </pre>
			 *  renderer : function(){},
			 */
			/**
			 * 输入框默认值
			 * @type Object
			 * @default 无
			 * @example
			 *  initData="{'img':'assets72/img/ico_user.png','phoneNumber':'12345678901','specifications':'FRI + 2GB | GSM'}"
			 */
			initData : undefined,
			optionField: 'text',
      		valueField: 'value',
			/**
			 * 记录输入框的值
			 * @type Array,Object,String
			 * @default 无
			 * @example
			 *
			 */
			_dataMap : "",
			/**
			 * 下拉层是否自动出现滚动条,默认自动出现
			 * @type Boolean
			 * @default true
			 * @example
			 *
			 */
			bodyScroll : true,
			_niceScroll : false,
			onValueChange : null,
			showClear : false,
			enable : true,
			/**
			 * 设置输入框值时触发的事件，例如进行真实值和显示值的映射转换
			 * @type Function
			 * @default 无
			 * @example
			 *
			 */
			onSetValue : function(){},
			/**
			 * 初始化结束回调事件，返回下拉层DOM元素整体，用户自定义绑定事件
			 * @event
			 * @param body 下拉层DOM元素整体
			 * @param event jQuery.Event对象
			 * @default emptyFn
			 * @example
			 * <div id="demo-advcombo" aeType="aeAdvcombo" aeInit="true" onBodyInit="select()"></div>
			 * function select(item,event){
             * 		console.log(item);
             * 		//console.log($(event.target).parent().attr("mid"));
             * 		console.log($(event.currentTarget).attr("mid"));
             * }
			 */
			onBodyInit : function($body, event){},
			/**
			 * 初始化方式，默认通过html来设置参数。传值为js时，则通过js中设置的option来初始化。
			 * @type String
			 * @default 'html'
			 * @example
			 * $('#demo-advcombo').aeAdvcombo({initType : 'js'});
			 */
			initType : 'html'
		},
		_create : function(){
			var _self = this,
				options = this.options,
				$ele = this.element;

			if(options._initial === true){
				return;
			}
			if(options.initType === 'html'){
				_self._buildOptions(options,$ele);
			}
			/*
			 * 构建结构
			 * $body：当$body无内容时，构建空的$body；当$body不是单个元素时，外部包裹一层div，（这样会修改其dom结构，建议用单个元素统一包裹body内容）；
			 * $header：当多选时，或者输入框内为复杂内容时，构建<button>输入框；否则构建<input>输入框；
			 * 复杂多选下拉框不支持键盘输入值，仅通过选择下拉框内容选定值；
			 */
			$ele.css("width",options.width).addClass("dropdown group_dropdown");
			this._id = $ele.attr("id");
			this.element.attr("aeId",this._id);
			if($ele.children().length > 1){
				$ele.children().wrap('<div data-adc-body-id="'+this._id+'"></div>');
			}else if($ele.children.length === 0){
				var str = $.trim($ele.html());
				if(str){
					$ele.empty().prepend('<div data-adc-body-id="'+this._id+'">'+str+'</div>');
				}else{
					$ele.empty().prepend('<div data-adc-body-id="'+this._id+'"></div>');
				}
			}else{
				$ele.children().attr("data-adc-body-id",this._id);
			}
			if(!$('[data-adc-body-id="'+this._id+'"]').parent().is("body")){
				$ele.children('[data-adc-body-id="'+this._id+'"]').appendTo(document.body);
			}
			$ele.empty();

			var placeholder = "";
			if($ele.attr("placeholder")){
				placeholder = $ele.attr("placeholder");
			}
			if(options.renderer){
				//$ele.prepend('<button type="button" class="btn dropdown-toggle" style="min-height:'+options.minHeight+'px;"><span class="caret"></span></button>');
				$ele.prepend('<div class="input-icon right"><div style="width: 100%;position:absolute;background-color:#e8e8e8;z-index:100;opacity:.6;display:none;" data-role="adv-masker-'+ this._id +'"></div><div class="form-control fx-input" style="height:'+options.inputHeight+'px;"></div><i class="icon-error2" style="display:none"></i><i class="icon-arrowlup-down" style="line-height:'+options.inputHeight+'px;"></i></div>');
			}else{
				if(options.multi){
					$ele.prepend('<div class="input-icon right"><div style="width: 100%;position:absolute;background-color:#e8e8e8;z-index:100;opacity:.6;display:none;" data-role="adv-masker-'+ this._id +'"></div><i class="icon-arrowlup-down"></i><div class="form-control"><input value="Select please"></div></div>');
				}else{
					$ele.prepend('<div class="input-icon right"><div style="width: 100%;position:absolute;background-color:#e8e8e8;z-index:100;opacity:.6;display:none;" data-role="adv-masker-'+ this._id  +'"></div><i class="icon-error2" style="display:none"></i><i class="icon-arrowlup-down"></i><input class="form-control form-readonly" readonly placeholder="Select please" aeValidate="'+$ele.attr("aeValidate")+'"rules="'+$ele.attr("rules")+'"aeid="'+$ele.attr("aeid")+'"></div>');
				}
			}

			var body = $('[data-adc-body-id="'+this._id+'"]'),
				$masker = $('div[data-role=adv-masker-'+ this._id +']'),
				inputHeight = $masker.parent().find('input').outerHeight();

			$masker.css('height',inputHeight + 'px');

			body.addClass("dropdown-menu");
			//对body内容做初始化
			_self._trigger("onBodyInit", null, body);
			//当内容高度超出设置高度时，出现滚动条
			_self._heightRenderer();

			options._initial = true;
		},
		_heightRenderer : function(){
			var options = this.options, $body = $('[data-adc-body-id="'+this._id+'"]');
			var bodyOuterH = $body.outerHeight(true);
			options._height = options.height === 'auto' ? bodyOuterH : options.height;
			options._height = Math.min(options._height, options._maxHeight);

			if(bodyOuterH > options._height){
				$body.css({"height":options._height});//,"width":options.width
				options.bodyScroll ? options._niceScroll = true : null;
			}
		},
		_buildOptions : function(options,element){
			options.bodyScroll = element.attr("bodyScroll") == "false" ? false : options.bodyScroll;
			options.multi = element.attr("multi") == "true" ? true : options.multi;
			if(options.multi){
				options._dataMap = [];
			}
			options.onValueChange = element.attr("onValueChange") || options.onValueChange; 
			options.optionField = element.attr("optionField") || options.optionField;
			options.valueField = element.attr("valueField") || options.valueField;
			options.width = parseInt(element.attr("width"),10) || options.width;
			options.height = parseInt(element.attr("height"),10) || options.height;
			options.inputHeight = parseInt(element.attr("inputHeight"),10) || options.inputHeight;
			options.showClear = element.attr("showclear") || options.showClear;
			if(options.onValueChange && typeof(options.onValueChange)==="string"){
          i = options.onValueChange.indexOf("(");
          funName=(i>0)?options.onValueChange.substring(0, i):options.onValueChange;
          options.onValueChange=(typeof(window[funName])==="function")?window[funName]:"";
      }
      
      
			var initData = $.trim(element.attr("initData"));
			if(initData && initData.indexOf("{") === 0){
				options.initData = {};
				var result = initData.substring(1,initData.length-1).split(",");
				for(var i=0;i<result.length;i++){
					result[i] = $.trim(result[i]);
					var data = result[i].split(":");
					options.initData[data[0]] = data[1];
				}
			}else{
				options.initData = initData || undefined;
			}

			var onBodyInit = element.attr("onBodyInit");
			options.onBodyInit = onBodyInit ? function(body,event){
				if($.isString(onBodyInit)){
					var i = onBodyInit.indexOf("(");
					var actName = i>0 ? onBodyInit.substring(0, i) : onBodyInit;
					var func = 	"return window."+actName+"?"+actName+".call(window, b ,e):false;";
					return new Function("b","e",func)(body,event);
				}
			} : undefined;

			var renderer = element.attr("renderer");
			options.renderer = renderer ? function(){
				if($.isString(renderer)){
					var i = renderer.indexOf("(");
					var actName = i>0 ? renderer.substring(0, i) : renderer;
					var func = 	"return window."+actName+"?"+actName+".call(window):false;";
					return new Function(func)();
				}
			} : undefined;
			//模版预编译
			options.renderer ? options._template = Handlebars.compile(options.renderer()) : null;

			var onSetValue = element.attr("onSetValue");
			options.onSetValue = onSetValue ? function(data){
				if($.isString(onSetValue)){
					var i = onSetValue.indexOf("(");
					var actName = i>0 ? onSetValue.substring(0, i) : onSetValue;
					var func = 	"return window."+actName+"?"+actName+".call(window, d):false;";
					return new Function("d", func)(data);
				}
			} : undefined;

		},
		_init : function(){
			var _self = this, options = this.options, $ele = this.element;
			var $header = $ele.children(":eq(0)"), $body = $('[data-adc-body-id="'+this._id+'"]');

			$header.bind("click.header",function(e){
				if($body.is(":hidden")){
					$body.css({
						'overflow': 'hidden',
						'position':'absolute',
						'left': $header.offset().left,
						'top': $header.offset().top + $header.outerHeight(),
						'width':$header.outerWidth()
					});
					$body.show();
					//解决滚动条首次加载位置偏离的问题
					if(options._niceScroll && !$body.hasClass("scorll-bar-box")){
						$body.addClass("scorll-bar-box");
						$body.niceScroll();
					}
				}else{
					$body.hide();
				}
				$header.children(':eq(1)').on("blur",function(e){
					
					$body.hide();
				});
			}).bind("blur",function(e){
				$body.hide()
			});

			options.initData ? _self.setValue(options.initData) : null;

			/*if(options.renderer){
			 //模版预编译
			 options._template = Handlebars.compile(options.renderer());
			 if(options.initData){
			 _self.setValue(options.initData);
			 }else{
			 $header.prepend('<span>Select please</span>');
			 }
			 }else{
			 if(options.initData){
			 _self.setValue(options.initData);
			 }
			 }*/
		},

		/**
		 * @设置输入框值
		 * @name aeAdvcombo#setValue
		 * @function
		 * @param data 数据框显示值
		 * @example
		 * $('#demo-advcombo').aeAdvcombo('setValue',data);
		 * arguments
		 */
		setValue : function(data){
			var _self = this, options = this.options, $ele = this.element, $header = $ele.children(":eq(0)");
			var _data = data;
			if(options.onSetValue){
				data = options.onSetValue(data);
			}
			if(options.renderer){
				//var $span = $header.children('span.caret');
				var $input = $header.children('.fx-input:first');
				if(!options.multi){
					//$span.siblings().remove();
					//$header.prepend($.trim(options._template(data)));
					$input.empty().html($.trim(options._template(data)));
					options._dataMap = _data;
				}else{
					//$span.before($.trim(options._template(data)));
					$input.html($.trim(options._template(data)));
					options._dataMap.push(_data);
				}
			}else{
				var $input = $header.find('input');
				if(!options.multi){
					$input.val(data);
					options._dataMap = _data;
				}else{
					$input.val("");
					if($.inArray(_data, options._dataMap) === -1){
						$input.before('<span class="label label-info label-as-badge">'+data+'<i class="icon-error2"></i></span>');
						_self._bindCloseEvent($input.prev());
						options._dataMap.push(_data);
					}else{
						$header.find('>div.form-control').children('span').each(function(index,item){
							if($(item).text() == data){
								$(item).remove();
							}
						});
						options._dataMap.splice($.inArray(_data, options._dataMap),1);
					}
				}
			}
		},
		/**
		 * @获取输入框值
		 * @name aeAdvcombo#getValue
		 * @function
		 * @param
		 * @example
		 * $('#demo-advcombo').aeAdvcombo('getValue',data);
		 * arguments
		 */
		getValue : function(){
			return this.options._dataMap;
		},
		/**
		 * @获取下拉层对象
		 * @name aeAdvcombo#getBody
		 * @function
		 * @param
		 * @example
		 * 	var $body = $('#demo-advcombo').aeAdvcombo('getBody');
		 *
		 */
		getBody : function(){
			return $('[data-adc-body-id="'+this._id+'"]');
		},
		_bindCloseEvent : function(span){
			span.find('i.icon-error2').bind("click.close",function(){
				span.remove();
			});
		},
		/**
		 * @刷新下拉框高度，当内容超出时出现滚动条
		 * @name aeAdvcombo#refresh
		 * @function
		 * @param
		 * @example
		 * 	$('#demo-advcombo').aeAdvcombo('refresh');
		 *
		 */
		refresh : function(){
			$('[data-adc-body-id="'+this._id+'"]').height('auto');
			this._heightRenderer();
		},
		_destroy:function(){
			$('[data-adc-body-id="'+this._id+'"]').remove();
		},
		enable : function(){
			$('div[data-role=adv-masker-'+ this._id +']').hide();
		},
		disable : function(){
			$('div[data-role=adv-masker-'+ this._id +']').show().off('click')
				.on('click',function(e){
				var evt = e || window.event;
				evt.stopPropagation();
			});
		},
		/**
         * 加载advCombo数据。
         * @name ae.aeAdvcombo#reload
         * @function
         * @param  {object} data 数据对象
         * @example
         * $('#mycombo').aeAdvcombo("reload",data);
         */
    reload : function (data) {
        var self = this , $ele = self.element;
        self.options.value = '';
        $ele.val('');
        self._loadData(data);
    },
    /**
     * 加载下拉框数据
     * @name ae.aeAdvcombo#_loadData
     * @function
     * @param {object} data 数据对象
     */
    _loadData : function(records){
    	var options = this.options, valueEl = this.element;
    	var dropList = this.getBody();
      var optionField = options.optionField;
      var innerHtml = '';
      var self = this;
    	//构建valueField
    	var valueField = options.valueField;
      var allValues = [];
      if (typeof valueField === 'string') {
          $(records).each(function () {
              allValues.push('' + this[valueField]);
          });
      } else {
          $(records).each(function (index) {
              allValues.push('' + valueField(this, index));
          });
      }
      $.data(valueEl, 'allValues', allValues);

      //构建 dropList
      
      if (typeof optionField === 'string') {
          $(records).each(function (index) {
              innerHtml += self._wrapText(this[optionField],index);
          });
      } else {
          $(records).each(function (index) {
              innerHtml += self._wrapText(options.optionField(this, index),index);
          });
      }
      if (innerHtml) {
          $(innerHtml).appendTo(dropList);
          dropList.show().css('height', 'auto');
          dropList.hide();
      }
      if (dropList.height() > options.listMaxHeight) {
          if (!dropList.hasClass('scorll-bar-box')) {
              dropList.addClass('scorll-bar-box').height(options.listMaxHeight);
              $("#" + this.element.attr("aeId") + "_scrollbar").niceScroll();
          }
      }
      this._bindEventsToList();
  	},
  	_wrapText: function (text,index) {
      if (typeof this.options.optionField === 'string') {
          return '<li data-index="'+index+'"><a title="' + text + '">' + text + '</a></li>';
      } else {
          return '<li data-index="'+index+'"><a>' + text + '</a></li>';
      }
    },
    _getAllOptionsBeforeFiltered: function () {
            return this.getBody().find('a');
    },
    _bindEventsToList: function () {
        var self = this,
            items = self._getAllOptionsBeforeFiltered();
        items.mousedown(function (event) {
            self._backfill(this);
        });
    },
    _backfill: function (source) {
    		var self = this; 
        var dropList = this.getBody();
        var valueEl = this.element.find('input.form-control');
        var value = source.innerHTML;
        var valueChange = true;
        var oldValue = valueEl.val();
        var options = this.options;

        if (value == oldValue) {
            valueChange = false;
        }
     		
        this.setValue(value);

        if (options.showClear && options.enable) {
            //显示清除按钮
            
            if (valueEl.val() !== '' && typeof (valueEl.val()) != 'undefined') {
            		self.element.addClass('comboxclear');
                valueEl.prevAll('.icon-error2').show();
                valueEl.prevAll('.icon-error2').unbind("click").on("click",function(e){
                	e.stopPropagation();
    	            self.setValue('');	
	            		valueEl.prevAll('.icon-error2').hide();
            			valueEl.trigger("valuechange",valueEl);
	            		if(options.onValueChange){
	                	 self._trigger("onValueChange", null, input, '', value);
	                }
                });
            }
        }
        
        options.value = value;
        // trigger onValueChange event
        if (!this._flag) {
           if (valueChange) {
            	  valueEl.trigger("valuechange",valueEl);
            	  if(options.onValueChange){ 
                	this._trigger("onValueChange", null, input, value, oldValue);
                }
            }
        }

        dropList.hide();
      
    }
	});
});

/**
 * 可折叠面板模块
 * @module ui-panel
 * @requires aries-core-public.$.aries.common#includeHtml
 */
define('ui-panel',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
	/*
	 * $Id : ui-panel.js$
	 * Depends : ui-core.js, $.includeHtml()
	 * Version : 3.1
	 * The last modification time : 2016-4-20 15:29
	 * TODO :
	 *
	 * logo : bootstrap 风格组件初步封装完成; 2015-6-1 15:03
	 * 		  支持头部功能区域自定义;新增属性level,用于设置title层级;支持loading; 2015-6-2 19:00
	 * 		 面板头部代码逻辑重构，新增属性 title、iconTitle、toolRendererFloat、titleRendererFloat; 2015-6-5 14:23
	 * 		支持panel头部左右均配置自定义功能区； 2015-6-9 15:38
	 * 		新增属性loading；2015-6-17 16:11
	 * 		事件bug修复； 2015-6-18 17:02
	 * 		新增方法 setTitle、setRenderer； 2015-6-19 10:42
	 * 		修改属性名 title - aeTitle，解决面板鼠标提示title值的bug； 2015-11-17 17:33
	 * 		默认折叠面板时，去除动画；	2016-4-20 15:29
	 *
	 */

	/**
	 * @name aePanel
	 * @class 面版是一个布局组件，同时也是一个展示内容的容器。<br/>
	 * <b>特点：</b><br/>
	 * <ol>
	 *      <li>可以使用本地数据源，也可以使用远程数据源，同时提供友好的错误处理机制。</li>
	 *      <li>支持动态修改标题内容和图标。</li>
	 *      <li>工具条按钮内置与可扩展。</li>
	 *      <li>提供丰富的事件。</li>
	 * </ol>
	 *
	 * <b>示例：</b><br/>
	 * <pre>
	 * &lt;script type="text/javascript" >
	 * $(document).ready(function() {
     *     $('#panel').aePanel({
     *         width: '400px',
     *         height: '200px',
     *         title: 'panel标题',
     *         collapsed: false,//组件创建后为收起状态
     *         collapsible: true,//渲染收起与展开按钮
     *         closable: true, //渲染关闭按钮
     *         onBeforeOpen: function(event){if(window.count!==0)return false;},
     *         onOpen: function(event){alert('panel被打开了。');}
     *     });
     * });
	 * &lt;/script>
	 *
	 * &lt;input id="panel"/>
	 * </pre>
	 * @constructor
	 * @description 构造函数.
	 * @param p 标准config对象：{}
	 */
	/**
	* 可折叠面板
	* @namespace ae.aePanel
	*/
	$.aeWidget("ae.aePanel" , {
		/**
         * 可选项
         * @name ae.aeCombo#options
         * @property {object} options                      - 可选项
         */
		options:{
			/**
			 * 防止重复初始化
			 * @property {boolean} options._initial
			 * @default false
			 * @private
			 */
			_initial : false,
			/**
			 * 在组件创建时是否要渲染其头部。
			 * @property {boolean} options.header
			 * @default true
			 * @example
			 * $("#myPanel").aePanel({header:false}); //不渲染panel的头部
			 */
			header : true,
			/**
			 * 组件内置四种主题样式
			 * * 0 -- 默认主题，无边框，无底色
			 * * 1 -- 无边框，蓝色底色
			 * * 2 -- 有边框，无底色
			 * * 3 -- 有边框，蓝色底色
			 * @property {number} options.theme
			 * @default 0
			 * @example
			 * $("#myPanel").aePanel({theme:1});
			 */
			theme : 0,
			/**
			 * 内置6种面板等级，用title字体大小区分
			 * * 3 -- 默认等级，面板title使用<h3>标签包裹
			 * * 1 -- 一级面板
			 * * 2 -- 二级面板
			 * * 4 -- 四级面板
			 * * 5 -- 五级面板
			 * * 6 -- 六级面板
			 * @property {number} options.level
			 * @default 3
			 * @example
			 * $("#myPanel").aePanel({level:1});
			 */
			level : 3,
			/**
			 * 面板标题
			 * @property {string} options.title
			 * @default undefined
			 * @example
			 * $("#myPanel").aePanel({title:'Panel Title<em>Secondary text</em>'});
			 */
			title : undefined,
			/**
			 * 面板标题前的图标字体样式
			 * @property {string} options.iconTitle
			 * @default undefined
			 * @example
			 * $("#myPanel").aePanel({iconTitle:'icon-shopping-cart'});
			 */
			iconTitle : undefined,
			/**
			 * 面板宽度
			 * @property {string|number} options.width
			 * @default "auto"
			 * @example
			 * $("#myPanel").aePanel({width:'300'});
			 */
			width : 'auto',
			/**
			 *面板高度
			 * @property {string|number} options.height
			 * @default "auto"
			 * @example
			 * $("#myPanel").aePanel({height:'200'});
			 */
			height : 'auto',
			/**
			 * 是否在面板标题栏右侧显示关闭工具按钮。
			 * @property {boolean} options.iconClose
			 * @default false
			 * @example
			 * $("#myPanel").aePanel({iconClose:true});
			 */
			iconClose : false,
			/**
			 * 是否在面板标题栏右侧显示折叠工具按钮。
			 * @property {boolean} options.iconFold
			 * @default false
			 * @example
			 * $("#myPanel").aePanel({iconFold:true});
			 */
			iconFold : false,
			/**
			 * 是否在单击面板标题栏时折叠面板。
			 * @property {boolean} options.folding
			 * @default false
			 * @example
			 * $("#myPanel").aePanel({folding:true});
			 */
			folding : false,
			/**
			 * 面板创建后是否处于关闭状态，可调用open方法动态打开面板。
			 * @property {boolean} options.initClosed
			 * @default false
			 * @example
			 * $("#myPanel").aePanel({closed:false});
			 */
			initClosed : false,
			/**
			 * 组件创建后是否处于收起状态，可调用expand方法动态展开组件主体内容。
			 * @property {boolean} options.initFolded
			 * @default false
			 * @example
			 * $("#myPanel").aePanel({fold:true});
			 */
			initFolded : false,
			/**
			 * 是否在装载内容的时候出现正在加载的提示层
			 * @property {boolean} options.loading
			 * @default false
			 * @example
			 * $("#myPanel").aePanel({loading:true});
			 */
			loading : false,
			/**
			 * @组件头部自定义功能区域
			 * @property {function}
			 * @default undefined
			 * @example
			 * <div id="demo-panel" aeType="aePanel" aeInit="true" rightRenderer="myTools()"></div>
			 * <script>
			 * function myTools(){
			 *     return str = '<div class="input-icon right"><i class="icon-error2"></i><input type="text" class="form-control"></div>';
			 * }
			 * </script>
			 */
			rightRenderer : undefined,
			/**
			 * @组件头部自定义功能区域
			 * @type Function
			 * @default 无
			 * @example
			 * <pre>
			 * <div id="demo-panel" aeType="aePanel" aeInit="true" leftRenderer="myTools()"></div>
			 * function myTools(){
			 * 		return str = '<div class="input-icon right"><i class="icon-error2"></i><input type="text" class="form-control"></div>';
			 * }
			 * </pre>
			 */
			leftRenderer : undefined,
			/**
			 * 打开panel组件前触发的函数，返回false可以阻止打开。
			 * @event
			 * @param event jQuery.Event对象
			 * @name aePanel#onBeforeOpen
			 * @type Function
			 * @default null
			 * @example
			 * $("#panel").aePanel({onBeforeOpen:function(event){alert("永远打不开该组件.");return false;}});
			 */
			/**
			 * 打开panel组件后触发的函数。
			 * @event
			 * @param event jQuery.Event对象
			 * @name aePanel#onOpen
			 * @type Function
			 * @default null
			 * @example
			 * $("#panel").aePanel({onOpen:function(event){alert("panel已经被打开了。");}});
			 */
			/**
			 * 关闭panel组件前触发的函数，返回false可以阻止关闭。
			 * @event
			 * @param event jQuery.Event对象
			 * @name aePanel#onBeforeClose
			 * @type Function
			 * @default null
			 * @example
			 * $("#panel").aePanel({onBeforeClose:function(event){alert("该组件即将被关闭。");}});
			 */
			/**
			 * 关闭panel组件后触发的函数。
			 * @event
			 * @param event jQuery.Event对象
			 * @name aePanel#onClose
			 * @type Function
			 * @default null
			 * @example
			 * $("#panel").aePanel({onClose:function(event){alert("panel已经被关闭了。");}});
			 */
			/**
			 * 收起panel组件前触发的函数，返回false可以阻止收起。
			 * @event
			 * @param event jQuery.Event对象
			 * @name aePanel#onBeforeFold
			 * @type Function
			 * @default null
			 * @example
			 * $("#panel").aePanel({onBeforeFold:function(event){alert("该组件即将被收起。");}});
			 */
			/**
			 * 收起panel组件后触发的函数。
			 * @event
			 * @param event jQuery.Event对象
			 * @name aePanel#onFold
			 * @type Function
			 * @default null
			 * @example
			 * $("#panel").aePanel({onFold:function(event){alert("panel已经被收起了。");}});
			 */
			/**
			 * 展开panel组件前触发的函数，返回false可以阻止展开。
			 * @event
			 * @param event jQuery.Event对象
			 * @name aePanel#onBeforeUnfold
			 * @type Function
			 * @default null
			 * @example
			 * $("#panel").aePanel({onBeforeUnfold:function(event){alert("该组件即将被展开。");}});
			 */
			/**
			 * 展开panel组件后触发的函数。
			 * @event
			 * @param event jQuery.Event对象
			 * @name aePanel#onUnfold
			 * @type Function
			 * @default null
			 * @example
			 * $("#panel").aePanel({onUnfold:function(event){alert("panel已经被展开了。");}});
			 */
			/**
			 * panel初始化方式，默认通过html来设置参数。传值为js时，则通过js中设置的option来初始化。
			 * @type String
			 * @default 'html'
			 * @example
			 * $('.selector').aePanel({initType : 'js'});
			 */
			initType : 'html'
		},
		_create : function(event){
			var _self = this,
				options = this.options,
				$body = this.element,
				id=$body.attr("id");

			if(options._initial === true){
				return;
			}

			if(id){
				$body.attr("aeId",id);
			}

			if(options.initType === 'html'){
				_self._buildOptions(options, $body);
			}
			/*
			 * @name theme 内置4种主题
			 * @0 默认主题，无边框，无底色
			 * @1 无边框，蓝色底色
			 * @2 有边框，无底色
			 * @3 有边框，蓝色底色
			 */
			var panelClass;
			switch(options.theme){
				case 0 :
					panelClass = "panel panel-primary panel-noborder";
					break;
				case 1 :
					panelClass = "panel panel-primary panel-noborder panel-blue";
					break;
				case 2 :
					panelClass = "panel panel-primary";
					break;
				case 3 :
					panelClass = "panel panel-primary panel-blue";
					break;
				default :
					panelClass = "panel panel-primary panel-noborder";
					break;
			}
			$body.addClass("panel-body").wrap('<div class="'+panelClass+'"></div>');
			var $panel = $body.parent();
			$panel.css("width",options.width);
			if(options.header){
				_self._rendererHeader();
			}
			options._initial = true;
			if(options.onInit){
				_self._trigger("onInit", event);
			}
			//防止body内容初始化后高度变化，故高度放在onInit后计算
			if(options.height === 'auto'){
				$body.css('height',options.height);
			}else{
				var bodyH, bodyOuterH = $body.outerHeight(true);
				if(options.header){
					var headerH = $panel.find('>div.panel-heading').outerHeight(true);
					bodyH = options.height - headerH;
				}
				bodyH = bodyH || options.height;
				$body.css('height', bodyH);
				//当内容高度超出设置高度时，出现滚动条
				if(bodyOuterH > bodyH){
					$body.addClass("scorll-bar-box");
					$body.niceScroll();
				}
			}
		},
		_rendererHeader : function(){
			var _self = this, options = this.options, $body = this.element, $panel = $body.parent();
			$panel.prepend('<div class="panel-heading"></div>');
			var $header = $panel.find('>div.panel-heading');
			$header.prepend('<div class="pull-left"></div>');
			var $title = $header.children("div.pull-left:first");
			switch(options.level){
				case 1 :
					$title.prepend('<h1 class="panel-title"></h1>');
					break;
				case 2 :
					$title.prepend('<h2 class="panel-title"></h2>');
					break;
				case 3 :
					$title.prepend('<h3 class="panel-title"></h3>');
					break;
				case 4 :
					$title.prepend('<h4 class="panel-title"></h4>');
					break;
				case 5 :
					$title.prepend('<h5 class="panel-title"></h5>');
					break;
				case 6 :
					$title.prepend('<h6 class="panel-title"></h6>');
					break;
				default :
					$title.prepend('<h3 class="panel-title"></h3>');
					break;
			}
			if(options.title){
				$title.children(".panel-title").html(options.title);
			}
			if(options.iconTitle){
				$title.children(".panel-title").prepend('<i class="'+options.iconTitle+'"></i>');
			}
			/*if(!options.title && !options.iconTitle){
			 $title.empty();
			 }*/

			if(options.leftRenderer){
				$title.append(options.leftRenderer());
			}

			$header.append('<div class="panel-btn"></div>');
//			if(options.iconClose || options.iconFold || options.rightRenderer){
//				$header.append('<div class="panel-btn"></div>');
			var $icons = $header.find('>div.panel-btn');
			if(options.iconClose){
				$icons.prepend('<a class="aePaneliconclose"><i class="icon-error2"></i></a>');
				$icons.find('>a.aePaneliconclose').bind("mouseover.headericons",function(){
					$(this).css("cursor","pointer");
				}).bind("click.herdericons",function(event){
					_self.close(event);
					event.stopPropagation();
				});
			}
			if(options.iconFold){
				$icons.prepend('<a class="aePaneliconfold"><i class="icon-arrowlup-down"></i></a>');
				var $fold = $icons.find('>a.aePaneliconfold');
				$fold.bind("mouseover.headericons",function(){
					$(this).css("cursor","pointer");
				}).bind("click.herdericons",function(event){
					if(options._folded){
						_self.unfold(event);
					}else{
						_self.fold(event);
					}
					event.stopPropagation();
				});
			}
			if(options.rightRenderer){
				$icons.prepend(options.rightRenderer());
			}
//			}

			//为panel条的title绑定折叠动作
			if(options.folding){
				$header.find(".panel-title").bind("click.folding",function(event){
					if(options._folded){
						_self.unfold(event);
					}else{
						_self.fold(event);
					}
				});
			}
		},
		_buildOptions : function(options,element){
			options.header = element.attr("header")=='false' ? false : options.header;
			options.loading = element.attr("loading")=='true' ? true : options.loading;
			options.title = $.trim(element.attr("aeTitle")) || $.trim(element.attr("title"));
			element.removeAttr("title");
			options.iconTitle = $.trim(element.attr("iconTitle")) || options.iconTitle;
			options.theme = parseInt(element.attr("theme"),10) || options.theme;
			options.level = parseInt(element.attr("level"),10) || options.level;
			options.width = parseInt(element.attr("width"),10) || options.width;
			options.height = parseInt(element.attr("height"),10) || options.height;
			options.folding = element.attr("folding")=='true' ? true : options.folding;
			options.initFolded = element.attr("initFolded")=='true' ? true : options.initFolded;
			options.initClosed = element.attr("initClosed")=='true' ? true : options.initClosed;
			options.iconClose = element.attr("iconClose")=='true' ? true : options.iconClose;
			options.iconFold = element.attr("iconFold")=='true' ? true : options.iconFold;

			var leftRenderer = element.attr("leftRenderer");
			options.leftRenderer = leftRenderer ? function(){
				if($.isString(leftRenderer)){
					var i = leftRenderer.indexOf("(");
					var actName = i>0 ? leftRenderer.substring(0, i) : leftRenderer;
					var func = 	"return window."+actName+"?"+actName+".call(window):false;";
					return new Function(func)();
				}
			} : undefined;

			var rightRenderer = element.attr("rightRenderer");
			options.rightRenderer = rightRenderer ? function(){
				if($.isString(rightRenderer)){
					var i = rightRenderer.indexOf("(");
					var actName = i>0 ? rightRenderer.substring(0, i) : rightRenderer;
					var func = 	"return window."+actName+"?"+actName+".call(window):false;";
					return new Function(func)();
				}
			} : undefined;

			this._buildOptionEvent(options,'onBeforeOpen',element.attr("onBeforeOpen"));
			this._buildOptionEvent(options,'onOpen',element.attr("onOpen"));
			this._buildOptionEvent(options,'onBeforeClose',element.attr("onBeforeClose"));
			this._buildOptionEvent(options,'onClose',element.attr("onClose"));
			this._buildOptionEvent(options,'onBeforeFold',element.attr("onBeforeFold"));
			this._buildOptionEvent(options,'onFold',element.attr("onFold"));
			this._buildOptionEvent(options,'onBeforeUnfold',element.attr("onBeforeUnfold"));
			this._buildOptionEvent(options,'onUnfold',element.attr("onUnfold"));
			this._buildOptionEvent(options,'onInit',element.attr("onInit"));
			this._buildOptionEvent(options,'onReload',element.attr("onReload"));

		},
		_buildOptionEvent : function(ops,evtName,evtValue){
			ops[evtName]=evtValue ? function(event){
				if($.isString(evtValue)){
					var i = evtValue.indexOf("(");
					var actName = i>0 ? evtValue.substring(0, i) : evtValue;
					var func = "return window."+actName+"?"+actName+".call(window,e):false;";
					return new Function("e",func)(event);
				}
			} : ops[evtName];
		},
		_init : function(event){
			var _self = this, options = this.options;
			options._closed = false;
			options._folded = false;
			options.initClosed ? _self.close(event) : _self.open(event);
			options.initFolded ? _self.fold(event) : _self.unfold(event);
		},
		/**
		 * 重新加载数据
		 * @name aePanel#reload
		 * @function
		 * @param url 一个有效的取数地址
		 */
		reload: function(url, event){
			var _self = this, options = this.options, $body = this.element;
			if(!url){
				return;
			}
			_self._init();
			if(options.loading){
				$body.empty().html('<div class="loading"><span>Loading...</span></div>');
			}
			$.includeHtml($body, url, function(event){
				if(options.onReload){
					_self._trigger("onReload",event);
				}
			});
		},
		/**
		 * 收起组件。
		 * @name aePanel#fold
		 * @function
		 */
		fold : function(/**anim , speed**/event){
			var _self = this, options = this.options, $body = this.element, $panel = $body.parent();
			var anim = true, speed = 'slow';
			/*			//TODO: 可配置
			 var anim = effects.anim, speed = effects.speed;
			 if(arguments[0] != undefined){//由于anim为boolean，所以不可以写成 anim = arguments[0] || effects.anim
			 anim = arguments[0];//内部使用
			 }
			 speed = arguments[1] || speed;//内部使用
			 */
			if(options._folded){
				return;
			}
			if(options.onBeforeFold && _self._trigger("onBeforeFold", event) === false){
				return ;
			}
			$panel.stop(true,true);	//停止组件上所有正在进行的动画
			if(options.header && options.iconFold){
//				var $iconFold = $body.prev('div.panel-heading').find('>div.panel-btn i.icon-arrowlup-down');
				var $iconFold = $body.prev('div.panel-heading').find('>div.panel-btn >a.aePaneliconfold');
				$iconFold.children('i').removeClass("icon-arrowlup-down").addClass("icon-arrowlup-little");
//				$iconFold.html('<i class="icon-arrowlup-little"></i>');
			}
			//初始化折叠面板
			if(options.initFolded && event == undefined){
				options.initFolded = false;
				anim = false;
			}
			$panel.animate({
					height : '-=' + $body.outerHeight()
				} ,
				anim ? (speed || 'normal') : 0 ,
				function(){
					$body.hide();
					//TODO: 如果有 loading，则处理loading暂时隐藏
					if(options.height==="auto"){
						$panel.css("height" , "");//动画执行后parent会自动添加高度值，所以设置为"auto"时要手动去掉此高度
					}
					options._folded = true;
					if(options.onFold){
						_self._trigger("onFold", event);
					}
				}
			);

		},
		/**
		 * 展开组件。
		 * @name aePanel#unfold
		 * @function
		 */
		unfold: function(/**anim , speed**/event){
			var _self = this, options = this.options, $body = this.element, $panel = $body.parent();
			var anim = true, speed = 'slow';
			if(!options._folded){
				$body.show();
				return;
			}
			if(options.onBeforeUnfold && _self._trigger("onBeforeUnfold", event) === false){
				return ;
			}
			$panel.stop(true,true);	//停止组件上所有正在进行的动画
			if(options.header && options.iconFold){
//				var $iconFold = $body.prev('div.panel-heading').find('>div.panel-btn i.icon-arrowlup-little');
//				$iconFold.parent('a').html('<i class="icon-arrowlup-down"></i>');

				var $iconFold = $body.prev('div.panel-heading').find('>div.panel-btn >a.aePaneliconfold');
				$iconFold.children('i').removeClass("icon-arrowlup-little").addClass("icon-arrowlup-down");
			}
			//如果parent没有设置高度值，要设置一个，不然动画效果是出不来的
			if(options.height==="auto"){
				$panel.height($body.prev('div.panel-heading').outerHeight() || '1px');
			}
			$body.show();
			//TODO: 判断loading，显示loading


			$panel.animate({
					height : '+=' + $body.outerHeight(true)
				} ,
				anim ? (speed || 'normal') : 0 ,
				function(){
					if(options.height==="auto"){
						$panel.css("height" , "");//动画执行后parent会自动添加高度值，所以设置为"auto"时要手动去掉此高度
					}
					options._folded = false;
					if(options.onUnfold){
						_self._trigger("onUnfold", event);
					}
				}
			);

		},
		/**
		 * 打开组件，使组件可见。
		 * @name aePanel#open
		 * @function
		 */
		open: function(event){
			var $panel = this.element.parent(), options = this.options;
			if(!options._closed){
				return;
			}
			if(options.onBeforeOpen && this._trigger("onBeforeOpen", event) === false){
				return ;
			}
			$panel.show();
			options._closed = false;
			if(options.onOpen){
				this._trigger("onOpen", event);
			}
		},
		/**
		 * 关闭组件，使组件不可见。
		 * @name aePanel#close
		 * @function
		 */
		close: function(event){
			var $panel = this.element.parent(), options = this.options;
			if(options._closed){
				return;
			}
			if(options.onBeforeClose && this._trigger("onBeforeClose", event) === false){
				return ;
			}
			$panel.hide();
			options._closed = true;
			if(options.onClose){
				this._trigger("onClose", event);
			}
		},
		/**
		 * 销毁组件
		 * @name aePanel#destroy
		 * @function
		 */
		_destroy: function(){
			
		},
		/**
		 * 设置title
		 * @name aePanel#setTitle
		 * @function
		 */
		setTitle: function(title){
			var options = this.options;
			if(!options.header){
				return;
			}
			var $header = this.element.prev('div.panel-heading');
			$header.find('>div.pull-left >h'+options.level).empty().html(title);
		},
		/**
		 * 设置面板头部功能区，此方法会覆盖已有的功能区代码，且事件需要重新绑定
		 * @name aePanel#setRenderer
		 * @param 难度高，舍去 data 类型：Object/Array 如：{"leftRenderer":"html1"}  /  ["leftRenderer":"html1","rightRenderer":"html2"]
		 * @param left type:String
		 * @param right type:String
		 * @function
		 */
		setRenderer: function(right, left){
			var options = this.options;
			if(!options.header){
				return;
			}
			var $header = this.element.prev('div.panel-heading');
			if(right && typeof right === "string"){
				if($header.find('>div.panel-btn').children().length){
					$header.find('>div.panel-btn').children().each(function(index,item){
						if(!($(item).is('.aePaneliconfold') || $(item).is('.aePaneliconclose'))){
							$(item).remove();
						}
					});
				}
				$header.find('>div.panel-btn').prepend(right);
			}
			if(left && typeof left === "string"){
				$header.find('>div.pull-left >h'+options.level).nextAll().remove();
				$header.find('>div.pull-left').append(left);
			}
		}
	});
});

define('ui-tabs', function (require, exports, moudles) {
    "require:nomunge,exports:nomunge,moudles:nomunge";
    /*
     * $Id: ui-tabs.js$
     * Depends : ui-core.js, $.globalInit()
     * version : 3.1
     * The last modification time : 2015-8-7 10:35
     * log :	bootstrap 组件初步封装完成，待完成事项 reload 方法；2015-5-14 10:44
     * 			内置六种样式封装完成，基础功能测试通过；新增tool属性，用于配置theme=4,5时的页签头部工具或标题；2015-5-14 14:20
     * 			reload方法重构完成；panel依赖完全拆离；2015-5-18 18:25
     * 			修复bug；2015-5-18 20:46
     * 			新增方法 getTabHeader, 获取指定页面头部对象； 2015-6-10 19:24
     * 			修复 _trigger 逻辑，新增 onReload 事件； 2015-6-21 14:09
     * 			完善 reload 方法内部逻辑； 2015-6-21 14:52
     * 			修复bug， dropdown-menu ；2015-7-3 14:26
     * 			修复bug，switchMode="mouseover"；2015-8-7 10:35
     * 			修复bug，leaveRefresh="true"；2015-8-7 10:35
     *
     */
    var activatedCls = "active",  //页签头部li标签选中样式
        scrollDisabled = "tab-disable";  //页签头部左、右箭头不可点击样式
    /**
     * @name aeTabs
     * @class 页签布局组件，通过简单的配置展示多页签信息，同时组件提供丰富的事件支持，比如选中页签，关闭页签，添加页签等等。
     *            支持各个页签以ajax方式加载内容；
     * @使用方式
     * @页面上的html标记如下
     * <pre>
     <div id="demo-tabs" aeType="aeTabs" aeInit="true" closable="[2,3]" theme="0">
     <ul>
     <li src="#tabsIntro"><a><i class="icon-arrowlup-down"></i>信息</a></li>
     <li src="demo/demo-radio.html">
     <a>单选框<span class="label label-info label-as-badge">12</span></a>
     </li>
     <li src="demo/demo-checkbox.html"><a>复选框</a></li>
     <li src="#tabsIntro2"><a>信息2</a></li>
     <li src="#demo-textField"><a>普通框div</a></li>
     <li src="demo/demo-textfield.html"><a>普通框page</a></li>
     <li><a>饼状图</a></li>
     <li><a>环形图</a></li>
     <li><a>折线图</a></li>
     <li><a>柱状图</a></li>
     </ul>
     <div id="tabsIntro">
     <div id="tabsEvents" style="margin:20px;">
     <p style="height:20px;line-height:20px;"><b>Tabs's Functions:</b></p>
     <p style="height:20px;line-height:20px;margin-left:30px;">Activate        - Activate the specified tab.</p>
     <p style="height:20px;line-height:20px;margin-left:30px;">Add            - Add a new tab.</p>
     <p style="height:20px;line-height:20px;margin-left:30px;">Close        - Close the specified tab.</p>
     <p style="height:20px;line-height:20px;margin-left:30px;">CloseAll        - Close all tabs.</p>
     <p style="height:20px;line-height:20px;margin-left:30px;">GetAlter        - Get the tabId of the specified tab.</p>
     <p style="height:20px;line-height:20px;margin-left:30px;">GetActivated    - Get the tabId of the current tab.</p>
     <p style="height:20px;line-height:20px;margin-left:30px;">GetLength    - Get the total number of all tabs.</p>
     <p style="height:20px;line-height:20px;margin-left:30px;">Reload        - Reload new contents for the specified tab by a url.</p>
     </div>
     <input type="text" value="1223" />
     </div>
     <div id="tabsIntro2">
     <p>Hello world</p>
     <input type="text" value="123456" />
     </div>
     <div id="demo-textField">
     <input aeType="aeTextfield" id="firstName" aeInit="true" width="300"/>
     </div>
     </div>
     * </pre>
     *
     * @最终展示页面代码如下
     <div class="panel panel-default tab-nowrap ">
     <div class="panel-heading">
     <div class="tab-listbox">
     <ul class="nav nav-tabs">
     <li class="active"><a>Home</a></li>
     <li>
     <a>Profile <span class="label label-info label-as-badge">12</span></a>
     <i class="icon-error2"></i>
     </li>
     <li><a>Messages</a></li>
     <li><a>Dropdown</a></li>
     </ul>
     </div>
     <div class="fn">
     <span class="tab-disable"><i class="icon-arrowleft-little"></i></span>
     <span><i class="icon-arrowright-little"></i></span>
     <span class="tab-current"><i class="icon-arrowlup-down"></i></span>
     </div>
     <ul class="dropdown-menu" style="display: block">
     <li><a>Action</a></li>
     <li><a>Another action</a></li>
     <li><a>Something else here</a></li>
     </ul>
     </div>
     <div class="tab-content">
     <div class="tab-pane active">1111111</div>
     <div class="tab-pane">2222</div>
     <div class="tab-pane">333</div>
     <div class="tab-pane">444</div>
     </div>
     </div>
     *
     * @constructor
     * @description 构造函数
     * @param
     * @example
     * $('#demo-tabs').aeTabs();
     */
    $.aeWidget('ae.aeTabs', {
        options: /** @lends aeTabs#*/ {
            /**
             * 防止重复初始化
             * @type Boolean
             * @default false
             */
            _initial: false,
            /**
             * 主题，内置六种
             * 0：
             * @type Number
             * @default 0
             */
            theme: 0,
            /**
             * 页签切换是否执行刷新
             * @type Boolean
             * @default false
             * @example
             * $('#make-tab').aeTabs({leaveRefresh: true});
             */
            leaveRefresh: false,
            /**
             * 页签布局的宽度，可取值为'auto'(默认情况，不做处理)，可以取值为'fit'，表示适应父容器的大小(width:100%)，也可以直接设置width大小（单位：像素）。
             * @default 'auto'
             * @type Number,String
             * @example
             * $('#make-tab').aeTabs({width: 500});
             */
            width: 'auto',
            /**
             * 页签布局的高度，可取值为'auto'(默认情况，不做处理)，可以取值为'fit'，表示适应父容器的大小(height:100%)，也可以直接设置height大小（单位：像素）。
             * @default 'auto'
             * @type Number,String
             * @example
             * $('#make-tab').aeTabs({height: 200});
             */
            height: 'auto',
            /**
             * 是否显示页签正文区的边框。
             * @default true
             * @type Boolean
             * @example
             * $('#make-tab').aeTabs({border: false});//不显示页签正文区的边框
             border : true,
             */
            /**
             * 单个页签头部的宽度。
             * @default auto
             * @type Number,String
             * @example
             * $('#make-tab').aeTabs({tabWidth: 'auto'});
             tabWidth : 'auto',
             */
            /**
             * 单个页签头部的高度，可取值为'auto'。默认为25像素。
             * @default 25
             * @type Number,String
             * @example
             * $('#make-tab').aeTabs({tabHeight: 'auto'});
             tabHeight : 27,
             */
            /**
             * 当页签超过组件宽度时出现左右滚动箭头，仅对theme=0,1,2有效。
             * @default true
             * @type Boolean
             */
            _scrollable: true,
            /**
             * 页签是否可关闭，当本属性为true时，所有页签都可以关闭。当属性值为数组时，只有数组中指定的index的页签可以关闭，index从0开始。
             * @default false
             * @type Boolean,Array
             * @example
             * //页签可关闭
             * $('#make-tab').aeTabs({closable : true});
             *
             * //只有第一个和第三个页签可以关闭
             * $('#make-tab').aeTabs({closable : [0,2]);
             */
            closable: false,
            /**
             * 页签头部的位置，可为top和left //TODO 'left'
             * 暂时不公布
             * @default 'top'
             * @type String
             * @example
             * $('#make-tab').aeTabs({position : 'left'});//页签头部在组件的左边
             */
            position: 'top',
            /**
             * 页签切换的模式。可为click(鼠标点击切换)，mouseover(鼠标滑过切换)。
             * @default 'click'
             * @type String
             * @example
             * $('#make-tab').aeTabs({switchMode : 'mouseover'});//鼠标划过切换页签
             */
            switchMode: 'click',
            /**
             * 初始化时被激活页签的索引（从0开始计数）或者tabId。
             * @default 0
             * @type Number,String
             * @example
             * $('#make-tab').aeTabs({active : 1});//初始化时激活第二个页签
             * $('#make-tab').aeTabs({active : 'tab-1'});//初始化时激活Id为'tab-1'的页签
             */
            active: 0,
            /**
             * 是否显示操作menu，设置为true则可以在tab页签上面点击右键出现关闭等操作下拉框。
             * @default false
             * @type Boolean
             * @example
             * $('#make-tab').aeTabs({contextMenu : true});
             */
            tabMenu: false,
            /**
             * 页签切换入参类型，内置四种
             */
            _activateType: ['first', 'last', 'prev', 'next'],
            /**
             * 当页签被选中之前执行的方法。
             * @event
             * @param n 选中页签的索引，从0开始计数.
             * @param event jQuery.Event对象
             * @default emptyFn
             * @example
             *        onBeforeActivate : function(n,event) {
             *          console.log(n);
             *          //console.log($(event.target).parent().attr("src"));
             *          console.log($(event.currentTarget).attr("src"));
             *      }
             */
            onBeforeActivate: function (n, event) {
            },
            /**
             * 当页签被选中后执行的方法。
             * @event
             * @param n 选中页签的索引，从0开始计数.
             * @param event jQuery.Event对象
             * @default emptyFn
             * @example
             *      onActivate : function(n,event) {
             *          console.log(n);
             *          //console.log($(event.target).parent().attr("src"));
             *          console.log($(event.currentTarget).attr("src"));
             *      }
             */
            onActivate: function (n, event) {
            },
            /**
             * 当页签被关闭之前执行的方法。
             * @event
             * @param n 被关闭页签的索引，从0开始计数。
             * @param event jQuery.Event对象
             * @default emptyFn
             * @example
             *      onBeforeClose : function(n,event) {
             *          console.log(n);
             *          //console.log($(event.target).parent().attr("src"));
             *          console.log($(event.currentTarget).attr("src"));
             *      }
             */
            onBeforeClose: function (n, event) {
            },
            /**
             * 当页签被关闭之后执行的方法。
             * @event
             * @param n 被关闭页签的索引，从0开始计数。
             * @param event jQuery.Event对象
             * @default emptyFn
             * @example
             *      onClose : function(n,event) {
             *          console.log(n);
             *          //console.log($(event.target).parent().attr("src"));
             *          console.log($(event.currentTarget).attr("src"));
             *      }
             */
            onClose: function (n, event) {
            },
            /**
             * 当关闭所有页签之前执行的方法。
             * @event
             * @param event jQuery.Event对象
             * @default emptyFn
             * @example
             *  $('#make-tab').aeTabs({
             *      onBeforeCloseAll : function(event) {
             *          alert('all tabs will be closed !');
             *      }
             *  });
             */
            onBeforeCloseAll: function (event) {
            },
            /**
             * 当关闭所有页签之后执行的方法。
             * @event
             * @param event jQuery.Event对象
             * @default emptyFn
             * @example
             *  $('#make-tab').aeTabs({
             *      onCloseAll : function(event) {
             *          alert('tabs are all closed now !');
             *      }
             *  });
             */
            onCloseAll: function () {
            },
            /**
             * 当新页签被添加之后执行的方法。
             * @event
             * @default emptyFn
             * @param config 经过处理的配置项。在调用add新增页签时，传入的配置项参数可能不完整(使用默认值)，此处的config就是完整的配置项
             * @param event jQuery.Event对象
             * @example
             *  $('#make-tab').aeTabs({
             *      onAdd : function(config,event) {
             *          console.dir(config);
             *          alert('you have added a tab at position:' + config.index );
             *      }
             *  });
             */
            onAdd: function (config) {
            },
            /**
             * 当新页签被添加之前执行的方法。
             * @event
             * @default emptyFn
             * @param config 经过处理的配置项。在调用add新增页签时，传入的配置项参数可能不完整(使用默认值)，此处的config就是完整的配置项
             * @param event jQuery.Event对象
             * @example
             *  $('#make-tab').aeTabs({
             *      onBeforeAdd : function(config,event) {
             *          console.dir(config);
             *          alert('you will add a tab at position:' + index );
             *      }
             *  });
             */
            onBeforeAdd: function (config) {
            },
            /**
             * 加载远程数据后的成功回调
             * @event
             * @default emptyFn
             * @param config
             * @param
             * @example
             *
             */
            onReload: function (config) {
            },
            /**
             * aeTabs初始化方式，默认通过html来设置参数。传值为js时，则通过js中设置的option来初始化。
             * @type String
             * @default 'html'
             * @example
             * $('#make-tab').aeTabs({initType : 'js'});
             */
            initType: 'html'
        },
        _create: function () {
            var _self = this,
                options = this.options,
                $ele = this.element,
                id = $ele.attr("id");
            if (options._initial === true) {
                return;
            }
            if (id) {
                $ele.attr("aeId", id);
            }
            options.random = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            options.id = 0;
            if (options.initType === 'html') {
                _self._buildOptions(options, $ele);
            }
            /*
             * @name theme 内置六种主题
             * @0 默认主题，允许出现左右滚动箭头
             * @1 允许出现左右滚动箭头
             * @2 允许出现左右滚动箭头
             * @3 页签均分宽度，不出现左右滚动箭头
             * @4 页签居左，右侧允许配置工具按钮，不出现左右滚动箭头
             * @5 页签居右，左侧允许配置工具按钮，不出现左右滚动箭头
             */
            var themeClass, ulClass;
            switch (options.theme) {
                case 0 :
                    themeClass = "panel panel-default tab-nowrap";
                    ulClass = "nav nav-tabs";
                    break;
                case 1 :
                    themeClass = "panel panel-default tab-nowrap tab-simple";
                    ulClass = "nav nav-tabs";
                    break;
                case 2 :
                    themeClass = "panel panel-default tab-nowrap tab-justi";
                    ulClass = "nav nav-tabs";
                    break;
                case 3 :
                    themeClass = "panel panel-default tab-nowrap tab-simple";
                    ulClass = "nav nav-tabs nav-justified";
                    options._scrollable = false;
                    break;
                case 4 :
                    themeClass = "panel panel-default tab-less";
                    ulClass = "nav nav-tabs";
                    options._scrollable = false;
                    options.tool = $ele.attr("tool");
                    _self._tool(options.tool);
                    break;
                case 5 :
                    themeClass = "panel panel-default tab-less";
                    ulClass = "nav nav-tabs pull-right";
                    options._scrollable = false;
                    options.tool = $ele.attr("tool");
                    _self._tool(options.tool);
                    break;
                default :
                    themeClass = "panel panel-default tab-nowrap";
                    ulClass = "nav nav-tabs";
                    break;
            }
            $ele.addClass(themeClass).children('ul:first').addClass(ulClass).wrapAll('<div class="panel-heading"></div>').wrapAll('<div class="tab-listbox"></div>');
            if (options._toolFn) {
                $ele.find('>div.panel-heading').append(options._toolFn);
            }
            if ($ele.children(':not(div.panel-heading)').length) {
                $ele.children(':not(div.panel-heading)').wrapAll('<div class="tab-content"></div>');
            } else {
                $ele.find('>div.panel-heading').after('<div class="tab-content"></div>');
            }
            $ele.find('>div.tab-content').children().addClass('tab-pane').hide();
            if (options.active < 0) {
                options.active = 0;
            } else if (options.active > _self._getLength() - 1) {
                options.active = _self._getLength() - 1;
            }
            //TODO：完善对宽度、高度的判断和处理
            if (options.width === 'fit') {
                $ele.outerWidth($ele.parent().width());
            } else if (options.width !== 'auto') {
                $ele.css('width', options.width);
            }
            if (options.height === 'fit') {
                $ele.outerHeight($ele.parent().height());
            } else if (options.height !== 'auto') {
                $ele.css('height', options.height);
            }
            _self._history = [];	//页签访问的历史记录
            _self._makeSketch();
            options._initial = true;
        },
        /*
         * 构建基础框架
         */
        _makeSketch: function () {
            var _self = this, options = this.options, $ele = this.element;
            var $content = $ele.find('>div.tab-content');
            $ele.find('>div.panel-heading >div.tab-listbox >ul li').each(function (index, item) {
                var tabId = 'tabId-' + options.random + '-' + options.id++;
                var src = $(item).attr('src');
                $(item).children('a').attr('tabId', tabId);
                if (_self._srcType(src) === 'page') {		//页签内容为page
                    $(item).children('a').attr('href', '#' + tabId);
                    $content.append('<div id="' + tabId + '"></div>');
                    //TODO:待验证，当首个激活页签内容来自page
                    if (options.active === index) {
                        _self._includeHtml(tabId, src);
                    }
                } else if (_self._srcType(src) === 'div') {	//页签内容为div
                    $(item).children('a').attr('href', src);
                    if (!$content.find(">" + src).length) {
                        var outerHTML = $(src).prop("outerHTML") || '<div id="' + src.split("#")[1] + '"></div>';
                        $(src).remove();
                        $content.append(outerHTML);
                    }
                } else {
                    $(item).children('a').attr('href', '#' + tabId);
                    $content.append('<div id="' + tabId + '"></div>');
                }
                var $a = $(item).find('a');
                if (options.closable === true || ($.isArray(options.closable) && $.inArray(index, options.closable) !== -1)) {
                    $('<i class="icon-error2"></i>').insertAfter($a);
                }
            });
            //显示首先激活的页签
            var $avtiveLi = $ele.find('>div.panel-heading >div.tab-listbox >ul li:eq(' + options.active + ')');
            $avtiveLi.addClass(activatedCls).siblings('li').removeClass(activatedCls);
            options.activeTabId = _self._getAlter(options.active);
            if (!$.inArray(options.activeTabId, _self._history)) {
                _self._history.push(options.activeTabId);
            }
            $content.children(_self._tabIndex(options.active, false, true)).addClass('active').show().siblings().hide();
            //当选中了一个并未完全显示的页签,需要滚动让他完全显示出来
            /*var $ul = $ele.find('>div.panel-heading >div.tab-listbox >ul'), $a = $ul.find('li a[tabId='+_self._getAlter(options.active)+']');
             if(_self._checkScroller()){
             $ul.stop(true, true);
             $ele.clearQueue();
             var $iconRight = $ele.find('>div.panel-heading >div.fn');
             var $heading = $ele.find('>div.panel-heading');
             var lBorder = $a.parent().offset().left;
             var rBorder = lBorder + $a.parent().outerWidth(true);
             var lDiff =  parseFloat($heading.css('padding-left')) - lBorder;
             var rDiff = $iconRight.offset().left - rBorder ;
             if(lDiff >= 0){
             _self._scroll(lDiff, _self._scrollCbFn());
             }else if(rDiff <= 0){
             _self._scroll(rDiff, _self._scrollCbFn());
             }else{
             _self._scrollCbFn()();
             }
             }*/
            _self._scrollTo(options.active);
            //TODO：右键菜单
//	        this.$menu = $('<div></div>').appendTo($('body'));
            _self._checkScroller() && _self._enableScroller();
            //TODO：高度逻辑
            if (options.height !== 'auto') {
                var tabsHeight = $ele.innerHeight(), headersHeight = $ele.find('>div.panel-heading').outerHeight();
                $ele.find('>div.tab-content').css('height', tabsHeight - headersHeight);
            }
            $ele.children().each(function () {
                $(this).is('div.panel-heading, div.tab-content') || $(this).remove();
            });
            //TODO：高度逻辑
            $ele.css('height', $ele.height());
            $ele.css('height', options.height);
        },
        _buildOptions: function (options, element) {
            options.theme = parseInt(element.attr("theme"), 10) || options.theme;
            options.active = parseInt(element.attr("active"), 10) || options.active;
            options.width = parseInt(element.attr("width"), 10) || options.width;
            options.height = parseInt(element.attr("height"), 10) || options.height;
            options.leaveRefresh = element.attr("leaveRefresh") == "true" ? true : options.leaveRefresh;
            if (element.attr("switchMode") && element.attr("switchMode").indexOf('mouseover') !== -1) {
                options.switchMode = 'mouseover';
            }
//		    options.tabMenu = element.attr("tabMenu")=='true' ? true : options.tabMenu;	//TODO：右键菜单
            var closable = element.attr("closable");
            if (closable && closable == 'true') {
                options.closable = true;
            } else if (closable && closable.indexOf("[") === 0) {
                closable = [];
                var result = element.attr("closable").substring(1, element.attr("closable").length - 1).split(",");
                for (var i = 0; i < result.length; i++) {
                    closable.push(parseInt(result[i], 10));
                }
                options.closable = closable;
            } else {
                options.closable = false;
            }
            this._buildOptionEvent(options, 'onBeforeActivate', element.attr("onBeforeActivate"));
            this._buildOptionEvent(options, 'onActivate', element.attr("onActivate"));
            this._buildOptionEvent(options, 'onBeforeAdd', element.attr("onBeforeAdd"));
            this._buildOptionEvent(options, 'onAdd', element.attr("onAdd"));
            this._buildOptionEvent(options, 'onBeforeClose', element.attr("onBeforeClose"));
            this._buildOptionEvent(options, 'onClose', element.attr("onClose"));
            this._buildOptionEvent(options, 'onReload', element.attr("onReload"));
            var onBeforeCloseAll = element.attr("onBeforeCloseAll");
            options.onBeforeCloseAll = onBeforeCloseAll ? function (event) {
                if ($.isString(onBeforeCloseAll)) {
                    var i = onBeforeCloseAll.indexOf("(");
                    var actName = i > 0 ? onBeforeCloseAll.substring(0, i) : onBeforeCloseAll;
                    var func = "return window." + actName + "?" + actName + ".call(window,e):false;";
                    return new Function("e", func)(event);
                }
            } : '';
            var onCloseAll = element.attr("onCloseAll");
            options.onCloseAll = onCloseAll ? function (event) {
                if ($.isString(onCloseAll)) {
                    var i = onCloseAll.indexOf("(");
                    var actName = i > 0 ? onCloseAll.substring(0, i) : onCloseAll;
                    var func = "return window." + actName + "?" + actName + ".call(window,e):false;";
                    return new Function("e", func)(event);
                }
            } : '';
        },
        _buildOptionEvent: function (options, evtName, evtValue) {
            options[evtName] = evtValue ? function (param, event) {
                if ($.isString(evtValue)) {
                    var i = evtValue.indexOf("(");
                    var actName = i > 0 ? evtValue.substring(0, i) : evtValue;
                    var func = "return window." + actName + "?" + actName + ".call(window,p,e):false;";
                    return new Function("p", "e", func)(param, event);
                }
            } : options[evtName];
        },
        _tool: function (tool) {
            var options = this.options;
            if (options.theme === 4) {
                options.tool = function () {
                    if ($.isString(tool)) {
                        var i = tool.indexOf("(");
                        var actName = i > 0 ? tool.substring(0, i) : tool;
                        var func = "return window." + actName + "?" + actName + ".call(window):false;";
                        return new Function(func)();
                    }
                };
                options._toolFn = '<div class="fn">' + options.tool() + '</div>' || '<div class="fn"><i class="icon-settings"></i></div>';
            } else if (options.theme === 5) {
                options.tool = function () {
                    if ($.isString(tool)) {
                        var i = tool.indexOf("(");
                        var actName = i > 0 ? tool.substring(0, i) : tool;
                        var func = "return window." + actName + "?" + actName + ".call(window):false;";
                        return new Function(func)();
                    }
                };
                options._toolFn = options.tool() || '<h4>Title can be there</h4>';
            }
        },
        _init: function () {
//          _self._renderTabMenu();
            this._buildEvent();
        },
        _renderTabMenu: function () {
            var _self = this, $ele = this.element, options = this.options;
//	        var items = this.items;
            //TODO：右键菜单
            /*if(options.closable == true && options.tabMenu && $.fn.aeMenu){
             var tabId = $ele.attr('id');
             this.menu = this.$menu.aeMenu({
             initType : 'js',
             contextMenu : true,
             dataSource : [{id:tabId+'_001',label:'关闭'},
             {id:tabId+'_002',label:'关闭其它'},
             {id:tabId+'_003',label:'关闭所有'}
             ],
             onSelect : function(item,e){
             if(item.id == tabId+'_001'){
             _self.close(_self.getAlter($(_self.$currentLi).find('a').attr('tabid')));
             }else if(item.id == tabId+'_002'){
             $headers.find('ul li').each(function(index,item){
             var currentLiId = $(_self.$currentLi).find('a').attr('tabid');
             var itemId = $(item).find('a').attr('tabid');
             if(currentLiId === itemId)return;
             _self.close(_self.getAlter(itemId));
             });
             }else if(item.id == tabId+'_003'){
             _self.closeAll();
             }
             }
             });
             }
             if($.isArray(options.closable) && options.tabMenu && $.fn.aeMenu){
             var tabId = $ele.attr('id');
             this.menu = this.$menu.aeMenu({
             initType : 'js',
             contextMenu : true,
             dataSource : [{id:tabId+'_001',label:'关闭'},
             {id:tabId+'_002',label:'关闭其它'},
             {id:tabId+'_003',label:'关闭所有'}
             ],
             onSelect : function(item,e){
             if(item.id == tabId+'_001'){
             _self.close(_self.getAlter($(_self.$currentLi).find('a').attr('tabid')));
             }else if(item.id == tabId+'_002'){
             $headers.find('ul li').each(function(index,item){
             var currentLiId = $(_self.$currentLi).find('a').attr('tabid');
             var $aLis  = $(item).find('a');
             if($aLis.hasClass('closed')){
             var itemId = $aLis.attr('tabid');
             if(currentLiId === itemId)return;
             _self.close(_self.getAlter(itemId));
             }
             });
             }else if(item.id == tabId+'_003'){
             $headers.find('ul li').each(function(index,item){
             var $aLis  = $(item).find('a');
             if($aLis.hasClass('closed')){
             var itemId = $aLis.attr('tabid');
             _self.close(_self.getAlter(itemId));
             }
             });
             }
             }
             });
             }*/
        },
        _buildEvent: function () {
            var _self = this, $ele = this.element, options = this.options;
            var $iconClose = $ele.find('>div.panel-heading >div.tab-listbox >ul i.icon-error2');
            //close icon
            $iconClose.unbind('click.aetabs').bind('mouseover.aetabs', function () {
                $(this).css("cursor", "pointer");
            }).bind('click.aetabs', function (e) {
//	            var tabId = $(e.target).attr('tabId');
//	            _self._close(tabId);
                _self._close($(this).parent('li:first').index());
                return false;
            });
            //tab click
            var $tabLi = $ele.find('>div.panel-heading >div.tab-listbox >ul li');
            if (options.switchMode === 'mouseover') {
                $tabLi.bind('mouseover.aetabs', function (e) {
                    var $li = $(this);
                    var /*tabId = $(this).find('a').attr('tabId'),*/ timer = $.data($ele[0], 'activateTimer');
                    if (typeof timer !== 'undefined') {
                        clearTimeout(timer);
                    }
                    timer = setTimeout(function () {
//	                	_self._activate(tabId);
                        _self._activate($li.index(), e);
                        return false;
                    }, 200);
                    $.data($ele[0], 'activateTimer', timer);
                });
            } else if (options.switchMode === 'click') {
                $tabLi.bind('click.aetabs', function (e) {
//	        		_self._activate($(this).find('a').attr('tabId'));
                    _self._activate($(this).index(), e);
                    return false;
                });
            }
            $tabLi.bind('click.aetabs', function () {
                return false;
            });
            //tab hover TODO:tabMenu
            /*if(options.switchMode !== 'mouseover'){
             //	            var $lis = $ele.find('>div.om-tabs-headers li');
             //	            var addState = function( state, $el ) {
             //	                if ( $el.is( ":not(.om-state-disabled)" ) ) {
             //	                    $el.addClass( "om-state-" + state );
             //	                }
             //	            };
             //	            var removeState = function( state, $el ) {
             //	                $el.removeClass( "om-state-" + state );
             //	            };
             //	            $lis.bind( "mouseover.omtabs" , function() {
             //	                addState( "hover", $( this ) );
             //	            });
             //	            $lis.bind( "mouseout.omtabs", function() {
             //	                removeState( "hover", $( this ) );
             //	            });
             if(options.closable == true && options.tabMenu){
             $tabLi.each(function(index,item){
             $(item).bind("contextmenu",function(e){
             if ($.fn.aeMenu) {
             _self.$currentLi = this;
             $(_self.menu).aeMenu('show',e);
             }
             });
             })
             }
             if($.isArray(options.closable) && options.tabMenu){
             $tabLi.find('i.icon-error2').each(function(index,item){
             $(item).parent().bind("contextmenu",function(e){
             if ($.fn.aeMenu) {
             _self.$currentLi = this;
             $(_self.menu).aeMenu('show',e);
             }
             });
             })
             }
             }*/
            //scroller click
            $ele.find('>div.panel-heading >div.fn span').bind('click.aetabs', function (e) {
                if ($(this).hasClass(scrollDisabled)) {
                    return false;
                }
                var dropDown = _self.options._dropDown;
                var visibleTab = [];
                var $Lis = $ele.find('>div.panel-heading >div.tab-listbox >ul li');
                $Lis.each(function (index, item) {
                    var tabId = _self._getAlter(index);
                    if (dropDown.indexOf(tabId) === -1) {
                        visibleTab.push(index);
                    }
                });
                if ($(this).children('i').hasClass('icon-arrowleft-little')) {
                    if (visibleTab.length > 0 && visibleTab[0] - 1 > -1) {
                        _self._scrollTo(visibleTab[0] - 1);
                    }
                }
                if ($(this).children('i').hasClass('icon-arrowright-little')) {
                    if (visibleTab.length > 0 && visibleTab[visibleTab.length - 1] + 1 < $Lis.length) {
                        _self._scrollTo(visibleTab[visibleTab.length - 1] + 1);
                    }
                }
                //最后一个页签的宽度
                //var dist = $(this).parent('div.fn').siblings("div.tab-listbox").find('>ul li:last').outerWidth(true);
                //if($(this).children('i').hasClass('icon-arrowleft-little')){
                //	_self._scroll(dist, _self._scrollCbFn());
                //}
                //if($(this).children('i').hasClass('icon-arrowright-little')){
                //	_self._scroll(-dist, _self._scrollCbFn());
                //}
                if ($(this).children('i').hasClass('icon-arrowlup-down')) {
                    if ($ele.find('>div.panel-heading >ul').is(':hidden')) {
                        $ele.find('>div.panel-heading >ul').slideDown();
                    } else {
                        $ele.find('>div.panel-heading >ul').slideUp();
                    }
                }
                return false;
            });
        },
        //remove every events.
        _purgeEvent: function () {
            var $ele = this.element, options = this.options;
            var $headers = $ele.find('>div.panel-heading');
            $headers.children().unbind('.aetabs');
            $headers.find('>div.tab-listbox >ul >li >a').unbind('.aetabs');
//	        $ele.find('>div.panel-heading >ul li').unbind('click.aetabs');
        },
        _scrollTo: function (n) {
            var _self = this,
                $ele = this.element,
                $heading = $ele.find('>div.panel-heading'),
                $ul = $heading.find('div.tab-listbox >ul'),
                tabId = _self._getAlter(n),
                $a = $ul.find('li a[tabId=' + tabId + ']');
            if (this._checkScroller()) {
                //stop every animation.
                $ul.stop(true, true);
                $ele.clearQueue();
                var $iconRight = $ele.find('>div.panel-heading >div.fn');
                var lBorder = $a.parent().offset().left;
                var rBorder = lBorder + $a.parent().outerWidth(true);
                var lDiff = parseFloat($heading.css('padding-left')) - lBorder;
                var rDiff = $iconRight.offset().left - rBorder;
                if (lDiff >= 0) {
                    if (Math.abs(lDiff) < 3 && _self._getAlter(n + 1)) {//距离太小，不必要移动 转到下一个节点
                        _self._scrollTo(n + 1);
                    } else {
                        _self._scroll(lDiff, _self._scrollCbFn());
                    }
                } else if (rDiff <= 0) {
                    if (Math.abs(rDiff) < 3 && _self._getAlter(n + 1)) {//距离太小，不必要移动 转到下一个节点
                        _self._scrollTo(n + 1);
                    } else {
                        _self._scroll(rDiff, _self._scrollCbFn());
                    }
                } else {
                    _self._scrollCbFn()();
                }
            }
        },
        /**
         * 选中特定的页签，入参已做处理，统一为页签索引（从0开始计数）
         */
        _activate: function (n, event) {
            var _self = this, $ele = this.element, options = this.options;
            var $ul = $ele.find('>div.panel-heading >div.tab-listbox >ul');
            var tabId = _self._getAlter(n), src = _self._tabIndex(n, true);
            if (options.active === n) {
                return false;
            }
            if (options.onBeforeActivate && this._trigger("onBeforeActivate", event, n) === false) {
                return false;
            }
            var $a = $ul.find('li a[tabId=' + tabId + ']'), href = $a.attr("href");
            $a.parent().addClass(activatedCls).siblings().removeClass(activatedCls);
            //当选中了一个并未完全显示的页签,需要滚动让他完全显示出来
            /*if(_self._checkScroller()){
             //stop every animation.
             $ul.stop(true, true);
             $ele.clearQueue();
             //	            var $iconLeft = $ul.prev();
             //	            var $iconRight = $ul.next();
             var $iconRight = $ele.find('>div.panel-heading >div.fn');
             var $heading = $ele.find('>div.panel-heading');
             var lBorder = $a.parent().offset().left;
             var rBorder = lBorder + $a.parent().outerWidth(true);
             //	            var lDiff = $iconLeft.offset().left + $iconLeft.outerWidth(true) + 4 - lBorder ;
             var lDiff =  parseFloat($heading.css('padding-left')) - lBorder;
             var rDiff = $iconRight.offset().left - rBorder;
             if(lDiff >= 0){
             _self._scroll(lDiff, _self._scrollCbFn());
             }else if(rDiff <= 0){
             _self._scroll(rDiff, _self._scrollCbFn());
             }else{
             _self._scrollCbFn()();
             }
             }*/
            _self._scrollTo(n);
            if (_self._srcType(src) === 'page' && (options.leaveRefresh === true || $("#" + tabId).html() === "")) {
                _self._includeHtml(tabId, src, function () {
                    _self._activateThen(n, tabId, href, event);
                });
            } else {
                _self._activateThen(n, tabId, href, event);
            }
        },
        _activateThen: function (n, tabId, href, event) {
            var $ele = this.element, options = this.options;
            $ele.find('>div.tab-content >' + href).addClass('active').show().siblings().removeClass('active').hide();
            options.activeTabId = tabId;
            options.active = n;
            var _history = this._history, index = $.inArray(tabId, _history);
            index === -1 ? _history.push(tabId) : _history.push(_history.splice(index, 1)[0]);
            options.onActivate && this._trigger("onActivate", event, n);
        },
        /**
         * 将n处的页签关闭，如果关闭页签为当前激活页签，则关闭后激活下一个页签，如果不存在下一个页签，则激活第一个页签
         * n :页签的索引值，仅为数字类型（入参已做处理）
         */
        _close: function (n) {
            var $ele = this.element, options = this.options;
            n = (n === undefined ? options.active : n);
            var $headers = $ele.find('>div.panel-heading'), $content = $ele.find('>div.tab-content');
            var tabId = this._getAlter(n), tabsHeight = $ele.height();
            if (options.onBeforeClose && this._trigger("onBeforeClose", null, n) === false) {
                return false;
            }
            $headers.find('li').eq(n).remove();
            $content.children().eq(n).empty().remove();
            //in case of all tabs are closed, set body height
            if ($content.children().length === 0) {
                $content.css({height: tabsHeight - $headers.outerHeight()});
            }
            for (var i = this._history.length - 1; i >= 0; i--) {
                if (tabId === this._history[i]) {
                    this._history.splice(i, 1);
                    break;
                }
            }
            if (options.onClose) {
                this._trigger("onClose", null, n);
            }
            if (this._getLength() === 0) {
                options.active = -1;
                options.activeTabId = null;
                return;
            } else if (n === options.active) {
                if (n === this._getLength()) {
                    options.active = -1;
                    this._activate(0);
                } else {
                    options.active = -1;
                    this._activate(n);
                }
                this._buildDropDown();
            } else {
                n < options.active && options.active--;
                var $ul = $headers.find('>div.tab-listbox >ul');
                if (this._checkScroller()) {
                    $ul.stop(true, true);
                    $ele.clearQueue();
                    var $lastLi = $ul.children(':last');
                    var $firstLi = $ul.children(':first');
                    var $iconRight = $ele.find('>div.panel-heading >div.fn');
                    var lBorder = $lastLi.offset().left;
                    var rBorder = lBorder + $lastLi.outerWidth(true);
                    var lDiff = 4 - $firstLi.offset().left;
                    var rDiff = $iconRight.offset().left - rBorder;
                    if (rDiff > 0) {
                        this._scroll(rDiff, this._scrollCbFn());
                    } else {
                        this._scroll(lDiff, this._scrollCbFn());
                    }
                }
            }
        },
        /**
         * @name add() 增加一个tab到页签布局中
         * @param config{}
         * index: 新增页签的位置(在索引为index的页签之后)，支持tabId、'first'、'last'、'prev'、'next'; type: Number,String; default: 'last'
         * title: 页签标题; type: String; default: tabId
         * icon: 页签图标(i标签类名，仅支持内置图标样式); type: String,Boolean; default: false
         * src: 页签内容数据源，支持div、page、Function; type: url,function; default: 无; '#id'、'demo/demo-tree.html'、function(){return '<div>Hello World!</div>'}
         * closable: 页签是否可关闭; type: Boolean; default: false
         * activate: 是否激活; type: Boolean; default: true
         *
         */
        add: function (config) {
            var _self = this, $ele = this.element, options = this.options;
            if (options.onBeforeAdd && _self._trigger("onBeforeAdd", null, config) === false) {
                return false;
            }
            config = config || {};
            var _config = {
                title: config.title || 'tabId-' + options.random + '-' + options.id++,
                tabId: 'tabId-' + options.random + '-' + options.id++,
                icon: config.icon || false,
                closable: !!config.closable,
                activate: !!config.activate,
                index: config.index || 'last',
                content: config.src || undefined
            };
            if (_config.index === 'next') {
                _config.index = options.active;
            } else if (_config.index === 'first') {
                _config.index = -1;
                options.active++;
            } else {
                _config.index = _self._tabIndex(_config.index);
                if (_config.index < options.active) {
                    options.active++;
                } else if (_config.index === _self._getLength()) {
                    _config.index = -1;
                    options.active++;
                }
            }
            $ele.find('>div.tab-content').append('<div id="' + _config.tabId + '"></div>');
            $ele.find('#' + _config.tabId).hide();
            _config.href = "#" + _config.tabId;
            var $ul = $ele.find('>div.panel-heading >div.tab-listbox >ul');
            if (_config.index === -1) {
                $('<li><a tabId="' + _config.tabId + '" href="' + _config.href + '">' + _config.title + '</a></li>').insertBefore($ul.children('li:eq(0)'));
            } else {
                $('<li><a tabId="' + _config.tabId + '" href="' + _config.href + '">' + _config.title + '</a></li>').insertAfter($ul.children('li:eq(' + _config.index + ')'));
            }
            var $newLi = $ul.children('li:eq(' + (_config.index + 1) + ')');
            if (_config.icon) {
                $newLi.children('a').prepend('<i class="' + _config.icon + '"></i>');
            }
            if (_config.closable) {
                $('<i class="icon-error2"></i>').insertAfter($newLi.children('a'));
            }
            //在添加很多个页签后，当页签头的宽度超过5000px的时候出现换行。所以这里进行宽度自动扩充
            if ($ul.innerWidth() - $newLi.position().left < 500) {
                $ul.width($ul.width() + 500);
            }
            _self._checkScroller() && _self._enableScroller();
            if (_self._srcType(_config.content) === 'page') {
                _config.src = _config.content;
                $newLi.attr("src", _config.src);
                _self._includeHtml(_config.tabId, _config.src, function () {
                    if (_config.activate) {
                        _self._purgeEvent();
                        _self._buildEvent();
                        _self._trigger("onAdd", null, config);
                        _self._activate(_config.index + 1);
                    }
                });
            } else {
                _config.src = "#" + _config.tabId;
                $newLi.attr("src", _config.src);
                if (_config.content && $.isFunction(_config.content)) {
                    $ele.find('#' + _config.tabId).html(_config.content());
                    $.globalInit($ele.find('#' + _config.tabId));
                }
                _self._purgeEvent();
                _self._buildEvent();
                _self._trigger("onAdd", null, config);
                if (_config.activate) {
                    _self._activate(_config.index + 1);
                }
            }
        },
        /**
         * 根据新的数据源重新加载第n个页签的内容。
         * @name aeTabs#reload
         * @function
         * @param config.index : 页签索引（从0开始计数），支持 tabId、'first'、'last'、'prev'、'next'; type: Number,String; default: 无; 缺省则刷新当前页签内容
         * @param config.src : 页签内容数据源（必须参数），支持div和page; type: url,#id,String; default: 无; 缺省则不执行任何操作
         * @param config.activate : 是否激活该页签; type: Boolean; default: false
         * @example
         * //重新加载第一个页签的内容
         * var config = {
         * 		index : 0,
         * 		//src : '#demo-panel'
         * 		//src : 'demo/demo-panel'
         * 		src : '<div>Hello world.</div>'
         * }
         * $('#demo-tabs').aeTabs('reload', config);
         */
        reload: function (config) {
            if (!config || !config.src) {
                return;
            }
            var _config = {};
            var index = config.index === undefined ? this.options.active : config.index;
            _config.index = this._tabIndex(index);
            if (_config.index < 0) {
                _config.index = 0;
            } else if (_config.index > this._getLength() - 1) {
                _config.index = this._getLength() - 1;
            }
            var type = this._srcType(config.src);
            if (type === 'div') {
                _config.content = $(config.src).prop("outerHTML");
            } else if (type === 'page') {
                _config.url = config.src;
            } else if ($.isFunction(config.src)) {
                _config.content = config.src();
            }
            _config.activate = (config.activate === 'true' || config.activate === true) ? true : false;
            this._reload(_config);
        },
        _reload: function (_config) {
            var href = this._tabIndex(_config.index, false, true);
            if (_config.url) {
                this._includeHtml(href.split("#")[1], _config.url, function () {
                    //$.globalInit(href.split("#")[1]);
                    if (_config.activate) {
                        this._activate(_config.index);
                    }
                    if (this.options.onReload) {
                        this._trigger('onReload', null, _config.index);
                    }
                });
            } else if (_config.content) {
                $(href).html(_config.content);
                $.globalInit(href.split("#")[1]);
                if (_config.activate) {
                    this._activate(_config.index);
                }
                if (this.options.onReload) {
                    this._trigger('onReload', null, _config.index);
                }
            } else {
                $(href).empty();
                if (_config.activate) {
                    this._activate(_config.index);
                }
                if (this.options.onReload) {
                    this._trigger('onReload', null, _config.index);
                }
            }
        },
        /**
         * 一般滚动之后都需要执行回调_enableScroller设置滚动条的状态，现包装成方法。
         */
        _scrollCbFn: function () {
            var _self = this;
            return function () {
                _self._enableScroller();
                _self._buildDropDown();
            };
        },
        /**
         * 将页签头部往右边滑动distance的距离。当distance为负数时，表示往左边滑动；fn为回调函数
         */
        _scroll: function (distance, fn) {
            var _self = this, $ele = this.element, options = this.options;
            var $ul = $ele.find('>div.panel-heading >div.tab-listbox >ul'),
                $heading = $ele.find('>div.panel-heading'),
                $lastLi = $ul.children(':last'),
                $firstLi = $ul.children(':first'),
                $leftFn = $ele.find('>div.panel-heading >div.fn >span:first'),
                $rightFn = $ele.find('>div.panel-heading >div.fn >span:eq(1)');
            if (distance === 0 || !options._scrollable) {
                return;
            }
//	        var scrOffset = distance > 0 ? $ul.prev().offset() : $ul.next().offset();
            var offsetFn = $leftFn.parent().offset();
            var queuedFn = function (next) {
                if ((distance < 0 && $rightFn.hasClass(scrollDisabled)) || (distance > 0 && $leftFn.hasClass(scrollDisabled))) {
                    $ul.stop(true, true);
                    $ele.clearQueue();
                    return;
                }
                var flag = false;
                //fix distance.
                var lfix = Math.min(Math.abs($firstLi.offset().left) + parseFloat($heading.css('padding-left')), distance);
                var rfix = Math.min(($lastLi.offset().left + $lastLi.outerWidth(true) - offsetFn.left), Math.abs(distance));
                if (Math.abs(Math.abs(parseFloat($ul.css('left'))) - Math.abs(lfix)) < 5) {
                    lfix = Math.abs(parseFloat($ul.css('left')));
                }
                distance = (distance > 0) ? '+=' + lfix : '-=' + rfix;
                _self.isScrolling = true;
                if (Math.abs(distance) < 3) {//归位的时候可能有计算误差
                    distance = 0;
                }
                $ul.animate({
                    left: distance + 'px'
                }, 'normal', 'swing', function () {
                    if (typeof(fn) === "function") {
                        fn();
                    }
                    _self.isScrolling = false;
                    next();
                });
            };
            $ele.queue(queuedFn);
            if ($ele.queue().length == 1 && !_self.isScrolling) {
                $ele.dequeue(); //start queue
            }
        },
        /**
         * 如果tab页签总宽度较大，则显示scroll并计算dropDown返回true；否则删除scroll和dropDown并返回false。
         */
        _checkScroller: function () {
            var $ele = this.element, options = this.options;
            if (!options._scrollable) {
                return false;
            }
            var $ul = $ele.find(">div.panel-heading >div.tab-listbox >ul");
            var $div = $ele.find(">div.panel-heading >div.tab-listbox");
            var totalWidth = 4;  // padding
            $ul.children().each(function () {
                //计算一个li占用的总宽度
                totalWidth += $(this).outerWidth(true);//sub element's width
            });
            if (totalWidth > $ul.parent().parent().innerWidth()) {
                if ($div.siblings().length === 0) {
                    //构建 iconLeft、iconRight、 dropDown 按钮及 下拉层
                    var $divFn = $('<div></div>').insertAfter($div).addClass('fn');
                    $('<span><i class="icon-arrowleft-little"></i></span>').appendTo($divFn);
                    $('<span><i class="icon-arrowright-little"></i></span>').appendTo($divFn);
                    $('<span><i class="icon-arrowlup-down"></i></span>').appendTo($divFn);
                    $('<ul></ul>').addClass('dropdown-menu').css('display', 'none').insertAfter($divFn);
                    options.tools = true;
                    options._dropDown = [];
                }
                return true;
            } else {
                $div.siblings().remove();
                options.tools = false;
                return false;
            }
        },
        /**
         * 根据页签的位置，设置scroller的状态。
         * 当最右边的页签顶住组件右边沿，则右边的scroller应该禁用，表示不能再往右滚动了。
         * 当最左边的页签顶住组件左边沿，则左边的scroller应该禁用，表示不能再往左滚动了。
         */
        _enableScroller: function () {
            var $headers = this.element.find('>div.panel-heading'),
                $ul = $headers.find('>div.tab-listbox >ul');
            if ($headers.length === 0 || $ul.length === 0) {
                return false;
            }
            var $iconLeft = $headers.find('>div.fn >span').eq(0),
                $iconRight = $headers.find('>div.fn >span').eq(1),
                $liLast = $ul.children(':last'),
                lBorder = $headers.offset().left,
                rBorder = $iconLeft.offset().left,
                ulLeft = $ul.offset().left,
                ulRight = $liLast.offset().left + $liLast.outerWidth(true);
            $iconLeft.toggleClass(scrollDisabled, ulLeft >= lBorder);
            $iconRight.toggleClass(scrollDisabled, ulRight <= rBorder);
        },
        /**
         * 动态构建下拉层内容，展示被隐藏的页签标题
         * 点击左、右箭头时触发；点击页签时触发；
         * 当页签足够展示时，不出现左、右和dropDown箭头
         */
        _buildDropDown: function () {
            var _self = this, options = this.options, $ele = this.element;
            if (!options.tools) {
                return;
            }
            var $Lis = $ele.find('>div.panel-heading >div.tab-listbox >ul li');
            var $divFn = $ele.find('>div.panel-heading >div.fn');
            $Lis.each(function (index, item) {
                var tabId = _self._getAlter(index);
                if (($(item).offset().left + $(item).outerWidth(true)) > $divFn.offset().left || $(item).offset().left < 0) {
                    if ($.inArray(tabId, options._dropDown) === -1) {
                        options._dropDown.push(tabId);
                        $divFn.next('ul').append('<li><a tabId="' + tabId + '">' + $(item).children('a').html() + '</a></li>');
                    }
                } else {
                    if ($.inArray(tabId, options._dropDown) !== -1) {
                        options._dropDown.splice($.inArray(tabId, options._dropDown), 1);
                        var $li = $divFn.next('ul').find('li a[tabId=' + tabId + ']');
                        $li.parent('li').empty().remove();
                    }
                }
            });
            $ele.find('>div.panel-heading >ul li').unbind('click.aetabs').bind('click.aetabs', function (e) {
                $ele.find('>div.panel-heading >ul').slideUp();
                var tabId = $(e.target).attr("tabId");
                $(e.target).parent('li').empty().remove();
                var index = $.inArray(tabId, options._dropDown);
                options._dropDown.splice(index, 1);
                _self._activate(_self._getAlter(tabId));
            });
//    		_self._purgeEvent();
//    		_self._buildEvent();
        },
        /**
         * 引入外部页签内容
         */
        _includeHtml: function (tabId, src, callback) {
            var _self = this, options = this.options, $ele = this.element;
            $.ajax(src, {
                async: false,
                cache: false,
                success: function (data, textStatus, jqXHR) {
                    $("#" + tabId).html(data);
                    $.globalInit(tabId);
                    if (callback && $.isFunction(callback)) {
                        callback(data, textStatus, jqXHR);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $.message.error("", "", "tabs reloading error.");
                }
            });
        },
        /**
         * 对src做处理，返回'page'、'div'或 false
         */
        _srcType: function (src) {
            if (src && typeof src === 'string') {
                if (src.indexOf("#") === 0) {
                    return 'div';
                } else if (src.indexOf("#") !== 0 && src.indexOf('.html') === src.length - 5) {
                    return 'page';
                }
            } else {
                return false;
            }
        },
        /**
         * 获取页签索引值，从0开始计数
         * @name aeTabs#_tabIndex
         * @function
         * @param tabId : 索引、tabId、'first'、'last'、'next'、'prev'，最后一个页签的next是第一个，第一个页签的prev是最后一个
         * @param src : 是否返回tabId对应src值；type Boolean
         * @param href : 是否返回tabId对应href值，也即页签对应内容的id值（带#号）；type Boolean
         */
        _tabIndex: function (tabId, src, href) {
            var _self = this, $ele = this.element, options = this.options, n;
            var numRegExp = /\D/g;
            if (!numRegExp.test(tabId)) {
                n = parseInt(tabId, 10);
            } else if ($.inArray(tabId, options._activateType) === -1) {
                n = $ele.find('>div.panel-heading >div.tab-listbox >ul a[tabId=' + n + ']').parents('li:first').index();
            } else if ($.inArray(tabId, options._activateType) !== -1) {
                switch (tabId) {
                    case 'first':
                        n = 0;
                        break;
                    case 'last':
                        n = $ele.find('>div.panel-heading >div.tab-listbox >ul li:last').index();
                        break;
                    case 'prev':
                        n = (options.active - 1) >= 0 ? (options.active - 1) : _self._getLength();
                        break;
                    case 'next':
                        n = (options.active + 1) <= _self._getLength() ? (options.active + 1) : 0;
                        break;
                    default:
                        break;
                }
            }
            if (src) {
                src = $ele.find('>div.panel-heading >div.tab-listbox >ul li').eq(n).attr("src");
                return src;
            } else if (href) {
                href = $ele.find('>div.panel-heading >div.tab-listbox >ul li').eq(n).children('a').attr("href");
                return href;
            } else {
                return n;
            }
        },
        /**
         * 页签索引和tabId的转换器。
         * 如果传入的id为数字，则表示页签的索引，函数返回页签的tabId；如果id为字符串，则表示该页签的tabId，函数返回页签的索引。
         */
        _getAlter: function (id) {
            var $ele = this.element, options = this.options, rt;
            if (typeof id === 'number') {
                rt = $ele.find('>div.panel-heading >div.tab-listbox >ul li:eq(' + id + ') a').attr('tabId');
            } else if (typeof id === 'string') {
                $ele.find('>div.panel-heading >div.tab-listbox >ul li a').each(function (i) {
                    if ($(this).attr('tabId') == id) {
                        rt = i;
                        return false;
                    }
                });
            }
            //如果找不到要返回null,而不是undefined,这源于om-core.js中对于返回undefined，最终会返回组件实例
            return rt === undefined ? null : rt;
        },
        /**
         * 获得当前所有页签的数目
         */
        _getLength: function () {
            return this.element.find('>div.panel-heading >div.tab-listbox >ul').children().length;
        },
        /**
         * 重新计算aeTabs布局
         */
        _doLayout: function () {
            if (this._checkScroller()) {
                this._enableScroller();
            }
        },
        /**
         * 对组件重新布局，主要操作是刷新页签滚动箭头。
         * 如果有必要使用页签滚动箭头，则刷新滚动箭头的状态。如果没必要使用页签滚动箭头，则将存在的删除。
         * @name aeTabs#doLayout
         * @function
         * @example
         * //对组件重新布局，如果有必要使用页签滚动箭头，则刷新滚动箭头的状态。
         */
        doLayout: function () {
            this._doLayout();
        },
        /**
         * 关闭特定的页签，如果n指向当前页签，则会选中下一页签；如果当前页签是最末尾的页签，则会选中第一个页签。可以看到每关闭一个页签就会分别触发一次close事件和activate事件。
         * @name aeTabs#close
         * @function
         * @param n 要关闭的页签的位置（从0开始计数），或者该页签的tabId(一个全局唯一的字符串)。 如果未指定该参数，则默认关闭当前页签。
         * 支持入参为 'first'、'last'、'prev'、'next'
         * @example
         * //关闭第一个页签
         * $('#make-tab').aeTabs('close', 0);
         */
        close: function (n) {
            n = (n === undefined ? this.options.active : n);
            n = this._tabIndex(n);
            if (n < 0) {
                n = 0;
            } else if (n > this._getLength() - 1) {
                n = this._getLength() - 1;
            }
            this._close(n);
        },
        /**
         * 关闭所有页签，由于该操作只关注于删除所有页签，因此只会触发 onCloseAll事件，而不会逐个触发每个页签的onClose事件。
         * @name aeTabs#closeAll
         * @function
         * @example
         * //关闭所有页签
         * $('#make-tab').aeTabs('closeAll');
         */
        closeAll: function () {
            var $ele = this.element, options = this.options;
            var $headers = $ele.find('>div.panel-heading'), $content = $ele.find('>div.tab-content'), omtabsHeight = $ele.height();
            if (options.onBeforeCloseAll && this._trigger("onBeforeCloseAll", null) === false) {
                return false;
            }
            $headers.find('>div.tab-listbox >ul li').remove();
            $headers.find('>div.tab-listbox').siblings().remove();
            $content.empty();
            $content.css({height: omtabsHeight - $headers.outerHeight()});
            options.active = -1;
            options.activeTabId = null;
            this._history = [];
            options._dropDown = [];
            this._doLayout();
            if (options.onCloseAll) {
                this._trigger("onCloseAll", null);
            }
        },
        /**
         * 选中特定的页签，触发activate事件。
         * @name aeTabs#activate
         * @function
         * @param n 可为页签的索引（从0开始计数），或者页签的tabId
         * 支持入参为 'first'、'last'、'prev'、'next'
         * @example
         * //激活第一个页签
         * $('#make-tab').aeTabs('activate', 0);
         */
        activate: function (n) {
            if (!n && n !== 0) {
                return;
            }
            n = this._tabIndex(n);
            if (n < 0) {
                n = 0;
            } else if (n > this._getLength() - 1) {
                n = this._getLength() - 1;
            }
            this._activate(n);
        },
        /**
         * 页签索引和tabId的转换器。传入其中的一个值，获取另一个值。
         * @name aeTabs#getAlter
         * @function
         * @param id 标识符
         * @returns 如果id为数字，则表示页签的索引，函数返回页签的tabId；如果id为字符串，则表示该页签的tabId，函数返回页签的索引。
         *          如果索引不合法或者id作为tabId时找不到，则统一返回null。
         * @example
         * //获取第一个页签的tabId
         * var tabId = $('#make-tab').aeTabs('getAlter', 0);
         */
        getAlter: function (id) {
            return this._getAlter(id);
        },
        /**
         * 返回当前选中的页签的tabId。
         * @name aeTabs#getActivated
         * @function
         * @returns 当前选中页签的tabId
         * @example
         * //获取当前选中页签的tabId
         * var activatedTabId = $('#make-tab').aeTabs('getActivated');
         */
        getActivated: function () {
            return this.options.activeTabId;
        },
        /**
         * 获得所有页签的数目。
         * @name aeTabs#getLength
         * @function
         * @returns 页签的数目
         * @example
         * //获取页签的总数
         * var total = $('#make-tab').aeTabs('getLength');
         */
        getLength: function () {
            return this._getLength();
        },
        /**
         * 获得指定页签对象
         * @name aeTabs#getTabHeader
         * @function
         * @param n 可为页签的索引（从0开始计数），或者页签的tabId
         *        支持入参为 'first'、'last'、'prev'、'next'
         *        入参缺省则返回当前页签对象
         * @returns 页签对象
         * @example
         *    //获得指定页签对象
         *    var obj = $("#demo-tabs").aeTabs('getTabHeader',1);
         *    var num = obj.find('span.label-info').text();
         *    obj.find('span.label-info').text(parseInt(num,10)+1);
         */
        getTabHeader: function (n) {
            if (n === undefined) {
                n = this.options.active;
            } else {
                n = this._tabIndex(n);
                if (n < 0) {
                    n = 0;
                } else if (n > this._getLength() - 1) {
                    n = this._getLength() - 1;
                }
            }
            var obj = this.element.find('>div.panel-heading ul.nav >li').eq(n);
            return obj;
        }
    });
});

define('ui-offCanvas',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
/*
 * $Id : ui-sidebar.js$
 * Depends : ui-core.js
 * version : 1.0
 * The last modification time : 2015-1-28 19:59
 * log : 1.支持靠左侧边栏；
 * 		  2.支持四个方向侧边栏
 */
        /**
     * @name aeOffCanvas
     * @class menu组件。menu组件支持三种数据组织方式，分别为页面dom元素、json数据、url取值。<br/>
     *        基本的json格式为{id:"",text:"",icon:"img/abc.png",seperator:true,disabled:true,children:[{},{}]},其中的id和text必须设置，<br/>
     *        seperator为分割线，如果设置为true，则会在当前menuItem下面增加一条分割线。<br/><br/>
     *        组件默认会处理的属性为上面列举的6个，即id、text、icon、seperator、disabled、children。<br/>
     *        如果你自定义了某个属性，比如url，系统不会处理，它是在点击的时候交给onSelect方法处理，通过item.url获取url参数。
     * <b>特点：</b><br/>
     * <ol>
     *      <li>支持icon自定制</li>
     *      <li>灵活的事件处理机制，自由增加json属性，事件执行时获取数据进行处理</li>
     *      <li>支持动态改变menuItem的disabled属性</li>
     *      <li>支持右键菜单，无需指定位置，自动定位</li>
     *      <li>支持菜单分组，使用showSeparator属性配置</li>
     * </ol>
     *
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" &gt;
     * $(document).ready(function() {
     *      //menu定义
     *      $('#contextMenu').aeOffCanvas({
     *          contextMenu : true,
     *          dataSource : '../../aeOffCanvas.json'
     *      });
     *      //显示menu菜单
     *      $('#contextMenu_test').bind('contextmenu',function(e){
     *           $('#contextMenu').aeOffCanvas('show',e);
     *      });
     * });
     * &lt;/script&gt;
     * </pre>
     *
     * @constructor
     * @description 构造函数.
     * @param p 标准config对象：{}
     */
    $.aeWidget('ae.aeOffCanvas', {
        options: /**@lends aeOffCanvas# */{
        	/**
             * 防止重复初始化
             * @type Boolean
             * @default false
             */
    		initial : false,
    		/**
             * 侧边栏展开/收缩事件触发方式，鼠标点击或鼠标滑过
             * @type String
             * @default 'click'
             * @example
             * $("#demo-offCanvas").aeOffCanvas({'mouseMode':'mouseover'});
             */
    		mouseMode : 'click',
    		/**
             * 侧边栏位置，靠左（left）、靠右（right）、靠顶（top）、靠底（bottom）。
             * @type String
             * @default 'left'
             * @example
             * $("#demo-offCanvas").aeOffCanvas({'location':'right'});
             */
    		location : 'left',
    		/**
             * 侧边栏side宽度。
             * @type String
             * @default '15%'
             * @example
             * $("#demo-offCanvas").aeOffCanvas({'width':'15%'});
             */
    		width : '15%',
    		/**
             * 侧边栏side高度。
             * @type String
             * @default '15%'
             * @example
             * $("#demo-offCanvas").aeOffCanvas({'height':'15%'});
             */
    		height : '15%',
            /**
             * 侧边栏距离浏览器侧边的偏移量。
             * @type String
             * @default 0
             * @example
             * $("#demo-offCanvas").aeOffCanvas({'sideMargin':'10%'});
             */
    		sideMargin : 0,
            /**
             * 侧边栏展开/收缩平移效果，push - 将页面内容推开；overlay - 覆盖页面内容。
             * @type String
             * @default 'overlay'
             * @example
             * $("#demo-offCanvas").aeOffCanvas({'animEffect':'push'});
             */
//    		animEffect : 'overlay',
            /**
             * 侧边栏展开/收缩平移速度，单位为毫秒，数值越小，速度越快
             * @type Number
             * @default 500
             * @example
             * $("#demo-offCanvas").aeOffCanvas({'animSpeed','500'});
             */
    		animSpeed : 0,
    		/**
             * 侧边栏内置button，单击button可展开或隐藏侧边栏。
             * @type Boolean
             * @default false
             * @example
             * $("#demo-offCanvas").aeOffCanvas({'button',true});
             */
    		button : true,
    		/**
             * 当animEffect='push'时，可设置图钉小工具来固定悬浮框的位置，使内容区域展示出来，不被遮住，再次点击则恢复。
             * @type Boolean
             * @default false
             * @example
             * $("#demo-offCanvas").aeOffCanvas({'pushpin',true});
             */
    		pushpin : false,
            /**
             * 侧边栏背景颜色，支持颜色定义（red,blue,pink,purple,green等），支持RGB颜色定义。
             * @type String,RGB
             * @default '#fff'
             * @example
             * $("#demo-offCanvas").aeOffCanvas({'bgColor','fff'});
             */
            bgColor : '#fff',
            /**
             * 侧边栏背景不透明度，取值为0.0~1.0，默认值为1，完全不透明，取值为0表示完全透明。
             * @type Float,Number
             * @default 1
             * @example
             * $("#demo-offCanvas").aeOffCanvas({'opacity','0.5'});
             */
            opacity : 1,
            /**
             * 侧边栏初始化状态，打开或者关闭
             * @type String
             * @default 'close'
             * @example
             * $("#demo-offCanvas").aeOffCanvas({'initialMode','open'});
             */
            initialMode : 'close',
            /**
             * 当点击选择menu的时候触发的事件，item包含当前menuItem的所有数据。
             * @name aeOffCanvas#onSelect
             * @event
             * @param item 当前menuItem的所有数据
             * @param event jQuery.Event对象
             * @type Function
             * @default 无
             * @example
             * $("#demo-offCanvas").aeOffCanvas({
             *         onSelect:function(item,event){
             *            location.href = item.url;
             *         }
             * });
             */
            /**
             * 侧边栏初始化方式，默认通过html来设置参数。传值为js时，则通过js中设置的option来初始化。
             * @type String
             * @default 'html'
             * @example
             * $("#demo-offCanvas").aeOffCanvas({initType : 'js'});
             */
            initType : 'html'
        },
        _create:function(){
            var self = this,
				options = self.options,
				$ele = self.element,
				id=$ele.attr("id");

            if(options.initial){
				return;
			}
			if(id){
				$ele.attr("aeId",id);
			}
            if(options.initType == 'html'){
            	this._buildOptions(options, $ele);
            }
            $ele.attr("aeType",(options.aeType || "aeOffCanvas"));
	    	$ele.attr("uiid",options.uiid?options.uiid:$ele.attr("id"));

	        var $side = $ele.find("[name='offCanvas_side']");
	        if($side.length === 0){
	        	$side = $ele.children(":first");
	        	$side.attr("name","offCanvas_side");
	        }

	        var sideData = options.sideData = {};
	        sideData.width = options.width;
	        sideData.height = options.height;
	        sideData.cssTop = $side.css("top");
	        sideData.cssBottom = $side.css("bottom");
	        sideData.cssLeft = $side.css("left");
	        sideData.cssRight = $side.css("right");

	        options.bodyWidth = $(document.body).outerWidth(true);
    		options.bodyHeight = $(document.body).outerHeight(true);

	        $side.width(options.width);
        	$side.height(options.height);
	        $ele.addClass("offCanvas_content");
	        $side.addClass("offCanvas_side");
	        $ele.children().css({"background":options.bgColor,"opacity":options.opacity});
            options.initial = true;
        },
        _init : function(){
        	var self = this, options = self.options, $ele = self.element;
        	var $side = $ele.find("[name='offCanvas_side']");
        	if(options.initialMode == "close"){
        		options.side = false;
        	}else{
        		options.side = true;
        	}

 	        var obj = self._getSideLocation(!options.side);
 	        $side.css(obj);

        	if(options.button){
        		self._offCanvasButton();
        	}
        },
        _buildOptions:function(options,element){
    		options.aeType = element.attr("aeType");
    		options.uiid = element.attr("uiid");
    		options.mouseMode = element.attr("mouseMode") || options.mouseMode;
    		options.location = element.attr("location") || options.location;
//    		options.animEffect = element.attr("animEffect") || options.animEffect;
    		options.animSpeed = parseInt(element.attr("animSpeed")) || options.animSpeed;
    		options.width = element.attr("width") || options.width;
    		options.height = element.attr("height") || options.height;
    		options.sideMargin = element.attr("sideMargin") || options.sideMargin;
    		options.bgColor = element.attr("bgColor") || options.bgColor;
    		options.opacity = element.attr("opacity") || options.opacity;
    		options.initialMode = element.attr("initialMode") || options.initialMode;

    		/*if(options.animEffect == "push"){
    			options.pushpin = element.attr("pushpin")=='true' ? true : options.pushpin;
    		}*/
//    		options.pushpin = element.attr("pushpin")=='true' ? true : options.pushpin;
        	options.button = element.attr("button")=='false' ? false : options.button;


    		var onBeforeOpen = element.attr("onBeforeOpen");
    		options.onBeforeOpen=onBeforeOpen ? function(event){
				if($.isString(onBeforeOpen)){
					var i = onBeforeOpen.indexOf("(");
					var actName = i>0 ? onBeforeOpen.substring(0, i) : onBeforeOpen;
					var func = 	"return window."+actName+"?"+actName+".call(window, e):false;";
					return new Function("e",func)(event);
				}
	        }: '';
	        var onAfterOpen = element.attr("onAfterOpen");
    		options.onAfterOpen=onAfterOpen ? function(event){
				if($.isString(onAfterOpen)){
					var i = onAfterOpen.indexOf("(");
					var actName = i>0 ? onAfterOpen.substring(0, i) : onAfterOpen;
					var func = 	"return window."+actName+"?"+actName+".call(window, e):false;";
					return new Function("e",func)(event);
				}
	        }: '';
	        var onBeforeClose = element.attr("onBeforeClose");
    		options.onBeforeClose=onBeforeClose ? function(event){
				if($.isString(onBeforeClose)){
					var i = onBeforeClose.indexOf("(");
					var actName = i>0 ? onBeforeClose.substring(0, i) : onBeforeClose;
					var func = 	"return window."+actName+"?"+actName+".call(window, e):false;";
					return new Function("e",func)(event);
				}
	        }: '';
	        var onAfterClose = element.attr("onAfterClose");
    		options.onAfterClose=onAfterClose ? function(event){
				if($.isString(onAfterClose)){
					var i = onAfterClose.indexOf("(");
					var actName = i>0 ? onAfterClose.substring(0, i) : onAfterClose;
					var func = 	"return window."+actName+"?"+actName+".call(window, e):false;";
					return new Function("e",func)(event);
				}
	        }: '';
        },
        _open : function(){
        	var self = this, options = self.options, $ele = self.element;
        	var $side = $ele.find("[name='offCanvas_side']");
        	if(options.side){
        		return;
        	}
        	if (options.onBeforeOpen && self._trigger("onBeforeOpen",null) === false) {
                return false;
            }
//        	$ele.css("z-index",1);
        	var obj = self._getSideLocation(!!options.side);
        	$side.animate(obj,options.animSpeed);

        	if(options.button){
        		self._btnOpen();
        	}
        	if (options.onAfterOpen) {
        		self._trigger("onAfterOpen",null);
            }
        	options.side = true;
        },
        _close : function(){
        	var self = this, options = self.options, $ele = self.element;
        	var $side = $ele.find("[name='offCanvas_side']");
        	if(!options.side){
        		return;
        	}
        	if (options.onBeforeClose && self._trigger("onBeforeClose",null) === false) {
                return false;
            }
        	var $ext;
        	if(options.button){
        		var $btn = $ele.find("[name='offCanvasBtn']");
        		$ext = $btn.siblings(":not([name='offCanvas_side'])");
        	}else{
        		$ext = $side.siblings();
        	}
        	if($ext.length>0){
        		$ext.hide();
        	}

        	var obj = self._getSideLocation(!!options.side);
        	$side.animate(obj,options.animSpeed);
//        	$side.animate(obj,options.animSpeed,"linear",function(){$ele.css("z-index",-1);});

        	if(options.button){
        		self._btnClose();
        	}
        	if (options.onAfterClose) {
        		self._trigger("onAfterClose",null);
            }
        	options.side = false;
        },
        _getSideLocation : function(open){
        	var self = this, options = self.options, $ele = self.element;
        	var sideData = options.sideData;
        	var obj, sideMargin;
        	if(open === undefined){
        		open = options.side;
        	}
        	if(options.location == "top"){
        		//靠顶侧边栏
//        		minus = self._calculator(sideData.height,3,-1);
        		sideMargin = self._calculator(options.sideMargin,2,sideData.height);
	        	sideData.leftOpen = sideData.leftClose = 0;
	        	sideData.topOpen = sideData.topClose = 0;
	        	sideData.topClose = sideMargin;
				if(open === false){
					obj = {"top":sideData.topOpen/*,"left":sideData.leftOpen*/};
				}else{
					obj = {"top":sideData.topClose/*,"left":sideData.leftClose*/};
				}
        	}else if(options.location == "bottom"){
        		//靠底侧边栏
//        		minus = self._calculator(sideData.height,3,-1);
        		sideMargin = self._calculator(options.sideMargin,2,sideData.height);
	        	sideData.leftOpen = sideData.leftClose = 0;
	        	sideData.bottomOpen = sideData.bottomClose = 0;
	        	sideData.bottomClose = sideMargin;
				if(open === false){
					obj = {"bottom":sideData.bottomOpen/*,"left":sideData.leftOpen*/};
				}else{
					obj = {"bottom":sideData.bottomClose/*,"left":sideData.leftClose*/};
				}
        	}else if(options.location == "right"){
        		//靠右侧边栏
//        		minus = self._calculator(sideData.width,3,-1);
        		sideMargin = self._calculator(options.sideMargin,2,sideData.width);
	        	sideData.topOpen = sideData.topClose = 0;
	        	sideData.rightOpen = sideData.rightClose = 0;
	        	sideData.rightClose = sideMargin;
				if(open === false){
					obj = {/*"top":sideData.topOpen,*/"right":sideData.rightOpen};
				}else{
					obj = {/*"top":sideData.topClose,*/"right":sideData.rightClose};
				}
        	}else{
        		//靠左侧边栏
//        		minus = self._calculator(sideData.width,3,-1);
        		sideMargin = self._calculator(options.sideMargin,2,sideData.width);
	        	sideData.topOpen = sideData.topClose = 0;
	        	sideData.leftOpen = sideData.leftClose = options.sideMargin;
	        	sideData.leftClose = sideMargin;
				if(open === false){
					obj = {/*"top":sideData.topOpen,*/"left":sideData.leftOpen};
				}else{
					obj = {/*"top":sideData.topClose,*/"left":sideData.leftClose};
				}
        	}
        	return obj;
        },
        _btnOpen : function(){
        	var self = this, options = self.options, $ele = self.element;
        	var $btn = $ele.find("[name='offCanvasBtn']");
        	var obj = self._getBtnLocation(!!options.side);
    		$btn.animate(obj,options.animSpeed);
    		$btn.removeClass("offCanvas_close_btn_"+options.location).addClass("offCanvas_open_btn_"+options.location);
        },
        _btnClose : function(){
        	var self = this, options = self.options, $ele = self.element;
        	var $btn = $ele.find("[name='offCanvasBtn']");
        	var obj = self._getBtnLocation(!!options.side);
    		$btn.animate(obj,options.animSpeed);
    		$btn.removeClass("offCanvas_open_btn_"+options.location).addClass("offCanvas_close_btn_"+options.location);
        },
        _offCanvasButton : function(){
        	var self = this, options = self.options, $ele = self.element;
        	var btnData = options.btnData = {};
        	var sideData = options.sideData;
        	var obj,btnClass;
        	btnClass = "offCanvas_close_btn_"+options.location;
        	if(options.side){
        		btnClass = "offCanvas_open_btn_"+options.location;
        	}
    		var btnHtml = '<div name="offCanvasBtn">&nbsp;</div>';
    		$ele.prepend(btnHtml);
    		var $btn = $ele.find("[name='offCanvasBtn']");
    		$btn.addClass(btnClass);
    		btnData.width = $btn.width();
    		btnData.height = $btn.height();

    		obj = self._getBtnLocation(!options.side);
			$btn.css(obj);

    		if(options.mouseMode == "mouseover"){
    			$btn.mouseover(function(){
        			if(options.side){
        				self._close();
        			}else{
        				self._open();
        			}
        		});
    		}else{
    			$btn.click(function(){
        			if(options.side){
        				self._close();
        			}else{
        				self._open();
        			}
        		});
    		}
        },
        _getBtnLocation : function(open){
        	var self = this, options = self.options, $ele = self.element;
        	var sideData = options.sideData, btnData = options.btnData;
        	var obj, half, margin, btnMargin;
        	if(open === undefined){
        		open = options.side;
        	}
        	if(options.location == "top"){
        		half = self._calculator(sideData.width,4,2);
        		half = self._calculator(half,2,btnData.width/2);
        		if(sideData.cssLeft !== "auto"){
        			margin = self._calculator(sideData.cssLeft,1,half);
        			btnData.leftOpen = btnData.leftClose = margin;
        		}else{
        			if(sideData.cssRight !== "auto"){
        				margin = self._calculator(sideData.cssRight,1,half);
            			btnData.rightOpen = btnData.rightClose = margin;
        			}else{
        				btnData.leftOpen = btnData.leftClose = half;
        			}
        		}
        		btnMargin = self._calculator(options.sideMargin,1,sideData.height);
        		btnData.topOpen = btnMargin;
				btnData.topClose = options.sideMargin;
				if(open === false){
					obj = {"top":btnData.topOpen,"left":btnData.leftOpen,"right":btnData.rightOpen};
				}else{
					obj = {"top":btnData.topClose,"left":btnData.leftClose,"right":btnData.rightClose};
				}
        	}else if(options.location == "bottom"){
        		half = self._calculator(sideData.width,4,2);
        		half = self._calculator(half,2,btnData.width/2);
        		if(sideData.cssLeft !== "auto"){
        			margin = self._calculator(sideData.cssLeft,1,half);
        			btnData.leftOpen = btnData.leftClose = margin;
        		}else{
        			if(sideData.cssRight !== "auto"){
        				margin = self._calculator(sideData.cssRight,1,half);
            			btnData.rightOpen = btnData.rightClose = margin;
        			}else{
        				btnData.leftOpen = btnData.leftClose = half;
        			}
        		}
        		btnMargin = self._calculator(options.sideMargin,1,sideData.height);
        		btnData.leftOpen = btnData.leftClose = half;
        		btnData.bottomOpen = btnMargin;
				btnData.bottomClose = options.sideMargin;
				if(open === false){
					obj = {"bottom":btnData.bottomOpen,"left":btnData.leftOpen,"right":btnData.rightOpen};
				}else{
					obj = {"bottom":btnData.bottomClose,"left":btnData.leftClose,"right":btnData.rightClose};
				}
        	}else if(options.location == "right"){
        		half = self._calculator(sideData.height,4,2);
        		half = self._calculator(half,2,btnData.height/2);
        		if(sideData.cssTop !== "auto"){
        			margin = self._calculator(sideData.cssTop,1,half);
        			btnData.TopOpen = btnData.TopClose = margin;
        		}else{
        			if(sideData.cssBottom !== "auto"){
        				margin = self._calculator(sideData.cssBottom,1,half);
            			btnData.rightOpen = btnData.rightClose = margin;
        			}else{
        				btnData.bottomOpen = btnData.bottomClose = half;
        			}
        		}
        		btnMargin = self._calculator(options.sideMargin,1,sideData.width);
        		btnData.topOpen = btnData.topClose = half;
        		btnData.rightOpen = btnMargin;
				btnData.rightClose = options.sideMargin;
				if(open === false){
					obj = {"top":btnData.topOpen,"right":btnData.rightOpen,"bottom":btnData.bottomOpen};
				}else{
					obj = {"top":btnData.topClose,"right":btnData.rightClose,"bottom":btnData.bottomClose};
				}
        	}else{
        		half = self._calculator(sideData.height,4,2);
        		half = self._calculator(half,2,btnData.height/2);
        		if(sideData.cssTop !== "auto"){
        			margin = self._calculator(sideData.cssTop,1,half);
        			btnData.TopOpen = btnData.TopClose = margin;
        		}else{
        			if(sideData.cssBottom !== "auto"){
        				margin = self._calculator(sideData.cssBottom,1,half);
            			btnData.rightOpen = btnData.rightClose = margin;
        			}else{
        				btnData.bottomOpen = btnData.bottomClose = half;
        			}
        		}
        		btnMargin = self._calculator(options.sideMargin,1,sideData.width);
        		btnData.topOpen = btnData.topClose = half;
        		btnData.leftOpen = btnMargin;
				btnData.leftClose = options.sideMargin;
				if(open === false){
					obj = {"top":btnData.topOpen,"left":btnData.leftOpen,"bottom":btnData.bottomOpen};
				}else{
					obj = {"top":btnData.topClose,"left":btnData.leftClose,"bottom":btnData.bottomClose};
				}
        	}
        	return obj;
        },
        _calculator : function(data,operator,num){
        	var newData, unit1, unit2;
        	if(typeof data == "string"){
        		if(data.indexOf("%") != -1){
        			unit1 = "%";
        		}else if(data.indexOf("px") != -1){
        			unit1 = "px";
        		}
        		data = parseInt(data);
        	}
        	if(typeof num == "string"){
        		if(num.indexOf("%") != -1){
        			unit2 = "%";
        		}else if(num.indexOf("px") != -1){
        			unit2 = "px";
        		}
        		num = parseInt(num);
        	}
        	switch(operator){
	    	    case 1 :	//+
	    	    	newData = data + num;
	    	   	    break;
	    	    case 2 :	//-
	    	    	newData = data - num;
	    	   	    break;
	    	    case 3 :	//*
	    	    	newData = data * num;
	    	   	    break;
	    	    case 4 :	///
	    	    	newData = data / num;
	    	   	    break;
	    	    case 5 :	//%
	    	    	newData = data % num;
	    	   	    break;
	    		default :
	    			return false;
	    	}
        	if(unit1 !== undefined || unit2 !== undefined){
        		if(unit1 == unit2){
        			newData += unit1;
        		}else{
        			unit1 = unit2 || unit1;
        			newData += unit1;
        		}
        	}
        	return newData;
        },
        /**
         * 打开侧边栏
         * @name aeOffCanvas#open
         * @param
         * @example
         * $('#demo-offCanvas').aeOffCanvas('open');
         */
        open : function(){
        	this._open();
        },
        /**
         * 关闭侧边栏
         * @name aeOffCanvas#close
         * @param
         * @example
         * $('#demo-offCanvas').aeOffCanvas('close');
         */
        close : function(){
        	this._close();
        },
        /**
         * 重新加载侧边栏数据
         * @name aeOffCanvas#reload
         * @param url 一个有效的页面文件地址
         * @example
         * $('#demo-offCanvas').aeOffCanvas('reload',url);
         */
        reload : function(url){
        	return;
        	var self = this, options = this.options, $ele = this.element;
        	if(url){
        		data = self._transformToNodes(data);
            	$ele.empty();
    	       	$ele.append(self._appendNodes.apply(self, [data]));
                self._bindEvent();
        	}
        }
    });
});

define('ui-irguide',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
	/*
	 * $Id: ui-irguide.js$
	 * Depends : ui-dialog.js, $.includeHtml(), $.globalInit()
	 * version : 3.1
	 * The last modification time : 2015-6-20 18:45
	 * TODO ：	复杂路径逻辑验证 path="[['a','b','c'],['d','e']]" ；
	 * 			复杂跳转路基验证；
	 * 			button - dialog组件逻辑；	ok ---- 2015-6-20 14:34
	 * 			width、height自适应；
	 * 			数据传递；
	 * log : bootstrap 风格组件初步封装完成； 2015-6-20 14:35
	 * 		 修复组件 _trigger bug; 2015-6-17 20:56
	 * 		修复组件bug，不在做引入page页的硬式初始化，解决引入页面combo数据reload失败问题； 2015-6-19 17:55
	 * 		新增属性button，buttonRenderer, 支持内置button和自定义button;新增事件 onConfirm,onCancel仅在内置button为true时生效；2015-6-20 14:35
	 * 		修改事件触发顺序逻辑； 2015-6-20 17:17
	 * 		新增方法 setData、getData；next和prev事件增加参数 data；2015-6-20 18:45
	 *
	 */
	/**
     * @name aeIrguide
     * @class 不可逆向导组件，用于多级跳转。
     *
     * @特点：
     * <ol>
     *      <li>仅用于弹出窗</li>
     *      <li>页面中当同一个弹出页面（popup）需要打开/跳转另外一个不可逆的新增、选取、补充信息返回前一个弹窗的新页面时，需要用不可逆向导标签页多级跳转</li>
     *      <li>必须设置不可逆向导标签属性src，其值为该标签所对应内容 div 的 id 值；或者外部page路径；
     *      	 示例： <li src="#myStepOneId"><a>StepOne</a></li>
         			   <li src="demo/demo-panel.html"><a>StepTwo</a></li>
     *      </li>
     *      <li>内置 button 满足基本的不可逆向导功能需求，支持自定义 button</li>
     * </ol>
     *
     * @数据结构如下
     *
     *
     * @页面上的html标记如下
     * <pre>
        <button class="btn btn-primary btn-lg" onclick="start()">演示不可逆向导</button>
		<div id="demo-irguide" aeType="aeIrguide" aeInit="true" style="display:none" button="true">
			<ul>
				<li src="#t1"><a> Basic Info</a></li>
				<li src="#t2"><a> Basic Info</a></li>
				<li src="#t3"><a> Basic Info</a></li>
				<li src="#t4"><a> Product Info</a></li>
			</ul>
			<div id="t1">t111111111111111111
				<button type="button" class="btn btn-default btn-sm" onclick="next()">next</button>
			</div>
			<div id="t2">t222222222222222222
				<button type="button" class="btn btn-default btn-sm" onclick="next()">next</button>
			</div>
			<div id="t3">t333333333333333333
				<button type="button" class="btn btn-default btn-sm" onclick="next()">next</button>
			</div>
			<div id="t4">t444444444444444444
				<button type="button" class="btn btn-default btn-sm" onclick="next()">next</button>
			</div>
		</div>

     * </pre>
     * @最终展示页面代码如下
     *
     *
     * @constructor
     * @description 构造函数.
     * @param
     */
$.aeWidget("ae.aeIrguide", {
	options: /**@lends aeIrguide#*/{
		/**
         * 是否执行组件初始化
         * @type Boolean
         * @default false
         */
		_initial : false,
		/**
		 * 组件跳转路径
		 * 缺省表示仅有单个路径，按页面li的书写顺序跳转
		 * 复杂跳转路径必须设置path
		 * @example
		 * <div id="demo-irguide" aeType="aeIrguide" aeInit="true" path="[['a','b','c'],['d','e']]">
				<ul>
					<li stepId="a" src="#basic"><a> Basic Info</a></li>
					<li stepId="b" src="demo/step2.html"><a> Product Info</a></li>
					<li stepId="c" src="demo/step3.html"><a> Product Info</a></li>
					<li stepId="d" src="demo/step4.html"><a> Product Info</a></li>
					<li stepId="e" src="demo/step5.html"><a> Product Info</a></li>
				</ul>
				<div id="basic">basic</div>
			</div>
		 * @type Array
		 * @default 无
		 */
		path : [],
		/**
         * 不可逆向导弹窗标题，直接调用 ui-dialog
         * @type String
         * @default 无
         */
		title : '',
		/**
         * 不可逆导航宽度
         * @type Number
         * @default 'auto'
         */
		width : 'auto',
		/**
         * 不可逆导航高度
         * @type Number
         * @default 'auto'
         */
		height : 'auto',
		/**
         * 是否配置向导按钮
         * 内置button为Confirm、Cancel，提供默认事件，支持自定义绑定事件
         * @type Boolean
         * @default false
         */
		button : false,
		/**
         * 自定义button
         * 当自定义button时，内置button不再生效
         * @type Function
         * @default 无
         */
		buttonRenderer : undefined,
		/**
         * 初始化方式，默认通过html来设置参数。传值为js时，则通过js中设置的option来初始化。
         * @type String
         * @default 'html'
         * @example
         * $('#demo-irguide').aeIrguide({initType : 'js'});
         */
        initType : 'html'
	},
	_create: function() {
		var _self = this,
			options = this.options,
			$ele = this.element,
			id=$ele.attr("id");

		if(options._initial === true){
			return;
		}
		if(id){
			$ele.attr("aeId",id);
		}
		if(options.initType === 'html'){
			_self._buildOptions(options,$ele);
        }

        //处理结构
        $ele.addClass("modal-body");
        $ele.find(">ul:first").addClass("nav nav-justified nav-pills nav-wizard");
        if($ele.children(':not(ul.nav)').length){
        	$ele.children(':not(ul.nav)').wrapAll('<div class="tab-content"></div>');
        }else{
        	$ele.find('>ul.nav').after('<div class="tab-content"></div>');
        }
        $ele.find('>div.tab-content').children()/*.addClass('tab-pane')*/.hide();
        //处理button
        if(options.buttonRenderer){
        	$ele.append(options.buttonRenderer());
        }else if(options.button){
        	var button = '<div class="aeIrguidebutton" style="float:right">'+
					'<button type="button" class="btn btn-primary">Confirm</button>&nbsp;'+
					'<button type="button" class="btn btn-default">Cancel</button>'+
				'</div>';
			$ele.append(button);
			_self._bindButtonEvent();
        }

        //处理路径
        var $content = $ele.find('>div.tab-content');
		$ele.find('>ul.nav li').each(function(index,item){
			if(options.path === undefined){
				if(!$(item).attr("stepId")){
					var pre = (((1+Math.random())*0x10000)|0).toString(16).substring(1);
					var i = index.toString();
					$(item).attr("stepId","stepid"+i+pre);
				}
				options._path.push($(item).attr("stepId"));
			}
			var stepId = $(item).attr("stepId");
			var src = $(item).attr("src");
			options._src[stepId] = src;
			if(_self._srcType(src) === 'page'){		//内容为page
            	$content.append('<div stepId="'+stepId+'" style="display:none;"></div>');

            }else if(_self._srcType(src) === 'div'){	//内容为div
            	if(!$content.find(">"+src).length){
            		var outerHTML = $(src).prop("outerHTML") || '<div id="'+src.split("#")[1]+'"></div>';
            		$(src).remove();
            		$content.append(outerHTML);
            	}
            	$(src).attr("stepId",stepId).hide();
            }
			$(item).children('a').hide();
			options._liObject[stepId] = $(item).prop('outerHTML');
		});
		options.path = options.path || options._path;
		_self._structuringPath(options.path);
        options._initial = true;
	},
	_init : function() {
		this.element.find(">ul.nav").empty();
		this.options._history = [];
		this.options._active = undefined;
		this.options._activePath = [];
		this.options._activeLiArray = [];
	},
	_buildOptions : function(options,element){
		options._liObject = [];
		options._src = [];
		options.id = element.attr("id");
		options.title = element.attr("title") || undefined;
		options.button = element.attr("button") == "true" ? true : options.button;
		options.width = parseInt(element.attr("width"),10) || options.width;
		options.height = parseInt(element.attr("height"),10) || options.height;
		var path = element.attr("path");
		if(path && path.indexOf("[") !== -1){
			path = $.trim(path);	//去除字符串两端空格
			options.path = $.parseJSON(path);
		}else{
			options.path = undefined;
			options._path = [];
		}

		var buttonRenderer = element.attr("buttonRenderer");
		options.buttonRenderer = buttonRenderer ? function(){
			if($.isString(buttonRenderer)){
				var i = buttonRenderer.indexOf("(");
				var actName = i>0 ? buttonRenderer.substring(0, i) : buttonRenderer;
				var func = 	"return window."+actName+"?"+actName+".call(window):false;";
				return new Function(func)();
			}
        } : undefined;
        options.button = options.buttonRenderer ? false : options.button;

        this._buildSimpleEvent(options, 'onBeforeStart', element.attr("onBeforeStart"));
        this._buildSimpleEvent(options, 'onStart', element.attr("onStart"));
        this._buildSimpleEvent(options, 'onBeforeClose', element.attr("onBeforeClose"));
        this._buildSimpleEvent(options, 'onClose', element.attr("onClose"));

        this._buildOptionEvent(options, 'onBeforeNext', element.attr("onBeforeNext"));
        this._buildOptionEvent(options, 'onNext', element.attr("onNext"));
        this._buildOptionEvent(options, 'onBeforePrev', element.attr("onBeforePrev"));
        this._buildOptionEvent(options, 'onPrev', element.attr("onPrev"));

        if(options.button){
        	this._buildOptionEvent(options,'onConfirm',element.attr("onConfirm"));
        	this._buildOptionEvent(options,'onCancel',element.attr("onCancel"));
        }
	},
	_buildSimpleEvent : function(options, evtName, evtValue){
		options[evtName] = evtValue ? function(event){
    		if($.isString(evtValue)){
				var i = evtValue.indexOf("(");
				var actName = i>0 ? evtValue.substring(0, i) : evtValue;
				var func = "return window."+actName+"?"+actName+".call(window,e):false;";
				return new Function("e",func)(event);
			}
    	} : undefined;
	},
	_buildOptionEvent : function(options,evtName,evtValue){
		options[evtName] = evtValue ? function(active, data, event){
    		if($.isString(evtValue)){
				var i = evtValue.indexOf("(");
				var actName = i>0 ? evtValue.substring(0, i) : evtValue;
				var func = "return window."+actName+"?"+actName+".call(window,a,d,e):false;";
				return new Function("a","d","e",func)(active, data, event);
			}
    	} : undefined;
	},
	_bindButtonEvent : function(){
		var _self = this, options = this.options, $ele = this.element;
		$ele.find('>div.aeIrguidebutton >button:first').bind("click.aeIrguidebutton",function(event){
			if(options.onConfirm){
				_self._trigger("onConfirm", event, options._active, options._data);
			}
			_self.prev();
		});
		$ele.find('>div.aeIrguidebutton >button:last').bind("click.aeIrguidebutton",function(event){
			if(options.onCancel){
				_self._trigger("onCancel", event, options._active, options._data);
			}
			_self.prev(true);
		});
	},
	/**
	 * @name: start
	 * @开始弹窗不可逆向导
	 * @param stepId: - 根据stepId弹出最初的页签；
	 * 		stepId: 缺省 - 组件按照path路径默认打开数组中第一个页签；
	 */
	start : function(stepId){
		var _self = this, options = this.options, $ele = this.element;
		_self._init();
		$.setPublicData("irGuide", $ele.attr("id"));
		options._data = {};
		if(stepId === undefined && options.path){
			if(typeof options.path[0] === 'object'){
				stepId = options.path[0][0];
			}else{
				stepId = options.path[0];
			}
		}
		if(_self._getActivePath(stepId)){
			_self._getActiveLiArray();
		}
		if(options.onBeforeStart && false === _self._trigger("onBeforeStart", null)){
			return;
		}
		//构建向导li列表
		$ele.find('>ul.nav').append(options._activeLis);

		var _config = $.extend(true,{},$.extend({
			title : options.title,
			width : options.width,
			height : options.height,
			showButton : options.button,
			modal : true,
			draggable : true,
			resizable : true,
			showClose : true,
			popupType : 'div',
			onBeforeClose : options.onBeforeClose,
			onClose : options.onClose
		}));
		options._dialogConfig = _self._buildDialogConfig(_config);

		if(_self._srcType(options._src[stepId]) === 'page'){
			var $content = $ele.find('>div.tab-content').children('[stepId='+stepId+']');
			$.includeHtml($content, options._src[stepId], function(){
				_self._startThen(stepId);
			});
		}else{
			_self._startThen(stepId);
		}
	},
	_startThen : function(stepId){
		var _self = this, options = this.options, $ele = this.element;
		_self._stepsInit(stepId);
		$ele.aeDialog(options._dialogConfig);
		_self._stepsShow(stepId, "start");
		options._history.push(stepId);
		options._active = stepId;
		if(options.onStart){
			_self._trigger("onStart", null);
		}
	},
	_buildDialogConfig : function(ss){
		var _self = this;
        return {
    		autoOpen : true,
	  		modal : ss.modal,
	  		width : ss.width || 'auto',
	  		height : ss.height || 'auto',
	  		title : ss.title || '',
	  		popupType : ss.popupType || '',
	  		draggable : ss.draggable,
	  		resizable : ss.resizable,
	  		showFlush : ss.showFlush,
	  		showClose : ss.showClose,
	  		showMinMax : ss.showMinMax,
	  		partId : ss.partId,
	  		beforeClose : function(){
	  			if (ss.onBeforeClose && false === _self._trigger("onBeforeClose", null)) {
	  				return false;
	  			}
			},
			close : function(){
//				_self.options.onPrev && _self._trigger("onPrev",null,_self.options._active);
				if(ss.onClose){
					_self._trigger("onClose", null);
				}
				_self.options._data = undefined;
				$.removePublicData("irGuide");
			}
        };
	},
	/**
	 * @name: next
	 * @下钻到向导下一步
	 * @param stepId: - 根据stepId进行跳转；
	 * 		stepId: 缺省 - 组件按照当前路径跳转到下一步；
	 */
	next : function(stepId){
		var _self = this, options = this.options, $ele = this.element;
		var active = options._active;
		if(stepId === undefined){
			if(active === options._activePath[options._activePath.length - 1]){
				return;
			}else{
				stepId = options._activePath[$.inArray(active, options._activePath) + 1];
			}
		}
		if (options.onBeforeNext && false === _self._trigger("onBeforeNext", null, options._active, options._data)) {
			return;
		}
		if(_self._getActivePath(stepId) === false){
			return;
		}else if(_self._getActivePath(stepId) === true){
			_self._getActiveLiArray();
		}
		if(_self._srcType(options._src[stepId]) === 'page'){
			var $content = $ele.find('>div.tab-content').children('[stepId='+stepId+']');
			$.includeHtml($content, options._src[stepId], function(){
				_self._nextThen(stepId);
			});
		}else{
			_self._nextThen(stepId);
		}
	},
	_nextThen : function(stepId){
		var _self = this, options = this.options;
		_self._stepsInit(stepId);
		_self._stepsShow(stepId, "next");
		options._history.push(stepId);
		options._active = stepId;
		if(options.onNext){
			_self._trigger("onNext",null,options._active, options._data);
		}
	},
	/**
	 * @name: prev
	 * @确认或取消
	 * @param cancel: true - 取消，不会触发相关事件（onBeforePrev、onPrev）直接取消当前操作，如果是最后一个页签，则先后触发onBeforeClose、onClose事件；
	 * 		cancel: 缺省 - 确认，触发相关事件逻辑，如果是最后一个页签，则先后触发onBeforePrev、onBeforeClose、onPrev、onClose事件；
	 */
	prev : function(cancel){
		var _self = this, options = this.options;
		if(cancel === true || cancel === "true"){
			_self._prevThen(cancel);
			return;
		}
		if (options.onBeforePrev && false === _self._trigger("onBeforePrev", null, options._active, options._data)) {
			return;
		}
		_self._prevThen();
//		options.onPrev && _self._trigger("onPrev",null,options._active);
	},
	_prevThen : function(cancel){
		var _self = this, options = this.options, $ele = this.element;
		var active = options._active;
		if(active === options._history[0]){
			if((!cancel) && options.onPrev){
				_self._trigger("onPrev", null, options._active, options._data);
			}
			$ele.aeDialog("close");
			return;
		}
		var stepId = options._history[$.inArray(active, options._history) - 1];
		_self._stepsShow(stepId, "prev");
		options._history.pop();
		options._active = stepId;
		if(options.onPrev){
			_self._trigger("onPrev", null, options._active, options._data);
		}
	},
	_stepsInit : function(stepId){
		var options = this.options, $ele = this.element;
		var $content = $ele.find(">div.tab-content:first").children('[stepId="'+stepId+'"]');
		$.globalInit($content);
		//LOG: 不再做硬式初始化
		/*var initFunction = $content.attr("initFunction");
		if(initFunction){
			var aeInit = $content.find("[aeInit=false]");
			if(aeInit){
				$(aeInit).each(function(index,item){
					$(item).attr("aeInit","true");
				});
				$.globalInit($content);
				var i = initFunction.indexOf("(");
				var actName = i>0 ? initFunction.substring(0, i) : initFunction;
				var func = "return window."+actName+"?"+actName+".call(window):false;";
				new Function(func)();
			}
		}else{
			var aeInit = $content.find('[aeInit="false"]');
			if(aeInit && aeInit.length){
				$(aeInit).each(function(index,item){
					$(item).attr("aeInit","true");
				});
				$.globalInit($content);
			}
		}*/
	},
	_stepsShow : function(stepId, type){
		var options = this.options, $ele = this.element;
		var $content = $ele.find(">div.tab-content:first").children('[stepId="'+stepId+'"]');
		var $li = $ele.find('>ul.nav').children('li[stepId="'+stepId+'"]');
		if(type === 'start'){
			$li.addClass('active').children('a').show();
			$content.show().siblings().hide();
		}else if(type === 'next'){
			$li.prevAll('li').addClass('done').removeClass('active').children('a').show();
			$li.addClass('active').children('a').show();
			$content.show().siblings().hide();
		}else if(type === 'prev'){
			$li.nextAll('li').removeClass('active').children('a').hide();
			$li.addClass('active').removeClass('done');
			$content.show().siblings().hide();
		}

	},
	/**
     * @构建path数据
     */
    _structuringPath : function(path){
		var i,j, pathMap = [];
		for(i=0; i<path.length; i++){
			if(typeof path[i] === "string"){
				pathMap[path[i]] = path[i+1];
			}else if(typeof path[i] === "object"){
				for(j=0; j<path[i].length; j++){
					pathMap[path[i][j]] = path[i][j+1];
				}
			}
		}
		this.options._pathMap = pathMap;
	},
	/**
	 * TODO:
     * @实时获取当前path
     * @返回：当路径改变时返回true，未改变时返回false
     */
    _getActivePath : function(stepId){
    	var options = this.options,
			path = options.path,
			_pathMap = options._pathMap,
			i,
			key,
			_activePath,
			temp;
    	//start
    	if(!options._activePath.length){
    		//简单路径
    		if($.inArray(stepId, path) !== -1){
    			for(i=0; i<path.length; i++){
    				if(path[i] === stepId || $.inArray(stepId, options._activePath) === 0){
    					options._activePath.push(path[i]);
    				}
    			}
        	}
    		return true;
    	}else{
    		//next-判断本次下钻是否合法
    		key = options._history[options._history.length-1];
    		if((typeof options._pathMap[key] === "string" && stepId === options._pathMap[key]) ||(typeof options._pathMap[key] === "object" && $.inArray(stepId, options._pathMap[key]) !== -1)){
    			//next-只处理切换路径的情况
    			if($.inArray(stepId, options._activePath) === -1 || ($.inArray(stepId, options._activePath) !== -1 && $.inArray(stepId, options._activePath) - $.inArray(key, options._activePath) !== 1)){
    				_activePath = [];
    				for(i=0; i<options._activePath.length; i++){
    					if(options._activePath[i] === key){
    						_avtivePath.push(options._activePath[i]);
    						break;
    					}else{
    						_avtivePath.push(options._activePath[i]);
    					}
    				}
    				_activePath.push(stepId);
    				//TODO：逻辑待测试
    				temp = stepId;
    				while(options._pathMap[temp]){
    					_activePath.push(options._pathMap[stepId][0]);
    					temp = options._pathMap[stepId][0];
    				}
    				options._activePath = _activePath;


    				return true;
    			}
    		}else{
    			$.message.error("","","本次跳转路径不合法！");
    			return false;
    		}
    	}
	},
	/**
	 * TODO:逻辑待验证
     * @通过path获取li队列
     * @只有当路径切换时才会执行此逻辑: _getActivePath()返回true
     */
    _getActiveLiArray : function(){
    	var options = this.options;
    	options._activeLiArray = [];
		options._activeLis = "";
    	for(var i=0; i<options._activePath.length; i++){
    		options._activeLiArray.push(options._liObject[options._activePath[i]]);
    		options._activeLis += options._liObject[options._activePath[i]];
    	}
	},
	/**
     * @对src做处理
     * 返回'page'、'div'或 false
     */
    _srcType : function(src){
    	if(src && typeof src === 'string'){
    		if(src.indexOf("#") === 0){
    			return 'div';
    		}else if(src.indexOf("#") !== 0 && src.indexOf('.html') === src.length - 5){
        		return 'page';
        	}
    	}else{
    		return false;
    	}
    },
    /**
     * TODO
     * @获取stepId对应的内容区域对象
     * @param stepId：标签stepId值
     * @返回 jQuery对象
     */
    getContent : function(stepId){

    },
    /**
     * @获取当前页签的stepId
     * @param
     * @返回 stepId
     */
    getActive : function(){
    	return this.options._active;
    },
    /**
     * @记录当前页签数据
     * options._data : 数据为Object类型，key值为页签标识stepId值，value值为用户调setData方法记录的数据
     * setData方法会覆盖key值一样的数据
     * @name setData
     * @param data 需要记录的数据
     * @param stepId 标记数据来源，缺省则为当前页签
     *
     */
    setData : function(data, stepId){
    	var options = this.options;
    	if(data === undefined || options._data === undefined){
    		return;
    	}
    	stepId = stepId || options._active;
    	options._data[stepId] = data;
    },
    /**
     * @获取组件记录数据
     * options._data : 数据为Object类型，key值为页签标识stepId值，value值为用户调setData方法记录的数据
     * @name getData
     * @param
     * @返回 options._data
     */
    getData : function(){
    	return this.options._data;
    }

});
});

define('ui-guide',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
	/*
	 * $Id: ui-guide.js$
	 * Depends : ui-dialog.js, $.includeHtml(), $.globalInit()
	 * version : 3.1
	 * The last modification time : 2015-6-3 20:21
	 * TODO ：
	 *
	 * log : bootstrap 风格组件初步封装完成； 2015-5-28 14:23
	 * 		 完善组件逻辑； 2015-5-29 10:58
	 * 		theme=1时，内置8种icon循环展示； 2015-6-3 20:21
	 *
	 *
	 */
	/**
     * @name aeGuide
     * @class 向导组件，用于多级跳转。
     *
     * @特点：
     * <ol>
     *      <li>必须设置向导标签属性src，其值为该标签所对应内容 div 的 id 值；或者外部page路径；
     *      	 示例： <li src="#myStepOneId"><a>StepOne</a></li>
         			   <li src="demo/demo-panel.html"><a>StepTwo</a></li>
     *      </li>
     *      <li>内置 button 满足基本的向导功能需求，支持自定义 button</li>
     * </ol>
     *
     * @数据结构如下
     *
     *
     * @页面上的html标记如下
     * <pre>
        <button class="btn btn-primary btn-lg" onclick="start()">演示向导</button>
		<div id="demo-guide" aeType="aeGuide" aeInit="true" style="display:none">
			<ul>
				<li src="#t1"><a> Basic Info</a></li>
				<li src="#t2"><a> Basic Info</a></li>
				<li src="#t3"><a> Basic Info</a></li>
				<li src="#t4"><a> Product Info</a></li>
			</ul>
		</div>

     * </pre>
     * @最终展示页面代码如下
     *
     *
     * @constructor
     * @description 构造函数.
     * @param
     */
$.aeWidget("ae.aeGuide", {
	options: /**@lends aeGuide#*/{
		/**
         * 是否执行组件初始化
         * @type Boolean
         * @default false
         */
		_initial : false,
		/**
         * 主题，内置两种
         * @0 默认主题，圆点数字样式；
         * @1 icon样式，支持icon自定义
         * @type Number
         * @default 0
         */
		theme : 0,
		/**
         * 自定义icon，仅当 theme="1" 时生效
         * 如果用户未定义，则使用内置icon，内置 8 种图标，循环展示
         * @type Array
         * @default [fa fa-user,fa fa-picture-o,fa fa-edit,fa fa-calendar]
         * @example
         *
         */
		_icon : ["fa fa-user","fa fa-picture-o","fa fa-edit","fa fa-calendar","fa fa-book","fa fa-home","fa fa-folder","fa fa-save"],
		/**
         * 自定义icon，仅当 theme="1" 时生效
         * 如果用户未定义，则使用内置_icon，内置 8 种图标，循环展示
         * @type Array
         * @default [fa fa-user,fa fa-picture-o,fa fa-edit,fa fa-calendar]
         * @example
         *
         * icon : [],
         */
		/**
         * 向导弹窗标题，直接调用 ui-dialog
         * @type String
         * @default 无
         */
		title : '',
		/**
         * 向导宽度
         * @type Number
         * @default 'auto'
         */
		width : 'auto',
		/**
         * 向导高度
         * @type Number
         * @default 'auto'
         */
		height : 'auto',
		/**
         * 是否配置向导按钮
         * 直接调用 ui-dialog
         * @type Boolean
         * @default true
         */
		button : false,
		/**
         * 初始化方式，默认通过html来设置参数。传值为js时，则通过js中设置的option来初始化。
         * @type String
         * @default 'html'
         * @example
         * $('#demo-irguide').aeGuide({initType : 'js'});
         */
        initType : 'html'
	},
	_create: function() {
		var _self = this,
			options = this.options,
			$ele = this.element,
			id=$ele.attr("id");
		if(options._initial === true){
			return;
		}
		if(id){
			$ele.attr("aeId",id);
		}
		if(options.initType === 'html'){
			_self._buildOptions(options,$ele);
        }

		/*
		 * @name theme 内置两种主题
		 * @0 默认主题，圆点形式
		 * @1 icon形式,仅当theme=1时，icon可配置
		 */
		var ulClass;
        switch(options.theme){
		    case 0 :
		    	ulClass = "nav nav-justified nav-pills nav-wizard-circle";
		    	options.icon = [];
		   	    break;
		    case 1 :
		    	ulClass = "nav nav-justified nav-pills nav-wizard-icon";
		    	options.icon = options.icon || options._icon;
		   	    break;
			default :
				ulClass = "nav nav-justified nav-pills nav-wizard-circle";
				optinos.icon = [];
				break;
		}

        $ele.addClass("modal-body");
        $ele.find(">ul:first").addClass(ulClass);
        options._total = $ele.find('>ul.nav').children('li').length;
        if($ele.children(':not(ul.nav)').length){
        	$ele.children(':not(ul.nav)').wrapAll('<div class="tab-content"></div>');
        }else{
        	$ele.find('>ul.nav').after('<div class="tab-content"></div>');
        }
        $ele.find('>div.tab-content').children()/*.addClass('tab-pane')*/.hide();

        var $content = $ele.find('>div.tab-content');
		$ele.find('>ul.nav li').each(function(index,item){

			var text = $(item).text();
			if(options.theme === 1){
				index < options.icon.length ?
				$(item).children('a').html('<strong><i class="'+options.icon[index]+'"></i></strong><p>'+text+'<p>')
				: $(item).children('a').html('<strong><i class="'+options.icon[index%options.icon.length]+'"></i></strong><p>'+text+'<p>');
			}else{
//				$(item).children('a').html('<strong><i class="fa fa-check"></i></strong><p>'+text+'<p>');
				$(item).children('a').html('<strong>'+(index+1)+'</strong><p>'+text+'<p>');
				options.icon.push("fa fa-check");
			}

			var pre = (((1+Math.random())*0x10000)|0).toString(16).substring(1);
			var i = index.toString();
			$(item).attr("stepId","stepid"+i+pre);
			var stepId = $(item).attr("stepId");
			var src = $(item).attr("src");
			options._data.push([stepId,src]);
			if(_self._srcType(src) === 'page'){		//内容为page
            	$content.append('<div stepId="'+stepId+'" style="display:none;"></div>');

            }else if(_self._srcType(src) === 'div'){	//内容为div
            	if(!$content.find(">"+src).length){
            		var outerHTML = $(src).prop("outerHTML") || '<div id="'+src.split("#")[1]+'"></div>';
            		$(src).remove();
            		$content.append(outerHTML);
            	}
            	$(src).attr("stepId",stepId).hide();
            }

		});
        options._initial = true;
	},
	_init : function() {
		this.element.find(">ul.nav li").removeClass().addClass("disabled");
		this.element.find('>div.tab-content').children().hide();
		this.options._history = [];
		this.options._active = undefined;
		this.options._activeStep = undefined;
		this.element.unbind(".aeguidelis");
	},
	_buildOptions : function(options,element){
		options._data = [];
		options.id = element.attr("id");
		options.theme = parseInt(element.attr("theme"),10) || options.theme;
		options.title = element.attr("title") || undefined;
		options.button = element.attr("button") == "true" ? true : options.button;
		options.width = parseInt(element.attr("width"),10) || options.width;
		options.height = parseInt(element.attr("height"),10) || options.height;
		var icon = element.attr("icon");
		if(icon && icon.indexOf("[") !== -1){
			icon = $.trim(icon);	//去除字符串两端空格
			options.icon = [];
			var result = icon.substring(1,icon.length-1).split(",");
			for(var i=0;i<result.length;i++){
				result[i] = $.trim(result[i]);
				options.icon.push(result[i]);
			}
		}
        this._buildOptionEvent(options,'onBeforeStart',element.attr("onBeforeStart"));
        this._buildOptionEvent(options,'onStart',element.attr("onStart"));
        this._buildOptionEvent(options,'onBeforeNext',element.attr("onBeforeNext"));
        this._buildOptionEvent(options,'onNext',element.attr("onNext"));
        this._buildOptionEvent(options,'onBeforePrev',element.attr("onBeforePrev"));
        this._buildOptionEvent(options,'onPrev',element.attr("onPrev"));
        this._buildOptionEvent(options,'onBeforeClose',element.attr("onBeforeClose"));
        this._buildOptionEvent(options,'onClose',element.attr("onClose"));
	},
	_buildOptionEvent : function(options,evtName,evtValue){
		options[evtName]=evtValue ? function(param1, param2){
    		if($.isString(evtValue)){
				var i = evtValue.indexOf("(");
				var actName = i>0 ? evtValue.substring(0, i) : evtValue;
				var func = "return window."+actName+"?"+actName+".call(window,p1,p2):false;";
				return new Function("p1","p2",func)(param1, param2);
			}
    	}: options[evtName];
	},
	/**
	 * @name: start
	 * @开始向导
	 */
	start : function(){
		var _self = this, options = this.options, $ele = this.element;
		_self._init();
		$.setPublicData("guide", $ele.attr("id"));
		if(options.onBeforeStart && false === _self._trigger("onBeforeStart")){
			return;
		}

		var _config = $.extend(true,{},$.extend({
			title : options.title,
			width : options.width,
			height : options.height,
			showButton : options.button,
			modal : true,
			draggable : false,
			resizable : false,
			showFlush : false,
			showClose : true,
			showMinMax : false,
			popupType : 'div',
			onBeforeClose : options.onBeforeClose,
			onClose : options.onClose
		}));
		options._dialogConfig = _self._buildDialogConfig(_config);

		if(_self._srcType(options._data[0][1]) === 'page'){
			var $content = $ele.find('>div.tab-content').children('[stepId='+options._data[0][0]+']');
			$.includeHtml($content, options._data[0][1], function(){
				_self._startThen();
			});
		}else{
			_self._startThen();
		}
	},
	_startThen : function(){
		var _self = this, options = this.options, $ele = this.element;
		_self._stepsInit(options._data[0][0]);
		$ele.aeDialog(options._dialogConfig);
		_self._stepsShow(0, "start");
		options._history.push(0);
		options._active = 0;
		options._activeStep = options._data[0][0];
		_self._bindEvent();
		if(options.onStart){
			_self._trigger("onStart");
		}
	},
	_bindEvent : function(){
		var _self = this, $ele = this.element;
		var lis = $ele.find('>ul.nav li');
		for(var i=0; i<lis.length; i++){
			if($(lis[i]).hasClass("done")){
				_self._bindLiEvent(lis[i]);
			}
        }
	},
	_bindLiEvent : function(li){
        var _self = this;
        $(li).bind("mouseover.aeguidelis",function(){
        	$(this).css("cursor","pointer");
        }).bind("click.aeguidelis",function(){
        	_self._jump($(this).index());
        });
    },
	_buildDialogConfig : function(ss){
		var _self = this;
        return {
    		autoOpen : true,
	  		modal : ss.modal,
	  		width : ss.width || 'auto',
	  		height : ss.height || 'auto',
	  		title : ss.title || '',
	  		popupType : ss.popupType || '',
	  		draggable : ss.draggable,
	  		resizable : ss.resizable,
	  		showFlush : ss.showFlush,
	  		showClose : ss.showClose,
	  		showMinMax : ss.showMinMax,
	  		partId : ss.partId,
	  		onBeforeClose : function(){
	  			if (ss.onBeforeClose && false === _self._trigger("onBeforeClose")) {
	  				return false;
	  			}
			},
			onClose : function(){
				if(this.options.onPrev){
					_self._trigger("onPrev",event,this.options._active);
				}
				if(ss.onClose){
					_self._trigger("onClose");
				}
				$.removePublicData("guide");
			}
        };
	},
	/**
	 * @name: next
	 * @下钻到向导下一步
	 */
	next : function(){
		var _self = this, options = this.options, $ele = this.element;
		var active = options._active;
		if(active === options._total - 1){
			return;
		}
		if (options.onBeforeNext && false === _self._trigger("onBeforeNext",event,options._active)) {
			return;
		}
		var stepId = options._data[active+1][0];
		if(_self._srcType(options._data[active+1][1]) === 'page'){
			var $content = $ele.find('>div.tab-content').children('[stepId='+stepId+']');
			$.includeHtml($content, options._data[active+1][1], function(){
				_self._nextThen(stepId, active+1);
			});
		}else{
			_self._nextThen(stepId, active+1);
		}
	},
	_nextThen : function(stepId, index){
		var _self = this, options = this.options;
		_self._stepsInit(stepId);
		_self._stepsShow(index, "next");
		options._active = index;
		options._activeStep = stepId;
		options._history.push(index);
		_self._bindEvent();
		if(options.onNext){
			_self._trigger("onNext",event,options._active);
		}
	},
	_jump : function(index){
		var _self = this, options = this.options;
		if(index < options._active){
			if(index === options._active -1){
				_self.prev();
			}else{
				if (options.onBeforePrev && false === _self._trigger("onBeforePrev",event,options._active)) {
					return;
				}
				_self._stepsShow(index, "jump");
				options._active = index;
				options._activeStep = options._data[index][0];
				for(i = options._history.length -1; i>0; i--){
					if(options._history[i] === options._active){
						break;
					}else{
						options._history.pop();
					}
				}
				_self._bindEvent();
				if(options.onPrev){
					_self._trigger("onPrev",event,options._active);
				}
			}
		}
	},
	getActive : function(){
		var index = this.options._active;
		return index;
	},
	/**
	 * @name: prev
	 * @确认或取消
	 * @param cancel: true - 取消，不会触发相关事件（onBeforePrev、onPrev）直接取消当前操作，如果是最后一个页签，则先后触发onBeforeClose、onClose事件；
	 * 		cancel: 缺省 - 确认，触发相关事件逻辑，如果是最后一个页签，则先后触发onBeforePrev、onBeforeClose、onPrev、onClose事件；
	 */
	prev : function(cancel){
		var _self = this, options = this.options;
		if(cancel === true || cancel === "true"){
			_self._prevThen();
			return;
		}
		if (options.onBeforePrev && false === _self._trigger("onBeforePrev",event,options._active)) {
			return;
		}
		_self._prevThen();
		if(options.onPrev){
			_self._trigger("onPrev",event,options._active);
		}
	},
	_prevThen : function(){
		var _self = this, options = this.options, $ele = this.element;
		var active = options._active;
		if(active === 0){
			$ele.aeDialog("close");
			return;
		}
		var stepId = options._data[active-1][0];
		_self._stepsShow(active-1, "prev");
		options._active--;
		options._activeStep = stepId;
		options._history.pop();
		_self._bindEvent();
	},
	_stepsInit : function(stepId){
		var options = this.options, $ele = this.element;
		var $content = $ele.find(">div.tab-content:first").children('[stepId="'+stepId+'"]');
		var initFunction = $content.attr("initFunction");
		var aeInit,
			i,
			actName,
			func;
		if(initFunction){
			aeInit = $content.find("[aeInit=false]");
			if(aeInit){
				$(aeInit).each(function(index,item){
					$(item).attr("aeInit","true");
				});
				$.globalInit($content);
				i = initFunction.indexOf("(");
				actName = i>0 ? initFunction.substring(0, i) : initFunction;
				func = "return window."+actName+"?"+actName+".call(window):false;";
				new Function(func)();
			}
		}else{
			aeInit = $content.find('[aeInit="false"]');
			if(aeInit && aeInit.length){
				$(aeInit).each(function(index,item){
					$(item).attr("aeInit","true");
				});
				$.globalInit($content);
			}
		}
	},
	_stepsShow : function(index, type){
		var options = this.options, $ele = this.element;
		var stepId = options._data[index][0];
		var $content = $ele.find(">div.tab-content:first").children('[stepId="'+stepId+'"]');
		var $li = $ele.find('>ul.nav li').eq(index);
		if(type === 'start'){
			$li.addClass("active").removeClass("disabled");
		}else if(type === 'next'){
			if(options.theme === 0){
				$li.prev('li').find('>a >strong').empty().html('<i class="fa fa-check"></i>');
			}
			$li.prev('li').addClass("done").removeClass("active");
			$li.addClass("active").removeClass("disabled");

		}else if(type === 'prev'){
			if(options.theme === 0){
				$li.find('>a >strong').empty().text(index+1);
			}
			$li.addClass("active").removeClass("done");
			$li.next('li').addClass("disabled").removeClass("active");
		}else if(type === 'jump'){
			if(options.theme === 0){
				$li.find('>a >strong').empty().text(index+1);
				$li.nextAll('li').each(function(n, item){
					$(item).find('>a >strong').empty().text(index+n+2);
				});
			}
			$li.addClass("active").removeClass("done");
			$li.nextAll('li').addClass("disabled").removeClass("active").removeClass("done");
		}
		$content.show().siblings().hide();
	},
	/**
     * @对src做处理
     * 返回'page'、'div'或 false
     */
    _srcType : function(src){
    	if(src && typeof src === 'string'){
    		if(src.indexOf("#") === 0){
    			return 'div';
    		}else if(src.indexOf("#") !== 0 && src.indexOf('.html') === src.length - 5){
        		return 'page';
        	}
    	}else{
    		return false;
    	}
    }

});
});

define('ui-menu',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
/*
 * $Id : ui-menu.js$
 * Depends : ui-core.js
 * version : 3.1
 * The last modification time : 2015-5-20 10:34
 * log : 	bootstrap 风格组件初步封装完成； 2015-5-20 10:34
 * 			新增属性 dataSource；2015-6-29 10:02
 * 			新增属性 theme，支持两种主题； 2015-6-30 15:14
 * 			修复icon样式bug，修复定位bug；2015-6-30 19:07
 *
 *
 *
 */
//;(function($) {
        /**
     * @name aeMenu
     * @class menu组件。
     *        基本的json格式为{"id":"001","label":"Home","pid":"0",icon:"icon-event"},其中的id和label必须设置;
     *        组件默认会处理的属性为上面列举的4个，即id、text、pid、icon
     *        如果你自定义了某个属性，比如url，系统不会处理，它是在点击的时候交给onSelect方法处理，通过item.url获取url参数。
     * @特点：
     * <ol>
     *      <li>支持icon自定制</li>
     *      <li>灵活的事件处理机制，自由增加json属性，事件执行时获取数据进行处理</li>
     *      <li>支持动态改变menuItem的disabled属性</li>
     * </ol>
     *
     * @数据结构如下
     * [
		{"id":"001","label":"一级菜单1","url":"demo/demo-tabs.html"},
		{"id":"002","label":"一级菜单2"},
		{"id":"003","label":"一级菜单3"},

		{"id":"011","pid":"001","label":"二级菜单11111111111111111111111111111"},
		{"id":"012","pid":"001","label":"二级菜单2"},
		{"id":"013","pid":"001","label":"二级菜单3"},
		{"id":"014","pid":"001","label":"二级菜单4"},
		{"id":"015","pid":"001","label":"二级菜单5"},

		{"id":"111","pid":"011","label":"三级菜单11111111111111111111111111111"},
		{"id":"112","pid":"011","label":"三级菜单2"},
		{"id":"113","pid":"011","label":"三级菜单3"},

		{"id":"1131","pid":"113","label":"四级菜单11111111111111111111111111111"},
		{"id":"1132","pid":"113","label":"四级菜单2"},
		{"id":"1133","pid":"113","label":"四级菜单3"},
		]
     *
     * @页面上的html标记如下
     * <pre>
        @用法1
        <div id="demo-menu" aeType="aeMenu" aeInit="true"></div>
        @用法2
		<div id="demo-menu" aeType="aeMenu" aeInit="true" renderAll="false">
			<ul>
				<i class="icon-home"></i>
				<li mId="001"><a><span>Home</span></a></li>
				<li mId="002"><a><span>Profile</span></a></li>
				<li mId="003"><a><span>Messages</span></a></li>
				<li mId="006"><a><span>Messages</span></a></li>
			</ul>
		</div>
     * </pre>
     * @最终展示页面代码如下
        <div class="menu-box-horiz">
			<ul class="nav nav-pills">
				<i class="icon-home"></i>
				<li class="active">
					<a><span>Home</span><i class="icon-arrowlup-down"></i></a>
					<ul class="menu-list" style="display: block">
						<li><a><span>Action</span></a></li>
						<li class="active">
							<a><span>Another action</span><i class="icon-arrowright-little"></i></a>
							<ul class="menu-list" style="display: block">
								<li><a><span>Action</span></a></li>
								<li class="active">
									<a><span>Another action</span><i class="icon-arrowright-little"></i></a>
								</li>
								<li><a><span>Custom Menu3</span></a></li>
								<li><a><span>Separated link</span></a></li>
							</ul>
						</li>
						<li><a><span>Custom Menu3</span></a></li>
						<li><a><span>Separated link</span></a></li>
					</ul>
				</li>
				<li><a><span>Profile</span><i class="icon-arrowlup-down"></i></a></li>
				<li><a><span>Messages</span></a></li>
			</ul>
		</div>
     * @constructor
     * @description 构造函数.
     * @param
     */
    $.aeWidget('ae.aeMenu', {
        options: /**@lends aeMenu# */{
        	/**
             * 防止重复初始化
             * @type Boolean
             * @default false
             */
        	_initial : false,
    		/**
             * 菜单数据id属性键值
             * 默认会取data数据中的id属性值作为菜单项id
             * @type String
             * @default 'id'
             */
    		mId : 'id',
    		/**
             * 菜单数据pid属性键值
             * 默认会取data数据中的pid属性值作为菜单项pid
             * @type String
             * @default 'pid'
             */
    		mPid : 'pid',
    		/**
             * 菜单数据label属性键值
             * 默认会取data数据中的label属性值作为菜单项label
             * @type String
             * @default 'label'
             */
    		mLabel : 'label',
    		/**
             * 主题吗，内置两种
             * @type Number
             * @default 0
             * @example
             */
    		theme : 0,
            /**
             * 是否为右键菜单
             * @type Boolean
             * @default false
             * @example
             * $("#demo-menu").aeMenu({contextMenu:true});
             */
            contextMenu : false,
            /**
             * 设置菜单位置，内置四个方向：top、left、down、right
             * @type String
             * @default 'top'
             * @example
             * $("#demo-menu").aeMenu({'menuLocation','down'});
             */
            location : 'top',
            /**
             * 全量渲染，设置为false表示将不渲染一级菜单，由用户自定义；
             * @type Boolean
             * @default true
             */
            renderAll : true,
            /**
             * 菜单显示模式：支持两种模式，click、mouseover，仅适用于一级菜单
             * @type String
             * @default 'mouseover'
             */
            showMode : 'mouseover',
            /**
             * 设置菜单展示效果，内置三种效果，默认无效果，滑动（animate="slide"），淡入淡出（animate="fade"）。
             * @type String
             * @default 无
             * @example
             * $("#demo-menu").aeMenu({'animate','fade'});
             */
            animate : '',
            /**
             * 设置菜单展示效果的执行速度，仅当animate="slide" 或 animate="fade" 时有效；单位为毫秒，数值越小，速度越快。
             * @type Number
             * @default 1000
             * @example
             * $("#demo-menu").aeMenu({'speed',1000});
             */
            speed : 1000,
            /**
             * 菜单项被选中时触发
             * @name aeMenu#onSelect
             * @event
             * @param item 当前选中菜单项的所有数据
             * @param event jQuery.Event对象
             * @type Function
             * @default emptyFn
             * @example
             * <div id="demo-menu" aeType="aeMenu" aeInit="true" onSelect="select()"></div>
             * function select(item,event){
             * 		console.log(item);
             * 		//console.log($(event.target).parget().attr("mid"));
             * 		console.log($(event.currentTarget).attr("mid"));
             * }
             */
    		onSelect : function(item, event){},
            /**
             * 初始化方式，默认通过html来设置参数。传值为js时，则通过js中设置的option来初始化。
             * @type String
             * @default 'html'
             * @example
             * $('#demo-menu').aeMenu({initType : 'js'});
             */
            initType : 'html'
        },
        _create:function(){
            var _self = this,
				options = this.options,
				$ele = this.element,
				id=$ele.attr("id");
            if(options._initial === true){
				return;
			}
			if(id){
				$ele.attr("aeId",id);
			}
            if(options.initType === 'html'){
            	_self._buildOptions(options, $ele);
            }
            /*
			 * @name theme 内置六种主题
			 * @0 默认主题，允许出现左右滚动箭头
			 * @1 允许出现左右滚动箭头
			 * @2 允许出现左右滚动箭头
			 * @3 页签均分宽度，不出现左右滚动箭头
			 * @4 页签居左，右侧允许配置工具按钮，不出现左右滚动箭头
			 * @5 页签居右，左侧允许配置工具按钮，不出现左右滚动箭头
			 */
			var themeClass;
	        switch(options.theme){
			    case 0 :
			    	themeClass = "menu-box-horiz";
			   	    break;
			    case 1 :
			    	themeClass = "menu-box-horiz menu-primary";
			   	    break;
				default :
					themeClass = "menu-box-horiz";
					break;
			}
            $ele.addClass(themeClass);
            options._initial = true;
        },
        _init : function(){
        	var source = this.options.dataSource;
        	if(source && typeof source == 'string'){
            	 source = $.parseJSON(source);
                 this.reload(source);
            }
        },
        _buildOptions:function(options,element){
    		options.theme = parseInt(element.attr("theme"),10) || options.theme;
    		options.mLabel = element.attr("mLabel") || options.mLabel;
        	options.mId = element.attr("mId") || options.mId;
        	options.mPid = element.attr("mPid") || options.mPid;
//        	options.location = element.attr("location") || options.location;
        	options.renderAll = element.attr("renderAll")=='false' ? false : options.renderAll;
//        	options.animate = element.attr("animate") || options.animate;
//        	options.speed = parseInt(element.attr("speed"),10) || options.speed;
        	options._menuIterationMap = [];
        	if(element.attr("showMode") && element.attr("showMode").indexOf('click') !== -1){
		    	options.showMode = 'click';
		    }
//        	options.contextMenu = element.attr("contextMenu")=='true' ? true : options.contextMenu;
    		var onSelect = element.attr("onSelect");
    		options.onSelect = onSelect ? function(item,event){
				if($.isString(onSelect)){
					var i = onSelect.indexOf("(");
					var actName = i>0 ? onSelect.substring(0, i) : onSelect;
					var func = 	"return window."+actName+"?"+actName+".call(window, i ,e):false;";
					return new Function("i","e",func)(item,event);
				}
	        }: '';
	        options.dataSource = element.attr("dataSource");
        },
        /**
         * 加载菜单数据
         * @name aeMenu#reload
         * @param data 为ajax获取的后台返回数据
         * @param topId 对数据做二次筛选，返回topId下级的相关数据
         * @example
         * $('#demo-menu').aeMenu('reload',data);
         */
        reload : function(data,topId){
        	var _self = this, options = this.options, $ele = this.element;
        	if(topId){
        		data = _self._findChildrenData(data,topId);
        	}
    		if(options.renderAll){
    			data = _self._transformToNodes(data);
        		$ele.empty();
        		$ele.append(_self._appendNodes.apply(_self, [data]));
        	}else{
        		//TODO: 当一级菜单由用户自定义时
        		_self._renderHeader(data);
        	}
    		_self._bindHeaderEvent();
    		_self._bindEvent();
        },
        _bindHeaderEvent : function(){
        	var _self = this, options = this.options, $ele = this.element;
        	$ele.find('>ul:first >li').bind(options.showMode+".showFirstLevel",function(e){
        		//TODO：根据location计算ul的相位差
//        		_self._calculateOffset();
        		$(this).addClass("active").siblings('li').removeClass('active');
        		//TODO：菜单显示动画
        		$(this).children('ul').show();
        		$(this).siblings('li').children('ul').hide();
        	});
        },
        //TODO:渲染页面一级菜单
        _renderHeader : function(data){
        	var _self = this, options = this.options, $ele = this.element;
        	//TODO: 处理theme、location
        	$ele.children().each(function(){
	            $(this).is('ul') || $(this).remove();
	        });
        	$ele.find('>ul:first').addClass('nav nav-pills');
        	$ele.find('>ul:first >li').each(function(index,item){
        		var mId = $(item).attr("mId");
        		options._menuIterationMap = [];
        		var mData = _self._findChildrenData(data,mId);
        		if(mData && mData.length){
        			$(item).find('>a:first').append('<i class="icon-arrowlup-down"></i>');
        			mData = _self._transformToNodes(mData);
            		$(item).append(_self._appendNodes.call(_self, mData, 1));
        		}

        	});


        },
        //TODO: 根据location计算ul的相位差
        _calculateOffset : function(){

        },
        /**
         * @递归方法
         * @返回topId的子项菜单数据
         * @不包括topId
         */
        _findChildrenData : function(data,topId){
        	var _self = this, options = this.options;
        	var id = options.mId, pid = options.mPid;
			for(var i=0;i<data.length;i++){
        		if(data[i][pid] == topId){
        			options._menuIterationMap.push(data[i]);
        			_self._findChildrenData(data,data[i][id]);
        		}
        	}
			return options._menuIterationMap;
        },
        /**
         * @构建树形结构数据
         */
        _transformToNodes : function(data) {
            //使用clone的对象来操作可避免数据污染
            var data = $.extend(true,[],data);
        	var options = this.options;
        	var id = options.mId, pid = options.mPid;
			var i, treeData = [];
			var tmpMap = [];
			for(i=0; i<data.length; i++){
				tmpMap[data[i][id]] = data[i];
			}
			for(i=0; i<data.length; i++){
				if(tmpMap[data[i][pid]]){
					var tpid = data[i][pid];
					if(!tmpMap[tpid]["_children"]){
						tmpMap[tpid]["_children"] = [];
					}
					data[i]["_hierarchy"] = tmpMap[tpid]["_hierarchy"] + 1;
					tmpMap[tpid]["_children"].push(data[i]);
					options._hierarchy = tmpMap[tpid]["_hierarchy"] + 1;
				}else{
					data[i]["_hierarchy"] = 0;
					treeData.push(data[i]);
				}
			}
			return treeData;
		},
		/**
         * @递归方法
         * @构建菜单结构
         */
		_appendNodes : function(source, _hierarchy){
            var _self = this, options = this.options, menuHtml = [];
            var id = options.mId, pid = options.mPid, label = options.mLabel;
            //TODO：考虑对location和theme的处理

            var ulClass = (_hierarchy === undefined) ? "nav nav-pills" : "menu-list";
            var display = (_hierarchy === undefined) ? "block" : "none";
            var iClass = (_hierarchy === undefined) ? "icon-arrowlup-down" : "icon-arrowright-little";
            menuHtml.push("<ul class=\""+ulClass+"\" style=\"display:"+display+";\">");
            var childrenHtml = [];
            $(source).each(function(index, item){
                if(item._children){
                	childrenHtml.push("<li mid=\""+item[id]+"\">");
                    childrenHtml.push("<a href=\"javascript:void(0)\" >");
//                    item.icon ? childrenHtml.push("<i class=\""+item.icon+"\"></i>") : null;
                    childrenHtml.push("<span>");
                    childrenHtml.push(item[label]);
                    childrenHtml.push("</span>");
                    childrenHtml.push("<i class=\""+iClass+"\"></i>");
                    childrenHtml.push("</a>");
                    childrenHtml.push(_self._appendNodes(item._children, item._hierarchy + 1));
                    childrenHtml.push("</li>");
                }else{
                	childrenHtml.push("<li mid=\""+item[id]+"\">");
                    childrenHtml.push("<a href=\"javascript:void(0)\">");
//                    item.icon ? childrenHtml.push("<i class=\""+item.icon+"\"></i>") : null;
                    childrenHtml.push("<span>");
                    childrenHtml.push(item[label]);
                    childrenHtml.push("</span>");
                    childrenHtml.push("</a>");
                    childrenHtml.push("</li>");
                }
                var li = _self.element.attr('id') + "_" + item[id];
                _self.element.data(li, item);
            });
            menuHtml.push(childrenHtml.join(""));
            menuHtml.push("</ul>");
            return menuHtml.join("");
        },
        _bindEvent : function(){
            var _self = this, $ele = this.element, options = this.options;
            var	uls = $ele.find("ul:not(:first)"), lis = uls.find("li");
            $ele.bind("mouseleave",function(){
            	_self._hide();
            	$ele.find('>ul:first >li.active').each(function(index,item){
            		$(item).removeClass("active");
            	});
            });
            /*$(uls).bind("mouseleave",function(){
            	_self._hide();
            });*/
            for(var i=0; i<lis.length; i++){
            	//TODO:如果有不可用菜单项，再此需做判断处理
            	_self._bindLiEvent(lis[i]);
            }
            for(var j=0; j<uls.length; j++){
                $(uls[j]).bind("mouseleave.menuContainer",function(){
                	$(this).hide();
                });
            }
        },
        _bindLiEvent : function(li){
            var _self = this, $ele = this.element, options = this.options;
            $(li).bind("mouseenter.menuItem",function(){
            	var self_li = $(this);
            	self_li.addClass('active');
                if(self_li.children('ul').length){
                    setTimeout(function(){
                    	_self._showChildren(self_li);
                    },200);
                }
            }).bind("mouseleave.menuItem",function(){
            	var self_li = $(this);
            	self_li.removeClass('active');
                setTimeout(function(){
                	self_li.children("ul").hide();
                },200);
            }).bind("mousedown.menuItem",function(event){
                var item = $ele.data($ele.attr("id")+"_"+$(this).attr("mid"));
                if(options.onSelect){
                	_self._trigger("onSelect",event,item);
                	event.stopPropagation();	//停止事件冒泡
                }
            });
        },
        _showChildren : function(li){
            var _self = this, options = this.options;
            if(li && li.length > 0){
                var $child = li.children("ul").eq(0);
                //TODO：判断当前视窗剩余高度是否足够显示下级菜单
                //TODO：处理location
//                var flag = _self._isEnoughShowChildren(li);
                /*if(flag === true){
                	$child.css({"top":$li.position().top });
                }else{
                	//当前视窗剩余高度不够显示下级菜单时，下级菜单向上显示
                	$child.css({"top":-flag });
                }*/
                $child.css({"top":0});
                var left = li.width();
                if((2*left + li.offset().left) > document.documentElement.clientWidth){ //当右边距离过短的时候会将提示框调整到左边
                    left = - $child.width();
                }

                $child.css("left",left);
                $child.show();

                var span = li.find(">a >span:first");
                if(span.outerWidth() === 270){
                	span.attr('title',span.text());
                }
                $child.children().each(function(index,item){
                	var span = $(item).find(">a >span:first");
                	if(span.outerWidth() === 270){
                    	span.attr('title',span.text());
                    }
                });
            }
        },
        //TODO:计算子菜单显示位置
        _isEnoughShowChildren : function(li){
        	//当前视窗高度
//        	var ScreenHeight = $(window).height();
//        	var ScreenHeight = $(document).height();
        	//li的位移
        	var liTop = li.offset().top;
        	//下级菜单相对li的高度偏移
        	var $liChildUl = li.children("ul").eq(0);
        	var ulTop = li.position().top;
        	//下级菜单高度
        	var ulHeight = $liChildUl.height();
        	if($(document).height() - liTop >= ulHeight){
        		return true;
        	}else if(liTop + li.height() >= ulHeight){
        		//当菜单有背景样式时，bottom的算法有bug
        		/*var liParentUlHeight = li.parents("ul:first").height();
        		var bottom = liParentUlHeight - ulTop - li.height();
        		return bottom;*/
        		var top = ulHeight - ulTop - li.height();
        		return top;
        	}else{
        		//当上、下高度均不够显示菜单时，菜单从视窗顶部开始展示
        		var top = liTop - li.height();
        		return top;
        	}
        },

        /**
         * 隐藏menu，隐藏之后会清空menu当前的状态。
         * @name aeMenu#hide
         * @function
         * @example
         * //调用hide方法
         *  $('#btn').click(function(){
         *     $('#menu_simple').aeMenu('hide');
         *});
        */
        /*hide : function(){
            this._hide();
        },*/


        /**
         * TODO:
         * 将某个menuitem设置为disabled，设置之后menuitem将不会触发事件，如果有子菜单将不能打开子菜单，必须有menuItem。
         * @name aeMenu#disableItem
         * @function
         * @param itemId menuItem的ID
         * @example
         * //调用disableItem方法
         *  $('#btn').click(function(){
         *     $('#menu_simple').aeMenu('disableItem','001');
         *});
         */
        disableItem : function(itemId){
        	return;
//            this.element.find("#"+itemId).addClass(this.options.cssPre+"state-disabled").unbind(".menuItem");
        },
        /**
         * TODO:
         * 将某个menuitem设置为enable。
         * @name aeMenu#enableItem
         * @function
         * @param itemId menuItem的ID
         * @example
         * //调用enableItem方法
         *  $('#btn').click(function(){
         *     $('#menu_simple').aeMenu('enableItem','001');
         *});
         */
        enableItem : function(itemId){
        	return;
            /*var self = this, element = self.element, options = self.options;
            var pre = options.cssPre;
            var cli = element.find("#"+itemId);
                cli.removeClass(pre+"state-disabled");
                self._bindLiEvent(cli);*/
        },

        _hide : function(){
            var self = this, $ele = self.element, options = self.options;
            var $uls = $ele.find('ul:not(:first)');
            $uls.hide();
            $uls.find("li.active").each(function(index,item){
                $(item).removeClass("active");
            });
        },
        /**
         * 显示menu，menu不会自己显示，必须调用show方法才能显示
         * @name aeMenu#show
         * @function
         * @param triggerEle 触发显示事件的对象，如点击的button触发的就是button对象
         * @example
         * //通过点击button显示menu
         *  $('#btn').click(function(){
         *     $('#menu_simple').aeMenu('show',this);
         *});
         */
        show : function(triggerEle){
        	var $triggerEle = $(triggerEle);
            var self = this, options = self.options, $ele = self.element, top , left;
            var offSet = $triggerEle.offset();	//获取匹配元素在当前视口的相对偏移
            //触发菜单的元素相对当前视口的相对偏移
            if( options.contextMenu ){
                top = triggerEle.pageY;
                left = triggerEle.pageX;
                triggerEle.preventDefault();
                triggerEle.stopPropagation();
                triggerEle.cancelBubble=true; //IE
            }else{
            	//目前仅支持菜单向下展示和向右展示
                if(options.menuLocation == "right"){
                	/*
                     * 菜单向右展示
                     */
                	top = offSet.top;
                    left = offSet.left + $triggerEle.width();
                }else{
                	/*
    	             * 菜单向下展示
    	             */
                	//TODO: buttomWidth
//                	var buttomWidth = parseInt($(triggerEle).css('borderBottomWidth').replace('px',''));
//                	top = offSet.top +  $(triggerEle).height() + (buttomWidth != 'NaN'?buttomWidth:0) + 1; //1px作为调节距离
//                  left = offSet.left +  1;
                	options.menuLocation = "down";
                	top = offSet.top + $triggerEle.height();
                    left = offSet.left;
                }

            }
            var parent = $ele.parent();
            while(parent.css('position') == 'static' && parent[0].nodeName != 'BODY'){
                parent = parent.parent();
                top -= parent.offset().top;
                left -= parent.offset().left;
            }
            /*while(parent.css('position') == 'fixed' && parent[0].nodeName != 'BODY'){
                parent = parent.parent();
                top -= parent.offset().top;
                left -= parent.offset().left;
            }*/

            if((left + $ele.outerWidth()) > document.documentElement.clientWidth){ //当右边距离过短的时候会将提示框调整到左边
                left = left - $ele.outerWidth() - 20;
            }
            $($ele).css({"top":top,'left':left});
            var $ul = $($ele).children("ul."+pre+"menu");
            if(options.menuShow == "slide"){
            	//滑动
            	$($ele).show();
            	$ul.slideDown(options.speed);
            }else if(options.menuShow == "fade"){
            	//淡入淡出
            	$($ele).fadeIn(options.speed);
            	$ul.fadeIn(options.speed);
            }else{
            	//无效果
            	options.menuShow = "basic";
            	$($ele).show();
            	$ul.show();
            }

            var width = $($ele).width()*0.7;
            $($ele).children("ul."+pre+"menu").children().each(function(index,li){
                if($(li).find("span:first").hasClass(pre+"menu-item-sep")){   //TODO hasClass直接导致IE9使用MaxWidth
                    $(li).find("span:first").width('98%'); //分隔条宽度
                }else{
             /*       if($(li).find("span:first").width() > width){
                        $(li).find("span:first").width($(li).attr('aria-haspopup')?width-15:width); //去掉icon的padding
                    }*/
                }
            });
        }

    });
//})(jQuery);

});

define('ui-menutree',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";

/*
 * $Id: ui-menutree.js$
 * Depends : ui-core.js, ui-widget.js
 * version : 3.1
 * The last modification time : 2015-6-3 17:02
 * log :	bootstrap 组件初步封装完成，onSelect事件待验证；2015-5-15 17:41
 * 			组件封装完成，基础功能验证通过；2015-5-18 16:21
 * 			配置菜单默认展开项; 2015-6-3 17:02
 *
 */
    /**
     * @name aeMenutree
     *
     * @class 菜单树组件
     * @使用方式
     * @页面上的html标记如下
     * <pre>
     * 		<div id="demo-menutree" aeType="aeMenutree" aeInit="true"></div>
     * </pre>
     *
     * @数据结构如下
       [{"id":"a",  "pid":"", "text":"Home", "icon":"icon-work"},
		 {"id":"b",  "pid":"", "text":"Profile", "icon":"icon-event"},
		 {"id":"c",  "pid":"", "text":"Messages", "icon":"icon-trending-down"},

		 {"id":"aa",  "pid":"a", "text":"Second", "icon":"", "src":""},
		 {"id":"ab",  "pid":"a", "text":"Another action", "icon":"", "src":""},
		 {"id":"ac",  "pid":"a", "text":"Something else here", "icon":"", "src":""},
		 {"id":"ad",  "pid":"a", "text":"Separated link", "icon":"", "src":""},

		 {"id":"ba",  "pid":"b", "text":"Second", "icon":"", "src":""},
		 {"id":"bb",  "pid":"b", "text":"Another action", "icon":"", "src":""},
		 {"id":"bc",  "pid":"b", "text":"Something else here", "icon":"", "src":""},
		 {"id":"bd",  "pid":"b", "text":"Separated link", "icon":"", "src":""},

		 {"id":"aaa",  "pid":"aa", "text":"Third", "icon":"", "src":""},
		 {"id":"aab",  "pid":"aa", "text":"Another action", "icon":"", "src":""},
		 {"id":"aac",  "pid":"aa", "text":"Something else here", "icon":"", "src":""},
		 {"id":"aad", "pid":"aa", "text":"Separated link", "icon":"", "src":""},

		 {"id":"aba",  "pid":"ab", "text":"Third", "icon":"", "src":""},
		 {"id":"abb",  "pid":"ab", "text":"Another action", "icon":"", "src":""},
		 {"id":"abc",  "pid":"ab", "text":"Something else here", "icon":"", "src":""},
		 {"id":"abd", "pid":"ab", "text":"Separated link", "icon":"", "src":""},

		 {"id":"aaaa", "pid":"aac", "text":"Fourth", "icon":"", "src":""},
		 {"id":"aaab", "pid":"aac", "text":"Another action", "icon":"", "src":""},
		 {"id":"aaac", "pid":"aac", "text":"Something else here", "icon":"", "src":""},
		 {"id":"aaad", "pid":"aac", "text":"Separated link", "icon":"", "src":""}
		]
     *
     * @最终展示页面代码如下
       <div class="menu-box">
			<div class="input-icon right">
				<i class="icon-search"></i>
				<input type="text" class="form-control" value="left icon" />
			</div>
			<ul class="nav nav-pills nav-stacked">
				<li class="active">
					<a><i class="icon-work"></i>Home<i class="icon-arrowlup-down pull-right"></i></a>
					<ul class="menu-list" style="display: block">
						<li class="active">
							<a>Action<i class="icon-arrowlup-down pull-right"></i></a>
							<ul class="menu-list menu-list-next" style="display: block">
								<li><a>Action</a></li>
								<li><a>Another action</a></li>
								<li class="active">
									<a>Something else here <i class="icon-arrowlup-down pull-right"></i></a>
									<ul class="menu-list menu-list-next-2" style="display: block">
										<li><a>Action</a></li>
										<li><a>Another action</a></li>
										<li><a>Something else here</a></li>
										<li><a>Separated link</a></li>
									</ul>
								</li>
								<li><a>Separated link</a></li>
							</ul>
						</li>
						<li><a>Another action</a></li>
						<li><a>Something else here</a></li>
						<li><a>Separated link</a></li>
					</ul>
				</li>
				<li><a><i class="icon-event"></i>Profile<i class="icon-chevron-right pull-right"></i></a></li>
				<li><a><i class="icon-trending-down"></i>Messages<i class="icon-chevron-right pull-right"></i></a></li>
			</ul>
		</div>
     *
     * @example
     * $('#demo-menutree').aeMenutree('reload',data);
     */
    $.aeWidget('ae.aeMenutree', {
        options : /** @lends aeMenutree#*/ {
        	/**
             * 防止重复初始化
             * @type Boolean
             * @default false
             */
    		_initial : false,
    		/**
             * 菜单数据id属性键值
             * @type String
             * @default 'id'
             */
    		mId : 'id',
    		/**
             * 菜单数据pid属性键值
             * @type String
             * @default 'pid'
             */
    		mPid : 'pid',
    		/**
             * 菜单数据label属性键值
             * @type String
             * @default 'label'
             */
    		mLabel : 'label',
    		/**
             * 搜索框
             * @type Boolean
             * @default false
             */
    		search : false,
    		/**
             * 菜单项被选中时触发
             * @event
             * @param item 当前选中菜单项的所有数据
             * @param event jQuery.Event对象
             * @default emptyFn
             * @example
             * <div id="demo-menutree" aeType="aeMenutree" aeInit="true" onSelect="select()"></div>
             * function select(item,event){
             * 		console.log(item);
             * 		//console.log($(event.target).parent().attr("mid"));
             * 		console.log($(event.currentTarget).attr("mid"));
             * }
             */
    		onSelect : function(item, event){},
            /**
             * 初始化方式，默认通过html来设置参数。传值为js时，则通过js中设置的option来初始化。
             * @type String
             * @default 'html'
             * @example
             * $('#make-tab').aeMenutree({initType : 'js'});
             */
            initType : 'html'
        },
        _create : function(){
        	var _self = this,
				options = this.options,
				$ele = this.element,
				id=$ele.attr("id");
			if(options._initial === true){
				return;
			}
			if(id){
				$ele.attr("aeId",id);
			}
			if(options.initType === 'html'){
				_self._buildOptions(options,$ele);
	        }
			$ele.addClass('menu-box').empty();
			if(options.search){
				$ele.prepend('<div class="input-icon right"><i class="icon-search"></i><input type="text" class="form-control" value="keywords" /></div>');
			}
            options._initial = true;
        },

        _buildOptions : function(options,element){
		    options.search = element.attr("search") == "true" ? true : options.search;
		    options.mLabel = element.attr("mLabel") || options.mLabel;
        	options.mId = element.attr("mId") || options.mId;
        	options.mPid = element.attr("mPid") || options.mPid;

        	options._menuIterationMap = [];

        	var onSelect = element.attr("onSelect");
    		options.onSelect=onSelect ? function(item,event){
				if($.isString(onSelect)){
					var i = onSelect.indexOf("(");
					var actName = i>0 ? onSelect.substring(0, i) : onSelect;
					var func = 	"return window."+actName+"?"+actName+".call(window, i ,e):false;";
					return new Function("i","e",func)(item,event);
				}
	        }: '';
    	},
        _init : function(){},
        /**
         * @加载菜单数据
         * @name aeMenutree#reload
         * @function
         * @param data 为ajax获取的后台返回数据
         * @param topId 一级菜单pid，对返回数据做二次删选
         * @example
         * $('#demo-menutree').aeMenutree('reload',data,topId);
         */
        reload : function(data, topId) {
        	var _self = this, $ele = this.element, options = this.options;
        	if(!data){
        		return;
        	}
        	if(topId){
        		data = _self._findChildrenData(data,topId);
        	}
    		data = _self._transformToNodes(data);
	       	$ele.append(_self._appendNodes.apply(_self, [data]));
	       	var lis = $ele.find('>ul li');
	       	for(var i=0; i<lis.length; i++){
            	//TODO:如果有不可用菜单项，再此需做判断处理
            	_self._bindLiEvent(lis[i]);
            };

        },
        _bindLiEvent : function(li){
            var _self = this, options = this.options;
            $(li).bind("click.menuItem",function(event){
            	var self_li = $(this);
            	self_li.addClass('active').siblings('li').removeClass('active');
                if(self_li.children('ul').length){
                	self_li.find('>a >i:last').addClass('icon-arrowlup-down').removeClass('icon-chevron-right');
                	self_li.children('ul').slideDown();
                	self_li.siblings('li').has('>ul').find('>a >i:last').addClass('icon-chevron-right').removeClass('icon-arrowlup-down');
                	self_li.siblings('li').has('>ul').children('ul').slideUp();
                }
                var item = _self.element.data(_self.element.attr("id") + "_" + self_li.attr("mid"));
                if(options.onSelect){
                	_self._trigger("onSelect",event,item);
                	event.stopPropagation();	//停止事件冒泡
                }
            });
        },

        /**
         * @递归方法
         * @返回topId的子项菜单数据
         * @不包括topId
         */
        _findChildrenData : function(data,topId){
        	var _self = this, options = this.options;
        	var id = options.mId, pid = options.mPid;
			for(var i=0;i<data.length;i++){
        		if(data[i][pid] == topId){
        			options._menuIterationMap.push(data[i]);
        			_self._findChildrenData(data,data[i][id]);
        		}
        	}
			return options._menuIterationMap;
        },
        /**
         * @构建树形结构数据
         */
        _transformToNodes : function(data) {
            //使用clone的对象来操作可避免数据污染
            var data = $.extend(true,[],data);
        	var options = this.options;
        	var id = options.mId, pid = options.mPid;
			var i, treeData = [];
			var tmpMap = [];
			for(i=0; i<data.length; i++){
				tmpMap[data[i][id]] = data[i];
			}
			for(i=0; i<data.length; i++){
				if(tmpMap[data[i][pid]]){
					var tpid = data[i][pid];
					if(!tmpMap[tpid]["_children"]){
						tmpMap[tpid]["_children"] = [];
					}
					//最多支持4层菜单
					if(tmpMap[tpid]["_hierarchy"] <= 2){
						data[i]["_hierarchy"] = tmpMap[tpid]["_hierarchy"] + 1;
						tmpMap[tpid]["_children"].push(data[i]);
						options._hierarchy = tmpMap[tpid]["_hierarchy"] + 1;
					}
				}else{
					data[i]["_hierarchy"] = 0;
					treeData.push(data[i]);
				}
			}
			return treeData;
		},
        /**
         * @递归方法
         * @构建菜单结构
         */
		_appendNodes : function(source, _hierarchy, unfold){
            var _self = this, options = this.options, menuHtml = [];
            var id = options.mId, pid = options.mPid, label = options.mLabel;
            var ulClass;
            switch(_hierarchy){
			    case 1 :
			    	ulClass = "menu-list";
			   	    break;
			    case 2 :
			    	ulClass = "menu-list menu-list-next";
			   	    break;
			    case 3 :
			    	ulClass = "menu-list menu-list-next-2";
			   	    break;
				default :
					ulClass = "nav nav-pills nav-stacked";
			   	    break;
			}
            var display = (_hierarchy === undefined) ? "block" : "none";
            display = unfold ? "block" : display;
            menuHtml.push("<ul class=\""+ulClass+"\" style=\"display:"+display+";\">");
            var childrenHtml = [];
            $(source).each(function(index, item){
                if(item._children){
                	var unfold = (item.unfold && (item.unfold === true || item.unfold === "true")) ? true : false;
                	unfold ? childrenHtml.push("<li mid=\""+item[id]+"\" class=\"active\">") : childrenHtml.push("<li mid=\""+item[id]+"\">");
                    childrenHtml.push("<a href=\"javascript:void(0)\" >");
                    item.icon ? childrenHtml.push("<i class=\""+item.icon+"\"></i>") : null;
                    childrenHtml.push(item[label]);
                    unfold ? childrenHtml.push("<i class=\"icon-arrowlup-down pull-right\"></i>") : childrenHtml.push("<i class=\"icon-chevron-right pull-right\"></i>");
                    childrenHtml.push("</a>");
                    childrenHtml.push(_self._appendNodes(item._children, item._hierarchy + 1, unfold));
                    childrenHtml.push("</li>");
                }else{
                	childrenHtml.push("<li mid=\""+item[id]+"\">");
                    childrenHtml.push("<a href=\"javascript:void(0)\">");
                    item.icon ? childrenHtml.push("<i class=\""+item.icon+"\"></i>") : null;
                    childrenHtml.push(item[label]);
                    childrenHtml.push("</a>");
                    childrenHtml.push("</li>");
                }
                var li = _self.element.attr('id') + "_" + item[id];
                _self.element.data(li, item);
            });
            menuHtml.push(childrenHtml.join(""));
            menuHtml.push("</ul>");
            return menuHtml.join("");
        },
        /**
         * @TODO: search bindEvent
         */
        _bindSearchEvent : function(){

        }
    });
});

define('ui-validate', function(require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
	//;(function($){
	$.extend($.fn, {
		// http://docs.jquery.com/Plugins/Validation/validate
		validate: function(options) {

			// if nothing is selected, return nothing; can't chain anyway
			if (!this.length) {
				options && options.debug && window.console && console.warn("nothing selected, can't validate, returning nothing");
				return;
			}


			// check if a validator for this form was already created
			var validator = $.data(this, 'validator');
			if (!validator) {
				//return validator;
				validator = new $.validator(options, this);
				$.data(this, 'validator', validator);
			}
			//if (validator.isAeForm) {
				if (validator.form()) {
					/*if ( validator.pendingRequest ) {
            validator.formSubmitted = true;
            return false;
          }
          return handle();*/
					return true;
				} else {
					//validator.focusInvalid();
					return false;
				}
			//} else {
			//	return false;
			//}
			//			return validator;
		},
		rules: function(command, argument) {
			var element = this[0];

			if (command) {
				var settings = $.data(element.form, 'validator').settings;
				var staticRules = settings.rules;
				var existingRules = $.validator.staticRules(element);
				switch (command) {
					case "add":
						$.extend(existingRules, $.validator.normalizeRule(argument));
						staticRules[element.name] = existingRules;
						if (argument.messages)
							settings.messages[element.name] = $.extend(settings.messages[element.name], argument.messages);
						break;
					case "remove":
						if (!argument) {
							delete staticRules[element.name];
							return existingRules;
						}
						var filtered = {};
						$.each(argument.split(/\s/), function(index, method) {
							filtered[method] = existingRules[method];
							delete existingRules[method];
						});
						return filtered;
				}
			}

			var data = $.validator.normalizeRules(
				$.extend({},
					$.validator.metadataRules(element)
					//				$.validator.classRules(element),
					//				$.validator.attributeRules(element),
					//				$.validator.staticRules(element)
				), element);

			// make sure required is at front
			if (data.required) {
				var param = data.required;
				delete data.required;
				data = $.extend({
					required: param
				}, data);
			}

			return data;
		}
	});
	// constructor for validator
	$.validator = function(options, form) {
		this.settings = $.extend(true, {}, $.validator.defaults, options);
		//this.isAeForm = (form.attr("aeType")==="aeForm");
		this.currentForm = form.find('input[aeValidate="true"],textarea[aeValidate="true"]');
		if (form.is('input[aeValidate="true"],textarea[aeValidate="true"]')) {
			this.currentForm = form;
		}
		for (var k = 0, elements = this.currentForm; elements[k]; k++) {
			var onAddRules = $(elements[k]).attr("onAddRules");
			if (onAddRules) {
				var i = onAddRules.indexOf("(");
				var actName = i > 0 ? onAddRules.substring(0, i) : onAddRules;
				var func = "return window." + actName + "?" + actName + ".call(window):false;";
				new Function(func)();
			}
		}
		this.init();
	};

	$.validator.format = function(source, params) {
		if (arguments.length == 1)
			return function() {
				var args = $.makeArray(arguments);
				args.unshift(source);
				return $.validator.format.apply(this, args);
			};
		if (arguments.length > 2 && params.constructor != Array) {
			params = $.makeArray(arguments).slice(1);
		}
		if (params.constructor != Array) {
			params = [params];
		}
		$.each(params, function(i, n) {
			source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
		});
		return source;
	};

	$.extend($.validator, {

		defaults: {
			/**
			 * 键值对的校验错误信息.键是元素的name属性，值是错误信息的组合对象。<br/>
			 * @name validate#messages
			 * @type JSON
			 * @default 无
			 * @example
			 * $(".selector").validate({
			 *  rules: {
			 *    name: {
			 *      required: true,
			 *      minlength: 2
			 *    }
			 *  },
			 *  messages: {
			 *    name: {
			 *      required: "We need your email address to contact you",
			 *      minlength: jQuery.format("At least {0} characters required!")
			 *      //这里的{0}就是minlength定义的2
			 *    }
			 *  }
			 *})
			 */
			messages: {},
			/**
			 * 键值对的校验规则.键是元素的name属性，值是校验规则的组合对象，每一个规则都可以绑定一个依赖对象，<br/>
			 * 通过depends设定，只有依赖对象成立才会执行验证<br/>
			 * @name validate#rules
			 * @type JSON
			 * @default 无
			 * @example
			 * $(".selector").validate({
			 *  rules: {
			 *    contact: {
			 *      required: true,
			 *      email: {
			 *        depends: function(element) {
			 *          return $("#contactform_email:checked")
			 *          //email校验的前提是contactform_email被选中
			 *        }
			 *      }
			 *    }
			 *  }
			 *})
			 */
			rules: {},
			/**
			 * 校验错误的时候是否将聚焦元素。<br/>
			 * @name validate#focusInvalid
			 * @type Boolean
			 * @default true
			 * @example
			 * $(".selector").validate({
			 *      focusInvalid: false
			 *   })
			 */
			focusInvalid: true,

			onfocusin: function(element) {
				this.lastActive = element;

				// hide error label and remove error class on focus if enabled
				//				if ( this.settings.focusCleanup && !this.blockFocusCleanup ) {
				//					this.settings.unhighlight && this.settings.unhighlight.call( this, element, this.settings.errorClass, this.settings.validClass );
				//					this.addWrapper(this.errorsFor(element)).hide();
				//				}
				//START
				var toolTip = $(document.body).find('div.tooltip');
				if (!this.checkable(element) && (element.attr("aeid") in this.submitted || !this.optional(element))) {
					element = this.clean(element);
					this.lastElement = element;
					this.prepareElement(element);
					this.currentElements = $(element);
					var result = this.check(element);
					if (result) {
						delete this.invalid[$(element).attr("id")];
					} else {
						this.invalid[$(element).attr("id")] = true;
					}
					if (!this.numberOfInvalids()) {
						// Hide error containers on last error
						this.toHide = this.toHide.add(this.containers);
					}
					if (this.errorList.length > 0) {
						toolTip.show().find('div.tooltip-inner').html(this.errorList[0].message);
						var span = $(element),
							inputPos = span.offset();
						toolTip.css({
							'top': inputPos.top,
							'left': inputPos.left,
							'margin-top': '-' + toolTip.outerHeight() + 'px',
							'z-index': "99999"
						});
					}
				} else {
					if (toolTip.length > 0) {
						toolTip.hide();
					}
				}
				//END
			},

			/**
			 * 在blur事件发生时是否进行校验，如果没有输入任何值，则将忽略校验。
			 * @name validate#onfocusout
			 * @type Boolean
			 * @default true
			 * @example
			 * $(".selector").validate({
			 *      onfocusout: false
			 *   })
			 */
			onfocusout: function(element) {
				if (this.settings.validateOnEmpty) {
					if (!this.checkable(element) || (element.name in this.submitted)) {
						this.element(element);
					}
				} else {
					if (!this.checkable(element) && (element.attr("id") in this.submitted || !this.optional(element))) {
						this.element(element);
					}
				}
				if ($(document.body).find('div.tooltip').length > 0) {
					$(document.body).find('div.tooltip').hide();
				};
			},
			/**
			 * 在keyup事件发生时是否进行校验。
			 * @name validate#onkeyup
			 * @type Boolean
			 * @default true
			 * @example
			 * $(".selector").validate({
			 *      onkeyup: false
			 *   })
			 */
			onkeyup: function(element) {
				if (element.attr("id") in this.submitted || this.clean(element) == this.lastElement) {
					this.element(element);
				}
			},
			onvaluechange: function(element) {
				if (element.attr("aeid") in this.submitted || this.clean(element) == this.lastElement) {
					this.element(element);

				}
			}
		},

		messages: {
			required: "This field is required.",
			remote: "Please fix this field.",
			email: "Please enter a valid email address.",
			url: "Please enter a valid URL.",
			date: "Please enter a valid date.",
			number: "Please enter a valid number.",
			digits: "Please enter only digits.",
			equalTo: "Please enter the same value again.",
			accept: "Please enter a value with a valid extension.",
			maxlength: $.validator.format("Please enter no more than {0} characters."),
			minlength: $.validator.format("Please enter at least {0} characters."),
			rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
			range: $.validator.format("Please enter a value between {0} and {1}."),
			max: $.validator.format("Please enter a value less than or equal to {0}."),
			min: $.validator.format("Please enter a value greater than or equal to {0}.")
		},

		prototype: {
			init: function() {
				this.submitted = {};
				this.invalid = {};
				var rules = this.settings.rules;
				$.each(rules, function(key, value) {
					rules[key] = $.validator.normalizeRule(value);
				});
				var self = this;

				function delegate(event) {
					/*var validator = $.data(this, "validator"),
						eventType = "on" + event.type.replace(/^validate/, "");
					validator.settings[eventType] && validator.settings[eventType].call(validator, this[0] );*/
					var eventType = "on" + event.type.replace(/^validate/, "");
					(self.settings)[eventType] && (self.settings)[eventType].call(self, this);
				}

				this.currentForm
					.validateDelegate(":text, :password, :file, select, textarea", "focusin focusout keyup valuechange", delegate)
					.validateDelegate(":radio, :checkbox, select, option", "click", delegate);
			},
			form: function() {
				this.checkForm();
				$.extend(this.submitted, this.errorMap);
				this.invalid = $.extend({}, this.errorMap);
				//				if (!this.valid())
				//					$(this.currentForm).triggerHandler("invalid-form", [this]);
				this.showErrors();
				return this.valid();

				/*	$.extend(this.submitted, this.errorMap);
				this.invalid = $.extend({}, this.errorMwap);
				if (!this.valid())
					$(this.currentForm).triggerHandler("invalid-form", [this]);
				this.showErrors();
				return this.valid();*/
			},

			element: function(element) {
				element = this.clean(element);
				this.lastElement = element;
				this.prepareElement(element);
				this.currentElements = $(element);
				var result = this.check(element);
				if (result) {
					delete this.invalid[element.name];
				} else {
					this.invalid[element.name] = true;
				}
				if (!this.numberOfInvalids()) {
					// Hide error containers on last error
					this.toHide = this.toHide.add(this.containers);
				}
				this.showErrors();
				return result;
			},

			showErrors: function(errors) {
				if (errors) {
					// add items to error list and map
					$.extend(this.errorMap, errors);
					this.errorList = [];
					for (var name in errors) {
						this.errorList.push({
							message: errors[name],
							element: this.findByName(name)[0]
						});
					}
					// remove items from success list
					this.successList = $.grep(this.successList, function(element) {
						return !(element.name in errors);
					});
				}
				/*this.settings.showErrors
					? this.settings.showErrors.call( this, this.errorMap, this.errorList )
					: this.defaultShowErrors();*/
				if (this.errorList && this.errorList.length > 0) {
					this.defaultShowErrors();
					$.each(this.errorList, function(index, obj) {
						var item = $(obj.element),
							parent = item.parents('.input-icon');
						if (parent.length === 0) {
							parent = item.parents('.input-group')
						}
						parent.addClass('has-error has-feedback');
						//		             	if(parent.find('>span.fa-times-circle').length<=0){
						//						   $('<span class="fa fa-times-circle form-control-feedback"></span>').insertAfter(item);
						//						}
					});
				} else {
					var item = $(this.currentElements);
					$.each(item, function(index, obj) {
						var parent = $(obj).parents('.input-icon');
						if (parent.length === 0) {
							parent = item.parents('.input-group')
						}
						parent.removeClass('has-error has-feedback')
						//						if(parent.find('>span.fa-times-circle').length>0){
						//							parent.find('>span.fa-times-circle').remove();
						//						}
						var toolTip = $(document.body).find('div.tooltip');
						if (toolTip.length > 0) {
							toolTip.hide();
						}
					});
				}
			},

			defaultShowErrors: function() {
				var content = [];
				content.push('<div class="tooltip fade top in">');
				content.push('  <div class="tooltip-arrow"></div>');
				content.push('  <div class="tooltip-inner"></div>');
				content.push('</div>');
				if ($(document.body).find('div.tooltip').length <= 0) {
					$(content.join('')).appendTo($(document.body)).hide();
				};
			},

			checkForm: function() {
				/*	this.prepareForm();
				for ( var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++ ) {
					this.check( elements[i] );
				}
				return this.valid();*/
				this.prepareForm();
				for (var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++) {
					this.check(elements[i]);
				}
				return this.valid();
			},

			elements: function() {
				var validator = this,
					rulesCache = {};

				// select all valid inputs inside the form (no submit or reset buttons)
				return $(this.currentForm)
					.filter(function() {
						!this.id && validator.settings.debug && window.console && console.error("%o has no name assigned", this);

						// select only the first element for each name, and only those with rules specified
						var tempId = $(this).attr("aeid") || this.id;;
						if (tempId in rulesCache || !validator.objectLength($(this).rules()))
							return false;

						rulesCache[tempId] = true;
						return true;
					});
			},

			clean: function(selector) {
				return $(selector)[0];
			},

			reset: function() {
				this.successList = [];
				this.errorList = [];
				this.errorMap = {};
				this.toShow = $([]);
				this.toHide = $([]);
				this.currentElements = $([]);
			},

			prepareForm: function() {
				this.reset();
				//				this.toHide = this.errors().add( this.containers );
			},

			prepareElement: function(element) {
				this.reset();
				//				this.toHide = this.errorsFor(element);
			},

			check: function(element) {
				//				element = this.clean( element );

				// if radio/checkbox, validate first element in group instead
				//				if (this.checkable(element)) {
				//					element = this.findByName( element.name ).not(this.settings.ignore)[0];
				//				}

				//				var rules = '';
				//				if(this.settings.rules){
				//					rules = (this.settings.rules)[$(element).attr("id")];
				//				}
				var rules = $(element).rules();
				var dependencyMismatch = false;
				for (var method in rules) {
					var rule = {
						method: method,
						parameters: rules[method]
					};
					try {
						var result = $.validator.methods[method].call(this, element.value.replace(/\r/g, ""), element, rule.parameters);

						// if a method indicates that the field is optional and therefore valid,
						// don't mark it as valid when there are no other rules
						if (result == "dependency-mismatch") {
							dependencyMismatch = true;
							continue;
						}
						dependencyMismatch = false;

						if (result == "pending") {
							this.toHide = this.toHide.not(this.errorsFor(element));
							return;
						}

						if (!result) {
							this.formatAndAdd(element, rule);
							return false;
						}
					} catch (e) {
						this.settings.debug && window.console && console.log("exception occured when checking element " + element.id + ", check the '" + rule.method + "' method", e);
						throw e;
					}
				}
				if (dependencyMismatch)
					return;
				if (this.objectLength(rules))
					this.successList.push(element);
				return true;
			},

			// return the custom message for the given element and validation method
			// specified in the element's "messages" metadata
			customMetaMessage: function(element, method) {
				if (!$.metadata)
					return;

				var meta = this.settings.meta ? $(element).metadata()[this.settings.meta] : $(element).metadata();

				return meta && meta.messages && meta.messages[method];
			},

			// return the custom message for the given element name and validation method
			customMessage: function(name, method) {
				var m = this.settings.messages[name];
				return m && (m.constructor == String ? m : m[method]);
			},

			// return the first defined argument, allowing empty strings
			findDefined: function() {
				for (var i = 0; i < arguments.length; i++) {
					if (arguments[i] !== undefined)
						return arguments[i];
				}
				return undefined;
			},

			defaultMessage: function(element, method) {
				return this.findDefined(
					this.customMessage($(element).attr("id"), method),
					this.customMetaMessage(element, method),
					// title is never undefined, so handle empty string as undefined
					!this.settings.ignoreTitle && undefined,
					$.validator.messages[method],
					"<strong>Warning: No message defined for " + $(element).attr("id") + "</strong>"
				);
			},

			formatAndAdd: function(element, rule) {
				var message = this.defaultMessage(element, rule.method),
					theregex = /\$?\{(\d+)\}/g;
				if (typeof message == "function") {
					message = message.call(this, rule.parameters, element);
				} else if (theregex.test(message)) {
					message = jQuery.format(message.replace(theregex, '{$1}'), rule.parameters);
				}
				this.errorList.push({
					message: message,
					element: element
				});

				var tempId = $(element).attr("aeid") || $(element).attr("id");
				this.errorMap[tempId] = message;
				this.submitted[tempId] = message;
			},

			checkable: function(element) {
				return /radio|checkbox/i.test(element.type);
			},
			getLength: function(value, element) {
				switch (element.nodeName.toLowerCase()) {
					case 'select':
						return $("option:selected", element).length;
					case 'input':
						if (this.checkable(element))
							return this.findByName(element.name).filter(':checked').length;
				}
				return value.length;
			},
			depend: function(param, element) {
				return this.dependTypes[typeof param] ? this.dependTypes[typeof param](param, element) : true;
			},
			dependTypes: {
				"boolean": function(param, element) {
					return param;
				},
				"string": function(param, element) {
					return !!$(param, element.form).length;
				},
				"function": function(param, element) {
					return param(element);
				}
			},

			optional: function(element) {
				return !$.validator.methods.required.call(this, $.trim(element.value), element) && "dependency-mismatch";
			},

			numberOfInvalids: function() {
				return this.objectLength(this.invalid);
			},
			objectLength: function(obj) {
				var count = 0;
				for (var i in obj)
					count++;
				return count;
			},
			valid: function() {
				return this.size() == 0;
			},
			size: function() {
				return this.errorList.length;
			},
			focusInvalid: function() {
				if (this.settings.focusInvalid) {
					try {
						$(this.findLastActive() || this.errorList.length && this.errorList[0].element || [])
							.filter(":visible")
							.focus()
						// manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
						.trigger("focusin");

						//START
						var toolTip = $(document.body).find('div.tooltip');
						toolTip.show().find('div.tooltip-inner').html(this.errorList[0].message);
						var span = $(this.errorList[0].element).parent(),
							inputPos = span.offset();
						toolTip.css({
							'left': inputPos.left,
							'top': inputPos.top + span.outerHeight(),
							'z-index': "999999"
						});
						//END
					} catch (e) {
						// ignore IE throwing errors when focusing hidden elements
					}
				}
			},
			findLastActive: function() {
				var lastActive = this.lastActive;
				return lastActive && $.grep(this.errorList, function(n) {
					return n.element.name == lastActive.name;
				}).length == 1 && lastActive;
			}
		},
		// Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
		normalizeRule: function(data) {
			if (typeof data == "string") {
				var transformed = {};
				$.each(data.split(/\s/), function() {
					transformed[this] = true;
				});
				data = transformed;
			}
			return data;
		},

		normalizeRules: function(rules, element) {
			// handle dependency check
			$.each(rules, function(prop, val) {
				// ignore rule when param is explicitly false, eg. required:false
				if (val === false) {
					delete rules[prop];
					return;
				}
				if (val.param || val.depends) {
					var keepRule = true;
					switch (typeof val.depends) {
						case "string":
							keepRule = !! $(val.depends, element.form).length;
							break;
						case "function":
							keepRule = val.depends.call(element, element);
							break;
					}
					if (keepRule) {
						rules[prop] = val.param !== undefined ? val.param : true;
					} else {
						delete rules[prop];
					}
				}
			});

			// evaluate parameters
			$.each(rules, function(rule, parameter) {
				rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
			});

			// clean number parameters
			$.each(['minlength', 'maxlength', 'min', 'max'], function() {
				if (rules[this]) {
					rules[this] = Number(rules[this]);
				}
			});
			$.each(['rangelength', 'range'], function() {
				if (rules[this]) {
					rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
				}
			});

			if ($.validator.autoCreateRanges) {
				// auto-create ranges
				if (rules.min && rules.max) {
					rules.range = [rules.min, rules.max];
					delete rules.min;
					delete rules.max;
				}
				if (rules.minlength && rules.maxlength) {
					rules.rangelength = [rules.minlength, rules.maxlength];
					delete rules.minlength;
					delete rules.maxlength;
				}
			}

			// To support custom messages in metadata ignore rule methods titled "messages"
			if (rules.messages) {
				delete rules.messages;
			}

			return rules;
		},

		classRuleSettings: {
			required: {
				required: true
			},
			email: {
				email: true
			},
			url: {
				url: true
			},
			date: {
				date: true
			},
			number: {
				number: true
			},
			digits: {
				digits: true
			},
			creditcard: {
				creditcard: true
			}
		},

		addClassRules: function(className, rules) {
			className.constructor == String ?
				this.classRuleSettings[className] = rules :
				$.extend(this.classRuleSettings, className);
		},

		metadataRules: function(element) {
			if (!$.metadata) return {};

			/*	var meta = $.data(element.form, 'validator').settings.meta;
			return meta ?
				$(element).metadata()[meta] :
				$(element).metadata({type:'attr',name:'rules'});*/
			return $(element).metadata({
				type: 'attr',
				name: 'rules'
			});
		},

		addMethod: function(name, method, message) {
			$.validator.methods[name] = method;
			$.validator.messages[name] = message != undefined ? message : $.validator.messages[name];
			if (method.length < 3) {
				$.validator.addClassRules(name, $.validator.normalizeRule(name));
			}
		},

		methods: {

			// http://docs.jquery.com/Plugins/Validation/Methods/required
			required: function(value, element, param) {
				// check if dependency is met
				if (!this.depend(param, element))
					return "dependency-mismatch";
				switch (element.nodeName) {
					case 'SELECT':
						// could be an array for select-multiple or a string, both are fine this way
						var val = $(element).val();
						return val && val.length > 0;
					case 'INPUT':
						if (this.checkable(element))
							return this.getLength(value, element) > 0;
					default:
						return $.trim(value).length > 0;
				}
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/remote
			remote: function(value, element, param) {
				if (this.optional(element))
					return "dependency-mismatch";

				var previous = this.previousValue(element);
				if (!this.settings.messages[element.name])
					this.settings.messages[element.name] = {};
				previous.originalMessage = this.settings.messages[element.name].remote;
				this.settings.messages[element.name].remote = previous.message;

				param = typeof param == "string" && {
					url: param
				} || param;

				if (this.pending[element.name]) {
					return "pending";
				}
				if (previous.old === value) {
					return previous.valid;
				}

				previous.old = value;
				var validator = this;
				this.startRequest(element);
				var data = {};
				data[element.name] = value;
				$.ajax($.extend(true, {
					url: param,
					mode: "abort",
					port: "validate" + element.name,
					dataType: "json",
					data: data,
					success: function(response) {
						validator.settings.messages[element.name].remote = previous.originalMessage;
						var valid = response === true;
						if (valid) {
							var submitted = validator.formSubmitted;
							validator.prepareElement(element);
							validator.formSubmitted = submitted;
							validator.successList.push(element);
							validator.showErrors();
						} else {
							var errors = {};
							var message = response || validator.defaultMessage(element, "remote");
							errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
							validator.showErrors(errors);
						}
						previous.valid = valid;
						validator.stopRequest(element, valid);
					}
				}, param));
				return "pending";
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/minlength
			minlength: function(value, element, param) {
				return this.getLength($.trim(value), element) >= param;
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/maxlength
			maxlength: function(value, element, param) {
				return this.getLength($.trim(value), element) <= param;
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/rangelength
			rangelength: function(value, element, param) {
				var length = this.getLength($.trim(value), element);
				return (length >= param[0] && length <= param[1]);
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/min
			min: function(value, element, param) {
				return value >= param;
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/max
			max: function(value, element, param) {
				return value <= param;
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/range
			range: function(value, element, param) {
				return (value >= param[0] && value <= param[1]);
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/email
			email: function(value, element) {
				// contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
				return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/url
			url: function(value, element) {
				// contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
				return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/date
			date: function(value, element) {
				return !/Invalid|NaN/.test(new Date(Date.parse(value.replace(/-/g, '/'))));
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/number
			number: function(value, element) {
				return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/digits
			digits: function(value, element) {
				return /^\d+$/.test(value);
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/accept
			accept: function(value, element, param) {
				param = typeof param == "string" ? param.replace(/,/g, '|') : "png|jpe?g|gif";
				return value.match(new RegExp(".(" + param + ")$", "i"));
			},

			// http://docs.jquery.com/Plugins/Validation/Methods/equalTo
			equalTo: function(value, element, param) {
				// bind to the blur event of the target in order to revalidate whenever the target field is updated
				// TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
				var target = $(param).unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
					$(element).valid();
				});
				return value == target.val();
			}
		}
	});
	//})(jQuery);
});

;
(function($) {
	// only implement if not provided by jQuery core (since 1.4)
	// TODO verify if jQuery 1.4's implementation is compatible with older jQuery special-event APIs
	//	if (!jQuery.event.special.focusin && !jQuery.event.special.focusout && document.addEventListener) {
	//		$.each({
	//			focus: 'focusin',
	//			blur: 'focusout'
	//		}, function( original, fix ){
	//			$.event.special[fix] = {
	//				setup:function() {
	//					this.addEventListener( original, handler, true );
	//				},
	//				teardown:function() {
	//					this.removeEventListener( original, handler, true );
	//				},
	//				handler: function(e) {
	//					arguments[0] = $.event.fix(e);
	//					arguments[0].type = fix;
	//					return $.event.handle.apply(this, arguments);
	//				}
	//			};
	//			function handler(e) {
	//				e = $.event.fix(e);
	//				e.type = fix;
	//				return $.event.handle.call(this, e);
	//			}
	//		});
	//	};
	$.extend($.fn, {
		validateDelegate: function(delegate, type, handler) {
			return this.bind(type, function(event) {
				var target = $(event.target);
				if (target.is(delegate)) {
					return handler.apply(target, arguments);
				}
			});
		}
	});
})(jQuery);
define('ui-form',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
	$.aeWidget('ae.aeForm', {
		options:{
			/**
			 * aeForm初始化方式，默认通过html来设置参数。传值为js时，则通过js中设置的option来初始化。
			 * @type String
			 * @default 'html'
			 * @example
			 * $('.selector').aeForm({initType : 'js'});
			 */
			initType : 'html',
			/**
			 * reload时初始化内部的aeType组件,仅处理aeInit为true的组件
			 */
			initChildren : true
		},
		_create:function(){
			var self = this,
				options=self.options,
				el=self.element,
				id=el.attr("id");
			if(id){
				el.attr("aeId",id);
			}
			if(options.initType=='html'){
				self._buildOptions(options,el);
			}
		},
		_init:function(){

		},
		_buildOptions:function(options,el){
			options.dataField=el.attr("dataField");
			options.aeType = el.attr("aeType");
			options.initChildren = el.attr("initChildren")=="false" ? false : options.initChildren;
		},
		/**
		 * 设置表格的编辑状态　value = true(可编辑),false(不可编辑)
		 * @name aeForm#setEditSts
		 * @function
		 * @param value:编辑状态
		 * @example
		 * $('#custForm').aeForm('setEditSts',true);
		 *
		 */
		setEditSts:function(value){
			var el = this.element;
			return el.each(function() {
				$('*[datafield]', this).enable(value);
			});
		},
		/**
		 * 根据列名设置列的可编辑属性 value = true(可编辑),false(不可编辑)
		 * @name aeForm#setColEditSts
		 * @function
		 * @param dataField:列名,value:编辑状态
		 * @example
		 * $('#custForm').aeForm('setColEditSts',dataField,value);
		 *
		 */
		setColEditSts:function(dataField,value){
			var els = $('[datafield="'+dataField+'"]', this.element);
			els.enable(value);
		},
		/**
		 * 根据列名设置列的隐藏和显示状态 value = true(显示),false(隐藏)
		 * @name aeForm#setColVisibleSts
		 * @function
		 * @param dataField:列名,value:隐藏和显示状态
		 * @example
		 * $('#custForm').aeForm('setColVisibleSts',dataField,value);
		 *
		 */
		setColVisibleSts:function(dataField,value){
			var els = $('[datafield="'+dataField+'"]',this.element);
			els.visible(value);
		},
		/**
		 * 清空字段值
		 * @name aeForm#clear
		 * @function
		 * @param dataField 设置的值表示清空指定字段值，不设置表示清空全部字段值
		 * @example
		 * $('#custForm').aeForm('clear',dataField);
		 *
		 */
		clear:function(dataField){
			var el = this.element, els, i, dataFields;
			if(typeof dataField === 'undefined' || dataField === ''){
				return el.each(function() {
					$('*[dataField]', this).clearFields();
				});
			}else{
				if(dataField.indexOf(",")>=0){
					dataFields = dataField.split(",");
					for(i in dataFields){
						els = $('[datafield="'+dataField[i]+'"]', el);
						els.clearFields();
					}
				}else{
					els = $('[datafield="'+dataField+'"]', el);
					els.clearFields();
				}
			}
		},
		/**
		 * 根据列名设置相应表单元素值。
		 * @name aeForm#setValueByField
		 * @function
		 * @param dataField列名,value数据值
		 * @example
		 * $('#custForm').aeForm('setValueByField',dataField,value);
		 *
		 */
		setValueByField:function(dataField,value){
			var els = $('[dataField="'+dataField+'"]', this.element);
			els.setField(value,this.element);
		},
		/**
		 * 获取指定单元的数据值。
		 * @name aeForm#getValueByField
		 * @function
		 * @param dataField列名
		 * @example
		 * $('#custForm').aeForm('getValueByField',dataField);
		 *
		 */
		getValueByField:function(dataField){
			var els = $('[dataField="'+dataField+'"]', this.element);
			return els.getValue();
		},
		/**
		 * 获取指定单元的显示值。
		 * @name aeForm#getDisplayTextByField
		 * @function
		 * @param dataField列名
		 * @example
		 * $('#custForm').aeForm('getDisplayTextByField',dataField);
		 *
		 */
		getDisplayTextByField:function(dataField){
			var els=$('[datafield="'+dataField+'"]',this.element);
			return els.getDisplayText();
		},
		/**
		 * 根据对应的dataField获取表单元素jQuery对象。
		 * @name aeForm#getField
		 * @function
		 * @param dataField
		 * @example
		 */
		/* getField:function(dataField){
		 if(dataField){
		 var dataField  = dataField.replace(new RegExp(/\./g),'_');
		 if(/\[\d{1,}\]/g.test(dataField)){
		 dataField  = dataField.replace(new RegExp(/\[/g),'_').replace(new RegExp(/\]/g),'');
		 }
		 return $("#"+this.element.attr("id")+"_"+dataField);
		 }
		 },*/
		/**
		 * 根据data刷新表单区域。
		 * @name aeForm#reload
		 * @function
		 * @param data
		 * @example
		 */
		reload:function(data){
			var self = this,$ele = this.element,opts = self.options,children;
			if(data){
				if(opts.initChildren){
					children = $ele.find('*[datafield]');
					if(children.length){
						$.each(children,function(index,item){
							if($(item).attr("aeInit")=="true"){
								$(item)[$(item).attr('aeType')]();
								$(item).attr('aeInit','false');
							}
						});
					}
				}
				data = $.aries.common.getDataByDatafield(data,opts.dataField);
				return $ele.each(function() {
					$('[dataField]', this).setField(data,$ele);
				});
			}
		},
		/**
		 * 获取表单区域的数据。
		 * @name aeForm#getData
		 * @function
		 * @param
		 * @example
		 */
		getData:function(needTrans){
			var obj = {},returnData = {},dataField = this.options.dataField;
			this.element.find('[dataField]').each(function(index,item){
				var dataField = $(item).attr("dataField"),type=$(item).attr("aeType"),val='';
				if(type){
					val = $(item)[type]("getValue");
					obj = $.aries.common.buildUiidData(obj,dataField,val);
				}
			});
			if(dataField){
				returnData = $.aries.common.buildUiidData(returnData,dataField,obj);
			}else{
				returnData = obj;
			}
			if(needTrans && (needTrans ==='true'|| needTrans ===true)){
				returnData = JSON.stringify(returnData);
			}
			return returnData;
		}
	});
	$.fn.clearFields = function() {
		return this.each(function() {
			var aeType = $.attr(this,"aeType");
			aeType ? $(this)[aeType]('clear') : null;
		});
	};
	$.fn.enable = function(b) {
		if (b === undefined) {
			b = true;
		}
		return this.each(function() {
			var aeType = $.attr(this,"aeType");
			if(!b){
				$(this)[aeType]('enable',false);
			}else{
				$(this)[aeType]('enable',true);
			}
		});
	};
	$.fn.visible = function(b){
		if (b === undefined) {
			b = true;
		}
		return this.each(function() {
			var aeType = $.attr(this,"aeType");
			if(!b){
				$(this)[aeType]('visible',false);
			}else{
				$(this)[aeType]('visible',true);
			}
		});
	};
	$.fn.setField = function(v,el) {
		return this.each(function() {
			var value="",objValue=v,
				type=$.attr(this,"aeType");
			var $span = $(this);

			if(v && typeof v == 'object'){
				if($.isArray(v)){
					objValue = v[0];
				}
				var dataField = $.attr(this,"dataField");
				if(dataField){
					value = $.aries.common.getDataByDatafield(objValue,dataField);
				}
			}else{
				value = v;
			}
			if(type){
				$span[type]('setValue',value);
			}else{
				if(typeof value === 'undefined' || value === ''){
					$span.val('');
				}else{
					$span.val(value);
				}
			}
		});
	};
	$.fn.getValue = function() {
		var value='';
		this.each(function() {
			var type=$.attr(this,"aeType");
			if(type){
				value = $(this)[type]('getValue');
			}else{
				value = $(this).val();
			}
		});
		return value;
	};
	$.fn.getDisplayText = function() {
		var value='';
		this.each(function() {
			var type=$.attr(this,"aeType");
			if(type){
				value = $(this)[type]('getDisplayText');
			}else{
				value = $(this).val();
			}
		});
		return value;
	};
});

define('ui-progressbar',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
/*
 * $Id: ui-progressbar.js$
 * Depends:
 *  ui-core.js
 */
/**
 * @name aeProgressbar
 * @class 进度条一般用来呈现任务完成的进度情况。<br/>
 * <b>示例：</b><br/>
 * <pre>
 * &lt;script type="text/javascript" &gt;
 * $(document).ready(function() {
 *     $('#selector').aeProgressbar({
 *         value : 30
 *     });
 * });
 * &lt;/script&gt;
 *
 * &lt;div id="selector" /&gt;
 * </pre>
 * @constructor
 * @description 构造函数.
 * @param p 标准config对象：{}
 * @example
 * $('#selector').aeProgressbar();
 */

$.aeWidget("ae.aeProgressbar", {

	options: /**@lends aeProgressbar#*/{
		/**
         * 进度值，默认值为0，最大值为100
         * @type Number
         * @default 0
         * @example
         * $("#selector").aeProgressbar({value:50});
         */
		value: 0,

		/**
         * 提示内容，默认的内容格式为{value}%，如当进度值为30时，显示的文本为30%; 并且支持方法自定义提示内容，
         * 方法提供一个参数为当前的进度值，返回值为提示内容。
         * @type String, Function
         * @default "{value}%"
         * @example
         * $("#selector").aeProgressbar({text: "已完成{value}%"});
         */
		text: "{value}%",
		/**
         * 设置进度条的宽度,单位为像素,默认值为"auto"自适应宽度。
         * @type Number,String
         * @default auto
         * @example
         * $("#selector").aeProgressbar({width: 300});
         */
		width: "auto",

		max: 100,
		/**
         * 是否设置进度条为大号进度条。
         * @type Boolean
         * @default false
         * @example
         * $("#selector").aeProgressbar({large: true});
         */
		large: false,
		/**
		 * 进度值改变触发事件。
		 * @event
		 * @name aeProgressbar#onChange
		 * @param newValue 改变后进度值
		 * @param oldValue 改变前进度值
		 * @param event jQuery.Event对象
		 * @example
		 *  $("#selector").aeProgressbar({
		 *      onChange: function(newValue, oldValue, event){ ... }
		 *  });
		 */
		/**
         * progressbar初始化方式，默认通过html来设置参数。传值为js时，则通过js中设置的option来初始化。
         * @type String
         * @default 'html'
         * @example
         * $('.selector').aeProgressbar({initType : 'js'});
         */
        initType : 'html'
	},

	min: 0,

	_create: function() {
	    var $ele = this.element,
	        $ops=this.options,
			id=$ele.attr("id");
		if(id){
			$ele.attr("aeId",id);
		}
        if($ops.initType=='html'){
        	this._buildOptions($ops,$ele);
        }
		$ele.attr("aeType",($ops.aeType || "aeProgressbar"));
        if($ops.uiid){
			$ele.attr("uiid",$ops.uiid);
		}else{
			$ele.attr("uiid",$ele.attr("id"));
		}

		$ele.addClass( "e_progress" );
        this.valueDiv = $('<span class="e_progressBar"></span>').appendTo($ele);
		this.textDiv = $('<span class="e_progressValue"></span>').appendTo($ele);
	},

	_init : function() {
		var $ele = this.element,options=this.options,width = $ele.width();
	    if( typeof(options.width) == "number" ){
            width = options.width;
            $ele.width(width);
        }

	    if(options.large){
	    	$ele.addClass("e_progress-big");
	    }
//	    this.textDiv.width(Math.floor(width));
	    this.oldValue = this._value();
        this._refreshValue();
	},
	_buildOptions:function(options,valueEl){
		options.value = parseInt(valueEl.attr("value"))|| options.value;
		options.width = parseInt(valueEl.attr("width"))|| options.width;
		options.large = valueEl.attr("large")=='true' ? true : options.large;
		options.aeType = valueEl.attr("aeType");
		options.uiid = valueEl.attr("uiid");

		var text = valueEl.attr("text") || options.text;
    	options.text= text && text.indexOf("(") > 0 ? function(value){
    		if($.isString(text)){
				var i = text.indexOf("(");
				var actName = i>0 ? text.substring(0, i) : text;
				var func = "return window."+actName+"?"+actName+".call(window,v):false;";
				return new Function("v",func)(value);
			}
    	}: text;

		var onChange = valueEl.attr("onChange");
    	options.onChange=onChange ? function(newValue, oldValue, event){
			if($.isString(onChange)){
				var i = onChange.indexOf("(");
				var actName = i>0 ? onChange.substring(0, i) : onChange;
				var func = 	"return window."+actName+"?"+actName+".call(window, n ,o , e):false;";
				return new Function("n","o","e",func)(newValue, oldValue, event);
			}
    	}: options.onChange;
	},
	/**
     * 设置当前进度值。
     * @name aeProgressbar#setValue
     * @param newValue Number对象 设置进度值
     * @function
     * @example
     * $("#selector").aeProgressbar('setValue', '30');
     *
     */
	setValue: function( newValue ) {
		this.options.value = newValue;
        this._refreshValue();
	},

	/**
     * 获取当前进度值。
     * @name aeProgressbar#getValue
     * @function
     * @example
     * $("#selector").aeProgressbar('getValue');
     *
     */
	getValue: function(){
		return this._value();
	},

	_value: function() {
		var val = this.options.value;
		// normalize invalid value
		if ( typeof val !== "number" ) {
			val = 0;
		}
		return Math.min( this.options.max, Math.max( this.min, val ) );
	},

	_percentage: function() {
		return 100 * this._value() / this.options.max;
	},

	_refreshValue: function() {
		var self = this, value = self.getValue(), onChange = self.options.onChange;
		var percentage = self._percentage();
		var text = self.options.text, label = "";

		self.valueDiv
			.toggle( value >= self.min )
//			.toggleClass( "om-corner-right", value === self.options.max )
			.width( percentage.toFixed(0) + "%" );

		if(typeof(text) == "function"){
			label = text.call(value,value);
		}else if(typeof(text) == "string"){
			label = text.replace("{value}", value);
		}
		self.textDiv.html(label);

		if ( self.oldValue !== value ) {
			if(onChange){
				self._trigger("onChange",null,value,self.oldValue);
			}
			self.oldValue = value;
		}
	}
});
});

define('ui-tree',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
/*
 * $Id: ui-tree.js$
 * Depends:
 *  ui-core.js
 */
/**
     * @name aeTree
     * @class 树型组件<br/><br/>
     * treenode 支持两种json格式。<br/>
     * 第一种为：<br/>
     * <pre>
     * {
     *     text:'node1', // 树节点显示文本，必需
     *     expanded:true, // 是否默认展开，非必须，默认值是false
     *     classes:'folder', // 树节点样式，非必需，默认有folder和file，如果用户自定制为其他，则显示用户自定义样式
     *     children:childrenDataArray, //子节点，非必需。缓加载时可以没有这个属性
     *     hasChildren: false // 是否有子节点，非必需，如果值为true表示要缓加载此时可以没有children属性
     * }
     * </pre>
     * 第二种为：<br/>
     * <pre>
     * {
     *     id:'n1', //树节点的标识，必需
     *     pid: 'n0' //父节点id，非必需，如果没有设置该节点就为根节点
     *     text:'node1', // 树节点显示文本，必需
     *     expanded:true, // 是否默认展开，非必须，默认值是false
     *     classes:'folder' // 树节点样式，非必需，默认有folder和file，如果用户自定制为其他，则显示用户自定义样式
     * }
     * </pre>
     * 注意：如果使用第二中json格式，需要将simpleDataModel属性值设置为true。
     * aeTree为每个节点自动生成的唯一标识nid，生成规则为treeId+ "_" + 计数，请用户在aeTree的页面上避免
     * 使用此种规则定义其他对象的nid。不需要用户进行初始化，属于内部参数。
     * <br/>
     * <b>特点：</b><br/>
     * <ol>
     *      <li>可以使用本地数据源，也可以使用远程数据源</li>
     *      <li>支持数据的缓加载（开始取数时不取子节点数据，第一次展开时才开始向后台取数）</li>
     *      <li>提供丰富的事件</li>
     * </ol>
     *
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" >
     * var data =
     *       [{
     *           "text": "1. Review of existing structures",
     *           "children":[{
     *               "text": "1.1 jQuery core"
     *           }]
     *       }, {
     *           "text": "2. Wrapper plugins",
     *           "expanded": true,
     *           "children":[{
     *               "text":"2.1 wrapper tips",
     *               "expanded": true,
     *               "children": [{
     *                   "text":"2.1.1 wrapper loader tips"
     *               },{
     *                   "text":"2.1.2 wrapper runder tips"
     *               }]
     *           },{
     *               "text":"2.2 tree nodes"
     *           }]
     *       }, {
     *           "text": "3. Summary"
     *       }, {
     *           "text": "4. Questions and answers"
     *       }];
     *   $(document).ready(function(){
     *       $("#mytree").aeTree({
     *           dataSource : data
     *       });
     *   });
     * &lt;/script>
     *
     * &lt;ul id="mytree"/>
     * </pre>
     *
     * @constructor
     * @description 构造函数.
     * @param options 标准options对象：{}
     */
//;(function($){
    /**
     * treenode: { text:'node1', expanded:true}
     */

    var CLASSES =  {
            open: "open",
            closed: "closed",
            expandable: "expandable",
            expandableHitarea: "expandable-hitarea",
            lastExpandableHitarea: "lastExpandable-hitarea",
            collapsable: "collapsable",
            collapsableHitarea: "collapsable-hitarea",
            lastCollapsableHitarea: "lastCollapsable-hitarea",
            lastCollapsable: "lastCollapsable",
            lastExpandable: "lastExpandable",
            last: "last",
            hitarea: "hitarea",
            faFolder:"icon-folder",
            faFolderOpen:"icon-folder-open",
            iconPage:"icon-page2"
        };
    $.aeWidget("ae.aeTree", {
        _swapClass: function(target, c1, c2) {
            var c1Elements = target.filter('.' + c1);
            target.filter('.' + c2).removeClass(c2).addClass(c1);
            c1Elements.removeClass(c1).addClass(c2);
        },

        _getParentNode :function (target){
            if(target){
                var $pnode = $(target).parent().parent();
                if($pnode && $pnode.hasClass("tree-folder")) {
                    return $pnode;
                }
            }
            return null;
        },

        _setParentCheckbox: function (node,checked){
            var pnode = this._getParentNode(node);
            if (pnode){
            	var checkbox = pnode.find(">div.tree-folder-content").find('>div.tree-folder >div.tree-folder-header >div.ckbox >label');
                var allChild = checkbox.length;
                var full_len = checkbox.filter(".checked").length;
                var part_len = checkbox.filter(".checked_notall").length;
                var pnode_checkbox = pnode.find(">div.tree-folder-header >div.ckbox >label");
                pnode_checkbox.removeClass("checked_notall checked");
                if(full_len == allChild) {
                    pnode_checkbox.addClass("checked");
                } else if(full_len > 0 || part_len > 0) {
                    pnode_checkbox.addClass("checked_notall");
                }
                this._setParentCheckbox(pnode,checked);
            }
        },

        _setChildCheckbox : function (node, checked){
            var childck = node.find(">div.tree-folder-content").find('.ckbox');
            childck.find('>label').removeClass("checked checked_notall");
            if(checked) {
                childck.find('>label').addClass("checked");
            }
        },

        // target equal the li elements
        _applyEvents: function(target) {
            var self = this,
                options = self.options,
                onClick = options.onClick,
//              onDblClick = options.onDblClick,
//                onRightClick = options.onRightClick,
                onDrag =options.onDrag,
                onSelect = options.onSelect,
                onDrop = options.onDrop,
                isAsync = options.isAsync,
                source = options.dataSource;
            target.find("div.tree-folder-header").off('.aeTree')
//            .on("click.aeTree",function(e){
//            	var node = self.element.data("nodes")[$(this).closest('.tree-folder').attr("id")];
//           	    onClick && self._trigger("onClick",e,node);
//                self.selectNode(node["aeNodeId"]);
//                return false;
//            })
            .on("click.aeTree", function(e){
            	e.preventDefault();
				//e.stopPropagation();
				//e.cancelBubble=true;
            	var nDom = $(this).closest('.tree-folder');
            	var node = self.element.data("nodes")[nDom.attr("id")];
            	self.selectNode(node["aeNodeId"]);
                var isRootNode = (typeof node.aeNodePId === 'undefined' || node.aeNodePId === '');
                if(nDom.hasClass("hasChildren")){
                	var folder = nDom.find(">div.tree-folder-header >i");
                    self._swapClass(folder, CLASSES.faFolder, CLASSES.faFolderOpen);
            	}
                if (nDom.find(">div.tree-folder-content").length >0 && $(e.target, this) )
                    self.toggler(nDom);
                if(isAsync){
                   if(!isRootNode){
                	   var cache = $.data(self.element, 'cache');
    	               if(!cache){
                		   onClick && self._trigger("onClick",e,node,false);
                	   }else{
                		   if(!cache[node.nid]){
                			   onClick && self._trigger("onClick",e,node,false);
                		   }else{
                			   onClick && self._trigger("onClick",e,node,true);
                		   }
                	   } 
                   }else{
                	   onClick && self._trigger("onClick",e,node,true);
                   }
                }else{
                	onClick && self._trigger("onClick",e,node,false);
                }
            });
//            .bind("contextmenu.aeTree", function(e){
//                     var node = self.element.data("nodes")[$(this).parent().attr("id")];
//                     onRightClick && self._trigger("onRightClick",e,node);
//            });

        	target.find("div.ckbox").on("click.aeTree",function(event){
        		event.preventDefault();
				event.stopPropagation();
				event.cancelBubble=true;
                var node = $(this).closest('.tree-folder');
                var nodedata = $(this).find(">label").hasClass('checked');
                self._toggleCheck(node, nodedata);
            });
//            self._bindHitEvent(target);

            if (self.options.draggable) {

            }
            target.bind("mousedown", function(e){
                e.stopPropagation();
            });
        },
//        _bindHitEvent: function(target){
//        	var self=this;
//        	target.find("span.folder_ico").click(function() {
//                var node = $(this).parent();
//                if(node.hasClass("hasChildren")){
//            		node.find("span.folder")
//            		.removeClass("folder").addClass("placeholder");
//            	}
//                self.toggler(node);
//                node.find("span.placeholder").removeClass("placeholder").addClass("folder");
//            });
//        },
        options: /** @lends aeTree#*/{
            /* 暂不支持
             * 树初始状态时展开的层级.
             * @type Number
             * @default 0
             * @example
             * $("#mytree").aeTree({initExpandLevel:2});
             */
            initExpandLevel: 0,
            /**
             * 数据源属性，可以设置为后台获取数据的URL，比如dataSource : 'treedata.json'
             * 也可以设置为静态数据，数据必须为JSON格式数组，比如dataSource : [{"text":"iPhone"},{"text":"iPad"}]；
             * 其中支持两种JSON格式，第一种为
             * <pre>
             * {
             *     text: 'node1', // 树节点显示文本，必需
             *     expanded: true, // 是否默认展开
             *     classes: 'folder', // 树节点样式，非必需，默认有folder和file，用户可自定制此样式
             *     hasChildren: false // 树节点懒加载的情况下，该节点在展开时自动向后台取数
             * }
             * </pre>
             * 第二种为：
             * <pre>
             * {
             *     id:'n1', //树节点的标识，必需
             *     pid: 'n0' //父节点id，非必需，如果没有设置该节点就为根节点
             *     text: 'node1', // 树节点显示文本，必需
             *     expanded: true, // 是否默认展开
             *     classes: 'folder' // 树节点样式，非必需，默认有folder和file，用户可自定制此样式
             * }
             * </pre>
             *  注意：如果使用第二中json格式，需要将simpleDataModel属性值设置为true。
             * @name aeTree#dataSource
             * @type String,Array[JSON]
             * @default 无
             * @example
             * dataSource : 'treedata.json'
             * 或者
             * dataSource : [{"text":"iPhone"},{"text":"iPad"}]
             */
            /* 暂不支持
             * 鼠标划过某个节点时是否高亮。
             * @type Boolean
             * @default false
             * @example
             * $("#mytree").aeTree({lineHover:false});
             */
            lineHover: false,
            /**
             * 树节点是否显示图标。
             * @type Boolean
             * @default true
             * @example
             * $("#mytree").aeTree({showIcon:false});
             */
            showIcon: true,
            /* 暂不支持
             * 树节点之间是否显示连线。
             * @type Boolean
             * @default true
             * @example
             * $("#mytree").aeTree({showLine:true});
             */
            showLine: false,
            /**
             * 是否显示checkbox。
             * @type Boolean
             * @default false
             * @example
             * $("#mytree").aeTree({showCheckbox:false});
             */
            showCheckbox: false,
            /**
             * 是否级联选中，该属性在showCheckbox为true的时候生效。
             * @type Boolean
             * @default true
             * @example
             * $("#mytree").aeTree({cascadeCheck:true});
             */
            cascadeCheck: true,
            /**
             * 树节点是否可拖拽。
             * @type Boolean
             * @default false
             * @example
             * $("#mytree").aeTree({draggable:true});
             */
            draggable: false,
            /*
             * 暂不支持，通过方法过滤树节点，该方法会被每个树节点调用，当返回为false，该节点会被过滤掉。
             * @type function
             * @default null
             * @example
             * 将叶子节点过滤掉
             * fucntion fn(node){
             *   if(node.children){
             *      return true;
             *   }
             *   retrun false;
             * }
             * $("#mytree").aeTree({filter:fn});
             */
            filter: null,
            // before refresh the node ,you can change the node
            // nodeFomatter:null,
            nodeCount:0,
            /**
             * 设置树组件数据是否异步加载。
             * @type Boolean
             * @default false
             * @example
             * $("#mytree").aeTree({isAsync:true});
             */
            isAsync:false,
            /**
             * tree初始化方式，默认通过html来设置参数。传值为js时，则通过js中设置的option来初始化。
             * @type String
             * @default 'html'
             * @example
             * $('#mytree').aeTree({initType : 'js'});
             */
            initType : 'html'
        },
        _create: function() {
        	var el = this.element,
				options=this.options,
				id=el.attr("id");

			if(id){
				el.attr("aeId",id);
			}
        	if(options.initType=='html'){
            	this._buildOptions(options,el);
            }
        	el.data("nodes", [])
                    .data("selected", "").data("init_dataSource", [])
                    .addClass("tree tree-no-line");
        	if(options.showLine){
        		el.removeClass("tree-no-line");
        	}
        },
        _buildOptions:function(options,element){

        	options.cascadeCheck = element.attr("cascadeCheck")=='false' ? false : options.cascadeCheck;
        	options.draggable = element.attr("draggable")=='true' ? true : options.draggable;
        	options.showCheckbox = element.attr("showCheckbox")=='true' ? true : options.showCheckbox;
        	options.showIcon = element.attr("showIcon")=='false' ? false : options.showIcon;
        	options.showLine = element.attr("showLine")=='true' ? true : options.showLine;
        	options.isAsync = element.attr("isAsync")=='true' ? true : options.isAsync;
        	options.idField  = element.attr("idField");
        	options.pIdField  = element.attr("pIdField");
        	options.labelField  = element.attr("labelField");
        	options.valueField  = element.attr("valueField");
        	options.sortField = element.attr("sortField");
        	options.rootId  = element.attr("rootId");

        	this._buildOptionEvent(options,'onBeforeCollapse',element.attr("onBeforeCollapse"),true);
        	this._buildOptionEvent(options,'onBeforeExpand',element.attr("onBeforeExpand"),true);
        	this._buildOptionEvent(options,'onBeforeSelect',element.attr("onBeforeSelect"),true);
        	this._buildOptionEvent(options,'onCheck',element.attr("onCheck"),true);
        	this._buildOptionEvent(options,'onCollapse',element.attr("onCollapse"),true);
        	this._buildOptionEvent(options,'onExpand',element.attr("onExpand"),true);
        	this._buildOptionEvent(options,'onSelect',element.attr("onSelect"),true);

        	this._buildOptionEvent(options,'onClick',element.attr("onClick"),false);
//       	this._buildOptionEvent(options,'onDblClick',element.attr("onDblClick"),false);
//        	this._buildOptionEvent(options,'onDrag',element.attr("onDrag"),false);
//        	this._buildOptionEvent(options,'onDrop',element.attr("onDrop"),false);
//        	this._buildOptionEvent(options,'onRightClick',element.attr("onRightClick"),false);

        },
        _buildOptionEvent:function(ops,evtName,evtValue,flag){
        	if(flag){
        		ops[evtName]=evtValue ? function(nodeData){
            		if($.isString(evtValue)){
    					var i = evtValue.indexOf("(");
    					var actName = i>0 ? evtValue.substring(0, i) : evtValue;
    					var func = "return window."+actName+"?"+actName+".call(window,n):false;";
    					return new Function("n",func)(nodeData);
    				}
            	}: ops[evtName];
        	}else{
        		ops[evtName]=evtValue ? function(nodeData, event){
            		if($.isString(evtValue)){
    					var i = evtValue.indexOf("(");
    					var actName = i>0 ? evtValue.substring(0, i) : evtValue;
    					var func = "return window."+actName+"?"+actName+".call(window,n,e):false;";
    					return new Function("n","e",func)(nodeData, event);
    				}
            	}: ops[evtName];
        	}
        },
        updateNode: function(target) {
            var branches = target.find("div.tree-folder");
            this._applyEvents(branches);
        },

        // handle toggle event
        // change the target to the treenode (li dom)
        toggler: function(target) {
            var self = this,
                options = self.options;
            var nid = target.attr("id");
            var node = self.findByNId(nid);
            var hidden = target.hasClass(CLASSES.expandable);

            if ( hidden ) {
                var onBeforeExpand = options.onBeforeExpand;
                if(onBeforeExpand && false === self._trigger("onBeforeExpand",null,node)){
                    return self;
                }
            } else {
                var onBeforeCollapse = options.onBeforeCollapse;
                if(onBeforeCollapse && false === self._trigger("onBeforeCollapse",null,node)){
                    return self;
                }
            }

            // swap classes for li
            self._swapClass(target, CLASSES.collapsable, CLASSES.expandable);
            self._swapClass(target, CLASSES.lastCollapsable, CLASSES.lastExpandable);

            // find child lists
            target.find( ">div.tree-folder-content" )
                .each(function(){
                    if ( hidden ) {
                        $(this).show();
                        var onExpand = options.onExpand;
                        onExpand && self._trigger("onExpand",null,node);
                    } else {
                        $(this).hide();
                        var onCollapse = options.onCollapse;
                        onCollapse && self._trigger("onCollapse",null,node);
                    }
            });
        },

        _init: function() {
            this.element.empty();
        },
        reload:function(data,condition){
        	  if(!data)
        		  return;
        	  var self = this,
        	      options = this.options,
        	      target = self.element,
        	      isAsync = options.isAsync;
        	  data = $.aries.common.buildTreeData(data,options);
	       	  if(isAsync){
	       		  if(condition){
	       			  var cache = $.data(target, 'cache') ||
	                     {
	                         ___keys: []
	                     };
	                     cache[condition] = data;
	                     cache.___keys.push(condition);
	                     $.data(target, 'cache', cache);
	       			  var pNode = self.findByNId(condition);
	       			  self._appendNodesToAsync.apply(self, [pNode.nid, data, pNode]);
	       			  var folder = $("#"+pNode.nid).find(">div.tree-folder-header >i");
	       			  if($("#"+pNode.nid).hasClass("hasChildren")){
	                     self._swapClass(folder, CLASSES.faFolder, CLASSES.faFolderOpen);
	             	  }else{
		                 self._swapClass(folder, CLASSES.faFolder, CLASSES.iconPage);
	             	  }
	       		  }else{
	       			  self._appendNodesToAsync.apply(self, [target, data]);
	       		  }
	       		  self._initDataSource();
	       	  }else{
	       		  target.empty();
	       		  target.data("init_dataSource", data);
	              self._appendNodes.apply(self, [target, data]);
	       	  }
	       	  self.updateNode(target);
        },
        _initDataSource:function(){
        	var target = this.element,
        	    cache = target.data("nodes"),
        	    obj=[];
        	if(cache!= null){
        		for(key in cache){
        			if(key.indexOf("aeNodePId")<0){
        				if(cache[key]["aeChildren"]){
        					cache[key]["aeChildren"] = null;
        				}
        				obj.push(cache[key]);
        			}
        		}
        	}
        	var tempData = $.aries.common.buildTreeData(obj,this.options);
        	target.data("init_dataSource", tempData);
        },
        /* -------------------- check and select node ------------------- */
        /**
         * 将指定节点前的勾选框设置为被勾选状态，该方法只有在属性showCheckbox为true时才生效。
         * @name aeTree#checkNode
         * @function
         * @param id 指定节点的Id
         * @example
         * //将指定节点的勾选状态设置为被勾选状态
         * $('#myTree').aeTree('checkNode',"n2");
         */
        checkNode: function(id) {
        	var target = this.findNodeById(id);
        	if(target){
        		this._toggleCheck($("#" + target.nid), false);
        	}
        },
        /**
         * 将指定节点前的勾选框设置为未被勾选状态，该方法只有在属性showCheckbox为true时才生效。
         * @name aeTree#uncheck
         * @function
         * @param target 指定节点的JSON数据对象，并且该节点数据中包括了nid属性
         * @example
         * //将target节点的勾选状态设置为不被勾选状态
         * var target = $('#myTree').aeTree("findNode", "text", "node1");
         * $('#myTree').aeTree('uncheck',target);
         */
        uncheck: function(id) {
        	var target = this.findNodeById(id);
        	if(target){
        		this._toggleCheck($("#" + target.nid), true);
        	}
        },

        // target equal le elem
        _toggleCheck: function(target, checked) {
            var checkbox_item = target.find(">div.tree-folder-header >div.ckbox >label"), self = this,
            options = self.options,
            onCheck = options.onCheck;
            if(checked) {
                checkbox_item.removeClass("checked checked_notall");
            } else {
                checkbox_item.removeClass("checked_notall").addClass("checked");
            }
            if(self.options.cascadeCheck) {
                self._setChildCheckbox(target, !checked);
                self._setParentCheckbox(target,!checked);
            }
            onCheck && self._trigger("onCheck",null,self.findByNId(target.attr("id")));
        },
        /**
         * 将所有节点的勾选框设置为被勾选状态，该方法只有在属性showCheckbox为true时才生效。
         * @name aeTree#checkAll
         * @function
         * @param checked 指定勾选框的勾选状态，checked为true为被勾选状态，为false为未被勾选状态
         * @example
         * //将所有节点的勾选框都设置为被勾选状态
         * $('#myTree').aeTree('checkAll',true);
         */
        checkAll: function(checked) {
            if(checked) {
                this.element
                    .find("div.tree-folder-header >div.ckbox >label")
                    .removeClass("checked_notall")
                    .addClass("checked");
            } else {
                this.element
                    .find("div.tree-folder-header >div.ckbox >label")
                    .removeClass("checked checked_notall");
            }
        },
        /**
         * 判断指定节点的勾选状态，该方法只有在属性showCheckbox为true时才生效。
         * @name aeTree#isCheckNode
         * @function
         * @param id 指定节点的JSON数据对象，并且该节点数据中包括了nid属性
         * @returns true or false
         * @example
         * //判断id等于n2节点的勾选状态
         * $('#myTree').aeTree('isCheckNode',"n2");
         */
        isCheckNode: function(id) {
        	var target = this.findNodeById(id);
        	if(target){
        		 return $("#"+target.nid)
                         .find(">div.tree-folder-header >div.ckbox >label")
                         .hasClass("checked");
        	}
        },
        /**
         * 获取所有被勾选或未被勾选节点的JSON数据对象集合。
         * @name aeTree#getChecked
         * @function
         * @param checked 指定勾选框的勾选状态，checked为true为被勾选状态，为false为未被勾选状态，默认为false
         * @returns JSON数据对象集合
         * @example
         * //获取所有被勾选节点的JSON数据对象集合
         * $('#myTree').aeTree('getChecked',true);
         */
        getChecked: function(checked) {
            var self = this,
                nodes = [];
            var filter_config = checked?".checked":":not(.checked)";
            this.element
                .find("div.tree-folder-header >div.ckbox >label")
                .filter(filter_config).each(function(i,name){
                    nodes.push(self.element.data("nodes")[$(this).closest('.tree-folder').attr("id")]);
                });
            return nodes;
        },
        /**
         * 将指定节点设置为选中状态。
         * @name aeTree#selectNode
         * @function
         * @param id 指定节点的JSON数据，并且该节点数据中包括了nid属性。
         * @example
         * //将id等于n2节点设置为选中状态
         * $('#myTree').aeTree('selectNode',"n2");
         */
        selectNode: function(id) {
            var self = this,
                options = this.options,
                onBeforeSelect = options.onBeforeSelect,
                onSelect = options.onSelect,
                target = self.findNodeById(id);
            if(target){
        	  if(onBeforeSelect && false === self._trigger("onBeforeSelect",null,target)) {
                  return self;
              }
              var node = $("#" + target.nid);
              $(" >div.tree-folder-header", node).addClass("tree-selected");
              var oldSelected = self.element.data("selected");
              var curSelected = node.attr("id");
              if(oldSelected != "" && !(oldSelected == curSelected)) {
                  $("#" + oldSelected + " >div.tree-folder-header").removeClass("tree-selected");
              }
              self.element.data("selected", curSelected);
              onSelect && self._trigger("onSelect",null,target);
            }
        },
        /**
         * 将指定节点设置为未选中状态。
         * @name aeTree#unselect
         * @function
         * @param target 指定节点的JSON数据，并且该节点数据中包括了nid属性
         * @example
         * //将id等于n2节点设置为未选中状态
         * $('#myTree').aeTree('unselect',"n2");
         */
        unselect: function(id) {
            var self = this,
                target = self.findNodeById(id);
            if(target){
        	   var node = $("#" + target.nid);
               $(" >span", node).removeClass("selected");
               var oldSelected = self.element.data("selected");
               var curSelected = node.attr("id");
               if( oldSelected == curSelected) {
                 self.element.data("selected", "");
               }
            }
        },
        /**
         * 获取被选中的节点的JSON数据对象。
         * @name aeTree#getSelected
         * @function
         * @returns JSON数据对象
         * @example
         * //获取被选中节点的JSON数据对象
         * $('#myTree').aeTree('getSelected');
         */
        getSelected: function() {
            var selected = this.element.data("selected");
            return selected ? this.element.data("nodes")[selected] : null;
        },

        /* -------------------- find node ------------------- */
        /**
         * 根据节点数据的属性精确查找节点 pNode 下面的子节点中的 JSON 数据对象集合。
         * @name aeTree#findNodesByAttr
         * @function
         * @param key 进行查找的节点数据的属性名称
         * @param value 属性值
         * @param pNode 可选，指定的父节点，默认为查找所有节点
         * @param deep 可选，是否递归查找子节点，默认为递归查找子节点
         * @returns JSON数据对象集合
         * @example
         * //查找所有树节点中属性“text”等于“测试节点2”的节点
         * $('#myTree').aeTree('findNodesByAttr', "text", '测试节点2', "",true);
         */
        findNodesByAttr: function(key, value, pNode, deep) {
            var result = [], len;
            var data = pNode ? pNode.aeChildren :this.element.data("init_dataSource");
            deep = (deep!=false)? true : deep;
            if(data && (len = data.length) > 0) {
                for(var i = 0; i < len; i++){
                  result = this._searchNode.apply(data[i], [key, value, this._searchNode, result, false, deep]);
                }
           }
            return result.length > 0 ? result : null;
        },
        /**
         * 根据节点数据的属性精确查找节点 pNode 的子节点中满足条件的 JSON 数据对象。
         * 查找到第一个满足条件的节点则停止查找，返回该节点。
         * @name aeTree#findNodeByAttr
         * @function
         * @param key 进行查找的节点数据的属性名称
         * @param value 属性值
         * @param pNode 可选，指定的父节点，默认为查找所有节点
         * @param deep 可选，是否递归查找子节点，默认为递归查询子节点
         * @returns JSON数据对象
         * @example
         * //查找所有树节点中第一个满足属性"text"等于"测试节点2"的节点
         * $('#myTree').aeTree('findNodeByAttr', "text", '测试节点2', "",true);
         */
        findNodeByAttr: function(key, value, pNode, deep){
            var res, len, data = pNode ? pNode.aeChildren : this.element.data("init_dataSource");
            deep = (deep!=false)? true : deep;
            if(data && (len = data.length)> 0) {
                for(var i = 0; i < len; i++){
                  res = this._searchNode.apply(data[i], [key, value, this._searchNode, [], true, deep]);
                  if(res != null){
                      return res;
                  }
               }
           }
            return null;
        },
        findNodeById:function(id){
        	 var res, len, data = this.element.data("init_dataSource");
             if(data && (len = data.length)> 0) {
                 for(var i = 0; i < len; i++){
                   res = this._searchNode.apply(data[i], ["aeNodeId", id, this._searchNode, [], true, true]);
                   if(res != null){
                       return res;
                   }
                }
            }
             return null;
        },
        /**
         * 根据nid精确查找节点。查找到第一个满足条件的节点则停止查找，返回该节点。
         * @name aeTree#findByNId
         * @function
         * @param nid 节点的唯一标识,该值是自动生成的，生成规则为treeId+ "_" + 计数
         * @returns JSON数据对象
         * @example
         * //查找“nid”等于“treeId_4”的节点
         * $('#myTree').aeTree('findByNId','treeId_4');
         */
        findByNId : function(nid) {
            return this.element.data("nodes")[nid]||null;
        },
        /**
         * 根据指定函数fn精确查找指定pNode的子节点中满足条件的JSON数据对象集合，函数fn中可以定义复杂的查询逻辑。
         * @name aeTree#findNodesByFn
         * @function
         * @param fn 指定的查找函数，参数为节点的JSON数据对象，函数返回为true则改节点满足查找条件，反之false则不满足条件
         * @param pNode 可选，指定的父节点，默认为查找所有节点
         * @param deep 可选，是否递归查找子节点，默认为递归查找子节点
         * @returns JSON数据对象集合
         * @example
         * //根据函数fn查找符合条件的所有节点的JSON数据对象集合
         * $('#myTree').aeTree('findNodesByFn',fn);
         */
        findNodesByFn: function(fn, pNode, deep){
            var res, data = pNode ? pNode.aeChildren : this.element.data("init_dataSource");
            deep = (deep!=false)? true : deep;
            var result = [];
            if(data && (len = data.length)> 0) {
             for(var i = 0; i < len; i++){
                if(fn.call(data[i], data[i]) === true){
                    result.push(data[i]);
                }
                if(deep && data[i].aeChildren){
                    res = this.findNodesByFn(fn, data[i], deep);
                    if(res){
                        result = result.concat(res);
                    }
                }
              }
            }
            return result.length > 0 ? result : null;
        },
        /**
         * 根据指定函数fn精确查找指定pNode的子节点中满足条件的第一个节点的JSON数据对象，函数fn中可以定义复杂的查询逻辑。
         * 查找到第一个满足条件的节点则停止查找，返回该节点的JSON数据对象。
         * @name aeTree#findNodeByFn
         * @function
         * @param fn 指定的查找函数，拥有一个参数为节点的JSON数据对象，函数返回为true则该节点满足查找条件，反之false则不满足条件
         * @param pNode 可选，指定的父节点，默认为查找所有节点
         * @param deep 可选，是否递归查找子节点，默认为不递归查找子节点
         * @returns JSON数据对象
         * @example
         * //根据函数fn查找符合条件的第一个子节点的JSON数据对象
         * $('#myTree').aeTree('findNodeByFn',fn);
         */
        findNodeByFn: function(fn, pNode, deep){
            var res, data = pNode ? pNode.aeChildren : this.element.data("init_dataSource");
            deep = (deep!=false)? true : deep;
            if(data && (len = data.length)> 0) {
              for(var i = 0, len = data.length; i < len; i++){
                if(fn.call(data[i], data[i]) === true){
                    return data[i];
                }
                if(deep){
                    res = this.findNodeByFn(fn, data[i], deep);
                    if(res != null){
                        return res;
                    }
                }
              }
            }
            return null;
         },
         /**
          * 根据节点text精确查找节点 pNode 下面的子节点中的 JSON 数据对象集合。
          * @name aeTree#findNodesByText
          * @function
          * @param value 属性值
          * @param pNode 可选，指定的父节点，默认为查找所有节点
          * @param deep 可选，是否递归查找子节点，默认为递归查找子节点
          * @returns JSON数据对象集合
          * @example
          * //查找所有树节点中属性"text"等于"测试节点2"的节点
          * $('#myTree').aeTree('findNodesByText', "text", '测试节点2', "",true);
          */
         findNodesByText:function(value, pNode, deep){
        	   var result = [], len;
               var data = pNode ? pNode.aeChildren :this.element.data("init_dataSource");
               deep = (deep!=false)? true : deep;
               if(data && (len = data.length) > 0) {
                   for(var i = 0; i < len; i++){
                     result = this._searchNode.apply(data[i], ["aeNodeLabel", value, this._searchNode, result, false, deep]);
                   }
              }
              return result.length > 0 ? result : null;
         },
        _searchNode: function(key, value, _searchNode, result, isSingle, deep) {
            if(isSingle){
                if(this[key] == value)
                return this;
                if(this.aeChildren && this.aeChildren.length && deep) {
                    for(var i in this.aeChildren){
                        var temp=_searchNode.apply(this.aeChildren[i],[key,value,_searchNode,[],true, deep]);
                        if(temp) return temp;
                    }
                }
            }else{
                if(this[key] == value){
                    result.push(this);
                }
                if(this.aeChildren && this.aeChildren.length && deep) {
                    $.each(this.aeChildren, _searchNode, [key, value, _searchNode, result, false, deep]);
                }
                return result;
            }
        },
        /**
         * 获取指定节点的父节点。
         * @name aeTree#getParent
         * @function
         * @param id 指定节点的JSON数据对象，并且该节点数据中包括了nid属性
         * @returns JSON数据对象
         * @example
         * //查找id等于n21的父节点的JSON数据对象
         * $('#myTree').aeTree('getParent',"n21");
         */
        getParent: function(id) {
        	var target = this.findNodeById(id);
        	if(target){
        		 var pid = this.element.data("nodes")["aeNodePId" + target.nid];
                 return pid?this.findByNId(pid):null;
            }
        },
        /**
         * 获取指定节点的所有子节点的JSON数据对象集合。
         * @name aeTree#getChildren
         * @function
         * @param id 指定节点的JSON数据对象，并且该节点数据中包括了nid属性
         * @returns JSON数据对象集合
         * @example
         * //查找id等于n2的所有子节点的JSON数据对象
         * $('#myTree').aeTree('getChildren',"n2");
         */
        getChildren: function(id) {
        	var target = this.findNodeById(id);
        	if(target){
        	   return target.aeChildren;
        	}
        },
        /**
         * 获取树的dataSource对应的静态数据。
         * @name aeTree#getData
         * @function
         * @returns JSON数据对象集合
         * @example
         * //获取dataSource对应的静态数据
         * $('#myTree').aeTree('getData');
        _getData: function() {
            return this.options.dataSource;
        },
        */
        /**
         * 设置树的dataSource所对应的静态数据。
         * @name aeTree#setData
         * @function
         * @example
         * //设置dataSource对应的静态数据
         * var data=[{text:'node2',children:[{text:'node21'},{text:'node22'}]},
         *             {text:'node3'}
         *      ];
         * $('#myTree').aeTree('setData',data);
         *
         * //设置dataSource对应的动态数据
         * $('#myTree').aeTree('setData','../../aeTree.json');
         */
        setData: function(data) {
            this.options.dataSource = data;
        },
        /* -------------------- expand and collapse node ------------------- */
        /**
         * 展开指定节点。
         * @name aeTree#expand
         * @function
         * @param id 指定节点的Id
         * @example
         * //将指定节点展开
         * $('#myTree').aeTree('expandNode',"n2");
         */
        expandNode: function(id) {
        	var self = this,
        	target = this.findNodeById(id);
            if(target && target.nid) {
                var filter = CLASSES.expandable,
                    node = $("#" + target.nid);
                var targetNodes = node.parentsUntil(this.element).andSelf().filter(function() {
                        return $(this).filter("div.tree-folder").hasClass(filter);
                });
                targetNodes.each(function(index){
            		 if($(this).hasClass("hasChildren")){
                      	 var folder = $(this).find(">div.tree-folder-header >i");
                         self._swapClass(folder, CLASSES.faFolder, CLASSES.faFolderOpen);
                  	 }
                     self.toggler($(this));
                });
            }
        },

        /**
         * 收缩指定节点。
         * @name aeTree#collapse
         * @function
         * @param id 指定节点的Id
         * @example
         * //将指定节点收缩
         * $('#myTree').aeTree('collapseNode',"n2");
         */
        collapseNode: function(id) {
        	var target = this.findNodeById(id);
            if(target && target.nid) {
                this._collapseHandler(CLASSES.collapsable, $("#" + target.nid));
            }
        },
        /**
         * 展开所有的树节点。
         * @name aeTree#expandAll
         * @function
         * @example
         * //将所有的树节点展开
         * $('#myTree').aeTree('expandAll');
         */
        expandAll: function() {
            this._collapseHandler(CLASSES.expandable, this.element, true);
        },
        /**
         * 收缩所有的树节点。
         * @name aeTree#collapseAll
         * @function
         * @example
         * //将所有的树节点收缩
         * $('#myTree').aeTree('collapseAll');
         */
        collapseAll: function() {
            this._collapseHandler(CLASSES.collapsable, this.element, true);
        },

        // filter: the class filter by the toggler
        // elem: from witch element
        _collapseHandler: function(filter, target, allPosterity) {
        	var self = this;
        	var condition = (allPosterity ? "" : ">") + "div.tree-folder-header";
        	var obj = $(condition, target).filter(function(){
               return filter ? $(this).parent("." + filter).length : true;
            }).parent();
            obj.each(function(index,item){
            	if($(item).hasClass("hasChildren")){
                 	 var folder = $(item).find(">div.tree-folder-header >i");
                     self._swapClass(folder, CLASSES.faFolder, CLASSES.faFolderOpen);
             	 }
    	 	     self.toggler($(item));
    	    });
        },
        /* -------------------- edit node ------------------- */
        /**
         * 刷新指定树节点及其子节点。
         * @name aeTree#refresh
         * @param target 可选，指定节点的JSON数据对象。不传参数则刷新整棵树。
         * @function
         * @example
         * //刷新整棵树
         * $('#myTree').aeTree('refresh');
         */
        refresh: function( data , id ) {
            var self = this, tree=self.element;
            tree.empty();
    		self.reload(data);
        	if(id){
        		self.expandNode(id);
        	}
        },
        _appendNodes: function(target, nodes, bNode, isDrop) {
            var self = this, ht=[],
                checkable = self.options.showCheckbox;
            var treeid=self.element.attr("id")?self.element.attr("id"):("treeId"+parseInt(Math.random()*1000));
            self.element.attr("id",treeid);
            for(var i = 0, l = nodes.length; i < l; i++){
                var node = nodes[i], isLastNode = (i == (nodes.length - 1));
                var nodeClass = "tree-folder "+(node.aeChildren ? "hasChildren ":"");
                var nid=treeid+"_"+(++self.options.nodeCount);
                node.nid=nid;
                var caches = self.element.data("nodes");
                caches[node.nid] = node;
                if(typeof target == "string"){
                    caches["aeNodePId"+node.nid] = target;
                    if(isLastNode){
                        target = null;
                    }
                }else{
                    caches["aeNodePId"+node.nid] = target.parent("li").attr("id");
                }
                var childHtml = [];
                if(node.aeChildren && node.aeChildren.length > 0){
                    childHtml.push((self._appendNodes(node.nid, node.aeChildren)).join(""));
                }
                var len = 0;
                if (node.aeChildren && (len=node.aeChildren.length)>0||node.hasChildren) {
                    if(node.expanded && (node.expanded === 'true'|| node.expanded == true) ){
                        nodeClass=nodeClass+"open "+CLASSES.collapsable+" "+(isLastNode ? CLASSES.lastCollapsable:"");
                    }else{
                        nodeClass=nodeClass+CLASSES.expandable+" "+(isLastNode ? CLASSES.lastExpandable:"");
                    }
                }else{
                    nodeClass=nodeClass+(isLastNode ? CLASSES.last:"");
                }
                ht.push("<div id='", node.nid, "' class='" ,nodeClass ,"'>");

                ht.push("<div class='tree-folder-header'>");
                if(checkable){
                    ht.push("<div class='ckbox ckbox-default ckbox_horizontal'>");
                    ht.push("   <input type='checkbox' id='", node.nid, "_checkbox'/>");
                    ht.push("   <label for='", node.nid, "_checkbox'></label>");
                    ht.push("</div>");
                }
                if(self.options.showIcon){
                  if(node.aeChildren && node.aeChildren.length>0){
                	  if(node.expanded && (node.expanded === 'true'|| node.expanded == true)){
                          ht.push("<i class='icon-folder-open'></i>");
                	  }else{
                          ht.push("<i class='icon-folder'></i>");
                	  }
                  }else{
                      ht.push("<i class='icon-page2'></i>");
                  }
                }
                ht.push("<div class='tree-folder-name'><span title='", node.aeNodeLabel, "'>", node.aeNodeLabel, "</span></div>");
                ht.push("</div>");
                if (node.hasChildren || len>0) {
		              ht.push("<div class='tree-folder-content'", " style='display:", (node.expanded && (node.expanded === 'true'|| node.expanded == true) ? "block": "none"),"'>");
		              ht.push(childHtml.join(''));
		              ht.push("</div>");
                }
                ht.push("</div>");
            }
            if(bNode){
                if(isDrop){
                    $("#"+bNode.nid).after(ht.join(""));
                }else{
                	$("#"+bNode.nid).before(ht.join(""));
                }
            }else if(target){
                target.append(ht.join(""));
            }
            return ht;
        },
        _appendNodesToAsync:function(target, nodes, pNode){
        	 var self = this, ht=[],
             checkable = self.options.showCheckbox,
             showLine = self.options.showLine;
	         var treeid=self.element.attr("id")?self.element.attr("id"):("treeId"+parseInt(Math.random()*1000));
	         self.element.attr("id",treeid);
	         for(var i = 0, l = nodes.length; i < l; i++){
	             var node = nodes[i], isLastNode = (i == (nodes.length - 1));
	             var nodeClass = "tree-folder "+(node.aeChildren ? "hasChildren ":"");
	             var nid=treeid+"_"+(++self.options.nodeCount);
	             node.nid=nid;
	             var caches = self.element.data("nodes");
	             caches[node.nid] = node;
	             if(typeof target == "string"){
	                 caches["aeNodePId"+node.nid] = target;
	                 if(isLastNode){
	                     target = null;
	                 }
	             }else{
	                 caches["aeNodePId"+node.nid] = target.parent("li").attr("id");
	             }
	             var childHtml = [];
	             if(node.aeChildren && node.aeChildren.length > 0){
	                 childHtml.push((self._appendNodesToAsync(node.nid, node.aeChildren)).join(""));
	             }
	             var len = 0;
	             if (node.aeChildren && (len=node.aeChildren.length)>0||node.hasChildren) {
	                 if(node.expanded){
	                     nodeClass=nodeClass+"open "+CLASSES.collapsable+" "+(isLastNode ? CLASSES.lastCollapsable:"");
	                 }else{
	                     nodeClass=nodeClass+CLASSES.expandable+" "+(isLastNode ? CLASSES.lastExpandable:"");
	                 }
	             }else{
	                 nodeClass=nodeClass+(isLastNode ? CLASSES.last:"");
	             }
	             ht.push("<div id='", node.nid, "' class='" ,nodeClass ,"'>");
	             ht.push("<div class='tree-folder-header'>");
	             if(checkable){
	            	  ht.push("<div class='ckbox ckbox-default ckbox_horizontal'>");
	                  ht.push("   <input type='checkbox' id='", node.nid, "_checkbox'/>");
	                  ht.push("   <label for='", node.nid, "_checkbox'></label>");
	                  ht.push("</div>");
	             }
                if(self.options.showIcon){
//	                  if(node.aeChildren && node.aeChildren.length>0){
	                	  if(node.expanded && (node.expanded === 'true'|| node.expanded == true)){
	                          ht.push("<i class='icon-folder-open'></i>");
	                	  }else{
	                          ht.push("<i class='icon-folder'></i>");
	                	  }
//	                  }else{
//	                      ht.push("<i class='icon-page2'></i>");
//	                  }
                }
                ht.push("<div class='tree-folder-name'><span title='", node.aeNodeLabel, "'>", node.aeNodeLabel, "</span></div>");
                ht.push("</div>");
                if (node.hasChildren || len>0) {
		              ht.push("<div class='tree-folder-content'", " style='display:", (node.expanded && (node.expanded === 'true'|| node.expanded == true) ? "block": "none"),"'>");
		              ht.push(childHtml.join(''));
		              ht.push("</div>");
                }
                ht.push("</div>");
	         }
	         if(nodes.length>0 && pNode){
	        	var obj = $("#"+pNode.nid),str=[];
	        	obj.find("div.tree-folder-content").remove();
	        	str.push("<div class='tree-folder-content' style='display:block;'>");
	        	str.push(ht.join(""));
	          	str.push("</div>");
	          	obj.append(str.join(""));
	          	var folder = obj.find(">div.tree-folder-header >i.fa-file");
		        if(folder.length>0){
		        	folder.removeClass("fa-file").addClass("icon-folder-open");
		        }
                obj.addClass(CLASSES.collapsable+" hasChildren");
	         }else if($.isObject(target)){
	          	target.append(ht.join(""));
	         }
	         return ht;
        },
        /**
         * 删除指定pNode的子节点中对应的JSON数据对象为target的节点。
         * @name aeTree#remove
         * @function
         * @param target 需要被删除的节点对应的JSON数据，并且该节点数据中包括了nid属性
         * @param pNode 可选，指定的父节点对应的JSON数据对象，不传入，则为树的根节点
         * @example
         * //删除树种对应JSON数据对象为target的节点
         * var target = $('#myTree').aeTree("findNode", "text", "node1");
         * $('#myTree').aeTree('remove',target);
         */
        remove: function(target, pNode) {
            var flag, self = this, data=pNode ? pNode.aeChildren : self.element.data("init_dataSource");
            for(var i in data){
                if(data[i] == target){
                    var ids = [];
                    ids = self._findChildrenId(target, ids);
                    ids.push(target.nid);
                    for(var n = 0, len = ids.length; n < len ; n++){
                        delete self.element.data("nodes")[ids[n]];
                        delete self.element.data("nodes")["aeNodePId"+ids[n]];
                    }
                    if(target.nid == self.element.data("selected")){
                        this.element.data("selected",null);
                    }
                    var pre = $("#"+target.nid).prev();
                    if($("#"+target.nid).next().length<1 && pre.length > 0){
                        if(pre.hasClass(CLASSES.collapsable)){
                            pre.addClass(CLASSES.lastCollapsable);
                            pre.find("div.hitarea").first().addClass(CLASSES.lastCollapsableHitarea);
                        }else if(pre.hasClass(CLASSES.expandable)){
                            pre.addClass(CLASSES.lastExpandable);
                            pre.find("div.hitarea").first().addClass(CLASSES.lastExpandableHitarea);
                        }else{
                            pre.addClass(CLASSES.last);
                        }
                    }
                    $("#"+target.nid).remove();
                    data.splice(i, 1);
                    if(pNode&&pNode.nid&&data.length < 1){
                    	self._changeToFolderOrFile(pNode,false);
                    }
                    return true;
                }else if(data[i].aeChildren){
                    flag = self.remove(target, data[i]);
                    if(flag){
                        return true;
                    }
                }
            }
            return false;
        },

        _findChildrenId: function(target, ids){
            if(target.children){
                for(var i = 0, children = target.aeChildren, len = children.length; i < len; i++){
                    ids.push(children[i].nid);
                    if(children[i].aeChildren){
                        this._findChildrenId(children[i], ids);
                    }
                }
            }
            return ids;
        },
        /**
         * 在指定pNode的子节点中插入一个JSON数据对象为target的节点，并且被插入的节点在指定bNode节点前。
         * @name aeTree#insert
         * @function
         * @param target 需要被插入的节点对应的JSON数据对象，并且该节点数据中包括了nid属性
         * @param pNode 可选，指定的父节点对应的JSON数据对象，，并且该节点数据中包括了nid属性，不传入，则为树的根节点
         * @param bNode 可选，指定被插入节点位置，，并且该节点数据中包括了nid属性，不传入，则在pNode子节点的最后插入节点
         * @example
         * //在pNode的子节点后插入对应JSON数据对象为target的节点
         * var target = $('#myTree').aeTree("findNode", "text", "node1");
         * $('#myTree').aeTree('insert',target，pNode);
         */

        insert : function(target, pNode, bNode, isDrop) {
        	if(!target){
        		return;
        	}
            var self = this, nodes=[], parent, otherChildren, flag = $.isArray(target);
            if(flag){
            	nodes = target;
            } else{
            	nodes.push(target);
            }
            if (bNode) {
                pNode = pNode || self.findByNId(self.element.data("nodes")["aeNodePId" + bNode.nid]);
            }
            var index, data = pNode ? pNode.aeChildren : self.element.data("init_dataSource");
            if (pNode && (!pNode.aeChildren||pNode.aeChildren.length<1)) {
            	if(!pNode.hasChildren){
            		self._changeToFolderOrFile(pNode,true);
            		self._bindHitEvent($("#" + pNode.nid));
            	}
                data = pNode.aeChildren = [];
            }
            parent = pNode ? $("#" + pNode.nid).children("ul").first() : self.element;
            otherChildren = parent.find("li");
            if (bNode && ((index = $.inArray(bNode, data)) >= 0)) {
                self._appendNodes(parent, nodes, bNode, isDrop);
                data.splice(index, 0, target);
            } else {
                self._appendNodes(parent, nodes, bNode, isDrop);
                if(flag){
                    $.merge(data, target);
                }else{
                	data.push(target);
                }
            }
            var m = parent.find("li")
                        .filter("." + CLASSES.last + ",." + CLASSES.lastCollapsable+",."+CLASSES.lastExpandable)
                        .not(parent.find("li")
                        .filter(":last-child:not(ul)"));
            m.removeClass(CLASSES.last + " " + CLASSES.lastCollapsable + " " + CLASSES.lastExpandable);
            m.find(" >div").removeClass(CLASSES.lastCollapsableHitarea+" "+CLASSES.lastExpandableHitarea);
            var tdom = parent.find("li").not(otherChildren);
            self._applyEvents(tdom);
        },

        _changeToFolderOrFile: function(node,isToFolder){
        	var nDom = $("#" + node.nid),self=this;
        	if(isToFolder){
        		var parent = $("<ul/>").css("display",  "block").appendTo(nDom);
        		nDom.addClass("open "+CLASSES.collapsable);
        		self._swapClass(nDom, CLASSES.last, CLASSES.lastCollapsable);
        		node.aeChildren = [];
        	}else{
        		nDom.find("ul").remove();
        		nDom.find("div."+CLASSES.hitarea).remove();
        		nDom.filter("."+CLASSES.lastCollapsable+",."+CLASSES.lastExpandable)
        		.removeClass(CLASSES.lastCollapsable+" "+CLASSES.lastExpandable).addClass(CLASSES.last);
        		nDom.removeClass("open "+CLASSES.collapsable+" "+CLASSES.expandable);
        	}
            if(self.options.showIcon) {
                self._swapClass(nDom.children("span"),"file","folder");
            }
        	var hitarea = nDom.filter(":has(>ul)").prepend("<div class=\"" + CLASSES.hitarea + "\"/>").find("div." + CLASSES.hitarea);
            hitarea.each(function() {
                var classes = "";
                $.each($(this).parent().attr("class").split(" "), function() {
                    classes += this + "-hitarea ";
                });
                $(this).addClass( classes );
            });
        },


        /**
         * 在指定pNode的子节点中将JSON数据对象为target的节点修改其JSON数据对象为newNode。
         * @name aeTree#modify
         * @function
         * @param target 需要修改的节点的JSON数据对象，并且该节点数据中包括了nid属性
         * @param newNode 修改后节点的JSON数据对象，并且该节点数据中包括了nid属性
         * @param pNode 可选，指定的父节点对应的JSON数据对象，，并且该节点数据中包括了nid属性，不传入，则为树的根节点
         * @example
         * //将JSON数据对象为target的节点修改其JSON数据对象为newNode
         * var target = $('#myTree').aeTree("findNode", "text", "node1");
         * var newNode ={text: "node5"};
         * $('#myTree').aeTree('insert',target，newNode);
         */
        modify: function(target, newNode, pNode) {
        	if(target&&newNode){
        		var self = this, nextNode = $("#" + target.nid).next(), bNode;
                pNode = pNode || this.findByNId(self.element.data("nodes")["aeNodePId" + target.nid]);
                if(nextNode.is("ul") || nextNode.is("li"))
                    bNode = self.findByNId(nextNode.attr("id"));
                self.remove(target, pNode);
                self.insert(newNode, pNode, bNode);
        	}
        },
        /**
         * 获取根节点。
         */
        getRoot:function(i){
       	   var res, len, data = this.element.data("init_dataSource");
            if(data && (len = data.length)> 0) {
                for(var i = 0; i < len; i++){
                    if(!data[i].aeNodePId){
                    	return data[i];
                    }
                }
            }
            return null;
        },
        /**
         * 销毁组件
         * @name aeTree#destroy
         * @function
         * @example
         * $('#myTree').aeTree('destroy');
         */
        destroy : function(){
            var self = this, options = self.options;
            self.element.data("nodes", [])
                .data("selected", "")
                .data("init_dataSource", [])
                //.removeClass("tree tree-no-line")
                //.removeAttr("aeId")
                .empty();
            self.options.nodeCount = 0;
        }
    });
//})(jQuery);

});

define('ui-breadcrumb',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
/*
 * $Id: ui-breadcrumb.js$
 * Depends : ui-core.js, $.message.error();
 * version : 3.1
 * The last modification time :   2015-6-25 16:11
 * log :	bootstrap 组件初步封装完成； 2015-6-10 16:55
 * 			补充方法，使历史路径不可用 disable(true)，使历史路径可用 disable(false)；2015-6-12 17:45
 * 			新增方法，jumpSucceed,页面跳转成功后执行； 2015-6-16 17:50
 * 			新增方法，back，返回上一个页面；2015-6-23 19:45
 * 			新增方法 getData； 2015-6-25 15:33
 * 			修改方法 getData，新增入参 back； 2015-6-25 16:11
 *
 *
 */
	/**
     * @name aeBreadcrumb
     *
     * @class 面包屑组件，用于页面跳转
     * @使用方式
     * @页面上的html标记如下
     * <pre>
     * 		<div id="demo-breadcrumb" aeType="aeBreadcrumb" aeInit="true" onJump="myjump"></div>
     * </pre>
     *
     * @数据结构如下
     *
     * @最终展示页面代码如下
     * 	<ol class="breadcrumb">
		    <li><i class="md-icon">home</i><a href="#">Home</a></li>
		    <li><a href="#">Library</a></li>
		    <li class="active">Data</li>
		</ol>
     *
     * @example
     * $('#demo-breadcrumb').aeBreadcrumb();
     */


//;(function($){
	$.aeWidget('ae.aeBreadcrumb', {
		options:{
			/**
			 * 防止重复初始化
			 * @type Boolean
			 * @default false
			 */
            _initial : false,
            /**
             * 组件前置图标样式名
             * @type String
             * @default 无
             * iconHome="fa fa-home"
             */
            iconHome : undefined,
            /**
             * 组件HOME页面配置，默认为当前页面
             * @type Object
             * @default {"label":"Home","href":window.location.pathname}
             */
            home : {},
            /**
             * 组件历史路径
             * @type Array
             * @default [{"label":"Home","href":window.location.pathname}]
             */
            _history : [],
            /**
             * 组件跳转类型，枚举类型：back / jump / href
             * @type String
             * @default 'jump'
             */
            _jumpType : 'jump',
            _jumpData : null,
            _backData : null,
            /**
             * 当前页面数据对象
             * @type Object
             * @default {"label":"Home","href":window.location.pathname}
             */
            _active : {},
            /**
             * 页面跳转后触发事件
             * @type Function
             * @default 无
             * @example
             * function myjump(data){
					console.log(data.label);
					//return true;
				}
             */
            onJump : function(){},
            /**
             * 组件初始化方式，默认通过html来设置参数。传值为js时，则通过js中设置的option来初始化。
             * @type String
             * @default 'html'
             * @example
             * $('#demo-breadcrumb').aeBreadcrumb({initType : 'js'});
             */
            initType : 'html'
		},
		_create : function(){
			var options = this.options,
				$ele=this.element,
				id=$ele.attr("id");

			if(options._initial === true){
				return;
			}
			if(id){
				$ele.attr("aeId",id);
			}
			if(options.initType === 'html'){
				this._buildOptions(options, $ele);
			}
			$ele.addClass('breadcrumb');
			$ele.append('<li homeid="home" class="active"><a>'+options.home.label+'</a></li>');
			if(options.iconHome){
				$ele.children('li:last').prepend('<i class="'+options.iconHome+'"></i>');
			}
			options._history.push(options.home);
			options._active = options.home;
			options._disable = false;
			options._initial = true;
		},
		_init : function(){},
		_buildOptions : function(options,element){
			options.iconHome = element.attr("iconHome");
			var home = $.trim(element.attr("home"));
			if(home && home.indexOf("{") === 0){
				var result = home.substring(1,home.length-1).split(",");
				for(var i=0;i<result.length;i++){
					result[i] = $.trim(result[i]);
					var data = result[i].split(":");
					options.home[data[0]] = data[1];
				}
			}else{
				options.home["label"] = "Home";
				options.home["href"] = window.location.pathname;
			}

			var onJump = element.attr("onJump");
			options.onJump = onJump ? function(data, event){
				if($.isString(onJump)){
					var i = onJump.indexOf("(");
					var actName = i>0 ? onJump.substring(0, i) : onJump;
					var func = 	"return window."+actName+"?"+actName+".call(window, d, e):false;";
					return new Function("d", "e", func)(data, event);
				}
			} : undefined;
		},
		/**
         * @跳转到指定页面
         * @name aeBreadcrumb#jump
         * @function
         * @param config 跳转页面的显示标签内容和路径，格式为object {label:"Text",href:"demo/demo-breadnext.html"}
         * @param data 页面传递数据，不作处理，只做记录，且覆盖数据
         * @example
         * 	var config = {label:"Text",href:"demo/demo-breadnext.html"};
         * 	$('#demo-breadcrumb').aeBreadcrumb('jump',config);
         * @触发 用户直接触发可跳转到新的页面，或者点击历史label标签跳转到历史页面
         * @返回 必须设置onJump方法，当返回不为false时表示跳转成功，否则抛出错误，留在当前页面，不进行跳转
         */
		jump : function(config, data){
			this.options._jumpType = 'jump';
			this.options._jumpData = data === undefined ? null : data;
			this._jump(config);
		},
		_jump : function(config){
			var options = this.options, $ele=this.element;
			if(options._active === config){
				return;
			}
			options._tempData = config;
			this._trigger("onJump", null, config);
		},
		/**
         * @跳转成功后逻辑
         * @function
         * @param data 跳转页面的显示标签内容和路径，格式为object {label:"Text",href:"demo/demo-breadnext.html"}
         * @example
         */
		jumpSucceed : function(){
			var _self = this, options = this.options, $ele = this.element;
			var data = options._tempData;
			if($.inArray(data, options._history) === -1){
				$ele.children('li:last').removeClass("active");
				_self._bindLiEvent($ele.children('li:last'), options._history[options._history.length - 1]);
				$ele.append('<li class="active"><a>'+data.label+'</a></li>');
				options._history.push(data);
			}else{
				var $li = _self._getLi($.inArray(data, options._history));
				$li.addClass("active").unbind("breadli").nextAll().remove();
				for(i = options._history.length -1; i>0; i--){
					if(options._history[i] === data){
						break;
					}else{
						options._history.pop();
					}
				}
			}
			options._active = data;
		},
		_bindLiEvent : function(li, data){
			var _self = this;
			li.bind("click.breadli",function(){
//				li.css("cursor","pointer");
				if(!_self.options._disable){
					_self.options._jumpType = 'href';
					_self._jump(data);
				}
			});
		},
		/**
         * @获取指定历史跳转对象
         * @function
         * @param index 相对于home标签的索引值，home标签的索引值为0
         * @example
         */
		_getLi : function(index){
			var options = this.options, $ele = this.element;
			var $home = $ele.children('li[homeid="home"]');
			if(index === 0){
				return $home;
			}else{
				var num = $home.index();
				return $ele.children().eq(num + index);
			}
		},
		/**
		 * @禁用跳转
		 * @name aeBreadcrumb#disable
		 * @function
         * @param flag 是否禁用跳转，true为禁用，false为启用，缺省表示禁用
         * @example
		 * 	$('#demo-breadcrumb').aeBreadcrumb('disable',false);
		 */
		disable : function(flag){
			if(flag === false || flag === "false"){
				//TODO: 样式变更,在li上增加样式 class=disable
				this.options._disable = false;
			}else if(flag === undefined || flag === true || flag === "true"){
				this.options._disable = true;
			}
		},
		/**
		 * @返回上一个页面
		 * @name aeBreadcrumb#back
		 * @function
         * @param data 页面传递数据，组件不做处理，getData方法返回该值
         * @example
		 * 	$('#demo-breadcrumb').aeBreadcrumb('back');
		 */
		back : function(data){
			this.options._jumpType = 'back';
			this.options._backData = data === undefined ? null : data;
			this._jump(this.options._history[this.options._history.length - 2]);
		},
		/**
		 * @获取组件记录数据
		 * 仅支持jump方法和back方法传递数据，点击路径链接不进行数据传递
		 * @name aeBreadcrumb#getData
		 * @function
         * @param type 当入参为 back 时，返回 back 方法传递的数据；
         * @example
		 * 	$('#demo-breadcrumb').aeBreadcrumb('getData');
		 */
		getData : function(type){
			var options = this.options, data;
			data = type === 'back' ? options._backData : options._jumpData;
			return data;
		}




	 });
//})(jQuery);

});

define('ui-grid',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
/*
 * ui-grid.js
 *
 * Depends:
 *  ui-core.js
 *  ui-mouse.js
 *  ui-resizable.js
 */

//;(function($,window) {
	$.ae.lang.aeGrid = {
//			loadingMsg:'正在加载数据，请稍候...',
//	        emptyMsg:'没有数据',
//	        errorMsg:'取数出错',
//	        pageText:'第{index}页，共{totalPage}页',
//	        pageStat:'共{total}条数据，显示{from}-{to}条'
        loadingMsg:'Loading...',
        emptyMsg:'No Result',
        errorMsg:'Load Error',
        pageText:'Page {index}, Total Page {totalPage}',
        pageStat:'Total {total} Data，From {from} To {to}'
	};
    $.aeWidget('ae.aeGrid', {
        options:/** @lends aeGrid#*/{
            //外观
            /**
             * 表格高度，设为数字时单位为px,也可以设为'fit'，表示自适应父容器高度。
             * @default 462
             * @type Number
             */
            height:undefined,
            /**
             * 表格宽度，设为数字时单位为px,也可以设为'fit'，表示自适应父容器宽度。
             * 当所有列宽度大于表格宽度时，出现滚动条。如果小于，则设为autoExpand的列扩展最大，如果没列为autoExpand，则最后一列扩展最大。
             * @type Number,String
             * @default '100%'
             */
            width:'100%',
            /**
             * 列数据模型。每一个元素都是一个对象字面量，定义该列的各个属性，这些属性包括:<br/>
             * title : 表头文字。<br/>
             * name : 与数据模型对应的字段。<br/>
             * align : 列文字对齐方式，可以为'left'、'center'、'right'之中的一个。<br/>
             * width : 列的宽度，取值为Number、百分比或'autoExpand'。不设置宽度的所有列取平均值，且宽度不少于_minWidth的值。注意只能有一个列被设置为'autoExpand'属性。<br/>
             * wrap : 是否自动换行，取值为true或者false。<br/>
             * @type Array[JSON]
             * @default false
             */
            columns:false,
            /**
             * 是否自动拉伸各列以适应表格的宽度（比如共2列第一列宽度100第二列宽度200，则当表格总宽度是600px时第一列自动会变成200px第二列宽度会自动变成400px，而如果表格总宽度是210px时第一列自动会变成70px第二列宽度会自动变成140px）。<b>注意：只有所有列的宽度都不是'autoExpand'时该属性才会起作用。</b>
             * @default false
             * @type Boolean
             */
            autoFit:true,
            /**
             * 是否在最左边显示序号列。
             * @default true
             * @type Boolean
             */
            showIndex:true,
            //数据源
            /**
             * ajax取数方式对应的url地址。
             * @type String
             * @default 无
             */
            dataSource:false,
             /**
             * ajax取数时附加到请求的额外参数。<b>注意：这里JSON的value值只能使用普通值，比如可以设置为{key1:1,key2:'2',key3:0.2,key4:true,key5:undefined}这样，但是不可以设置为{key1:[]}或{key2:{a:1,b:2}}，因为[]和{a:1,b:2}都不是普通值</b>
             * @type JSON
             * @default {}
             */
            extraData:{},
            /**
             * 使用GET请求还是POST请求来取数据，取值为：'POST'或'GET'。
             * @type String
             * @default 'GET'
             */
            method:'POST',
            /**
             * 正在取数时显示在分页条上的提示。
             * @name aeGrid#loadingMsg
             * @type String
             * @default '正在加载数据，请稍候...'
             */
            loadingMsg:$.ae.lang.aeGrid.loadingMsg,
            /**
             * 取数完成后但是后台没有返回任何数据时显示在分页条上的提示。
             * @name aeGrid#emptyMsg
             * @type String
             * @default '没有数据'
             */
            emptyMsg:$.ae.lang.aeGrid.emptyMsg,
            /**
             * 取数发生错误时显示在分页条上的提示。
             * @name aeGrid#errorMsg
             * @type String
             * @default '取数出错'
             */
            errorMsg:$.ae.lang.aeGrid.errorMsg,
            /**
             * 取数成功后的预处理，可以在取数成功后开始显示数据前对后台返回的数据进行一次预处理。<b>注意：此方法一定要返回一个值</b>。
             * @type Function
             * @default 无
             */
            preProcess:false,
            //分页
            /**
             * 每页数据条数，比如每页要显示10条则设成10。此属性仅用于取数不用于显示（即如果pagingSize设成10，取数时告诉后台要10条数据，如果后台非要返回15条数据，则页面会显示出15条而不是10条数据）。
             * @type Number
             * @default 10
             */
            pagingSize:10,
            //行显示
            /**
             * 行样式，默认显示成斑马纹（奇偶行背景不一样）。当然用户也可以定义成3行一循环或5行一循环。也可以定义成一个Function来根据行数据不同显示成不同的样式（比如一个显示学生成绩的表格中把不及格的记录整行显示成红色背景，满分的记录整行显示成绿色背景）。
             * @type Array或Function
             * @default ['oddRow','evenRow']
             */
            rowClasses:['oddRow','evenRow'],
            //行选择
            /**
             * 是否只能单选（一次只能选择一条记录，选择第二条时第一条会自动取消选择）。若设置为false表示可以多选（选择其它行时原来已经选择的将继续保持选择状态）。<b>注意：设成true时将不会出现checkbox列，设成false则将自动出现checkbox列</b>。
             * @type Boolean
             * @default true
             */
            singleSelect:true,
            //event
            /**
             * 选择一行记录后执行的方法。
             * @event
             * @type Function
             * @param rowIndex 行号（从0开始）
             * @param rowData 选择的行所代表的JSON对象
             * @param {Object} inst 组件对象实例
             * @param event jQuery.Event对象。
             * @default 无
             */
            onRowSelect:function(rowIndex,rowData,inst,event){},
            /**
             * 取消一行记录的选择后执行的方法。
             * @event
             * @type Function
             * @param rowIndex 行号（从0开始）
             * @param rowData 选择的行所代表的JSON对象
             * @param {Object} inst 组件对象实例
             * @param event jQuery.Event对象
             * @default 无
             */
            onRowDeselect:function(rowIndex,rowData,inst,event){},
            /**
             * 单击一行记录后执行的方法。
             * @event
             * @type Function
             * @param rowIndex 行号（从0开始）
             * @param rowData 选择的行所代表的JSON对象
             * @param {Object} inst 组件对象实例
             * @param event jQuery.Event对象
             * @default 无
             */
            onRowClick:function(rowIndex,rowData,inst,event){},
            /**
             * 双击一行记录后执行的方法。
             * @event
             * @type Function
             * @param rowIndex 行号（从0开始）
             * @param rowData 选择的行所代表的JSON对象
             * @param event jQuery.Event对象
             * @default 无
             */
            onRowDblClick:function(rowIndex,rowData,event){},
            /**
             * 改变分页<b>之前</b>执行的方法。<b>注意：如果此方法返回false则不进行分页切换或跳转</b>。
             * @event
             * @type Function
             * @param type 切换类型，是'first'、'prev'、'next'、'last'、'input'之一。
             * @param newPage 要转到的页号（从1开始，第一页是1而不是0）
             * @param {Object} inst 组件对象实例
             * @param event jQuery.Event对象
             * @default 无
             */
            //TODO 文档中写明必须return true时才跳转
            onPageChange:function(type,newPage,inst,event){},
            /**
             * 从后台取数成功时执行的方法。
             * @event
             * @type Function
             * @param data 取回来的数据（ 格式是{"total":35,"rows":[{"id":11,"city":"河南省安阳市","address":"电信"},{"id":12,"city":"北京市","address":"北龙中网科技有限公司"},{"id":13,"city":"澳大利亚","address":"CZ88.NET"}]}  ）。
             * @param testStatus 响应的状态（参考jQuery的$.ajax的success属性）
             * @param XMLHttpRequest XMLHttpRequest对象（参考jQuery的$.ajax的success属性）
             * @param event jQuery.Event对象
             * @default 无
             */
            onSuccess:function(data){},
            /**
             * 从后台取数失败时执行的方法。
             * @event
             * @type Function
             * @param XMLHttpRequest XMLHttpRequest对象（参考jQuery的$.ajax的error属性）
             * @param testStatus 响应的状态（参考jQuery的$.ajax的error属性）
             * @param errorThrown 捕获的异常对象（参考jQuery的$.ajax的error属性）
             * @param event jQuery.Event对象
             * @default 无
             */
            onError:function(code,data){},
            /**
             * 数据已全部显示到表体中后执行的方法。
             * @event
             * @type Function
             * @param nowPage 当前页号(第一页是1第二页是2)
             * @param pageRecords 当前页的所有记录
             * @param event jQuery.Event对象
             * @default 无
             * @example
             * //数据显示完后自动选中所有地址是'电信'的行。
             */
            onRefresh:function(nowPage,pageRecords,event){},
            /**
             *当重新刷新时的回调方法列表(仅内部使用)
            */
            _onRefreshCallbacks : [],

            /**
             * 当标题列改变大小时的回调事件列表，主要用于行编辑插件。(仅内部使用)
             */
            _onResizableCallbacks : [],

            /**
             * 当调用resize方法动态改变宽高时的回调事件列表
             */
            _onResizeCallbacks : [],
            /**
             * grid初始化方式，默认通过html来设置参数。传值为js时，则通过js中设置的option来初始化。
             * @type String
             * @default 'html'
             * @example
             * $('.selector').aeGrid({initType : 'js'});
             */
            initType : 'html',
            //分页条对齐方式，默认居右，可选 left、center、right
            pagingAlign : 'right',
            //分页条类型
            pagingType : '',
            //行样式是否显示条纹样式，默认true
            striped : true,
            //默认表头高度
            _defaultThHeight : 34,
            //ajax请求 参数
            _successCB:undefined, //reload成功后的回调函数
            _failCB:undefined,    //reload失败后的回调函数
            _params : '',
            _header : '',
            _clickTimer : null,
            dataField : '',
            isPaging : false,
            showMsg : true,
            startField : 'start',
            endField : 'end',
            _selectIndex : -1,//单选时的选中行号
            changedData : {add:[], edit:[], del:[]},//数据变更记录
            /**
             * 防止重复初始化
             * @type Boolean
             * @default false
             */
    		_initial : false,
    		treeIcons : {fold : 'fa fa-folder', unfold : 'fa fa-folder-open', file : 'fa fa-bar-chart-o'},
    		//是否可编辑，默认false
            editable : false,
            _editOption : {_triggered : false, _editRowId : "-1"},
    		//new ...
    		doSelectEvent : false,
    		stateField : 'checkboxCol',
    		showHeader: true,
            showFooter: false,
            showPaginationSwitch: true,
            showRefresh: true,
            showToggle: true,
            buttonsAlign: 'right',
            minimumCountColumns: 1,
            icons: {
                paginationSwitchDown: 'glyphicon-collapse-down icon-chevron-down',
                paginationSwitchUp: 'glyphicon-collapse-up icon-chevron-up',
                refresh: 'glyphicon-refresh icon-refresh',
                toggle: 'glyphicon-list-alt icon-list-alt',
                columns: 'glyphicon-th icon-th'
            },
            sidePagination: 'client', // client or server
            totalRows: 0, // server side need to set
            pageNumber: 1,
            pageList: [2, 4, 5, 8],
            paginationHAlign: 'right', //right, left
            paginationVAlign: 'bottom', //bottom, top, both
            paginationDetailHAlign: 'left', //right, left

            rowStyle: function (row, index) {
                return {};
            },

            rowAttributes: function (row, index) {
                return {};
            },

            onAll: function (name, args) {
                return false;
            },
            onClickRow: function (item, $element) {
                return false;
            },
            onDblClickRow: function (item, $element) {
                return false;
            },
            onSort: function (name, order) {
                return false;
            },
            onCheck: function (row) {
                return false;
            },
            onUncheck: function (row) {
                return false;
            },
            onCheckAll: function () {
                return false;
            },
            onUncheckAll: function () {
                return false;
            },
            onLoadSuccess: function (data) {
                return false;
            },
            onLoadError: function (status) {
                return false;
            },
            onColumnSwitch: function (field, checked) {
                return false;
            },
            onColumnSearch: function (field, text) {
                return false;
            },
            /*onPageChange: function (number, size) {
                return false;
            },*/
            onSearch: function (text) {
                return false;
            },
            onPreBody: function (data) {
                return false;
            },
            onPostBody: function () {
                return false;
            },
            onPostHeader: function () {
                return false;
            }
        },
        //private methods
        _create:function(){
            var ops=this.options,
				el=this.element,
				id=el.attr("id");

            if(ops._initial){
            	return;
            }else{
            	ops._initial = true;
            }
			if(id){
				el.attr("aeId",id);
			}

            if(ops.initType=='html'){
            	this._buildOptions(ops,el);
            }else{
            	this._buildOptionsEvents(ops);
            }

            ops.DEFINE = {
            	cellPadding : 16,
                colDefWidth : 150, //列最小宽度,默认宽度 150
            	indexWidth : 60, //index的宽度 60 - 16
                checkboxWidth : 36 //checkbox的宽度 36 - 16
            };

            ops.COLUMN_DEFAULTS = {
                checkbox: false,
                checkboxEnabled: true,
                field: undefined,
                title: undefined,
                showTitle: false, //是否显示鼠标划过提示td内容
                'class': undefined,
                align: undefined, // left, right, center
                headAlign: 'center', // left, right, center
                falign: undefined, // left, right, center
                valign: 'middle', // top, middle, bottom
                width: undefined,
                sortable: false,
                order: 'asc', // asc, desc
                visible: true,
                switchable: true,
                clickToSelect: true,
                formatter: undefined,
                footerFormatter: undefined,
                events: undefined,
                sorter: undefined,
                cellStyle: undefined,
                searchable: true,
                filterControl: undefined // edit, todo: select, todo: date
            };

            ops.EVENTS = {
                'all.bs.table': 'onAll',
                'click-row.bs.table': 'onClickRow',
                'dbl-click-row.bs.table': 'onDblClickRow',
                'sort.bs.table': 'onSort',
                'check.bs.table': 'onCheck',
                'uncheck.bs.table': 'onUncheck',
                'check-all.bs.table': 'onCheckAll',
                'uncheck-all.bs.table': 'onUncheckAll',
                'load-success.bs.table': 'onLoadSuccess',
                'load-error.bs.table': 'onLoadError',
                'column-switch.bs.table': 'onColumnSwitch',
                'column-search.bs.table': 'onColumnSearch',
                'page-change.bs.table': 'onPageChange',
                'search.bs.table': 'onSearch',
                'pre-body.bs.table': 'onPreBody',
                'post-body.bs.table': 'onPostBody',
                'post-header.bs.table': 'onPostHeader'
            };

            el.wrap('<div class="bootstrap-table '+ops.theme+'"></div>');

            this.$grid=el.parent();

            if(ops.titleRenderer && $.isFunction(ops.titleRenderer)){
            	var tRenderer = ops.titleRenderer();
            	if(tRenderer){
            		this.$grid.append('<div class="gray_border_tool clearfix">'+tRenderer+'</div>');
            	}
            }

            this.$grid.append(['<div class="fixed-table-container">',
                               '<div class="fixed-table-header"><table></table></div>',
                               '<div class="fixed-table-body">',
                               '<div class="fixed-table-loading">',
                               $.ae.lang.aeGrid.loadingMsg,
                               '</div>',
                               '</div>',
                               '<div class="fixed-table-footer"><table><tr></tr></table></div>',
                               this.options.paginationVAlign === 'bottom' || this.options.paginationVAlign === 'both' ?
                                   '<div class="fixed-table-pagination clearfix"></div>' : '',
                               '</div>'].join(''));

            this.$el=$('<table class="table table-hover '+(ops.showBorder?'table-bordered ':'')+'"><thead><tr></tr></thead><tbody></tbody></table>');
            this.timeoutId_ = 0;
            this.timeoutFooter_ = 0;
            this.$el_ = this.$el.clone();

            this.$grid.find('.fixed-table-body').append(this.$el);
            this.$loading = this.$grid.find('.fixed-table-loading');

            //设置表格样式
            //TODO
            this.$el.addClass(this.options.classes);
            if (this.options.striped) {
                this.$el.addClass('table-striped');
            }
            //TODO
            //pop其中id属性，将id赋给table
//            this.$grid.attr("id",this.element.attr("id"));
//            this.element.removeProp("id");

            this.element.empty();
            this.element.css("border-width", 0).hide();
//            this.element = this.$grid;
//            this.$grid.attr("aeType","aeGrid");
        },
        _init:function(){
            this._initTable();
            this._initHeader();
            this._initData();
            this._initFooter();
            this._initToolbar();
            this._initPagination();
            this._initBody();
            this._resetWidth();
            /*this._initServer();
            this.initKeyEvents();*/
        },
        _initTable : function () {
        	var self = this,
            columns = [],
            data = [];

        	this.$header = this.$el.find('thead');

	        $.each(this.options.columns, function (i, column) {
	            self.options.columns[i] = $.extend({}, self.options.COLUMN_DEFAULTS,
	                {field: i}, column); // when field is undefined, use index instead
	        });
        },
        _initHeader : function () {
            var self = this,
            	ops = this.options,
                visibleColumns = [],
                html = [],
                addedFilterControl = false,
                timeoutId = 0;

            this.header = {
                fields: [],
                styles: [],
                classes: [],
                formatters: [],
                events: [],
                sorters: [],
                cellStyles: [],
                clickToSelects: [],
                searchables: []
            };
            var header = this.header;
            //渲染checkbox列
            if(!ops.singleSelect){
                header.fields.push('checkboxCol');
                header.styles.push('width:'+ops.DEFINE.checkboxWidth+'px;vertical-align:middle;');
                html.push('<th field="checkboxCol" style="width:'+ops.DEFINE.checkboxWidth+'px;"><div class="th-inner"><div class="ckbox ckbox-default"><input id="'+ops.id+'_btSelectAll" name="btSelectAll" type="checkbox"></input><label for="'+ops.id+'_btSelectAll"></label></div></div></th>');
            }

            //渲染序号列
            if(ops.showIndex){
            	header.fields.push('indexCol');
                header.styles.push('width:'+ops.DEFINE.indexWidth+'px;vertical-align:middle;text-align:center;');
                //TODO 判断当grid可sort时，也可sort
                html.push('<th field="indexCol" style="text-align:center;width:'+ops.DEFINE.indexWidth+'px;"><div class="th-inner"></div></th>');
            }

            $.each(ops.columns, function (i, column) {
                var text = '',
                    halign = '', // header align style
                    align = '', // body align style
                    style = '',
                    class_ = sprintf(' class="%s"', column['class']),//TODO 这里是否需要设置头样式？
                    order = self.options.sortOrder || column.order,
                    searchable = true;

                if (!column.visible) {
                    return;
                }

                halign = sprintf('text-align: %s; ', column.headAlign ? column.headAlign : column.align);
                align = sprintf('text-align: %s; ', column.align);
                style = sprintf('vertical-align: %s; ', column.valign);
//                style += sprintf('width: %s'+ unitWidth +'; ', column.width ? column.width : ops.DEFINE.colDefWidth);
                //TODO 是否移除 visibleColumns
                visibleColumns.push(column);

                header.fields.push(column.field);
                header.styles.push(align + style);
                header.classes.push(class_);
                header.formatters.push(column.formatter);
                header.events.push(column.events);
                header.sorters.push(column.sorter);
                header.cellStyles.push(column.cellStyle);
                header.clickToSelects.push(column.clickToSelect);
                header.searchables.push(column.searchable);

                html.push('<th', ' field="'+column.field+'"', class_, sprintf(' style="%s"', halign + style), '>');

                html.push(sprintf('<div class="th-inner %s">', self.options.sortable && column.sortable ?
                    'sortable' : ''));

                text = column.title;
                if (self.options.sortName === column.field && self.options.sortable && column.sortable) {
                    text += self.getCaretHtml();
                }

                html.push(text);
                html.push('<span class="td_drog"></span></div>');
                html.push('</th>');
            });

            this.$header.find('tr').html(html.join(''));
            // this.$header.find('th').each(function (i) {
            //     //$(this).data(visibleColumns[i]);
            // });


            //TODO what?
            this.$grid.off('click', '.th-inner').on('click', '.th-inner', function (event) {
                if (self.options.sortable && $(this).parent().data().sortable) {
                    self.onSort(event);
                }
            });

            if (!this.options.showHeader || this.options.cardView) {
                this.$header.hide();
                this.$grid.find('.fixed-table-header').hide();
                this.$loading.css('top', 0);
            } else {
                this.$header.show();
                this.$grid.find('.fixed-table-header').show();
//                this.$loading.css('top', cellHeight + 'px');
            }

            var $selectAll = $('th[field=checkboxCol] label', this.$header);
            if($selectAll.length>0){
				$selectAll.on('click', function (){
	                var thCheckbox=$(this),
	                	trSize=self._getTrs().size(),
						i;
	                if(thCheckbox.attr('isChecked')=='true'){ //说明是要全部取消选择
	                	thCheckbox.removeClass();
	                	thCheckbox.attr('isChecked','false');
	                    for(i=0;i<trSize;i++){
	                        self._rowDeSelect(i);
	                    }
	                }else{ //说明是要全选
	                	thCheckbox.addClass('checked');
	                	thCheckbox.attr('isChecked','true');
	                    for(i=0;i<trSize;i++){
	                        self._rowSelect(i);
	                    }
	                }
	            });
			}
        },
        /**
         * @param data
         * @param type: append / prepend
         */
        _initData : function (data, type) {
            if (type === 'append') {
                this.data = this.data.concat(data);
            } else if (type === 'prepend') {
                this.data = [].concat(data).concat(this.data);
            } else {
                this.data = data;
            }
            if (this.options.sidePagination === 'server') {
                return;
            }
        },
        _initFooter : function () {
            this.$footer =  this.$grid.find('.fixed-table-footer');
			if(this.options.showFooter){
				this.$footer.show();
			}else{
				this.$footer.hide();
			}
        },
        _initPagination : function () {
            this.$pagination = this.$grid.find('.fixed-table-pagination');

            if (!this.options.isPaging) {
                this.$pagination.hide();
                return;
            } else {
                this.$pagination.show();
            }

            var self = this,
                html = [],
                $allSelected = false,
                i, from, to,
                $pageList,
                $first, $pre,
                $next, $last,
                $number,
                data = this.getData(),
                totalRows = this.options.totalRows;
            //TODO 这里需要设置totalRows
            /*if (this.options.sidePagination !== 'server') {
                this.options.totalRows = data.length;
            }*/
            totalRows = data.length > totalRows ? data.length : totalRows;

            this.options.totalPages = 0;
            if (totalRows) {
                if (this.options.pagingSize === 'All') {
                    this.options.pagingSize = totalRows;
                    $allSelected = true;
                } else if (this.options.pagingSize === totalRows) {
                    // Fix #667 Table with pagination, multiple pages and a search self matches to one page throws exception
                    var pageLst = typeof this.options.pageList === 'string' ?
                        this.options.pageList.replace('[', '').replace(']', '').replace(/ /g, '').toLowerCase().split(',') :
                        this.options.pageList;
                    if (pageLst.indexOf('All'.toLowerCase()) > -1) {
                        $allSelected = true;
                    }
                }

                this.options.totalPages = ~~((totalRows - 1) / this.options.pagingSize) + 1;
            }
            if (this.options.totalPages > 0 && this.options.pageNumber > this.options.totalPages) {
                this.options.pageNumber = this.options.totalPages;
            }

            this.pageFrom = this.getStart();
            this.pageTo = this.getEnd();
            if (this.pageTo > totalRows) {
                this.pageTo = totalRows;
            }
            var endPage = this.pageTo;
            if (endPage > totalRows) {
            	endPage = totalRows;
            }
            html.push(
                '<div class="pull-' + this.options.paginationDetailHAlign + ' pagination-detail">',
                '<span class="pagination-info">',
                this._formatShowingRows(this.pageFrom, endPage, totalRows),
                '</span>');

            html.push('<span class="page-list">');

            var pageNumber = [
                    sprintf('<span class="btn-group %s">', this.options.paginationVAlign === 'top' || this.options.paginationVAlign === 'both' ?
                        'dropdown' : 'dropup'),
                    '<button type="button" class="btn btn-default ' + (this.options.iconSize === undefined ? '' : ' btn-' + this.options.iconSize) + ' dropdown-toggle" data-toggle="dropdown">',
                    '<span class="page-size">',
                    $allSelected ? this.options.formatAllRows() : this.options.pagingSize,
                    '</span>',
                    ' <span class="caret"></span>',
                    '</button>',
                    '<ul class="dropdown-menu" role="menu">'],
                pageList = this.options.pageList;

            if (typeof this.options.pageList === 'string') {
                var list = this.options.pageList.replace('[', '').replace(']', '').replace(/ /g, '').split(',');

                pageList = [];
                $.each(list, function (i, value) {
                    pageList.push(value.toUpperCase() === self.options.formatAllRows().toUpperCase() ?
                                    self.options.formatAllRows() : +value);
                });
            }

            $.each(pageList, function (i, page) {
                if (!self.options.smartDisplay || i === 0 || pageList[i - 1] <= totalRows) {
                    var active;
                    if ($allSelected) {
                        active = page === self.options.formatAllRows() ? ' class="active"' : '';
                    } else{
                        active = page === self.options.pagingSize ? ' class="active"' : '';
                    }
                    pageNumber.push(sprintf('<li%s><a>%s</a></li>', active, page));
                }
            });
            pageNumber.push('</ul></span>');
            //TODO 暂时不控制分页数
            //html.push(this._formatRecordsPerPage(pageNumber.join('')));
            html.push('</span>');

            // Fixed #611 vertical-align between pagination block and pagination-detail block. Remove class pagination.
            html.push('</div>',
                '<div class="pull-' + this.options.paginationHAlign + '">',
                '<ul class="pagination' + (this.options.iconSize === undefined ? '' : ' pagination-' + this.options.iconSize) + '">',
                '<li class="page-first"><a>&lt;&lt;</a></li>',
                '<li class="page-pre"><a>&lt;</a></li>');
            //TODO 这里讲5做个 配置
            if (this.options.totalPages < 5) {
                from = 1;
                to = this.options.totalPages;
            } else {
                from = this.options.pageNumber - 2;
                to = from + 4;
                if (from < 1) {
                    from = 1;
                    to = 5;
                }
                if (to > this.options.totalPages) {
                    to = this.options.totalPages;
                    from = to - 4;
                }
            }
            for (i = from; i <= to; i++) {
                html.push('<li class="page-number' + (i === this.options.pageNumber ? ' active' : '') + '">',
                    '<a>', i, '</a>',
                    '</li>');
            }

            html.push(
                '<li class="page-next"><a>&gt;</a></li>',
                '<li class="page-last"><a>&gt;&gt;</a></li>',
                '</ul>',
                '</div>');

            this.$pagination.html(html.join(''));

            $pageList = this.$pagination.find('.page-list a');
            $first = this.$pagination.find('.page-first');
            $pre = this.$pagination.find('.page-pre');
            $next = this.$pagination.find('.page-next');
            $last = this.$pagination.find('.page-last');
            $number = this.$pagination.find('.page-number');

            if (this.options.pageNumber <= 1) {
                $first.addClass('disabled');
                $pre.addClass('disabled');
            }
            if (this.options.pageNumber >= this.options.totalPages) {
                $next.addClass('disabled');
                $last.addClass('disabled');
            }
            if (this.options.smartDisplay) {
                if (this.options.totalPages <= 1) {
                    this.$pagination.find('div.pagination').hide();
                }
                if (pageList.length < 2 || totalRows <= pageList[0]) {
                    this.$pagination.find('span.page-list').hide();
                }

                // when data is empty, hide the pagination
                this.$pagination[this.getData().length ? 'show' : 'hide']();
            }
            if ($allSelected) {
                this.options.pagingSize = this.options.formatAllRows();
            }
            $pageList.off('click').on('click', $.proxy(this._onPageListChange, this));
            $first.off('click').on('click', $.proxy(this._onPageFirst, this));
            $pre.off('click').on('click', $.proxy(this._onPagePre, this));
            $next.off('click').on('click', $.proxy(this._onPageNext, this));
            $last.off('click').on('click', $.proxy(this._onPageLast, this));
            $number.off('click').on('click', $.proxy(this._onPageNumber, this));
        },
        /* pagination begin */
        _updatePagination : function (event,ctype) {
            // Fix #171: IE disabled button can be clicked bug.
            if (event && $(event.currentTarget).hasClass('disabled')) {
                return;
            }

            if (!this.options.maintainSelected) {
            	//TODO 翻页时保留已选择的item
                //this._resetRows();
            }
            //触发事件
            if(this.options.onPageChange  && this._trigger("onPageChange",null,ctype, this.options.pageNumber,this)===false){
            	//当onPageChange的返回值为false时不执行加载数据
            	return;
            }
            this._initPagination();
            if (this.options.sidePagination === 'server') {
                this._initServer();
            } else {
                this._initBody();
            }
        },
        _onPageListChange : function (event) {
            var $this = $(event.currentTarget);

            $this.parent().addClass('active').siblings().removeClass('active');
            this.options.pagingSize = $this.text().toUpperCase() === this.options.formatAllRows().toUpperCase() ?
                                        this.options.formatAllRows() : +$this.text();
            this.$toolbar.find('.page-size').text(this.options.pagingSize);

            this._updatePagination(event,'page');
        },
        _onPageFirst : function (event) {
            this.options.pageNumber = 1;
            this._updatePagination(event,'first');
        },
        _onPagePre : function (event) {
            this.options.pageNumber--;
            this._updatePagination(event,'prev');
        },
        _onPageNext : function (event) {
            this.options.pageNumber++;
            this._updatePagination(event,'next');
        },
        _onPageLast : function (event) {
            this.options.pageNumber = this.options.totalPages;
            this._updatePagination(event,'last');
        },
        _onPageNumber : function (event) {
            if (this.options.pageNumber === +$(event.currentTarget).text()) {
                return;
            }
            this.options.pageNumber = +$(event.currentTarget).text();
            this._updatePagination(event,'page');
        },
        /* pagination end */
        //TODO
        _formatShowingRows: function (pageFrom, pageTo, totalRows) {
            return sprintf('Showing %s to %s of %s rows', pageFrom, pageTo, totalRows);
        },
        _formatRecordsPerPage: function (pageNumber) {
            return sprintf('%s records per page', pageNumber);
        },
        _initToolbar : function () {
            var self = this,
                html = [],
                timeoutId = 0,
                $keepOpen,
                $search,
                switchableCount = 0;

            this.$toolbar = this.$grid.find('.fixed-table-toolbar').html('');

            if (typeof this.options.toolbar === 'string') {
                $(sprintf('<div class="bars pull-%s"></div>', this.options.toolbarAlign))
                    .appendTo(this.$toolbar)
                    .append($(this.options.toolbar));
            }

            // showColumns, showToggle, showRefresh
            html = [sprintf('<div class="columns columns-%s btn-group pull-%s">',
                this.options.buttonsAlign, this.options.buttonsAlign)];

            if (typeof this.options.icons === 'string') {
                this.options.icons = calculateObjectValue(null, this.options.icons);
            }

            if (this.options.showPaginationSwitch) {
                html.push(sprintf('<button class="btn btn-default" type="button" name="paginationSwitch" title="%s">',
                	'Hide/Show pagination'),
                    sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.paginationSwitchDown),
                    '</button>');
            }

            if (this.options.showRefresh) {
                html.push(sprintf('<button class="btn btn-default' + (this.options.iconSize === undefined ? '' : ' btn-' + this.options.iconSize) + '" type="button" name="refresh" title="%s">',
                	'Refresh'),
                    sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.refresh),
                    '</button>');
            }

            if (this.options.showToggle) {
                html.push(sprintf('<button class="btn btn-default' + (this.options.iconSize === undefined ? '' : ' btn-' + this.options.iconSize) + '" type="button" name="toggle" title="%s">',
                	'Toggle'),
                    sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.toggle),
                    '</button>');
            }

            if (this.options.showColumns) {
                html.push(sprintf('<div class="keep-open btn-group" title="%s">',
                	'Columns'),
                    '<button type="button" class="btn btn-default' + (this.options.iconSize === undefined ? '' : ' btn-' + this.options.iconSize) + ' dropdown-toggle" data-toggle="dropdown">',
                    sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.columns),
                    ' <span class="caret"></span>',
                    '</button>',
                    '<ul class="dropdown-menu" role="menu">');

                $.each(this.options.columns, function (i, column) {
                    if (column.radio || column.checkbox) {
                        return;
                    }

                    if (self.options.cardView && (!column.cardVisible)) {
                        return;
                    }

                    var checked = column.visible ? ' checked="checked"' : '';

                    if (column.switchable) {
                        html.push(sprintf('<li>' +
                            '<label><input type="checkbox" data-field="%s" value="%s"%s> %s</label>' +
                            '</li>', column.field, i, checked, column.title));
                        switchableCount++;
                    }
                });
                html.push('</ul>',
                    '</div>');
            }

            html.push('</div>');

            // Fix #188: this.showToolbar is for extentions
            if (this.showToolbar || html.length > 2) {
                this.$toolbar.append(html.join(''));
            }

            if (this.options.showPaginationSwitch) {
                this.$toolbar.find('button[name="paginationSwitch"]')
                    .off('click').on('click', $.proxy(this.togglePagination, this));
            }

            if (this.options.showRefresh) {
                this.$toolbar.find('button[name="refresh"]')
                    .off('click').on('click', $.proxy(this.refresh, this));
            }

            if (this.options.showToggle) {
                this.$toolbar.find('button[name="toggle"]')
                    .off('click').on('click', function () {
                        self.toggleView();
                    });
            }

            if (this.options.showColumns) {
                $keepOpen = this.$toolbar.find('.keep-open');

                if (switchableCount <= this.options.minimumCountColumns) {
                    $keepOpen.find('input').prop('disabled', true);
                }

                $keepOpen.find('li').off('click').on('click', function (event) {
                    event.stopImmediatePropagation();
                });
                $keepOpen.find('input').off('click').on('click', function () {
                    var $this = $(this);

                    self.toggleColumn($this.val(), $this.prop('checked'), false);
                    self._triggerEvent('column-switch', $(this).data('field'), $this.prop('checked'));
                });
            }

            if (this.options.search) {
                html = [];
                html.push(
                    '<div class="pull-' + this.options.searchAlign + ' search">',
                    sprintf('<input class="form-control' + (this.options.iconSize === undefined ? '' : ' input-' + this.options.iconSize) + '" type="text" placeholder="%s">',
                    		'Search'),
                    '</div>');

                this.$toolbar.append(html.join(''));
                $search = this.$toolbar.find('.search input');
                $search.off('keyup').on('keyup', function (event) {
                    clearTimeout(timeoutId); // doesn't matter if it's 0
                    timeoutId = setTimeout(function () {
                        self.onSearch(event);
                    }, self.options.searchTimeOut);
                });

                if (this.options.searchText !== '') {
                    $search.val(this.options.searchText);
                    clearTimeout(timeoutId); // doesn't matter if it's 0
                    timeoutId = setTimeout(function () {
                        $search._triggerEvent('keyup');
                    }, self.options.searchTimeOut);
                }
            }
        },
        _initBody : function (fixedScroll) {
            var self = this,
            	ops = this.options,
                html = [],
                data = this.getData();

//            this._triggerEvent('pre-body', data);

            this.$body = this.$el.find('tbody');
            if (!this.$body.length) {
                this.$body = $('<tbody></tbody>').appendTo(this.$el);
            }

            //Fix #389 Bootstrap-table-flatJSON is not working

            if (!ops.isPaging) {
                this.pageFrom = 1;
                this.pageTo = data.length;
            }

            $.each(data,function(i, item){
                var key,
                    style = {},
                    csses = [],
                    attributes = {},
                    htmlAttributes = [];

                style = calculateObjectValue(self.options, self.options.rowStyle, [item, i], style);

                if (style && style.css) {
                    for (key in style.css) {
                        csses.push(key + ': ' + style.css[key]);
                    }
                }

                attributes = calculateObjectValue(self.options,
                		self.options.rowAttributes, [item, i], attributes);

                if (attributes) {
                    for (key in attributes) {
                        htmlAttributes.push(sprintf('%s="%s"', key, escapeHTML(attributes[key])));
                    }
                }

                html.push('<tr',
                    sprintf(' %s', htmlAttributes.join(' ')),
                    sprintf(' class="%s"', style.classes),
                    sprintf(' data-index="%s"', i),
                    '>'
                );

                $.each(self.header.fields, function (j, field) {
                    var text = '',
                        type = '',
                        cellStyle = {},
                        class_ = self.header.classes[j],
                        column = ops.columns[getFieldIndex(ops.columns, field)];

                    style = sprintf('style="%s"', csses.concat(self.header.styles[j]).join('; '));
                    //TODO 是否需要？
//                    value = calculateObjectValue(self.header,
//                        self.header.formatters[j], [value, item, i], value);

                    // handle td's id and class
                    /*if (item['_' + field + '_id']) {
                        id_ = sprintf(' id="%s"', item['_' + field + '_id']);
                    }
                    if (item['_' + field + '_class']) {
                        class_ = sprintf(' class="%s"', item['_' + field + '_class']);
                    }*/
                    //TODO 是否需要？
                    /*cellStyle = calculateObjectValue(self.header,
                        self.header.cellStyles[j], [value, item, i], cellStyle);*/
                    if (cellStyle.classes) {
                        class_ = sprintf(' class="%s"', cellStyle.classes);
                    }
                    if (cellStyle.css) {
                        var csses_ = [];
                        for (var key in cellStyle.css) {
                            csses_.push(key + ': ' + cellStyle.css[key]);
                        }
                        style = sprintf('style="%s"', csses_.concat(self.header.styles[j]).join('; '));
                    }

                    if(field == 'checkboxCol'){
                    	text = '<td field="checkboxCol" '+style+'><div class="th-inner"><div class="ckbox ckbox-default"><input id="'+self.options.id+'_checkboxCol_'+i+'" type="checkbox"></input><label for="'+self.options.id+'_checkboxCol_'+i+'"></label></div></div></td>';
                    }else if(field == 'indexCol'){
                    	text = '<td field="indexCol" '+style+'>'+(i+self.pageFrom)+'</td>';
                    }else{
                    	/*if (item['_' + field + '_data'] && !$.isEmptyObject(item['_' + field + '_data'])) {
                            $.each(item['_' + field + '_data'], function (k, v) {
                                // ignore data-index
                                if (k === 'index') {
                                    return;
                                }
                                data_ += sprintf(' data-%s="%s"', k, v);
                            });
                        }*/
                    	//TODO 是否需要？
                    	/*value = typeof value === 'undefined' || value === null ?
                                self.options.undefinedText : value;*/
                    	if(column.wrap){
                    		class_ = 'break-word';
                    	}

                        if(ops.treeColumn && ops.treeColumn == field){
                        	var level = item["aeNodeLevel"];
                    		if(!level){
                    			level = "1";
                    		}
                    		var hasChild = item["aeHasChild"];
                    		if(hasChild){
                    			hasChild = "unfold";
                    		}else{
                    			hasChild = "file";
                    		}
                    		//TODO 如果还有有子节点但未打开
                            class_ = class_ + " level level-"+level +" "+hasChild;
                            text = [sprintf('<td field="%s" class="%s" %s %s %s %s>', column.field, class_?class_:'', style ,
                            		'aeNodeLevel="'+level+'"','aeNodeId="'+item["aeNodeId"]+'"', 'aeNodePId="'+item["aeNodePId"]+'"'),
                            		'<i class="'+ops.treeIcons[hasChild]+'"></i><span class="text nowrap">'+self._buildRowCellValues(column,item,i)+'</span>',
                                    '</td>'].join('');
                        }else{
                        	text = [sprintf('<td field="%s" class="%s" %s title="%s">', column.field, class_?class_:'', style,column.showTitle?(self._buildRowCellValues(column,item,i)):""),
                        	        self._buildRowCellValues(column,item,i),
                                    '</td>'].join('');
                        }

                    }
                    html.push(text);
                });

                if (self.options.cardView) {
                    html.push('</td>');
                }

                html.push('</tr>');
            });

            // show no records
            if (!html.length) {
                html.push('<tr class="no-records-found">',
                    sprintf('<td colspan="%s">%s</td>', this.header.fields.length, 'No matching records found'),
                    '</tr>');
            }

            this.$body.html(html.join(''));

            if (!fixedScroll) {
                this._scrollTo(0);
            }

            // click to select by column
            this.$body.find('> tr > td').off('click').on('click', function (event) {
                var $tr = $(this).parent(),index=$tr.data('index');
				if(self._clickTimer!==null){
					clearTimeout(self._clickTimer);
					self._clickTimer=null;
				}
            	self._clickTimer = setTimeout(function(){
                    if($tr.hasClass('tr_checked')){ //已选择
                    	if(ops.singleSelect){
                    		self._rowDeSelect(index);
                            ops._selectIndex = -1;
                            //取消其他已经选中的行
                            var currentRows = self.getSelections();
                            for(var i = 0; i < currentRows.length; i++){
                                self._rowDeSelect(currentRows[i]);
                            }
                    	}else{
                    		self._rowDeSelect(index);
                    		self._refreshHeaderCheckBox();
                    	}
                    	self._trigger("onRowDeselect",event,index,self._getRowData(index),self);
                    }else{
                    	if(ops.singleSelect){
                            //取消其他已经选中的行
                            var currentRows = self.getSelections();
                            for(var i = 0; i < currentRows.length; i++){
                                self._rowDeSelect(currentRows[i]);
                            }
                    		if(ops._selectIndex != -1){
								self._rowDeSelect(ops._selectIndex);
							}
                    		self._rowSelect(index);
                            ops._selectIndex=index;
                    	}else{
                    		self._rowSelect(index);
                            self._refreshHeaderCheckBox();
                    	}
                    	self._trigger("onRowClick",event,index,self._getRowData(index),self);
                    }

                },300);
            });
            this.$body.find('tr').off('dblclick').on('dblclick', function (event) {
				if(self._clickTimer!==null){
					clearTimeout(self._clickTimer);
					self._clickTimer=null;
				}
                var $tr=$(this),index=$tr.data('index');
                if($tr.hasClass('tr_checked')){ //已选择
                	if(ops.singleSelect){
                		self._rowDeSelect(index);
                        ops._selectIndex = -1;
                	}else{
                		self._rowDeSelect(index);
                		self._refreshHeaderCheckBox();
                	}
                }else{
                	if(ops.singleSelect){
                		if(ops._selectIndex != -1){
							self._rowDeSelect(ops._selectIndex);
						}
                		self._rowSelect(index);
                        ops._selectIndex=index;
                	}else{
                		self._rowSelect(index);
                        self._refreshHeaderCheckBox();
                	}
                }
                self._trigger("onRowDblClick",event,index,self._getRowData(index));
            });
            //TODO ??
            $.each(this.header.events, function (i, events) {
                if (!events) {
                    return;
                }
                // fix bug, if events is defined with namespace
                if (typeof events === 'string') {
                    events = calculateObjectValue(null, events);
                }
                for (var key in events) {
                    self.$body.find('tr').each(function () {
                        var $tr = $(this),
                            $td = $tr.find(self.options.cardView ? '.card-view' : 'td').eq(i),
                            index = key.indexOf(' '),
                            name = key.substring(0, index),
                            el = key.substring(index + 1),
                            func = events[key];

                        $td.find(el).off(name).on(name, function (e) {
                            var index = $tr.data('index'),
                                row = self.data[index],
                                value = row[self.header.fields[i]];

                            func.apply(this, [e, value, row, index]);
                        });
                    });
                }
            });

            if(ops.treeColumn){
           		var $tdIco = $('td[field='+ops.treeColumn+'] i',this.$body);
           		if($tdIco.length){
           			$tdIco.prop('isOpen',true).bind('click',function(event){
               			var isOpen = $(this).prop('isOpen');
               			if(isOpen){
               				self._expandTreeNode($(this).parent().attr('aeNodeId'),false);
               				$(this).prop('isOpen',false);
               			}else{
               				self._expandTreeNode($(this).parent().attr('aeNodeId'),true);
               				$(this).prop('isOpen',true);
               			}
               			$.stopPropagation();
           			});
           		}
           	}

            this._updateSelected();
            this._resetView();

            this._triggerEvent('post-body');
        },
        //构建单元格内容
        _buildRowCellValues:function(column,rowData,rowIndex){
        	var value,
        		field = column.field,
        		render = column.renderer;
        	if(field.indexOf("|") > 0){
        		value = $.aries.common.getDataByDatafield(rowData,field.replace(new RegExp(/\|/g),'.'));
        	}
        	if(value === undefined){
        		value = rowData[field] === undefined? "" : rowData[field];
            }
        	if(typeof render === 'function'){
        		value = render(value,rowData,rowIndex);
            }
        	return value;
        },
        //根据index获取行数据
        _getRowData:function(index){
        	//TODO 判空
        	var d = this.getData();
            return d && d.length ? d[index] : undefined;
        },
        //获取表格中所有的tr，如果index不为空则返回指定tr
        _getTrs:function(index){
        	return (typeof index != 'undefined') ? this.$body.children().filter('[data-index="'+index+'"]') : this.$body.find('tr');
        },
        //内部event，行选中事件
        _rowSelect:function(index){
            var tr=this._getTrs(index),
                chk=$('td[field=checkboxCol] label', tr);
            if(!tr.hasClass("no-records-found")){
                tr.attr('class','tr_checked');
            }
            if(chk.length){
            	chk.attr('isChecked','true');
            	chk.addClass('checked');
            }
            if(this.options.doSelectEvent){
				this._trigger('onRowSelect', null, index, this._getRowData(index),this);
			}
        },
        //内部event，行反选中事件
        _rowDeSelect:function(index){
            var tr=this._getTrs(index),
            	chk=$('td[field=checkboxCol] label',tr);
            tr.removeClass('tr_checked');
            if(chk.length){
            	chk.attr('isChecked','false');
            	chk.removeClass();
            }
            if(this.options.doSelectEvent){
				this._trigger("onRowDeselect",null,index,this._getRowData(index),this);
			}
        },
        //内部event，刷新header中checkbox事件
        _refreshHeaderCheckBox:function(){
        	var header = this.$grid.find('.fixed-table-header');
        	if(header && header.is(":hidden")){
        		header = this.$header;
        	}
        	var headerCheckbox = $('th[field=checkboxCol]', header).find('label'),
        		len = this._getTrs().length;
        	//如果当前页一条数据都没有，那么应该不选中比较合理
        	if(len>0 && len==this.getSelections().length){
        		headerCheckbox.addClass('checked');
        		headerCheckbox.attr('isChecked','true');
        	}else{
        		headerCheckbox.removeClass();
        		headerCheckbox.attr('isChecked','false');
        	}
        },
        _resetView : function (params) {
            var self = this,
                padding = 0,
                $tableContainer = self.$grid.find('.fixed-table-container');

            if (params && params.height) {
                this.options.height = params.height;
            }
            //TODO 此逻辑要保留？
            /*this.$selectAll.prop('checked', this.$selectItem.length > 0 &&
                this.$selectItem.length === this.$selectItem.filter(':checked').length);*/

            if (this.options.height) {
                var toolbarHeight = +this.$toolbar.children().outerHeight(true),
                    paginationHeight = +this.$pagination.children().outerHeight(true),
                    height = this.options.height - toolbarHeight - paginationHeight;

                $tableContainer.css('height', height + 'px');
            }

            if (this.options.showHeader && this.options.height) {
                this.$grid.find('.fixed-table-header').show();
                this._resetHeader();
//                padding += cellHeight;
            } else {
                this.$grid.find('.fixed-table-header').hide();
                this._triggerEvent('post-header');
            }

            if (this.options.showFooter) {
                this._resetFooter();
                if (this.options.height) {
//                    padding += cellHeight;
                }
            }

            $tableContainer.css('padding-bottom', padding + 'px');
        },
        _resetHeader : function () {
        	//TODO 表格隐藏时取不到高度，默认-36
        	this.$el.css('margin-top', this.$header.height() ? -this.$header.height() : -37);

        	// fix #61: the hidden table reset header bug.
            // fix bug: get $el.css('width') error sometime (height = 500)
            clearTimeout(this.timeoutId_);
            this.timeoutId_ = setTimeout($.proxy(this._fitHeader, this), this.$el.is(':hidden') ? 100 : 0);
            return;
        },
        _fitHeader : function () {
            var self = this,
                $fixedHeader,
                $fixedBody,
                scrollWidth;
            //TODO height = 500时是否有问题？
            /*if (self.$el.is(':hidden')) {
                self.timeoutFooter_ = setTimeout($.proxy(self._fitHeader, self), 100);
                return;
            }*/
            $fixedHeader = self.$grid.find('.fixed-table-header');
            $fixedBody = self.$grid.find('.fixed-table-body');
			if(self.$el.width() > $fixedBody.width()){
				scrollWidth=getScrollBarWidth();
			}else{
				scrollWidth=0;
			}

            self.$header_ = self.$header.clone(true, true);
            self.$selectAll_ = self.$header_.find('[name="btSelectAll"]');
            //修改：grid右侧多出的空隙，删除了下面一行代码链式调用的第一个子链.css({'margin-right': scrollWidth}).css('width', self.$el.css('width'))
            $fixedHeader.find('table')
                .html('').attr('class', self.$el.attr('class'))
                .append(self.$header_);

            // fix bug: $.data() is not working as expected after $.append()
            self.$header.find('th').each(function (i) {
                self.$header_.find('th').eq(i).data($(this).data());
            });

            self.$body.find('tr:first-child:not(.no-records-found) > *').each(function (i) {
            	//TODO 不设置宽度
                //self.$header_.find('div.fht-cell').eq(i).width($(this).innerWidth());
            });
            // horizontal scroll event
            // TODO: it's probably better improving the layout than binding to scroll event
            $fixedBody.off('scroll').on('scroll', function () {
                $fixedHeader.scrollLeft($(this).scrollLeft());
            });
            self._triggerEvent('post-header');
        },
        _resetFooter : function () {
	        var self = this,
	            data = self.getData(),
	            html = [];

	        if (!this.options.showFooter) { //do nothing
	            return;
	        }

	        $.each(this.options.columns, function (i, column) {
	            var falign = '', // footer align style
	                style  = '',
	                class_ = sprintf(' class="%s"', column['class']);

	            if (!column.visible) {
	                return;
	            }

	            falign = sprintf('text-align: %s; ', column.falign ? column.falign : column.align);
	            style = sprintf('vertical-align: %s; ', column.valign);

	            html.push('<td', class_, sprintf(' style="%s"', falign + style), '>');


	            html.push(calculateObjectValue(column, column.footerFormatter, [data], '&nbsp;') || '&nbsp;');
	            html.push('</td>');
	        });

	        this.$footer.find('tr').html(html.join(''));
	        clearTimeout(this.timeoutFooter_);
	        this.timeoutFooter_ = setTimeout($.proxy(this._fitFooter, this),
	            this.$el.is(':hidden') ? 100: 0);
	    },
	    _fitFooter : function () {
	        var self = this,
	            $fixedBody,
	            $footerTd,
	            elWidth,
	            scrollWidth;

	        clearTimeout(this.timeoutFooter_);
	        if (this.$el.is(':hidden')) {
	            this.timeoutFooter_ = setTimeout($.proxy(this.fitFooter, this), 100);
	            return;
	        }

	        $fixedBody  = this.$grid.find('.fixed-table-body');
	        elWidth     = this.$el.css('width');
	        scrollWidth = elWidth > $fixedBody.width() ? getScrollBarWidth() : 0;

	        this.$footer.css({
	            'margin-right': scrollWidth
	        }).find('table').css('width', elWidth)
	            .attr('class', this.$el.attr('class'));

	        $footerTd = this.$footer.find('td');

	        $fixedBody.find('tbody tr:first-child:not(.no-records-found) > td').each(function(i) {
	            //TODO 这里计算宽度有问题
	        	//$footerTd.eq(i).outerWidth($(this).outerWidth());
	        });
	    },
	    _resetWidth : function(){
	    	var ops = this.options,
    		    cms = ops.columns,
                $grid = this.$grid,
                tempWidth = $grid.width();
	    	if(!cms || cms.length === 0){
	    		return;
	    	}

        	var autoExpandColField = cms[cms.length-1].field,
        		$header = this.$header,
        		allColsWidth = 0;

        	$.each(cms , function(index , cm){
        		var cmWidth = cm.width || 0;
        		if(cmWidth == 'autoExpand'){
                    cmWidth = 0;
                    autoExpandColField = cm.field;
                }

        		if (typeof cmWidth === 'string') {
                    if (cmWidth.indexOf('%') > -1) {
                    	var unitWidth = $.trim(cmWidth).substring(0, cmWidth.length-1);
                    	cmWidth = parseInt(tempWidth * unitWidth / 100);
                    }else{
                    	cmWidth = parseInt(cmWidth.replace('px', ''));
                    }
                }
        		if (cmWidth > 0){
        			$header.find("th[field='"+cm.field+"']").width(cmWidth);
    				allColsWidth += cmWidth + ops.DEFINE.cellPadding;
        		}
        	});

            if(!ops.singleSelect){
            	allColsWidth += ops.DEFINE.checkboxWidth;
            }
            if(ops.showIndex){
            	allColsWidth += ops.DEFINE.indexWidth;
            }

        	this._fixHeaderWidth(autoExpandColField , allColsWidth);

        	var headerWidth = {};
            $($header.find("th[field]")).each(function(){
            	headerWidth[$(this).attr("field")] = $(this).width();
            });

            //修正body中各个td宽度
            this.$body.find("td[field]").each(function(index , td){
            	var field = $(td).prop("field");
            	if(headerWidth[field]){
            		$(td).width(headerWidth[field] );
            	}
            });
        },
        _fixHeaderWidth:function(autoExpandColField , allColsWidth){
        	var ops = this.options,tableWidth,
        		$grid = this.$grid,
        		$header = this.$header,
        		cms = ops.columns,
        		tempWidth = $grid.width();
        	    if(tempWidth <= 0){
        	    	tableWidth = $grid.parent().width();
        	    }else{
        	    	tableWidth = tempWidth;
        	    }


        	/*if(!ops.singleSelect){
            	header.field = "checkboxCol";
            	header.width = ops.DEFINE.checkboxWidth + ops.DEFINE.cellPadding;
            	headers.push(header);
            }
            if(ops.showIndex){
            	header.field = "indexCol";
            	header.width = ops.DEFINE.indexWidth + ops.DEFINE.cellPadding;
            	headers.push(header);
            }*/

        	if(ops.autoFit){
        		var usableWidth = tableWidth - allColsWidth,
                    percent = 1 + usableWidth/tableWidth,
                    $grid = this.$grid,
                    tempWidth = $grid.width();

                $.each(cms , function(index , cm){
                	//if(cm.width > 0){
                	//	$header.find("th[field='"+cm.field+"']").width(parseInt(cm.width*percent));
                	//}else {
                	//	$header.find("th[field='"+cm.field+"']").width(parseInt(ops.DEFINE.colDefWidth*percent));
                	//}
                    var cmWidth = cm.width || 0;
                    if(cmWidth == 'autoExpand'){
                        cmWidth = 0;
                    }

                    if (typeof cmWidth === 'string') {
                        if (cmWidth.indexOf('%') > -1) {
                            var unitWidth = $.trim(cmWidth).substring(0, cmWidth.length-1);
                            cmWidth = parseInt(tempWidth * unitWidth / 100);
                        }else{
                            cmWidth = parseInt(cmWidth.replace('px', ''));
                        }
                    }
                    if (cmWidth > 0){
                        $header.find("th[field='"+cm.field+"']").width(cmWidth*percent);
                    }else {
                        $header.find("th[field='"+cm.field+"']").width(parseInt(ops.DEFINE.colDefWidth*percent));
                    }
                });
        	}

        	/*if(autoExpandColField != ""){ //说明有某列要自动扩充
                var toBeExpandedTh = $header.find('th[field="'+autoExpandColField+'"]');

                //虽然toBeExpandedTh.parent().width()为0,但不同浏览器在计算下边的thead.width()竟然有差异(Chrome)，所以干脆先隐藏了，保证所有浏览器计算thead.width()值一致
                toBeExpandedTh.hide();
                var usableWidth = tableWidth - $header.width();
                toBeExpandedTh.show();
                if(usableWidth <= 0){
                	toBeExpandedTh.css('width',toBeExpandedTh.width());
                }else{
                	toBeExpandedTh.css('width',usableWidth + toBeExpandedTh.width());
                }
            }*/
        },
        _triggerEvent : function (name) {
            var args = Array.prototype.slice.call(arguments, 1);

            name += '.bs.table';
            //TODO 触发事件
            this.options[this.options.EVENTS[name]].apply(this.options, args);
            this.$el.trigger($.Event(name), args);

            this.options.onAll(name, args);
            this.$el.trigger($.Event('all.bs.table'), [name, args]);
        },
        _scrollTo : function (value) {
            var $tbody = this.$grid.find('.fixed-table-body');
            if (typeof value === 'string') {
                value = value === 'bottom' ? $tbody[0].scrollHeight : 0;
            }
            if (typeof value === 'number') {
                $tbody.scrollTop(value);
            }
        },
        _updateSelected : function () {
        	//TODO 此方法是否保留？、
            /*var checkAll = this.$selectItem.filter(':enabled').length ===
                this.$selectItem.filter(':enabled').filter(':checked').length;

            this.$selectAll.add(this.$selectAll_).prop('checked', checkAll);

            this.$selectItem.each(function () {
                $(this).parents('tr')[$(this).prop('checked') ? 'addClass' : 'removeClass']('selected');
            });*/
        },
        _updateRows : function (checked) {
            var self = this;

            this.$selectItem.each(function () {
                self.data[$(this).data('index')][self.header.stateField] = checked;
            });
        },
        _showNoRecords : function(){
        	if(this.$body.find('tr.no-records-found').length) return;
        	//TODO 维护这段文字
        	this.$body.html(['<tr class="no-records-found">',
                             sprintf('<td colspan="%s">%s</td>', this.header.fields.length, 'No matching records found'),
                             '</tr>'].join(''));
        },
        _resetGridView : function(hasRecord){
        	if(hasRecord){
				if(this.options.isPaging){
					this.$pagination.show();
				}
        	}else{
        		this._showNoRecords();
				if(this.options.isPaging){
					this.$pagination.hide();
				}
        	}
        },
        _getSelections : function () {
            var self = this;

            return $.grep(this.data, function (row) {
                return row[self.header.stateField];
            });
        },
        /* reload begin */
        //刷新数据
        _initServer : function() { // get latest data
            var self = this,
                grid = self.$grid,
                ops = self.options,
                successCB = ops._successCB,
                failCB = ops._failCB,
                param = ops._params;

            if (!ops.url) {
            	self._resetGridView(false);
                return false;
            }
            if (self.loading) {
                return true;
            }
            //具备加载数据的前提条件了，准备加载
            self.loading = true;
            this.$loading.show();
            if(ops.isPaging){
            	param += "&"+ops.startField+"=" + self.getStart() + "&"+ops.endField+"=" + self.getEnd();
            }

            $.aries.ajax.post(ops.url,param,function(data){

            	var onSuccess = ops.onSuccess;
            	if(data && ops.dataField){
            		data = $.aries.common.getDataByDatafield(data,ops.dataField);
            	}

                //TODO 树表

                if(data){
                	self._reload(data);
                	if(successCB && $.isFunction(successCB)){
                		successCB(data);
                	}
                } else {
                	self._resetGridView(false);
                }
                //TODO 是否保留
                /*for(var i=0 , len=ops._onRefreshCallbacks.length; i<len; i++){
                	ops._onRefreshCallbacks[i].call(self);
                }*/
                self.loading = false;
                self.$loading.hide();

                //TODO 改成onReload，支持onSuccess
                if (typeof(onSuccess) == 'function') {
                    self._trigger("onSuccess", null, data);
                }
           },function(code, data){
        	   try {
        		   //TODO 是否要显示错误信息?
                   var onError = ops.onError;
                   if (typeof(onError) == 'function') {
                       onError(code, data);                       
                   }
                   if(failCB && $.isFunction(failCB)){
                	   failCB(code,data);
                   }
               } catch (e) {
                   // do nothing
               } finally {
               	   //TODO 提示更多信息
                   self.loading = false;
                   self.$loading.hide();
               	   self._resetGridView(false);
                   return false;
               }
           },$.extend({},{type:ops.method}),ops._header);
        },
        _reload : function (data) {
            var fixedScroll = false,
            	hasNoRecords = true;

            //TODO  如何 处理fixedScroll？
            if(data){
            	if($.isObject(data)){
            		if(data.total && $.isString(data.total)){
                    	data.total = parseInt(data.total);
                    }
                	if(data.total < 1) {
                		this.options.totalRows = 0;
                		data = [];
                		hasNoRecords = false;
                	}else{
                		this.options.totalRows = data.total;
                        fixedScroll = data.fixedScroll;
                        data = data.rows;
                	}
            	}else if($.isArray(data)){
                	if(data.length === 0) {
                		hasNoRecords = false;
                	}else{
                		this.options.totalRows = -1;
                	}
            	}
            	if(this.options.treeColumn){
					data = this._buildTreeData(data);
				}
            } else {
            	data = [];
            	this.options.totalRows = 0;
            	hasNoRecords = false;
            }
            this._resetGridView(hasNoRecords);
            this._initData(data);
            if(hasNoRecords){
            	this._initPagination();
                this._initBody(fixedScroll);
            }

//          this.initSearch();
        },
        /* reload end */
        /* treecolumn begin */
        //构建树表的数据
		_buildTreeData : function(data){
			var rtn = [],
				tmp = [],
				ops = this.options;
				col = {};
			col.idField = ops.treeIdField;
			col.pIdField = ops.treePidField;
			col.labelField = "";
			col.valueField = "";
			col.sortField = ops.treeSortField;
			tmp = $.buildTreeData(data,col);
			if(tmp && tmp.length){
				rtn = this._iterateBuildTreeData(tmp,rtn);
			}
			return rtn;
		},
		_iterateBuildTreeData : function(data,rtn){
			if(!data || !data.length){
				return rtn;
			}
			var item,children;
			for(var i = 0;i < data.length;i++){
				item = data[i];
				children = item.aeChildren;
				if(children && children.length){
					item.aeHasChild = true;
				}
				if(typeof children != 'undefined'){
					delete item.aeChildren;
				}
				delete item.aeNodeLabel;
				delete item.aeNodeValue;
				rtn.push(item);
				if(children && children.length){
					this._iterateBuildTreeData(children,rtn);
				}
			}
			return rtn;
		},
		_expandTreeNode:function(index,isShow){
        	if(index){
        		var $td = $('td[aeNodeId='+index+']',this.$body);
        		if($td.length){
        			var $trs,
        				parent = $td.parent(),
        				$otherTr,
        				$nextTr;
        			$trs = parent.nextAll('tr');
        			$otherTr = $trs.filter(function(index) {
        				  return $('td[aeNodeLevel]',$(this)).attr('aeNodeLevel') <= $td.attr('aeNodeLevel');
        			});

        			if($otherTr.length){
        				$nextTr = $otherTr.eq(0);
    					$trs = parent.nextAll('tr:lt('+$trs.index($nextTr)+')');
        			}

        			if($trs.length){
        				if(isShow){
        					$trs.show();
        					this._changeTreeNodeState(parent,true);
        				}else{
        					$trs.hide();
        					this._changeTreeNodeState(parent,false);
        				}
        			}
        		}
        	}
        },
        _changeTreeNodeState : function($el, isOpen){
        	if(isOpen){
        		$('td[aeNodeLevel]',$el).removeClass('fold').addClass('unfold').find('i').eq(0).removeClass().addClass(this.options.treeIcons['unfold']);
        	}else{
        		$('td[aeNodeLevel]',$el).removeClass('unfold').find('i').eq(0).removeClass().addClass(this.options.treeIcons['fold']);
        	}
        },
        /**
         * 折叠树节点
         * @param index 序号（第一行是0第二行是1）
         */
        collapseTreeNode:function(index){
            var tr = this._getTrs(index),
                that = this,
                nodeId;
            tr.children("td").each(function(){
                if($(this).attr("aenodeid")){
                    nodeId = $(this).attr("aenodeid");
                    that._expandTreeNode(nodeId,false);
                    $(this).find("i").prop('isOpen',false);
                    return false;
                }
            });
        },
        /**
         * 折叠树所有节点
         */
        collapseTreeNodeAll:function(){
            var that = this;
            this._getTrs().each(function(){
                var index = $(this).attr("data-index");
                $(this).children("td").each(function(){
                    if($(this).attr("aenodelevel")){
                        var nodeLeavel = $(this).attr("aenodelevel");
                        if(nodeLeavel==="1"){
                            that.collapseTreeNode(index);
                        }
                        return false;
                    }
                });
            });
        },
        /**
         * 展开树节点
         * @param index  序号（第一行是0第二行是1）
         */
        expandTreeNode:function(index){
            var tr = this._getTrs(index),
                that = this,
                nodeId;
            tr.children("td").each(function(){
                if($(this).attr("aenodeid")){
                    nodeId = $(this).attr("aenodeid");
                    that._expandTreeNode(nodeId,true);
                    $(this).find("i").prop('isOpen',true);
                    return false;
                }
            });
        },
        /**
         * 展开树所有节点
         */
        expandTreeNodeAll:function(){
            var that = this;
            this._getTrs().each(function(){
                that.expandTreeNode($(this).attr("data-index"));
            });
        },
        addRowData : function(data,noRefresh){
			if(data && $.isObject(data)){
				this.options.changedData.add.push(data);
				if(!noRefresh){
					var newAry = [];
					newAry.push(data);
					var gridData = this.getData();
					if(gridData){
						newAry = $.merge(newAry,gridData);
					}
					gridData = newAry;
					var newGridData = {};
					newGridData.rows = gridData;
					var total = this.options.totalRows + 1;
					newGridData.total = total+"";
					this._reload(newGridData);
				}
			}
		},
		editRowData : function(data,idKey,noRefresh){
			if(data && $.isObject(data) && idKey){
				this.options.changedData.edit.push(data);
				if(!noRefresh){
					var gridData = this.getData();
					if(gridData){
						for (var i = 0;i<gridData.length;i++){
							var item = gridData[i];
							if(item && item[idKey] == data[idKey]){
								gridData[i] = data;
								break;
							}
						}
						var newGridData = {};
						newGridData.rows = gridData;
						newGridData.total = this.options.totalRows+"";
						this._reload(newGridData);
					}
				}
			}
		},
		delRowData : function(idKey,idVal,noRefresh){
			if(idKey && idVal){
				var gridData = this.getData(),
					delItem;

				if(gridData){
					for (var i = 0;i<gridData.length;i++){
						var item = gridData[i];
						if(item && item[idKey] == idVal){
							delItem = item;
							gridData.splice(i,1);
							break;
						}
					}
					this.options.changedData.del.push(delItem);
					if(!noRefresh){
						var newGridData = {};
						newGridData.rows = gridData;
						var total = this.options.totalRows - 1;
						newGridData.total = total+"";
						this._reload(newGridData);
					}
				}
			}
		},
		getChangedData : function (){
			return this.options.changedData;
		},
        /* treecolumn end */
        /* edittable begin */
        _editRow : function ($tr, isNew){
        	var ops = this.options,
        		self = this,
        		editView = ops._editOption;
        	//正在编辑状态以及当前编辑行时退出
        	if(!ops.editable || editView._triggered || editView._editRowId == $tr.data('index'))
        		return;
        	ops._triggered = true;
        	editView._editRowId = $tr.data('index');

        	col.editor.editable=item.attr('editable')=='false'?false:true;
			col.editor.type=item.attr('editType')||'text';

        	$.each(ops.columns, function (idx, column) {
        		var field = column.field,
        			$td = $('td[field='+field+']',$tr);
        		if(column.editor.editable && $td.length){
        			var type = column.editor.type,
        				editType = 'aeTextfield',
        				$field;
        			if('combo' == type){
        				$field = '<input aeType="aeCombo" id="'+ops.id+'_edit_field_'+field+'" aeInit="false"/>';
        				$td.html($field);
        				$field.aeCombo();
        			}else if('date' == type){
        				$field = '<input aeType="aeCalendar" id="'+ops.id+'_edit_field_'+field+'" aeInit="false"/>';
        				$td.html($field);
        				$field.aeCalendar();
        			}else if('popup' == type){
        				$field = '<input aeType="aeTextpopup" id="'+ops.id+'_edit_field_'+field+'" aeInit="false"/>';
        				$td.html($field);
        				$field.aeTextpopup();
        			}else{
        				$field = '<input aeType="aeTextfield" id="'+ops.id+'_edit_field_'+field+'" aeInit="false"/>';
        				$td.html($field);
        				$field.aeTextfield();
        			}
        		}
        	});
        },
        /* edittable end */
        reload:function(data, param, page, successCB, failCB){
        	if (this.loading) {
                return;
            }

            var ops = this.options;

            if(!data){
            	this._resetGridView(false);
            	return;
            }

            if(typeof page !=='undefined'){
                page = parseInt(page) || 1;
                page = page <= 0 ? 1 : page;
                if(ops.totalPages){
                	page = page > ops.totalPages ? ops.totalPages : page;
                }
                ops.pageNumber = page;
            }else{
            	ops.pageNumber = 1;
            }

        	if($.isString(data)){
        		ops.sidePagination = 'server';
        		ops.url = data;
        		ops._params = param ? param : undefined;
        		if(typeof successCB != "undefined"){
        			if($.isFunction(successCB)){
            			ops._successCB = successCB;
            		}else{
            			$.aelog("successCB should be a function","error",true);
            		}
        		}
        		if(typeof failCB != "undefined"){
        			if($.isFunction){
            			ops._failCB = failCB;
            		}else{
            			$.aelog("failCB should be a function","error",true);
            		}
        		}
        		
                //相当于goto(page) and reload()，会转到那一页并重新刷新数据（向后台发送请求）
        		this._initServer();
        	}else if($.isObject(data) || $.isArray(data)){
        		ops.sidePagination = 'client';

        		if(ops.dataField){
        			data = $.aries.common.getDataByDatafield(data,ops.dataField);
        		}
        		this._reload(data);

        		this._trigger("onSuccess", null, data);

				//TODO 重构逻辑 是否需要
				/*for(var i=0 , len=ops._onRefreshCallbacks.length; i<len; i++){
                	ops._onRefreshCallbacks[i].call(this);
                }*/
        		//TODO 这里是否与seccess合并成onload
                //this._trigger("onRefresh",null,pageData.nowPage,data.rows);
            }
        	this.options.changedData = {add:[], edit:[], del:[]};
        },
        /**
         * 选择行。<b>注意：传入的参数是序号（第一行是0第二行是1）数组（比如[0,1]表示选择第一行和第二行）；要想清除所有选择，请使用空数组[]作为参数；只能传入序号数组，如果要做复杂的选择算法，请先在其它地方算好序号数组后后调用此方法；此方法会清除其它选择状态，如选择第1,2行然后setSelections([3])最后结果中只有第3行，如setSelections([3,4]);setSelections([5,6])后只会选择5,6两行</b>。
         * @name aeGrid#setSelections
         * @function
         * @param indexes 序号（第一行是0第二行是1）数组。
         * @returns jQuery对象
         * @example
         * //选择表格中第二行、第三行、第五行
         * $('.selector').aeGrid('setSelections',[1,2,4]);
         *
         */
        setSelections:function(indexes){
            var self=this;
            if(!$.isArray(indexes)){
                indexes=[indexes];
            }
            var selected=this.getSelections();
            $(selected).each(function(){
                self._rowDeSelect(this);
            });
            $(indexes).each(function(){
                self._rowSelect(this);
            });
            self._refreshHeaderCheckBox();
        },
        /**
         * 获取选择的行的行号或行记录。<b>注意：默认返回的是行序号组成的数组（如选择了第2行和第5行则返回[1,4]），如果要返回行记录JSON组成的数组需要传入一个true作为参数</b>。
         * @name aeGrid#getSelections
         * @function
         * @param needRecords 参数为true时返回的不是行序号数组而是行记录数组。参数为空或不是true时返回行序号数组。
         * @returns jQuery对象
         * @example
         * var selectedIndexed = $('.selector').aeGrid('getSelections');
         * var selectedRecords = $('.selector').aeGrid('getSelections',true);
         *
         */
        getSelections:function(needRecords){
        	//TODO
            //needRecords=true时返回Record[],不设或为false时返回index[]
            var $trs = this._getTrs(),
            	selectedTrs = $trs.filter('.tr_checked'),
            	result=[];
            if(needRecords){
            	var rowsData = this.getData();
            	if(rowsData && rowsData.length){
            		selectedTrs.each(function(index , tr){
            			result[result.length] = rowsData[$trs.index($(tr))];
            		});
            	}
            }else{
            	selectedTrs.each(function(index , tr){
            		result[result.length] = $trs.index($(tr));
            	});
            }
            return result;
        },
        getStart:function(){
        	var ops=this.options,
            start = -1;
	        if(ops.pagingSize > 0){
	        	start = (ops.pageNumber - 1) * ops.pagingSize + 1;
	        }
	        return start;
        },
        getEnd:function(){
        	var ops=this.options,
            end = -1;
	        if(ops.pagingSize > 0){
	        	end = ops.pageNumber * ops.pagingSize;
	        }
	        return end;
        },
        /**
         * 根据条件搜索表格中含有的text，返回搜索到的行
         * @param searchTxt 查询条件，必须为String
         * @param filter 过滤条件，必须为Array
         * @returns Array
         *
         */
        searchGrid:function(searchTxt,filter){
        	if(!$.isString(searchTxt)){
        		$.message.alert("","The search condition is incorrect!");
        		return;
        	}
        	filter = (filter && $.isArray(filter)) ? filter : [];
        	filter = $.unique($.merge(filter,$.grep(this.header.fields,function(item){
        		if(item === 'checkboxCol' || item === 'indexCol' || item === ''){
        			return false;
        		}
        		return true;
        	})));
        	var data = $.filterStringInArray(searchTxt,this.getData(),filter);
        	if(data){
        		this.reload(data);
        	}
        },
        /* buildOptions begin */
        _buildOptions:function(ops,el){
        	ops.id=el.attr("id")!==undefined?el.attr("id"):"";
        	ops.aeType=el.attr("aeType")||"aeGrid";
        	ops.title=$.evalI18nString(el.attr("title"));
        	ops.width=el.attr("width")||ops.width;
        	ops.height=el.attr("height")||ops.height;
        	ops.singleSelect=el.attr("singleSelect")=="true"?true:false;
        	ops.dataSource=el.attr("dataSource")||ops.dataSource;
        	ops.showIndex=el.attr("showIndex")=="true"?true:false;
        	ops.autoFit=el.attr("autoFit")=="false"?false:true;
        	ops.emptyMsg=$.evalI18nString(el.attr("emptyMsg"))||ops.emptyMsg;
        	ops.errorMsg=$.evalI18nString(el.attr("errorMsg"))||ops.errorMsg;
        	ops.loadingMsg=$.evalI18nString(el.attr("loadingMsg"))||ops.loadingMsg;
        	ops.pagingType=el.attr("pagingType")||ops.pagingType;
        	ops.pagingAlign=el.attr("pagingAlign")||ops.pagingAlign;
        	ops.striped=el.attr("singleRowClass")=="false"?true:false;
        	ops.dataField=el.attr("dataField")||ops.dataField;
        	if(el.attr("pagingSize")&&""!==el.attr("pagingSize")){
        		ops.pagingSize=parseInt(el.attr("pagingSize"));
        	}
        	ops.showMsg=el.attr("showMsg")=="false"?false:true;

        	ops.datafield=el.attr("datafield")||ops.datafield;
        	ops.isPaging=el.attr("isPaging")=="true"?true:false;
        	ops.preProcess=el.attr("preProcess")||ops.preProcess;
        	ops.treeColumn=el.attr("treeColumn")||"";
        	ops.treeIdField = el.attr("treeIdField")||"";
        	ops.treePidField = el.attr("treePidField")||"";
        	ops.treeSortField = el.attr("treeSortField")||"";

        	ops.editable=el.attr("editable")=="true"?true:false;
            ops.doSelectEvent=el.attr("doSelectEvent")=="true"?true:ops.doSelectEvent;

        	ops.onRowClick=el.attr("onRowClick")||ops.onRowClick;
        	ops.onRowSelect=el.attr("onRowSelect")||ops.onRowSelect;
        	ops.onRowDeselect=el.attr("onRowDeselect")||ops.onRowDeselect;
        	ops.onRowDblClick=el.attr("onRowDblClick")||ops.onRowDblClick;
        	ops.onPageChange=el.attr("onPageChange")||ops.onPageChange;
        	if(el.attr("onSuccess")){
        		ops.onSuccess=el.attr("onSuccess")||ops.onSuccess;
        	}else{
        		ops.onSuccess=el.attr("onReload")||ops.onSuccess;
        	}
        	ops.onError=el.attr("onError")||ops.onError;

        	ops.showFooter=el.attr("showFooter")=="true"?true:false;
        	ops.theme=el.attr("theme")||"";
        	ops.showBorder=el.attr("showBorder")=="true"?true:false;
        	ops.startField=el.attr("startField") || ops.startField;
        	ops.endField=el.attr("endField") || ops.endField;
        	ops.titleRenderer=el.attr("titleRenderer") || undefined;

        	this._buildOptionsEvents(ops);

        	var cols=el.children("[datafield]");
        	if(typeof(cols)!="undefined"&&cols.length){
        		ops.columns=[];
        		cols.each(function(idx,item){
        			var col={},
						$item=$(item);
        			col.field=$item.attr("datafield")||"";
        			if(col.field !== ""){
        				col.field = col.field.replace(new RegExp(/\./g),'|');
        			}
        			col.title=$.evalI18nString($item.attr("title"))||"";
        			col.width=$item.attr("width")||"";
        			col.headAlign=$item.attr("headAlign")||"center";
        			col.align=$item.attr("align")||"left";
        			col.visible=$item.attr("visible")=="false"?false:true;
        			col.wrap=$item.attr("wrap")=="true"?true:false;
        			col.showTitle=$item.attr("showTitle")=="true"?true:false;
        			col.renderer=$item.attr("renderer")||undefined;
        			var render = col.renderer;
        			if($.isString(render)){
        				col.renderer=render ? function(colValue, rowData, rowIndex){
                    		var i = render.indexOf("(");
            				var actName = i>0 ? render.substring(0, i) : render;
            				var func = "return window."+actName+"?"+actName+".call(window,c,rd,ri):false;";
            				return new Function("c","rd","ri",func)(colValue, rowData, rowIndex);
                    	}: undefined;
                	}

        			col.sortable=$item.attr("sortable")=="true"||false;
        			col.order=$item.attr("order")||'asc';// asc, desc

        			//如果表格可编辑，则列默认可编辑
        			col.editor={};
        			col.editor.editable=$item.attr("editable")=="false"?false:true;
        			col.editor.type=$item.attr("editType")||"text";
        			col.editor.options={};
        			if(col.editor.type=="select"){
        				col.editor.options.emptytext=$item.attr("emptyText")||"";
        				col.editor.options.dataSource=$item.attr("dataSource")||"";
        			}else if(col.editor.type=="date"){
        				col.editor.options.dataField=$item.attr("dataField")||"";
        				col.editor.options.dateFormat=$item.attr("dateFormat")||"";
        				col.editor.options.showTime=$item.attr("showTime");
        			}else if(col.editor.type=="popup"){
        				col.editor.options.popupType=$item.attr("popupType");
        				col.editor.options.popupSource=$item.attr("popupSource");
        				col.editor.options.popupTitle=$item.attr("popupTitle");
        				col.editor.options.popupWidth=$item.attr("popupWidth");
        				col.editor.options.popupHeight=$item.attr("popupHeight");
        			}

        			ops.columns.push(col);
        		});
        	}
        },
        _buildOptionsEvents:function(ops){
        	this._buildCommonEvent(ops,'onRowClick',ops.onRowClick);
        	this._buildCommonEvent(ops,'onRowSelect',ops.onRowSelect);
        	this._buildCommonEvent(ops,'onRowDeselect',ops.onRowDeselect);
        	this._buildCommonEvent(ops,'onRowDblClick',ops.onRowDblClick);
        	this._buildCommonEvent(ops,'onPageChange',ops.onPageChange);
        	this._buildCommonEvent(ops,'onRefresh',ops.onRefresh);

        	var onSuccess=ops.onSuccess;
        	if($.isString(onSuccess)){
        		ops.onSuccess=onSuccess ? function(data,status,xhr){
        			var i = onSuccess.indexOf("(");
					var actName = i>0 ? onSuccess.substring(0, i) : onSuccess;
					var func = "return window."+actName+"?"+actName+".call(window,d,t,x):false;";
					return new Function("d","t","x",func)(data,status,xhr);
            	}: function(data,status,xhr){};
        	}

        	var onError=ops.onError;
        	if($.isString(onError)){
        		ops.onError=onError ? function(code, data){
        			var i = onError.indexOf("(");
					var actName = i>0 ? onError.substring(0, i) : onError;
					var func = "return window."+actName+"?"+actName+".call(window,c,d):false;";
					return new Function("c","d",func)(code, data);
            	}: function(code, data){};
        	}

        	var preProcess=ops.preProcess;
        	if($.isString(preProcess)){
        		ops.preProcess=preProcess ? function(data){
        			var i = preProcess.indexOf("(");
					var actName = i>0 ? preProcess.substring(0, i) : preProcess;
					var func = "return window."+actName+"?"+actName+".call(window,d):false;";
					return new Function("d",func)(data);
            	}: false;
        	}

        	var titleRenderer=ops.titleRenderer;
        	if($.isString(titleRenderer)){
        		ops.titleRenderer=titleRenderer ? function(data){
        			var i = titleRenderer.indexOf("(");
					var actName = i>0 ? titleRenderer.substring(0, i) : titleRenderer;
					var func = "return window."+actName+"?"+actName+".call(window):false;";
					return new Function(func)();
            	}: false;
        	}
        },
        _buildCommonEvent:function(ops,evtName,evtValue){
        	if($.isString(evtValue)){
        		ops[evtName]=evtValue ? function(param1,param2,event){
            		var i = evtValue.indexOf("(");
    				var actName = i>0 ? evtValue.substring(0, i) : evtValue;
    				var func = "return window."+actName+"?"+actName+".call(window,p1,p2,e):false;";
    				return new Function("p1","p2","e",func)(param1,param2,event);
            	}: function(rowIndex,rowData,event){};
        	}
        },
        /* buildOptions end */
        /**
         * 获取表格JSON数据。<br/>
         *
         * @name aeGrid#getData
         * @function
         * @returns 如果没有设置preProcess则返回由后台返回来的对象。如果有preProcess则返回处理后的对象
         * @example
         * //获取grid的当前页数据
         * var store = $('.selector').aeGrid('getData');
         *
         *
         */
        getData:function(){
        	if(typeof this.data == 'undefined'){
        		return [];
        	}
            return this.data;
        }

    });

    var cellHeight = 37; // update css if changed
    var cachedWidth = null;

    // it only does '%s', and return '' when arguments are undefined
    var sprintf = function (str) {
        var args = arguments,
            flag = true,
            i = 1;

        str = str.replace(/%s/g, function () {
            var arg = args[i++];

            if (typeof arg === 'undefined') {
                flag = false;
                return '';
            }
            return arg;
        });
        return flag ? str : '';
    };

    var getPropertyFromOther = function (list, from, to, value) {
        var result = '';
        $.each(list, function (i, item) {
            if (item[from] === value) {
                result = item[to];
                return false;
            }
            return true;
        });
        return result;
    };

    var getFieldIndex = function (columns, field) {
        var index = -1;

        $.each(columns, function (i, column) {
            if (column.field === field) {
                index = i;
                return false;
            }
            return true;
        });
        return index;
    };
    var getScrollBarWidth = function () {
        if (cachedWidth === null) {
            var inner = $('<p/>').addClass('fixed-table-scroll-inner'),
                outer = $('<div/>').addClass('fixed-table-scroll-outer'),
                w1, w2;

            outer.append(inner);
            $('body').append(outer);

            w1 = inner[0].offsetWidth;
            outer.css('overflow', 'scroll');
            w2 = inner[0].offsetWidth;

            if (w1 === w2) {
                w2 = outer[0].clientWidth;
            }

            outer.remove();
            cachedWidth = w1 - w2;
        }
        return cachedWidth;
    };

    var calculateObjectValue = function (self, name, args, defaultValue) {
        if (typeof name === 'string') {
            // support obj.func1.func2
            var names = name.split('.');

            if (names.length > 1) {
                name = window;
                $.each(names, function (i, f) {
                    name = name[f];
                });
            } else {
                name = window[name];
            }
        }
        if (typeof name === 'object') {
            return name;
        }
        if (typeof name === 'function') {
            return name.apply(self, args);
        }
        return defaultValue;
    };

    var escapeHTML = function (text) {
        if (typeof text === 'string') {
            return text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
        return text;
    };

//})(jQuery,window);
});

define('ui-pageflow',function(require, exports, modules) {
	"require:nomunge,exports:nomunge,modules:nomunge";
//(function($){
	if(typeof($.bizpageflow)=="undefined"){
		$.bizpageflow=function(id,steps,domId){
			return new $.bizpageflow.fn.construct(id,steps,domId);
		};
		$.bizpageflow.fn={
			construct : function(id,steps,domId){
				this.id=id;
				this.steps=steps;
				this.active=0;//start is 0,last is -1
				this.activeFrames=[];//保存所有被打开的iframe
				this.curStep="";
				this.size=steps.length;
				this.gostep=$.DataMap("{}");//页面可见的所有被打开的iframe
				this.drawGuide=false;
				this.isFilish=false;
				this.currentEvent=null;
				this.isBack=false;
				this.currentData=null;
				this.submitListener=null;
				this.submitParams = "";
				this.currentEvtType=null;
				this.globalVars= new $.DataMap();
				this.bindedButtons = {};
				this.defaultShow = "";
				this.beginStep = "";
				$.extend(this,steps);
			},
			//内部方法，处理流程初始化
			_initFlow : function(){
				var data=this.getStep("begin");
				if(data==null||typeof(data)=="undefined")
					return;
				if(this.beginStep){
					this.active=this.beginStep;
					this.curStep=this.beginStep;
					this.next(this.beginStep);
				}else{
					this.active=data["name"];
					this.curStep=data["name"];
					this.next(data["nextstep"]);
				}
				window.getFlow().initBindEvent();
			},
			/*初始化流程*/
			initFlow : function() {
				var _steps = this.steps,
					self = this;
				if(!_steps || !_steps.length)
					return;
				var _childSteps = _steps, _events;
				for (var j = 0; j < _childSteps.length;j++){
					_childStep = _childSteps[j];
					if(_childStep.tagname == "event"){
						_events = _childStep.events;
						break;
					}
				}
				if(_events && _events.length){
					$.each(_events,function(idx,val){
						if(val.type == "next"){
							window.getFlow().bindNextEvent(val.page, val.name, val.source, val.trigger, val.btnName, val.verifyFn);
						}
						if(val.type == "submit"){
							//TODO 暂不考虑子流程中有submit操作
						}
					});
				}
				var step,childSteps=[];
				for (var i = 0;i < _steps.length;i++){
					step = _steps[i];
					if(step.tagname == "child"){
						childSteps.push(step);
					}
				}
				if(childSteps.length){
					var finishedNum = childSteps.length, currentNum = 1,
						backStep, nextStepName;
					for (var i = 0;i < childSteps.length;i++){
						step = childSteps[i];
						backStep = this.getStepsByNext(step.name);
						nextStepName = step.nextstep;
						$.aries.ajax.post(step.page,"",function(data){
							if(data && data.steps){
								var _childSteps = data.steps, _childStep,_childStart,
									_useSteps = [], _events;
								for (var j = 0; j < _childSteps.length;j++){
									_childStep = _childSteps[j];
									if(_childStep.name == "begin"){
										_childStart = _childStep;
									}else if(_childStep.tagname == "step"){
										_useSteps.push(_childStep);
									}else if(_childStep.tagname == "event"){
										_events = _childStep.events;
									}
								}//处理子流程的开始节点
								if(_childStart){
									$.each(_useSteps,function(idx,val){
										if(val.name == _childStart.nextstep){
											$.each(backStep,function(idx1,val1){
												backStep[idx1].nextstep = val.name;
											});
											return false;
										}
									});
								}//处理子流程的结束节点
								$.each(_useSteps,function(idx,val){
									if(val.nextstep == "end"){
										_useSteps[idx].nextstep = nextStepName;
										return false;
									}
								});//处理子流程的页面节点
								if(_useSteps && _useSteps.length){
									$.each(_useSteps,function(idx,val){
										self.steps.push(val);
									});
								}
								if(_events && _events.length){
									$.each(_events,function(idx,val){
										if(val.type == "next"){
											window.getFlow().bindNextEvent(val.page, val.name, val.source, val.trigger, val.btnName, val.verifyFn);
										}
										if(val.type == "submit"){
											//TODO 暂不考虑子流程中有submit操作
										}
									});
								}
							}
							if(finishedNum == currentNum){
								window.getFlow()._initFlow();
							}else{
								currentNum += 1;
							}
						},function(code,info){
							if(finishedNum == currentNum){
								window.getFlow()._initFlow();
							}else{
								currentNum += 1;
							}
							$.aelog("Pageflow load " + step.page + " is error! Info : "+info);
						});
					}
				}else{
					window.getFlow()._initFlow();
				}
			},
			reInitFlow : function() {
				this.active=0;//start is 0,last is -1
				this.curStep="";
				this.isFilish=false;
				this.currentEvent=null;
				this.isBack=false;
				this.currentData=null;
				this.submitListener=null;
				this.submitParams = "";
				this.currentEvtType=null;
				this.globalVars= new $.DataMap();
				
				var data=this.getStep("begin");
				if(data==null||typeof(data)=="undefined")
					return;

				this.active=data["name"];
				this.curStep=data["name"];
				this.next(data["nextstep"]);
			},
			includePage : function(noi){
				var data=this.getStep(noi),self=this;
				if(data==null||typeof(data)=="undefined")
					return;
				$("#"+this.id).html(this.defaultShow);
				var url = data.page;
				var flow = window.getFlow(),
					dynamicId = flow.getGlobalVarsByName("dynamicId");
				if(data.dynamic == "true" && data.dynamicPath && dynamicId){
					url = data.dynamicPath + dynamicId + ".html";
									
				}
				$.aries.common.includeHtml(this.id,url,function(e){
					self.pageInitEvent(noi);
					if($.isFunction(window['initFunction'])){
						eval('window.initFunction();');
						window['initFunction'] = undefined;
					}
				});
			},
			pageInitEvent : function(noi) {
				if($("body").length && $("body").children(":first").length){
					$("body").children(":first").scrollTop(0);
				}
				var data=this.getStep(noi);
				var bindedBtns = this.bindedButtons[noi];
				if(bindedBtns && bindedBtns.length){
					var bindedBtn,evtType,evt,evtName='',evtArgs='',endLen;
					for(var i = 0;i < bindedBtns.length;i++){
						bindedBtn =  bindedBtns[i];
						var btn = $("[name="+bindedBtn.name+"]");
						if(btn.length){
							evtType = bindedBtn.evtType;
							if(evtType!=null&&typeof(evtType)!="undefined"&&evtType!=""){
								evt=btn[0].getAttribute(evtType);
								if(evt&&evt!=''){
									var len=evt.indexOf('(');
									if(len>-1){
										evtName=evt.substring(0,len);
										endLen=evt.indexOf(')');
										evtArgs=endLen>-1?evt.substring(len+1,endLen):evt.substring(len+1,evt.length);
									}else{
										evtName=evt;
									}
								}
								var bindType=evtType.indexOf('on')==0?evtType.substring(2,evtType.length):evtType;
								btn.data("idx",i);
								btn.data("evtName",evtName);
								btn.data("evtArgs",evtArgs);
								var btnSpan = btn.find("span");
								if(btnSpan.length){
									btnSpan.data("idx",i);
									btnSpan.data("evtName",evtName);
									btnSpan.data("evtArgs",evtArgs);
								}
								btn.unbind(bindType);
								btn.bind(bindType,function(e){
									var curBtn = bindedBtns[$(e.target).data("idx")];
									var eName = $(e.target).data("evtName");
									var eArgs = $(e.target).data("evtArgs");
									if(eName!=''){
										//TODO
										if($.isFunction(window[eName])){
											if(eArgs!=''){
												eval('window.'+eName+'('+eArgs+');');
											}else{
												eval('window.'+eName+'();');
											}
										}
									}
									if(window.getFlow().verifyNextEvent(curBtn.verifyEvent)){
										if(curBtn.type == "s"){
											window.getFlow().setCurrentEvent(curBtn.submitEvt);
											window.getFlow().setSubmitListener(curBtn.submitSV);
											window.getFlow().setCurrentEvtType("submit");
											$("#bnext").trigger("click");
										}else{
											window.getFlow().setCurrentEvent(curBtn.nextEvt);
											window.getFlow().setSubmitListener("");
											window.getFlow().setCurrentEvtType("next");
											$("#bnext").trigger("click");
										}
									}
								});
								btn[0].setAttribute(evtType,"");
							}
						}
					}
				}
			},
			setDefaultShow : function (html){
				if(html){
					this.defaultShow = html;
				}else{
					this.defaultShow = "";
				}
			},
			getName : function(){
				return this.id;
			},
			/*执行表达式*/
			execExpress : function(noi,express,defval){
				var execval=null;
				if(express=='$EVENT'){
					execval=this.getCurrentEvent();
				}else{
					execval=f("#"+express).val();
				}
				if(execval==null||typeof(execval)=="undefined") return defval;
				return execval;
			},
			/*获取需要往下传递的数据*/
			getTransData : function(noi,next){
				var data=this.getStep(noi);
				if(data==null||typeof(data)=="undefined")
					return null;
				if(data["name"]=="begin"||data["name"]=="end"||data["tagname"]!="step")
					return null;
				var ids=data["transdata"];
				var flow = window.getFlow();
				var buf=[];
				if(ids&&typeof(ids)!="undefined"&&ids!=""){
					$.each(ids.split(","),function(idx,val){
						if(val.indexOf(":")>0){
							var valArray = val.split(":");
							val = valArray[0];
							var globalkey = valArray[1];
							if(globalkey&&globalkey!=""){
								if(val==null||typeof(val)=="undefined"){
									val="";
								}
								flow.setGlobalVarsByName($.trim(globalkey),$.aries.page.data.getData($.trim(val)));
							}
						}
					});
				}
				//TODO 没对init数据做处理
				return null;
			},
			/* 第一个页面*/
			firstStep : function (){
				var beginStep;
				$.each(this.steps,function(idx,val){
					if(val["tagname"]=="step"){
						if(val["name"]==="begin"){
							beginStep=val["nextstep"];
						}
					}
				});
				return beginStep;
			},
			/* 最后一个页面,可能有多个，|分隔*/
			lastStep : function (){
				var endStep;
				$.each(this.steps,function(idx,val){
					if(val["tagname"]=="step"){
						if(val["nextstep"]==="end"){
							endStep+=val["name"]+"|";
						}
					}
				});
				return endStep;
			},
			/*点击导航栏查看对应页面,并监控数据变更*/
			backView : function(noi) {
				if(noi==null||typeof(noi)=="undefined") return ;
				var changekey=this.getChange();
				if(changekey==noi) return ;
				if(changekey){
					$("#guide_"+changekey).attr("monitor","{"+this.getStepMonitor(changekey)+"}");
					if (window.confirm($.lang["view.web.comp.pageflow.confirm"])){
						this.reset(changekey);
						this.setShowPage(changekey);
						$("#bnext").triggerHandler("click");
						return ;
					}
					//return;
				}
				this.setShowPage(noi);
				this.resetByGuide(noi,false);	
				this.setAutoHeight();		
				this.curStep=noi;
			},
			/*回退到指定页面页（与多次调用上一步略有不同，不控制页面显示）*/
			reset : function(changekey,updateGuide){
				if(!changekey) return ;
				var lastFlowName = this.activeFrames.slice(this.activeFrames.length-1)[0];
				if(changekey!=lastFlowName){
					var noi=$("#bback").attr('back');
					this.resetStatus(changekey,updateGuide);
					var keyIndex = this.gostep.indexOfKey(changekey);
					//this.lastActiveFrame = changekey;
					//this.activeFrames.push();
					var stepsCount = this.gostep.getCount();
					for(var i = stepsCount-1;i>keyIndex;i--){
						$("#guide_"+this.gostep.itemAt(i)["name"]).remove();
						this.gostep.removeAt(i);
					}
				}
			},
			resetByGuide:function(changekey,updateGuide){
				if(!changekey) return ;
				if(changekey!=this.active){
					this.resetStatus(changekey,updateGuide);
				}
			},
			resetStatus:function(noi,updateGuide){
				var data=this.getStep(noi);
				if(data==null||typeof(data)=="undefined")return;
				if(data["name"]==="begin"||data["name"]==="end")return;				
				//清空nexttrigger状态
				data["nexttrigger"] = "";
				//this.setGuide(noi,updateGuide);
				//this.setFlow(noi);
				if(updateGuide!=false){
					var lastFrame;
					var noiPos = $.inArray(noi,this.activeFrames);
					var framesLength;
					if(noiPos>=0){
						framesLength = this.activeFrames.length-noiPos-1;
					}else{
						framesLength = this.activeFrames.length;
					}
					for(var i=0;i<framesLength;i++){
						lastFrame = this.activeFrames.pop();
						//if(lastFrame!=noi){
						$("#"+lastFrame).attr("src","about:blank");
						//}
					}
					this.setButton(noi);
					//$("#"+this.active).attr("src","about:blank");
					this.active=noi;
					this.curStep=noi;
				}
			},			
			/*返回数据变更页name*/
			getChange : function (){
				var changekey=null;
				this.gostep.eachKey(function(key,idx){
					if(window.getFlow().isMonChanged(key)){
						changekey=key;
						return true;
					}
				});
				return changekey;
			},
			/*显示指定页面  */
			setShowPage : function (noi){
				var beginStep=this.firstStep();
				var endStep=this.lastStep();
				var active=this.active;
				var autoheight=this.autoSize();
				//this.setFlow(noi);
				//this.curStep=noi;
				
				$.each(this.steps,function(){
					if(this["tagname"]=="step"){
						if(this["name"]==noi){
							if(beginStep&&beginStep==noi){
								$("#guide_"+noi).attr("class","first on");
							}else if(endStep&&endStep.indexOf(noi+"|")>-1){
								$("#guide_"+noi).attr("class","last on");
							}else{
								$("#guide_"+noi).attr("class","on");
							}
							$("#"+this["name"]).attr("height",autoheight);
							$("#"+this["name"]).css("display","block");
						} else {
							if(this["name"]==active){
								if(endStep&&endStep.indexOf(active+"|")>-1){
									$("#guide_"+active).attr("class","last active");
								}else{
									$("#guide_"+active).attr("class","active");
								}
							}else{
								if(beginStep&&beginStep==this["name"]){
									$("#guide_"+this["name"]).attr("class","first ok");
								}else{
									$("#guide_"+this["name"]).attr("class","ok");
								}
							}
							$("#"+this["name"]).css("display","none");
							$("#"+this["name"]).attr("height","0");
						}
					}
				});
			},
			/*设置结点对应的Frame信息*/
			setFrame : function(noi,params){
				var data=this.getStep(noi);
				if(data==null||typeof(data)=="undefined") 
					return ;
				var trans=this.getTransData(this.active,noi);
				var initsv = data["initsv"];
				var onsuccess = data['onsuccess'];
				//TODO if(this.getStep("begin")["nextstep"]==noi){
				this.includePage(noi);
				return;
				var userDefinedWade_isStopResizeHeight = window['Wade_isStopResizeHeight'];
				window['Wade_isStopResizeHeight']=true;
				var data=this.getStep(noi);
				if(data==null||typeof(data)=="undefined") return ;
				//alert("active:"+this.active+"|current:"+noi);
				var trans=this.getTransData(this.active,noi);
				var initsv = data["initsv"];
				var onsuccess = data['onsuccess'];
				var autoheight=this.autoSize();
				var isMonChanged=this.isMonChanged(this.active);
				var aFrames = this.activeFrames;
				
				if(this.getStep("begin")["nextstep"]==noi){
					var searchParams = window.location.search;
					if(searchParams){
						if(searchParams.indexOf("?service=")==0){
							var searchIndex = searchParams.indexOf("&");
							if(searchIndex>-1){
								searchParams = searchParams.substring(searchIndex+1);
							}
						}
						
						if(params){
							if(searchParams.indexOf("&")==0){
								params += searchParams;
							}else if(searchParams.indexOf("?")==0&&searchParams.length>1){
								params += "&"+searchParams.substring(1);
							}else{
								params += "&"+searchParams;
							}
						}else{
							params = searchParams;
						}
					}
				}
				$.each(this.steps,function(active){
					if(this["name"]==active){
						if($("#"+this["name"]).attr("src")=="about:blank" || isMonChanged == true){
							//alert("frame url:page="+this["page"]+",listener="+this["listener"]+",params="+trans);
							var framename = this["name"];
							$("#"+framename).bind("load", function(e){
								window['Wade_isStopResizeHeight']=userDefinedWade_isStopResizeHeight;
							});
							
							if($.inArray(framename,aFrames)==-1){
								aFrames.push(framename);
							}
							/*if(trans){
								$("#"+framename).attr("src",this["page"]+"&"+trans+params);
							}else{
								$("#"+framename).attr("src",this["page"]+params);
							}*/
							var url = this["page"];
							var ajaxJsonPrefix = $.aries.config.common.PAGE_REDIRECT_PREFIX;
							if(ajaxJsonPrefix){
								if (ajaxJsonPrefix.substring(ajaxJsonPrefix.length-1,ajaxJsonPrefix.length) == '/') {
									if(url.indexOf("/") == 0){
										url = url.substring(1,url.length);
									}
								}else{
									if (url.indexOf("/") == -1) {
										url = '/' + url;
									}
								}
								url=ajaxJsonPrefix+url;
							}
							$("#"+framename).attr("src",url+params);
							var trans_param=trans;
							$("#"+framename).bind("load",function(){
								//$("#bnext").removeAttr("disabled");
								$.aries.common.disabledButton("bnext",false);
								window.getFlow().setAutoHeight();
								var frameWin = $("#"+framename)[0].contentWindow;
								if(frameWin && frameWin.$){
									window.getFlow().setButton(active,true);
								}
								
								$(frameWin).bind("resize",function(){
									window.getFlow().setAutoHeight();
								});
								
								if(initsv && $.isString(initsv)){
									var svCode = new Function('s','return window.'+initsv+'?window.'+initsv+':"";')();
									if(svCode){
										//var trans = window.getFlow().getTransData(window.getFlow().active,noi);
										//var trans = '';
										var param = 'param='+trans_param+'';
										$.aries.ajax.post(svCode,param,function(data){
											if(data && onsuccess && $.isString(onsuccess)){
												var i = onsuccess.indexOf("(");
												var actName = i>0 ? onsuccess.substring(0, i) : onsuccess;
												var win = $('#'+framename)[0].contentWindow;
												if($.isFunction(win[actName])){
													//new Function("d","win["+actName+"(d)];")(data);
													win[actName](data);
												}
//												var func = "var win = $('#'+"+framename+")[0].contentWindow;if(win["+actName+"]){"+actName+".call(win,d);};";
//												return new Function("d",func)(data);
											}
										},function(errorCode,info){
											alert("error:"+errorCode);
										});
									}
								}
							});
							trans=null;
						}else{
							window['Wade_isStopResizeHeight']=userDefinedWade_isStopResizeHeight;
							var framename = this["name"];
							var frameWin = $("#"+framename)[0].contentWindow;
							if(frameWin && frameWin.$){
								window.getFlow().setButton(active,true);
							}
						}
						
						$("#"+this["name"]).attr("height",autoheight);
						$("#"+this["name"]).css("display","");
					} else {
						$("#"+this["name"]).attr("height","0");
						$("#"+this["name"]).css("display","none");
					}
				},[data["name"]]);
			},
			/*设置流程图信息及状态*/
			setFlow : function(noi){
				/*var data=this.getStep(noi);
				if(data==null||typeof(data)=="undefined") return ;
				var flow=$("#flow");
				if(flow.length>0){
					var steps=this.gostep;
					$.each($("a[id^=flow_]",flow[0]), function(idx,el){
						var dom=$(el);
						var name=dom.attr("name").substring(5);
						if (steps.get(name)) {
							if(name==data["name"])
								dom.attr("class", "step on");
							else
								dom.attr("class", "step ok");
						} else {
							if(dom.attr("class")!="judge" && dom.attr("class")!="start" && dom.attr("class")!="end"){
								dom.attr("class", "step");
							}
						}
					});
				}*/
			},
			/*设置按钮区事件及状态*/
			setButton : function(noi,isDisabled){
				
				var data=this.getStep(noi);
				if(data==null||typeof(data)=="undefined") return ;
				
				//alert("set next button click : " + data["nextstep"]);
				if(isDisabled){
					$("#bnext").attr("disabled","disabled");
				}
				if(data["nextstep"]=="end"){
					$("#bnext").attr('class','finish');
					$("#bnext").attr('active',noi);
					$("#bnext").attr('uuid',noi);
					$("#bnext").html("Finish");
					$("#bnext").attr('next',data["nextstep"]);
					$("#bnext").unbind("click");
					//$("#bnext").attr("onclick","function(){window.getFlow().submit();}");
					$("#bnext").bind("click",function(){window.getFlow().submit();});
					this.isFilish=true;
				} else {
					$("#bnext").attr('class','');
					$("#bnext").attr('active',noi);
					$("#bnext").attr('uuid',"step");
					$("#bnext").attr('next',data["nextstep"]);
//					$("#bnext").html($.lang.get("pageflow.button.bnext"));
					$("#bnext").unbind("click");
					$("#bnext").bind("click",function(){
						
						window.getFlow().next(data["nextstep"]);
					});
					this.isFilish=false;
				}
				
				if(isDisabled){
					$.aries.common.disabledButton("bnext",true);
				}else{
					$.aries.common.disabledButton("bnext",false);
				}
				
				var firstStepName = this.getStep("begin")["nextstep"];
				if(firstStepName!=noi){
					$("#bback").css('visibility',"visible");
					var back=null;
					this.gostep.eachKey(function(key,idx){
						if(key==data["name"])return;
						back=key;
					});
					$("#bback").attr('active',noi);
					$("#bback").attr('back',back);
					$("#bback").unbind("click");
					$("#bback").bind("click",function(){window.getFlow().back(back);});
				}else{
					$("#bback").css('visibility',"hidden");
					$("#bback").unbind("click");
				}
			},
			/*如果是Switch结点，则计算值并继续下一结点*/
			toSwitch : function(noi,ignoreMonitor,notTriggerNextButton){
				var data=this.getStep(noi);
				if(data==null||typeof(data)=="undefined")return;
				var pdata=this.getActive();
				//alert("back step :"+pdata["name"]+",active step"+this.active);
				var execval=this.execExpress(pdata["name"],data["expression"],data["default"]);
				//alert("express="+data["expression"]+",defval="+data["default"]+",execval="+execval);
				pdata=null;
				var caseval=null;
				$.each(data["cases"],function(val){
					if(this["value"] == val){
						caseval=val;
						return true;
					}
				},[execval]);
				
				var next=null;
				try{
					if(caseval==null){
						next=data["cases"][data["default"]]["nextstep"];
					} else {
						next=data["cases"][caseval]["nextstep"];
					}
				}catch(e){
					alert("bad switch config,at "+noi);
					return -1;
				}
				if(next==null||typeof(next)=="undefined"){
					alert("bad switch config,at "+noi);
					return -1;
				}
				//alert("switch " + noi + " next step is " + next);
				this.next(next,ignoreMonitor,notTriggerNextButton);
			},
			/*获取当前活动节点*/
			getActive : function(){
				var data=this.getStep(this.active);
				if(data==null||typeof(data)=="undefined"){
					alert("the flow has stopped");
					return null;
				}
				return data;
			},
			/*获取指定节点的数据，如果找不到则返回null*/
			getStep : function(noi){
				if(noi && typeof(noi)=="string"){
					var step=null;
					$.each(this.steps,function(_value){
						if(this["name"]==_value){
							step=this;
							return true;
						}
					},[noi]);
					return step;
				} else {
					return this.steps[noi];
				}
			},
			getStepsByNext : function(name){
				var steps = [];
				$.each(this.steps,function(idx,val){
					if(val["nextstep"] == name){
						steps.push(val);
					}
				});
				return steps;
			},
			/*自适应高度*/
			autoSize : function(){
				//body.offsetHeight - step.offsetHeight - flow.offsetHeight - submit.offsetHeight + "px"
				//return document.body.offsetHeight - $("div[class=c_guideStep]")[0].offsetHeight - $("div[class=c_flow]")[0].offsetHeight - $("div[class=c_guideSubmit]")[0].offsetHeight-3;
				return document.body.offsetHeight - $("#guideBtns")[0].offsetHeight -3;
			},
			/*设置自适应高度*/
			setAutoHeight : function(){
				var h=this.autoSize();
				$.each(this.steps,function(idx,val){
					var name=val["name"];
					if(name!="begin"||name!="end"){
						var el=$("#"+name);
						if(el.length>0&&el.attr("src")&&el.attr("src")!=""&&el.attr("height")&&el.attr("height")!="0"){
							el.css("height",h);
						}
					}
				});
			},
			/*获取上一步配置数据*/
			getBackStep : function(){
				return this.getStep($("#bback").attr('back'));
			},
			/*流程回收，当触发”完成“或”取消“事件时需调用该方法*/
			clear : function(){
				this.id=null;
				this.steps=null;
				this.active=0;//start is 0,last is -1
				this.activeFrames=[];//保存所有被打开的iframe
				this.curStep="";
				this.size=-1;
				this.gostep=null;//页面可见的所有被打开的iframe
				this.drawGuide=false;
				this.isFilish=false;
				this.currentEvent=null;
				this.isBack=false;
				this.currentData=null;
				this.submitListener=null;
				this.submitParams = "";
				this.currentEvtType=null;
				this.globalVars= null;
				this.bindedButtons = null;
				this.defaultShow = "";
			},
			/*下一步绑定的事件*/
			next : function(noi,ignoreMonitor,notTriggerNextButton){
				if(!noi){
					noi = $("#bnext").attr('next');
				}
				if(window.getFlow().getCurrentEvtType()=="submit"){
					window.getFlow().submit();
					return;
				}
				//触发节点["bnext"]绑定的事件
				var active = this.getActive();
				var params = "";
				if(notTriggerNextButton!=true){				
					/*var f=this.getStepFrame(this.active);
					if(f!=null&&active["nextbutton"]&&active["nextbutton"]!=""){
						var bnext=f("#"+active["nextbutton"]);
						if(bnext.length>0){
							if (active["nexttrigger"] != "true"){
								
								if(this.stepChange(ignoreMonitor) === false){
									return ;
								}
								
								var value=bnext.triggerHandler("click");
								
								var doNext = bnext.attr("donext");
								if(value==false||(doNext&&doNext=="false")){
									return;
								} else {
									active["nexttrigger"]="true";
								}
							}
							//获得“下一步”按钮传递参数
							var nextparams = bnext.attr("nextparams");
							if(nextparams){
								params = "&"+nextparams ;
							}nextparams=null;
						}
					}f==null;*/
				}
				
				/*if(this.stepChange(ignoreMonitor) === false){
					return ;
				}*/
				this.setShowPage(this.active);
				//alert("next step name : " + noi);
				var data=this.getStep(noi);
				if(data==null||typeof(data)=="undefined")return;
	//			if (active["nexttrigger"] != "true"){ 为获得传递参数移至触发click前
				
		//		}
				//如果当前监听参数已修改
				//if (this.active != "begin" && this.active != "end" && data["tagname"]!="switch" && this.isMonChanged(this.active)==true){
					/*if (!window.confirm("数据已修改，确定要重新设置后继操作吗？")){
						return;
					}*/
					//return true;
				//}
				
				/*if(data["subflow"] == "page"){
					if(data["hasOpen"] != true){
						if(window["openNav"]){
							window.openNav(data["desc"] , data["page"] , data["listener"] , params,data["subsys"]);
						}
						data["hasOpen"] = true;
						return;
					}else{
						data = this.getStep(data["nextstep"]);
						noi = data["name"];
					}
				}*/
				//如果是分支节点
				if(data["tagname"]=="switch"){
					this.toSwitch(noi,ignoreMonitor,notTriggerNextButton);
					return;
				}
				this.gostep.put(data["name"], data);
				if($("#"+data["name"]).attr("src")!="about:blank"){
					this.setButton(noi);
				}else{
					this.setButton(noi,true);
				}
				
				$.bizpageflow.fn.displayNextButton(this.active,"none");
				$.bizpageflow.fn.displayNextButton(noi,"inline-block");
				
				this.setFrame(noi,params);
//				this.setMonitor(true);
				this.active=noi;
				this.curStep=noi;
//				this.setAutoHeight();
			},
			/*上一步绑定的事件*/
			back : function(noi,notTriggerNextButton){
				if(!noi){
					noi = $("#bback").attr('back');
				}
				var data=this.getStep(noi);
				if(data==null||typeof(data)=="undefined")return;
				if(data["name"]==="begin"||data["name"]==="end")return;				
				//alert("active step : " + this.active + "; back step :" + noi);
				
				//触发节点["bback"]绑定的事件
				var active = this.getActive();				
				/*if(notTriggerNextButton!=true){
					var f=this.getStepFrame(this.active);
					if(f!=null&&active["backbutton"]&&active["backbutton"]!=""){
						var bback=f("#"+active["backbutton"]);
						if(bback.length>0){
							var value=bback.triggerHandler("click");
							if(value==false){
								return;
							}
						}
					}f==null;
				}*/
				//清空nexttrigger状态
				data["nexttrigger"] = "";
				
				this.gostep.removeKey(this.active);
				
				//this.setGuide(noi);
				//this.setFlow(noi);
				this.setButton(noi);
//				this.setMonitor(false);
				
				this.setFrame(noi,"");
				this.active=noi;
				this.curStep=noi;
				this.setAutoHeight();
			},
			/*取消绑定的事件*/
			cancel : function(){
				alert("close the window!");
			},
			/*提交绑定的事件*/
			submit : function(){
				//do bsubmit action
				//$("#bnext").attr("disabled","disabled");
				
				var curListener=window.getFlow().getSubmitListener();
				if(curListener==null||curListener=="")
					return;
				
				$.aries.common.disabledButton("bnext",true);
				var data=this.getActive();
				/*var f=this.getStepFrame(data["name"]);
				if(f!=null&&data["nextbutton"]&&data["nextbutton"]!=""){
					var bnext=f("#"+data["nextbutton"]);
					if(bnext.length>0){
						
						if(this.stepChange() === false){
							return ;
						}
				
						var check = bnext.triggerHandler("click");
						if (!check){
							$.aries.common.disabledButton("bnext",false);
							//$("#bnext").removeAttr("disabled");
							return ;
						}
					}
				}f=null;*/
				this.getTransData(data["name"]);
				//submit flow
				var submitdata;
				if(this.submitParams){
					var paramAry = this.submitParams.split(",");
					var buf = [];
					for (var i=0;i<paramAry.length;i++){
						var param = paramAry[i];
						buf.push(param+"="+this.getGlobalValue(param));
					}
					submitdata =  buf.join("&");
					$.aries.ajax.post(curListener,submitdata,function(data){
						//$("#bnext").removeAttr("disabled");
						$.aries.common.disabledButton("bnext",false);
						//$.aries.messagebox.success("Submit Successfully!");
						//window.getFlow().cleanup();
						window.location.reload(false);
					},function(i,e){
						//$("#bnext").removeAttr("disabled");
						$.aries.common.disabledButton("bnext",false);
						$.aries.messagebox.error("Submit Error!");
					});
				}
			},
			stepChange : function(ignoreMonitor){
				var changekey=this.getChange();
				var lastFlowName = this.activeFrames.slice(this.activeFrames.length-1)[0];
				if(ignoreMonitor!=true){
					if(changekey&&changekey!=lastFlowName){
						$("#guide_"+changekey).attr("monitor","{"+this.getStepMonitor(changekey)+"}");
						if (window.confirm($.lang["view.web.comp.pageflow.confirm"])){
							this.reset(changekey);
							this.setShowPage(changekey);
							$("#bnext").triggerHandler("click");
							return false;
						}
					}
				}else{
					if(changekey&&changekey!=lastFlowName&&changekey==this.curStep){
						$("#guide_"+this.curStep).attr("monitor","{"+this.getStepMonitor(this.curStep)+"}");
					}
				}
				
				return true;
			},
			isFilishStep : function() {
				return this.isFilish;
			},
			setCurrentEvent : function(evt){
				this.currentEvent=evt;
			},
			getCurrentEvent : function(){
				return this.currentEvent;
			},
			setCurrentEvtType : function(evtType){
				this.currentEvtType=evtType;
			},
			getCurrentEvtType : function(){
				return this.currentEvtType;
			},
			initNextButton : function(evt,page,text,verifyEvent){
				var subFrame = $("#"+page);
				if(subFrame==null||typeof(subFrame)=="undefined")
					return;
				var btnHtml = "<a href=\"#nogo\" id=\""+evt+"\" name=\""+evt+"\" page=\""+page+"\" style=\"display:none;\">"+text+"</a>\n";
				//$.insertHtml('afterbegin',$("#guideBtns"),btnHtml);
				$("#guideBtns").append(btnHtml);
				
				var btn=$("#"+evt+"[page="+page+"]");
				var pf=this;
				if(btn!=undefined&&btn[0]!=undefined){
					btn.bind('click',function(e){
						if(pf.verifyNextEvent(verifyEvent)){
							pf.setCurrentEvent(evt);
							pf.setSubmitListener("");
							pf.setCurrentEvtType("next");
							$("#bnext").trigger("click");
						}
					});
				}
				if(page==this.active){
					this.displayNextButton(page,"inline-block");
				}
			},
			displayNextButton : function(page,state){
				var btns=$("#guideBtns").children("a[page="+page+"]");
				if(btns && btns.length){
					btns.css("display",state);
					$("#guideBtns").show();
				}
			},
			bindNextEvent : function(page,nextEvt,source,evtType,evtName,verifyEvent){
				if(page==null||typeof(page)=="undefined"||page=="")
					return;
				if(evtName==null||typeof(evtName)=="undefined"||evtName=="")
					evtName="Next";
				if(nextEvt==null||typeof(nextEvt)=="undefined"||nextEvt==""){
					window.getFlow().initNextButton("defBtn_"+page,page,evtName,verifyEvent);
					return;
				}
				if(source==null||typeof(source)=="undefined"||source==""){
					window.getFlow().initNextButton(nextEvt,page,evtName,verifyEvent);
					return;
				}
				if(typeof(this.bindedButtons[page])=="undefined"||this.bindedButtons[page]==null){
					this.bindedButtons[page] = [];
				}
				var bindedBtn = {};
				bindedBtn.name = source;
				bindedBtn.type = "n";
				bindedBtn.evtType = evtType;
				bindedBtn.nextEvt = nextEvt;
				bindedBtn.verifyEvent = verifyEvent; 
				this.bindedButtons[page].push(bindedBtn);
				return;
				var subFrame = $("#"+page);
				if(subFrame){
					subFrame.bind("load",function(e){
						var btn = $("[name="+source+"]",this.contentDocument);
						var frame = this.contentWindow;
						if(btn==undefined||btn[0]==undefined)
							return;
						
						if(evtType!=null&&typeof(evtType)!="undefined"&&evtType!=""){
							var evt=btn[0].getAttribute(evtType);
							var evtName='',evtArgs='';
							if(evt&&evt!=''){
								var len=evt.indexOf('(');
								if(len>-1){
									evtName=evt.substring(0,len);
									var endLen=evt.indexOf(')');
									evtArgs=endLen>-1?evt.substring(len+1,endLen):evt.substring(len+1,evt.length);
								}else{
									evtName=evt;
								}
							}
							var bindType=evtType.indexOf('on')==0?evtType.substring(2,evtType.length):evtType;
							btn.unbind(bindType);
							btn.bind(bindType,function(e){
								if(evtName!=''){
									//TODO
									if($.isFunction(frame.window[evtName])){
										if(evtArgs!=''){
											eval('frame.window.'+evtName+'('+evtArgs+');');
										}else{
											eval('frame.window.'+evtName+'();');
										}
									}
								}
								if(window.getFlow().verifyNextEvent(verifyEvent)){
									window.getFlow().setCurrentEvent(nextEvt);
									window.getFlow().setSubmitListener("");
									window.getFlow().setCurrentEvtType("next");
									$("#bnext").trigger("click");
								}
							});
							btn[0].setAttribute(evtType,"");
						}
					});
				}
			},
			verifyNextEvent : function(verifyEvent){
				var rtnFlag=true;
				if(verifyEvent&&typeof(verifyEvent)!='undefined'&&verifyEvent!=''){
					var errorTitle="不能执行操作";
					var evtName,evtArgs='',len=-1;
					len=verifyEvent.indexOf('(');
					if(len>-1){
						evtName=verifyEvent.substring(0,len);
						var endLen=verifyEvent.indexOf(')');
						evtArgs=endLen>-1?verifyEvent.substring(len+1,endLen):verifyEvent.substring(len+1,verifyEvent.length);
					}else{
						evtName=verifyEvent;
					}
					var rtn,rtnMsg='';
					if(evtArgs!=''){
						rtn=eval('window.'+evtName+'('+evtArgs+');');
					}else{
						rtn=eval('window.'+evtName+'();');
					}
					if(rtn&&$.isArray(rtn)&&rtn.length>0){
						rtnFlag=rtn[0];
						if(rtn.length>1){
							rtnMsg=rtn[1];
						}
					}else{
						rtnFlag=rtn;
					}
					if(rtnFlag==undefined||rtnFlag=='false'||rtnFlag==false){
						rtnFlag=false;
					}else{
						rtnFlag=true;
					}
					if(!rtnFlag){
						$.aries.messagebox.error(errorTitle, rtnMsg?rtnMsg:'');
						window.getFlow().setCurrentEvent(null);
						window.getFlow().setSubmitListener(null);
					}
				}
				return rtnFlag;
			},
			bindSubmitEvent : function(page,submitEvt,source,evtType,evtName,submitSV,params,verifyEvent,afterSubmit){
				if(page==null||typeof(page)=="undefined"||page=="")
					return;
				/*if(submitSV==null||typeof(submitSV)=="undefined"||submitSV==""){
					return;
				}*/
				if(evtName==null||typeof(evtName)=="undefined"||evtName=="")
					evtName="Submit";
				if(submitEvt==null||typeof(submitEvt)=="undefined"||submitEvt==""){
					window.getFlow().initSubmitButton("defBtn_"+page,page,evtName,submitSV,verifyEvent);
					return;
				}
				if(source==null||typeof(source)=="undefined"||source==""){
					window.getFlow().initSubmitButton(submitEvt,page,evtName,submitSV,verifyEvent);
					return;
				}
				
				if(typeof(this.bindedButtons[page])=="undefined"||this.bindedButtons[page]==null){
					this.bindedButtons[page] = [];
				}
				var bindedBtn = {};
				bindedBtn.name = source;
				bindedBtn.type = "s";
				bindedBtn.submitEvt = submitEvt;
				bindedBtn.evtType = evtType;
				bindedBtn.evtName = evtName;
				bindedBtn.submitSV = submitSV;
				bindedBtn.verifyEvent = verifyEvent; 
				this.bindedButtons[page].push(bindedBtn);
				if(params){
					this.submitParams = params;
				}else{
					this.submitParams = "";
				}
				
				return;
				
				var subFrame = $("#"+page);
				if(subFrame){
					subFrame.bind("load",function(e){
						var btn = $("[name="+source+"]",this.contentDocument);
						var frame = this.contentWindow;
						if(btn==undefined||btn[0]==undefined)
							return;
						
						if(evtType!=null&&typeof(evtType)!="undefined"&&evtType!=""){
							var evt=btn[0].getAttribute(evtType);
							var evtName='',evtArgs='';
							if(evt&&evt!=''){
								var len=evt.indexOf('(');
								if(len>-1){
									evtName=evt.substring(0,len);
									var endLen=evt.indexOf(')');
									evtArgs=endLen>-1?evt.substring(len+1,endLen):evt.substring(len+1,evt.length);
								}else{
									evtName=evt;
								}
							}
							var bindType=evtType.indexOf('on')==0?evtType.substring(2,evtType.length):evtType;
							btn.unbind(bindType);
							btn.bind(bindType,function(e){
								if(evtName!=''){
									if(evtArgs!=''){
										eval('frame.window.'+evtName+'('+evtArgs+');');
									}else{
										eval('frame.window.'+evtName+'();');
									}
								}
								if(window.getFlow().verifyNextEvent(verifyEvent)){
									window.getFlow().setCurrentEvent(submitEvt);
									window.getFlow().setSubmitListener(submitSV);
									window.getFlow().setCurrentEvtType("submit");
									/*if(data!=null&&typeof(data)!="undefined"&&data!=""){
										window.getFlow().setCurrentData(data);
									}else{
										window.getFlow().setCurrentData(null);
									}*/
									$("#bnext").trigger("click");
								}
							});
							btn[0].setAttribute(evtType,"");
						}
					});
				}
			},
			initSubmitButton : function(evt,page,text,submitSV,verifyEvent){
				var subFrame = $("#"+page);
				if(subFrame==null||typeof(subFrame)=="undefined")
					return;
				var btnHtml = "<a href=\"#nogo\" id=\""+evt+"\" name=\""+evt+"\" class=\"finish\" page=\""+page+"\" style=\"display:none;\">"+text+"</a>\n";
				//$.insertHtml('afterbegin',$("#guideBtns"),btnHtml);
				$("#guideBtns").append(btnHtml);
				var btn=$("#"+evt+"[page="+page+"]");
				var pf=this;
				if(btn!=undefined&&btn[0]!=undefined){
					btn.bind('click',function(e){
						if(pf.verifyNextEvent(verifyEvent)){
							pf.setCurrentEvent(evt);
							pf.setSubmitListener(submitSV);
							pf.setCurrentEvtType("submit");
							/*if(data!=null&&typeof(data)!="undefined"&&data!=""){
								pf.setCurrentData(data);
							}else{
								pf.setCurrentData(null);
							}*/
							$("#bnext").trigger("click");
						}
					});
				}
				if(page==this.active){
					this.displayNextButton(page,"inline-block");
				}
			},
			setSubmitListener : function(ltr){
				this.submitListener=ltr;
			},
			getSubmitListener : function(){
				return this.submitListener;
			},
			getGlobalVarsByName:function(key){
				if(key&&key!=""&&this.globalVars.containsKey(key)){
					return this.globalVars.get(key);
				}
				return "";
			},
			setGlobalVarsByName:function(key,value){
				if(key&&key!=""){
					if(value==undefined||value==null){
						value="";
					}
					if(this.globalVars.containsKey(key)){
						this.globalVars.removeKey(key);
						this.globalVars.put(key,value);
					}else{
						this.globalVars.put(key,value);
					}
				}
			},
			clearGlobalVars:function(){
				this.globalVars.clear();
			},
			getGlobalVarsList:function(){
				return this.globalVars;
			},
			bindTransValue:function(page,uiid){
				if(page==null||page==undefined||page=="")
					return;
				if(uiid==null||uiid==undefined||uiid=="")
					return;
				var toFrame=$("#"+page);
				if(toFrame){
					toFrame.bind("load",function(e){
						var toItem=$("[uiid="+uiid+"]",this.contentDocument);
						if(toItem==undefined||toItem[0]==undefined)
							return;
						
						if($.nodeName(toItem[0], "input")||$.nodeName(toItem[0], "select")||$.nodeName(toItem[0], "textarea")){
							var p=$.params.load(toFrame[0].src);
							toItem.val(p.get(uiid)+"");
						}
					});
				}
			},
			getGlobalValue:function(key){
				var result = "";
				if(!key||key==""||!this.globalVars.containsKey(key)){
					return "";
				}
				return this.globalVars.get(key);
			},
			setBeginStep : function (stepName) {
				this.beginStep = stepName;
			}
		};
		$.bizpageflow.fn.construct.prototype=$.bizpageflow.fn;
	}
//})(jQuery);
//TODO list
//button 既可以是submit又可以是next
});
define('ui-tpl',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
	/*
	 * $Id: ui-tpl.js$
	 * Depends : ui-core.js
	 * version : 3.1
	 * The last modification time : 2015-6-10 20:47
	 * log : 修改组件使用方式，必须引用样式 c_hide，组件处理删除样式；2015-2-2 10:51
	 *		完善getData方法中对dataField的处理。2015-2-2 19:06
	 *		必须引用样式 class="ae_tpl" 2015-2-3 10:19
	 *		初始化执行模版预编译，新增属性sourceId，支持模版嵌套。 2015-2-6 10:54
	 *		新增onAfterReload事件 2015-2-6 15:36
	 *		修复代码bug 2015-2-9 15:25
	 *		Aries 3.1
	 *		组件内部初始化不再做reload数据的逻辑，由用户自主实现； 2015-6-10 20:47
	 *		reload方法新增回调参数callback，reload(data,obj,callback)；2015-10-28 20:11
	 */
	$.aeWidget("ae.aeTpl", {
		options: /**@lends aeTpl#*/{
			/**
			 * 是否执行组件初始化
			 * @type Boolean
			 * @default false
			 */
			initial : false,
			/**
			 * 是否隐藏模版区域
			 * @type Boolean
			 * @default false
			 */
			isHide : false,
			/**
			 * 如果模版内容写在模版外部，则需要设置此属性值为外部模版内容的id值，一般用于模版嵌套模版，外部模版可以定义在一个div内（取div子内容），也可以写在script内。
			 * &lt;script id="myTpl-2" type="text/x-handlebars-template">&lt;/script>
			 * @type String
			 * @default 无
			 */
			sourceId : '',
			/**
			 * 数据对象名
			 * @type String
			 * @default 无
			 */
			dataField : '',
			/**
			 * 当数据渲染结束执行的方法。
			 * @event
			 * @param event jQuery.Event对象
			 * @default emptyFn
			 * @example
			 *  $('#mytpl').aeTpl({
         *      onAfterReload : function(event) {
         *          alert('reload over now !');
         *      }
         *  });
			 */
			onAfterReload : function() {
			},
			/**
			 * reload时强制初始化内部的aeType组件,包含aeinit为false的组件
			 */
			forceInit : true,
			/**
			 * tpl初始化方式，默认通过html来设置参数。传值为js时，则通过js中设置的option来初始化。
			 * @type String
			 * @default 'html'
			 * @example
			 * $('#mytpl').aeTpl({initType : 'js'});
			 */
			initType : 'html'
		},
		_create: function() {
			var options = this.options,
				$ele = this.element,
				id=$ele.attr("id");
			if(options.initial==true){
				return;
			}
			if(id){
				$ele.attr("aeId",id);
			}
			if(options.initType=='html'){
				this._buildOptions(options,$ele);
			}
			options.aeType ? $ele.attr("aeType",options.aeType) : $ele.attr("aeType","aeTpl");
			options.uiid ? $ele.attr("uiid",options.uiid) : $ele.attr("uiid",id);

			if(options.sourceId != ""){
				options.tpl = $("#"+options.sourceId).html();
			}
			//模版预编译
			options.template = Handlebars.compile(options.tpl);

			options.initial = true;
		},
		_init : function() {
			var self = this, options = self.options, $ele = self.element;
			var str = $ele.html();
			//初始化去掉页面上的花括号，两层和三层的都要匹配到
			var regex = /{{.*?[}]?}}/g;
//    	var strs = str.match(regex);
			var newHtml = str.replace(regex, "");
			if(options.isHide){
				/*$ele.html(newHtml);
				 $ele.hide();*/
				$ele.empty();
			}else{
				$ele.html(newHtml);
				$ele.removeClass("ae_tpl");
				$ele.show();
			}
		},
		_buildOptions : function(options,element){
			options.tpl = element.html();
			options.dataField = element.attr("dataField") || options.dataField;
			options.isHide = element.attr("isHide")=="true" ? true : options.isHide;
			options.sourceId = element.attr("sourceId") || options.sourceId;
			options.aeType = element.attr("aeType");
			options.uiid = element.attr("uiid");
			options.forceInit = element.attr("forceInit")=="false" ? false : options.forceInit;

			var onAfterReload = element.attr("onAfterReload");
			options.onAfterReload = onAfterReload ? function(event){
				if($.isString(onAfterReload)){
					var i = onAfterReload.indexOf("(");
					var actName = i>0 ? onAfterReload.substring(0, i) : onAfterReload;
					var func = 	"return window."+actName+"?"+actName+".call(window,e):false;";
					return new Function("e",func)(event);
				}
			}: '';
		},
		_reload : function(data,obj){
			var	options = this.options,
				$ele = this.element;
			var template = options.template;
			if(obj){
				obj.html(template(data));
			}else{
				$ele.html(template(data));
			}
		},
		_getInitFunction : function(data,obj){
			var	$ele = this.element,
				options = this.options,
				initFuncs,aeTypes,initFuncArray = [];
			if(obj){
				initFuncs = obj.find('[initFunction]');
				aeTypes = obj.find('*[aeType]');
			}else{
				initFuncs = $ele.find('[initFunction]');
				aeTypes = $ele.find('*[aeType]');
			}
			if(initFuncs && initFuncs.length){
				$.each(initFuncs,function(index,item){
					var initFunction = $(item).attr("initFunction");
					if(initFunction.length){
						var i = initFunction.indexOf("(");
						funcName = i>0 ? initFunction.substring(0, i) : initFunction;
						if(funcName == "$" || funcName.indexOf(".")>0){
							initFuncArray.push(initFunction);
						}else{
							var func = "return window."+funcName+"?"+funcName+".call(window):false";
							func = new Function(func)();
							if(func==false){
								initFuncArray.push(initFunction);
							}
						}
					}
				});
				if(initFuncArray.length>0){
					eval(initFuncArray.join(';'));
				}
			}
			if(aeTypes.length){
				$.each(aeTypes,function(index,item){
					if($(item).attr("initFunction")){
						return;
					}
					if(options.forceInit){
						$(item)[$(item).attr('aeType')]();
						$(item).attr('aeInit','false');
					}else{
						var aeInit = $(item).attr("aeInit");
						if(aeInit && aeInit=="true"){
							$(item)[$(item).attr('aeType')]();
							$(item).attr('aeInit','false');
						}
					}
				});
			}
		},
		/**
		 * 加载模版数据
		 * @name aeTpl#reload
		 * @param json数据对象
		 * @function
		 * @example
		 * $("#mytpl").aeTpl('reload', data,obj);
		 */
		reload : function(data, obj, callback){
			var options = this.options,
				$ele = this.element;
			if(data){
				this._reload(data, obj);
				this._getInitFunction(data,obj);
				if(!options.isHide){
					$ele.removeClass("ae_tpl");
					$ele.show();
				}
				if (callback && $.isFunction(callback)) {
					callback();
				}else{
					options.onAfterReload && this._trigger("onAfterReload");
				}
			}
		},

		/**
		 * 获取当前模版数据。
		 * @name aeTpl#getValue
		 * @function
		 * @example
		 * $("#mytpl").aeTpl('getValue');
		 * dataField 为构建数据的键值
		 */
		getData : function(object){
			var options = this.options,
				$ele = this.element,
				obj = {};
			var keyValueObj = $ele.find('*[dataField]');
			if(keyValueObj){
				$.each(keyValueObj,function(index,item){
					var dataField = $(item).attr("dataField");
					if($(item).attr("value")){
						var value = $(item).attr("value");
						obj = $.aries.common.buildUiidData(obj,dataField,value);
					}else if($(item).text()){
						var value = $(item).text();
						obj = $.aries.common.buildUiidData(obj,dataField,value);
					}
				});
			}
			if(object == undefined){
				if(options.dataField){
					var objw = {};
					obj = $.aries.common.buildUiidData(objw,options.dataField,obj);
				}
				return obj;
			}else{
				object = $.aries.common.buildUiidData(object,options.dataField,obj);
				return object;
			}
		}
	});
});

define('ui-messagebox', function (require, exports, moudles) {
    "require:nomunge,exports:nomunge,moudles:nomunge";
//;(function($){
    $.aries.messagebox = {
        initCount: 0,
        _init: function (settings) {
            var msgBoxHtml = [];
            var s = $.extend({}, settings);
            msgBoxHtml.push('<div id="messagebox_div_' + $.aries.messagebox.initCount + '" style="display: none;">');
            /**
             * 提示框图标根据类型做区分
             */
            if (s.type === 'alert') {
                msgBoxHtml.push('  <i class="fa fa-exclamation-circle"></i>');
            }
            if (s.type === 'confirm') {
                msgBoxHtml.push('  <i class="fa fa-warning"></i>');
            }
            if (s.type === 'success') {
                msgBoxHtml.push('  <i class="fa fa-check-circle"></i>');
            }
            if (s.type === 'error') {
                msgBoxHtml.push('  <i class="fa fa-times-circle"></i>');
            }
            msgBoxHtml.push('  <h3 class="modal-title"></h3>');
            msgBoxHtml.push('  <p></p>');
            msgBoxHtml.push('</div>');
            $(document.body).append(msgBoxHtml.join(""));
            msgBoxHtml = [];
            msgBoxHtml = null;
        },
        _show: function (settings) {
            $.aries.messagebox._init(settings);
            var s = $.extend({}, settings),
                buttons = $.extend({}, s.buttons);
            var obj = $("#messagebox_div_" + $.aries.messagebox.initCount),
                title = obj.find('>h3.modal-title'),
                $icon = obj.find('i'),
                content = title.next();
            if (s.title) {
                title.html(s.title);
            }
            if (s.content) {
                content.html(s.content);
            } else {
                if (s.type === 'alert') {
                    content.html($.ae.messagebox.alert);
                }
                if (s.type === 'confirm') {
                    content.html($.ae.messagebox.confirm);
                }
                if (s.type === 'success') {
                    content.html($.ae.messagebox.success);
                }
                if (s.type === 'error') {
                    content.html($.ae.messagebox.error);
                }
            }
            var str = $.extend(true, {}, $.extend({
                draggable: false,
                resizable: false,
                showClose: true,
                showButton: true,
                modal: true
            }, s.settings));
            var cfg = {
                autoOpen: true,
                modal: str.modal,
                width: str.width || '500',
                height: str.height || 'auto',
                draggable: str.draggable,
                resizable: str.resizable,
                showClose: str.showClose,
                showButton: str.showButton,
                componentType: 'message',
                messageType: s.type,
                close: function () {
                    $.aries.messagebox.initCount--;
                }
            };
            obj.aeDialog(cfg);
            obj.next().find('>button.btn-primary').off().on('click', function () {
                var ret;
                if (s.fn && $.isFunction(s.fn)) {
                    var param = '';
                    if (s.type === 'confirm') {
                        param = 'ok';
                    }
                    ret = s.fn(param);
                }
                if (false !== ret) {
                    obj.aeDialog('close');
                }
            });
            $.aries.messagebox.initCount++;
        },
        alert: function (title, content, fn, settings) {
            $.aries.messagebox._show({
                "type": "alert",
                "title": title || "Warning!",
                "content": content,
                "fn": fn,
                "settings": settings
            });
        },
        success: function (title, content, fn, settings) {
            $.aries.messagebox._show({
                "type": "success",
                "title": title || "Success!",
                "content": content,
                "fn": fn,
                "settings": settings
            });
        },
        error: function (title, content, fn, settings) {
            $.aries.messagebox._show({
                "type": "error",
                "title": title || "Error!",
                "content": content,
                "fn": fn,
                "settings": settings
            });
        },
        confirm: function (title, content, fn, settings) {
            $.aries.messagebox._show({
                "type": "confirm",
                "title": title || "Info!",
                "content": content,
                "fn": fn,
                "settings": settings
            });
        }
    };
    $.ae.messagebox = {
        alert: "Operation error!",
        success: "Operation successed!",
        error: "Operation failed!",
        confirm: "Are you sure you want to operate?"
    };
    if (typeof($.message) == 'undefined') {
        $.message = {};
    }
    $.message.alert = $.aries.messagebox.alert;
    $.message.success = $.aries.messagebox.success;
    $.message.error = $.aries.messagebox.error;
    $.message.confirm = $.aries.messagebox.confirm;
//})(jQuery);
});

define('ui-slider',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
/*
 * $Id : ui-slider.js$
 * Depends : ui-core.js
 * version : 1.0
 * The last modification time : 2015-2-5 21:26
 * log : 修复组件高度和宽度获取问题 2015-1-28 17:54
 * 		 修复缩略图bug 2015-2-5 21:26
 *
 */
    /**
     * @name slider1.0
     * @class 用来展示页面中多个HTML元素的滑动器.<br/>
     * <b>特点：</b><br/>
     * <ol>
     * 		<li>以滑动器的方式展示页面中的多个元素，元素的HTML结构不限</li>
     * 		<li>内置控制导航条</li>
     * 		<li>内置多种切换的动画效果</li>
     * 		<li>可自定义导航条的内容和样式</li>
     * </ol>
     * <b>示例：</b><br/>
     * <pre>
     * &lt;script type="text/javascript" &gt;
     * $(document).ready(function() {
     *     $('#slider').aeSlider({
     *         animSpeed : 100,
     *         animEffect : 'slide-y',
     *         onBeforeSlide : function(index,event){
     *             // do something
     *         }
     *     });
     * });
     * &lt;/script&gt;
     *
     * &lt;div id="slider" class="slider-demo"&gt;
     *	&lt;img src="images/turtle.jpg" /&gt;
     *	&lt;a href="#"&gt;&lt;img src="images/rabbit.jpg" /&gt;&lt;/a&gt;
     *	&lt;img src="images/penguin.jpg" /&gt;
     *	&lt;img src="images/lizard.jpg" /&gt;
     *	&lt;img src="images/crocodile.jpg" /&gt;
	 * &lt;/div&gt;
	 * </pre>
     * @constructor
     * @description 构造函数.
     * @param p 标准config对象：{}
     */
//;(function($) {
    $.aeWidget('ae.aeSlider', {
        options : /** @lends aeSlider#*/ {
        	/**
			 * 组件支持整体样式风格定制，本属性值为样式类名的前缀。
			 * 命名规则：c_slider-content, c_slider-item, c_slider-nav-classical, c_slider-nav-dot
			 * @type String
			 * @default 'c_'
			 * @example
			 * $("#slider").aeSlider({cssPre : 'c_'});
			 */
			cssPre : 'c_',
        	/**
			 * slider组件的宽度，取值（比如百分比、数字、em单位、px单位的值等等）将被直接赋给width属性。
			 * @type String
			 * @default '500px'
			 * @example
			 * $("#slider").aeSlider({width : '500px'});
			 */
			width : '500px',
			/**
			 * slider组件的高度，取值（比如百分比、数字、em单位、px单位的值等等）将被直接赋给height属性。
			 * @type String
			 * @default '400px'
			 * @example
			 * $("#slider").aeSlider({height : '400px'});
			 */
			height : '400px',
        	/**
             * 设置图片是否自动切换。
             * @default true
             * @type Boolean
             * @example
             * $('#slider').aeSlider({autoPlay : true});
             */
            autoPlay : true,
            /**
             * 自动切换间隔时间，只有当autoPlay为true的时候这个属性才有效。
             * @default 5000
             * @type Number
             * @example
             * $('#slider').aeSlider({autoPlayTime: 1000});//设置slider自动切换的间隔时间为1秒
             */
            autoPlayTime : 3000,
            /**
             * 动画执行的速度。单位毫秒，值越小动画执行的速度越快。
             * @default 400
             * @type Number
             * @example
             * $('#slider').aeSlider({animSpeed : 400});
             */
            animSpeed : 400,
            /**
             * 鼠标移动到图片导航小图标上后触发切换动作的延迟时间。单位为毫秒。
             * @default 200
             * @type Number
             * @example
             * $('#slider').aeSlider({delayTime : 200});
             */
            delayTime : 200,
            /**
             * 设置当鼠标移动到slider上面的时候是否暂停自动切换。
             * @default true
             * @type Boolean
             * @example
             * $('#slider').aeSlider({pauseOnHover : false});
             */
            pauseOnHover : true,
			/**
			 * 设置是否出现slider组件的滚动方向按钮，默认出现。
			 * @type Boolean
			 * @default true
			 * @example
			 * $("#slider").aeSlider({isDirectionIcon : true);
			 */
			isDirectionIcon : true,
			/**
			 * 设置是否出现图片导航小图标组，默认出现。
			 * @type Boolean
			 * @default true
			 * @example
			 * $("#slider").aeSlider({isNavigation : true);
			 */
			isNavigation : true,
			/**
			 * 设置图片导航样式，可以是缩略图（thumb）、数字（num）、小圆点（dot），默认为数字；
			 * 支持图片导航样式自定义，此时属性配置为（diy）。
			 * @type String
			 * @default 'num'
			 * @example
			 * $("#slider").aeSlider({navigationType : 'num');
			 */
			navigationType : 'num',
			/**
			 * 设置自定义图片导航的id，可以在页面内任意位置定义一段代码，作为图片导航，该自定义图片导航的id属性值作为本属性的值。
			 * 仅当navigationType属性值为diy时生效。
			 * @type String
			 * @default 无
			 * @example
			 * $("#slider").aeSlider({diyNavigationId : '');
			 */
			/**
			 * 设置图片导航小图标组的位置，默认在焦点图内下方（true），在焦点图外下方为（false）。
			 * 仅当isNavigation属性值为true时生效。
			 * 当图片导航为自定义时，此属性不做判断，引用用户自定义样式。
			 * @type Boolean
			 * @default true
			 * @example
			 * $("#slider").aeSlider({isNavigationInimg : true);
			 */
			isNavigationInimg : true,
			/**
             * 设置图片切换的动画效果。
             * 内置的动画效果包括'fade'(淡入淡出)、'slide-y'(垂直滑动)、'slide-x'(水平滑动)。
             * 默认使用淡入淡出。
             * @default 'fade'
             * @type String
             * @example
             * $('#slider').aeSlider({animEffect : 'slide-x'});
             */
            animEffect : 'fade',
            /**
             * 图片切换前触发事件，事件的处理函数返回false则阻止切换动作。
             * @event
             * @type Function
             * @default emptyFn
             * @param index 图片的索引
             * @param event jQuery.Event对象
             * @name aeSlider#onBeforeSlide
             * @example
             * $('#slider').aeSlider({onBeforeSlide : function(index,event){if(index==2) return false;}});// 阻止slider切换到第三个图片
             */
            onBeforeSlide : function(index){},
            /**
             * 图片切换后触发事件。
             * @event
             * @type Function
             * @default emptyFn
             * @param index 图片的索引
             * @param event jQuery.Event对象
             * @name aeSlider#onAfterSlide
             * @example
             * $('#slider').aeSlider({onAfterSlide : function(index,event){alert(index + ' slide complete');});
             */
            onAfterSlide : function(index){},
            /**
             * slider初始化方式，默认通过html来设置参数。传值为js时，则通过js中设置的option来初始化。
             * @type String
             * @default 'html'
             * @example
             * $('#slider').aeSlider({initType : 'js'});
             */
            initType : 'html'
        },
        _create : function() {
        	var self = this,
				options = this.options,
				$ele = this.element,
				id=$ele.attr("id"),
				vars = {
        			startSlide : 0,
                    nowSlide : 0,
                    totalSlides : 0,
                    running : false,
                    paused : false,
                    stop : false,
                    selectedNavStyle : 'nav-selected'
                };
			if(id){
				$ele.attr("aeId",id);
			}
        	options.vars = vars;
        	vars.pre = options.cssPre;
        	if(options.initType=='html'){
				self._buildOptions(options,$ele);
	        }
        	var imgs = $ele.children();
        	vars.totalSlides = imgs.length;
        	vars.width = $ele.attr("width");
        	vars.height = $ele.attr("height");
        	if(vars.width === undefined || vars.height === undefined){
        		//获取图片的宽度和高度 遍历图片，如果第一张图片存在，则取第一张的宽度和高度
        		//由于Chrome安全机制的限制，不支持读取本地文件，此时将采用默认宽度和高度
        		$ele.find('img').each(function(index,item){
        			if($(item).attr("src")){
        				var src = $(item).attr("src");
        				$(item).attr("src", src).load(function(){
        					vars.width = this.width;
        					vars.height = this.height;
        				});
        			}
        		});
        	}
        	options.width = vars.width ? vars.width : options.width;
        	options.height = vars.height ? vars.height : options.height;
        	$ele.width(options.width).height(options.height);

			options.thumbW = parseInt(options.width)/10+"px";
			options.thumbH = parseInt(options.height)/10+"px";
			if($('img[name="thumbImgs"]')){
				$('img[name="thumbImgs"]').each(function(index,item){
					$(item).attr({"width":options.thumbW,"height":options.thumbH});
				});
			}

        	$ele.addClass(vars.pre+'slider');
        	if(options.diyNavigationId !== undefined || $("#"+options.diyNavigationId) !== undefined){
        		$("#"+options.diyNavigationId).wrap('<div class="temp"></div>');
        		options.vars.diyNavHtml = $(".temp").html();
        		$(".temp").remove();
        	}

			$ele.children().wrapAll('<ul class="'+vars.pre+'slider-content"></ul>').wrap('<li class="'+vars.pre+'slider-item"></li>');

			if(options.animEffect == 'slide-y' || options.animEffect == 'slide-x'){
                $ele.find('.'+vars.pre+'slider-content').addClass(vars.pre+'slider-effect-'+options.animEffect);
            }

        },
        _init : function(){
        	var self = this,
				options = this.options,
				$ele = this.element,
				vars = options.vars;
        	var timer = 0;
	    	var $container = $ele.find('ul.'+vars.pre+'slider-content:first'),
	        	$item = $container.children(),
	        	top = 0,
	        	left = 0;
	    	if(options.isNavigation == true){
				self._initNavigation($ele);
			}
	        if(options.animEffect == 'slide-x'){
	            $item.each(function(n){
	            	if(n == 0) return false;
	                left -= $(this).width();
	            });
	            setTimeout(function(){$container.css({left:left,top:top});},0);
	        } else if(options.animEffect == 'slide-y'){
	            $item.each(function(n){
	            	if(n == 0) return false;
	                top -= $(this).height();
	            });
	            setTimeout(function(){$container.css({left:left,top:top});},0);
	        } else{
	        	$container.children().eq(0).show();
	        }
	        if(vars.navigationStyle){
	            self._toggleNavigationStyle($ele,0);
	        }
	        if(options.autoPlay){
	        	//vars.autoPlayTimer:用于组件销毁
	            vars.autoPlayTimer = timer = setInterval(function(){self._next($ele);},options.autoPlayTime);
	        }
	        if(options.pauseOnHover){
	            $ele.hover(function(){
	                vars.paused = true;
	                clearInterval(timer);
	            },function(){
	                vars.paused = false;
	                if(options.autoPlay){
	                    vars.autoPlayTimer = timer = setInterval(function(){self._next($ele);},options.autoPlayTime);
	                }
	            });
	        }

	        if(options.isDirectionIcon == true){
	            self._initDirectionIcon($ele);
	        }
        },
        _buildOptions:function(options,element){
			options.autoPlay = element.attr("isAutoPlay")=='false' ? false : options.autoPlay;
			options.autoPlayTime = element.attr("autoPlayTime") || options.autoPlayTime;
			options.animSpeed = element.attr("animSpeed") || options.animSpeed;
			options.delayTime = element.attr("delayTime") || options.delayTime;
			options.pauseOnHover = element.attr("pauseOnHover")=='false' ? false : options.pauseOnHover;
			options.isDirectionIcon = element.attr("isDirectionIcon")=='false' ? false : options.isDirectionIcon;
			options.isNavigation = element.attr("isNavigation")=='false' ? false : options.isNavigation;
			options.navigationType = element.attr("navigationType") || options.navigationType;
			options.isNavigationInimg = element.attr("isNavigationInimg")=='false' ? false : options.isNavigationInimg;
			options.animEffect = element.attr("animEffect") || options.animEffect;
			if(options.isNavigation == true && options.navigationType == 'diy'){
				options.diyNavigationId = element.attr("diyNavigationId");
			}
			var onBeforeSlide = element.attr("onBeforeSlide");
			options.onBeforeSlide = onBeforeSlide ? function(index, event){
				if($.isString(onBeforeSlide)){
					var i = onBeforeSlide.indexOf("(");
					var actName = i>0 ? onBeforeSlide.substring(0, i) : onBeforeSlide;
					var func = 	"return window."+actName+"?"+actName+".call(window,i,e):false;";
					return new Function("i","e",func)(index, event);
				}
        	}: options.onBeforeSlide;

        	var onAfterSlide = element.attr("onAfterSlide");
			options.onAfterSlide = onAfterSlide ? function(index, event){
				if($.isString(onAfterSlide)){
					var i = onAfterSlide.indexOf("(");
					var actName = i>0 ? onAfterSlide.substring(0, i) : onAfterSlide;
					var func = 	"return window."+actName+"?"+actName+".call(window,i,e):false;";
					return new Function("i","e",func)(index, event);
				}
        	}: options.onAfterSlide;

		},
    	_initNavigation : function($ele){
            var self = this,
            	options = this.options,
            	vars = options.vars,
            	n;
            	if(options.navigationType === 'num'){
                    var $nav = $('<ul class="'+vars.pre+'slider-nav-classical"></ul>');
                    vars.navigationStyle = '.'+vars.pre+'slider-nav-classical';
                    for(n=0;n<vars.totalSlides;n++){
                    	var $navItem = $('<li>'+(n+1)+'</li>');
                        $navItem.data('sid',n);
                        var hTimer = 0;
                        $navItem.click(function(){
                            //if(vars.running)return false;
                            self._slideTo($ele,$(this).data('sid'));
                        });
                        $navItem.hover(function(){
                            if(vars.running || vars.stop)return false;
                            var _self = $(this);
                            if(_self.hasClass(vars.selectedNavStyle))return false;
                            //vars.slideTimer:用于组件销毁
                            vars.slideTimer = hTimer = setTimeout(function(){self._slideTo($ele,_self.data('sid'));},options.delayTime);
                        },function(){
                            clearTimeout(hTimer);
                        });
                        $nav.append($navItem);
                    }
                    $ele.append($nav);
                    if(options.isNavigationInimg == false){
                    	$nav.css({bottom:'-50px'});
                    }
                }else if(options.navigationType === 'dot'){
                    var $nav = $('<div class="'+vars.pre+'slider-nav-dot"></div>');
                    vars.navigationStyle = '.'+vars.pre+'slider-nav-dot';
                    for(n=0;n<vars.totalSlides;n++){
                        var $navItem = $('<a href="javascript:void(0)">'+ (n+1) +'</a>');
                        $navItem.data('sid',n);
                        var hTimer = 0;
                        $navItem.click(function(){
                            //if(vars.running)return false;
                            self._slideTo($ele,$(this).data('sid'));
                        });
                        $navItem.hover(function(){
                            if(vars.running || vars.stop)return false;
                            var _self = $(this);
                            if(_self.hasClass(vars.selectedNavStyle))return false;
                            vars.slideTimer = hTimer = setTimeout(function(){self._slideTo($ele,_self.data('sid'));},options.delayTime);
                        },function(){
                            clearTimeout(hTimer);
                        });
                        $nav.append($navItem);
                    }
                    //$nav.insertAfter($ele);
                    $nav.appendTo($ele).css({marginLeft:-1*$nav.width()/2});
                    if(options.isNavigationInimg == false){
                    	$nav.css({bottom:'-50px'});
                    }
                }else if(options.navigationType == 'thumb'){
                	var	$container = $ele.find('ul.'+vars.pre+'slider-content:first'),
                		$item = $container.children(":first");
                	var $nav = $('<ul class="'+vars.pre+'slider-nav-thumb"></ul>');
                    	vars.navigationStyle = '.'+vars.pre+'slider-nav-thumb';
                    for(n=0;n<vars.totalSlides;n++){
                    	$imgItem = $item.find("img");
                    	var thumbSrc = $imgItem.attr("src");
                    	var w = options.thumbW || "60px",
                    		h = options.thumbH || "40px";
                    	var $navItem = $('<li><img name="thumbImgs" width="'+w+'" height="'+h+'" src="'+thumbSrc+'"/></li>');
                        $navItem.data('sid',n);
                        var hTimer = 0;
                        $navItem.click(function(){
                            self._slideTo($ele,$(this).data('sid'));
                        });
                        $navItem.hover(function(){
                            if(vars.running || vars.stop)return false;
                            var _self = $(this);
                            if(_self.hasClass(vars.selectedNavStyle))return false;
                            //vars.slideTimer:用于组件销毁
                            vars.slideTimer = hTimer = setTimeout(function(){self._slideTo($ele,_self.data('sid'));},options.delayTime);
                        },function(){
                            clearTimeout(hTimer);
                        });
                        $nav.append($navItem);
                        $item = $item.next();
                    }
                    $ele.append($nav);
                    if(options.isNavigationInimg == false){
                    	$nav.css({bottom:'-50px'});
                    }
                }else if(options.navigationType == 'diy' || vars.diyNavHtml){
                	var diyId = options.diyNavigationId;
                	$ele.append(vars.diyNavHtml);
                	vars.navigationStyle = '.'+$("#"+diyId).attr("class");
                	var $nav = $("#"+diyId),
        				$navItem = $nav.children(":first");
                	for(n=0;n<vars.totalSlides;n++){
                        $navItem.data('sid',n);
                        var hTimer = 0;
                        $navItem.click(function(){
                            //if(vars.running)return false;
                            self._slideTo($ele,$(this).data('sid'));
                        });
                        $navItem.hover(function(){
                            if(vars.running || vars.stop)return false;
                            var _self = $(this);
                            if(_self.hasClass(vars.selectedNavStyle))return false;
                            //vars.slideTimer:用于组件销毁
                            vars.slideTimer = hTimer = setTimeout(function(){self._slideTo($ele,_self.data('sid'));},options.delayTime);
                        },function(){
                            clearTimeout(hTimer);
                        });
                        $navItem = $navItem.next();
                    }
                }
        },

        /** 切换图片导航小图标选中样式 */
        _toggleNavigationStyle : function($ele, index){
        	var	options = this.options,
        		vars = options.vars;
            var navItems = $ele.find(vars.navigationStyle).children();
            navItems.each(function(n){
                $(this).toggleClass(vars.selectedNavStyle,n==index);
            });
        },
        _initDirectionIcon : function($ele){
            var self = this,
            	options = this.options,
            	vars = options.vars;
            var directionNav = $('<div class="'+vars.pre+'slider-directionNav">').appendTo($ele);
            $('<a class="'+vars.pre+'slider-prevNav"></a>').appendTo(directionNav).click(function(){
                if(vars.running)return false;
                self._prev($ele);
            });
            $('<a class="'+vars.pre+'slider-nextNav"></a>').appendTo(directionNav).click(function(){
                if(vars.running)return false;
                self._next($ele);
            });
            $ele.hover(function(){
                directionNav.show();
            },function(){
                directionNav.hide();
            });
        },
        /** 切换至指定图片，index从0开始 */
        _slideTo : function($ele, index){
    	   var self = this,
    	       options = this.options,
    	       vars = options.vars;
           var $container = $ele.find('ul.'+vars.pre+'slider-content:first');
           if(isNaN(index) || index < 0 || index >= vars.totalSlides){
               return;
           }
           if (this._trigger("onBeforeSlide",null,index) === false) {
               return false;
           }
           if(options.animEffect == 'slide-x' || options.animEffect == 'slide-y'){
        	   self._runSlideEffect($ele, index);
           }

           if(options.animEffect == 'fade'){
        	   self._runFadeEffect($ele, index);

           }

           if(vars.navigationStyle){
        	   self._toggleNavigationStyle($ele, index);
           }
           vars.nowSlide = index;
           return $ele;
        },
        /** 动画：垂直切换 or 水平切换 */
        _runSlideEffect : function($ele, index, animEffect){
           var _self = this,
               options = this.options,
               vars = options.vars;
           var $container = $ele.find('ul.'+vars.pre+'slider-content:first'),
               $item = $container.children(),
               top = 0,
               left = 0;
           var animEffectnow = animEffect ? animEffect : options.animEffect;
           $container.stop();
           if(animEffectnow == 'slide-y' || animEffectnow == 'slide-x'){
               var slideY = (animEffectnow == 'slide-y');
               $item.each(function(n){
                   if(n == index) return false;
                   slideY ? top -= $(this).height() : left -= $(this).width();
               });
           } else{
               return false;
           }
           vars.running = true;
           $container.animate({top:top,left:left},options.animSpeed,function(){
               vars.running = false;
               _self._trigger("onAfterSlide",null,index);
           });
        },
        /** 动画：淡入淡出 */
        _runFadeEffect : function($ele,index){
        	var _self = this,
            	options = this.options,
            	vars = options.vars;
           	var items = $ele.find('ul.'+vars.pre+'slider-content:first').children();
           	items.each(function(n){
           		var $child = $(this);
           		if(n == index){
           			vars.running = true;
           			$child.fadeIn(options.animSpeed,function(){
           				vars.running = false;
           				_self._trigger("onAfterSlide",null,index);
           			});
           		} else if(n == vars.nowSlide){
                   $child.fadeOut(options.animSpeed);
           		}
           	});
        },
        _next : function($ele){
        	var options = this.options,
    			vars = options.vars,
                next_index = 0;
            if(vars.nowSlide+2 <= vars.totalSlides){
                next_index = vars.nowSlide + 1;
            }
            return this._slideTo($ele,next_index);
        },
        _prev : function($ele){
        	var options = this.options,
				vars = options.vars,
                index = vars.totalSlides - 1;
            if(vars.nowSlide != 0){
                index = vars.nowSlide - 1;
            }
            return this._slideTo($ele,index);
        },
        /**
         * 切换到指定index的图片。
         * @name aeSlider#slideTo
         * @function
         * @param index 图片的索引
         * @example
         * //切换到第三个图片
         * $('#slider').aeSlider('slideTo', 2);
         */
        slideTo : function(index) {
            options = this.options;
            this._slideTo(this.element,index);
        },
        /**
         * 切换到下一个图片。
         * @name aeSlider#next
         * @function
         * @example
         * $('#slider').aeSlider('next');
         */
        next : function(){
            options = this.options;
            this._next(this.element);
        },
        /**
         * 切换到上一个图片。
         * @name aeSlider#prev
         * @function
         * @example
         * $('#slider').aeSlider('prev');
         */
        prev : function(){
            options = this.options;
            this._prev(this.element);
        },
        destroy : function(){
        	var $ele = this.element,
        		options = this.options,
        		vars = options.vars;
        	clearTimeout(vars.slideTimer);
        	clearInterval(vars.autoPlayTimer);
        	/*if(vars.customNav){
        		$(options.navigationType).children().unbind('.aeSlider').removeData('sid').removeClass(options.selectedNavStyle);
        	}*/
        }
    });
//})(jQuery);
});

define('ui-popup',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";

	 $.aries.popup={
		initCount : 0,
		type:'',
	    _popupSettings:function(popupTitle,popupWidth,popupHeight,ss){
	        return {
					 appendTo:ss.appendTo || 'body',
	        		 autoOpen: true,
	 		  		 modal: ss.modal,
	 		  		 width:popupWidth || '800',
	 		  		 height:popupHeight || 'auto',
	 		  		 title:popupTitle || '',
	 		  		 popupType:ss.popupType || '',
	 		  		 draggable:ss.draggable,
	 		  		 resizable:ss.resizable,
	 		  		 showClose:ss.showClose,
	 		  		 showButton:ss.showButton,
					 confirmButtonText:ss.confirmButtonText,
					 cancelButtonText:ss.cancelButtonText,
	 		  		 elementId:ss.elementId,
	 		  		 componentType:!ss.showTitle ? "message" : "",
	 		  		 beforeClose:$.aries.popup._buildEvent(ss.onBeforeClose),
	 		  		 close:$.aries.popup._buildEvent(ss.onClose,true),
	 		  		 confirm:$.aries.popup._buildEvent(ss.onConfirm),
					 afterInit: ss.afterInit
	         };
		},
		_buildEvent:function(param,flag){
			var obj = '',array = $.aries.page.data._paramArray,_privateArray = $.aries.page.data._privateArray;
			if(param){
				obj = function(event){
				    if(flag){
				    	if(array.length>0){
				    		 array.pop();
				    	}else{
				    		 $.aries.page.data._removeHidedData("ae_popup_Id");
				    	}
					    $.aries.page.data._removeHidedData("ae_popup_param");
					    if($.aries.popup.type==='page'){
						    $.aries.popup.initCount--;
					    }
					    if($.isArray(_privateArray) && _privateArray.length>0){
			        	    _privateArray.pop();
		        		}
				    }
					var i = param.indexOf("(");
					var actName = i>0 ? param.substring(0, i) : param;
					var func = "return window."+actName+"?"+actName+".call(window,e):false;";
					return new Function("e",func)(event);
				};
			}else{
				if(flag){
					obj = function(){
				    	 if(array.length>0){
				    		 array.pop();
				    	 }else{
				    		 $.aries.page.data._removeHidedData("ae_popup_Id");
				    	 }
						 $.aries.page.data._removeHidedData("ae_popup_param");
						 if($.aries.popup.type==='page'){
							 $.aries.popup.initCount--;
						 }
						 if($.isArray(_privateArray) && _privateArray.length>0){
			        		 _privateArray.pop();
		        		 }
					};
				}
			}
			return obj;
		},
		openPage:function(popupSource,popupParam,popupTitle,popupWidth,popupHeight,settings){
			var ss=$.extend(true,{},$.extend({
				modal:true,
				draggable:false,
				resizable:false,
				showClose:true,
				showButton:true,
				cache:false,
				elementId:"ae_popup_div_"+$.aries.popup.initCount,
				showTitle:true
			 },settings));
			 if(popupSource){
				    var cfg = $.aries.popup._popupSettings(popupTitle,popupWidth,popupHeight,ss);
				    if(popupParam){
				        $.aries.page.data._setHidedData("ae_popup_param",popupParam);
				    }
	      		 	$.ajax(popupSource, {
	    		 		cache: ss.cache,
	    		 		success: function(data, textStatus, jqXHR){
	    		 			$('<div id="ae_popup_div_'+$.aries.popup.initCount+'"></div>').appendTo(document.body);
	  		        	    $("#ae_popup_div_"+$.aries.popup.initCount).aeDialog(cfg);
	  		        	    var obj=$.extend(true,{},$.extend({
	  					       elementId:"ae_popup_div_"+$.aries.popup.initCount
	  					    },ss));
	  		        	    $.aries.page.data._paramArray.push(obj);
	  		        	    $.aries.page.data._setHidedData("ae_popup_Id",$.aries.page.data._paramArray);
	    		 			$("#ae_popup_div_"+$.aries.popup.initCount).html(data);
	    		 			if(typeof $.popupConfirmEvent == 'function'){
	    		 				var array = $.aries.page.data._privateArray;
	    		 				array.push($.popupConfirmEvent);
	    		 			}
	    		 			$.aries.common.globalInit("ae_popup_div_"+$.aries.popup.initCount);
	    		 			$.aries.popup.type='page';
	    		 			$.aries.popup.initCount++;
	    		 		},
	    		 		error: function(jqXHR, textStatus, errorThrown){
	    		 		}
	    		 	});
	         }
		},
		openDiv:function(popupSource,popupTitle,popupWidth,popupHeight,settings){
			 var ss=$.extend(true,{},$.extend({
				modal:true,
				draggable:false,
				resizable:false,
				showClose:true,
				showButton:true,
				popupType:'div',
				elementId:popupSource,
				showTitle:true
			 },settings));
			 if(popupSource){
				 var cfg = $.aries.popup._popupSettings(popupTitle,popupWidth,popupHeight,ss);
				 if(ss.initAfterAction){
				     var i = ss.initAfterAction.indexOf("(");
					 var actName = i>0 ? ss.initAfterAction.substring(0, i) : ss.initAfterAction;
					 var func = "return window."+actName+"?"+actName+".call(window):false;";
					 new Function(func)();
				 }
				 $("#"+popupSource).aeDialog(cfg);

				 var obj=$.extend(true,{},$.extend({
					    elementId:popupSource
					 },ss));
				 $.aries.page.data._paramArray.push(obj);
				 $.aries.page.data._setHidedData("ae_popup_Id",$.aries.page.data._paramArray);
				 $.aries.popup.type='div';
	         }
		},
	    closePage:function(json){
	        var paramArray = $.aries.page.data._getHidedData("ae_popup_Id");
		    if(!$.isArray(paramArray) || paramArray.length<0)return;
		    var ss = paramArray[paramArray.length-1];
		    $("#"+ss.elementId).aeDialog('close');
			var afterAction = ss.afterAction;
			if(json){
				if(afterAction){
					var i = afterAction.indexOf("(");
					var actName = i>0 ? afterAction.substring(0, i) : afterAction;
					var func = "return window."+actName+"?"+actName+".call(window,j):false;";
					new Function("j",func)(json);
				}
			}
	   },
	   closeDiv:function(json){
		    var paramArray = $.aries.page.data._getHidedData("ae_popup_Id");
		    if(!$.isArray(paramArray) || paramArray.length<0)return;
		    var ss = paramArray[paramArray.length-1];
		    $("#"+ss.elementId).aeDialog('close');
			var afterAction = ss.afterAction;
			if(json){
				if(afterAction){
					var i = afterAction.indexOf("(");
					var actName = i>0 ? afterAction.substring(0, i) : afterAction;
					var func = "return window."+actName+"?"+actName+".call(window,j):false;";
					new Function("j",func)(json);
				}
			}
	   },
	   getParam:function(){
		   return $.aries.page.data._getHidedData("ae_popup_param") || '';
	   },
	   setParam:function(data){
		   return $.aries.page.data._setHidedData("ae_popup_param",data);
	   }
	 };
	 $.openPopupPage = $.aries.popup.openPage;
	 $.closePopupPage = $.aries.popup.closePage;
	 $.openPopupDiv = $.aries.popup.openDiv;
	 $.closePopupDiv = $.aries.popup.closeDiv;
	 $.getPopupParam = $.aries.popup.getParam;
	 $.setPopupParam = $.aries.popup.setParam;
});

define('ui-tips',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
//;(function($){
	 $.aeWidget('ae.aeTips', {
		 options:{
		   /**
             * 设置是否显示不再显示链接。
             * @type Boolean
             * @default true
             * @example
	         */
			showLink : true,
		    /**
             * 设置是否显示关闭按钮。
             * @type Boolean
             * @default true
             * @example
             */
			showClose : true,
		   /**
             * 设置提示框背景颜色，默认为黄色。
             * @type Boolean
             * @default true
             * @example
             */
			showType : 'alert',
            /**
             * tips初始化方式，默认通过html来设置参数。传值为js时，则通过js中设置的option来初始化。
             * @type String
             * @default 'html'
             * @example
             * $('#mytips').aeTips({initType : 'js'});
             */
            initType : 'html'
		 },
		 _create:function(){
			 var opts=this.options,
			 	$ele=this.element,
				id=$ele.attr("id");
			if(id){
				$ele.attr("aeId",id);
			}
			 if(opts.initType=='html'){
	             this._buildOptions(opts,$ele);
	         }
			 $ele.addClass('alert');
			 $('<i class="icon-close pull-right"></i>').appendTo($ele);
		 },
		 _init:function(){
			 var self = this,opts = self.options,$ele=self.element,
			     deleteObj = $ele.find('>i');
			 if(opts.content){
				 $ele.prepend(opts.content);
			 }
			 if(!opts.showClose){
				 deleteObj.hide();
			 }

			 if(opts.showType === 'alert'){
				 $ele.addClass('alert-warning');
			 }
			 if(opts.showType === 'success'){
				 $ele.addClass('alert-success');
			 }
             if(opts.showType === 'error'){
            	 $ele.addClass('alert-danger');
			 }
             if(opts.showType === 'confirm'){
            	 $ele.addClass('alert-info');
             }
             deleteObj.on('click',function(){
            	 $ele.hide();
             });
		 },
		 _buildOptions:function(options,element){
			 options.content = $.evalI18nString(element.attr("content"));
	         options.showClose = element.attr("showClose")=='false' ? false : options.showClose;
	         options.showType = element.attr("showType") || options.showType;
	     },
	     setContent:function(content){
	    	 if(content){
	    		var $ele = this.element;
	    		$ele.html(content);
				$('<i class="icon-close pull-right"></i>').appendTo($ele);
				$ele.find('>i').on('click',function(){
	            	 $ele.hide();
	             });
	    	 }
	     }
  });
//})(jQuery);

});

/**
 * Created by Harwin on 2016/4/8.
 * toggle组件
 * @module ui-toggle
 */
define('ui-toggle', function (require, exports, moudle) {
    $.aeWidget('ae.aeToggle', {
        /**
         * 可选项
         * @name ae.aeToggle.options
         * @property {object} options
         * @property {string} options.initType 初始化类型 html or js
         * @property {string}  options.onoff toggle组件默认的设置 on or off
         * @property {string} options.size toggle组件的大小 md or lg
         * @property {string} options.color toggle组件的颜色  primary ,success,warning,danger,dark
         * @property {function} options.onValueChange toggle组件切换状态时触发的方法
         *
         * */
        options: {
            initType: "html",
            "onOff": "on",
            'size': 'md',
            'color': 'primary',
            "onValueChange": null,
            'event':'toggle',
        },
        _create: function () {
            var self = this,
                options = self.options,
                $ele = self.element,
                id = $ele.attr("id");

            if (id) {
                $ele.attr("aeId", id);
            }
            this._buildOptions(options, $ele);
        },
        _init: function () {
            var self = this, options = self.options, $ele = self.element;
            var switcher, checkbox, span;
            switcher = $('<label></label>');
            switcher.addClass('i-switch');
            switcher.addClass('i-switch-' + options.size);
            switcher.addClass('i-switch-' + options.color);
            checkbox = $('<input type="checkbox" checked><span></span>');
            switcher.html(checkbox);
            $ele.html(switcher);
            if (options["onOff"] === "off") {
                switcher.find('input[type="checkbox"]').prop('checked', false);
            } else {
                switcher.find('input[type="checkbox"]').prop('checked', true);
            }
            switcher.on('click', 'input', function () {
                self.toggle();
                if (options.onValueChange) {
                    options.onValueChange && self._trigger("onValueChange", null);
                }

            });
        },
        _buildOptions: function (options, element) {
            options.aeType = element.attr("aeType") || "aeToggle";
            options.onOff = element.attr("onOff") || options.onOff;
            options.size = element.attr("size") || options.size;
            options.color = element.attr("color") || options.color;
            if (!$.isFunction(options.onValueChange)) {
                var onValueChange = element.attr("onValueChange");
                options.onValueChange = onValueChange ? function (event) {
                    if ($.isString(onValueChange)) {
                        var i = onValueChange.indexOf("(");
                        var actName = i > 0 ? onValueChange.substring(0, i) : onValueChange;
                        var func = "return window." + actName + "?" + actName + ".call(window,e):false;";
                        return new Function("e", func)(event);
                    }
                } : '';
            }


        },
        toggle:function(){
            var $ele= this.element,active,options= this.options;
            active = $ele.find('input[type="checkbox"]').prop('checked') ? 'on' : 'off';
            $ele.trigger(options['event'], active);
        },
        getValue: function () {
            var $ele = this.element;
            return $ele.find('input[type="checkbox"]').prop('checked') ? 'on' : 'off';
        },
        setValue: function (value) {
            var $ele = this.element, checkbox;
            checkbox = $ele.find('input[type="checkbox"]');
            if (value === 'on') {
                checkbox.prop('checked', true);
            } else if (value === 'off') {
                checkbox.prop('checked', false);
            }
        }
    });
});

define('ui-include',function (require, exports, moudles) {
	"require:nomunge,exports:nomunge,moudles:nomunge";
//;(function($){

	$.aeWidget('ae.aeInclude', {
		options:{
			/**
             * 防止重复初始化
             * @type Boolean
             * @default false
             */
    		_initial : false,
            /**
             * aeTextarea初始化方式，默认通过html来设置参数。传值为js时，则通过js中设置的option来初始化。
             * @type String
             * @default 'html'
             * @example
             * $('.selector').aeTextarea({initType : 'js'});
             */
            initType : 'html'
		},
		_create:function(){
			var ops=this.options,
				ele=this.element,
				id=ele.attr("id");

			if(ops._initial){
				return;
	        }else{
	            ops._initial = true;
	        }
			if(id){
				ele.attr("aeId",id);
			}
			if(ops.initType=='html'){
				this._buildOptions(ops,ele);
			}
		},
		_init:function(){
			var ops = this.options,ele=this.element;
			if(!ops.url)
				return;

			$.includeHtml(ele,ops.url,ops.callback);
		},
		_buildOptions:function(options,ele){
			options.id = ele.attr('id') || '';
			options.aeType = ele.attr('aeType') || 'aeInclude';
			options.url = ele.attr('url') || '';
			options.callback = ele.attr('callback') || undefined;
			var callback = options.callback;
			options.callback = callback ? function(event){
				if($.isString(callback)){
					if(callback.substring(0, 1) == '$'){
						eval(callback);
					}else{
						var i = callback.indexOf("(");
						var actName = i>0 ? callback.substring(0, i) : callback;
						var func = 	"return window."+actName+"?"+actName+".call(window,e):false;";
						return new Function("e",func)(event);
					}
				}
	    	}: undefined;
		}
	});
//})(jQuery);
});

define('ui-currency',function (require, exports, moudles) {
    "require:nomunge,exports:nomunge,moudles:nomunge";
/*
 * Depends:
 *  ui-core.js
 */
var aeCurrency = $.aeWidget( "ae.aeCurrency", {
    _init: function() {
    	var el = this.element,
    		currencyKey,
    		isUsed = $.aries.config ? $.aries.config.common.IS_USE_TENANT : false;
    	if(isUsed){
    		currencyKey = $.aries.config.tenant ? $.aries.config.tenant.CURRENCY_KEY : '';
    		currency = currencyKey ? $.cookie(currencyKey) : '';
    		if (currency && currency.length ) {
                el.html(currency);
            }
    	}
    }
});

});
