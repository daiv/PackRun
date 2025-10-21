import { LocationResponse } from "@common";
import { activeRunners } from "../controllers/loginController";
import ChatRoomModel, { chatRoom } from "../models/chatRoomModel";
import { Runner } from "../types/types";

const CHAT_ROOM_AREA_IN_MTS = 3 * 1000;
const CHAT_ROOM_TOLERANCY = 250;

export async function assignToChatRoom(runner: Runner): Promise<LocationResponse | undefined> {

  let chatRoomId = await getNearestChatRoom(runner);
  let nearbyUsers = -1;

  if (!chatRoomId) {
    nearbyUsers = 0;
    chatRoomId = await createNewChatRoom(runner);
    if (!chatRoomId) return undefined;
  }

  const nearestChatRoom = await ChatRoomModel.findOne({ where: { chatRoomId } });

  if (nearestChatRoom) {

    if (runner.assignedChatRoom !== nearestChatRoom.chatRoomId) {
      await removeRunnerFromChatRoom(runner);
    }
    runner.assignedChatRoom = nearestChatRoom.chatRoomId;
    joinChatRoom(runner);

    return { assignedChatRoom: chatRoomId, nearbyUsers, nickName: runner.currentNickname || 'axu' };

  } else console.error('Error getting nearest chatRoom');

  return undefined;
}
export async function joinChatRoom(runner: Runner) {
  if (!runner || !runner.assignedChatRoom) return;

  const room = await ChatRoomModel.findOne({ where: { chatRoomId: runner.assignedChatRoom } });
  if (!room) return;

  let alreadyIn = false;
  const existingNicks = new Set<string>();
  room.usersId.forEach(userId => {
    if (userId === runner.userId) alreadyIn = true;
    else {
      const currentNick = activeRunners.get(userId)?.currentNickname;
      if (currentNick) existingNicks.add(currentNick);
    }
  });

  runner.currentNickname = getUniqueNickName(runner.desiredNickname, existingNicks);
  if (!alreadyIn) {
    room.usersId.push(runner.userId);
    await ChatRoomModel.update(
      { usersId: room.usersId },
      { where: { chatRoomId: runner.assignedChatRoom } });
  }
}

function getUniqueNickName(desiredNickname: string, existingNicks: Set<string>): string {
  let newNick = desiredNickname;
  if (existingNicks.has(newNick)) {
    const match = newNick.match(/^(.*)-\d{2}$/);
    let uniqueNick = '';
    if (match) newNick = match[1];
    let counter = 1;
    do {
      const suffix = counter < 10 ? '0' + counter : String(counter);
      uniqueNick = `${newNick}-${suffix}`;
    } while (existingNicks.has(uniqueNick));
    newNick = uniqueNick;
  }
  return newNick;
}
export async function changeNickName(runner: Runner) {
  if (!runner || !runner.assignedChatRoom) return;
  const room = await ChatRoomModel.findOne({ where: { chatRoomId: runner.assignedChatRoom } });
  if (!room || !room.usersId.includes(runner.userId)) return;
  const existingNicks = new Set<string>();
  
  room.usersId.forEach(userId => {
    if (userId != runner.userId) {
      const currentNick = activeRunners.get(userId)?.currentNickname;
      if (currentNick) existingNicks.add(currentNick);
    }
  });
  runner.currentNickname = getUniqueNickName(runner.desiredNickname, existingNicks);
}

async function createNewChatRoom(runner: Runner) {
  const chatRoomId = runner.latitude + '_' + runner.longitude;
  const newChatRoom = { chatRoomId, usersId: [], nickname: [], messages: [] }
  const isChatRoomCreated = await ChatRoomModel.create(newChatRoom);
  return isChatRoomCreated ? chatRoomId : undefined;
}

async function getNearestChatRoom(referencePoint: Runner): Promise<string | undefined> {
  try {
    const nearestChatRoom = await ChatRoomModel.findAll();
    if (nearestChatRoom) {

      if (nearestChatRoom.length !== 0) return nearestChatRoom
        .map(chatRoom => { return { ...chatRoom, distance: calculateDistance(referencePoint, chatRoom) }; })
        .filter(chatRoom => chatRoom.distance <= CHAT_ROOM_AREA_IN_MTS + CHAT_ROOM_TOLERANCY)
        .reduce((acum, chatRoom) => chatRoom.distance <= acum.distance
          ? chatRoom
          : acum)

        .dataValues.chatRoomId;
    }
  } catch (err) {
    console.log(err);
  }
}

export async function removeRunnerFromChatRoom(runner: Runner) {
  const runnerId = runner.userId;
  const chatRoomId = runner.assignedChatRoom;

  if (chatRoomId && runnerId) {
    const chatRoom = await ChatRoomModel.findOne({ where: { chatRoomId } });
    if (chatRoom) {
      if (chatRoom.usersId.length > 1) {

        await ChatRoomModel
          .update(
            {
              usersId: chatRoom.dataValues.usersId.filter(userId => userId != runnerId),
            },
            { where: { chatRoomId } })
      } else await chatRoom.destroy();
    }
  }
}

export async function getAssignedChatRoom(userId: string) {
  if (!userId) return undefined;
  const runner = activeRunners.get(userId);
  return runner?.assignedChatRoom;
}

function calculateDistance(user: Runner, db: chatRoom) {

  const dbLatitude = Number(db.chatRoomId.split('_')[0]);
  const dbLongitude = Number(db.chatRoomId.split('_')[1]);

  const R = 6371;
  const dLat = deg2rad(dbLatitude - user.latitude);
  const dLon = deg2rad(dbLongitude - user.longitude);

  const haversFormula =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(user.latitude)) * Math.cos(deg2rad(dbLatitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const ang = 2 * Math.atan2(Math.sqrt(haversFormula), Math.sqrt(1 - haversFormula));
  const kms = R * ang;

  return kms * 1000;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);

}
