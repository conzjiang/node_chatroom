# hello world!
The standard first Node.js project is a chatroom app, so I made a chatroom app in order to familiarize myself with the workings of Node.js + socket.io. Front-end interface made in Backbone.js. This is <a href="http://hello.constancejiang.com" target="_blank">hello world!</a>.

# Features
I couldn't resist adding my own styling inclinations to this boilerplate project.

* Click on someone's name in the main chat sidebar and start a private chat with him/her
* [Custom](public/javascripts/views/allChats.js) [carousel](public/javascripts/carousel.js) to rotate through chats
  * `public/javascripts/views/allChats.js`
  * `public/javascripts/carousel.js`
* Smooth transitions brought to you purely by CSS
* See when your friend is [typing](public/javascripts/views/privateChat.js) during private conversations
  * `public/javascripts/views/privateChat.js`
* Modular [Chat view object](public/javascripts/views/chat.js) easily allows for different types of chats in the future
  * `public/javascripts/views/chat.js`
* Custom [NicknameManager object](lib/nickname_manager.js) on the server-side acts as my own little mini database for storing nicknames
  * `lib/nickname_manager.js`

# Hopes for the future
Many cosmetic changes to come! See the [TODO](TODO.md).
