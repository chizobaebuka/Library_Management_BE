import { Request } from 'express';
import Book from '../models/book';
import User from '../models/user';

export interface RequestExt extends Request {
    body: Request['body'] & {
        _user?: User;
        _userId?: string;
    };

    params: {
        bookId: string;
    };

    book?: Book;
}

export interface ICore {
    id: number;
    createdAt: Date;
    updatedAt: Date;
}
