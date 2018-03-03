let (freeze, freeze_p) = pF "freeze" (Just 0)
    (ff, ff_p) = pF "ff" (Just 0)
    (bsize, bsize_p) = pF "bsize" (Just 2048)
    (ts, ts_p) = pF "ts" (Just 1)
    (octer, octer_p) = pF "octer" (Just 1)
    (octersub, octersub_p) = pF "octer" (Just 1)
    (octersubsub, octersubsub_p) = pF "octersubsub" (Just 1)
    (kcutoff, kcutoff_p) = pF "kcutoff" (Just 5000)
    (krush, krush_p) = pF "krush" (Just 1)
    (wshap, wshap_p) = pF "wshap" (Just 1)
    (maxdel, maxdel_p) = pF "maxdel" (Just 10)
    (edel, edel_p) = pF "edel" (Just 1)
    (thold, thold_p) = pF "thold" (Just 0)
    (fm, fm_p) = pF "fm" (Just 0)
    (fmf, fmf_p) = pF "fmf" (Just 800)
    (comp, comp_p) = pF "comp" (Just 0)
    (rect, rect_p) = pF "rect" (Just 0)
    (tlen, tlen_p) = pF "tlen" (Just 1)
    (trate, trate_p) = pF "trate" (Just 12)
    (conv, conv_p) = pF "conv" (Just 0)
    (xsdelay, xsdelay_p) = pF "xsdelay" (Just 0)
    (tsdelay, tsdelay_p) = pF "tsdelay" (Just 0)
    (comb, comb_p) = pF "comb" (Just 0)
    (smear, smear_p) = pF "smear" (Just 0)
    (scram, scram_p) = pF "scram" (Just 0)
    (lbrick, lbrick_p) = pF "lbrick" (Just 0)
    (hbrick, hbrick_p) = pF "hbrick" (Just 0)
    (binshift, binshift_p) = pF "binshift" (Just 0)
    (binscr, binscr_p) = pF "binscr" (Just 0)
    (binshf, binshf_p) = pF "binshf" (Just 0)
    (binfrz, binfrz_p) = pF "binfrz" (Just 0)
    (damp, damp_p) = pF "damp" (Just 0.69)
    (early, early_p) = pF "early" (Just 0.707)
    (mdepth, mdepth_p) = pF "mdepth" (Just 0)
    (mfreq, mfreq_p) = pF "mfreq" (Just 2)
    (highc, highc_p) = pF "highc" (Just 2000)
    (lowc, lowc_p) = pF "lowc" (Just 500)
    (midx, midx_p) = pF "midx" (Just 500)    
    (highx, highx_p) = pF "highx" (Just 2000)
    (lowx, lowx_p) = pF "lowx" (Just 500)
    (sep, sep_p) = pF "sep" (Just 0.012)
    (midicmd, midicmd_p) = pS "midicmd" (Nothing)
    (chan, chan_p) = pF "chan" (Nothing)
    (progNum, progNum_p) = pF "progNum" (Nothing)
    (val, val_p) = pF "val" (Nothing)
    (uid, uid_p) = pF "uid" (Nothing)
    (array, array_p) = pF "array" (Nothing)
    (frames, frames_p) = pF "frames" (Nothing)
    (seconds, seconds_p) = pF "seconds" (Nothing)
    (minutes, minutes_p) = pF "minutes" (Nothing)
    (hours, hours_p) = pF "hours" (Nothing)
    (frameRate, frameRate_p) = pF "frameRate" (Nothing)
    (songPtr, songPtr_p) = pF "songPtr" (Nothing)
    (ctlNum, ctlNum_p) = pF "ctlNum" (Nothing)
    (control, control_p) = pF "control" (Nothing)
    (midichan, midichan_p) = pF "midichan" (Nothing)