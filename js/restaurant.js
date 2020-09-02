/* eslint-disable import/extensions */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-cycle */
import { deleteChild } from './utils.js';

export class Restaurant {
  constructor(restaurantName, address, lat, long, ratings, averageRating, id) {
    this.restaurantName = restaurantName;
    this.address = address;
    this.lat = lat;
    this.long = long;
    this.ratings = ratings;
    this.averageRating = averageRating;
    this.id = id;
    this.addedRatings = [];
  }
}


/* FORMATING CLICKED RESTAURANT */

export function formatingClickedRestaurant(element, restaurantId) {
  const mainDiv = document.createElement('DIV');
  const reviewButton = document.createElement('button');
  deleteChild(restaurantId);
  // Add review button //
  reviewButton.innerHTML = 'Ajouter un avis';
  reviewButton.className += 'clickedRestaurantaddReview';
  reviewButton.id += element.address;
  // Get restaurant ratings and comment //
  let restaurantRatings = '';
  for (const rating of element.ratings) {
    restaurantRatings += `<p id="clickedRestaurantStar">${rating.stars} : ${rating.comment}</p><div id="line"><hr></div></div>`;
  }
  // Add restaurants infos //
  mainDiv.className += 'clickedRestaurant';
  mainDiv.innerHTML = `<h3 class="restaurantName" id="clickedRestaurantNameAndAverage"> Restaurant: ${element.restaurantName}</br>
  ${element.averageRating}</h3>
  <img id="clickedRestaurantImg" src="https://maps.googleapis.com/maps/api/streetview?size=80x80&location=${element.lat},${element.long}&heading=151.78&pitch=-0.76&key=AIzaSyBXxKDdKYUSGOwh2Iek_07J6cfcMeQRjf8"/>
  <div id="clickedRestaurantStarAndComment">${restaurantRatings}`;
  return { reviewButton, mainDiv };
}


/* FORMATING AND DISPLAY RESTAURANT ON LEFT LIST */

export function createRestaurantOnList(element) {
  const child = document.createElement('DIV');
  // Add restaurants infos //
  child.className += 'restaurant';
  child.innerHTML = `
    <h4>Restaurant: ${element.restaurantName}</h4></br> 
    <h4>${element.address}</h4></br>
    <h4 style='font-size:14px'>Moyenne: ${element.averageRating}</h4></br>
    <div id="line"><hr></div>`;
  const restaurantList = document.getElementById('restaurantList');
  restaurantList.appendChild(child);
}
