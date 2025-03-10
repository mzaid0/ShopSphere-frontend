"use client";
import { useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Rating from "@mui/material/Rating";
import Image from "next/image";
import userPlaceholder from "../../../assets/Tabs/user.png";

// Import your API helper functions
import { postReview, getReviews } from "@/api/review";
import { useToast } from "@/hooks/use-toast";

interface ProductsTabProps {
  description: string;
}

export type Error = {
  response: {
    data: {
      message: string;
    };
  };
};

interface ReviewFormInputs {
  rating: number;
  review: string;
}

interface ReviewUser {
  firstName: string;
  lastName: string;
  avatar: string;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
  user: ReviewUser;
}

const ProductsTab = ({ description }: ProductsTabProps) => {
  // Get the product id from the URL
  const params = useParams();
  const productId = params?.id as string;

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch reviews for the product using TanStack Query
  const {
    data: reviews,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useQuery<Review[]>({
    queryKey: ["reviews", productId],
    queryFn: () => getReviews(productId as string),
    enabled: !!productId,
  });

  // Set up react-hook-form for the review form
  const { control, register, handleSubmit, reset } = useForm<ReviewFormInputs>({
    defaultValues: { rating: 0, review: "" },
  });

  // Mutation for posting a new review
  const { mutate: submitReview, isPending: reviewSubmitting } = useMutation({
    mutationFn: (data: ReviewFormInputs) =>
      postReview({ productId, rating: data.rating, review: data.review }),
    onSuccess: (data) => {
      toast({
        title: "Review",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Review Error",
        description: error.response.data.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ReviewFormInputs) => {
    submitReview(data);
  };

  return (
    <Tabs defaultValue="description" className="w-full mt-8 lg:mt-12">
      <TabsList className="w-full overflow-x-auto no-scrollbar flex items-center justify-start gap-4 px-4 py-3 lg:px-6 lg:py-4">
        <TabsTrigger
          value="description"
          className="px-4 py-2 text-sm lg:text-base"
        >
          Description
        </TabsTrigger>
        <TabsTrigger value="review" className="px-4 py-2 text-sm lg:text-base">
          Product Review {reviews ? `(${reviews.length})` : "(0)"}
        </TabsTrigger>
      </TabsList>

      {/* Description Tab */}
      <TabsContent value="description">
        <div className="p-6 lg:p-8 bg-white rounded-xl border border-gray-200 shadow-sm mt-4 mx-4 lg:mx-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Product Description
          </h2>
          <div className="space-y-4 text-gray-700">
            <p className="leading-relaxed">{description}</p>
          </div>
        </div>
      </TabsContent>

      {/* Review Tab */}
      <TabsContent value="review">
        <div className="p-6 lg:p-8 bg-white rounded-xl border border-gray-200 shadow-sm mt-4 mx-4 lg:mx-6">
          <div className="space-y-8">
            {/* Reviews List */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Customer Reviews {reviews ? `(${reviews.length})` : "(0)"}
              </h2>
              {reviewsLoading ? (
                <p>Loading reviews...</p>
              ) : reviewsError ? (
                <p className="capitalize text-gray-600 font-medium">No review yet</p>
              ) : reviews && reviews.length > 0 ? (
                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4">
                  {reviews.map((reviewItem) => (
                    <div
                      key={reviewItem.id}
                      className="pb-6 border-b border-gray-100 last:border-none"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex-shrink-0">
                            <Image
                              src={reviewItem.user.avatar || userPlaceholder}
                              alt="User Avatar"
                              width={48}
                              height={48}
                              className="rounded-full"
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-medium text-gray-900">
                                {reviewItem.user.firstName}{" "}
                                {reviewItem.user.lastName}
                              </h4>
                              <span className="text-sm text-gray-500">
                                {new Date(
                                  reviewItem.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-700">{reviewItem.review}</p>
                          </div>
                        </div>
                        <div className="sm:w-[120px] flex sm:justify-end">
                          <Rating
                            value={reviewItem.rating}
                            precision={0.5}
                            readOnly
                            className="text-lg"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No reviews yet.</p>
              )}
            </div>

            {/* Review Form */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Share Your Experience
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Textarea
                    placeholder="Write your review here..."
                    rows={4}
                    className="w-full"
                    {...register("review", { required: true })}
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">
                    Your Rating:
                  </label>
                  <Controller
                    control={control}
                    name="rating"
                    rules={{ required: true, min: 1, max: 5 }}
                    render={({ field }) => (
                      <Rating
                        {...field}
                        value={field.value || 0}
                        precision={0.5}
                        onChange={(_, newValue) => field.onChange(newValue)}
                        className="text-2xl"
                      />
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="w-full sm:w-auto px-8 py-3 text-base font-medium transition-transform hover:scale-105"
                >
                  {reviewSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProductsTab;
