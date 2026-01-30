import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const TokenCardSkeleton = () => {
	return (
		<Card className="transition-all duration-200 border-muted/60">
			<CardContent className="p-6">
				<div className="flex flex-col gap-4">
					<div className="flex justify-between items-start">
						<div className="flex items-center gap-4">
							{/* Icon skeleton */}
							<Skeleton className="h-12 w-12 rounded-full" />
							<div>
								{/* Name skeleton */}
								<Skeleton className="h-6 w-24 mb-2" />
								{/* Address skeleton */}
								<Skeleton className="h-4 w-20" />
							</div>
						</div>
						<div className="flex flex-col items-end">
							{/* Balance label skeleton */}
							<Skeleton className="h-4 w-12 mb-1" />
							{/* Balance value skeleton */}
							<Skeleton className="h-7 w-24" />
						</div>
					</div>

					<div className="flex items-center justify-between pt-4 border-t border-dashed">
						{/* Status badge skeleton */}
						<Skeleton className="h-6 w-28 rounded-full" />

						{/* Button skeleton */}
						<Skeleton className="h-8 w-24" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
