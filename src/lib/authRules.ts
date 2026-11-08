export const identificationCodeRules = {
  required: "საიდენტიფიკაციო კოდი სავალდებულოა.",
  pattern: { value: /^\d{9,11}$/u, message: "კოდი უნდა იყოს 9–11 ციფრი." },
};

export const emailRules = {
  required: "მეილი სავალდებულოა.",
  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/u, message: "მეილი არასწორია." },
};

export const passwordRules = {
  required: "პაროლი სავალდებულოა.",
  minLength: { value: 8, message: "პაროლი მინიმუმ 8 სიმბოლო უნდა იყოს." },
};
