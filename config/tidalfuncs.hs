
import Sound.Tidal.Chords
import Sound.Tidal.Utils
import Data.Maybe (fromMaybe, maybe, isJust, fromJust)
import Control.Applicative

let cap a b p = within (0.25, 0.75) (slow 2 . rev . stut 8 a b) p
    toggle t f p = if (1 == t) then f $ p else id $ p
    toggles p xs = unwrap $ (xs !!!) <$> p
    (!!!) xs n = xs !! (n `mod` length xs)
    mutelist xs = filterValues (\x -> notElem x xs)
    mute x = filterValues (x /=)
    capj a b p = within (0.5, 0.75) (jux(rev) . stut 8 a b) p
    capf a b p = within (0.75, 0.95) (fast 2 . stut 4 a b) p
    cap' a b c d e p = within (a, b) (slow 2 . rev . stut c d e) p
    capz a b p = within (0.5, 0.85) (trunc 0.5 . iter 3 . stut 4 a b) p
    layer fs p = stack $ map ($ p) fs
    foldp'' a f p = superimpose (((a/2 + a*2) ~>) . f) $ superimpose (((a + a/2) ~>) . f) $ p
    foldp' a p = foldp'' a ((|*| gain "0.7") . (|=| end "0.2") . (|*| speed "1.25")) p
    foldp p = foldp' 0.125 p
    foldc'' a f p = superimpose (((a/2 + a*2) ~>) . f) $ superimpose (((a + a/2) ~>) . f) $ p
    foldc' a p = foldc'' a ((|*| end "0.2") . (|=| begin "0.05") . (|*| speed "2")) p
    foldc p = foldc' 0.33 p
    wchoose weights values = choose $ concatMap (\x -> replicate (fst x) (snd x)) (zip weights values)
    jit start amount p = within (start, (start + 0.5)) (trunc (amount)) p
    chordTable = Chords.chordTable
    scaleTable = Scales.scaleTable
    majork = ["major", "minor", "minor", "major", "major", "minor", "dim7"]
    minork = ["minor", "minor", "major", "minor", "major", "major", "major"]
    doriank = ["minor", "minor", "major", "major", "minor", "dim7", "major"]
    phrygiank = ["minor", "major", "major", "minor", "dim7", "major", "minor"]
    lydiank = ["major", "major", "minor", "dim7", "major", "minor", "minor"]
    mixolydiank = ["major", "minor", "dim7", "major", "minor", "minor", "major"]
    locriank = ["dim7", "major", "minor", "minor", "major", "major", "minor"]
    keyTable = [("major", majork),("minor", minork),("dorian", doriank),("phrygian", phrygiank),("lydian", lydiank),("mixolydian", mixolydiank),("locrian", locriank),("ionian", majork),("aeolian", minork)]
    keyL p = (\name -> fromMaybe [] $ lookup name keyTable) <$> p
    harmonise ch p = scaleP ch p + chord (flip (!!!) <$> p <*> keyL ch)
    scaleUP c p = fromIntegral <$> scaleP c p
    chordP p = unwrap $ fmap (\name -> stack $ (pure <$>) $ fromMaybe [] $ lookup name chordTable) p
    fillIn p' p = struct (splitQueries $ Pattern (f p)) p'
    rloop (s, e) d = (_slow ((e-s)/d) . zoom ((s/d), (e/d)))
    listToChord = stack . map atom
    contToPat  n p = round <$> discretise n p
    contToPat' a b = round <$> struct a b
    c2p  = contToPat
    c2p' = contToPat'
    adsr = grp [attack_p,  decay_p, sustain_p, release_p]
    del  = grp [delay_p,   delaytime_p, delayfeedback_p]
    scc  = grp [shape_p,   coarse_p, crush_p]
    lpf  = grp [cutoff_p,  resonance_p]
    bpf  = grp [bandf_p,   bandq_p]
    hpf  = grp [hcutoff_p, hresonance_p]
    spa  = grp [speed_p,   accelerate_p]
    rvb  = grp [room_p,    size_p]
    gco  = grp [gain_p,    cut_p, orbit_p]
    go   = grp [gain_p,    orbit_p]
    io   = grp [begin_p,   end_p]
    focus (a,b) p = slow (pure $ b-a) $ zoom (a,b) p
    adsr' a d s r = attack a # decay d # sustain s # release r 
    del' l t f  = delay l # delaytime t # delayfeedback f
    scc' s c c' = shape s # coarse c # crush c'
    lpf' c r = cutoff c  # resonance r
    bpf' f q = bandf f   # bandq q
    hpf' c r = hcutoff c # hresonance r
    spa' s a = speed s   # accelerate a
    gco' g c o  = gain g # cut c # orbit o
    go' g o  = gain g    # orbit o
    rvb' r s = room r    # size s
    io' i o  = begin i   # end o
    eq h b l q = cutoff l # resonance q # bandf b # bandq q # hcutoff h # hresonance q
    tremolo' r d = tremolorate r # tremolodepth d
    phaser'  r d = phaserrate  r # phaserdepth  d
    scaleP' sp p = (\n scalePat -> noteInScale scalePat n) <$> p <*> sp
   where octave s x = x `div` (length s)
         noteInScale s x = (s !!! x) + (12 * octave s x)


