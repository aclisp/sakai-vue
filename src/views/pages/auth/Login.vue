<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { directusClient } from '@/service/DirectusService';
import { useRouter } from 'vue-router';
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const schema = toTypedSchema(
    z
        .object({
            email: z.string().email({ message: 'Email不是一个有效的电子邮件地址' }).min(1, { message: 'Email不能为空' }),
            password: z.string().min(1, { message: '密码不能为空' }),
            checked: z.boolean()
        })
        .required()
);
const { isSubmitting, handleSubmit, errors } = useForm({
    validationSchema: schema,
    initialValues: {
        email: '',
        password: '',
        checked: false
    }
});
const { value: email } = useField('email');
const { value: password } = useField('password');
const { value: checked } = useField('checked');
const showError = ref(false);

const { layoutConfig } = useLayout();
const router = useRouter();

const logoUrl = computed(() => {
    return `/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const onSubmit = handleSubmit(
    async (values) => {
        const { email, password, checked } = values;
        console.log(`onSubmit:email='${email}',password='${password}',checked=${checked}`);
        try {
            const data = await directusClient.login(email, password);
            console.log(`onSubmit.afterLogin:data=%o`, data);
            router.push({ path: '/pages/empty', replace: true });
        } catch (err) {
            console.log(`onSubmit.afterLogin:err=%o`, err);
        }
    },
    () => {
        showError.value = true;
    }
);
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" />
                        <div class="text-900 text-3xl font-medium mb-3">Welcome, Isabel!</div>
                        <span class="text-600 font-medium">Sign in to continue</span>
                    </div>

                    <div>
                        <form @submit="onSubmit">
                            <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                            <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" />

                            <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                            <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

                            <div class="flex align-items-center justify-content-between mb-5 gap-5">
                                <div class="flex align-items-center">
                                    <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                    <label for="rememberme1">Remember me</label>
                                </div>
                                <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a>
                            </div>
                            <Button type="submit" label="Sign In" class="w-full p-3 text-xl" :loading="isSubmitting"></Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Dialog v-model:visible="showError" modal header="请确认输入" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <ul>
            <li v-for="(error, field) in errors" :key="field">{{ error }}</li>
        </ul>
    </Dialog>
    <AppConfig simple />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
