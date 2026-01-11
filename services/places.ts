const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY;

export const fetchNearbySalons = async (
  latitude: number,
  longitude: number
) => {
  const radius = 5000; // meters
  const type = "beauty_salon";
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${GOOGLE_API_KEY}`;
//   console.log(`URL: ${url}`);

  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== "OK") {
    throw new Error(data.error_message || "Failed to fetch salons");
  }

  return data.results.map((item: any) => ({
    id: item.place_id,
    name: item.name,
    latitude: item.geometry.location.lat,
    longitude: item.geometry.location.lng,
    address: item.vicinity,
  }));
};
