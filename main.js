const Discord = require('discord.js')

const {
    Client,
    Attachment
} = require('discord.js');
const bot = new Client();

const ytdl = require("ytdl-core");
const ytSearch = require('yt-search');

const token = 'ODQ1NjA5OTk1OTIzMDk1NTg3.YKjdrQ.dXvj_Qt3Kr6fB8TQF_JEE12VrVI';

const PREFIX = '!';

var servers = {};

bot.on('ready', () =>{
    console.log('Hazırım kaptan!');
});

bot.on('message', message => {

    let args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]){
        case ('play'):
            console.log('play yazmış');
            async function play(connection, message, call){
                var server = servers[message.guild.id];
                const videoFinder = async(query) =>{
                    const videoResult = await ytSearch(query);
                    if (videoResult.videos.length > 1){
                        message.channel.send("Çalacağım şey: ", (videoResult.videos[0]).title);
                        return videoResult.videos[0];
                    }
                    else {
                        message.channel.send("Bu isimde bir şey bulamadım");
                        return null;
                    }
                }
                    if (call == 1)
                    {
                        console.log("Videoyu arıyorum");
                        const video = await videoFinder(args.join(' '));                        
                        if (video)
                        {
                            console.log("Videoyu buldum");
                            server.queue.push(video.url);
                            console.log(video.url);
                            message.channel.send(video.url);
                        }
                    }
                        server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audioonly"}));
                        console.log("Dispatch ok");
                        server.queue.shift();
                        console.log("Shift ok");
                        server.dispatcher.on("finish", function()
                        {
                            console.log("If else");
                            if(server.queue[0]){
                                play(connection, message, 0);
                            }else {
                                connection.disconnect();
                            }
                            console.log("If else ok");
                        });
                }
            console.log("bakalım");
            if (!args[1]){
                message.channel.send("Yanına bir de çalınacak şeyin ismini rica edeceğim");
                return;
            }

            if (!message.member.voice.channel){
                message.channel.send("Bir ses kanalına girmeni rica edeceğim");
                return;
            }

            if (!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }

            var server = servers[message.guild.id];
            console.log("geldim en sona");
            if(!message.guild || !message.guild.voice || !message.guild.voice.connection) message.member.voice.channel.join().then(function(connection){
                console.log("playi çağırıyorum, kanala yeni giriyorum");
                play(connection, message, 1);
            });
            else {
                console.log("playı çağırıyorum, kanalda vardım zaten");
                connection = Discord.VoiceConnection
                play(connection, message, 1);                
            };
        break;

        case 'skip':
            var server = servers[message.guild.id];
            if(server.dispatcher){
                server.dispatcher.end();
                message.channel.send("Şarkıyı geçiyorum");
            } 
        break;

        case 'pause':
            var server = servers[message.guild.id];
            if (server.dispatcher){
                message.channel.send("Şarkıyı durduruyorum");
                server.dispatcher.pause();
            }
        break;

        case 'resume':
            var server = servers[message.guild.id];
            if (server.dispatcher){
                message.channel.send("Şarkıya kaldığım yerden devam ediyorum");
                if(server.dispatcher.paused) console.log('şarkı paused');
                else console.log('şarkı paused falan değil');
                server.dispatcher.resume();
            }
        break;

        case 'stop':
            var server = servers[message.guild.id];
            console.log('Stop ok');
            if (message.guild.voice.connection){
                console.log("Cleaning up the queue");
                for (var i = server.queue.length -1; i >= 0; i--){
                    server.queue.splice(i, 1);
                }
                console.log("Cleaned the queue");
                server.dispatcher.end();
                console.log("Tmm, bitti");
                message.channel.send("Hoçca ğalın gidiyom ben");
            }
            if (message.guild.voice.connection) message.guild.voice.connection.disconnect();
        break;
    }
    whole = args.join(" ").toLowerCase();
    if (whole.includes("teşekkür") || whole.includes("sağ ol") || whole.includes("sağol"))
    {
        message.channel.send("Rica ederim, ne demek");
    }
})

bot.login(token);
