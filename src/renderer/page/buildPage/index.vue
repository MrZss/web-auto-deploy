<template>
	<div :class="s.wrapper">
		<Tap />
		<Content v-if="configList.length>0"/>
	</div>
</template>
<script>
	import Tap from './components/tap.vue'
	import Content from './components/content.vue'
	import { defineComponent, computed, ref, reactive, onMounted } from "vue";
	import { useStore } from 'vuex'

	export default defineComponent({
		components: {
			Tap,
			Content
		},
		setup() {
			const projectList = reactive([{
				name: '智慧中台',
				path: '/Users/chenhaocha/project/hani/opman-web',
				en_name: 'opman-web'
			}])
			const fileRef = ref(null);
			const inputShow = ref(false)
			const active = ref('opman-web')
			const getFile = (e) => {
				console.log('获得元素地址', e.target.files[0].path)
			}
			const selectFile = () => {
				console.log(fileRef.value.click())
			}
			const store = useStore()
			const configList = computed(() => store.state.configList)
			const updateConfig = () => store.commit('updateConfig')
			onMounted(()=>{
				updateConfig()
			})
			console.log('123123123')
		return {
			selectFile,
			active,
			projectList,
			inputShow,
			fileRef,
			getFile,
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
