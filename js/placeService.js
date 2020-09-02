/* eslint-disable no-param-reassign */
/* eslint-disable max-len */

/* NEARBY SEARCH REQUEST */

export function requestNearbySearch(service, google, position) {
  const request = {
    location: position,
    radius: '600',
    type: ['restaurant'],
  };
  return new Promise((resolve, reject) => {
    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK || google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        resolve(results);
      } else {
        reject(new Error(`problem with nearbySearch: ${status}`));
      }
    });
  });
}

/* GET DETAILS REQUEST */

export function requestGetDetails(google, service, element) {
  const request = {
    placeId: element.id,
    fields: ['review', 'place_id'],
  };
  return new Promise((resolve, reject) => {
    service.getDetails(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK || google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        resolve(results);
      } else {
        reject(new Error(`problem with getDetails: ${status}`));
      }
    });
  });
}

/* FORMATING AND RETURNING REQUESTED RESTAURANTS NEARBY */

export function getPlaceRestaurantsObjects(requestedRestaurantsNearby) {
  const restaurants = requestedRestaurantsNearby.map((element) => ({
    id: element.place_id, restaurantName: element.name, address: element.vicinity, ratings: [], lat: element.geometry.location.lat(), long: element.geometry.location.lng(), averageRating: element.rating,
  }));
  return restaurants;
}


/* FORMATING AND RETURNING REVIEWS WITH STAR AND REVIEW */

export function addReviewsToPlaceRestaurants(ratingsArray) {
  const restaurantReview = ratingsArray.reviews.map((review) => ({ stars: review.rating, comment: review.text }));
  return restaurantReview;
}


/* ADD REVIEWS TO RESTAURANT */

export async function getReviews(google, service, element) {
  // Request for restaurant reviews and id //
  const placeReviews = await requestGetDetails(google, service, element);
  // Get stars and comments object //
  const restaurantReviews = addReviewsToPlaceRestaurants(placeReviews);
  // Add requested reviews to restaurants and previously added reviews //
  element.ratings = [...element.addedRatings, ...restaurantReviews];
}
