import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
} from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

const CourseTab = () => {
  const [instructor, setInstructor] = useState({ profession: "", bio: "" });

  const updateInstructorProfile = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/user/instructor/update-profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(instructor),
        }
      );

      // Check if there’s any content in the response
      const text = await response.text();

      let data = {};
      if (text) {
        data = JSON.parse(text);
      }

      if (!response.ok) {
        throw new Error(data.message || "Update failed");
      }

      toast.success(data.message || "Instructor profile updated");
    } catch (error) {
      toast.error(error.message || "Failed to update instructor profile");
    }
  };

  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
    learningOutcomes: [""],
    requirements: [""],
    includes: [""],
  });

  const params = useParams();
  const courseId = params.courseId;
  const {
    data: courseByIdData,
    isLoading: courseByIdLoading,
    refetch,
  } = useGetCourseByIdQuery(courseId);

  const [publishCourse] = usePublishCourseMutation();

  // useEffect(() => {
  //   if (courseByIdData?.course) {
  //     const course = courseByIdData?.course;
  //     setInput({
  //       courseTitle: course.courseTitle,
  //       subTitle: course.subTitle,
  //       description: course.description,
  //       category: course.category,
  //       courseLevel: course.courseLevel,
  //       coursePrice: course.coursePrice,
  //       courseThumbnail: "",
  //     });
  //   }
  // }, [courseByIdData]);

  const [isFormReady, setIsFormReady] = useState(false);

  useEffect(() => {
    if (!courseByIdLoading && courseByIdData?.course && !isFormReady) {
      const course = courseByIdData.course;
      setInput({
        courseTitle: course.courseTitle || "",
        subTitle: course.subTitle || "",
        description: course.description || "",
        category: course.category || "",
        courseLevel: course.courseLevel || "",
        coursePrice: course.coursePrice || "",
        courseThumbnail: "",
        learningOutcomes: course.learningOutcomes || [""],
        requirements: course.requirements || [""],
        includes: course.includes || [""],
      });
      if (course.courseThumbnail) {
        setPreviewThumbnail(course.courseThumbnail);
      }
      setIsFormReady(true); // block re-initialization
    }
  }, [courseByIdLoading, courseByIdData, isFormReady]);

  //  useEffect(() => {
  //   if (courseByIdData?.course && !courseByIdLoading) {
  //     const course = courseByIdData.course;
  //     setInput((prev) => ({
  //       ...prev,
  //       courseTitle: course.courseTitle || "",
  //       subTitle: course.subTitle || "",
  //       description: course.description || "",
  //       category: course.category || "",
  //       courseLevel: course.courseLevel || "",
  //       coursePrice: course.coursePrice || "",
  //       courseThumbnail: "", // don't override preview
  //     }));

  //     if (course.courseThumbnail) {
  //       setPreviewThumbnail(course.courseThumbnail);
  //     }
  //   }
  // }, [courseByIdData, courseByIdLoading]);

  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const navigate = useNavigate();

  const [editCourse, { data, isLoading, isSuccess, error }] =
    useEditCourseMutation();

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  };
  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value });
  };

  // get file
  const selectThumbnail = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  const updateCourseHandler = async () => {
    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);
    formData.append("courseThumbnail", input.courseThumbnail);
    //new
    formData.append("learningOutcomes", JSON.stringify(input.learningOutcomes));
    formData.append("requirements", JSON.stringify(input.requirements));
    formData.append("includes", JSON.stringify(input.includes));

    await editCourse({ formData, courseId });
    await updateInstructorProfile();
  };

  const publishStatusHandler = async (action) => {
    try {
      const response = await publishCourse({ courseId, query: action });
      if (response.data) {
        refetch();
        toast.success(response.data.message || "Course published successfully");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Course updated successfully");
    }
    if (error) {
      toast.error(error.message || "Something went wrong");
    }
  }, [isSuccess, error]);

  if (courseByIdLoading || !isFormReady)
    return <Loader2 className="h-4 w-4 animate-spin mx-auto" />;

  const renderDynamicInputs = (label, name) => (
    <div>
      <Label>{label}</Label>
      {input[name].map((item, idx) => (
        <Input
          key={idx}
          className="mb-2"
          type="text"
          value={item}
          onChange={(e) => {
            const newItems = [...input[name]];
            newItems[idx] = e.target.value;
            setInput({ ...input, [name]: newItems });
          }}
        />
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setInput({ ...input, [name]: [...input[name], ""] })}
      >
        + Add More
      </Button>
    </div>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Basic Course Information</CardTitle>
          <CardDescription>
            Make changes to your courses here. Click save when you're done
          </CardDescription>
        </div>
        <div className=" space-x-2 lg:space-x-2 md:space-y-2 md:space-x-0">
          <Button
            disabled={courseByIdData?.course.lectures.length === 0}
            variant="destructive"
            onClick={() =>
              publishStatusHandler(
                courseByIdData?.course.isPublished ? "false" : "true"
              )
            }
          >
            {courseByIdData?.course.isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button>Remove course</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-5">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              name="courseTitle"
              value={input.courseTitle}
              onChange={changeEventHandler}
              placeholder="Ex: Fullstack Developer"
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              type="text"
              name="subTitle"
              value={input.subTitle}
              onChange={changeEventHandler}
              placeholder="Ex: Become a fullstack developer from scratch"
            />
          </div>
          <div>
            <Label>Description</Label>
            <RichTextEditor
              value={input.description}
              input={input}
              setInput={setInput}
            />
          </div>

          <div className="flex items-center gap-5">
            {/* for category */}
            <div>
              <Label>Category</Label>
              <Select value={input.category} onValueChange={selectCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="Next JS">Next JS</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="FullStack Development">
                      FullStack Development
                    </SelectItem>
                    <SelectItem value="MERN Stack Development">
                      MERN Stack Development
                    </SelectItem>
                    <SelectItem value="Javascript">Javascript</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Docker">Docker</SelectItem>
                    <SelectItem value="MongoDB">MongoDB</SelectItem>
                    <SelectItem value="HTML">HTML</SelectItem>
                    <SelectItem value="React JS">React JS</SelectItem>
                    <SelectItem value="Three JS">Three JS</SelectItem>
                    <SelectItem value="Redux">Redux</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {/*  for course level */}
            <div>
              <Label>Course Level</Label>
              <Select
                value={input.courseLevel}
                onValueChange={selectCourseLevel}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a course level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Level</SelectLabel>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Advance">Advance</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {/* for course price */}
            <div>
              <Label>Price in INR(₹)</Label>
              <Input
                type="number"
                name="coursePrice"
                value={input.coursePrice}
                onChange={changeEventHandler}
                placeholder="Ex: ₹500"
                className="w-fit"
                // not negetive value
                min={0}
              />
            </div>
          </div>
          {/* course thumbnail */}
          <div>
            <Label>Course Thumbnail</Label>
            <Input
              type="file"
              onChange={selectThumbnail}
              accept="image/*"
              className="w-fit"
            />
            {previewThumbnail && (
              <img
                src={previewThumbnail}
                className="w-64 my-2 "
                alt="Course Thumbnail"
              />
            )}
          </div>

          {/* Instructor Profession */}
          <div>
            <Label>Profession</Label>
            <Input
              type="text"
              value={instructor.profession}
              onChange={(e) =>
                setInstructor({
                  ...instructor,
                  profession: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>Instructor Bio</Label>
            <Textarea
              rows={4}
              value={instructor.bio}
              onChange={(e) =>
                setInstructor({ ...instructor, bio: e.target.value })
              }
            />
          </div>

          <div>
            {renderDynamicInputs("What you'll learn", "learningOutcomes")}
          </div>

          <div>{renderDynamicInputs("Requirements", "requirements")}</div>

          <div>{renderDynamicInputs("This course includes", "includes")}</div>
          {/* two buttons */}
          <div className="flex gap-3 mt-4">
            <Button onClick={() => navigate("/admin/course")} variant="outline">
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={updateCourseHandler}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please Wait..
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;
