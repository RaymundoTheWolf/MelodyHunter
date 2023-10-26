<template>
    <div class="song-list-album">
        <div class="album-slide">
            <div class="album-img">
                <img :src="attachImageUrl(tempList.cover)">
            </div>
                <div class="album-info">
                <h2>简介：</h2>
                <span>
                    {{ tempList.introduction }}
                </span>
            </div>
        </div>
        <div class="album-content">
            <div class="album-title">
                <p>{{ tempList.list_name }}</p>
            </div>
            <div class="album-score">
                <div>
                    <h3>歌单评分: </h3>
                    <div>
                        <el-rate v-model="average" disabled></el-rate>
                    </div>
                </div>
                <span>{{average * 2}}</span>
                <div>
                    <h3>评价: </h3>
                    <div @click="setRank">
                        <el-rate v-model="rank" allow-half show-text :disabled="isRated"></el-rate>
                    </div>
                </div>
            </div>
            <div class="songs-body">
                <album-content :songList="listOfSongs">
                    <template slot="title">歌单</template>>
                </album-content>
                <comment :playId="songListId" :type="1"></comment>
            </div>
        </div>
    </div>
</template>

<script>
import { mixin } from '../mixins';
import { mapGetters } from 'vuex';
import {listSongDetail, songOfId, setRank, getRankOfListId} from '../api/index';
import AlbumContent from '../components/AlbumContent';
import Comment from '../components/Comment';

export default {
    name: 'song-list-album',
    mixins: [mixin],
    components: {
        AlbumContent,
        Comment,
    },
    data(){
        return {
            songLists: [],      //展示的歌曲列表
            songListId: '',     //传入的歌单id
            average: 0,         //平均分
            rank: 0,            //提交评价的分数
            isRated: false,     //判定是否评价过
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
        this.songListId = this.$route.params.id;
        this.getSongId();
        this.getRank(this.songListId);
    },
    methods: {
        //获取当前歌单的歌曲列表
        getSongId(){
            listSongDetail(this.songListId)
                .then(res => {
                    for (let item of res){
                        this.getSongList(item.song_id)
                    }
                    this.$store.commit('setListOfSongs',this.songLists);
                })
                .catch(err => {
                    console.log(err);
                })
        },
        //根据歌曲id获取歌曲信息
        getSongList(id){
            songOfId(id)
                .then(res => {
                    this.songLists.push(res);
                })
                .catch(err => {
                    console.log(err);
                })
        },
        //获取歌单评分
        getRank(id){
            getRankOfListId(id)
                .then(res => {
                    this.average = res / 2;
                })
                .catch(err => {
                    console.log(err);
                })
        },
        //提交评分
        setRank(){
            if (this.loginIn){
                let params = new URLSearchParams();
                params.append('listId',this.songListId);
                params.append('clientId',this.userId);
                params.append('score', this.rank * 2);
                setRank(params)
                    .then(res => {
                        if (res.code == 1){
                            this.notify('评价成功','success');
                            this.getRank(this.songListId);
                            this.isRated = true;
                        }else
                        {
                            this.notify('评分失败','error')
                        }
                    })
                    .catch(err =>{
                        this.notify('您已经评价过了','error');
                    })
            }else{
                this.rank = null;
                this.notify('请先登录','warning');
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/song-list-album.scss';
</style>