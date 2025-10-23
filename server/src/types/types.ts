import { Message } from "@common";
import { userPayload } from "./express";
import { Request } from "express";
import { ExtendedError } from 'socket.io';
import { ChatRoom } from "../models/chatRoomModel";
export interface Runner {
  id?: bigint,
  userId: string,
  latitude: number,
  longitude: number,
  assignedChatRoom?: string,
  updatedAt?: Date;
  desiredNickname: string;
  currentNickname?: string
}
export interface AuthRequest extends Request {
  user: userPayload
}
export interface AuthSocketData {
  user: userPayload;
}
export type AckResponse = { success: boolean, message?: Message | string }
export type MessageAck = (response: AckResponse) => void;
export interface ClientToServerEvents { message: (msg: Message, callback?: MessageAck) => void; trackrun: () => void };
export interface ServerToClientEvents extends ClientToServerEvents { };
export interface InterServerEvents { };

export interface ChatRoomAccumulator {
  chatRoom: ChatRoom | null;
  distance: number;
}
type LocationObjectCoords = {
  /**
   * The latitude in degrees.
   */
  latitude: number;
  /**
   * The longitude in degrees.
   */
  longitude: number;
  /**
   * The altitude in meters above the WGS 84 reference ellipsoid. Can be `null` on Web if it's not available.
   */
  altitude: number | null;
  /**
   * The radius of uncertainty for the location, measured in meters. Can be `null` on Web if it's not available.
   */
  accuracy: number | null;
  /**
   * The accuracy of the altitude value, in meters. Can be `null` on Web if it's not available.
   */
  altitudeAccuracy: number | null;
  /**
   * Horizontal direction of travel of this device, measured in degrees starting at due north and
   * continuing clockwise around the compass. Thus, north is 0 degrees, east is 90 degrees, south is
   * 180 degrees, and so on. Can be `null` on Web if it's not available.
   */
  heading: number | null;
  /**
   * The instantaneous speed of the device in meters per second. Can be `null` on Web if it's not available.
   */
  speed: number | null;
};
export type SocketIONext = (err?: ExtendedError | undefined) => void;
export type Location = {
  coords: LocationObjectCoords;
  timestamp: Date;
  /* userId: string; */
}
