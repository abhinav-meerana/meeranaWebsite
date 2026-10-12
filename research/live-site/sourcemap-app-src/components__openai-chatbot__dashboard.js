import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { useOutletContext } from 'react-router-dom';

// Register necessary Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function Dashboard() {
    // Optional: Access any data from Outlet context if needed
    const context = useOutletContext();

    // Data for Bar Chart
    const barChartData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'Month',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    // Data for Pie Chart
    const pieChartData = {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [
            {
                label: 'Colors',
                data: [300, 50, 100],
                backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
            },
        ],
    };

    // Data for numeric cards
    const numericData = [
        { label: 'Sample1', value: 1234 },
        { label: 'Sample2', value: '$12,345' },
        { label: 'Sample3', value: 456 }
    ];

    return (
        <div className="p-6 bg-white min-h-screen flex-grow">
            <h1 className="text-2xl font-semibold text-center mb-6">Dashboard (Dummy Data)</h1>
            
            {/* Simple Cards with Numeric Data */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {numericData.map((item, index) => (
                    <div key={index} className="shadow-lg p-4 rounded-md text-center">
                        <h2 className="text-xl font-bold">{item.label}</h2>
                        <p className="text-3xl font-semibold">{item.value}</p>
                    </div>
                ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bar Chart Card */}
                <div className="shadow-lg p-4 rounded-md">
                    <h2 className="text-lg font-semibold mb-4">Sample Bar Chart</h2>
                    <Bar data={barChartData} />
                </div>

                {/* Pie Chart Card */}
                <div className="shadow-lg p-4 rounded-md">
                    <h2 className="text-lg font-semibold mb-4">Sample Pie Chart</h2>
                    <Pie data={pieChartData} />
                </div>
            </div>

        </div>
    );
}

// import React, { useEffect, useState } from 'react';
// import { Bar, Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
// import { useOutletContext } from 'react-router-dom';

// // Register necessary Chart.js components
// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend,
//     ArcElement
// );

// const dashboardURL = "http://20.46.197.154:7000/fill_dashboard";

// const fetchDashboardInsights = async (userId) => {
//     try {
//         const response = await fetch(dashboardURL, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ user_id: userId }),
//         });

//         console.log("Response", response)

//         if (!response.ok) {
//             throw new Error(`Error: ${response.status}`);
//         }

//         const data = await response.json();
//         return JSON.parse(data.response); // Parse the JSON stringified array
//     } catch (error) {
//         console.error("Error fetching dashboard insights:", error);
//         return null; // Return null if an error occurs
//     }
// };

// export default function Dashboard() {
//     const context = useOutletContext();
//     const [numericData, setNumericData] = useState([]);
//     const [barChartData, setBarChartData] = useState({
//         labels: [],
//         datasets: [
//             {
//                 label: 'Values',
//                 data: [],
//                 backgroundColor: 'rgba(75, 192, 192, 0.6)',
//             },
//         ],
//     });
//     const [pieChartData, setPieChartData] = useState({
//         labels: [],
//         datasets: [
//             {
//                 label: 'Values',
//                 data: [],
//                 backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
//             },
//         ],
//     });

//     useEffect(() => {
//         const loadDashboardData = async () => {
//             const userId = "12345"; // Replace with dynamic user ID if needed
//             const insights = await fetchDashboardInsights(userId);

//             if (insights && insights.length > 0) {
//                 setNumericData(insights);

//                 // Update bar and pie chart data based on insights
//                 const labels = insights.map(item => item.label);
//                 const values = insights.map(item => parseFloat(item.value.replace(/[^0-9.-]+/g,""))); // Parse numeric values

//                 setBarChartData({
//                     labels,
//                     datasets: [
//                         {
//                             label: 'Values',
//                             data: values,
//                             backgroundColor: 'rgba(75, 192, 192, 0.6)',
//                         },
//                     ],
//                 });

//                 setPieChartData({
//                     labels,
//                     datasets: [
//                         {
//                             label: 'Values',
//                             data: values,
//                             backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
//                         },
//                     ],
//                 });
//             } else {
//                 setNumericData(null); // Set to null if no data is available
//             }
//         };

//         loadDashboardData();
//     }, []);

//     return (
//         <div className="p-6 bg-white min-h-screen flex-grow">
//             <h1 className="text-2xl font-semibold text-center mb-6">Dashboard</h1>
            
//             {numericData ? (
//                 <>
//                     {/* Simple Cards with Numeric Data */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//                         {numericData.map((item, index) => (
//                             <div key={index} className="shadow-lg p-4 rounded-md text-center">
//                                 <h2 className="text-xl font-bold">{item.label}</h2>
//                                 <p className="text-3xl font-semibold">{item.value}</p>
//                             </div>
//                         ))}
//                     </div>
                    
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {/* Bar Chart Card */}
//                         <div className="shadow-lg p-4 rounded-md">
//                             <h2 className="text-lg font-semibold mb-4">Bar Chart</h2>
//                             <Bar data={barChartData} />
//                         </div>

//                         {/* Pie Chart Card */}
//                         <div className="shadow-lg p-4 rounded-md">
//                             <h2 className="text-lg font-semibold mb-4">Pie Chart</h2>
//                             <Pie data={pieChartData} />
//                         </div>
//                     </div>
//                 </>
//             ) : (
//                 <p className="text-center text-lg font-semibold text-red-500 mt-6">
//                     No Document uploaded or unable to process document data. Please try again later!
//                 </p>
//             )}
//         </div>
//     );
// }