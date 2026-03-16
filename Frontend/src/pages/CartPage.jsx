/**
 * CartPage.jsx
 *
 * Buyer cart page — orchestration layer only.
 *
 * Responsibilities
 * ----------------
 * • Fetch cart data from backend
 * • Wire cart mutations (update quantity, remove item)
 * • Handle order placement
 * • Delegate rendering to presentational components
 *
 * UI Components
 * -------------
 * • CartItem       → individual cart item
 * • CartSummary    → order summary + checkout button
 * • CartSkeleton   → loading state
 *
 * Route
 * -----
 * /cart
 *
 * Layout
 * ------
 * BuyerLayout
 */

import { Link, useNavigate } from "react-router-dom";

/* -------------------------------------------------------------------------- */
/*                               DATA HOOKS                                   */
/* -------------------------------------------------------------------------- */

import {
  useGetCart,
  useUpdateCartItem,
  useRemoveCartItem,
} from "@features/buyer/hooks/useCart";

import { usePlaceOrder } from "@features/buyer/hooks/useOrder";

/* -------------------------------------------------------------------------- */
/*                              UI COMPONENTS                                 */
/* -------------------------------------------------------------------------- */

import CartItem from "@features/buyer/components/cart/CartItem";
import CartSummary from "@features/buyer/components/cart/CartSummary";
import CartSkeleton from "@features/buyer/components/cart/CartSkeleton";

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function CartPage() {
  const navigate = useNavigate();

  /* ---------------------------------------------------------------------- */
  /*                            DATA FETCHING                               */
  /* ---------------------------------------------------------------------- */

  /**
   * Fetch cart items and total price
   */
  const { data, isLoading } = useGetCart();

  /**
   * Cart mutations
   */
  const { mutateAsync: updateItem } = useUpdateCartItem();
  const { mutate: removeItem } = useRemoveCartItem();

  /**
   * Order placement mutation
   */
  const { mutate: placeOrder, isPending: ordering } = usePlaceOrder();

  /* ---------------------------------------------------------------------- */
  /*                           DERIVED DATA                                 */
  /* ---------------------------------------------------------------------- */

  const cart = data?.cart ?? [];
  const total = data?.total ?? 0;

  /* ---------------------------------------------------------------------- */
  /*                               HANDLERS                                 */
  /* ---------------------------------------------------------------------- */

  /**
   * Handles checkout action.
   * On successful order placement,
   * redirect user to the orders page.
   */
  const handlePlaceOrder = () => {
    placeOrder(undefined, {
      onSuccess: () => navigate("/orders"),
    });
  };

  /* ---------------------------------------------------------------------- */
  /*                           LOADING STATE                                */
  /* ---------------------------------------------------------------------- */

  if (isLoading) {
    return <CartSkeleton />;
  }

  /* ---------------------------------------------------------------------- */
  /*                                RENDER                                  */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* ------------------------------------------------------------------ */}
        {/* PAGE HEADER                                                        */}
        {/* ------------------------------------------------------------------ */}

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

        {/* ------------------------------------------------------------------ */}
        {/* EMPTY CART STATE                                                  */}
        {/* ------------------------------------------------------------------ */}

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

        {/* ------------------------------------------------------------------ */}
        {/* CART CONTENT                                                      */}
        {/* ------------------------------------------------------------------ */}

        {cart.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            {/* Cart items list */}
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

            {/* Order summary */}
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
