<template>
    <div class="login-wrap" :style="randomBackground">
        <img src="../assets/img/logo_fn.png" alt="logo">
        <div class="ms-title">MelodyHunter Management</div>
        <div class="ms-login" ref="loginarea" @mouseenter="inFun" @mouseleave="outFun">
            <el-form ref="ruleFrorm" :model="ruleForm" :rules="rules" >
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="ruleForm.password" placeholder="密码"></el-input> 
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import {mixin} from "../mixins/index";
import {getLoginStatus} from "../api/index";
export default {
    mixins:[mixin],
    data: function(){
        return {
            ruleForm:{
                username:"",
                password:""
            },
            rules:{
                username:[
                    {required:true,message:"请输入用户名",trigger:"blur"}
                ],
                password:[
                    {required:true,message:"请输入密码",trigger:"blur"}
                ]
            }
        };
    },
    computed: {
        randomBackground: function() {
            let imgs = [
                require('@/assets/img/space.jpg'),
                require('@/assets/img/space_background.jpg'),
                require('@/assets/img/spaceroute.jpg')
            ];
            let imgName = imgs[Math.floor(Math.random() * 3)];
            let style = "background-image:url('" + imgName + "');";
            return style;
        }
    },
    methods:{
        submitForm(){
            let params = new URLSearchParams();
            params.append("name", this.ruleForm.username);
            params.append("password",this.ruleForm.password);
            getLoginStatus(params)
            .then((res) => {
                if (res.code == 1)
                {
                    localStorage.setItem('userName',this.ruleForm.username);
                    this.$router.push("/Info");
                    this.notify("登陆成功","success");
                }
                else
                {
                    this.notify("登陆失败","error");
                }
            });
        },
        inFun() {
            this.$refs.loginarea.style.transform = "scale(1.2,1.2)";
            this.$refs.loginarea.style.transition = "0.3s";
        },
        outFun() {
            this.$refs.loginarea.style.transform = "scale(1,1)";
        }
    }
}
</script>

<style scoped>
.login-wrap {
    position: relative;
    background-attachment: fixed;
    background-position: center;
    background-size: cover;
    width: 100%;
    height: 100%;
}
.ms-title {
    position: absolute;
    top: 50%;
    width: 100%;
    margin-top: -230px;
    text-align: center;
    font-size: 80px;
    font-weight: 600;
    font-family: Arial, Helvetica, sans-serif;
    color: #fff;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 300px;
    height: 160px;
    margin-left: -200px;
    margin-top: -30px;
    padding: 40px;
    border-radius: 5px;
    background-color: rgba(255,255,255,0.3);
    transform: scale(1.2,1.2);
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
}
</style>