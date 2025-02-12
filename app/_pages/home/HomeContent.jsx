"use client";

import React from "react";
import {
  IconArrowWaveRightUp,
  IconBoxAlignRightFilled,
  IconBoxAlignTopLeft,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import { BentoGrid, BentoGridItem } from "@/app/components/ui/bento-grid";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useGetCrimes } from "@/hooks/tanstackQuery/useCrimes";

export function HomeContent() {
  const { data: session, status } = useSession();
  console.log(session);

  const { data, isLoading } = useGetCrimes({
    limit: 10,
    offset: 0,
    search: "",
  });

  console.log(data);

  if (isLoading) {
    return <p>Loading crimes...</p>;
  }

  return (
    <div>
      <BentoGrid className="w-full mx-auto">
        {data?.crimes?.map((crime, i) => (
          <BentoGridItem
            id={crime._id}
            key={crime._id}
            title={crime.title}
            description={crime.description}
            header={<CrimeCardImage src={crime.image} />}
            icon={icons[i % icons.length]}
            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
          />
        ))}
      </BentoGrid>
    </div>
  );
}

const CrimeCardImage = ({ src }) => {
  return (
    <div>
      <Image
        src={src}
        width={600}
        height={200}
        className="h-40 w-full rounded object-cover"
        alt="Crime"
      />
    </div>
  );
};

const icons = [
  <IconClipboardCopy key="icon1" className="h-4 w-4 text-neutral-500" />,
  <IconFileBroken key="icon2" className="h-4 w-4 text-neutral-500" />,
  <IconSignature key="icon3" className="h-4 w-4 text-neutral-500" />,
  <IconTableColumn key="icon4" className="h-4 w-4 text-neutral-500" />,
  <IconArrowWaveRightUp key="icon5" className="h-4 w-4 text-neutral-500" />,
  <IconBoxAlignTopLeft key="icon6" className="h-4 w-4 text-neutral-500" />,
  <IconBoxAlignRightFilled key="icon7" className="h-4 w-4 text-neutral-500" />,
];

export default HomeContent;
