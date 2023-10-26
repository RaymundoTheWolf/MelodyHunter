<template>
    <div>
        <div class="cover">
            <img :src="picUrl" class="song" :class="{rotating: isPlay}" >
        </div>
        <div class="comment">
            <span class="info">包含该歌曲的歌单</span>
            <div class="listInfo">
                <img :src="attachImageUrl(listImg)">
                <span class="listTitle" @click="goList(listId)">{{ this.listTitle }}</span>
            </div>
        </div>
        <div class="wave">
            <span class="wavetitle">Melody Waveforms | 旋律波形</span>
            <div id="waveform" ref="waveform">
            </div>
        </div>
        <div class="song-lyric">
            <!-- 有歌词 -->
            <ul class="has-lyric" v-if="lyr.length" key="index" :style="`top: ${lyrTop}px`">
                <li v-for="(item,index) in lyr" v-bind:key="index">
                    {{ item[1] }}
                </li>
            </ul>
            <!-- 没有歌词 -->
            <div v-else class="no-lyric" key="no-lyric">
                <span>暂无歌词</span>
            </div>
        </div>
    </div>
</template>

<script>
import WaveSurfer from 'wavesurfer.js'
import { mixin } from '../mixins';
import { mapGetters } from 'vuex';
import {getAllSongList, listSongDetail} from '../api/index';

export default{
    name: 'lyric',
    mixins: [mixin],
    data(){
        return {
            lyr: [],            //当前歌曲的歌词
            lyrTop: 0,
            listImg: '',
            listTitle: '暂无包含该歌曲的歌单',
            listId: '',
        }
    },
    computed: {
        ...mapGetters([
            'curTime',          //播放的时刻
            'id',               //播放的歌曲id
            'lyric',
            'listIndex',
            'listOfSongs',
            'picUrl',
            'isPlay',
            'url',
        ])
    },
    created() {
        const lyricStorage = localStorage.getItem('lyric');
        if (lyricStorage){
            this.lyr = JSON.parse(lyricStorage);
            this.$store.commit('setLyric',JSON.parse(lyricStorage));
        } else{
            this.lyr = this.parseLyric(this.listOfSongs[this.listIndex].lyric);
        }
        this.wavesurfer.load(this.url);
    },
    mounted() {
        this.$nextTick(() => {
            this.wavesurfer = WaveSurfer.create({
                container: this.$refs.waveform,
                // waveColor: '#409EFF',
                barWidth: 1,
                cursorColor: "white",
                cursorWidth: 0,
                progressColor: "#E94057",
                backend: "MediaElement",
                // mediaControls: false,
                audioRate: "1",
                interact: false,
            });
            this.wavesurfer.load(this.url);
        }),
        this.getListHasSong();
    },
    destroyed(){
        this.$store.commit('setCurTime',0);
        this.listImg = '';
        this.listTitle = '暂无包含该歌曲的歌单';
    },
    watch: {
        id: function(){
            this.lyr = this.parseLyric(this.listOfSongs[this.listIndex].lyric);
            this.wavesurfer.load(this.url);
            this.getListHasSong();
        },
        curTime: function(){
            if (this.lyr.length > 0){
                for (let i = 0;i<this.lyr.length;i++)
                {
                    if (this.curTime >= this.lyric[i][0]){
                        for (let j=0; j<this.lyr.length; j++){
                            document.querySelectorAll('.has-lyric li')[j].style.color='#808080';
                            document.querySelectorAll('.has-lyric li')[j].style.fontSize = '22px';
                        }
                        if (i>=0){
                            document.querySelectorAll('.has-lyric li')[i].style.color='#ffffff';
                            document.querySelectorAll('.has-lyric li')[i].style.fontSize = '32px';
                            this.lyrTop = -40*i + 360;
                        }
                    }
                }
            }
        }
    },
    methods:{
        getListHasSong(){
            getAllSongList()
                .then(res => {
                    for (let item of res){
                        this.getListInfo(item.list_id, item);
                    }
                })
        },
        getListInfo(listId, item){
            listSongDetail(listId)
                .then(res => {
                    for (let item1 of res){
                        if (item1.song_id == this.id){
                            this.listImg = item.cover;
                            this.listTitle = item.list_name;
                            this.listId = item.list_id;
                        }
                    }
                })
                .catch(err =>{
                    console.log(err);
                })
        },
        goList(listId){
            this.$router.push({path: `song-list-album/${listId}`})
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/lyric.scss';
.cover{
    position: absolute;
    background: url('../assets/img/flac.png');
    background-size: cover;
    margin-left: 430px;
    margin-top: 130px;
    width: 500px;
    height: 500px;
}
.song{
    position: absolute;
    overflow: hidden;
    margin-left: 150px;
    margin-top: 150px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
}

.rotating{
    animation: rotateImg 10s linear infinite;
}

@keyframes rotateImg {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
.comment{
    position: absolute;
    background: rgba(0,0,0,0.3);
    margin-left: 330px;
    margin-top: 650px;
    width: 700px;
    height: 200px;
    box-shadow: 0px 0px 20px 5px #ffffff;
    border-radius: 15px;
}
.wave{
    position: absolute;
    background: rgba(0,0,0,0.3);
    margin-left: 330px;
    margin-top: 950px;
    width: 700px;
    height: 200px;
    border-radius: 15px;
    box-shadow: 0px 0px 20px 5px #ffffff;
}
.info{
    position: absolute;
    color:#ffffff;
    font-size: 20px;
    padding-left: 20px;
    margin-top: 20px;
}

.listInfo{
    position: absolute;
    margin-top: 63px;
    margin-left: 35px;
    width: 120px;
    height: 120px;
}

.listInfo img{
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.listTitle {
    position: absolute;
    font-size: 30px;
    padding-top: 20px;
    padding-left: 20px;
    width: 500px;
    height: 50px;
    color: rgba(255,255,255,0.7);
}
.wavetitle{
    position: absolute;
    font-size: 25px;
    padding-top: 20px;
    padding-left: 20px;
    color: #ffffff;
}
#waveform {
    margin-top: 60px;
    height: 70px !important;
}

wave {
    height: 50px !important;
}
</style>