import { DataTypes, Model } from "sequelize";
import sequelize from "./model";
export interface User {
  id?: bigint,
  userId: string,
  desiredNickname: string
}
class ProfileModel extends Model<User> implements User {
  id?: bigint;
  userId!: string;
  desiredNickname!: string;
}
ProfileModel.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  desiredNickname: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, { sequelize, tableName: "users", underscored: true });

export default ProfileModel;