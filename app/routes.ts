import { index, prefix, route } from "@react-router/dev/routes";

export default [
  index("./routes/_index.tsx"),
  route("login", "./routes/_auth.login.tsx"),
  route("logout", "./routes/_auth.logout.tsx"),
  route("signup", "./routes/_auth.signup.tsx"),
  route("cart", "./routes/_user.cart.tsx"),
  route("checkout", "./routes/_user.checkout.tsx"),
  route("admin", "./routes/admin.tsx", [
    ...prefix("dashboard", [
      index("./routes/admin.dashboard._index.tsx"),
      route("new", "./routes/admin.dashboard.new.tsx"),
      route("products", "./routes/admin.dashboard.products.tsx"),
      route("profile", "./routes/admin.dashboard.profile.tsx"),
      ...prefix("edit", [
        index("./routes/admin.dashboard.edit._index.tsx"),
        route(":slug", "./routes/admin.dashboard.edit.$slug.tsx"),
      ]),
    ]),
  ]),
  ...prefix("example", [route("mapbox", "./routes/example.mapbox.tsx")]),
  ...prefix("products", [
    index("./routes/products._index.tsx"),
    route(":slug", "./routes/products.$slug.tsx"),
  ]),
  ...prefix("user", [
    ...prefix("dashboard", [
      index("./routes/user.dashboard._index.tsx"),
      route("profile", "./routes/user.dashboard.profile.tsx"),
    ]),
  ]),
];
