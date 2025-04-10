import { useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useWorkersStore } from "@/store/useWorkersStore";
const HereSection = () => {
  const {searchWorkers}=useWorkersStore();
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const TakeInformation= async (searchText)=>{
    console.log(searchText)
    const searchedWorkers=await searchWorkers(searchText);
    console.log(searchedWorkers)
    navigate(`/search/${searchText}`, { state: { searchedWorkers } });
  }
  return (
    <section className="relative text-center py-[123px] bg-gradient-to-r from-orange-500 to-red-500 text-gray-900 dark:text-white">
      {/* Background image with low opacity */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: "url('https://c8.alamy.com/comp/2FNWRGC/indian-workers-in-varadero-city-cuba-2FNWRGC.jpg')"
        }}
      ></div>
      <div className="relative max-w-5xl mx-auto px-6">
        <h1 className="text-5xl font-extrabold text-black dark:text-white">
          Hire Workers Anytime & Anywhere
        </h1>
        <p className="mt-4 text-lg text-gray-800 dark:text-gray-300">
          Hey! Hire Best Workers
        </p>
        <div className="mt-8 flex justify-center items-center gap-4">
          <input
            type="text"
            className="p-3 rounded-lg shadow-lg w-80 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
            placeholder="Search Workers by name, city, or country"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            onClick={() => TakeInformation(searchText)}
            className="bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black"
          >
            Search
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HereSection;

