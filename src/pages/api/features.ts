import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { title, description, isActive } = req.body;

    try {
      const feature = await prisma.feature.create({
        data: { title, description, isActive },
      });
      res.status(201).json({
        message: 'Feature created successfully',
        data: feature,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create feature" });
    }
  } else if (req.method === "PUT") {
      const { id, title, description, isActive } = req.body;
      try {
        const feature = await prisma.feature.update({
          where: { id },
          data: { title, description, isActive },
        });
        res.status(200).json({
          message: 'Feature updated successfully',
          data: feature
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update feature" });
      }
  }
  else if (req.method === "GET") {
    try {
      const features = await prisma.feature.findMany();
      res.status(200).json(features);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch features" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
