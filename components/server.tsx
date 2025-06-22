"use server";
import React from "react";
import getData from "./getdata";
const ServerComponent = async () => {
  const response = await getData();
  return (
    <>
      <h1>{response?.userId}</h1>
      <h1>{response?.id}</h1>
      <h1>{response?.title}</h1>
      <h1>{response?.completed}</h1>
    </>
  );
};

export default ServerComponent;
