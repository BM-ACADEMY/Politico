import { Mail, Lock, Loader2 } from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import loginImage from "@/assets/img/politicobg.png";
import logo from "@/assets/img/Bmlogo.png";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const isEmail = emailOrPhone.includes("@");
      const credentials = {
        [isEmail ? "email" : "phone"]: emailOrPhone,
        password,
      };
      await login(credentials);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 md:p-10 bg-cover bg-center" style={{ backgroundImage: `url(${loginImage})` }}>
      <form className="max-w-96 w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white" onSubmit={handleSubmit}>
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">Welcome back</h1>
        <p className="text-gray-500 text-sm mt-2">Login to Politico account</p>
        
        <div className="flex items-center w-full mt-10 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Mail size={16} className="text-gray-500" />
          <input
            type="text"
            placeholder="Email or Phone"
            name="email"
            className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Lock size={16} className="text-gray-500" />
          <input
            type="password"
            placeholder="Password"
            className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mt-5 text-left text-indigo-500">
          <Link to="/forgot-password" className="text-sm">Forgot password?</Link>
        </div>

        <button
          type="submit"
          className="mt-2 mb-5 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        
      <div className="mt-2 flex items-center justify-center gap-2">
        <span className="text-[#3b3b3b]">build by</span>
        <img src={logo} alt="Logo" className="h-8 object-contain" />
      </div>

      <div className="text-[#3b3b3b] text-center text-xs mt-4 mb-6">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline underline-offset-4 hover:text-indigo-500">Terms of Service</a> and{" "}
        <a href="#" className="underline underline-offset-4 hover:text-indigo-500">Privacy Policy</a>.
      </div>

      
      </form>

      {/* <div className="mt-6 flex items-center justify-center gap-2">
        <span className="text-[#3b3b3b]">build by</span>
        <img src={logo} alt="Logo" className="h-8 object-contain" />
      </div>

      <div className="text-[#3b3b3b] text-center text-xs mt-4">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline underline-offset-4 hover:text-indigo-500">Terms of Service</a> and{" "}
        <a href="#" className="underline underline-offset-4 hover:text-indigo-500">Privacy Policy</a>.
      </div> */}
    </div>
  );
};

export default Login;