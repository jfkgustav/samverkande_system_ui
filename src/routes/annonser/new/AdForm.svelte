<script lang="ts">
    import * as Form from '$lib/components/ui/form'
    import { Input } from "$lib/components/ui/input";
	import { superForm, type SuperValidated } from "sveltekit-superforms";
	import { annonsSchema, type AnnonsSchema } from "../schema";
	import { zodClient } from "sveltekit-superforms/adapters";


    export let adData: SuperValidated<AnnonsSchema>;
    
    const form = superForm(adData, {
        validators: zodClient(annonsSchema),
        dataType: 'json'
    });

    const { form: formData, enhance } = form;


</script>

<div class=" bg-slate-400 text-black p-4 rounded-xl">
    <form method="POST" action="?/insertAd" use:enhance>
        <Form.Field {form} name="rubrik">
            <Form.Control let:attrs>
                <Form.Label>Annonsens rubrik</Form.Label>
                <Input {...attrs} bind:value={$formData.rubrik} />
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="innehall">
            <Form.Control let:attrs>
                <Form.Label>Beskrivning</Form.Label>
                <Input {...attrs} bind:value={$formData.innehall} />
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="pris">
            <Form.Control let:attrs>
                <Form.Label>Pris</Form.Label>
                <Input {...attrs} bind:value={$formData.pris} type="number" />
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="orgnr">
            <Form.Control let:attrs>
                <Input type="hidden" {...attrs} bind:value={$formData.orgNr} />
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
         <Form.Field {form} name="annonspris">
            <Form.Control let:attrs>
                <Input type="hidden" {...attrs} bind:value={$formData.annonsPris} />
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
       
        
        <Form.Button>Skapa annons</Form.Button>


    </form>
</div>






