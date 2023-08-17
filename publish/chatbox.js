
// var chatBox = document.getElementById('chatContainer');
// const br = document.createElement('br');

/////////////////////
function initial_friendlist() {
    var username = document.getElementById('username').innerText
    var chatContainer = document.getElementsByClassName('chatlist')[0]
    const data = {
        username: username,
    }
    fetch('http://localhost:3000/get-friendlist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            const { result } = data

            // console.log(result)
            if (result) {
                const { friendlist, targetusername } = result

                chatContainer.innerHTML = friendlist
                document.getElementById('targetUser').innerText = targetusername
                initial_message(targetusername)
            }
            document.getElementById('add-friends').addEventListener('click', function () {
                // console.log(document.getElementsByClassName('add-block')[0])
                var add_friend_window = document.getElementsByClassName('add-block')[0]
                const rect = this.getBoundingClientRect();
                add_friend_window.style.top = (rect.bottom) + 'px';
                add_friend_window.style.left = rect.right + 'px';
                if (add_friend_window.classList.contains('hidden')) {
                    add_friend_window.classList.remove('hidden');
                } else {
                    add_friend_window.classList.add('hidden');
                }
            })

            function save_friendLst(friendList, targetUsername) {
                var username = document.getElementById('username').innerText
                var friendList = friendList
                var targetusername = targetUsername
                const data = {
                    username: username,
                    friendlist: friendList,
                    targetusername: targetusername
                }
                fetch('http://localhost:3000/save-friendList', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                    .then(response => response.json())
                    .then(data => {
                        const { result } = data
                        // console.log(result)
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            }
            document.getElementById('add-freind-btn').addEventListener('click', function () {
                var friendname = document.getElementById('friendName').value
                const data = {
                    username: friendname,
                }
                fetch('http://localhost:3000/find-friends', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                    .then(response => response.json())
                    .then(data => {
                        const { result } = data
                        if (result) {
                            var friends = document.getElementsByClassName('chatlist')[0]

                            const block_div = document.createElement("div");
                            const img_div = document.createElement("div");
                            const details_div = document.createElement("div");
                            const listHead_div = document.createElement("div");
                            const message_div = document.createElement("div");
                            const img = document.createElement("img");
                            const h4 = document.createElement("h4");
                            const p_time = document.createElement("p");
                            const p_message = document.createElement("p");

                            // 设置元素的属性
                            block_div.className = "block";
                            img_div.className = "imgbx";
                            details_div.classList = "details";
                            listHead_div.classList = "listHead";
                            img.src = "whatsapp_image/user.jpg";
                            img.className = "cover";
                            h4.textContent = friendname;
                            p_time.textContent = "";
                            p_message.textContent = "";

                            // 将元素添加到 DOM
                            img_div.appendChild(img);
                            listHead_div.appendChild(h4);
                            listHead_div.appendChild(p_time);
                            message_div.appendChild(p_message);
                            details_div.appendChild(listHead_div);
                            details_div.appendChild(message_div);

                            block_div.appendChild(img_div);
                            block_div.appendChild(details_div);
                            friends.appendChild(block_div)
                            document.getElementsByClassName('add-block')[0].classList.add('hidden')
                            save_friendLst(friends.innerHTML, document.getElementById('targetUser').innerText)

                        } else {
                            alert("Friend's name is not existed")
                        }

                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });


            })

            var friendList = document.getElementsByClassName('block');

            for (i = 0; i < friendList.length; i++) {
                friendList[i].addEventListener('click', function () {

                    var allPopups = document.querySelectorAll('.block');

                    allPopups.forEach(function (popup) {
                        if (popup !== this) {
                            if (popup.classList.contains('active')) {
                                popup.classList.remove('active');
                            }
                        }
                    });
                    this.classList.add('active')
                    let parentElement = this.parentElement; // 获取父元素
                    parentElement.removeChild(this); // 从当前位置移除
                    parentElement.insertBefore(this, parentElement.firstChild); // 插入到最前面
                    var targetusername = this.getElementsByClassName('listHead')[0].firstElementChild.innerText

                    var friends = document.getElementsByClassName('chatlist')[0].innerHTML
                    save_friendLst(friends, targetusername)

                })
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
initial_friendlist()
/////////////////////

/////////////////////
function initial_message(targetUser) {
    var username = document.getElementById('username').innerText
    var friendname = targetUser
    var chatContainer = document.getElementById('chatContainer')
    const data = {
        username: username,
        friendname: friendname,
    }
    fetch('http://localhost:3000/get-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            const { result } = data
            const { message } = result
            chatContainer.innerHTML = message
            var frinmessages = document.getElementsByClassName("message frnd_message");
            for (i = 0; i < frinmessages.length; i++) {
                frinmessages[i].addEventListener('click', function () {
                    showPopup(this)
                })
                const targetElement = frinmessages[i].querySelector('p');
                const clonedElement = targetElement.cloneNode(true);
                const spanElement = clonedElement.querySelector('span');
                if (spanElement) {
                    clonedElement.removeChild(spanElement);
                }
                const targetmessage = clonedElement.innerText;

                frinmessages[i].querySelector('button').addEventListener('click', function () {
                    document.querySelector('.loading-spinner-recommendation').style.display = 'block';
                    var inputText = document.getElementById('inputText');
                    const rect = inputText.getBoundingClientRect();
                    recommendationWindow.style.bottom = (window.innerHeight - rect.top) + 'px';
                    recommendationWindow.style.left = rect.left + 'px';
                    recommendationWindow.style.right = (window.innerWidth - rect.right) + 'px';
                    if (recommendationWindow.classList.contains('hidden')) {
                        recommendationWindow.classList.remove('hidden');
                    } else {
                        recommendationWindow.classList.add('hidden');
                    }
                    // AI recommendation
                    document.getElementById('notice-recommendation-result').innerText = 'AI Recommendation Result :';
                    document.querySelectorAll('.AI-recommendation-result').forEach(function (element) {
                        element.textContent = '';
                    });
                    var humor_r_checked = document.getElementById('humor-checkbox-r').checked
                    var playful_r_checked = document.getElementById('playful-checkbox-r').checked
                    var respectful_r_checked = document.getElementById('respectful-checkbox-r').checked
                    var serious_r_checked = document.getElementById('serious-checkbox-r').checked
                    var offensive_r_checked = document.getElementById('offensive-checkbox-r').checked
                    var isAnyChecked = humor_r_checked || playful_r_checked || respectful_r_checked || serious_r_checked || offensive_r_checked;
                    var ai_language = document.getElementsByClassName('custom-radio language');
                    var ai_language_value = 'English';
                    for (i = 0; i < 2; i++) {
                        if (ai_language[i].firstElementChild.checked) {
                            ai_language_value = ai_language[i].firstElementChild.value;
                        }
                    }
                    var ai_extraversion = document.getElementsByClassName('custom-radio extraversion');
                    var ai_extraversion_value = 'average';
                    for (i = 0; i < 3; i++) {
                        if (ai_extraversion[i].firstElementChild.checked) {
                            ai_extraversion_value = ai_extraversion[i].firstElementChild.value;
                        }
                    }
                    messageText = targetmessage;
                    if (isAnyChecked && messageText) {
                        fetch('http://localhost:3001/ask-gpt-recommendation', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                message: messageText,
                                ai_language: ai_language_value,
                                ai_extraversion: ai_extraversion_value,
                                familiarity: {
                                    familiarity_value: document.getElementById('familiarity_slider').value,
                                    familiarity_checked: document.getElementById('familiarity-checkbox').checked
                                },
                                features_r_value: {
                                    humor_r_value: document.getElementById('humor_slider_r').value,
                                    playful_r_value: document.getElementById('playful_slider_r').value,
                                    respectful_r_value: document.getElementById('respectful_slider_r').value,
                                    serious_r_value: document.getElementById('humor_slider_r').value,
                                    offensive_r_value: document.getElementById('humor_slider_r').value
                                },
                                features_r_checked: {
                                    humor_r_checked: humor_r_checked,
                                    playful_r_checked: playful_r_checked,
                                    respectful_r_checked: respectful_r_checked,
                                    serious_r_checked: serious_r_checked,
                                    offensive_r_checked: offensive_r_checked
                                }

                            })
                        })
                            .then(res => res.json())
                            .then(data => {
                                // console.log(data.completion.content);
                                var result = data.completion.content.split('"');
                                if (humor_r_checked) {
                                    var humor = document.getElementById("recommendation-humor");
                                    humor.innerText = "Humor :" + result[1];
                                    humor.style.display = 'block';
                                }
                                if (playful_r_checked) {
                                    var playful = document.getElementById("recommendation-playful");
                                    playful.innerText = "Playful :" + result[3];
                                    playful.style.display = 'block';
                                }
                                if (respectful_r_checked) {
                                    var respectful = document.getElementById("recommendation-respectful");
                                    respectful.innerText = "Respectful :" + result[5];
                                    respectful.style.display = 'block';
                                }
                                if (serious_r_checked) {
                                    var serious = document.getElementById("recommendation-serious");
                                    serious.innerText = "Serious :" + result[7];
                                    serious.style.display = 'block';
                                }
                                if (offensive_r_checked) {
                                    var offensive = document.getElementById("recommendation-offensive");
                                    offensive.innerText = "Offensive :" + result[9];
                                    offensive.style.display = 'block';
                                }
                                document.querySelector('.loading-spinner-recommendation').style.display = 'none';
                            })
                    } else if (isAnyChecked) {
                        document.getElementById('notice-recommendation-result').innerText = 'It is a space.';

                    } else {
                        document.getElementById('notice-recommendation-result').innerText = 'Please choose the language style you would like to recommend';

                    }
                })
            }

            var myMessages = document.getElementsByClassName("message my_message");
            for (i = 0; i < myMessages.length; i++) {
                myMessages[i].addEventListener('click', function () {
                    var allPopups = document.querySelectorAll('.pop-window');
                    allPopups.forEach(function (popup) {
                        popup.style.display = 'none';
                    });
                    const recommendationWindow = document.getElementById('recommendation-window');
                    recommendationWindow.classList.add('hidden');
                })
            }

            scrollToBottom();
            initial_settings(targetUser)

        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
// initial_message()
/////////////////////
var ai_language = document.getElementsByClassName('custom-radio language');
var ai_language_value = 'English';
for (i = 0; i < 2; i++) {
    ai_language[i].addEventListener('click', function () {
        ai_language_value = this.firstElementChild.value;
    })
}
var ai_extraversion = document.getElementsByClassName('custom-radio extraversion');
var ai_extraversion_value = 'average';
for (i = 0; i < 3; i++) {
    ai_extraversion[i].addEventListener('click', function () {
        ai_extraversion_value = this.firstElementChild.value;
    })
}
///////////////////
document.getElementById('save').addEventListener('click', function () {
    const username = document.getElementById('username').innerText;
    var friendname = document.getElementById('targetUser').innerText;
    document.getElementById('setting-window').classList.add('hidden');

    const data = {
        username: username,
        friendname: friendname,
        ailanguage: ai_language_value,
        aiextroversion: ai_extraversion_value,
        familiarity: {
            familiarity_checked: document.getElementById('familiarity-checkbox').checked,
            familiarity_value: document.getElementById('familiarity_slider').value
        },
        recommendation_checked: {
            humor_r_checked: document.getElementById('humor-checkbox-r').checked,
            playful_r_checked: document.getElementById('playful-checkbox-r').checked,
            respectful_r_checked: document.getElementById('respectful-checkbox-r').checked,
            serious_r_checked: document.getElementById('serious-checkbox-r').checked,
            offensive_r_checked: document.getElementById('offensive-checkbox-r').checked
        },
        recommendation_value: {
            humor_r_value: document.getElementById('humor_slider_r').value,
            playful_r_value: document.getElementById('playful_slider_r').value,
            respectful_r_value: document.getElementById('respectful_slider_r').value,
            serious_r_value: document.getElementById('humor_slider_r').value,
            offensive_r_value: document.getElementById('humor_slider_r').value
        },
        polishing_checked: {
            humor_p_checked: document.getElementById('humor-checkbox-p').checked,
            playful_p_checked: document.getElementById('playful-checkbox-p').checked,
            respectful_p_checked: document.getElementById('respectful-checkbox-p').checked,
            serious_p_checked: document.getElementById('serious-checkbox-p').checked,
            offensive_p_checked: document.getElementById('offensive-checkbox-p').checked
        },
        polishing_value: {
            humor_p_value: document.getElementById('humor_slider_p').value,
            playful_p_value: document.getElementById('playful_slider_p').value,
            respectful_p_value: document.getElementById('respectful_slider_p').value,
            serious_p_value: document.getElementById('humor_slider_p').value,
            offensive_p_value: document.getElementById('humor_slider_p').value
        }
    };
    fetch('http://localhost:3000/save-chat-style', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            // alert('Data saved successfully.');
        })
        .catch((error) => {
            console.error('Error:', error);
        });


})
///////////////////


var chatBox = document.getElementById('chatContainer');
const br = document.createElement('br');

var socket = new WebSocket("ws://localhost:8080"); // WebSocket connection

///////////////////////////
socket.onmessage = function (event) {
    var messageBlob = event.data;
    var reader = new FileReader();
    reader.onload = function () {
        const message = reader.result
        // console.log(event.target.result[0],event.target.result[1])
        var current_username = document.getElementById('username').innerText
        var current_friendname = document.getElementById('targetUser').innerText

        var messagehead = message.split(':')[0];
        var message_result = message.split(':')[1];
        var send_user = messagehead.split('to')[0].trim();
        var received_user = messagehead.split('to')[1].trim();

        addMessage(message_result, send_user, received_user, current_username, current_friendname);

        const data = {
            username: current_username,
            friendname: current_friendname,
            message: chatBox.innerHTML
        }
        fetch('http://localhost:3000/save-mymessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                const { result } = data
                console.log(result)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };
    reader.readAsText(messageBlob);
};

function contentAfterColon(str) {
    const index = str.indexOf(':');
    if (index !== -1) {
        return str.substring(index + 1);
    }
    return '';
}


function addMessage(message_result, send_user, received_user, current_username, current_friendname) {
    var message = message_result
    if (current_username === send_user) {
        if(current_friendname === received_user){
            console.log('add my message')
            var chatContainer = document.getElementById('chatContainer');
            const br = document.createElement('br');
            var myMessage_span = document.createElement('span');
            var myMessage = document.createElement("div");

            myMessage.className = "message my_message";
            myMessage_p = document.createElement('p');
            myMessage_p.textContent = message;
            myMessage_span.textContent = "12:15";
            myMessage_p.appendChild(br);
            myMessage_p.appendChild(myMessage_span);
            myMessage.appendChild(myMessage_p);

            myMessage.addEventListener('click', function () {
                var allPopups = document.querySelectorAll('.pop-window');
                allPopups.forEach(function (popup) {
                    popup.style.display = 'none';
                });
                const recommendationWindow = document.getElementById('recommendation-window');
                recommendationWindow.classList.add('hidden');
            })
            chatContainer.appendChild(myMessage);
        }
        

    } else if (current_username === received_user) {
        if(current_friendname === send_user){
            console.log('add friend message')
            var pop_window = document.createElement('div');
            pop_window.className = 'pop-window';
            var pop_btn = document.createElement('button');
            pop_btn.className = "popup-btn";
            pop_btn.textContent = 'AI Recommendation Reply';
            // var recommendationWindow = document.getElementById('recommendation-window');
            pop_window.appendChild(pop_btn);
            var frndMessage = document.createElement("div");
            var frndMessage_span = document.createElement('span');
            frndMessage.className = "message frnd_message";
            frndMessage_p = document.createElement('p')
            frndMessage_p.textContent = message;
            frndMessage_span.textContent = "12:15";
            frndMessage_p.appendChild(br);
            frndMessage_p.appendChild(frndMessage_span);
            frndMessage.appendChild(frndMessage_p);
            frndMessage.appendChild(pop_window);
            frndMessage.addEventListener('click', function () {
                showPopup(frndMessage);
            })
            chatBox.appendChild(frndMessage);
            // frndMessage.appendChild(pop_window);
        }else{
            var getfriends = document.getElementsByClassName('listHead')
            for(i=0;i<getfriends.length;i++){
                friend_name = getfriends[i].firstElementChild.innerText
                if(friend_name === send_user){

                    console.log(friend_name)
                }
            }
        }
        
    }
    scrollToBottom();
}

document.getElementById("send-btn").addEventListener("click", function () {
    var messageInput = document.getElementById("inputText");
    var from = document.getElementById("username").innerText;
    var to = document.getElementById("targetUser").innerText;
    send_message = from + ' to ' + to + ':' + messageInput.value
    socket.send(send_message);
    messageInput.value = "";
});

function scrollToBottom() {
    chatContainer.scrollTop = chatBox.scrollHeight;
}

scrollToBottom();

// mapping polishing styles

var checkbox = document.getElementsByClassName('checkbox');

for (i = 1; i < 6; i++) {
    checkbox[i + 5].addEventListener('change', function () {
        if (this.checked) {
            document.getElementById("polishing-" + this.id.split('-')[0]).style.display = 'block';
        } else {
            document.getElementById("polishing-" + this.id.split('-')[0]).style.display = 'none';
        }
    });
    checkbox[i].addEventListener('change', function () {
        if (this.checked) {
            document.getElementById("recommendation-" + this.id.split('-')[0]).style.display = 'block';
        } else {
            document.getElementById("recommendation-" + this.id.split('-')[0]).style.display = 'none';
        }
    });
}


// pop-window
var popWindows = document.getElementsByClassName('pop-window');
for (var i = 0; i < popWindows.length; i++) {
    popWindows[i].style.display = 'none';
}
// console.log(popWindows.length);
function showPopup(element) {
    var allPopups = document.querySelectorAll('.pop-window');
    var currentPopup = element.querySelector('.pop-window');

    allPopups.forEach(function (popup) {
        if (popup !== currentPopup) {
            popup.style.display = 'none';
        }
    });

    currentPopup.style.display = currentPopup.style.display === 'none' ? 'block' : 'none';
}

// change input message
var inputText = document.getElementById('inputText');
// enter to send message
document.addEventListener('keydown', function (event) {
    if (event.key == "Enter" && !event.shiftKey) {
        event.preventDefault();
        // var username = document.getElementById("targetUser").innerText;
        if (inputText.value) {
            var messageInput = document.getElementById("inputText");
            var from = document.getElementById("username").innerText;
            var to = document.getElementById("targetUser").innerText;
            send_message = from + ' to ' + to + ':' + messageInput.value
            socket.send(send_message);
            messageInput.value = "";
        } else {
            console.log('please enter the context');
        }

    }
})

function changeInputMessage(event) {
    inputText.value = contentAfterColon(event.textContent.trim());
    const polishingWindow = document.getElementById('polishing-window');
    polishingWindow.classList.add('hidden');
    const recommendationWindow = document.getElementById('recommendation-window');
    recommendationWindow.classList.add('hidden');
}

//slider change
function updateValue_familiarity() {
    var slider = document.getElementById('familiarity_slider');
    var sliderValue = document.getElementById('familiarity-value');
    sliderValue.textContent = Math.round(slider.value);
    var checkbox = document.getElementById('familiarity-checkbox');
    checkbox.checked = true
}
function updateValue_humor_r() {
    const slider = document.getElementById('humor_slider_r');
    const sliderValue = document.getElementById('humor-value_r');
    sliderValue.textContent = Math.round(slider.value);
    var checkbox = document.getElementById('humor-checkbox-r');
    checkbox.checked = true
    const changeEvent = new Event('change');
    checkbox.dispatchEvent(changeEvent);
}
function updateValue_serious_r() {
    const slider = document.getElementById('serious_slider_r');
    const sliderValue = document.getElementById('serious-value_r');
    sliderValue.textContent = Math.round(slider.value);
    var checkbox = document.getElementById('serious-checkbox-r');
    checkbox.checked = true
    const changeEvent = new Event('change');
    checkbox.dispatchEvent(changeEvent);
}
function updateValue_playful_r() {
    const slider = document.getElementById('playful_slider_r');
    const sliderValue = document.getElementById('playful-value_r');
    sliderValue.textContent = Math.round(slider.value);
    var checkbox = document.getElementById('playful-checkbox-r');
    checkbox.checked = true
    const changeEvent = new Event('change');
    checkbox.dispatchEvent(changeEvent);
}
function updateValue_respectful_r() {
    const slider = document.getElementById('respectful_slider_r');
    const sliderValue = document.getElementById('respectful-value_r');
    sliderValue.textContent = Math.round(slider.value);
    var checkbox = document.getElementById('respectful-checkbox-r');
    checkbox.checked = true
    const changeEvent = new Event('change');
    checkbox.dispatchEvent(changeEvent);
}
function updateValue_offensive_r() {
    const slider = document.getElementById('offensive_slider_r');
    const sliderValue = document.getElementById('offensive-value_r');
    sliderValue.textContent = Math.round(slider.value);
    var checkbox = document.getElementById('offensive-checkbox-r');
    checkbox.checked = true
    const changeEvent = new Event('change');
    checkbox.dispatchEvent(changeEvent);
}
function updateValue_humor_p() {
    const slider = document.getElementById('humor_slider_p');
    const sliderValue = document.getElementById('humor-value_p');
    sliderValue.textContent = Math.round(slider.value);
    var checkbox = document.getElementById('humor-checkbox-p');
    checkbox.checked = true
    const changeEvent = new Event('change');
    checkbox.dispatchEvent(changeEvent);
}
function updateValue_serious_p() {
    const slider = document.getElementById('serious_slider_p');
    const sliderValue = document.getElementById('serious-value_p');
    sliderValue.textContent = Math.round(slider.value);
    var checkbox = document.getElementById('serious-checkbox-p');
    checkbox.checked = true
    const changeEvent = new Event('change');
    checkbox.dispatchEvent(changeEvent);
}
function updateValue_playful_p() {
    const slider = document.getElementById('playful_slider_p');
    const sliderValue = document.getElementById('playful-value_p');
    sliderValue.textContent = Math.round(slider.value);
    var checkbox = document.getElementById('playful-checkbox-p');
    checkbox.checked = true
    const changeEvent = new Event('change');
    checkbox.dispatchEvent(changeEvent);
}
function updateValue_respectful_p() {
    const slider = document.getElementById('respectful_slider_p');
    const sliderValue = document.getElementById('respectful-value_p');
    sliderValue.textContent = Math.round(slider.value);
    var checkbox = document.getElementById('respectful-checkbox-p');
    checkbox.checked = true
    const changeEvent = new Event('change');
    checkbox.dispatchEvent(changeEvent);
}
function updateValue_offensive_p() {
    const slider = document.getElementById('offensive_slider_p');
    const sliderValue = document.getElementById('offensive-value_p');
    sliderValue.textContent = Math.round(slider.value);
    var checkbox = document.getElementById('offensive-checkbox-p');
    checkbox.checked = true
    const changeEvent = new Event('change');
    checkbox.dispatchEvent(changeEvent);
}

// AI window setting
var settingButton = document.getElementById('setting-btn');
var settingsWindow = document.getElementById('setting-window');

settingButton.addEventListener('click', function () {

    const rect = settingButton.getBoundingClientRect(); // 获取按钮的位置和尺寸

    // 设置setting-window的位置
    settingsWindow.style.right = (window.innerWidth - rect.right) + 'px'; // 将setting-window的右侧对齐到按钮的右侧
    settingsWindow.style.bottom = (window.innerHeight - rect.top) + 'px'; // 将setting-window的底部对齐到按钮的顶部
    // settingsWindow.style.width = (rect.width) + 'px';

    if (settingsWindow.classList.contains('hidden')) {
        settingsWindow.classList.remove('hidden');
    } else {
        settingsWindow.classList.add('hidden');
    }

});

// AI Polishing window setting
var assistantButton = document.getElementById('assistant-btn');
var polishingWindow = document.getElementById('polishing-window');

assistantButton.addEventListener('click', function () {
    document.querySelector('.loading-spinner').style.display = 'block';
    document.getElementById('notice-polish-result').innerText = 'AI Polishing Result :';
    document.querySelectorAll('.AI-polishing-result').forEach(function (element) {
        element.textContent = '';
    });
    var inputText = document.getElementById('inputText');
    const rect = inputText.getBoundingClientRect();
    polishingWindow.style.bottom = (window.innerHeight - rect.top) + 'px';
    polishingWindow.style.left = rect.left + 'px';
    polishingWindow.style.right = (window.innerWidth - rect.right) + 'px';
    if (polishingWindow.classList.contains('hidden')) {
        polishingWindow.classList.remove('hidden');
    } else {
        polishingWindow.classList.add('hidden');
    }
    //AI polishing result
    var message = document.getElementById('inputText');
    var messageText = message.value;
    // message.value = '';
    var humor_p_checked = document.getElementById('humor-checkbox-p').checked
    var playful_p_checked = document.getElementById('playful-checkbox-p').checked
    var respectful_p_checked = document.getElementById('respectful-checkbox-p').checked
    var serious_p_checked = document.getElementById('serious-checkbox-p').checked
    var offensive_p_checked = document.getElementById('offensive-checkbox-p').checked
    var isAnyChecked = humor_p_checked || playful_p_checked || respectful_p_checked || serious_p_checked || offensive_p_checked;
    var ai_language = document.getElementsByClassName('custom-radio language');
    var ai_language_value = 'English';
    for (i = 0; i < 2; i++) {
        if (ai_language[i].firstElementChild.checked) {
            ai_language_value = ai_language[i].firstElementChild.value;
        }
    }
    var ai_extraversion = document.getElementsByClassName('custom-radio extraversion');
    var ai_extraversion_value = 'average';
    for (i = 0; i < 3; i++) {
        if (ai_extraversion[i].firstElementChild.checked) {
            ai_extraversion_value = ai_extraversion[i].firstElementChild.value;
        }
    }
    if (isAnyChecked && messageText) {
        fetch('http://localhost:3001/ask-gpt-polishing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: messageText,
                ai_language: ai_language_value,
                ai_extraversion: ai_extraversion_value,
                familiarity: {
                    familiarity_value: document.getElementById('familiarity_slider').value,
                    familiarity_checked: document.getElementById('familiarity-checkbox').checked
                },
                features_p_value: {
                    humor_p_value: document.getElementById('humor_slider_p').value,
                    playful_p_value: document.getElementById('playful_slider_p').value,
                    respectful_p_value: document.getElementById('respectful_slider_p').value,
                    serious_p_value: document.getElementById('humor_slider_p').value,
                    offensive_p_value: document.getElementById('humor_slider_p').value
                },
                features_p_checked: {
                    humor_p_checked: humor_p_checked,
                    playful_p_checked: playful_p_checked,
                    respectful_p_checked: respectful_p_checked,
                    serious_p_checked: serious_p_checked,
                    offensive_p_checked: offensive_p_checked
                }

            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.completion.content)
                var result = data.completion.content.split('"');
                if (humor_p_checked) {
                    var humor = document.getElementById("polishing-humor");
                    humor.innerText = "Humor :" + result[1];
                    humor.style.display = 'block';
                }
                if (playful_p_checked) {
                    var playful = document.getElementById("polishing-playful");
                    playful.innerText = "Playful :" + result[3];
                    playful.style.display = 'block';
                }
                if (respectful_p_checked) {
                    var respectful = document.getElementById("polishing-respectful");
                    respectful.innerText = "Respectful :" + result[5];
                    respectful.style.display = 'block';
                }
                if (serious_p_checked) {
                    var serious = document.getElementById("polishing-serious");
                    serious.innerText = "Serious :" + result[7];
                    serious.style.display = 'block';
                }
                if (offensive_p_checked) {
                    var offensive = document.getElementById("polishing-offensive");
                    offensive.innerText = "Offensive :" + result[9];
                    offensive.style.display = 'block';
                }
                document.querySelector('.loading-spinner').style.display = 'none';
            })
    } else if (isAnyChecked) {
        document.getElementById('notice-polish-result').innerText = 'Please enter the text you would like to polish.';

    } else {
        document.getElementById('notice-polish-result').innerText = 'Please choose the language style you would like to polish';

    }
});

// recommendation window
var popup_btn = document.getElementsByClassName("popup-btn");
var recommendationWindow = document.getElementById('recommendation-window');
for (i = 0; i < popup_btn.length; i++) {
    popup_btn[i].addEventListener('click', function () {
        var inputText = document.getElementById('inputText');
        const rect = inputText.getBoundingClientRect();
        recommendationWindow.style.bottom = (window.innerHeight - rect.top) + 'px';
        recommendationWindow.style.left = rect.left + 'px';
        recommendationWindow.style.right = (window.innerWidth - rect.right) + 'px';
        if (recommendationWindow.classList.contains('hidden')) {
            recommendationWindow.classList.remove('hidden');
        } else {
            recommendationWindow.classList.add('hidden');
        }
    })
}

document.getElementById('chatContainer').addEventListener("click", function () {
    if (polishingWindow.classList.contains('hidden')) {
        // polishingWindow.classList.remove('hidden')
    } else {
        polishingWindow.classList.add('hidden')
    }
    if (settingsWindow.classList.contains('hidden')) {
        // settingsWindow.classList.remove('hidden');
    } else {
        settingsWindow.classList.add('hidden');
    }

    var add_friend_window = document.getElementsByClassName('add-block')[0]
    if (add_friend_window.classList.contains('hidden')) {

    } else {
        add_friend_window.classList.add('hidden');
    }


});

document.getElementById('chatbox_input').addEventListener("click", function () {
    if (recommendationWindow.classList.contains('hidden')) {
        // polishingWindow.classList.remove('hidden')
    } else {
        recommendationWindow.classList.add('hidden')
    }
});

//initial settings
function initial_settings(targetusername) {
    const data = {
        username: document.getElementById('username').innerText,
        friendname: targetusername
    };
    fetch('http://localhost:3000/get-settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            const { result } = data
            if (!result) {
                // console.log('no results')
            } else {
                const { ailanguage, aiextroversion, familiarity_checked, familiarity_value,
                    humor_r_checked, playful_r_checked, respectful_r_checked, serious_r_checked, offensive_r_checked,
                    humor_r_value, playful_r_value, respectful_r_value, serious_r_value, offensive_r_value,
                    humor_p_checked, playful_p_checked, respectful_p_checked, serious_p_checked, offensive_p_checked,
                    humor_p_value, playful_p_value, respectful_p_value, serious_p_value, offensive_p_value, createdAt } = result


                var ailanguage_setting = document.getElementsByClassName('custom-radio language')
                for (i = 0; i < 2; i++) {
                    console.log(ailanguage)
                    if (ailanguage_setting[i].firstElementChild.value == ailanguage) {
                        ailanguage_setting[i].firstElementChild.checked = true
                    }
                }
                var aiextroversion_setting = document.getElementsByClassName('custom-radio extraversion')
                for (i = 0; i < 3; i++) {
                    if (aiextroversion_setting[i].firstElementChild.value == aiextroversion) {
                        aiextroversion_setting[i].firstElementChild.checked = true
                    }
                }
                document.getElementById('familiarity_slider').value = familiarity_value;
                document.getElementById('familiarity-value').innerText = Math.round(familiarity_value);
                document.getElementById('familiarity-checkbox').checked = familiarity_checked;

                document.getElementById('humor-checkbox-r').checked = humor_r_checked
                document.getElementById('playful-checkbox-r').checked = playful_r_checked
                document.getElementById('respectful-checkbox-r').checked = respectful_r_checked
                document.getElementById('serious-checkbox-r').checked = serious_r_checked
                document.getElementById('offensive-checkbox-r').checked = offensive_r_checked

                document.getElementById('humor_slider_r').value = humor_r_value
                document.getElementById('humor-value_r').innerText = Math.round(humor_r_value)
                document.getElementById('playful_slider_r').value = playful_r_value
                document.getElementById('playful-value_r').innerText = Math.round(playful_r_value)
                document.getElementById('respectful_slider_r').value = respectful_r_value
                document.getElementById('respectful-value_r').innerText = Math.round(respectful_r_value)
                document.getElementById('serious_slider_r').value = serious_r_value
                document.getElementById('serious-value_r').innerText = Math.round(serious_r_value)
                document.getElementById('offensive_slider_r').value = offensive_r_value
                document.getElementById('offensive-value_r').innerText = Math.round(offensive_r_value)

                document.getElementById('humor-checkbox-p').checked = humor_p_checked
                document.getElementById('playful-checkbox-p').checked = playful_p_checked
                document.getElementById('respectful-checkbox-p').checked = respectful_p_checked
                document.getElementById('serious-checkbox-p').checked = serious_p_checked
                document.getElementById('offensive-checkbox-p').checked = offensive_p_checked

                document.getElementById('humor_slider_p').value = humor_p_value
                document.getElementById('humor-value_p').innerText = Math.round(humor_p_value)
                document.getElementById('playful_slider_p').value = playful_p_value
                document.getElementById('playful-value_p').innerText = Math.round(playful_p_value)
                document.getElementById('respectful_slider_p').value = respectful_p_value
                document.getElementById('respectful-value_p').innerText = Math.round(respectful_p_value)
                document.getElementById('serious_slider_p').value = serious_p_value
                document.getElementById('serious-value_p').innerText = Math.round(serious_p_value)
                document.getElementById('offensive_slider_p').value = offensive_p_value
                document.getElementById('offensive-value_p').innerText = Math.round(offensive_p_value)
            }

        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
