<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { UpdateAdvertiserSchema } from '../schema';
    import UserForm from './UserForm.svelte';

    export let data;
    const form: SuperValidated<UpdateAdvertiserSchema> = data.form

</script>

<UserForm data={form} />