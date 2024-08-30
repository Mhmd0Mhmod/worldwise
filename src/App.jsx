import { lazy, Suspense } from "react";
import { CitiesProvider } from "./Contexts/CitiesContext.jsx";
import { AuthProvider } from "./Contexts/FakeAuthContext.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Homepage from "./pages/Homepage.jsx";
// import Product from "./pages/Product.jsx";
// import Pricing from "./pages/Pricing.jsx";
// import Login from "./pages/Login.jsx";
// import PageNotFound from "./pages/PageNotFound.jsx";

const Homepage = lazy(() => import("./pages/Homepage"));
const Product = lazy(() => import("./pages/Product"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Login = lazy(() => import("./pages/Login"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

import "./index.css";
import AppLayout from "./pages/AppLayout.jsx";
import CityList from "./components/CityList.jsx";
import CountryList from "./components/CountryList.jsx";
import City from "./components/City.jsx";
import Form from "./components/Form.jsx";
import SpinnerFullPage from "./components/SpinnerFullPage.jsx";

function App() {
  return (
    <>
      <AuthProvider>
        <CitiesProvider>
          <BrowserRouter>
            <Suspense fallback={<SpinnerFullPage />}>
              <Routes>
                <Route index element={<Homepage />} />
                <Route path="product" element={<Product />} />
                <Route path="pricing" element={<Pricing />} />
                <Route path="login" element={<Login />} />
                <Route
                  path="app"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate replace to={"cities"} />} />
                  <Route path={"cities"} element={<CityList />} />
                  <Route path={"cities/:id"} element={<City />} />
                  <Route path={"countries"} element={<CountryList />} />
                  <Route path={"form"} element={<Form />} />
                  <Route path="*" element={<PageNotFound />} />
                </Route>
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CitiesProvider>
      </AuthProvider>
    </>
  );
}

export default App;
