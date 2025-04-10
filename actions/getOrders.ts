import prisma from '@/libs/prismadb';

export default async function getOrders() {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: true
            },
            orderBy: {
                createdDate: "desc"
            }
        });

        return orders.map(order => ({
            ...order,
            products: (Array.isArray(order.products) ? order.products : []) as any[], // ✅ Force typecast to an array
        }));
    } catch (error: any) {
        console.error("Error fetching orders:", error);
        throw new Error(error);
    }
}
