import ChatRoomModel, { chatRoom } from "../models/chatRoomModel";
import RunnerModel, { Runner } from "../models/runnerModel";

const CHAT_ROOM_AREA_IN_MTS = 3 * 1000;
const CHAT_ROOM_TOLERANCY = 250;

export async function assignToChatRoom(runner: Runner): Promise<any | undefined> {

  let chatRoomId = await getNearestChatRoom(runner);
  if (!chatRoomId) chatRoomId = await createNewChatRoom(runner);
  if (!chatRoomId) return undefined;

  const nearestChatRoom = await ChatRoomModel.findOne({ where: { chatRoomId } });

  if (nearestChatRoom) {

    const runnerDbObj = await RunnerModel.findOne({ where: { userId: runner.userId } });

    if (runnerDbObj && nearestChatRoom.dataValues.chatRoomId && nearestChatRoom.dataValues.chatRoomId !== runnerDbObj.assignedChatRoom) {

      await removeRunnerFromChatRoom(runner.userId, runnerDbObj.assignedChatRoom);

      if (!nearestChatRoom.dataValues.usersId.includes(runner.userId)) {
        nearestChatRoom.usersId = [...nearestChatRoom.dataValues.usersId, runner.userId];
        nearestChatRoom.save();
      }
      runnerDbObj.assignedChatRoom = nearestChatRoom.chatRoomId;
      await runnerDbObj.save();
    }

    const nearbyUsers = nearestChatRoom.usersId.length - 1;
    return { assignedChatRoom: chatRoomId, nearbyUsers };

  }
}

async function createNewChatRoom(runner: Runner) {
  const chatRoomId = runner.latitude + '_' + runner.longitude;
  const newChatRoom = { chatRoomId, usersId: [], messages: [] }
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

export async function removeRunnerFromChatRoom(runnerId: string, chatRoomId: string) {

  if (chatRoomId && runnerId) {
    const chatRoom = await ChatRoomModel.findOne({ where: { chatRoomId } });
    if (chatRoom) {
      if (chatRoom.usersId.length > 1) {

        await ChatRoomModel
          .update({ usersId: chatRoom.dataValues.usersId.filter(userId => userId != runnerId) },
            { where: { chatRoomId } })
      } else await chatRoom.destroy();
    }
  }
}

export async function getAssignedChatRoom(userId: string) {
  if (!userId) return undefined;
  const runner = await RunnerModel.findOne({ where: { userId } });
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
