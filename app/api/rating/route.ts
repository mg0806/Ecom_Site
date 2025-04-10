import { getCurrentUser } from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import { PrismaClient, Product, Review } from "@prisma/client";


export async function POST(request: Request) {
    const currentUser = await getCurrentUser();
    const prisma = new PrismaClient()
    if (!currentUser) {
        return NextResponse.error();

    }

    const body = await request.json()
    const { comment, rating, product, userId } = body;

    const deliveredOrder = currentUser?.orders.some(order => {
        const products: Product[] = (() => {
            if (Array.isArray(order.products)) {
                return order.products as Product[];
            }
            if (typeof order.products === "string") {
                try {
                    const parsed = JSON.parse(order.products);
                    return Array.isArray(parsed) ? parsed as Product[] : [];
                } catch (error) {
                    console.error("Failed to parse order.products:", error);
                    return [];
                }
            }
            return [];
        })();

        return products.some((item) => item.id === product.id) && order.deliveryStatus === "delivered";
    });





    const userReview = product?.reviews.find(((review: Review) => {
        return review.userId === currentUser.id
    }))

    if (userReview || !deliveredOrder) {
        return NextResponse.error();
    }

    const review = await prisma.review.create({
        data: {

            comment,
            rating,
            productId: product.id,
            userId,
        }
    })

    return NextResponse.json(review)
}