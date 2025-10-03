import { Response } from "express";
import { addToTracking, createTrack, deleteTrackFromDb, getTrackFromDb, getTracksInfoFromDb } from "../helpers/tracksFunctions";
import { AuthRequest } from "../types/types";

export async function postTrack(req: AuthRequest, res: Response) {

  try {
    const userId = req.user.email;
    const { trackId } = req.params;
    const result = await addToTracking(userId, trackId, req.body);
    if (result && result.features) res.status(200).json(result);
    else if (result.message === 'not enought waypoints') res.status(204).send();
    else res.status(500).json({ message: 'Server error' });
  } catch (error) {
    console.log('error 400', error);
    res.status(400).json({ error });
  }
}

export function checkTrackBody(req: AuthRequest, res: Response, next: Function) {
  req.body && req.body.hasOwnProperty('coords')
    ? next()
    : res.status(400).json({ message: 'Missing body fields' });
}

export function createNewTrack(req: AuthRequest, res: Response) {
  const userId = req.user.email;

  createTrack(userId)
    .then(trackCreated => res.status(201).json(trackCreated))
    .catch((err) => {
      console.log('Server error', err);
      res.status(500).json({ message: 'Server error. Unable to start tracking, try again later' });
    });
}

export async function getTrack(req: AuthRequest, res: Response) {
  const userId = req.user.email;
  const trackId = req.params.trackId;
  const result = await getTrackFromDb(userId, trackId);
  if (result) res.status(200).json(result);
  else if (result === 'not enought waypoints') res.status(204).send(result);
  else res.status(500).json({ message: 'Server error' });
}

export async function getTracksInfo(req: AuthRequest, res: Response) {
  const userId = req.user.email;
  const result = await getTracksInfoFromDb(userId);
  res.status(200).json(result);
}

export async function deleteTrack(req: AuthRequest, res: Response) {
  const userId = req.user.email;
  const trackId = req.params.trackId;
  if (await deleteTrackFromDb(userId, trackId)) res.status(200).json({ message: 'Track deleted' });
  else res.status(500).json({ message: 'Server error. Unable to delete track' });

}
