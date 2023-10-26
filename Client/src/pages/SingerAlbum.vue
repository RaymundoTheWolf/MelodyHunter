<template>
    <div class="singer-album">
        <div class="album-slide">
            <div class="singer-img">
                <img :src="attachImageUrl(singer.cover)">
            </div>
            <ul class="info">
                <li v-if="singer.singer_sex == 0 || singer.singer_sex == 1 ">{{ attach(singer.singer_sex) }}</li>
                <li>生日: {{ attachBirth(singer.birth)  }}</li>
                <li>地区：{{ singer.location }}</li>
            </ul>
        </div>
        <div class="album-content">
            <div class="intro">
                <h2>{{ singer.singer_name }}</h2>
                <span>{{ singer.introduction }}</span>
            </div>
            <div class="content">
                <album-content :songList="listOfSongs">
                    <template slot="title">歌单</template>>
                </album-content>
            </div>
        </div>
    </div>
</template>

<script>
import { mixin } from '../mixins';
import { mapGetters } from 'vuex';
import {songOfSingerId} from '../api/index';
import AlbumContent from '../components/AlbumContent';

export default {
    name: 'singer-album',
    mixins: [mixin],
    components: {
        AlbumContent,
    },
    data(){
        return {
            singerId: '',       //传入的歌曲id
            singer: {},         //当前歌手信息
        }
    },
    computed: {
        ...mapGetters([
            'listOfSongs',
            'tempList',
            'loginIn',
            'userId'
        ])
    },
    created() {

        this.singerId = this.$route.params.id;
        this.singer = this.tempList;
        this.getSongOfSingerId();
    },

    methods:{
        //获取当前歌单的歌曲列表
        getSongOfSingerId(){
            songOfSingerId(this.singerId)
                .then(res => {
                    this.$store.commit('setListOfSongs',res);
                })
                .catch(err => {
                    console.log(err);
                })
        },
        //获取性别
        attach(value){
            if (value == 0){
                return '女';
            }else if (value == 1)
            {
                return '男';
            }else{
                return '';
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/singer-album.scss';
</style>