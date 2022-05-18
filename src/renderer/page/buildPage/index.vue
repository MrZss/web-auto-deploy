<template>
	<div :class="s.wrapper">
		<Tap />
		<Content v-if="configList.length>0"/>
	</div>
</template>
<script>
	import Tap from './components/tap.vue'
	import Content from './components/content.vue'
	import { defineComponent, computed, onMounted } from "vue";
	import { useStore } from 'vuex'

	export default defineComponent({
		components: {
			Tap,
			Content
		},
		setup() {
			const store = useStore()
			const configList = computed(() => store.state.configList)
			const updateConfig = () => store.commit('updateConfig')
			onMounted(()=>{
				updateConfig()
			})
			return {
				configList
			};
		}
	});
</script>
<style lang="scss" module="s">
.wrapper {
	display: flex;
	min-width: 100%;
	min-height: 100%;
}
</style>
