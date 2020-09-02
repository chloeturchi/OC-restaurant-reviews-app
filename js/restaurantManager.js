/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/extensions */
/* eslint-disable import/no-cycle */
import { Restaurant, createRestaurantOnList, formatingClickedRestaurant } from './restaurant.js';
import {
  requestNearbySearch, getPlaceRestaurantsObjects, getReviews,
} from './placeService.js';
import {
  maxFilter, minFilter, addFilterOptions, removeFilterOptions,
} from './filters.js';
import {
  addReviewsFormManagement, newFormManagement, addReviewToRestaurant, getNewFormData, checkNewForm, checkViewForm, getSelectedNote,
} from './forms.js';
import {
  calculateAverage, deleteChild, removeElement, removeMarkers,
} from './utils.js';

/* RESTAURANT MANAGER */

export default class RestaurantManager {
  constructor(map, google, position) {
    this.google = google;
    this.map = map;
    this.position = position;
    this.service = new google.maps.places.PlacesService(this.map);
    this.restaurants = [];
    this.storedRestaurants = [];
    this.markersToRemoveOnChange = [];
    this.restaurantListId = document.getElementById('restaurantList');
    this.restaurantClickedId = document.getElementById('restaurantClickedContainer');
  }

  /* CREATE A MARKER */

  createMarker(position, markerImg) {
    const marker = new this.google.maps.Marker({
      map: this.map,
      position,
      icon: markerImg,
    });
    return marker;
  }


  /* ADD AN INFOWINDOW ON A MARKER */

  addInfoWindowOnMarker(marker, customContent) {
    const infowindow = new this.google.maps.InfoWindow({
      content: customContent,
    });
    marker.addListener('click', () => {
      infowindow.open(this.map, marker);
    });
  }


  /* CREATE NEW RESTAURANTS INSTANCES */

  createNewRestaurantsInstances(objectsArray) {
    objectsArray.forEach((element) => {
      const newRestaurant = new Restaurant(
        element.restaurantName,
        element.address,
        element.lat,
        element.long,
        element.ratings,
        element.averageRating,
        element.id,
      );
      // Add Instances in restaurants array and sotred restaurant array //
      this.restaurants.push(newRestaurant);
      this.storedRestaurants.push(newRestaurant);
    });
  }


  /* GET PLACE RESTAURANTS AND CREATE INSTANCES OF 'RESTAURANT' */

  async placeRestaurantsManager() {
    // Nearby search request //
    const requestRestoNearby = await requestNearbySearch(this.service, this.google, this.position);
    // Create Instances of requested restaurants //
    const getPlaceRestaurants = getPlaceRestaurantsObjects(requestRestoNearby);
    return this.createNewRestaurantsInstances(getPlaceRestaurants);
  }


  /* LOCAL RESTAURANT ON INIT */

  localRestaurantsManager(localRestaurants) {
    const modifiedRestaurants = localRestaurants.map((element) => {
      // Calculate average note of local restaurants //
      const averageNote = calculateAverage(element.ratings);
      return {
        ...element,
        averageRating: averageNote,
      };
    });
    // Create instances //
    this.createNewRestaurantsInstances(modifiedRestaurants);
    // Check which local restaurant are on map and add ONLY this restaurants on array //
    this.google.maps.event.addListenerOnce(this.map, 'idle', () => {
      const filteredLocalRestaurants = this.restaurants.filter((element) => this.map.getBounds().contains({ lat: element.lat, lng: element.long }));
      this.restaurants = filteredLocalRestaurants;
    });
  }


  /* FUNCTION TO MANAGE CLICKED RESTAURANT */

  displayClickedRestaurant(element, restaurantId) {
    // For each restaurants to display: Get formating div and their review buttons //
    const { reviewButton, mainDiv } = formatingClickedRestaurant(element, restaurantId);
    // Add event click on review button //
    reviewButton.addEventListener('click', () => {
      addReviewsFormManagement();
      // Add event click on Submit button //
      document.getElementById('reviewFormSubmit').addEventListener('click', () => {
        // Check if input are not empty //
        checkViewForm();
        // Check if a note is selected
        const { note } = document.forms.reviewForm.elements;
        const selectedNoteArray = getSelectedNote(note);
        // If not is selected and input not empty //
        if (selectedNoteArray.length > 0) {
          // Add review //
          addReviewToRestaurant(this.restaurants, reviewButton.id);
          deleteChild(restaurantId);
          this.displayClickedRestaurant(element, restaurantId);
          removeElement('reviewForm-container');
        }
      });
    });
    restaurantId.appendChild(reviewButton);
    restaurantId.appendChild(mainDiv);
  }


  /* MAIN FUNCTION TO MANAGE RESTAURANTS ON MAP AND LIST */

  manageAndDisplayRestaurants() {
    removeMarkers(this.markersToRemoveOnChange);
    deleteChild(this.restaurantListId);
    // loop through restaurants to display them //
    this.restaurants.forEach((element) => {
      // check if restaurant is in filter //
      if (element.averageRating >= parseInt(minFilter.value, 10) && element.averageRating <= parseInt(maxFilter.value, 10)) {
        // Add marker and add event click //
        const marker = this.createMarker({ lat: element.lat, lng: element.long }, 'https://img.icons8.com/ultraviolet/30/000000/marker.png');
        marker.addListener('click', async () => {
          this.markersToRemoveOnChange.forEach((el) => {
            el.setIcon('https://img.icons8.com/ultraviolet/30/000000/marker.png');
          });
          marker.setIcon('https://img.icons8.com/ultraviolet/40/000000/marker.png');
          // check if restaurant is a requested restaurant and not local //
          if (element.id !== null) {
            // Request reviews of this restaurant //
            await getReviews(this.google, this.service, element);
          }
          // formating and displaying restaurant informations on specific clicked area //
          this.displayClickedRestaurant(element, this.restaurantClickedId);
        });
        // add marker to remove list //
        this.markersToRemoveOnChange.push(marker);
        // formating and displaying restaurant informations on left list //
        createRestaurantOnList(element);
      }
    });
  }


  /* NEW RESTAURANT FORM MANAGER */

  addRestaurantFormOperation() {
    // Add event click on map //
    this.google.maps.event.addListener(this.map, 'click', (event) => {
      newFormManagement(event);
      const newElemForm = document.getElementById('newElementFormSubmit');
      // Add event click on new element form //
      newElemForm.addEventListener('click', () => {
        // Check if input are not empty //
        checkNewForm();
        // Check if a note is selected
        const { note } = document.forms.newElementForm.elements;
        const selectedNoteArray = getSelectedNote(note);
        if (selectedNoteArray.length > 0) {
          // Add new Restaurant //
          const formData = [getNewFormData()];
          this.createNewRestaurantsInstances(formData);
          this.manageAndDisplayRestaurants();
          removeElement('newElementForm-container');
        }
      });
    });
  }


  /* FILTER ON CHANGE */

  filterOnChange(filter) {
    // Add event change on filter //
    filter.addEventListener('change', () => {
      this.manageAndDisplayRestaurants();
      removeFilterOptions();
      addFilterOptions();
    });
  }


  /* EVENT MAP MANAGEMENT */

  async eventManagement() {
    // On dragend or zoom event: Request of restaurants near map center //
    const requestedRestaurantsNearby = await requestNearbySearch(this.service, this.google, this.map.getCenter());
    // Transform requested restaurants into objects //
    const getPlaceRestaurants = getPlaceRestaurantsObjects(requestedRestaurantsNearby);
    // Get all requested restaurants stored in stored array //
    const storedRestaurantsIds = this.storedRestaurants.map((element) => element.id);
    // Filter requested Restaurants that are new, not already stored in stored array //
    const newRestausNotStored = getPlaceRestaurants.filter((element) => !storedRestaurantsIds.includes(element.id));
    // Empty restaurants array //
    this.restaurants = [];
    this.createNewRestaurantsInstances(newRestausNotStored);
    // Display all stored restaurants (requested or local) if they are on map //
    this.storedRestaurants.forEach((element) => {
      if (this.map.getBounds().contains({ lat: element.lat, lng: element.long })) {
        if (!this.restaurants.includes(element)) {
          this.restaurants.push(element);
        }
      }
    });
    this.manageAndDisplayRestaurants();
  }


  /* EVENT MAP MANAGEMENT APPLIED FOR DRAGEND AND ZOOM CHANGED */

  dragendZoomEventsManager() {
    this.google.maps.event.addListener(this.map, 'dragend', async () => {
      this.eventManagement();
    });
    this.google.maps.event.addListener(this.map, 'zoom_changed', async () => {
      this.eventManagement();
    });
  }


  /* RUNNING APP METHOD ON INIT */

  async runApp(jsonDatas) {
    // Set user marker //
    this.userPositionMarker = this.createMarker(this.position, 'https://img.icons8.com/office/40/000000/marker.png');
    this.addInfoWindowOnMarker(this.userPositionMarker, 'Vous êtes ici');
    // Manage local restaurants (create instances, store) //
    this.localRestaurantsManager(jsonDatas);
    // Request restaurant nearby //
    await this.placeRestaurantsManager();
    // Manage & display restaurants //
    this.manageAndDisplayRestaurants();
    // Init filters //
    this.filterOnChange(minFilter);
    this.filterOnChange(maxFilter);
    // Init new restaurant form //
    this.addRestaurantFormOperation();
    // Init events map //
    this.dragendZoomEventsManager();
  }
}
