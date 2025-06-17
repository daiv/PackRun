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
      if (isMessagePublished) res.status(201).json({ 'success': 'Message published' });
      else res.status(500).json({ message: 'Server error' });
    }
  }
};

export async function assignChatRoom(req: Request, res: Response) {
  const { userId } = req.body;
  const { longitude, latitude } = req.body.coords;
  const runner: Runner = { userId, longitude, latitude }
  const response = await assignToChatRoom(runner);
  if (response) res.status(200).json(response);
  else res.status(500).json({ message: 'Server error' });
}

export async function getStadiaApiKey(_: Request, res: Response) {
  console.log(process.env.STADIA_MAPS_API_KEY);
  res.status(200).json({ stadiaApiKey: process.env.STADIA_MAPS_API_KEY });
}