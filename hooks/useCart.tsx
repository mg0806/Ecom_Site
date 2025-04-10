import { CartProductType } from "@/app/product/[productId]/ProductDetails";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-hot-toast";

type CartContextType = {
  cartTotalQty: number;
  cartTotalAmount: number;
  cartProducts: CartProductType[] | null;
  handleAddProductToCart: (product: CartProductType) => void;
  handleRemoveProductFromCart: (product: CartProductType) => void;
  handleCartQtyIncrease: (product: CartProductType) => void;
  handleCartQtyDecrease: (product: CartProductType) => void;
  handleClearCart: () => void;
  paymentIntent: string | null;
  handelSetPaymentIntent: (val: string | null) => void;
  totalWeight: number;
  shippingCharges: number;
  grandTotalAmount: number;
};

export const CartContext = createContext<CartContextType | null>(null);

interface Props {
  [propName: string]: any;
}

export const CartContextProvider = (props: Props) => {
  const [cartTotalAmount, setCartTotalAmount] = useState(0);
  const [cartTotalQty, setCartTotalQty] = useState(0);

  const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(
    null
  );

  const [paymentIntent, setPatmentIntent] = useState<string | null>(null);
  // Using useEffect to make our page stay where we left after adding products to cart
  useEffect(() => {
    const cartItems = localStorage.getItem("MTshopCartItems");
    const MTShopPaymentIntent = localStorage.getItem("MTShopPaymentIntent");

    // Safely parse cart items
    const cProducts: CartProductType[] | null =
      cartItems && cartItems !== "undefined" ? JSON.parse(cartItems) : null;

    // Fix: Ensure valid JSON before parsing
    const paymentIntent: string | null =
      MTShopPaymentIntent && MTShopPaymentIntent !== "undefined"
        ? JSON.parse(MTShopPaymentIntent)
        : null;

    setCartProducts(cProducts);
    setPatmentIntent(paymentIntent);
  }, []);

  //subTotal Function
  useEffect(() => {
    const getTotal = () => {
      if (cartProducts) {
        const { total, qty } = cartProducts?.reduce(
          (acc, item) => {
            const itemTotal = item.price * item.quantity;

            acc.total = acc.total + itemTotal;
            acc.qty = acc.qty + item.quantity;

            return acc;
          },
          {
            total: 0,
            qty: 0,
          }
        );

        setCartTotalQty(qty);
        setCartTotalAmount(total);
      }
    };

    getTotal();
  }, [cartProducts]);

  const totalWeight =
    cartProducts?.reduce((acc, product) => {
      return acc + (product.weight || 0) * (product.quantity || 1);
    }, 0) || 0;

  const shippingRules = [
    { condition: (weight: number) => weight < 0.5, rate: 50 },
    { condition: (weight: number) => weight === 0.5, rate: 80 },
    { condition: (weight: number) => weight > 0.5 && weight < 1, rate: 100 },
    { condition: (weight: number) => weight >= 1 && weight <= 2, rate: 150 },
    { condition: (weight: number) => weight > 2, rate: 200 },
  ];

  const calculateShipping = (weight: number): number => {
    const rule = shippingRules.find((rule) => rule.condition(weight));
    return rule ? rule.rate : 0;
  };

  const shippingCharges = calculateShipping(totalWeight);
  const grandTotalAmount = cartTotalAmount + shippingCharges;

  const handleAddProductToCart = useCallback((product: CartProductType) => {
    setCartProducts((prev) => {
      let updatedCart;

      if (prev) {
        updatedCart = [...prev, product];
      } else {
        updatedCart = [product];
      }

      // storing cart information into localStorage
      localStorage.setItem("MTshopCartItems", JSON.stringify(updatedCart));
      return updatedCart;
    });
    toast.success("Product added successfully");
  }, []);

  const handleRemoveProductFromCart = useCallback(
    (product: CartProductType) => {
      if (cartProducts) {
        const filteredProducts = cartProducts.filter((item) => {
          return item.id != product.id;
        });

        setCartProducts(filteredProducts);
        localStorage.setItem(
          "MTshopCartItems",
          JSON.stringify(filteredProducts)
        );
      }
      toast.success("Product Removed successfully");
    },
    [cartProducts]
  );

  const handleCartQtyIncrease = useCallback(
    (product: CartProductType) => {
      let updatedCart;
      if (product.quantity === 20) {
        return toast.error("max reached");
      }

      if (cartProducts) {
        updatedCart = [...cartProducts];

        const existingIndex = cartProducts.findIndex(
          (item) => item.id === product.id
        );

        if (existingIndex > -1) {
          updatedCart[existingIndex].quantity = ++updatedCart[existingIndex]
            .quantity;
        }

        setCartProducts(updatedCart);
        localStorage.setItem("MTshopCartItems", JSON.stringify(updatedCart));
      }
    },
    [cartProducts]
  );
  const handleCartQtyDecrease = useCallback(
    (product: CartProductType) => {
      let updatedCart;
      if (product.quantity === 1) {
        return toast.error("min reached");
      }

      if (cartProducts) {
        updatedCart = [...cartProducts];

        const existingIndex = cartProducts.findIndex(
          (item) => item.id === product.id
        );

        if (existingIndex > -1) {
          updatedCart[existingIndex].quantity = --updatedCart[existingIndex]
            .quantity;
        }

        setCartProducts(updatedCart);
        localStorage.setItem("MTshopCartItems", JSON.stringify(updatedCart));
      }
    },
    [cartProducts]
  );

  const handleClearCart = useCallback(
    () => {
      setCartProducts(null);
      setCartTotalQty(0);
      localStorage.setItem("MTshopCartItems", JSON.stringify(null));
    },
    [cartProducts]
    // removed content of dependency array  "cartProducts"
  );

  const handelSetPaymentIntent = useCallback(
    (val: string | null) => {
      setPatmentIntent(val);
      localStorage.setItem("MTShopPaymentIntent", JSON.stringify(val));
    },
    []
    // removed content of dependency array  "paymentIntent"
  );

  const value = {
    cartTotalQty,
    cartTotalAmount,
    cartProducts,
    handleAddProductToCart,
    handleRemoveProductFromCart,
    handleCartQtyIncrease,
    handleCartQtyDecrease,
    handleClearCart,
    paymentIntent,
    handelSetPaymentIntent,
    totalWeight,
    shippingCharges,
    grandTotalAmount,
  };

  return <CartContext.Provider value={value} {...props} />;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error("useCart must be used wiithin a CartContextProvider");
  }

  return context;
};
