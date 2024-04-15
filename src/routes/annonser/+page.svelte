<script lang="ts">
  import type { PageData } from "./$types.js";
  import AnnonsForm from "./annonser-form.svelte";
  export let data: PageData;
 
</script>

<section class="px-10">
  <h1 class="text-4xl font-bold pb-2">
  Skapa annons
  </h1>
</section>
 
<AnnonsForm data={data.form} />

