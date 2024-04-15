<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { type SuperValidated, type Infer, superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
  import { Input } from "$lib/components/ui/input";
  import { formSchema, type FormSchema } from "./schema";
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';


 
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

</script>


<form method="POST" use:enhance class="container">
  <Form.Fieldset {form} name="isForetag">
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

  {#if $formData.isForetag.toString() == "false"}
  <Form.Field {form} name="subscriptionNumber" class="grid grid-cols-2">
    <Form.Control let:attrs>
      <Form.Label class="col-span-2">Prenumerationsnummer</Form.Label>
      <Input {...attrs} bind:value={$formData.subscriptionNumber} id="subscriptionNumber"/>
      <button on:click={handleFetchButtonClick} class="text-lg text-bold border-2 w-1/2">Hämta information</button>
    </Form.Control>
    <Form.Description>Övriga uppgifter kan hämtas från ditt prenumerationsnummer.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  {/if}

  <Form.Field {form} name="name">
    <Form.Control let:attrs>
      <Form.Label>Namn</Form.Label>
      <Input {...attrs} bind:value={$formData.name} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="phoneNumber">
    <Form.Control let:attrs>
      <Form.Label>Telefonnummer</Form.Label>
      <Input {...attrs} bind:value={$formData.phoneNumber} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="delivery">
    <Form.Control let:attrs>
      <Form.Label>Utdelningsadress</Form.Label>
      <Input {...attrs} bind:value={$formData.delivery} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  {#if $formData.isForetag.toString() == "true"}
  <Form.Field {form} name="billing">
    <Form.Control let:attrs>
      <Form.Label>Fakturaadress</Form.Label>
      <Input {...attrs} bind:value={$formData.billing} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  {/if}

  <Form.Field {form} name="postnummer">
    <Form.Control let:attrs>
      <Form.Label>Postnummer</Form.Label>
      <Input {...attrs} bind:value={$formData.postalCode} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="ort">
    <Form.Control let:attrs>
      <Form.Label>Ort</Form.Label>
      <Input {...attrs} bind:value={$formData.ort} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>


  <Form.Button>Skicka</Form.Button>
</form>
