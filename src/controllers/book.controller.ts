import { Request, Response } from 'express';
import Book from '../models/book';
import { IBookResponse, IBooksListResponse, ICreateBookRequest, IErrorResponse, IUpdateBookRequest } from '../interface/book.interfacee';
import { createBookSchema, updateBookSchema } from '../validations/book.validation';
import { RequestExt } from '../interface';

// Endpoint to create a new book
export const createBook = async (req: Request<{}, {}, ICreateBookRequest>, res: Response<IBookResponse | { error: string }>) => {
    try {
        const validatedBook = createBookSchema.safeParse(req.body);
        if (!validatedBook.success) {
            return res.status(400).json({ error: validatedBook.error.issues.map(issue => issue.message).join(', ') });
        }

        const { title, author, genre, description, available } = validatedBook.data;

        // Create a new book instance
        const book = await Book.create({
            title,
            author,
            genre,
            description,
            available
        });

        await book.save();

        // Construct the response object to match IBookResponse
        const bookResponse: IBookResponse = {
            id: book.id,
            title: book.title,
            author: book.author,
            genre: book.genre,
            description: book.description,
            available: book.available,
            createdAt: book.createdAt,
            updatedAt: book.updatedAt
        };

        // Send response with created book data
        res.status(201).json(bookResponse);
    } catch (error: any) {
        console.error('Error creating book:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Endpoint to update a book
export const updateBook = async (req: RequestExt, res: Response<IBookResponse | IErrorResponse>) => {
    try {
        const validateUpdateBook = updateBookSchema.safeParse(req.body);
        if (!validateUpdateBook.success) {
            return res.status(400).json({
                error: validateUpdateBook.error.issues.map(issue => issue.message).join(', ')
            });
        }

        const { title, author, genre, description, available } = validateUpdateBook.data;
        const book = req.book; // The book is already attached by middleware

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        await book.update({
            title: title ?? book.title,
            author: author ?? book.author,
            genre: genre ?? book.genre,
            description: description ?? book.description,
            available: available ?? book.available,
        });

        const bookResponse: IBookResponse = {
            id: book.id,
            title: book.title,
            author: book.author,
            genre: book.genre,
            description: book.description ?? '',
            available: book.available,
            createdAt: book.createdAt,
            updatedAt: book.updatedAt
        };

        res.status(200).json(bookResponse);
    } catch (error: any) {
        console.error('Error updating book:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Endpoint to fetch all books
export const getAllBooks = async (req: Request, res: Response<IBooksListResponse | IErrorResponse>) => {
    try {
        const books = await Book.findAll();
        res.status(200).json({ books });
    } catch (error: any) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Endpoint to fetch a single book by ID
export const getBookById = async(req: Request, res: Response<IBookResponse | IErrorResponse>) => {
    try {
        const { id } = req.params;
        const book = await Book.findByPk(id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error: any) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// // Endpoint to delete a book
export const deleteBook = async (req: Request<{ bookId: string }>, res: Response) => {
  const id = parseInt(req.params.bookId, 10);

  try {
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    await book.destroy();
    return res.status(200).json({
        message: 'Book deleted successfully',
        status: 204,
        data: book,
    });
  } catch (error: any) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
