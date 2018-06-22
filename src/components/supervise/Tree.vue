<template>
		<table style="font-size:14px;">
			<tr>
				<td v-if="type === 1" style="vertical-align:top;padding-top:10px;">
					<div class="node node2 top" :class="{'active': !currentCity}" @click="chooseProvince"><img v-bind:src="require('@/assets/images/treehosep.png')">省级医疗机构</div>
					<div class="node top"><img v-bind:src="require('@/assets/images/treehose.png')">市级监管机构</div>
					<div class="node node2" :class="{'active': currentCity && currentCity.id === v.id}" v-for="(v, index) in citys" @click="chooseCity(v)" v-if="citys[0].name">
						<img v-bind:src="require('@/assets/images/' + (index === citys.length - 1 ? 'treeend' : 'treenode') + '.png')">{{v.name}}
					</div>
				</td>
				<td style="vertical-align:top;padding-top:10px;" v-if="currentCity">
					<div class="node city" v-if="type === 1">{{currentCity.name}}<router-link :to="'/supervise/info?t=2&d=' + currentCity.id" target="_blank">查看</router-link></div>
					<div class="node node2 top" :class="{'active': !currentArea}" @click="chooseCity2()"><img v-bind:src="require('@/assets/images/treehosep.png')">市级医疗机构</div>
					<div class="node top"><img v-bind:src="require('@/assets/images/treehose.png')">区/县级监管机构</div>
					<div class="node node2" :class="{'active': currentArea && currentArea.id === v.id}" v-for="(v, index) in areas" @click="chooseArea(v)" v-if="areas[0].name">
						<img v-bind:src="require('@/assets/images/' + (index === areas.length - 1 ? 'treeend' : 'treenode') + '.png')" >{{v.name}}
					</div>
				</td>
			</tr>
		</table>
</template>
<script>
	import {getProvinceSupervise} from '@/service/api'
	import { mapActions } from 'vuex'
	export default {
		data() {
			return {
				type: 1, // 1：省；2：市；3：区
				deaultTenantId: 0,
				citys: [],
				areas: [],
				currentCity: null,
				currentArea: null
			};
		},
		methods: {
			...mapActions(['changeType', 'changeArea', 'changeTenant', 'changeList']),
			changeStore(id, flag, obj) {
				this.changeTenant({id: id, showCity: flag})
				this.changeArea(obj)
				this.changeList()
			},
			// 省份点击
			chooseProvince() {
				this.currentCity = null
				this.currentArea = null
				this.areas = []
				this.changeStore(this.deaultTenantId, false, null)
			},
			// 城市点击
			chooseCity(obj) {
				this.currentCity = obj
				this.currentArea = null
				this.areas = []
				getProvinceSupervise(obj.id, (data) => {
					this.areas = data
					this.changeStore(obj.id, true, null)
				})
			},
			// 当前城市点击
			chooseCity2() {
				this.currentArea = null
				this.changeStore(this.type === 2 ? this.deaultTenantId : this.currentCity.id, true, null)
			},
			// 区点击
			chooseArea(obj) {
				this.currentArea = obj
				this.changeStore(this.type === 3 ? this.deaultTenantId : obj.id, true, obj)
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.deaultTenantId = JSON.parse(localStorage.getItem('userInfo')).tenantId
				getProvinceSupervise(this.deaultTenantId, (data) => {
					if(data && data.length > 0){
						let obj = data[0]
						this.changeType(obj.parentTenantRank)
						this.type = obj.parentTenantRank
						if(obj.parentTenantRank === 1){
							this.citys = data
							this.chooseProvince()
						}else if(obj.parentTenantRank === 2) {
							this.areas = data
							this.currentCity = obj
							this.chooseCity2(obj)
						}else{
							this.chooseArea(obj)
						}
					}
				})
			})
		}
	}
</script>

<style scope>
  .node {
  	padding: 0 20px;
    line-height: 35px;
    width: 190px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .node2 {
  	cursor: pointer;
  }
  .node img {
  	float: left;
  	margin-left: 6px;
  	margin-right: 15px;
  }
  .top img {
  	margin-top: 12px;
  	margin-left: 0;
  }
  .active {
  	background-color: #e1ece8;
  }
  .city {
  	position: relative;
    padding-right: 60px;
    width: 130px;
  }
  .city a {
  	position: absolute;
    top: 0;
    right: 0;
    color: #4baaf6;
    cursor: pointer;
  }
</style>
