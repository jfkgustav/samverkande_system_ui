import { z } from "zod";
 
  // Define form schema
  export const formSchema = z.object({
    isForetag: z.coerce.boolean({ required_error: "Du måste välja om du är en prenumerant eller ett företag" }),
    subscriptionNumber: z.coerce.number({required_error: "Du måste ange prenumerationsnummer", invalid_type_error: "Otillåtna tecken används."}),
    name: z.string({  required_error: "Du måste ange namn", invalid_type_error: "Otillåtna tecken används."}),
    phoneNumber: z.string({  required_error: "Du måste ange ett telefonnummer", invalid_type_error: "Otillåtna tecken används."}),
    orgnr: z.string({  required_error: "Du måste ange ett organisationsnummer", invalid_type_error: "Otillåtna tecken används."}),
    delivery: z.string({  required_error: "Du måste ange utdelningsadress", invalid_type_error: "Otillåtna tecken används."}),
    billing: z.string({  required_error: "Du måste ange fakturaadress", invalid_type_error: "Otillåtna tecken används."}),
    billingPostalCode: z.string({required_error: "Du måste ange postnummer", invalid_type_error: "Otillåtna tecken används."}),
    deliveryPostalCode: z.string({required_error: "Du måste ange postnummer", invalid_type_error: "Otillåtna tecken används."}),
    deliveryOrt: z.string({required_error: "Du måste ange ort", invalid_type_error: "Otillåtna tecken används."}),
    billingOrt: z.string({required_error: "Du måste ange ort", invalid_type_error: "Otillåtna tecken används."}),
    rubrik: z.string({required_error: "Du måste ange rubrik", invalid_type_error: "Otillåtna tecken används."}),
    innehall: z.string({required_error: "Du måste ange ort", invalid_type_error: "Otillåtna tecken används."}),
    pris: z.coerce.number()
  });

 
export type FormSchema = typeof formSchema;