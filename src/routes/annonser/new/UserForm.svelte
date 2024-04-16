<script lang="ts">
    import * as Form from '$lib/components/ui/form'
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Button } from "$lib/components/ui/button";
	import { error } from "@sveltejs/kit";
	import { superForm, type SuperValidated } from "sveltekit-superforms";
	import { updateAdvertiserSchema, type UpdateAdvertiserSchema } from "../schema";
	import { zodClient } from "sveltekit-superforms/adapters";

    let subscribed = false;
    let subscriptionNumber: string;
    let orgNr: string;
    let accountValidated: string = '';

    export let data: SuperValidated<UpdateAdvertiserSchema>;

    
    const form = superForm(data, {
        validators: zodClient(updateAdvertiserSchema),
        dataType: 'json'
    });

    interface adress {
        adress: string,
        ort: string,
        postNummer: string,
    }
    const { form: formData, enhance } = form;

    const updateSubscription = (value: string) => {
        subscribed = (value === 'subscriber');
    }

    let accountDetails: accountPartial = {
        namn: '',
        telefon: '',
        leveransAdress: { adress: '', ort: '', postNummer: '' },
        fakturaAdress: { adress: '', ort: '', postNummer: '' },
    };

    interface subscriberResponse {
        namn: string,
        telefon: string,
        utdelningsadress: adress,
        personnummer: string,
    }

    interface accountPartial {
        namn: string,
        telefon: string,
        fakturaAdress: adress
        leveransAdress: adress,
    }

    const fetchSubscriberPartial = async () => {
        try {
            const res = await fetch(`http://localhost:8080/subscribers/partial/${subscriptionNumber}`)

            if(!res.ok) {
                accountValidated = "Kunde inte hitta konto"
                throw error(res.status, res.statusText);
            }

            const body = await res.json();

            const data = body.prenumerant as subscriberResponse;

            $formData.fakturaAdress = data.utdelningsadress;
            $formData.leveransAdress = data.utdelningsadress;
            $formData.namn = data.namn;
            $formData.telefon = data.telefon;
            $formData.orgNr = subscriptionNumber;

            accountValidated = ""
            
        } catch(e) {
            accountValidated = "Kunde inte hitta konto"
            console.error(e);
        }
    }
    const fetchCompanyPartial = async () => {
        try {
            const res = await fetch(`http://localhost:8080/advertisers/partial/${orgNr}`)
            if(!res.ok) {
                accountValidated = "Kunde inte hitta konto"
                throw error(res.status, res.statusText);
            }
            const body = await res.json();

            accountDetails = body.advertiser as accountPartial
            
            $formData.fakturaAdress = accountDetails.fakturaAdress;
            $formData.leveransAdress = accountDetails.leveransAdress;
            $formData.namn = accountDetails.namn;
            $formData.telefon = accountDetails.telefon;
            accountValidated = "";
        } catch(e) {
            accountValidated = "Kunde inte hitta konto"
            console.error(e);
        }
    }
</script>

<div class="flex py-5 flex-col bg-slate-800 text-white gap-4 h-screen px-5">
    <div class="flex items-center flex-col gap-5">
        <h1 class="text-3xl font-semibold">
            Välkommen!
        </h1>
        <h2 class="text-xl">Skapa annons som:</h2>
        <div class="flex flex-col">
            <label>
                <input type="radio" name="role" value="subscriber" on:change="{() => updateSubscription('subscriber')}">
                Prenumerant
            </label>
            <label>
                <input type="radio" name="role" value="company" on:change="{() => updateSubscription('company')}">
                Företag
            </label>
        </div>
        {#if subscribed}
        <div class="text-slate-800 gap-2 flex flex-col">
            <Label class="text-white">Prenumerationsnummer</Label>
            <p class="text-[red]">{accountValidated}</p>
            <Input bind:value={subscriptionNumber}/>
            <Button variant="secondary" on:click={fetchSubscriberPartial}>Hämta information</Button>
        </div>
        {:else}
        <div class="text-slate-800 gap-2 flex flex-col">
            <Label class="text-white">Organisationsnummer</Label>
            <p class="text-[red]">{accountValidated}</p>
            <Input bind:value={orgNr}/>
            <Button variant="secondary" on:click={fetchCompanyPartial}>Hämta information</Button>
        </div>
        {/if}
    </div>
    <div class="w-1/2 bg-slate-400 text-black p-4 rounded-xl">
       <form method="POST" use:enhance>
            <Form.Field {form} name="namn">
                <Form.Control let:attrs>
                    <Form.Label>Namn</Form.Label>
                    <Input {...attrs} bind:value={$formData.namn} />
                </Form.Control>
                <Form.FieldErrors />
            </Form.Field>
            <Form.Field {form} name="telefon">
                <Form.Control let:attrs>
                    <Form.Label>Telefon</Form.Label>
                    <Input {...attrs} bind:value={$formData.telefon} type="tel" />
                </Form.Control>
                <Form.FieldErrors />
            </Form.Field>
            <div>
                <h1 class="text-xl text-slate-800 font-semibold">Leveransadress</h1>
                <Form.Field {form} name="leveransAdress.adress">
                    <Form.Control let:attrs>
                        <Label>Adress</Label>
                        <Input {...attrs} bind:value={$formData.leveransAdress.adress} />
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="leveransAdress.ort">
                    <Form.Control let:attrs>
                        <Label>Ort</Label>
                        <Input {...attrs} bind:value={$formData.leveransAdress.ort} />
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="leveransAdress.postNummer">
                    <Form.Control let:attrs>
                        <Label>Postnummer</Label>
                        <Input {...attrs} bind:value={$formData.leveransAdress.postNummer} />
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
            </div>
            <div>
                <h1 class="text-xl text-slate-800 font-semibold">Fakturaadress</h1>
                <Form.Field {form} name="fakturaAdress.adress">
                    <Form.Control let:attrs>
                        <Label>Adress</Label>
                        <Input {...attrs} bind:value={$formData.fakturaAdress.adress} />
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="fakturaAdress.ort">
                    <Form.Control let:attrs>
                        <Label>Ort</Label>
                        <Input {...attrs} bind:value={$formData.fakturaAdress.ort} />
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
                <Form.Field {form} name="fakturaAdress.postNummer">
                    <Form.Control let:attrs>
                        <Label>Postnummer</Label>
                        <Input {...attrs} bind:value={$formData.fakturaAdress.postNummer} />
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
            </div>
            <Form.Button>Spara uppgifter</Form.Button>
       </form>
    </div>
</div>





