

import { useWorkersStore } from "@/store/useWorkersStore";
import { Badge } from "./ui/badge";
import { PhoneOutgoing, Edit2 } from "lucide-react";
import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AddReviewForm from "./AddReviewForm";
import WorkersReviews from "./WorkersReviews";

const WorkersDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { singleWorkers, getSingleWorkers, getInformation } = useWorkersStore();
  const user = JSON.parse(localStorage.getItem("user-name"));
  const state = user?.state?.user;
  const userId = { id: state ? state._id : null, name: state ? state.fullname : null };

  useEffect(() => {
    getSingleWorkers(params.id);
  }, [params.id]);

  const takeInformation = async (workerId) => {
    try {
      const information = await getInformation(workerId);
      navigate("/admin/UpdateLocalWorkers");
    } catch (error) {
      console.error("Error in takeInformation:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto my-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Worker Image and Details */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          {/* Worker Image in Square */}
          <div className="relative w-full h-80 rounded-lg overflow-hidden">
            <img
              src={singleWorkers?.imageUrl || "https://via.placeholder.com/800x800"}
              alt="Worker"
              className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Worker Details */}
          <div className="mt-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {singleWorkers?.WorkersName || "Loading..."}
            </h1>
            <div className="flex flex-wrap gap-2 mt-4">
              {singleWorkers?.Occupations?.map((Occupation, idx) => (
                <Badge
                  key={idx}
                  className="bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100"
                >
                  {Occupation}
                </Badge>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-4 text-gray-700 dark:text-gray-300">
              <PhoneOutgoing className="w-5 h-5" />
              <span className="font-medium">Contact No.:</span>
              <span className="text-orange-600 dark:text-orange-400">
                {singleWorkers?.contactNo || "N/A"}
              </span>
            </div>
          </div>

          {/* Update Details Button */}
          <div className="mt-6">
            <button
              onClick={() => takeInformation(singleWorkers._id)}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition-colors duration-200"
            >
              <Edit2 size={18} /> Update Details
            </button>
          </div>
        </div>

        {/* Right Side: Add Review Form and Reviews */}
        <div className="space-y-8">
          <AddReviewForm WorkersId={params.id} userId={userId.id} fullname={userId.name} />
          <WorkersReviews WorkersId={params.id} />
        </div>
      </div>
    </div>
  );
};

export default WorkersDetail;

