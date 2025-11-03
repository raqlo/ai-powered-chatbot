import axios from "axios";
import {StarRating,} from "./StarRating";
import {HiSparkles} from "react-icons/hi";
import {useQuery, useMutation} from '@tanstack/react-query'
import {Button} from "../ui/button";
import {ReviewSkeleton} from "./ReviewSkeleton";


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

type SummarizeResponse = {
    summary: string;
}

export const ReviewList = ({productId}: Props) => {
const {
    mutate: handleSummarize,
    isPending: summaryLoading,
    isError: isSummaryError,
    data: sumarizeResponse
} = useMutation<SummarizeResponse>({
mutationFn: () => summarizeReviews()
})

    const {data: reviewData, isLoading, error} = useQuery<GetReviewsResponse>({
        queryKey: ['reviews', productId],
        queryFn: () => fetchReviews()
    });

    const fetchReviews = async () => {
        const {data} = await axios.get<GetReviewsResponse>(`/api/products/${productId}/reviews`);
        return data;
    }

    const summarizeReviews = async () => {

        const {data} = await axios.post<SummarizeResponse>(`/api/products/${productId}/reviews/summarize`);

        return data
    }

    if (isLoading) return <div className='flex flex-col gap-5'>
        {[1, 2, 3].map(i => (<ReviewSkeleton key={i} />))}
    </div>

    if (error) return <p className='text-red-500'>Could not fetch reviews. Try again.</p>
    if (reviewData?.reviews.length === 0) return null

    const currentSummary = reviewData?.summary || sumarizeResponse?.summary;
console.log(currentSummary)
    return (<div>
        <div className={'mb-5'}>
            {currentSummary ?
                <p>{currentSummary}</p> :
                <div>
                    <Button disabled={summaryLoading} className={'cursor-pointer'} onClick={() => handleSummarize()}><HiSparkles/> Summarize</Button>
                    {summaryLoading && <div className={'py-3'}><ReviewSkeleton /></div>}
                    {isSummaryError && <p className={'text-red-500'}>Could not summarize reviews. Try again.</p>}
                </div>
            }
        </div>
        <div className="flex flex-col gap-5">
            {reviewData?.reviews.map(review =>
                (<div key={review.id}>
                    <div className={'font-semibold'}>{review.author}</div>
                    <div><StarRating value={review.rating}/></div>
                    <p className='py-2'>{review.content}</p>
                </div>))}
        </div>
    </div>)
}
