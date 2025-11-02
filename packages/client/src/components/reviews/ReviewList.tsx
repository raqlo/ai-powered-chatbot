import axios from "axios";
import {useEffect, useState} from "react";
import {StarRating} from "./StarRating";
import Skeleton from 'react-loading-skeleton'


type Props = {
    productId: number
}

type Review = {
    id: number;
    author: string;
    content: string;
    rating: number;
    createdAt: string;
}

type GetReviewsResponse = {
    reviews: Review[];
    summary: string | null
}

export const ReviewList = ({productId}: Props) => {
    const [reviewData, setReviewData] = useState<GetReviewsResponse>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchReviews = async () => {
        try {

            setError('')
            setLoading(true)
            const {data} = await axios.get<GetReviewsResponse>(`/api/products/${productId}/reviews`);
            setReviewData(data);
        } catch (err) {
            setError('Failed to fetch reviews')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReviews();
    }, []);

    if (loading) return <div className='flex flex-col gap-5'>
        {[1, 2, 3].map(i => (<div key={i}>
            <Skeleton width={150}/>
            <Skeleton width={100}/>
            <Skeleton count={2}/>
        </div>))}
    </div>

    if (error) return <p className='text-red-500'>{error}</p>

    return <div className="flex flex-col gap-5">
        {reviewData?.reviews.map(review =>
            (<div key={review.id}>
                <div className={'font-semibold'}>{review.author}</div>
                <div><StarRating value={review.rating}/></div>
                <p className='py-2'>{review.content}</p>
            </div>))}</div>
}