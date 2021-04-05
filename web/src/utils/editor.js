export const snippet2draft = (snippet) => {
  return `# ${snippet.Title}
Tags: ${snippet.Tags}

## Code
\`\`\` ${snippet.Language}
${snippet.Code}
\`\`\`

## Description
${snippet.Description}`;
};

export const draft2snippet = (draft) => {
  let lines = draft.split('\n');
  let firstTripleBacktickPos = 0;
  let secondTripleBacktickPos = 0;
  for (let i = 2; i < lines.length; i++) {
    if (lines[i].trim().startsWith('```')) {
      if (firstTripleBacktickPos === 0) {
        firstTripleBacktickPos = i;
      } else {
        secondTripleBacktickPos = i;
        break;
      }
    }
  }
  let descriptionStartPos = 0;
  for (let i = secondTripleBacktickPos + 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      if (lines[i].trim().startsWith('#')) {
        descriptionStartPos = i + 1;
      } else {
        descriptionStartPos = i;
      }
      break;
    }
  }

  return {
    Language: lines[firstTripleBacktickPos].substr(3).trim(),
    Title: lines[0].substr(1).trim(),
    Code: lines
      .slice(firstTripleBacktickPos + 1, secondTripleBacktickPos)
      .join('\n'),
    Description: lines.slice(descriptionStartPos).join('\n'),
    Tags: lines[1].split(' ').slice(1).join(' '),
  };
};
