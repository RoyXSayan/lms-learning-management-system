import React from "react";
import { Star } from "lucide-react";

const InstructorSection = ({ instructor }) => {
  if (!instructor) return null;

  const {
    name,
    photoURL,
    profession = "Instructor",
    bio = "No bio available.",
    rating = 0,
    totalReviews = 0,
    totalStudents = 0,
    totalCourses = 0,
  } = instructor;

  return (
    <div className="border rounded-lg p-6 shadow-sm space-y-4 bg-white dark:bg-[#1a1a1a]">
      <h2 className="text-2xl font-bold mb-4">Instructor</h2>
      <div className="flex items-center gap-4">
        <img
          src={photoURL}
          alt={name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{profession}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mt-4 text-gray-700 dark:text-gray-300">
        <div>
          <p className="font-semibold flex items-center gap-1">
            <Star size={16} className="text-yellow-400" /> {rating}
          </p>
          <p className="text-xs text-muted-foreground">Instructor Rating</p>
        </div>
        <div>
          <p className="font-semibold">{totalReviews}</p>
          <p className="text-xs text-muted-foreground">Reviews</p>
        </div>
        <div>
          <p className="font-semibold">{totalStudents}</p>
          <p className="text-xs text-muted-foreground">Students</p>
        </div>
        <div>
          <p className="font-semibold">{totalCourses}</p>
          <p className="text-xs text-muted-foreground">Courses</p>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="font-semibold text-base mb-2">About Instructor</h4>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {bio}
        </p>
      </div>
    </div>
  );
};

export default InstructorSection;
