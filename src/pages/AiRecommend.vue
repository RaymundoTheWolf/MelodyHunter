<template>
    <div class="wrap">
        <div class="content">
            <span class="info">由于安全策略，您即将跳转到外部网站</span>
            <el-button type="primary" class="externallink" @click="handleLink">前往</el-button>
        </div>
    </div>
</template>
  
 <script>
export default{
    methods:{
        handleLink(){
            const externalLink = 'https://www.gnoosic.com/faves.php';
            window.open(externalLink, '_blank');
        }
    }
}
</script>
  

  

<style scoped>
.wrap {
    padding: 130px 50px 1100px 50px;
    width: 500px;
}

.content{
    background: #fff;
    border-radius: 15px;
    margin-left: 750px;
    margin-top: 200px;
    width: 1000px;
    height: 500px;
}
.info{
    position: absolute;
    font-size: 35px;
    padding: 50px;
    margin-top: 60px;
    margin-left: 140px;
}
.externallink{
    margin-top: 300px;
    margin-left: 400px;
    width: 200px;
    height: 50px;
}
</style>