import { NextFunction, Response } from "express";
import { RequestExt } from "../interface";
import Book from "../models/book";

export const attachBookToRequest = async (req: RequestExt, res: Response, next: NextFunction) => {
    const bookId = parseInt(req.params.bookId, 10);

    if (isNaN(bookId)) {
        return res.status(400).json({ error: 'Invalid book ID' });
    }

    try {
        const book = await Book.findByPk(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        req.book = book;
        next();
    } catch (error) {
        console.error('Error attaching book to request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};