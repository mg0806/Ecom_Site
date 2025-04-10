"use client";

import { useEffect, useState } from "react";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";

import Input from "@/components/inputs/input";
import Button from "@/components/universal/Button";
import Heading from "@/components/universal/Heading";
import Loader from "@/components/universal/Loader";
import { SafeUser } from "@/types";

interface LoginFormProps {
  currentUser: SafeUser | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ currentUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: { email: "", password: "" },
  });

  // Redirect logged-in users to cart
  useEffect(() => {
    if (currentUser) {
      router.push("/cart");
      router.refresh();
    }
  }, [currentUser, router]);

  // Handle Email/Password Login
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    const callback = await signIn("credentials", { ...data, redirect: false });

    setIsLoading(false);

    if (callback?.ok) {
      toast.success("Logged In");
      router.push("/cart");
      router.refresh();
    } else if (callback?.error) {
      toast.error(callback.error);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google"); // Redirects to Google OAuth
  };

  if (currentUser) {
    return (
      <p className="mt-6 px-4 text-sm text-slate-700">
        Logged In. Redirecting...
      </p>
    );
  }

  return (
    <>
      <Heading title="Sign in to MT-Shop" />
      <Button
        outline
        lable={isLoading ? "Loading..." : "Continue with Google"}
        icon={AiOutlineGoogle}
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      />
      <hr className="bg-slate-300 w-full h-px" />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="password"
      />
      <Button
        lable={isLoading ? "Loading..." : "Login"}
        onClick={handleSubmit(onSubmit)}
        disabled={isLoading}
      />
      <p className="text-sm">
        Don&apos;t have an account?
        <Link className="underline" href="/Register">
          {" "}
          Sign up
        </Link>
      </p>
      {isLoading && <Loader />} {/* Show loader while signing in */}
    </>
  );
};

export default LoginForm;
