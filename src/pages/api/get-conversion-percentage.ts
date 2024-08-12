import Manifest from "@/server/manifest";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id } = req.query;
    if (!id || isNaN(+id)) {
      return res
        .status(400)
        .json({ message: "Missing or invalid id query parameter" });
    }
    return res
      .status(200)
      .json({ percentage: Manifest.getMovie(+id).conversionProgress });
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
