import {faker} from '@faker-js/faker';
import petTemplate from '../fixtures/pets.json';
import {generateRandomPet} from '../support/helper';



let pet = generateRandomPet(petTemplate, true, true, true, true, true)

describe('Pet test suite', () => {

  let petId;

  it('Add a new pet to the store', () => {
    cy.log('Create pet');
    cy.request('POST', '/pet', pet).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body.name).to.eq(pet.name);
      expect(response.body.category.id).to.eq(pet.category.id);
      expect(response.body.category.name).to.eq(pet.category.name);
      expect(response.body.tags[0].id).to.eq(pet.tags[0].id);
      expect(response.body.tags[0].name).to.eq(pet.tags[0].name);
      expect(response.body.tags[1].id).to.eq(pet.tags[1].id);
      expect(response.body.tags[1].name).to.eq(pet.tags[1].name);
      expect(response.body.status).to.eq(pet.status);
      // expect(response.body).to.deep.eq(pet);//сравнит 2 Джейсона перетвори на стрингу и сравнить их

      cy.log('Save petId');
      petId = response.body.id;//берет id по созданному pet

      cy.log('Get pet by id and verify pet created');
      cy.request('GET', `/pet/${petId}`).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq(pet.name);
        expect(response.body.category.id).to.eq(pet.category.id);
        expect(response.body.category.name).to.eq(pet.category.name);
        expect(response.body.tags[0].id).to.eq(pet.tags[0].id);
        expect(response.body.tags[0].name).to.eq(pet.tags[0].name);
        expect(response.body.tags[1].id).to.eq(pet.tags[1].id);
        expect(response.body.tags[1].name).to.eq(pet.tags[1].name);
        expect(response.body.status).to.eq(pet.status);
      })
    })


  })

  it('Update pet', () => {
    cy.log('Update pet');


    pet = generateRandomPet(pet, false, true, true, true, false);

    cy.request('PUT', '/pet', pet).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body.name).to.eq(pet.name);
      expect(response.body.category.id).to.eq(pet.category.id);
      expect(response.body.category.name).to.eq(pet.category.name);
      expect(response.body.tags[0].id).to.eq(pet.tags[0].id);
      expect(response.body.tags[0].name).to.eq(pet.tags[0].name);
      expect(response.body.tags[1].id).to.eq(pet.tags[1].id);
      expect(response.body.tags[1].name).to.eq(pet.tags[1].name);
      expect(response.body.status).to.eq(pet.status);
      // expect(response.body).to.deep.eq(pet);

      cy.log('Get pet by id and verify pet updated');
      cy.request('GET', `/pet/${petId}`).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq(pet.name);
        expect(response.body.category.id).to.eq(pet.category.id);
        expect(response.body.category.name).to.eq(pet.category.name);
        expect(response.body.tags[0].id).to.eq(pet.tags[0].id);
        expect(response.body.tags[0].name).to.eq(pet.tags[0].name);
        expect(response.body.tags[1].id).to.eq(pet.tags[1].id);
        expect(response.body.tags[1].name).to.eq(pet.tags[1].name);
        expect(response.body.status).to.eq(pet.status);
      })
    })
  })

  it('Find pet by status', () => {
    cy.log('Find pet by status');
    cy.request('GET', `/pet/findByStatus?status=${pet.status}`).then(response => {
      expect(response.status).to.eq(200);

      response.body.forEach(pet => {
        expect(pet.status).to.eq(pet.status);
      })

      let petFound = response.body.filter(pet => pet.id === petId);
      expect(petFound.length).to.eq(1);
    })
  })

  it('Update pet with form data', () => {

    pet.name = faker.animal.cat();
    pet.status = 'new'

    cy.log('Update pet with form data');
    cy.request({
      method: 'POST', url: `/pet/${petId}`, form: true, body: {
        petId: petId, name: pet.name, status: pet.status
      }
    }).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body.code).to.eq(200);
      expect(response.body.message).to.eq(`${pet.id}`);

      cy.log('Get pet by id and verify pet updated');
      cy.request('GET', `/pet/${petId}`).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq(pet.name);
        expect(response.body.category.id).to.eq(pet.category.id);
        expect(response.body.category.name).to.eq(pet.category.name);
        expect(response.body.tags[0].id).to.eq(pet.tags[0].id);
        expect(response.body.tags[0].name).to.eq(pet.tags[0].name);
        expect(response.body.tags[1].id).to.eq(pet.tags[1].id);
        expect(response.body.tags[1].name).to.eq(pet.tags[1].name);
        expect(response.body.status).to.eq(pet.status);
      })
    })
  })

/*HOMEWORK ----------------------------------------------------------------------------*/

  it('Uploads an image', () => {
    cy.log('Uploads an image');

  cy.fixture('pet-image.jpg', 'binary').then(image => {
    const blob = Cypress.Blob.binaryStringToBlob(image, 'image/jpeg');
    const formData = new FormData();

    formData.append('file', blob, 'pet-image.jpg');

    cy.request({
      method: 'POST',
      url: `/pet/${petId}/uploadImage`,
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body).to.not.be.undefined;
      expect(response.body.code).to.eq(200);
      expect(response.body.message).to.contain('uploaded');
    });
  });
});
/* ---------------------------------------------------------------------------------------------*/

  it('Delete pet', () => {
    cy.log('Delete pet');
    cy.request({
      method: 'DELETE',
      url: `/pet/${petId}`
    }).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body.code).to.eq(200);
      expect(response.body.message).to.eq(`${petId}`);

      cy.log('Get pet by id and verify pet deleted');
      cy.request({
        method: 'GET',
        url: `/pet/${petId}`,
        failOnStatusCode: false
      }).then(response => {
        expect(response.status).to.eq(404);
        expect(response.body.code).to.eq(1);
        expect(response.body.message).to.eq('Pet not found');
      })
    })

  })
})