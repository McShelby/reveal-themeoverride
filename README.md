# reveal.js-themeoverride

A [reveal.js](https://github.com/hakimel/reveal.js/) plugin to override the themes of reveal.js and highlight.js with an URI query parameter or from inside of your configuration.

URI parameter come in handy if you just want to try out new themes without editing your presentation file. 

Configuration parameter are useful if you have further plugins installed like [AltMode](https://github.com/McShelby/reveal-altmode) to toggle between different themes during your live presentation.

## Installation

Copy this repository into the plugins folder of your reveal.js presentation, ie ```plugin/themeoverride```.

Add the plugin to the dependencies in your presentation, as below.

```javascript
Reveal.initialize({
	// ...
	dependencies: [
		// ...
		{ src: 'plugin/themeoverride/themeoverride.js', async: true },
	]
});
```

To be able to override themes, you may need to edit your HTML file.

- The reveal.js  ```<link>``` element needs an ```id``` attribute of ```theme```.
- The highlight.js ```<link>``` element needs an ```id``` attribute of ```hljs-theme```.

```html
<head>
	...
	<link rel="stylesheet" href="css/theme/black.css" id="theme">
	<link rel="stylesheet" href="lib/css/zenburn.css" id="hljs-theme">
	...
</head>
```

The value for this ```id``` is not configurable. It must be ```theme``` and ```hljs-theme``` respectivly otherwise the plugin will not find the stylesheets in your presentation file.

Please remember that no other highlight.js themes besides ```zenburn.css``` are shipped with the standard reveal.js package. You may want to install further highlight.js themes from [https://highlightjs.org/](https://highlightjs.org/) into the ```lib/css/``` directory.

## Usage

After installation theme settings are allowed in different places. The theme applied to your presentation is the first found from the following list:

1. URI parameter
1. Configuration parameter
1. ```<link>``` element

### Parameter

URI and configuration parameter names are the same as the given ids from their ```<link>``` elements, namely ```theme``` and ```hljs-theme```. Their values may contain one of the following:

- a style name (eg. ```serif```). The plugin will append ```.css``` to the name and tries to access the file from the directory ```css/theme``` (for reveal.js themes) or ```lib/css``` (for highlight.js themes) relative to your reveal.js installation.

- a stylesheet filename (eg. ```serif.css```). The plugin will try to access the file from the directory ```css/theme``` (for reveal.js themes) or ```lib/css``` (for highlight.js themes) relative to your reveal.js installation.

- a relative path with filename (eg. ```../my-reveal-addons/serif.css```). The plugin will try to access the file relative to your reveal.js installation.

Because of the dash in the highlight.js id you have to put the name of its parameter into quotes.

```javascript
Reveal.initialize({
	// ...

	// Overrides the theme set in <link> element by the
	// given value. If your presentation was copied from reveal.js
	// demo.html, everything just works. Otherwise you need to
	// set id="theme" on reveal.js theme <link> element.
	theme: 'serif.css',

	// Overrides the highlight.js theme set in <link> element by the
	// given value. This only works if you set id="hljs-theme" on the
	// <link> element.
	'hljs-theme': '../highlight/styles/monokai',
});
```

### URI parameter example

```
http://example.com/demo.html?theme=serif.css&hljs-theme=../highlight/styles/monokai
```

## API

### CSS

To apply style overrides depending on the displayed themes, the plugin will add the names of choosen themes to the ```<body>``` ```class``` attribute like:

```html
...
<body class="theme-serif hljs-theme-monokai"
...
```

### Javascript

The plugin API is accessible from the global ```ThemeOverride``` object.

```javascript
// Change a config value at runtime
ThemeOverride.configure({
	theme: 'serif.css',
	'hljs-theme': '../highlight/styles/monokai',
});
```

## License

[WTFPL licensed](http://www.wtfpl.net/).

Copyright (C) 2018 [Sören Weber](https://github.com/McShelby)
