import mongoose from "mongoose";

const EntrySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    mood: {
      type: String,
      enum: ["great", "good", "okay", "low", "rough"],
      default: "okay",
    },
    tags: {
      type: [String],
      default: [],
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    entryDate: {
      // The date the entry is "about" — defaults to creation time,
      // but editable so people can log a past day.
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

EntrySchema.index({ title: "text", content: "text", tags: "text" });
EntrySchema.index({ userId: 1, entryDate: -1 });

export default mongoose.models.Entry || mongoose.model("Entry", EntrySchema);
