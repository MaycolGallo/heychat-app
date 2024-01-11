"use server";

export async function gyat(message: string) {
  try {
    if (message === "gyat") {
      throw new Error("No gyat");
    }
    return { message: "No gyat", type: "success" };
  } catch (error) {
    return { message: `${error}`, type: "error" };
  }
}
