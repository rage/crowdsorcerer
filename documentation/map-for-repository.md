# Some instructions for navigating in this repository

This repository contains the source code for the frontend of CrowdSorcerer. This document tries to explain its structure. The document is done with mainly the courses using Python and only the test-creating parts in mind.

1. Username is saved in web browser's localStorage as 'tmc.user'. Without a username saved the tool can't be used.
2. src/index.jsx handles the rendering of the app.
3. src/components/assignment-form/index.jsx is the root node for the source code and the tests.
4. The directory src/components/assignment-form contains the main components: 
    1. model-solution.jsx handles the source code
    2. test-fields.jsx and input-output-jsx handle the most simple testing mode where the student only writes the input (which can consist of multiple lines) and the expected output.
    3. io-and-code.jsx handles the testing mode, where the student gives the inputs and outputs and is shown the automatically generated test method. test-name-and-type.jsx is also related to this testing mode.
5. src/state handles the state of the app and the actions made in it. The most important files in this directory are src/state/form/actions.js and src/state/form/reducer/changes.js. src/state/form/reducer/index.js shows a lot of things that are included in the form's state, but the useful props of it are *input*, unitTests.*testArray*, *testingType* (which can be **input_output_tests_for_set_up_code** for the most simple mode and **test_for_set_up_code** for when the test methods are generated and shown to the user) and *language*.
6. The submission process is handled in src/utils/api/index.js. HTTP-POST and -GET are used to post submissions and get e.g. assignment information from the backend. The frontend and backend also form a WebSocket-connection which is used to get messages about the progress of the submission from the backend. The code for that is in src/utils/api/websocket.js.
