const getData: any = async () => {
  const getData = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
    method: "GET",
    cache: "force-cache",
  });
  console.log("response");
  const response = await getData.json();
  return response;
};

export default getData;
