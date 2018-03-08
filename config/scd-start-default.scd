(
//s.options.numInputBusChannels = 6;
s.options.numInputBusChannels = 0;
s.options.numOutputBusChannels = 14;
s.options.numBuffers = 2048 * 64;
s.options.maxNodes = 1024 * 32;
s.options.memSize = 131072 * 16;
s.quit;

s.waitForBoot {

 ~dirt = SuperDirt(2, s);
 ~dirt.loadSoundFiles("/Users/canince/Dropbox/\~siren/pool1/*");
 //~dirt.loadSoundFiles("/Users/canince/Dropbox/\~siren/pool2/*");
 //~dirt.loadSoundFiles("/Users/canince/Dropbox/\~siren/pool3/*");
 s.sync;
 ~dirt.start(57120, (0,2 .. 13));
  "SUPERDIRT LOADED".postln;
  1.wait;
  s.makeGui;
  s.meter;
  s.scope;
  s.latency = 0.3;
  
  //"/Users/canince/documents/git/Siren/deps/SynthDefs/custominputs.scd".load;
  "/Users/canince/documents/git/Siren/deps/SynthDefs/customfx.scd".load;
  "/Users/canince/documents/git/Siren/deps/SynthDefs/customsynth.scd".load;
  //"/Users/canince/Documents/git/Siren/deps/SynthDefs/dx7/DX7MIDI.scd".load;
  //"DX7 MIDI LOADED".postln;
  "/Users/canince/documents/git/Siren/deps/SynthDefs/sdmidi.scd".load;
  "SD MIDI LOADED".postln;

  0.2.wait;
  "SIREN LOADED".postln;
  
  s.volume = -12;
  SuperDirt.default = ~dirt;

  //~d1 = ~dirt.orbits[0];

  OSCFunc.trace(true);
  s.sendMsg("/notify", 1);
  };



)
