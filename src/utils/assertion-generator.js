// @flow

const assertTrue = 'String viesti = "Kun syöte oli: \'<input>\', tulostus oli: \'" + metodinTulostus + '
                    + '"\', mutta se ei sisältänyt: \'<output>\'.";\n    '
                    + 'assertTrue(viesti, metodinTulostus.contains("<output>"));';
const assertFalse = 'String viesti = "Kun syöte oli: \'<input>\', tulostus oli: \'" + metodinTulostus + '
                    + '"\', mutta se sisälsi: \'<output>\'.";\n    '
                    + 'assertFalse(viesti, metodinTulostus.contains("<output>"));';
const assertEquals = 'String viesti = "Kun syöte oli: \'<input>\', tulostus oli: \'" + metodinTulostus + '
                    + '"\', mutta se ei ollut: \'<output>\'.";\n    '
                    + 'assertEquals(viesti, "<output>", metodinTulostus);';
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
