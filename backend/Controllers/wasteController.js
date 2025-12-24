
import Waste from "../model/waste.js";

export const createWaste = async (req, res) => {
  try {
    const {
      itemName,
      quantity,
      unit,
      perUnitPrice,
      totalLoss,
      wasteDate,
      reason,
      notes
    } = req.body;

    // Validation
    if (
      !itemName ||
      !quantity ||
      !perUnitPrice ||
      !totalLoss ||
      !wasteDate ||
      !reason
    ) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const newWaste = await Waste.create({
      itemName,
      quantity,
      unit,
      perUnitPrice,
      totalLoss,
      wasteDate: new Date(wasteDate),
      reason,
      notes
    });

    res.status(201).json(newWaste);

  } catch (error) {
    console.error("Waste Create Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// ================= GET ALL =====================
export const getWaste = async (req, res) => {
  try {
    const list = await Waste.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


// ================= DELETE ======================
export const deleteWaste = async (req, res) => {
  try {
    await Waste.findByIdAndDelete(req.params.id);
    res.json({ message: "Waste record deleted" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


// ================= UPDATE =======================
export const updateWaste = async (req, res) => {
  try {
    const updated = await Waste.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

