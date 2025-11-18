import { Response } from "express"
import { removeRunnerFromChatRoom } from "../helpers/chatFunctions";
import ChatRoomModel from "../models/chatRoomModel";
import { AuthRequest, Runner } from "../types/types";
import ProfileModel from "../models/profileModel";

//minutes of inactivity to autologout users
const LOGIN_EXPIRES_MINUTES = 30;

export const activeRunners = new Map<string, Runner>();

export async function logUser(req: AuthRequest, res: Response, next: Function) {

  if (isMissingFields(req)) return res.status(400).json({ message: 'Missing fields' });
  else if (incorrectCoordinates(req)) return res.status(400).json({ message: 'Incorrect coordinates ' });
  else {

    const userId = req.user?.email;
    if (!userId) return res.status(400).json({ message: 'User not identified' });

    const userProfile = await ProfileModel.findOne({ where: { userId: req.user.email } });
    const desiredNickname = userProfile?.desiredNickname || 'packrunner';
    const { longitude, latitude } = req.body.coords;
    const updatedAt = new Date();
    const runner: Runner = { userId, longitude, latitude, desiredNickname, updatedAt };

    const isRunnerLoggedIn = activeRunners.has(userId);

    if (isRunnerLoggedIn) activeRunners.set(userId, { ...activeRunners.get(userId)!, desiredNickname, longitude, latitude, updatedAt });
    else activeRunners.set(userId, runner);

    console.log(`long=${longitude} lat=${latitude} userId=${userId}`);
    showRunners();
    next();
  }
}

function showRunners() {
  console.log(`
  
  *** ACTIVE RUNNERS ***`, activeRunners.size);

  activeRunners.forEach((runner, userId) => {
    console.log(`
    ------------------------------------------------    
    userId=${userId}, nickname=${runner.currentNickname}, 
    desiredNickname=${runner.desiredNickname}, 
    lat=${runner.latitude}, long=${runner.longitude}, 
    assignedChatRoom=${runner.assignedChatRoom}, 
    updatedAt=${runner.updatedAt}
    -------------------------------------------------
    
    `);
  });
  console.log('************************')
}

function isMissingFields(req: AuthRequest): boolean {
  return !req.body
    || !req.body.hasOwnProperty('coords')
    || !req.body.coords.hasOwnProperty('latitude')
    || !req.body.coords.hasOwnProperty('longitude');
}

function incorrectCoordinates(req: AuthRequest) {
  return req.body.coords.latitude < -90
    || req.body.coords.latitude > 90
    || req.body.coords.longitude < -180
    || req.body.coords.longitude > 180;
}

async function checkExpiringSessions() {

  activeRunners.forEach((runner, userId) => {
    if (runner.updatedAt && runner.updatedAt <= new Date(Date.now() - LOGIN_EXPIRES_MINUTES * 60 * 1000)) {
      runner.assignedChatRoom && removeRunnerFromChatRoom(runner);
      activeRunners.delete(userId);
    }
  });
  checkForEmptyChatRooms();
}

async function checkForEmptyChatRooms() {
  const chatRooms = await ChatRoomModel.findAll();
  Promise.all(chatRooms.map(async (chatRoom) => chatRoom.usersId.length === 0 && await ChatRoomModel.destroy({ where: { chatRoomId: chatRoom.dataValues.chatRoomId } })));
}

export async function checkIfLoggedIn(req: AuthRequest, res: Response, next: Function) {
  activeRunners.has(req.user.email)
    ?
    next()
    :
    res.status(400).json({ message: 'User not logged in' });
}

if (process.env.NODE_ENV !== 'test') setInterval(checkExpiringSessions, 1000 * 60 * LOGIN_EXPIRES_MINUTES / 2);
