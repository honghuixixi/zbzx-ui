<template>
  <div id="choose">
    <el-dialog title="选择机构" :visible="show" width="940px" @close="$emit('close')">
      <div class="modalLeft">
        <el-tree
          :data="datatree"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="tree"
          :check-strictly="true"
          highlight-current
          @node-click="nodeClick"
          @check-change="nodeCheck"
        >
        </el-tree>
      </div>
      <div class="modealLeft2">
        <div style="margin-bottom: 20px">
          <el-select v-model="type" placeholder="全部" >
            <el-option
              v-for="item in optionsList"
              :key="item.typeID"
              :label="item.name"
              :value="item.typeID">
            </el-option>
          </el-select>
          <input type="text" placeholder="输入机构名称" v-model="keyword" class="keyInput">
          <span class="search" @click="getorg">搜索</span>
        </div>
        <!--穿梭框-->
        <div class="chooseDiv">
          <div class="chooseTitle">
            <span>全部医疗机构</span>
            <span @click="addMuilty(orgList2, 'id', 'name')">全部选择</span>
            <ul>
              <li v-for="v in orgList2" @click="addSingle(v, 'id', 'name')">{{v.name}}</li>
            </ul>
          </div>
        </div>
        <span class="chooseimg"><img src="../assets/images/change.png" alt=""></span>
        <div class="chooseDiv">
          <div class="chooseTitle">
            <span>已选机构</span>
            <span @click="removeMuilty">清空</span>
            <ul>
              <li v-for="(v, index) in checkList" @click="removeSingle(index)">{{v.name}}</li>
            </ul>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('close')">取 消</el-button>
        <el-button type="primary" @click="$emit('close', checkList)">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
	import {supertree, getorg} from '@/service/api'
	export default {
		props: ['show', 'list'],
		data() {
			return {
				type:0,
				keyword:'',
				optionsList:[
		          {typeID:0,name:'全部'},
		          {typeID:1,name:'医疗机构'},
		          {typeID:2,name:'基层医疗卫生机构'},
		          {typeID:3,name:'疾病预防控制中心'}
		        ],
		        originData: [],
				datatree: [],
				orgList:[],
				checkList: [],
				isUserCheck: true
			}
		},
		computed: {
	      orgList2() {
	      	return this.orgList.filter((item) => {
	      		if(!this.isContain(this.checkList, item.id)){
	      			return item
	      		}
	      	})
	      }
	    },
	    watch: {
	    	show () {
	    		if(this.show){
	    			this.checkList = [].concat(this.list)
	    			setTimeout(() => {
	    				if(this.$refs.tree){
		    				this.$refs.tree.setCheckedKeys(this.getCheckKeys())
		      				this.$refs.tree.setCurrentKey(this.manageId)
		    			}
	    			}, 100)
	    		}
	    	}
	    },
	    methods: {
	      // 监管树节点点击事件
	      nodeClick(obj,node,self){
	        this.manageId = obj.id
	        this.getorg()
	      },
	      // 监管树节点勾选事件
	      nodeCheck(obj, checked, subHasChecked){
	      	if(this.isUserCheck){
	      		this.isUserCheck = false
	      		let list = []
		      	this.getChildrens(list, obj)//[].concat([obj], obj.children)
		      	if(checked){
		      		this.addMuilty(list, 'id', 'label', 2)
		      	}else{
		      		list.map(item => {
		      			this.removeById(item.id)
		      			this.$refs.tree.setChecked(item.id, false)
		      		})
		      	}
		      	this.$refs.tree.setCheckedKeys(this.getCheckKeys())
		      	setTimeout(() => {
		      		this.isUserCheck = true
		      	}, 100)
		      }
	      },
	      getChildrens(arr, obj) {
	      	arr.push(obj)
	      	if(obj.children){
	      		obj.children.map(item => {
	      			this.getChildrens(arr, item)
	      		})
	      	}
	      },
	      // 检测数组中是否包含某个id的元素
	      isContain(list, id) {
	      	let flag = false
	      	for(let item of list){
	      		if(item.id === id){
	      			flag = true
	      			break
	      		}
	      	}
	      	return flag
	      },
	      // 获取已勾选的监管机构的keys
	      getCheckKeys() {
	      	let keys = []
	      	this.checkList.map((item) => {
	      		if(item.type === 2){
	      			keys.push(item.id)
	      		}
	      	})
	      	return keys
	      },
	      // 选择机构
	      addSingle(obj, key1, key2, type) {
	      	if(!this.isContain(this.checkList, obj[key1])){
	      		this.checkList.push({id: obj[key1], name: obj[key2], type: type})
	      	}
	      },
	      // 批量选择机构
	      addMuilty(list, key1, key2, type=1) {
	        for(let item of list){
	          this.addSingle(item, key1, key2, type)
	        }
	      },
	      // 通过索引移除已选机构
	      removeSingle(index) {
	        this.checkList.splice(index, 1)
	        //console.log(this.getCheckKeys())
	        this.$refs.tree.setCheckedKeys(this.getCheckKeys())
	      },
	      // 通过id移除已选机构
	      removeById(id) {
	        for(let index in this.checkList){
	          if(this.checkList[index].id === id){
	            this.removeSingle(index)
	            break;
	          }
	        }
	      },
	      // 清空已选机构
	      removeMuilty() {
	        this.checkList = []
	        this.$refs.tree.setCheckedKeys(this.getCheckKeys())
	      },
	      // 监管树结构转换
	      getChilds(list, pid){
	      	let arr = []
	      	list.map((item) => {
	      		if(item.pId === pid){
	      			arr.push({id: item.id, label: item.name, children: this.getChilds(list, item.id)})
	      		}
	      	})
	      	return arr
	      },
	      getNextChilds(list, pid) {
	      	let arr = []
	      	list.map((item) => {
	      		if(item.pId === pid){
	      			arr.push({id: item.id, label: item.name})
	      		}
	      	})
	      	return arr
	      },
	      // 服务的获取监管树
	      supertree(){
	        supertree((data)=>{
	        	if(data.length){
	        		this.originData = data
		        	this.datatree = this.getChilds(data, 0)
			        this.manageId = data[0].id
			        this.getorg()
			        if(this.$refs.tree){
	      				this.$refs.tree.setCurrentKey(this.manageId)
	    			}
	        	}
	        })
	      },
	      // 服务的获取医疗机构
	      getorg(){
	        let param = {
	          manageId: this.manageId
	        }
	        if(this.type){
	          param.type = this.type
	        }
	        if(this.keyword){
	          param.keyword = this.keyword
	        }
	        getorg(param,(data)=>{
	          this.orgList = data
	        })
	      }
	    },
	    mounted () {
	      this.$nextTick(() => {
	      	if(!this.datatree.length){
	      		this.supertree()
	      	}
	      })
	    }
	}
</script>
<style scoped>
  .chooseimg{
    width: 40px;
    display: inline-block;
    text-align: center;
    height: 218px;
    padding-top: 150px;
    float: left;
  }
  .chooseDiv{
    border-radius: 8px;
    width: 281px;
    height: 360px;
    display: inline-block;
    border:1px solid #dcdcdc;
    float: left;
    overflow: hidden;
  }
  .chooseDiv li{
    height: 38px;
    border-bottom: 1px solid #dcdcdc;
    font-size: 16px;
    padding: 0 5px;
    line-height: 38px;
    width: 271px;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: normal;
    font-size: 16px;
  }
    .chooseDiv li:hover{
    background: #f4fafa;
  }
  .keyInput{
    width: 250px;
    margin-left: 30px;
  }
  .el-select{
    width: 166px;
  }
  .modealLeft2{
    float: left;
    width: 616px;
    padding:20px;
  }
  .modalLeft{
    padding:20px;
    float: left;
    width: 243px;
    background: #f4fafa;
    height: 475px;
    overflow-y: auto;
  }
  .chooseTitle{
    height: 37px;
    width: 100%;
    background: #91c3da;
    display: inline-block;
    line-height: 37px;
  }
  .chooseTitle span{
    cursor: pointer;
  }
  .chooseTitle span:first-child{
    float: left;
    color: #fff;
    margin-left: 10px;
  }
  .chooseTitle span:nth-child(2){
    float: right;
    color: #007cb5;
    margin-right: 10px;
  }
  .chooseTitle ul {
  	width: 280px;
  	max-height: 325px;
  	overflow-y: auto;
  	overflow-x: hidden;
  }
</style>
