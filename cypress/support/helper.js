import {faker} from '@faker-js/faker';

export function generateRandomPet(petObject, isIdChanged = false, isNameChanged = true, isCategoryChanged = true, isTagsChanged = true, isStatusChanged = false){

    isIdChanged ? petObject.id = faker.number.int({min: 90000, max: 9000000}) : petObject.id;
    isNameChanged ? petObject.name = faker.animal.dog() : petObject.name;
    isCategoryChanged ? petObject.category.name = faker.animal.type() : petObject.category.name;
    isCategoryChanged ? petObject.category.id = faker.number.int({min: 9000, max: 900000}) : petObject.category.id;
    isTagsChanged ? petObject.tags[0].name = faker.animal.bear() : petObject.tags[0].name;
    isTagsChanged ? petObject.tags[0].id = faker.number.int({min: 9000, max: 900000}) : petObject.tags[0].id;
    isTagsChanged ? petObject.tags[1] = petObject.tags[0] : petObject.tags[1];
    isTagsChanged ? petObject.tags[1].name = faker.animal.cat() : petObject.tags[1].name;
    isTagsChanged ? petObject.tags[1].id = faker.number.int({min: 9000, max: 900000}) : petObject.tags[1].id;
    isStatusChanged ? petObject.status = ['available', 'pending', 'sold'][Math.floor(Math.random() * 3)] : petObject.status;

    return petObject;
}