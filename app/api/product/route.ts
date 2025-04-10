import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { product } from '../../../Utils/product';


// creating a new user

export async function POST(request: Request) {
    const currentUser = await getCurrentUser()


    if (!currentUser) {
        return NextResponse.error()
    }
    if (currentUser.role !== 'ADMIN') {
        return NextResponse.error()
    }

    const body = await request.json()
    // console.log(body);
    const { name, description, price, brand, weight, category, inStock, images } = body
    const weightInKg = weight / 1000;
    const product = await prisma.product.create({
        data: {
            name,
            description,
            brand,
            category,
            inStock,
            images,
            price: parseFloat(price),
            weight: weightInKg,

        }
    })
    return NextResponse.json(product)
}

export async function PUT(request: Request) {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== 'ADMIN') {
        return NextResponse.error()
    }

    const body = await request.json()
    const { id, inStock } = body

    const product = await prisma.product.update({
        where: { id: id },
        data: { inStock }

    })

    return NextResponse.json(product)
}
