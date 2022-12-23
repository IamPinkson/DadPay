const request=require("request")
const md5 = require('md5-node')
class Telebot{
  constructor(body){
    this.body=body
    this.Markup={
      get:{
        inline_keyboard:[]
      },
      add:(arrs)=>{
        let line=[]
        for (const ar of arrs) {
          if(ar.url){
            line.push({
              text:ar.text,
              url:ar.url
            })
          }else if(ar.data){
            line.push({
              text:ar.text,
              callback_data:JSON.stringify(ar.data)
            })
          }
        }
        this.Markup.get.inline_keyboard.push(line)
      }
    }
    if(this.body.message){
      this.method='message'
      this.from=this.body.message.from
      this.chat=this.body.message.chat
      this.dialog=this.chat.type//private group
      this.message_id=this.body.message.message_id
      if(this.body.message.reply_to_message){
          this.reply_to_message=this.body.message.reply_to_message
      }
      if(this.body.message.text){
          this.text=this.body.message.text
          this.type='text'
      }else if(this.body.message.audio){
          this.audio=this.body.message.audio
          this.type='audio'
      }else if(this.body.message.document){
          this.document=this.body.message.document
          this.type='document'
      }else if(this.body.message.animation){
          this.animation=this.body.message.animation
          this.type='animation'
      }else if(this.body.message.photo){
          this.photo=this.body.message.photo
          this.type='photo'
          if(this.body.message.caption){
          this.caption=this.body.message.caption
          }
      }else if(this.body.message.sticker){
          this.sticker=this.body.message.sticker
          this.type='sticker'
      }else if(this.body.message.video){
          this.video=this.body.message.video
          this.type='video'
      }else if(this.body.message.voice){
          this.voice=this.body.message.voice
          this.type='voice'
      }else if(this.body.message.new_chat_members){
          this.new_chat_members=this.body.message.new_chat_members
          this.type="new_chat_members"
      }else if(this.body.message.left_chat_member){
          this.left_chat_member=this.body.message.left_chat_member
          this.type="left_chat_member"
      }
    }else if(this.body.callback_query){
      this.method='callback_query'
      this.callback_query_id=this.body.callback_query.id
      this.from=this.body.callback_query.from
      this.chat=this.body.callback_query.message.chat
      this.dialog=this.chat.type//private group
      this.message_id=this.body.callback_query.message.message_id
      this.data=this.body.callback_query.data
      this.type='data'
    }else if(this.body.my_chat_member){
      this.method="my_chat_member"
      this.type="my_chat_member"
      this.from=this.body.my_chat_member.from
      this.chat=this.body.my_chat_member.chat
      this.my_chat_member=this.body.my_chat_member.new_chat_member
    }else if(this.body.chat_join_request){
      this.chat_join_request=this.body.chat_join_request
    }
    console.log(JSON.stringify(this.body))
  }
  is(cmds){
    if(this.text){
    for (const cmd of cmds) {
        if(cmd==this.text){
        return true
        }
    }
    }else if(this.data){
    for (const cmd of cmds) {
        if(cmd==this.data){
        return true
        }
    }
    }
    return false
  }
  has(cmds){
    if(this.text){
    for (const cmd of cmds) {
        if(this.text.indexOf(cmd)!=-1){
        return true
        }
    }
    }else if(this.data){
    for (const cmd of cmds) {
        if(this.data.indexOf(cmd)!=-1){
        return true
        }
    }
    }
    return false
  }
  // 基础
  reply(form){
    return new Promise((resolve, reject) => {
      if(!form){
        form={}
      }
      if(form.text){
        form.method="sendMessage"
      }else if(form.photo){
        form.method="sendPhoto"
      }else if(form.video){
        form.method="sendVideo"
      }
      form.chat_id=this.chat.id
      form.reply_to_message_id=this.message_id
      form.allow_sending_without_reply=false
      form.parse_mode="Markdown"
      form.reply_markup=this.Markup.get
      request({
        url:"https://api.telegram.org/bot"+process.env.TOKEN+"/",
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        json:true,
        body:form
      },(err,res,body)=>{
        if(body.ok){
          this.message_id=body.result.message_id
        }
        console.log("REPLY",JSON.stringify(body))
        resolve(body)
      })
    })
  }
  send(form){
    return new Promise((resolve, reject) => {
      if(!form){
        form={}
      }
      if(form.text){
        form.method="sendMessage"
      }else if(form.photo){
        form.method="sendPhoto"
      }else if(form.video){
        form.method="sendVideo"
      }
      if(!form.chat_id){
        form.chat_id=this.chat.id
      }
      form.parse_mode="Markdown"
      form.reply_markup=this.Markup.get
      request({
        url:"https://api.telegram.org/bot"+process.env.TOKEN+"/",
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        json:true,
        body:form
        },(err,res,body)=>{
          if(body.ok){
            this.message_id=body.result.message_id
          }
          console.log("SEND",JSON.stringify(body))
          resolve(body)
        })
    })
  }
  edit(form){
    return new Promise((resolve, reject) => {
      if(!form){
        form={}
      }
      form.method="editMessageText"
      form.chat_id=this.chat.id
      form.message_id=this.message_id
      form.parse_mode="Markdown"
      form.reply_markup=this.Markup.get
      request({
        url:"https://api.telegram.org/bot"+process.env.TOKEN+"/",
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        json:true,
        body:form
        },(err,res,body)=>{
          if(body.ok){
            this.message_id=body.result.message_id
          }
          console.log("EDIT",JSON.stringify(body))
          resolve(body)
        })
    })
  }
  delete(form){
    return new Promise((resolve, reject) => {
      if(!form){
        form={}
      }
      form.method="deleteMessage"
      form.chat_id=this.chat.id
      if(!form.message_id){
        form.message_id=this.message_id
      }
      request({
        url:"https://api.telegram.org/bot"+process.env.TOKEN+"/",
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(form)
        },(err,res,body)=>{
          console.log("deleteMessage",body)
        })
    })
  }
  answer(form){
    return new Promise((resolve, reject) => {
      if(!form){
        form={}
      }
      if(form.text){
        form.show_alert=true
      }
      form.method="answerCallbackQuery"
      form.callback_query_id=this.callback_query_id
      request({
        url:"https://api.telegram.org/bot"+process.env.TOKEN+"/",
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(form)
        },(err,res,body)=>{
          console.log("answerCallbackQuery",body)
        })
    })
  }
  action(form){
    return new Promise((resolve, reject) => {
      if(!form){
        form={}
      }
      form.chat_id=this.chat.id
      form.method="sendChatAction"
      request({
        url:"https://api.telegram.org/bot"+process.env.TOKEN+"/",
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(form)
        },(err,res,body)=>{
          console.log("sendChatAction",body)
        })
    })
  }
  // 高级
  leaveChat(form){
    return new Promise((resolve, reject) => {
      if(!form){
        form={
          chat_id:this.chat.id
        }
      }
      form.method="leaveChat"
      request({
        url:"https://api.telegram.org/bot"+process.env.TOKEN+"/",
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(form)
        },(err,res,body)=>{
          console.log("leaveChat",body)
        })
    })
  }
  createChatInviteLink(form){
    return new Promise((resolve, reject) => {
      if(!form){
        form={
          chat_id:this.chat.id
        }
      }
      form.method="createChatInviteLink"
      form.member_limit=1
      request({
        url:"https://api.telegram.org/bot"+process.env.TOKEN+"/",
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        json:true,
        body:form
        },(err,res,body)=>{
          if(body.ok){
            resolve(body.result.invite_link)
          }else{
            resolve("抱歉🙁，生成链接失败")
          }       
          console.log("createChatInviteLink",body)
        })
    })
  }
  approveChatJoinRequest(form){
    return new Promise((resolve, reject) => {
      if(!form){
        form={
          chat_id:this.chat.id
        }
      }
      form.method="approveChatJoinRequest"
      request({
        url:"https://api.telegram.org/bot"+process.env.TOKEN+"/",
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(form)
        },(err,res,body)=>{
          console.log("approveChatJoinRequest",body)
        })
    })
  }
  declineChatJoinRequest(form){
    return new Promise((resolve, reject) => {
      if(!form){
        form={
          chat_id:this.chat.id
        }
      }
      form.method="declineChatJoinRequest"
      request({
        url:"https://api.telegram.org/bot"+process.env.TOKEN+"/",
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(form)
        },(err,res,body)=>{
          console.log("declineChatJoinRequest",body)
        })
    })
  }
  getChatMember(form){
    return new Promise((resolve, reject) => {
      if(!form){
        form={
          chat_id:this.chat.id
        }
      }
      form.method="getChatMember"
      request({
        url:"https://api.telegram.org/bot"+process.env.TOKEN+"/",
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(form)
        },(err,res,body)=>{
          console.log("getChatMember",body)
        })
    })
  }
  banChatMember(form){
    return new Promise((resolve, reject) => {
      if(!form){
        form={
          chat_id:this.chat.id
        }
      }
      form.method="banChatMember"
      form.until_date=0
      form.revoke_messages=true
      request({
        url:"https://api.telegram.org/bot"+process.env.TOKEN+"/",
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(form)
        },(err,res,body)=>{
          console.log("banChatMember",body)
        })
    })
  }
  unbanChatMember(form){
    return new Promise((resolve, reject) => {
      if(!form){
        form={
          chat_id:this.chat.id
        }
      }
      form.method="unbanChatMember"
      form.only_if_banned=true
      request({
        url:"https://api.telegram.org/bot"+process.env.TOKEN+"/",
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(form)
        },(err,res,body)=>{
          console.log("unbanChatMember",body)
        })
    })
  }
  setChatPermissions(form){
    return new Promise((resolve, reject) => {
      if(!form){
        form={
          chat_id:this.chat.id
        }
      }
      form.method="setChatPermissions"
      request({
        url:"https://api.telegram.org/bot"+process.env.TOKEN+"/",
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(form)
        },(err,res,body)=>{
          console.log("setChatPermissions",body)
        })
    })
  }
  approveChatJoinRequest(form){
    return new Promise((resolve, reject) => {
      if(!form){
        form={
          chat_id:this.chat.id
        }
      }
      form.method="approveChatJoinRequest"
      request({
        url:"https://api.telegram.org/bot"+process.env.TOKEN+"/",
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(form)
        },(err,res,body)=>{
          console.log("approveChatJoinRequest",body)
        })
    })
  }
}
module.exports=Telebot