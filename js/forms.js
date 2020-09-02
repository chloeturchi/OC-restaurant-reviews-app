/* eslint-disable no-param-reassign */
/* eslint-disable import/extensions */
/* eslint-disable import/no-cycle */
import { calculateAverage } from './utils.js';

/* REVIEW FORM */

// Review form manager //
export function addReviewToRestaurant(restaurants, restaurantAddress) {
  // Get reviews note and comment //
  const note = parseInt(document.forms.reviewForm.elements.note.value, 10);
  const personnalComment = document.forms.reviewForm.elements.comment.value;
  const view = { stars: note, comment: personnalComment };
  // Get the right restaurant and add the review //
  restaurants.forEach((element) => {
    if (element.address === restaurantAddress) {
      // Get the right restaurant and add the review //
      if (element.id) {
        // requested restaurant //
        element.ratings.unshift(view);
        element.addedRatings.push(view);
        const averageAddedNotes = parseInt(calculateAverage(element.addedRatings), 10);
        element.averageRating = (averageAddedNotes + element.averageRating) / 2;
      } else {
        // local restaurant //
        element.ratings.unshift(view);
        const averageNote = calculateAverage(element.ratings);
        element.averageRating = averageNote;
      }
      return element;
    }
  });
}


// Review form content //
export const reviewFormContent = `<form action="#" onsubmit="event.preventDefault()" class="reviewForm-container" id="reviewForm-container" name="reviewForm">
  <h2>Ajouter un avis</h2>
  <label for="note"><b>Votre note</b></label>
  <div class="notesContainer">
    <div class="notes">
      <label for="1">1</label>
      <input type="radio" id="1" name="note" value="1" required/>
    </div>
    <div class="notes">
      <label for="2">2</label>
      <input type="radio" id="2" name="note" value="2"/>
    </div>
    <div class="notes">
      <label for="3">3</label>
      <input type="radio" id="3" name="note" value="3"/>
    </div>
    <div class="notes">
      <label for="4">4</label>
      <input type="radio" id="4" name="note" value="4"/>
    </div>
    <div class="notes">
      <label for="5">5</label>
      <input type="radio" id="5" name="note" value="5"/>
    </div>
  </div>
  <label for="review"><b>Votre avis</b></label>
  <textarea placeholder="Votre avis" name="comment" required></textarea>
  <input type="submit" class="button" id='reviewFormSubmit' value="Valider">
  <input type="reset" class="button" id='reviewFormReset' value="Annuler">
</form>`;


// Create review form //
export function addReviewsFormManagement() {
  document.getElementById('reviewForm').innerHTML = reviewFormContent;
  document.getElementById('reviewFormReset').addEventListener('click', () => {
    document.getElementById('reviewForm-container').remove();
  });
}


// Check review form //
export function checkViewForm() {
  const { comment } = document.forms.reviewForm.elements;
  if (!comment.checkValidity()) {
    throw comment.validationMessage;
  }
}


/* NEW RESTAURANT FORM */

// New restaurant form manager //
export function getNewFormData() {
  // Get lat and lng of new Restaurant //
  const getLat = document.forms.newElementForm.elements.latitude.value;
  const getLong = document.forms.newElementForm.elements.longitude.value;
  const latitude = getLat.replace(/,/g, '.');
  const longitude = getLong.replace(/,/g, '.');
  // Create new restaurant form object with datas //
  const formData = {
    restaurantName: document.forms.newElementForm.elements.name.value,
    address: document.forms.newElementForm.elements.address.value,
    ratings: [{
      stars: parseInt(document.forms.newElementForm.elements.note.value, 10),
      comment: document.forms.newElementForm.elements.comment.value,
    }],
    lat: parseFloat(latitude, 10),
    long: parseFloat(longitude, 10),
    averageRating: parseInt(document.forms.newElementForm.elements.note.value, 10),
    id: null,
  };
  return formData;
}


// New restaurant form content //
export const newElementFormContent = `<form action="#" onsubmit="event.preventDefault()" class="newElementForm-container" id="newElementForm-container" name="newElementForm">
<h2>Ajouter un restaurant</h2>
<input id="lat" name="latitude" type="hidden" value="">
<input id="long" name="longitude" type="hidden" value="">
<label for="name"><b>Nom du restaurant</b></label>
<input type="text" placeholder="Raison Sociale" name="name" required>
<label for="adresse"><b>Adresse du restaurant</b></label>
<input type="text" placeholder="Adresse" name="address" required>
<label for="note"><b>Votre note</b></label>
<div class="notesContainer">
  <div class="notes">
    <label for="1">1</label>
    <input type="radio" id="1" name="note" value="1" required/>
  </div>
  <div class="notes">
    <label for="2">2</label>
    <input type="radio" id="2" name="note" value="2"/>
  </div>
  <div class="notes">
    <label for="3">3</label>
    <input type="radio" id="3" name="note" value="3"/>
  </div>
  <div class="notes">
    <label for="4">4</label>
    <input type="radio" id="4" name="note" value="4"/>
  </div>
  <div class="notes">
    <label for="5">5</label>
    <input type="radio" id="5" name="note" value="5"/>
  </div>
</div>
<label for="adresse"><b>Votre avis</b></label>
<textarea placeholder="Votre avis" name="comment" required></textarea>
<input type="submit" class="button" id='newElementFormSubmit' value="Valider">
<input type="reset" class="button" id='newElementFormReset' value="Annuler">
</form>`;


// Create new restaurant form //
export function newFormManagement(event) {
  document.getElementById('newElementForm').innerHTML = newElementFormContent;
  document.forms.newElementForm.elements.latitude.value = event.latLng.lat();
  document.forms.newElementForm.elements.longitude.value = event.latLng.lng();
  document.getElementById('newElementFormReset').addEventListener('click', () => {
    document.getElementById('newElementForm-container').remove();
  });
}

// Check new restaurant form //
export function checkNewForm() {
  const { name } = document.forms.newElementForm.elements;
  const { address } = document.forms.newElementForm.elements;
  const { comment } = document.forms.newElementForm.elements;
  if (!name.checkValidity()) {
    throw name.validationMessage;
  }
  if (!address.checkValidity()) {
    throw address.validationMessage;
  }
  if (!comment.checkValidity()) {
    throw comment.validationMessage;
  }
}

/* GET SELECTED NOTE FROM FORM */

export function getSelectedNote(note) {
  const htmlNotesArray = Array.from(note);
  const selectedNoteArray = htmlNotesArray.filter((element) => element.checked);
  return selectedNoteArray;
}
