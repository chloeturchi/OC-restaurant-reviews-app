/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
/* eslint-disable import/no-cycle */

/* FETCH JSON : LOCAL RESTAURANTS */

export async function fetchJsonData() {
  try {
    const response = await fetch('data.json');
    if (response.ok) {
      return await response.json();
    }
    console.error('Retour du serveur : ', response.status);
  } catch (e) {
    console.error(e);
  }
}


/* CALCULATE AVERAGE NOTE OF LOCAL RESTAURANTS */

export function calculateAverage(notes) {
  let notesSum = 0;
  // Sum of all notes //
  for (let i = 0; i < notes.length; i++) {
    notesSum += notes[i].stars;
  }
  // Divided by number of notes //
  const finalSum = notesSum / notes.length;
  return (finalSum.toFixed(1));
}


/* DELETE CHILD ELEMENT ON LIST */

export function deleteChild(containerId) {
  let child = containerId.lastElementChild;
  while (child) {
    containerId.removeChild(child);
    child = containerId.lastElementChild;
  }
}


/* REMOVE ELEMENT ON LIST */

export function removeElement(element) {
  document.getElementById(element).remove();
}


/* REMOVE MARKERS ON MAP */

export function removeMarkers(markers) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}
