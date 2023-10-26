<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" size="mini" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" size="mini" placeholder="筛选相关用户" class="handle-input"></el-input>
                <el-button type="primary" size="mini" @click="centerDialogVisible = true">添加新用户</el-button>
            </div>
        </div>
        <el-table size="mini" border style="width:100%" height="1050px" :data="data" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column label="用户图片" width="110" align="center">
                <template slot-scope="scope">
                    <div class="client-img">
                        <img :src="getUrl(scope.row.icon)" style="width:100%"/>
                    </div>
                    <el-upload :action="uploadUrl(scope.row.id)" :before-upload="beforeAvatorUpload" :on-success="handleAvatorSuccess">
                        <el-button size="mini" class="edit">更新图片</el-button>
                    </el-upload>
                </template>
            </el-table-column>
            <el-table-column prop="username" label="用户名" width="200" align="center"></el-table-column>
            <el-table-column label="性别" width="50" align="center">
                <template slot-scope="scope">
                    {{ changeSex(scope.row.sex) }}
                </template>
            </el-table-column>
            <el-table-column prop="phone" label="手机号" width="300" align="center"></el-table-column>
            <el-table-column prop="email" label="电子邮箱" width="300" align="center"></el-table-column>
            <el-table-column prop="birth" label="生日" width="150" align="center">
                <template slot-scope="scope">
                    {{ attachBirth(scope.row.birth) }}
                </template>
            </el-table-column>
            <el-table-column prop="profile" label="签名" width="780" align="center"></el-table-column>
            <el-table-column prop="location" label="地区" width="200" align="center"></el-table-column>
            <el-table-column label="收藏" width="120" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" @click="getCollect(scope.row.id)">收藏管理</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                    <el-button class="editClient" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button class="delete" size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                layout="total,prev,pager,next"
                :current-page="currentPage"
                :page-size="pageSize"
                :total="tableData.length"
                @current-change="handleCurrentChange"
                >
            </el-pagination>
        </div>

        <el-dialog title="添加新用户" :visible.sync="centerDialogVisible" width="400px" center>
            <el-form :model="registerForm" ref="registerForm" label-width="80px" :rules="rules">
                <el-form-item prop="username" label="用户名" size="mini">
                    <el-input v-model="registerForm.username" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码" size="mini">
                    <el-input type="password" v-model="registerForm.password" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item label="性别" size = "mini">
                    <input type="radio" name="sex" value="0" v-model="registerForm.sex">&nbsp;女&nbsp;&nbsp;
                    <input type="radio" name="sex" value="1" v-model="registerForm.sex">&nbsp;男
                </el-form-item>
                <el-form-item prop="phone" label="手机号" size="mini">
                    <el-input v-model="registerForm.phone" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item prop="email" label="电子邮箱" size="mini">
                    <el-input v-model="registerForm.email" placeholder="电子邮箱"></el-input>
                </el-form-item>
                <el-form-item prop="birth" label="生日" size="mini">
                    <el-date-picker type="date" placholder="选择日期" v-model="registerForm.birth" style="width:100%"></el-date-picker>
                </el-form-item>
                <el-form-item prop="profile" label="签名" size="mini">
                    <el-input v-model="registerForm.profile" placeholder="签名" type="textarea"></el-input>
                </el-form-item>
                <el-form-item prop="location" label="地区" size="mini">
                    <el-input v-model="registerForm.location" placeholder="地区"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="mini" @click="centerDialogVisible = false">取消</el-button>
                <el-button size="mini" @click="addClient">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="修改用户" :visible.sync="editVisible" width="400px" center>
            <el-form :model="Form" ref="Form" label-width="80px">
                <el-form-item prop="username" label="用户名" size="mini">
                    <el-input v-model="Form.username" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码" size="mini">
                    <el-input type="password" v-model="Form.password" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item label="性别" size = "mini">
                    <input type="radio" name="sex" value="0" v-model="Form.sex">&nbsp;女&nbsp;&nbsp;
                    <input type="radio" name="sex" value="1" v-model="Form.sex">&nbsp;男
                </el-form-item>
                <el-form-item prop="phone" label="手机号" size="mini">
                    <el-input v-model="Form.phone" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item prop="email" label="电子邮箱" size="mini">
                    <el-input v-model="Form.email" placeholder="电子邮箱"></el-input>
                </el-form-item>
                <el-form-item prop="birth" label="生日" size="mini">
                    <el-date-picker type="date" placholder="选择日期" v-model="Form.birth" style="width:100%"></el-date-picker>
                </el-form-item>
                <el-form-item prop="profile" label="签名" size="mini">
                    <el-input v-model="Form.profile" placeholder="签名" type="textarea"></el-input>
                </el-form-item>
                <el-form-item prop="location" label="地区" size="mini">
                    <el-input v-model="Form.location" placeholder="地区"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="mini" @click="editVisible = false">取消</el-button>
                <el-button size="mini" @click="editSave">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="删除用户" :visible.sync="deleteVisible" width="300px" center>
            <div align="center">删除不可恢复，是否确定删除？</div>
            <span slot="footer">
                <el-button size="mini" @click="deleteVisible = false">取消</el-button>
                <el-button size="mini" @click="deleteRow">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {getAllClient, setClient, updateClient, delClient} from '../api/index';
import { mixin } from '../mixins';
export default{
    mixins: [mixin],
    data(){
        return{
            centerDialogVisible: false, //添加弹窗是否显示
            editVisible: false,         //编辑弹窗是否显示
            deleteVisible: false,
            registerForm:{      //添加框
                username: '',
                password: '',
                sex: '1',
                phone: '',
                email: '',
                birth: '',
                profile: '',
                location: ''
            },
            Form:{      //编辑框
                id: '',
                username: '',
                password: '',
                sex: '',
                phone: '',
                email: '',
                birth: '',
                profile: '',
                location: ''
            },
            tableData: [],
            tempData: [],
            select_word: '',
            pageSize: 8,    //分页每页大小
            currentPage: 1,
            idx: -1,         //当前选择项
            multipleSelection: [],   //选中的项
            rules: {
                username: [
                    {required: true,message: '请输入用户名',trigger:'blur'}
                ],
                password: [
                    {required: true,message: '请输入密码',trigger:'blur'}
                ],
                phone: [
                    {required: true,message: '请输入手机号',trigger:'blur'}
                ],
                email: [
                    {required: true,message: '请输入电子邮箱',trigger:'blur'},
                    {type:'email',message: '请输入正确的电子邮箱地址',trigger:['blur','change']}
                ],
                introduction: [
                    {required: true,message: '请输入签名',trigger:'blur'}
                ],
                location: [
                    {required: true,message: '请输入地区',trigger:'blur'}
                ]
            }
        }
    },
    computed:{
        data(){
            return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
        }
    },
    watch:{
        select_word: function(){
            if (this.select_word == '')
            {
                this.tableData = this.tempData;
            }
            else
            {
                this.tableData = [];
                for (let item of this.tempData)
                {
                    if (item.username.includes(this.select_word))
                    {
                        this.tableData.push(item);
                    }
                }
            }
        }
    },
    created(){
        this.getData();
    },
    methods:{
        //获取当前页
        handleCurrentChange(val){
            this.currentPage = val;
        },
        //查询所有用户
        getData(){
            this.tempData = [];
            this.tableData = [];
            getAllClient().then(res => {
                this.tempData = res;
                this.tableData = res;
                this.currentPage = 1;
            })
        },
        //添加用户
        addClient(){
            this.$refs['registerForm'].validate(valid => {
                if (valid)
                {
                    let d = this.registerForm.birth;
                    let datetime = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
                    let params = new URLSearchParams();
                    params.append('username',this.registerForm.username);
                    params.append('password',this.registerForm.password);
                    params.append('sex',this.registerForm.sex);
                    params.append('phone',this.registerForm.phone);
                    params.append('email',this.registerForm.email);
                    params.append('birth',datetime);
                    params.append('profile',this.registerForm.profile);
                    params.append('location',this.registerForm.location);
                    params.append('icon','/img/ClientPic/defaultuser.jpg');
                    setClient(params)
                    .then(res => {
                        if (res.code == 1)
                        {
                            this.notify("添加成功","success");
                        }
                        else
                        {
                            this.notify("添加失败","error");
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                    });
                    this.centerDialogVisible = false;
                }
            })
        },
        //弹出编辑页面
        handleEdit(row){
            this.editVisible = true;
            this.Form = {
                id: row.id,
                username: row.username,
                password: row.password,
                sex: row.sex,
                phone: row.phone,
                email: row.email,
                birth: row.birth,
                profile: row.profile,
                location: row.location
            }
        },
        //保存编辑页面修改的数据
        editSave(){
            let d = new Date(this.Form.birth);
            let datetime = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
            let params = new URLSearchParams();
            params.append('id',this.Form.id);
            params.append('username',this.Form.username);
            params.append('password',this.Form.password)
            params.append('sex',this.Form.sex);
            params.append('phone',this.Form.phone);
            params.append('email',this.Form.email);
            params.append('birth',datetime);
            params.append('profile',this.Form.profile);
            params.append('location',this.Form.location);
            updateClient(params)
                .then(res => {
                    if (res.code == 1)
                    {
                        this.getData();
                        this.notify("修改成功","success");
                    }
                    else
                    {
                        this.notify("修改失败","error");
                    }
                })
                .catch(err =>{
                    console.log(err);
                });
            this.editVisible = false;
        },
        //更新图片
        uploadUrl(id){
            return `${this.$store.state.HOST}/client/updateClientPic?id=${id}`
        },
        //删除一名用户
        deleteRow(){
            delClient(this.idx)
            .then(res => {
                if (res)
                {
                    this.getData();
                    this.notify("删除成功","success");
                }
                else
                {
                    this.notify("删除失败","error");
                }
            })
            .catch(err =>{
                console.log(err);
            });
            this.deleteVisible = false;
        },
        //转向收藏列表
        getCollect(id){
            this.$router.push({path:'/collect',query:{id}});
        }
    }
}
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }
    .singer-img{
        width: 100%;
        height: 80px;
        border-radius: 5px;
        margin-bottom: 5px;
        overflow: hidden;
    }
    .edit:hover,
    .edit:focus {
        background: #5bc0de;
        border-color: #5bc0de;
        color: #fff;
    }

    .delete:hover,
    .delete:focus {
        background: #d9534f;
        color: #fff;
    }

    .editClient:hover,
    .editClient:focus {
        background: #5bc0de;
        color:#fff;
    }

    .handle-input {
        width: 300px;
        display: flex;
    }

    .pagination {
        display: flex;
        justify-content: center;
    }
</style>