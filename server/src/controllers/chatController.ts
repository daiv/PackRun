import { Response } from "express";
import ChatRoomModel from "../models/chatRoomModel";
import { assignToChatRoom } from "../helpers/chatFunctions";
import { AuthRequest } from "../types/types";
import { activeRunners } from "./loginController";
import { Message } from "@common";


export async function getAllMessages(req: AuthRequest, res: Response) {
  const runner = activeRunners.get(req.user.email);
  const chatRoomId = runner?.assignedChatRoom;
  if (chatRoomId) {
    const room = await ChatRoomModel.findOne({ where: { chatRoomId } });
    if (room && room.messages) return res.json(room.messages);

  }
  res.json([]);
};

export async function saveMessage(message: Message, chatRoomId: string): Promise<boolean> {
  const room = await ChatRoomModel.findOne({ where: { chatRoomId } });
  if (room) {
    const messages = room.messages ? [...room.messages, message] : [message];
    const isMessageSaved = await ChatRoomModel.update({ messages }, { where: { chatRoomId } });
    return !!isMessageSaved;
  }
  return false;
}

export async function assignChatRoom(req: AuthRequest, res: Response) {
  const runner = activeRunners.get(req.user.email);
  const response = runner ? await assignToChatRoom(runner) : null;

  if (response) res.status(200).json(response);
  else res.status(500).json({ message: 'Server error' });
}

export async function getStadiaApiKey(_: AuthRequest, res: Response) {
  res.status(200).json({ stadiaApiKey: process.env.STADIA_MAPS_API_KEY });
}