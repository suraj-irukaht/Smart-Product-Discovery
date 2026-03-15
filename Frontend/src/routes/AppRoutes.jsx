import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import {
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from "@features/auth";

import HomePage from "../pages/HomePage";
import ProductPage from "../pages/ProductPage";
import BuyerLayout from "../features/buyer/components/layout/Buyerlayout";
import CartPage from "../pages/CartPage";
import OrderPage from "../pages/OrderPage";
import ProductSinglePage from "../pages/ProductSinglePage";
import FavoritesPage from "../pages/FavoritesPage";
import ScrollToTop from "@/components/ScrollToTop";

import {
  AdminDashboard,
  AdminManageOrderPage,
  AdminBuyersPage,
  AdminSellersPage,
  AdminProductsPage,
  AdminCategoriesPage,
  AdminLayout,
} from "@features/admin";

import {
  SellerDashboard,
  SellerProductsPage,
  SellerRegisterPage,
  CreateProductPage,
  EditProductPage,
  SellerLayout,
  SellerOrdersPage,
} from "@features/seller";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route
            element={
              <AdminLayout>
                <Outlet />
              </AdminLayout>
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminManageOrderPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            <Route path="/admin/users" element={<AdminBuyersPage />} />
            <Route path="/admin/sellers" element={<AdminSellersPage />} />
          </Route>
        </Route>
        {/* ── Public ─────────────────────────────── */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/seller/register" element={<SellerRegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route element={<ProtectedRoute allowedRoles={["BUYER"]} />}>
          <Route element={<BuyerLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductPage />} />{" "}
            <Route path="/orders" element={<OrderPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/products/:id" element={<ProductSinglePage />} />
          </Route>
        </Route>

        {/* ── Seller ─────────────────────────────── */}
        <Route element={<ProtectedRoute allowedRoles={["SELLER"]} />}>
          <Route element={<SellerLayout />}>
            <Route path="/seller" element={<SellerDashboard />} />
            <Route path="/seller/products" element={<SellerProductsPage />} />
            <Route
              path="/products/seller/create"
              element={<CreateProductPage />}
            />
            <Route path="/seller/orders" element={<SellerOrdersPage />} />
          </Route>
          <Route
            path="/products/seller/edit/:id"
            element={<EditProductPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
