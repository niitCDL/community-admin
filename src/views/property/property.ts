import { getCommunityList } from '@/api/community/community'
import { useDictTypeAllApi } from '@/api/sys/dict'
import { getUserList } from '@/api/sys/user'
import { reactive } from 'vue'


export async function a() {
	//第二种方式
	// let {data} = await getCommunityList()
	//第三种方式
	let data
	await getCommunityList().then(res => {
		data = res.data
		console.log('内部')
		console.log(data)
	})
	console.log('外部')
	console.log(data)
	return data
}

export async  function  useGetCommunityList() {
	// let data = JSON.parse(localStorage.getItem('community'))
	// if (data === null) {
	// 	getCommunityList().then(res => {
	// 		console.log(res)
	// 		data = res.data
	// 		localStorage.setItem('community', JSON.stringify(res.data))
	// 	})
	// }
	// return data
	let {data} = await getCommunityList()
	// let data
	// await getCommunityList().then(res => {
	// 	data = res.data
	// 	console.log("内部")
	// 	console.log(res)
		
	// })
	// console.log("方法数据")
	// console.log(data)
	return data
}

export async function userGetCommunityOption()  {
	let communities = await  useGetCommunityList()
	let options =  reactive([])
	if (communities != null) {
		options = communities.map(obj => ({
			value: obj.id,
			label: obj.communityName
		}))
	}
	return options
}




export async  function  useGetList() {
	// let data = JSON.parse(localStorage.getItem('user'))
	// // console.log(data)
	// if (data === null) {
	// 	getUserList().then(res => {
	// 		// console.log(res)
	// 		data = res.data
	// 		localStorage.setItem('user', JSON.stringify(res.data))
	// 	})
	// }
	// return data

	let {data} =  await getUserList()
	// getUserList().then(res => {
	// 	// console.log(res)
	// 	data = res.data

	// })
	return data
}

export async function useGetListOption ()  {
	let users = await useGetList()
	let options =  reactive([])
	if (users != null) {
		options = users.map(obj => ({
			value: obj.id + '',
			label: obj.realName
		}))
	}

	return options
}

export const useSetInfo = (data: any) => {
	localStorage.setItem('info', JSON.stringify(data))
}

export const useGetInfo = () => {
	let data = localStorage.getItem('info')
	data = JSON.parse(data)
	return data
}

export   const  useGetDictType = async (id:any)=>{
	let notice_type
    await useDictTypeAllApi().then(res => {
		console.log(res.data)
		notice_type = res.data[id].dataList
		
		notice_type = notice_type.map(obj => ({
			dictLabel: obj.dictLabel,
			dictValue: parseInt(obj.dictValue)
		}))
	})
	return notice_type
}
