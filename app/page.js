import CrimeForm from "@/components/CrimeFrom";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

export default function page() {
  return (
    <div className="">
      <LoginForm />
      <RegisterForm />
      <CrimeForm />
    </div>
  );
}
