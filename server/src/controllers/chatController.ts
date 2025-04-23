import { Request, Response } from "express";
import ChatRoomModel from "../models/chatRoomModel";
import { Runner } from "../models/runnerModel";
import { assignToChatRoom, getAssignedChatRoom } from "../helpers/chatFunctions";


export async function getAllMessages(req: Request, res: Response) {

  const chatRoomId = await getAssignedChatRoom(req.params.userId);
  if (chatRoomId) {
    const room = await ChatRoomModel.findOne({ where: { chatRoomId } });
    if (room && room.messages) res.json(room.messages);
    else res.json([]);
  } else res.json([]);
};

export async function postMessage(req: Request, res: Response) {

  const chatRoomId = await getAssignedChatRoom(req.params.userId);
  if (chatRoomId && req.body) {
    const room = await ChatRoomModel.findOne({ where: { chatRoomId } });
    if (room && room.messages) {
      const newMessages = room.messages ? [...room.messages, req.body] : [req.body];
      const isMessagePublished = await ChatRoomModel.update({ messages: newMessages }, { where: { chatRoomId } });
      if (isMessagePublished) res.status(201).send({ 'success': 'Message published' });
      else res.status(500).send('Server error');
    }
  }
};

export async function assignChatRoom(req: Request, res: Response) {
  const { userId } = req.body;
  const { longitude, latitude } = req.body.coords;
  const runner: Runner = { userId, longitude, latitude }
  const response = await assignToChatRoom(runner);
  if (response) res.status(201).json(response);
  else res.status(500).json('Server error');
}
