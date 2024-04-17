<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { UpdateAdvertiserSchema } from '../schema';
    import type { AnnonsSchema } from '../schema';
    import UserForm from './UserForm.svelte';
    import AdForm from './AdForm.svelte';

    export let data;
    const userForm: SuperValidated<UpdateAdvertiserSchema> = data.userForm
    const adForm: SuperValidated<AnnonsSchema> = data.adForm



</script>

<div class="flex py-5 flex-col grid grid-cols-2 bg-slate-800 text-white gap-4 h-screen px-5">
    <UserForm userData={userForm} />
    <AdForm adData={adForm} />
</div>
