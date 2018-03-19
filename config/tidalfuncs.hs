
import Sound.Tidal.Chords
import Sound.Tidal.Scales
import Sound.Tidal.Utils
import Data.Maybe (fromMaybe, maybe, isJust, fromJust)
import Control.Applicative

let cap a b p = within (0.25, 0.75) (slow 2 . rev . stut 8 a b) p
    cap3 a b p = within (0.66, 0.97) (hurry 0.5 . rev . stut 8 a b) p
    toggle t f p = if (1 == t) then f $ p else id $ p
    toggles p xs = unwrap $ (xs !!!) <$> p
    (!!!) xs n = xs !! (n `mod` length xs)
    mutelist xs = filterValues (\x -> notElem x xs)
    mute x = filterValues (x /=)
    capj a b p = within (0.5, 0.75) (juxBy 0.35 (rev) . stut 8 a b) p
    capf a b p = within (0.75, 0.95) (hurry 0.5 . stut 4 a b) p
    capx a b c d e p = within (a, b) (slow 2 . rev . stut c d e) p
    capz a b p = within (0.5, 0.85) (degradeBy 0.5 . iter 3 . stut 4 a b) p
    layer fs p = stack $ map ($ p) fs
    foldpxx a f p = superimpose (((a/2 + a*2) ~>) . f) $ superimpose (((a + a/2) ~>) . f) $ p
    foldpx a p = foldpxx a ((|*| gain "0.7") . (|=| end "0.2") . (|=| speed "0.725")) p
    foldp p = foldpx 0.125 p
    foldcxx a f p = off 0.5 (((a/2 + a*2) ~>) . f) $ superimpose (((a + a/2) ~>) . f) $ p
    foldcx a p = foldcxx a ((|*| end "0.2") . (|=| begin "0.05") . (|*| speed "1.5")) p
    foldc p = foldcx 0.33 p
    mfold p = foldEvery [3,4] (0.25 <~) $ p
    shift p = (1024 <~)  p
    shift' x p = (x <~) p
    ccn = ctlNum
    ccv = control
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



