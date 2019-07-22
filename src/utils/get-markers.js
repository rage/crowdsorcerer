// @flow

export default (errorMessages: Array<Object>) => {
  const markers = [];

  errorMessages.forEach((error) => {
    if (!error.header.includes('Errors in the tests')) {
      error.messages.forEach((m) => {
        let inSourceCode;
        if (m.message.includes('in the source code')) {
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
