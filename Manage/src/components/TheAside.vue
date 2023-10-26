<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#2c5364"
            text-color="#ffffff"
            active-text-color="#20a0ff"
            router
        >
            <template v-for="item in items">
                <template>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        {{item.title}}
                    </el-menu-item>
                </template>
            </template>

        </el-menu>
    </div>
</template>

<script>
export default {
    data(){
        return{
            collapse: false,
            items:[
                {
                    icon: 'el-icon-document',
                    index: 'Info',
                    title: '系统首页'
                },
                {
                    icon: 'el-icon-document',
                    index: 'Client',
                    title: '用户管理'
                },
                {
                    icon: 'el-icon-document',
                    index: 'Singer',
                    title: '歌手管理'
                },
                {
                    icon: 'el-icon-document',
                    index: 'list',
                    title: '歌单管理'
                },

            ]
        }
    },
    computed:{
        onRoutes(){
            return this.$route.path.replace('/','');
        }
    }
}
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    background: -webkit-linear-gradient(bottom,#0f2027,#203a43,#2c5364);
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}

.sidebar-el-menu {
    width: 150px;
}

.el-menu-item:hover{
    width: 100%;
}
.sidebar >ul {
    height: 100%;
}
</style>