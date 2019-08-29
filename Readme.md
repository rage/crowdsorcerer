# Crowdsorcerer

[![Build Status](https://travis-ci.org/rage/crowdsorcerer.svg?branch=master)](https://travis-ci.org/rage/crowdsorcerer)

Crowdsorcerer is a tool for crowdsourcing programming exercises for a CS1  course. It enables creating exercises and peer reviewing them through an embeddable widget. The exercises are sent to [crowdsorceress](https://github.com/rage/crowdsorceress), which uses TMC sandbox to test them, and provides error messages. Built with love using React and Redux.

See [the project map](./documentation/map-for-repository.md) for instructions on how to navigate the project.

## Getting started after cloning

1. Edit the `crowdsorcerer-widget` element in [index.html](https://github.com/rage/crowdsorcerer/blob/master/index.html) to suit your needs. Add the following attributes according to your needs:
  - For submitting an exercise
    - `data-assignment="id"` giving the id of the assignment the exercise belongs to
      -  Assignment defines the IO types for tests, code boilerplate and test template
    ```
      <div class="crowdsorcerer-widget" peer-review data-assignment='1'></div>
    ```
  - For submitting a peer review
    - `peer-review` which renders the peer review view
    - `data-assignment="id"` giving the id of the assignment from which the exercises should be drawn
    - `data-exercises="number"` giving the amount of exercises that should be given for peer review, including the possible self assessment
    ```
      <div class="crowdsorcerer-widget" peer-review data-assignment="1" data-exercises="2"></div>
    ```

2. Start crowdsorceress according the instructions in GitHub.

3. Run `yarn install` in Crowdsorcerer's project folder in order to install depedencies.

4. Run `yarn start` to start Crowdorcerer. Use `yarn test` to run tests.

5. Navigate to `localhost:3001`.

6. The system is designed to be embedded in online material. This is why one needs a token associated with a TMC user account in order to be able to use it.
    1. You can create an account [here](https://tmc.mooc.fi/user/new).
    2. Log in to the [finnish material](https://materiaalit.github.io/ohjelmointi-18/). The login button can be found in the upper right corner in blue with the label "Kirjaudu sisään".
    3. Once you are logged in, you have to acquire the information in the field `tmc.user` of your local storage. Open the browser's developer tools (press `Ctrl + Shift + i` in Chrome or right click and choose "inspect"). Type `localStorage["tmc.user"]` in the console in order to print your username and the token.
    4. Copy the JSON printed, e.g. `{"username":"test","accessToken":"ImAToken"}` (notice that the printed version has string quotes outside the curly brackets, do not copy them).
    5. Open the developer tools in `localhost:3001`. Insert the token and your username to the local storage like this: `localStorage['tmc.user'] = JSON.stringify({"username":"test","accessToken":"StillAToken"})`.

7. You should now be able to use the widget.

## Troubleshooting

If you encounter an error here are some common reasons:
- There is no data. You have to have created at least an exercise type and an assignment in order to be able to create an exercise. You can use crowdsorceress' seed data, or alternatively use the admin ui at `localhost:3000` to create some. Make sure your account is set as an admin before accessing the site. You can update a users' priviledges from the rails console. For peer reviews one has to create peer review questions for each exercise type.
- The TMC user credentials are not set properly. This will result with the error message "Please log in". Make sure that you called `JSON.stringify` when adding the credentials to Crowdsorcerer's local storage. If you received an error printed in red, the credentials are not set properly.
- No valid assignment given. If you want to create an exercise, make sure that the `crowdsorcerer-widget` element in [index.html](https://github.com/rage/crowdsorcerer/blob/master/index.html) has an attribute `data-assignment`, and an assignment with the given ID exists.
- Not enough exercises to peer review. **Exercises made by admins will not be given for peer review.** Make sure the database has exercises made by regular users for the assignment given in `data-assignment`.
- Number of exercises not set in peer review. The `crowdsorceress-widget` should have an attribute `data-exercises` stating the amount of exercises students are given in peer review.
- The submission is stuck in testing. This is usually due to a failure in the backend. Go ahead and check Crowdsorceress' logs.
