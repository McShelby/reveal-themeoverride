var ThemeOverride = ( function( Reveal ){

	var constants = [{
		id: 'theme',        // id attribute of link element
		parameter: 'theme', // URL parameter name
		option: 'theme',    // reveal configuration option name
		path: 'css/theme/', // standard path to css file
	},{
		id: 'hljs-theme',
		parameter: 'hljs-theme',
		option: 'hljs-theme',
		path: 'lib/css/',
	}];

	function isHighlightJsUsed(){
		var regex = /\bhighlight.js$/i;
		var script = Array.from( document.querySelectorAll( 'script' ) ).find( function( e ){
			return e.attributes.src && e.attributes.src.value.search( regex ) >= 0;
		});
		return !!script;
	}

	function getRevealJsPath(){
		var regex = /\bjs\/reveal.js$/i;
		var script = Array.from( document.querySelectorAll( 'script' ) ).find( function( e ){
			return e.attributes.src && e.attributes.src.value.search( regex ) >= 0;
		});
		if( !script ){
			console.error( 'reveal.js script could not be found in included <script> elements. Did you rename this file?' );
			return '';
		}
		return script.attributes.src.value.replace( regex, '' );
	}

	function applyTheme( c, theme ){
		var link = document.querySelector( '#' + c.id );
		if( !link ){
			if( c.id == 'theme' ){
				console.error( '<link> element with id attribute ' + c.id + ' was not found in your HTML file.' );
			}else if( isHighlightJsUsed() ){
				console.error( 'highlight.js stylesheet link not found in your HTML file. This usually happens when you haven\'t set the id "hljs-theme" to your highlight.js stylesheet link.' );
			}
			return;
		}

		var old_path = link.attributes.href && link.attributes.href.value;
		if( !theme ){
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

			// set the new stylesheet
			if( !link.attributes.href || link.attributes.href.value != path ){
				link.setAttribute( 'href', path );
			}

			// set theme class on body element
			var old_name = old_path.replace( /.*?([^/]+)\.css$/i, '$1' );
			var name = path.replace( /.*?([^/]+)\.css$/i, '$1' );
			if( old_name != name ){
				document.querySelector( 'body' ).classList.remove( c.id + '-' + old_name );
			}
			document.querySelector( 'body' ).classList.add( c.id + '-' + name );
		}
	}

	function applyThemeConfig( c, o ){
		if( !o || o !== Object(o) ){
			return;
		}
		applyTheme( c, o[ c.option ] );
	}

	function applyThemeParameter( c ){
		var url_doc = new URL( document.URL );
		var query_doc = new URLSearchParams( url_doc.searchParams );
		applyTheme( c, query_doc.get( c.parameter ) );
	}

	function configure( o ){
		constants.forEach( function( c ){
			applyThemeConfig( c, o );
		});
	}

	function install(){
		constants.forEach( function( c ){
			applyThemeParameter( c );
		});
	}

	install();

	return {
		configure: configure
	};

})( Reveal );
