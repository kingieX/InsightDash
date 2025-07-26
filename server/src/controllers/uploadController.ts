import { Request, Response } from "express";
import csv from "csvtojson";

export const handleCSVUpload = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const csvString = file.buffer.toString("utf-8");
    const jsonData = await csv().fromString(csvString);

    console.log("Parsed CSV:", jsonData);

    res.status(200).json({ data: jsonData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to parse CSV file" });
  }
};
