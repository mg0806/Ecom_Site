import Container from "@/components/universal/Container";
import OrderDetails from "./OrderDetails";
import getOrderById from "@/actions/getOrderById";
import NullData from "@/components/NullData";

interface IParams {
  orderId?: string;
}

const Order = async({ params }: { params: IParams }) => {

    const order = await getOrderById(params)

    if (!order) {
        return <NullData title="No Order"></NullData>
    }
  return (
    <div className=" p-8">
      <Container>
        <OrderDetails order={order} />
      </Container>
    </div>
  );
};

export default Order;
