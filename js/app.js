/* eslint-disable no-alert */
/* eslint-disable import/extensions */
import { fetchJsonData } from './utils.js';
import RestaurantManager from './restaurantManager.js';

/* APP MANAGER */

export default async function appManager(google) {
  // Get JSON file datas & User Position //
  const jsonDatas = await fetchJsonData();

  // Watchposition //
  navigator.geolocation.watchPosition(function(position) {
    console.log("i'm tracking you!");
      // User position //
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      // Map center on user location //
      const map = new google.maps.Map(document.getElementById('mapContainer'), {
        center: pos,
        zoom: 15,
      });
      // Run Application //
      const restaurantManager = new RestaurantManager(map, google, pos);
      restaurantManager.runApp(jsonDatas);
  },
  function(error) {
    if (error.code == error.PERMISSION_DENIED)
      console.log("you denied me :-(");
    // Inform user //
    alert('Vous n\'avez pas autorisé la géolocalisation, la carte sera centrée sur la ville de Cestas');
    // Run Application with default parameter//
    const restaurantManager = new RestaurantManager(
      new google.maps.Map(document.getElementById('mapContainer'), { center: { lat: 44.741133, lng: -0.684124 }, zoom: 16 }),
      google,
      { lat: 44.741133, lng: -0.684124 },
    );
    restaurantManager.runApp(jsonDatas);
  });
}