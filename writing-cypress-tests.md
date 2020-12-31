Now that we've learned how to configure Cypress in our Express applications and written our first test, let's write tests for a web app with a bit more functionality!

### Learning Goals

- Identify what we need to write tests for
- Write and run our first acceptance tests for an Express web application

### Getting Started

```
et get writing-cypress-tests
cd writing-cypress-tests
yarn install
code .
```

Below, we'll start to navigate around our app and discuss its different features for testing. You'll notice that Cypress has been pre-configured for you.

### What do we want to Test?

When writing acceptance tests, we can refer back to the user stories we've looked at previously. We know that when building our web applications, we want to use user stories and acceptance criteria in order to organize our thoughts before building new features!

In this project directory, we have provided an application which keeps track of our users' favorite running road races. Let's consider our first user story:

```no-highlight
As a runner
I want to see a list of the best road races
So I can plan my own future races

Acceptance Criteria:
* When a user navigates to `/road-races`, they see a header that says "Our Favorite Road Races"
* They should also see an unordered list with the name of each marathon and its distance
* At the bottom of the list should be a link to add a new road race, which navigates to `/road-races/new`
```

If we run `yarn run dev`, we can boot up our application and take a look at the functionality. When we navigate to http://localhost:3000/road-races, we see our page load up with two road races listed. It's important to keep this server running, even as we run our tests -- Cypress actually sends requests directly to our server, so we need to make sure it's active while testing!

Feel free to poke around the code a bit, but remember that as far as acceptance testing goes, we don't care about the code so much as the functionality! We see that our page is in full working order, but we want to write some tests to make sure it stays that way. As a best practice, we can use our user story to do so. We will want to make sure our tests cover everything listed under our "Acceptance Criteria" as shown above.

Notice that we've added a `cypress` directory in our project directory, with the typical configuration, plus some files under `cypress/fixtures`. This directory allows us to store data needed to run our tests, and we will store our test files in the `cypress/integration` directory.

This user story has to do with our `/road-races` routes, so let's add a subdirectory of `integration` called `roadRaces`, and inside of that directory, add a new file `01_userViewsRoadRacesIndex.spec.js`. Remember that Cypress expects our test files to end with `.spec.js`, so we want to adhere to that convention!

Inside of that file, place the following code:

```javascript
// cypress/integration/roadRaces/01_userViewsRoadRacesIndex.spec.js

/// <reference types="cypress" />

context("Road Races Index", () => {
  beforeEach(() => {
    cy.visit("/road-races")
  })

  it("has a header", () => {
    // test that the header appears here
  })

  it("lists all road races", () => {
    // test to make sure road races are listed in the format we expect
  })

  it("has a link to go to the new road race form", () => {
    // test to make sure the link exists and brings us to the right place
  })
})
```

As a reminder, the first line here (`/// <reference types="cypress" />`) is going to be included in each of our test files: it simply gives us access to the methods we need from our Cypress library. After that, we use a `context` block to indicate that this test is for the Road Races Index page, and three `it` blocks to describe the specific behavior we expect to see at that page. Finally, we use a `beforeEach` block to tell our test to visit our index page at `http://localhost:3000/road-races` before running each individual test.

As of right now, we have some tests but we're not actually asserting any information about our pages! Using some Cypress helper methods such as `.get()` and `.find()` to find elements, and `.should()` to check its contents, let's update our first `it` block to make it actually look for our header on the page:

```javascript
it("has a header", () => {
  cy.get("h1")
    .should("have.text", "Our Favorite Road Races")
})
```

Once again, we're using `cy.get("h1")` to select our header on the page, and then using `should` to check the text of that header.

Let's add tests to check for our road races on the page, as well:

```javascript
it("lists all road races", () => {
  cy.get(".road-races")
    .find("li")
    .first()
    .should("have.text", "Disney Princess Half Marathon - 13.1 Miles")

  cy.get(".road-races")
    .find("li")
    .eq(1)
    .should("have.text", "Moab Trail Marathon - 26.2 Miles")
})
```

In the above, we're still using `get()` and `should()`. This time, we're passing a class into our `get()` call, using `".road-races"` to isolate our unordered list. We're also using `find("li")` to find all list items inside of that list. Finally, we use `first()` to grab the first `li`, and `eq(1)` to find the `li` with an index of `1` in our list. Since we know our page will load up the races found in `roadRaces.json` by default, we test for the presence of those two races.

Finally, let's add our test for the link to our new road race page.

```javascript
it("has a link to go to the new road race form", () => {
  cy.get("a")
  .should("have.text", "Add a new Road Race")
  .should("have.attr", "href", "/road-races/new")
})
```

We're still using `get()` and `should()` to check the presence of the link on the page. This time, however, we're using Cypress chaining to check both the `text` of the anchor tag, and its `href`! We know that typically we hand in two arguments to `should`, but this time we're passing it three: what we're checking (an attribute with `attr`), what it should be (`href`), and what its value should be (our relative path of `/road-races/new`).

Another nice feature of Cypress is that, if we're chaining assertions together, we can make it even more readable by using the `and` chainer! We can _refactor_ our last `it` block to instead be the following:

```javascript
it("has a link to go to the new road race form", () => {
  cy.get("a")
  .should("have.text", "Add a new Road Race")
  .and("have.attr", "href", "/road-races/new")
})
```

Finally, one last fun way we could test this link is to actually make Cypress click on it! We could choose instead to update this `it` block to the following:

```javascript
it("has a link to go to the new road race form", () => {
  cy.get("a")
  .should("have.text", "Add a new Road Race")
  .click()

  cy.url()
  .should("eq", "http://localhost:3000/road-races/new")
})
```

We're getting fancy with Cypress functionality! By using click(), we get Cypress to click on the link in question. After clicking, we're able to use url() and should() to make sure it brought us to the proper page! Arguably, our initial approach was better because it allowed for our tests to check the link without switching pages - but it's good to know that we have options.

Now that we have our index page tests set up, let's actually run these tests and see their output! Run `yarn run test:open` in a second terminal tab, and your Cypress console should open up in a separate window. In this console, you should see something like the below:

![Image of Cypress console with roadRaces directory and existing test file inside][cypress-console-image]

Go ahead and click on the `Run all specs` link in the top right corner to run our three new tests. Assuming all is working as expected, our three tests should all pass, and we'll see three nice green check marks in the left-hand panel! Let's move on to our second user story.

### Testing Forms

Our index page is now tested, but it was fairly simple - all we had to do was check the contents of the page. Let's add some more complexity by testing our New Road Race page, where our user has to actually interact with our page. We'll start with our user story:

```no-highlight
As a runner
I want to be able to add a road race to the list
So I can keep track of my favorites

Acceptance Criteria:
- When I navigate to `/road-races/new`, I see a form to add a new road race
- The form should take in a Name, number of miles, and location
- On submit, the new road race should persist
- I should be redirected back to the index page, where I can now see my new race on the list
```

Great - we've obtained our acceptance criteria, so now we need to add some tests. Add a second file in `cypress/integration/roadRaces`, called `02_userAddsNewRoadRace.spec.js`. Inside of it, add the below code:

```javascript
// article/acceptance-testing-with-cypress/cypress/integration/roadRaces/02_userAddsNewRoadRace.spec.js

/// <reference types="cypress" />

import newRoadRace from "../../fixtures/newRoadRace.json";
import starterRoadRaces from "../../fixtures/starterRoadRaces.json";
const roadRacesFilePath = "roadRaces.json"

context("Road Races New", () => {
  beforeEach(() => {
    cy.visit("/road-races/new")
  })

  it("adds a road race to the list upon submitting the form", () => {
    // test filling in the form and submitting here
  })

  afterEach(() => {
    cy.writeFile(roadRacesFilePath, JSON.stringify(starterRoadRaces))
  })
})
```

Once again, we've told our test file to visit our page using `cy.visit()`. While we're not asserting anything just yet, if we go to our Cypress page in Chrome and click the Refresh icon in the left-hand console, we should see this test show up and show as passing.

We can see three constants above our `context` block: we're importing two fixtures (`newRoadRace` and `starterRoadRaces`), and declaring the `roadRacesFilePath`. Since we're going to be filling in and submitting a form, we want to have access to the data we want to _add_, and once our test is done, we want to _clean up_ after it by setting our `roadRaces.json` file back to the way it was pre-testing. _Fixtures_ are files that can store data for us, so that we can use that data in our various test files. By storing our `newRoadRace` data in a fixture, we minimize typos and could reuse it in future tests if we needed to.

In our `afterEach` block, we're resetting our `roadRaces.json` file back to its original state using `cy.writeFile`, which is very similar to `fs.writeFileSync`, but operates within our Cypress tests. We use a fixture (`starterRoadRaces`) to store the starting state of that file, so we can always restore it. It's worth noting that this will always reset our `roadRaces.json` back to its beginning state of just two races. It certainly isn't ideal to allow our tests to alter our development-environment data storage! Once we move on to databases, we will learn more about how to keep two entirely separate databases for our tests vs our development environment using node environments. However, for now, we can continue to alter our development data storage using our tests, as long as we're careful to clean up after ourselves when we're done.

Now that our test is configured, let's add some functionality into our `it` block:

```javascript
it("adds a road race to the list upon submitting the form", () => {
  cy.get("#name")
    .type(newRoadRace.name).should("have.value", newRoadRace.name)

  cy.get("#miles")
    .type(newRoadRace.miles).should("have.value", newRoadRace.miles)

  cy.get("#location")
    .type(newRoadRace.location).should("have.value", newRoadRace.location)

  cy.get(".button").should("have.value", "Save this Race!")

  cy.get(".new-race-form")
    .submit()

  cy.url()
    .should("eq", "http://localhost:3000/road-races")

  cy.get(".road-races")
    .find("li")
    .last()
    .should('have.text', `${newRoadRace.name} - ${newRoadRace.miles} Miles`)
})
```

Similar to how we used the `click()` function previously, we can use the `type()` function to type into our form. In each of these lines, we're getting the input field using its id, typing into it using the data from our fixture, and simultaneously checking that it updated our form using `should("have.text", ...)`. Finally, we target our form using `get(".new-race-form")`, and `submit()` it.

Once submitted, we check two things: first, we make sure that we were redirected back to our index page on submit. Second, we make sure our new road race is now showing up using a similar assertion to our index page tests!

Save your file and hard-refresh your Cypress page in Chrome. You should be able to watch as Cypress loads up and fills in the form, as well as see your updated index page on submit. All tests should still be passing. You can now close down your test runner in your terminal using `Ctrl` + `c`.

### Why This Matters

When writing acceptance tests, it's important to know exactly what we want to write tests for. By referring to our user stories, we can isolate the user experience that we want to test for. Cypress gives us functions which allow us to test for many different types of user interaction and feedback.

### In Summary

We've now added automated acceptance tests to our application using Cypress. We tested two user stories: one for our index page, and the other for our new road race form. Using Cypress, we were able to visit our pages, query for certain elements, assert information such as their text, and type and click in certain locations on our page. We have only brushed the surface of what we can do using Cypress. Check the links in "Resources" below for common assertions and 

### Resources
- [Cypress Docs][cypress-docs]
- [Common Cypress Assertions][cypress-docs-assertions]
- [Cypress API Docs: Table of Contents with all Commands][cypress-docs-toc]

[cypress-docs]: https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell
[cypress-docs-assertions]: https://docs.cypress.io/guides/references/assertions.html#Common-Assertions
[cypress-docs-toc]: https://docs.cypress.io/api/api/table-of-contents.html
[cypress-console-image]: https://s3.amazonaws.com/horizon-production/images/article/writing-cypress-tests/cypress_console.png
