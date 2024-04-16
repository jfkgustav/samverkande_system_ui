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



export const actions: Actions = {
    default: async (event) => {
        const userForm = await superValidate(event, zod(updateAdvertiserSchema));
        const adForm = await superValidate(event, zod(annonsSchema));

        if(!userForm.valid) {
            return fail(400, {
                userForm,
            });
        }
        const updateForm: updateUser = {
            namn: userForm.data.namn,
            telefon: userForm.data.telefon,
            orgNr: userForm.data.orgNr,
            fakturaAdress: userForm.data.fakturaAdress,
            leveransAdress: userForm.data.leveransAdress
        }

        if(!await updateAdvertiser(updateForm)) {
            return {
                fail: "Failed to update user"
            }
        }

        const insertAdForm: ad = {
            rubrik: adForm.data.rubrik,
            innehall: adForm.data.innehall,
            pris: adForm.data.pris
        }

        if(!await insertAd(insertAdForm)) {
            return {
                fail: "Failed to insert ad"
            }
        }

        return {
            ok: true,
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

interface ad {
        rubrik: string,
        innehall: string,
        pris: number
    }

const updateAdvertiser = async (data: updateUser):Promise<boolean> => {
    try {
        console.log("hello, world")
        const res = await fetch("http://localhost:8080/advertisers", {
            method: "PUT",
            body: JSON.stringify(data),
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

const insertAd = async (data: ad):Promise<boolean> => {
    try {
        const res = await fetch("http://localhost:8080/advertisers", {
            method: "POST",
            body: JSON.stringify(data),
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