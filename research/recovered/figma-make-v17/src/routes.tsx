import { createBrowserRouter } from "react-router"
import MeeranaHome from "./pages/MeeranaHome"
import ProductPage from "./pages/ProductPage"

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MeeranaHome,
  },
  {
    path: "/products/:slug",
    Component: ProductPage,
  },
  {
    path: "*",
    Component: MeeranaHome,
  },
])
