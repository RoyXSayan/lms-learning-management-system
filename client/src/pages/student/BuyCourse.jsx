import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { usePurchaseCourseMutation } from "@/features/api/purchaseApi";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CreditCard, IndianRupee, Banknote, ScanLine } from "lucide-react";
import { motion } from "framer-motion";
import ExpiredPage from "@/components/ExpiredPage";
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";

const BuyCourse = () => {
  const { courseId } = useParams();
  const [purchaseCourse, { isLoading }] = usePurchaseCourseMutation();
  const navigate = useNavigate();
  const { refetch } = useGetCourseDetailWithStatusQuery(courseId);

  const [activeTab, setActiveTab] = useState("card");
  const [expired, setExpired] = useState(false);


  //  This timeLeft State + Countdown Logic
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds

useEffect(() => {
  const interval = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(interval);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, []);


  useEffect(() => {
    const timer = setTimeout(() => {
      setExpired(true);
      sessionStorage.removeItem("canAccessPayment");
    }, 5 * 60 * 1000); // 5 minutes

    const access = sessionStorage.getItem("canAccessPayment");
    if (!access) {
      setExpired(true);
    }

    return () => clearTimeout(timer);
  }, []);

  const [form, setForm] = useState({
    nameOnCard: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);

  // ✅ Validation logic
  useEffect(() => {
    const nameValid = /^[A-Za-z\s]+$/.test(form.nameOnCard.trim());
    const cardValid = /^\d{16}$/.test(form.cardNumber.replace(/\s/g, ""));
    const expiryValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry);
    const cvvValid = /^\d{3}$/.test(form.cvv);
    setIsFormValid(nameValid && cardValid && expiryValid && cvvValid);
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "nameOnCard") {
      // Allow only letters and spaces
      const filtered = value.replace(/[^A-Za-z\s]/g, "");
      setForm({ ...form, [name]: filtered });
    } else if (name === "cardNumber") {
      // Allow only digits and format like 1234 5678 9012 3456
      const clean = value.replace(/\D/g, "").substring(0, 16);
      const formatted = clean.replace(/(.{4})/g, "$1 ").trim();
      setForm({ ...form, [name]: formatted });
    } else if (name === "expiry") {
      // Auto-insert slash after 2 digits
      let clean = value.replace(/\D/g, "").substring(0, 4);
      if (clean.length > 2) clean = `${clean.slice(0, 2)}/${clean.slice(2)}`;
      setForm({ ...form, [name]: clean });
    } else if (name === "cvv") {
      const clean = value.replace(/\D/g, "").substring(0, 3);
      setForm({ ...form, [name]: clean });
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await purchaseCourse(courseId).unwrap();
      toast.success(response.message);
      await refetch();
      sessionStorage.removeItem("canAccessPayment");
      navigate(`/payment-success/${courseId}`);
    } catch (error) {
      const message = error?.data?.message || "Payment failed";
      if (message.toLowerCase().includes("already purchased")) {
        toast.info("You have already purchased this course.");
      } else {
        toast.error(message);
      }
    }
  };

  if (expired) {
    return <ExpiredPage />;
  }

  return (
    <div className="max-w-2xl mx-auto mt-20 p-6 rounded-2xl bg-white dark:bg-zinc-900 shadow-lg">
    
     <div className="text-center mb-6">
  <h2 className="text-3xl font-bold">Complete Your Payment</h2>
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="mt-2 text-base font-medium text-gray-600 dark:text-gray-300"
  >
    Please complete the payment within:
    <motion.span
      key={timeLeft} // Animate every second
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`ml-2 px-3 py-1 rounded-md text-lg font-semibold ${
        timeLeft <= 60 ? "text-red-500" : "text-blue-600"
      }`}
    >
      {Math.floor(timeLeft / 60)
        .toString()
        .padStart(2, "0")}
      :
      {(timeLeft % 60).toString().padStart(2, "0")}
    </motion.span>
  </motion.div>
</div>


      <div className="grid grid-cols-3 gap-4 mb-6">
        {["card", "upi", "netbanking"].map((tab) => {
          const Icon =
            tab === "card" ? CreditCard : tab === "upi" ? ScanLine : Banknote;
          const label =
            tab === "card" ? "Card" : tab === "upi" ? "UPI" : "NetBanking";
          return (
            <button
              key={tab}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg transition-all ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          );
        })}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {activeTab === "card" && (
          <>
            <div className="rounded-xl p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white shadow-inner border border-gray-600">
              <div className="mb-4">
                <label className="block mb-1 text-sm text-gray-300">
                  Cardholder Name
                </label>
                <input
                  className="w-full bg-transparent border-b border-gray-500 py-1 px-2 focus:outline-none focus:border-blue-400"
                  name="nameOnCard"
                  value={form.nameOnCard}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm text-gray-300">
                  Card Number
                </label>
                <input
                  className="w-full bg-transparent border-b border-gray-500 py-1 px-2 focus:outline-none focus:border-blue-400"
                  name="cardNumber"
                  value={form.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block mb-1 text-sm text-gray-300">
                    Expiry
                  </label>
                  <input
                    className="w-full bg-transparent border-b border-gray-500 py-1 px-2 focus:outline-none focus:border-blue-400"
                    name="expiry"
                    value={form.expiry}
                    onChange={handleChange}
                    placeholder="MM/YY"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 text-sm text-gray-300">
                    CVV
                  </label>
                  <input
                    className="w-full bg-transparent border-b border-gray-500 py-1 px-2 focus:outline-none focus:border-blue-400"
                    name="cvv"
                    value={form.cvv}
                    onChange={handleChange}
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || isLoading}
              className={`w-full transition-all ${
                !isFormValid ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Processing..." : "Pay Now"}
            </Button>
          </>
        )}

        {activeTab === "upi" && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <IndianRupee className="mx-auto mb-2 h-8 w-8" />
            <p>UPI support is coming soon.</p>
          </div>
        )}

        {activeTab === "netbanking" && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Banknote className="mx-auto mb-2 h-8 w-8" />
            <p>NetBanking option will be available shortly.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BuyCourse;
