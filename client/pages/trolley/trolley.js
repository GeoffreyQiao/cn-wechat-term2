// pages/trolley/trolley.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: null,
        locationAuthType: app.data.locationAuthType
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    onTapLogin: function () {
        app.login({
            success: ({ userInfo }) => {
                this.setData({
                    userInfo,
                    locationAuthType: app.data.locationAuthType
                })
            },
            error: () => {
                this.setData({
                    locationAuthType: app.data.locationAuthType
                })
            }
        })
    },

<<<<<<< HEAD

    getTrolley() {
        wx.showLoading({
            title: '刷新购物车数据...',
        })

        qcloud.request({
            url: config.service.trolleyList,
            login: true,
            success: result => {
                wx.hideLoading()

                let data = result.data

                if (!data.code) {
                    this.setData({
                        trolleyList: data.data
                    })
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: '数据刷新失败',
                    })
                }
            },
            fail: () => {
                wx.hideLoading()

                wx.showToast({
                    icon: 'none',
                    title: '数据刷新失败',
                })
            }
        })
    },

    onTapCheckSingle(event) {
        let checkId = event.currentTarget.dataset.id
        let { trolleyCheckMap, trolleyList, isTrolleyTotalCheck, trolleyAccount } = this.data
        let numTotalProduct
        let numCheckedProduct = 0
        // 单项商品被选中/取消
        trolleyCheckMap[checkId] = !trolleyCheckMap[checkId]

        // 判断选中的商品个数是否需商品总数相等
        numTotalProduct = trolleyList.length
        trolleyCheckMap.forEach(checked => {
            numCheckedProduct = checked ? numCheckedProduct + 1 : numCheckedProduct
        })

        isTrolleyTotalCheck = (numTotalProduct === numCheckedProduct) ? true : false

        trolleyAccount = this.calcAccount(trolleyList, trolleyCheckMap)

        this.setData({
            trolleyCheckMap,
            isTrolleyTotalCheck,
            trolleyAccount
        })
    },

    onTapCheckTotal(event) {
        let { trolleyCheckMap, trolleyList, isTrolleyTotalCheck, trolleyAccount } = this.data

        // 全选按钮被选中/取消
        isTrolleyTotalCheck = !isTrolleyTotalCheck

        // 遍历并修改所有商品的状态
        trolleyList.forEach(product => {
            trolleyCheckMap[product.id] = isTrolleyTotalCheck
        })

        trolleyAccount = this.calcAccount(trolleyList, trolleyCheckMap)

        this.setData({
            isTrolleyTotalCheck,
            trolleyCheckMap,
            trolleyAccount
        })

    },

    calcAccount(trolleyList, trolleyCheckMap) {
        let account = 0
        trolleyList.forEach(product => {
            account = trolleyCheckMap[product.id] ? account + product.price * product.count : account
        })

        return account
    },

    onTapEditTrolley() {
        let isTrolleyEdit = this.data.isTrolleyEdit

        if (isTrolleyEdit) {
            this.updateTrolley()
        } else {
            this.setData({
                isTrolleyEdit: !isTrolleyEdit
            })
        }
    },

    adjustTrolleyProductCount(event) {
        let { trolleyCheckMap, trolleyList } = this.data
        let { type: adjustType, id: productId } = event.currentTarget.dataset
        let product
        let index

        for (index = 0; index < trolleyList.length; index++) {
            if (productId === trolleyList[index].id) {
                product = trolleyList[index]
                break
            }
        }

        if (product) {
            if (adjustType === 'add') {
                // 点击加号
                product.count++
            } else {
                // 点击减号
                if (product.count <= 1) {
                    // 商品数量不超过1，点击减号相当于删除
                    delete trolleyCheckMap[productId]
                    trolleyList.splice(index, 1)
                } else {
                    // 商品数量大于1
                    product.count--
                }
            }
        }

        // 调整结算总价
        let trolleyAccount = this.calcAccount(trolleyList, trolleyCheckMap)

        if (!trolleyList.length) {
            // 当购物车为空，自动同步至服务器
            this.updateTrolley()
        }

        this.setData({
            trolleyAccount,
            trolleyList,
            trolleyCheckMap
        })
    },

    updateTrolley() {
        wx.showLoading({
            title: '更新购物车数据...',
        })

        let trolleyList = this.data.trolleyList

        qcloud.request({
            url: config.service.updateTrolley,
            method: 'POST',
            login: true,
            data: {
                list: trolleyList
            },
            success: result => {
                wx.hideLoading()

                let data = result.data

                if (!data.code) {
                    this.setData({
                        isTrolleyEdit: false
                    })
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: '更新购物车失败'
                    })
                }
            },
            fail: () => {
                wx.hideLoading()

                wx.showToast({
                    icon: 'none',
                    title: '更新购物车失败'
                })
            }
        })
    },

    emptyTrolley(list) {
        qcloud.request({
            url: config.service.deletePaid,
            login: true,
            method: 'DELETE',
            data: {
                list: list
            },
            success: result => {
                return
            },
            fail: err => {
                return err
            }
        })
    },

    onTapPay() {
        if (!this.data.trolleyAccount) return

        wx.showLoading({
            title: '结算中...',
        })

        let { trolleyCheckMap, trolleyList } = this.data
        let needToPayProductList = trolleyList.filter(product => {
            return !!trolleyCheckMap[product.id]
        })

        // 请求后台
        qcloud.request({
            url: config.service.addOrder,
            login: true,
            method: 'POST',
            data: {
                list: needToPayProductList
            },
            success: result => {
                wx.hideLoading()

                let data = result.data

                if (!data.code) {
                    wx.showToast({
                        title: '结算成功',
                    })
                    this.emptyTrolley(needToPayProductList)
                    this.getTrolley()
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: '结算失败',
                    })
                }
            },
            fail: err => {
                wx.hideLoading()
                console.log(err)
                wx.showToast({
                    icon: 'none',
                    title: '结算失败',
                })
            }
        })
    },

=======
>>>>>>> parent of 525efb2... 购物车中支付即消失
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // 同步授权状态
        this.setData({
            locationAuthType: app.data.locationAuthType
        })
        app.checkSession({
            success: ({ userInfo }) => {
                this.setData({
                    userInfo
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})