//id, location[], owner, converted

import sequelize from "./model";
import { DataTypes, Model } from "sequelize";
import { Location } from "../types";

export interface Track {
  id?: bigint,
  owner: string,
  location: Location[],
  estimatedTime?: string,
  distance?: string,
  updatedAt?: Date,
  createdAt?: Date,
}

/*
total time
total distance
elevation
speed?

*/
class TrackModel extends Model<Track> implements Track {
  id?: bigint;
  owner!: string;
  location!: Location[];
  estimatedTime?: string | undefined;
  distance?: string;
  updatedAt?: Date;
  createdAt?: Date;
}
TrackModel.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  owner: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.ARRAY(DataTypes.JSON),
    allowNull: false
  },
  estimatedTime: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  distance: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, { sequelize, tableName: "track" });

export default TrackModel;
