<script setup>
import { directusHost, directusClient } from '@/service/DirectusService';
import { ref, onMounted, shallowRef, computed } from 'vue';
import { readMe } from '@directus/sdk';

const token = ref();
const me = shallowRef();
const avatar = computed(() => {
    if (me.value) {
        return `${directusHost}/assets/${me.value.avatar}?access_token=${token.value}`;
    } else {
        return '';
    }
});
const error = ref('initial');

onMounted(async () => {
    try {
        token.value = await directusClient.getToken();
        me.value = await directusClient.request(readMe());
        error.value = null;
        console.log(`onMounted:me=%o`, me.value);
    } catch (err) {
        console.log(`onMounted:err=%o`, err);
        error.value = JSON.stringify(err);
    }
});
</script>

<template>
    <div className="card">
        <h5>Empty Page</h5>
        <p>Use this page to start from scratch and place your custom content.</p>
    </div>
    <div className="card">
        <h5>Token</h5>
        <p v-if="token">{{ token }}</p>
        <router-link v-else to="/auth/login">Go to Login</router-link>
    </div>
    <div v-if="error" className="card">
        <h5>Error</h5>
        <p>{{ error }}</p>
    </div>
    <div v-else className="card">
        <h5>Current User</h5>
        <Image :src="avatar" alt="My avatar" width="250" />
        <p>{{ me.first_name }} {{ me.last_name }}</p>
    </div>
</template>
