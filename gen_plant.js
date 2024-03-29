// This contains the code for generating a random plant badge.
// I wrote it with limited internet access, meaning that it looks like Python and uses no clever Javascript tricks.
// You've been warned!

// The colors we'll be replacing. Touch at your peril!
var base_foliage_palette = ["#aed740", "#76c935", "#50aa37", "#2f902b"];
var base_accent_palette = ["fef4cc", "fde47b", "ffd430", "ecb600"];
var base_feature_palette = ["f3addd", "d87fbc", "c059a0", "aa3384"];
var overall_palette = base_foliage_palette.concat(base_accent_palette).concat(base_feature_palette);

var work_canvas_size = 32;  // in pixels

// A pixel of these colors indicates we should place the corresponding feature type
var place_complex_feature = "ff943a";
var place_simple_feature = "e900ff";

// Holder for all the images we'll need
var refs = {};

// In case of error (probably CORS)
const BAD_IMG_URL = "https://i.imgur.com/kxStIJE.png";

// old spotted mushroom: https://i.imgur.com/MyF1tCA.png
// old medium tree with the wonky trunk: https://i.imgur.com/ZMe5J0j.png
// old medium tree with wonky trunk #2 (49 0-idx) https://i.imgur.com/Ps4w9LV.png


// Javascript can't access images by path.
// This workaround is hideous, but what can ya do :) (while hosting to github and not using ajax, I mean)
all_foliage = ["https://i.imgur.com/PabdLnL.png", "https://i.imgur.com/WN2m2Aa.png", "https://i.imgur.com/wsC3ifp.png",
               "https://i.imgur.com/NFM09J5.png", "https://i.imgur.com/urBlTiV.png", "https://i.imgur.com/kyfs2Yl.png",
               "https://i.imgur.com/nMW2bBb.png", "https://i.imgur.com/tBQb6yy.png", "https://i.imgur.com/5j6u58a.png",
               "https://i.imgur.com/Mb1wqi1.png", "https://i.imgur.com/Rk7vvo3.png", "https://i.imgur.com/DdEYVYA.png",
               "https://i.imgur.com/IF5MQWY.png", "https://i.imgur.com/Z6njdmV.png", "https://i.imgur.com/cDAqt4U.png",
               "https://i.imgur.com/117aiCY.png", "https://i.imgur.com/7ZrX05Y.png", "https://i.imgur.com/ccBvzqU.png",
               "https://i.imgur.com/wLsuJSX.png", "https://i.imgur.com/dxJbfgi.png", "https://i.imgur.com/l1MK3yJ.png",
               "https://i.imgur.com/kTbrzeL.png", "https://i.imgur.com/s4Uav2q.png", "https://i.imgur.com/6GPgZzr.png",
               "https://i.imgur.com/E6ikrq8.png", "https://i.imgur.com/VvrBOM2.png", "https://i.imgur.com/5y1UeDM.png",
               "https://i.imgur.com/uYswz0s.png", "https://i.imgur.com/qGczjJf.png", "https://i.imgur.com/PaWgGAq.png",
               // Row below is zero-indexed 30, 31, 32
               "https://i.imgur.com/0fBhPPY.png", "https://i.imgur.com/NzGJLcK.png", "https://i.imgur.com/62lbxgE.png",
               "https://i.imgur.com/t6NI9ZW.png", "https://i.imgur.com/ubsbt7W.png", "https://i.imgur.com/MAqn21X.png",
               "https://i.imgur.com/xEnajhL.png", "https://i.imgur.com/wHwGcaT.png", "https://i.imgur.com/DNJakBN.png",
               "https://i.imgur.com/65fD3Wt.png", "https://i.imgur.com/GhHUZAm.png", "https://i.imgur.com/Wtmyg00.png",
               "https://i.imgur.com/k7FDQzk.png", "https://i.imgur.com/hnTjsH8.png", "https://i.imgur.com/yIZJ19G.png",
               "https://i.imgur.com/mQaUMgT.png", "https://i.imgur.com/t2NAP7b.png", "https://i.imgur.com/abzacy8.png",
               "https://i.imgur.com/Wax3h14.png", "https://i.imgur.com/LXwHQjn.png", "https://i.imgur.com/3RpiB9t.png",
               "https://i.imgur.com/LIicGxR.png", "https://i.imgur.com/2XeqnbE.png", "https://i.imgur.com/Zal2kLb.png",
               "https://i.imgur.com/thX8zVH.png", "https://i.imgur.com/YsmG4bZ.png", "https://i.imgur.com/iv73TrE.png",
               "https://i.imgur.com/E96bbUd.png", "https://i.imgur.com/7amn8lf.png", "https://i.imgur.com/EaOoji3.png",
                // Row below is zero-indexed 60, 61, 62
               "https://i.imgur.com/IvZmYJ0.png", "https://i.imgur.com/5CYK3pl.png", "https://i.imgur.com/JfQb93F.png",
               "https://i.imgur.com/HaOVemI.png", "https://i.imgur.com/FSFBSlo.png", "https://i.imgur.com/cgkP5B6.png",
               "https://i.imgur.com/DynbJCl.png", "https://i.imgur.com/k9w5afZ.png", "https://i.imgur.com/CGp6xFF.png",
               "https://i.imgur.com/tASn4zC.png", "https://i.imgur.com/Muj9pgt.png", "https://i.imgur.com/FL4BAHX.png",
               "https://i.imgur.com/qqUgOYg.png", "https://i.imgur.com/LAQZ4s7.png", "https://i.imgur.com/9NyqPmf.png",
               "https://i.imgur.com/dbS96tA.png", "https://i.imgur.com/1Y5ls06.png", "https://i.imgur.com/EhMFu9B.png",
                // 78, 79, 80
               "https://i.imgur.com/qgJ3827.png", "https://i.imgur.com/XyaY9kF.png", "https://i.imgur.com/BhMMhrn.png",
               "https://i.imgur.com/RNv63mA.png", "https://i.imgur.com/t5T7Vb7.png", "https://i.imgur.com/Ox6ArQN.png",
               "https://i.imgur.com/WKvhSXz.png", "https://i.imgur.com/Fz6ldEU.png", "https://i.imgur.com/XDenv4L.png",
               "https://i.imgur.com/qT4F8Wh.png", "https://i.imgur.com/0j5Khpm.png", "https://i.imgur.com/NhefjfV.png",
               "https://i.imgur.com/C95Je1X.png", "https://i.imgur.com/UkOY96i.png", "https://i.imgur.com/0Fml1MI.png",
               "https://i.imgur.com/N8Blg9w.png", "https://i.imgur.com/xNwcdSt.png", "https://i.imgur.com/gic1Bgj.png",
               // 96, 97, 98
               "https://i.imgur.com/NDnKMrY.png", "https://i.imgur.com/MmN2A17.png", "https://i.imgur.com/HNkWjgK.png",
               "https://i.imgur.com/aoTsd6a.png", "https://i.imgur.com/1NZlHPp.png", "https://i.imgur.com/ShUbORE.png",
               "https://i.imgur.com/qLIC1dw.png", "https://i.imgur.com/KbqDATE.png", "https://i.imgur.com/jDtvMDk.png",
               "https://i.imgur.com/BFJa2xX.png", "https://i.imgur.com/C0Elhph.png", "https://i.imgur.com/4yp3rQR.png",
               // 108, 109, 110
               "https://i.imgur.com/AmgtEol.png", "https://i.imgur.com/Oc9hXis.png", "https://i.imgur.com/QEXAoEh.png",
               "https://i.imgur.com/oSwzqLT.png", "https://i.imgur.com/Fqj9xcu.png", "https://i.imgur.com/eDs8qlm.png",
               "https://i.imgur.com/usTpyqu.png", "https://i.imgur.com/KdUmQ0G.png", "https://i.imgur.com/ncvp3HG.png",
               "https://i.imgur.com/h7rKTLT.png", "https://i.imgur.com/azU9uXZ.png", "https://i.imgur.com/8QB13Ym.png",
               "https://i.imgur.com/OmvleHV.png", "https://i.imgur.com/wbFJFwo.png", "https://i.imgur.com/qtejXew.png",
               // 123
               "https://i.imgur.com/wEkbiKg.png", "https://i.imgur.com/ZNsUIoX.png", "https://i.imgur.com/tKKBGYy.png",
               "https://i.imgur.com/xSkGKFE.png", "https://i.imgur.com/FiC0yXS.png", "https://i.imgur.com/hXw6SDR.png",
               "https://i.imgur.com/OWKfuqG.png", "https://i.imgur.com/IVsCxl7.png", "https://i.imgur.com/buYHu4d.png",
               "https://i.imgur.com/r9apGXo.png", "https://i.imgur.com/St7i7Sn.png", "https://i.imgur.com/K9yCFDg.png",
               "https://i.imgur.com/RRCQvhA.png", "https://i.imgur.com/08TmImE.png", "https://i.imgur.com/gDYO9gF.png",
               "https://i.imgur.com/wORUHzS.png", "https://i.imgur.com/tqiMbgP.png", "https://i.imgur.com/6dYyYt1.png",
               // 141
               "https://i.imgur.com/S01WpzA.png", "https://i.imgur.com/BKrhChN.png", "https://i.imgur.com/g07biTg.png",
               "https://i.imgur.com/ieCLRr4.png", "https://i.imgur.com/vrsojTx.png", "https://i.imgur.com/JdBQXD9.png",
               "https://i.imgur.com/yHAyHer.png", "https://i.imgur.com/te0LiY6.png", "https://i.imgur.com/DVXz8Nr.png",
               "https://i.imgur.com/snN8fJY.png", "https://i.imgur.com/wNf7FXA.png",
            
               "https://i.imgur.com/mrELvLA.png",  "https://i.imgur.com/okGXTzn.png", "https://i.imgur.com/nLv8jTq.png",
               "https://i.imgur.com/pn3p8UY.png", "https://i.imgur.com/kyORogL.png", "https://i.imgur.com/LlmBQcI.png",
               "https://i.imgur.com/IcEfMHF.png", "https://i.imgur.com/cbnv85f.png", "https://i.imgur.com/U1qlGFl.png",
               "https://i.imgur.com/haldzXm.png", "https://i.imgur.com/ek1pZLj.png", "https://i.imgur.com/KsXLcP0.png",
               "https://i.imgur.com/LQI1nOE.png", "https://i.imgur.com/DmmYJoM.png", "https://i.imgur.com/LDcdn0f.png",
               "https://i.imgur.com/qjFXwnr.png", "https://i.imgur.com/xXVUKvX.png", "https://i.imgur.com/bykT82i.png",
               "https://i.imgur.com/aqBx6RF.png", "https://i.imgur.com/bznTRSu.png", "https://i.imgur.com/DKWN3yy.png",
               
               "https://i.imgur.com/6MxvqX9.png", "https://i.imgur.com/X7crH2b.png", "https://i.imgur.com/JglXWHa.png",
               "https://i.imgur.com/ejACFPc.png", "https://i.imgur.com/lF4kM12.png"];

var all_named = {"nigel": "https://i.imgur.com/zYolkmE.png", "vine_supporter": "https://i.imgur.com/72uDqMq.png", "root_supporter": "https://i.imgur.com/y9eN0Ae.png",
             "bone_supporter": "https://i.imgur.com/EzL4aw0.png", "stone_supporter": "https://i.imgur.com/xyB8zjm.png",
             "bunbun": "https://i.imgur.com/Qn23rZb.png", "bunbun_black": "https://i.imgur.com/S6vpB9i.png", "bunbun_white": "https://i.imgur.com/1xnwUWv.png",
             "grazing_goat": "https://i.imgur.com/6LsCzM6.png", "grazing_goatbrown": "https://i.imgur.com/ZbLlfdq.png",
             "grazing_goatspotted": "https://i.imgur.com/wR92Own.png", "micro_goat": "https://i.imgur.com/0MN5MiP.png",
             "pots'n_pans": "https://i.imgur.com/sbh42Qu.png",
             "male_cardinal": "https://i.imgur.com/0WaJacd.png", "female_cardinal": "https://i.imgur.com/1RcilE0.png", "griffon_vulture": "https://i.imgur.com/a01VWAo.png", "turkey_vulture": "https://i.imgur.com/a6jGcCr.png",
             "summer_col": "https://i.imgur.com/5hsYi2x.png", "winter_col": "https://i.imgur.com/PIvtEQp.png", "autumn_col": "https://i.imgur.com/SM9CLUW.png", "spring_col": "https://i.imgur.com/z22QWj1.png",
             "stone_simple_bench": "https://i.imgur.com/CxUk9nb.png", "sandy_simple_bench": "https://i.imgur.com/PdgM5Dm.png", "ice_simple_bench": "https://i.imgur.com/Z9KDYr7.png", "growth_simple_bench": "https://i.imgur.com/uGxm8Pp.png", "onyx_simple_bench": "https://i.imgur.com/ZHHWzqf.png", "crystal_simple_bench": "https://i.imgur.com/LewbVev.png",
             "light_uni": "https://i.imgur.com/h25jofW.png", "dark_uni": "https://i.imgur.com/wZDto2T.png",
             "big_fountain": "https://i.imgur.com/Gb64tAf.png", "bunbun_grass": "https://i.imgur.com/dzonSfL.png", "bunbun_sakura": "https://i.imgur.com/tFsZkwX.png", "bunbun_snow": "https://i.imgur.com/w5HmhlH.png",
             "plain_big_bone": "https://i.imgur.com/7uVtIgT.png", "mossy_big_bone": "https://i.imgur.com/TCwHxZY.png", "bloody_big_bone": "https://i.imgur.com/Ra1hOOE.png", "misty_big_bone": "https://i.imgur.com/Pj6BCRJ.png",
             "shaded_big_bone": "https://i.imgur.com/ZTR99ug.png",
             "giant_gold": "https://i.imgur.com/BJt4LwQ.png", "giant_rosegold": "https://i.imgur.com/mswDGRW.png", "giant_silver": "https://i.imgur.com/I4cluBv.png", "giant_copper": "https://i.imgur.com/0Ymk8oM.png", "giant_copperhalf": "https://i.imgur.com/kU4sPSw.png",
             "giant_copperfull": "https://i.imgur.com/JXyQeXD.png", "giant_copperblended": "https://i.imgur.com/DDqoxuB.png", "giant_cobalt": "https://i.imgur.com/r8tfKle.png", "giant_iron": "https://i.imgur.com/dQy3aKl.png",
             // Conservation set
             "shale_rock_1": "https://i.imgur.com/kWy5LYK.png", "shale_rock_2": "https://i.imgur.com/FvM0af4.png", "shale_rock_3": "https://i.imgur.com/gOI3GWA.png", "shale_rock_4": "https://i.imgur.com/rdHtEmf.png",
             "limestone_rock_1": "https://i.imgur.com/e8WGNIX.png", "limestone_rock_2": "https://i.imgur.com/z9G8xUz.png", "limestone_rock_3": "https://i.imgur.com/4eS8voG.png", "limestone_rock_4": "https://i.imgur.com/zisb1Sm.png",
             "obsidian_rock_1": "https://i.imgur.com/VJbGsNP.png", "obsidian_rock_2": "https://i.imgur.com/QD7qunp.png", "obsidian_rock_3": "https://i.imgur.com/wVqYlpE.png", "obsidian_rock_4": "https://i.imgur.com/G3YixT4.png",
             "aventurine_rock_1": "https://i.imgur.com/x8PAyAR.png", "aventurine_rock_2": "https://i.imgur.com/FAuYH6y.png", "aventurine_rock_3": "https://i.imgur.com/SiOomwa.png", "aventurine_rock_4": "https://i.imgur.com/XBTiOM1.png",
             "shale_cairn": "https://i.imgur.com/mPCJ6xK.png", "limestone_cairn": "https://i.imgur.com/YY3aAhM.png", "obsidian_cairn": "https://i.imgur.com/z85y3DB.png", "aventurine_cairn": "https://i.imgur.com/xfoVNh6.png",
             "shale_spring": "https://i.imgur.com/SS5wlwB.png", "limestone_spring": "https://i.imgur.com/YvFBGtb.png", "obsidian_spring": "https://i.imgur.com/HDguTqn.png","aventurine_spring": "https://i.imgur.com/aqWObIl.png",
             "simple_fence": "https://i.imgur.com/WE4YzQb.png", "simple_fence_broken": "https://i.imgur.com/E1E1q3w.png", "simple_signpost": "https://i.imgur.com/LrdkTBi.png", "shale_birdbath": "https://i.imgur.com/7P7OqPQ.png",
             "bleached_skull": "https://i.imgur.com/kIgNges.png", "bleached_ribs": "https://i.imgur.com/gb5h2ct.png", "burnt_skull": "https://i.imgur.com/swmqdOf.png", "burnt_ribs": "https://i.imgur.com/yCHsvce.png",
             "lawn_deco": "https://i.imgur.com/A5SsKVL.png", "lawn_sin": "https://i.imgur.com/hAqeR7Z.png", "peacock": "https://i.imgur.com/AqGytLV.png",
             "brown_cat": "https://i.imgur.com/has3IZH.png", "colorpoint_cat": "https://i.imgur.com/alQoAKw.png", "grey_cat": "https://i.imgur.com/IGjw0kH.png",
             "ginger_cat": "https://i.imgur.com/XMZSI4u.png", "tuxedo_cat": "https://i.imgur.com/H93FT89.png",
             "robin": "https://i.imgur.com/jtY79vc.png", "bluebird": "https://i.imgur.com/MMdnP2E.png", "gardeneel": "https://i.imgur.com/P5j7JGs.png",
             "bubble_column": "https://i.imgur.com/iDCiNK0.png", "bubble_cloud": "https://i.imgur.com/WbUJsff.png",
             "punkle": "https://i.imgur.com/mGu0QXM.png", "grummi": "https://i.imgur.com/XZqToAL.png", "pip": "https://i.imgur.com/5PRAPj7.png",
             "tlik": "https://i.imgur.com/MaDQORq.png", "the_council": "https://i.imgur.com/P7eG6uq.png", "rupert": "https://i.imgur.com/CnfSm6K.png",
             "rupert_ascendant": "https://i.imgur.com/Na1gT9v.png",
             "oriole": "https://i.imgur.com/KTdWhYB.png", "blackbird": "https://i.imgur.com/GvnkSA7.png", "cardinal": "https://i.imgur.com/Zu9xxP5.png",
             "spoop_one": "https://i.imgur.com/2BYYsbd.png", "spoop_two": "https://i.imgur.com/iUxGYsi.png", "spoop_three": "https://i.imgur.com/mQRx5sJ.png",
             "ghost_one": "https://i.imgur.com/KrLlzh3.png","ghost_two": "https://i.imgur.com/ppt6svW.png", "ghost_three": "https://i.imgur.com/6gjzp4g.png",
             "lamppost_glow": "https://i.imgur.com/cOcM3OH.png", "pumpkin": "https://i.imgur.com/FdHd60J.png",
             "tamarix_g": "https://i.imgur.com/sYgm6Vn.png", "rhizophora_m": "https://i.imgur.com/fysAyNU.png", "capparis": "https://i.imgur.com/lMlO3l6.png",
             "vachellia_n": "https://i.imgur.com/IbCbKic.png", "haloxylon": "https://i.imgur.com/1WxCgPc.png", "silphium": "https://i.imgur.com/QRu7OJ4.png",
             "meat_stalagmite_left": "https://i.imgur.com/B2Xy5fz.png", "meat_stalagmite_right": "https://i.imgur.com/JsZZYIF.png",
             "pink_jellies": "https://i.imgur.com/MaBKpxS.png", "blue_jellies": "https://i.imgur.com/I37WOzN.png", "whales": "https://i.imgur.com/AqEPGpx.png",
             "frog_green": "https://i.imgur.com/0X7RqRg.png", "frog_brown": "https://i.imgur.com/F93ic5D.png", "tree_frog": "https://i.imgur.com/Zt0jeT9.png",
             "pride_flag": "https://i.imgur.com/DtqGXQD.png", "blue_heron": "https://i.imgur.com/rVcZX7c.png", "great_egret": "https://i.imgur.com/b0eN5mb.png",
             "glossy_ibis": "https://i.imgur.com/1oSfgPo.png", "scarlet_ibis": "https://i.imgur.com/R1a5AIJ.png", "white_ibis": "https://i.imgur.com/6MPgjBa.png",
             "spoonbill": "https://i.imgur.com/Rtj4qvX.png"};
// Doing it this way lets us preserve the numbering to know which plant is which.
// But it's also key to how the seeds work!
common_foliage = [0, 1, 5, 8, 14, 19, 26, 28, 38, 41, 45, 48, 55, 57, 59, 61, 62, 64, 68, 69, 71, 73, 74, 75, 76, 78, 80, 81, 82, 84, 88, 91, 92, 97, 98, 99, 101, 102, 107, 111, 116, 122, 129, 137, 139, 140, 141, 144, 145];

uncommon_foliage = common_foliage.concat([2, 3, 4, 7, 9, 10, 11, 12, 13, 15, 18, 20, 21, 24, 25, 29, 31, 35, 36, 42, 43,
                                          46, 47, 50, 51, 52, 54, 60, 63, 66, 67, 72, 77, 79, 83, 85, 86, 90, 93, 94, 95, 103, 105, 106, 108,
                                          114, 117, 118, 119, 120, 121, 123, 124, 126, 132, 138, 142, 146, 148, 150]);
rare_foliage = uncommon_foliage.concat([6, 16, 17, 22, 23, 27, 30, 32, 33, 34, 37, 39, 40, 44, 49, 53, 56, 58, 65, 70, 87, 89, 109, 113, 115,
                                        125, 127, 128, 130, 131, 133, 136, 147, 151]);
// The ENTIRE special_foliage group has a rare chance to be selected instead of a standard base, then one's chosen from within at random.
// I need to figure out math such that any given special base has ~20% of the chance of being chosen vs. any other seed
// chance of any seed: 1/#total_bases
// target chance: 1/#total_bases * 0.2
// chance of a given special: 1/#specials * x, where x is the chance of the special pool being selected instead of a standard base
// formula: x = 1/#total_bases * 0.2 * #specials
special_foliage = [96, 100, 104, 110, 112, 134, 135, 143, 149];
const special_foliage_chance = 1/all_foliage.length * 0.2 * special_foliage.length


boosted_rare_foliage = rare_foliage.slice(common_foliage.length);

override_foliage = [];

temp_boost_foliage = [145, 146, 147, 148, 149, 150, 151];


all_features = ["https://i.imgur.com/G4h84Ht.png", "https://i.imgur.com/vXQYMkL.png", "https://i.imgur.com/p1ipMdS.png", "https://i.imgur.com/UUFJO7h.png", "https://i.imgur.com/IyaeNvt.png", "https://i.imgur.com/NXRWexZ.png", "https://i.imgur.com/VwMnyDB.png", "https://i.imgur.com/mLfzmM8.png", "https://i.imgur.com/zcXm5Op.png", "https://i.imgur.com/Osvq1V0.png", "https://i.imgur.com/iPK9aJ7.png", "https://i.imgur.com/3SpYgDN.png", "https://i.imgur.com/6MRuqb7.png", "https://i.imgur.com/jrYQjIW.png"]
var simple_features = [0, 1];
var complex_features = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

var all_palettes = [["aed740", "76c935", "50aa37", "2f902b"], ["a2ac4d", "8f974a", "66732a", "4b692f"],
                    ["7ad8b7", "5eb995", "3e946d", "277b50"], ["9dbb86", "679465", "476f58", "2f4d47"],
                    ["8fbe99", "58906f", "3f7252", "215a3f"], ["fdff07", "b9d50f", "669914", "34670b"],
                    ["b0f7a9", "7dcc75", "63aa5a", "448d3c"], ["c5af7a", "a6905c", "806d40", "69582e"],
                    ["6ee964", "54c44b", "3da136", "228036"], ["e7d7c1", "a78a7f", "735751", "603f3d"],
                    ["9c6695", "734978", "4c2d5c", "2f1847"], ["f8cd1e", "d3a740", "b2773a", "934634"],
                    ["e4eaf3", "c0cfe7", "9ab3db", "7389ad"], ["b98838", "8c6526", "674426", "54401f"],
                    ["8f8090", "655666", "453946", "2a212b"], ["f5dbd7", "eec3c3", "d396a8", "c9829d"],
                    ["cdd1ff", "9fc0ff", "709ade", "4b5e95"], ["f6e9a4", "e8b78e", "d5737d", "c45088"],
                    ["e88c50", "d0653e", "af3629", "9b1f1f"], ["fef4cc", "fde47b", "ffd430", "ecb600"],
                    // next row is zero-indexed 20, 21
                    ["f3addd", "d87fbc", "c059a0", "aa3384"], ["3ac140", "1b9832", "116d22", "085c17"],
                    ["eaf4bd", "aade87", "6cc750", "1aaa09"], ["b77e4e", "88572e", "674426", "543a24"],
                    ["b7ed6c", "83d764", "47be5c", "0ca553"], ["f3eacf", "e4d4be", "ccb4a4", "b69389"],
                    ["edc55c", "d99b61", "bf7464", "a6636c"], ["8bfdd6", "55dbc3", "25b8b5", "0b8c9d"],
                    ["f5e2af", "f3c13d", "cba134", "a7832d"], ["a66547", "6e3837", "542c37", "45283a"],
                    ["cedd80", "95c27d", "52a279", "057d77"], ["fff9cf", "f4d6bc", "eaaba8", "dc91b8"],
                    ["b77e4e", "88572e", "674426", "543a24"], ["c5af7a", "a6905c", "806d40", "69582e"],
                    ["a6705a", "8b4e35", "6c2e1c", "571d0e"], ["fa9292", "f55757", "e32b2b", "ca0e18"],
                    ["93aaff", "5778f5", "3a5ad2", "233fa8"], ["ffcf80", "ffb63e", "ff9300", "da7500"],
                    ["f5fff4", "dbf5d9", "bee1bb", "9fc99c"], ["cd41d9", "b309c0", "860d9e", "61067b"],
                    ["8cf5f8", "30e8ed", "18c9d4", "0798a6"], ["b5c085", "7b9b64", "47774a", "305540"],
                    ["9bcf4b", "719e34", "45681a", "274409"], ["4fb81d", "339324", "1d7628", "075a2d"],
                    ["6e7706", "465f14", "234d21", "033a34"], ["78a562", "4e875a", "2a6e53", "0c584d"],
                    ["077773", "135260", "21294d", "2e033a"], ["e0ea8a", "bdbb5c", "b0983a", "a5791b"],
                    ["fcf050", "dca02a", "c46212", "ae2c00"], ["adef94", "71d86b", "2fc45a", "0aab68"],
                    // next row is zero-indexed 50, 51
                    ["f6cfec", "eca9ee", "cd86e6", "ab6ce0"], ["ffd2c6", "ffb39c", "ff8e69", "f87e4a"],
                    ["684e39", "513522", "391e10", "1f0c03"], ["fce382", "ebab8a", "dc5890", "b027a1"],
                    ["71f4a3", "68dbba", "4cb1c4", "3c7fb2"], ["c5e9fc", "b5c1fa", "a494f8", "9163f5"],
                    ["f83234", "c92637", "841732", "560e27"], ["fbeba5", "c6b05f", "929564", "527259"],
                    ["fff7cf", "ece2b1", "ddcea1", "ccb78e"], ["fb8dc2", "d75dd0", "a44abf", "7c3fae"], // "e0dfff", "a9a7bf", "7b798a", "4d4c54"
                    ["e1e0ff", "aaa8c1", "7c7a8f", "4c4b53"], ["a6a190", "938a7d", "74685a", "5a5144"], //["ba85df", "7f5bae", "5f4690", "433373"]];
                    ["2e7747", "175143", "143841", "12253e"], ["7dc9d2", "4e85b1", "325689", "312f70"],
                    ["405251", "2b393a", "1e252a", "14151e"], ["666fa9", "424071", "2c1f4c", "240539"],
                    ["cc3a77", "942162", "5d1354", "2f0e4d"], ["59a89f", "325354", "2b262e", "2e0d19"],
                    ["899571", "545a4a", "40463a", "2d302e"], ["99ad57", "54623c", "37422c", "151d1d"],
                    // 70, 71
                    ["c25a4a", "8f2e21", "711612", "4d0606"], ["9c0900", "6a0b00", "3e0600", "180200"],
                    ["ddd784", "c1c656", "99ae39", "769926"], ["b1ed11", "46d01b", "18b069", "168b98"],
                    ["ccc65d", "99902f", "7f771d", "605a16"], ["8e8e4f", "6d703e", "4d542b", "3b4429"],
                    ["b9d163", "b7a949", "9b6d3b", "7c352c"], ["e3c510", "bc8c0e", "864a0b", "541f08"],
                    ["452a31", "3b1817", "29100e", "1a0a06"], ["ba7b59", "a05d39", "7f4323", "66371c"],
                    ["bc8060", "8c6047", "76523c", "644030"], ["b4a58a", "8e795e", "674d36", "432a1c"],
                    ["e2cda7", "d5835d", "bd4b34", "692b26"], ["578759", "316140", "21372a", "101e11"],
                    ["82d083", "53ab6b", "277e5a", "0d534b"], ["82d083", "81b964", "318945", "105949"],
                    ["ab5b11", "8f4711", "5d2611", "481b13"], ["d8c6f2", "a08dcb", "7466b0", "352e63"],
                    ["759e94", "77725b", "785634", "7a4017"], ["b4f6eb", "76c6cd", "3a7b9c", "1f4f7f"],
                    // 90
                    ["d0c26d", "aaaa6a", "738a66", "446c62"], ["b8efe6", "83a3ce", "6b60b3", "6e3789"],
                    ["c498a3", "9f7688", "6e446c", "472147"], ["d17936", "b35d33", "7b2806", "421c16"],
                    ["ecffdd", "aed0c0", "718c93", "444e63"], ["9c4547", "7f3d4a", "51314d", "3b2b4f"],
                    ["efeccc", "d1cba6", "978d72", "6c6a6e"]];

                    var all_palettes = [{ "palette": ['aed740', '76c935', '50aa37', '2f902b'], "categories": [] },
                    { "palette": ['a2ac4d', '8f974a', '66732a', '4b692f'], "categories": [] },
                    { "palette": ['7ad8b7', '5eb995', '3e946d', '277b50'], "categories": [] },
                    { "palette": ['9dbb86', '679465', '476f58', '2f4d47'], "categories": [] },
                    { "palette": ['8fbe99', '58906f', '3f7252', '215a3f'], "categories": [] },
                    { "palette": ['fdff07', 'b9d50f', '669914', '34670b'], "categories": [] },
                    { "palette": ['b0f7a9', '7dcc75', '63aa5a', '448d3c'], "categories": [] },
                    { "palette": ['c5af7a', 'a6905c', '806d40', '69582e'], "categories": [] },
                    { "palette": ['6ee964', '54c44b', '3da136', '228036'], "categories": [] },
                    { "palette": ['e7d7c1', 'a78a7f', '735751', '603f3d'], "categories": [] },
                    { "palette": ['9c6695', '734978', '4c2d5c', '2f1847'], "categories": [] },
                    { "palette": ['f8cd1e', 'd3a740', 'b2773a', '934634'], "categories": [] },
                    { "palette": ['e4eaf3', 'c0cfe7', '9ab3db', '7389ad'], "categories": [] },
                    { "palette": ['b98838', '8c6526', '674426', '54401f'], "categories": [] },
                    { "palette": ['8f8090', '655666', '453946', '2a212b'], "categories": [] },
                    { "palette": ['f5dbd7', 'eec3c3', 'd396a8', 'c9829d'], "categories": [] },
                    { "palette": ['cdd1ff', '9fc0ff', '709ade', '4b5e95'], "categories": [] },
                    { "palette": ['f6e9a4', 'e8b78e', 'd5737d', 'c45088'], "categories": [] },
                    { "palette": ['e88c50', 'd0653e', 'af3629', '9b1f1f'], "categories": [] },
                    { "palette": ['fef4cc', 'fde47b', 'ffd430', 'ecb600'], "categories": [] },
                    { "palette": ['f3addd', 'd87fbc', 'c059a0', 'aa3384'], "categories": [] },
                    { "palette": ['3ac140', '1b9832', '116d22', '085c17'], "categories": [] },
                    { "palette": ['eaf4bd', 'aade87', '6cc750', '1aaa09'], "categories": [] },
                    { "palette": ['b77e4e', '88572e', '674426', '543a24'], "categories": [] },
                    { "palette": ['b7ed6c', '83d764', '47be5c', '0ca553'], "categories": [] },
                    { "palette": ['f3eacf', 'e4d4be', 'ccb4a4', 'b69389'], "categories": [] },
                    { "palette": ['edc55c', 'd99b61', 'bf7464', 'a6636c'], "categories": [] },
                    { "palette": ['8bfdd6', '55dbc3', '25b8b5', '0b8c9d'], "categories": [] },
                    { "palette": ['f5e2af', 'f3c13d', 'cba134', 'a7832d'], "categories": [] },
                    { "palette": ['a66547', '6e3837', '542c37', '45283a'], "categories": [] },
                    { "palette": ['cedd80', '95c27d', '52a279', '057d77'], "categories": [] },
                    { "palette": ['fff9cf', 'f4d6bc', 'eaaba8', 'dc91b8'], "categories": [] },
                    { "palette": ['b77e4e', '88572e', '674426', '543a24'], "categories": [] },
                    { "palette": ['c5af7a', 'a6905c', '806d40', '69582e'], "categories": [] },
                    { "palette": ['a6705a', '8b4e35', '6c2e1c', '571d0e'], "categories": [] },
                    { "palette": ['fa9292', 'f55757', 'e32b2b', 'ca0e18'], "categories": [] },
                    { "palette": ['93aaff', '5778f5', '3a5ad2', '233fa8'], "categories": [] },
                    { "palette": ['ffcf80', 'ffb63e', 'ff9300', 'da7500'], "categories": [] },
                    { "palette": ['f5fff4', 'dbf5d9', 'bee1bb', '9fc99c'], "categories": [] },
                    { "palette": ['cd41d9', 'b309c0', '860d9e', '61067b'], "categories": [] },
                    { "palette": ['8cf5f8', '30e8ed', '18c9d4', '0798a6'], "categories": [] },
                    { "palette": ['b5c085', '7b9b64', '47774a', '305540'], "categories": [] },
                    { "palette": ['9bcf4b', '719e34', '45681a', '274409'], "categories": [] },
                    { "palette": ['4fb81d', '339324', '1d7628', '075a2d'], "categories": [] },
                    { "palette": ['6e7706', '465f14', '234d21', '033a34'], "categories": [] },
                    { "palette": ['78a562', '4e875a', '2a6e53', '0c584d'], "categories": [] },
                    { "palette": ['077773', '135260', '21294d', '2e033a'], "categories": [] },
                    { "palette": ['e0ea8a', 'bdbb5c', 'b0983a', 'a5791b'], "categories": [] },
                    { "palette": ['fcf050', 'dca02a', 'c46212', 'ae2c00'], "categories": [] },
                    { "palette": ['adef94', '71d86b', '2fc45a', '0aab68'], "categories": [] },
                    { "palette": ['f6cfec', 'eca9ee', 'cd86e6', 'ab6ce0'], "categories": [] },
                    { "palette": ['ffd2c6', 'ffb39c', 'ff8e69', 'f87e4a'], "categories": [] },
                    { "palette": ['684e39', '513522', '391e10', '1f0c03'], "categories": [] },
                    { "palette": ['fce382', 'ebab8a', 'dc5890', 'b027a1'], "categories": [] },
                    { "palette": ['71f4a3', '68dbba', '4cb1c4', '3c7fb2'], "categories": [] },
                    { "palette": ['c5e9fc', 'b5c1fa', 'a494f8', '9163f5'], "categories": [] },
                    { "palette": ['f83234', 'c92637', '841732', '560e27'], "categories": [] },
                    { "palette": ['fbeba5', 'c6b05f', '929564', '527259'], "categories": [] },
                    { "palette": ['fff7cf', 'ece2b1', 'ddcea1', 'ccb78e'], "categories": [] },
                    { "palette": ['fb8dc2', 'd75dd0', 'a44abf', '7c3fae'], "categories": [] },
                    { "palette": ['e1e0ff', 'aaa8c1', '7c7a8f', '4c4b53'], "categories": [] },
                    { "palette": ['a6a190', '938a7d', '74685a', '5a5144'], "categories": [] },
                    { "palette": ['2e7747', '175143', '143841', '12253e'], "categories": [] },
                    { "palette": ['7dc9d2', '4e85b1', '325689', '312f70'], "categories": [] },
                    { "palette": ['405251', '2b393a', '1e252a', '14151e'], "categories": [] },
                    { "palette": ['666fa9', '424071', '2c1f4c', '240539'], "categories": [] },
                    { "palette": ['cc3a77', '942162', '5d1354', '2f0e4d'], "categories": [] },
                    { "palette": ['59a89f', '325354', '2b262e', '2e0d19'], "categories": [] },
                    { "palette": ['899571', '545a4a', '40463a', '2d302e'], "categories": [] },
                    { "palette": ['99ad57', '54623c', '37422c', '151d1d'], "categories": [] },
                    { "palette": ['c25a4a', '8f2e21', '711612', '4d0606'], "categories": [] },
                    { "palette": ['9c0900', '6a0b00', '3e0600', '180200'], "categories": [] },
                    { "palette": ['ddd784', 'c1c656', '99ae39', '769926'], "categories": [] },
                    { "palette": ['b1ed11', '46d01b', '18b069', '168b98'], "categories": [] },
                    { "palette": ['ccc65d', '99902f', '7f771d', '605a16'], "categories": [] },
                    { "palette": ['8e8e4f', '6d703e', '4d542b', '3b4429'], "categories": [] },
                    { "palette": ['b9d163', 'b7a949', '9b6d3b', '7c352c'], "categories": [] },
                    { "palette": ['e3c510', 'bc8c0e', '864a0b', '541f08'], "categories": [] },
                    { "palette": ['452a31', '3b1817', '29100e', '1a0a06'], "categories": [] },
                    { "palette": ['ba7b59', 'a05d39', '7f4323', '66371c'], "categories": [] },
                    { "palette": ['bc8060', '8c6047', '76523c', '644030'], "categories": [] },
                    { "palette": ['b4a58a', '8e795e', '674d36', '432a1c'], "categories": [] },
                    { "palette": ['e2cda7', 'd5835d', 'bd4b34', '692b26'], "categories": [] },
                    { "palette": ['578759', '316140', '21372a', '101e11'], "categories": [] },
                    { "palette": ['82d083', '53ab6b', '277e5a', '0d534b'], "categories": [] },
                    { "palette": ['82d083', '81b964', '318945', '105949'], "categories": [] },
                    { "palette": ['ab5b11', '8f4711', '5d2611', '481b13'], "categories": [] },
                    { "palette": ['d8c6f2', 'a08dcb', '7466b0', '352e63'], "categories": [] },
                    { "palette": ['759e94', '77725b', '785634', '7a4017'], "categories": [] },
                    { "palette": ['b4f6eb', '76c6cd', '3a7b9c', '1f4f7f'], "categories": [] },
                    { "palette": ['d0c26d', 'aaaa6a', '738a66', '446c62'], "categories": [] },
                    { "palette": ['b8efe6', '83a3ce', '6b60b3', '6e3789'], "categories": [] },
                    { "palette": ['c498a3', '9f7688', '6e446c', '472147'], "categories": [] },
                    { "palette": ['d17936', 'b35d33', '7b2806', '421c16'], "categories": [] },
                    { "palette": ['ecffdd', 'aed0c0', '718c93', '444e63'], "categories": [] },
                    { "palette": ['9c4547', '7f3d4a', '51314d', '3b2b4f'], "categories": [] },
                    { "palette": ['efeccc', 'd1cba6', '978d72', '6c6a6e'], "categories": [] },
                    { "palette": ['479ec2', '3b76aa', '1e3663', '1a0945'], "categories": [] },
                    { "palette": ['f8a818', 'fe5f14', 'c91831', '730c4e'], "categories": [] },
                    { "palette": ['eca3b2', 'b65d86', '72205f', '440843'], "categories": [] },
                    { "palette": ['f0d9ee', 'e0c0e4', 'bd9ad5', '9379bd'], "categories": [] },
                    { "palette": ['d798f3', 'da6ace', 'ca3b97', 'a22152'], "categories": [] },
                    { "palette": ['d4f1d7', 'c4e47b', 'e9db5d', 'ef924b'], "categories": [] },
                    { "palette": ['ffe0b5', 'eea383', 'db5754', 'ca2e55'], "categories": [] },
                    { "palette": ['f6f6f6', 'cccccc', 'aaaaaa', '888888'], "categories": ["strange"]},
                    { "palette": ['444e63', '718c93', 'aed0c0', 'ecffdd'], "categories": ["strange"]},
                    { "palette": ['c6f4da', '9fe1bf', '77cda6', '55b79a'], "categories": ["pastel"]},
                    //{"palette": ['1f113e', '1b0e36', '120928', '01020d'], "categories": ["dark", "celestial"]},
                    //{"palette": ['ddd1ff', 'ccb5ff', 'c68ef6', 'bd6bf1'], "categories": ["pastel"]},
                    //{"palette": ['339324', 'adef94', '46d01b', '21372a'], "categories": ["strange"]},
                    { "palette": ['c4a163', 'a05846', '7a2740', '50044d'], "categories": ["celestial"]}];

// There's three types of palette:
// Foliage: Generally the bulk of a plant. Greens and browns are most common
// Feature: Think of the secondary on a dragon. Structures like trunks, flower brachts, and stone
// Accent: Think of the tertiary. Has bonus loud, bright colors that would look garish in a patch. Tone used for most flowers

// Note that some common foliage colors are double-weighted because they're very nice greens :)
var common_foliage_palettes = [0, 1, 2, 3, 3, 4, 5, 6, 7, 8, 11, 18, 21, 21, 22, 23, 29, 30, 30, 41, 42, 43, 44, 45, 49, 56, 62, 65, 68, 69, 71, 72, 74, 75, 76, 77, 82, 83, 84, 85, 86];
common_foliage_palettes = common_foliage_palettes.concat(common_foliage_palettes);  // Cheap greenery boost
var common_accent_palettes = [19, 20, 35, 36, 37, 38, 39, 40];
//var common_feature_palettes = [1, 20, 29, 32, 33, 34, 52, 58, 61, 62, 64, 78, 79, 80, 81, 86, 92, 93, 94, 95];
common_feature_palettes = [1, 20, 29, 32, 33, 34, 52, 58, 61, 62, 64, 78, 79, 80, 81, 86, 92, 96];
var common_feature_palettes = common_feature_palettes.concat(common_feature_palettes);  // Cheap wood/stone boost
var uncommon_palettes = [2, 9, 10, 11, 12, 13, 14, 15, 18, 24, 25, 38, 46, 47, 50, 55, 57, 60, 63, 66, 67, 70, 71, 72, 76, 82, 87, 88, 89, 90, 94, 96];
var rare_palettes = [5, 16,  17, 26, 27, 28, 30, 31, 48, 51, 53, 54, 59, 64, 73, 91, 92, 95];

// Used for boosting rates when I'm generating lots of plants
//rare_palettes = rare_palettes.concat([31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31]);

var uncommon_foliage_palettes = common_foliage_palettes.concat(uncommon_palettes);
var rare_foliage_palettes = uncommon_foliage_palettes.concat(rare_palettes);

var uncommon_feature_palettes = common_feature_palettes.concat(uncommon_palettes);
var rare_feature_palettes = uncommon_feature_palettes.concat(rare_palettes);

var uncommon_accent_palettes = common_accent_palettes.concat(uncommon_palettes);
var rare_accent_palettes = uncommon_accent_palettes.concat(rare_palettes);

// Universal use, removes chance of getting common palettes
//var boosted_rare_palettes = uncommon_palettes.concat(rare_palettes);

// Used for replacing ALL colors...
//rare_foliage_palettes = [];
//rare_feature_palettes = [93, 94, 95, 96];
//rare_accent_palettes = [55];


async function place_image_at_coords_with_chance(img_url, list_of_coords, ctx, chance, anchor_to_bottom=false){
    // In canvas context ctx, place image at img_path "centered" at each (x,y) in list_of_coords with chance odds (ex 0.66 for 66%)
    img = await refs[img_url];
    var w_offset = Math.floor(img.width/2);
    if(!anchor_to_bottom){
      var h_offset = Math.floor(img.height/2)-1;
    } else {
      var h_offset = -img.height + 1;
    }
    for (var i=0;i<list_of_coords.length;i++) {
      if (Math.random() < chance){
        [x,y] = list_of_coords[i];
        ctx.drawImage(img, x-w_offset, y+h_offset);
      }
    }
}

async function preload_all_images()
// TODO: Gross prototype nonsense. Must be called ahead. Loads refs.
{
  lists_to_load = [all_foliage, all_features, Object.values(all_named)];
  for(var i=0; i<lists_to_load.length; i++){
      for(var j=0; j<lists_to_load[i].length;j++){
        refs[lists_to_load[i][j]] = preload_single_image(lists_to_load[i][j]);
      }
  }
}

// Sound of me not being 100% confident in my async usage yet
async function preload_single_image(url){
    return new Promise(resolve => {
            const img = new Image();
            img.src=url;
            img.crossOrigin = "anonymous"
            // Setting the .onload = resolve instead of using an eventListener resulted in an
            // Event getting returned. I don't have time to argue with Javascript tonight...
            img.addEventListener('load', () => {
                resolve(img);
            });
            img.onerror = function() { img.src = BAD_IMG_URL;};
        });
    // Not yet supported in common versions of Safari
    /*return fetch(url)
           .then(response => response.blob())
           .then(blob => createImageBitmap(blob));*/
}

// We have things like foliage, colors, and features that exist in "master lists"
// These "master lists" comprise of everything in that category, regardless of rarity
// There's then sub-lists that contain the indices from the master list in each rarity category
// This function picks a random entry from a master, limited to what's allowed by the sublist.
// However, we need the in-between step of indices into the master_list, so we do it less elegantly
// with random_from_list and parse_plant_data.
function old_random_by_rarity(rarity_list, master_list) {
    var ep = rarity_list[Math.floor(Math.random()*rarity_list.length)];
    return master_list[ep];
}

function random_from_list(list, prng=null) {
    if(prng==null){return list[Math.floor(Math.random()*list.length)]};
    return list[Math.floor(prng()*list.length)];
}

function random_from_foliage(list, prng=null) {
    let diceroll;
    if(prng==null){ diceroll = Math.random(); }
    else { diceroll = prng(); }

    return random_from_list(list, prng);
}


//Seeded prng. Taken from https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

// Seed generator. Taken from https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
function xmur3(str) {
    for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = h << 13 | h >>> 19;
    } return function() {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
}

function parse_plant_data(plant_data){
    return {"foliage": all_foliage[plant_data["foliage"]],
            "simple_feature": all_features[plant_data["simple_feature"]],
            "complex_feature": all_features[plant_data["complex_feature"]],
            "foliage_palette": all_palettes[plant_data["foliage_palette"]]["palette"],
            "feature_palette": all_palettes[plant_data["feature_palette"]]["palette"],
            "accent_palette": all_palettes[plant_data["accent_palette"]]["palette"]}
}


// Rarity level:
// 0: only common things available
// 1: adds uncommon foliage
// 2: adds complex features, use common ones instead at lower rarities
// 3: adds uncommon foliage colors
// 4: adds uncommon feature colors
// 5: adds rare foliage
// 6: adds rare foliage colors
// 7: add rare feature colors
// 8: guarantees uncommon or rare feature color
// 9: guarantees uncommon or rare foliage color
// 10: guarantees uncommon or rare foliage

// Rarity level rework thoughts (NYI):
// 0: only common things
// 1: uncommon feature/accent colors
// 2: uncommon foliage colors
// 3: adds uncommon foliage but resets colors to common
// 4: adds back uncommon feature/accent colors
// 5: adds uncommon and rare foliage colors
// 6: adds rare feature/accent colors
// 7: adds rare foliage but resets all colors to common
// 8: adds back uncommon and rare feature/accent colors
// 9: adds back uncommon/rare foliage colors
// 10: ups chance for uncommon/rare foliage colors

function gen_plant_data(rarity, seed_string=null) {
    var available_foliage = common_foliage;
    var available_complex_features = simple_features;  // Needed to disable/enable complex features
    var available_foliage_palettes = common_foliage_palettes;
    var available_feature_palettes = common_feature_palettes;
    var available_accent_palettes = common_accent_palettes;

    // A bit grody ngl
    /**if(rarity>=1){available_foliage = uncommon_foliage;}
    if(rarity>=2){available_complex_features = complex_features;}
    if(rarity>=3){available_foliage_palettes = uncommon_foliage_palettes;}
    if(rarity>=4){
        available_feature_palettes = uncommon_feature_palettes;
        available_accent_palettes = uncommon_accent_palettes;
    }
    if(rarity>=5){available_foliage = rare_foliage;}
    if(rarity>=6){available_foliage_palettes = rare_foliage_palettes;}
    if(rarity>=7){
        available_feature_palettes = rare_feature_palettes;
        available_accent_palettes = rare_accent_palettes;
    }
    if(rarity>=8){available_feature_palettes = boosted_rare_palettes;}
    if(rarity>=9){available_foliage_palettes = boosted_rare_palettes;}
    if(rarity>=10){available_foliage = boosted_rare_foliage;}
    // Special rarity
    if(rarity==99){available_foliage = special_foliage;}

    if(override_foliage.length > 0){available_foliage = override_foliage};**/

    var prng;
    if(seed_string == null){prng = null;}
    else{prng = mulberry32(xmur3(seed_string)());}

    return {"foliage": random_from_foliage(available_foliage, prng),
            "simple_feature": random_from_list(simple_features, prng),
            "complex_feature": random_from_list(available_complex_features, prng),
            "foliage_palette": random_from_list(available_foliage_palettes, prng),
            "feature_palette": random_from_list(available_feature_palettes, prng),
            "accent_palette": random_from_list(available_accent_palettes, prng)}
}

//seed format is 1<foliage><simple_feature><complex_feature>1<color><color><color><rngnum>
//random 1s are to avoid the encoding dropping the leading 0s
//foliage, feature, and the colors are all fixed-length 3 digits (ex: 100102310140060012147483647) for a max of 999 possibilities
//this number's way too big for Javascript without mantissa (Maxint is 9007199254740992 and we need highest precision and I don't know how Javascript does Things) so we break it like this:

// 1foliagesimplefeaturecomplexfeature-1colorcolorcolor-actualrandomnumberseed
// and then we put it in base64 for slightly-shorter-fixed-length purposes
function encode_plant_data(plant_data) {
    function to_padstr(entry){
        return String(plant_data[entry]).padStart(3, '0');
    }
    var part_one = parseInt("1"+to_padstr("foliage")+to_padstr("simple_feature")+to_padstr("complex_feature"));
    var part_two = parseInt("1"+to_padstr("foliage_palette")+to_padstr("feature_palette")+to_padstr("accent_palette"));
    return Base64.fromInt(part_one)+Base64.fromInt(part_two);
}

function encode_plant_data_v2(plant_data) {
    function to_padstr(entry){
        return String(plant_data[entry]).padStart(3, '0');
    }
    function to_lesser_padstr(entry){
        return String(plant_data[entry]).padStart(2, '0');
    }
    var part_one = parseInt("2"+to_padstr("foliage")+to_padstr("foliage_palette")+to_lesser_padstr("simple_feature"));
    var part_two = parseInt("2"+to_padstr("feature_palette")+to_padstr("accent_palette")+to_lesser_padstr("complex_feature"));
    return Base64.fromInt(part_one)+Base64.fromInt(part_two);
}


function decode_plant_data(plant_data) {
    // Conversion city baybeee
    // Might be able to do something clever with mods instead, but we'll check performance first
    var part_one = String(Base64.toInt(plant_data.slice(0,5)));
    var part_two = String(Base64.toInt(plant_data.slice(5)));
    // alert("Part one"+part_one+" Part two: "+part_two);
    if(parseInt(part_one.slice(0,1))==2){
    return {"foliage": parseInt(part_one.slice(1,4)),
            "foliage_palette": parseInt(part_one.slice(4,7)),
            "simple_feature": parseInt(part_one.slice(7,9)),
            "feature_palette": parseInt(part_two.slice(1,4)),
            "accent_palette": parseInt(part_two.slice(4,7)),
            "complex_feature": parseInt(part_two.slice(7,9))
           }
    } else {
     return {"foliage": parseInt(part_one.slice(1,4)),
            "simple_feature": parseInt(part_one.slice(4,7)),
            "complex_feature": parseInt(part_one.slice(7,10)),
            "foliage_palette": parseInt(part_two.slice(1,4)),
            "feature_palette": parseInt(part_two.slice(4,7)),
            "accent_palette": parseInt(part_two.slice(7,10))}
    }
}

// Stolen from https://stackoverflow.com/questions/6213227/fastest-way-to-convert-a-number-to-radix-64-in-javascript
Base64 = (function () {
    var digitsStr =
    //   0       8       16      24      32      40      48      56     63
    //   v       v       v       v       v       v       v       v      v
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+-";
    var digits = digitsStr.split('');
    var digitsMap = {};
    for (var i = 0; i < digits.length; i++) {
        digitsMap[digits[i]] = i;
    }
    return {
        fromInt: function(int32) {
            var result = '';
            while (true) {
                result = digits[int32 & 0x3f] + result;
                int32 >>>= 6;
                if (int32 === 0)
                    break;
            }
            return result;
        },
        toInt: function(digitsStr) {
            var result = 0;
            var digits = digitsStr.split('');
            for (var i = 0; i < digits.length; i++) {
                result = (result << 6) + digitsMap[digits[i]];
            }
            return result;
        }
    };
})();

async function gen_plant(plant_data) {
    // Returns the image data for a generated plant
    var work_canvas = document.createElement("canvas");
    var work_ctx=work_canvas.getContext("2d");
    plant_data = parse_plant_data(plant_data);
    work_canvas.width = work_canvas_size;
    work_canvas.height = work_canvas_size;
    await place_image_at_coords_with_chance(plant_data["foliage"], [[Math.floor(work_canvas_size/2)-1, work_canvas_size-1]], work_ctx, 1, true);

    // Figure out where to put each kind of feature, replacing marker pixels as we go
    let simple_feature_coords = get_marker_coords(place_simple_feature, work_ctx);
    let complex_feature_coords = get_marker_coords(place_complex_feature, work_ctx);

    // Place the features
    if(simple_feature_coords.length > 0){
        var place_simple = await place_image_at_coords_with_chance(plant_data["simple_feature"], simple_feature_coords, work_ctx, 0.5);
    }
    if(complex_feature_coords.length > 0){
        /* Chance that if there's already simple flowers, we keep using that flower
        if(simple_flower_coords.length == 0 || Math.random()>0.5){
            flower_url = complex_flowers[Math.floor(Math.random()*complex_flowers.length)];
        } else {*/
        var place_complex = await place_image_at_coords_with_chance(plant_data["complex_feature"], complex_feature_coords, work_ctx, 0.8, true);
    }

    // We do all the recolors at once because Speed?(TM)?
    var new_overall_palette = plant_data["foliage_palette"].concat(plant_data["accent_palette"]).concat(plant_data["feature_palette"]);
    replace_color_palette(overall_palette, new_overall_palette, work_ctx);

    // We can draw a canvas directly on another canvas
    return work_canvas;
}

function hexToRgb(hex) {
  // taken from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}


function replace_color(old_rgb, new_rgb, ctx, width=work_canvas_size, height=work_canvas_size) {
    // `old_rgb` and `new_rgb`: (r, g, b)
    // taken from https://stackoverflow.com/questions/16228048/replace-a-specific-color-by-another-in-an-image-sprite
    var imageData = ctx.getImageData(0, 0, width, height);
    var oldRed, oldGreen, oldBlue;
    var newRed, newGreen, newBlue;
    [oldRed, oldGreen, oldBlue] = old_rgb;
    [newRed, newGreen, newBlue] = new_rgb;
    for (var i=0;i<imageData.data.length;i+=4)
      {
          // is this pixel the old rgb?
          if(imageData.data[i]==oldRed &&
             imageData.data[i+1]==oldGreen &&
             imageData.data[i+2]==oldBlue
          ){
              // change to your new rgb
              imageData.data[i]=newRed;
              imageData.data[i+1]=newGreen;
              imageData.data[i+2]=newBlue;
          }
      }
    // put the data back on the canvas
    ctx.putImageData(imageData,0,0);
}


// Basically just wraps replace_color_palette
function replace_color_palette_single_image(old_palette, new_palette, img){
    var work_canvas = document.createElement("canvas");
    var work_ctx=work_canvas.getContext("2d");
    work_canvas.width = img.width;
    work_canvas.height = img.height;
    work_ctx.drawImage(img, 0, 0);
    replace_color_palette(old_palette, new_palette, work_ctx, img.width, img.height);
    return work_canvas;
}

// Palettes MUST be the same length, FYI
function replace_color_palette(old_palette, new_palette, ctx, work_canvas_width=work_canvas_size, work_canvas_height=work_canvas_size) {
    var oldRGB, newRGB;
    // We do some truly hideous hacks because I'm bad at Javascript :)
    // Basically, we use the r, g, and b as a 3-level key into an object
    // If we follow it to the bottom and something exists, it's something we replace
    var paletteSwap = {};
    for(var i=0; i<old_palette.length; i++){
        oldRGB = hexToRgb(old_palette[i]);
        // (cries in defaultdict)
        // but seriously there might be a better way. As is, this stuff's prolly power word kill for JS devs...
        if(paletteSwap[oldRGB[0]] == undefined){paletteSwap[oldRGB[0]] = {};}
        if(paletteSwap[oldRGB[0]][oldRGB[1]] == undefined){paletteSwap[oldRGB[0]][oldRGB[1]] = {};}
        paletteSwap[oldRGB[0]][oldRGB[1]][oldRGB[2]] = hexToRgb(new_palette[i]);
    }
    // taken from https://stackoverflow.com/questions/16228048/replace-a-specific-color-by-another-in-an-image-sprite
    var imageData;
    imageData = ctx.getImageData(0, 0, work_canvas_width, work_canvas_height);
    for (var i=0;i<imageData.data.length;i+=4)
      {
          // god this is painful to look at. I'm sorry.
          if(paletteSwap[imageData.data[i]] != undefined &&
             paletteSwap[imageData.data[i]][imageData.data[i+1]] != undefined &&
             paletteSwap[imageData.data[i]][imageData.data[i+1]][imageData.data[i+2]] != undefined){
              newRGB = paletteSwap[imageData.data[i]][imageData.data[i+1]][imageData.data[i+2]];
              imageData.data[i]=newRGB[0];
              imageData.data[i+1]=newRGB[1];
              imageData.data[i+2]=newRGB[2];
          }
      }
    // put the data back on the canvas
    ctx.putImageData(imageData,0,0);
}

function get_marker_coords(marker_hex, ctx) {
    // Go through an image and find where to place features. Very similar to replace_color().
    // NOTE: replaces marker pixels with base_foliage ones! This is because we don't always
    // place features and don't want a pixel escaping.
    var ret_coords = [];
    var imageData = ctx.getImageData(0, 0, work_canvas_size, work_canvas_size);
    [oldRed, oldGreen, oldBlue] = hexToRgb(marker_hex);
    [newRed, newGreen, newBlue] = hexToRgb(base_foliage_palette[1]);
    var pixel = 0;
    for (var i=0;i<imageData.data.length;i+=4)
      {
          // is this pixel the old rgb?
          if(imageData.data[i]==oldRed &&
             imageData.data[i+1]==oldGreen &&
             imageData.data[i+2]==oldBlue
          ){
              // change to your new rgb
              imageData.data[i]=newRed;
              imageData.data[i+1]=newGreen;
              imageData.data[i+2]=newBlue;
              // Ready to get a little cursed? Because there's probably a better way to do this, but it's a dumb project so...
              pixel = i/4;
              ret_coords.push([pixel%work_canvas_size, Math.floor(pixel/work_canvas_size)]);
          }
      }
    ctx.putImageData(imageData,0,0);
    return ret_coords
  }

// Same shuffle as bingo.js. TODO: I should add a baselib
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
