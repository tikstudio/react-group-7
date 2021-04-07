import { Model, DataTypes } from 'sequelize';
import db from '../services/db';

class People extends Model {

}

People.init({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  middleName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  passport: {
    type: DataTypes.CHAR(9),
    allowNull: false,
    unique: true,
  },
  votedData: {
    type: DataTypes.TIME,
    allowNull: true,
  },
}, {
  sequelize: db,
  tableName: 'people',
  modelName: 'people',
});

export default People;
