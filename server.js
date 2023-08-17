const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const { body } = require('koa/lib/response')
const { Sequelize, DataTypes } = require('sequelize')
const ejs = require('ejs');
const fs = require('fs');

const app = new Koa()

////openai configuration
const { Configuration, OpenAIApi } = require('openai');
const express = require('express');
const bodyParser_apt = require('body-parser');
const cors = require('cors');

const configuration = new Configuration({
    organization: "org-11snTl0r9w18PpdRfpFGW5gn",
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);
const gptConnection = express();
const port = 3001;
gptConnection.use(bodyParser_apt.json());
gptConnection.use(cors());
gptConnection.post("https://fast-escarpment-98746-31874c6ce605.herokuapp.com/ask-gpt-recommendation", async (req, res) => {
    const { message, ai_language, ai_extraversion, familiarity, features_r_value } = req.body;
    const { familiarity_value, familiarity_checked } = familiarity;
    var familiarity_value_update = familiarity_value
    if (!familiarity_checked) {
        familiarity_value_update = "I don't want tell you";
    }
    const { humor_r_value, playful_r_value, respectful_r_value, serious_r_value, offensive_r_value } = features_r_value
    var content_gpt = `Given the characteristics of the chat persona described below, how would you respond to the message: '${message}' in the following styles.
    AI extraversion: ${ai_extraversion}. Familiarity level with the friend: ${familiarity_value_update} from 1 to 5.
    Emotional style (from 1 (low) to 5 (high)):
    1. Humor (${humor_r_value}).
    2. Playful (${playful_r_value}).
    3. Respectful (${respectful_r_value}).
    4. Serious (${serious_r_value}).
    5. Offensive (${offensive_r_value})。
    Please reply each emotional style in one concise and clear sentence included in "", and reply use ${ai_language}`;

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "user", content: content_gpt },
        ]
    });

    res.json({
        completion: completion.data.choices[0].message
    })
})
gptConnection.post("https://fast-escarpment-98746-31874c6ce605.herokuapp.com/ask-gpt-polishing", async (req, res) => {

    const { message, ai_language, ai_extraversion, familiarity, features_p_value } = req.body;
    console.log(req.body)
    const { familiarity_value, familiarity_checked } = familiarity;
    var familiarity_value_update = familiarity_value
    if (!familiarity_checked) {
        familiarity_value_update = "I don't want tell you";
    }
    const { humor_p_value, playful_p_value, respectful_p_value, serious_p_value, offensive_p_value } = features_p_value
    var content_gpt = `Given the characteristics of the chat persona described below, how would you polish the message: '${message}' in the following styles.
    AI extraversion: ${ai_extraversion}. Familiarity level with the friend: ${familiarity_value_update} from 1 to 5.
    Emotional style (from 1 (low) to 5 (high)):
    1. Humor (${humor_p_value}).
    2. Playful (${playful_p_value}).
    3. Respectful (${respectful_p_value}).
    4. Serious (${serious_p_value}).
    5. Offensive (${offensive_p_value})。
    Please reply each emotional style in one concise and clear sentence included in "", and reply use ${ai_language}`;

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "user", content: content_gpt },
        ]
    });

    res.json({
        completion: completion.data.choices[0].message
    })
})
gptConnection.listen(port, () => {
    console.log(`gptConnection listening at https://fast-escarpment-98746-31874c6ce605.herokuapp.com:${port}`);
})
///////// server listen
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

///////// 

app.use(bodyParser())

app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*')

    ctx.set('Access-Control-Allow-Headers', 'Content-Type')

    if (ctx.method === 'OPTIONS') {
        ctx.body = 200
    } else {
        await next()
    }
})

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
})

const User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
})

User.sync()

const Message = sequelize.define('Message', {
    username: DataTypes.STRING,
    friendname: DataTypes.STRING,
    message: DataTypes.STRING
})
Message.sync()

const Friend = sequelize.define('Friend', {
    username: DataTypes.STRING,
    friendlist: DataTypes.STRING,
    targetusername: DataTypes.STRING,
})
Friend.sync()

const Chatstyle = sequelize.define('Chatstyle', {
    username: DataTypes.STRING,
    friendname: DataTypes.STRING,
    ailanguage: DataTypes.STRING,
    aiextroversion: DataTypes.STRING,

    familiarity_checked: DataTypes.BOOLEAN,
    familiarity_value: DataTypes.INTEGER,

    humor_r_checked: DataTypes.BOOLEAN,
    playful_r_checked: DataTypes.BOOLEAN,
    respectful_r_checked: DataTypes.BOOLEAN,
    serious_r_checked: DataTypes.BOOLEAN,
    offensive_r_checked: DataTypes.BOOLEAN,

    humor_r_value: DataTypes.INTEGER,
    playful_r_value: DataTypes.INTEGER,
    respectful_r_value: DataTypes.INTEGER,
    serious_r_value: DataTypes.INTEGER,
    offensive_r_value: DataTypes.INTEGER,

    humor_p_checked: DataTypes.BOOLEAN,
    playful_p_checked: DataTypes.BOOLEAN,
    respectful_p_checked: DataTypes.BOOLEAN,
    serious_p_checked: DataTypes.BOOLEAN,
    offensive_p_checked: DataTypes.BOOLEAN,

    humor_p_value: DataTypes.INTEGER,
    playful_p_value: DataTypes.INTEGER,
    respectful_p_value: DataTypes.INTEGER,
    serious_p_value: DataTypes.INTEGER,
    offensive_p_value: DataTypes.INTEGER
})
Chatstyle.sync()

app.use(async ctx => {
    if(ctx.url === 'https://fast-escarpment-98746-31874c6ce605.herokuapp.com/find-friends' && ctx.method === 'POST'){
        const { username } = ctx.request.body
        const result = await User.findOne({
            where: {
                username: username
            }
        })
        console.log('findfreinds'+result)
        if(result){
            ctx.body = { result }
        }else{
            ctx.body = { result: null}
        }
    }
    if(ctx.url === 'https://fast-escarpment-98746-31874c6ce605.herokuapp.com/save-friendList' && ctx.method === 'POST'){
        const {username, friendlist, targetusername} = ctx.request.body
        const result = await Friend.findOne({
            where: {
                username: username,
            }
        })
        console.log('result: '+result)
        if(result){
            Friend.update(
                {
                    friendlist: friendlist,
                    targetusername: targetusername
                },
                {
                    where:{
                        username:username
                    }
                }
            ).then(result=>{
                console.log(result[0]+' updated')
            }).catch(err=>{
                console.log('err:',err)
            })
        }else{
            await Friend.create({ username, friendlist, targetusername})
            
            console.log('success')
        }
        ctx.body = { result:friendlist}
    }
    if(ctx.url === 'https://fast-escarpment-98746-31874c6ce605.herokuapp.com/get-friendlist' && ctx.method === 'POST'){
        const { username } = ctx.request.body
        const result = await Friend.findOne({
            where: {
                username: username
            }
        })
        if(result){
            ctx.body = { result }
        }else{
            ctx.body = { result: null}
        }
    }
    if(ctx.url === 'https://fast-escarpment-98746-31874c6ce605.herokuapp.com/save-mymessage' && ctx.method === 'POST'){
        const {username, friendname, message} = ctx.request.body
        console.log(message)
        const result = await Message.findOne({
            where: {
                username: username,
                friendname: friendname
            }
        })
        console.log('result: '+result)
        if(result){
            Message.update(
                {message:message},
                {
                    where:{
                        username:username,
                        friendname:friendname
                    }
                }
            ).then(result=>{
                console.log(result[0]+' updated')
            }).catch(err=>{
                console.log('err:',err)
            })
        }else{
            await Message.create({ username, friendname, message })
            
            console.log('success')
        }
        ctx.body = { result:message}
    }
    if(ctx.url === 'https://fast-escarpment-98746-31874c6ce605.herokuapp.com/get-message' && ctx.method === 'POST'){
        const { username, friendname } = ctx.request.body
        const result = await Message.findOne({
            where: {
                username: username,
                friendname: friendname
            }
        })
        if(result){
            ctx.body = { result }
        }else{
            ctx.body = { result: {
                message: null
            } }
        }
        
    }
    if (ctx.url === 'https://fast-escarpment-98746-31874c6ce605.herokuapp.com/login' && ctx.method === 'POST') {
        const { username, password } = ctx.request.body
        const user = await User.findOne({ where: { username, password } })
        if (user) {
            ctx.body = { username: user.username + ' success!' }
        } else {
            ctx.body = { username: 'account or password incorrect!' }
        }

    } else if (ctx.url === 'https://fast-escarpment-98746-31874c6ce605.herokuapp.com/registry' && ctx.method === 'POST') {
        const { username, password } = ctx.request.body
        const user = await User.create({ username, password })
        
        const template = fs.readFileSync('chat_template.ejs', 'utf-8');
        const htmlContent = ejs.render(template, {
            username: username  // 这里可以是任何用户名或从数据库中获取的用户数据
        });
        const outputFileName = username+'chatwindow.html';
        fs.writeFileSync('publish/'+outputFileName, htmlContent, 'utf-8');
        console.log(`File ${outputFileName} created successfully!`);
        ctx.body = { success: true }
    } else if (ctx.url === 'https://fast-escarpment-98746-31874c6ce605.herokuapp.com/users' && ctx.method === 'GET') {
        const users = await User.findAll()
        ctx.body = { users: users.map(item => item.username) }
    }

    if (ctx.url === 'https://fast-escarpment-98746-31874c6ce605.herokuapp.com/save-chat-style' && ctx.method === 'POST') {
        const { username, friendname, ailanguage, aiextroversion, familiarity, recommendation_checked, recommendation_value, polishing_checked, polishing_value } = ctx.request.body
        const { familiarity_checked, familiarity_value } = familiarity
        const { humor_r_checked, playful_r_checked, respectful_r_checked, serious_r_checked, offensive_r_checked } = recommendation_checked
        const { humor_r_value, playful_r_value, respectful_r_value, serious_r_value, offensive_r_value } = recommendation_value
        const { humor_p_checked, playful_p_checked, respectful_p_checked, serious_p_checked, offensive_p_checked } = polishing_checked
        const { humor_p_value, playful_p_value, respectful_p_value, serious_p_value, offensive_p_value } = polishing_value
        console.log('1111' + offensive_p_checked)
        const chatstyle = await Chatstyle.create({
            username, friendname,
            ailanguage, aiextroversion,
            familiarity_checked, familiarity_value,
            humor_r_checked, playful_r_checked, respectful_r_checked, serious_r_checked, offensive_r_checked,
            humor_r_value, playful_r_value, respectful_r_value, serious_r_value, offensive_r_value,
            humor_p_checked, playful_p_checked, respectful_p_checked, serious_p_checked, offensive_p_checked,
            humor_p_value, playful_p_value, respectful_p_value, serious_p_value, offensive_p_value
        })
        ctx.body = { success: true }
    }
    if (ctx.url === 'https://fast-escarpment-98746-31874c6ce605.herokuapp.com/get-settings' && ctx.method === 'POST') {
        const { username, friendname } = ctx.request.body
        const result = await Chatstyle.findOne({
            where: {
                username: username,
                friendname: friendname
            },
            order: [
                ['id', 'DESC']
            ]
        })
        console.log(result)
        ctx.body = { result }
    }

})

app.listen(3000, () => {
    console.log('server start port 3000')
})


