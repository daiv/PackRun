import { Request, Response } from "express";
import { addToTracking, createTrack, deleteTrackFromDb, getTrackFromDb, getTracksInfoFromDb } from "../helpers/tracksFunctions";

export async function postTrack(req: Request, res: Response) {

  const userId = req.params.userId;
  const trackId = req.params.trackId;

  if (req.body && Object.keys(req.body).includes('coords')) {

    const result = await addToTracking(userId, trackId, req.body);

    if (result) res.status(200).json(result);
    else if (result === 'not enought waypoints') res.status(204).send(result);
    else res.status(500).send('Server error');

  } else res.status(400).send('Missing body fields');
}

export function createNewTrack(req: Request, res: Response) {
  const userId = req.params.userId;

  createTrack(userId)
    .then(trackCreated => res.json(trackCreated))
    .catch(() => res.status(500).send('Server error. Unable to start tracking, try again later'));
}

export async function getTrack(req: Request, res: Response) {
  const userId = req.params.userId;
  const trackId = req.params.trackId;
  const result = await getTrackFromDb(userId, trackId);
  if (result) res.status(200).json(result);
  else if (result === 'not enought waypoints') res.status(204).send(result);
  else res.status(500).send('Server error');
}

export async function getTracksInfo(req: Request, res: Response) {
  const userId = req.params.userId;
  const result = await getTracksInfoFromDb(userId);
  res.status(200).json(result);

}

export async function deleteTrack(req: Request, res: Response) {
  const userId = req.params.userId;
  const trackId = req.params.trackId;
  if (await deleteTrackFromDb(userId, trackId)) res.status(200).send('Track deleted');
  else res.status(500).send('Server error. Unable to delete track');

}
