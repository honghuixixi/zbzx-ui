<template>
	<div class="supervise-table">
		<div class="supervise-search">
			<div style="font-size:15px;" v-if="area">{{area.name}}<router-link :to="'/supervise/info?t=2&d=' + area.id" target="_blank" style="color:#4baaf6;margin-left:30px;">查看</router-link></div>
			<span style="font-size:15px;">{{type === 1 ? '省级医疗机构' : type === 2 ? '市级医疗机构' : '区/县级医疗机构'}}</span>
			<span class="btn" @click="search">搜索</span>
			<input class="input" type="text" placeholder="请输入机构名称/ID" v-model="keyword">
			<el-select class="select" placeholder="选择机构类别" @change="change" v-model="value">
			    <el-option
			      v-for="item in options"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
		  </el-select>
		</div>
		<div style="margin: 20px;">
			<table>
				<thead>
					<tr>
	                    <td style="width: 6%;white-space:nowrap;">ID</td>
	                    <td style="width: 20%;white-space:nowrap;">机构名称</td>
	                    <td style="width: 15%;white-space:nowrap;">所在地区</td>
	                    <td style="width: 15%;white-space:nowrap;">机构类别</td>
	                    <td style="width: 12%;white-space:nowrap;">设备数</td>
	                    <td style="width:12% ;white-space:nowrap;">管理员</td>
	                    <td style="width:10% ;white-space:nowrap;">联系电话</td>
	                    <td style="width: 10%;white-space:nowrap;">操作</td>
	                </tr>
				</thead>
				<tbody>
					<tr v-for="v in list">
						<td class="first">{{v.id}}</td>
						<td>{{v.name}}
              <span v-if='!v.enable' class='dis-span'>已停用</span>
            </td>
						<td>{{v.province}}-{{v.city}}-{{v.county}}</td>
						<td>
							<span v-if="v.tenantCatogory == 1">医疗机构</span>
	            <span v-if="v.tenantCatogory == 2">基层医疗卫生机构</span>
	            <span v-if="v.tenantCatogory == 3">疾病预防控制中心</span>
						</td>
						<td>{{v.deviceCount ? v.deviceCount : ''}}</td>
						<td>{{v.adminName}}</td>
						<td>{{v.adminMobile}}</td>
						<td class="last"><router-link :to="'/supervise/info?t=1&d=' + v.id" target="_blank">查看</router-link></td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="empty" v-if="list.length < 1">
			<img :src="require('@/assets/images/nocontent.png')">暂无数据
		</div>
    <!--分页-->
    <div class="pageInfo" style="padding: 0 0 50px 0;" v-if="list.length!=0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        :page-sizes="[8,16,32]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
	</div>
</template>
<script>
	import { mapActions ,mapState} from 'vuex'
	export default {
		data() {
		  return {
		    options: [
		    	{value: '0',label: '选择机构类别'},
		    	{value: '1',label: '医疗机构'},
		    	{value: '2',label: '基层医疗卫生机构'},
		    	{value: '3', label: '疾病预防控制中心'}],
		    // value: '',
		    // keyword: '',
		    pageNo: 1,
		    pageSize: 16
		  }
		},
		computed: {
	      ...mapState(['type', 'total', 'list', 'area', 'showCity']),
	      value: {
	      	get() {
	      		return this.$store.state.category
	      	},
	      	set(value) {
	      		this.$store.commit('changeCategory', value)
	      	}
	      },
	      keyword: {
	      	get() {
	      		return this.$store.state.keyword
	      	},
	      	set(value) {
	      		this.$store.commit('changeKeyword', value)
	      	}
	      }
	    },
		methods: {
			...mapActions(['changePage', 'changeCondition', 'changeList']),
			change(val) {
				if(+val === 0){
					this.value = ''
				}
				console.log(val)
			},
			search() {
				this.changeCondition({category: this.value, keyword:this.keyword})
				this.changeList(this.area.id)
			},
      handleSizeChange(val) {
        //console.log(`每页 ${val} 条`);
        this.pageSize = val
        this.changePage({pageNo:this.pageNo,pageSize:this.pageSize})
        this.changeList(this.area.id)
      },
      handleCurrentChange(val) {
        //console.log(`每页 ${val} 条`);
        this.pageNo = val
        this.changePage({pageNo:this.pageNo,pageSize:this.pageSize})
        this.changeList(this.area.id)
      }
		}
	}
</script>
<style scope>
.supervise-search {
	margin: 20px;
	font-size: 14px;
	line-height: 32px;
	overflow: hidden;
}
.supervise-search .select {
	float: right;
	width: 220px;
}
.supervise-search .input {
	float: right;
	width: 250px;
	margin: 0 10px;
}
.supervise-search .btn {
	float: right;
	display: inline-block;
    width: 60px;
    height: 32px;
    background: #007cb5;
    color: #fff;
    text-align: center;
    line-height: 32px;
    border-radius: 3px;
    font-size: 14px;
    cursor: pointer;
}
.supervise-table {
	/*position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 240px;
	z-index: 1;
	background-color: #fff;*/
	/*overflow: auto;*/
}
.showCity-table {
	left: 481px;
}
.supervise-table table {
	width: 100%;
	border-collapse: collapse;
	border: 1px solid #dcdcdc;
	font-size: 14px;
}
.supervise-table table td {
	padding: 10px 15px;
	border-left: 1px solid #dcdcdc;
	border-top: 1px solid #eaeff0;
	text-align: center;
}
.supervise-table table thead td {
	background-color: #f5f5f5;
	line-height: 25px;
}
.supervise-table tbody tr:hover td {
	border-top:1px solid #f7931e;
    border-bottom:1px solid #f7931e;
}
.supervise-table tbody tr:hover .first {
	border-left:1px solid #f7931e;
}
.supervise-table tbody tr:hover .last {
	border-right:1px solid #f7931e;
}
.supervise-table table td a {
	text-decoration: none;
    cursor: pointer;
    color: #4baaf6;
}
.empty {
	font-size: 14px;
	line-height: 60px;
	text-align: center;
}
.empty img {
	margin-right: 10px;
	vertical-align: middle;
}
</style>
