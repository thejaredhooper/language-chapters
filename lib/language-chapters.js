"use babel";

module.exports = {
  syntax: {
    keywords: ['States'].join('|'),
  },

  /**
   * Combines an entire set of keywords and/or function names and returns
   * them as a single string prefixed with (?i)\b, optionally adding [_]?,
   * then ( followed by the combined set of lists and ending with )\b.
   *
   * This creates a large list where each of the individual terms are included
   * in a given search. The (?i) is the way to set case insensitivity in a
   * regular expression string.
   *
   * Expected usage:
   *   var pack = atom.packages.activePackages['language-geck'].mainModule;
   *   var geck = pack.syntax;
   *   var allFns = geck.getSet(
   *         geck.geckFns,
   *         geck.vegasFns,
   *         geck.foseFns,
   *         geck.nvseFns
   *       );
   *   var blockwords = geck.getSet(geck.blocktypes, true);
   *
   * @param ...sets this is n-number of arrays of keywords, ideally from the
   * lists defined in this object.
   * @param allowOverloads if true, [_]? is prepended to the opening
   * parenthesis to allow matching of block types or other functions that
   * have different meaning with NVSE
   * @return a string denoting of the combined values.
   */
  getSet: function(...sets /*, allowOverloads=false */ ) {
    var allowOverloads = false;

    var lastValue = sets[sets.length - 1];
    if (lastValue === true || lastValue === false) {
      allowOverloads = sets.splice(sets.length - 1, 1);
    }

    var result = ['(?i)\\b', allowOverloads ? '[_]?' : '', '('];
    sets.forEach((set, index, array) => {
      if (index > 0) {
        result.push('|');
      }
      result = result.concat(set);
    });
    result.push(')\\b');

    return result.join('');
  },

  /**
   * Returns a set of terms as a regular expression. The way it does this is
   * to take results from getSet(...) and create a new RegExp() object to
   * return, using any supplied options.
   *
   * @param regExOpts a string with regular expression flags
   * @param ...sets the same parameters that would apply to this.getSet()
   * @return a valid RegExp object
   */
  getRegExp: function(...getSetParams /*, regExOpts = "i" */ ) {
    require('isa-lib')(window);

    var regExOpts = "i";

    var lastValue = getSetParams[getSetParams.length - 1];
    if (isString(lastValue) && /^[gimy]*$/.exec(lastValue)) {
      regExOpts = getSetParams.splice(getSetParams.length - 1, 1);
    }

    var regExString = this.getSet(...getSetParams).replace(/\(\?\i\)/g, '');
    var result = new RegExp(regExString, regExOpts);

    return result;
  }

};
