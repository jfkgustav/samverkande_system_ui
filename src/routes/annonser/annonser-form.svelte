<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { type SuperValidated, type Infer, superForm } from "sveltekit-superforms";
  import { zod, zodClient } from "sveltekit-superforms/adapters";
  import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
  import { Input } from "$lib/components/ui/input";
  import { formSchema, type FormSchema } from "./schema";
  import { onMount } from 'svelte';
  import { derived } from 'svelte/store';
	import { ZodUndefined } from "zod";


 
  export let data: SuperValidated<Infer<FormSchema>>;
 
  const form = superForm(data, {
    validators: zodClient(formSchema),
  });

  const { form: formData, enhance } = form;

  // Function to fetch subscriber data based on subscription number
  async function fetchSubscriberData(subscriptionNumber: string) {
    try {
      const response = await fetch(`http://localhost:8080/subscribers/${subscriptionNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch subscriber data');
      }
      const data = await response.json();
      formData.update(form => ({ ...form, ...data }));
    } catch (error) {
      console.error(error);
      // Handle error
    }
  }

  async function doPost() {
    const res = await fetch('http://localhost:8080/createAd', {
        method: 'POST',
        body: JSON.stringify({
            isForetag: $formData.isForetag,
            name: $formData.name,
            phoneNumber: $formData.phoneNumber,
            orgnr: $formData.orgnr,
            delivery: $formData.delivery,
            billing: $formData.billing,
            billingPostalCode: $formData.billingPostalCode,
            deliveryPostalCode: $formData.deliveryPostalCode,
            deliveryOrt: $formData.deliveryOrt,
            billingOrt: $formData.billingOrt,
            rubrik: $formData.rubrik,
            innehall: $formData.innehall,
            pris: $formData.pris
        })
    });
    
  }

  // Function to handle subscription number change
  function handleSubscriptionNumberChange(event: Event) {
    const subscriptionNumber = (event.target as HTMLInputElement).value;
    fetchSubscriberData(subscriptionNumber);
  }

  // Add event listener to subscription number field on component mount
  onMount(() => {
    const subscriptionNumberField = document.getElementById('subscriptionNumber');
    if (subscriptionNumberField) {
      subscriptionNumberField.addEventListener('input', handleSubscriptionNumberChange);
    }
  });

  function handleFetchButtonClick() {
    const subscriptionNumber = $formData.subscriptionNumber
    fetchSubscriberData(subscriptionNumber.toString());
  }

  let adCost = 0;
  let showSubscriber;

  $: {

    if ($formData.isForetag == "false") {
      adCost = 0;
      showSubscriber = true;
    }
    
    else if ($formData.isForetag == "true") {
      adCost = 40;
      showSubscriber = false;
    }

 }

 


</script>

<div class="flex px-10">

<form use:enhance class="w-1/2 grid grid-cols-2">
  <Form.Fieldset {form} name="isForetag" class="order-1 col-span-2">
    <Form.Legend>Skapa annons som prenumerant eller företag?</Form.Legend>
    <RadioGroup.Root bind:value={$formData.isForetag} class="flex flex-col space-y-1">
      <div class="flex items-center space-x-3 space-y-0">
        <Form.Control let:attrs>
          <RadioGroup.Item value=false {...attrs} />
          <Form.Label class="font-normal">Prenumerant</Form.Label>
        </Form.Control>
      </div>
      <div class="flex items-center space-x-3 space-y-0">
        <Form.Control let:attrs>
          <RadioGroup.Item value=true {...attrs} />
          <Form.Label class="font-normal">Företag</Form.Label>
        </Form.Control>
      </div>
      <RadioGroup.Input name="isForetag" />
    </RadioGroup.Root>
    <Form.FieldErrors />
  </Form.Fieldset>


  {#if showSubscriber == true}
  <div class="order-2 col-span-2 w-1/2">
  <Form.Field {form} name="subscriptionNumber">
    <Form.Control let:attrs>
      <Form.Label>Prenumerationsnummer</Form.Label>
      <Input {...attrs} bind:value={$formData.subscriptionNumber} id="subscriptionNumber"/>
      <button on:click={handleFetchButtonClick} class="text-lg text-bold border-2">Hämta information</button>
    </Form.Control>
    <Form.Description>Övriga uppgifter kan hämtas från ditt prenumerationsnummer.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
</div>

<Form.Field {form} name="delivery"  class="order-5 ">
  <Form.Control let:attrs>
    <Form.Label>Utdelningsadress</Form.Label>
    <Input {...attrs} bind:value={$formData.delivery} />
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
<div class="grid grid-cols-2 order-7">
<Form.Field {form} name="postnummer" >
  <Form.Control let:attrs>
    <Form.Label>Postnummer</Form.Label>
    <Input {...attrs} bind:value={$formData.deliveryPostalCode} />
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>

<Form.Field {form} name="ort" >
  <Form.Control let:attrs>
    <Form.Label>Ort</Form.Label>
    <Input {...attrs} bind:value={$formData.deliveryOrt} />
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
</div>
  
  <Form.Field {form} name="name" class="order-3 ">
    <Form.Control let:attrs>
      <Form.Label>Namn</Form.Label>
      <Input {...attrs} bind:value={$formData.name} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>


  <Form.Field {form} name="phoneNumber" class="order-4 ">
    <Form.Control let:attrs>
      <Form.Label>Telefonnummer</Form.Label>
      <Input {...attrs} bind:value={$formData.phoneNumber} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

{/if}

  {#if showSubscriber == false}

  <Form.Field {form} name="phoneNumber" class="order-4 col-span-2">
    <Form.Control let:attrs>
      <Form.Label>Telefonnummer</Form.Label>
      <Input {...attrs} bind:value={$formData.phoneNumber} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
    <Form.Field {form} name="name" class="order-3 col-span-2">
    <Form.Control let:attrs>
      <Form.Label>Företagsnamn</Form.Label>
      <Input {...attrs} bind:value={$formData.name} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="orgnr" class="order-3 col-span-2">
    <Form.Control let:attrs>
      <Form.Label>Organisationsnummer</Form.Label>
      <Input {...attrs} bind:value={$formData.orgnr} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <section id="FakturaUppgifter" class="container order-5">
  <p class="font-bold">Fakturauppgifter</p>
  <Form.Field {form} name="billing">
    <Form.Control let:attrs>
      <Form.Label>Fakturaadress</Form.Label>
      <Input {...attrs} bind:value={$formData.billing} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  
  <Form.Field {form} name="billing" >
    <Form.Control let:attrs>
      <Form.Label>Postnummer</Form.Label>
      <Input {...attrs} bind:value={$formData.billingPostalCode} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="billing">
    <Form.Control let:attrs>
      <Form.Label>Ort</Form.Label>
      <Input {...attrs} bind:value={$formData.billingOrt} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  </section>
  <section id="UtdeliningsUppgifter" class="container order-6">
  <p class="font-bold">Utdelningsuppgifter</p>
  <Form.Field {form} name="delivery">
    <Form.Control let:attrs>
      <Form.Label>Fakturaadress</Form.Label>
      <Input {...attrs} bind:value={$formData.delivery} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  
  <Form.Field {form} name="deliveryPostnummer" >
    <Form.Control let:attrs>
      <Form.Label>Postnummer</Form.Label>
      <Input {...attrs} bind:value={$formData.deliveryPostalCode} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="deliveryOrt">
    <Form.Control let:attrs>
      <Form.Label>Ort</Form.Label>
      <Input {...attrs} bind:value={$formData.deliveryOrt} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  </section>
  {/if}

  


  <Form.Field {form} name="rubrik" class="order-9 col-span-2">
    <Form.Control let:attrs>
      <Form.Label>Rubrik</Form.Label>
      <Input {...attrs} bind:value={$formData.rubrik} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="innehall" class="order-10 col-span-2">
    <Form.Control let:attrs>
      <Form.Label>Beskrivning</Form.Label>
      <Input {...attrs} bind:value={$formData.innehall} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="pris" class="order-11 col-span-2">
    <Form.Control let:attrs>
      <Form.Label>Pris</Form.Label>
      <Input bind:value={$formData.pris} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>


  <Form.Button on:click={doPost} class="order-12">Skicka</Form.Button>

</form>


{#if $formData.innehall !== ""}
<!-- Ruta för annonsinformation och kostnad -->
<div class="border p-4 my-4">
  <p>Information om annonsen:</p>
  <ul>
    {#if showSubscriber == true}
      <li>Namn: {$formData.name}</li>
    {/if}
    {#if showSubscriber == false}
      <li>Företagsnamn: {$formData.name}</li>
      <li>Organisationsnummer: {$formData.orgnr}</li>
      <li>Fakturauppgifter: {$formData.billing}, {$formData.billingPostalCode}, {$formData.billingOrt} </li>
    {/if}
    <li>Utdelningsuppgifter: {$formData.delivery}, {$formData.deliveryPostalCode}, {$formData.deliveryOrt}</li>
    <li>Telefonnummer: {$formData.phoneNumber}</li>
    <li>Rubrik: {$formData.rubrik}</li>
    <li>Beskrivning: {$formData.innehall}</li>
    <li>Pris: {$formData.pris} kr</li>
  </ul>
  <p>Kostnad för att ladda upp annonsen: {adCost} kr </p>
</div>
{/if}
</div>