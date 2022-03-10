const { Client, List, Buttons, MessageMedia, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const { body, validationResult } = require('express-validator');
const socketIO = require('socket.io');
const qrcode = require('qrcode');
const http = require('http');
const fs = require('fs');
const { phoneNumberFormatter } = require('./helpers/formatter');
const fileUpload = require('express-fileupload');
const axios = require('axios');
const mime = require('mime-types');

const port = process.env.PORT || 8005;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(fileUpload({
  debug: true
}));

const SESSION_FILE_PATH = './whatsapp-session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}

app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: __dirname
  });
});

const client = new Client({

    authStrategy: new LocalAuth(),

    puppeteer: { headless: true, args: [ '--no-sandbox',
                                        '--disable-setuid-sandbox',  
                                        '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas',
                                        '--no-first-run', '--no-zygote', '--single-process', // <- this one doesn't works in Windows 
                                        '--disable-gpu' ] }

});

const db = require('./helpers/db');
  
  client.on('message', async msg => {
    console.log('MESSAGE RECEIVED', msg);
	// setar mensagens do BOT AQUI
	//seteando Aluno no mysql
    	
	const user = msg.from.replace(/\D/g, '');
    const getUserFrom = await db.getUser(user);
    if(getUserFrom == false) {
        setUserFrom = await db.setUser(user);
		
	setTimeout(async () =>{
		const chat = await msg.getChat();
    		await chat.sendStateTyping();
	}, 2000);

	setTimeout(function(){
		client.sendMessage(msg.from, 'Pfv me responde uma coisa.. você participou de nossas aulas coletivas hoje?? 💪🏽💥');
	}, 5000);
		
		
    
	// ARMAZENANDO DADOS UNIDADE + DISPONIBILIZANDO LISTA PROFESSORES
	}else if (msg.body.includes ('Noova - Currais Novos')) { // Mensagem enviada pelo contato
	  setAlunoUnidade = await db.setUnidade(msg.body,user);
	  let sections = [{title:' Sua aula foi com qual professor (a)?',rows:[{title:'Ademar'},{title:'Lucas Franklin'},{title:'Neto'},{title:'Ramonzinho'},{title:'Luana Vanessa'},{title: 'Luiz'},{title: 'Jarbas'},{title: 'Rikelme'},{title: 'Villessa'},{title: 'Janaína'},]}];
      let list = new List('Vou te ajudar com os nomes.. 👇🏼','Selecionar professor (a)',sections,'Qual professor (a) dirigiu a aula?','.');
      client.sendMessage(msg.from, list);
	}else if (msg.body.includes ('Noova - Parelhas')) {
	  setAlunoUnidade = await db.setUnidade(msg.body,user);
	  let sections = [{title:'Sua aula foi com qual professor (a)?',rows:[{title:'Suêni'},{title:'Railsa'},{title:'Juninho'},{title:'Neto'},{title: 'João Paulo'},{title: 'Lunácio'},{title: 'Roni'},{title: 'Jobinho'},]}];
      let list = new List('Vou te ajudar com os nomes.. 👇🏼','Selecionar professor (a)',sections,'Qual professor (a) dirigiu a aula?','.');
      client.sendMessage(msg.from, list);  
	 }else if (msg.body.includes ('Noova - Caicó')) {
	  setAlunoUnidade = await db.setUnidade(msg.body,user);
	  let sections = [{title:'Sua aula foi com qual professor (a)?',rows:[{title:'Thawane'},{title:'Neto'},{title:'Carmem'},{title:'Einaldo'},{title: 'Andréia'},{title: 'Chikão'},{title: 'Du'},{title: 'Francisca'},]}];
      let list = new List('Vou te ajudar com os nomes.. 👇🏼','Selecionar professor (a)',sections,'Qual professor (a) dirigiu a aula?','.');
      client.sendMessage(msg.from, list); 
	 }else if (msg.body.includes ('Noova - Patos')) {
	  setAlunoUnidade = await db.setUnidade(msg.body,user);
	  let sections = [{title:' Sua aula hoje foi com qual professor (a)?',rows:[{title:'Emerson'},{title:'Carla'},{title:'Neto'},{title:'Jackson'},{title: 'Julikelly'},{title: 'Matheus'},{title: 'Kauã'},]}];
      let list = new List('Vou te ajudar com os nomes.. 👇🏼','Selecionar professor (a)',sections,'Qual professor (a) dirigiu a aula?','.');
      client.sendMessage(msg.from, list); 
	  
	}else if (msg.body.includes ('Emerson') || msg.body.includes ('Carla') || msg.body.includes ('Jackson') || msg.body.includes ('Rikelme') || msg.body.includes ('Julikelly') || msg.body.includes ('Matheus') || msg.body.includes ('Kauã') || 
	msg.body.includes === ('Thawane')|| msg.body.includes ('Carmem') || msg.body.includes ('Einaldo') || msg.body.includes ('Andréia') || msg.body.includes ('Chikão') || msg.body.includes ('Du') || msg.body.includes ('Francisca') ||
	msg.body.includes ('Jarbas') || msg.body.includes ('Rykelme') || msg.body.includes ('Villessa') || msg.body.includes ('Luiz') || msg.body.includes ('Luana Vanessa') ||
	msg.body.includes ('Ademar') || msg.body.includes ('Janaina') || msg.body.includes ('Lucas Franklin') || msg.body.includes ('Suêni') || msg.body.includes ('Railsa') || msg.body.includes ('Juninho') ||
	msg.body.includes ('João Paulo') || msg.body.includes ('Lunácio') || msg.body.includes ('Roni') || msg.body.includes ('Jobinho') || msg.body.includes ('Neto') || msg.body.includes ('Ramonzinho')) {
	  setAlunoProfessor = await db.setProfessor(msg.body,user);
	  let sections = [{title:' Qual foi a aula: 💪🏼',rows:[{title:'Bike'},{title:'Pump'},{title:'Step'},{title: 'Abdominais'},{title: 'Ritmus'},]}];
      let list = new List('Me conta.. qual aula você participou com esse professor? ','Aula coletiva',sections,'Qual aula você participou com esse professor?','.');
      client.sendMessage(msg.from, list); // ARMAZENANDO PROFESSOR NO MYSQL + LISTA PERGUNTANDO QUAL AULA PARTICIPOU HOJE
	  
	
	  }else if (msg.body.includes ('Bike') || msg.body.includes ('Pump') || msg.body.includes ('Step') || msg.body.includes ('Abdominais') || msg.body.includes ('Ritmus') ) {
	  setAlunoAula = await db.setAula(msg.body,user); 
	  let sections = [{title:' Como você classifica *qualidade da aula/animação:',rows:[{title:'TOP! Agora vou sempre 💥🔝'},{title:'Foi boa até! 😊'},{title:'Morgada! Não atendeu minhas expectativas 👎🏼'},{title:'Não gostei! Poderia ter sido melhor 😞'}]}];
      let list = new List('Por favor, avalie nossa aula coletiva.. ','AVALIAR AULA',sections,'Já finalizando.. haha! 🎆😁 ','.');
      client.sendMessage(msg.from, list); // ARMAZENANDO PROFESSOR NO MYSQL + LISTA PERGUNTANDO NOTA
	 

	 //armazenar mysql aula decisão
	  
	}else if (msg.body.includes ('TOP! Agora vou sempre 💥🔝') || msg.body.includes ('Foi boa até! 😊') || msg.body.includes ('Não gostei, poderia ter sido melhor 😞') || msg.body.includes ('Morgada! Não atendeu minhas expectativas 👎🏼')) {
	  setAlunoNota = await db.setNota(msg.body,user);
	  
	  const chat = await msg.getChat();
    	await chat.sendStateRecording(); 

	setTimeout(function(){
		const media = MessageMedia.fromFilePath('audio.ogg');
		chat.sendMessage(media,{sendAudioAsVoice:true});
	}, 5000); // ÁUDIO NATALY
	  
	  //armazenar mysql nota
	  
	  //////////// CONSTRUINDO INTERAÇÕES //////////////
	
	} else if (msg.body.includes('Não participei') || msg.body.includes('não') || msg.body.includes ('Não')) { 

	setTimeout(async () =>{
		const chat = await msg.getChat();
    		await chat.sendStateTyping();
	}, 2000);

	setTimeout(function(){
		client.sendMessage(msg.from, 'Testando');
	}, 5000); // se incluir o "bom" ou "boa" exemplo: bom dia! enviará Testando // ENVIAR MENSAGEM TEXTO COM TEMPO CERTINHO
	
	
	
	} else if (msg.body.includes ('claro') || msg.body.includes ('Claro') || msg.body.includes ('sim') || msg.body.includes ('Sim') || msg.body.includes ('Yes')|| msg.body.includes ('Participei') || msg.body.includes ('participei')||  msg.body.includes ('fui') || msg.body.includes ('Fui')) { //lista
      let sections = [{title:' Eu treino na Noova de..',rows:[{title:'Noova - Currais Novos'},{title:'Noova - Parelhas'},{title:'Noova - Caicó'},{title: 'Noova - Patos'},]}];
      let list = new List('Qual Noova Store Fitness você treina? 💛👇🏻️','Selecionar unidade',sections,'Prometo que é rapidinho..','.');
      client.sendMessage(msg.from, list); // ENVIA MENSAGEM DE LISTA UNIDADES
	
	} else if (msg.type == 'call_log' || msg.type === 'ptt') {
    setTimeout(async () =>{
		const chat = await msg.getChat();
    		await chat.sendStateTyping();
	}, 2000);

	setTimeout(function(){
		client.sendMessage(msg.from, 'Tá muito barulho aqui, não consigo ouvir áudio.. Por favor, consegue digitar?');
	}, 5000); // ENVIA MENSAGEM DIZENDO QUE NÃO CONSEGUE OUVIR
 	
	
	
	
	  }
	
 
});

client.initialize();

// Socket IO
io.on('connection', function(socket) {
  socket.emit('message', 'Conectando...');

  client.on('qr', (qr) => {
    console.log('QR RECEBIDO', qr);
    qrcode.toDataURL(qr, (err, url) => {
      socket.emit('qr', url);
      socket.emit('message', 'QR Code recebido, escaneie por favor!');
    });
  });

  client.on('ready', () => {
    socket.emit('ready', 'Whatsapp está pronto!');
    socket.emit('message', 'Whatsapp está pronto!');
  });

  client.on('authenticated', () => {
    socket.emit('authenticated', 'Whatsapp autenticado!');
    socket.emit('message', 'Whatsapp é autenticado!');
    console.log('AUTENTICADO');
    //sessionCfg = session;
    //fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function(err) {
    //  if (err) {
    //    console.error(err);
    //  }
    //});
  });

  client.on('auth_failure', function(session) {
    socket.emit('message', 'Falha de autenticação, reiniciando...');
  });

  client.on('disconnected', (reason) => {
    socket.emit('message', 'Whatsapp está desconectado!');
    fs.unlinkSync(SESSION_FILE_PATH, function(err) {
        if(err) return console.log(err);
        console.log('Arquivo de sessão excluído!');
    });
    client.destroy();
    client.initialize();
  });
});


const checkRegisteredNumber = async function(number) {
  const isRegistered = await client.isRegisteredUser(number);
  return isRegistered;
}

// Send message
app.post('/send-message', [
  body('number').notEmpty(),
  body('message').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req).formatWith(({
    msg
  }) => {
    return msg;
  });

  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: errors.mapped()
    });
  }

  const number = phoneNumberFormatter(req.body.number);
  const message = req.body.message;

  const isRegisteredNumber = await checkRegisteredNumber(number);

  if (!isRegisteredNumber) {
    return res.status(422).json({
      status: false,
      message: 'O número não está registrado'
    });
  }

  client.sendMessage(number, message).then(response => {
    res.status(200).json({
      status: true,
      response: response
    });
  }).catch(err => {
    res.status(500).json({
      status: false,
      response: err
    });
  });
});

// Send media
app.post('/send-media', async (req, res) => {
  const number = phoneNumberFormatter(req.body.number);
  const caption = req.body.caption;
  const fileUrl = req.body.file;

  // const media = MessageMedia.fromFilePath('./image-example.png');
  // const file = req.files.file;
  // const media = new MessageMedia(file.mimetype, file.data.toString('base64'), file.name);
  let mimetype;
  const attachment = await axios.get(fileUrl, {
    responseType: 'arraybuffer'
  }).then(response => {
    mimetype = response.headers['content-type'];
    return response.data.toString('base64');
  });

  const media = new MessageMedia(mimetype, attachment, 'Media');

  client.sendMessage(number, media, {
    caption: caption
  }).then(response => {
    res.status(200).json({
      status: true,
      response: response
    });
  }).catch(err => {
    res.status(500).json({
      status: false,
      response: err
    });
  });
});

const findGroupByName = async function(name) {
  const group = await client.getChats().then(chats => {
    return chats.find(chat => 
      chat.isGroup && chat.name.toLowerCase() == name.toLowerCase()
    );
  });
  return group;
}

// Send message to group
// You can use chatID or group name, yea!
app.post('/send-group-message', [
  body('id').custom((value, { req }) => {
    if (!value && !req.body.name) {
      throw new Error('Valor inválido, você pode usar `id` ou `name`');
    }
    return true;
  }),
  body('message').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req).formatWith(({
    msg
  }) => {
    return msg;
  });

  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: errors.mapped()
    });
  }

  let chatId = req.body.id;
  const groupName = req.body.name;
  const message = req.body.message;

  // Find the group by name
  if (!chatId) {
    const group = await findGroupByName(groupName);
    if (!group) {
      return res.status(422).json({
        status: false,
        message: 'Nenhum grupo encontrado com o nome de: ' + groupName
      });
    }
    chatId = group.id._serialized;
  }

  client.sendMessage(chatId, message).then(response => {
    res.status(200).json({
      status: true,
      response: response
    });
  }).catch(err => {
    res.status(500).json({
      status: false,
      response: err
    });
  });
});

// Clearing message on spesific chat
app.post('/clear-message', [
  body('number').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req).formatWith(({
    msg
  }) => {
    return msg;
  });

  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: errors.mapped()
    });
  }

  const number = phoneNumberFormatter(req.body.number);

  const isRegisteredNumber = await checkRegisteredNumber(number);

  if (!isRegisteredNumber) {
    return res.status(422).json({
      status: false,
      message: 'O número não está registrado'
    });
  }

  const chat = await client.getChatById(number);
  
  chat.clearMessages().then(status => {
    res.status(200).json({
      status: true,
      response: status
    });
  }).catch(err => {
    res.status(500).json({
      status: false,
      response: err
    });
  })
});

// Send button
app.post('/send-button', [
  body('number').notEmpty(),
  body('buttonBody').notEmpty(),
  body('bt1').notEmpty(),
  body('bt2').notEmpty(),
  body('bt3').notEmpty(),
  body('buttonTitle').notEmpty(),
  body('buttonFooter').notEmpty()
  
], async (req, res) => {
  const errors = validationResult(req).formatWith(({
    msg
  }) => {
    return msg;
  });

  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: errors.mapped()
    });
  }

  const number = phoneNumberFormatter(req.body.number);
  const buttonBody = req.body.buttonBody;
  const bt1 = req.body.bt1;
  const bt2 = req.body.bt2;
  const bt3 = req.body.bt3;
  const buttonTitle = req.body.buttonTitle;
  const buttonFooter = req.body.buttonFooter;
  const button = new Buttons(buttonBody,[{body:bt1},{body:bt2},{body:bt3}],buttonTitle,buttonFooter);

  const isRegisteredNumber = await checkRegisteredNumber(number);

  if (!isRegisteredNumber) {
    return res.status(422).json({
      status: false,
      message: 'O número não está registrado'
    });
  }

  client.sendMessage(number, button).then(response => {
    res.status(200).json({
      status: true,
      response: response
    });
  }).catch(err => {
    res.status(500).json({
      status: false,
      response: err
    });
  });
});


app.post('/send-list', [
  body('number').notEmpty(),
  body('ListItem1').notEmpty(),
  body('desc1').notEmpty(),
  body('ListItem2').notEmpty(),
  body('desc2').notEmpty(),
  body('List_body').notEmpty(),
  body('btnText').notEmpty(),
  body('Title').notEmpty(),
  body('footer').notEmpty()
  
], async (req, res) => {
  const errors = validationResult(req).formatWith(({
    msg
  }) => {
    return msg;
  });

  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: errors.mapped()
    });
  }

  const number = phoneNumberFormatter(req.body.number);
  const sectionTitle = req.body.sectionTitle;
  const ListItem1 = req.body.ListItem1;
  const desc1 = req.body.desc1;
  const ListItem2 = req.body.ListItem2;
  const desc2 = req.body.desc2;
  const List_body = req.body.List_body;
  const btnText = req.body.btnText;
  const Title = req.body.Title;
  const footer = req.body.footer;

  const sections = [{title:sectionTitle,rows:[{title:ListItem1, description: desc1},{title:ListItem2, description: desc2}]}];
  const list = new List(List_body,btnText,sections,Title,footer);

  const isRegisteredNumber = await checkRegisteredNumber(number);

  if (!isRegisteredNumber) {
    return res.status(422).json({
      status: false,
      message: 'O número não está registrado'
    });
  }

  client.sendMessage(number, list).then(response => {
    res.status(200).json({
      status: true,
      response: response
    });
  }).catch(err => {
    res.status(500).json({
      status: false,
      response: err
    });
  });
});

server.listen(port, function() {
  console.log('Aplicativo em execução na porta: ' + port);
});
