export const MOODS = [
  { value: "great", label: "Great", emoji: "\u2600\ufe0f", color: "#C9974F" },
  { value: "good", label: "Good", emoji: "\ud83d\ude42", color: "#9CAD8F" },
  { value: "okay", label: "Okay", emoji: "\ud83d\ude10", color: "#8B8577" },
  { value: "low", label: "Low", emoji: "\ud83c\udf27\ufe0f", color: "#6B7A99" },
  { value: "rough", label: "Rough", emoji: "\u26c8\ufe0f", color: "#B5573D" },
];

export function moodMeta(value) {
  return MOODS.find((m) => m.value === value) || MOODS[2];
}
