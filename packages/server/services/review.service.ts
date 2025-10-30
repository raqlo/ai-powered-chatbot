import {reviewRepository} from "../repositories/review.respository";

export const reviewService = {
    async getReviews(productId: number) {
        return reviewRepository.getReviews(productId);
    }
};