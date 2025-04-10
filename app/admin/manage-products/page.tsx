import Container from "@/components/universal/Container";
import ManageProductsClient from "./ManageProductsClient";
import getProducts from "@/actions/getProduct";
import { getCurrentUser } from "@/actions/getCurrentUser";
import NullData from "@/components/NullData";

const ManageProducts = async() => {

    const products = await getProducts({category:null});
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "ADMIN") {
        return <NullData title="Access Denied"/>
    }
    return (  

        <div className=" pt-8">
           |<Container>
            <ManageProductsClient products = {products}/>
           </Container>
        </div>
    );
}
 
export default ManageProducts;