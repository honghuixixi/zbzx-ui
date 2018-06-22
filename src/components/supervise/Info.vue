
<template>
	<component v-bind:is="currentView" :id="id"></component>
</template>
<script>
	import MedicalInfo from '@/components/supervise/MedicalInfo'
	import SuperviseInfo from '@/components/supervise/SuperviseInfo'

	export default {
		data() {
			return {
				currentView: +this.$route.query.t === 2 ? 'SuperviseInfo' : 'MedicalInfo',
				id: this.$route.query.d
			};
		},
		components: {
			MedicalInfo,
			SuperviseInfo
		}
	}
</script>

