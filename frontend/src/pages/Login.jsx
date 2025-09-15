import { useEffect, useState } from "react";
import signupSvg from "../assets/icons/signup.svg";
import axios from "axios";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useCalendar } from "../context/CalendarContext";

const Login = () => {
  const [formMode, setFormMode] = useState("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setToast } = useToast();
  const [click, setClick] = useState(false);
  const { auth, setAuth } = useAuth();
  const {getMyCalendars, getSharedCalendars}  = useCalendar()
  const location = useLocation();
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (formMode === "signup" && password !== confirmPassword) {
      return setToast("Passwords are not matched", "warning");
    }
    try {
      setClick(true);
      let response;
      if (formMode === "signup") {
        response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/signup`,
          { name, email, password },
          { withCredentials: true }
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/login`,
          { email, password },
          { withCredentials: true }
        );
      }

      if (response.data.success) {
        setToast(response.data.message, "success");
        setAuth(response.data.success);
      } else {
        setToast(response.data.message, "warning");
      }
    } catch (error) {
      setToast(error.message, "error");
    } finally {
      setClick(false);
    }
  };

  useEffect(() => {}, [auth]);
  useEffect(() => {
    if (location.search.includes("signin")) {
      setFormMode("signin");
    }
  }, [location]);

  if (auth) {
    getMyCalendars()
    getSharedCalendars()
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen md:flex md:justify-center">
      <div className="bg-[#FDFEFE] flex flex-col py-8 px-3 md:w-[60%] lg:w-[40%]">
        <div className="flex items-center justify-center">
          <img className="p-4 bg-fill rounded-md" src={signupSvg} alt="" />
        </div>
        <h1 className="text-primary text-3xl font-bold text-center mt-5">
          {formMode === "signup" ? "Create your Account" : "Welcome Back"}
        </h1>
        <p className="font-medium text-center text-base text-secondary my-3">
          {formMode === "signup"
            ? "Start managing your calendar today!"
            : "Sign in to your calendar account"}
        </p>
        <div className="bg-white shadow-sm p-4">
          <div className="mt-5 flex flex-col items-center">
            <h2 className="text-2xl font-semibold">
              {formMode === "signup" ? "Sign up" : "Sign In"}
            </h2>
            <p className="text-secondary font-normal text-sm text-center mt-1">
              {formMode === "signup"
                ? "Create an account to get started with your calendar"
                : "Enter your email and password to access your calendar"}
            </p>
            <p className="w-full text-center mt-6 text-secondary font-normal text-xs relative before:absolute before:w-1/4 before:h-[1px] before:bg-secondary before:left-0 before:bottom-[50%] after:absolute after:w-1/4 after:h-[1px] after:bg-secondary after:right-0 after:bottom-[50%]">
              CONTINUE WITH EMAIL
            </p>
          </div>
          <form className="py-4" onSubmit={onSubmitHandler}>
            <div className="flex flex-col">
              {formMode === "signup" && (
                <>
                  <label className="mb-2 text-sm font-medium" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    className="border-1 border-border py-2 px-3 mb-4 focus:outline-3 focus:outline-fill focus:outline-offset-2 rounded-lg"
                    type="text"
                    placeholder="John Doe"
                    required
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </>
              )}
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium" htmlFor="email">
                Email
              </label>
              <input
                className="border-1 border-border py-2 px-3 mb-4 focus:outline-3 focus:outline-fill focus:outline-offset-2 rounded-lg"
                type="email"
                placeholder="name@example.com"
                required
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium" htmlFor="password">
                Password
              </label>
              <input
                className="border-1 border-border py-2 px-3 mb-4 focus:outline-3 focus:outline-fill focus:outline-offset-2 rounded-lg"
                type="password"
                placeholder="********"
                required
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              {formMode === "signup" && (
                <>
                  <label
                    className="mb-2 text-sm font-medium"
                    htmlFor="confirmPassord"
                  >
                    Confirm Password
                  </label>
                  <input
                    className="border-1 border-border py-2 px-3 mb-4 focus:outline-3 focus:outline-fill focus:outline-offset-2 rounded-lg"
                    type="password"
                    placeholder="********"
                    required
                    name="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </>
              )}
            </div>
            <button
              disabled={click ? true : false}
              className="w-full py-3 bg-fill rounded-lg text-white cursor-pointer text-base font-normal hover:bg-fill-fade"
            >
              {formMode === "signup"
                ? click
                  ? "Creating..."
                  : "Create Your Account"
                : click
                ? "Please wait..."
                : "Sign In"}
            </button>
          </form>

          <p className="text-secondary font-normal text-sm text-center select-none">
            {formMode === "signup"
              ? "Already have an account? "
              : "Don't have an account? "}
            <span
              onClick={() => {
                setFormMode((prev) =>
                  prev === "signup" ? "signin" : "signup"
                );
              }}
              className="text-fill text-sm font-medium cursor-pointer"
            >
              {formMode === "signup" ? "Sign In" : "Sign up"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
