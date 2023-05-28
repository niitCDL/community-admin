import { getCommunityList } from '@/api/community/community'
import { getUserList } from '@/api/sys/user'



export  function  useGetCommunityList() {
	let data = JSON.parse(localStorage.getItem('community'))
	if (data === null) {
		getCommunityList().then(res => {
			console.log(res)
			data = res.data
			localStorage.setItem('community', JSON.stringify(res.data))
		})
	}
	return data
	// let data 
	//  getCommunityList().then(res => {
	// 	// console.log(res)
	// 	data = res.data
	// })
	// return data
}

export  function userGetCommunityOption()  {
	let communities =  useGetCommunityList()
	let options = []
	if (communities != null) {
		options = communities.map(obj => ({
			value: obj.id,
			label: obj.communityName
		}))
	}

	return options
}

export  function  useGetList() {
	let data = JSON.parse(localStorage.getItem('user'))
	// console.log(data)
	if (data === null) {
		getUserList().then(res => {
			// console.log(res)
			data = res.data
			localStorage.setItem('user', JSON.stringify(res.data))
		})
	}
	return data

	// let data
	// getUserList().then(res => {
	// 	// console.log(res)
	// 	data = res.data

	// })
	// return data
}

export function useGetListOption ()  {
	let users =  useGetList()
	let options = []
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
