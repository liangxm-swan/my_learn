<template>
    <div id="main">
        <div class="content page-order-checkout checkout">
            <div class="js-checkout-address-box">
                <div class="gray-box clear">
                    <div class="title columns-title pre-title">
                        <h2>收货信息</h2>
                    </div>
                    <div class="box-inner js-checkout-address-panel ">
                        <div class="address-common-table js-multiple-address-panel">
                            <ul class="address-item-list clear js-address-item-list">
                                <li class="js-choose-address" 
                                :class="{'selected-address-item':receiveIndex == index}" 
                                v-for="(receive,index) in receiveInfo" 
                                :key="index"
                                @click="chooseReceive(index)"
                                >
                                    <div class="address-item">
                                        <div class="name-section">  {{receive.name}}  </div>
                                        <div class="mobile-section">{{receive.phone}}</div>
                                        <div class="detail-section"> {{receive.province}} {{receive.city}} {{receive.county}}<br>{{receive.add}}</div>
                                    </div>
                                    <div class="operation-section">
                                        <span class="update-btn js-edit-address">修改</span>
                                        <span class="delete-btn js-delete-address">删除</span>
                                    </div>
                                </li>
                                <li class="add-address-item js-add-address" @click="showPop">
                                    <p>使用新地址</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="gray-box">
                <div class="title">
                    <h2>发票信息</h2>
                </div>
                <div class="box-inner invoice-box js-invoice-box"> 
                    <p class="invoice-detail"> 发票类型：电子发票 </p> 
                    <div class="invoice-detail"> 发票抬头： 
                        <div class="radio-box"> 
                            <label> 
                                <input type="radio" class="hide"> 
                                <span class="blue-radio" 
                                :class="{'blue-radio-on':invoice.prosonal}"
                                @click="checkedInvoice(true)"
                                ><a></a></span>  个人
                            </label> 
                            <label> 
                                <input type="radio" class="hide"> 
                                <span class="blue-radio" 
                                :class="{'blue-radio-on':!invoice.prosonal}"
                                @click="checkedInvoice(false)"
                                ><a></a></span>  单位
                            </label> 
                        </div> 
                        <div class="module-form-row form-item fn-hide js-invoice-title" v-if="!invoice.prosonal"> 
                            <div class="module-form-item-wrapper no-icon small-item"> 
                                <i v-if="!invoice.name">请填写公司发票抬头</i> 
                                <input type="text" class="js-verify" v-model="invoice.name" > 
                                <div v-if="!invoice.name" class="verify-error">必填</div>
                            </div> 
                        </div> 
                    </div> 
                    <p class="invoice-detail">发票内容：购买商品明细</p> <p class="invoice-label"> 电子发票是税务局认可的有效收付款凭证，可作为售后服务凭据。电子发票打印后可以用于企业报销。 </p>
                </div>
            </div>
            <div class="gray-box">
                <div class="title pre-title">
                    <h2>购物清单</h2> 
                </div>
                <div class="box-inner ui-goods-cart">
                    <div class="gray-sub-title cart-table-title"> 
                        <span class="name">商品名称</span> 
                        <span class="subtotal">小计</span> 
                        <span class="num">数量</span> 
                        <span class="price">单价</span> 
                    </div>
                    <div class="cart-table">
                        <div class="cart-group js-cart-group">
                            <div class="cart-items" v-for="(item,index) in renderData" :key="index">
                                <div class="items-thumb">  
                                    <a href="javascript:;" target="_blank"><img :src="item.ali_image+'?x-oss-process=image/resize,w_80/quality,Q_100/format,webp'"></a>  
                                </div>
                                <div class="name hide-row">
                                    <div class="name-cell"> 
                                        <a href="javascript:;" :title="item.title +'（'+ item.spec_json.show_name +'）'" target="_blank">{{item.title}}（{{item.spec_json.show_name}}）</a>
                                    </div>
                                </div>
                                <div class="subtotal">
                                    <div class="subtotal-cell">  ¥ {{item.price * item.count}}.00  </div> 
                                </div>
                                <div class="goods-num">{{item.count}}</div>
                                <div class="price">¥ {{item.price}}.00</div>
                            </div>
                            
                        </div>
                    </div>
                    
                </div>
                <div class="box-inner"> 
                    <div class="order-discount-line"> 
                        <p> 商品总计： <span>¥ {{checkedPrice}}.00</span> </p> 
                        <p> 运费： <span>+ ¥ {{freight}}.00</span> </p>  
                        <p class="discount-line js-discount-cash"> <em>现金券</em>： <span> - 0 </span> </p>  
                    </div> 
                </div>
                <div class="box-inner"> 
                    <div class="last-payment clear"> 
                        <span class="jianguo-blue-main-btn big-main-btn payment-blue-bt fn-right js-checkout" @click="submitOrderHandle"> <a>提交订单</a> </span> <span class="prices fn-right">应付金额： <em>¥ {{totalPrice}}.00</em></span> 
                    </div> 
                </div>
            </div>
        </div>
        <address-pop 
        v-if="popShow"
        @close="closePop"
        ></address-pop>
    </div>
</template>
<script>
    import addressPop from '@/components/address-pop'
    import {mapGetters, mapState} from 'vuex'
    export default {
        data () {
            return {
                receiveIndex: 0,
                popShow: false,
                invoice: {
                    prosonal: true,
                    name: ''
                },
                from: ''
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm=>{
                vm.from = from.name
            })
        },
        created () {
            this.receiveInfo.forEach((receive, index) => {
                if(receive.default){
                    this.receiveIndex = index
                    return
                }
            });
        },
        components: {
            addressPop
        },
        computed: {
            ...mapState(['receiveInfo','buyData']),
            ...mapGetters(['checkedGoods','checkedPrice']),
            renderData(){
                let renderData = []
                if(this.from == 'Item'){
                    renderData = this.buyData
                }else {
                    renderData = this.checkedGoods
                }
                return renderData
            },
            freight(){
                let freight = 8
                if(this.from == 'Item'){
                    if((parseFloat(this.renderData[0].price) * Number(this.renderData[0].count)) > 80){
                        freight = 0
                    }
                }else{
                    if(this.checkedPrice > 80){
                        freight = 0
                    }
                }
                return freight
            },
            totalPrice(){
                let totalPrice = 0
                if(this.from == 'Item'){
                    if((parseFloat(this.renderData[0].price) * Number(this.renderData[0].count))){
                        totalPrice = (parseFloat(this.renderData[0].price) * Number(this.renderData[0].count)) + this.freight
                    }else{
                        totalPrice = parseFloat(this.renderData[0].price) * Number(this.renderData[0].count)
                    }
                }else{
                    if(this.checkedPrice){
                        totalPrice = this.checkedPrice + this.freight
                    }
                }
                return totalPrice
            }
        },
        methods: {
            chooseReceive(index){
                this.receiveIndex = index
            },
            closePop(){
                this.popShow = false
                this.receiveInfo.forEach((receive, index) => {
                    if(receive.default){
                        this.receiveIndex = index
                        return
                    }
                })
            },
            showPop(){
                this.popShow = true
            },
            checkedInvoice(boolean){
                this.invoice.prosonal = boolean
            },
            submitOrderHandle(){
                if(!this.invoice.prosonal && !this.invoice.name) return
                let receiveInfo = this.receiveInfo[this.receiveIndex]
                if(this.invoice.prosonal){
                    this.invoice.name = '个人'
                }
                let iDate = new Date()
                let year = iDate.getFullYear()
                let month = iDate.getMonth()
                let day = iDate.getDate()
                if(month >=0 && month<=9){
                    month = '0' + (month+1)
                }
                if(day>=1 && day<=9){
                    day = '0' + day
                }

                let data = {
                    orderId: iDate.getTime(),
                    goodsData: this.renderData,
                    price: this.checkedPrice,
                    freight: this.freight,
                    invoiceName: this.invoice.name,
                    iDate: year + '-' + month + '-' + day,
                    receiveInfo: receiveInfo,
                    isPay: false
                }
                
                console.log(this.from)

                if(this.from == 'Cart'){
                    this.$store.commit('submitOrder',data)
                    
                }
                
                this.$router.push({name: 'Payment', query:{orderId: data.orderId}})
            }
        }
    }
</script>
<style>
.content{
  clear: both;
    width: 1220px;
    min-height: 600px;
    padding: 0 0 25px;
    margin: 0 auto;
}
.page-order-checkout{
  padding-top: 40px;
}
.checkout .gray-box{
  overflow: hidden;
    border: 1px solid #D1D1D1;
    border-color: rgba(0,0,0,.14);
    border-radius: 8px;
    box-shadow: 0 3px 8px -6px rgba(0,0,0,.1);
}
.checkout .gray-box, .gray-btn-menu-on:hover{
  background: #FFF;
}
.checkout .gray-box{
  margin-bottom: 30px;
}
.checkout .gray-box .title{
  height: 60px;
    padding: 0 10px 0 28px;
    background: #F5F5F5;
    background: linear-gradient(#FFF,#F5F5F5);
    border-bottom: 1px solid #DCDCDC;
    border-radius: 10px 10px 0 0;
    box-shadow: 0 1px 7px rgba(0,0,0,.06);
    line-height: 60px;
    color: #646464;
}
.checkout .gray-box .pre-title{
    position: relative;
    z-index: 2;
}
.checkout .gray-box .title h2{
  font-size: 18px;
    font-weight: 400;
    color: #626262;
}
.checkout .gray-box .columns-title h2{
  float: left; 
}
.checkout .address-common-table .address-item-list{
  padding: 30px 13px 0;
}
.checkout .address-common-table .address-item-list li{
    position: relative;
    overflow: hidden;
    float: left;
    width: 276px;
    height: 158px;
    margin: 0 0 30px 16px;
    border: 1px solid #E5E5E5;
    border-radius: 3px;
    background: #FAFAFA;
    line-height: 14px;
    text-align: left;
    word-wrap: break-word;
    word-break: normal;
    color: #626262;
    cursor: pointer;
    user-select: none;
}
.checkout .address-common-table .address-item-list li.selected-address-item{
  background: #FFF;
    border-color: #6A8FE5;
}
.checkout .address-common-table .address-item-list .address-item{
  padding: 19px 14px 0 19px;
}
.checkout .address-common-table .name-section{
  height: 16px;
    padding-right: 20px;
    line-height: 16px;
    font-size: 16px;
    color: #666;
}
.checkout .address-common-table .mobile-section{
  height: 14px;
    padding-top: 17px;
    line-height: 14px;
    color: #999;
}
.checkout .address-common-table .detail-section{
  padding-top: 6px;
    line-height: 24px;
    color: #999;
}
.checkout .address-common-table .address-item-list li.selected-address-item:after{
  content: '√';
    display: block;
    position: absolute;
    right: 17px;
    top: 19px;
    font-size: 24px;
    color: #6A8FE5;
}
.checkout .address-common-table .operation-section{
  visibility: hidden;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 28px;
    background: #E1E1E1;
    border-top: 1px solid #E1E1E1;
    transform: translate(0,29px);
}
.checkout .address-common-table .operation-section .delete-btn,
.checkout .address-common-table .operation-section .update-btn{
  float: left;
    display: block;
    height: 28px;
    background: #FFF;
    text-align: center;
    line-height: 28px;
    font-size: 12px;
    transition: background .15s ease;
}
.checkout .address-common-table .operation-section .update-btn{
  width: 137px;
}
.checkout .address-common-table .operation-section .delete-btn{
  float: right;
    width: 138px;
}
.checkout .address-common-table .add-address-item::before{
  content: '+';
    display: block;
    position: absolute;
    left: 50%;
    top: 54px;
    height: 24px;
    margin-left: -10px;
    line-height: 24px;
    text-align: center;
    font-size: 24px;
    color: #626262;
}
.checkout .address-common-table .add-address-item p{
  height: 14px;
    padding-top: 85px;
    line-height: 14px;
    text-align: center;
    color: #999;
}
.checkout .address-common-table .address-item-list li:hover{
  background: #F2F2F2;
}
.checkout .invoice-box{
  padding: 22px 29px 29px 28px;
}
.checkout .invoice-box .invoice-detail{
  position: relative;
    height: 36px;
    line-height: 36px;
    color: #666;
}
.checkout .invoice-box .radio-box{
  position: absolute;
    left: 65px;
    top: 0;
    padding: 0;
    margin: 0;
}
.checkout .invoice-box .radio-box>label{
  margin-right: 5px;
}
.checkout .blue-radio{
  overflow: hidden;
    display: inline-block;
    position: relative;
    top: 2px;
    width: 10px;
    height: 10px;
    padding: 4px;
    background: #F9F9F9;
    background: linear-gradient(#F5F6F6,#FDFDFD);
    border: 1px solid #E6E6E6;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0,0,0,.05) inset;
    cursor: pointer;
}
.checkout .invoice-box .blue-radio{
  top: 4px;
    margin: 0 3px 0 6px;
}
.checkout .blue-radio-on a, .choose-radio-on .blue-radio a{
  overflow: hidden;
    display: block;
    width: 8px;
    height: 8px;
    background: #6C94F3;
    background: linear-gradient(#749AF4,#668EF2);
    border: 1px solid #5D81D9;
    border-radius: 10px;
    box-shadow: 0 1px 2px rgba(0,0,0,.2);
}
.checkout .module-form-row .small-item{
  width: 180px;
    height: 36px;
    border-radius: 4px;
    line-height: 36px;
    font-size: 14px;
}
.checkout .invoice-box .module-form-row{
    position: absolute;
    left: 215px;
    top: -1px;
    padding: 0;
    margin: 0;
}
.checkout .module-form-item-wrapper i{
  position: absolute;
    left: 15px;
    top: 0;
    font-style: normal;
    font-size: 16px;
    color: #bebebe;
}
.checkout .module-form-row .small-item i{
  font-size: 14px;
}
.checkout .invoice-box .module-form-item-wrapper{
  width: 338px;
    height: 34px;
    line-height: 34px;
}
.checkout .module-form-item-wrapper{
  display: block;
    position: relative;
    width: 372px;
    height: 46px;
    background-color: #FFF;
    box-shadow: 0 3px 5px -4px rgba(0,0,0,.4) inset, -1px 0 3px -2px rgba(0,0,0,.1) inset;
    border: 1px solid #CCC;
    border-radius: 6px;
    line-height: 46px;
    font-size: 16px;
    opacity: 1;
    transition: opacity .3s ease-in;
}
.checkout .invoice-box .module-form-item-wrapper i{
  left: 11px;
}
.checkout .module-form-item-wrapper input{
  position: relative;
    z-index: 3;
    width: 290px;
    padding: 0 13px 0 15px;
    background: 0 0;
    border: none;
    font-size: 16px;
    color: #333;
}
.checkout .module-form-row .small-item input{
  padding-left: 15px;
    margin-top: 8px;
    width: 137px;
    font-size: 14px;
}
.checkout .invoice-box .module-form-item-wrapper input{
  width: 310px;
    padding-left: 11px;
}
.checkout .invoice-box .invoice-label{
  position: relative;
    padding-top: 25px;
    margin-top: 11px;
    border-top: 1px solid #E5E5E5;
    line-height: 12px;
    text-indent: 10px;
    font-size: 12px;
    color: #999;
}
.checkout .gray-box .gray-sub-title{
  height: 38px;
    padding: 0 24px;
    background: #EEE;
    border-top: 1px solid #DBDBDB;
    border-bottom: 1px solid #DBDBDB;
    line-height: 38px;
    font-size: 12px;
    color: #666;
}
.checkout .ui-goods-cart .cart-table-title{
  padding: 0 0 0 29px;
    border-top: none;
    font-size: 12px;
}
.checkout .ui-goods-cart .cart-table-title span{
  float: right;
    text-align: center;
}
.checkout .ui-goods-cart .cart-table-title .name{
  float: left;
    text-align: left;
}
.ui-goods-cart .cart-table-title .num, .ui-goods-cart .cart-table-title .operation, .ui-goods-cart .cart-table-title .price, .ui-goods-cart .cart-table-title .subtotal{
  width: 130px;
    padding-right: 29px;
    text-align: right;
}
.ui-goods-cart .cart-table-title .num{
  width: 132px;
}
.ui-goods-cart .cart-table-title .price{
  width: 120px;
}
.ui-goods-cart .cart-group, .ui-goods-cart .cart-items{
  border-top: 1px solid #EBEBEB;
}
.ui-goods-cart .cart-items{
  position: relative;
    height: 110px;
    padding-left: 29px;
    color: #666;
}
.ui-goods-cart .cart-group:first-child, .ui-goods-cart .cart-items:first-child{
  border-top: none;
}
.ui-goods-cart .cart-items .items-choose, .ui-goods-cart .cart-items .items-thumb, .ui-goods-cart .cart-items .name{
  float: left;
}
.ui-goods-cart .cart-items .items-thumb, .ui-goods-cart .cart-items .items-thumb img{
  width: 78px;
    height: 78px;
    border-radius: 4px;
}
.ui-goods-cart .cart-items .items-thumb{
  margin-top: 15px;
    border: 1px solid #EBEBEB;
}
.ui-goods-cart .cart-items .name{
  display: table;
    width: 420px;
    height: 100%;
    margin-left: 30px;
    line-height: 24px;
}
.ui-goods-cart .cart-items .name-cell{
  display: table-cell;
    vertical-align: middle;
}
.ui-goods-cart .cart-items .name a{
  color: #333;
}
.ui-goods-cart .cart-items .subtotal{
  float: right;
    display: table;
    width: 129px;
    height: 100%;
    padding-right: 29px;
    text-align: right;
    line-height: 24px;
    color: #333;
}
.ui-goods-cart .cart-items .subtotal-cell{
  display: table-cell;
    vertical-align: middle;
}
.ui-goods-cart .cart-items .goods-num, .ui-goods-cart .cart-items .operation, .ui-goods-cart .cart-items .price, .ui-goods-cart .cart-items .select{
  overflow: hidden;
    float: right;
    width: 129px;
    padding-right: 29px;
    line-height: 110px;
    text-align: right;
    color: #333;
}
.ui-goods-cart .cart-items .goods-num{
  width: 64px;
    padding: 0 9px 0 90px;
    text-align: center;
}
.ui-goods-cart .cart-items .price{
  width: 120px;
}
.page-order-checkout .order-discount-line{
  padding: 21px 30px;
    border-top: 1px solid #EBEBEB;
    line-height: 30px;
    text-align: right;
}
.page-order-checkout .order-discount-line span{
  float: right;
    width: 157px;
}
.page-order-checkout .last-payment{
  padding: 22px 29px 19px 30px;
    background: linear-gradient(#FCFCFC,#F5F5F5);
    border-top: 1px solid #DADADA;
    box-shadow: -3px 0 8px rgba(0,0,0,.04);
}
.blue-main-btn, .gray-main-btn, .jianguo-blue-main-btn{
  display: block;
    padding: 1px;
    margin: 0 auto;
    border-radius: 6px;
    background: #015e94;
    background: linear-gradient(#5598c9,#2a6da2);
    text-align: center;
    text-shadow: rgba(255,255,255,.496094) 0 1px 0;
    font-family: 'Microsoft Yahei','微软雅黑','PingFang SC',sans-serif;
    cursor: pointer;
    -webkit-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
}
.jianguo-blue-main-btn{
  background: #6383C6;
    background: linear-gradient(#6383C6,#4262AF);
    box-shadow: none;
}
.checkout .big-main-btn{
  height: 46px;
}
.page-order-checkout .payment-blue-bt, .page-order-checkout .payment-blue-bt a{
    width: 136px;
    font-size: 16px;
}
.blue-main-btn a, .gray-main-btn a, .jianguo-blue-main-btn a{
  display: block;
    padding: 2px 0;
    border-radius: 6px;
}
.jianguo-blue-main-btn a{
  background: linear-gradient(#6F97E5,#527ED9);
    box-shadow: inset 0 1px 2px #7EA1E8;
    text-shadow: 0 -1px 0 #4F70B3;
    color: #FFF;
    transition: all .3s ease;
}
.checkout .big-main-btn a{
  height: 42px;
  line-height: 42px;
  width: 136px;
  font-size: 16px;
}
.jianguo-blue-main-btn:hover a{
  box-shadow: inset 0 1px 1px #7696DE, inset 0 0 2px #627DCA, inset 0 -2px 3px #5A77C7, inset 0 0 100px rgba(48,77,147,.4);
}
.page-order-checkout .last-payment .prices{
  padding: 0 40px;
    line-height: 50px;
    font-size: 14px;
}
.page-order-checkout .last-payment .prices em{
  display: inline-block;
    position: relative;
    top: 3px;
    margin-top: -4px;
    font-size: 24px;
    color: #D44D44;
}
.verify-error {
  display: block;
  position: absolute;
  right: 6px;
  top: 4px;
  z-index: 5;
  padding: 0 9px;
  border-radius: 5px;
  line-height: 26px;
  font-size: 12px;
  font-weight: 400;
  color: #fff;
  background: #E66157;
  opacity: 1;
}
</style>
