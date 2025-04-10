import FormWrap from "@/components/Products/FormWarp";
import Container from "@/components/universal/Container";
import AddProductForm from "./AddProductForm";
import { getCurrentUser } from "@/actions/getCurrentUser";
import NullData from "@/components/NullData";

const AddProducts = async () => {


    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "ADMIN") {
        return <NullData title="Access Denied"/>
    }

    return ( 
        
        <div className=" p-8">
            <Container>
                <FormWrap>
                    <AddProductForm/>
                </FormWrap>
            </Container>

        </div>
    );
}
 
export default AddProducts;