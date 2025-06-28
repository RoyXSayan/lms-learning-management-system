import React from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

const BuyCourseButton = ({ courseId }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    sessionStorage.setItem("canAccessPayment", "true");
    navigate(`/buy-course/${courseId}`);
  };

  return (
    <Button onClick={handleClick} className="w-full">
      <Lock/> Purchase Course
    </Button>
  );
};

export default BuyCourseButton;
