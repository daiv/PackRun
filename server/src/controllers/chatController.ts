import { Response } from "express";
import ChatRoomModel from "../models/chatRoomModel";
import { assignToChatRoom, getAssignedChatRoom } from "../helpers/chatFunctions";
import { AuthRequest } from "../types/types";
import { activeRunners } from "./loginController";


export async function getAllMessages(req: AuthRequest, res: Response) {

  const chatRoomId = await getAssignedChatRoom(req.user.email);
  if (chatRoomId) {
    const room = await ChatRoomModel.findOne({ where: { chatRoomId } });
    if (room && room.messages) res.json(room.messages);
    else res.json([]);
  } else res.json([]);
};

export async function postMessage(req: AuthRequest, res: Response) {
  const chatRoomId = await getAssignedChatRoom(req.user.email);
  if (chatRoomId && req.body) {
    const room = await ChatRoomModel.findOne({ where: { chatRoomId } });
    if (room && room.messages) {
      const newMessages = room.messages ? [...room.messages, req.body] : [req.body];
      const isMessagePublished = await ChatRoomModel.update({ messages: newMessages }, { where: { chatRoomId } });
      if (isMessagePublished) res.status(201).json({ success: 'Message published' });
      else res.status(500).json({ message: 'Server error' });
    }
  }
};

export async function assignChatRoom(req: AuthRequest, res: Response) {
  const runner = activeRunners.get(req.user.email);
  const response = runner ? await assignToChatRoom(runner) : null;

  if (response) res.status(200).json(response);
  else res.status(500).json({ message: 'Server error' });
}

export async function getStadiaApiKey(_: AuthRequest, res: Response) {
  console.log(process.env.STADIA_MAPS_API_KEY);
  res.status(200).json({ stadiaApiKey: process.env.STADIA_MAPS_API_KEY });
}