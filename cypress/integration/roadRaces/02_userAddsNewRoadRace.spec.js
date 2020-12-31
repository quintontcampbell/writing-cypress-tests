// article/acceptance-testing-with-cypress/cypress/integration/roadRaces/02_userAddsNewRoadRace.spec.js

/// <reference types="cypress" />

import newRoadRace from '../../fixtures/newRoadRace.json';
import starterRoadRaces from '../../fixtures/starterRoadRaces.json';
const roadRacesFilePath = 'roadRaces.json';

context('Road Races New', () => {
	beforeEach(() => {
		cy.visit('/road-races/new');
	});

	it('adds a road race to the list upon submitting the form', () => {
		cy.get('#name').type(newRoadRace.name).should('have.value', newRoadRace.name);

		cy.get('#miles').type(newRoadRace.miles).should('have.value', newRoadRace.miles);

		cy.get('#location').type(newRoadRace.location).should('have.value', newRoadRace.location);

		cy.get('.button').should('have.value', 'Save this Race!');

		cy.get('.new-race-form').submit();

		cy.url().should('eq', 'http://localhost:3000/road-races');

		cy
			.get('.road-races')
			.find('li')
			.last()
			.should('have.text', `${newRoadRace.name} - ${newRoadRace.miles} Miles`);
	});

	afterEach(() => {
		cy.writeFile(roadRacesFilePath, JSON.stringify(starterRoadRaces));
	});
});
