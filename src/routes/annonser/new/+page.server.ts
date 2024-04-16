import { superValidate } from "sveltekit-superforms";
import type { PageServerLoad } from "../$types";
import { updateAdvertiserSchema } from "../schema";
import type { Actions } from "@sveltejs/kit";
import { fail, error } from "@sveltejs/kit";
import { zod } from 'sveltekit-superforms/adapters' 

export const load: PageServerLoad = async () => {
    return {
        form: await superValidate(zod(updateAdvertiserSchema)),
        ok: false,
    }
}

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(updateAdvertiserSchema));

        if(!form.valid) {
            return fail(400, {
                form,
            });
        }
        const updateForm: updateUser = {
            namn: form.data.namn,
            telefon: form.data.telefon,
            orgNr: form.data.orgNr,
            fakturaAdress: form.data.fakturaAdress,
            leveransAdress: form.data.leveransAdress
        }

        if(!await updateAdvertiser(updateForm)) {
            return {
                fail: "Failed to update user"
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