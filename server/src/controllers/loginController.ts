import { Request, Response } from "express"
import { removeRunnerFromChatRoom } from "../helpers/chatFunctions";
import ChatRoomModel from "../models/chatRoomModel";
import { Runner } from "../types/types";

//minutes of inactivity to autologout users
const LOGIN_EXPIRES_MINUTES = 30;

export const activeRunners = new Map<string, Runner>();

export async function logUser(req: Request, res: Response, next: Function) {

  if (isMissingFields(req)) res.status(400).json({ message: 'Missing fields' });
  else if (incorrectCoordinates(req)) res.status(400).json({ message: 'Incorrect coordinates ' });
  else {

    const userId = req.user.email;
    const desiredNickname = req.body.nickname;
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
  console.log('--- ACTIVE RUNNERS ---', activeRunners.size);
  activeRunners.forEach((runner, userId) => {
    console.log(`LOGGED USERS: 
    
    userId=${userId}, nickname=${runner.currentNickname}, desiredNickname=${runner.desiredNickname}, lat=${runner.latitude}, long=${runner.longitude}, chatRoom=${runner.assignedChatRoom}, updatedAt=${runner.updatedAt}
    
    
    `);
    console.log('-------------------')
  })
}
function isMissingFields(req: Request): boolean {
  return !req.body
    || !req.body.hasOwnProperty('coords')
    || !req.body.hasOwnProperty('nickname')
    || !req.body.coords.hasOwnProperty('latitude')
    || !req.body.coords.hasOwnProperty('longitude');
}

function incorrectCoordinates(req: Request) {
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

export async function checkIfLoggedIn(req: Request, res: Response, next: Function) {
  console.log('Checking if user is logged in');
  activeRunners.has(req.user.email)
    ?
    next()
    :
    res.status(400).json({ message: 'User not logged in' });
}

export async function checkUserBody(req: Request, res: Response, next: Function) {
  req.body.hasOwnProperty('message')
    ?
    next()
    :
    res.status(400).json({ message: 'Missing message' });
}
if (process.env.NODE_ENV !== 'test') setInterval(checkExpiringSessions, 1000 * 60 * LOGIN_EXPIRES_MINUTES / 2);
