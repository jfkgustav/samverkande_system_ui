<script lang="ts">
  import type { PageData } from "./$types.js";
  import AnnonsForm from "./annonser-form.svelte";
  export let data: PageData;
</script>
 
<AnnonsForm data={data.form} />