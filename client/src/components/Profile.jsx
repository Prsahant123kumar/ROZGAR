
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/store/useUserStore";
import { Loader2, User, MapPin, LocateIcon, MapPinnedIcon, Plus, Key, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, updateProfile } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    address: user?.address || "",
    city: user?.city || "",
    country: user?.country || "",
    profilePicture: user?.profilePicture || "",
  });

  const imageRef = useRef(null);
  const [selectedProfilePicture, setSelectedProfilePicture] = useState(profileData.profilePicture || "");

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setSelectedProfilePicture(result);
        setProfileData((prevData) => ({
          ...prevData,
          profilePicture: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const updateProfileHandler = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await updateProfile(profileData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <form 
      onSubmit={updateProfileHandler} 
      className="max-w-5xl mx-auto my-10 p-6 rounded-lg shadow-md"
    >
      {/* Avatar & Name */}
      <div className="flex items-center gap-4">
        {/* Circular Avatar */}
        <div className="relative w-28 h-28">
          <Avatar className="w-full h-full rounded-full border-4 border-gray-300 shadow-md">
            <AvatarImage src={selectedProfilePicture} />
            <AvatarFallback className="w-full h-full flex items-center justify-center bg-gray-500 text-white rounded-full">
              CN
            </AvatarFallback>
            <input
              ref={imageRef}
              className="hidden"
              type="file"
              accept="image/*"
              onChange={fileChangeHandler}
            />
            <div
              onClick={() => imageRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-full cursor-pointer"
            >
              <Plus className="text-white w-8 h-8" />
            </div>
          </Avatar>
        </div>
        {/* Name Input */}
        <Input
          type="text"
          name="fullname"
          value={profileData.fullname}
          onChange={changeHandler}
          placeholder="Update your name"
          className="font-bold text-2xl text-gray-900 dark:text-white border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      {/* Reset Password Button */}
      <div className="mt-4">
        <Link 
          to="/reset-password" 
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
        >
          <Key className="w-5 h-5" /> Reset Password
        </Link>
      </div>

      {/* Two-Column Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-md">
            <Mail className="text-gray-500" />
            <div className="w-full">
              <Label>Email</Label>
              <input
                disabled
                name="email"
                value={profileData.email}
                className="w-full text-gray-600 bg-transparent border-none px-2 py-1 focus:ring-0"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-md">
            <LocateIcon className="text-gray-500" />
            <div className="w-full">
              <Label>Address</Label>
              <input
                name="address"
                value={profileData.address}
                onChange={changeHandler}
                placeholder="Update your address"
                className="w-full text-gray-600 bg-transparent border-none px-2 py-1 focus:ring-0"
              />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-md">
            <MapPin className="text-gray-500" />
            <div className="w-full">
              <Label>City</Label>
              <input
                name="city"
                value={profileData.city}
                onChange={changeHandler}
                placeholder="Update your city"
                className="w-full text-gray-600 bg-transparent border-none px-2 py-1 focus:ring-0"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-md">
            <MapPinnedIcon className="text-gray-500" />
            <div className="w-full">
              <Label>Country</Label>
              <input
                name="country"
                value={profileData.country}
                onChange={changeHandler}
                placeholder="Update your country"
                className="w-full text-gray-600 bg-transparent border-none px-2 py-1 focus:ring-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        {isLoading ? (
          <Button disabled className="bg-orange-500 hover:bg-orange-600 text-white">
            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
            Update Profile
          </Button>
        )}
      </div>
    </form>
  );
};

export default Profile;
