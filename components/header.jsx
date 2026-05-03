import { checkUser } from "@/lib/checkUser";
import Link from "next/link";
import Image from "next/image";
import RoleRedirect from "./RoleRedirect";
import AuthSection from "./AuthSection";

const Header = async () => {
  const user = await checkUser();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-3 sm:px-10 py-3 border-b border-white/7 backdrop-blur-xl">
      
      {/* Logo */}
      <Link href="/">
        <Image
          src="/logo.png"
          alt="Prept Logo"
          width={100}
          height={100}
          className="h-11 w-auto"
        />
      </Link>

      {/* Role Redirect */}
      {user && <RoleRedirect role={user.role} />}

      {/* Client Section */}
      <AuthSection user={user} />
    </nav>
  );
};

export default Header;