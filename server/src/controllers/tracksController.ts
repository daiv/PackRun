import { Request, Response } from "express";
import { addToTracking, createTrack, deleteTrackFromDb, getTrackFromDb, getTracksInfoFromDb } from "../helpers/tracksFunctions";

export async function postTrack(req: Request, res: Response) {

  try {
    const { userId, trackId } = req.params;
    const result = await addToTracking(userId, trackId, req.body);
    if (result && result.features) res.status(200).json(result);
    else if (result.message === 'not enought waypoints') res.status(204).send();
    else res.status(500).json({ message: 'Server error' });
  } catch (error) {
    console.log('error 400', error);
    res.status(400).json({ error });
  }
}

export function checkTrackBody(req: Request, res: Response, next: Function) {
  if (req.body && Object.keys(req.body).includes('coords')) next();
  else res.status(400).json({ message: 'Missing body fields' });
}

export function createNewTrack(req: Request, res: Response) {
  const userId = req.params.userId;

  createTrack(userId)
    .then(trackCreated => res.status(201).json(trackCreated))
    .catch((err) => {
      console.log('Server error', err);
      res.status(500).json({ message: 'Server error. Unable to start tracking, try again later' });
    });
}

export async function getTrack(req: Request, res: Response) {
  const userId = req.params.userId;
  const trackId = req.params.trackId;
  const result = await getTrackFromDb(userId, trackId);
  if (result) res.status(200).json(result);
  else if (result === 'not enought waypoints') res.status(204).send(result);
  else res.status(500).json({ message: 'Server error' });
}

export async function getTracksInfo(req: Request, res: Response) {
  const userId = req.params.userId;
  const result = await getTracksInfoFromDb(userId);
  res.status(200).json(result);
}

export async function deleteTrack(req: Request, res: Response) {
  const userId = req.params.userId;
  const trackId = req.params.trackId;
  if (await deleteTrackFromDb(userId, trackId)) res.status(200).json({ message: 'Track deleted' });
  else res.status(500).json({ message: 'Server error. Unable to delete track' });

}
