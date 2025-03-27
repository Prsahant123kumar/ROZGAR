import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWorkersStore } from "@/store/useWorkersStore";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const DeleteWorkerOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRef = useRef([]);
  const { loading, verifyForDeleteWorker } = useWorkersStore(); // ✅ Make sure the store function is for delete verification
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Get workerId from state or fallback to localStorage
  const { workerId } = location.state || {};
  const storedWorkerId = localStorage.getItem("workerId");
  const finalWorkerId = workerId || storedWorkerId;

  const handleChange = (index, value) => {
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
    if (value !== "" && index < 5) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const verificationCode = otp.join("");

    try {
      await verifyForDeleteWorker({ verificationCode, workerId: finalWorkerId }); // ✅ Call delete verification API
      navigate("/"); // ✅ Redirect to workers list after successful deletion
    } catch (error) {
      console.log("Error verifying OTP:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="p-8 rounded-md w-full max-w-md flex flex-col gap-10 border border-gray-200">
        <div className="text-center">
          <h1 className="font-extrabold text-2xl">Verify Deletion</h1>
          <p className="text-sm text-gray-600">
            Enter the 6-digit code sent to your registered contact number to confirm deletion.
          </p>
        </div>
        <form onSubmit={submitHandler}>
          <div className="flex justify-between">
            {otp.map((digit, idx) => (
              <Input
                key={idx}
                ref={(element) => (inputRef.current[idx] = element)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="md:w-12 md:h-12 w-8 h-8 text-center text-sm md:text-2xl font-normal md:font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ))}
          </div>
          {loading ? (
            <Button disabled className="bg-orange hover:bg-hoverOrange mt-6 w-full">
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Verifying...
            </Button>
          ) : (
            <Button className="bg-orange hover:bg-hoverOrange mt-6 w-full">
              Confirm Deletion
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default DeleteWorkerOTP;
