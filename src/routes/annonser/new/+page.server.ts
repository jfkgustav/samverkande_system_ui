import { superValidate } from "sveltekit-superforms";
import type { PageServerLoad } from "../$types";
import { updateAdvertiserSchema } from "../schema";
import { annonsSchema } from "../schema";
import type { Actions } from "@sveltejs/kit";
import { fail, error } from "@sveltejs/kit";
import { zod } from 'sveltekit-superforms/adapters' 

export const load: PageServerLoad = async () => {
    return {
        userForm: await superValidate(zod(updateAdvertiserSchema)),
        adForm: await superValidate(zod(annonsSchema)),
        ok: false,
    }
}

let updateForm: updateUser;

export const actions: Actions = {
    updateUser: async (event) => {
        console.log("Kommer in i updateUser")
        
        const userForm = await superValidate(event, zod(updateAdvertiserSchema));
        
        if(!userForm.valid) {
            console.log("USERFORM INVALID")
            return fail(400, {
                userForm,
            });
        }

        updateForm = {
            namn: userForm.data.namn,
            telefon: userForm.data.telefon,
            orgNr: userForm.data.orgNr,
            fakturaAdress: userForm.data.fakturaAdress,
            leveransAdress: userForm.data.leveransAdress
        }


        try {
            console.log(updateForm.namn)
            console.log("Orgnr: " + updateForm.orgNr)
            console.log(updateForm.fakturaAdress)
            console.log(updateForm.leveransAdress)
            console.log(updateForm.telefon)

            const res = await fetch('http://localhost:8080/advertisers', {
                method: 'PUT',
                body: JSON.stringify(updateForm),
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Server returned ' + response.status);
                }
            });

            console.log("Är det här det krashar?")

            if(!res.ok) {
                "men går det in här också?"
                throw error(res.status, res.statusText);
            }

        } catch(e) {
            console.log("det går in i catch")
            console.error(e);
        }



        return {
            ok: true,
            form: userForm
        }
    },

    createAd: async (event) => {
        console.log("kommer hit!")
        const adForm = await superValidate(event, zod(annonsSchema));
        const insertAdForm: ad = {
            rubrik: adForm.data.rubrik,
            innehall: adForm.data.innehall,
            pris: adForm.data.pris,
            orgnr: adForm.data.orgNr,
            annonsPris: adForm.data.annonsPris            
        }
        console.log("Kommer även hit!!")

        if(!await insertAd(insertAdForm, updateForm)) {
            return fail(400, {
                form: adForm,
                fail: "Failed to update user"
            });
        }


        return {
            ok: true,
            form: adForm
        }
    }
}

interface adress {
    adress: string,
    ort: string,
    postNummer: string,
}

interface updateUser {
    namn: string,
    orgNr: string,
    telefon: string,
    fakturaAdress: adress,
    leveransAdress: adress
}

interface adUser {
    namn: string,
    orgNr: string,
    telefon: string,
    fakturaAdress: adress,
    leveransAdress: adress
    rubrik: string,
    innehall: string,
    pris: number
}

interface ad {
        rubrik: string,
        innehall: string,
        pris: number,
        orgnr: string,
        annonsPris: number
    }

const updateAdvertiser = async (data: updateUser):Promise<boolean> => {
   
}

const insertAd = async (adData: ad, userData: updateUser):Promise<boolean> => {
    try {
       
        let data:adUser;



        data = {
            namn: userData.namn,
            orgNr: userData.orgNr,
            telefon: userData.telefon,
            leveransAdress: userData.leveransAdress,
            fakturaAdress: userData.fakturaAdress,
            rubrik: adData.rubrik,
            innehall: adData.innehall,
            pris: adData.pris
        }

        console.log(data.namn)
        console.log("Orgnr: " + data.orgNr)
        console.log(data.fakturaAdress)
        console.log(data.leveransAdress)
        console.log(data.telefon)


        const res = await fetch('http://localhost:8080/createAd', {
            method: 'POST',
            body: JSON.stringify({ data })
        });
        
        if(!res.ok) {
            throw error(res.status, res.statusText);
        }
        return true;
    } catch(e) {
        console.error(e);
        return false;
    }
}
