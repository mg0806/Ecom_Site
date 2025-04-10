
import Container from "@/components/universal/Container";
import CartClient from "./cartClient";
import { getCurrentUser } from "@/actions/getCurrentUser";


const Cart = async() => {
    
    const currentUser = await getCurrentUser()
    return ( 

        <div className="p-8">
            <Container>
                <CartClient currentUser = {currentUser}/>
            </Container>
        </div>
    );
}
export default Cart;