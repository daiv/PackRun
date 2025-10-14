import express, { Router } from 'express';

import { checkTrackBody, createNewTrack, deleteTrack, getTrack, getTracksInfo, postTrack } from '../controllers/tracksController';


const tracksRouter: Router = express.Router();

//creates a new track and returns a trackId
tracksRouter.put('/', createNewTrack);

//adds locations to the new track and returns Geoapifyed Object
tracksRouter.post('/:trackId/', checkTrackBody, postTrack);

//returns an array with the user tracks
tracksRouter.get('/', getTracksInfo);
//returns a GeoApifyedObject 
tracksRouter.get('/:trackId/', getTrack);
tracksRouter.delete('/:trackId/', deleteTrack);

export default tracksRouter;