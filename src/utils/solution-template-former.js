const TEMPLATE_BEGIN_TAG = '// BEGIN';
const TEMPLATE_END_TAG = '// END';
const RETURN_STATEMENT = 'return ';
const scopeModifiersRegex = /^(\bpublic\b|\bprotected\b|\bprivate\b)/;
const otherModifiers = ['static', 'final', 'synchronized', 'native', 'staticfp'];

function addTemplateTags(modelLines: string, solutionRows: Array<number>) {
  const lines = modelLines.split('\n');
  const finalLines = [];
  let addTag = false;

  for (let i = 0; i < lines.length; i++) {
    if (solutionRows.includes(i)) {
      addTag = true;

      if (finalLines.length - 1 >= 0 && finalLines[finalLines.length - 1].localeCompare(TEMPLATE_END_TAG) === 0) {
        finalLines.splice(-1, 1);
      } else {
        finalLines.push(TEMPLATE_BEGIN_TAG);
      }
    }

    finalLines.push(lines[i]);

    if (addTag) {
      finalLines.push(TEMPLATE_END_TAG);
      addTag = false;
    }
  }

  return finalLines;
}

function isMethodDefinitonWithReturnType(words: Array<string>) {
  if (words.length > 0) {
    const firstWord = words[0];
    const noReturnValue = firstWord.localeCompare('class') === 0 || firstWord.localeCompare('void') === 0;
    const isMethodCall = words[words.length - 1].localeCompare(';') === 0 || firstWord.includes(';') || firstWord.includes('(');
    let methodSyntaxException = false;

    if (words[1]) {
      methodSyntaxException = words[1].charAt(0) === '(';
    }

    return !noReturnValue && !isMethodCall && !methodSyntaxException;
  }

  return false;
}

function findMethodSignature(modelLines: Array<string>, startIndex: number) {
  const retObject = { returnType: undefined, index: -1 };

  for (let i = startIndex; i < modelLines.length; i++) {
    const line = modelLines[i].trim();
    if (scopeModifiersRegex.test(line)) {
      const wordsInLine = line.split(' ');
      let trimmedWordsInLine = wordsInLine.filter(Boolean);
      trimmedWordsInLine = trimmedWordsInLine.slice(1);
      const nonModifiers = trimmedWordsInLine.filter(word => (
        !otherModifiers.includes(word)
      ));

      if (isMethodDefinitonWithReturnType(nonModifiers)) {
        retObject.returnType = nonModifiers[0];
        retObject.index = i;
        break;
      }
    }
  }

  return retObject;
}

function generateReturnValue(type: string) {
  let returnValue;

  switch (type) {
    case 'byte':
    case 'short':
    case 'int':
      returnValue = '0';
      break;
    case 'long':
      returnValue = '0L';
      break;
    case 'float':
      returnValue = '0.0f';
      break;
    case 'double':
      returnValue = '0.0d';
      break;
    case 'boolean':
      returnValue = 'false';
      break;
    case 'char':
      returnValue = '\\u0000';
      break;
    default: returnValue = 'null';
  }

  return returnValue;
}

function findNumberOfOccurrences(line: string, searchString: string) {
  let col = 0;
  let count = 0;

  while (col !== -1) {
    col = line.indexOf(searchString, col);
    if (col >= 0) {
      count++;
      col++;
    }
  }

  return count;
}

function findEndOfMethod(modelLines: Array<string>, index: number) {
  let curlyBraceCounter = 0;
  let i = index;

  for (; i < modelLines.length; i++) {
    curlyBraceCounter += findNumberOfOccurrences(modelLines[i], '{');
    curlyBraceCounter -= findNumberOfOccurrences(modelLines[i], '}');

    if (curlyBraceCounter === 0) {
      break;
    }
  }

  return curlyBraceCounter === 0 ? i : -1;
}

function fixTemplateWithStub(modelLines: Array<string>) {
  let row = 0;

  for (; row < modelLines.length; row++) {
    const returnObject = findMethodSignature(modelLines, row);
    if (returnObject.index >= 0) {
      row = findEndOfMethod(modelLines, returnObject.index);
      if (row >= 0) {
        const type = generateReturnValue(returnObject.returnType);
        if (!modelLines[row - 1].includes(RETURN_STATEMENT)) {
          modelLines.splice(row, 0, '\treturn '.concat(type).concat(';'));
        }
        row++;
      } else {
        break;
      }
    }
  }
}

export default function formSolutionTemplate(modelSolution: string, solutionRows: Array<number>) {
  let finalLines = [];
  finalLines = addTemplateTags(modelSolution, solutionRows);
  fixTemplateWithStub(finalLines);

  const final = finalLines.join('\n');
  console.log('fixed template '.concat(final));

  return final;
}

// Lisää Begin ja End -tagit piilotettavien rivien alkuun ja loppuun

// Tarkista piilotettavaksi merkattavista riveistä, sisältävätkö ne
// return-käskyä
// --> etsi näiden return statementtien tyyppi metodin allekirjoituksesta
// lisää piilotettavan returnin jälkeen uusi return-lause,
// jossa oikean tyyppinen arvo
