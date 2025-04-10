import { getCurrentUser } from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {

    const currentUser = await getCurrentUser()

    if (!currentUser) {
        return NextResponse.error()
    }
    if (currentUser.role !== 'ADMIN') {
        return NextResponse.error()
    }

    const product = await prisma?.product.delete({
        where: { id: params.id }

    })

    return NextResponse.json(product)
}
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const product = await prisma?.product.findUnique({
            where: { id: params.id },
        });

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching product" }, { status: 500 });
    }
}

// Update a product by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || currentUser.role !== "ADMIN") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const body = await request.json();

        const weightInKg = parseFloat((parseFloat(body.weight) / 1000).toFixed(2)) || 0;

        // console.log(weightInKg);
        const sanitizedImages = Array.isArray(body.images)
            ? body.images.map((group: any) => ({
                colorCode: group.colorCode || "",
                color: group.color || "",
                images: Array.isArray(group.images) ? group.images : [],
            }))
            : [];

        const updatedProduct = await prisma?.product.update({
            where: { id: params.id },
            data: {
                name: body.name,
                description: body.description,
                brand: body.brand,
                category: body.category,
                inStock: body.inStock,
                price: Number(String(body.price).replace(/[^\d.-]/g, "")),
                finalPrice: isNaN(Number(String(body.finalPrice).replace(/[^\d.-]/g, "")))
                    ? Number(body.price)
                    : Number(String(body.finalPrice).replace(/[^\d.-]/g, "")),
                weight: weightInKg,
                images: sanitizedImages,
            },
        });
        // console.log(updatedProduct);
        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error) {
        console.error("Internal Server Error:", error);
        return NextResponse.json({ message: "Error updating product" }, { status: 500 });
    }
}

