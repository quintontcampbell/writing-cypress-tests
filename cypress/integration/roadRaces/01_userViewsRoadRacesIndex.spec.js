// cypress/integration/roadRaces/01_userViewsRoadRacesIndex.spec.js

/// <reference types="cypress" />

context('Road Races Index', () => {
	beforeEach(() => {
		cy.visit('/road-races');
	});

	it('has a header', () => {
		cy.get('h1').should('have.text', 'Our Favorite Road Races');
	});

	it('lists all road races', () => {
		cy
			.get('.road-races')
			.find('li')
			.first()
			.should('have.text', 'Disney Princess Half Marathon - 13.1 Miles');

		cy
			.get('.road-races')
			.find('li')
			.eq(1)
			.should('have.text', 'Moab Trail Marathon - 26.2 Miles');
	});

	it('has a link to go to the new road race form', () => {
		cy.get('a').should('have.text', 'Add a new Road Race').click();

		cy.url().should('eq', 'http://localhost:3000/road-races/new');
	});
});
