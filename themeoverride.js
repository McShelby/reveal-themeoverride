var ThemeOverride = ( function( Reveal ){

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

	function applyThemeInternal( link_selector, default_path, theme ){
		var link = document.querySelector( '#' + link_selector );
		if( !link ){
			if( link_selector != 'hljs-theme' ){
				console.error( '<link> element with id attribute ' + link_selector + ' was not found in your HTML file.' );
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
			var path = default_path + theme;
			if( theme.match( /\// ) ){
				path = theme;
			}else{
				path = getRevealJsPath() + path;
			}

			var settings = {};
			settings[ link_selector ] = path;
			Reveal.configure( settings );
			if( !link.attributes.href || link.attributes.href.value != path ){
				link.setAttribute( 'href', path );
			}

			var old_name = old_path.replace( /.*?([^/]+)\.css$/i, '$1' );
			var name = path.replace( /.*?([^/]+)\.css$/i, '$1' );
			if( old_name != name ){
				document.querySelector( 'body' ).classList.remove( link_selector + '-' + old_name );
			}
			document.querySelector( 'body' ).classList.add( link_selector + '-' + name );
		}
	}

	function applyTheme( theme ){
		applyThemeInternal( 'theme', 'css/theme/', theme );
	}

	function applyThemeParameter(){
		var url_doc = new URL( document.URL );
		var query_doc = new URLSearchParams( url_doc.searchParams );
		applyTheme( query_doc.get( 'theme' ) );
	}

	function applyHljsTheme( theme ){
		applyThemeInternal( 'hljs-theme', 'lib/css/', theme );
	}

	function applyHljsThemeParameter(){
		var url_doc = new URL( document.URL );
		var query_doc = new URLSearchParams( url_doc.searchParams );
		applyHljsTheme( query_doc.get( 'hljs-theme' ) );
	}

	function configure( o ){
		if( o && o.theme !== undefined ){
			applyTheme( o && o[ 'theme' ] );
		}
		if( o && o[ 'hljs-theme' ] !== undefined ){
			applyHljsTheme( o && o[ 'hljs-theme' ] );
		}
	}

	function install(){
		applyThemeParameter();
		applyHljsThemeParameter();
	}

	install();

	return {
		configure: configure
	};

})( Reveal );
