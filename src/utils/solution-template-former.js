const scopeModifiersRegex = /^(\bpublic\b|\bprotected\b|\bprivate\b)/;
// const otherModifiersRegex = /(\bpublic\b|\bprotected\b|\bprivate\b|\bstatic\b|\bfinal\b|\bsynchronized\b|\bnative\b|\bstaticfp\b)(.*)/;
const otherModifiers = ['static', 'final', 'synchronized', 'native', 'staticfp'];
const stopWordsRegex = ['class', 'void'];

// function isUninteresting(word: string) {
//   const cmp = word.localeCompare(';') || word.localeCompare('class') || word.localeCompare('void');

//   return cmp === 0;
// }

function isMethodDefinitonWithReturnType(words: Array<string>) {
  if (words.length > 0) {
    const word = words[0];
    const noReturnValue = word.localeCompare('class') === 0 || word.localeCompare('void') === 0;
    const isMethodCall = words[words.length - 1].localeCompare(';') === 0 || word.includes(';') || word.includes('(');
    let methodSyntaxException = false;
    if (words[1]) {
      methodSyntaxException = words[1].charAt(0) === '(';
    }
    return !noReturnValue && !isMethodCall && !methodSyntaxException;
  }
  return false;
}

export default function formSolutionTemplate(modelSolution: string, solutionRows: Array<number>) {
  const lines = modelSolution.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (scopeModifiersRegex.test(line)) {
      const wordsInLine = line.split(' ');
      let trimmedWordsInLine = wordsInLine.filter(Boolean);
      trimmedWordsInLine = trimmedWordsInLine.slice(1);
      const nonModifiers = trimmedWordsInLine.filter(word => (
        !otherModifiers.includes(word)
      ));
      if (isMethodDefinitonWithReturnType(nonModifiers)) {
        console.log('olen palautustyyppi: ' + nonModifiers[0]);
      } else {
        console.log('en ole palautustyyppi');
      }
    }
  }
}

// Lisää Begin ja End -tagit piilotettavien rivien alkuun ja loppuun

// Tarkista piilotettavaksi merkattavista riveistä, sisältävätkö ne
// return-käskyä
// --> etsi näiden return statementtien tyyppi metodin allekirjoituksesta
// lisää piilotettavan returnin jälkeen uusi return-lause,
// jossa oikean tyyppinen arvo
