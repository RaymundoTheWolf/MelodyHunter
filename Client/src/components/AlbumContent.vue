<template>
    <div class="content">
        <h1 class="title">
            <slot name="title"></slot>
        </h1>
        <ul>
            <li>
                <div class="song-item">
                    <span class="item-index"></span>
                    <span class="item-title">歌曲名</span>
                    <span class="item-name">歌手</span>
                    <span class="item-intro">专辑</span>
                </div>
            </li>
            <li v-for="(item,index) in songList" :key="index">
                <div class="song-item" @click="toPlay(item.song_id, item.url, item.cover, index, item.song_name, item.lyric)" :class="{'highlight': item.song_id == id }">
                    <span class="item-index">
                        {{ index + 1 }}
                    </span>
                    <span class="item-title">{{ replaceFName(item.song_name) }}</span>
                    <span class="item-name">{{ replaceLName(item.song_name) }}</span>
                    <span class="item-intro">{{item.introduction}}</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { mixin } from '../mixins';

export default {
    name: 'album-content',
    mixins: [mixin],
    props: [
        'songList'
    ],
    data() {
        return {
            selectedIndex: -1,
        }
    },
    computed:{
        ...mapGetters([
            'id'
        ])
    }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/album-content.scss';

.highlight  {
    color: #E94057;
}
</style>