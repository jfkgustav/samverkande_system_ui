import { z } from "zod";
 
const deliveryAdressSchema = z.object({
    adress: z.string({  required_error: "Du måste ange adress", invalid_type_error: "Otillåtna tecken används."}).min(2).max(40),
    ort: z.string({required_error: "Du måste ange ort", invalid_type_error: "Otillåtna tecken används."}).min(2).max(40),
    postNummer: z.string({required_error: "Du måste ange postnummer", invalid_type_error: "Otillåtna tecken används."}).min(5).max(6),
});

const billingAdressSchema = z.object({
  adress: z.string({  required_error: "Du måste ange adress", invalid_type_error: "Otillåtna tecken används."}).min(2).max(40),
  ort: z.string({required_error: "Du måste ange ort", invalid_type_error: "Otillåtna tecken används."}).min(2).max(40),
  postNummer: z.string({required_error: "Du måste ange postnummer", invalid_type_error: "Otillåtna tecken används."}).min(5).max(6),
});

export const advertiserSchema = z.object({
  isForetag: z.boolean({ required_error: "Du måste välja om du är en prenumerant eller ett företag" }),
  prenumerationsnummer: z.coerce.number({required_error: "Du måste ange prenumerationsnummer", invalid_type_error: "Otillåtna tecken används."}).nullable(),
  namn: z.string({  required_error: "Du måste ange namn", invalid_type_error: "Otillåtna tecken används."}).min(1).max(30),
  telefon: z.string({  required_error: "Du måste ange ett telefonnummer", invalid_type_error: "Otillåtna tecken används."}).min(10).max(16),
  orgNr: z.string({  required_error: "Du måste ange ett organisationsnummer", invalid_type_error: "Otillåtna tecken används."}).min(10).max(16),
  fakturaAdress: billingAdressSchema,
  leveransAdress: deliveryAdressSchema,
});

export type AdvertiserSchema = z.infer<typeof advertiserSchema>;

export const updateAdvertiserSchema = z.object({
  prenumerationsnummer: z.coerce.number({required_error: "Du måste ange prenumerationsnummer", invalid_type_error: "Otillåtna tecken används."}).nullable(),
  namn: z.string({  required_error: "Du måste ange namn", invalid_type_error: "Otillåtna tecken används."}).min(1).max(30),
  telefon: z.string({  required_error: "Du måste ange ett telefonnummer", invalid_type_error: "Otillåtna tecken används."}).min(10).max(16),
  orgNr: z.string({  required_error: "Du måste ange ett organisationsnummer", invalid_type_error: "Otillåtna tecken används."}).min(10).max(16),
  leveransAdress: deliveryAdressSchema,
  fakturaAdress: billingAdressSchema,
});

export type UpdateAdvertiserSchema = z.infer<typeof updateAdvertiserSchema>;

export const annonsSchema = z.object({
    rubrik: z.string({required_error: "Du måste ange rubrik", invalid_type_error: "Otillåtna tecken används."}).min(2).max(40),
    innehall: z.string({required_error: "Du måste ange ort", invalid_type_error: "Otillåtna tecken används."}).min(10).max(400),
    pris: z.number().min(1).max(9999),
    annonsPris: z.number().min(1).max(9999),
    orgNr: z.string(),
});
export type AnnonsSchema = z.infer<typeof annonsSchema>;