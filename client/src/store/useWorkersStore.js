import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const API_END_POINT = "https://rozgar-rpk0.onrender.com/api/v1/Workers";
axios.defaults.withCredentials = true;

export const useWorkersStore = create(
  persist(
    (set, get) => ({
      loading: false,
      Workers: null,
      LocalWorkers:null,
      searchedWorkers: null,
      appliedFilter: [],
      singleWorkers: null,
      WorkersOrder: [],

      createWorkers: async (formData) => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (response.data.success) {
            toast.success(response.data.message);
            console.log(response.data,"create")
            set({ loading: false });
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "An error occurred");
          set({ loading: false });
        }
      },

      getInformation: async (workerId)=>{
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/information`,{workerId});
          if (response.data.success) {
            set({ loading: false, LocalWorkers: response.data.workers });
          }
        } catch (error) {
          if (error.response?.status === 404) {
            set({ LocalWorkers: null });
          }
          set({ loading: false });
        }
      },

      getWorkers: async () => {
        try {
          set({ loading: true });
          const response = await axios.get(`${API_END_POINT}/`);
          if (response.data.success) {
            set({ loading: false, Workers: response.data.workers });
            return response.data.workers;
          }
        } catch (error) {
          if (error.response?.status === 404) {
            set({ Workers: null });
          }
          set({ loading: false });
        }
      },

      updateWorkers: async (formData) => {
        try {
          set({ loading: true });
          const response = await axios.put(`${API_END_POINT}/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false });
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "An error occurred");
          set({ loading: false });
        }
      },

      DeleteWorker : async (WorkersId) => {
        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/delete-worker`, { WorkersId });
    
            if (response.data.success) {
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            set({ loading: false });
        }
    },


    verifyForDeleteWorker: async ({ verificationCode, workerId }) => {
      try {
        set({ loading: true });
        const response = await axios.post(
          `${API_END_POINT}/verify-For-Delete`,
          { verificationCode, workerId },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.success) {
          toast.success(response.data.message);
          set({ loading: false });
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
        set({ loading: false });
      }
    },
    

      verifyWorker: async ({ verificationCode, workerId }) => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_END_POINT}/verify-worker`,
            { verificationCode, workerId },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false });
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "An error occurred");
          set({ loading: false });
        }
      },

      // , searchedWorkers: response.data
      


      searchWorkers: async (searchText, searchQuery, selectedOccupations) => {
        try {
          set({ loading: true });
          const params = new URLSearchParams();
          if (searchQuery) {
            params.set("searchQuery", searchQuery);
          }
          
          if (selectedOccupations && selectedOccupations.length > 0) {
            params.set("selectedOccupations", selectedOccupations.join(","));
          }
          // console.log(searchText,params.toString())
          
          const response = await axios.get(
            `${API_END_POINT}/search/${searchText}?${params.toString()}`
          );
          if (response.data.success) {
            set({ loading: false ,searchedWorkers: response.data});
            console.log(response.data,searchText)
            return response.data;
          }
        } catch (error) {
          set({ loading: false });
        }
      },



      setAppliedFilter: (value) => {
        set((state) => {
          const isAlreadyApplied = state.appliedFilter.includes(value);
          const updatedFilter = isAlreadyApplied
            ? state.appliedFilter.filter((item) => item !== value)
            : [...state.appliedFilter, value];
          console.log(value,isAlreadyApplied,updatedFilter,state.appliedFilter,updatedFilter)
          return { appliedFilter: updatedFilter };
        });
      },

      resetAppliedFilter: () => {
        set({ appliedFilter: [] });
      },

      getSingleWorkers: async (WorkersId) => {
        try {
          const response = await axios.get(`${API_END_POINT}/${WorkersId}`);
          if (response.data.success) {
            set({ singleWorkers: response.data.Workers });
          }
        } catch (error) {}
      },

      getWorkersOrders: async () => {
        try {
          const response = await axios.get(`${API_END_POINT}/order`);
          if (response.data.success) {
            set({ WorkersOrder: response.data.orders });
          }
        } catch (error) {
          console.log(error);
        }
      },

      updateWorkersOrder: async (WorkerId) => {
        try {
          const response = await axios.put(
            `${API_END_POINT}/update/${WorkerId}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.data.success) {
            const updatedOrder = get().WorkersOrder.map((order) =>
              order._id === orderId ? { ...order, status: response.data.status } : order
            );
            set({ WorkersOrder: updatedOrder });
            toast.success(response.data.message);
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "An error occurred");
        }
      },
    }),
    {
      name: "Workers-name",
      storage: createJSONStorage(() => localStorage),
    }
  )
);




// import axios from "axios";
// import { toast } from "sonner";
// import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";

// const API_END_POINT = "http://localhost:3000/api/v1/Workers";
// axios.defaults.withCredentials = true;

// export const useWorkersStore = create(
//   persist(
//     (set, get) => ({
//       loading: false,
//       Workers: null,
//       LocalWorkers: null,
//       searchedWorkers: null,
//       appliedFilter: [],
//       searchText: "",
//       searchQuery: "",
//       singleWorkers: null,
//       WorkersOrder: [],

//       // --- Search/Filter helpers ---
//       setSearchText: (text) => set({ searchText: text }),
//       setSearchQuery: (query) => set({ searchQuery: query }),
//       setAppliedFilter: (value) => {
//         set((state) => {
//           const isAlreadyApplied = state.appliedFilter.includes(value);
//           const updatedFilter = isAlreadyApplied
//             ? state.appliedFilter.filter((item) => item !== value)
//             : [...state.appliedFilter, value];
//           console.log("Updated Filter:", updatedFilter);
//           return { appliedFilter: updatedFilter };
//         });
//       },
//       resetAppliedFilter: () => {
//         set({ appliedFilter: [] });
//       },

//       triggerSearch: async () => {
//         const { searchText, searchQuery, appliedFilter } = get();
//         await get().searchWorkers(searchText, searchQuery, appliedFilter);
//       },

//       searchWorkers: async (searchText, searchQuery, selectedOccupations) => {
//         try {
//           set({ loading: true });

//           const params = new URLSearchParams();
//           if (searchQuery) params.set("searchQuery", searchQuery);
//           if (selectedOccupations?.length > 0) {
//             params.set("selectedOccupations", selectedOccupations.join(","));
//           }

//           console.log("Sending search with:", { searchText, params: params.toString() });

//           const response = await axios.get(
//             `${API_END_POINT}/search/${searchText}?${params.toString()}`
//           );

//           if (response.data.success) {
//             set({ loading: false, searchedWorkers: response.data });
//             return response.data;
//           }
//         } catch (error) {
//           set({ loading: false });
//           toast.error("Failed to search workers.");
//         }
//       },

//       // --- Worker Data Methods ---
//       createWorkers: async (formData) => {
//         try {
//           set({ loading: true });
//           const response = await axios.post(`${API_END_POINT}/`, formData, {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           });
//           if (response.data.success) {
//             toast.success(response.data.message);
//             set({ loading: false });
//           }
//         } catch (error) {
//           toast.error(error.response?.data?.message || "An error occurred");
//           set({ loading: false });
//         }
//       },

//       getInformation: async (workerId) => {
//         try {
//           set({ loading: true });
//           const response = await axios.post(`${API_END_POINT}/information`, { workerId });
//           if (response.data.success) {
//             set({ loading: false, LocalWorkers: response.data.workers });
//           }
//         } catch (error) {
//           if (error.response?.status === 404) {
//             set({ LocalWorkers: null });
//           }
//           set({ loading: false });
//         }
//       },

//       getWorkers: async () => {
//         try {
//           set({ loading: true });
//           const response = await axios.get(`${API_END_POINT}/`);
//           if (response.data.success) {
//             set({ loading: false, Workers: response.data.workers });
//             return response.data.workers;
//           }
//         } catch (error) {
//           if (error.response?.status === 404) {
//             set({ Workers: null });
//           }
//           set({ loading: false });
//         }
//       },

//       updateWorkers: async (formData) => {
//         try {
//           set({ loading: true });
//           const response = await axios.put(`${API_END_POINT}/`, formData, {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           });
//           if (response.data.success) {
//             toast.success(response.data.message);
//             set({ loading: false });
//           }
//         } catch (error) {
//           toast.error(error.response?.data?.message || "An error occurred");
//           set({ loading: false });
//         }
//       },

//       DeleteWorker: async (WorkersId) => {
//         try {
//           set({ loading: true });
//           const response = await axios.post(`${API_END_POINT}/delete-worker`, { WorkersId });
//           if (response.data.success) {
//             toast.success(response.data.message);
//           }
//         } catch (error) {
//           toast.error(error.response?.data?.message || "An error occurred");
//         } finally {
//           set({ loading: false });
//         }
//       },

//       verifyForDeleteWorker: async ({ verificationCode, workerId }) => {
//         try {
//           set({ loading: true });
//           const response = await axios.post(
//             `${API_END_POINT}/verify-For-Delete`,
//             { verificationCode, workerId },
//             { headers: { "Content-Type": "application/json" } }
//           );
//           if (response.data.success) {
//             toast.success(response.data.message);
//             set({ loading: false });
//           }
//         } catch (error) {
//           toast.error(error.response?.data?.message || "An error occurred");
//           set({ loading: false });
//         }
//       },

//       verifyWorker: async ({ verificationCode, workerId }) => {
//         try {
//           set({ loading: true });
//           const response = await axios.post(
//             `${API_END_POINT}/verify-worker`,
//             { verificationCode, workerId },
//             { headers: { "Content-Type": "application/json" } }
//           );
//           if (response.data.success) {
//             toast.success(response.data.message);
//             set({ loading: false });
//           }
//         } catch (error) {
//           toast.error(error.response?.data?.message || "An error occurred");
//           set({ loading: false });
//         }
//       },

//       getSingleWorkers: async (WorkersId) => {
//         try {
//           const response = await axios.get(`${API_END_POINT}/${WorkersId}`);
//           if (response.data.success) {
//             set({ singleWorkers: response.data.Workers });
//           }
//         } catch (error) {}
//       },

//       getWorkersOrders: async () => {
//         try {
//           const response = await axios.get(`${API_END_POINT}/order`);
//           if (response.data.success) {
//             set({ WorkersOrder: response.data.orders });
//           }
//         } catch (error) {
//           console.log(error);
//         }
//       },

//       updateWorkersOrder: async (WorkerId) => {
//         try {
//           const response = await axios.put(`${API_END_POINT}/update/${WorkerId}`, {
//             headers: { "Content-Type": "application/json" },
//           });
//           if (response.data.success) {
//             const updatedOrder = get().WorkersOrder.map((order) =>
//               order._id === WorkerId ? { ...order, status: response.data.status } : order
//             );
//             set({ WorkersOrder: updatedOrder });
//             toast.success(response.data.message);
//           }
//         } catch (error) {
//           toast.error(error.response?.data?.message || "An error occurred");
//         }
//       },
//     }),
//     {
//       name: "Workers-name",
//       storage: createJSONStorage(() => localStorage),
//     }
//   )
// );

