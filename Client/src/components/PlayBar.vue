<template>
    <div class="play-bar">
        <div class="kongjian">
            <!--上一首-->
            <div class="item" @click="prev">
                <svg class="icon">
                    <use xlink:href="#icon-ziyuanldpi"></use>
                </svg>
            </div>
            <!--播放-->
            <div class="item" @click="togglePlay">
                <svg class="icon">
                    <use :xlink:href="playButtonUrl"></use>
                </svg>
            </div>
            <!--下一首-->
            <div class="item" @click="next">
                <svg class="icon">
                    <use xlink:href="#icon-ziyuanldpi1"></use>
                </svg>
            </div>
            <!--歌曲图片-->
            <div class="item-img" @click="toLyric">
                <img :src="picUrl"/>
            </div>
            <!--播放进度-->
            <div class="playing-speed">
                <!-- 播放开始时间 -->
                <div class="current-time">{{ nowTime }}</div>
                <div class="progress-box">
                    <div class="item-song-title">
                        <div>{{ this.title }}</div>
                        <div>{{ this.artist }}</div>
                    </div>
                    <div ref="progress" class="progress" @mousemove="mousemove">
                        <!--进度条-->
                        <div ref="bg" class="bg" @click="updatemove">
                            <div ref="curProgress" class="cur-progress" :style="{width:curLength+'%'}"></div>
                        </div>
                        <div>
                            <!-- 拖动点 -->
                            <div ref="idot" class="idot" :style="{left:curLength+'%'}" @mousedown="mousedown" @mouseup="mouseup"></div>
                        </div>
                    </div>
                </div>
                <!-- 播放结束时间 -->
                <div class="left-time">{{ songTime }}</div>
                <!-- 音量 -->
                <div class="item item-volume">
                    <svg v-if="volume == 0" class="icon">
                        <use xlink:href="#icon-yinliangjingyinheix"></use>
                    </svg>
                    <svg v-else class="icon">
                        <use xlink:href="#icon-yinliang1"></use>
                    </svg>
                    <el-slider class="volume" v-model="volume" :vertical="false"></el-slider>
                </div>
                <div class="item"></div>
                <!-- 收藏 -->
                <div class="item" @click="collection">
                    <svg :class="{active:isActive}" class="icon" >
                        <use xlink:href="#icon-xihuan-shi"></use>
                    </svg>
                </div>
                <!-- 当前播放的歌曲列表 -->
                <div class="item" @click="changeAside">
                    <svg class="icon">
                        <use xlink:href="#icon-liebiao"></use>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { setCollect, getCollectOfUserId } from '../api';

export default {
    name: 'play-bar',
    data(){
        return {
            nowTime: '00:00',
            songTime: '00:00',
            curLength: 0,           //进度条的位置
            progressLength: 0,      //进度条总长度
            mouseStartX: 0,         //点击时刻位置
            tag: false,             //拖拽开始结束的标志，当开始拖拽，值变为true
            volume: 50,
            toggle: true,
        }
    },
    mounted() {
        this.progressLength = this.$refs.progress.getBoundingClientRect().width;
        document.querySelector('.item-volume').addEventListener('click', function(e){
            document.querySelector('.volume').classList.add('show-volume');
            e.stopPropagation();
        },false);
        document.querySelector('.volume').addEventListener('click', function(e){
            e.stopPropagation();
        },false);
        document.addEventListener('click',function(){
            document.querySelector('.volume').classList.remove('show-volume');
        },false);

    },
    computed: {
        ...mapGetters([
            'id',
            'isPlay',
            'url',
            'playButtonUrl',
            'picUrl',
            'title',
            'artist',
            'duration',
            'curTime',
            'showAside',
            'listIndex',
            'listOfSongs',
            'autoNext',
            'loginIn',
            'userId',
            'isActive',
        ])
    },
    watch:{
        //切换播放状态的图标
        isPlay() {
            if (this.isPlay)
            {
                this.$store.commit('setPlayButtonUrl', '#icon-zanting');
            }
            else
            {
                this.$store.commit('setPlayButtonUrl', '#icon-bofang');
            }
        },
        curTime() {
            this.nowTime = this.formatSeconds(this.curTime);
            this.songTime = this.formatSeconds(this.duration);
            this.curLength = (this.curTime / this.duration) * 100;
        },
        //音量变化
        volume() {
            this.$store.commit('setVolume', this.volume / 100);
        },
        autoNext(){
            this.next();
        }
    },
    methods: {
        //控制音乐播放暂停
        togglePlay()
        {
            if (this.isPlay)
            {
                this.$store.commit('setIsPlay', false);
            }
            else
            {
                this.$store.commit('setIsPlay', true);
            }
        },
        //解析时间
        formatSeconds(value) {
            let theTime = parseInt(value);
            let result = '';
            let hour = parseInt(theTime / 3600);            //小时
            let minute = parseInt ((theTime / 60) % 60);    //分钟
            let second = parseInt (theTime % 60);           //秒
            if (hour > 0){
                if (hour < 10)
                {
                    result = '0' + hour + ":";
                }
                else
                {
                    result = hour + ":";
                }
            }
            if (minute > 0)
            {
                if (minute < 10)
                {
                    result += "0" + minute + ":";
                }
                else
                {
                    result += minute + ":";
                }
            }else{
                result += "00:";
            }
            if (second > 0)
            {
                if (second < 10)
                {
                    result += "0" + second;
                }else
                {
                    result += second;
                }
            }else{
                result += "00";
            }
            return result;
        },
        //拖拽开始
        mousedown(e){
            this.mouseStartX = e.clientX;
            this.tag = true;
        },
        //拖拽结束
        mouseup(){
            this.tag = false;
        },
        //拖拽中
        mousemove(e){
            if(!this.duration){
                return false;
            }
            if(this.tag){
                let movementX = e.clientX - this.mouseStartX;       //点点移动的距离
                let curLength = this.$refs.curProgress.getBoundingClientRect().width;
                let newPercent = ((movementX+curLength)/this.progressLength)*100;
                if(newPercent>100){
                    newPercent = 100;
                }
                this.curLength = newPercent;
                this.mouseStartX = e.clientX;
                this.changeTime(newPercent);
            }
        },
        //更改歌曲进度
        changeTime(percent){
            let newCurTime = (percent * 0.01)*this.duration;
            this.$store.commit('setChangeTime', newCurTime);
        },
        //点击播放条切换播放进度
        updatemove(e){
            if (!this.tag)
            {
                let curLength = this.$refs.bg.offsetLeft;
                let newPercent = ((e.clientX - curLength) / this.progressLength) *100;
                if (newPercent > 100)
                {
                    newPercent = 100;
                }
                else if (newPercent < 0)
                {
                    newPercent = 0;
                }
                this.curLength = newPercent;
                this.changeTime(newPercent);
            }
        },
        changeAside(){
            this.$store.commit('setShowAside',true);
        },
        prev(){
            if (this.listIndex != -1 && this.listOfSongs.length > 1)
            {
                if (this.listIndex > 0)
                {
                    this.$store.commit('setListIndex', this.listIndex - 1 );
                }
                else
                {
                    this.$store.commit('setListIndex', this.listOfSongs.length - 1 );
                }
                this.toPlay(this.listOfSongs[this.listIndex].url);
            }
        },
        next(){
            if (this.listIndex != -1 && this.listOfSongs.length > 1)
            {
                if (this.listIndex < this.listOfSongs.length - 1)
                {
                    this.$store.commit('setListIndex', this.listIndex + 1 );
                }
                else
                {
                    this.$store.commit('setListIndex', 0 );
                }
                this.toPlay(this.listOfSongs[this.listIndex].url);
            }
        },
        replaceLName(str) {
                let arr = str.split('-');
                return arr[0];
        },
        //获取名字后半部分
        replaceFName(str) {
                let arr = str.split('-');
                return arr[1];
        },
        //解析歌词
        parseLyric(text){
            let lines = text.split("\n");
            let pattern = /\[\d{2}:\d{2}.(\d{2}|\d{3})\]/g;
            let result = [];
            if (!(/\[.+\]/.test(text))){
                return [[0,text]];
            }
            while(!pattern.test(lines[0]))
            {
                lines = lines.slice(1);
            }
            for (let item of lines){
                let time = item.match(pattern);
                let value = item.replace(pattern,'');
                for (let item1 of time){
                    let t = item1.slice(1,-1).split(":");
                    if (value != ''){
                        result.push([parseInt(t[0],10)*60 + parseFloat(t[1]), value]);
                    }
                }
            }
            result.sort(function(a,b){
                return a[0] - b[0];
            });
            return result;
        },
        //播放
        toPlay: function(url){
            if (url && url !=this.url){
                this.$store.commit('setId', this.listOfSongs[this.listIndex].song_id);
                this.$store.commit('setUrl', this.$store.state.configure.HOST + url);
                this.$store.commit('setPicUrl', this.$store.state.configure.HOST + this.listOfSongs[this.listIndex].cover);
                this.$store.commit('setTitle', this.replaceFName(this.listOfSongs[this.listIndex].song_name));
                this.$store.commit('setArtist', this.replaceLName(this.listOfSongs[this.listIndex].song_name));
                this.$store.commit('setLyric', this.parseLyric(this.listOfSongs[this.listIndex].lyric));
                localStorage.setItem('lyric',JSON.stringify(this.parseLyric(this.listOfSongs[this.listIndex].lyric)));
                if (this.loginIn){
                    getCollectOfUserId(this.userId)
                        .then(res => {
                            for (let item of res){
                                if (item.songId == this.listOfSongs[this.listIndex].song_id){
                                    this.$store.commit('setIsActive',true);
                                    break;
                                }
                            }
                        })
                }
            }
        },
        toLyric() {
            this.$router.push({path: `/lyric`});
        },
        collection(){
            if (this.loginIn){
                var params = new URLSearchParams();
                params.append('clientId',this.userId);
                params.append('type', 0);
                params.append('songId',this.id);
                setCollect(params)
                    .then(res => {
                        if (res.code == 1){
                            this.$store.commit('setIsActive',true);
                            this.notify('收藏成功','success');
                        }else if (res.code == 2){
                                this.notify('已收藏','warning');
                        }else {
                            this.notify('收藏失败','error');
                        }
                    })
            }
            else{
                this.notify('请先登录','warning');
            }
        },
        //提示信息
            notify(title,type) {
                this.$notify({
                title: title,
                type: type
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/play-bar.scss';

.kongjian {
    background: -webkit-linear-gradient(left,#141E30,#243B55);
}
</style>