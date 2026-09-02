import { useState } from "react";

import Button from "../components/common/Button";
import Alert from "../components/common/Alert";

import {
  loginMerchant,
} from "../services/authService";

function Login({
  onLogin,
  onSwitchToRegister,
  successMessage = "",
}) {
  const [
    identifier,
    setIdentifier,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");

      if (
        !identifier.trim() ||
        !password
      ) {
        setError(
          "Email or phone number and password are required."
        );
        return;
      }

      try {
        setLoading(true);

        const response =
          await loginMerchant(
            identifier.trim(),
            password
          );

        if (
          !response?.success
        ) {
          setError(
            response?.message ||
              "Login failed."
          );
          return;
        }

        onLogin(
          response.data?.merchant
        );

      } catch (error) {
        console.error(
          "Login error:",
          error
        );

        setError(
          error?.message ||
            "Unable to login."
        );

      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          M
        </div>

        <div className="auth-header">

          <p className="section-label">
            MERCHANTOS
          </p>

          <h1>
            Welcome back
          </h1>

          <p>
            Sign in to your MerchantOS
            account.
          </p>

        </div>

        {/* REGISTRATION SUCCESS */}

        {successMessage && (
          <Alert
            type="success"
            message={successMessage}
          />
        )}

        {/* LOGIN ERROR */}

        <Alert
          type="error"
          message={error}
          onClose={() =>
            setError("")
          }
        />

        <form
          onSubmit={handleSubmit}
        >

          {/* EMAIL / PHONE */}

          <div className="form-group">

            <label>
              Email / Phone Number
            </label>

            <input
              type="text"
              value={
                identifier
              }
              onChange={(
                event
              ) =>
                setIdentifier(
                  event.target.value
                )
              }
              placeholder="Email ID / Phone Number"
              autoComplete="username"
            />

          </div>

          {/* PASSWORD */}

          <div className="form-group">

            <label>
              Password
            </label>

            <div
              style={{
                position:
                  "relative",
                width: "100%",
              }}
            >

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={
                  password
                }
                onChange={(
                  event
                ) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                style={{
                  width: "100%",
                  paddingRight:
                    "60px",
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (
                      previous
                    ) =>
                      !previous
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                title={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                style={{
                  position:
                    "absolute",
                  right: "10px",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  border: "none",
                  background:
                    "transparent",
                  cursor:
                    "pointer",
                  padding: "6px",
                  fontSize:
                    "13px",
                  fontWeight:
                    "600",
                  color:
                    "#475569",
                }}
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

          </div>

          {/* LOGIN BUTTON */}

          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            Login
          </Button>

        </form>

        {/* REGISTER SWITCH */}

        <div className="auth-switch">

          <span>
            Don't have an account?
          </span>

          <button
            type="button"
            onClick={
              onSwitchToRegister
            }
          >
            Create Account
          </button>

        </div>

      </div>

    </div>
  );
}

export default Login;