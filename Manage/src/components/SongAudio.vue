<template>
    <div class="song-audio">
        <audio id="player" 
            :src = "url"
            controls = "controls"
            preload = "true"
            @canplay="startPlay"
            @ended="ended"
        ></audio>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
    name: 'song-audio',
    computed: {
        ...mapGetters([
            'id',
            'url',
            'isPlay'
        ])
    },
    data(){
        return{
            src: "http://localhost:8888/song/1688130795801Heat_Waves.mp3"
        }
    },
    watch:{
        isPlay: function(){
            this.togglePlay();
        }
    },
    methods: {
        //获取连接后准备播放
        startPlay(){
            let player = document.querySelector('#player');
            //开始播放
            player.play();
        },
        //播放完成之后触发
        ended(){
            this.isPlay = false;
        },
        //开始、暂停
        togglePlay(){
            let player = document.querySelector('#player');
            if(this.isPlay)
            {
                player.play();
            }
            else
            {
                player.pause();
            }
        }
    }
}
</script>

<style>
.song-audio {
    display: none;
}
</style>