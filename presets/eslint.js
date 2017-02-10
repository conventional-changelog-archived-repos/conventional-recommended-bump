var presetOpts = {
  whatBump: function(commits) {
    var level = 2;
    var breakings = 0;
    var features = 0;

    commits.forEach(function(commit) {
      commit.tag = (commit.tag || '').toLowerCase();
      if (commit.tag === 'breaking') {
        breakings += 1;
        level = 0;
      } else if (commit.tag === 'feat') {
        features += 1;
        if (level === 2) {
          level = 1;
        }
      }
    });

    return {
      level: level,
      reason: 'There are ' + breakings + ' BREAKING CHANGES and ' + features + ' features'
    };
  },
  parserOpts: {
    headerPattern: /^(\w*)\: (.*?)(?:\((.*)\))?$/,
    headerCorrespondence: [
      'tag',
      'message'
    ],
    revertPattern: /^revert:\s([\s\S]*?)\s*This reverts commit (\w*)\./,
    revertCorrespondence: ['header', 'hash']
  }
};

module.exports = presetOpts;
