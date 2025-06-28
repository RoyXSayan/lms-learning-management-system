import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { BadgeInfo, Play, PlayCircle, Lock } from "lucide-react";
import ReactPlayer from "react-player";
import { Button } from "@/components/ui/button";
import {
  Card, CardHeader, CardContent, CardFooter,
  CardTitle, CardDescription
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BuyCourseButton from "@/components/BuyCourseButton";

// Imported Reusable Components
import LearnSection from "@/components/course/LearnSection";
import IncludesSection from "@/components/course/IncludesSection";
import RequirementsSection from "@/components/course/RequirementsSection";
import InstructorSection from "@/components/course/InstructorSection";
import RatingReviewSection from "@/components/course/RatingReviewSection";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetCourseDetailWithStatusQuery(courseId);

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Failed to load Course Details</h1>;

  const { course, purchased } = data;

  return (
    <div className="mt-20 space-y-5">
      {/* Course Header */}
      <div className="bg-[#2D2F31] text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">{course.courseTitle}</h1>
          <p className="text-base md:text-lg">{course.subTitle}</p>
          <p>
            Created By{" "}
            <span className="text-[#C0C4FC] underline italic">{course.creator.name}</span>
          </p>
          <div className="flex items-center gap-2 text-sm">
            <BadgeInfo size={16} />
            <p>Last updated {course.createdAt.split("T")[0]}</p>
          </div>
          <p>Students Enrolled: {course.enrolledStudents.length}</p>
        </div>
      </div>

      {/* Layout Body */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-10">
        {/* Left */}
        <div className="w-full lg:w-2/3 space-y-6">
          <LearnSection points={course.learningOutcomes || []} />
          <RequirementsSection points={course.requirements || []} />
          <IncludesSection course={course} />

          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>
                {course.lectures.length} lectures • {course.duration || "NA"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {course.lectures.map((lecture, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <span>
                    {purchased ? <PlayCircle size={14} /> : <Lock size={14} />}
                  </span>
                   <p>{lecture.lectureTitle}</p> {/*this is not showing title of the lecture */}
                </div>
              ))}
            </CardContent>
          </Card>

          <InstructorSection instructor={course.creator} />
          <RatingReviewSection reviews={course.reviews || []} rating={course.rating}  courseId={courseId}/>
        </div>

        {/* Right */}
        <div className="w-full lg:w-1/3">
          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="w-full aspect-video mb-4">
                <ReactPlayer
                  url={course.lectures[0]?.videoUrl}
                  width="100%"
                  height="100%"
                  controls
                />
              </div>
              <h1 className="text-base font-medium">
                {course.lectures?.[0]?.lectureTitle || "Preview Lecture"}
              </h1>
              <Separator className="my-2" />
              <h1 className="text-lg md:text-xl font-semibold">
                ₹{course.coursePrice || "Not Available"}
              </h1>
            </CardContent>
            <CardFooter className="p-4">
              {purchased ? (
                <Button onClick={() => navigate(`/course-progress/${courseId}`)} className="w-full">
                  <Play className="mr-1" /> Continue Course
                </Button>
              ) : (
                <BuyCourseButton courseId={courseId} />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
