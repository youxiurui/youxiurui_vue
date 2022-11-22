<template>
    <section class="loginContainer">
      <div class="loginInner">
        <div class="login_header">
          <h2 class="login_logo">硅谷外卖</h2>
          <div class="login_header_title">
            <a href="javascript:;" :class="{on:LoginMode}" @click="LoginMode=true">短信登录</a>
            <a href="javascript:;" :class="{on:!LoginMode}" @click="LoginMode=false">密码登录</a>
          </div>
        </div>
        <div class="login_content">
          <form @submit.prevent="login">
            <div :class="{on:LoginMode}">
              <section class="login_message">
                <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
                <button 
                :disabled="!VerificationCode" 
                class="get_verification" 
                :class="{left_getphone:VerificationCode}"
                @click.prevent="getCode">
                {{countTimer?`已发送(${countTimer}s)`:'获取验证码'}}
                </button>
              </section>
              <section class="login_verification">
                <input type="text" maxlength="8" placeholder="验证码" v-model="code" @keyup.enter="enterLogin()">
              </section>
              <section class="login_hint">
                温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
                <a href="javascript:;">《用户服务协议》</a>
              </section>
            </div>
            <div :class="{on:!LoginMode}">
              <section>
                <section class="login_message">
                  <input type="tel" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
                </section>
                <section class="login_verification">
                  <input type="test" maxlength="8" placeholder="密码" v-if="pwdShow" v-model="pwd">
                  <input type="password" maxlength="8" placeholder="密码" v-else v-model="pwd">
                  <div class="switch_button off" @click="pwdShow=!pwdShow" :class="pwdShow?'on':'off'">
                    <div class="switch_circle" :class="{right:pwdShow}"></div>
                    <span class="switch_text">{{pwdShow?'abc':''}}</span>
                  </div>
                </section>
                <section class="login_message">
                  <input 
                  type="text" maxlength="11" 
                  placeholder="验证码" v-model="captcha"
                  @keyup.enter="enterLogin()"
                  >
                  <img class="get_verification" src="http://localhost:4000/captcha" ref="captcha" alt="captcha" @click="getCaptcha"> 
                </section>
              </section>
            </div>
            <button class="login_submit">登录</button>
          </form>
          <a href="javascript:;" class="about_us">关于我们</a>
        </div>
        <a href="javascript:" class="go_back" @click="$router.back()">
          <i class="iconfont icon-xiazai6"></i>
        </a>
      </div>

      <AlertTip :alertText="alertText" v-show="showAlert" @closeTip='closeTip'></AlertTip>
    </section>
</template>

<script>
import AlertTip from '../../components/AlertTip/AlertTip.vue'
import {reqSendCode,reqPwdLogin,reqSmsLogin} from '../../api/index'
export default {
  data(){
    return {
      LoginMode:true,
      countTimer:0,
      pwdShow:false,
      phone:"",
      code:'',
      name:'',
      pwd:'',
      captcha:'',
      alertText:'',
      showAlert:false,
    }
  },
  methods:{
    async getCode(){
      //如果当前没有倒计时
      if(!this.countTimer){
        //启动倒计时
          this.countTimer=30
          this.timerId=setInterval(()=>{
          this.countTimer--
          if(this.countTimer<=0){
            //停止计时
            clearInterval(this.timerId)
        }
      },1000)

      // let phone1=18723410371
      //发送ajax请求
     const result=await reqSendCode(this.phone)
      if(result.code===1){
        this.showAlert=true
        this.alertText=result.msg
        if(this.countTimer){
          this.countTimer=0
          clearInterval(this.timerId)
        }
      }
      }
   },
   async login(){ 
    let result
    if(this.LoginMode){
      const {phone,code}=this
      if(!phone){
        this.showAlert=true
        this.alertText='手机号不正确'
        return
      }else if(!/^\d{6}$/.test(code)){
        this.showAlert=true
        this.alertText='验证码不正确'
        this.captcha=''
        return
      }
      //发送ajax请求短信登录
      result=await reqSmsLogin({phone,code})
    }else{
      const {name,pwd,captcha}=this
      if(!name){
        this.showAlert=true
        this.alertText='用户不存在'
        return
      }else if(!pwd){
        this.showAlert=true
        this.alertText='密码不正确'
        return
      }else if(!captcha){
        this.showAlert=true
        this.alertText='验证码不正确'
        return
      }
       //发送ajax请求密码登录
      result=await reqPwdLogin({name,pwd,captcha})
    }
    if(this.countTimer){
          this.countTimer=0
          clearInterval(this.timerId)
    }
    //根据结果处理数据
    if(result.code===0){
      //将数据保存到vuex的state
        const user=result.data
        this.$store.dispatch('recordUser',user)
        //去个人中心界面
        this.$router.replace('/profile')
    }else{      
        const msg=result.msg
        this.showAlert=true
        this.alertText=msg
        this.getCaptcha()
    }
   },
   closeTip(){
    this.showAlert=false
    this.alertText=''
   },
   getCaptcha(){
    this.$refs.captcha.src='http://localhost:4000/captcha?time='+Date.now()
   },
   enterLogin(){
    this.login()
    this.captcha=''
   }
  },
  components: {
    AlertTip
  },
  computed:{
    VerificationCode(){
      return /^1\d{10}$/.test(this.phone)
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixins.styl'
.loginContainer
      width 100%
      height 100%
      background #fff
      .loginInner
        padding-top 60px
        width 80%
        margin 0 auto
        .login_header
          .login_logo
            font-size 40px
            font-weight bold
            color #02a774
            text-align center
          .login_header_title
            padding-top 40px
            text-align center
            >a
              color #333
              font-size 14px
              padding-bottom 4px
              &:first-child
                margin-right 40px
              &.on
                color #02a774
                font-weight 700
                border-bottom 2px solid #02a774
        .login_content
          >form
            >div
              display none
              &.on
                display block
              input
                width 100%
                height 100%
                padding-left 10px
                box-sizing border-box
                border 1px solid #ddd
                border-radius 4px
                outline 0
                font 400 14px Arial
                &:focus
                  border 1px solid #02a774
              .login_message
                position relative
                margin-top 16px
                height 48px
                font-size 14px
                background #fff
                .get_verification
                  position absolute
                  top 50%
                  right 10px
                  transform translateY(-50%)
                  border 0
                  color #ccc
                  font-size 14px
                  background transparent
                  &.left_getphone
                    color black
              .login_verification
                position relative
                margin-top 16px
                height 48px
                font-size 14px
                background #fff
                .switch_button
                  font-size 12px
                  border 1px solid #ddd
                  border-radius 8px
                  transition background-color .3s,border-color .3s
                  padding 0 6px
                  width 30px
                  height 16px
                  line-height 16px
                  color #fff
                  position absolute
                  top 50%
                  right 10px
                  transform translateY(-50%)
                  &.off
                    background #fff
                    .switch_text
                      float left
                      color #ddd
                  &.on
                    background #02a774
                  >.switch_circle
                    //transform translateX(27px)
                    position absolute
                    top -1px
                    left -1px
                    width 16px
                    height 16px
                    border 1px solid #ddd
                    border-radius 50%
                    background #fff
                    box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                    transition transform .3s
                    &.right
                      transform translateX(30px)
              .login_hint
                margin-top 12px
                color #999
                font-size 14px
                line-height 20px
                >a
                  color #02a774
            .login_submit
              display block
              width 100%
              height 42px
              margin-top 30px
              border-radius 4px
              background #4cd96f
              color #fff
              text-align center
              font-size 16px
              line-height 42px
              border 0
          .about_us
            display block
            font-size 12px
            margin-top 20px
            text-align center
            color #999
        .go_back
          position absolute
          top 5px
          left 5px
          width 30px
          height 30px
          >.iconfont
            font-size 20px
            color #999
</style>
