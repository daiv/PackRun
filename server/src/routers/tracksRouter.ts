import express, { Router } from 'express';

import { checkIfLogged } from '../controllers/loginController';
import { createNewTrack, deleteTrack, getTrack, getTracksInfo, postTrack } from '../controllers/tracksController';


const tracksRouter: Router = express.Router();

//creates a new track and returns a trackId
tracksRouter.put('/:userId', checkIfLogged, createNewTrack);

//adds locations to the new track and returns Geoapifyed Object
tracksRouter.post('/:userId/:trackId', checkIfLogged, postTrack);


//returns an array with the user tracks
tracksRouter.get('/:userId/', checkIfLogged, getTracksInfo);
//returns a GeoApifyedObject 
tracksRouter.get('/:userId/:trackId', checkIfLogged, getTrack);
tracksRouter.delete('/:userId/:trackId', checkIfLogged, deleteTrack);

export default tracksRouter;