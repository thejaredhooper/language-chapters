"use babel";

module.exports = {
  syntax: {
    keywords: ['ch', 'chap', 'chapter'].join('|'),
  },

  getSet: function(...sets /*, allowOverloads=false */ ) {
    // var allowOverloads = false;
    //
    // var lastValue = sets[sets.length - 1];
    // if (lastValue === true || lastValue === false) {
    //   allowOverloads = sets.splice(sets.length - 1, 1);
    // }
    //
    // var result = ['(?i)\\b', allowOverloads ? '[_]?' : '', '('];
    // sets.forEach((set, index, array) => {
    //   if (index > 0) {
    //     result.push('|');
    //   }
    //   result = result.concat(set);
    // });
    // result.push(')\\b');

    var results = [];

    sets.forEach((set, index, array) => {
      if (index > 0) {
        results.push('|');
      }
      results = results.concat(set);
    })

    return results.join(''); //result.join('');
  }
};
