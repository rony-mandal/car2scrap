import { z } from "zod";

export const indiaPhoneRegex = /^[6-9]\d{9}$/;

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(100, "Name too long"),
  phone: z
    .string()
    .trim()
    .regex(indiaPhoneRegex, "Enter a valid 10-digit Indian mobile number"),
  city: z
    .string()
    .trim()
    .min(2, "Please enter your city")
    .max(80, "City name too long"),
  brand: z.string().min(1, "Select a brand"),
  car_model: z.string().min(1, "Select a model"),
  fuel_type: z.enum(["petrol", "diesel", "cng", "lpg", "electric"], {
    errorMap: () => ({ message: "Select fuel type" }),
  }),
  year: z
    .number()
    .int()
    .min(1995, "Year too old")
    .max(new Date().getFullYear(), "Invalid year"),
  condition: z.enum(["excellent", "good", "poor"], {
    errorMap: () => ({ message: "Select condition" }),
  }),
  km_driven: z
    .number()
    .int()
    .min(0, "Enter kilometers driven")
    .max(1_000_000, "Value too high"),
  notes: z.string().max(500, "Notes too long").optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;
