import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import type { ReactNode } from "react";
const AddMovie = lazy(() => import("./components/AddMovie"));
const EditMovie = lazy(() => import("./components/EditMovie"));
const MovieList = lazy(() => import("./components/MovieList"));
const Landing = lazy(() => import("./components/Landing"));
const Signup = lazy(() => import("./components/Signup"));
const Login = lazy(() => import("./components/Login"));
const KK = lazy(() => import("./components/Learning"));
const Login1 = lazy(() => import("./components/Test"));

import Loading from "./components/loader/Loading";
function Load() {
  return <Loading></Loading>;
}

function RequireAuth({ children }: { children: ReactNode }) {
  return localStorage.getItem("token") ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
}

function App() {
  return (
    <Suspense fallback={<Load />}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/kk" element={<KK />} />
          <Route path="/test" element={<Login1 />} />

          <Route
            path="/movielist"
            element={
              <RequireAuth>
                <MovieList />
              </RequireAuth>
            }
          />
          <Route
            path="/add"
            element={
              <RequireAuth>
                <AddMovie />
              </RequireAuth>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <RequireAuth>
                <EditMovie />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
