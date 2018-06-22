<template>
	<table :style="'width: 100%;min-height:' + (height - 120 -160 - 14) + 'px;'">
		<tr>
			<td style="position:relative;vertical-align: top;border-right: 20px solid #f4fafa;width:230px;">
				<!-- <SuperviseTree/> -->
				<div class="ztree" id="ztree" style="position: absolute;top:5px;left:0;bottom:0;width:220px;overflow-y:auto;"></div>
				<!-- <div style="position:absolute;top:20px;left:230px;bottom:0;border-left: 1px solid #e5e5e5;"></div> -->
			</td>
			<td style="vertical-align: top;"><SuperviseTable/></td>
		</tr>
	</table>
</template>
<script>
	import { mapState} from 'vuex'
	// import SuperviseTree from '@/components/supervise/Tree'
	import SuperviseTable from '@/components/supervise/Table'
	import '@/assets/style/zTreeStyle/zTreeStyle.css' 
	import '@/assets/lib/jquery-1.4.4.min.js'
	import '@/assets/lib/jquery.ztree.core.min.js'
	// import {supertree}
	import {supertreeHelp} from '@/service/api'
	import { mapActions } from 'vuex'

	export default {
		data() {
			return {
				height: document.body.clientHeight
			}
		},
		computed: {
	      ...mapState(['type', 'showCity'])
	    },
		components: {
			// SuperviseTree,
			SuperviseTable
		},
		methods: {
			...mapActions(['changeArea', 'changeList', 'changeType']),
		},
		mounted () {
	      this.$nextTick(() => {
	      	var _this = this;
	      	var tenantId = JSON.parse(localStorage.getItem('userInfo')).tenantId;
	        var setting = {
				data: {
					simpleData: {
						enable: true
					}
				},
				callback: {
					onClick: function (event, treeId, treeNode) {
					    _this.changeList(treeNode.id)
					    _this.changeArea({id: treeNode.id, name: treeNode.name});
					    _this.changeType(treeNode.parentTenantRank);
					}
				}
			};
			supertreeHelp((data) => {
				if(data && data.length > 0){
					for(var i=0,len=data.length; i<len; i++){
						if(data[i].parentTenantRank == 1){
							data[i].icon = require('@/assets/images/icon_province.png');
						}else if(data[i].parentTenantRank == 2){
							data[i].icon = require('@/assets/images/icon_city.png');
						}else if(data[i].parentTenantRank == 3){
							data[i].icon = require('@/assets/images/icon_area.png');
						}						
					}
					var treeObj = $.fn.zTree.init($("#ztree"), setting, data);
					treeObj.expandAll(true);
					var node = treeObj.getNodeByParam("id", tenantId, null);
					if(node) {
						treeObj.selectNode(node);
						this.changeArea({id: node.id, name: node.name});
						this.changeType(node.parentTenantRank);
					}
				}
			}, (err) => {});
			this.changeList(tenantId)
	      })
	    }
	}
</script>