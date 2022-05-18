<template>
	<div :class="s.wrapper">
		<el-row v-for="(row, index) in projectList" :key="index" @click="updateSelectIndex(index)" :class="s.row">
		<el-col :span="24">
			<el-card shadow="always" :class="[selectIndex === index ? s.active : '']"  :body-style="{ padding: '12px',display: 'flex'}">
			<div :class="s.card">
				<div :class="s.content">
					<div>{{row.name}}</div>
				<!-- <div style="margin-top: 8px">项目：{{row.en_name}}</div> -->
				</div>
				<el-button size="small" :class="s.delete" :icon="Delete" @click="deleteRow(index)" circle />
			</div>
			</el-card>
		</el-col>
		</el-row>
		<el-row>
		<el-col :span="24">
			<el-card shadow="always" :class="[s.card, s.select]" :body-style="{ padding: '0px',flex:1}">
				<div :class="s.select_btn" @click="openModal">配置文件</div>
				<!-- <div :class="s.select_btn" @click="selectFile">点击选中文件</div> -->
			</el-card>
		</el-col>
		</el-row>
		<FileModal/>
	</div>
</template>
<script setup>
	import { ref, computed } from "vue";
	import FileModal from './modal.vue'
	import { useStore } from 'vuex'
	import {
		Delete,
	} from '@element-plus/icons-vue'
	const Store = window.require('electron-store');
	const store = useStore()
	// const projectList = reactive<any[]>([{
	//   name: '智慧中台',
	//   path: '/Users/chenhaocha/project/hani/opman-web',
	//   en_name: 'opman-web'
	// }])

	const active = ref('opman-web')
	const selectIndex = computed(() => store.state.selectIndex)
	const updateSelectIndex = (index) => store.commit('updateSelectIndex', index)
	const updateConfig = () => store.commit('updateConfig')

	const deleteRow = (index) =>{
		const eleStore = new Store()
		const arr = eleStore.get('project_list')
		console.log('arrr',arr)
		arr.splice(index, 1)
		eleStore.set('project_list', arr)
		console.log('store', eleStore.get('project_list'))
		updateConfig()
	}


	const projectList = computed(() => store.state.configList)


	const changeShowModal = (value) => store.commit('changeShowModal', value)
	const openModal = () => {
		// console.log(fileRef.value.click())
		console.log(1111)
		changeShowModal(true)
	}
</script>
<style lang="scss" module="s">
  .wrapper {
	display: flex;
	flex-direction: column;
	width: 300px;
	padding: 16px;

	.row {
		margin-bottom: 12px;
	}

	.card {
		// margin-bottom: 12px;
		display: flex;
		flex:1;
		justify-content: space-between;
		align-items: center;
		// width: 100%;
		cursor: pointer;
	}

	.content {
		display: flex;
		justify-content: space-between;
	}

	.delete {
		// position: absolute;
		// top: 10px;
		// right: 10px;
	}


	.active {
		color:   #337ecc !important;
		border: 1px solid #337ecc;
	}
	.select {
		padding: 8px;
	}
	.select_btn {
		height: 38px;
		width: 100%;
		border: 1px dashed #c8c9cc;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;

		&:hover {
		border: 1px dashed  #337ecc;
		color:  #337ecc;
		}
	}
                       
  }
</style>
