import Container from "@/components/universal/Container";
import ProductDetails from "./ProductDetails";
import Listrating from "./ListRating";
import { products } from "@/Utils/products";
import { product } from "../../../Utils/product";
import getProductsById from "@/actions/getProductById";
import NullData from "@/components/NullData";
import AddRating from "./AddRating";
import { getCurrentUser } from "@/actions/getCurrentUser";

interface IParams {
  productId?: string;
}

const Product = async({ params }: { params: IParams }) => {

  const product = await getProductsById(params)
  const user = await getCurrentUser()

  if (!product) {
    return <NullData title="Product with given id does not exist"/>
  }
  

  return (
    <div className=" p-8">
      <Container>
        <ProductDetails product={product} />
        <AddRating product={product} user={user}/>
        <Listrating product={product} />
      </Container>
    </div>
  );
};

export default Product;
