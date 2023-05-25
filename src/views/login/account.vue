<template>
	<el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" @keyup.enter="onLogin">
		<div class="login-title">登录</div>
		<el-form-item prop="username">
			<el-input v-model="loginForm.username" :prefix-icon="User" placeholder="username"></el-input>
		</el-form-item>
		<el-form-item prop="password">
			<el-input v-model="loginForm.password" :prefix-icon="Lock" show-password placeholder="password"></el-input>
		</el-form-item>
		<el-form-item prop="captcha" class="login-captcha">
			<el-input v-model="loginForm.captcha" placeholder="输入验证码" :prefix-icon="Key"></el-input>
			<img :src="captchaBase64" @click="onCaptcha" />
		</el-form-item>
		<el-form-item class="login-button">
			<el-button type="primary" @click="onLogin"> 登录</el-button>
		</el-form-item>
	</el-form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { User, Lock, Key } from '@element-plus/icons-vue'
import store from '@/store'
import { useCaptchaApi } from '@/api/auth'
import { useRouter } from 'vue-router'
import constant from '@/utils/constant'

const router = useRouter()
const loginFormRef = ref()
const captchaBase64 = ref()

const loginForm = reactive({
	username: constant.env.PROD ? '' : 'admin',
	password: constant.env.PROD ? '' : '123456',
	key: '',
	captcha: '1234'
})

const loginRules = ref({
	username: [{ required: true, message: 'required', trigger: 'blur' }],
	password: [{ required: true, message: 'required', trigger: 'blur' }],
	captcha: [{ required: true, message: 'required', trigger: 'blur' }]
})

onMounted(() => {
	onCaptcha()
})

const onCaptcha = async () => {
	const { data } = await useCaptchaApi()
	loginForm.key = data.key
	captchaBase64.value = data.image
}

const onLogin = () => {
	loginFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		// 用户登录
		store.userStore
			.accountLoginAction(loginForm)
			.then(() => {
				router.push({ path: '/home' })
			})
			.catch(() => {
				onCaptcha()
			})
	})
}
</script>

<style lang="scss" scoped>
.login-title {
	display: flex;
	justify-content: center;
	margin-bottom: 35px;
	font-size: 24px;
	color: #444;
	letter-spacing: 4px;
}
.login-captcha {
	:deep(.el-input) {
		width: 200px;
	}
}
.login-captcha img {
	width: 150px;
	height: 40px;
	margin: 5px 0 0 10px;
	cursor: pointer;
}
.login-button {
	:deep(.el-button--primary) {
		margin-top: 10px;
		width: 100%;
		height: 45px;
		font-size: 18px;
		letter-spacing: 8px;
	}
}
</style>
