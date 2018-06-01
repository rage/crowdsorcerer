// @flow

export default (errorMessages: Array<Object>) => {
  const markers = [];

  errorMessages.forEach((error) => {
    if (!error.header.includes('Virheet testeissä')) {
      error.messages.forEach((m) => {
        let inSourceCode;
        if (m.message.includes('lähdekoodissa')) {
          inSourceCode = true;
        } else {
          inSourceCode = false;
        }
        markers.push({
          inSourceCode,
          line: (m.line - 1),
          char: m.char,
        });
      });
    }
  });
  return markers;
};
