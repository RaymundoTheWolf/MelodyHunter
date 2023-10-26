<template>
    <div class="my-music">
        <div class="album-slide">
            <div class="album-img">
                <img :src="attachImageUrl(avator)">
            </div>
            <ul class="album-info">
                <li>昵称：{{ username }}</li>
                <li>性别：{{ userSex }}</li>
                <li>生日：{{ birth }}</li>
                <li>地区：{{ location }}</li>
            </ul>
        </div>
        <div class="album-content">
            <div class="album-title">
                个性签名
            </div>
            <span> {{ profile }}</span>
            <div class="songs-body">
                <album-content :songList="collectList">
                    <template slot="title">我的收藏</template>
                </album-content>
            </div>
        </div>
    </div>
</template>

<script>
import { mixin } from '../mixins';
import { mapGetters } from 'vuex';
import { getUserOfId, getCollectOfUserId, songOfId } from '../api/index';
import AlbumContent from '../components/AlbumContent'

export default {
    name: 'my-music',
    mixins: [mixin],
    components:{
        AlbumContent,
    },
    computed:{
        ...mapGetters([
            'listOfSongs',
            'userId'
        ])
    },
    mounted(){
        this.getMsg(this.userId);
        this.getCollection(this.userId);
        this.$store.commit('setListOfSongs',this.collectList);
    },
    data(){
        return{
            avator: '',
            username: '',
            userSex: '',
            birth: '',
            location: '',
            profile: '',
            collection: [],
            collectList: [],           //收藏的歌曲列表（带详情）
        }
    },
    methods:{
        getMsg(userId){
            getUserOfId(userId)
                .then(res => {
                    this.avator = res.icon;
                    this.username = res.username;
                    if (res.sex == 0){
                        this.userSex = '女';
                    }else if (res.sex == 1){
                        this.userSex = '男';
                    }
                    this.birth = this.attachBirth(res.birth);
                    this.location = res.location;
                    this.profile = res.profile;
                })
                .catch(err => {
                    console.log(err);
                })
        },
        getCollection(userId){
            getCollectOfUserId(userId)
                .then(res => {
                    this.collection = res;
                    for (let item of this.collection){
                        this.getSongOfIds(item.songId);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        //通过id获取歌曲信息
        getSongOfIds(id){
            songOfId(id)
                .then(res => {
                    this.collectList.push(res);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/my-music.scss';
</style>