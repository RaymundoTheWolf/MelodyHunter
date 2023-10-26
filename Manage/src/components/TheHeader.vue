<template>
    <div class="header">
        <div class="icon">
            <i class="el-icon-manage"></i>
        </div>
        <div class="logo">MelodyHunter Management</div>
        <div class="header-right">
            <div class="btn-fullscreen" @click="handleFullScreen">
                <el-tooltip :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                    <i class="el-icon-rank"></i>
                </el-tooltip>
            </div>
            <div class="admin_icon">
                <img src="../assets/img/profileicon.jpg"/>
            </div>
            <el-dropdown class="admin_name" trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    {{ userName }}
                    <i class="el-icon-caret-bottom"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            fullscreen: false
        }
    },
    computed:{
        userName(){
            return localStorage.getItem('userName');
        }
    },
    methods:{
        handleFullScreen(){
            if (this.fullscreen){
                if(document.exitFullscreen){
                    document.exitFullscreen();
                }
                else if(document.webkitCancelFullScreen)
                {
                    document.webkitCancelFullScreen();
                }
                else if(document.mozCancelFullScreen)
                {
                    document.mozCancelFullScreen();
                }
                else if(document.msExitFullScreen)
                {
                    document.msExitFullScreen();
                }
            }
            else
            {
                let element = document.documentElement;
                if (element.requestFullscreen)
                {
                    element.requestFullscreen();
                }
                else if(element.webkitRequestFullScreen)
                {
                    element.webkitRequestFullScreen();
                }
                else if(element.mozRequestFullScreen)
                {
                    element.mozRequestFullScreen();
                }
                else if(element.msRequestFullScreen)
                {
                    element.msRequestFullScreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        },
        handleCommand(command){
            if(command=="logout")
            {
                localStorage.removeItem('userName');
                this.$router.push("/");
            }
        }
    }
}
</script>

<style scoped>
.header {
    position: relative;
    background-color: #15303b;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #ffffff;
}

.icon {
    float: left;
    margin-top: 10px;
    margin-left: -20px;
    line-height: 70px;
}
.header .logo {
    position: relative;
    float: left;
    line-height: 75px;
    margin-left: -30px;
    font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    font-weight: 300;
}

.header-right {
    float: right;
    padding-right: 50px;
    display: flex;
    height: 70px;
    align-items: center;
}

.el-icon-manage {
    background: url(../assets/img/manageicon_fn.png) center no-repeat;
    background-size: contain;
}
.el-icon-manage::before {
    content: "manage";
    font-size: 50px;
    visibility: hidden;
}

.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}

.admin_icon img{
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.admin_name {
    margin-left: 10px;
}

.el-dropdown-link {
    color:#ffffff;
    cursor: pointer;
}
</style>