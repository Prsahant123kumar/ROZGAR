import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWorkersStore } from "@/store/useWorkersStore";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const Workers = () => {
  const [input, setInput] = useState({
    WorkersName: "",
    city: "",
    country: "",
    contactNo: "",
    cuisines: [],
    imageFile: undefined,
  });
  const [errors, setErrors] = useState({});
  const {
    loading,
    Workers,
    updateWorkers,
    createWorkers,
    getWorkers,
  } = useWorkersStore();

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
      formData.append("cuisines", JSON.stringify(input.cuisines));

      if (input.imageFile) {
        formData.append("imageFile", input.imageFile);
      }

      if (Workers) {
        await updateWorkers(formData);
      } else {
        await createWorkers(formData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchWorkers = async () => {
      await getWorkers();
      if (Workers) {
        setInput({
          WorkersName: Workers.WorkersName || "",
          city: Workers.city || "",
          country: Workers.country || "",
          contactNo: Workers.contactNo || 0,
          cuisines: Array.isArray(Workers.cuisines) ? Workers.cuisines : [],
          imageFile: undefined,
        });
      }
    };
    fetchWorkers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto my-10">
      <div>
        <h1 className="font-extrabold text-2xl mb-5">Add Workers</h1>
        <form onSubmit={submitHandler}>
          <div className="md:grid grid-cols-2 gap-6 space-y-2 md:space-y-0">
            <div>
              <Label>Worker Name</Label>
              <Input
                type="text"
                name="WorkersName"
                value={input.WorkersName}
                onChange={changeEventHandler}
                placeholder="Enter your Worker name"
              />
            </div>
            <div>
              <Label>City</Label>
              <Input
                type="text"
                name="city"
                value={input.city}
                onChange={changeEventHandler}
                placeholder="Enter your city name"
              />
            </div>
            <div>
              <Label>Country</Label>
              <Input
                type="text"
                name="country"
                value={input.country}
                onChange={changeEventHandler}
                placeholder="Enter your country name"
              />
            </div>
            <div>
              <Label>Contact No.</Label>
              <Input
                type="text"
                name="contactNo"
                value={input.contactNo}
                onChange={changeEventHandler}
                placeholder="Enter your Contact No."
              />
            </div>
            <div>
              <Label>Occupation</Label>
              <Input
                type="text"
                name="cuisines"
                value={input.cuisines.join(", ")}
                onChange={(e) => setInput({ ...input, cuisines: e.target.value.split(",") })}
                placeholder="e.g. Carpenter, Labour"
              />
            </div>
            <div>
              <Label>Upload Worker Photo</Label>
              <Input
                onChange={(e) => setInput({
                  ...input,
                  imageFile: e.target.files?.[0] || undefined,
                })}
                type="file"
                accept="image/*"
                name="imageFile"
              />
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
      </div>
    </div>
  );
};

export default Workers;
