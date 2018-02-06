import _ from 'lodash';
import fs from 'fs';
import { spawn } from 'child_process';
import express from 'express';
import bodyParser from 'body-parser';
import jsonfile from'jsonfile';
const supercolliderjs = require('supercolliderjs');
const socketIo = require('socket.io');
const exec = require('child_process').exec;
const osc = require("osc");
const Queue = require('better-queue');
const nanoKONTROL = require('korg-nano-kontrol');
// timers
// const abletonlink = require('abletonlink');
// const link = new abletonlink();
const NanoTimer = require('nanotimer');
let nano = new NanoTimer();

// // Retrieve Tidal tick
// let synchs = exec('cd ' + __dirname + ' && runhaskell sync.hs');
// // Execute PianoRoll functions
// let python = exec('cd ' + __dirname + ' && python3 trig_roll.py');
// const startSCD = `${__dirname}/scd_start-default.scd`;

// let dcon = socketIo.listen(3004);
// let dseq = socketIo.listen(4004);
let link_pulse = socketIo.listen(4001);
class REPL {
  hush() {
    this.tidalSendExpression('hush');
  }

  doSpawn(config, reply) {
    this.repl = spawn(config.ghcipath, ['-XOverloadedStrings']);
  
    // this.repl.stderr.on('data', (data) => {
    //   console.error(data.toString('utf8'));
    //   dcon.sockets.emit('dcon', ({dcon: data.toString('utf8')}));
    // });
    // this.repl.stdout.on('data', data => {
    //   console.error(data.toString())
    //   dcon.sockets.emit('dcon', ({dcon: data.toString('utf8')}));
    // });
    // console.log(" ## -->   GHC Spawned");

    // // python print
    // python.stdout.on('data', function(data){
    // console.log(data.toString());
    // });
    // // error
    // python.stderr.on('data', (data) => {
    // console.error(`node-python stderr:\n${data}`);
    // });
    nanoKONTROL.connect('nanoKONTROL2').then((device) => {
      device.on('slider:*', function(value){
        //console.log(this.event+' => '+value);
        //SuperCollider
        let scorbit;
        let defval = value.map(0, 127, 0, 2);
        // let scmod = _.replace(this.event,"slider:","")
        // scmod = "~dirt.orbits[" + scmod+ "].set(\\amp,"+ defval + ");"// reduce the amplitude of one orbit
        // SirenComm.siren_console.sendSCLang(scmod); 

        //last 2 dif functions
      });
      
      device.on('knob:*', function(value){
        console.log(this.event+' => '+value);
      });
      
      device.on('button:**', function(value){
        console.log(this.event+' => '+value);
      });
    });
  }

  initGHC(config) {
    const tidalparams = fs.readFileSync(config.tidal_boot).toString().split('\n');
    if ( tidalparams )
      for (let i = 0; i < tidalparams.length; i++) {
        this.tidalSendLine(tidalparams[i]);
      }
    console.log(" ## -->  GHC initialized");
  }

  initSCSynth(config, reply) {
    const self = this;
    console.log(config.path, config);
    
    // TODO: config.path does not exist, possible fix
    supercolliderjs.resolveOptions(config.path).then((options) => {
      options.sclang = config.sclang;
      options.scsynth = config.scsynth;
      options.sclang_conf = config.sclang_conf;
      options.debug = true;
      supercolliderjs.lang.boot(options).then((sclang) => {
        self.sc = sclang;

        let sclog = socketIo.listen(4002);
        // let udpPort = new osc.UDPPort({
        //   remoteAddress: "127.0.0.1",
        //   remotePort: 3007,
        //   metadata: true
        // });
        // udpPort.open();

        // On SC Message
        sclang.on('stdout', (d) => {
          if(_.startsWith(d, 'SIREN LOADED')) {
            reply.sendStatus(200);
          }

          // Converts 'd' into an object
          let re = /\[.+\]/g, match = re.exec(d);
          if(match !== null && match !== undefined && match[0] !== undefined) {
            let msg = _.split(_.trim(match[0], '[]'), ',')
            _.each(msg, function(m, i) {
              msg[i] = _.trim(m)
            })

            let time = 0;
            re = /(time:).+/g;
            match = re.exec(d);
            if(match !== null && match !== undefined && match[0] !== undefined) {
              time = _.toNumber(_.trim(match[0].substring(5, 16)));
              console.log('TIME EXTRACTION: ', time, match[0]);
            }

            
            // Relay SCSynth debug log to React
            if (_.trim(msg[0]) === '/play2') {
              let cycleInfo = _.fromPairs(_.chunk(_.drop(msg), 2));
              cycleInfo['time'] = time;

              // // Message to Unity
              // let unityMessage = {
              //   address: "/siren",
              //   args: [
              //   {
              //       type: "s",
              //       value: _.toString(_.concat(time,_.drop(msg)))
              //   }
              //   ]
              // };
              // udpPort.send(unityMessage);

              // Message to React frontend
              sclog.sockets.emit('/sclog', {trigger: cycleInfo});
            }
          }
        });

        setTimeout(function() {
          const samples = fs.readFileSync(config.scd_start).toString()
          sclang.interpret(samples).then((samplePromise) => {
              console.log(' ## -->   SuperCollider initialized' );
          });
        }, 4000)
      });
    });
  }
    

    
  start(config, reply) {
    this.doSpawn(config);
    this.initGHC(config);
    this.initSCSynth(config, reply);
  }

  stdinWrite(pattern) {
    this.repl.stdin.write(pattern);
  }

  tidalSendLine(pattern) {
    this.stdinWrite(pattern);
    this.stdinWrite('\n');
  }

  tidalSendExpression(expression) {
    this.tidalSendLine(':{');
    this.tidalSendLine(expression);
    this.tidalSendLine(':}');
  }
  sendSCLang(message) {
    this.sc.interpret(message)
      .then(function(result) {
        console.log(" ### sendSC: " , result);
      }, function(error) {
        console.error("### sendSC ERROR:" , error);
      });
  }
  sendSC(message, reply) {
    this.sc.interpret(message)
      .then(function(result) {
        console.log(" ### sendSC: " , result);
        reply.status(200).json({sc_result: result});
      }, function(error) {
        console.error("### sendSC ERROR:" , error);
        reply.status(500).json({sc_result: undefined});
      });
  }
}

const SirenComm = {
  siren_console: new REPL()
}
  
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

const Siren = () => {
    const app = express();
    var tidalPatternQueue = new Queue((pat, cb) => {
      SirenComm.siren_console.tidalSendLine(pat);
      console.log("HEREQUEUE", pat);
      cb(null, result);
    },{ });

   
    // let udpHosts = [];
    // let dgram = require("dgram");
    // let UDPserver = dgram.createSocket("udp4");
  
    // let tick = socketIo.listen(3003);
    // let py = socketIo.listen(5005);
  
    // let oscPy = require('osc')
    // let udpPortPy = new oscPy.UDPPort({
    //   localAddress: "127.0.0.1",
    //   localPort: 5005,
    //   remoteAddress: "127.0.0.1",
    //   remotePort: 3009,
    //   metadata: true
    // });
  
    // // Open the socket.
    // udpPortPy.open();
  
    // //Get tick from sync.hs Port:3002
    // UDPserver.on("listening", function () {
    //   let address = UDPserver.address();
    //   console.log(" ## -->   UDP server listening on " + address.address + ":" + address.port);
    // });
  
    // UDPserver.on("message", function (msg, rinfo) {
    //   tick.sockets.emit('/tick2react', {osc:msg});
    // });
  
    // UDPserver.on("disconnect", function (msg) {
    //   tick.sockets.emit('/tick2react-done', {osc:msg});
    // });
  
    // UDPserver.bind(3002);
  
    app.use(bodyParser.json())
  
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
  
    

    const sendPattern = (expr) => {
      SirenComm.siren_console.tidalSendLine(expr);
    };

    const startSiren = (b_config, reply) => {
      try{
        SirenComm.siren_console = new REPL();
        SirenComm.siren_console.start(b_config, reply);
      }catch(e) { 
        reply.sendStatus(500);
      }
    };
  
    const stopSiren = (req, reply) => {
      sendScPattern("s.quit;", null);
      stopPulse(null);
      SirenComm.siren_console = null;
    };

    const sendScPattern = (pattern, reply) => {
      SirenComm.siren_console.sendSC(pattern, reply);
    };

    // app.post('/processing', (req, reply) => {
    //   exec('processing-java --sketch=' + __dirname + '/processing --run');
  
    //   reply.status(200);
    // });
  
    // app.post('/sq', (req, reply) => {
    //   const {sq} = req.body;
  
    //   console.log(' ## -->   sq inbound:', sq);
  
    //   let pythonMessage = {
    //     address: "/roll",
    //     args: [{
    //       type: "s",
    //       value: sq
    //     }]
    //   };
    //   udpPortPy.send(pythonMessage);
      
    //   reply.status(200).json({'sq': sq});
    // });
  
    //Pattern Stream <->
    app.post('/patternstream', (req, reply) => {
      const { step, channel, patterns, global_mod } = req.body;
      let k = channel.name, v = step;
      
      const getParameters = (v) => {
        let param = [];
        _.map(_.split(v, /[`]+/g), (p1, p2) => {
          p1 = _.trim(p1);
    
          if(p1 !== "") param.push(p1);
        });
        return param;
      }
      const processParameters = (parameters, newCommand, cellItem) => {
        // For each parameter in parameter list
        _.forEach(parameters, function(value, i) {
          // Temporal parameter
          if(value === 't'){
            newCommand = _.replace(newCommand, new RegExp("`t`", "g"), channel.time);
          }
          // Random parameter
          else if(_.indexOf(cellItem[i], '|') === 0 && _.lastIndexOf(cellItem[i], '|') === cellItem[i].length-1)
          {
            cellItem[i] = cellItem[i].substring(1, _.indexOf(cellItem[i], '|', 1));
            let bounds = _.split(cellItem[i], ',');
            if(bounds[0] !== undefined && bounds[0] !== "" &&
                bounds[1] !== undefined && bounds[1] !== ""){
                  bounds[0] = parseFloat(bounds[0]);
                  bounds[1] = parseFloat(bounds[1]);
                  newCommand = _.replace(newCommand, new RegExp("`"+value+"`", "g"), _.random(_.min(bounds), _.max(bounds)));
            }
          }
          // Value parameter
          else {
            // Value is NOT provided in the gridcell
            if (cellItem[i] === '' || cellItem[i] === undefined) 	{
              // Look for the default value (e.g. "`x?slow 3`")
              // eslint-disable-next-line
              let re = new RegExp("`(("+value+"\?)[^`]+)`", "g"), match = re.exec(newCommand);
    
              // We have a default parameter ready
              if (match[1] !== undefined && _.indexOf(match[1], '?') !== -1) {
                const defaultValue = match[1].substring(_.indexOf(match[1], '?')+1);
                newCommand = _.replace(newCommand, new RegExp("`("+value+")[^`]*`", "g"), defaultValue);
              }
              // We have nothing, using most general parameter i.e. 1
              else {
                newCommand = _.replace(newCommand, new RegExp("`("+value+")[^`]*`", "g"), 1);
              }
            }
            // Value IS provided in the gridcell
            else {
              newCommand = _.replace(newCommand, new RegExp("`("+value+")[^`]*`", "g"), cellItem[i]);
            }
          }
        });
        return newCommand
      }
      // pattern name
      const cellName = getParameters(v)[0];
      if(channel.type === "PatternRoll") {
       
        //Pattern Roll function

      }
      else {
        // command of the pattern
        const pat = _.find(patterns, c => c.name === cellName);
        let newCommand;

        // CPS channel handling
        if( k === 'cps' || channel.type === 'cps'){
          newCommand = cellName;
          return  k + " " + newCommand;
        }
        // other channels
        else if(pat !== undefined && pat !== null && pat !== "" && v !== ""){
          let cellItem = _.slice(getParameters(v), 1);
          newCommand = pat.text;

          // Applies parameters
          if(pat.params !== '')
            newCommand = processParameters(_.concat( _.split(pat.params, ','),'t'), newCommand, cellItem);
          else
            newCommand = processParameters(['t'], newCommand, cellItem);

          // Math Parser
          // eslint-disable-next-line
          _.forEach(_.words(newCommand, /\&(.*?)\&/g), function(val, i){
            newCommand = _.replace(newCommand, val, _.trim(math.eval(_.trim(val,"&")),"[]"));
          })

          // Prepare transition, solo & globals
          let	transitionHolder, pattern;
          
          if( channel.type === "SuperCollider"){
            pattern = newCommand;
            sendSCPattern(pattern);
            reply.status(200).json({pattern: pattern, cid: channel.cid});
          }
          else if(channel.type === "FoxDot"){
            pattern = newCommand;
            //sendPythonPattern(pattern);
            reply.status(200).json({pattern: pattern, cid: channel.cid});
          }
          else if(channel.type === "Tidal"){
            if (channel.transition !== "" && channel.transition !== undefined ){
              let na = channel.name.substring(1,channel.name.length);
              transitionHolder = "t"+ na + " " + channel.transition + " $ ";
            }
            else {
              transitionHolder = k + " $ ";
            }
            if (global_mod.channels.includes(channel.cid.toString()) || global_mod.channels.includes(0)){
                newCommand = global_mod.transform + newCommand + global_mod.modifier;
              }
            pattern = transitionHolder + newCommand;
            tidalPatternQueue.push(pattern);
            reply.status(200).json({pattern: pattern, cid: channel.cid});
          }
          else{
            reply.sendStatus(400); 
          }
        }
      }
    });

    const startPulse = (reply) => {
      if(!nano) 
        nano = new NanoTimer();

      let count = 0;
      const callback = (nano) => {
        link_pulse.sockets.emit('pulse', {beat: 60,
                                          phase: count++,
                                          bpm: 120 });
      };
      nano.setInterval(callback, [nano], '125m');

      // let lastBeat = 0.0;
      // if(!link){
      //   const link = new abletonlink();
      // }
      // link.startUpdate(60, (beat, phase, bpm) => {
      //   beat = 0 ^ beat;
      //   if(0 < beat - lastBeat) {
      //     link_pulse.sockets.emit('pulse', {beat: beat,
      //                                       phase:phase,
      //                                       bpm: bpm });
      //       lastBeat = beat;
      //   }
      //   console.log("updated: ", beat, phase, bpm);
      // });
      reply.sendStatus(200);
    }
    
    const stopPulse = (reply) => {
      if(nano){
        nano.clearInterval();
        reply.sendStatus(200);  
      }
      else{
        reply.sendStatus(400);  
      }
      
    }
    app.post('/pulse', (req, reply) => {
      startPulse(reply);
    });
    app.post('/pulseStop', (req, reply) => {
      stopPulse(reply);
    });
    app.post('/global_ghc', (req, reply) => {
      const { pattern } = req.body;
      console.log(' ## -->   Pattern inbound:', pattern);
      tidalPatternQueue.push(pattern);
      reply.sendStatus(200);
    });
  
    app.post('/console_ghc', (req, reply) => {
      const { pattern } = req.body;
      console.log(' ## -->   Pattern inbound:', pattern);
      tidalPatternQueue.push(pattern);
      reply.sendStatus(200);
    });
  
    app.post('/console_sc', (req, reply) => {
      const { pattern } = req.body;
      console.log(' ## -->   SC Pattern inbound:', pattern);
      sendScPattern(pattern, reply);
    })
    // Save Paths
    app.post('/paths', (req, reply) => {
      const { paths } = req.body;
      if( paths ) {
        jsonfile.writeFileSync('./server/save/paths.json', 
                                paths , 
                                {flag: 'w'});

        reply.sendStatus(200);
      }
      else
        reply.sendStatus(400);
    });
    // Load Paths
    app.get('/paths', (req, reply) => {
      const obj = jsonfile.readFileSync('./server/save/paths.json');
      if ( obj )
        reply.status(200).json({ paths: obj });
      else
        reply.status(404).json({ paths: undefined });
    });
    // Save Scenes
    app.post('/scenes', (req, reply) => {
        const { scenes, patterns, channels, active_s } = req.body;

        if( scenes && patterns && channels) {
          jsonfile.writeFileSync('./server/save/scene.json', 
                                  { 'scenes': scenes, 
                                    'active_s': active_s, 
                                    'patterns': patterns,
                                    'channels': channels }, 
                                  {flag: 'w'});

          reply.sendStatus(200);
        }
        else
          reply.sendStatus(400);
    });
    // Load Scenes
    app.get('/scenes', (req, reply) => {
      const obj = jsonfile.readFileSync('./server/save/scene.json');
      if ( obj.scenes && obj.active_s && obj.patterns && obj.channels )
        reply.status(200).json({ 'scenes': obj.scenes,
                                 'active_s': obj.active_s, 
                                 'patterns': obj.patterns,
                                 'channels': obj.channels });
      else
        reply.status(404).json({ layouts: undefined });
    });

    // Save Console
    app.post('/console', (req, reply) => {
      const { sc, tidal } = req.body;
      console.log(tidal, sc, req.body);

      if( tidal !== undefined && sc !== undefined) {
        
        jsonfile.writeFileSync('./server/save/console.json', 
                                { 'sc': sc, 
                                  'tidal': tidal }, 
                                {flag: 'w'});

        reply.sendStatus(200);
      }
      else reply.sendStatus(400);
    });
    // Load Console
    app.get('/console', (req, reply) => {
      const obj = jsonfile.readFileSync('./server/save/console.json');
      if ( obj.tidal !== undefined && obj.sc !== undefined)
        reply.status(200).json({ 'sc': obj.sc,
                                 'tidal': obj.tidal });
      else
        reply.status(404).json({ layouts: undefined });
    });


    // Save Layouts
    app.post('/layouts', (req, reply) => {
        const { layouts } = req.body;

        if( layouts ) {
          jsonfile.writeFileSync('./server/save/layout.json', 
                                  layouts, 
                                  {spaces: 1, flag: 'w'});

          reply.status(200).json({ saved: true });
        }
        else
          reply.status(400).json({ saved: false });
    });

    // Load Layouts
    app.get('/layouts', (req, reply) => {
      const obj = jsonfile.readFileSync('./server/save/layout.json');
      if ( obj )
        reply.status(200).json({ layouts: obj });
      else
        reply.status(404).json({ layouts: undefined });
    });

    app.post('/init', (req, reply) => {
      const { b_config } = req.body;
      if( b_config ) {
        startSiren(b_config, reply);
      }
      else
        reply.sendStatus(400);
    });

    app.get('/quit', (req, reply) => {
      try{
        stopSiren(req, reply);
        reply.sendStatus(200);
      }catch(error) {
        reply.sendStatus(500);
      }
    });

    app.listen(3001, () => {
      console.log(` ## -->   Server started at http://localhost:${3001}`);
    });
  }

  // process.on('SIGINT', () => {
  //   if (TidalData.TidalConsole.repl !== undefined) TidalData.TidalConsole.repl.kill();
  //   process.exit(1)
  // });
// app.use("/", express.static(path.join(__dirname, "public")));
  module.exports = Siren;