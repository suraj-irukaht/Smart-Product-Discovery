/**
 * CartPage.jsx
 *
 * Cart page — orchestration only.
 * Fetches cart data, wires mutations, delegates rendering to components.
 *
 * Route: /cart
 * Layout: BuyerLayout
 */
import { Link, useNavigate } from "react-router-dom";
import {
  useGetCart,
  useUpdateCartItem,
  useRemoveCartItem,
} from "@features/buyer/hooks/useCart";
import { usePlaceOrder } from "@features/buyer/hooks/useOrder";
import CartItem from "@features/buyer/components/cart/CartItem";
import CartSummary from "@features/buyer/components/cart/CartSummary";
import CartSkeleton from "@features/buyer/components/cart/CartSkeleton";

export default function CartPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetCart();
  const { mutateAsync: updateItem } = useUpdateCartItem();
  const { mutate: removeItem } = useRemoveCartItem();
  const { mutate: placeOrder, isPending: ordering } = usePlaceOrder();

  const cart = data?.cart ?? [];
  const total = data?.total ?? 0;

  const handlePlaceOrder = () => {
    placeOrder(undefined, {
      onSuccess: () => navigate("/orders"),
    });
  };

  if (isLoading) return <CartSkeleton />;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Your Cart
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {cart.length === 0
              ? "Your cart is empty"
              : `${cart.length} item${cart.length > 1 ? "s" : ""} in your cart`}
          </p>
        </div>

        {/* Empty */}
        {cart.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 py-24 text-center">
            <p className="text-5xl mb-4">🛒</p>
            <p className="font-bold text-slate-700 text-lg mb-1">
              Your cart is empty
            </p>
            <p className="text-sm text-slate-400 mb-6">
              Browse products and add something you like
            </p>
            <Link
              to="/products"
              className="inline-block px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        )}

        {/* Cart */}
        {cart.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            <div className="space-y-3">
              {cart.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  onUpdate={updateItem}
                  onRemove={removeItem}
                />
              ))}
            </div>
            <CartSummary
              cart={cart}
              total={total}
              onPlace={handlePlaceOrder}
              ordering={ordering}
            />
          </div>
        )}
      </div>
    </div>
  );
}
