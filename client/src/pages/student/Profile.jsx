import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react";

import React, { useEffect, useState } from "react";
import Course from "./Course";
import {
  useLoadUserQuery,
  useUpdateUserMutation,
} from "@/features/api/authApi";
import { toast } from "sonner";

const Profile = () => {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  const { data, isLoading, refetch } = useLoadUserQuery();

  const [
    updateUser,
    {
      data: updateUserData,
      isLoading: updateUserIsLoading,
      isError,
      isSuccess,
    },
  ] = useUpdateUserMutation();

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("profilePhoto", profilePhoto);
    await updateUser(formData);
  };

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(updateUserData?.message || "Profile updated successfully");
    }
    if (isError) {
      toast.error(isError.message || "Something went wrong");
    }
  }, [updateUserData, isSuccess, isError]);

  if (isLoading) return <ProfileSkeleton />;

  const user = data && data.user;

  return (
    <div className="max-w-4xl mx-auto px-4 my-24">
      <h1 className="text-2xl font-bold text-center md:text-left">Profile</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
            <AvatarImage
              src={
                user?.photoURL ||
                "https://static.vecteezy.com/ti/vecteur-libre/t1/6487917-homme-avatar-vecteur-icone-gratuit-vectoriel.jpg"
              }
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div className="mb-2">
            <h1 className="font-bold text-gray-900 dark:text-gray-100">
              Name:
              <span className="font-semibold text-gray-700 dark:text-gray-300 ml-2">
                {user.name}
              </span>
            </h1>
          </div>

          <div className="mb-2">
            <h1 className="font-bold text-gray-900 dark:text-gray-100">
              Email:
              <span className="font-semibold text-gray-700 dark:text-gray-300 ml-2">
                {user.email}
              </span>
            </h1>
          </div>

          <div className="mb-2">
            <h1 className="font-bold text-gray-900 dark:text-gray-100">
              Role:
              <span className="font-semibold text-gray-700 dark:text-gray-300 ml-2">
                {user.role.toUpperCase()}
              </span>
            </h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="mt-2">
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make Changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Name</Label>
                  <Input
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="col-span-3"
                  ></Input>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Profile Photo</Label>
                  <Input
                    onChange={onChangeHandler}
                    type="file"
                    accept="image/*"
                    className="col-span-3"
                  ></Input>
                </div>
              </div>
              <DialogFooter>
                <Button
                  disabled={updateUserIsLoading}
                  onClick={updateUserHandler}
                >
                  {updateUserIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                      wait
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div>
        <h1 className="text-lg font-medium">Courses you're enrolled in</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
          {user.enrolledCourses.length === 0 ? (
            <h1>You haven't enrolled yet</h1>
          ) : (
            user.enrolledCourses.map((course) => (
              <Course course={course} key={course._id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

// skeleton
const ProfileSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 my-24 animate-pulse">
      {/* Title */}
      <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-6" />

      {/* Avatar + Info */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
        {/* Avatar */}
        <div className="rounded-full bg-gray-300 dark:bg-gray-700 h-24 w-24 md:h-32 md:w-32" />

        {/* Name, Email, Role */}
        <div className="flex flex-col gap-4 w-full">
          <div className="h-4 w-48 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-4 w-64 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-4 w-40 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
      </div>

      {/* Courses Title */}
      <div className="h-5 w-64 bg-gray-300 dark:bg-gray-700 rounded mb-4" />

      {/* Course Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-40 bg-gray-300 dark:bg-gray-700 rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};
