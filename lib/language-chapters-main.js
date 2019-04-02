"use babel";

var language = require('./language-chapters');

module.exports = {
  // The basic regular expression string used to find chapters functions
  // chaptersFnRegEx: '\\b[\\w_\\-]+\\b/',

  // The base URL used for documentation reference for chapters functions
  urlBase: 'https://chapterswiki.com/index.php/',

  // Base functions page
  // fnBase: 'https://chapterswiki.com/index.php/Category:Functions',

  // Language syntax
  syntax: language,

  // Grammars Added
  grammarsAdded: false,

  // Configuration
  config: {
    // highlightVegas: {
    //   type: 'boolean',
    //   'default': true
    // },
    // highlightNVSE: {
    //   "type": "boolean",
    //   "default": true
    // },
    // highlightFOSE: {
    //   "type": "boolean",
    //   "default": true
    // },
    // highlightNX: {
    //   "type": "boolean",
    //   "default": true
    // },
    // highlightLutana: {
    //   "type": "boolean",
    //   "default": true
    // },
    // highlightJIP: {
    //   "type": "boolean",
    //   "default": true
    // }
  },

  /**
   * This is the primary required function for an exported module. This
   * function invokes _getSelectedText with a regular expression string
   * used to determine the name of the function in question and then
   * takes that matching text and opens a web browser to that page if
   * skandasoft's browser-plus package is installed.
   */
  activate: function(state) {
    // atom.commands.add(
    //   'atom-text-editor',
    //   'language-chapters:lookup',
    //   this.lookupSelected.bind(this)
    // );
    //
    // atom.commands.add(
    //   'atom-text-editor',
    //   'language-chapters:toggleFOSE',
    //   this.toggleConfig.bind(this, 'language-chapters.highlightFOSE')
    // );
    //
    // atom.commands.add(
    //   'atom-text-editor',
    //   'language-chapters:toggleVegas',
    //   this.toggleConfig.bind(this, 'language-chapters.highlightVegas')
    // );
    //
    // atom.commands.add(
    //   'atom-text-editor',
    //   'language-chapters:toggleNVSE',
    //   this.toggleConfig.bind(this, 'language-chapters.highlightNVSE')
    // );
    //
    // atom.commands.add(
    //   'atom-text-editor',
    //   'language-chapters:toggleNX',
    //   this.toggleConfig.bind(this, 'language-chapters.highlightNX')
    // );
    //
    // atom.commands.add(
    //   'atom-text-editor',
    //   'language-chapters:toggleLutana',
    //   this.toggleConfig.bind(this, 'language-chapters.highlightLutana')
    // );
    //
    // atom.commands.add(
    //   'atom-text-editor',
    //   'language-chapters:toggleJIP',
    //   this.toggleConfig.bind(this, 'language-chapters.highlightJIP')
    // );

    this.updateGrammars();
  },

  toggleConfig: function(config, event) {
    var value = atom.config.get(config);
    atom.config.set(config, !value);
    this.updateGrammars();
  },

  retry: 0,

  updateGrammars: function() {
    // Obtain the highlight flags
    var cfg = atom.config.get('language-chapters');

    // Supplement grammer
    var grammar = atom.grammars.selectGrammar('source.chapters');

    // No fucking idea why 'source.chapters' isn't working...
    if (!grammar || !grammar.rawPatterns && this.retry % 2 == 1) {
      grammar = atom.grammars.selectGrammar('source.chapter');
    }

    if (!grammar || !grammar.rawPatterns) {
      setTimeout(this.updateGrammars.bind(this), 5 * 1000);
      console.log(`[language-chapters] Grammar not yet available, trying again in 5s (${this.retry})`);
      this.retry = this.retry + 1;
      return;
    } else {
      console.log(grammar);
      console.log(grammar.rawPatterns);
    }

    // Remove dynamic grammars
    // for (let a = grammar.rawPatterns, i = 0; i < a.length; i++) {
    //   if (a[i].___type && a[i].___type === 'dynamic') {
    //     a.splice(i, 1);
    //     i--;
    //   }
    // }

    var patterns = [
      [true, 'keyword.control', [language.keywords]]
    ];

    for (let set of patterns) {
      let [condition, name, getSetParams] = set;
      if (condition) {
        this.addPattern(grammar.rawPatterns, name, getSetParams);
      }
    }

    // Update everything
    if (grammar.includedGrammarScopes.indexOf(grammar.scopeName) === -1) {
      grammar.includedGrammarScopes.push(grammar.scopeName);
    }

    grammar.grammarUpdated(grammar.scopeName);

    console.log(grammar);
    console.log(grammar.rawPatterns);
  },

  /**
   * Adds a pattern to make the grammar a bit more dynamic. The patterns
   * added by this function can be determined by the unique triple underscore
   * type property. This makes it easier to find these properties as well
   * as manage them as situations arise.
   *
   * @param patterns a reference to the grammar.rawPatterns array
   * @param name a set of class names that will be applied to the span denoting
   * any matches found by the pattern.
   * @param getSetParams an array of arguments used with the chapters-language
   * getSet() function.
   * @return the same array that was passed into the function as patterns
   */
  addPattern: function(patterns, name, getSetParams) {
    patterns[patterns.length] = {
      match: language.getSet(...getSetParams),
      name: name,
      ___type: 'dynamic'
    };

    return patterns;
  },

  /**
   * The purpose of this method is to seek out the selected text,
   * determined by the regex string supplied and invoke the supplied
   * callback, executeOn, for each match. The value of the selected
   * text will be supplied as the only parameter to executeOn.
   *
   * @param regex a regular expression in string format
   * @param executeOn a function receiving a single parameter which
   * denotes the selected text in the editor.
   */
  _getSelectedText: function(regex, executeOn) {
    var body, col, cursor, editor, end, filePattern;
    var line, m, opts, range, selection, start, text, _i, _len, _ref;

    editor = atom.workspace.getActiveTextEditor();

    filePattern = new RegExp(regex, 'g');

    _ref = editor.getSelections();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      selection = _ref[_i];
      range = selection.getBufferRange();

      if (range.isEmpty()) {
        cursor = selection.cursor;
        line = cursor.getCurrentBufferLine();
        col = cursor.getBufferColumn();
        opts = {
          wordRegex: new RegExp(regex)
        };
        start = cursor.getBeginningOfCurrentWordBufferPosition(opts);
        end = cursor.getEndOfCurrentWordBufferPosition(opts);
        range = new Range(start, end);
      }

      text = editor.getTextInBufferRange(range);
      if (text.match(/\s/)) {
        text = "";
      }

      executeOn(text);
    }
  }
};
