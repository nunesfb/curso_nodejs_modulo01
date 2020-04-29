import Sequelize, { Model } from 'sequelize';

class Driver extends Model {
  static init(sequelize) {
    super.init(
      {
        id_driver: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        cnh: Sequelize.BIGINT,
        active: Sequelize.BOOLEAN
      },
      {
        sequelize,
        freezeTableName: 'drivers',
        tableName: 'drivers'
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'id_user', as: 'user' });
  }
}

export default Driver;
