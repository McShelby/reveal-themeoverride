# ThemeOverride

A [reveal.js](https://github.com/hakimel/reveal.js/) plugin to easily change themes of reveal.js and its syntax highlightning.

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

- The ```<link>``` element of the reveal.js theme needs an ```id``` attribute of ```theme```.
- The ```<link>``` element of the syntax highlighting theme needs an ```id``` attribute of ```highlight-theme```.

```html
<head>
	...
	<link rel="stylesheet" href="css/theme/black.css" id="theme">
	<link rel="stylesheet" href="lib/css/zenburn.css" id="highlight-theme">
	...
</head>
```

The value for this ```id``` is not configurable. It must be ```theme``` and ```highlight-theme``` respectivly otherwise the plugin will not find the stylesheets in your presentation file.

Please remember that no other syntax highlightning themes besides ```zenburn.css``` are shipped with the standard reveal.js package. You may want to install further highlight.js themes from [https://highlightjs.org/](https://highlightjs.org/) into the ```lib/css/``` directory.

## Usage

After installation theme settings are allowed in different places. The theme applied to your presentation is the first found from the following list:

1. URI parameter
1. Configuration options
1. ```<link>``` element

### Configuration

You can configure some aspects of the plugin by adding the following options to your reveal configuration. Note that all configuration values are optional and will default to the settings from your link elements.

Configuration options are useful if you have further plugins installed like [AltMode](https://github.com/McShelby/reveal-altmode) to toggle between different themes during your live presentation.

```javascript
Reveal.initialize({
	// ...

	// Overrides the theme set in <link> element by the
	// given value. If your presentation was copied from reveal.js
	// demo.html, everything just works. Otherwise you need to
	// set id="theme" on reveal.js theme <link> element.
	theme: 'serif',

	// Overrides the syntax highlightning theme set in <link> element by the
	// given value. This only works if you set id="highlight-theme" on the
	// <link> element.
	highlightTheme: 'monokai',
});
```

### URI parameter

URI parameter come in handy if you just want to try out new themes without editing your presentation file. 

```
http://example.com/demo.html?theme=serif&highlightTheme=monokai
```

### Theme values

Values for themes may contain one of the following:

- a style name (eg. ```serif```). The plugin will append ```.css``` to the name and tries to access the file from the directory ```css/theme``` (for reveal.js themes) or ```lib/css``` (for syntax highlightning themes) relative to your reveal.js installation.

- a stylesheet filename (eg. ```serif.css```). The plugin will try to access the file from the directory ```css/theme``` (for reveal.js themes) or ```lib/css``` (for syntax highlightning themes) relative to your reveal.js installation.

- a relative path with filename (eg. ```css/theme/serif.css```). The plugin will try to access the file relative to your reveal.js installation.

## API

### CSS

To apply style overrides depending on the displayed themes, the plugin will add data attributes with the names of the active themes as values to the ```<body>``` element like:

```html
...
<body data-theme="serif" data-highlight-theme="monokai">
...
```

### Javascript

The plugin API is accessible from the global ```ThemeOverride``` object.

```javascript
// Change a config value at runtime
ThemeOverride.configure({
	// Takes the same options as for configuration
	theme: 'serif.css',
	highlightTheme: 'monokai',
});
```

## License

[MIT licensed](https://en.wikipedia.org/wiki/MIT_License).

Copyright (C) 2020 [Sören Weber](https://soeren-weber.de)
