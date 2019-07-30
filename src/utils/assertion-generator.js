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

const pythonAssertIn = 'expected_output = \'<placeholderOutput>\'\n'
  + '    self.assertIn(expected_output, actual_output)';
const pythonAssertNotIn = 'expected_output = \'<placeholderOutput>\'\n'
  + '    self.assertNotIn(expected_output, actual_output)';
const pythonAssertEqual = 'expected_output = \'<placeholderOutput>\'\n'
  + '    self.assertEqual(expected_output, actual_output)';

export default (testType: string, language: string) => {
  switch (testType) {
    case 'contains':
      return language === 'Python' ? pythonAssertIn : assertTrue;

    case 'notContains':
      return language === 'Python' ? pythonAssertNotIn : assertFalse;

    case 'equals':
      return language === 'Python' ? pythonAssertEqual : assertEquals;

    default:
      return assertTrue;
  }
};
