import { useState } from "react";

import Button from "../components/common/Button";
import Alert from "../components/common/Alert";

import {
  registerMerchant,
  logoutMerchant,
} from "../services/authService";

function Register({
  onRegister,
  onSwitchToLogin,
  onRegistrationSuccess,
}) {
  const [
    form,
    setForm,
  ] = useState({
    businessName: "",
    identifier: "",
    password: "",
    businessType: "",
  });

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

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");

      if (
        !form.businessName.trim() ||
        !form.identifier.trim() ||
        !form.password
      ) {
        setError(
          "Business name, email/phone number and password are required."
        );
        return;
      }

      if (
        form.password.length < 6
      ) {
        setError(
          "Password must be at least 6 characters."
        );
        return;
      }

      if (
        !form.businessType
      ) {
        setError(
          "Please select a business type."
        );
        return;
      }

      try {
        setLoading(true);

        const response =
          await registerMerchant({
            businessName:
              form.businessName.trim(),

            identifier:
              form.identifier.trim(),

            password:
              form.password,

            businessType:
              form.businessType,
          });

        if (
          !response?.success
        ) {
          setError(
            response?.message ||
              "Registration failed."
          );
          return;
        }

        /*
         * Registration succeeded.
         *
         * Do not automatically authenticate
         * the merchant. Remove the token created
         * by authService and send the user to Login.
         */

        logoutMerchant();

        if (onRegistrationSuccess) {
          onRegistrationSuccess(
            "Account created successfully! Please log in to continue."
          );
        } else {
          onSwitchToLogin();
        }

      } catch (error) {
        console.error(
          "Registration error:",
          error
        );

        setError(
          error?.message ||
            "Unable to create account."
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
            Create your account
          </h1>

          <p>
            Start managing your
            commerce business.
          </p>

        </div>

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

          {/* BUSINESS NAME */}

          <div className="form-group">

            <label>
              Business Name
            </label>

            <input
              type="text"
              name="businessName"
              value={
                form.businessName
              }
              onChange={
                handleChange
              }
              placeholder="NovaTech Store"
              autoComplete="organization"
            />

          </div>

          {/* EMAIL / PHONE */}

          <div className="form-group">

            <label>
              Email / Phone Number
            </label>

            <input
              type="text"
              name="identifier"
              value={
                form.identifier
              }
              onChange={
                handleChange
              }
              placeholder="you@example.com / +91 9876543210"
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
                name="password"
                value={
                  form.password
                }
                onChange={
                  handleChange
                }
                placeholder="Create a password"
                autoComplete="new-password"
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

          {/* BUSINESS TYPE */}

          <div className="form-group">

            <label>
              Business Type
            </label>

            <select
              name="businessType"
              value={
                form.businessType
              }
              onChange={
                handleChange
              }
            >

              <option value="">
                Select business type
              </option>

              <option value="ecommerce">
                E-commerce
              </option>

              <option value="saas">
                SaaS
              </option>

              <option value="services">
                Services
              </option>

              <option value="education">
                Education
              </option>

              <option value="healthcare">
                Healthcare
              </option>

              <option value="other">
                Other
              </option>

            </select>

          </div>

          {/* CREATE ACCOUNT */}

          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            Create Account
          </Button>

        </form>

        {/* LOGIN SWITCH */}

        <div className="auth-switch">

          <span>
            Already have an account?
          </span>

          <button
            type="button"
            onClick={
              onSwitchToLogin
            }
          >
            Login
          </button>

        </div>

      </div>

    </div>
  );
}

export default Register;