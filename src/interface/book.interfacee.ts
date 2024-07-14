import { ICore } from ".";

export interface IBook extends ICore {
    id: number;
    title: string;
    author: string;
    genre: string;
    description: string;
    available: boolean;
}

export interface IUpdateBookRequest {
    title?: string;
    author?: string;
    genre?: string;
    description?: string;
    available?: boolean;
}

export interface ICreateBookRequest {
    title: string;
    author: string;
    genre: string;
    description: string;
    available?: boolean;
}

export interface IBookResponse extends ICore {
    title: string;
    author: string;
    genre: string;
    description: string;
    available: boolean;
}

export interface IBooksListResponse {
    books: IBookResponse[];
}

export interface IErrorResponse {
    error: string;
}