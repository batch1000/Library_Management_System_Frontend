import { apiService } from '../api.service';

export const bookService = {
    async getAllGenre() {
        return apiService.get('book/getAllGenre');
    },

    async getAllBook() {
        return apiService.get('book/getAllBook');
    },

    async getOneBook(keyword) {
        return apiService.post('book/getOneBook', { keyword });
    },

    async getBookById(id) {
        return apiService.post('book/getBookById', { id });
    },

    async addBook(data) {
        return apiService.post('book/addbook', data);
    },

    async updateBook(id, data) {
        return apiService.post(`book/updateBook/${id}`, data);
    },

    async deleteBook(id) {
        return apiService.post(`book/deleteBook/${id}`);
    },

    async lendBook(data) {
        return apiService.post('book/lendBook', data);
    },

    async getInfoLendBook(data) {
        return apiService.post('book/getInfoLendBook', data);
    },

    async getTrackBorrowBook() {
        const response = await apiService.get('book/getTrackBorrowBook');
        return response;
    },

    async updateBorrowStatus(data) {
        return apiService.post('book/updateBorrowStatus', data);
    },

    async extendBorrowTime(data) {
        return apiService.post('book/extendBorrowTime', data);
    },

    async getBorrowBookOfUser(id) {
        return apiService.get(`book/getBorrowBookOfUser/${id}`);
    },

    async countCurrentBorrowing(data) {
        return apiService.post('book/countCurrentBorrowing', data);
    },

    async countCurrentBorrowingToday(data) {
        return apiService.post('book/countCurrentBorrowingToday', data);
    },

    async addFavoriteBook(data) {
        return apiService.post('book/addFavoriteBook', data);
    },

    async getFavoriteBooks(readerId) {
        const res = await apiService.get(`book/getFavoriteBooks/${readerId}`);
        return res;
    },

    async deleteFavoriteBook(data) {
        return apiService.delete('book/deleteFavoriteBook', { data });
    },

    async addRatingBook(data) {
        return apiService.post('book/addRatingBook', data);
    },

    async getRatingByBookAndReader(data) {
        return apiService.post('book/getRatingByBookAndReader', data);
    },

    async getRatingByBook(data) {
        return apiService.post('book/getRatingByBook', data);
    },

    async getAllCommentRating(data) {
        return apiService.post('book/getAllCommentRating', data);
    },

    async deleteRatingBook(data) {
        return apiService.delete('book/deleteRatingBook', { data });
    },

    async updateRatingComment(data) {
        return apiService.patch('book/updateRatingComment', data);
    },

    async addBookView(data) {
        return apiService.post('book/addBookView', data);
    },

    async getMostViewBook() {
        return apiService.get('book/getMostViewBook');
    },

    async getTodayBook() {
        return apiService.get('book/getTodayBook');
    },

    async getTopTenWeekBook() {
        return apiService.get('book/getTopTenWeekBook');
    },

    async getTrendingBook() {
        return apiService.get('book/getTrendingBook');
    },

    async getPopularBook() {
        return apiService.get('book/getPopularBook');
    },

    async getPopularBookFilter() {
        return apiService.get('book/getPopularBookFilter');
    },
};