import store from '@/store'

// 关闭 tab
export const closeTab = (router: any, tab: any) => {
	if (tab.meta && tab.meta.affix) {
		return
	}

	store.tabsStore.delView(tab)
	toLastView(router, store.tabsStore.visitedViews, tab)
}

// 关闭其他 tabs
export const closeOthersTabs = (router: any, tab: any) => {
	router.push(tab)
	store.tabsStore.delOthersViews(tab)
}

// 关闭全部 tabs
export const closeAllTabs = (router: any, tab: any) => {
	store.tabsStore.delAllViews()
	toLastView(router, store.tabsStore.visitedViews, tab)
}

// 跳转到最后一个 tab
export const toLastView = (router: any, visitedViews: any[], view: any) => {
	const latestView = visitedViews.slice(-1)[0]
	if (latestView) {
		router.push(latestView.fullPath)
	} else {
		if (view.name === 'Home') {
			router.replace({ path: '/redirect' + view.fullPath })
		} else {
			router.push('/')
		}
	}
}
