import { Link, useParams } from "react-router-dom";
import FilterPage from "./FilterPage";
import { Input } from "./ui/input.jsx";
import { useEffect, useState } from "react";
import { Button } from "./ui/button.jsx";
import { Badge } from "./ui/badge.jsx";
import { Globe, MapPin, Trash2, Briefcase } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { AspectRatio } from "./ui/aspect-ratio";
import { Skeleton } from "./ui/skeleton";
import { useWorkersStore } from "@/store/useWorkersStore";
import StarRating from "./StarRating";
import { useNavigate } from "react-router-dom";
const SearchPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { loading, searchedWorkers, searchWorkers, setAppliedFilter, appliedFilter, DeleteWorker } = useWorkersStore();

  useEffect(() => {
    searchWorkers(params.text, searchQuery, appliedFilter);
  }, [params.text, searchQuery, appliedFilter]);

  const deleteCall = async (workerId) => {
    try {
      await DeleteWorker(workerId);
      navigate("/admin/verification-for-Delete-Worker", { state: { workerId } });
    } catch (error) {
      console.error("Error in deleteCall:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto my-10 px-4">
      <div className="flex flex-col md:flex-row gap-10">
        <FilterPage />
        <div className="flex-1">
          {/* Search Input Field */}
          <div className="flex items-center gap-3 mb-6">
            <Input
              type="text"
              value={searchQuery}
              placeholder="Search by Worker's Name or Passion"
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:max-w-lg border-gray-300 dark:border-gray-600 rounded-lg"
            />
            <Button
              onClick={() => searchWorkers(params.text, searchQuery, appliedFilter)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:from-orange-600 hover:to-orange-700"
            >
              Search
            </Button>
          </div>
          {/* Applied Filters */}
          <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-4">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              ({searchedWorkers?.data?.length || 0}) Search result
              {searchedWorkers?.data?.length === 1 ? "" : "s"} found
            </h1>
            <div className="flex flex-wrap gap-2">
              {appliedFilter.map((selectedFilter, idx) => (
                <div key={idx} className="relative inline-flex items-center max-w-full">
                  <Badge
                    className="text-orange-600 border-orange-600 rounded-md pr-7 whitespace-nowrap hover:cursor-pointer"
                    variant="outline"
                  >
                    {selectedFilter}
                  </Badge>
                  <Trash2
                    onClick={() => setAppliedFilter(selectedFilter)}
                    size={16}
                    className="absolute text-orange-600 right-1 top-1 hover:cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Workers Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {loading ? (
              <SearchPageSkeleton />
            ) : searchedWorkers?.data?.length === 0 ? (
              <NoResultFound searchText={params.text} />
            ) : (
              searchedWorkers.data.map((worker) => (
                <Card
                  key={worker._id}
                  className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                >
                  {/* Worker Image on Top (Square, flush with card boundaries) */}
                  <img
                    src={worker.imageUrl}
                    alt=""
                    className="w-auto h-48 object-cover mx-auto my-3"
                  />

                  {/* Worker Details Below the Image */}
                  <CardContent className="p-5 text-left">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {worker.WorkersName}
                    </h1>
                    <div className="mt-2 flex flex-col gap-2 text-gray-600 dark:text-gray-400">

                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <p className="text-sm">City: <span className="font-medium">{worker.city}</span></p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe size={16} />
                        <p className="text-sm">Country: <span className="font-medium">{worker.country}</span></p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase size={16} />
                        <p className="text-sm">
                          Occupation: <span className="font-medium">{worker.Occupations?.join(", ") || "N/A"}</span>
                        </p>

                      </div>
                    </div>
                  </CardContent>
                  {/* Footer with Rating, View Details, and Delete Button */}
                  <CardFooter className="flex flex-col sm:flex-row justify-between items-center p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 gap-3">
                    <div className="flex items-center gap-2">
                      <StarRating rating={worker.rating || 0} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">({worker.reviews.length})</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                      <Link to={`/Workers/${worker._id}`}>
                        <Button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:from-orange-600 hover:to-orange-700 rounded-md px-4 py-2">
                          View Details
                        </Button>
                      </Link>
                      <Button
                        onClick={() => deleteCall(worker._id)}
                        className="bg-red-500 hover:bg-red-600 text-white shadow-md rounded-md flex items-center gap-2 px-4 py-2"
                      >
                        <Trash2 size={16} /> Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SearchPage;

const SearchPageSkeleton = () => {
  return (
    <>
      {[...Array(3)].map((_, index) => (
        <Card
          key={index}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden"
        >
          <div className="relative">
            <AspectRatio ratio={16 / 6}>
              <Skeleton className="w-full h-full" />
            </AspectRatio>
          </div>
          <CardContent className="p-5">
            <Skeleton className="h-8 w-3/4 mb-3" />
            <div className="mt-3 flex items-center gap-2">
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex gap-2 mt-4 flex-wrap">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </CardContent>
          <CardFooter className="p-5 bg-gray-50 dark:bg-gray-900 flex justify-end">
            <Skeleton className="h-10 w-24 rounded-full" />
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

const NoResultFound = ({ searchText }) => {
  return (
    <div className="text-center py-10">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        No results found
      </h1>
      <p className="mt-3 text-gray-500 dark:text-gray-400">
        We couldn't find any results for "{searchText}". <br /> Try searching with a different term.
      </p>
      <Link to="/">
        <Button className="mt-6 bg-orange hover:bg-orangeHover transition-colors duration-200">
          Go Back to Home
        </Button>
      </Link>
    </div>
  );
};
