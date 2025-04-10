import Container from "@/components/universal/Container";
import ManageOrderClient from "./ManageOrderClient";
import { getCurrentUser } from "@/actions/getCurrentUser";
import NullData from "@/components/NullData";
import getOrders from "@/actions/getOrders";

const ManageOrders = async () => {
  const orders = await getOrders();
  const currentUser = await getCurrentUser();
  //   console.log(orders);
  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NullData title="Access Denied" />;
  }
  return (
    <div className=" pt-8">
      |
      <Container>
        <ManageOrderClient orders={orders} />
      </Container>
    </div>
  );
};

export default ManageOrders;
