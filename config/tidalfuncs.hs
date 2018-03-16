
import Sound.Tidal.Chords
import Sound.Tidal.Scales
import Sound.Tidal.Utils
import Data.Maybe (fromMaybe, maybe, isJust, fromJust)
import Control.Applicative

let cap a b p = within (0.25, 0.75) (slow 2 . rev . stut 8 a b) p
    cap3 a b p = within (0.66, 0.87) (slow 3 . rev . stut 8 a b) p
    toggle t f p = if (1 == t) then f $ p else id $ p
    toggles p xs = unwrap $ (xs !!!) <$> p
    (!!!) xs n = xs !! (n `mod` length xs)
    mutelist xs = filterValues (\x -> notElem x xs)
    mute x = filterValues (x /=)
    capj a b p = within (0.5, 0.75) (jux(rev) . stut 8 a b) p
    capf a b p = within (0.75, 0.95) (fast 2 . stut 4 a b) p
    capx a b c d e p = within (a, b) (slow 2 . rev . stut c d e) p
    capz a b p = within (0.5, 0.85) (trunc 0.5 . iter 3 . stut 4 a b) p
    layer fs p = stack $ map ($ p) fs
    foldpxx a f p = superimpose (((a/2 + a*2) ~>) . f) $ superimpose (((a + a/2) ~>) . f) $ p
    foldpx a p = foldpxx a ((|*| gain "0.7") . (|=| end "0.2") . (|*| speed "1.25")) p
    foldp p = foldpx 0.125 p
    foldcxx a f p = superimpose (((a/2 + a*2) ~>) . f) $ superimpose (((a + a/2) ~>) . f) $ p
    foldcx a p = foldcxx a ((|*| end "0.2") . (|=| begin "0.05") . (|*| speed "2")) p
    foldc p = foldcx 0.33 p
    shift p = (1024 <~)  p
    shift' x p = (x <~) p
    mfold p = foldEvery [3,4] (0.25 <~) $ p
    mcmd = midicmd "[noteOn, control]"
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
    listToChord = stack . map atom
    contToPat  n p = round <$> discretise n p
    contToPat' a b = round <$> struct a b
    c2p  = contToPat
    c2p' = contToPat'
    tremolo' r d = tremolorate r # tremolodepth d
    phaser'  r d = phaserrate  r # phaserdepth  d
    saturate amount = superimpose ((# shape amount).(# hcutoff 6500).(|*| gain 0.9))
    scaleP' sp p = (\n scalePat -> noteInScale scalePat n) <$> p <*> sp
   where octave s x = x `div` (length s)
         noteInScale s x = (s !!! x) + (12 * octave s x)
    up' p = up (fmap fromIntegral p)
    contToPat  n p = round <$> discretise n p
    contToPat' a b = round <$> struct a b
    c2p  = contToPat
    c2p' = contToPat'
    scaleP' sp p = (\n scalePat -> noteInScale scalePat n) <$> p <*> sp
   where octave s x = x `div` (length s)
         noteInScale s x = (s !!! x) + (12 * octave s x)
    harmonise ch p = scaleP ch p + chord (flip (!!!) <$> p <*> keyL ch)         


