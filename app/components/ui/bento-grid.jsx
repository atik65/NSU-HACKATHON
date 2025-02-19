"use client";

import { CrimeDetailsModal } from "@/app/_pages/home/CrimeDetailsModal";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

export const BentoGrid = ({ className, children }) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  id,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Link
      href={`/crime/${id}`}
      onClick={() => setIsOpen(true)}
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4",
        className
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-2 transition duration-200 ">
        {/* {icon} */}
        {/* <CrimeDetailsModal /> */}
        <div>
          <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2">
            {title}
          </div>
          <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
            {/* {description} */}

            {description.length > 120
              ? description.substring(0, 120) + "..."
              : description}
          </div>
        </div>
      </div>
    </Link>
  );
};
