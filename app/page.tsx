"use server";
import React from "react";
import ServerComponent from "@/components/server";
import HomePage from "@/components/otelComp";
const page = async () => {
  return (
    <div>
      <HomePage />
      <ServerComponent />
      <h1>Client Comonent</h1>
      <br />
    </div>
  );
};

export default page;
