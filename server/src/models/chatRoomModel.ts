import { Model, DataTypes, DataTypeAbstract } from "sequelize";
import sequelize from "./model";

export interface chatRoom {
  id?: bigint,
  chatRoomId: string,
  usersId: string[],
  messages: Messages[]
}

export interface Messages {
  author: string,
  message: string,
  time: Date,
}

class ChatRoomModel extends Model<chatRoom> implements chatRoom {
  id!: bigint;
  chatRoomId!: string;
  usersId!: string[];
  messages!: Messages[]
}

ChatRoomModel.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    chatRoomId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    usersId: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    messages: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: false,
    }
  }, { sequelize, tableName: "chatrooms" }
);
export default ChatRoomModel;