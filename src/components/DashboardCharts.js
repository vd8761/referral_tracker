"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

export default function DashboardCharts({ data }) {
  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 30, right: 30, left: 20, bottom: 20 }} maxBarSize={50}>
          <defs>
            <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={1}/>
              <stop offset="100%" stopColor="var(--primary-hover)" stopOpacity={0.8}/>
            </linearGradient>
            <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--secondary)" stopOpacity={1}/>
              <stop offset="100%" stopColor="var(--secondary-hover)" stopOpacity={0.8}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
          
          <XAxis 
            dataKey="name" 
            stroke="#64748b" 
            tickLine={false} 
            axisLine={false} 
            dy={15}
            tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
          />
          
          <YAxis 
            stroke="#64748b" 
            tickLine={false} 
            axisLine={false} 
            dx={-15}
            tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
            tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`} 
          />
          
          <Tooltip 
            cursor={{ fill: '#f1f5f9', opacity: 0.5 }}
            contentStyle={{ 
              backgroundColor: "#ffffff", 
              border: "1px solid #e2e8f0", 
              borderRadius: "12px", 
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              padding: "12px"
            }}
            itemStyle={{ color: "#0f172a", fontWeight: 700, fontSize: "14px", padding: "4px 0" }}
            labelStyle={{ color: "#64748b", marginBottom: "8px", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}
            formatter={(value) => [`₹${value.toLocaleString('en-IN')}`]}
          />
          
          <Legend 
            wrapperStyle={{ paddingTop: "30px" }} 
            iconType="circle" 
            iconSize={10}
          />
          
          <Bar 
            dataKey="expected" 
            name="Expected Commission" 
            fill="url(#colorExpected)" 
            radius={[6, 6, 0, 0]} 
            background={{ fill: '#f8fafc', radius: [6, 6, 0, 0] }}
          />
          <Bar 
            dataKey="received" 
            name="Received Commission" 
            fill="url(#colorReceived)" 
            radius={[6, 6, 0, 0]} 
            background={{ fill: '#f8fafc', radius: [6, 6, 0, 0] }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
