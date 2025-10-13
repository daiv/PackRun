import { Response } from "express";
import ChatRoomModel from "../models/chatRoomModel";
import { assignToChatRoom, getAssignedChatRoom } from "../helpers/chatFunctions";
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

export async function postMessage(req: AuthRequest, res: Response) {
  if (!req.body.message.trim()) return res.status(400).json({ message: 'Bad request' });
  const runner = activeRunners.get(req.user.email);
  if (!runner?.currentNickname) return res.status(500).json({ message: 'User without nick' });
  const msg: Message = {
    author: runner.currentNickname,
    message: req.body.message,
    time: new Date()
  }
  const room = await ChatRoomModel.findOne({ where: { chatRoomId: runner.assignedChatRoom } });
  if (room) {
    const messages = room.messages ? [...room.messages, msg] : [msg];
    const isMsgUpdated = await ChatRoomModel.update({ messages }, { where: { chatRoomId: runner.assignedChatRoom } });
    if (isMsgUpdated) return res.status(201).json({ message: 'Message published' });

  }
  res.status(500).json({ message: 'Server error' });

}
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
  console.log(process.env.STADIA_MAPS_API_KEY);
  res.status(200).json({ stadiaApiKey: process.env.STADIA_MAPS_API_KEY });
}