// @flow

const assertTrue = 'String viesti = "Kun syöte oli: \'<placeholderInput>\', tulostus oli: \'" + metodinTulostus + '
                    + '"\', mutta se ei sisältänyt: \'<placeholderOutput>\'.";\n    '
                    + 'assertTrue(viesti, metodinTulostus.contains("<placeholderOutput>"));';
const assertFalse = 'String viesti = "Kun syöte oli: \'<placeholderInput>\', tulostus oli: \'" + metodinTulostus + '
                    + '"\', mutta se sisälsi: \'<placeholderOutput>\'.";\n    '
                    + 'assertFalse(viesti, metodinTulostus.contains("<placeholderOutput>"));';
const assertEquals = 'String viesti = "Kun syöte oli: \'<placeholderInput>\', tulostus oli: \'" + metodinTulostus + '
                    + '"\', mutta se ei ollut: \'<placeholderOutput>\'.";\n    '
                    + 'assertEquals(viesti, "<placeholderOutput>", metodinTulostus);';
// const assertNotEquals = 'String viesti = "Kun syöte oli: \'<input>\', tulostus oli: \'" + metodinTulostus + '
//                     + '"\', mutta se ei saanut olla: \'<output>\'.";\n    '
//                     + 'assertNotEquals("<output>", metodinTulostus);';

export default (testType: string) => {
  switch (testType) {
    case 'contains':
      return assertTrue;

    case 'notContains':
      return assertFalse;

    case 'equals':
      return assertEquals;

      // not supported:
    // case 'notEquals':
    //   return assertNotEquals;

    default:
      return assertTrue;
  }
};
