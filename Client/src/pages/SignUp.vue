<template>
    <div>
        <loginLogo/>
        <div class="signUp">
            <div class="signUp-head">
                <span>用户注册</span>
            </div>
            <el-form :model="registerForm" ref="registerForm" label-width="70px" class="demo-ruleForm" :rules="rules">
                <el-form-item prop="username" label="用户名">
                    <el-input v-model="registerForm.username" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input type="password" v-model="registerForm.password" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item prop="sex" label="性别">
                    <el-radio-group v-model="registerForm.sex">
                        <el-radio :label="0">女</el-radio>
                        <el-radio :label="1">男</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="phone" label="手机号">
                    <el-input v-model="registerForm.phone" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item prop="email" label="邮箱">
                    <el-input v-model="registerForm.email" placeholder="邮箱"></el-input>
                </el-form-item>
                <el-form-item prop="birth" label="生日">
                    <el-date-picker v-model="registerForm.birth" placeholder="选择日期" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item prop="profile" label="简介">
                    <el-input v-model="registerForm.profile" placeholder="简介"></el-input>
                </el-form-item>
                <el-form-item prop="location" label="地区">
                    <el-select v-model="registerForm.location" placeholder="地区" style="width:100%">
                        <el-option v-for="item in cities" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <div class="login-btn">
                    <el-button @click="goback(-1)">取消</el-button>
                    <el-button type="primary" @click="SignUp">确定</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>


<script>
import loginLogo from '../components/LoginLogo'
import {rules,cities} from '../assets/data/form'
import {mixin} from '../mixins'
import {SignUp} from '../api/index'

export default {
    name: 'sign-up',
    mixins: [mixin],
    components: {
        loginLogo
    },
    data() {
        return {
            registerForm: {
                username: '',
                password: '',
                sex: '',
                phone: '',
                email: '',
                birth: '',
                profile: '',
                location: ''
            },
            cities: [],         //所有的地区--省市
            rules: {}           //表单提交的规则

        }
    },
    created() {
        this.rules = rules;
        this.cities = cities;
    },
    methods: {
        SignUp(){
            let _this = this;
            let d = this.registerForm.birth;
            let datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
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
            SignUp(params)
                .then(res => {
                    if (res.code == 1){
                        _this.notify('注册成功','success');
                        setTimeout(function(){
                            _this.$router.push({path: '/'});
                        },2000);
                    }else{
                        _this.notify('注册失败','error');
                    }
                })
                .catch(err => {
                    _this.notify('注册失败','error');
                })
        },
        goback(index){
            this.changeIndex('首页');
            this.$router.push({path: '/'});
        },
        changeIndex(value){
            this.$store.commit('setActiveName', value);
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/sign-up.scss';
</style>