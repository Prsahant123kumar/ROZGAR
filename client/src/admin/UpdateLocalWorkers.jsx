import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWorkersStore } from "@/store/useWorkersStore";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UpdateLocalWorkers = () => {
  const navigate = useNavigate();
  const { loading, updateWorkers, createWorkers, getWorkers, LocalWorkers } = useWorkersStore();

  // ✅ Use only LocalWorkers (fallback to empty values if undefined)
  const [input, setInput] = useState({
    WorkersName: LocalWorkers?.WorkersName || "",
    city: LocalWorkers?.city || "",
    country: LocalWorkers?.country || "",
    contactNo: LocalWorkers?.contactNo || "",
    Occupations: LocalWorkers?.Occupations || [],
    imageFile: undefined,
  });

  const [loadingData, setLoadingData] = useState(true);

  // ✅ Fetch workers only if LocalWorkers is empty
  useEffect(() => {
    const fetchWorkers = async () => {
      if (!LocalWorkers || Object.keys(LocalWorkers).length === 0) {
        await getWorkers();
      }
      setLoadingData(false);
    };

    fetchWorkers();
  }, [LocalWorkers]);

  const changeEventHandler = (e) => {
    const { name, value, type } = e.target;
    setInput({ ...input, [name]: type === "number" ? Number(value) : value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!LocalWorkers?._id) {
      console.error("Worker ID is missing!");
      return;
    }

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

      formData.append("workerId", LocalWorkers._id);
      const response = await updateWorkers(formData);

      // if (response.success) {

        navigate("/admin/verification-for-update-details", { state: { workerId: LocalWorkers._id } });
      // }
    } catch (error) {
      console.error("Submit Handler Error:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-10">
      <div>
        <h1 className="font-extrabold text-2xl mb-5">
          {loadingData ? "Loading Worker Details..." : LocalWorkers?._id ? "Update Worker" : "Add Worker"}
        </h1>

        {loadingData ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="animate-spin h-6 w-6 text-orange-600" />
            <span>Fetching worker details...</span>
          </div>
        ) : (
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
                  name="Occupations"
                  value={input.Occupations.join(", ")}
                  onChange={(e) => setInput({ ...input, Occupations: e.target.value.split(",") })}
                  placeholder="e.g. Carpenter, Labour"
                />
              </div>
              <div>
                <Label>Upload Worker Photo</Label>
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
            <div className="my-5 w-fit">
              {loading ? (
                <Button disabled className="bg-orange hover:bg-hoverOrange">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button className="bg-orange hover:bg-hoverOrange">
                  {LocalWorkers?._id ? "Update Your Worker" : "Add Your Worker"}
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateLocalWorkers;
