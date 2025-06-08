// // src/client/HistoryService.ts

// export const HistoryService = {
//     getUserHistory: async () => {
//       const response = await fetch("/api/v1/history", {
//         method: "GET",
//         credentials: "include", // include if using session cookies
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
  
//       if (!response.ok) {
//         throw new Error("Failed to fetch user history")
//       }
  
//       return response.json()
//     },
//   }
  