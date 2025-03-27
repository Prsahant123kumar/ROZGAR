import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWorkersStore } from "@/store/useWorkersStore";
import { Loader2, User, MapPin, Globe, Phone, Briefcase, Image as ImageIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Workers = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    WorkersName: "",
    city: "",
    country: "",
    contactNo: "",
    Occupations: [],
    imageFile: undefined,
  });
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState({});

  const { loading, Workers, updateWorkers, createWorkers, getWorkers } = useWorkersStore();

  const changeEventHandler = (e) => {
    const { name, value, type } = e.target;
    setInput({ ...input, [name]: type === "number" ? Number(value) : value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("WorkersName", input.WorkersName);
      formData.append("city", input.city);
      formData.append("country", input.country);
      formData.append("contactNo", input.contactNo);
      formData.append("Occupations", JSON.stringify(input.Occupations));
      if (input.imageFile) {
        formData.append("imageFile", input.imageFile);
      }
      const workerId = localStorage.getItem("workerId");
      if (!workerId) {
        console.error("Worker ID not found in localStorage!");
        return;
      }
      formData.append("workerId", workerId);
      if (Workers) {
        await updateWorkers(formData);
        navigate("/admin/verification-for-update-details", { state: { workerId } });
      } else {
        await createWorkers(formData);
      }
    } catch (error) {
      console.log("Submit Handler Error:", error);
    }
  };

  useEffect(() => {
    const fetchWorkers = async () => {
      await getWorkers();
      setLoadingData(false);
      if (Workers) {
        setInput({
          WorkersName: Workers.WorkersName || "",
          city: Workers.city || "",
          country: Workers.country || "",
          contactNo: Workers.contactNo || "",
          Occupations: Array.isArray(Workers.Occupations) ? Workers.Occupations : [],
          imageFile: undefined,
        });
        if (Workers._id) {
          localStorage.setItem("workerId", Workers._id);
        } else {
          console.error("Worker ID not found!");
        }
      }
    };
    fetchWorkers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto my-10 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-xl">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
        {loadingData ? "Loading Worker Details..." : Workers ? "Update Worker" : "Add Worker"}
      </h1>

      {loadingData ? (
        <div className="flex items-center space-x-2">
          <Loader2 className="animate-spin h-6 w-6 text-orange-600" />
          <span className="text-gray-700 dark:text-gray-200">Fetching worker details...</span>
        </div>
      ) : (
        <form onSubmit={submitHandler}>
          {/* Two-Column Grid: 3 fields on each side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <User className="w-5 h-5" /> Worker Name
                </Label>
                <Input
                  type="text"
                  name="WorkersName"
                  value={input.WorkersName}
                  onChange={changeEventHandler}
                  placeholder="Enter your Worker name"
                />
              </div>
              <div>
                <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <MapPin className="w-5 h-5" /> City
                </Label>
                <Input
                  type="text"
                  name="city"
                  value={input.city}
                  onChange={changeEventHandler}
                  placeholder="Enter your city name"
                />
              </div>
              <div>
                <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Globe className="w-5 h-5" /> Country
                </Label>
                <Input
                  type="text"
                  name="country"
                  value={input.country}
                  onChange={changeEventHandler}
                  placeholder="Enter your country name"
                />
              </div>
            </div>
            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Phone className="w-5 h-5" /> Contact No.
                </Label>
                <Input
                  type="text"
                  name="contactNo"
                  value={input.contactNo}
                  onChange={changeEventHandler}
                  placeholder="Enter your Contact No."
                />
              </div>
              <div>
                <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Briefcase className="w-5 h-5" /> Occupation
                </Label>
                <Input
                  type="text"
                  name="Occupations"
                  value={input.Occupations.join(", ")}
                  onChange={(e) =>
                    setInput({ ...input, Occupations: e.target.value.split(",") })
                  }
                  placeholder="e.g. Carpenter, Labour"
                />
              </div>
              <div>
                <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <ImageIcon className="w-5 h-5" /> Upload Worker Photo
                </Label>
                <Input
                  onChange={(e) =>
                    setInput({
                      ...input,
                      imageFile: e.target.files?.[0] || undefined,
                    })
                  }
                  type="file"
                  accept="image/*"
                  name="imageFile"
                />
              </div>
            </div>
          </div>
          <div className="my-5 w-fit">
            {loading ? (
              <Button disabled className="bg-orange hover:bg-hoverOrange">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button className="bg-orange hover:bg-hoverOrange">
                {Workers ? "Update Your Worker" : "Add Your Worker"}
              </Button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default Workers;
