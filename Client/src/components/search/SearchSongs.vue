<template>
    <div class="search-songs">
        <album-content :songList="listOfSongs"></album-content>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { mixin } from '../../mixins';
import AlbumContent from '../AlbumContent';

export default {
    name: 'search-songs',
    components: {
        AlbumContent
    },
    mixins: [mixin],
    computed: {
        ...mapGetters([
            'listOfSongs'
        ])
    },
    watch:{
        $route: function() {
            this.getSong()
        }
    },
    mounted() {
        this.getSong();
    }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/search-songs.scss'
</style>