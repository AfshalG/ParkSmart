const KEY = "parksmart_favourites";

/**
 * Get all favourited carparks. Returns [] if none.
 */
export function getFavourites() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * Add a carpark to favourites. Moves to top if already saved.
 * Stores only the fields needed to re-identify and display the carpark.
 */
export function addFavourite(carpark) {
  const favs = getFavourites().filter((f) => f.id !== carpark.id);
  const saved = {
    id: carpark.id,
    name: carpark.name,
    agency: carpark.agency,
    lat: carpark.lat,
    lng: carpark.lng,
    isCentral: carpark.isCentral,
    area: carpark.area || "",
    addedAt: Date.now(),
  };
  favs.unshift(saved);
  localStorage.setItem(KEY, JSON.stringify(favs));
  window.dispatchEvent(new CustomEvent("favouritesChange", { detail: favs }));
  return saved;
}

/**
 * Remove a carpark from favourites by ID.
 */
export function removeFavourite(carparkId) {
  const favs = getFavourites().filter((f) => f.id !== carparkId);
  localStorage.setItem(KEY, JSON.stringify(favs));
  window.dispatchEvent(new CustomEvent("favouritesChange", { detail: favs }));
}

/**
 * Toggle favourite status. Returns true if now favourited, false if removed.
 */
export function toggleFavourite(carpark) {
  if (isFavourite(carpark.id)) {
    removeFavourite(carpark.id);
    return false;
  }
  addFavourite(carpark);
  return true;
}

/**
 * Returns true if carpark ID is currently saved.
 */
export function isFavourite(carparkId) {
  return getFavourites().some((f) => f.id === carparkId);
}
