<template>
    <div>
        <the-header></the-header>
        <the-aside></the-aside>
        <div class="content-box">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import TheHeader from "./TheHeader.vue";
import TheAside  from "./TheAside.vue";

export default {
    components:{
        TheHeader,
        TheAside
    }
}
</script>