import express, { Router } from 'express';

import { checkIfLogged } from '../controllers/loginController';
import { checkTrackBody, createNewTrack, deleteTrack, getTrack, getTracksInfo, postTrack } from '../controllers/tracksController';


const tracksRouter: Router = express.Router();

//creates a new track and returns a trackId
tracksRouter.put('/:userId', /* checkIfLogged, */ createNewTrack);

//adds locations to the new track and returns Geoapifyed Object
tracksRouter.post('/:trackId/:userId', /* checkIfLogged, */ checkTrackBody, postTrack);


//returns an array with the user tracks
tracksRouter.get('/:userId/', /* checkIfLogged, */ getTracksInfo);
//returns a GeoApifyedObject 
tracksRouter.get('/:trackId/:userId', /* checkIfLogged, */ getTrack);
tracksRouter.delete('/:trackId/:userId', /* checkIfLogged, */ deleteTrack);



export default tracksRouter;