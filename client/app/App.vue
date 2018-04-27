<template>
<div class="container">
    <header class="top-menu">
        <router-link to="/">首页</router-link>
        <router-link to="/mock">mock接口</router-link>
        <router-link to="/mockws">模拟推送</router-link>
        <router-link to="/tools">工具</router-link>
        <router-link to="/help">帮助</router-link>
    </header>
    <div class="body">
        <nav class="left-menu">
            <router-link to="/" title="首页"><i class="iconfont "></i></router-link>
            <router-link to="/mock" title="mock接口"><i class="iconfont "></i></router-link>
            <router-link to="/mockws" title="模拟推送"><i class="iconfont "></i></router-link>
            <router-link to="/tools" title="工具"><i class="iconfont "></i></router-link>
        </nav>
        <nav class="sub-menu">
          <router-link to="/mock">mock接口</router-link>
        </nav>
        <router-view class="content"></router-view>
    </div>
    <footer>qq:55342775</footer>
</div>
</template>

<script>
import "./assets/style.css";
export default {
    name: "App",
    components: {}
};
</script>
