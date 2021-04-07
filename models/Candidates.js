import { Model, DataTypes } from 'sequelize';
import db from '../services/db';
import People from './People';

class Candidates extends Model {

}

Candidates.init({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  peopleId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
  },
  votes: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
    get() {
      return undefined;
    },

  },

}, {
  sequelize: db,
  tableName: 'candidates',
  modelName: 'candidates',
});

Candidates.belongsTo(People, {
  foreignKey: 'peopleId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

People.hasOne(Candidates, {
  foreignKey: 'peopleId',
  onUpdate: 'cascade',
  onDelete: 'cascade',
  as: 'candidate',
});

// People.hasMany(Candidates, {
//   foreignKey: 'peopleId',
//   onUpdate: 'cascade',
//   onDelete: 'cascade',
//   as: 'candidates'
// });

// People.hasMany(Candidates, {
//   foreignKey: 'userId',
//   onUpdate: 'cascade',
//   onDelete: 'cascade',
//   as: 'candidates'
// });

export default Candidates;
