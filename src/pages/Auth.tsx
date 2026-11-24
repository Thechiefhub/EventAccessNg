import { useSearchParams } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

/**
 * Legacy /auth entry route cleanly delegates to the rebuilt Checking SignIn or SignUp experience.
 */
export default function Auth() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  return mode === "signup" ? <SignUp /> : <SignIn />;
}
