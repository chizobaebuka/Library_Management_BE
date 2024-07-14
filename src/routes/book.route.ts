import { Router } from "express";
import { createBook, deleteBook, getAllBooks, getBookById, updateBook } from "../controllers/book.controller";
import { attachBookToRequest } from "../middleware";

const router = Router();

router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/create-book', createBook);
router.put('/:bookId', attachBookToRequest, updateBook);
router.delete('/:bookId', deleteBook);

export default router;
