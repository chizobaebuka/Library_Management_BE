import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { IBook } from '../interface/book.interface';

interface BookCreationAttributes extends Optional<IBook, 'id' | 'createdAt' | 'updatedAt'> {}

class Book extends Model<IBook, BookCreationAttributes> implements IBook {
  public id!: number;
  public title!: string;
  public author!: string;
  public genre!: string;
  public description!: string;
  public available!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
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
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
  sequelize,
  modelName: 'Book',
  tableName: 'books',
});

export default Book;