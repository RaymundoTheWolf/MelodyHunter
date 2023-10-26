<template>
    <div class="upload">
        <p class="title">修改头像</p>
        <hr/>
        <div class="section">
            <el-upload drag :action="uploadUrl()" :show-file-list="false" :on-success="handleAvatorSuccess"
                :before-upload="beforeAvatorUpload">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload_text">
                        将文件拖到此处,或<span style="color:blue">上传头像</span>
                    </div>
                    <div slot="tip">只能上传不超过10MB的JPG或PNG文件</div>
            </el-upload>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';
import {mixin} from '../mixins';

export default {
    name: 'upload',
    mixins: [mixin],
    computed:{
        ...mapGetters([
            'userId',
        ])
    },
    methods:{
        uploadUrl(){
            return `${this.$store.state.configure.HOST}/client/updateClientPic?id=${this.userId}`;
        },
        handleAvatorSuccess(res,file){
            if (res.code == 1){
                this.$store.commit('setIcon',res.pic);
                this.notify('更新头像成功','success');
            }else{
                this.notify('修改失败','error');
            }
        },
        beforeAvatorUpload(file){
            const isJPG = file.type =='image/jpeg';
            const isLt10M = (file.size / 1024 / 1024) < 10;
            if (!isJPG){
                this.notify('请上传JPG格式文件','error');
                return false;
            }
            if (!isLt10M){
                this.notify('上传的头像不能超过10MB','error');
                return false;
            }
            return true;
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/upload.scss';
</style>