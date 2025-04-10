import FormWrap from "@/components/Products/FormWarp";
import Container from "@/components/universal/Container";
import CheckoutClient from "./CheckoutClient";
import { getCurrentUser } from "@/actions/getCurrentUser";

const Checkout = async () => {
  const currentUser = await getCurrentUser();
  return (
    <div className=" p-8">
      <Container>
        <FormWrap>
          <CheckoutClient currentUser={currentUser} />
        </FormWrap>
      </Container>
    </div>
  );
};
export default Checkout;
