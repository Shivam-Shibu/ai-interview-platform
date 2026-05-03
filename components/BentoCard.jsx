import React from "react";
const BentoCard=({icon,title,desc,children,className=""})=>{
  return(
    <div className={`border border-white/10 rounded-lg p-6 flex flex-col gap-4 ${className}`}>
      <span className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center">
        {icon}
        </span>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{desc}</p>
        {children}  
    </div>
  )
}