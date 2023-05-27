import { getCommunityList } from '@/api/community/community'

export const useGetCommunityList = () => {
	let data = JSON.parse(localStorage.getItem('community'))
	// console.log(data)
	if (data === null) {
		getCommunityList().then(res => {
			console.log(res)
			data = res.data
			localStorage.setItem('community', JSON.stringify(res.data))
		})
	}
	return data
}

export const useSetInfo = (data:any) => {
	localStorage.setItem('info', JSON.stringify(data))
}

export const useGetInfo = () => {
	let data = localStorage.getItem('info')
	data = JSON.parse(data)
	return data
}

