var ThemeOverride = ( function( _Reveal ){

	var Reveal = _Reveal;
	var isHighlightJsUsed = null;
	var constants = [{
		id: 'theme',        // id attribute of link element
		parameter: 'theme', // URL parameter name
		option: 'theme',    // reveal configuration option name
		path: null, // standard path to css file - dependend on reveal version
	},{
		// deprecated settings for compat, don't move this setting
		// so our new settings will overwrite deprecated ones
		id: 'hljs-theme',
		parameter: 'hljs-theme',
		option: 'hljs-theme',
		path: null, // standard path to css file - dependend on reveal version
	},{
		// preparation for reveal 4.x
		id: 'highlight-theme',
		parameter: 'highlightTheme',
		option: 'highlightTheme',
		path: null, // standard path to css file - dependend on reveal version
	}];

	function getFixedRevealConfig(){
		// fix reveals inaccurate transfer of URI paramter into
		// the config options; it removes the last dash and anything
		// before it from a parameter name
		var o = Reveal.getConfig();
		var url_doc = new URL( document.URL );
		var query_doc = new URLSearchParams( url_doc.searchParams );
		constants.forEach( function( c ){
			var i = c.parameter.lastIndexOf( '-' );
			var q = query_doc.get( c.parameter );
			if( i != -1 && q ){
				var false_parameter_name = c.parameter.substring( i+1 );
				if( o[ false_parameter_name ] == q ){
					delete o[ false_parameter_name ];
				}
			}
		});
		return o;
	}

	function isHighlightJsUsed3(){
		var regex = /\bhighlight.js$/i;
		var script = Array.from( document.querySelectorAll( 'script' ) ).find( function( e ){
			return e.attributes.src && e.attributes.src.value.search( regex ) >= 0;
		});
		return !!script;
	}

	function isHighlightJsUsed4(){
		return Reveal.hasPlugin( 'highlight' );
	}

	function getRevealJsPath(){
		var regex = /\b[^/]+\/reveal.css$/i;
		var script = Array.from( document.querySelectorAll( 'link' ) ).find( function( e ){
			return e.attributes.href && e.attributes.href.value.search( regex ) >= 0;
		});
		if( !script ){
			console.error( 'reveal.css could not be found in included <link> elements. Did you rename this file?' );
			return '';
		}
		return script.attributes.href.value.replace( regex, '' );
	}

	function applyTheme( c, theme ){
		var link = document.querySelector( '#' + c.id );
		if( !link ){
			if( c.id == 'theme' ){
				console.error( '<link> element with id attribute ' + c.id + ' was not found in your HTML file.' );
			}else if( theme && isHighlightJsUsed() ){
				console.error( 'highlight.js stylesheet link not found in your HTML file. This usually happens when you haven\'t set the id "highlight-theme" on your syntax highlightning stylesheet link.' );
			}
			return;
		}else if( c.id == 'hljs-theme' && theme && isHighlightJsUsed() ){
			console.warn( 'You are using the deprecated "hljs-theme" id on your syntax highlightning stylesheet link. Instead use "highlight-theme".' );
		}

		if( !theme ){
			// if someone hasn't set an configuration option we
			// try to get the theme from our link element
			theme = link.attributes.href && link.attributes.href.value;
		}

		if( theme ){
			if( !theme.match( /\.css$/i ) ){
				theme += '.css';
			}
			var path = c.path + theme;
			if( theme.match( /\// ) ){
				path = theme;
			}else{
				path = getRevealJsPath() + path;
			}

			// echo our new setting into the reveal configuration
			// to make it available for other plugins
			var config = {};
			config[ c.option ] = path;
			Reveal.configure( config );

			var body = document.querySelector( 'body' );
			var old_name = body.getAttribute( 'data-' + c.id );
			if( !old_name ){
				// if we are coming here for the first time, we
				// do not have a data-attribute; so just read the
				// previous theme name form the link element directly
				var old_path = link.attributes.href && link.attributes.href.value;
				old_name = old_path.replace( /.*?([^/]+)\.css$/i, '$1' );
			}

			var name = path.replace( /.*?([^/]+)\.css$/i, '$1' );
			if( old_name != name ){
				// set the new stylesheet
				setTimeout( function(){
					// FF 74: After switching a theme using the AltMode plugin during
					// runtime, we experience layout issues with to much top
					// margin; decoupling the switching seems to help
					link.setAttribute( 'href', path );
				}, 10 );
			}

			// set theme class on body element
			body.setAttribute( 'data-' + c.id, name );
		}
	}

	function applyThemeConfig( c, o ){
		if( !o || o !== Object(o) ){
			return;
		}
		applyTheme( c, o[ c.option ] );
	}

	function applyThemeParameter( c, o ){
		var url_doc = new URL( document.URL );
		var query_doc = new URLSearchParams( url_doc.searchParams );
		applyTheme( c, query_doc.get( c.parameter ) || o[ c.option ] );
	}

	function configure( o ){
		constants.forEach( function( c ){
			applyThemeConfig( c, o );
		});
	}

	function install(){
		var o = getFixedRevealConfig();
		constants.forEach( function( c ){
			applyThemeParameter( c, o );
		});
	}

	var Plugin = {
		configure: configure
	}

	if( Reveal && Reveal.VERSION && Reveal.VERSION.length && Reveal.VERSION[ 0 ] == '3' ){
		// reveal 3.x
		isHighlightJsUsed = isHighlightJsUsed3;
		constants[ 0 ].path = 'css/theme/';
		constants[ 1 ].path = 'lib/css/';
		constants[ 2 ].path = 'lib/css/';
		install();
	}else{
		// must be reveal 4.x
		isHighlightJsUsed = isHighlightJsUsed4;
		constants[ 0 ].path = 'dist/theme/';
		constants[ 1 ].path = 'plugin/highlight/';
		constants[ 2 ].path = 'plugin/highlight/';
		Plugin.id = 'theme-override';
		Plugin.init = function( _Reveal ){
			Reveal = _Reveal;
			install();
		};
	}

	return Plugin;

})( Reveal );
