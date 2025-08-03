import TrackModel from "../models/trackModel";
import { Location } from "../types/types";
import 'dotenv/config';


export async function addToTracking(owner: string, trackId: string, location: Location) {

  const trackObject = await TrackModel.findOne({ where: { id: trackId, owner } });
  if (location && location.timestamp) {
    const timeCheck = new Date(location.timestamp);

    if (isNaN(timeCheck.getTime())) {
      console.log(`${location.timestamp} is not a valid Date format`);
      throw new Error(`${location.timestamp} is not a valid Date format`);
    }
  }
  if (trackObject) {
    trackObject.location = [...trackObject.location, location];
    const result = trackObject.location.length > 1 ? await transformToGeoApify(trackObject.location) : { message: 'not enought waypoints' };
    if (result && result.features) {
      trackObject.distance = result.features[0].properties.distance;
      trackObject.estimatedTime = result.features[0].properties.time;
    }
    await trackObject.save();
    return result;
  }
}

export async function transformToGeoApify(locations: Location[]) {

  const formattedToGeo = await formatToGeoApify(locations);
  const convertToGeo = await convertToGeoApify(formattedToGeo);

  return convertToGeo;
}

async function convertToGeoApify(request: any) {
  const URL = 'https://api.geoapify.com/v1/mapmatching?apiKey=' + process.env.GEOAPIFY_API_KEY;
  const response = await fetch(URL, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  });
  const body = await response.json();
  return body;
}

async function formatToGeoApify(arrayToConvert: Location[]) {

  const waypoints = arrayToConvert.map(locationObj => {
    if (locationObj.timestamp) return { timestamp: new Date(locationObj.timestamp).toISOString(), location: [locationObj.coords.longitude, locationObj.coords.latitude] };
    return { location: [locationObj.coords.longitude, locationObj.coords.latitude] };
  });

  return { mode: "walk", waypoints };
}

export async function createTrack(owner: string) {
  const newTrack = { owner, location: [], converted: {} };
  const isTrackCreated = await TrackModel.create(newTrack);
  return { trackId: isTrackCreated.id };
}

export async function getTrackFromDb(owner: string, id: string) {
  const selectedTrack = await TrackModel.findOne({ where: { owner, id } });
  if (selectedTrack) {
    const result = await transformToGeoApify(selectedTrack.location);
    return result;
  }
}

export async function deleteTrackFromDb(owner: string, id: string) {
  const isTrackDeleted = await TrackModel.destroy({ where: { owner, id } });
  return isTrackDeleted;
}

export async function getTracksInfoFromDb(owner: string) {
  const tracks = await TrackModel.findAll({ where: { owner } });
  if (tracks) {
    console.log('tracks', tracks.length, tracks);
    const result = tracks.map(track => {
      return {
        trackId: track.id,
        estimatedTime: track.estimatedTime,
        distance: track.distance,
        altitudes: track.location.map(location => { return { value: location.coords.altitude } }),
        createdAt: track.dataValues.createdAt,
        updatedAt: track.dataValues.updatedAt,
      };
    });
    return result;
  }
}
