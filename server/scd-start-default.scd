(
s.options.numBuffers = 2048 * 8;
s.options.maxNodes = 1024 * 4;
s.options.memSize = 131072 * 2;
s.quit;
s.boot;

s.waitForBoot {
	// ~bus = Bus.audio(s, [0,1]); // assuming stereo, expand if needed

	~dirt = SuperDirt(2, s);
	~dirt.loadSoundFiles("C:\\Users\\Mert\\Dropbox\\~siren\\pool1\\*");
	//~dirt.loadSoundFiles("C:\\Users\\Mert\\Dropbox\\Whalehouse\\99s\\*");
	s.sync;

	~dirt.start(57120, 2);
	"SUPERDIRT LOADED".postln;

	// 1.wait;
	// s.latency = 0.3;
	// MIDIClient.init;

	// "C:\\Github\\Siren\\deps\\SynthDefs\\custominputs.scd".load;
	// "C:\\Github\\Siren\\deps\\SynthDefs\\customfx.scd".load;
	// "C:\\Github\\Siren\\deps\\SynthDefs\\customsynth.scd".load;
	// "C:\\Github\\Siren\\deps\\SynthDefs\\dx7\\DX7MIDI.scd".load;
	// "DX7 MIDI LOADED".postln;

	//"SD MIDI".postln;
	//~midiOut1 = MIDIOut.newByName("USB MIDI Device", "Port 1");
	//~midiOut2 = MIDIOut.newByName("IAC", "Bus 1"); // replace by your devices
	//~midiOut1 = MIDIOut.newByName("USB MIDI Device", "Port 1");
	//"C:\\Github\\Siren\\deps\\SynthDefs\\sdmidi.scd".load;

	0.2.wait;
	"SIREN LOADED".postln;
	s.volume = -12;
	// SuperDirt.default = ~dirt;

	//~dirt.orbits[0].outBus = ~bus;
	//~dirt.orbits[1].outBus = ~bus;
	//~dirt.orbits[2].outBus = ~bus;
	//~dirt.orbits[3].outBus = ~bus;
	//~dirt.orbits[4].outBus = ~bus;

	// OSCFunc.trace(true);

	// this example is basically like OSCFunc.trace but filters out
	// /status.reply messages
	(
		f = { |msg, time, addr|
			if(msg[0] == '/play2') {
				"time: % sender: %\nmessage: %\n".postf(time, addr, msg);
			}
		};
		thisProcess.addOSCRecvFunc(f);
	);
	s.sendMsg("/notify", 0);
};
)

