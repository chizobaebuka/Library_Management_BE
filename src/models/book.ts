import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Book extends Model {
  public id!: number;
  public title!: string;
  public author!: string;
  public genre!: string;
  public description!: string;
  public available!: boolean;
}

Book.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  sequelize,
  modelName: 'Book',
  tableName: 'books',
});

export default Book;