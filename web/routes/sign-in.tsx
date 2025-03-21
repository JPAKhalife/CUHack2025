import { useActionForm } from "@gadgetinc/react";
import { api } from "../api";
import { Link, useLocation } from "react-router";

export const SignInPage = () => {
  const {
    register,
    submit,
    formState: { errors, isSubmitting },
  } = useActionForm(api.user.signIn);
  const { search } = useLocation();

  return (
    <form className="custom-form" onSubmit={submit}>
      <h1 className="form-title">Sign in</h1>
      <div className="custom-form">
        <a className="google-oauth-button" href={`/auth/google/start${search}`}>
          <img src="https://assets.gadget.dev/assets/default-app-assets/google.svg" width={22} height={22} /> Continue with Google
        </a>
        <input className="custom-input" placeholder="Email" {...register("email")} />
        <input className="custom-input" placeholder="Password" type="password" {...register("password")} />
        {errors?.root?.message && <p className="format-message error">{errors.root.message}</p>}
        <button disabled={isSubmitting} type="submit">
          Sign in
        </button>
        <p>
          Forgot your password? <Link to="/forgot-password">Reset password</Link>
        </p>
      </div>
    </form>
  );
};
