export default async function getMarkers(): Promise<Response> {
    let res = await fetch(`${import.meta.env.VITE_API_URL}/mark`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    return res;
};
