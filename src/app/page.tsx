"use client";

import Footer from "@/components/HomePage/Footer";
import Heading from "@/components/HomePage/Heading";
import Heroes from "@/components/HomePage/Heroes";
import Navbar from "@/components/HomePage/Navbar";

export default function Home() {
  return (
    <div className="h-full">
      <Navbar />
      <div className="h-full pt-40">
        <div className="flex flex-col">
          <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
            <Heading />
            <Heroes />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
