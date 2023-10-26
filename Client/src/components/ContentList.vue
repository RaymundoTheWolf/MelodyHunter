<template>
    <div class="content-list">
        <ul class="section-content">
            <li class="content-item" v-for="(item,index) in contentList" :key="index">
                <div class="kuo" @click="goAlbum(item,item.singer_name)">
                    <img class="item-img" :src="attachImageUrl(item.cover)">
                    <div class="mask">
                    <svg class="icon">
                        <use xlink:href="#icon-bofang"></use>
                    </svg>
                </div>
                </div>
                <p class="item-name" align="center">{{ item.singer_name || item.list_name }}</p>
            </li>
        </ul>
    </div>
</template>

<script>
import {mixin} from '../mixins';
export default{
    name: 'content-list',
    mixins: [mixin],
    props: ['contentList'],
    methods: {
        goAlbum(item,type){
            this.$store.commit('setTempList',item);
            if (type){
                this.$router.push({path: `singer-album/${item.singer_id}`})
            }else
            {
                this.$router.push({path: `song-list-album/${item.list_id}`})
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/content-list.scss';
</style>